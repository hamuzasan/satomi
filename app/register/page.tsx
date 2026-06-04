import Link from "next/link";
import { redirect } from "next/navigation";
import { AuthCard, PublicShell } from "@/src/components/satomi";
import { RegisterForm } from "@/src/components/satomi/register-form";
import { hasSupabaseEnv } from "@/src/lib/supabase/config";
import { createSupabaseServerClient } from "@/src/lib/supabase/server";

export default async function RegisterPage() {
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
        <RegisterForm />
      </AuthCard>
    </PublicShell>
  );
}
