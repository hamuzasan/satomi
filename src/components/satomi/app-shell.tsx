import type { ReactNode } from "react";
import { cn } from "@/src/lib/utils";
import { AppHeader } from "./app-header";
import { AppSidebar } from "./app-sidebar";
import { MobileBottomNav } from "./mobile-bottom-nav";

type AppShellProps = {
  children: ReactNode;
  activePath?: string;
  headerTitle?: string;
  className?: string;
};

export function AppShell({
  children,
  activePath = "/dashboard",
  headerTitle = "SATOMI",
  className,
}: AppShellProps) {
  return (
    <div className="satomi-ambient min-h-dvh overflow-hidden text-satomi-text">
      <div className="satomi-grid pointer-events-none fixed inset-0 opacity-70" />
      <div className="pointer-events-none fixed -left-28 top-20 size-80 rounded-full bg-satomi-cyan/10 blur-[90px]" />
      <div className="pointer-events-none fixed -right-24 top-72 size-96 rounded-full bg-satomi-purple/10 blur-[110px]" />

      <AppSidebar activePath={activePath} />
      <AppHeader title={headerTitle} />

      <main
        className={cn(
          "relative z-10 mx-auto flex w-full max-w-[1280px] flex-col gap-6 px-4 pb-32 pt-24 md:pl-[20rem] md:pr-8 md:pt-28",
          className,
        )}
      >
        {children}
      </main>

      <MobileBottomNav activePath={activePath} />
    </div>
  );
}
