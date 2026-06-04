"use client";

import { Bot, Plus, Sprout, Trash2, X } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";
import { AppShell, GlassCard, LoadingState } from "@/src/components/satomi";
import {
  buildPocketOverview,
  getPocketDescription,
  mapPocketRowToRecord,
} from "@/src/lib/satomi-finance";
import {
  createPocket,
  type PocketInput,
  type PocketRow,
} from "@/src/lib/supabase/finance";
import { createSupabaseBrowserClient } from "@/src/lib/supabase/client";
import { useFinanceSnapshot } from "@/src/lib/supabase/use-finance-snapshot";
import { cn } from "@/src/lib/utils";

type PocketStatus = ReturnType<typeof mapPocketRowToRecord>["status"];
type PocketTone = ReturnType<typeof mapPocketRowToRecord>["tone"];

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

const pocketTypeOptions = [
  { value: "spending", label: "Pengeluaran Harian" },
  { value: "saving", label: "Tabungan" },
  { value: "bill", label: "Tagihan" },
  { value: "emergency", label: "Dana Darurat" },
  { value: "income", label: "Pemasukan" },
  { value: "custom", label: "Custom" },
];

const pocketColorOptions = [
  { value: "cyan", label: "Cyan" },
  { value: "purple", label: "Purple" },
  { value: "green", label: "Green" },
  { value: "amber", label: "Amber" },
];

const pocketIconOptions = [
  { value: "wallet", label: "Wallet" },
  { value: "shopping", label: "Shopping" },
  { value: "receipt", label: "Receipt" },
  { value: "landmark", label: "Landmark" },
  { value: "coffee", label: "Coffee" },
  { value: "shield", label: "Shield" },
];

export function PocketsExperience() {
  const { snapshot, isLoading, error, refresh } = useFinanceSnapshot();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isMutating, setIsMutating] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [statusTone, setStatusTone] = useState<"success" | "error">("success");
  const supabase = useMemo(() => createSupabaseBrowserClient(), []);

  const pockets = useMemo(() => snapshot?.pockets ?? [], [snapshot?.pockets]);
  const transactions = useMemo(
    () => snapshot?.transactions ?? [],
    [snapshot?.transactions],
  );
  const pocketRecords = useMemo(
    () => pockets.map((pocket) => mapPocketRowToRecord(pocket, transactions)),
    [pockets, transactions],
  );
  const pocketOverview = buildPocketOverview(pocketRecords);

  async function handleCreate(input: PocketInput) {
    setIsMutating(true);
    setStatusMessage(null);

    try {
      await createPocket(supabase, input);
      await refresh();
      setStatusTone("success");
      setStatusMessage("Pocket baru berhasil dibuat.");
      setIsModalOpen(false);
    } catch (error) {
      setStatusTone("error");
      setStatusMessage(error instanceof Error ? error.message : "Pocket belum berhasil dibuat.");
    } finally {
      setIsMutating(false);
    }
  }

  return (
    <AppShell activePath="/pockets">
      <section className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="font-display text-[40px] font-extrabold leading-tight tracking-normal text-satomi-cyan satomi-glow-text md:text-6xl">
            Smart Pockets
          </h1>
          <p className="mt-3 max-w-2xl text-lg leading-8 text-satomi-muted">
            Alokasi dana personalmu sekarang hidup dari Supabase, tetap dengan sentuhan visual SATOMI.
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

      {statusMessage ? <StatusBanner tone={statusTone}>{statusMessage}</StatusBanner> : null}

      {isLoading ? (
        <LoadingState
          variant="skeleton"
          title="Satomi sedang memuat pocket..."
          description="Menyiapkan struktur alokasi dari Supabase."
        />
      ) : error ? (
        <DataStatePanel
          title="Pocket belum bisa dimuat"
          description={error}
          primaryLabel="Coba Lagi"
          onPrimary={refresh}
        />
      ) : (
        <>
          <section className="grid gap-5 xl:grid-cols-[0.9fr_1.1fr]">
            <PocketSummaryCard
              totalAllocation={pocketOverview.totalAllocation}
              insight={pocketOverview.insight}
            />
            <PocketBars pockets={pocketRecords} />
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
            <DataStatePanel
              title="Belum ada pocket"
              description="Tambahkan pocket pertama untuk mulai mengatur alokasi dana bersama Satomi."
              primaryLabel="Tambah Pocket"
              onPrimary={() => setIsModalOpen(true)}
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
        </>
      )}

      <PocketModal
        key="create-pocket"
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Tambah Pocket"
        mode="create"
        isBusy={isMutating}
        onSubmit={handleCreate}
      />
    </AppShell>
  );
}

function PocketSummaryCard({
  totalAllocation,
  insight,
}: {
  totalAllocation: string;
  insight: string;
}) {
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
        {totalAllocation}
      </p>
      <div className="mt-7 rounded-2xl border border-satomi-cyan/20 bg-satomi-cyan/8 p-4">
        <p className="font-mono text-xs font-semibold uppercase tracking-[0.2em] text-satomi-cyan">
          Satomi Insight
        </p>
        <p className="mt-2 leading-7 text-satomi-muted">{insight}</p>
      </div>
    </GlassCard>
  );
}

function PocketBars({
  pockets,
}: {
  pockets: ReturnType<typeof mapPocketRowToRecord>[];
}) {
  return (
    <GlassCard className="p-6 md:p-8">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="font-mono text-xs font-semibold uppercase tracking-[0.24em] text-satomi-muted">
          Visual Alokasi
        </h2>
        <span className="text-sm text-satomi-muted">Realtime</span>
      </div>
      <div className="flex h-56 items-end justify-between gap-3">
        {pockets.map((pocket) => (
          <div key={pocket.id} className="flex flex-1 flex-col items-center gap-3">
            <div className="flex h-44 w-full items-end overflow-hidden rounded-full bg-satomi-surface-low">
              <div
                className={cn(
                  "w-full rounded-full shadow-[0_0_20px_rgba(0,240,255,0.18)] transition-all",
                  toneBg[pocket.tone],
                )}
                style={{ height: `${Math.max(Math.min(pocket.progress, 100), 8)}%` }}
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

function PocketCard({
  pocket,
}: {
  pocket: ReturnType<typeof mapPocketRowToRecord>;
}) {
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
            style={{ width: `${Math.min(pocket.progress, 100)}%` }}
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

type PocketModalProps = {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  mode: "create" | "edit";
  pocket?: PocketRow | null;
  isBusy?: boolean;
  onSubmit: (input: PocketInput) => Promise<void>;
  onDelete?: () => Promise<void>;
};

export function PocketModal({
  isOpen,
  onClose,
  title = "Tambah Pocket",
  mode,
  pocket,
  isBusy = false,
  onSubmit,
  onDelete,
}: PocketModalProps) {
  const [name, setName] = useState(pocket?.name ?? "");
  const [type, setType] = useState(pocket?.type ?? "spending");
  const [budgetLimit, setBudgetLimit] = useState(pocket ? String(pocket.budget_limit) : "");
  const [color, setColor] = useState(pocket?.color ?? "cyan");
  const [icon, setIcon] = useState(pocket?.icon ?? "wallet");
  const [warningThreshold, setWarningThreshold] = useState(
    pocket ? String(pocket.warning_threshold) : "80",
  );
  const [localError, setLocalError] = useState<string | null>(null);

  if (!isOpen) return null;

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLocalError(null);

    const parsedLimit = Number(budgetLimit);
    const parsedThreshold = Number(warningThreshold);

    if (!name.trim()) {
      setLocalError("Nama pocket wajib diisi.");
      return;
    }

    if (!Number.isFinite(parsedLimit) || parsedLimit < 0) {
      setLocalError("Limit pocket harus berupa angka nol atau lebih.");
      return;
    }

    if (!Number.isFinite(parsedThreshold) || parsedThreshold < 0 || parsedThreshold > 100) {
      setLocalError("Ambang peringatan pocket harus di antara 0 sampai 100.");
      return;
    }

    try {
      await onSubmit({
        name,
        type,
        budget_limit: parsedLimit,
        color,
        icon,
        warning_threshold: parsedThreshold,
      });
    } catch (error) {
      setLocalError(error instanceof Error ? error.message : "Pocket belum berhasil disimpan.");
    }
  }

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

        {localError ? <StatusBanner tone="error">{localError}</StatusBanner> : null}

        <form className="grid gap-4 sm:grid-cols-2" onSubmit={handleSubmit}>
          <PocketField
            label="Nama Pocket"
            value={name}
            onChange={setName}
            className="sm:col-span-2"
          />
          <SelectField
            label="Tipe"
            value={type}
            onChange={setType}
            options={pocketTypeOptions}
          />
          <PocketField
            label="Limit Bulanan"
            value={budgetLimit}
            onChange={setBudgetLimit}
            type="number"
          />
          <SelectField
            label="Warna"
            value={color}
            onChange={setColor}
            options={pocketColorOptions}
          />
          <SelectField
            label="Ikon"
            value={icon}
            onChange={setIcon}
            options={pocketIconOptions}
          />
          <PocketField
            label="Ambang Peringatan (%)"
            value={warningThreshold}
            onChange={setWarningThreshold}
            type="number"
          />
          <div className="rounded-2xl border border-satomi-cyan/20 bg-satomi-cyan/8 p-4 sm:col-span-2">
            <p className="font-mono text-xs font-semibold uppercase tracking-[0.2em] text-satomi-cyan">
              Deskripsi Pocket
            </p>
            <p className="mt-2 text-sm leading-6 text-satomi-muted">
              {getPocketDescription(type, name || "Pocket baru")}
            </p>
          </div>
          <div className="mt-2 flex flex-col gap-3 sm:col-span-2 sm:flex-row">
            <button
              type="submit"
              disabled={isBusy}
              className="inline-flex min-h-12 flex-1 items-center justify-center rounded-2xl bg-satomi-cyan px-5 font-mono text-xs font-bold uppercase tracking-[0.18em] text-satomi-bg transition hover:bg-satomi-cyan-soft disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isBusy ? "Menyimpan..." : "Simpan Pocket"}
            </button>
            {mode === "edit" && onDelete ? (
              <button
                type="button"
                disabled={isBusy}
                onClick={() => void onDelete()}
                className="inline-flex min-h-12 flex-1 items-center justify-center gap-2 rounded-2xl border border-satomi-error/30 bg-satomi-error/10 px-5 font-mono text-xs font-bold uppercase tracking-[0.18em] text-satomi-error transition hover:bg-satomi-error/15 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <Trash2 className="size-4" />
                Hapus Pocket
              </button>
            ) : null}
            <button
              type="button"
              onClick={onClose}
              className="inline-flex min-h-12 flex-1 items-center justify-center rounded-2xl border border-white/10 bg-black/20 px-5 font-mono text-xs font-bold uppercase tracking-[0.18em] text-satomi-muted transition hover:text-satomi-text"
            >
              Batal
            </button>
          </div>
        </form>
      </GlassCard>
    </div>
  );
}

function PocketField({
  label,
  value,
  onChange,
  type = "text",
  className,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
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
        type={type}
        onChange={(event) => onChange(event.target.value)}
      />
    </label>
  );
}

function SelectField({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: Array<{ value: string; label: string }>;
}) {
  return (
    <label className="block">
      <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-satomi-muted">
        {label}
      </span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="mt-2 min-h-12 w-full rounded-2xl border border-white/10 bg-black/25 px-4 text-satomi-text outline-none transition focus:border-satomi-cyan/45"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
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
        <Bot className="size-12 text-satomi-cyan satomi-glow-text" />
      </div>
      <h2 className="font-display text-4xl font-extrabold leading-tight text-satomi-text">
        {title}
      </h2>
      <p className="mt-4 max-w-lg text-base leading-7 text-satomi-muted md:text-lg">
        {description}
      </p>
      <button
        type="button"
        onClick={() => void onPrimary()}
        className="mt-8 inline-flex min-h-14 items-center justify-center rounded-2xl bg-satomi-cyan px-6 font-mono text-xs font-bold uppercase tracking-[0.22em] text-satomi-bg shadow-[0_0_28px_rgba(0,240,255,0.28)] transition hover:bg-satomi-cyan-soft"
      >
        {primaryLabel}
      </button>
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
