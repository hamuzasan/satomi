"use client";

import { Bot, Plus, Sprout, X } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { AppShell, EmptyState, GlassCard } from "@/src/components/satomi";
import {
  pocketOverview,
  pocketRecords,
  type PocketRecord,
  type PocketStatus,
  type PocketTone,
} from "@/src/lib/satomi-pockets-data";
import { cn } from "@/src/lib/utils";

const toneText: Record<PocketTone, string> = {
  cyan: "text-satomi-cyan",
  amber: "text-satomi-amber",
  green: "text-satomi-green",
  purple: "text-satomi-purple-soft",
  error: "text-satomi-error",
};

const toneBg: Record<PocketTone, string> = {
  cyan: "bg-satomi-cyan",
  amber: "bg-satomi-amber",
  green: "bg-satomi-green",
  purple: "bg-satomi-purple-soft",
  error: "bg-satomi-error",
};

const statusClass: Record<PocketStatus, string> = {
  Aman: "border-satomi-green/30 bg-satomi-green/12 text-satomi-green",
  Waspada: "border-satomi-amber/30 bg-satomi-amber/12 text-satomi-amber",
  "Hampir Habis":
    "border-satomi-purple/35 bg-satomi-purple/12 text-satomi-purple-soft",
  "Lewat Batas": "border-satomi-error/35 bg-satomi-error/12 text-satomi-error",
};

export function PocketsExperience() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <AppShell activePath="/pockets">
      <section className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="font-display text-[40px] font-extrabold leading-tight tracking-normal text-satomi-cyan satomi-glow-text md:text-6xl">
            Smart Pockets
          </h1>
          <p className="mt-3 max-w-2xl text-lg leading-8 text-satomi-muted">
            Alokasi dana otomatis berbasis AI untuk efisiensi maksimal.
          </p>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="inline-flex min-h-14 items-center justify-center gap-3 rounded-2xl bg-satomi-cyan px-6 font-mono text-xs font-bold uppercase tracking-[0.18em] text-satomi-bg shadow-[0_0_30px_rgba(0,240,255,0.28)] transition hover:bg-satomi-cyan-soft"
          >
            <Plus className="size-5" />
            Tambah Pocket
          </button>
          <button
            type="button"
            className="inline-flex min-h-14 items-center justify-center gap-3 rounded-2xl border border-satomi-cyan/35 bg-black/20 px-6 font-mono text-xs font-bold uppercase tracking-[0.18em] text-satomi-cyan transition hover:bg-satomi-cyan/10"
          >
            <Sprout className="size-5" />
            Minta Rekomendasi
          </button>
        </div>
      </section>

      <section className="grid gap-5 xl:grid-cols-[0.9fr_1.1fr]">
        <PocketSummaryCard />
        <PocketBars />
      </section>

      <GlassCard className="p-4">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <p className="font-mono text-xs font-semibold uppercase tracking-[0.22em] text-satomi-muted">
            Status Pocket
          </p>
          <div className="flex flex-wrap gap-2">
            {(["Aman", "Waspada", "Hampir Habis", "Lewat Batas"] as PocketStatus[]).map(
              (status) => (
                <StatusChip key={status} status={status} />
              ),
            )}
          </div>
        </div>
      </GlassCard>

      {pocketRecords.length === 0 ? (
        <EmptyState
          title="Belum ada pocket"
          description="Tambahkan pocket pertama untuk mulai mengatur alokasi dana bersama Satomi."
          primaryAction={{ label: "Tambah Pocket", href: "/pockets" }}
        />
      ) : (
        <section>
          <h2 className="mb-4 font-mono text-xs font-semibold uppercase tracking-[0.24em] text-satomi-muted">
            Pocket Aktif
          </h2>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {pocketRecords.map((pocket) => (
              <PocketCard key={pocket.id} pocket={pocket} />
            ))}
          </div>
        </section>
      )}

      <PocketModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </AppShell>
  );
}

function PocketSummaryCard() {
  return (
    <GlassCard variant="featured" className="p-6 md:p-8">
      <div className="mb-5 flex items-center gap-3">
        <Bot className="size-6 text-satomi-cyan" />
        <p className="font-mono text-xs font-semibold uppercase tracking-[0.24em] text-satomi-muted">
          Ringkasan Bulan Ini
        </p>
      </div>
      <p className="text-satomi-muted">Total Alokasi</p>
      <p className="mt-2 break-words font-display text-4xl font-extrabold tracking-normal text-satomi-text sm:text-5xl md:text-6xl">
        {pocketOverview.totalAllocation}
      </p>
      <div className="mt-7 rounded-2xl border border-satomi-cyan/20 bg-satomi-cyan/8 p-4">
        <p className="font-mono text-xs font-semibold uppercase tracking-[0.2em] text-satomi-cyan">
          Satomi Insight
        </p>
        <p className="mt-2 leading-7 text-satomi-muted">{pocketOverview.insight}</p>
      </div>
    </GlassCard>
  );
}

function PocketBars() {
  return (
    <GlassCard className="p-6 md:p-8">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="font-mono text-xs font-semibold uppercase tracking-[0.24em] text-satomi-muted">
          Visual Alokasi
        </h2>
        <span className="text-sm text-satomi-muted">Bulan ini</span>
      </div>
      <div className="flex h-56 items-end justify-between gap-3">
        {pocketRecords.map((pocket) => (
          <div key={pocket.id} className="flex flex-1 flex-col items-center gap-3">
            <div className="flex h-44 w-full items-end overflow-hidden rounded-full bg-satomi-surface-low">
              <div
                className={cn(
                  "w-full rounded-full shadow-[0_0_20px_rgba(0,240,255,0.18)] transition-all",
                  toneBg[pocket.tone],
                )}
                style={{ height: `${Math.max(pocket.progress, 8)}%` }}
              />
            </div>
            <span className="max-w-[74px] truncate font-mono text-[10px] uppercase text-satomi-muted">
              {pocket.name.split(" ")[0]}
            </span>
          </div>
        ))}
      </div>
    </GlassCard>
  );
}

function PocketCard({ pocket }: { pocket: PocketRecord }) {
  const Icon = pocket.icon;

  return (
    <Link href={`/pockets/${pocket.id}`}>
      <GlassCard
        variant="interactive"
        className={cn(
          "h-full p-5",
          pocket.status === "Hampir Habis" &&
            "border-satomi-purple/40 shadow-[0_0_28px_rgba(207,92,255,0.12)]",
        )}
      >
        <div className="flex items-start justify-between gap-4">
          <div
            className={cn(
              "flex size-12 items-center justify-center rounded-2xl border border-white/10 bg-black/25",
              toneText[pocket.tone],
            )}
          >
            <Icon className="size-6" />
          </div>
          <StatusChip status={pocket.status} />
        </div>
        <h3 className="mt-5 text-xl font-semibold text-satomi-text">
          {pocket.name}
        </h3>
        <p className="mt-2 text-sm leading-6 text-satomi-muted">
          {pocket.description}
        </p>
        <div className="mt-5 flex items-end justify-between gap-4">
          <div>
            <p className={cn("font-display text-2xl font-extrabold", toneText[pocket.tone])}>
              {pocket.used}
            </p>
            <p className="text-sm text-satomi-muted">/ {pocket.limit}</p>
          </div>
          <p className="font-mono text-xs text-satomi-muted">
            {pocket.progress}%
          </p>
        </div>
        <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/12">
          <div
            className={cn("h-full rounded-full", toneBg[pocket.tone])}
            style={{ width: `${pocket.progress}%` }}
          />
        </div>
      </GlassCard>
    </Link>
  );
}

export function StatusChip({ status }: { status: PocketStatus }) {
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

export function PocketModal({
  isOpen,
  onClose,
  title = "Tambah Pocket",
}: {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end bg-black/65 backdrop-blur-sm md:items-center md:justify-center">
      <div
        className="absolute inset-0"
        role="button"
        tabIndex={0}
        aria-label="Tutup modal pocket"
        onClick={onClose}
        onKeyDown={(event) => {
          if (event.key === "Escape" || event.key === "Enter") onClose();
        }}
      />
      <GlassCard className="relative z-10 max-h-[calc(100dvh-var(--safe-area-top)-var(--safe-area-bottom)-1rem)] w-full overflow-y-auto rounded-b-none p-5 md:max-w-xl md:rounded-3xl md:p-6">
        <div className="mb-5 flex items-start justify-between gap-4">
          <div>
            <p className="font-mono text-xs font-semibold uppercase tracking-[0.22em] text-satomi-cyan">
              Smart Pocket
            </p>
            <h2 className="mt-2 font-display text-2xl font-extrabold text-satomi-text">
              {title}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex size-10 items-center justify-center rounded-full text-satomi-muted transition hover:bg-white/5 hover:text-satomi-text"
            aria-label="Tutup"
          >
            <X className="size-5" />
          </button>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <PocketField label="Nama Pocket" value="Self-Reward" />
          <PocketField label="Limit Bulanan" value="Rp300.000" />
          <PocketField label="Status" value="Hampir Habis" />
          <PocketField label="Prioritas" value="Sedang" />
          <PocketField
            label="Deskripsi"
            value="Hiburan, kopi, dan hadiah kecil."
            className="sm:col-span-2"
          />
        </div>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <button
            type="button"
            onClick={onClose}
            className="inline-flex min-h-12 flex-1 items-center justify-center rounded-2xl bg-satomi-cyan px-5 font-mono text-xs font-bold uppercase tracking-[0.18em] text-satomi-bg transition hover:bg-satomi-cyan-soft"
          >
            Simpan Pocket
          </button>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex min-h-12 flex-1 items-center justify-center rounded-2xl border border-white/10 bg-black/20 px-5 font-mono text-xs font-bold uppercase tracking-[0.18em] text-satomi-muted transition hover:text-satomi-text"
          >
            Batal
          </button>
        </div>
      </GlassCard>
    </div>
  );
}

function PocketField({
  label,
  value,
  className,
}: {
  label: string;
  value: string;
  className?: string;
}) {
  return (
    <label className={cn("block", className)}>
      <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-satomi-muted">
        {label}
      </span>
      <input
        className="mt-2 min-h-12 w-full rounded-2xl border border-white/10 bg-black/25 px-4 text-satomi-text outline-none transition focus:border-satomi-cyan/45"
        value={value}
        readOnly
      />
    </label>
  );
}
