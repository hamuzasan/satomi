"use client";

import { ArrowLeft, Bot, Coffee, LineChart, Pencil, TrendingUp } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { AppShell, EmptyState, GlassCard, LoadingState } from "@/src/components/satomi";
import {
  buildPocketNudge,
  mapPocketRowToRecord,
  mapTransactionRowToRecord,
} from "@/src/lib/satomi-finance";
import {
  deletePocketIfSafe,
  updatePocket,
  type PocketInput,
} from "@/src/lib/supabase/finance";
import { createSupabaseBrowserClient } from "@/src/lib/supabase/client";
import { useFinanceSnapshot } from "@/src/lib/supabase/use-finance-snapshot";
import type { Tables } from "@/src/lib/supabase/types";
import { cn } from "@/src/lib/utils";
import { PocketModal, StatusChip } from "../pockets-experience";

export function PocketDetailExperience({ pocketId }: { pocketId: string }) {
  const router = useRouter();
  const { snapshot, isLoading, error, refresh } = useFinanceSnapshot();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isMutating, setIsMutating] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [statusTone, setStatusTone] = useState<"success" | "error">("success");
  const supabase = useMemo(() => createSupabaseBrowserClient(), []);

  const pocket = snapshot?.pockets.find((item) => item.id === pocketId) ?? null;
  const relatedTransactions = useMemo(
    () => snapshot?.transactions.filter((transaction) => transaction.pocket_id === pocketId) ?? [],
    [pocketId, snapshot?.transactions],
  );
  const pocketRecord = useMemo(
    () => (pocket ? mapPocketRowToRecord(pocket, snapshot?.transactions ?? []) : null),
    [pocket, snapshot?.transactions],
  );
  const pocketNameById = useMemo(
    () => new Map((snapshot?.pockets ?? []).map((item) => [item.id, item.name])),
    [snapshot?.pockets],
  );
  const transactionCards = useMemo(
    () =>
      relatedTransactions
        .slice(0, 8)
        .map((transaction) => mapTransactionRowToRecord(transaction, pocketNameById)),
    [pocketNameById, relatedTransactions],
  );

  async function handleUpdate(input: PocketInput) {
    if (!pocket) return;

    setIsMutating(true);
    setStatusMessage(null);

    try {
      await updatePocket(supabase, pocket.id, input);
      await refresh();
      setStatusTone("success");
      setStatusMessage("Pocket berhasil diperbarui.");
      setIsModalOpen(false);
    } catch (error) {
      setStatusTone("error");
      setStatusMessage(error instanceof Error ? error.message : "Pocket belum berhasil diperbarui.");
    } finally {
      setIsMutating(false);
    }
  }

  async function handleDelete() {
    if (!pocket) return;

    setIsMutating(true);
    setStatusMessage(null);

    try {
      await deletePocketIfSafe(supabase, pocket.id);
      router.replace("/pockets");
      router.refresh();
    } catch (error) {
      setStatusTone("error");
      setStatusMessage(error instanceof Error ? error.message : "Pocket belum berhasil dihapus.");
    } finally {
      setIsMutating(false);
    }
  }

  if (isLoading) {
    return (
      <AppShell activePath="/pockets">
        <LoadingState
          variant="skeleton"
          title="Satomi sedang membuka pocket..."
          description="Menyiapkan detail Smart Pocket dari Supabase."
        />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell activePath="/pockets">
        <EmptyState
          title="Pocket belum bisa dimuat"
          description={error}
          primaryAction={{ label: "Kembali ke Pockets", href: "/pockets" }}
        />
      </AppShell>
    );
  }

  if (!pocket || !pocketRecord) {
    return (
      <AppShell activePath="/pockets">
        <EmptyState
          title="Pocket tidak ditemukan"
          description="Pocket ini belum tersedia atau sudah dihapus. Kembali ke daftar Smart Pockets untuk melihat data terbaru."
          primaryAction={{ label: "Lihat Pockets", href: "/pockets" }}
        />
      </AppShell>
    );
  }

  return (
    <AppShell activePath="/pockets">
      {statusMessage ? (
        <div
          className={cn(
            "rounded-2xl border px-4 py-3 text-sm leading-6",
            statusTone === "success"
              ? "border-emerald-400/30 bg-emerald-400/10 text-emerald-100"
              : "border-rose-400/30 bg-rose-400/10 text-rose-100",
          )}
        >
          {statusMessage}
        </div>
      ) : null}

      <section className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
        <div>
          <Link
            href="/pockets"
            className="mb-4 inline-flex items-center gap-2 text-sm text-satomi-muted transition hover:text-satomi-cyan"
          >
            <ArrowLeft className="size-4" />
            Kembali ke Smart Pockets
          </Link>
          <div className="mb-2 flex items-center gap-2 text-satomi-purple-soft">
            <Coffee className="size-5" />
            <span className="font-mono text-xs font-semibold uppercase tracking-[0.24em]">
              Pocket Detail
            </span>
          </div>
          <h1 className="font-display text-4xl font-extrabold leading-tight tracking-normal text-satomi-text md:text-6xl">
            {pocketRecord.name}
          </h1>
        </div>
        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-white/20 bg-black/20 px-6 font-mono text-xs font-bold uppercase tracking-[0.18em] text-satomi-text transition hover:border-satomi-cyan/40 hover:text-satomi-cyan"
        >
          <Pencil className="size-4" />
          Edit Pocket
        </button>
      </section>

      <section className="grid gap-5 xl:grid-cols-[0.95fr_1.05fr]">
        <PocketRing pocket={pocketRecord} />
        <div className="flex flex-col gap-5">
          <AiNudgePanel message={buildPocketNudge([pocketRecord])} />
          <TrendPanel transactions={relatedTransactions} />
        </div>
      </section>

      <GlassCard className="p-5 md:p-6">
        <div className="mb-5 flex items-center justify-between gap-4">
          <h2 className="font-mono text-xs font-semibold uppercase tracking-[0.24em] text-satomi-muted">
            Transaksi Terkait
          </h2>
          <Link
            href="/transactions"
            className="text-sm font-medium text-satomi-text transition hover:text-satomi-cyan"
          >
            Lihat Semua
          </Link>
        </div>
        <div className="grid gap-3">
          {transactionCards.length === 0 ? (
            <div className="rounded-2xl border border-white/10 bg-black/20 p-4 text-sm text-satomi-muted">
              Belum ada transaksi yang terhubung ke pocket ini.
            </div>
          ) : (
            transactionCards.map((transaction) => {
              const Icon = transaction.icon;
              return (
                <div
                  key={transaction.id}
                  className="flex items-center gap-4 rounded-2xl border border-white/10 bg-black/20 p-4"
                >
                  <div className="flex size-11 shrink-0 items-center justify-center rounded-full bg-satomi-purple/12 text-satomi-purple-soft">
                    <Icon className="size-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-satomi-text">
                      {transaction.name}
                    </p>
                    <p className="mt-1 text-sm text-satomi-muted">
                      {transaction.dateGroup}, {transaction.time}
                    </p>
                  </div>
                  <p className="whitespace-nowrap font-semibold text-satomi-text">
                    {transaction.amount}
                  </p>
                </div>
              );
            })
          )}
        </div>
      </GlassCard>

      <PocketModal
        key={pocket.id}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Edit Pocket"
        mode="edit"
        pocket={pocket}
        isBusy={isMutating}
        onSubmit={handleUpdate}
        onDelete={handleDelete}
      />
    </AppShell>
  );
}

function PocketRing({
  pocket,
}: {
  pocket: ReturnType<typeof mapPocketRowToRecord>;
}) {
  return (
    <GlassCard
      variant="warning"
      className="flex flex-col items-center justify-center p-6 md:p-8"
    >
      <div className="mb-4 self-end">
        <StatusChip status={pocket.status} />
      </div>
      <div className="relative flex size-72 items-center justify-center rounded-full">
        <div
          className="absolute inset-0 rounded-full shadow-[0_0_48px_rgba(207,92,255,0.22)]"
          style={{
            background: `conic-gradient(#ecb2ff 0deg, #cf5cff ${
              Math.min(pocket.progress, 100) * 3.6
            }deg, rgba(255,255,255,0.08) ${Math.min(pocket.progress, 100) * 3.6}deg)`,
          }}
        />
        <div className="absolute inset-6 rounded-full bg-satomi-surface" />
        <div className="relative text-center">
          <p className="font-mono text-xs font-semibold uppercase tracking-[0.22em] text-satomi-muted">
            Terpakai
          </p>
          <p className="mt-2 font-display text-4xl font-extrabold text-satomi-text">
            {pocket.used}
          </p>
          <div className="mx-auto my-4 h-px w-14 bg-white/20" />
          <p className="font-mono text-xs font-semibold uppercase tracking-[0.22em] text-satomi-muted">
            Sisa
          </p>
          <p className="mt-1 text-satomi-text">{pocket.remaining}</p>
        </div>
      </div>
      <div className="mt-7 flex w-full items-center justify-between rounded-2xl border border-white/10 bg-black/30 p-4">
        <span className="font-mono text-xs font-semibold uppercase tracking-[0.2em] text-satomi-muted">
          Limit Bulan Ini
        </span>
        <span className="font-semibold text-satomi-text">{pocket.limit}</span>
      </div>
    </GlassCard>
  );
}

function AiNudgePanel({ message }: { message: string }) {
  return (
    <GlassCard className="p-5 md:p-6">
      <div className="flex gap-4">
        <div className="flex size-11 shrink-0 items-center justify-center rounded-full border border-satomi-cyan/30 bg-satomi-cyan/12 text-satomi-cyan">
          <Bot className="size-5" />
        </div>
        <div>
          <p className="font-mono text-xs font-semibold uppercase tracking-[0.24em] text-satomi-cyan">
            Satomi Insight
          </p>
          <p className="mt-3 leading-7 text-satomi-text">{message}</p>
        </div>
      </div>
    </GlassCard>
  );
}

function TrendPanel({ transactions }: { transactions: Tables<"transactions">[] }) {
  const bars = useMemo(() => {
    const expenseAmounts = transactions
      .filter((transaction) => transaction.type === "expense")
      .slice(0, 7)
      .map((transaction) => transaction.amount);

    if (expenseAmounts.length === 0) {
      return [18, 22, 28, 34, 48, 76, 44];
    }

    const max = Math.max(...expenseAmounts, 1);
    return expenseAmounts.map((amount) => Math.max(Math.round((amount / max) * 100), 14));
  }, [transactions]);

  return (
    <GlassCard className="p-5 md:p-6">
      <div className="mb-5 flex items-center justify-between">
        <h2 className="font-mono text-xs font-semibold uppercase tracking-[0.24em] text-satomi-muted">
          Tren Penggunaan
        </h2>
        <LineChart className="size-5 text-satomi-cyan" />
      </div>
      <div className="flex h-28 items-end gap-4 border-b border-white/20 px-2">
        {bars.map((height, index) => (
          <div key={index} className="flex flex-1 flex-col items-center gap-2">
            <div
              className={cn(
                "w-full rounded-t-xl",
                index === bars.length - 1 ? "bg-satomi-purple-soft" : "bg-white/35",
              )}
              style={{ height: `${height}%` }}
            />
          </div>
        ))}
      </div>
      <div className="mt-4 flex items-center gap-2 text-sm text-satomi-muted">
        <TrendingUp className="size-4 text-satomi-purple-soft" />
        Aktivitas pocket ini terbaca dari transaksi yang sudah kamu tautkan.
      </div>
    </GlassCard>
  );
}
