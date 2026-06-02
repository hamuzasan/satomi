import { Bot } from "lucide-react";
import { cn } from "@/src/lib/utils";
import { GlassCard } from "./glass-card";

type LoadingStateProps = {
  variant?: "fullscreen" | "skeleton";
  title?: string;
  description?: string;
  className?: string;
};

export function LoadingState({
  variant = "fullscreen",
  title = "Satomi sedang membaca datamu...",
  description = "Menyiapkan ringkasan keuangan personal.",
  className,
}: LoadingStateProps) {
  if (variant === "skeleton") {
    return (
      <div className={cn("flex flex-col gap-5", className)}>
        <div className="h-14 w-3/4 animate-pulse rounded-2xl border border-satomi-cyan/20 bg-satomi-surface-high/60 shadow-[0_0_24px_rgba(0,240,255,0.08)]" />
        <div className="h-9 w-1/2 animate-pulse rounded-xl bg-satomi-surface-high/60" />
        <div className="rounded-full border border-satomi-cyan/35 bg-satomi-cyan/8 px-5 py-4 font-mono text-xs font-semibold uppercase tracking-[0.22em] text-satomi-cyan">
          Satomi sedang membaca ringkasanmu...
        </div>
        <GlassCard variant="featured" className="h-64 animate-pulse" />
        <div className="grid grid-cols-2 gap-4">
          <GlassCard className="h-36 animate-pulse" />
          <GlassCard className="h-36 animate-pulse" />
          <GlassCard className="h-36 animate-pulse" />
          <GlassCard className="h-36 animate-pulse" />
        </div>
        <GlassCard className="h-72 animate-pulse" />
      </div>
    );
  }

  return (
    <div
      className={cn(
        "relative flex min-h-dvh items-center justify-center overflow-hidden px-6 text-center",
        className,
      )}
    >
      <div className="satomi-grid pointer-events-none absolute inset-0 opacity-50" />
      <div className="pointer-events-none absolute left-1/2 top-1/2 size-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-satomi-cyan/10 blur-[90px]" />
      <div className="relative z-10 flex max-w-xl flex-col items-center">
        <div className="mb-10 flex size-32 animate-pulse items-center justify-center rounded-full bg-satomi-cyan/20 shadow-[0_0_72px_rgba(0,240,255,0.45)]">
          <div className="flex size-20 items-center justify-center rounded-full bg-satomi-cyan-soft text-satomi-bg">
            <Bot className="size-10 animate-spin [animation-duration:2.4s]" />
          </div>
        </div>
        <h1 className="font-display text-4xl font-extrabold leading-tight text-satomi-cyan-pale satomi-glow-text md:text-5xl">
          {title}
        </h1>
        <p className="mt-5 font-mono text-xs font-semibold uppercase tracking-[0.28em] text-satomi-cyan-soft">
          {description}
        </p>
      </div>
    </div>
  );
}
