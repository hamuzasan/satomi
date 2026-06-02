import {
  ArrowRight,
  BadgeDollarSign,
  PiggyBank,
  Shield,
  Target,
  TrendingDown,
  WalletCards,
} from "lucide-react";
import Link from "next/link";
import { GlassCard, PublicShell, SatomiMark } from "@/src/components/satomi";
import { cn } from "@/src/lib/utils";

const goalOptions = [
  {
    title: "Mengurangi pemborosan",
    description: "Fokus pada kontrol pengeluaran harian",
    icon: TrendingDown,
  },
  {
    title: "Mulai menabung",
    description: "Bangun kebiasaan menyisihkan uang",
    icon: PiggyBank,
    selected: true,
  },
  {
    title: "Mengatur arus kas",
    description: "Seimbangkan pemasukan dan pengeluaran",
    icon: WalletCards,
  },
  {
    title: "Membangun dana darurat",
    description: "Persiapan untuk hal tak terduga",
    icon: Shield,
  },
];

const pockets = ["Harian", "Tagihan", "Tabungan", "Self-Reward", "Darurat"];

export default function OnboardingPage() {
  return (
    <PublicShell showNav={false} className="max-w-4xl py-8">
      <header className="mb-10 flex items-center justify-between gap-4">
        <SatomiMark size="sm" withLabel />
        <div className="text-right">
          <p className="font-mono text-xs font-semibold uppercase tracking-[0.22em] text-satomi-muted">
            Pengaturan awal
          </p>
          <div className="mt-2 flex justify-end gap-1.5">
            <span className="size-2 rounded-full bg-satomi-cyan" />
            <span className="size-2 rounded-full bg-satomi-purple-soft" />
            <span className="size-2 rounded-full bg-white/20" />
          </div>
        </div>
      </header>

      <section className="mb-8 text-center">
        <h1 className="font-display text-4xl font-extrabold leading-tight text-satomi-text md:text-6xl">
          Kenalan dulu dengan Satomi.
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-lg leading-8 text-satomi-muted">
          Isi dummy setup ini agar Satomi bisa menyesuaikan nudge, strategi, dan
          pocket awalmu.
        </p>
      </section>

      <div className="grid gap-5">
        <GlassCard variant="featured" className="p-6 md:p-8">
          <p className="mb-4 font-mono text-xs font-semibold uppercase tracking-[0.24em] text-satomi-cyan">
            Profil keuangan
          </p>
          <div className="grid gap-4 md:grid-cols-2">
            <SetupField label="Pemasukan utama" value="Rp2.500.000" />
            <SetupField label="Tambahan opsional" value="Rp500.000" />
            <SetupField label="Prioritas bulan ini" value="Dana Jepang" />
            <SetupField label="Gaya nudge" value="Santai dan suportif" />
          </div>
        </GlassCard>

        <GlassCard className="p-6 md:p-8">
          <div className="mb-5 flex items-center gap-3">
            <Target className="size-5 text-satomi-cyan" />
            <p className="font-mono text-xs font-semibold uppercase tracking-[0.24em] text-satomi-muted">
              Tujuan dan persona
            </p>
          </div>
          <h2 className="font-display text-3xl font-extrabold text-satomi-text">
            Apa tujuan keuangan utamamu?
          </h2>
          <div className="mt-5 grid gap-3 md:grid-cols-2">
            {goalOptions.map((option) => {
              const Icon = option.icon;
              return (
                <button
                  type="button"
                  key={option.title}
                  className={cn(
                    "rounded-2xl border p-4 text-left transition",
                    option.selected
                      ? "border-satomi-cyan/45 bg-satomi-cyan/10 text-satomi-cyan"
                      : "border-white/10 bg-black/20 text-satomi-text hover:border-satomi-cyan/30",
                  )}
                >
                  <div className="flex items-center gap-4">
                    <div className="flex size-11 shrink-0 items-center justify-center rounded-full bg-white/8">
                      <Icon className="size-5" />
                    </div>
                    <div>
                      <p className="font-semibold">{option.title}</p>
                      <p className="mt-1 text-sm leading-6 text-satomi-muted">
                        {option.description}
                      </p>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </GlassCard>

        <GlassCard className="p-6 md:p-8">
          <div className="mb-5 flex items-center gap-3">
            <BadgeDollarSign className="size-5 text-satomi-purple-soft" />
            <p className="font-mono text-xs font-semibold uppercase tracking-[0.24em] text-satomi-muted">
              Smart Pockets awal
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
            {pockets.map((pocket, index) => (
              <div
                key={pocket}
                className="rounded-2xl border border-white/10 bg-black/20 p-4"
              >
                <div className="flex h-28 items-end rounded-xl bg-satomi-surface-low p-2">
                  <div
                    className="w-full rounded-lg bg-satomi-cyan shadow-[0_0_18px_rgba(0,240,255,0.22)]"
                    style={{ height: `${[76, 54, 66, 42, 24][index]}%` }}
                  />
                </div>
                <p className="mt-3 font-mono text-xs font-semibold uppercase tracking-[0.16em] text-satomi-muted">
                  {pocket}
                </p>
              </div>
            ))}
          </div>
        </GlassCard>
      </div>

      <div className="mt-8">
        <Link
          href="/dashboard"
          className="inline-flex min-h-14 w-full items-center justify-center gap-3 rounded-2xl bg-satomi-cyan px-6 font-mono text-xs font-bold uppercase tracking-[0.22em] text-satomi-bg shadow-[0_0_30px_rgba(0,240,255,0.28)] transition hover:bg-satomi-cyan-soft"
        >
          Lanjutkan
          <ArrowRight className="size-4" />
        </Link>
      </div>
    </PublicShell>
  );
}

function SetupField({ label, value }: { label: string; value: string }) {
  return (
    <label className="block">
      <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-satomi-muted">
        {label}
      </span>
      <input
        className="mt-2 min-h-12 w-full rounded-2xl border border-white/10 bg-white px-4 text-satomi-bg outline-none"
        value={value}
        readOnly
      />
    </label>
  );
}
