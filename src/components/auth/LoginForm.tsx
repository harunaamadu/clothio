"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { loginSchema, type LoginInput } from "@/schemas/auth";
import { OAuthButtons } from "./OAuthButtons";
import { cn } from "@/lib/utils";

interface LoginFormProps {
  callbackUrl?: string;
  // CHANGED: added registered prop — shown when redirected from successful sign-up
  registered?: boolean;
}

export function LoginForm({ callbackUrl, registered }: LoginFormProps) {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginInput, unknown, LoginInput>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginInput) => {
    setServerError("");

    const result = await signIn("credentials", {
      email: data.email,
      password: data.password,
      redirect: false,
    });

    if (result?.error) {
      setServerError("Invalid email or password. Please try again.");
      return;
    }

    router.push(callbackUrl ?? "/");
    router.refresh();
  };

  return (
    <div className="space-y-5">
      <OAuthButtons callbackUrl={callbackUrl} />

      {/* Divider */}
      <div className="relative flex items-center gap-3">
        <div className="flex-1 h-px bg-[#e4e4e7]" />
        <span className="text-xs text-[#a1a1aa] shrink-0">
          or continue with email
        </span>
        <div className="flex-1 h-px bg-[#e4e4e7]" />
      </div>

      {/* CHANGED: success banner shown after redirect from successful registration */}
      {registered && (
        <p className="bg-green-50 border border-green-200 px-4 py-3 text-sm text-green-700">
          Account created! Sign in to continue.
        </p>
      )}

      {/* Server error */}
      {serverError && (
        <p className="bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
          {serverError}
        </p>
      )}

      <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
        {/* Email */}
        <div className="space-y-1.5">
          <label
            htmlFor="email"
            className="block text-sm font-medium text-[#18181b]"
          >
            Email address
          </label>
          <input
            id="email"
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            {...register("email")}
            className={cn(
              "w-full border bg-white px-4 py-2.5 text-sm outline-none transition-colors",
              "placeholder:text-[#a1a1aa] focus:border-[#1a1a2e] focus:ring-2 focus:ring-[#1a1a2e]/10",
              errors.email
                ? "border-red-400 focus:border-red-400 focus:ring-red-100"
                : "border-[#e4e4e7]",
            )}
          />
          {errors.email && (
            <p className="text-xs text-red-500">{errors.email.message}</p>
          )}
        </div>

        {/* Password */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-[#18181b]"
            >
              Password
            </label>
            <Link
              href="/forgot-password"
              className="text-xs text-primary hover:underline underline-offset-4"
              tabIndex={-1}
            >
              Forgot password?
            </Link>
          </div>
          <div className="relative">
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              placeholder="••••••••"
              {...register("password")}
              className={cn(
                "w-full border bg-white px-4 py-2.5 pr-11 text-sm outline-none transition-colors",
                "placeholder:text-[#a1a1aa] focus:border-[#1a1a2e] focus:ring-2 focus:ring-[#1a1a2e]/10",
                errors.password
                  ? "border-red-400 focus:border-red-400 focus:ring-red-100"
                  : "border-[#e4e4e7]",
              )}
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#a1a1aa] hover:text-[#71717a] transition-colors"
              tabIndex={-1}
            >
              {showPassword ? (
                <EyeOff className="w-4 h-4" />
              ) : (
                <Eye className="w-4 h-4" />
              )}
            </button>
          </div>
          {errors.password && (
            <p className="text-xs text-red-500">{errors.password.message}</p>
          )}
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full flex items-center justify-center gap-2 bg-[#1a1a2e] hover:bg-primary disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold text-sm py-3 transition-colors"
        >
          {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
          {isSubmitting ? "Signing in…" : "Sign in"}
        </button>
      </form>
    </div>
  );
}
