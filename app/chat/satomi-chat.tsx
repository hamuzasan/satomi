"use client";

import {
  Bot,
  ChevronDown,
  Mic,
  PanelRight,
  Pencil,
  Send,
  Sparkles,
  WalletCards,
  X,
} from "lucide-react";
import { useState } from "react";
import {
  AppShell,
  ChatBubble,
  GlassCard,
  NudgeWarningCard,
  TransactionPreviewCard,
} from "@/src/components/satomi";
import {
  chatContext,
  chatNudgeWarning,
  chatTransactionPreview,
} from "@/src/lib/satomi-chat-data";
import { cn } from "@/src/lib/utils";

export function ChatExperience() {
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(true);

  return (
    <AppShell activePath="/chat" className="h-dvh max-w-none gap-0 px-0 pb-0 pt-16 md:h-dvh md:pl-72 md:pr-0 md:pt-20">
      <div className="grid min-h-0 flex-1 grid-cols-1 lg:grid-cols-[minmax(0,1fr)_360px]">
        <section className="relative flex min-h-0 flex-col overflow-hidden">
          <ChatHeader />

          <div className="satomi-scrollbar-none flex-1 overflow-y-auto px-4 pb-56 pt-5 md:px-8 md:pb-8">
            <div className="mx-auto flex max-w-3xl flex-col gap-6">
              <div className="flex flex-col items-center py-5 text-center">
                <div className="mb-4 flex size-20 items-center justify-center rounded-full border border-white/10 bg-satomi-surface-high/55 text-satomi-cyan shadow-[0_0_34px_rgba(0,240,255,0.08)]">
                  <Bot className="size-9" />
                </div>
                <p className="text-satomi-muted">Mau catat transaksi apa hari ini?</p>
                <button
                  type="button"
                  className="mt-4 inline-flex min-h-11 items-center justify-center rounded-full border border-satomi-purple/40 bg-satomi-purple/12 px-5 py-2 font-mono text-xs font-semibold tracking-[0.16em] text-satomi-purple-soft"
                >
                  Keluar 35 ribu buat makan
                </button>
              </div>

              <ChatBubble role="user" time="14:20">
                Tadi keluar 35 ribu buat ayam geprek
              </ChatBubble>

              <div className="flex flex-col gap-3">
                <ChatBubble role="satomi">
                  Aku deteksi ini sebagai pengeluaran makanan sebesar Rp35.000.
                  Mau aku simpan?
                </ChatBubble>
                <div className="hidden md:block">
                  <TransactionPreviewCard
                    transaction={chatTransactionPreview}
                    onEdit={() => setIsEditOpen(true)}
                  />
                </div>
              </div>

              <ClarificationState />

              <ChatBubble role="user" time="14:23">
                Beli skincare 85 ribu
              </ChatBubble>

              <div className="flex flex-col gap-3">
                <ChatBubble role="satomi">
                  Transaksi ini bisa aku catat, tapi pocket Self-Reward kamu
                  akan melewati batas bulan ini.
                </ChatBubble>
                <NudgeWarningCard
                  warning={chatNudgeWarning}
                  onEdit={() => setIsEditOpen(true)}
                />
              </div>
            </div>
          </div>

          <Composer />

          <MobileTransactionSheet
            isOpen={isPreviewOpen}
            onToggle={() => setIsPreviewOpen((value) => !value)}
            onEdit={() => setIsEditOpen(true)}
          />
        </section>

        <FinancialContextPanel />
      </div>

      <EditTransactionSheet
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
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
            Mode dummy
          </span>
        </div>
      </div>
    </div>
  );
}

function ClarificationState() {
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
          <p className="mt-2 text-sm leading-6 text-satomi-muted">
            Kalau ada transaksi yang ambigu, Satomi akan menanyakan kategori
            atau pocket sebelum menyimpan.
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            {["Makanan", "Transport", "Self-Reward"].map((item) => (
              <button
                key={item}
                type="button"
                className="inline-flex min-h-11 items-center justify-center rounded-full border border-white/10 bg-satomi-surface-high/70 px-4 py-2 font-mono text-[11px] text-satomi-muted transition hover:border-satomi-cyan/35 hover:text-satomi-cyan"
              >
                {item}
              </button>
            ))}
          </div>
        </div>
      </div>
    </GlassCard>
  );
}

function Composer() {
  return (
    <div className="fixed inset-x-0 bottom-[calc(var(--satomi-mobile-nav-height)+var(--safe-area-bottom))] z-30 border-t border-white/5 bg-satomi-bg/75 px-4 py-3 backdrop-blur-2xl md:absolute md:bottom-0 md:px-8">
      <div className="mx-auto flex max-w-3xl items-center gap-3 rounded-full border border-satomi-outline/35 bg-satomi-surface-mid/85 p-2 shadow-[0_0_34px_rgba(0,240,255,0.10)]">
        <button
          type="button"
          className="flex size-11 shrink-0 items-center justify-center rounded-full text-satomi-muted transition hover:bg-white/5 hover:text-satomi-cyan"
          aria-label="Tambah lampiran"
        >
          <Pencil className="size-5" />
        </button>
        <input
          className="min-w-0 flex-1 border-0 bg-transparent text-base text-satomi-text outline-none placeholder:text-satomi-muted/60"
          value="Beli skincare 85 ribu"
          readOnly
          aria-label="Pesan untuk Satomi"
        />
        <button
          type="button"
          className="hidden size-11 shrink-0 items-center justify-center rounded-full text-satomi-muted transition hover:bg-white/5 hover:text-satomi-cyan sm:flex"
          aria-label="Gunakan suara"
        >
          <Mic className="size-5" />
        </button>
        <button
          type="button"
          className="flex size-12 shrink-0 items-center justify-center rounded-full bg-satomi-cyan text-satomi-bg shadow-[0_0_28px_rgba(0,240,255,0.36)] transition hover:bg-satomi-cyan-soft"
          aria-label="Kirim"
        >
          <Send className="size-5" />
        </button>
      </div>
    </div>
  );
}

function FinancialContextPanel() {
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
            Panel dummy untuk membantu Satomi memberi saran saat percakapan
            berlangsung.
          </p>
        </div>

        <ContextPocket
          title={chatContext.activePocket.name}
          used={chatContext.activePocket.used}
          limit={chatContext.activePocket.limit}
          progress={chatContext.activePocket.progress}
          tone="cyan"
        />
        <ContextPocket
          title={chatContext.riskyPocket.name}
          used={chatContext.riskyPocket.used}
          limit={chatContext.riskyPocket.limit}
          progress={chatContext.riskyPocket.progress}
          tone="purple"
        />

        <GlassCard className="p-4">
          <p className="font-mono text-xs font-semibold uppercase tracking-[0.2em] text-satomi-muted">
            Riwayat dekat
          </p>
          <div className="mt-4 grid gap-3">
            {chatContext.recent.map((item) => (
              <div
                key={item}
                className="rounded-2xl border border-white/10 bg-black/20 px-3 py-2 text-sm text-satomi-text"
              >
                {item}
              </div>
            ))}
          </div>
        </GlassCard>
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
          style={{ width: `${progress}%` }}
        />
      </div>
      <p className="mt-2 text-right font-mono text-xs text-satomi-muted">
        {progress}% terpakai
      </p>
    </GlassCard>
  );
}

function MobileTransactionSheet({
  isOpen,
  onToggle,
  onEdit,
}: {
  isOpen: boolean;
  onToggle: () => void;
  onEdit: () => void;
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
          <ChevronDown
            className={cn("size-4 transition", isOpen ? "" : "rotate-180")}
          />
        </button>
        <div className="satomi-scrollbar-none max-h-[min(58dvh,460px)] overflow-y-auto overscroll-contain rounded-t-[28px]">
          <TransactionPreviewCard
            transaction={chatTransactionPreview}
            compact
            onEdit={onEdit}
          />
        </div>
      </div>
    </div>
  );
}

function EditTransactionSheet({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end bg-black/60 backdrop-blur-sm md:items-center md:justify-center">
      <div
        className="absolute inset-0"
        role="button"
        tabIndex={0}
        aria-label="Tutup edit transaksi"
        onClick={onClose}
        onKeyDown={(event) => {
          if (event.key === "Escape" || event.key === "Enter") onClose();
        }}
      />
      <GlassCard className="relative z-10 max-h-[calc(100dvh-var(--safe-area-top)-var(--safe-area-bottom)-1rem)] w-full overflow-y-auto rounded-b-none p-5 md:max-w-xl md:rounded-3xl md:p-6">
        <div className="mb-5 flex items-start justify-between gap-4">
          <div>
            <p className="font-mono text-xs font-semibold uppercase tracking-[0.22em] text-satomi-cyan">
              Edit transaksi
            </p>
            <h2 className="mt-2 font-display text-2xl font-extrabold text-satomi-text">
              Ayam geprek
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
          <EditField label="Nominal" value="Rp35.000" />
          <EditField label="Tipe" value="Pengeluaran" />
          <EditField label="Kategori" value="Makanan" />
          <EditField label="Pocket" value="Kebutuhan Harian" />
          <EditField label="Deskripsi" value="Ayam geprek" className="sm:col-span-2" />
          <EditField label="Tanggal" value="Hari ini" className="sm:col-span-2" />
        </div>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <button
            type="button"
            onClick={onClose}
            className="inline-flex min-h-12 flex-1 items-center justify-center rounded-2xl bg-satomi-cyan px-5 font-mono text-xs font-bold uppercase tracking-[0.18em] text-satomi-bg transition hover:bg-satomi-cyan-soft"
          >
            Simpan Perubahan
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

function EditField({
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
