"use client";

import { Bot, CalendarPlus, CheckCircle2, Pencil, Plus, ReceiptText, Trash2 } from "lucide-react";
import { useMemo, useState } from "react";
import { AppShell, GlassCard, LoadingState, StatCard } from "@/src/components/satomi";
import { FinanceField, FinanceSelect } from "@/src/components/satomi/forms/finance-fields";
import { Button } from "@/src/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/src/components/ui/dialog";
import {
  billFrequencyOptions,
  billStatusOptions,
  buildBillInsight,
  buildBillSummary,
  mapBillRowToRecord,
  type BillRecord,
  type BillStatus,
  type BillTone,
} from "@/src/lib/satomi-goals-bills";
import {
  createBill,
  deleteBill,
  markBillAsPaid,
  updateBill,
  type BillInput,
  type BillRow,
  type PocketRow,
} from "@/src/lib/supabase/finance";
import { createSupabaseBrowserClient } from "@/src/lib/supabase/client";
import { useFinanceSnapshot } from "@/src/lib/supabase/use-finance-snapshot";
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
  Diarsipkan: "border-white/15 bg-white/8 text-satomi-muted",
};

const EMPTY_BILLS: BillRow[] = [];
const EMPTY_POCKETS: PocketRow[] = [];

export function BillsExperience() {
  const { snapshot, isLoading, error, refresh } = useFinanceSnapshot();
  const [selectedBill, setSelectedBill] = useState<BillRow | null>(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isMutating, setIsMutating] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [statusTone, setStatusTone] = useState<"success" | "error">("success");

  const supabase = useMemo(() => createSupabaseBrowserClient(), []);
  const bills = snapshot?.bills ?? EMPTY_BILLS;
  const pockets = snapshot?.pockets ?? EMPTY_POCKETS;
  const pocketNameById = useMemo(
    () => new Map(pockets.map((pocket) => [pocket.id, pocket.name])),
    [pockets],
  );
  const billRecords = useMemo(
    () => bills.map((bill) => mapBillRowToRecord(bill, pocketNameById)),
    [bills, pocketNameById],
  );
  const billSummary = useMemo(() => buildBillSummary(bills), [bills]);
  const billInsight = useMemo(() => buildBillInsight(bills, pockets), [bills, pockets]);

  async function handleCreate(input: BillInput) {
    setIsMutating(true);
    setStatusMessage(null);

    try {
      await createBill(supabase, input);
      await refresh();
      setStatusTone("success");
      setStatusMessage("Tagihan baru berhasil disimpan.");
      setIsCreateOpen(false);
    } catch (error) {
      setStatusTone("error");
      setStatusMessage(error instanceof Error ? error.message : "Tagihan belum berhasil disimpan.");
    } finally {
      setIsMutating(false);
    }
  }

  async function handleUpdate(input: BillInput) {
    if (!selectedBill) return;

    setIsMutating(true);
    setStatusMessage(null);

    try {
      await updateBill(supabase, selectedBill.id, input);
      await refresh();
      setStatusTone("success");
      setStatusMessage("Perubahan tagihan berhasil disimpan.");
      setSelectedBill(null);
    } catch (error) {
      setStatusTone("error");
      setStatusMessage(
        error instanceof Error ? error.message : "Perubahan tagihan belum berhasil disimpan.",
      );
    } finally {
      setIsMutating(false);
    }
  }

  async function handleDelete() {
    if (!selectedBill) return;

    setIsMutating(true);
    setStatusMessage(null);

    try {
      await deleteBill(supabase, selectedBill.id);
      await refresh();
      setStatusTone("success");
      setStatusMessage("Tagihan berhasil dihapus.");
      setSelectedBill(null);
    } catch (error) {
      setStatusTone("error");
      setStatusMessage(error instanceof Error ? error.message : "Tagihan belum berhasil dihapus.");
    } finally {
      setIsMutating(false);
    }
  }

  async function handleMarkPaid(bill: BillRow) {
    setIsMutating(true);
    setStatusMessage(null);

    try {
      await markBillAsPaid(supabase, bill.id);
      await refresh();
      setStatusTone("success");
      setStatusMessage(`${bill.name} ditandai sebagai sudah dibayar.`);
    } catch (error) {
      setStatusTone("error");
      setStatusMessage(
        error instanceof Error ? error.message : "Status tagihan belum berhasil diperbarui.",
      );
    } finally {
      setIsMutating(false);
    }
  }

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
        <Button size="lg" onClick={() => setIsCreateOpen(true)}>
          <Plus className="size-5" />
          Tambah Tagihan
        </Button>
      </section>

      {statusMessage ? <StatusBanner tone={statusTone}>{statusMessage}</StatusBanner> : null}

      {isLoading ? (
        <LoadingState
          variant="skeleton"
          title="Satomi sedang memuat tagihan..."
          description="Menyiapkan pengingat rutin dari Supabase."
        />
      ) : error ? (
        <DataStatePanel
          title="Tagihan belum bisa dimuat"
          description={error}
          primaryLabel="Coba Lagi"
          onPrimary={refresh}
        />
      ) : (
        <>
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
                {(["Belum dibayar", "Sudah dibayar", "Terjadwal", "Diarsipkan"] as BillStatus[]).map(
                  (status) => (
                    <StatusChip key={status} status={status} />
                  ),
                )}
              </div>
            </div>
          </GlassCard>

          {billRecords.length === 0 ? (
            <DataStatePanel
              title="Belum ada tagihan"
              description="Tambahkan tagihan pertama agar Satomi bisa menjaga ritme pembayaran rutinnya."
              primaryLabel="Tambah Tagihan"
              onPrimary={() => setIsCreateOpen(true)}
            />
          ) : (
            <section>
              <div className="mb-4 flex items-end justify-between gap-4">
                <h2 className="font-display text-2xl font-extrabold text-satomi-text">
                  Daftar Tagihan
                </h2>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                {billRecords.map((bill) => {
                  const source = bills.find((item) => item.id === bill.id);
                  if (!source) return null;

                  return (
                    <BillCard
                      key={bill.id}
                      bill={bill}
                      onEdit={() => setSelectedBill(source)}
                      onMarkPaid={
                        source.status === "paid" || source.status === "archived"
                          ? undefined
                          : () => void handleMarkPaid(source)
                      }
                      isMutating={isMutating}
                    />
                  );
                })}
              </div>
            </section>
          )}
        </>
      )}

      <BillEditorDialog
        key={`create-bill-${isCreateOpen ? "open" : "closed"}`}
        isOpen={isCreateOpen}
        mode="create"
        bill={null}
        pockets={pockets}
        isBusy={isMutating}
        onOpenChange={setIsCreateOpen}
        onSubmit={handleCreate}
      />
      <BillEditorDialog
        key={selectedBill?.id ?? "edit-bill"}
        isOpen={Boolean(selectedBill)}
        mode="edit"
        bill={selectedBill}
        pockets={pockets}
        isBusy={isMutating}
        onOpenChange={(open) => {
          if (!open) setSelectedBill(null);
        }}
        onSubmit={handleUpdate}
        onDelete={handleDelete}
      />
    </AppShell>
  );
}

function BillCard({
  bill,
  onEdit,
  onMarkPaid,
  isMutating,
}: {
  bill: BillRecord;
  onEdit: () => void;
  onMarkPaid?: () => void;
  isMutating: boolean;
}) {
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
            <h3 className={cn("text-xl font-semibold text-satomi-text", isPaid && "line-through decoration-satomi-muted")}>
              {bill.name}
            </h3>
            <p className="mt-1 text-sm text-satomi-muted">Jatuh tempo: {bill.dueDate}</p>
          </div>
        </div>
        <div className="text-right">
          <p className={cn("font-display text-2xl font-extrabold text-satomi-text", isPaid && "text-satomi-muted line-through decoration-satomi-muted")}>
            {bill.amount}
          </p>
          <div className="mt-2">
            <StatusChip status={bill.status} />
          </div>
        </div>
      </div>

      <div className="h-px bg-white/10" />

      <div className="mt-5 flex flex-col gap-4">
        <div className="flex min-w-0 items-center gap-2">
          <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-satomi-muted">
            Sumber:
          </span>
          <span className="inline-flex min-w-0 items-center gap-1 rounded-lg border border-satomi-cyan/25 bg-satomi-cyan/10 px-2 py-1 font-mono text-[10px] font-semibold uppercase tracking-[0.08em] text-satomi-cyan">
            {bill.source}
          </span>
        </div>
        <p className="text-sm text-satomi-muted">{bill.dueLabel}</p>
        <div className="flex flex-col gap-3 sm:flex-row">
          {onMarkPaid ? (
            <Button className="flex-1" disabled={isMutating} onClick={onMarkPaid}>
              <CheckCircle2 className="size-4" />
              Tandai Lunas
            </Button>
          ) : null}
          <Button variant="secondary" className="flex-1" onClick={onEdit}>
            <Pencil className="size-4" />
            Kelola
          </Button>
        </div>
      </div>
    </GlassCard>
  );
}

function BillEditorDialog({
  isOpen,
  mode,
  bill,
  pockets,
  isBusy,
  onOpenChange,
  onSubmit,
  onDelete,
}: {
  isOpen: boolean;
  mode: "create" | "edit";
  bill: BillRow | null;
  pockets: Array<{ id: string; name: string }>;
  isBusy: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (input: BillInput) => Promise<void>;
  onDelete?: () => Promise<void>;
}) {
  const [name, setName] = useState(bill?.name ?? "");
  const [amount, setAmount] = useState(bill ? String(bill.amount) : "");
  const [dueDate, setDueDate] = useState(bill?.due_date ?? "");
  const [frequency, setFrequency] = useState(bill?.frequency ?? "monthly");
  const [status, setStatus] = useState(bill?.status ?? "unpaid");
  const [pocketId, setPocketId] = useState(bill?.pocket_id ?? "__none__");
  const [reminderDays, setReminderDays] = useState(
    bill?.reminder_days != null ? String(bill.reminder_days) : "3",
  );
  const [localError, setLocalError] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLocalError(null);

    const parsedAmount = Number(amount);
    const parsedReminder = reminderDays === "" ? null : Number(reminderDays);

    if (!name.trim()) {
      setLocalError("Nama tagihan wajib diisi.");
      return;
    }

    if (!Number.isFinite(parsedAmount) || parsedAmount <= 0) {
      setLocalError("Nominal tagihan harus lebih besar dari nol.");
      return;
    }

    if (!dueDate) {
      setLocalError("Tanggal jatuh tempo wajib diisi.");
      return;
    }

    if (parsedReminder !== null && (!Number.isFinite(parsedReminder) || parsedReminder < 0)) {
      setLocalError("Pengingat tagihan harus berupa angka nol atau lebih.");
      return;
    }

    try {
      await onSubmit({
        name,
        amount: parsedAmount,
        due_date: dueDate,
        frequency,
        status,
        pocket_id: pocketId === "__none__" ? null : pocketId,
        reminder_days: parsedReminder,
      });
    } catch (error) {
      setLocalError(error instanceof Error ? error.message : "Tagihan belum berhasil disimpan.");
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <p className="font-mono text-xs font-semibold uppercase tracking-[0.22em] text-satomi-cyan">
            Tagihan Rutin
          </p>
          <DialogTitle>{mode === "create" ? "Tambah Tagihan" : "Edit Tagihan"}</DialogTitle>
          <DialogDescription>
            Atur nominal, jatuh tempo, status, dan pocket sumber agar Satomi bisa memantau tagihanmu dengan rapi.
          </DialogDescription>
        </DialogHeader>

        {localError ? <StatusBanner tone="error">{localError}</StatusBanner> : null}

        <form className="grid gap-4 sm:grid-cols-2" onSubmit={handleSubmit}>
          <FinanceField
            label="Nama tagihan"
            value={name}
            onChange={(event) => setName(event.target.value)}
            className="sm:col-span-2"
          />
          <FinanceField
            label="Nominal"
            type="number"
            inputMode="numeric"
            value={amount}
            onChange={(event) => setAmount(event.target.value)}
          />
          <FinanceField
            label="Jatuh tempo"
            type="date"
            value={dueDate}
            onChange={(event) => setDueDate(event.target.value)}
          />
          <FinanceSelect
            label="Frekuensi"
            value={frequency}
            onValueChange={setFrequency}
            options={billFrequencyOptions}
          />
          <FinanceSelect
            label="Status"
            value={status}
            onValueChange={setStatus}
            options={billStatusOptions}
          />
          <FinanceSelect
            label="Pocket sumber"
            value={pocketId}
            onValueChange={setPocketId}
            options={[
              { value: "__none__", label: "Tanpa Pocket" },
              ...pockets.map((pocket) => ({ value: pocket.id, label: pocket.name })),
            ]}
            className="sm:col-span-2"
          />
          <FinanceField
            label="Pengingat (hari)"
            type="number"
            inputMode="numeric"
            value={reminderDays}
            onChange={(event) => setReminderDays(event.target.value)}
          />

          <div className="mt-2 flex flex-col gap-3 sm:col-span-2 sm:flex-row">
            <Button type="submit" className="flex-1">
              {isBusy ? "Menyimpan..." : mode === "create" ? "Simpan Tagihan" : "Simpan Edit"}
            </Button>
            {mode === "edit" && onDelete ? (
              <Button
                type="button"
                variant="danger"
                className="flex-1"
                disabled={isBusy}
                onClick={() => void onDelete()}
              >
                <Trash2 className="size-4" />
                Hapus Tagihan
              </Button>
            ) : null}
            <Button type="button" variant="secondary" className="flex-1" onClick={() => onOpenChange(false)}>
              Tutup
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
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
        <ReceiptText className="size-12 text-satomi-cyan satomi-glow-text" />
      </div>
      <h2 className="font-display text-4xl font-extrabold leading-tight text-satomi-text">{title}</h2>
      <p className="mt-4 max-w-lg text-base leading-7 text-satomi-muted md:text-lg">{description}</p>
      <Button className="mt-8" size="lg" onClick={() => void onPrimary()}>
        {primaryLabel}
      </Button>
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
