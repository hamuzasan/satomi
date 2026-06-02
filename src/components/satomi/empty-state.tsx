import type { LucideIcon } from "lucide-react";
import { Sparkles } from "lucide-react";
import { cn } from "@/src/lib/utils";
import { GlassCard } from "./glass-card";

type EmptyStateProps = {
  title: string;
  description: string;
  primaryAction?: {
    label: string;
    href: string;
  };
  secondaryAction?: {
    label: string;
    href: string;
  };
  icon?: LucideIcon;
  className?: string;
};

export function EmptyState({
  title,
  description,
  primaryAction,
  secondaryAction,
  icon: Icon = Sparkles,
  className,
}: EmptyStateProps) {
  return (
    <GlassCard
      variant="empty"
      className={cn("mx-auto flex max-w-2xl flex-col items-center p-8 text-center md:p-12", className)}
    >
      <div className="relative mb-8 flex size-32 items-center justify-center rounded-full border border-satomi-cyan/40 bg-satomi-cyan/10 shadow-[0_0_54px_rgba(0,240,255,0.22)]">
        <div className="absolute inset-4 rounded-full border border-satomi-cyan/30" />
        <Icon className="size-14 text-satomi-cyan satomi-glow-text" />
      </div>
      <h2 className="font-display text-4xl font-extrabold leading-tight text-satomi-text">
        {title}
      </h2>
      <p className="mt-4 max-w-lg text-base leading-7 text-satomi-muted md:text-lg">
        {description}
      </p>
      {(primaryAction || secondaryAction) && (
        <div className="mt-8 flex w-full flex-col gap-3 sm:w-auto sm:min-w-80">
          {primaryAction ? (
            <a
              href={primaryAction.href}
              className="inline-flex min-h-14 items-center justify-center rounded-2xl bg-satomi-cyan px-6 font-mono text-xs font-bold uppercase tracking-[0.22em] text-satomi-bg shadow-[0_0_28px_rgba(0,240,255,0.28)] transition hover:bg-satomi-cyan-soft"
            >
              {primaryAction.label}
            </a>
          ) : null}
          {secondaryAction ? (
            <a
              href={secondaryAction.href}
              className="inline-flex min-h-14 items-center justify-center rounded-2xl border border-satomi-outline bg-black/20 px-6 font-mono text-xs font-bold uppercase tracking-[0.18em] text-satomi-text transition hover:border-satomi-cyan/40 hover:text-satomi-cyan"
            >
              {secondaryAction.label}
            </a>
          ) : null}
        </div>
      )}
    </GlassCard>
  );
}
