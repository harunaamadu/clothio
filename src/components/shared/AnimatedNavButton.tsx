"use client";

import { useRef, useCallback } from "react";
import gsap from "gsap";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface AnimatedNavButtonProps {
  label: string;
  isOpen?: boolean;
  onClick?: () => void;
  className?: string;
}

export function AnimatedNavButton({
  label,
  isOpen,
  onClick,
  className,
}: AnimatedNavButtonProps) {
  const containerRef = useRef<HTMLButtonElement>(null);
  const chevronRef = useRef<SVGSVGElement>(null);
  const bgRef = useRef<HTMLSpanElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);

  const handleEnter = useCallback(() => {
    const bg = bgRef.current;
    const lbl = labelRef.current;
    if (!bg || !lbl) return;

    gsap.to(bg, { opacity: 1, scaleX: 1, duration: 0.25, ease: "power2.out" });
    gsap.to(lbl, { y: -1, duration: 0.2, ease: "power2.out" });
  }, []);

  const handleLeave = useCallback(() => {
    const bg = bgRef.current;
    const lbl = labelRef.current;
    if (!bg || !lbl || isOpen) return;

    gsap.to(bg, { opacity: 0, scaleX: 0.92, duration: 0.2, ease: "power2.in" });
    gsap.to(lbl, { y: 0, duration: 0.18, ease: "power2.in" });
  }, [isOpen]);

  // Rotate chevron when open state changes
  // (caller controls isOpen and passes it)
  const chevronRotation = isOpen ? -180 : 0;

  return (
    <button
      ref={containerRef}
      onClick={onClick}
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
      className={cn(
        "relative flex items-center gap-1 px-3 py-2 text-sm font-medium rounded-md",
        "text-foreground/80 hover:text-foreground transition-colors",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40",
        className
      )}
    >
      {/* Bg fill */}
      <span
        ref={bgRef}
        className="pointer-events-none absolute inset-0 rounded-md bg-primary/5 dark:bg-primary/10 opacity-0"
        style={{ transform: `scaleX(${0.92})`, transformOrigin: "center" }}
      />

      <span ref={labelRef} className="relative z-10 block will-change-transform">
        {label}
      </span>

      <ChevronDown
        ref={chevronRef}
        className="relative z-10 h-3.5 w-3.5 text-foreground/50 transition-transform duration-300 ease-out"
        style={{ transform: `rotate(${chevronRotation}deg)` }}
      />
    </button>
  );
}