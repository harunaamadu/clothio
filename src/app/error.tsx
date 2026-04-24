"use client"

import { useEffect } from "react"
import Link from "next/link"
import { AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error("[GlobalError]", error)
  }, [error])

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-6 px-6 text-center bg-white">
      <div className="w-16 h-16 rounded-2xl bg-red-50 flex items-center justify-center">
        <AlertTriangle className="w-7 h-7 text-red-500" />
      </div>

      <div className="space-y-1">
        <h1 className="font-display text-2xl font-bold text-[#1a1a2e]">
          Something went wrong
        </h1>
        <p className="text-sm text-[#71717a] max-w-sm">
          An unexpected error occurred. Try refreshing the page or go back home.
        </p>
        {error.digest && (
          <p className="text-xs text-[#a1a1aa] font-mono mt-2">
            Error ID: {error.digest}
          </p>
        )}
      </div>

      <div className="flex gap-3">
        <Button
          onClick={reset}
          size="lg"
        >
          Try again
        </Button>
        <Link
          href="/"
          className="hover:underline hover:text-primary font-semibold text-sm px-6 py-3 rounded-full transition-colors"
        >
          Go Home
        </Link>
      </div>
    </div>
  )
}