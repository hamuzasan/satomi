"use client";

import {
  Bot,
  ChartNoAxesCombined,
  CheckCircle2,
  CircleAlert,
  History,
  Sparkles,
  TrendingDown,
  TrendingUp,
} from "lucide-react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { AppShell, EmptyState, GlassCard, LoadingState } from "@/src/components/satomi";
import { Button } from "@/src/components/ui/button";
import { formatCurrency } from "@/src/lib/satomi-finance";
import { buildInsightsViewModel } from "@/src/lib/satomi-analytics";
import { type InsightTone } from "@/src/lib/satomi-insights-data";
import { useFinanceSnapshot } from "@/src/lib/supabase/use-finance-snapshot";
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

const chartColor: Record<InsightTone, string> = {
  cyan: "#00f0ff",
  purple: "#cf5cff",
  green: "#10b981",
  amber: "#ffcf75",
  error: "#fb7185",
};

export function InsightsExperience() {
  const { snapshot, isLoading, error, refresh } = useFinanceSnapshot();

  if (isLoading) {
    return (
      <AppShell activePath="/insights">
        <LoadingState
          variant="skeleton"
          title="Satomi sedang membaca insight..."
          description="Menyiapkan analisis pola transaksi dan pengeluaranmu."
        />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell activePath="/insights">
        <GlassCard className="mx-auto max-w-2xl p-8 text-center md:p-12">
          <div className="mx-auto mb-6 flex size-24 items-center justify-center rounded-full border border-satomi-error/30 bg-satomi-error/10 text-satomi-error">
            <CircleAlert className="size-10" />
          </div>
          <h1 className="font-display text-4xl font-extrabold text-satomi-text">
            Insight belum bisa dimuat
          </h1>
          <p className="mt-4 text-base leading-7 text-satomi-muted">{error}</p>
          <Button className="mt-8" onClick={() => void refresh()}>
            Coba Lagi
          </Button>
        </GlassCard>
      </AppShell>
    );
  }

  const transactions = snapshot?.transactions ?? [];
  const pockets = snapshot?.pockets ?? [];
  const goals = snapshot?.goals ?? [];
  const bills = snapshot?.bills ?? [];
  const nudges = snapshot?.nudges ?? [];
  const insights = buildInsightsViewModel({
    transactions,
    pockets,
    goals,
    bills,
    nudges,
  });

  if (!insights.hasEnoughData) {
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
        <EmptyState
          title="Belum ada data yang cukup"
          description="Catat beberapa transaksi dulu agar Satomi bisa membangun insight kategori, tren mingguan, dan nudge yang benar-benar berguna."
          primaryAction={{ label: "Buka Transaksi", href: "/transactions" }}
        />
      </AppShell>
    );
  }

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

      <AiRecommendationCard recommendation={insights.aiInsightRecommendation} />

      <section className="grid gap-5 xl:grid-cols-[0.85fr_1.15fr]">
        <SpendingDonut categoryInsights={insights.categoryInsights} />
        <WeeklyTrend points={insights.weeklyTrend} />
      </section>

      <GlassCard className="p-5 md:p-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="font-mono text-xs font-semibold uppercase tracking-[0.24em] text-satomi-muted">
              Minggu ini vs minggu lalu
            </p>
            <p className="mt-2 text-lg text-satomi-text">
              {insights.weeklyComparison.summary}
            </p>
          </div>
          <div
            className={cn(
              "inline-flex w-fit items-center gap-2 rounded-full px-4 py-2",
              insights.weeklyComparison.isUp
                ? "border border-satomi-error/35 bg-satomi-error/12 text-satomi-error"
                : "border border-satomi-green/30 bg-satomi-green/12 text-satomi-green",
            )}
          >
            {insights.weeklyComparison.isUp ? (
              <TrendingUp className="size-4" />
            ) : (
              <TrendingDown className="size-4" />
            )}
            <span className="font-mono text-xs font-semibold uppercase tracking-[0.14em]">
              {insights.weeklyComparison.percent >= 0 ? "+" : ""}
              {insights.weeklyComparison.percent}%
            </span>
          </div>
        </div>
        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          <MiniMetric label="Minggu ini" value={formatCurrency(insights.weeklyComparison.thisWeekTotal)} />
          <MiniMetric label="Minggu lalu" value={formatCurrency(insights.weeklyComparison.lastWeekTotal)} />
        </div>
      </GlassCard>

      <section className="grid gap-5 xl:grid-cols-[1.05fr_0.95fr]">
        <CategoryBreakdown categoryInsights={insights.categoryInsights} />
        <PositiveReinforcement positiveReinforcements={insights.positiveReinforcements} />
      </section>

      <section className="grid gap-5 xl:grid-cols-[0.9fr_1.1fr]">
        <TopCategories categories={insights.topSpendingCategories} />
        <NudgeHistory nudgeHistory={insights.nudgeHistory} />
      </section>
    </AppShell>
  );
}

function AiRecommendationCard({ recommendation }: { recommendation: string }) {
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
          <p className="mt-3 max-w-4xl text-lg leading-8 text-satomi-text">{recommendation}</p>
        </div>
      </div>
    </GlassCard>
  );
}

function SpendingDonut({
  categoryInsights,
}: {
  categoryInsights: ReturnType<typeof buildInsightsViewModel>["categoryInsights"];
}) {
  const topCategory = categoryInsights[0];

  return (
    <GlassCard className="p-6 md:p-8">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="font-mono text-xs font-semibold uppercase tracking-[0.24em] text-satomi-muted">
          Pengeluaran per Kategori
        </h2>
        <Sparkles className="size-5 text-satomi-cyan" />
      </div>
      <div className="flex flex-col items-center">
        <div className="h-56 w-full max-w-[280px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={categoryInsights}
                dataKey="amountNumber"
                nameKey="label"
                innerRadius={70}
                outerRadius={106}
                paddingAngle={2}
                stroke="transparent"
              >
                {categoryInsights.map((item) => (
                  <Cell key={item.label} fill={chartColor[item.tone]} />
                ))}
              </Pie>
              <Tooltip content={<InsightTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </div>
        {topCategory ? (
          <div className="-mt-32 text-center">
            <p className="font-display text-5xl font-extrabold text-satomi-text">
              {topCategory.percent}%
            </p>
            <p className="mt-1 font-mono text-xs font-semibold uppercase tracking-[0.18em] text-satomi-muted">
              {topCategory.label}
            </p>
          </div>
        ) : null}
        <div className="mt-20 grid w-full grid-cols-2 gap-3">
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

function WeeklyTrend({
  points,
}: {
  points: ReturnType<typeof buildInsightsViewModel>["weeklyTrend"];
}) {
  return (
    <GlassCard className="p-6 md:p-8">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="font-mono text-xs font-semibold uppercase tracking-[0.24em] text-satomi-muted">
          Tren Pengeluaran Mingguan
        </h2>
        <ChartNoAxesCombined className="size-5 text-satomi-cyan" />
      </div>
      <div className="h-72 w-full overflow-hidden rounded-2xl border border-white/10 bg-black/20 p-2 sm:p-4">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={points} margin={{ top: 12, right: 6, left: -18, bottom: 0 }}>
            <defs>
              <linearGradient id="satomiTrendFill" x1="0" x2="0" y1="0" y2="1">
                <stop offset="5%" stopColor="#7df4ff" stopOpacity={0.35} />
                <stop offset="95%" stopColor="#7df4ff" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid stroke="rgba(255,255,255,0.08)" vertical={false} />
            <XAxis
              dataKey="day"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#8ea0b8", fontSize: 11 }}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#8ea0b8", fontSize: 11 }}
              tickFormatter={(value: number) => (value === 0 ? "0" : `${Math.round(value / 1000)}k`)}
              width={34}
            />
            <Tooltip content={<InsightTooltip />} />
            <Area
              type="monotone"
              dataKey="amountNumber"
              stroke="#00f0ff"
              strokeWidth={3}
              fill="url(#satomiTrendFill)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </GlassCard>
  );
}

function CategoryBreakdown({
  categoryInsights,
}: {
  categoryInsights: ReturnType<typeof buildInsightsViewModel>["categoryInsights"];
}) {
  return (
    <GlassCard className="p-6 md:p-8">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="font-display text-2xl font-extrabold text-satomi-text">Rincian Kategori</h2>
        <span className="font-mono text-xs font-semibold uppercase tracking-[0.18em] text-satomi-muted">
          Bulan ini
        </span>
      </div>
      <div className="grid gap-4">
        {categoryInsights.length === 0 ? (
          <div className="rounded-2xl border border-white/10 bg-black/20 p-4 text-sm text-satomi-muted">
            Belum ada pengeluaran bulan ini untuk diringkas per kategori.
          </div>
        ) : (
          categoryInsights.map((category) => {
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
                    <div className="min-w-0">
                      <p className="truncate font-semibold text-satomi-text">{category.label}</p>
                      <p className="text-sm text-satomi-muted">{category.amount}</p>
                    </div>
                  </div>
                  <p className="font-mono text-xs font-semibold text-satomi-muted">{category.percent}%</p>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-white/12">
                  <div
                    className={cn("h-full rounded-full", toneBg[category.tone])}
                    style={{ width: `${Math.min(category.percent, 100)}%` }}
                  />
                </div>
              </div>
            );
          })
        )}
      </div>
    </GlassCard>
  );
}

function PositiveReinforcement({
  positiveReinforcements,
}: {
  positiveReinforcements: ReturnType<typeof buildInsightsViewModel>["positiveReinforcements"];
}) {
  return (
    <GlassCard className="p-6 md:p-8">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="font-display text-2xl font-extrabold text-satomi-text">Penguatan Positif</h2>
        <CheckCircle2 className="size-5 text-satomi-green" />
      </div>
      <div className="grid gap-4">
        {positiveReinforcements.length === 0 ? (
          <div className="rounded-2xl border border-white/10 bg-black/20 p-4 text-sm text-satomi-muted">
            Belum ada sinyal positif yang cukup untuk dirayakan. Setelah data bertambah, Satomi akan menampilkan pencapaian kecilmu di sini.
          </div>
        ) : (
          positiveReinforcements.map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.id} className="rounded-2xl border border-satomi-green/25 bg-satomi-green/8 p-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex gap-3">
                    <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-satomi-green/12 text-satomi-green">
                      <Icon className="size-5" />
                    </div>
                    <div>
                      <p className="font-semibold text-satomi-text">{item.title}</p>
                      <p className="mt-1 text-sm leading-6 text-satomi-muted">{item.description}</p>
                    </div>
                  </div>
                  <span className="rounded-full border border-satomi-green/25 bg-satomi-green/12 px-3 py-1 font-mono text-[10px] font-semibold uppercase tracking-[0.12em] text-satomi-green">
                    {item.value}
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>
    </GlassCard>
  );
}

function TopCategories({
  categories,
}: {
  categories: ReturnType<typeof buildInsightsViewModel>["topSpendingCategories"];
}) {
  return (
    <GlassCard className="p-6 md:p-8">
      <div className="mb-5 flex items-center gap-3">
        <Sparkles className="size-5 text-satomi-cyan" />
        <h2 className="font-display text-2xl font-extrabold text-satomi-text">Kategori Teratas</h2>
      </div>
      <div className="grid gap-3">
        {categories.length === 0 ? (
          <div className="rounded-2xl border border-white/10 bg-black/20 p-4 text-sm text-satomi-muted">
            Belum ada kategori pengeluaran yang menonjol bulan ini.
          </div>
        ) : (
          categories.map((category, index) => (
            <div key={category.label} className="flex items-center gap-4 rounded-2xl border border-white/10 bg-black/20 p-4">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-full border border-white/10 bg-black/25 font-display text-lg font-extrabold text-satomi-text">
                {index + 1}
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-semibold text-satomi-text">{category.label}</p>
                <p className="mt-1 text-sm text-satomi-muted">{category.amount}</p>
              </div>
              <div className="text-right">
                <p className="font-display text-xl font-extrabold text-satomi-text">{category.percent}%</p>
              </div>
            </div>
          ))
        )}
      </div>
    </GlassCard>
  );
}

function NudgeHistory({
  nudgeHistory,
}: {
  nudgeHistory: ReturnType<typeof buildInsightsViewModel>["nudgeHistory"];
}) {
  return (
    <section>
      <div className="mb-4 flex items-center gap-3">
        <History className="size-5 text-satomi-cyan" />
        <h2 className="font-display text-3xl font-extrabold text-satomi-text">Riwayat Nudge</h2>
      </div>
      <div className="grid gap-3">
        {nudgeHistory.length === 0 ? (
          <GlassCard className="p-4">
            <p className="text-sm leading-6 text-satomi-muted">
              Belum ada riwayat nudge yang tersimpan. Saat SATOMI mulai memberi peringatan atau dorongan kontekstual, jejaknya akan muncul di sini.
            </p>
          </GlassCard>
        ) : (
          nudgeHistory.map((nudge) => {
            const Icon = nudge.icon;
            return (
              <GlassCard key={nudge.id} className={cn("border-l-2 p-4", toneBorder[nudge.tone])}>
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
                    <p className="mt-1 text-sm leading-6 text-satomi-muted">{nudge.description}</p>
                  </div>
                  <span className="hidden whitespace-nowrap font-mono text-xs text-satomi-muted sm:block">
                    {nudge.time}
                  </span>
                </div>
                <span className="mt-3 block font-mono text-xs text-satomi-muted sm:hidden">{nudge.time}</span>
              </GlassCard>
            );
          })
        )}
      </div>
    </section>
  );
}

function MiniMetric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
      <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-satomi-muted">{label}</p>
      <p className="mt-2 font-semibold text-satomi-text">{value}</p>
    </div>
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

function InsightTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: Array<{ name?: string; value?: number; payload?: { amount?: string; label?: string; day?: string } }>;
  label?: string;
}) {
  if (!active || !payload?.length) return null;

  const item = payload[0];
  const title = item.payload?.label ?? label ?? item.name ?? "Data";
  const value =
    item.payload?.amount ??
    (typeof item.value === "number" ? formatCurrency(item.value) : "Tidak ada data");

  return (
    <div className="rounded-2xl border border-white/10 bg-[rgba(10,14,24,0.96)] px-3 py-2 text-sm text-satomi-text shadow-[0_20px_40px_rgba(0,0,0,0.38)] backdrop-blur-xl">
      <p className="font-semibold">{title}</p>
      <p className="mt-1 text-satomi-muted">{value}</p>
    </div>
  );
}
