"use client";

import { useEffect, useRef, useCallback, useState } from "react";
import Link from "next/link";
import gsap from "gsap";
import { cn } from "@/lib/utils";
import { navLinks } from "@/lib/constants";
import { X } from "lucide-react";

// ─── Types ──────────────────────────────────────────────────────────────────
interface MegaMenuProps {
  open: boolean;
  onClose: () => void;
}

// ─── SVG Background ─────────────────────────────────────────────────────────
function MegaMenuBackground() {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current) return;
    const orbs = svgRef.current.querySelectorAll(".mm-orb");
    gsap.to(orbs, {
      opacity: 0.55,
      scale: 1.15,
      duration: 4,
      ease: "sine.inOut",
      stagger: { each: 1.2, repeat: -1, yoyo: true, from: "random" },
    });
    return () => gsap.killTweensOf(orbs);
  }, []);

  return (
    <svg
      ref={svgRef}
      className="pointer-events-none absolute inset-0 w-full h-full"
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="xMidYMid slice"
    >
      <defs>
        <radialGradient id="mmOrb1" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.07" />
          <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="mmOrb2" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.05" />
          <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0" />
        </radialGradient>
        {/* Noise-like dot pattern */}
        <pattern id="mmDots" x="0" y="0" width="24" height="24" patternUnits="userSpaceOnUse">
          <circle cx="1.5" cy="1.5" r="1" fill="hsl(var(--foreground))" opacity="0.035" />
        </pattern>
      </defs>

      {/* Dot field */}
      <rect width="100%" height="100%" fill="url(#mmDots)" />

      {/* Floating orbs */}
      <ellipse className="mm-orb" cx="12%" cy="60%" rx="260" ry="180" fill="url(#mmOrb1)" opacity="0.4" />
      <ellipse className="mm-orb" cx="88%" cy="40%" rx="300" ry="200" fill="url(#mmOrb2)" opacity="0.3" />
      <ellipse className="mm-orb" cx="50%" cy="90%" rx="400" ry="120" fill="url(#mmOrb1)" opacity="0.25" />

      {/* Horizontal rule lines */}
      {[20, 50, 80].map((y, i) => (
        <line
          key={i}
          x1="0" y1={`${y}%`} x2="100%" y2={`${y}%`}
          stroke="hsl(var(--border))"
          strokeOpacity="0.4"
          strokeWidth="1"
          strokeDasharray="6 32"
        />
      ))}
    </svg>
  );
}

// ─── Category Column ─────────────────────────────────────────────────────────
interface CategoryColumnProps {
  link: { label: string; href: string; children?: { label: string; href: string }[] };
  index: number;
  onClose: () => void;
}

function CategoryColumn({ link, index, onClose }: CategoryColumnProps) {
  const colRef = useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = useState<string | null>(null);

  return (
    <div ref={colRef} className="flex flex-col gap-3">
      {/* Category heading */}
      <div className="flex items-center gap-2">
        <span className="text-[10px] font-bold tracking-widest uppercase text-primary/60 select-none">
          0{index + 1}
        </span>
        <div className="h-px flex-1 bg-border/50" />
      </div>

      <Link
        href={link.href}
        onClick={onClose}
        className="group flex items-center justify-between"
      >
        <h3 className="text-base font-semibold text-foreground group-hover:text-primary transition-colors duration-150">
          {link.label}
        </h3>
        <span className="text-xs text-muted-foreground opacity-0 group-hover:opacity-100 duration-150 -translate-x-1 group-hover:translate-x-0 transition-transform">
          All →
        </span>
      </Link>

      {/* Divider */}
      <div className="h-px bg-border/40" />

      {/* Child links */}
      <ul className="flex flex-col gap-0.5">
        {link.children?.map((child) => (
          <li key={child.label}>
            <Link
              href={child.href}
              onClick={onClose}
              onMouseEnter={() => setHovered(child.label)}
              onMouseLeave={() => setHovered(null)}
              className={cn(
                "flex items-center gap-2.5 px-2 py-1.5 rounded-lg text-sm transition-all duration-150",
                hovered === child.label
                  ? "text-foreground bg-muted/60 dark:bg-muted/30 translate-x-1"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <span
                className={cn(
                  "h-1 w-1 rounded-full shrink-0 transition-colors duration-150",
                  hovered === child.label ? "bg-primary" : "bg-muted-foreground/30"
                )}
              />
              {child.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

// ─── Main MegaMenu ───────────────────────────────────────────────────────────
export function MegaMenu({ open, onClose }: MegaMenuProps) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const columnsRef = useRef<HTMLDivElement>(null);
  const mounted = useRef(false);

  const megaMenuLinks = navLinks.filter(
    (link) => link.children && link.children.length > 0
  );

  // Animate open
  const animateOpen = useCallback(() => {
    const overlay = overlayRef.current;
    const panel = panelRef.current;
    const columns = columnsRef.current?.children;
    if (!overlay || !panel) return;

    gsap.killTweensOf([overlay, panel]);

    gsap.fromTo(overlay, { opacity: 0 }, { opacity: 1, duration: 0.2, ease: "power2.out" });
    gsap.fromTo(
      panel,
      { opacity: 0, y: -16 },
      { opacity: 1, y: 0, duration: 0.3, ease: "power3.out" }
    );

    if (columns?.length) {
      gsap.fromTo(
        columns,
        { opacity: 0, y: -10 },
        {
          opacity: 1,
          y: 0,
          duration: 0.3,
          ease: "power2.out",
          stagger: 0.07,
          delay: 0.1,
          clearProps: "transform,opacity",
        }
      );
    }
  }, []);

  // Animate close
  const animateClose = useCallback((then?: () => void) => {
    const overlay = overlayRef.current;
    const panel = panelRef.current;
    if (!overlay || !panel) return then?.();

    const tl = gsap.timeline({ onComplete: then });
    tl.to(panel, { opacity: 0, y: -10, duration: 0.18, ease: "power2.in" });
    tl.to(overlay, { opacity: 0, duration: 0.15, ease: "power2.in" }, "<0.04");
  }, []);

  useEffect(() => {
    if (!mounted.current) { mounted.current = true; return; }
    if (open) animateOpen();
  }, [open, animateOpen]);

  // Escape key
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [onClose]);

  // Lock body scroll when open
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  if (!open) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        ref={overlayRef}
        onClick={onClose}
        style={{ opacity: 0 }}
        className="absolute top-0 inset-x-0 w-full min-h-screen z-0 bg-background/30 backdrop-blur-sm hover:cursor-pointer"
        aria-hidden="true"
      />

      {/* Panel */}
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label="Shop categories"
        style={{ opacity: 0 }}
        className={cn(
          "sticky top-0 left-0 right-0 z-50",
          "bg-background/95 backdrop-blur-md",
          "border-b border-border/60 shadow-xl shadow-black/10 dark:shadow-black/40"
        )}
      >
        <MegaMenuBackground />

        <div className="layout relative z-10">
          {/* Top bar: title + close */}
          <div className="flex items-center justify-between py-5 border-b border-border/40">
            <div className="flex items-center gap-3">
              <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
              <p className="text-xs font-semibold tracking-widest uppercase text-muted-foreground">
                Shop by Category
              </p>
            </div>

            <button
              onClick={onClose}
              className={cn(
                "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs text-muted-foreground",
                "hover:text-foreground hover:bg-muted/60 transition-colors duration-150",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
              )}
            >
              <X size={13} strokeWidth={2} />
              <span>Close</span>
              <kbd className="ml-0.5 px-1.5 py-0.5 rounded text-[10px] bg-muted border border-border/60 font-mono">
                Esc
              </kbd>
            </button>
          </div>

          {/* Grid */}
          {megaMenuLinks.length > 0 ? (
            <div
              ref={columnsRef}
              className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8 py-10"
            >
              {megaMenuLinks.map((link, i) => (
                <CategoryColumn
                  key={link.label}
                  link={link}
                  index={i}
                  onClose={onClose}
                />
              ))}
            </div>
          ) : (
            <p className="py-16 text-center text-sm text-muted-foreground">
              No categories available.
            </p>
          )}

          {/* Bottom gradient accent */}
          <div className="h-px w-full bg-linear-to-r from-transparent via-primary/25 to-transparent" />
        </div>
      </div>
    </>
  );
}