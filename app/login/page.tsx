import Link from "next/link";
import { redirect } from "next/navigation";
import { AuthCard, PublicShell } from "@/src/components/satomi";
import { LoginForm } from "@/src/components/satomi/login-form";
import { hasSupabaseEnv } from "@/src/lib/supabase/config";
import { createSupabaseServerClient } from "@/src/lib/supabase/server";

export default async function LoginPage() {
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
        <LoginForm />
      </AuthCard>
    </PublicShell>
  );
}
