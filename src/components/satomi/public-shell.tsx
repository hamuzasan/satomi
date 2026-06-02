import type { ReactNode } from "react";
import Link from "next/link";
import { cn } from "@/src/lib/utils";
import { SatomiMark } from "./satomi-mark";

type PublicShellProps = {
  children: ReactNode;
  compact?: boolean;
  showNav?: boolean;
  className?: string;
};

export function PublicShell({
  children,
  compact = false,
  showNav = true,
  className,
}: PublicShellProps) {
  return (
    <div className="satomi-ambient relative min-h-dvh overflow-hidden text-satomi-text">
      <div className="satomi-grid pointer-events-none fixed inset-0 opacity-55" />
      <div className="pointer-events-none fixed left-1/2 top-0 size-[34rem] -translate-x-1/2 rounded-full bg-satomi-cyan/10 blur-[120px]" />
      <div className="pointer-events-none fixed bottom-0 right-0 size-[28rem] rounded-full bg-satomi-purple/10 blur-[110px]" />

      {showNav ? (
        <header className="safe-top fixed inset-x-0 top-0 z-40 border-b border-white/10 bg-satomi-surface/70 backdrop-blur-2xl">
          <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 md:h-20 md:px-8">
            <Link href="/" aria-label="Beranda SATOMI">
              <SatomiMark size="sm" withLabel />
            </Link>
            <nav className="flex items-center gap-2">
              <Link
                href="/login"
                className="hidden rounded-2xl px-4 py-2 font-mono text-xs font-semibold uppercase tracking-[0.16em] text-satomi-muted transition hover:text-satomi-cyan sm:inline-flex"
              >
                Masuk
              </Link>
              <Link
                href="/register"
                className="inline-flex min-h-11 items-center justify-center rounded-2xl bg-satomi-cyan px-4 font-mono text-xs font-bold uppercase tracking-[0.16em] text-satomi-bg shadow-[0_0_24px_rgba(0,240,255,0.24)] transition hover:bg-satomi-cyan-soft"
              >
                Coba Satomi
              </Link>
            </nav>
          </div>
        </header>
      ) : null}

      <main
        className={cn(
          "relative z-10 mx-auto w-full max-w-6xl px-4 md:px-8",
          compact ? "flex min-h-dvh items-center justify-center py-8" : "pb-24 pt-24 md:pt-28",
          className,
        )}
      >
        {children}
      </main>
    </div>
  );
}
