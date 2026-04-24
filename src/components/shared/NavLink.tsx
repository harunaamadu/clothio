"use client";

import { useRef, useCallback } from "react";
import Link from "next/link";
import gsap from "gsap";
import { cn } from "@/lib/utils";

interface NavLinkProps {
  href: string;
  label: string;
  isActive?: boolean;
  isSale?: boolean;
}

export function NavLink({ href, label, isActive, isSale }: NavLinkProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLSpanElement>(null);
  const glowRef = useRef<HTMLSpanElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);

  const handleEnter = useCallback(() => {
    const bar = barRef.current;
    const glow = glowRef.current;
    const lbl = labelRef.current;
    if (!bar || !glow || !lbl) return;

    const tl = gsap.timeline();

    // Bar shoots in from left
    tl.fromTo(
      bar,
      { scaleX: 0, transformOrigin: "left center" },
      { scaleX: 1, duration: 0.28, ease: "power3.out" }
    );

    // Glow fades in slightly delayed
    tl.to(glow, { opacity: 1, duration: 0.2, ease: "power2.out" }, "<0.06");

    // Label lifts subtly
    tl.to(lbl, { y: -1, duration: 0.22, ease: "power2.out" }, "<");
  }, []);

  const handleLeave = useCallback(() => {
    const bar = barRef.current;
    const glow = glowRef.current;
    const lbl = labelRef.current;
    if (!bar || !glow || !lbl) return;

    if (isActive) return; // keep bar visible on active

    const tl = gsap.timeline();
    tl.to(bar, { scaleX: 0, transformOrigin: "right center", duration: 0.22, ease: "power2.in" });
    tl.to(glow, { opacity: 0, duration: 0.18, ease: "power2.in" }, "<");
    tl.to(lbl, { y: 0, duration: 0.18, ease: "power2.in" }, "<");
  }, [isActive]);

  return (
    <div
      ref={containerRef}
      className="relative"
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
    >
      {/* Glow bg */}
      <span
        ref={glowRef}
        className={cn(
          "pointer-events-none absolute inset-0 rounded-md opacity-0",
          isSale
            ? "bg-rose-50 dark:bg-rose-950/30"
            : "bg-primary/5 dark:bg-primary/10"
        )}
      />

      <Link
        href={href}
        className={cn(
          "relative z-10 flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors",
          isSale
            ? "text-rose-600 dark:text-rose-400"
            : isActive
            ? "text-primary"
            : "text-foreground/80 hover:text-foreground"
        )}
      >
        <span ref={labelRef} className="block will-change-transform">
          {label}
        </span>
      </Link>

      {/* Animated underbar */}
      <span
        ref={barRef}
        style={{ transform: `scaleX(${isActive ? 1 : 0})`, transformOrigin: "left center" }}
        className={cn(
          "absolute bottom-0.5 left-3 right-3 h-0.5 rounded-full will-change-transform",
          isSale ? "bg-rose-500" : "bg-primary"
        )}
      />
    </div>
  );
}