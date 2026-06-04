import {
  CalendarDays,
  CheckCircle2,
  Pencil,
  ReceiptText,
  ShieldCheck,
  Utensils,
  WalletCards,
  XCircle,
} from "lucide-react";
import { cn } from "@/src/lib/utils";

export type TransactionPreview = {
  nominal: string;
  tipe: string;
  kategori: string;
  pocket: string;
  deskripsi: string;
  tanggal: string;
  confidence: string;
};

type TransactionPreviewCardProps = {
  transaction: TransactionPreview;
  compact?: boolean;
  isSaving?: boolean;
  onSave?: () => void;
  onEdit?: () => void;
  onCancel?: () => void;
  className?: string;
};

export function TransactionPreviewCard({
  transaction,
  compact = false,
  isSaving = false,
  onSave,
  onEdit,
  onCancel,
  className,
}: TransactionPreviewCardProps) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-3xl border border-satomi-cyan/45 bg-satomi-surface-highest/45 p-5 shadow-[0_0_34px_rgba(0,240,255,0.16)] backdrop-blur-2xl",
        compact && "rounded-t-[28px] border-x-0 border-b-0 px-5 pb-6 pt-5",
        className,
      )}
    >
      <div className="absolute left-0 top-0 h-px w-24 bg-gradient-to-r from-satomi-cyan to-transparent" />
      <div className="absolute left-0 top-0 h-24 w-px bg-gradient-to-b from-satomi-cyan to-transparent" />

      <div className="relative z-10">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="font-mono text-xs font-semibold uppercase tracking-[0.28em] text-satomi-muted">
              Nominal
            </p>
            <p className="mt-2 font-display text-4xl font-extrabold tracking-normal text-satomi-cyan satomi-glow-text md:text-5xl">
              {transaction.nominal}
            </p>
          </div>
          <div className="rounded-xl border border-satomi-cyan/35 bg-satomi-cyan/10 px-3 py-2 text-satomi-cyan">
            <div className="flex items-center gap-2">
              <ShieldCheck className="size-4" />
              <span className="font-mono text-xs font-bold">
                {transaction.confidence}
              </span>
            </div>
            <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.16em]">
              Confidence
            </p>
          </div>
        </div>

        <div className="mt-5 grid grid-cols-2 gap-3">
          <PreviewField icon={ReceiptText} label="Tipe" value={transaction.tipe} />
          <PreviewField icon={Utensils} label="Kategori" value={transaction.kategori} />
          <PreviewField
            icon={WalletCards}
            label="Pocket"
            value={transaction.pocket}
            className="col-span-2 sm:col-span-1"
          />
          <PreviewField
            icon={CalendarDays}
            label="Tanggal"
            value={transaction.tanggal}
            className="col-span-2 sm:col-span-1"
          />
          <PreviewField
            icon={ReceiptText}
            label="Deskripsi"
            value={transaction.deskripsi}
            className="col-span-2"
          />
        </div>

        <div className="mt-5 grid grid-cols-3 gap-2">
          <button
            type="button"
            onClick={onSave}
            disabled={!onSave || isSaving}
            className="inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl bg-satomi-cyan px-3 font-mono text-[11px] font-bold uppercase tracking-[0.16em] text-satomi-bg transition hover:bg-satomi-cyan-soft"
          >
            <CheckCircle2 className="size-4" />
            {isSaving ? "Menyimpan" : "Simpan"}
          </button>
          <button
            type="button"
            onClick={onEdit}
            disabled={!onEdit || isSaving}
            className="inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl border border-satomi-cyan/35 bg-black/20 px-3 font-mono text-[11px] font-bold uppercase tracking-[0.16em] text-satomi-cyan transition hover:bg-satomi-cyan/10"
          >
            <Pencil className="size-4" />
            Edit
          </button>
          <button
            type="button"
            onClick={onCancel}
            disabled={!onCancel || isSaving}
            className="inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl border border-white/10 bg-satomi-surface-high/70 px-3 font-mono text-[11px] font-bold uppercase tracking-[0.16em] text-satomi-muted transition hover:text-satomi-text"
          >
            <XCircle className="size-4" />
            Batalkan
          </button>
        </div>
      </div>
    </div>
  );
}

function PreviewField({
  icon: Icon,
  label,
  value,
  className,
}: {
  icon: typeof ReceiptText;
  label: string;
  value: string;
  className?: string;
}) {
  return (
    <div className={cn("rounded-2xl border border-white/10 bg-black/25 p-3", className)}>
      <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.22em] text-satomi-muted">
        {label}
      </p>
      <div className="mt-2 flex items-center gap-2 text-sm font-semibold text-satomi-text">
        <Icon className="size-4 text-satomi-cyan" />
        {value}
      </div>
    </div>
  );
}
