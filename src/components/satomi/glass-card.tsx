import type { HTMLAttributes } from "react";
import { cn } from "@/src/lib/utils";

type GlassCardVariant = "default" | "featured" | "warning" | "interactive" | "empty";

type GlassCardProps = HTMLAttributes<HTMLDivElement> & {
  variant?: GlassCardVariant;
};

const variantClass: Record<GlassCardVariant, string> = {
  default:
    "border-white/10 bg-satomi-surface/70 shadow-[0_18px_50px_rgba(0,0,0,0.35)]",
  featured:
    "satomi-card-shine border-satomi-cyan/30 bg-satomi-surface/75 shadow-[0_0_42px_rgba(0,240,255,0.12)]",
  warning:
    "border-satomi-error/35 bg-satomi-error-deep/15 shadow-[0_0_38px_rgba(255,180,171,0.14)]",
  interactive:
    "border-white/10 bg-satomi-surface/70 shadow-[0_18px_50px_rgba(0,0,0,0.35)] transition duration-200 hover:border-satomi-cyan/35 hover:shadow-[0_0_34px_rgba(0,240,255,0.13)]",
  empty:
    "satomi-card-shine border-satomi-cyan/25 bg-satomi-surface/80 shadow-[0_0_54px_rgba(0,240,255,0.14)]",
};

export function GlassCard({
  variant = "default",
  className,
  children,
  ...props
}: GlassCardProps) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-3xl border backdrop-blur-2xl",
        variantClass[variant],
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}
