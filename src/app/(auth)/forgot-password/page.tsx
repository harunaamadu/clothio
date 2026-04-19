import type { Metadata } from "next"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { ForgotPasswordForm } from "@/components/auth/ForgotPasswordForm"

export const metadata: Metadata = { title: "Reset Password" }

export default function ForgotPasswordPage() {
  return (
    <div className="space-y-7">
      {/* Back link */}
      <Link
        href="/login"
        className="inline-flex items-center gap-1.5 text-sm text-[#71717a] hover:text-[#1a1a2e] transition-colors group"
      >
        <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
        Back to sign in
      </Link>

      {/* Heading */}
      <div className="space-y-1.5">
        <h1 className="font-display text-3xl font-bold text-[#1a1a2e]">
          Forgot your password?
        </h1>
        <p className="text-[#71717a] text-sm leading-relaxed">
          No worries. Enter your email address and we'll send you a link to
          reset your password.
        </p>
      </div>

      {/* Form — handles both the input and the confirmation state internally */}
      <ForgotPasswordForm />

      {/* Footer nudge */}
      <p className="text-center text-sm text-[#71717a]">
        Remembered it?{" "}
        <Link
          href="/login"
          className="font-medium text-[#e94560] hover:underline underline-offset-4"
        >
          Sign in
        </Link>
      </p>
    </div>
  )
}