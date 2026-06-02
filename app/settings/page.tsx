import { LogOut, Sparkles } from "lucide-react";
import Link from "next/link";
import { AppShell, GlassCard } from "@/src/components/satomi";
import { ChevronIcon, settingsSections } from "@/src/lib/satomi-settings-data";
import { cn } from "@/src/lib/utils";

const toneClass = {
  cyan: "bg-satomi-cyan/12 text-satomi-cyan",
  purple: "bg-satomi-purple/12 text-satomi-purple-soft",
};

export default function SettingsPage() {
  return (
    <AppShell activePath="/settings">
      <section>
        <h1 className="font-display text-[38px] font-extrabold leading-tight tracking-normal text-satomi-cyan satomi-glow-text md:text-6xl">
          Pengaturan
        </h1>
        <p className="mt-3 max-w-2xl text-lg leading-8 text-satomi-muted">
          Kelola preferensi dan profil identitas finansial Anda.
        </p>
      </section>

      <GlassCard variant="featured" className="p-6 text-center md:p-8">
        <div className="mx-auto flex size-32 items-center justify-center rounded-full border border-satomi-purple/45 bg-gradient-to-br from-satomi-cyan/25 to-satomi-purple/25 shadow-[0_0_44px_rgba(207,92,255,0.18)]">
          <Sparkles className="size-14 text-satomi-cyan" />
        </div>
        <h2 className="mt-5 font-display text-4xl font-extrabold text-satomi-text">
          Hamzah
        </h2>
        <p className="mt-2 font-mono text-xs font-semibold uppercase tracking-[0.22em] text-satomi-muted">
          Member Premium
        </p>
        <div className="mx-auto mt-6 h-px max-w-xl bg-white/10" />
        <button className="mt-6 min-h-12 w-full max-w-xl rounded-2xl border border-white/15 bg-black/20 font-mono text-xs font-bold uppercase tracking-[0.18em] text-satomi-text transition hover:border-satomi-cyan/35 hover:text-satomi-cyan">
          Edit Profil
        </button>
      </GlassCard>

      {settingsSections.map((section) => (
        <section key={section.title}>
          <h2 className="mb-3 font-mono text-xs font-semibold uppercase tracking-[0.24em] text-satomi-cyan-pale">
            {section.title}
          </h2>
          <GlassCard className="overflow-hidden">
            {section.items.map((item, index) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.title}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-4 p-5 transition hover:bg-white/5",
                    index > 0 && "border-t border-white/10",
                  )}
                >
                  <div
                    className={cn(
                      "flex size-12 shrink-0 items-center justify-center rounded-full",
                      toneClass[item.tone as keyof typeof toneClass],
                    )}
                  >
                    <Icon className="size-6" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-lg font-semibold text-satomi-text">{item.title}</p>
                    <p className="mt-1 text-sm leading-6 text-satomi-muted">
                      {item.description}
                    </p>
                  </div>
                  <ChevronIcon className="size-5 shrink-0 text-satomi-muted" />
                </Link>
              );
            })}
          </GlassCard>
        </section>
      ))}

      <Link
        href="/login"
        className="inline-flex min-h-14 items-center justify-center gap-3 rounded-2xl border border-satomi-error/35 bg-satomi-error/8 px-6 font-mono text-xs font-bold uppercase tracking-[0.18em] text-satomi-error transition hover:bg-satomi-error/12"
      >
        <LogOut className="size-5" />
        Keluar Akun
      </Link>
    </AppShell>
  );
}
