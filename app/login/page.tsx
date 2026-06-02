import Link from "next/link";
import {
  AuthCard,
  AuthField,
  AuthPrimaryButton,
  PublicShell,
} from "@/src/components/satomi";

export default function LoginPage() {
  return (
    <PublicShell compact showNav={false}>
      <AuthCard
        title="Masuk ke SATOMI"
        description="Lanjutkan pencatatan keuanganmu bersama Satomi."
        footer={
          <p>
            Belum punya akun?{" "}
            <Link href="/register" className="font-semibold text-satomi-text underline">
              Daftar
            </Link>
          </p>
        }
      >
        <div className="space-y-5">
          <AuthField label="Email" placeholder="nama@email.com" type="email" />
          <AuthField
            label="Password"
            placeholder="••••••••"
            type="password"
            icon="lock"
          />
          <div className="flex items-center justify-between gap-4 text-satomi-muted">
            <label className="flex items-center gap-3">
              <input className="size-5 rounded border-white/20 bg-black/20" type="checkbox" />
              <span>Ingat saya</span>
            </label>
            <Link href="/forgot-password" className="font-mono text-xs font-semibold uppercase tracking-[0.16em] text-satomi-cyan">
              Lupa password?
            </Link>
          </div>
          <AuthPrimaryButton>Masuk</AuthPrimaryButton>
          <div className="relative py-2 text-center">
            <div className="absolute left-0 right-0 top-1/2 h-px bg-white/10" />
            <span className="relative bg-satomi-surface px-4 font-mono text-xs uppercase tracking-[0.22em] text-satomi-muted">
              atau
            </span>
          </div>
          <button className="min-h-14 w-full rounded-2xl border border-satomi-cyan/50 bg-black/20 font-semibold text-satomi-text transition hover:bg-satomi-cyan/10">
            Masuk dengan Google
          </button>
        </div>
      </AuthCard>
    </PublicShell>
  );
}
