"use client";

import { useEffect, useState } from "react";
import { Download, X } from "lucide-react";
import { isCapacitorApp, isClient, isMobileBrowser } from "@/src/lib/platform";

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;
};

export function PWAInstallHint() {
  const [installEvent, setInstallEvent] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    if (!isClient() || isCapacitorApp() || !isMobileBrowser()) return;

    const handler = (event: Event) => {
      event.preventDefault();
      setInstallEvent(event as BeforeInstallPromptEvent);
    };

    window.addEventListener("beforeinstallprompt", handler);

    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  if (!installEvent || isDismissed || isCapacitorApp() || !isMobileBrowser()) return null;

  return (
    <div className="fixed inset-x-3 bottom-[calc(6.5rem+env(safe-area-inset-bottom))] z-[60] mx-auto max-w-md rounded-3xl border border-satomi-cyan/30 bg-satomi-surface/95 p-4 text-satomi-text shadow-[0_0_36px_rgba(0,240,255,0.18)] backdrop-blur-2xl md:hidden">
      <div className="flex items-start gap-3">
        <div className="flex size-11 shrink-0 items-center justify-center rounded-full bg-satomi-cyan/12 text-satomi-cyan">
          <Download className="size-5" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="font-semibold">Pasang SATOMI di HP</p>
          <p className="mt-1 text-sm leading-6 text-satomi-muted">
            Akses SATOMI seperti aplikasi tanpa membuka browser.
          </p>
          <button
            type="button"
            onClick={async () => {
              await installEvent.prompt();
              await installEvent.userChoice;
              setInstallEvent(null);
            }}
            className="mt-3 inline-flex min-h-10 items-center justify-center rounded-2xl bg-satomi-cyan px-4 font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-satomi-bg"
          >
            Pasang
          </button>
        </div>
        <button
          type="button"
          onClick={() => setIsDismissed(true)}
          className="flex size-9 shrink-0 items-center justify-center rounded-full text-satomi-muted transition hover:bg-white/5 hover:text-satomi-text"
          aria-label="Tutup ajakan pasang aplikasi"
        >
          <X className="size-4" />
        </button>
      </div>
    </div>
  );
}
