import type { ReactNode } from "react";
import { Bot } from "lucide-react";
import { cn } from "@/src/lib/utils";

type ChatBubbleProps = {
  role: "user" | "satomi";
  children: ReactNode;
  time?: string;
  label?: string;
  className?: string;
};

export function ChatBubble({
  role,
  children,
  time,
  label,
  className,
}: ChatBubbleProps) {
  const isUser = role === "user";

  return (
    <div className={cn("flex w-full flex-col", isUser ? "items-end" : "items-start")}>
      {!isUser ? (
        <div className="mb-2 flex items-center gap-3">
          <div className="flex size-9 items-center justify-center rounded-full border border-satomi-cyan/45 bg-satomi-cyan/15 text-satomi-cyan shadow-[0_0_18px_rgba(0,240,255,0.18)]">
            <Bot className="size-4" />
          </div>
          <span className="font-mono text-xs font-semibold uppercase tracking-[0.22em] text-satomi-muted">
            {label ?? "Satomi AI"}
          </span>
        </div>
      ) : null}
      <div
        className={cn(
          "max-w-[88%] rounded-3xl px-5 py-4 text-base leading-7 shadow-[0_12px_28px_rgba(0,0,0,0.24)] backdrop-blur-xl md:max-w-[76%]",
          isUser
            ? "rounded-br-md border border-satomi-cyan/35 bg-satomi-cyan/10 text-satomi-text"
            : "rounded-bl-md border border-white/10 bg-satomi-surface-high/65 text-satomi-text",
          className,
        )}
      >
        {children}
      </div>
      {time ? (
        <span className="mt-2 font-mono text-xs text-satomi-muted/65">{time}</span>
      ) : null}
    </div>
  );
}
