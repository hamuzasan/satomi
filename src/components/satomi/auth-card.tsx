import type { ReactNode } from "react";
import Link from "next/link";
import { Mail, Lock, UserRound } from "lucide-react";
import { GlassCard } from "./glass-card";
import { SatomiMark } from "./satomi-mark";

type AuthCardProps = {
  title: string;
  description: string;
  children: ReactNode;
  footer?: ReactNode;
};

export function AuthCard({ title, description, children, footer }: AuthCardProps) {
  return (
    <GlassCard
      variant="featured"
      className="w-full max-w-3xl rounded-[28px] p-6 text-center md:p-12"
    >
      <div className="mx-auto mb-8 flex justify-center">
        <SatomiMark size="lg" />
      </div>
      <h1 className="font-display text-4xl font-extrabold leading-tight text-satomi-text md:text-6xl">
        {title}
      </h1>
      <p className="mx-auto mt-4 max-w-xl text-lg leading-8 text-satomi-muted md:text-2xl">
        {description}
      </p>
      <div className="mx-auto mt-9 max-w-xl text-left">{children}</div>
      {footer ? <div className="mt-8 text-center text-satomi-muted">{footer}</div> : null}
    </GlassCard>
  );
}

export function AuthField({
  label,
  placeholder,
  type = "text",
  icon = "mail",
}: {
  label: string;
  placeholder: string;
  type?: string;
  icon?: "mail" | "lock" | "user";
}) {
  const Icon = icon === "lock" ? Lock : icon === "user" ? UserRound : Mail;

  return (
    <label className="block">
      <span className="font-mono text-xs font-semibold uppercase tracking-[0.24em] text-satomi-cyan-pale">
        {label}
      </span>
      <span className="mt-3 flex min-h-14 items-center gap-4 rounded-2xl border border-white/15 bg-white px-4 text-satomi-bg shadow-[0_0_20px_rgba(0,240,255,0.08)]">
        <Icon className="size-5 text-satomi-outline" />
        <input
          className="min-w-0 flex-1 bg-transparent text-lg text-satomi-bg outline-none placeholder:text-slate-500"
          placeholder={placeholder}
          type={type}
        />
      </span>
    </label>
  );
}

export function AuthPrimaryButton({
  children,
  href = "/dashboard",
}: {
  children: ReactNode;
  href?: string;
}) {
  return (
    <Link
      href={href}
      className="inline-flex min-h-14 w-full items-center justify-center rounded-2xl bg-satomi-cyan px-6 font-mono text-xs font-bold uppercase tracking-[0.22em] text-satomi-bg shadow-[0_0_30px_rgba(0,240,255,0.28)] transition hover:bg-satomi-cyan-soft"
    >
      {children}
    </Link>
  );
}
