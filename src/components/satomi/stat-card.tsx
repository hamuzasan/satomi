import type { LucideIcon } from "lucide-react";
import { ArrowDown, ArrowUp, Minus } from "lucide-react";
import { cn } from "@/src/lib/utils";
import { GlassCard } from "./glass-card";

type StatTone = "cyan" | "purple" | "green" | "amber" | "error";

type StatCardProps = {
  label: string;
  value: string;
  detail?: string;
  tone?: StatTone;
  trend?: "up" | "down" | "flat";
  icon?: LucideIcon;
  className?: string;
};

const toneClass: Record<StatTone, string> = {
  cyan: "text-satomi-cyan bg-satomi-cyan/12 border-satomi-cyan/30",
  purple: "text-satomi-purple-soft bg-satomi-purple/12 border-satomi-purple/30",
  green: "text-satomi-green bg-satomi-green/12 border-satomi-green/30",
  amber: "text-satomi-amber bg-satomi-amber/12 border-satomi-amber/30",
  error: "text-satomi-error bg-satomi-error/12 border-satomi-error/30",
};

const trendIcon = {
  up: ArrowUp,
  down: ArrowDown,
  flat: Minus,
};

export function StatCard({
  label,
  value,
  detail,
  tone = "cyan",
  trend = "flat",
  icon: Icon,
  className,
}: StatCardProps) {
  const TrendIcon = trendIcon[trend];

  return (
    <GlassCard variant="interactive" className={cn("p-5", className)}>
      <div className="flex items-start justify-between gap-4">
        <div
          className={cn(
            "flex size-11 items-center justify-center rounded-full border",
            toneClass[tone],
          )}
        >
          {Icon ? <Icon className="size-5" /> : <TrendIcon className="size-5" />}
        </div>
        <TrendIcon className={cn("mt-1 size-4", toneClass[tone].split(" ")[0])} />
      </div>
      <p className="mt-5 font-mono text-xs font-semibold uppercase tracking-[0.24em] text-satomi-muted">
        {label}
      </p>
      <p className="mt-3 font-display text-3xl font-extrabold tracking-normal text-satomi-text">
        {value}
      </p>
      {detail ? (
        <p className="mt-1 text-sm leading-6 text-satomi-muted">{detail}</p>
      ) : null}
    </GlassCard>
  );
}
