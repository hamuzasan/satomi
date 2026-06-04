import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { AuthCard, PublicShell } from "@/src/components/satomi";
import { ForgotPasswordForm } from "@/src/components/satomi/forgot-password-form";
import { hasSupabaseEnv } from "@/src/lib/supabase/config";
import { createSupabaseServerClient } from "@/src/lib/supabase/server";

export default async function ForgotPasswordPage() {
  if (hasSupabaseEnv()) {
    const supabase = await createSupabaseServerClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user) {
      redirect("/dashboard");
    }
  }

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
        <ForgotPasswordForm />
      </AuthCard>
    </PublicShell>
  );
}
