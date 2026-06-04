"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AuthField, AuthPrimaryButton } from "./auth-card";
import { AuthStatusMessage } from "./auth-status-message";
import { createSupabaseBrowserClient } from "@/src/lib/supabase/client";

function translateRegisterError(message: string) {
  const normalized = message.toLowerCase();

  if (normalized.includes("user already registered")) {
    return "Email ini sudah terdaftar. Coba masuk atau reset password.";
  }

  if (normalized.includes("password should be at least")) {
    return "Password terlalu pendek. Gunakan minimal 6 karakter.";
  }

  if (normalized.includes("failed to fetch")) {
    return "Tidak bisa terhubung ke Supabase. Periksa koneksi dan env lokal kamu.";
  }

  if (normalized.includes("next_public_supabase")) {
    return "Env Supabase belum lengkap. Isi NEXT_PUBLIC_SUPABASE_URL dan NEXT_PUBLIC_SUPABASE_ANON_KEY dulu.";
  }

  return "Pendaftaran belum berhasil. Coba lagi sebentar lagi.";
}

async function ensureProfile(
  supabase: ReturnType<typeof createSupabaseBrowserClient>,
  user: { id: string; email?: string | null },
  name: string,
) {
  try {
    await supabase.from("profiles").upsert([
      {
        id: user.id,
        email: user.email ?? "",
        name: name.trim() || user.email?.split("@")[0] || "Pengguna SATOMI",
      },
    ]);
  } catch {
    // Register should stay successful even if profile backfill needs a later retry.
  }
}

export function RegisterForm() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    const normalizedName = name.trim();
    const normalizedEmail = email.trim().toLowerCase();

    if (!normalizedName) {
      setErrorMessage("Nama wajib diisi.");
      return;
    }

    if (!normalizedEmail) {
      setErrorMessage("Email wajib diisi.");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
      setErrorMessage("Format email belum valid.");
      return;
    }

    if (!password) {
      setErrorMessage("Password wajib diisi.");
      return;
    }

    if (password.length < 6) {
      setErrorMessage("Password minimal 6 karakter.");
      return;
    }

    if (!confirmPassword) {
      setErrorMessage("Konfirmasi password wajib diisi.");
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage("Konfirmasi password belum sama.");
      return;
    }

    if (!agreed) {
      setErrorMessage("Kamu perlu menyetujui kebijakan privasi dulu.");
      return;
    }

    setIsSubmitting(true);

    try {
      const supabase = createSupabaseBrowserClient();
      const { data, error } = await supabase.auth.signUp({
        email: normalizedEmail,
        password,
        options: {
          data: {
            name: normalizedName,
          },
          emailRedirectTo:
            typeof window !== "undefined" ? `${window.location.origin}/login` : undefined,
        },
      });

      if (error) {
        throw error;
      }

      if (data.user && data.session) {
        await ensureProfile(supabase, data.user, normalizedName);
        router.replace("/onboarding");
        router.refresh();
        return;
      }

      setSuccessMessage(
        "Akun berhasil dibuat. Cek email kamu untuk verifikasi sebelum masuk ke SATOMI.",
      );
    } catch (error) {
      const message =
        error instanceof Error
          ? translateRegisterError(error.message)
          : "Pendaftaran belum berhasil.";
      setErrorMessage(message);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form className="space-y-5" onSubmit={handleSubmit}>
      <AuthField
        id="register-name"
        name="name"
        label="Nama"
        placeholder="Masukkan nama lengkap"
        icon="user"
        autoComplete="name"
        value={name}
        onChange={(event) => setName(event.target.value)}
        disabled={isSubmitting}
        required
        minLength={2}
      />
      <AuthField
        id="register-email"
        name="email"
        label="Email"
        placeholder="contoh@email.com"
        type="email"
        autoComplete="email"
        value={email}
        onChange={(event) => setEmail(event.target.value)}
        disabled={isSubmitting}
        required
      />
      <AuthField
        id="register-password"
        name="password"
        label="Password"
        placeholder="Minimal 6 karakter"
        type="password"
        icon="lock"
        autoComplete="new-password"
        value={password}
        onChange={(event) => setPassword(event.target.value)}
        disabled={isSubmitting}
        required
        minLength={6}
      />
      <AuthField
        id="register-confirm-password"
        name="confirmPassword"
        label="Konfirmasi password"
        placeholder="Ulangi password"
        type="password"
        icon="lock"
        autoComplete="new-password"
        value={confirmPassword}
        onChange={(event) => setConfirmPassword(event.target.value)}
        disabled={isSubmitting}
        required
        minLength={6}
      />
      <label className="flex items-start gap-3 text-satomi-muted">
        <input
          className="mt-1 size-5 rounded border-white/20 bg-black/20"
          type="checkbox"
          checked={agreed}
          onChange={(event) => setAgreed(event.target.checked)}
          disabled={isSubmitting}
          required
        />
        <span>
          Saya setuju dengan{" "}
          <Link href="/settings/privacy" className="text-satomi-text underline">
            Kebijakan Privasi SATOMI
          </Link>
          .
        </span>
      </label>
      {errorMessage ? <AuthStatusMessage tone="error">{errorMessage}</AuthStatusMessage> : null}
      {successMessage ? (
        <AuthStatusMessage tone="success">{successMessage}</AuthStatusMessage>
      ) : null}
      <AuthPrimaryButton type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Membuat akun..." : "Daftar"}
      </AuthPrimaryButton>
    </form>
  );
}
