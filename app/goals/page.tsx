import {
  ArrowRight,
  Bot,
  Plus,
  Sparkles,
  Target,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import Link from "next/link";
import { AppShell, EmptyState, GlassCard } from "@/src/components/satomi";
import {
  goalRecords,
  mainGoal,
  satomiGoalRecommendation,
  strategyChips,
  type GoalRecord,
  type GoalStatus,
  type GoalTone,
} from "@/src/lib/satomi-goals-data";
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

export default function GoalsPage() {
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
          <button
            type="button"
            className="inline-flex min-h-14 items-center justify-center gap-3 rounded-2xl bg-satomi-cyan px-6 font-mono text-xs font-bold uppercase tracking-[0.18em] text-satomi-bg shadow-[0_0_30px_rgba(0,240,255,0.28)] transition hover:bg-satomi-cyan-soft"
          >
            <Plus className="size-5" />
            Tambah Goal
          </button>
          <button
            type="button"
            className="inline-flex min-h-14 items-center justify-center gap-3 rounded-2xl border border-satomi-cyan/35 bg-black/20 px-6 font-mono text-xs font-bold uppercase tracking-[0.18em] text-satomi-cyan transition hover:bg-satomi-cyan/10"
          >
            <Sparkles className="size-5" />
            Minta Strategi Satomi
          </button>
        </div>
      </section>

      <section className="grid gap-5 xl:grid-cols-[1.05fr_0.95fr]">
        <MainGoalCard />
        <SatomiRecommendationPanel />
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
            {goalRecords.map((goal) => (
              <GoalCard key={goal.id} goal={goal} />
            ))}
          </div>
        </section>
      )}
    </AppShell>
  );
}

function MainGoalCard() {
  return (
    <GlassCard variant="featured" className="p-6 md:p-8">
      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <StatusChip status={mainGoal.status} />
          <h2 className="mt-4 font-display text-4xl font-extrabold tracking-normal text-satomi-text md:text-5xl">
            {mainGoal.name}
          </h2>
          <p className="mt-3 max-w-xl leading-7 text-satomi-muted">
            {mainGoal.description}
          </p>
        </div>
        <GoalIcon icon={mainGoal.icon} tone={mainGoal.tone} size="large" />
      </div>

      <div className="grid gap-6 md:grid-cols-[220px_1fr] md:items-center">
        <ProgressRing goal={mainGoal} />
        <div>
          <div className="grid gap-3 sm:grid-cols-2">
            <Metric label="Terkumpul" value={mainGoal.current} />
            <Metric label="Target" value={mainGoal.target} />
            <Metric label="Deadline" value={mainGoal.deadline} />
            <Metric label="Tabungan wajib" value={mainGoal.requiredSaving} />
          </div>
          <div className="mt-5 h-3 overflow-hidden rounded-full bg-white/12">
            <div
              className="h-full rounded-full bg-satomi-cyan shadow-[0_0_24px_rgba(0,240,255,0.35)]"
              style={{ width: `${mainGoal.progress}%` }}
            />
          </div>
          <div className="mt-4 flex items-center justify-between gap-4">
            <p className="font-mono text-xs font-semibold uppercase tracking-[0.2em] text-satomi-muted">
              {mainGoal.progress}% tercapai
            </p>
            <Link
              href="/goals/dana-jepang"
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

function SatomiRecommendationPanel() {
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
            Fokuskan surplus ke Dana Jepang
          </h2>
          <p className="mt-4 leading-7 text-satomi-muted">
            {satomiGoalRecommendation}
          </p>
        </div>
      </div>
      <div className="mt-6 rounded-2xl border border-satomi-purple/25 bg-satomi-purple/10 p-4">
        <p className="font-mono text-xs font-semibold uppercase tracking-[0.2em] text-satomi-purple-soft">
          Persona tujuan
        </p>
        <p className="mt-2 text-sm leading-6 text-satomi-muted">
          Kamu cocok memakai strategi bertahap: mulai kecil, naikkan nominal saat
          pemasukan bertambah, dan tampilkan konsekuensi saat impuls belanja muncul.
        </p>
      </div>
    </GlassCard>
  );
}

function GoalCard({ goal }: { goal: GoalRecord }) {
  return (
    <Link href={`/goals/${goal.id}`} className="block h-full">
      <GlassCard
        variant="interactive"
        className="flex h-full flex-col p-5"
      >
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
  );
}

function ProgressRing({ goal }: { goal: GoalRecord }) {
  return (
    <div className="relative mx-auto flex size-52 items-center justify-center rounded-full md:mx-0">
      <div
        className="absolute size-52 rounded-full shadow-[0_0_48px_rgba(0,240,255,0.2)]"
        style={{
          background: `conic-gradient(#72fbff 0deg, #00f0ff ${
            goal.progress * 3.6
          }deg, rgba(255,255,255,0.08) ${goal.progress * 3.6}deg)`,
        }}
      />
      <div className="absolute size-40 rounded-full bg-satomi-surface" />
      <div className="relative text-center">
        <p className="font-mono text-xs font-semibold uppercase tracking-[0.22em] text-satomi-muted">
          Progres
        </p>
        <p className="mt-2 font-display text-5xl font-extrabold text-satomi-cyan satomi-glow-text">
          {goal.progress}%
        </p>
      </div>
    </div>
  );
}

function GoalIcon({
  icon: Icon,
  tone,
  size = "default",
}: {
  icon: LucideIcon;
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

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-black/25 p-4">
      <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-satomi-muted">
        {label}
      </p>
      <p className="mt-2 font-semibold text-satomi-text">{value}</p>
    </div>
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
    <span
      className={cn(
        "rounded-full border px-3 py-1 font-mono text-[10px] font-semibold uppercase tracking-[0.16em]",
        statusClass[status],
      )}
    >
      {status}
    </span>
  );
}
