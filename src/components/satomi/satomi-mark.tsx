import { Sparkles } from "lucide-react";
import { cn } from "@/src/lib/utils";

type SatomiMarkProps = {
  size?: "sm" | "md" | "lg" | "xl";
  withLabel?: boolean;
  className?: string;
};

const sizeClass = {
  sm: "size-10",
  md: "size-13",
  lg: "size-20",
  xl: "size-32",
};

const iconClass = {
  sm: "size-5",
  md: "size-6",
  lg: "size-10",
  xl: "size-16",
};

export function SatomiMark({
  size = "md",
  withLabel = false,
  className,
}: SatomiMarkProps) {
  return (
    <div className={cn("flex items-center gap-3", className)}>
      <div
        className={cn(
          "relative flex shrink-0 items-center justify-center rounded-full border border-satomi-cyan/45 bg-satomi-cyan/15 shadow-[0_0_34px_rgba(0,240,255,0.28)]",
          sizeClass[size],
        )}
      >
        <div className="absolute inset-1 rounded-full border border-satomi-purple/50" />
        <Sparkles className={cn("relative text-satomi-cyan satomi-glow-text", iconClass[size])} />
        <span className="absolute right-1.5 top-1.5 size-3 rounded-full bg-satomi-green shadow-[0_0_12px_rgba(16,185,129,0.85)]" />
      </div>
      {withLabel ? (
        <span className="font-display text-3xl font-extrabold tracking-normal text-satomi-cyan satomi-glow-text">
          SATOMI
        </span>
      ) : null}
    </div>
  );
}
