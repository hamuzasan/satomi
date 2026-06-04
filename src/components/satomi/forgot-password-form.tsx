"use client";

import { useState } from "react";
import { ArrowRight } from "lucide-react";
import { AuthField, AuthPrimaryButton } from "./auth-card";
import { AuthStatusMessage } from "./auth-status-message";
import { createSupabaseBrowserClient } from "@/src/lib/supabase/client";

function translateResetError(message: string) {
  const normalized = message.toLowerCase();

  if (normalized.includes("failed to fetch")) {
    return "Tidak bisa terhubung ke Supabase. Periksa koneksi dan env lokal kamu.";
  }

  if (normalized.includes("next_public_supabase")) {
    return "Env Supabase belum lengkap. Isi NEXT_PUBLIC_SUPABASE_URL dan NEXT_PUBLIC_SUPABASE_ANON_KEY dulu.";
  }

  return "Link reset belum berhasil dikirim. Coba lagi sebentar lagi.";
}

export function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");
    setIsSubmitting(true);

    try {
      const supabase = createSupabaseBrowserClient();
      const redirectTo =
        typeof window !== "undefined" ? `${window.location.origin}/login` : undefined;
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo,
      });

      if (error) {
        throw error;
      }

      setSuccessMessage(
        "Kalau email kamu terdaftar, link reset sudah dikirim. Cek inbox dan folder spam juga ya.",
      );
    } catch (error) {
      const message =
        error instanceof Error
          ? translateResetError(error.message)
          : "Link reset belum berhasil dikirim.";
      setErrorMessage(message);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form className="space-y-6" onSubmit={handleSubmit}>
      <AuthField
        id="forgot-password-email"
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
      {errorMessage ? <AuthStatusMessage tone="error">{errorMessage}</AuthStatusMessage> : null}
      {successMessage ? (
        <AuthStatusMessage tone="success">{successMessage}</AuthStatusMessage>
      ) : null}
      <AuthPrimaryButton type="submit" disabled={isSubmitting}>
        <span className="inline-flex items-center gap-3">
          {isSubmitting ? "Mengirim..." : "Kirim link reset"}
          <ArrowRight className="size-4" />
        </span>
      </AuthPrimaryButton>
    </form>
  );
}
