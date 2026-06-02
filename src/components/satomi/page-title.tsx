import type { ReactNode } from "react";
import { cn } from "@/src/lib/utils";

type PageTitleProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  actions?: ReactNode;
  className?: string;
};

export function PageTitle({
  eyebrow,
  title,
  description,
  actions,
  className,
}: PageTitleProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-5 md:flex-row md:items-end md:justify-between",
        className,
      )}
    >
      <div className="max-w-3xl">
        {eyebrow ? (
          <p className="mb-3 font-mono text-xs font-semibold uppercase tracking-[0.28em] text-satomi-cyan">
            {eyebrow}
          </p>
        ) : null}
        <h1 className="font-display text-4xl font-extrabold leading-tight tracking-normal text-satomi-text md:text-5xl">
          {title}
        </h1>
        {description ? (
          <p className="mt-3 max-w-2xl text-base leading-7 text-satomi-muted md:text-lg">
            {description}
          </p>
        ) : null}
      </div>
      {actions ? <div className="flex flex-wrap gap-3">{actions}</div> : null}
    </div>
  );
}
