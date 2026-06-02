"use client";

import { Bot, CalendarPlus, Pencil, Plus, X } from "lucide-react";
import { useState } from "react";
import { AppShell, GlassCard, StatCard } from "@/src/components/satomi";
import {
  billInsight,
  billRecords,
  billSummary,
  type BillRecord,
  type BillStatus,
  type BillTone,
} from "@/src/lib/satomi-bills-data";
import { cn } from "@/src/lib/utils";

const toneText: Record<BillTone, string> = {
  cyan: "text-satomi-cyan",
  purple: "text-satomi-purple-soft",
  green: "text-satomi-green",
  amber: "text-satomi-amber",
  error: "text-satomi-error",
};

const statusClass: Record<BillStatus, string> = {
  "Belum dibayar": "border-satomi-error/35 bg-satomi-error/12 text-satomi-error",
  "Sudah dibayar": "border-satomi-green/30 bg-satomi-green/12 text-satomi-green",
  Terjadwal: "border-satomi-amber/35 bg-satomi-amber/12 text-satomi-amber",
};

export function BillsExperience() {
  const [selectedBill, setSelectedBill] = useState<BillRecord | null>(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  return (
    <AppShell activePath="/bills">
      <section className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
        <div>
          <div className="mb-3 flex items-center gap-2 text-satomi-cyan">
            <CalendarPlus className="size-5" />
            <span className="font-mono text-xs font-semibold uppercase tracking-[0.24em]">
              Pengingat Rutin
            </span>
          </div>
          <h1 className="font-display text-[36px] font-extrabold leading-tight tracking-normal text-satomi-text md:text-6xl">
            Tagihan & Langganan
          </h1>
          <p className="mt-3 max-w-2xl text-lg leading-8 text-satomi-muted">
            Pantau pengeluaran rutin agar tidak telat bayar.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setIsCreateOpen(true)}
          className="inline-flex min-h-14 items-center justify-center gap-3 rounded-2xl bg-satomi-cyan px-6 font-mono text-xs font-bold uppercase tracking-[0.18em] text-satomi-bg shadow-[0_0_30px_rgba(0,240,255,0.28)] transition hover:bg-satomi-cyan-soft"
        >
          <Plus className="size-5" />
          Tambah Tagihan
        </button>
      </section>

      <GlassCard variant="featured" className="p-5 md:p-6">
        <div className="flex items-start gap-4">
          <div className="flex size-11 shrink-0 items-center justify-center rounded-full border border-satomi-cyan/30 bg-satomi-cyan/12 text-satomi-cyan">
            <Bot className="size-5" />
          </div>
          <div>
            <p className="font-mono text-xs font-semibold uppercase tracking-[0.24em] text-satomi-cyan">
              Insight Satomi
            </p>
            <p className="mt-3 leading-7 text-satomi-text">{billInsight}</p>
          </div>
        </div>
      </GlassCard>

      <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {billSummary.map((item) => (
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

      <GlassCard className="p-4">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <p className="font-mono text-xs font-semibold uppercase tracking-[0.24em] text-satomi-muted">
            Status Tagihan
          </p>
          <div className="flex flex-wrap gap-2">
            {(["Belum dibayar", "Sudah dibayar", "Terjadwal"] as BillStatus[]).map(
              (status) => (
                <StatusChip key={status} status={status} />
              ),
            )}
          </div>
        </div>
      </GlassCard>

      <section>
        <div className="mb-4 flex items-end justify-between gap-4">
          <h2 className="font-display text-2xl font-extrabold text-satomi-text">
            Daftar Tagihan
          </h2>
          <button
            type="button"
            className="font-mono text-xs font-semibold uppercase tracking-[0.18em] text-satomi-cyan transition hover:text-satomi-cyan-soft"
          >
            Lihat Semua
          </button>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {billRecords.map((bill) => (
            <BillCard
              key={bill.id}
              bill={bill}
              onEdit={() => setSelectedBill(bill)}
            />
          ))}
        </div>
      </section>

      <BillModal
        bill={selectedBill}
        mode="edit"
        isOpen={Boolean(selectedBill)}
        onClose={() => setSelectedBill(null)}
      />
      <BillModal
        mode="create"
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
      />
    </AppShell>
  );
}

function BillCard({ bill, onEdit }: { bill: BillRecord; onEdit: () => void }) {
  const Icon = bill.icon;
  const isPaid = bill.status === "Sudah dibayar";

  return (
    <GlassCard
      variant={bill.status === "Belum dibayar" ? "warning" : "interactive"}
      className={cn("p-5 md:p-6", isPaid && "opacity-75")}
    >
      <div className="mb-6 flex items-start justify-between gap-4">
        <div className="flex min-w-0 items-center gap-4">
          <div
            className={cn(
              "flex size-12 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-black/25",
              toneText[bill.tone],
            )}
          >
            <Icon className="size-6" />
          </div>
          <div className="min-w-0">
            <h3
              className={cn(
                "text-xl font-semibold text-satomi-text",
                isPaid && "line-through decoration-satomi-muted",
              )}
            >
              {bill.name}
            </h3>
            <p className="mt-1 text-sm text-satomi-muted">
              Jatuh tempo: {bill.dueDate}
            </p>
          </div>
        </div>
        <div className="text-right">
          <p
            className={cn(
              "font-display text-2xl font-extrabold text-satomi-text",
              isPaid && "text-satomi-muted line-through decoration-satomi-muted",
            )}
          >
            {bill.amount}
          </p>
          <div className="mt-2">
            <StatusChip status={bill.status} />
          </div>
        </div>
      </div>

      <div className="h-px bg-white/10" />

      <div className="mt-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex min-w-0 items-center gap-2">
          <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-satomi-muted">
            Sumber:
          </span>
          <span
            className={cn(
              "inline-flex min-w-0 items-center gap-1 rounded-lg border px-2 py-1 font-mono text-[10px] font-semibold uppercase tracking-[0.08em]",
              bill.tone === "purple"
                ? "border-satomi-purple/25 bg-satomi-purple/10 text-satomi-purple-soft"
                : "border-satomi-cyan/25 bg-satomi-cyan/10 text-satomi-cyan",
            )}
          >
            {bill.source}
          </span>
        </div>
        <button
          type="button"
          onClick={onEdit}
          className={cn(
            "inline-flex min-h-11 items-center justify-center gap-2 rounded-xl px-4 font-mono text-[10px] font-bold uppercase tracking-[0.16em] transition",
            isPaid
              ? "border border-white/10 bg-black/20 text-satomi-muted hover:text-satomi-text"
              : "bg-satomi-cyan text-satomi-bg shadow-[0_0_18px_rgba(0,240,255,0.24)] hover:bg-satomi-cyan-soft",
          )}
        >
          <Pencil className="size-4" />
          {isPaid ? "Edit" : "Kelola"}
        </button>
      </div>
    </GlassCard>
  );
}

function StatusChip({ status }: { status: BillStatus }) {
  return (
    <span
      className={cn(
        "inline-flex rounded-full border px-3 py-1 font-mono text-[10px] font-semibold uppercase tracking-[0.14em]",
        statusClass[status],
      )}
    >
      {status}
    </span>
  );
}

function BillModal({
  bill,
  mode,
  isOpen,
  onClose,
}: {
  bill?: BillRecord | null;
  mode: "create" | "edit";
  isOpen: boolean;
  onClose: () => void;
}) {
  if (!isOpen) return null;

  const modalBill = bill ?? billRecords[0];
  const title = mode === "create" ? "Tambah Tagihan" : "Edit Tagihan";
  const action = mode === "create" ? "Simpan Tagihan" : "Simpan Edit";

  return (
    <div className="fixed inset-0 z-50 flex items-end bg-black/65 backdrop-blur-sm md:items-center md:justify-center">
      <div
        className="absolute inset-0"
        role="button"
        tabIndex={0}
        aria-label="Tutup modal tagihan"
        onClick={onClose}
        onKeyDown={(event) => {
          if (event.key === "Escape" || event.key === "Enter") onClose();
        }}
      />
      <GlassCard className="relative z-10 w-full rounded-b-none p-5 md:max-w-xl md:rounded-3xl md:p-6">
        <div className="mb-5 flex items-start justify-between gap-4">
          <div>
            <p className="font-mono text-xs font-semibold uppercase tracking-[0.22em] text-satomi-cyan">
              Tagihan Rutin
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
          <BillField label="Nama tagihan" value={mode === "create" ? "Tagihan baru" : modalBill.name} />
          <BillField label="Nominal" value={mode === "create" ? "Rp0" : modalBill.amount} />
          <BillField label="Jatuh tempo" value={mode === "create" ? "Tanggal 10" : modalBill.dueDate} />
          <BillField label="Status" value={mode === "create" ? "Terjadwal" : modalBill.status} />
          <BillField
            label="Sumber dana"
            value={mode === "create" ? "Pocket Tagihan" : modalBill.source}
            className="sm:col-span-2"
          />
        </div>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <button
            type="button"
            onClick={onClose}
            className="inline-flex min-h-12 flex-1 items-center justify-center rounded-2xl bg-satomi-cyan px-5 font-mono text-xs font-bold uppercase tracking-[0.18em] text-satomi-bg transition hover:bg-satomi-cyan-soft"
          >
            {action}
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

function BillField({
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
