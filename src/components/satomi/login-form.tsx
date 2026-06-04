"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { AuthField, AuthPrimaryButton } from "./auth-card";
import { AuthStatusMessage } from "./auth-status-message";
import { createSupabaseBrowserClient } from "@/src/lib/supabase/client";

function translateAuthError(message: string) {
  const normalized = message.toLowerCase();

  if (
    normalized.includes("invalid login credentials") ||
    normalized.includes("email not confirmed")
  ) {
    return "Email atau password belum cocok, atau email kamu belum diverifikasi.";
  }

  if (normalized.includes("failed to fetch")) {
    return "Tidak bisa terhubung ke Supabase. Periksa koneksi dan env lokal kamu.";
  }

  if (normalized.includes("next_public_supabase")) {
    return "Env Supabase belum lengkap. Isi NEXT_PUBLIC_SUPABASE_URL dan NEXT_PUBLIC_SUPABASE_ANON_KEY dulu.";
  }

  return "Masuk belum berhasil. Coba lagi sebentar lagi.";
}

async function ensureProfile(
  supabase: ReturnType<typeof createSupabaseBrowserClient>,
  user: { id: string; email?: string | null; user_metadata?: { name?: string } },
) {
  try {
    await supabase.from("profiles").upsert([
      {
        id: user.id,
        email: user.email ?? "",
        name:
          user.user_metadata?.name?.trim() || user.email?.split("@")[0] || "Pengguna SATOMI",
      },
    ]);
  } catch {
    // Dashboard can still rely on dummy data while profile sync is retried later.
  }
}

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const redirectTarget = useMemo(() => {
    const redirectedFrom = searchParams.get("redirectedFrom");

    if (!redirectedFrom || !redirectedFrom.startsWith("/")) {
      return "/dashboard";
    }

    return redirectedFrom;
  }, [searchParams]);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrorMessage("");
    setIsSubmitting(true);

    try {
      const supabase = createSupabaseBrowserClient();
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        throw error;
      }

      if (data.user) {
        await ensureProfile(supabase, data.user);
      }

      router.replace(redirectTarget);
      router.refresh();
    } catch (error) {
      const message =
        error instanceof Error ? translateAuthError(error.message) : "Masuk belum berhasil.";
      setErrorMessage(message);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form className="space-y-5" onSubmit={handleSubmit}>
      <AuthField
        id="login-email"
        name="email"
        label="Email"
        placeholder="nama@email.com"
        type="email"
        autoComplete="email"
        value={email}
        onChange={(event) => setEmail(event.target.value)}
        disabled={isSubmitting}
        required
      />
      <AuthField
        id="login-password"
        name="password"
        label="Password"
        placeholder="Masukkan password"
        type="password"
        icon="lock"
        autoComplete="current-password"
        value={password}
        onChange={(event) => setPassword(event.target.value)}
        disabled={isSubmitting}
        required
      />
      <div className="flex items-center justify-between gap-4 text-satomi-muted">
        <label className="flex items-center gap-3">
          <input
            className="size-5 rounded border-white/20 bg-black/20"
            type="checkbox"
            checked={rememberMe}
            onChange={(event) => setRememberMe(event.target.checked)}
            disabled={isSubmitting}
          />
          <span>Ingat saya</span>
        </label>
        <Link
          href="/forgot-password"
          className="font-mono text-xs font-semibold uppercase tracking-[0.16em] text-satomi-cyan"
        >
          Lupa password?
        </Link>
      </div>
      {errorMessage ? <AuthStatusMessage tone="error">{errorMessage}</AuthStatusMessage> : null}
      <AuthPrimaryButton type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Memproses..." : "Masuk"}
      </AuthPrimaryButton>
    </form>
  );
}
