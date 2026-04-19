"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, MailCheck } from "lucide-react";
import { forgotPasswordSchema, type ForgotPasswordInput } from "@/schemas/auth";
import { cn } from "@/lib/utils";

export function ForgotPasswordForm() {
  const [submitted, setSubmitted] = useState(false);
  const [submittedEmail, setSubmittedEmail] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordInput>({ resolver: zodResolver(forgotPasswordSchema) });

  const onSubmit = async (data: ForgotPasswordInput) => {
    // POST to your reset-password API route when implemented.
    // For now we optimistically show the confirmation screen so the
    // UI flow is fully demonstrable without a mail provider set up.
    await fetch("/api/auth/forgot-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: data.email }),
    }).catch(() => {
      // Fail silently — we always show confirmation to avoid
      // leaking whether an email exists in the system.
    });

    setSubmittedEmail(data.email);
    setSubmitted(true);
  };

  // ── Success state ──────────────────────────────────────────────────────────
  if (submitted) {
    return (
      <div className="text-center space-y-5 py-4">
        <div className="mx-auto w-16 h-16 rounded-full bg-green-50 border border-green-100 flex items-center justify-center">
          <MailCheck className="w-7 h-7 text-green-600" />
        </div>
        <div className="space-y-1">
          <h2 className="font-display text-xl font-semibold text-[#1a1a2e]">Check your inbox</h2>
          <p className="text-sm text-[#71717a]">
            If an account exists for{" "}
            <span className="font-medium text-[#18181b]">{submittedEmail}</span>, we've sent a
            password reset link. It may take a minute to arrive.
          </p>
        </div>
        <p className="text-xs text-[#a1a1aa]">
          Didn't get it? Check your spam folder, or{" "}
          <button
            type="button"
            onClick={() => setSubmitted(false)}
            className="text-[#e94560] hover:underline underline-offset-4 font-medium"
          >
            try again
          </button>
          .
        </p>
      </div>
    );
  }

  // ── Form state ─────────────────────────────────────────────────────────────
  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
      <div className="space-y-1.5">
        <label htmlFor="email" className="block text-sm font-medium text-[#18181b]">
          Email address
        </label>
        <input
          id="email"
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
          {...register("email")}
          className={cn(
            "w-full rounded-xl border bg-white px-4 py-2.5 text-sm outline-none transition-colors",
            "placeholder:text-[#a1a1aa] focus:border-[#1a1a2e] focus:ring-2 focus:ring-[#1a1a2e]/10",
            errors.email
              ? "border-red-400 focus:border-red-400 focus:ring-red-100"
              : "border-[#e4e4e7]"
          )}
        />
        {errors.email && (
          <p className="text-xs text-red-500">{errors.email.message}</p>
        )}
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full flex items-center justify-center gap-2 bg-[#1a1a2e] hover:bg-[#e94560] disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold text-sm py-3 rounded-xl transition-colors"
      >
        {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
        {isSubmitting ? "Sending…" : "Send reset link"}
      </button>
    </form>
  );
}