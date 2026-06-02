import { Bot, Sparkles } from "lucide-react";
import { satomiNavItems, satomiUser } from "@/src/lib/satomi-data";
import { cn } from "@/src/lib/utils";
import { navIconMap } from "./navigation-icons";

type AppSidebarProps = {
  activePath?: string;
  className?: string;
};

export function AppSidebar({
  activePath = "/dashboard",
  className,
}: AppSidebarProps) {
  return (
    <aside
      className={cn(
        "fixed inset-y-0 left-0 z-50 hidden w-72 flex-col overflow-hidden rounded-r-[32px] border-r border-satomi-outline/25 bg-satomi-surface/80 px-5 py-7 shadow-2xl backdrop-blur-2xl md:flex",
        className,
      )}
    >
      <div className="flex items-center gap-4 px-2">
        <div className="relative flex size-13 items-center justify-center rounded-full border border-satomi-cyan/45 bg-satomi-cyan/10 shadow-[0_0_24px_rgba(0,240,255,0.18)]">
          <Sparkles className="size-6 text-satomi-cyan" />
          <span className="absolute right-1 top-1 size-3 rounded-full bg-satomi-green shadow-[0_0_10px_rgba(16,185,129,0.8)]" />
        </div>
        <div>
          <p className="font-display text-2xl font-extrabold text-satomi-cyan satomi-glow-text">
            SATOMI AI
          </p>
          <p className="mt-1 font-mono text-[11px] uppercase tracking-[0.2em] text-satomi-muted">
            Mode aktif
          </p>
        </div>
      </div>

      <div className="mt-8 rounded-2xl border border-satomi-cyan/20 bg-satomi-cyan/8 p-4">
        <div className="flex items-center gap-3">
          <div className="flex size-9 items-center justify-center rounded-full bg-satomi-cyan/15 text-satomi-cyan">
            <Bot className="size-5" />
          </div>
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.22em] text-satomi-cyan">
              {satomiUser.status}
            </p>
            <p className="mt-1 text-sm text-satomi-muted">
              Siap membaca pola keuanganmu.
            </p>
          </div>
        </div>
      </div>

      <nav className="mt-8 flex flex-1 flex-col gap-2">
        {satomiNavItems.map((item) => {
          const Icon = navIconMap[item.icon];
          const isActive = activePath === item.href;

          return (
            <a
              key={item.label}
              href={item.href}
              className={cn(
                "flex items-center gap-4 rounded-2xl border border-transparent px-4 py-3 font-mono text-xs font-semibold uppercase tracking-[0.18em] text-satomi-muted transition",
                isActive
                  ? "border-satomi-cyan/25 bg-satomi-cyan/12 text-satomi-cyan shadow-[inset_18px_0_34px_-24px_rgba(0,240,255,0.8),0_0_28px_rgba(0,240,255,0.10)]"
                  : "hover:border-white/10 hover:bg-white/5 hover:text-satomi-text",
              )}
            >
              <Icon className="size-5" />
              {item.label}
            </a>
          );
        })}
      </nav>

      <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
        <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-satomi-muted">
          Profil
        </p>
        <p className="mt-2 font-display text-xl font-bold text-satomi-text">
          {satomiUser.name}
        </p>
        <p className="mt-1 text-sm text-satomi-muted">{satomiUser.plan}</p>
      </div>
    </aside>
  );
}
