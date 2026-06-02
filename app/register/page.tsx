import Link from "next/link";
import {
  AuthCard,
  AuthField,
  AuthPrimaryButton,
  PublicShell,
} from "@/src/components/satomi";

export default function RegisterPage() {
  return (
    <PublicShell compact showNav={false}>
      <AuthCard
        title="Buat akun SATOMI"
        description="Mulai atur keuanganmu lewat percakapan ringan."
        footer={
          <p>
            Sudah punya akun?{" "}
            <Link href="/login" className="font-semibold text-satomi-text underline">
              Masuk
            </Link>
          </p>
        }
      >
        <div className="space-y-5">
          <AuthField label="Nama" placeholder="Masukkan nama lengkap" icon="user" />
          <AuthField label="Email" placeholder="contoh@email.com" type="email" />
          <AuthField
            label="Password"
            placeholder="Minimal 8 karakter"
            type="password"
            icon="lock"
          />
          <AuthField
            label="Konfirmasi password"
            placeholder="Ulangi password"
            type="password"
            icon="lock"
          />
          <label className="flex items-start gap-3 text-satomi-muted">
            <input className="mt-1 size-5 rounded border-white/20 bg-black/20" type="checkbox" />
            <span>
              Saya setuju dengan{" "}
              <Link href="/settings/privacy" className="text-satomi-text underline">
                Kebijakan Privasi SATOMI
              </Link>
              .
            </span>
          </label>
          <AuthPrimaryButton href="/onboarding">Daftar</AuthPrimaryButton>
        </div>
      </AuthCard>
    </PublicShell>
  );
}
