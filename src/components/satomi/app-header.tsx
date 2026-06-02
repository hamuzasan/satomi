import type { ReactNode } from "react";
import { ArrowLeft, Bell, Globe2, Menu } from "lucide-react";
import { cn } from "@/src/lib/utils";

type HeaderAction = "language" | "back" | "menu";

type AppHeaderProps = {
  title?: string;
  leftAction?: HeaderAction;
  rightSlot?: ReactNode;
  desktopOffset?: boolean;
  className?: string;
};

const leftActionIcon = {
  language: Globe2,
  back: ArrowLeft,
  menu: Menu,
};

const leftActionLabel = {
  language: "Ganti bahasa",
  back: "Kembali",
  menu: "Buka menu",
};

export function AppHeader({
  title = "SATOMI",
  leftAction = "language",
  rightSlot,
  desktopOffset = true,
  className,
}: AppHeaderProps) {
  const LeftIcon = leftActionIcon[leftAction];

  return (
    <header
      className={cn(
        "safe-top fixed inset-x-0 top-0 z-40 flex h-16 items-center justify-between border-b border-satomi-outline/25 bg-satomi-surface/70 px-5 shadow-[0_4px_24px_rgba(0,0,0,0.45)] backdrop-blur-2xl md:h-20 md:px-8",
        desktopOffset && "md:left-72",
        className,
      )}
    >
      <button
        type="button"
        className="flex size-10 items-center justify-center rounded-full text-satomi-cyan transition hover:bg-satomi-cyan/10"
        aria-label={leftActionLabel[leftAction]}
      >
        <LeftIcon className="size-5" />
      </button>

      <div className="pointer-events-none absolute left-1/2 flex -translate-x-1/2 items-center gap-2">
        <span className="font-display text-2xl font-extrabold tracking-normal text-satomi-cyan satomi-glow-text md:text-3xl">
          {title}
        </span>
        <span className="size-2 rounded-full bg-satomi-cyan shadow-[0_0_12px_rgba(0,240,255,0.9)]" />
      </div>

      {rightSlot ?? (
        <button
          type="button"
          className="flex size-10 items-center justify-center rounded-full text-satomi-muted transition hover:bg-satomi-cyan/10 hover:text-satomi-cyan"
          aria-label="Buka notifikasi"
        >
          <Bell className="size-5" />
        </button>
      )}
    </header>
  );
}
