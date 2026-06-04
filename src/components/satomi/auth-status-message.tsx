import type { ReactNode } from "react";
import { cn } from "@/src/lib/utils";

type AuthStatusMessageProps = {
  tone?: "info" | "success" | "error";
  children: ReactNode;
};

export function AuthStatusMessage({
  tone = "info",
  children,
}: AuthStatusMessageProps) {
  return (
    <div
      className={cn(
        "rounded-2xl border px-4 py-3 text-sm leading-6",
        tone === "info" && "border-satomi-cyan/30 bg-satomi-cyan/10 text-satomi-text",
        tone === "success" &&
          "border-emerald-400/30 bg-emerald-400/10 text-emerald-100",
        tone === "error" && "border-rose-400/30 bg-rose-400/10 text-rose-100",
      )}
    >
      {children}
    </div>
  );
}
