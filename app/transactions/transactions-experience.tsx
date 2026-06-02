"use client";

import {
  CalendarDays,
  ChevronDown,
  Funnel,
  Pencil,
  Search,
  X,
} from "lucide-react";
import { useMemo, useState } from "react";
import { AppShell, EmptyState, GlassCard, StatCard } from "@/src/components/satomi";
import {
  categoryFilters,
  dateFilters,
  transactionRecords,
  transactionSummary,
  type TransactionRecord,
  typeFilters,
} from "@/src/lib/satomi-transactions-data";
import { cn } from "@/src/lib/utils";

export function TransactionsExperience() {
  const [query, setQuery] = useState("");
  const [dateFilter, setDateFilter] = useState("Bulan Ini");
  const [typeFilter, setTypeFilter] = useState("Semua Tipe");
  const [categoryFilter, setCategoryFilter] = useState("Semua Kategori");
  const [selected, setSelected] = useState<TransactionRecord | null>(null);

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
        dateFilter !== "Hari Ini" || transaction.dateGroup === "Hari Ini";

      return queryMatch && typeMatch && categoryMatch && dateMatch;
    });
  }, [categoryFilter, dateFilter, query, typeFilter]);

  const groupedTransactions = useMemo(() => {
    return ["Hari Ini", "Kemarin"].map((group) => ({
      group,
      transactions: filteredTransactions.filter(
        (transaction) => transaction.dateGroup === group,
      ),
    }));
  }, [filteredTransactions]);

  return (
    <AppShell activePath="/transactions">
      <section>
        <h1 className="font-display text-[34px] font-extrabold leading-tight tracking-normal text-satomi-text md:text-5xl">
          Riwayat Transaksi
        </h1>
        <p className="mt-2 text-base leading-7 text-satomi-muted">
          Analisis aliran dana personal dari dummy data SATOMI.
        </p>
      </section>

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
          <div className="flex gap-2 overflow-x-auto pb-1 xl:pb-0">
            <FilterSelect
              label="Tanggal"
              value={dateFilter}
              options={dateFilters}
              icon="date"
              onChange={setDateFilter}
            />
            <FilterSelect
              label="Tipe"
              value={typeFilter}
              options={typeFilters}
              icon="type"
              onChange={setTypeFilter}
            />
            <FilterSelect
              label="Kategori"
              value={categoryFilter}
              options={categoryFilters}
              icon="type"
              onChange={setCategoryFilter}
            />
          </div>
        </div>
      </GlassCard>

      {filteredTransactions.length === 0 ? (
        <EmptyState
          title="Belum ada transaksi"
          description="Tidak ada transaksi yang cocok dengan filter ini. Coba ubah kata kunci, tipe, atau kategori."
          primaryAction={{ label: "Reset Filter", href: "/transactions" }}
        />
      ) : (
        <section className="flex flex-col gap-6">
          {groupedTransactions.map(({ group, transactions }) =>
            transactions.length > 0 ? (
              <TransactionGroup
                key={group}
                title={group}
                transactions={transactions}
                onSelect={setSelected}
              />
            ) : null,
          )}
        </section>
      )}

      <TransactionDetailModal
        transaction={selected}
        onClose={() => setSelected(null)}
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
  onSelect,
}: {
  title: string;
  transactions: TransactionRecord[];
  onSelect: (transaction: TransactionRecord) => void;
}) {
  return (
    <div>
      <div className="mb-3 flex items-center gap-4">
        <h2 className="shrink-0 font-mono text-xs font-semibold uppercase tracking-[0.24em] text-satomi-muted">
          {title}
        </h2>
        <div className="h-px flex-1 bg-white/10" />
      </div>
      <div className="grid gap-3">
        {transactions.map((transaction) => (
          <TransactionRow
            key={transaction.id}
            transaction={transaction}
            onSelect={() => onSelect(transaction)}
          />
        ))}
      </div>
    </div>
  );
}

function TransactionRow({
  transaction,
  onSelect,
}: {
  transaction: TransactionRecord;
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

function TransactionDetailModal({
  transaction,
  onClose,
}: {
  transaction: TransactionRecord | null;
  onClose: () => void;
}) {
  if (!transaction) return null;

  const Icon = transaction.icon;
  const isIncome = transaction.type === "Masuk";

  return (
    <div className="fixed inset-0 z-50 flex items-end bg-black/65 backdrop-blur-sm md:items-center md:justify-center">
      <div
        className="absolute inset-0"
        role="button"
        tabIndex={0}
        aria-label="Tutup detail transaksi"
        onClick={onClose}
        onKeyDown={(event) => {
          if (event.key === "Escape" || event.key === "Enter") onClose();
        }}
      />
      <GlassCard className="relative z-10 w-full rounded-b-none p-5 md:max-w-xl md:rounded-3xl md:p-6">
        <div className="mb-5 flex items-start justify-between gap-4">
          <div className="flex items-center gap-4">
            <div
              className={cn(
                "flex size-12 items-center justify-center rounded-full border",
                isIncome
                  ? "border-satomi-green/25 bg-satomi-green/12 text-satomi-green"
                  : "border-satomi-cyan/25 bg-satomi-cyan/10 text-satomi-cyan",
              )}
            >
              <Icon className="size-5" />
            </div>
            <div>
              <p className="font-mono text-xs font-semibold uppercase tracking-[0.22em] text-satomi-cyan">
                Detail transaksi
              </p>
              <h2 className="mt-1 font-display text-2xl font-extrabold text-satomi-text">
                {transaction.name}
              </h2>
            </div>
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
          <DetailField label="Nominal" value={transaction.amount} />
          <DetailField label="Tipe" value={transaction.type} />
          <DetailField label="Kategori" value={transaction.category} />
          <DetailField label="Pocket" value={transaction.pocket} />
          <DetailField label="Waktu" value={`${transaction.dateGroup}, ${transaction.time}`} />
          <DetailField label="Catatan" value={transaction.note} />
        </div>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <button
            type="button"
            onClick={onClose}
            className="inline-flex min-h-12 flex-1 items-center justify-center rounded-2xl bg-satomi-cyan px-5 font-mono text-xs font-bold uppercase tracking-[0.18em] text-satomi-bg transition hover:bg-satomi-cyan-soft"
          >
            Simpan Edit
          </button>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex min-h-12 flex-1 items-center justify-center rounded-2xl border border-white/10 bg-black/20 px-5 font-mono text-xs font-bold uppercase tracking-[0.18em] text-satomi-muted transition hover:text-satomi-text"
          >
            Tutup
          </button>
        </div>
      </GlassCard>
    </div>
  );
}

function DetailField({ label, value }: { label: string; value: string }) {
  return (
    <label className="block">
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
