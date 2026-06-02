import {
  Bot,
  ChartNoAxesCombined,
  CheckCircle2,
  History,
  Sparkles,
  TrendingUp,
} from "lucide-react";
import { AppShell, GlassCard } from "@/src/components/satomi";
import {
  aiInsightRecommendation,
  categoryInsights,
  nudgeHistory,
  positiveReinforcements,
  weeklySpendingTrend,
  type InsightTone,
} from "@/src/lib/satomi-insights-data";
import { cn } from "@/src/lib/utils";

const toneText: Record<InsightTone, string> = {
  cyan: "text-satomi-cyan",
  purple: "text-satomi-purple-soft",
  green: "text-satomi-green",
  amber: "text-satomi-amber",
  error: "text-satomi-error",
};

const toneBg: Record<InsightTone, string> = {
  cyan: "bg-satomi-cyan",
  purple: "bg-satomi-purple-soft",
  green: "bg-satomi-green",
  amber: "bg-satomi-amber",
  error: "bg-satomi-error",
};

const toneBorder: Record<InsightTone, string> = {
  cyan: "border-satomi-cyan/35",
  purple: "border-satomi-purple/35",
  green: "border-satomi-green/35",
  amber: "border-satomi-amber/35",
  error: "border-satomi-error/35",
};

export default function InsightsPage() {
  return (
    <AppShell activePath="/insights">
      <section>
        <div className="mb-3 flex items-center gap-2 text-satomi-cyan">
          <ChartNoAxesCombined className="size-5" />
          <span className="font-mono text-xs font-semibold uppercase tracking-[0.24em]">
            Analisis Satomi
          </span>
        </div>
        <h1 className="font-display text-[38px] font-extrabold leading-tight tracking-normal text-satomi-text md:text-6xl">
          Insight Keuangan
        </h1>
        <p className="mt-3 max-w-2xl text-lg leading-8 text-satomi-muted">
          Satomi membaca pola pengeluaranmu dan memberi saran yang relevan.
        </p>
      </section>

      <AiRecommendationCard />

      <section className="grid gap-5 xl:grid-cols-[0.85fr_1.15fr]">
        <SpendingDonut />
        <WeeklyTrend />
      </section>

      <GlassCard className="p-5 md:p-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="font-mono text-xs font-semibold uppercase tracking-[0.24em] text-satomi-muted">
              Minggu ini vs minggu lalu
            </p>
            <p className="mt-2 text-lg text-satomi-text">
              Pengeluaran total kamu meningkat.
            </p>
          </div>
          <div className="inline-flex w-fit items-center gap-2 rounded-full border border-satomi-error/35 bg-satomi-error/12 px-4 py-2 text-satomi-error">
            <TrendingUp className="size-4" />
            <span className="font-mono text-xs font-semibold uppercase tracking-[0.14em]">
              +12%
            </span>
          </div>
        </div>
      </GlassCard>

      <section className="grid gap-5 xl:grid-cols-[1.05fr_0.95fr]">
        <CategoryBreakdown />
        <PositiveReinforcement />
      </section>

      <NudgeHistory />
    </AppShell>
  );
}

function AiRecommendationCard() {
  return (
    <GlassCard variant="featured" className="p-6 md:p-8">
      <div className="flex items-start gap-4">
        <div className="flex size-13 shrink-0 items-center justify-center rounded-2xl bg-satomi-cyan text-satomi-bg shadow-[0_0_28px_rgba(0,240,255,0.25)]">
          <Bot className="size-7" />
        </div>
        <div>
          <p className="font-mono text-xs font-semibold uppercase tracking-[0.24em] text-satomi-purple-soft">
            Saran Satomi minggu ini
          </p>
          <p className="mt-3 max-w-4xl text-lg leading-8 text-satomi-text">
            {aiInsightRecommendation}
          </p>
        </div>
      </div>
    </GlassCard>
  );
}

function SpendingDonut() {
  return (
    <GlassCard className="p-6 md:p-8">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="font-mono text-xs font-semibold uppercase tracking-[0.24em] text-satomi-muted">
          Pengeluaran per Kategori
        </h2>
        <Sparkles className="size-5 text-satomi-cyan" />
      </div>
      <div className="flex flex-col items-center">
        <div className="relative flex size-56 items-center justify-center rounded-full">
          <div
            className="absolute inset-0 rounded-full shadow-[0_0_42px_rgba(0,240,255,0.14)]"
            style={{
              background:
                "conic-gradient(#7df4ff 0% 45%, #ecb2ff 45% 65%, #ffcf75 65% 86%, #10b981 86% 100%)",
            }}
          />
          <div className="absolute inset-8 rounded-full bg-satomi-surface" />
          <div className="relative text-center">
            <p className="font-display text-5xl font-extrabold text-satomi-text">
              45%
            </p>
            <p className="mt-1 font-mono text-xs font-semibold uppercase tracking-[0.18em] text-satomi-muted">
              Makanan
            </p>
          </div>
        </div>
        <div className="mt-6 grid w-full grid-cols-2 gap-3">
          {categoryInsights.map((category) => (
            <LegendItem
              key={category.label}
              label={category.label}
              tone={category.tone}
              percent={category.percent}
            />
          ))}
        </div>
      </div>
    </GlassCard>
  );
}

function WeeklyTrend() {
  return (
    <GlassCard className="p-6 md:p-8">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="font-mono text-xs font-semibold uppercase tracking-[0.24em] text-satomi-muted">
          Tren Pengeluaran Mingguan
        </h2>
        <ChartNoAxesCombined className="size-5 text-satomi-cyan" />
      </div>
      <div className="relative min-h-72 rounded-2xl border border-white/10 bg-black/20 p-4">
        <svg
          className="absolute inset-4 h-[calc(100%-4.5rem)] w-[calc(100%-2rem)]"
          preserveAspectRatio="none"
          viewBox="0 0 100 100"
          aria-hidden="true"
        >
          <defs>
            <linearGradient id="satomi-trend-line" x1="0%" x2="100%" y1="0%" y2="0%">
              <stop offset="0%" stopColor="#00dbe9" />
              <stop offset="100%" stopColor="#dbfcff" />
            </linearGradient>
            <linearGradient id="satomi-trend-fill" x1="0%" x2="0%" y1="0%" y2="100%">
              <stop offset="0%" stopColor="#7df4ff" stopOpacity="0.32" />
              <stop offset="100%" stopColor="#7df4ff" stopOpacity="0" />
            </linearGradient>
          </defs>
          <path
            d="M0,82 C12,66 24,62 36,66 C46,70 52,70 58,54 C64,20 72,26 82,48 C90,66 96,74 100,24"
            fill="none"
            stroke="url(#satomi-trend-line)"
            strokeLinecap="round"
            strokeWidth="3"
          />
          <path
            d="M0,82 C12,66 24,62 36,66 C46,70 52,70 58,54 C64,20 72,26 82,48 C90,66 96,74 100,24 L100,100 L0,100 Z"
            fill="url(#satomi-trend-fill)"
          />
        </svg>
        <div className="absolute bottom-4 left-4 right-4 grid grid-cols-7 gap-2">
          {weeklySpendingTrend.map((point) => (
            <div key={point.day} className="flex flex-col items-center gap-2">
              <div className="flex h-32 w-full items-end justify-center">
                <div
                  className="w-2 rounded-full bg-satomi-cyan/25"
                  style={{ height: `${point.height}%` }}
                />
              </div>
              <span className="font-mono text-[10px] text-satomi-muted">{point.day}</span>
            </div>
          ))}
        </div>
      </div>
    </GlassCard>
  );
}

function CategoryBreakdown() {
  return (
    <GlassCard className="p-6 md:p-8">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="font-display text-2xl font-extrabold text-satomi-text">
          Rincian Kategori
        </h2>
        <span className="font-mono text-xs font-semibold uppercase tracking-[0.18em] text-satomi-muted">
          Bulan ini
        </span>
      </div>
      <div className="grid gap-4">
        {categoryInsights.map((category) => {
          const Icon = category.icon;
          return (
            <div key={category.label}>
              <div className="mb-2 flex items-center justify-between gap-4">
                <div className="flex min-w-0 items-center gap-3">
                  <div
                    className={cn(
                      "flex size-10 shrink-0 items-center justify-center rounded-full border bg-black/25",
                      toneBorder[category.tone],
                      toneText[category.tone],
                    )}
                  >
                    <Icon className="size-5" />
                  </div>
                  <div>
                    <p className="font-semibold text-satomi-text">{category.label}</p>
                    <p className="text-sm text-satomi-muted">{category.amount}</p>
                  </div>
                </div>
                <p className="font-mono text-xs font-semibold text-satomi-muted">
                  {category.percent}%
                </p>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-white/12">
                <div
                  className={cn("h-full rounded-full", toneBg[category.tone])}
                  style={{ width: `${category.percent}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </GlassCard>
  );
}

function PositiveReinforcement() {
  return (
    <GlassCard className="p-6 md:p-8">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="font-display text-2xl font-extrabold text-satomi-text">
          Penguatan Positif
        </h2>
        <CheckCircle2 className="size-5 text-satomi-green" />
      </div>
      <div className="grid gap-4">
        {positiveReinforcements.map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.id}
              className="rounded-2xl border border-satomi-green/25 bg-satomi-green/8 p-4"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex gap-3">
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-satomi-green/12 text-satomi-green">
                    <Icon className="size-5" />
                  </div>
                  <div>
                    <p className="font-semibold text-satomi-text">{item.title}</p>
                    <p className="mt-1 text-sm leading-6 text-satomi-muted">
                      {item.description}
                    </p>
                  </div>
                </div>
                <span className="rounded-full border border-satomi-green/25 bg-satomi-green/12 px-3 py-1 font-mono text-[10px] font-semibold uppercase tracking-[0.12em] text-satomi-green">
                  {item.value}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </GlassCard>
  );
}

function NudgeHistory() {
  return (
    <section>
      <div className="mb-4 flex items-center gap-3">
        <History className="size-5 text-satomi-cyan" />
        <h2 className="font-display text-3xl font-extrabold text-satomi-text">
          Riwayat Nudge
        </h2>
      </div>
      <div className="grid gap-3">
        {nudgeHistory.map((nudge) => {
          const Icon = nudge.icon;
          return (
            <GlassCard
              key={nudge.id}
              className={cn("border-l-2 p-4", toneBorder[nudge.tone])}
            >
              <div className="flex items-center gap-4">
                <div
                  className={cn(
                    "flex size-11 shrink-0 items-center justify-center rounded-full border bg-black/25",
                    toneBorder[nudge.tone],
                    toneText[nudge.tone],
                  )}
                >
                  <Icon className="size-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-mono text-xs font-semibold uppercase tracking-[0.14em] text-satomi-text">
                    {nudge.title}
                  </p>
                  <p className="mt-1 text-sm leading-6 text-satomi-muted">
                    {nudge.description}
                  </p>
                </div>
                <span className="hidden whitespace-nowrap font-mono text-xs text-satomi-muted sm:block">
                  {nudge.time}
                </span>
              </div>
              <span className="mt-3 block font-mono text-xs text-satomi-muted sm:hidden">
                {nudge.time}
              </span>
            </GlassCard>
          );
        })}
      </div>
    </section>
  );
}

function LegendItem({
  label,
  tone,
  percent,
}: {
  label: string;
  tone: InsightTone;
  percent: number;
}) {
  return (
    <div className="flex items-center gap-2">
      <span className={cn("size-3 shrink-0 rounded-full", toneBg[tone])} />
      <span className="min-w-0 flex-1 truncate text-sm text-satomi-text">{label}</span>
      <span className="font-mono text-xs text-satomi-muted">{percent}%</span>
    </div>
  );
}
