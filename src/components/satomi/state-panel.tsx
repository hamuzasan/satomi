import type { LucideIcon } from "lucide-react";
import Link from "next/link";
import { AlertTriangle, RotateCcw, Sparkles } from "lucide-react";
import { cn } from "@/src/lib/utils";
import { GlassCard } from "./glass-card";
import { PublicShell } from "./public-shell";

type StatePanelProps = {
  tone?: "cyan" | "error";
  eyebrow?: string;
  title: string;
  description: string;
  primaryAction?: { label: string; href: string };
  secondaryAction?: { label: string; href: string };
  icon?: LucideIcon;
};

export function StatePanel({
  tone = "cyan",
  eyebrow,
  title,
  description,
  primaryAction,
  secondaryAction,
  icon,
}: StatePanelProps) {
  const Icon = icon ?? (tone === "error" ? AlertTriangle : Sparkles);
  const isError = tone === "error";

  return (
    <PublicShell compact showNav={false}>
      <GlassCard
        variant={isError ? "warning" : "empty"}
        className="mx-auto flex w-full max-w-3xl flex-col items-center p-8 text-center md:p-12"
      >
        <div
          className={cn(
            "relative mb-8 flex size-36 items-center justify-center rounded-full border shadow-[0_0_64px_rgba(0,240,255,0.22)]",
            isError
              ? "border-satomi-error/35 bg-satomi-error/12 text-satomi-error"
              : "border-satomi-cyan/40 bg-satomi-cyan/10 text-satomi-cyan",
          )}
        >
          <div className="absolute inset-5 rounded-full border border-current/25" />
          <Icon className="size-16" />
        </div>
        {eyebrow ? (
          <p
            className={cn(
              "mb-4 font-mono text-xs font-semibold uppercase tracking-[0.26em]",
              isError ? "text-satomi-error" : "text-satomi-cyan",
            )}
          >
            {eyebrow}
          </p>
        ) : null}
        <h1
          className={cn(
            "font-display text-4xl font-extrabold leading-tight md:text-6xl",
            isError ? "text-satomi-error" : "text-satomi-text",
          )}
        >
          {title}
        </h1>
        <p className="mt-5 max-w-xl text-lg leading-8 text-satomi-muted md:text-2xl">
          {description}
        </p>
        {(primaryAction || secondaryAction) && (
          <div className="mt-9 flex w-full max-w-xl flex-col gap-3">
            {primaryAction ? (
              <Link
                href={primaryAction.href}
                className={cn(
                  "inline-flex min-h-14 items-center justify-center gap-3 rounded-2xl px-6 font-mono text-xs font-bold uppercase tracking-[0.22em] transition",
                  isError
                    ? "bg-satomi-error text-satomi-bg hover:bg-[#ffc7c0]"
                    : "bg-satomi-cyan text-satomi-bg shadow-[0_0_30px_rgba(0,240,255,0.28)] hover:bg-satomi-cyan-soft",
                )}
              >
                <RotateCcw className="size-4" />
                {primaryAction.label}
              </Link>
            ) : null}
            {secondaryAction ? (
              <Link
                href={secondaryAction.href}
                className="inline-flex min-h-14 items-center justify-center rounded-2xl border border-white/15 bg-black/20 px-6 font-mono text-xs font-bold uppercase tracking-[0.18em] text-satomi-text transition hover:border-satomi-cyan/40 hover:text-satomi-cyan"
              >
                {secondaryAction.label}
              </Link>
            ) : null}
          </div>
        )}
      </GlassCard>
    </PublicShell>
  );
}
