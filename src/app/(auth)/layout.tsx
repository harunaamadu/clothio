import { Metadata } from "next";
import Link from "next/link";
import React from "react";

const metadata: Metadata = {
  title: `Authentication | ${process.env.WEBSITE_NAME}`,
  description:
    "Sign in to your account or create a new one to access exclusive features and offers.",
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="layout h-full min-h-screen grid lg:grid-cols-2">
      {/* ── Left brand panel (desktop only) ── */}
      <div className="hidden lg:flex flex-col justify-between bg-[#1a1a2e] text-stone-50 p-12 relative overflow-hidden">
        {/* Decorative circles */}
        <div className="absolute inset-0 bg-[url('/assets/auth/auth-bg.jpg')] bg-cover bg-center opacity-20 brightness-50 z-0 pointer-events-none" />
        <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-[#e94560]/10 pointer-events-none" />
        <div className="absolute -bottom-32 -right-16 w-80 h-80 rounded-full bg-[#e94560]/8 pointer-events-none" />
        <div className="absolute top-1/2 -translate-y-1/2 right-0 w-48 h-96 rounded-full bg-background/3 pointer-events-none" />

        <div className="relative z-10 space-y-6">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <span className="font-heading text-2xl font-bold tracking-tight">
              Cloth<span className="text-primary">io</span>
            </span>
          </Link>

          <span className="text-xs tracking-[0.4em] uppercase block text-stone-400">
            {process.env.WEBSITE_NAME} — Est. 2025
          </span>
        </div>

        {/* Quote block */}
        <div className="relative z-10 space-y-6">
          <blockquote className="font-heading text-3xl font-semibold text-white leading-snug">
            "Style is a way to say who you are without having to speak."
          </blockquote>
          <p className="text-stone-300 text-sm">— Rachel Zoe</p>

          {/* Mini trust signals */}
          <div className="flex flex-wrap gap-3 pt-4">
            {["50k+ customers", "Free returns", "Secure checkout"].map((t) => (
              <span
                key={t}
                className="text-xs font-medium text-stone-300 border border-stone-200/30 px-3 py-2"
              >
                {t}
              </span>
            ))}
          </div>
        </div>

        {/* Bottom link */}
        <p className="relative z-10 text-stone-300 text-xs">
          © {new Date().getFullYear()} {process.env.WEBSITE_NAME}. All rights
          reserved.
        </p>
      </div>

      {/* ── Right form panel ── */}
      <div className="flex flex-col min-h-screen bg-background">
        {/* Mobile logo */}
        <div className="lg:hidden px-6 pt-8 pb-2">
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <span className="font-heading text-2xl font-bold tracking-tight">
              Cloth<span className="text-primary">io</span>
            </span>
          </Link>
        </div>

        {/* Centred form area */}
        <div className="flex-1 flex items-center justify-center px-6 py-10">
          <div className="w-full max-w-md">{children}</div>
        </div>

        <p className="text-center text-[#a1a1aa] text-xs pb-6">
          Protected by SSL encryption
        </p>
      </div>
    </div>
  );
}
