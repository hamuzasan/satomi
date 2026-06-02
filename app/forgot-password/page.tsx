import { ArrowLeft, ArrowRight } from "lucide-react";
import Link from "next/link";
import {
  AuthCard,
  AuthField,
  AuthPrimaryButton,
  PublicShell,
} from "@/src/components/satomi";

export default function ForgotPasswordPage() {
  return (
    <PublicShell compact showNav={false}>
      <AuthCard
        title="Reset password"
        description="Masukkan email kamu, kami akan kirim link reset."
        footer={
          <Link
            href="/login"
            className="inline-flex items-center gap-2 font-mono text-xs font-semibold uppercase tracking-[0.18em] text-satomi-cyan"
          >
            <ArrowLeft className="size-4" />
            Kembali ke login
          </Link>
        }
      >
        <div className="space-y-6">
          <AuthField label="Email" placeholder="nama@email.com" type="email" />
          <AuthPrimaryButton href="/login">
            <span className="inline-flex items-center gap-3">
              Kirim link reset
              <ArrowRight className="size-4" />
            </span>
          </AuthPrimaryButton>
        </div>
      </AuthCard>
    </PublicShell>
  );
}
