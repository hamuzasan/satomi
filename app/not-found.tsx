import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { PublicShell } from "@/src/components/satomi";

export default function NotFound() {
  return (
    <PublicShell compact showNav={false}>
      <div className="mx-auto flex max-w-3xl flex-col items-center text-center">
        <div className="relative mb-8 flex size-72 items-center justify-center rounded-full border border-satomi-cyan/20 bg-satomi-cyan/8 shadow-[0_0_72px_rgba(0,240,255,0.16)]">
          <div className="absolute inset-8 rounded-full bg-black/35" />
          <div className="relative size-44 rounded-full border border-satomi-cyan/35 bg-[radial-gradient(circle_at_center,rgba(0,240,255,0.35),rgba(207,92,255,0.18),transparent_68%)]" />
        </div>
        <p className="font-display text-8xl font-extrabold leading-none text-satomi-purple-soft satomi-glow-text md:text-[10rem]">
          404
        </p>
        <h1 className="mt-5 font-display text-4xl font-extrabold leading-tight text-satomi-text md:text-6xl">
          Halaman tidak ditemukan
        </h1>
        <p className="mt-5 max-w-xl text-lg leading-8 text-satomi-muted md:text-2xl">
          Sepertinya kamu tersesat dari jalur keuangan.
        </p>
        <Link
          href="/dashboard"
          className="mt-9 inline-flex min-h-14 w-full max-w-xl items-center justify-center gap-3 rounded-full bg-satomi-cyan px-6 font-mono text-xs font-bold uppercase tracking-[0.22em] text-satomi-bg shadow-[0_0_30px_rgba(0,240,255,0.28)] transition hover:bg-satomi-cyan-soft"
        >
          <ArrowLeft className="size-4" />
          Kembali ke Dashboard
        </Link>
      </div>
    </PublicShell>
  );
}
