"use client";

import {
  CalendarDays,
  ChevronDown,
  Funnel,
  Pencil,
  Plus,
  Search,
  Trash2,
  X,
} from "lucide-react";
import { useMemo, useState } from "react";
import { AppShell, GlassCard, LoadingState, StatCard } from "@/src/components/satomi";
import { buildTransactionSummary, mapTransactionRowToRecord } from "@/src/lib/satomi-finance";
import {
  createTransaction,
  deleteTransaction,
  updateTransaction,
  type PocketRow,
  type TransactionInput,
  type TransactionRow,
} from "@/src/lib/supabase/finance";
import { useFinanceSnapshot } from "@/src/lib/supabase/use-finance-snapshot";
import { createSupabaseBrowserClient } from "@/src/lib/supabase/client";
import { cn } from "@/src/lib/utils";

export function TransactionsExperience() {
  const { snapshot, isLoading, error, refresh } = useFinanceSnapshot();
  const [query, setQuery] = useState("");
  const [dateFilter, setDateFilter] = useState("Semua Waktu");
  const [typeFilter, setTypeFilter] = useState("Semua Tipe");
  const [categoryFilter, setCategoryFilter] = useState("Semua Kategori");
  const [selected, setSelected] = useState<TransactionRow | null>(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isMutating, setIsMutating] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [statusTone, setStatusTone] = useState<"success" | "error">("success");

  const supabase = useMemo(() => createSupabaseBrowserClient(), []);
  const pockets = useMemo(() => snapshot?.pockets ?? [], [snapshot?.pockets]);
  const transactions = useMemo(
    () => snapshot?.transactions ?? [],
    [snapshot?.transactions],
  );
  const pocketNameById = useMemo(
    () => new Map(pockets.map((pocket) => [pocket.id, pocket.name])),
    [pockets],
  );

  const transactionRecords = useMemo(
    () =>
      transactions.map((transaction) =>
        mapTransactionRowToRecord(transaction, pocketNameById),
      ),
    [pocketNameById, transactions],
  );

  const categories = useMemo(() => {
    const items = Array.from(new Set(transactions.map((transaction) => transaction.category)));
    return ["Semua Kategori", ...items];
  }, [transactions]);

  const filteredTransactions = useMemo(() => {
    return transactionRecords.filter((transaction) => {
      const queryMatch = [transaction.name, transaction.category, transaction.pocket]
        .join(" ")
        .toLowerCase()
        .includes(query.toLowerCase());
      const typeMatch =
        typeFilter === "Semua Tipe" || transaction.type === typeFilter;
      const categoryMatch =
        categoryFilter === "Semua Kategori" ||
        transaction.category === categoryFilter;
      const dateMatch =
        dateFilter === "Semua Waktu" || transaction.dateGroup === dateFilter;

      return queryMatch && typeMatch && categoryMatch && dateMatch;
    });
  }, [categoryFilter, dateFilter, query, transactionRecords, typeFilter]);

  const groupedTransactions = useMemo(() => {
    const groups = new Map<string, typeof filteredTransactions>();

    for (const transaction of filteredTransactions) {
      const current = groups.get(transaction.dateGroup) ?? [];
      current.push(transaction);
      groups.set(transaction.dateGroup, current);
    }

    return Array.from(groups.entries()).map(([group, grouped]) => ({
      group,
      transactions: grouped,
    }));
  }, [filteredTransactions]);

  async function handleCreate(input: TransactionInput) {
    setIsMutating(true);
    setStatusMessage(null);

    try {
      await createTransaction(supabase, input);
      await refresh();
      setStatusTone("success");
      setStatusMessage("Transaksi baru berhasil dicatat.");
      setIsCreateOpen(false);
    } catch (error) {
      setStatusTone("error");
      setStatusMessage(
        error instanceof Error ? error.message : "Transaksi belum berhasil disimpan.",
      );
    } finally {
      setIsMutating(false);
    }
  }

  async function handleUpdate(input: TransactionInput) {
    if (!selected) return;

    setIsMutating(true);
    setStatusMessage(null);

    try {
      await updateTransaction(supabase, selected.id, input);
      await refresh();
      setStatusTone("success");
      setStatusMessage("Perubahan transaksi berhasil disimpan.");
      setSelected(null);
    } catch (error) {
      setStatusTone("error");
      setStatusMessage(
        error instanceof Error
          ? error.message
          : "Perubahan transaksi belum berhasil disimpan.",
      );
    } finally {
      setIsMutating(false);
    }
  }

  async function handleDelete() {
    if (!selected) return;

    setIsMutating(true);
    setStatusMessage(null);

    try {
      await deleteTransaction(supabase, selected.id);
      await refresh();
      setStatusTone("success");
      setStatusMessage("Transaksi berhasil dihapus.");
      setSelected(null);
    } catch (error) {
      setStatusTone("error");
      setStatusMessage(
        error instanceof Error ? error.message : "Transaksi belum berhasil dihapus.",
      );
    } finally {
      setIsMutating(false);
    }
  }

  const transactionSummary = buildTransactionSummary(transactions);

  return (
    <AppShell activePath="/transactions">
      <section className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="font-display text-[34px] font-extrabold leading-tight tracking-normal text-satomi-text md:text-5xl">
            Riwayat Transaksi
          </h1>
          <p className="mt-2 text-base leading-7 text-satomi-muted">
            Semua arus masuk dan keluar dari akunmu sekarang tersinkron ke Supabase.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setIsCreateOpen(true)}
          className="inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl bg-satomi-cyan px-5 font-mono text-xs font-bold uppercase tracking-[0.18em] text-satomi-bg shadow-[0_0_26px_rgba(0,240,255,0.28)] transition hover:bg-satomi-cyan-soft"
        >
          <Plus className="size-4" />
          Tambah Transaksi
        </button>
      </section>

      {statusMessage ? (
        <StatusBanner tone={statusTone}>{statusMessage}</StatusBanner>
      ) : null}

      {isLoading ? (
        <LoadingState
          variant="skeleton"
          title="Satomi sedang memuat transaksi..."
          description="Menyiapkan riwayat terbaru dari Supabase."
        />
      ) : error ? (
        <DataStatePanel
          title="Transaksi belum bisa dimuat"
          description={error}
          primaryLabel="Coba Lagi"
          onPrimary={refresh}
        />
      ) : (
        <>
          <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {transactionSummary.map((item) => (
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

          <GlassCard className="sticky top-20 z-20 p-3 md:top-24">
            <div className="flex flex-col gap-3 xl:flex-row xl:items-center">
              <label className="relative block min-w-0 flex-1">
                <span className="sr-only">Cari transaksi</span>
                <Search className="absolute left-4 top-1/2 size-5 -translate-y-1/2 text-satomi-muted" />
                <input
                  className="min-h-13 w-full rounded-2xl border border-white/10 bg-black/25 py-3 pl-12 pr-4 text-satomi-text outline-none transition placeholder:text-satomi-muted/55 focus:border-satomi-cyan/50"
                  placeholder="Cari transaksi..."
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                />
              </label>
              <div className="satomi-scrollbar-none flex gap-2 overflow-x-auto pb-1 xl:pb-0">
                <FilterSelect
                  label="Tanggal"
                  value={dateFilter}
                  options={[
                    "Semua Waktu",
                    ...Array.from(new Set(transactionRecords.map((item) => item.dateGroup))),
                  ]}
                  icon="date"
                  onChange={setDateFilter}
                />
                <FilterSelect
                  label="Tipe"
                  value={typeFilter}
                  options={["Semua Tipe", "Masuk", "Keluar"]}
                  icon="type"
                  onChange={setTypeFilter}
                />
                <FilterSelect
                  label="Kategori"
                  value={categoryFilter}
                  options={categories}
                  icon="type"
                  onChange={setCategoryFilter}
                />
              </div>
            </div>
          </GlassCard>

          {transactions.length === 0 ? (
            <DataStatePanel
              title="Belum ada transaksi"
              description="Catat transaksi pertamamu agar dashboard dan Smart Pockets mulai bergerak."
              primaryLabel="Tambah Transaksi"
              onPrimary={() => setIsCreateOpen(true)}
            />
          ) : filteredTransactions.length === 0 ? (
            <DataStatePanel
              title="Tidak ada transaksi yang cocok"
              description="Coba ubah kata kunci, tipe, kategori, atau tanggal agar hasilnya muncul lagi."
              primaryLabel="Reset Filter"
              onPrimary={() => {
                setQuery("");
                setDateFilter("Semua Waktu");
                setTypeFilter("Semua Tipe");
                setCategoryFilter("Semua Kategori");
              }}
            />
          ) : (
            <section className="flex flex-col gap-6">
              {groupedTransactions.map(({ group, transactions: grouped }) => (
                <TransactionGroup
                  key={group}
                  title={group}
                  transactions={grouped}
                  sourceRows={transactions}
                  onSelect={setSelected}
                />
              ))}
            </section>
          )}
        </>
      )}

      <TransactionEditorModal
        key="create-transaction"
        isOpen={isCreateOpen}
        mode="create"
        transaction={null}
        pockets={pockets}
        isBusy={isMutating}
        onClose={() => setIsCreateOpen(false)}
        onSubmit={handleCreate}
      />

      <TransactionEditorModal
        key={selected?.id ?? "edit-transaction"}
        isOpen={Boolean(selected)}
        mode="edit"
        transaction={selected}
        pockets={pockets}
        isBusy={isMutating}
        onClose={() => setSelected(null)}
        onSubmit={handleUpdate}
        onDelete={handleDelete}
      />
    </AppShell>
  );
}

function FilterSelect({
  label,
  value,
  options,
  icon,
  onChange,
}: {
  label: string;
  value: string;
  options: string[];
  icon: "date" | "type";
  onChange: (value: string) => void;
}) {
  const Icon = icon === "date" ? CalendarDays : Funnel;

  return (
    <label className="relative shrink-0">
      <span className="sr-only">{label}</span>
      <Icon className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-satomi-cyan" />
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="min-h-12 appearance-none rounded-full border border-white/10 bg-satomi-surface-high/90 py-2 pl-10 pr-10 font-mono text-xs font-semibold uppercase tracking-[0.14em] text-satomi-text outline-none transition hover:border-satomi-cyan/40 focus:border-satomi-cyan/50"
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
      <ChevronDown className="pointer-events-none absolute right-4 top-1/2 size-4 -translate-y-1/2 text-satomi-muted" />
    </label>
  );
}

function TransactionGroup({
  title,
  transactions,
  sourceRows,
  onSelect,
}: {
  title: string;
  transactions: ReturnType<typeof mapTransactionRowToRecord>[];
  sourceRows: TransactionRow[];
  onSelect: (transaction: TransactionRow) => void;
}) {
  const sourceById = useMemo(
    () => new Map(sourceRows.map((transaction) => [transaction.id, transaction])),
    [sourceRows],
  );

  return (
    <div>
      <div className="mb-3 flex items-center gap-4">
        <h2 className="shrink-0 font-mono text-xs font-semibold uppercase tracking-[0.24em] text-satomi-muted">
          {title}
        </h2>
        <div className="h-px flex-1 bg-white/10" />
      </div>
      <div className="grid gap-3">
        {transactions.map((transaction) => {
          const source = sourceById.get(transaction.id);
          if (!source) return null;

          return (
            <TransactionRowCard
              key={transaction.id}
              transaction={transaction}
              onSelect={() => onSelect(source)}
            />
          );
        })}
      </div>
    </div>
  );
}

function TransactionRowCard({
  transaction,
  onSelect,
}: {
  transaction: ReturnType<typeof mapTransactionRowToRecord>;
  onSelect: () => void;
}) {
  const Icon = transaction.icon;
  const isIncome = transaction.type === "Masuk";

  return (
    <button
      type="button"
      onClick={onSelect}
      className="group w-full rounded-3xl border border-white/10 bg-satomi-surface/60 p-4 text-left shadow-[0_14px_36px_rgba(0,0,0,0.28)] backdrop-blur-xl transition hover:border-satomi-cyan/35 md:rounded-2xl"
    >
      <div className="flex items-center gap-4 md:grid md:grid-cols-[48px_1.2fr_0.9fr_0.7fr_0.6fr_40px] md:gap-5">
        <div
          className={cn(
            "flex size-12 shrink-0 items-center justify-center rounded-full border",
            isIncome
              ? "border-satomi-green/25 bg-satomi-green/12 text-satomi-green"
              : "border-satomi-cyan/25 bg-satomi-cyan/10 text-satomi-cyan",
          )}
        >
          <Icon className="size-5" />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-3 md:block">
            <p className="truncate text-lg font-semibold text-satomi-text">
              {transaction.name}
            </p>
            <p className="font-mono text-xs text-satomi-muted md:mt-1">
              {transaction.time}
            </p>
          </div>
          <div className="mt-3 flex flex-wrap gap-2 md:hidden">
            <Tag>{transaction.category}</Tag>
            <Tag>{transaction.pocket}</Tag>
          </div>
        </div>

        <div className="hidden md:block">
          <Tag>{transaction.category}</Tag>
        </div>
        <div className="hidden md:block">
          <Tag>{transaction.pocket}</Tag>
        </div>

        <p
          className={cn(
            "whitespace-nowrap text-right font-display text-xl font-extrabold md:text-lg",
            isIncome ? "text-satomi-cyan satomi-glow-text" : "text-satomi-text",
          )}
        >
          {transaction.amount}
        </p>

        <div className="hidden justify-end md:flex">
          <span className="flex size-9 items-center justify-center rounded-full text-satomi-muted transition group-hover:bg-satomi-cyan/10 group-hover:text-satomi-cyan">
            <Pencil className="size-4" />
          </span>
        </div>
      </div>
    </button>
  );
}

function Tag({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex rounded-lg border border-white/10 bg-satomi-surface-high/80 px-2.5 py-1 font-mono text-[10px] font-semibold uppercase tracking-[0.12em] text-satomi-muted">
      {children}
    </span>
  );
}

type TransactionEditorModalProps = {
  isOpen: boolean;
  mode: "create" | "edit";
  transaction: TransactionRow | null;
  pockets: PocketRow[];
  isBusy: boolean;
  onClose: () => void;
  onSubmit: (input: TransactionInput) => Promise<void>;
  onDelete?: () => Promise<void>;
};

function TransactionEditorModal({
  isOpen,
  mode,
  transaction,
  pockets,
  isBusy,
  onClose,
  onSubmit,
  onDelete,
}: TransactionEditorModalProps) {
  const [description, setDescription] = useState(transaction?.description ?? "");
  const [category, setCategory] = useState(transaction?.category ?? "");
  const [amount, setAmount] = useState(transaction ? String(transaction.amount) : "");
  const [type, setType] = useState<"income" | "expense">(
    transaction?.type === "income" ? "income" : "expense",
  );
  const [pocketId, setPocketId] = useState(transaction?.pocket_id ?? "");
  const [dateTime, setDateTime] = useState(
    transaction
      ? toDateTimeInputValue(transaction.transaction_date)
      : toDateTimeInputValue(new Date().toISOString()),
  );
  const [localError, setLocalError] = useState<string | null>(null);

  if (!isOpen) return null;

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLocalError(null);

    const parsedAmount = Number(amount);
    if (!Number.isFinite(parsedAmount) || parsedAmount <= 0) {
      setLocalError("Nominal transaksi harus lebih besar dari nol.");
      return;
    }

    try {
      await onSubmit({
        amount: parsedAmount,
        type,
        category,
        pocket_id: pocketId || null,
        description,
        transaction_date: new Date(dateTime).toISOString(),
      });
    } catch (error) {
      setLocalError(
        error instanceof Error ? error.message : "Transaksi belum berhasil disimpan.",
      );
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end bg-black/65 backdrop-blur-sm md:items-center md:justify-center">
      <div
        className="absolute inset-0"
        role="button"
        tabIndex={0}
        aria-label="Tutup editor transaksi"
        onClick={onClose}
        onKeyDown={(event) => {
          if (event.key === "Escape" || event.key === "Enter") onClose();
        }}
      />
      <GlassCard className="relative z-10 max-h-[calc(100dvh-var(--safe-area-top)-var(--safe-area-bottom)-1rem)] w-full overflow-y-auto rounded-b-none p-5 md:max-w-xl md:rounded-3xl md:p-6">
        <div className="mb-5 flex items-start justify-between gap-4">
          <div>
            <p className="font-mono text-xs font-semibold uppercase tracking-[0.22em] text-satomi-cyan">
              {mode === "create" ? "Tambah transaksi" : "Edit transaksi"}
            </p>
            <h2 className="mt-1 font-display text-2xl font-extrabold text-satomi-text">
              {mode === "create" ? "Catat transaksi baru" : description || "Perbarui transaksi"}
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
          <EditorField
            label="Nama transaksi"
            value={description}
            onChange={setDescription}
            className="sm:col-span-2"
          />
          <EditorField label="Kategori" value={category} onChange={setCategory} />
          <label className="block">
            <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-satomi-muted">
              Tipe
            </span>
            <select
              value={type}
              onChange={(event) => setType(event.target.value as "income" | "expense")}
              className="mt-2 min-h-12 w-full rounded-2xl border border-white/10 bg-black/25 px-4 text-satomi-text outline-none transition focus:border-satomi-cyan/45"
            >
              <option value="expense">Keluar</option>
              <option value="income">Masuk</option>
            </select>
          </label>
          <EditorField label="Nominal" value={amount} onChange={setAmount} type="number" />
          <label className="block">
            <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-satomi-muted">
              Pocket
            </span>
            <select
              value={pocketId}
              onChange={(event) => setPocketId(event.target.value)}
              className="mt-2 min-h-12 w-full rounded-2xl border border-white/10 bg-black/25 px-4 text-satomi-text outline-none transition focus:border-satomi-cyan/45"
            >
              <option value="">Tanpa Pocket</option>
              {pockets.map((pocket) => (
                <option key={pocket.id} value={pocket.id}>
                  {pocket.name}
                </option>
              ))}
            </select>
          </label>
          <EditorField
            label="Tanggal"
            value={dateTime}
            onChange={setDateTime}
            type="datetime-local"
            className="sm:col-span-2"
          />

          <div className="sm:col-span-2 mt-2 flex flex-col gap-3 sm:flex-row">
            <button
              type="submit"
              disabled={isBusy}
              className="inline-flex min-h-12 flex-1 items-center justify-center rounded-2xl bg-satomi-cyan px-5 font-mono text-xs font-bold uppercase tracking-[0.18em] text-satomi-bg transition hover:bg-satomi-cyan-soft disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isBusy
                ? "Menyimpan..."
                : mode === "create"
                  ? "Simpan Transaksi"
                  : "Simpan Edit"}
            </button>
            {mode === "edit" && onDelete ? (
              <button
                type="button"
                disabled={isBusy}
                onClick={() => void onDelete()}
                className="inline-flex min-h-12 flex-1 items-center justify-center gap-2 rounded-2xl border border-satomi-error/30 bg-satomi-error/10 px-5 font-mono text-xs font-bold uppercase tracking-[0.18em] text-satomi-error transition hover:bg-satomi-error/15 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <Trash2 className="size-4" />
                Hapus
              </button>
            ) : null}
            <button
              type="button"
              onClick={onClose}
              className="inline-flex min-h-12 flex-1 items-center justify-center rounded-2xl border border-white/10 bg-black/20 px-5 font-mono text-xs font-bold uppercase tracking-[0.18em] text-satomi-muted transition hover:text-satomi-text"
            >
              Tutup
            </button>
          </div>
        </form>
      </GlassCard>
    </div>
  );
}

function EditorField({
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
        <CalendarDays className="size-12 text-satomi-cyan satomi-glow-text" />
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

function toDateTimeInputValue(dateValue: string) {
  const date = new Date(dateValue);
  if (Number.isNaN(date.getTime())) {
    return "";
  }

  const pad = (value: number) => String(value).padStart(2, "0");
  const year = date.getFullYear();
  const month = pad(date.getMonth() + 1);
  const day = pad(date.getDate());
  const hours = pad(date.getHours());
  const minutes = pad(date.getMinutes());

  return `${year}-${month}-${day}T${hours}:${minutes}`;
}
