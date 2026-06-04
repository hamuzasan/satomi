"use client";

import {
  Bot,
  CircleAlert,
  Goal,
  Plus,
  ReceiptText,
  Send,
} from "lucide-react";
import Link from "next/link";
import { AppShell, GlassCard, LoadingState, StatCard } from "@/src/components/satomi";
import {
  billsDueSoon,
  dashboardGoal,
  type DashboardTone,
} from "@/src/lib/satomi-dashboard-data";
import {
  buildDashboardPockets,
  buildDashboardRecentTransactions,
  buildDashboardSummary,
  buildPocketNudge,
  mapPocketRowToRecord,
} from "@/src/lib/satomi-finance";
import { useFinanceSnapshot } from "@/src/lib/supabase/use-finance-snapshot";
import { cn } from "@/src/lib/utils";

const toneText: Record<DashboardTone, string> = {
  cyan: "text-satomi-cyan",
  purple: "text-satomi-purple-soft",
  green: "text-satomi-green",
  amber: "text-satomi-amber",
  error: "text-satomi-error",
};

const toneBg: Record<DashboardTone, string> = {
  cyan: "bg-satomi-cyan",
  purple: "bg-satomi-purple-soft",
  green: "bg-satomi-green",
  amber: "bg-satomi-amber",
  error: "bg-satomi-error",
};

const toneSoft: Record<DashboardTone, string> = {
  cyan: "bg-satomi-cyan/12 border-satomi-cyan/25",
  purple: "bg-satomi-purple/12 border-satomi-purple/25",
  green: "bg-satomi-green/12 border-satomi-green/25",
  amber: "bg-satomi-amber/12 border-satomi-amber/25",
  error: "bg-satomi-error/12 border-satomi-error/25",
};

export function DashboardExperience() {
  const { snapshot, isLoading, error, refresh } = useFinanceSnapshot();

  if (isLoading) {
    return (
      <AppShell activePath="/dashboard" className="gap-5 md:gap-6">
        <LoadingState
          variant="skeleton"
          title="Satomi sedang membaca datamu..."
          description="Menyiapkan ringkasan keuangan personal."
        />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell activePath="/dashboard" className="gap-5 md:gap-6">
        <GlassCard className="mx-auto max-w-2xl p-8 text-center md:p-12">
          <div className="mx-auto mb-6 flex size-24 items-center justify-center rounded-full border border-satomi-error/30 bg-satomi-error/10 text-satomi-error">
            <CircleAlert className="size-10" />
          </div>
          <h1 className="font-display text-4xl font-extrabold text-satomi-text">
            Dashboard belum bisa dimuat
          </h1>
          <p className="mt-4 text-base leading-7 text-satomi-muted">{error}</p>
          <button
            type="button"
            onClick={() => void refresh()}
            className="mt-8 inline-flex min-h-12 items-center justify-center rounded-2xl bg-satomi-cyan px-6 font-mono text-xs font-bold uppercase tracking-[0.18em] text-satomi-bg transition hover:bg-satomi-cyan-soft"
          >
            Coba Lagi
          </button>
        </GlassCard>
      </AppShell>
    );
  }

  const pockets = snapshot?.pockets ?? [];
  const transactions = snapshot?.transactions ?? [];
  const pocketRecords = pockets.map((pocket) => mapPocketRowToRecord(pocket, transactions));
  const summary = buildDashboardSummary(transactions, pocketRecords);
  const pocketCards = buildDashboardPockets(pocketRecords);
  const pocketNameById = new Map(pockets.map((pocket) => [pocket.id, pocket.name]));
  const recentTransactions = buildDashboardRecentTransactions(transactions, pocketNameById);
  const nudgeMessage = buildPocketNudge(pocketRecords);
  const profileName = snapshot?.profileName?.trim() || "Kamu";
  const budgetLeft = summary[2]?.value ?? "Rp0";
  const income = summary[0]?.value ?? "Rp0";
  const expense = summary[1]?.value ?? "Rp0";
  const healthScore = Math.max(20, 100 - (pocketRecords.filter((pocket) => pocket.progress >= 70).length * 12));

  return (
    <AppShell activePath="/dashboard" className="gap-5 md:gap-6">
      <section className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
        <div>
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-satomi-cyan/35 bg-satomi-cyan/10 px-3 py-1 md:hidden">
            <span className="size-2 rounded-full bg-satomi-cyan shadow-[0_0_12px_rgba(0,240,255,0.9)]" />
            <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-satomi-cyan">
              Satomi aktif
            </span>
          </div>
          <h1 className="font-display text-[34px] font-extrabold leading-tight tracking-normal text-satomi-text md:text-5xl">
            Halo, {profileName}
          </h1>
          <p className="mt-1 text-base leading-7 text-satomi-muted">
            Ini ringkasan keuanganmu dari data Supabase yang aktif saat ini.
          </p>
        </div>
        <div className="hidden items-center gap-2 rounded-full border border-satomi-cyan/35 bg-satomi-cyan/10 px-4 py-2 md:flex">
          <span className="size-2 rounded-full bg-satomi-cyan shadow-[0_0_12px_rgba(0,240,255,0.9)]" />
          <span className="font-mono text-xs font-semibold uppercase tracking-[0.2em] text-satomi-cyan">
            Satomi aktif
          </span>
        </div>
      </section>

      <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {summary.map((item) => (
          <StatCard
            key={item.label}
            label={item.label}
            value={item.value}
            detail={item.detail}
            tone={item.tone}
            icon={item.icon}
          />
        ))}
      </section>

      <section className="grid gap-5 xl:grid-cols-[1.25fr_0.75fr]">
        <div className="flex flex-col gap-5">
          <GlassCard variant="featured" className="p-5 md:p-6">
            <div className="relative z-10">
              <div className="flex items-start justify-between gap-5">
                <div>
                  <p className="font-mono text-xs font-semibold uppercase tracking-[0.24em] text-satomi-muted">
                    Sisa Budget Aktif
                  </p>
                  <p className="mt-2 font-display text-4xl font-extrabold tracking-normal text-satomi-text md:text-5xl">
                    {budgetLeft}
                  </p>
                </div>
                <div className="hidden rounded-full border border-satomi-cyan/30 bg-satomi-cyan/10 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.2em] text-satomi-cyan md:block">
                  {pocketRecords.length > 0 ? "Sinkron" : "Kosong"}
                </div>
              </div>

              <div className="mt-6 grid gap-4 md:grid-cols-[1fr_190px] md:items-center">
                <div className="grid gap-3">
                  <MoneyRow label="Pemasukan" value={income} tone="green" />
                  <MoneyRow label="Pengeluaran" value={expense} tone="purple" />
                </div>
                <div className="flex flex-col items-center border-t border-white/10 pt-5 md:border-l md:border-t-0 md:pt-0">
                  <div className="relative flex size-36 items-center justify-center rounded-full">
                    <div className="absolute inset-0 rounded-full bg-conic/[from_0deg] from-satomi-cyan via-satomi-cyan to-white/10 shadow-[0_0_34px_rgba(0,240,255,0.18)]" />
                    <div className="absolute inset-3 rounded-full bg-satomi-surface" />
                    <div className="relative text-center">
                      <p className="font-display text-4xl font-extrabold text-satomi-text">
                        {healthScore}
                      </p>
                      <p className="font-mono text-[10px] text-satomi-muted">
                        /100
                      </p>
                    </div>
                  </div>
                  <p className="mt-3 font-mono text-xs font-semibold uppercase tracking-[0.22em] text-satomi-cyan-pale">
                    Skor sehat
                  </p>
                </div>
              </div>
            </div>
          </GlassCard>

          <GlassCard className="p-4">
            <form className="flex flex-col gap-3 sm:flex-row">
              <label className="sr-only" htmlFor="quick-transaction">
                Catat transaksi cepat
              </label>
              <div className="flex min-h-14 flex-1 items-center gap-3 rounded-2xl border border-satomi-outline/40 bg-black/25 px-4 focus-within:border-satomi-cyan/60 focus-within:shadow-[0_0_24px_rgba(0,240,255,0.12)]">
                <Bot className="size-5 shrink-0 text-satomi-cyan" />
                <input
                  id="quick-transaction"
                  className="w-full border-0 bg-transparent text-sm text-satomi-text outline-none placeholder:text-satomi-muted/60"
                  placeholder="Contoh: keluar 25 ribu buat kopi"
                />
              </div>
              <button
                type="button"
                className="inline-flex min-h-14 items-center justify-center gap-2 rounded-2xl bg-satomi-cyan px-5 font-mono text-xs font-bold uppercase tracking-[0.2em] text-satomi-bg shadow-[0_0_26px_rgba(0,240,255,0.28)] transition hover:bg-satomi-cyan-soft"
              >
                <Send className="size-4" />
                Catat
              </button>
            </form>
          </GlassCard>

          <GlassCard variant="warning" className="p-5 md:p-6">
            <div className="flex gap-4">
              <div className="flex size-11 shrink-0 items-center justify-center rounded-full border border-satomi-error/35 bg-satomi-error/15 text-satomi-error">
                <CircleAlert className="size-5" />
              </div>
              <div>
                <p className="font-mono text-xs font-semibold uppercase tracking-[0.22em] text-satomi-error">
                  Catatan Satomi
                </p>
                <p className="mt-3 leading-7 text-satomi-text">
                  {nudgeMessage}
                </p>
              </div>
            </div>
          </GlassCard>

          <DashboardSection
            title="Smart Pockets"
            action={pocketCards.length > 0 ? "Lihat Semua" : undefined}
            actionHref="/pockets"
            className="grid gap-3 sm:grid-cols-2"
          >
            {pocketCards.length === 0 ? (
              <div className="rounded-2xl border border-white/10 bg-black/20 p-4 text-sm text-satomi-muted sm:col-span-2">
                Belum ada pocket aktif. Tambahkan pocket pertama agar Satomi bisa membaca alokasi.
              </div>
            ) : (
              pocketCards.map((pocket) => <PocketOverview key={pocket.name} pocket={pocket} />)
            )}
          </DashboardSection>
        </div>

        <aside className="flex flex-col gap-5">
          <DashboardSection title="Aktivitas Terakhir">
            <div className="grid gap-3">
              {recentTransactions.length === 0 ? (
                <div className="rounded-2xl border border-white/10 bg-black/20 p-4 text-sm text-satomi-muted">
                  Belum ada transaksi. Catat transaksi pertama untuk melihat aktivitas terbaru di sini.
                </div>
              ) : (
                recentTransactions.map((transaction) => {
                  const Icon = transaction.icon;

                  return (
                    <div
                      key={`${transaction.name}-${transaction.amount}`}
                      className="flex items-center gap-3 rounded-2xl border border-white/10 bg-black/20 p-3"
                    >
                      <div
                        className={cn(
                          "flex size-11 shrink-0 items-center justify-center rounded-full border",
                          transaction.type === "income"
                            ? "border-satomi-green/25 bg-satomi-green/12 text-satomi-green"
                            : "border-satomi-cyan/20 bg-satomi-surface-high/70 text-satomi-cyan-pale",
                        )}
                      >
                        <Icon className="size-5" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate font-semibold text-satomi-text">
                          {transaction.name}
                        </p>
                        <p className="text-xs text-satomi-muted">
                          {transaction.meta}
                        </p>
                      </div>
                      <p
                        className={cn(
                          "whitespace-nowrap font-semibold",
                          transaction.type === "income"
                            ? "text-satomi-green"
                            : "text-satomi-text",
                        )}
                      >
                        {transaction.amount}
                      </p>
                    </div>
                  );
                })
              )}
            </div>
          </DashboardSection>

          <GlassCard className="p-5 md:p-6">
            <div className="mb-5 flex items-center justify-between gap-4">
              <div>
                <p className="font-mono text-xs font-semibold uppercase tracking-[0.22em] text-satomi-muted">
                  Target Finansial
                </p>
                <h2 className="mt-2 text-xl font-semibold text-satomi-text">
                  {dashboardGoal.name}
                </h2>
              </div>
              <Goal className="size-7 text-satomi-cyan-pale" />
            </div>
            <div className="flex items-end justify-between gap-4">
              <p className="font-display text-4xl font-extrabold text-satomi-text">
                {dashboardGoal.progress}%
              </p>
              <p className="text-right text-sm text-satomi-muted">
                {dashboardGoal.amount}
                <br />/ {dashboardGoal.target}
              </p>
            </div>
            <div className="mt-4 h-3 overflow-hidden rounded-full bg-white/12">
              <div
                className="h-full rounded-full bg-gradient-to-r from-satomi-cyan to-satomi-purple shadow-[0_0_18px_rgba(0,240,255,0.32)]"
                style={{ width: `${dashboardGoal.progress}%` }}
              />
            </div>
          </GlassCard>

          <DashboardSection title="Tagihan Terdekat">
            <div className="grid gap-3">
              {billsDueSoon.map((bill) => (
                <div
                  key={bill.name}
                  className="rounded-2xl border border-white/10 bg-black/20 p-4"
                >
                  <div className="flex items-start gap-3">
                    <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-satomi-amber/12 text-satomi-amber">
                      <ReceiptText className="size-5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-semibold text-satomi-text">{bill.name}</p>
                      <p className="mt-1 text-sm text-satomi-muted">{bill.due}</p>
                    </div>
                    <p className="whitespace-nowrap font-semibold text-satomi-text">
                      {bill.amount}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </DashboardSection>
        </aside>
      </section>
    </AppShell>
  );
}

function MoneyRow({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone: DashboardTone;
}) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-2xl border border-white/10 bg-black/20 p-3">
      <div className="flex items-center gap-3">
        <span
          className={cn(
            "flex size-9 items-center justify-center rounded-full border",
            toneSoft[tone],
            toneText[tone],
          )}
        >
          <Plus className="size-4" />
        </span>
        <span className="text-sm text-satomi-muted">{label}</span>
      </div>
      <span className="font-semibold text-satomi-text">{value}</span>
    </div>
  );
}

function DashboardSection({
  title,
  action,
  actionHref = "#",
  className,
  children,
}: {
  title: string;
  action?: string;
  actionHref?: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <GlassCard className="p-5 md:p-6">
      <div className="mb-5 flex items-center justify-between gap-4">
        <h2 className="font-mono text-xs font-semibold uppercase tracking-[0.24em] text-satomi-muted">
          {title}
        </h2>
        {action ? (
          <Link
            href={actionHref}
            className="inline-flex min-h-11 items-center justify-center rounded-xl px-3 text-sm font-medium text-satomi-text transition hover:bg-white/5 hover:text-satomi-cyan"
          >
            {action}
          </Link>
        ) : null}
      </div>
      <div className={className}>{children}</div>
    </GlassCard>
  );
}

function PocketOverview({
  pocket,
}: {
  pocket: ReturnType<typeof buildDashboardPockets>[number];
}) {
  const Icon = pocket.icon;

  return (
    <div
      className={cn(
        "rounded-2xl border bg-black/20 p-4",
        pocket.progress >= 85
          ? "border-satomi-purple/40 shadow-[0_0_24px_rgba(207,92,255,0.12)]"
          : "border-white/10",
      )}
    >
      <div className="mb-4 flex items-start justify-between gap-3">
        <div
          className={cn(
            "flex size-10 items-center justify-center rounded-xl border",
            toneSoft[pocket.tone],
            toneText[pocket.tone],
          )}
        >
          <Icon className="size-5" />
        </div>
        <span className={cn("font-mono text-xs font-bold", toneText[pocket.tone])}>
          {pocket.progress}%
        </span>
      </div>
      <h3 className="font-semibold text-satomi-text">{pocket.name}</h3>
      <p className="mt-1 text-sm text-satomi-muted">
        {pocket.amount} / {pocket.limit}
      </p>
      <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/12">
        <div
          className={cn(
            "h-full rounded-full shadow-[0_0_14px_rgba(0,240,255,0.35)]",
            toneBg[pocket.tone],
          )}
          style={{ width: `${Math.min(pocket.progress, 100)}%` }}
        />
      </div>
    </div>
  );
}
