import { satomiNavItems } from "@/src/lib/satomi-data";
import { cn } from "@/src/lib/utils";
import { navIconMap } from "./navigation-icons";

type MobileBottomNavProps = {
  activePath?: string;
  className?: string;
};

export function MobileBottomNav({
  activePath = "/dashboard",
  className,
}: MobileBottomNavProps) {
  return (
    <nav
      className={cn(
        "fixed inset-x-0 bottom-0 z-40 rounded-t-[28px] border-t border-white/10 bg-satomi-surface/90 px-3 pb-[calc(0.75rem+var(--safe-area-bottom))] pt-3 shadow-[0_-18px_45px_rgba(0,0,0,0.55)] backdrop-blur-2xl md:hidden",
        className,
      )}
      aria-label="Navigasi utama"
    >
      <div className="mx-auto grid max-w-md grid-cols-5 items-end gap-1">
        {satomiNavItems.map((item) => {
          const Icon = navIconMap[item.icon];
          const isActive = activePath === item.href;
          const isCenter = item.icon === "add";

          return (
            <a
              key={item.label}
              href={item.href}
              className={cn(
                "flex min-h-16 flex-col items-center justify-center gap-1 rounded-2xl text-[10px] font-semibold transition",
                isActive
                  ? "text-satomi-cyan"
                  : "text-satomi-muted hover:text-satomi-text",
              )}
            >
              <span
                className={cn(
                  "flex items-center justify-center rounded-2xl transition",
                  isCenter
                    ? "size-12 border border-satomi-cyan/40 bg-satomi-cyan/10 shadow-[0_0_24px_rgba(0,240,255,0.22)]"
                    : "size-9",
                  isActive && "bg-satomi-cyan/12 shadow-[0_0_20px_rgba(0,240,255,0.18)]",
                )}
              >
                <Icon className={cn(isCenter ? "size-7" : "size-5")} />
              </span>
              <span className="font-mono uppercase tracking-normal">
                {item.label}
              </span>
            </a>
          );
        })}
      </div>
    </nav>
  );
}
