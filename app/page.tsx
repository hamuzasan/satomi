import {
  ArrowRight,
  Bot,
  Briefcase,
  ClipboardList,
  EyeOff,
  MessageSquare,
  ShieldCheck,
  UserRound,
} from "lucide-react";
import Link from "next/link";
import { GlassCard, PublicShell } from "@/src/components/satomi";
import { cn } from "@/src/lib/utils";

const painPoints = [
  {
    title: "Terlalu banyak formulir",
    description: "Tanggal, kategori, nominal, dan catatan terasa memakan waktu.",
    icon: ClipboardList,
    tone: "error",
  },
  {
    title: "Terasa seperti tugas",
    description: "Mencatat keuangan sering terasa seperti pekerjaan tambahan.",
    icon: Briefcase,
    tone: "purple",
  },
  {
    title: "Kurang konteks",
    description: "Angka tidak cukup. Kamu butuh insight dari kebiasaanmu.",
    icon: EyeOff,
    tone: "cyan",
  },
  {
    title: "Tidak personal",
    description: "Aplikasi jarang belajar dari perilaku dan targetmu.",
    icon: UserRound,
    tone: "green",
  },
];

const pocketBars = [
  { label: "Harian", height: 78, color: "bg-satomi-cyan-pale" },
  { label: "Tagihan", height: 48, color: "bg-satomi-error" },
  { label: "Tabungan", height: 64, color: "bg-satomi-green" },
  { label: "Reward", height: 40, color: "bg-satomi-purple-soft" },
  { label: "Darurat", height: 18, color: "bg-satomi-amber" },
];

const toneClass = {
  cyan: "bg-satomi-cyan/12 text-satomi-cyan border-satomi-cyan/30",
  purple: "bg-satomi-purple/12 text-satomi-purple-soft border-satomi-purple/30",
  green: "bg-satomi-green/12 text-satomi-green border-satomi-green/30",
  error: "bg-satomi-error/12 text-satomi-error border-satomi-error/30",
};

export default function LandingPage() {
  return (
    <PublicShell>
      <section className="grid min-h-[calc(100dvh-7rem)] gap-8 py-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
        <div>
          <p className="font-mono text-xs font-semibold uppercase tracking-[0.24em] text-satomi-cyan">
            Catat keuangan cukup lewat chat.
          </p>
          <h1 className="mt-5 font-display text-5xl font-extrabold leading-tight text-satomi-text md:text-7xl">
            SATOMI membuat uangmu lebih mudah dibaca.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-satomi-muted">
            Catat transaksi harian, bagi budget ke Smart Pockets, dan terima
            nudge sebelum pengeluaran kecil berubah jadi kebocoran besar.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/register"
              className="inline-flex min-h-14 items-center justify-center gap-3 rounded-2xl bg-satomi-cyan px-6 font-mono text-xs font-bold uppercase tracking-[0.2em] text-satomi-bg shadow-[0_0_34px_rgba(0,240,255,0.3)] transition hover:bg-satomi-cyan-soft"
            >
              Mulai sekarang
              <ArrowRight className="size-4" />
            </Link>
            <Link
              href="/chat"
              className="inline-flex min-h-14 items-center justify-center gap-3 rounded-2xl border border-satomi-cyan/35 bg-black/20 px-6 font-mono text-xs font-bold uppercase tracking-[0.18em] text-satomi-cyan transition hover:bg-satomi-cyan/10"
            >
              Lihat chat
            </Link>
          </div>
        </div>
        <ChatPreview />
      </section>

      <section className="py-16">
        <div className="mx-auto mb-8 max-w-xl text-center">
          <h2 className="font-display text-3xl font-extrabold text-satomi-text md:text-5xl">
            Kenapa aplikasi keuangan sering ditinggalkan?
          </h2>
        </div>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {painPoints.map((point) => {
            const Icon = point.icon;
            return (
              <GlassCard key={point.title} className="p-5 md:p-6">
                <div
                  className={cn(
                    "mb-5 flex size-12 items-center justify-center rounded-full border",
                    toneClass[point.tone as keyof typeof toneClass],
                  )}
                >
                  <Icon className="size-5" />
                </div>
                <h3 className="font-mono text-xs font-semibold uppercase tracking-[0.18em] text-satomi-text">
                  {point.title}
                </h3>
                <p className="mt-3 text-sm leading-6 text-satomi-muted">
                  {point.description}
                </p>
              </GlassCard>
            );
          })}
        </div>
      </section>

      <section className="grid gap-8 py-16 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
        <div>
          <p className="font-mono text-xs font-semibold uppercase tracking-[0.24em] text-satomi-cyan">
            Smart Pockets
          </p>
          <h2 className="mt-3 font-display text-4xl font-extrabold leading-tight text-satomi-text md:text-5xl">
            Budget yang terasa hidup, bukan tabel kaku.
          </h2>
          <p className="mt-4 text-lg leading-8 text-satomi-muted">
            SATOMI memisahkan kebutuhan harian, tagihan, tabungan, self-reward,
            dan dana darurat agar kamu tahu batas sebelum melewatinya.
          </p>
        </div>
        <GlassCard variant="featured" className="p-6 md:p-8">
          <div className="flex h-72 items-end justify-between gap-4">
            {pocketBars.map((bar) => (
              <div key={bar.label} className="flex flex-1 flex-col items-center gap-3">
                <div className="flex h-56 w-full items-end overflow-hidden rounded-full bg-satomi-surface-low">
                  <div
                    className={cn(
                      "w-full rounded-full shadow-[0_0_24px_rgba(0,240,255,0.2)]",
                      bar.color,
                    )}
                    style={{ height: `${bar.height}%` }}
                  />
                </div>
                <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-satomi-muted">
                  {bar.label}
                </span>
              </div>
            ))}
          </div>
        </GlassCard>
      </section>
    </PublicShell>
  );
}

function ChatPreview() {
  return (
    <GlassCard variant="featured" className="mx-auto w-full max-w-lg p-5 md:p-6">
      <div className="mb-5 flex items-center gap-3">
        <div className="flex size-10 items-center justify-center rounded-full bg-satomi-cyan/12 text-satomi-cyan">
          <Bot className="size-5" />
        </div>
        <div>
          <p className="font-mono text-xs font-semibold uppercase tracking-[0.22em] text-satomi-cyan">
            Pratinjau chat
          </p>
          <p className="text-sm text-satomi-muted">Dummy interaksi SATOMI</p>
        </div>
      </div>
      <div className="space-y-3">
        <div className="ml-auto max-w-[82%] rounded-2xl bg-white/10 p-4 text-sm text-satomi-text">
          Tadi keluar 35 ribu buat ayam geprek
        </div>
        <div className="max-w-[88%] rounded-2xl border border-satomi-cyan/25 bg-satomi-cyan/10 p-4 text-sm leading-6 text-satomi-text">
          Aku deteksi ini sebagai pengeluaran makanan Rp35.000. Mau aku catat?
        </div>
      </div>
      <GlassCard className="mt-5 p-4">
        <div className="mb-4 flex items-center justify-between">
          <p className="font-mono text-xs font-semibold uppercase tracking-[0.2em] text-satomi-muted">
            Pratinjau
          </p>
          <MessageSquare className="size-4 text-satomi-cyan" />
        </div>
        <p className="font-display text-4xl font-extrabold text-satomi-text">
          Rp35.000
        </p>
        <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
          <PreviewMeta label="Kategori" value="Makanan" />
          <PreviewMeta label="Pocket" value="Kebutuhan Harian" />
        </div>
        <div className="mt-5 grid grid-cols-2 gap-3">
          <button className="min-h-12 rounded-xl bg-satomi-cyan font-mono text-xs font-bold uppercase tracking-[0.18em] text-satomi-bg">
            Simpan
          </button>
          <button className="min-h-12 rounded-xl border border-white/15 bg-black/20 font-mono text-xs font-bold uppercase tracking-[0.18em] text-satomi-text">
            Edit
          </button>
        </div>
      </GlassCard>
      <div className="mt-5 flex items-center gap-3 rounded-2xl border border-satomi-green/25 bg-satomi-green/8 p-4">
        <ShieldCheck className="size-5 text-satomi-green" />
        <p className="text-sm text-satomi-muted">
          Nudge muncul saat pocket mulai berisiko.
        </p>
      </div>
    </GlassCard>
  );
}

function PreviewMeta({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-satomi-muted">
        {label}
      </p>
      <p className="mt-1 text-satomi-text">{value}</p>
    </div>
  );
}
