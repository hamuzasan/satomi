import {
  BookOpen,
  Bot,
  LifeBuoy,
  MessageSquare,
  Search,
  ShieldCheck,
  WalletCards,
} from "lucide-react";
import Link from "next/link";
import { AppShell, GlassCard } from "@/src/components/satomi";

const helpTopics = [
  {
    title: "Catat transaksi lewat chat",
    description: "Tulis kalimat natural seperti keluar 35 ribu buat makan.",
    href: "/chat",
    icon: MessageSquare,
  },
  {
    title: "Atur Smart Pockets",
    description: "Kelola batas, status, dan nudge untuk setiap pocket.",
    href: "/pockets",
    icon: WalletCards,
  },
  {
    title: "Pahami insight Satomi",
    description: "Baca rekomendasi, tren, dan riwayat nudge mingguan.",
    href: "/insights",
    icon: Bot,
  },
  {
    title: "Privasi dan data",
    description: "Pelajari data apa yang diproses dan bagaimana mengontrolnya.",
    href: "/settings/privacy",
    icon: ShieldCheck,
  },
];

export default function HelpPage() {
  return (
    <AppShell activePath="/settings">
      <section className="text-center">
        <LifeBuoy className="mx-auto mb-4 size-10 text-satomi-cyan" />
        <h1 className="font-display text-[38px] font-extrabold leading-tight text-satomi-text md:text-6xl">
          Bantuan SATOMI
        </h1>
        <p className="mx-auto mt-3 max-w-2xl text-lg leading-8 text-satomi-muted">
          Temukan panduan cepat untuk memakai SATOMI tanpa backend nyata.
        </p>
      </section>

      <GlassCard variant="featured" className="p-4 md:p-5">
        <label className="relative block">
          <Search className="absolute left-4 top-1/2 size-5 -translate-y-1/2 text-satomi-muted" />
          <input
            className="min-h-14 w-full rounded-2xl border border-white/10 bg-black/25 py-3 pl-12 pr-4 text-satomi-text outline-none transition placeholder:text-satomi-muted/55 focus:border-satomi-cyan/50"
            placeholder="Cari panduan..."
          />
        </label>
      </GlassCard>

      <section className="grid gap-4 md:grid-cols-2">
        {helpTopics.map((topic) => {
          const Icon = topic.icon;
          return (
            <Link key={topic.title} href={topic.href} className="block h-full">
              <GlassCard variant="interactive" className="h-full p-6">
                <div className="mb-5 flex size-12 items-center justify-center rounded-full bg-satomi-cyan/12 text-satomi-cyan">
                  <Icon className="size-6" />
                </div>
                <h2 className="font-display text-2xl font-extrabold text-satomi-text">
                  {topic.title}
                </h2>
                <p className="mt-3 leading-7 text-satomi-muted">
                  {topic.description}
                </p>
              </GlassCard>
            </Link>
          );
        })}
      </section>

      <GlassCard className="p-6 md:p-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-start gap-4">
            <BookOpen className="mt-1 size-6 text-satomi-purple-soft" />
            <div>
              <h2 className="font-display text-2xl font-extrabold text-satomi-text">
                Masih bingung?
              </h2>
              <p className="mt-2 text-satomi-muted">
                Buka chat Satomi dan gunakan contoh dummy untuk mencoba alur utama.
              </p>
            </div>
          </div>
          <Link
            href="/chat"
            className="inline-flex min-h-12 items-center justify-center rounded-2xl bg-satomi-cyan px-5 font-mono text-xs font-bold uppercase tracking-[0.18em] text-satomi-bg transition hover:bg-satomi-cyan-soft"
          >
            Buka Chat
          </Link>
        </div>
      </GlassCard>
    </AppShell>
  );
}
