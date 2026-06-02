import { AlertTriangle, Check, Download, Trash2 } from "lucide-react";
import { AppShell, GlassCard } from "@/src/components/satomi";
import { privacyCards } from "@/src/lib/satomi-settings-data";

export default function PrivacySettingsPage() {
  return (
    <AppShell activePath="/settings">
      <section className="text-center">
        <h1 className="font-display text-[36px] font-extrabold leading-tight tracking-normal text-satomi-text md:text-6xl">
          Privasi & Data
        </h1>
        <p className="mx-auto mt-3 max-w-2xl text-lg leading-8 text-satomi-muted">
          Kelola bagaimana data Anda disimpan, digunakan oleh AI, dan dikontrol
          penuh dari akun ini.
        </p>
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        {privacyCards.map((card) => {
          const Icon = card.icon;
          return (
            <GlassCard key={card.title} className="p-6 md:p-8">
              <div className="mb-5 flex items-start justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="flex size-12 items-center justify-center rounded-2xl bg-white/10 text-satomi-cyan">
                    <Icon className="size-6" />
                  </div>
                  <h2 className="font-display text-2xl font-extrabold text-satomi-text">
                    {card.title}
                  </h2>
                </div>
                {card.enabled ? (
                  <span className="flex size-10 items-center justify-center rounded-full bg-satomi-cyan/15 text-satomi-cyan">
                    <Check className="size-5" />
                  </span>
                ) : null}
              </div>
              <p className="leading-7 text-satomi-muted">{card.description}</p>
              <div className="mt-6 flex flex-col gap-3">
                {card.actions.map((action, index) => (
                  <button
                    key={action}
                    className={
                      index === 0
                        ? "inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl bg-satomi-cyan px-5 font-mono text-xs font-bold uppercase tracking-[0.18em] text-satomi-bg transition hover:bg-satomi-cyan-soft"
                        : "inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl border border-white/15 bg-black/20 px-5 font-mono text-xs font-bold uppercase tracking-[0.18em] text-satomi-text transition hover:border-satomi-cyan/35 hover:text-satomi-cyan"
                    }
                  >
                    {index === 0 ? <Download className="size-4" /> : null}
                    {action}
                  </button>
                ))}
              </div>
            </GlassCard>
          );
        })}
      </section>

      <div className="flex items-center gap-4">
        <div className="h-px flex-1 bg-satomi-error/30" />
        <span className="font-mono text-xs font-semibold uppercase tracking-[0.2em] text-satomi-error">
          Zona bahaya
        </span>
        <div className="h-px flex-1 bg-satomi-error/30" />
      </div>

      <GlassCard variant="warning" className="p-6 md:p-8">
        <div className="flex items-start gap-4">
          <AlertTriangle className="mt-1 size-7 shrink-0 text-satomi-error" />
          <div>
            <h2 className="font-display text-3xl font-extrabold text-satomi-error">
              Hapus Semua Data
            </h2>
            <p className="mt-3 max-w-2xl leading-7 text-satomi-muted">
              Tindakan dummy ini tidak dapat dibatalkan. Dalam aplikasi nyata,
              ini akan menghapus akun dan seluruh riwayat transaksi.
            </p>
          </div>
        </div>
        <button className="mt-6 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-2xl border border-satomi-error/35 bg-satomi-error/10 px-5 font-mono text-xs font-bold uppercase tracking-[0.18em] text-satomi-error transition hover:bg-satomi-error/15">
          <Trash2 className="size-4" />
          Hapus akun permanen
        </button>
      </GlassCard>
    </AppShell>
  );
}
