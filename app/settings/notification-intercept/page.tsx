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

const safetyCommitments = [
  "Fitur ini opsional dan bisa dimatikan kapan saja.",
  "Izin yang dibutuhkan adalah Notification Access Android yang kamu aktifkan sendiri.",
  "Kamu memilih aplikasi mana saja yang boleh dipantau.",
  "Transaksi terdeteksi selalu masuk sebagai pratinjau dan harus kamu konfirmasi.",
  "SATOMI tidak membaca OTP, PIN, password, atau notifikasi yang tidak relevan.",
];

export default function NotificationInterceptPage() {
  return (
    <AppShell activePath="/settings">
      <section className="text-center">
        <Link
          href="/settings"
          className="mb-6 inline-flex min-h-11 items-center justify-center gap-2 rounded-xl px-3 text-sm text-satomi-muted transition hover:bg-white/5 hover:text-satomi-cyan"
        >
          <ArrowLeft className="size-4" />
          Kembali ke Pengaturan
        </Link>
        <ShieldCheck className="mx-auto mb-5 size-12 text-satomi-cyan satomi-glow-text" />
        <h1 className="font-display text-[36px] font-extrabold leading-tight tracking-normal text-satomi-text md:text-6xl">
          Deteksi Transaksi Otomatis
        </h1>
        <p className="mx-auto mt-3 max-w-2xl text-lg leading-8 text-satomi-muted">
          Fitur opsional ini membantu membaca kandidat transaksi dari notifikasi
          Android yang kamu izinkan, lalu meminta konfirmasi sebelum apa pun
          disimpan.
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
              SATOMI menggunakan pemrosesan on-device bila memungkinkan. Data
              sensitif tidak dipakai untuk auto-save, dan hanya kandidat
              transaksi yang relevan yang diteruskan ke layar pratinjau.
            </p>
          </div>
        </div>
      </GlassCard>

      <GlassCard className="p-6 md:p-8">
        <p className="font-mono text-xs font-semibold uppercase tracking-[0.24em] text-satomi-cyan">
          Cara kerja
        </p>
        <div className="mt-4 grid gap-3">
          <FlowStep text="Aktifkan Notification Access Android secara eksplisit di pengaturan sistem." />
          <FlowStep text="Pilih aplikasi e-wallet atau banking yang boleh dipantau." />
          <FlowStep text="SATOMI menyiapkan kandidat transaksi dari notifikasi yang relevan saja." />
          <FlowStep text="Kandidat muncul sebagai Transaction Preview dan harus kamu cek dulu." />
          <FlowStep text="Transaksi baru disimpan setelah kamu menekan konfirmasi." />
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
        <p className="font-mono text-xs font-semibold uppercase tracking-[0.24em] text-satomi-cyan">
          Komitmen keamanan
        </p>
        <div className="mt-4 grid gap-3">
          {safetyCommitments.map((item) => (
            <div
              key={item}
              className="flex items-start gap-3 rounded-2xl border border-white/10 bg-black/20 p-4 text-sm leading-6 text-satomi-muted"
            >
              <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-satomi-cyan" />
              <span>{item}</span>
            </div>
          ))}
        </div>
      </GlassCard>

      <GlassCard className="p-6 md:p-8">
        <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="font-display text-2xl font-extrabold text-satomi-text">
              Aktifkan deteksi otomatis
            </h2>
            <p className="mt-2 text-satomi-muted">
              Izinkan akses notifikasi di pengaturan sistem, lalu pilih aplikasi
              yang boleh dipantau. Kamu tetap bisa mematikan fitur ini kapan
              saja.
            </p>
          </div>
          <button
            type="button"
            className="flex h-12 w-20 items-center rounded-full border border-white/15 bg-white/10 p-1"
            aria-label="Toggle fitur deteksi transaksi otomatis"
          >
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

function FlowStep({ text }: { text: string }) {
  return (
    <div className="flex items-start gap-3 rounded-2xl border border-white/10 bg-black/20 p-4 text-sm leading-6 text-satomi-muted">
      <ShieldCheck className="mt-0.5 size-4 shrink-0 text-satomi-cyan" />
      <span>{text}</span>
    </div>
  );
}
