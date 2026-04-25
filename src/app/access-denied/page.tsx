import Link from "next/link";
import type { Metadata } from "next";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  LockIcon,
  ArrowLeft01Icon,
  Home01Icon,
} from "@hugeicons/core-free-icons";

export const metadata: Metadata = {
  title: "Access Denied",
  robots: { index: false, follow: false },
};

export default function AccessDeniedPage() {
  return (
    <div className="min-h-screen bg-[#0f0f0f] flex items-center justify-center px-6">
      {/* Background grid */}
      <div
        className="pointer-events-none fixed inset-0 opacity-[0.04]"
        style={{
          backgroundImage: `linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)`,
          backgroundSize: "60px 60px",
        }}
      />

      {/* Glow */}
      <div className="pointer-events-none fixed inset-0 flex items-center justify-center">
        <div className="w-125 aspect-square h-125 rounded-full bg-[#e94560]/10 blur-[120px]" />
      </div>

      <div className="relative z-10 max-w-md w-full text-center space-y-8">
        {/* Icon */}
        <div className="flex justify-center">
          <div className="relative">
            <div className="w-24 h-24 border border-[#e94560]/30 bg-[#e94560]/5 flex items-center justify-center">
              <HugeiconsIcon
                icon={LockIcon}
                size={40}
                color="#e94560"
                strokeWidth={1.5}
              />
            </div>
            {/* Corner accents */}
            <span className="absolute -top-px -left-px w-3 h-3 border-t border-l border-[#e94560]" />
            <span className="absolute -top-px -right-px w-3 h-3 border-t border-r border-[#e94560]" />
            <span className="absolute -bottom-px -left-px w-3 h-3 border-b border-l border-[#e94560]" />
            <span className="absolute -bottom-px -right-px w-3 h-3 border-b border-r border-[#e94560]" />
          </div>
        </div>

        {/* Text */}
        <div className="space-y-3">
          <p className="text-[#e94560] text-xs font-bold uppercase tracking-[0.3em]">
            Error 403
          </p>
          <h1 className="text-white font-heading text-4xl md:text-5xl font-bold leading-tight">
            Access Denied
          </h1>
          <p className="text-[#71717a] text-sm leading-relaxed max-w-sm mx-auto">
            You don't have permission to view this page. This area is
            restricted to administrators only.
          </p>
        </div>

        {/* Divider */}
        <div className="flex items-center gap-4">
          <span className="flex-1 h-px bg-[#1a1a1a]" />
          <span className="text-[#3f3f46] text-xs font-mono">restricted</span>
          <span className="flex-1 h-px bg-[#1a1a1a]" />
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/"
            className="flex items-center justify-center gap-2 px-6 py-3 bg-[#e94560] text-white text-sm font-semibold hover:bg-[#d63652] transition-colors"
          >
            <HugeiconsIcon icon={Home01Icon} size={15} color="currentColor" strokeWidth={2} />
            Go Home
          </Link>
          <Link
            href="/dashboard"
            className="flex items-center justify-center gap-2 px-6 py-3 border border-[#2a2a2a] text-[#a1a1aa] text-sm font-semibold hover:border-[#3f3f46] hover:text-white transition-colors"
          >
            <HugeiconsIcon icon={ArrowLeft01Icon} size={15} color="currentColor" strokeWidth={2} />
            My Dashboard
          </Link>
        </div>

        {/* Footer note */}
        <p className="text-[#3f3f46] text-xs">
          If you believe this is a mistake, contact your administrator.
        </p>
      </div>
    </div>
  );
}