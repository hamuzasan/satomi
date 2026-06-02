import {
  ArrowLeft,
  Bot,
  CalendarDays,
  Check,
  Circle,
  Flag,
  PiggyBank,
  Sparkles,
  Target,
} from "lucide-react";
import Link from "next/link";
import { AppShell, EmptyState, GlassCard, StatCard } from "@/src/components/satomi";
import {
  getGoalById,
  goalActivities,
  goalFundingSources,
  goalMilestones,
  strategyChips,
  type GoalMilestone,
  type GoalRecord,
} from "@/src/lib/satomi-goals-data";
import { cn } from "@/src/lib/utils";

type GoalDetailPageProps = {
  params: Promise<{ id: string }>;
};

export default async function GoalDetailPage({ params }: GoalDetailPageProps) {
  const { id } = await params;
  const goal = getGoalById(id);

  if (!goal) {
    return (
      <AppShell activePath="/goals">
        <EmptyState
          title="Goal tidak ditemukan"
          description="Goal dummy ini belum tersedia. Kembali ke daftar tujuan finansial untuk melihat target yang aktif."
          primaryAction={{ label: "Lihat Goal", href: "/goals" }}
        />
      </AppShell>
    );
  }

  return (
    <AppShell activePath="/goals">
      <section className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
        <div>
          <Link
            href="/goals"
            className="mb-4 inline-flex items-center gap-2 text-sm text-satomi-muted transition hover:text-satomi-cyan"
          >
            <ArrowLeft className="size-4" />
            Kembali ke Tujuan Finansial
          </Link>
          <div className="mb-2 flex items-center gap-2 text-satomi-cyan">
            <Target className="size-5" />
            <span className="font-mono text-xs font-semibold uppercase tracking-[0.24em]">
              Goal Aktif
            </span>
          </div>
          <h1 className="font-display text-4xl font-extrabold leading-tight tracking-normal text-satomi-text md:text-6xl">
            {goal.name}
          </h1>
          <p className="mt-3 max-w-2xl text-lg leading-8 text-satomi-muted">
            Detail strategi, milestone, dan sumber dana untuk menjaga target tetap
            bergerak.
          </p>
        </div>
        <div className="rounded-2xl border border-satomi-cyan/25 bg-satomi-cyan/10 px-5 py-4 text-satomi-cyan">
          <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.2em]">
            Strategi utama
          </p>
          <p className="mt-1 font-semibold text-satomi-text">{goal.strategy}</p>
        </div>
      </section>

      <section className="grid gap-5 xl:grid-cols-[0.9fr_1.1fr]">
        <GoalProgressPanel goal={goal} />
        <div className="grid gap-4 sm:grid-cols-2">
          <StatCard
            label="Target"
            value={goal.target}
            detail="Dana akhir"
            tone="cyan"
            icon={Flag}
          />
          <StatCard
            label="Terkumpul"
            value={goal.current}
            detail="Dana saat ini"
            tone="green"
            icon={PiggyBank}
          />
          <StatCard
            label="Deadline"
            value={goal.deadline}
            detail="Sisa waktu"
            tone="purple"
            icon={CalendarDays}
          />
          <StatCard
            label="Tabungan wajib"
            value={goal.requiredSaving}
            detail="Setoran harian"
            tone="amber"
            icon={Target}
          />
        </div>
      </section>

      <section className="grid gap-5 xl:grid-cols-[1.05fr_0.95fr]">
        <SatomiStrategyPanel goal={goal} />
        <FundingPanel />
      </section>

      <section className="grid gap-5 xl:grid-cols-[0.9fr_1.1fr]">
        <MilestonePanel />
        <ActivityPanel />
      </section>
    </AppShell>
  );
}

function GoalProgressPanel({ goal }: { goal: GoalRecord }) {
  return (
    <GlassCard
      variant="featured"
      className="flex flex-col items-center justify-center p-6 md:p-8"
    >
      <div className="relative flex size-72 items-center justify-center rounded-full">
        <div
          className="absolute inset-0 rounded-full shadow-[0_0_52px_rgba(0,240,255,0.22)]"
          style={{
            background: `conic-gradient(#72fbff 0deg, #00f0ff ${
              goal.progress * 3.6
            }deg, rgba(255,255,255,0.08) ${goal.progress * 3.6}deg)`,
          }}
        />
        <div className="absolute inset-6 rounded-full bg-satomi-surface" />
        <div className="relative text-center">
          <p className="font-mono text-xs font-semibold uppercase tracking-[0.22em] text-satomi-muted">
            Dana Jepang
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
          <div
            className="h-full rounded-full bg-satomi-cyan shadow-[0_0_24px_rgba(0,240,255,0.35)]"
            style={{ width: `${goal.progress}%` }}
          />
        </div>
      </div>
    </GlassCard>
  );
}

function SatomiStrategyPanel({ goal }: { goal: GoalRecord }) {
  return (
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
            Jaga ritme Rp45.000 per hari
          </h2>
          <p className="mt-4 leading-7 text-satomi-muted">
            Untuk mencapai {goal.name}, Satomi menyarankan strategi{" "}
            {goal.strategy}. Naikkan setoran saat ada pemasukan tambahan, lalu
            tahan pengeluaran hiburan saat progress harian tertinggal.
          </p>
        </div>
      </div>
      <div className="mt-6 flex flex-wrap gap-2">
        {strategyChips.map((strategy) => (
          <span
            key={strategy}
            className={cn(
              "rounded-full border px-3 py-1.5 font-mono text-[10px] font-semibold uppercase tracking-[0.14em]",
              strategy === goal.strategy
                ? "border-satomi-cyan/35 bg-satomi-cyan/12 text-satomi-cyan"
                : "border-white/10 bg-white/5 text-satomi-muted",
            )}
          >
            {strategy}
          </span>
        ))}
      </div>
    </GlassCard>
  );
}

function FundingPanel() {
  return (
    <GlassCard className="p-6 md:p-8">
      <div className="mb-5 flex items-center justify-between">
        <h2 className="font-mono text-xs font-semibold uppercase tracking-[0.24em] text-satomi-muted">
          Sumber Dana
        </h2>
        <Sparkles className="size-5 text-satomi-purple-soft" />
      </div>
      <div className="grid gap-3">
        {goalFundingSources.map((source) => {
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
  );
}

function MilestonePanel() {
  return (
    <GlassCard className="p-6 md:p-8">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="font-mono text-xs font-semibold uppercase tracking-[0.24em] text-satomi-muted">
          Milestone
        </h2>
        <Flag className="size-5 text-satomi-cyan" />
      </div>
      <div className="space-y-4">
        {goalMilestones.map((milestone) => (
          <MilestoneRow key={milestone.label} milestone={milestone} />
        ))}
      </div>
    </GlassCard>
  );
}

function MilestoneRow({ milestone }: { milestone: GoalMilestone }) {
  const isDone = milestone.status === "Selesai";
  const isActive = milestone.status === "Berjalan";

  return (
    <div className="flex gap-4">
      <div
        className={cn(
          "mt-1 flex size-8 shrink-0 items-center justify-center rounded-full border",
          isDone
            ? "border-satomi-green/35 bg-satomi-green/12 text-satomi-green"
            : isActive
              ? "border-satomi-cyan/35 bg-satomi-cyan/12 text-satomi-cyan"
              : "border-white/10 bg-white/5 text-satomi-muted",
        )}
      >
        {isDone ? <Check className="size-4" /> : <Circle className="size-3" />}
      </div>
      <div className="min-w-0 flex-1 rounded-2xl border border-white/10 bg-black/20 p-4">
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
    </div>
  );
}

function ActivityPanel() {
  return (
    <GlassCard className="p-6 md:p-8">
      <div className="mb-5 flex items-center justify-between">
        <h2 className="font-mono text-xs font-semibold uppercase tracking-[0.24em] text-satomi-muted">
          Aktivitas Terbaru
        </h2>
        <Link
          href="/transactions"
          className="text-sm font-medium text-satomi-text transition hover:text-satomi-cyan"
        >
          Lihat Semua
        </Link>
      </div>
      <div className="grid gap-3">
        {goalActivities.map((activity) => {
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
              <p className="whitespace-nowrap font-semibold text-satomi-cyan">
                {activity.amount}
              </p>
            </div>
          );
        })}
      </div>
    </GlassCard>
  );
}
