"use client";

import {
  ChevronDown,
  Mic,
  PanelRight,
  Pencil,
  Send,
  Sparkles,
  WalletCards,
} from "lucide-react";
import { useMemo, useState } from "react";
import {
  AppShell,
  ChatBubble,
  GlassCard,
  NudgeWarningCard,
  TransactionPreviewCard,
} from "@/src/components/satomi";
import { FinanceField, FinanceSelect } from "@/src/components/satomi/forms/finance-fields";
import { Button } from "@/src/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/src/components/ui/dialog";
import type { NudgeWarning } from "@/src/components/satomi/nudge-warning-card";
import type { TransactionPreview } from "@/src/components/satomi/transaction-preview-card";
import { formatCurrency, mapPocketRowToRecord, mapTransactionRowToRecord } from "@/src/lib/satomi-finance";
import {
  createTransaction,
  type PocketRow,
  type TransactionInput,
  type TransactionRow,
} from "@/src/lib/supabase/finance";
import { createSupabaseBrowserClient } from "@/src/lib/supabase/client";
import { useFinanceSnapshot } from "@/src/lib/supabase/use-finance-snapshot";
import { cn } from "@/src/lib/utils";

type ConversationMessage = {
  id: string;
  role: "user" | "satomi";
  content: string;
  time?: string;
};

type ExtractionResult = {
  amount: number | null;
  type: "income" | "expense" | null;
  category: string | null;
  pocketSuggestion: string | null;
  description: string | null;
  date: string | null;
  confidence: number | null;
  needsClarification: boolean;
  clarificationQuestion: string | null;
  assistantMessage: string;
  nudge: NudgeWarning | null;
};

const typeOptions = [
  { value: "expense", label: "Pengeluaran" },
  { value: "income", label: "Pemasukan" },
];

const EMPTY_POCKETS: PocketRow[] = [];
const EMPTY_TRANSACTIONS: TransactionRow[] = [];

export function ChatExperience() {
  const { snapshot, isLoading, error, refresh } = useFinanceSnapshot();
  const [messages, setMessages] = useState<ConversationMessage[]>([
    {
      id: "welcome",
      role: "satomi",
      content: "Halo, mau catat transaksi apa hari ini?",
    },
  ]);
  const [draft, setDraft] = useState("");
  const [isExtracting, setIsExtracting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [activeExtraction, setActiveExtraction] = useState<ExtractionResult | null>(null);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [statusTone, setStatusTone] = useState<"success" | "error">("success");
  const [clarificationBaseMessage, setClarificationBaseMessage] = useState<string | null>(null);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(true);

  const supabase = useMemo(() => createSupabaseBrowserClient(), []);
  const pockets = snapshot?.pockets ?? EMPTY_POCKETS;
  const transactions = snapshot?.transactions ?? EMPTY_TRANSACTIONS;
  const pocketRecords = useMemo(
    () => pockets.map((pocket) => mapPocketRowToRecord(pocket, transactions)),
    [pockets, transactions],
  );
  const pocketNameById = useMemo(
    () => new Map(pockets.map((pocket) => [pocket.id, pocket.name])),
    [pockets],
  );
  const recentTransactions = useMemo(
    () =>
      transactions
        .slice(0, 3)
        .map((transaction) => mapTransactionRowToRecord(transaction, pocketNameById)),
    [pocketNameById, transactions],
  );
  const activePocket = pocketRecords[0] ?? null;
  const riskyPocket =
    pocketRecords.find((pocket) => pocket.progress >= 70) ?? pocketRecords[1] ?? null;

  const previewCard = activeExtraction ? mapExtractionToPreview(activeExtraction) : null;

  async function handleSend() {
    const message = draft.trim();
    if (!message || isExtracting) return;

    const userMessage: ConversationMessage = {
      id: `user-${Date.now()}`,
      role: "user",
      content: message,
      time: formatTimeNow(),
    };

    setMessages((current) => [...current, userMessage]);
    setDraft("");
    setStatusMessage(null);
    setIsExtracting(true);

    const combinedMessage = clarificationBaseMessage
      ? `${clarificationBaseMessage}. ${message}`
      : message;
    const history = messages.slice(-6).map((item) => ({
      role: item.role,
      content: item.content,
    }));

    try {
      const response = await fetch("/api/chat/extract", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: combinedMessage, history }),
      });

      const payload = (await response.json()) as
        | ExtractionResult
        | { error?: { message?: string } };

      if (!response.ok || ("error" in payload && payload.error)) {
        const errorMessage =
          "error" in payload && payload.error?.message
            ? payload.error.message
            : "Ekstraksi transaksi belum berhasil.";
        throw new Error(errorMessage);
      }

      const extraction = payload as ExtractionResult;

      const satomiMessage: ConversationMessage = {
        id: `satomi-${Date.now()}`,
        role: "satomi",
        content: extraction.assistantMessage,
      };

      setMessages((current) => [...current, satomiMessage]);
      setActiveExtraction(extraction);

      if (extraction.needsClarification) {
        setClarificationBaseMessage(combinedMessage);
      } else {
        setClarificationBaseMessage(null);
      }
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Ekstraksi transaksi belum bisa dijalankan sekarang.";
      setStatusTone("error");
      setStatusMessage(message);
      setMessages((current) => [
        ...current,
        {
          id: `satomi-error-${Date.now()}`,
          role: "satomi",
          content: message,
        },
      ]);
    } finally {
      setIsExtracting(false);
    }
  }

  async function handleSave(preview: ExtractionResult) {
    const input = buildTransactionInputFromExtraction(preview, pockets);
    if (!input) {
      setStatusTone("error");
      setStatusMessage("Preview transaksi belum lengkap untuk disimpan.");
      return;
    }

    setIsSaving(true);
    setStatusMessage(null);

    try {
      await createTransaction(supabase, input);
      await refresh();
      setStatusTone("success");
      setStatusMessage("Transaksi dari chat berhasil disimpan.");
      setMessages((current) => [
        ...current,
        {
          id: `satomi-saved-${Date.now()}`,
          role: "satomi",
          content: "Siap, transaksi ini sudah kusimpan ke riwayat kamu.",
        },
      ]);
      setActiveExtraction(null);
      setClarificationBaseMessage(null);
      setIsEditOpen(false);
    } catch (error) {
      setStatusTone("error");
      setStatusMessage(
        error instanceof Error ? error.message : "Transaksi dari chat belum berhasil disimpan.",
      );
    } finally {
      setIsSaving(false);
    }
  }

  function handleCancelPreview() {
    setActiveExtraction(null);
    setClarificationBaseMessage(null);
    setMessages((current) => [
      ...current,
      {
        id: `satomi-cancel-${Date.now()}`,
        role: "satomi",
        content: "Oke, transaksi ini tidak jadi kusimpan.",
      },
    ]);
  }

  return (
    <AppShell activePath="/chat" className="h-dvh max-w-none gap-0 px-0 pb-0 pt-16 md:h-dvh md:pl-72 md:pr-0 md:pt-20">
      <div className="grid min-h-0 flex-1 grid-cols-1 lg:grid-cols-[minmax(0,1fr)_360px]">
        <section className="relative flex min-h-0 flex-col overflow-hidden">
          <ChatHeader />

          <div className="satomi-scrollbar-none flex-1 overflow-y-auto px-4 pb-56 pt-5 md:px-8 md:pb-8">
            <div className="mx-auto flex max-w-3xl flex-col gap-6">
              {statusMessage ? <StatusBanner tone={statusTone}>{statusMessage}</StatusBanner> : null}

              {messages.map((message) => (
                <ChatBubble key={message.id} role={message.role} time={message.time}>
                  {message.content}
                </ChatBubble>
              ))}

              {isExtracting ? (
                <GlassCard className="ml-0 max-w-[88%] p-4 md:ml-12 md:max-w-[76%]">
                  <div className="flex items-center gap-3">
                    <div className="flex size-9 items-center justify-center rounded-full bg-satomi-cyan/12 text-satomi-cyan">
                      <Sparkles className="size-4 animate-pulse" />
                    </div>
                    <div>
                      <p className="font-mono text-xs font-semibold uppercase tracking-[0.2em] text-satomi-cyan">
                        Satomi sedang membaca
                      </p>
                      <p className="mt-2 text-sm leading-6 text-satomi-muted">
                        Menyusun preview transaksi dari pesanmu...
                      </p>
                    </div>
                  </div>
                </GlassCard>
              ) : null}

              {activeExtraction?.needsClarification ? (
                <ClarificationState question={activeExtraction.clarificationQuestion || "Nominalnya berapa?"} />
              ) : null}

              {activeExtraction && !activeExtraction.needsClarification && activeExtraction.nudge ? (
                <NudgeWarningCard
                  warning={activeExtraction.nudge}
                  isSaving={isSaving}
                  onConfirm={() => void handleSave(activeExtraction)}
                  onEdit={() => setIsEditOpen(true)}
                  onCancel={handleCancelPreview}
                />
              ) : null}

              {activeExtraction && !activeExtraction.needsClarification && !activeExtraction.nudge && previewCard ? (
                <div className="hidden md:block">
                  <TransactionPreviewCard
                    transaction={previewCard}
                    isSaving={isSaving}
                    onSave={() => void handleSave(activeExtraction)}
                    onEdit={() => setIsEditOpen(true)}
                    onCancel={handleCancelPreview}
                  />
                </div>
              ) : null}
            </div>
          </div>

          <Composer
            draft={draft}
            setDraft={setDraft}
            isBusy={isExtracting}
            onSend={() => void handleSend()}
          />

          {activeExtraction && !activeExtraction.needsClarification && !activeExtraction.nudge && previewCard ? (
            <MobileTransactionSheet
              isOpen={isPreviewOpen}
              onToggle={() => setIsPreviewOpen((value) => !value)}
              preview={previewCard}
              isSaving={isSaving}
              onSave={() => void handleSave(activeExtraction)}
              onEdit={() => setIsEditOpen(true)}
              onCancel={handleCancelPreview}
            />
          ) : null}
        </section>

        <FinancialContextPanel
          isLoading={isLoading}
          error={error}
          activePocket={activePocket}
          riskyPocket={riskyPocket}
          recent={recentTransactions.map((item) => `${item.name} ${item.amount}`)}
        />
      </div>

      <EditTransactionDialog
        key={`${activeExtraction?.description ?? "none"}-${activeExtraction?.amount ?? "0"}`}
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        extraction={activeExtraction}
        pockets={pockets}
        onSave={handleSave}
        isSaving={isSaving}
      />
    </AppShell>
  );
}

function ChatHeader() {
  return (
    <div className="hidden border-b border-white/10 bg-satomi-surface/50 px-8 py-5 backdrop-blur-2xl md:block">
      <div className="mx-auto flex max-w-3xl items-center justify-between gap-4">
        <div>
          <p className="font-mono text-xs font-semibold uppercase tracking-[0.24em] text-satomi-cyan">
            Satomi AI
          </p>
          <h1 className="mt-1 font-display text-3xl font-extrabold text-satomi-text">
            Chat Pencatat Transaksi
          </h1>
        </div>
        <div className="inline-flex items-center gap-2 rounded-full border border-satomi-cyan/30 bg-satomi-cyan/10 px-3 py-1.5">
          <span className="size-2 rounded-full bg-satomi-cyan shadow-[0_0_10px_rgba(0,240,255,0.9)]" />
          <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-satomi-cyan">
            Preview dulu
          </span>
        </div>
      </div>
    </div>
  );
}

function ClarificationState({ question }: { question: string }) {
  return (
    <GlassCard className="ml-0 max-w-[88%] p-4 md:ml-12 md:max-w-[76%]">
      <div className="flex gap-3">
        <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-satomi-cyan/12 text-satomi-cyan">
          <Sparkles className="size-4" />
        </div>
        <div>
          <p className="font-mono text-xs font-semibold uppercase tracking-[0.2em] text-satomi-cyan">
            Perlu konfirmasi
          </p>
          <p className="mt-2 text-sm leading-6 text-satomi-muted">{question}</p>
          <p className="mt-3 text-xs leading-5 text-satomi-muted">
            Balas saja di kolom chat. Satomi akan gabungkan jawabanmu dengan pesan sebelumnya sebelum membuat preview baru.
          </p>
        </div>
      </div>
    </GlassCard>
  );
}

function Composer({
  draft,
  setDraft,
  isBusy,
  onSend,
}: {
  draft: string;
  setDraft: (value: string) => void;
  isBusy: boolean;
  onSend: () => void;
}) {
  return (
    <div className="fixed inset-x-0 bottom-[calc(var(--satomi-mobile-nav-height)+var(--safe-area-bottom))] z-30 border-t border-white/5 bg-satomi-bg/75 px-4 py-3 backdrop-blur-2xl md:absolute md:bottom-0 md:px-8">
      <div className="mx-auto flex max-w-3xl items-center gap-3 rounded-full border border-satomi-outline/35 bg-satomi-surface-mid/85 p-2 shadow-[0_0_34px_rgba(0,240,255,0.10)]">
        <button
          type="button"
          className="flex size-11 shrink-0 items-center justify-center rounded-full text-satomi-muted transition hover:bg-white/5 hover:text-satomi-cyan"
          aria-label="Tambah lampiran"
          disabled
        >
          <Pencil className="size-5" />
        </button>
        <input
          className="min-w-0 flex-1 border-0 bg-transparent text-base text-satomi-text outline-none placeholder:text-satomi-muted/60"
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          placeholder="Contoh: tadi keluar 35 ribu buat ayam geprek"
          aria-label="Pesan untuk Satomi"
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              event.preventDefault();
              onSend();
            }
          }}
        />
        <button
          type="button"
          className="hidden size-11 shrink-0 items-center justify-center rounded-full text-satomi-muted transition hover:bg-white/5 hover:text-satomi-cyan sm:flex"
          aria-label="Gunakan suara"
          disabled
        >
          <Mic className="size-5" />
        </button>
        <button
          type="button"
          onClick={onSend}
          disabled={isBusy || !draft.trim()}
          className="flex size-12 shrink-0 items-center justify-center rounded-full bg-satomi-cyan text-satomi-bg shadow-[0_0_28px_rgba(0,240,255,0.36)] transition hover:bg-satomi-cyan-soft disabled:cursor-not-allowed disabled:opacity-60"
          aria-label="Kirim"
        >
          <Send className="size-5" />
        </button>
      </div>
    </div>
  );
}

function FinancialContextPanel({
  isLoading,
  error,
  activePocket,
  riskyPocket,
  recent,
}: {
  isLoading: boolean;
  error: string | null;
  activePocket: ReturnType<typeof mapPocketRowToRecord> | null;
  riskyPocket: ReturnType<typeof mapPocketRowToRecord> | null;
  recent: string[];
}) {
  return (
    <aside className="hidden min-h-0 border-l border-white/10 bg-satomi-surface/55 p-5 backdrop-blur-2xl lg:block">
      <div className="sticky top-24 flex flex-col gap-5">
        <div>
          <div className="mb-2 flex items-center gap-2 text-satomi-cyan">
            <PanelRight className="size-4" />
            <p className="font-mono text-xs font-semibold uppercase tracking-[0.22em]">
              Konteks Finansial
            </p>
          </div>
          <p className="text-sm leading-6 text-satomi-muted">
            Satomi memakai snapshot finansial terbaru untuk memberi saran pocket dan nudge sebelum transaksi benar-benar disimpan.
          </p>
        </div>

        {isLoading ? (
          <GlassCard className="p-4">
            <p className="font-mono text-xs font-semibold uppercase tracking-[0.2em] text-satomi-cyan">
              Memuat konteks
            </p>
            <p className="mt-2 text-sm leading-6 text-satomi-muted">
              Pocket dan riwayat dekat sedang disiapkan.
            </p>
          </GlassCard>
        ) : error ? (
          <GlassCard className="p-4 text-sm leading-6 text-satomi-muted">{error}</GlassCard>
        ) : (
          <>
            {activePocket ? (
              <ContextPocket
                title={activePocket.name}
                used={activePocket.used}
                limit={activePocket.limit}
                progress={activePocket.progress}
                tone="cyan"
              />
            ) : null}
            {riskyPocket ? (
              <ContextPocket
                title={riskyPocket.name}
                used={riskyPocket.used}
                limit={riskyPocket.limit}
                progress={riskyPocket.progress}
                tone="purple"
              />
            ) : null}

            <GlassCard className="p-4">
              <p className="font-mono text-xs font-semibold uppercase tracking-[0.2em] text-satomi-muted">
                Riwayat dekat
              </p>
              <div className="mt-4 grid gap-3">
                {recent.length === 0 ? (
                  <div className="rounded-2xl border border-white/10 bg-black/20 px-3 py-2 text-sm text-satomi-muted">
                    Belum ada transaksi terbaru.
                  </div>
                ) : (
                  recent.map((item) => (
                    <div
                      key={item}
                      className="rounded-2xl border border-white/10 bg-black/20 px-3 py-2 text-sm text-satomi-text"
                    >
                      {item}
                    </div>
                  ))
                )}
              </div>
            </GlassCard>
          </>
        )}
      </div>
    </aside>
  );
}

function ContextPocket({
  title,
  used,
  limit,
  progress,
  tone,
}: {
  title: string;
  used: string;
  limit: string;
  progress: number;
  tone: "cyan" | "purple";
}) {
  return (
    <GlassCard className="p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="font-semibold text-satomi-text">{title}</p>
          <p className="mt-1 text-sm text-satomi-muted">
            {used} / {limit}
          </p>
        </div>
        <WalletCards
          className={cn(
            "size-5",
            tone === "cyan" ? "text-satomi-cyan" : "text-satomi-purple-soft",
          )}
        />
      </div>
      <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/12">
        <div
          className={cn(
            "h-full rounded-full shadow-[0_0_16px_rgba(0,240,255,0.28)]",
            tone === "cyan" ? "bg-satomi-cyan" : "bg-satomi-purple-soft",
          )}
          style={{ width: `${Math.min(progress, 100)}%` }}
        />
      </div>
      <p className="mt-2 text-right font-mono text-xs text-satomi-muted">{progress}% terpakai</p>
    </GlassCard>
  );
}

function MobileTransactionSheet({
  isOpen,
  onToggle,
  preview,
  isSaving,
  onSave,
  onEdit,
  onCancel,
}: {
  isOpen: boolean;
  onToggle: () => void;
  preview: TransactionPreview;
  isSaving: boolean;
  onSave: () => void;
  onEdit: () => void;
  onCancel: () => void;
}) {
  return (
    <div
      className={cn(
        "fixed inset-x-0 bottom-[calc(var(--satomi-mobile-nav-height)+5.25rem+var(--safe-area-bottom))] z-20 transition-transform duration-300 md:hidden",
        isOpen ? "translate-y-0" : "translate-y-[calc(100%-58px)]",
      )}
    >
      <div className="mx-auto max-w-md">
        <button
          type="button"
          onClick={onToggle}
          className="mx-auto mb-2 flex min-h-11 items-center gap-2 rounded-full border border-satomi-cyan/30 bg-satomi-surface/90 px-4 py-2 font-mono text-[10px] uppercase tracking-[0.18em] text-satomi-cyan shadow-[0_0_20px_rgba(0,240,255,0.16)]"
        >
          Pratinjau transaksi
          <ChevronDown className={cn("size-4 transition", isOpen ? "" : "rotate-180")} />
        </button>
        <div className="satomi-scrollbar-none max-h-[min(58dvh,460px)] overflow-y-auto overscroll-contain rounded-t-[28px]">
          <TransactionPreviewCard
            transaction={preview}
            compact
            isSaving={isSaving}
            onSave={onSave}
            onEdit={onEdit}
            onCancel={onCancel}
          />
        </div>
      </div>
    </div>
  );
}

function EditTransactionDialog({
  isOpen,
  onClose,
  extraction,
  pockets,
  onSave,
  isSaving,
}: {
  isOpen: boolean;
  onClose: () => void;
  extraction: ExtractionResult | null;
  pockets: PocketRow[];
  onSave: (preview: ExtractionResult) => Promise<void>;
  isSaving: boolean;
}) {
  const [amount, setAmount] = useState(extraction?.amount ? String(extraction.amount) : "");
  const [type, setType] = useState<"income" | "expense">(extraction?.type ?? "expense");
  const [category, setCategory] = useState(extraction?.category ?? "");
  const [pocketSuggestion, setPocketSuggestion] = useState(extraction?.pocketSuggestion ?? "__none__");
  const [description, setDescription] = useState(extraction?.description ?? "");
  const [date, setDate] = useState(extraction?.date ?? "today");
  const [localError, setLocalError] = useState<string | null>(null);

  if (!isOpen || !extraction) return null;
  const currentExtraction = extraction;

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLocalError(null);

    const parsedAmount = Number(amount);
    if (!Number.isFinite(parsedAmount) || parsedAmount <= 0) {
      setLocalError("Nominal transaksi harus lebih besar dari nol.");
      return;
    }

    await onSave({
      ...currentExtraction,
      amount: parsedAmount,
      type,
      category,
      pocketSuggestion: pocketSuggestion === "__none__" ? null : pocketSuggestion,
      description,
      date,
      confidence: currentExtraction.confidence ?? null,
      needsClarification: false,
      clarificationQuestion: null,
      nudge: currentExtraction.nudge ?? null,
    });
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent>
        <DialogHeader>
          <p className="font-mono text-xs font-semibold uppercase tracking-[0.22em] text-satomi-cyan">
            Edit preview
          </p>
          <DialogTitle>Perbaiki hasil ekstraksi</DialogTitle>
          <DialogDescription>
            Ubah hasil preview jika ada kategori, pocket, atau nominal yang masih perlu dirapikan sebelum disimpan.
          </DialogDescription>
        </DialogHeader>

        {localError ? <StatusBanner tone="error">{localError}</StatusBanner> : null}

        <form className="grid gap-4 sm:grid-cols-2" onSubmit={handleSubmit}>
          <FinanceField
            label="Nominal"
            type="number"
            inputMode="numeric"
            value={amount}
            onChange={(event) => setAmount(event.target.value)}
          />
          <FinanceSelect
            label="Tipe"
            value={type}
            onValueChange={(value) => setType(value as "income" | "expense")}
            options={typeOptions}
          />
          <FinanceField
            label="Kategori"
            value={category}
            onChange={(event) => setCategory(event.target.value)}
          />
          <FinanceSelect
            label="Pocket"
            value={pocketSuggestion}
            onValueChange={setPocketSuggestion}
            options={[
              { value: "__none__", label: "Tanpa Pocket" },
              ...pockets.map((pocket) => ({ value: pocket.name, label: pocket.name })),
            ]}
          />
          <FinanceField
            label="Deskripsi"
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            className="sm:col-span-2"
          />
          <FinanceSelect
            label="Tanggal"
            value={date || "today"}
            onValueChange={setDate}
            options={[
              { value: "today", label: "Hari ini" },
              { value: "yesterday", label: "Kemarin" },
            ]}
            className="sm:col-span-2"
          />
          <div className="mt-2 flex flex-col gap-3 sm:col-span-2 sm:flex-row">
            <Button type="submit" className="flex-1" disabled={isSaving}>
              {isSaving ? "Menyimpan..." : "Simpan Transaksi"}
            </Button>
            <Button type="button" variant="secondary" className="flex-1" onClick={onClose}>
              Tutup
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
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

function mapExtractionToPreview(extraction: ExtractionResult): TransactionPreview {
  return {
    nominal: extraction.amount ? formatCurrency(extraction.amount) : "-",
    tipe: extraction.type === "income" ? "Pemasukan" : "Pengeluaran",
    kategori: extraction.category ?? "Belum dipilih",
    pocket: extraction.pocketSuggestion ?? "Tanpa Pocket",
    deskripsi: extraction.description ?? "-",
    tanggal: mapDateKeywordToLabel(extraction.date),
    confidence: `${Math.round((extraction.confidence ?? 0) * 100)}%`,
  };
}

function mapDateKeywordToLabel(date: string | null) {
  if (date === "yesterday") return "Kemarin";
  if (date === "today" || !date) return "Hari ini";
  return date;
}

function formatTimeNow() {
  return new Intl.DateTimeFormat("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date());
}

function buildTransactionInputFromExtraction(
  extraction: ExtractionResult,
  pockets: PocketRow[],
): TransactionInput | null {
  if (!extraction.amount || !extraction.type || !extraction.category) {
    return null;
  }

  const matchedPocket =
    pockets.find((pocket) => pocket.name === extraction.pocketSuggestion) ??
    pockets.find(
      (pocket) =>
        extraction.pocketSuggestion &&
        pocket.name.toLowerCase().includes(extraction.pocketSuggestion.toLowerCase()),
    ) ??
    null;

  return {
    amount: extraction.amount,
    type: extraction.type,
    category: extraction.category,
    pocket_id: matchedPocket?.id ?? null,
    description: extraction.description ?? extraction.category,
    transaction_date: resolveDateKeywordToIso(extraction.date),
    source: "chat",
  };
}

function resolveDateKeywordToIso(date: string | null) {
  const base = new Date();
  if (date === "yesterday") {
    base.setDate(base.getDate() - 1);
  }

  return base.toISOString();
}
