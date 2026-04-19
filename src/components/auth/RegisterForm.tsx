"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Eye, EyeOff, Loader2, Check, X } from "lucide-react"
import { registerSchema, type RegisterInput } from "@/schemas/auth"
// CHANGED: call registerAction server action directly — no more fetch("/api/register")
import { registerAction } from "@/server/actions/auth.actions"
import { OAuthButtons } from "./OAuthButtons"
import { cn } from "@/lib/utils"

// ─── Password rule indicator ──────────────────────────────────────────────────

function Rule({ met, label }: { met: boolean; label: string }) {
  return (
    <span className={cn("flex items-center gap-1 text-xs", met ? "text-green-600" : "text-[#a1a1aa]")}>
      {met ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />}
      {label}
    </span>
  )
}

// ─── Component ────────────────────────────────────────────────────────────────

export function RegisterForm() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm,  setShowConfirm]  = useState(false)
  const [serverError,  setServerError]  = useState("")

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<RegisterInput, unknown, RegisterInput>({
    resolver: zodResolver(registerSchema),
  })

  // Live password-strength indicators
  const passwordValue = watch("password") ?? ""
  const rules = {
    length: passwordValue.length >= 8,
    upper:  /[A-Z]/.test(passwordValue),
    number: /[0-9]/.test(passwordValue),
  }

  const onSubmit = async (data: RegisterInput) => {
    setServerError("")

    // CHANGED: call server action directly instead of POST /api/register
    const result = await registerAction(data)

    if (!result.success) {
      setServerError(result.error)
      return
    }

    // Auto sign-in immediately after successful registration
    const signInResult = await signIn("credentials", {
      email:    data.email,
      password: data.password,
      redirect: false,
    })

    if (signInResult?.error) {
      // Registration succeeded but auto sign-in failed — send to login
      router.push("/login?registered=true")
      return
    }

    router.push("/")
    router.refresh()
  }

  return (
    <div className="space-y-5">
      <OAuthButtons label="Sign up" />

      {/* Divider */}
      <div className="relative flex items-center gap-3">
        <div className="flex-1 h-px bg-[#e4e4e7]" />
        <span className="text-xs text-[#a1a1aa] shrink-0">or register with email</span>
        <div className="flex-1 h-px bg-[#e4e4e7]" />
      </div>

      {/* Server error banner */}
      {serverError && (
        <p className="bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
          {serverError}
        </p>
      )}

      <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
        {/* Full name */}
        <div className="space-y-1.5">
          <label htmlFor="name" className="block text-sm font-medium text-[#18181b]">
            Full name
          </label>
          <input
            id="name"
            type="text"
            autoComplete="name"
            placeholder="Jane Smith"
            {...register("name")}
            className={cn(
              "w-full border bg-white px-4 py-2.5 text-sm outline-none transition-colors",
              "placeholder:text-[#a1a1aa] focus:border-[#1a1a2e] focus:ring-2 focus:ring-[#1a1a2e]/10",
              errors.name
                ? "border-red-400 focus:border-red-400 focus:ring-red-100"
                : "border-[#e4e4e7]"
            )}
          />
          {errors.name && (
            <p className="text-xs text-red-500">{errors.name.message}</p>
          )}
        </div>

        {/* Email */}
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
              "w-full border bg-white px-4 py-2.5 text-sm outline-none transition-colors",
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

        {/* Password */}
        <div className="space-y-1.5">
          <label htmlFor="password" className="block text-sm font-medium text-[#18181b]">
            Password
          </label>
          <div className="relative">
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              autoComplete="new-password"
              placeholder="••••••••"
              {...register("password")}
              className={cn(
                "w-full border bg-white px-4 py-2.5 pr-11 text-sm outline-none transition-colors",
                "placeholder:text-[#a1a1aa] focus:border-[#1a1a2e] focus:ring-2 focus:ring-[#1a1a2e]/10",
                errors.password
                  ? "border-red-400 focus:border-red-400 focus:ring-red-100"
                  : "border-[#e4e4e7]"
              )}
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#a1a1aa] hover:text-[#71717a] transition-colors"
              tabIndex={-1}
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>

          {/* Live rules — shown once the user starts typing */}
          {passwordValue && (
            <div className="flex flex-wrap gap-x-4 gap-y-1 pt-1">
              <Rule met={rules.length} label="8+ characters"     />
              <Rule met={rules.upper}  label="Uppercase letter"  />
              <Rule met={rules.number} label="Number"            />
            </div>
          )}
          {errors.password && (
            <p className="text-xs text-red-500">{errors.password.message}</p>
          )}
        </div>

        {/* Confirm password */}
        <div className="space-y-1.5">
          <label htmlFor="confirmPassword" className="block text-sm font-medium text-[#18181b]">
            Confirm password
          </label>
          <div className="relative">
            <input
              id="confirmPassword"
              type={showConfirm ? "text" : "password"}
              autoComplete="new-password"
              placeholder="••••••••"
              {...register("confirmPassword")}
              className={cn(
                "w-full border bg-white px-4 py-2.5 pr-11 text-sm outline-none transition-colors",
                "placeholder:text-[#a1a1aa] focus:border-[#1a1a2e] focus:ring-2 focus:ring-[#1a1a2e]/10",
                errors.confirmPassword
                  ? "border-red-400 focus:border-red-400 focus:ring-red-100"
                  : "border-[#e4e4e7]"
              )}
            />
            <button
              type="button"
              onClick={() => setShowConfirm((v) => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#a1a1aa] hover:text-[#71717a] transition-colors"
              tabIndex={-1}
            >
              {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          {errors.confirmPassword && (
            <p className="text-xs text-red-500">{errors.confirmPassword.message}</p>
          )}
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full flex items-center justify-center gap-2 bg-[#1a1a2e] hover:bg-primary disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold text-sm py-3 transition-colors"
        >
          {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
          {isSubmitting ? "Creating account…" : "Create account"}
        </button>
      </form>
    </div>
  )
}