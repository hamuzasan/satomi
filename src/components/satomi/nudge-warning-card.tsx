import { AlertTriangle, SlidersHorizontal, XCircle } from "lucide-react";

export type NudgeWarning = {
  title: string;
  budget: string;
  usedBefore: string;
  currentTransaction: string;
  estimatedTotal: string;
  overBy: string;
  note?: string | null;
};

type NudgeWarningCardProps = {
  warning: NudgeWarning;
  isSaving?: boolean;
  onConfirm?: () => void;
  onEdit?: () => void;
  onCancel?: () => void;
};

export function NudgeWarningCard({
  warning,
  isSaving = false,
  onConfirm,
  onEdit,
  onCancel,
}: NudgeWarningCardProps) {
  return (
    <div className="relative overflow-hidden rounded-3xl border border-satomi-error/35 bg-satomi-error-deep/18 p-5 shadow-[0_0_42px_rgba(255,180,171,0.15)] backdrop-blur-2xl md:p-6">
      <div className="absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-satomi-error to-transparent" />
      <div className="relative z-10">
        <div className="mb-5 flex items-start gap-4">
          <div className="flex size-12 shrink-0 items-center justify-center rounded-full border border-satomi-error/35 bg-satomi-error/15 text-satomi-error">
            <AlertTriangle className="size-6" />
          </div>
          <div>
            <h3 className="font-display text-xl font-extrabold leading-snug text-satomi-error">
              {warning.title}
            </h3>
            <p className="mt-1 font-mono text-xs font-semibold uppercase tracking-[0.24em] text-satomi-error/75">
              Laporan analisis
            </p>
          </div>
        </div>

        <div className="rounded-2xl border border-satomi-error/15 bg-black/25 p-4">
          <WarningRow label="Budget Bulanan" value={warning.budget} />
          <WarningRow label="Terpakai Sebelumnya" value={warning.usedBefore} />
          <div className="my-3 h-px bg-satomi-error/20" />
          <WarningRow
            label="+ Transaksi Ini"
            value={warning.currentTransaction}
            accent
          />
          <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/20">
            <div className="h-full w-[90%] rounded-l-full bg-satomi-muted/70" />
            <div className="-mt-2 ml-[90%] h-2 w-[28%] rounded-r-full bg-satomi-error shadow-[0_0_14px_rgba(255,180,171,0.65)]" />
          </div>
          <div className="mt-4 flex items-end justify-between gap-4">
            <span className="font-semibold text-satomi-text">Total Estimasi</span>
            <div className="text-right">
              <p className="font-display text-2xl font-extrabold text-satomi-error satomi-glow-text">
                {warning.estimatedTotal}
              </p>
              <p className="font-mono text-xs text-satomi-error/80">
                Selisih {warning.overBy}
              </p>
            </div>
          </div>
          {warning.note ? (
            <p className="mt-4 text-sm leading-6 text-satomi-muted">{warning.note}</p>
          ) : null}
        </div>

        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          <WarningButton onClick={onConfirm} disabled={!onConfirm || isSaving}>
            {isSaving ? "Menyimpan" : "Tetap Simpan"}
          </WarningButton>
          <WarningButton onClick={onEdit} disabled={!onEdit || isSaving}>
            Ubah Kategori
          </WarningButton>
          <WarningButton muted onClick={onCancel} disabled={!onCancel || isSaving}>
            <XCircle className="size-4" />
            Batalkan
          </WarningButton>
          <WarningButton muted disabled>
            <SlidersHorizontal className="size-4" />
            Atur Budget
          </WarningButton>
        </div>
      </div>
    </div>
  );
}

function WarningRow({
  label,
  value,
  accent,
}: {
  label: string;
  value: string;
  accent?: boolean;
}) {
  return (
    <div className="flex items-center justify-between gap-4 py-1.5">
      <span className={accent ? "text-satomi-cyan" : "text-satomi-muted"}>
        {label}
      </span>
      <span
        className={
          accent
            ? "font-mono font-semibold text-satomi-cyan"
            : "font-mono font-semibold text-satomi-text"
        }
      >
        {value}
      </span>
    </div>
  );
}

function WarningButton({
  children,
  muted,
  onClick,
  disabled,
}: {
  children: React.ReactNode;
  muted?: boolean;
  onClick?: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={
        muted
          ? "inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl border border-white/10 bg-satomi-surface-high/70 px-4 font-mono text-xs font-bold uppercase tracking-[0.18em] text-satomi-muted transition hover:text-satomi-text disabled:cursor-not-allowed disabled:opacity-55"
          : "inline-flex min-h-12 items-center justify-center rounded-2xl border border-satomi-error/50 bg-satomi-error/5 px-4 font-mono text-xs font-bold uppercase tracking-[0.18em] text-satomi-error transition hover:bg-satomi-error/10 disabled:cursor-not-allowed disabled:opacity-55"
      }
    >
      {children}
    </button>
  );
}
