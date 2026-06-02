import {
  ArrowLeft,
  CheckCircle2,
  CreditCard,
  EyeOff,
  KeyRound,
  Lock,
  MessageSquare,
  ShieldCheck,
  Store,
  Timer,
} from "lucide-react";
import Link from "next/link";
import { AppShell, GlassCard } from "@/src/components/satomi";

const readableData = [
  { label: "Nominal transaksi", icon: CreditCard },
  { label: "Sumber atau merchant", icon: Store },
  { label: "Waktu transaksi", icon: Timer },
];

const blockedData = [
  { label: "Password atau PIN", icon: KeyRound },
  { label: "Kode OTP", icon: Lock },
  { label: "Pesan pribadi", icon: MessageSquare },
];

export default function NotificationInterceptPage() {
  return (
    <AppShell activePath="/settings">
      <section className="text-center">
        <Link
          href="/settings"
          className="mb-6 inline-flex items-center gap-2 text-sm text-satomi-muted transition hover:text-satomi-cyan"
        >
          <ArrowLeft className="size-4" />
          Kembali ke Pengaturan
        </Link>
        <ShieldCheck className="mx-auto mb-5 size-12 text-satomi-cyan satomi-glow-text" />
        <h1 className="font-display text-[36px] font-extrabold leading-tight tracking-normal text-satomi-text md:text-6xl">
          Deteksi Transaksi Otomatis
        </h1>
        <p className="mx-auto mt-3 max-w-2xl text-lg leading-8 text-satomi-muted">
          Fitur ini membaca notifikasi transaksi dengan izinmu untuk
          mengategorikan pengeluaran secara cerdas.
        </p>
      </section>

      <GlassCard variant="featured" className="p-6 md:p-8">
        <div className="flex items-start gap-4">
          <div className="flex size-12 shrink-0 items-center justify-center rounded-full bg-satomi-cyan/12 text-satomi-cyan">
            <ShieldCheck className="size-6" />
          </div>
          <div>
            <p className="font-mono text-xs font-semibold uppercase tracking-[0.24em] text-satomi-cyan">
              Komitmen privasi
            </p>
            <p className="mt-3 leading-7 text-satomi-text">
              SATOMI menggunakan pemrosesan on-device. Data sensitif tidak
              pernah meninggalkan perangkat dan hanya pola teks transaksi yang
              digunakan.
            </p>
          </div>
        </div>
      </GlassCard>

      <section className="grid gap-4 md:grid-cols-2">
        <PermissionList
          title="Data yang dapat dibaca"
          items={readableData}
          tone="cyan"
        />
        <PermissionList
          title="Data yang tidak dibaca"
          items={blockedData}
          tone="error"
        />
      </section>

      <GlassCard className="p-6 md:p-8">
        <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="font-display text-2xl font-extrabold text-satomi-text">
              Aktifkan deteksi otomatis
            </h2>
            <p className="mt-2 text-satomi-muted">
              Izinkan akses notifikasi di pengaturan sistem.
            </p>
          </div>
          <button className="flex h-12 w-20 items-center rounded-full border border-white/15 bg-white/10 p-1">
            <span className="size-10 rounded-full bg-white shadow-lg" />
          </button>
        </div>
        <label className="mt-6 flex items-start gap-3 border-t border-white/10 pt-6 text-satomi-muted">
          <input className="mt-1 size-5 rounded border-white/20 bg-black/20" type="checkbox" />
          <span>
            Saya memahami data yang akan diproses dan menyetujui kebijakan
            privasi Satomi.
          </span>
        </label>
      </GlassCard>

      <div className="grid gap-3 sm:grid-cols-2">
        <Link
          href="/dashboard"
          className="inline-flex min-h-14 items-center justify-center rounded-2xl bg-satomi-cyan px-6 font-mono text-xs font-bold uppercase tracking-[0.2em] text-satomi-bg shadow-[0_0_30px_rgba(0,240,255,0.28)] transition hover:bg-satomi-cyan-soft"
        >
          Aktifkan dengan izin
        </Link>
        <Link
          href="/settings"
          className="inline-flex min-h-14 items-center justify-center rounded-2xl border border-white/15 bg-black/20 px-6 font-mono text-xs font-bold uppercase tracking-[0.18em] text-satomi-text transition hover:border-satomi-cyan/35 hover:text-satomi-cyan"
        >
          Nanti saja
        </Link>
      </div>
    </AppShell>
  );
}

function PermissionList({
  title,
  items,
  tone,
}: {
  title: string;
  items: typeof readableData;
  tone: "cyan" | "error";
}) {
  const isError = tone === "error";

  return (
    <GlassCard className={`p-6 md:p-8 ${isError ? "border-satomi-error/25" : "border-satomi-cyan/25"}`}>
      <p
        className={`mb-5 font-mono text-xs font-semibold uppercase tracking-[0.24em] ${
          isError ? "text-satomi-error" : "text-satomi-cyan"
        }`}
      >
        {title}
      </p>
      <div className="space-y-4">
        {items.map((item) => {
          const Icon = item.icon;
          return (
            <div key={item.label} className="flex items-center gap-3 text-satomi-muted">
              {isError ? (
                <EyeOff className="size-5 text-satomi-error" />
              ) : (
                <CheckCircle2 className="size-5 text-satomi-cyan" />
              )}
              <Icon className="size-5" />
              <span>{item.label}</span>
            </div>
          );
        })}
      </div>
    </GlassCard>
  );
}
