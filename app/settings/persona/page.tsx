import { Check, SlidersHorizontal } from "lucide-react";
import Link from "next/link";
import { AppShell, ChatBubble, GlassCard } from "@/src/components/satomi";
import { personaOptions } from "@/src/lib/satomi-settings-data";
import { cn } from "@/src/lib/utils";

export default function PersonaSettingsPage() {
  return (
    <AppShell activePath="/settings">
      <section className="text-center">
        <h1 className="font-display text-[36px] font-extrabold leading-tight tracking-normal text-satomi-text md:text-6xl">
          Persona Satomi
        </h1>
        <p className="mx-auto mt-3 max-w-2xl text-lg leading-8 text-satomi-muted">
          Atur cara SATOMI berbicara, memberi nudge, dan merespons kebiasaan
          keuanganmu.
        </p>
      </section>

      <section>
        <h2 className="mb-3 font-mono text-xs font-semibold uppercase tracking-[0.24em] text-satomi-muted">
          Gaya komunikasi
        </h2>
        <div className="grid gap-3 md:grid-cols-2">
          {personaOptions.map((option) => {
            const Icon = option.icon;
            return (
              <button
                key={option.title}
                type="button"
                className={cn(
                  "rounded-2xl border p-5 text-left transition",
                  option.selected
                    ? "border-satomi-cyan/50 bg-satomi-cyan/10 shadow-[0_0_28px_rgba(0,240,255,0.12)]"
                    : "border-white/10 bg-satomi-surface/65 hover:border-satomi-cyan/30",
                )}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="flex size-11 items-center justify-center rounded-full bg-satomi-purple/12 text-satomi-purple-soft">
                      <Icon className="size-5" />
                    </div>
                    <p className="font-semibold text-satomi-text">{option.title}</p>
                  </div>
                  <span className="flex size-7 items-center justify-center rounded-full border border-white/20 text-satomi-cyan">
                    {option.selected ? <Check className="size-4" /> : null}
                  </span>
                </div>
                <p className="mt-4 text-sm leading-6 text-satomi-muted">
                  {option.description}
                </p>
              </button>
            );
          })}
        </div>
      </section>

      <GlassCard className="p-6 md:p-8">
        <div className="mb-6 flex items-center gap-3">
          <SlidersHorizontal className="size-5 text-satomi-cyan" />
          <h2 className="font-mono text-xs font-semibold uppercase tracking-[0.24em] text-satomi-muted">
            Kontrol perilaku
          </h2>
        </div>
        <PersonaSlider label="Intensitas nudge" value="Sedang" />
        <div className="my-6 h-px bg-white/10" />
        <PersonaSlider label="Frekuensi nudge" value="Mingguan" />
      </GlassCard>

      <GlassCard className="p-6 md:p-8">
        <p className="mb-5 font-mono text-xs font-semibold uppercase tracking-[0.24em] text-satomi-muted">
          Pratinjau langsung
        </p>
        <div className="space-y-4">
          <ChatBubble role="user">
            Baru beli es kopi. Masih aman kan?
          </ChatBubble>
          <ChatBubble role="satomi">
            Waduh, pocket jajan mulai tipis nih. Kalau bisa, kopi berikutnya
            ditunda dulu agar Dana Jepang tetap jalan.
          </ChatBubble>
        </div>
      </GlassCard>

      <Link
        href="/settings"
        className="inline-flex min-h-14 items-center justify-center rounded-2xl bg-satomi-cyan px-6 font-mono text-xs font-bold uppercase tracking-[0.2em] text-satomi-bg shadow-[0_0_30px_rgba(0,240,255,0.28)] transition hover:bg-satomi-cyan-soft"
      >
        Simpan Persona
      </Link>
    </AppShell>
  );
}

function PersonaSlider({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="font-semibold text-satomi-text">{label}</p>
          <p className="mt-1 text-sm text-satomi-muted">
            Seberapa sering Satomi menyesuaikan respons.
          </p>
        </div>
        <span className="font-mono text-xs font-semibold uppercase tracking-[0.16em] text-satomi-cyan">
          {value}
        </span>
      </div>
      <div className="mt-5 h-2 rounded-full bg-white/15">
        <div className="h-full w-1/2 rounded-full bg-satomi-cyan shadow-[0_0_20px_rgba(0,240,255,0.28)]" />
      </div>
      <div className="mt-2 flex justify-between text-xs text-satomi-muted">
        <span>Ringan</span>
        <span>Intens</span>
      </div>
    </div>
  );
}
