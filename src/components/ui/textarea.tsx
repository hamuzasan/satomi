"use client";

import * as React from "react";
import { cn } from "@/src/lib/utils";

export const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.TextareaHTMLAttributes<HTMLTextAreaElement>
>(({ className, ...props }, ref) => (
  <textarea
    ref={ref}
    className={cn(
      "flex min-h-[120px] w-full rounded-2xl border border-white/10 bg-black/25 px-4 py-3 text-sm text-satomi-text outline-none transition placeholder:text-satomi-muted/60 focus:border-satomi-cyan/45 focus:shadow-[0_0_22px_rgba(0,240,255,0.12)] disabled:cursor-not-allowed disabled:opacity-60",
      className,
    )}
    {...props}
  />
));

Textarea.displayName = "Textarea";
