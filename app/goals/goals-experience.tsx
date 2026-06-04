"use client";

import {
  ArrowRight,
  Bot,
  Plus,
  Sparkles,
  Target,
  Trash2,
} from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";
import { AppShell, EmptyState, GlassCard, LoadingState } from "@/src/components/satomi";
import { FinanceField, FinanceSelect, FinanceTextArea } from "@/src/components/satomi/forms/finance-fields";
import { Button } from "@/src/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/src/components/ui/dialog";
import {
  buildGoalActivities,
  buildGoalFundingSources,
  buildGoalMilestones,
  formatFullDate,
  goalTypeOptions,
  mapGoalRowToRecord,
  strategyChips,
  type GoalRecord,
  type GoalStatus,
  type GoalTone,
} from "@/src/lib/satomi-goals-bills";
import {
  createGoal,
  deleteGoal,
  updateGoal,
  type GoalInput,
  type GoalRow,
} from "@/src/lib/supabase/finance";
import { createSupabaseBrowserClient } from "@/src/lib/supabase/client";
import { useFinanceSnapshot } from "@/src/lib/supabase/use-finance-snapshot";
import { cn } from "@/src/lib/utils";

const toneText: Record<GoalTone, string> = {
  cyan: "text-satomi-cyan",
  purple: "text-satomi-purple-soft",
  green: "text-satomi-green",
  amber: "text-satomi-amber",
  error: "text-satomi-error",
};

const toneBg: Record<GoalTone, string> = {
  cyan: "bg-satomi-cyan",
  purple: "bg-satomi-purple-soft",
  green: "bg-satomi-green",
  amber: "bg-satomi-amber",
  error: "bg-satomi-error",
};

const statusClass: Record<GoalStatus, string> = {
  "Goal Utama": "border-satomi-cyan/35 bg-satomi-cyan/12 text-satomi-cyan",
  Aktif: "border-satomi-green/30 bg-satomi-green/12 text-satomi-green",
  "Butuh Fokus": "border-satomi-amber/35 bg-satomi-amber/12 text-satomi-amber",
};

const EMPTY_GOALS: GoalRow[] = [];

export function GoalsExperience() {
  const { snapshot, isLoading, error, refresh } = useFinanceSnapshot();
  const [selectedGoal, setSelectedGoal] = useState<GoalRow | null>(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isMutating, setIsMutating] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [statusTone, setStatusTone] = useState<"success" | "error">("success");

  const supabase = useMemo(() => createSupabaseBrowserClient(), []);
  const goals = snapshot?.goals ?? EMPTY_GOALS;
  const goalRecords = useMemo(
    () => goals.map((goal) => mapGoalRowToRecord(goals, goal)),
    [goals],
  );
  const mainGoal = goalRecords[0] ?? null;

  async function handleCreate(input: GoalInput) {
    setIsMutating(true);
    setStatusMessage(null);

    try {
      await createGoal(supabase, input);
      await refresh();
      setStatusTone("success");
      setStatusMessage("Goal baru berhasil dibuat.");
      setIsCreateOpen(false);
    } catch (error) {
      setStatusTone("error");
      setStatusMessage(error instanceof Error ? error.message : "Goal belum berhasil dibuat.");
    } finally {
      setIsMutating(false);
    }
  }

  async function handleUpdate(input: GoalInput) {
    if (!selectedGoal) return;

    setIsMutating(true);
    setStatusMessage(null);

    try {
      await updateGoal(supabase, selectedGoal.id, input);
      await refresh();
      setStatusTone("success");
      setStatusMessage("Perubahan goal berhasil disimpan.");
      setSelectedGoal(null);
    } catch (error) {
      setStatusTone("error");
      setStatusMessage(
        error instanceof Error ? error.message : "Perubahan goal belum berhasil disimpan.",
      );
    } finally {
      setIsMutating(false);
    }
  }

  async function handleDelete() {
    if (!selectedGoal) return;

    setIsMutating(true);
    setStatusMessage(null);

    try {
      await deleteGoal(supabase, selectedGoal.id);
      await refresh();
      setStatusTone("success");
      setStatusMessage("Goal berhasil dihapus.");
      setSelectedGoal(null);
    } catch (error) {
      setStatusTone("error");
      setStatusMessage(error instanceof Error ? error.message : "Goal belum berhasil dihapus.");
    } finally {
      setIsMutating(false);
    }
  }

  const recommendationText = mainGoal
    ? `Satomi melihat ${mainGoal.name} layak jadi fokus utama. Jaga ritme ${mainGoal.requiredSaving.toLowerCase()} dan arahkan surplus saat ada pemasukan tambahan.`
    : "Tambahkan goal pertama agar Satomi bisa menyusun strategi finansial yang terasa personal.";

  return (
    <AppShell activePath="/goals">
      <section className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
        <div>
          <div className="mb-3 flex items-center gap-2 text-satomi-cyan">
            <Target className="size-5" />
            <span className="font-mono text-xs font-semibold uppercase tracking-[0.24em]">
              Perencana Tujuan
            </span>
          </div>
          <h1 className="font-display text-[38px] font-extrabold leading-tight tracking-normal text-satomi-text md:text-6xl">
            Tujuan Finansial
          </h1>
          <p className="mt-3 max-w-2xl text-lg leading-8 text-satomi-muted">
            Susun target, strategi, dan ritme nabung yang realistis bersama Satomi.
          </p>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <Button size="lg" onClick={() => setIsCreateOpen(true)}>
            <Plus className="size-5" />
            Tambah Goal
          </Button>
          <Button size="lg" variant="secondary">
            <Sparkles className="size-5" />
            Minta Strategi Satomi
          </Button>
        </div>
      </section>

      {statusMessage ? <StatusBanner tone={statusTone}>{statusMessage}</StatusBanner> : null}

      {isLoading ? (
        <LoadingState
          variant="skeleton"
          title="Satomi sedang memuat goal..."
          description="Menyiapkan target finansial dari Supabase."
        />
      ) : error ? (
        <DataStatePanel
          title="Goal belum bisa dimuat"
          description={error}
          primaryLabel="Coba Lagi"
          onPrimary={refresh}
        />
      ) : (
        <>
          <section className="grid gap-5 xl:grid-cols-[1.05fr_0.95fr]">
            {mainGoal ? <MainGoalCard goal={mainGoal} /> : <MainGoalEmpty onCreate={() => setIsCreateOpen(true)} />}
            <SatomiRecommendationPanel recommendationText={recommendationText} />
          </section>

          <GlassCard className="p-4 md:p-5">
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <p className="font-mono text-xs font-semibold uppercase tracking-[0.24em] text-satomi-muted">
                Strategi Pilihan
              </p>
              <div className="flex flex-wrap gap-2">
                {strategyChips.map((strategy) => (
                  <StrategyChip key={strategy} label={strategy} />
                ))}
              </div>
            </div>
          </GlassCard>

          {goalRecords.length === 0 ? (
            <EmptyState
              title="Belum ada goal"
              description="Tambahkan goal pertama agar Satomi bisa menyusun strategi finansial yang personal."
              primaryAction={{ label: "Tambah Goal", href: "/goals" }}
            />
          ) : (
            <section>
              <h2 className="mb-4 font-mono text-xs font-semibold uppercase tracking-[0.24em] text-satomi-muted">
                Goal Aktif
              </h2>
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                {goalRecords.map((goal) => {
                  const source = goals.find((item) => item.id === goal.id) ?? null;
                  return (
                    <GoalCard
                      key={goal.id}
                      goal={goal}
                      onQuickEdit={source ? () => setSelectedGoal(source) : undefined}
                    />
                  );
                })}
              </div>
            </section>
          )}
        </>
      )}

      <GoalEditorDialog
        key={`create-goal-${isCreateOpen ? "open" : "closed"}`}
        isOpen={isCreateOpen}
        mode="create"
        goal={null}
        isBusy={isMutating}
        onOpenChange={setIsCreateOpen}
        onSubmit={handleCreate}
      />
      <GoalEditorDialog
        key={selectedGoal?.id ?? "edit-goal"}
        isOpen={Boolean(selectedGoal)}
        mode="edit"
        goal={selectedGoal}
        isBusy={isMutating}
        onOpenChange={(open) => {
          if (!open) setSelectedGoal(null);
        }}
        onSubmit={handleUpdate}
        onDelete={handleDelete}
      />
    </AppShell>
  );
}

function MainGoalCard({ goal }: { goal: GoalRecord }) {
  return (
    <GlassCard variant="featured" className="p-6 md:p-8">
      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <StatusChip status={goal.status} />
          <h2 className="mt-4 font-display text-4xl font-extrabold tracking-normal text-satomi-text md:text-5xl">
            {goal.name}
          </h2>
          <p className="mt-3 max-w-xl leading-7 text-satomi-muted">{goal.description}</p>
        </div>
        <GoalIcon icon={goal.icon} tone={goal.tone} size="large" />
      </div>

      <div className="grid gap-6 md:grid-cols-[220px_1fr] md:items-center">
        <ProgressRing goal={goal} />
        <div>
          <div className="grid gap-3 sm:grid-cols-2">
            <Metric label="Terkumpul" value={goal.current} />
            <Metric label="Target" value={goal.target} />
            <Metric label="Deadline" value={goal.deadline} />
            <Metric label="Tabungan wajib" value={goal.requiredSaving} />
          </div>
          <div className="mt-5 h-3 overflow-hidden rounded-full bg-white/12">
            <div
              className="h-full rounded-full bg-satomi-cyan shadow-[0_0_24px_rgba(0,240,255,0.35)]"
              style={{ width: `${goal.progress}%` }}
            />
          </div>
          <div className="mt-4 flex items-center justify-between gap-4">
            <p className="font-mono text-xs font-semibold uppercase tracking-[0.2em] text-satomi-muted">
              {goal.progress}% tercapai
            </p>
            <Link
              href={`/goals/${goal.id}`}
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl px-3 text-sm font-semibold text-satomi-cyan transition hover:bg-satomi-cyan/10 hover:text-satomi-cyan-soft"
            >
              Detail
              <ArrowRight className="size-4" />
            </Link>
          </div>
        </div>
      </div>
    </GlassCard>
  );
}

function MainGoalEmpty({ onCreate }: { onCreate: () => void }) {
  return (
    <GlassCard variant="featured" className="p-6 md:p-8">
      <p className="font-mono text-xs font-semibold uppercase tracking-[0.24em] text-satomi-cyan">
        Goal Utama
      </p>
      <h2 className="mt-4 font-display text-4xl font-extrabold text-satomi-text">
        Belum ada target aktif
      </h2>
      <p className="mt-3 max-w-xl leading-7 text-satomi-muted">
        Saat goal pertama dibuat, Satomi akan menampilkan progres, deadline, dan strategi utama di sini.
      </p>
      <Button className="mt-6 w-full sm:w-auto" onClick={onCreate}>
        <Plus className="size-4" />
        Tambah Goal Pertama
      </Button>
    </GlassCard>
  );
}

function SatomiRecommendationPanel({ recommendationText }: { recommendationText: string }) {
  return (
    <GlassCard className="p-6 md:p-8">
      <div className="flex items-start gap-4">
        <div className="flex size-12 shrink-0 items-center justify-center rounded-full border border-satomi-cyan/30 bg-satomi-cyan/12 text-satomi-cyan">
          <Bot className="size-6" />
        </div>
        <div>
          <p className="font-mono text-xs font-semibold uppercase tracking-[0.24em] text-satomi-cyan">
            Rekomendasi Satomi
          </p>
          <h2 className="mt-3 font-display text-3xl font-extrabold tracking-normal text-satomi-text">
            Fokuskan surplus ke goal prioritas
          </h2>
          <p className="mt-4 leading-7 text-satomi-muted">{recommendationText}</p>
        </div>
      </div>
      <div className="mt-6 rounded-2xl border border-satomi-purple/25 bg-satomi-purple/10 p-4">
        <p className="font-mono text-xs font-semibold uppercase tracking-[0.2em] text-satomi-purple-soft">
          Persona tujuan
        </p>
        <p className="mt-2 text-sm leading-6 text-satomi-muted">
          Strategi akan terasa paling stabil kalau kamu mulai dari target prioritas tertinggi, lalu naikkan setoran saat pemasukan sedang bagus.
        </p>
      </div>
    </GlassCard>
  );
}

function GoalCard({
  goal,
  onQuickEdit,
}: {
  goal: GoalRecord;
  onQuickEdit?: () => void;
}) {
  return (
    <div className="group relative h-full">
      {onQuickEdit ? (
        <button
          type="button"
          onClick={onQuickEdit}
          className="absolute right-3 top-3 z-10 inline-flex size-9 items-center justify-center rounded-full border border-white/10 bg-black/35 text-satomi-muted opacity-0 transition hover:border-satomi-cyan/35 hover:text-satomi-cyan group-hover:opacity-100"
          aria-label={`Edit ${goal.name}`}
        >
          <Target className="size-4" />
        </button>
      ) : null}
      <Link href={`/goals/${goal.id}`} className="block h-full">
        <GlassCard variant="interactive" className="flex h-full flex-col p-5">
          <div className="flex items-start justify-between gap-4">
            <GoalIcon icon={goal.icon} tone={goal.tone} />
            <StatusChip status={goal.status} />
          </div>
          <h3 className="mt-5 text-xl font-semibold text-satomi-text">{goal.name}</h3>
          <p className="mt-2 min-h-12 text-sm leading-6 text-satomi-muted">
            {goal.description}
          </p>
          <div className="mt-5 flex items-end justify-between gap-4">
            <div>
              <p className={cn("font-display text-2xl font-extrabold", toneText[goal.tone])}>
                {goal.current}
              </p>
              <p className="text-sm text-satomi-muted">/ {goal.target}</p>
            </div>
            <p className="font-mono text-xs text-satomi-muted">{goal.progress}%</p>
          </div>
          <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/12">
            <div
              className={cn("h-full rounded-full", toneBg[goal.tone])}
              style={{ width: `${goal.progress}%` }}
            />
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            <StrategyChip label={goal.strategy} compact />
          </div>
        </GlassCard>
      </Link>
    </div>
  );
}

export function GoalEditorDialog({
  isOpen,
  mode,
  goal,
  isBusy,
  onOpenChange,
  onSubmit,
  onDelete,
}: {
  isOpen: boolean;
  mode: "create" | "edit";
  goal: GoalRow | null;
  isBusy: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (input: GoalInput) => Promise<void>;
  onDelete?: () => Promise<void>;
}) {
  const [name, setName] = useState(goal?.name ?? "");
  const [goalType, setGoalType] = useState(goal?.goal_type ?? "saving");
  const [targetAmount, setTargetAmount] = useState(goal ? String(goal.target_amount) : "");
  const [currentAmount, setCurrentAmount] = useState(goal ? String(goal.current_amount) : "0");
  const [targetDate, setTargetDate] = useState(goal?.target_date ?? "");
  const [strategy, setStrategy] = useState(goal?.strategy ?? "Save More Tomorrow");
  const [localError, setLocalError] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLocalError(null);

    const parsedTarget = Number(targetAmount);
    const parsedCurrent = Number(currentAmount);

    if (!name.trim()) {
      setLocalError("Nama goal wajib diisi.");
      return;
    }

    if (!Number.isFinite(parsedTarget) || parsedTarget <= 0) {
      setLocalError("Target goal harus lebih besar dari nol.");
      return;
    }

    if (!Number.isFinite(parsedCurrent) || parsedCurrent < 0) {
      setLocalError("Dana terkumpul goal tidak boleh negatif.");
      return;
    }

    if (parsedCurrent > parsedTarget) {
      setLocalError("Dana terkumpul tidak boleh melebihi target goal.");
      return;
    }

    try {
      await onSubmit({
        name,
        goal_type: goalType,
        target_amount: parsedTarget,
        current_amount: parsedCurrent,
        target_date: targetDate || null,
        strategy: strategy || null,
      });
    } catch (error) {
      setLocalError(error instanceof Error ? error.message : "Goal belum berhasil disimpan.");
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <p className="font-mono text-xs font-semibold uppercase tracking-[0.22em] text-satomi-cyan">
            Goal Finansial
          </p>
          <DialogTitle>{mode === "create" ? "Tambah Goal" : "Edit Goal"}</DialogTitle>
          <DialogDescription>
            Atur target, progres awal, deadline, dan strategi agar Satomi bisa membaca ritmenya.
          </DialogDescription>
        </DialogHeader>

        {localError ? <StatusBanner tone="error">{localError}</StatusBanner> : null}

        <form className="grid gap-4 sm:grid-cols-2" onSubmit={handleSubmit}>
          <FinanceField
            label="Nama goal"
            value={name}
            onChange={(event) => setName(event.target.value)}
            className="sm:col-span-2"
          />
          <FinanceSelect
            label="Tipe goal"
            value={goalType}
            onValueChange={setGoalType}
            options={goalTypeOptions}
          />
          <FinanceField
            label="Target dana"
            type="number"
            inputMode="numeric"
            value={targetAmount}
            onChange={(event) => setTargetAmount(event.target.value)}
          />
          <FinanceField
            label="Dana terkumpul"
            type="number"
            inputMode="numeric"
            value={currentAmount}
            onChange={(event) => setCurrentAmount(event.target.value)}
          />
          <FinanceField
            label="Tanggal target"
            type="date"
            value={targetDate}
            onChange={(event) => setTargetDate(event.target.value)}
          />
          <FinanceSelect
            label="Strategi"
            value={strategy}
            onValueChange={setStrategy}
            options={strategyChips.map((item) => ({ value: item, label: item }))}
            className="sm:col-span-2"
          />
          <FinanceTextArea
            label="Catatan strategi"
            className="sm:col-span-2"
            value={`Target ini akan tampil dengan deadline ${targetDate ? formatFullDate(targetDate) : "fleksibel"} dan strategi ${strategy}.`}
            readOnly
          />

          <div className="mt-2 flex flex-col gap-3 sm:col-span-2 sm:flex-row">
            <Button type="submit" className="flex-1">
              {isBusy ? "Menyimpan..." : mode === "create" ? "Simpan Goal" : "Simpan Edit"}
            </Button>
            {mode === "edit" && onDelete ? (
              <Button
                type="button"
                variant="danger"
                className="flex-1"
                disabled={isBusy}
                onClick={() => void onDelete()}
              >
                <Trash2 className="size-4" />
                Hapus Goal
              </Button>
            ) : null}
            <Button type="button" variant="secondary" className="flex-1" onClick={() => onOpenChange(false)}>
              Tutup
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export function GoalDetailPanels({ goal }: { goal: GoalRow }) {
  const goalRecord = mapGoalRowToRecord([goal], goal);
  const milestones = buildGoalMilestones(goal);
  const fundingSources = buildGoalFundingSources(goal);
  const activities = buildGoalActivities(goal);

  return (
    <>
      <section className="grid gap-5 xl:grid-cols-[0.9fr_1.1fr]">
        <GoalProgressPanel goal={goalRecord} />
        <div className="grid gap-4 sm:grid-cols-2">
          <MetricCard label="Target" value={goalRecord.target} detail="Dana akhir" />
          <MetricCard label="Terkumpul" value={goalRecord.current} detail="Dana saat ini" />
          <MetricCard label="Deadline" value={goalRecord.deadline} detail="Sisa waktu" />
          <MetricCard label="Tabungan wajib" value={goalRecord.requiredSaving} detail="Ritme ideal" />
        </div>
      </section>

      <section className="grid gap-5 xl:grid-cols-[1.05fr_0.95fr]">
        <GlassCard className="p-6 md:p-8">
          <div className="flex gap-4">
            <div className="flex size-12 shrink-0 items-center justify-center rounded-full border border-satomi-cyan/30 bg-satomi-cyan/12 text-satomi-cyan">
              <Bot className="size-6" />
            </div>
            <div>
              <p className="font-mono text-xs font-semibold uppercase tracking-[0.24em] text-satomi-cyan">
                Strategi Satomi
              </p>
              <h2 className="mt-3 font-display text-3xl font-extrabold tracking-normal text-satomi-text">
                Jaga ritme {goalRecord.requiredSaving.toLowerCase()}
              </h2>
              <p className="mt-4 leading-7 text-satomi-muted">
                Goal ini menggunakan strategi {goalRecord.strategy}. Satomi menyarankan menjaga setoran rutin sambil menaikkan nominal saat ada pemasukan tambahan.
              </p>
            </div>
          </div>
          <div className="mt-6 flex flex-wrap gap-2">
            {strategyChips.map((item) => (
              <span
                key={item}
                className={cn(
                  "rounded-full border px-3 py-1.5 font-mono text-[10px] font-semibold uppercase tracking-[0.14em]",
                  item === goalRecord.strategy
                    ? "border-satomi-cyan/35 bg-satomi-cyan/12 text-satomi-cyan"
                    : "border-white/10 bg-white/5 text-satomi-muted",
                )}
              >
                {item}
              </span>
            ))}
          </div>
        </GlassCard>

        <GlassCard className="p-6 md:p-8">
          <div className="mb-5 flex items-center justify-between">
            <h2 className="font-mono text-xs font-semibold uppercase tracking-[0.24em] text-satomi-muted">
              Sumber Dana
            </h2>
            <Sparkles className="size-5 text-satomi-purple-soft" />
          </div>
          <div className="grid gap-3">
            {fundingSources.map((source) => {
              const Icon = source.icon;
              return (
                <div
                  key={source.label}
                  className="flex items-center gap-4 rounded-2xl border border-white/10 bg-black/25 p-4"
                >
                  <div className="flex size-11 shrink-0 items-center justify-center rounded-full bg-satomi-purple/12 text-satomi-purple-soft">
                    <Icon className="size-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-satomi-text">{source.label}</p>
                    <p className="mt-1 text-sm text-satomi-muted">{source.value}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </GlassCard>
      </section>

      <section className="grid gap-5 xl:grid-cols-[0.9fr_1.1fr]">
        <GlassCard className="p-6 md:p-8">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="font-mono text-xs font-semibold uppercase tracking-[0.24em] text-satomi-muted">
              Milestone
            </h2>
            <Target className="size-5 text-satomi-cyan" />
          </div>
          <div className="space-y-4">
            {milestones.map((milestone) => (
              <div key={milestone.label} className="rounded-2xl border border-white/10 bg-black/20 p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-semibold text-satomi-text">{milestone.label}</p>
                    <p className="mt-1 text-sm text-satomi-muted">{milestone.value}</p>
                  </div>
                  <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 font-mono text-[9px] font-semibold uppercase tracking-[0.12em] text-satomi-muted">
                    {milestone.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </GlassCard>

        <GlassCard className="p-6 md:p-8">
          <div className="mb-5 flex items-center justify-between">
            <h2 className="font-mono text-xs font-semibold uppercase tracking-[0.24em] text-satomi-muted">
              Aktivitas Terbaru
            </h2>
            <Link href="/transactions" className="text-sm font-medium text-satomi-text transition hover:text-satomi-cyan">
              Lihat Semua
            </Link>
          </div>
          <div className="grid gap-3">
            {activities.map((activity) => {
              const Icon = activity.icon;
              return (
                <div
                  key={activity.id}
                  className="flex items-center gap-4 rounded-2xl border border-white/10 bg-black/20 p-4"
                >
                  <div className="flex size-11 shrink-0 items-center justify-center rounded-full bg-satomi-cyan/10 text-satomi-cyan">
                    <Icon className="size-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-satomi-text">{activity.title}</p>
                    <p className="mt-1 text-sm text-satomi-muted">{activity.meta}</p>
                  </div>
                  <p className="whitespace-nowrap font-semibold text-satomi-cyan">{activity.amount}</p>
                </div>
              );
            })}
          </div>
        </GlassCard>
      </section>
    </>
  );
}

function GoalProgressPanel({ goal }: { goal: GoalRecord }) {
  return (
    <GlassCard variant="featured" className="flex flex-col items-center justify-center p-6 md:p-8">
      <div className="relative flex size-72 items-center justify-center rounded-full">
        <div
          className="absolute inset-0 rounded-full shadow-[0_0_52px_rgba(0,240,255,0.22)]"
          style={{
            background: `conic-gradient(#72fbff 0deg, #00f0ff ${goal.progress * 3.6}deg, rgba(255,255,255,0.08) ${goal.progress * 3.6}deg)`,
          }}
        />
        <div className="absolute inset-6 rounded-full bg-satomi-surface" />
        <div className="relative text-center">
          <p className="font-mono text-xs font-semibold uppercase tracking-[0.22em] text-satomi-muted">
            {goal.name}
          </p>
          <p className="mt-2 font-display text-5xl font-extrabold text-satomi-cyan satomi-glow-text">
            {goal.progress}%
          </p>
          <div className="mx-auto my-4 h-px w-14 bg-white/20" />
          <p className="font-semibold text-satomi-text">{goal.current}</p>
          <p className="mt-1 text-sm text-satomi-muted">dari {goal.target}</p>
        </div>
      </div>
      <div className="mt-7 w-full rounded-2xl border border-white/10 bg-black/30 p-4">
        <div className="flex items-center justify-between gap-4">
          <span className="font-mono text-xs font-semibold uppercase tracking-[0.2em] text-satomi-muted">
            Tabungan wajib
          </span>
          <span className="font-semibold text-satomi-cyan">{goal.requiredSaving}</span>
        </div>
        <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/12">
          <div className="h-full rounded-full bg-satomi-cyan shadow-[0_0_24px_rgba(0,240,255,0.35)]" style={{ width: `${goal.progress}%` }} />
        </div>
      </div>
    </GlassCard>
  );
}

function GoalIcon({
  icon: Icon,
  tone,
  size = "default",
}: {
  icon: GoalRecord["icon"];
  tone: GoalTone;
  size?: "default" | "large";
}) {
  return (
    <div
      className={cn(
        "flex items-center justify-center rounded-2xl border border-white/10 bg-black/25",
        toneText[tone],
        size === "large" ? "size-16" : "size-12",
      )}
    >
      <Icon className={size === "large" ? "size-8" : "size-6"} />
    </div>
  );
}

function ProgressRing({ goal }: { goal: GoalRecord }) {
  return (
    <div className="relative mx-auto flex size-52 items-center justify-center rounded-full md:mx-0">
      <div
        className="absolute size-52 rounded-full shadow-[0_0_48px_rgba(0,240,255,0.2)]"
        style={{
          background: `conic-gradient(#72fbff 0deg, #00f0ff ${goal.progress * 3.6}deg, rgba(255,255,255,0.08) ${goal.progress * 3.6}deg)`,
        }}
      />
      <div className="absolute size-40 rounded-full bg-satomi-surface" />
      <div className="relative text-center">
        <p className="font-mono text-xs font-semibold uppercase tracking-[0.22em] text-satomi-muted">Progres</p>
        <p className="mt-2 font-display text-5xl font-extrabold text-satomi-cyan satomi-glow-text">{goal.progress}%</p>
      </div>
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-black/25 p-4">
      <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-satomi-muted">{label}</p>
      <p className="mt-2 font-semibold text-satomi-text">{value}</p>
    </div>
  );
}

function MetricCard({
  label,
  value,
  detail,
}: {
  label: string;
  value: string;
  detail: string;
}) {
  return (
    <GlassCard className="p-5">
      <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-satomi-muted">{label}</p>
      <p className="mt-2 font-display text-2xl font-extrabold text-satomi-text">{value}</p>
      <p className="mt-1 text-sm text-satomi-muted">{detail}</p>
    </GlassCard>
  );
}

function StrategyChip({ label, compact = false }: { label: string; compact?: boolean }) {
  return (
    <span
      className={cn(
        "inline-flex rounded-full border border-satomi-cyan/25 bg-satomi-cyan/10 font-mono font-semibold uppercase tracking-[0.14em] text-satomi-cyan",
        compact ? "px-2.5 py-1 text-[9px]" : "px-3 py-1.5 text-[10px]",
      )}
    >
      {label}
    </span>
  );
}

function StatusChip({ status }: { status: GoalStatus }) {
  return (
    <span className={cn("rounded-full border px-3 py-1 font-mono text-[10px] font-semibold uppercase tracking-[0.16em]", statusClass[status])}>
      {status}
    </span>
  );
}

function DataStatePanel({
  title,
  description,
  primaryLabel,
  onPrimary,
}: {
  title: string;
  description: string;
  primaryLabel: string;
  onPrimary: () => void | Promise<unknown>;
}) {
  return (
    <GlassCard className="mx-auto flex max-w-2xl flex-col items-center p-8 text-center md:p-12">
      <div className="relative mb-8 flex size-28 items-center justify-center rounded-full border border-satomi-cyan/40 bg-satomi-cyan/10 shadow-[0_0_54px_rgba(0,240,255,0.22)]">
        <div className="absolute inset-4 rounded-full border border-satomi-cyan/30" />
        <Target className="size-12 text-satomi-cyan satomi-glow-text" />
      </div>
      <h2 className="font-display text-4xl font-extrabold leading-tight text-satomi-text">{title}</h2>
      <p className="mt-4 max-w-lg text-base leading-7 text-satomi-muted md:text-lg">{description}</p>
      <Button className="mt-8" size="lg" onClick={() => void onPrimary()}>
        {primaryLabel}
      </Button>
    </GlassCard>
  );
}

function StatusBanner({
  tone,
  children,
}: {
  tone: "success" | "error";
  children: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        "rounded-2xl border px-4 py-3 text-sm leading-6",
        tone === "success"
          ? "border-emerald-400/30 bg-emerald-400/10 text-emerald-100"
          : "border-rose-400/30 bg-rose-400/10 text-rose-100",
      )}
    >
      {children}
    </div>
  );
}
