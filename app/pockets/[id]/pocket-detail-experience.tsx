"use client";

import { ArrowLeft, Bot, Coffee, LineChart, Pencil, TrendingUp } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { AppShell, EmptyState, GlassCard } from "@/src/components/satomi";
import {
  getPocketById,
  selfRewardTransactions,
  type PocketRecord,
} from "@/src/lib/satomi-pockets-data";
import { cn } from "@/src/lib/utils";
import { PocketModal, StatusChip } from "../pockets-experience";

export function PocketDetailExperience({ pocketId }: { pocketId: string }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const pocket = getPocketById(pocketId);

  if (!pocket) {
    return (
      <AppShell activePath="/pockets">
        <EmptyState
          title="Pocket tidak ditemukan"
          description="Pocket dummy ini belum tersedia. Kembali ke daftar Smart Pockets untuk melihat data yang ada."
          primaryAction={{ label: "Lihat Pockets", href: "/pockets" }}
        />
      </AppShell>
    );
  }

  return (
    <AppShell activePath="/pockets">
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
            {pocket.name}
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
        <PocketRing pocket={pocket} />
        <div className="flex flex-col gap-5">
          <AiNudgePanel />
          <TrendPanel />
        </div>
      </section>

      <GlassCard className="p-5 md:p-6">
        <div className="mb-5 flex items-center justify-between gap-4">
          <h2 className="font-mono text-xs font-semibold uppercase tracking-[0.24em] text-satomi-muted">
            Transaksi Terkait
          </h2>
          <a
            href="/transactions"
            className="text-sm font-medium text-satomi-text transition hover:text-satomi-cyan"
          >
            Lihat Semua
          </a>
        </div>
        <div className="grid gap-3">
          {selfRewardTransactions.map((transaction) => {
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
                    {transaction.meta}
                  </p>
                </div>
                <p className="whitespace-nowrap font-semibold text-satomi-text">
                  {transaction.amount}
                </p>
              </div>
            );
          })}
        </div>
      </GlassCard>

      <PocketModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Edit Pocket"
      />
    </AppShell>
  );
}

function PocketRing({ pocket }: { pocket: PocketRecord }) {
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
              pocket.progress * 3.6
            }deg, rgba(255,255,255,0.08) ${pocket.progress * 3.6}deg)`,
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

function AiNudgePanel() {
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
          <p className="mt-3 leading-7 text-satomi-text">
            Limit Self-Reward kamu sudah menyentuh 90%. Berdasarkan pola historis,
            kamu biasanya melakukan 2x transaksi kopi di akhir pekan. Satomi
            sarankan menahan pengeluaran hiburan hari ini agar limit tidak jebol.
          </p>
        </div>
      </div>
    </GlassCard>
  );
}

function TrendPanel() {
  return (
    <GlassCard className="p-5 md:p-6">
      <div className="mb-5 flex items-center justify-between">
        <h2 className="font-mono text-xs font-semibold uppercase tracking-[0.24em] text-satomi-muted">
          Tren Penggunaan Harian
        </h2>
        <LineChart className="size-5 text-satomi-cyan" />
      </div>
      <div className="flex h-28 items-end gap-4 border-b border-white/20 px-2">
        {[18, 22, 28, 34, 48, 76, 44].map((height, index) => (
          <div key={index} className="flex flex-1 flex-col items-center gap-2">
            <div
              className={cn(
                "w-full rounded-t-xl",
                index === 5 ? "bg-satomi-purple-soft" : "bg-white/35",
              )}
              style={{ height: `${height}%` }}
            />
            {index === 5 ? (
              <span className="font-mono text-[10px] text-satomi-text">Sab</span>
            ) : null}
          </div>
        ))}
      </div>
      <div className="mt-4 flex items-center gap-2 text-sm text-satomi-muted">
        <TrendingUp className="size-4 text-satomi-purple-soft" />
        Aktivitas hiburan meningkat di akhir pekan.
      </div>
    </GlassCard>
  );
}
