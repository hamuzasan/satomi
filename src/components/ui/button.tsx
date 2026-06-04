"use client";

import * as React from "react";
import { cn } from "@/src/lib/utils";

type ButtonVariant = "primary" | "secondary" | "ghost" | "danger";
type ButtonSize = "default" | "sm" | "lg" | "icon";

const variantClassName: Record<ButtonVariant, string> = {
  primary:
    "bg-satomi-cyan text-satomi-bg shadow-[0_0_26px_rgba(0,240,255,0.28)] hover:bg-satomi-cyan-soft",
  secondary:
    "border border-white/10 bg-black/20 text-satomi-text hover:border-satomi-cyan/35 hover:text-satomi-cyan",
  ghost:
    "border border-transparent bg-transparent text-satomi-muted hover:bg-white/5 hover:text-satomi-text",
  danger:
    "border border-satomi-error/30 bg-satomi-error/10 text-satomi-error hover:bg-satomi-error/15",
};

const sizeClassName: Record<ButtonSize, string> = {
  default: "min-h-12 rounded-2xl px-5",
  sm: "min-h-10 rounded-xl px-4",
  lg: "min-h-14 rounded-2xl px-6",
  icon: "size-10 rounded-full px-0",
};

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { className, type = "button", variant = "primary", size = "default", ...props },
    ref,
  ) => (
    <button
      ref={ref}
      type={type}
      className={cn(
        "inline-flex items-center justify-center gap-2 font-mono text-xs font-bold uppercase tracking-[0.18em] transition disabled:cursor-not-allowed disabled:opacity-60",
        variantClassName[variant],
        sizeClassName[size],
        className,
      )}
      {...props}
    />
  ),
);

Button.displayName = "Button";
