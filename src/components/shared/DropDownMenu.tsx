"use client";

import { useRef, useState, useCallback, useEffect } from "react";
import Link from "next/link";
import gsap from "gsap";
import { cn } from "@/lib/utils";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowDown01Icon } from "@hugeicons/core-free-icons";

type NavChild = {
  label: string;
  href: string;
};

type Props = {
  label: string;
  href: string;
  childrenLinks: NavChild[];
  isActive: boolean;
};

export function DropDownMenu({ label, href, childrenLinks, isActive }: Props) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const chevronRef = useRef<HTMLSpanElement>(null);
  const triggerBarRef = useRef<HTMLSpanElement>(null);
  const itemsRef = useRef<HTMLDivElement>(null);
  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const openPanel = useCallback(() => {
    if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
    setOpen(true);
  }, []);

  const closePanel = useCallback(() => {
    // Small delay so mouse moving into panel doesn't flicker
    closeTimerRef.current = setTimeout(() => setOpen(false), 80);
  }, []);

  const cancelClose = useCallback(() => {
    if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
  }, []);

  // Animate panel in/out
  useEffect(() => {
    const panel = panelRef.current;
    const items = itemsRef.current?.children;
    const chevron = chevronRef.current;
    const bar = triggerBarRef.current;
    if (!panel) return;

    if (open) {
      // Reveal panel
      gsap.killTweensOf(panel);
      gsap.fromTo(
        panel,
        { opacity: 0, y: 8, scale: 0.97, pointerEvents: "none" },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          pointerEvents: "auto",
          duration: 0.22,
          ease: "power3.out",
        }
      );

      // Stagger items in
      if (items?.length) {
        gsap.fromTo(
          items,
          { opacity: 0, y: 6 },
          {
            opacity: 1,
            y: 0,
            duration: 0.2,
            ease: "power2.out",
            stagger: 0.04,
            delay: 0.05,
            clearProps: "transform",
          }
        );
      }

      // Rotate chevron
      gsap.to(chevron, { rotate: -180, duration: 0.25, ease: "power2.out" });

      // Extend trigger bar
      gsap.to(bar, {
        scaleX: 1,
        transformOrigin: "left center",
        duration: 0.25,
        ease: "power3.out",
      });
    } else {
      gsap.killTweensOf(panel);
      gsap.to(panel, {
        opacity: 0,
        y: 6,
        scale: 0.97,
        pointerEvents: "none",
        duration: 0.16,
        ease: "power2.in",
      });

      gsap.to(chevron, { rotate: 0, duration: 0.2, ease: "power2.in" });

      if (!isActive) {
        gsap.to(bar, {
          scaleX: 0,
          transformOrigin: "right center",
          duration: 0.2,
          ease: "power2.in",
        });
      }
    }
  }, [open, isActive]);

  // Click outside to close
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Escape key
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative"
      onMouseEnter={openPanel}
      onMouseLeave={closePanel}
    >
      {/* Trigger button */}
      <button
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-haspopup="true"
        className={cn(
          "group relative flex items-center gap-1.5 px-3 py-2 rounded-md",
          "text-sm font-medium transition-colors duration-150",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40",
          open || isActive
            ? "text-foreground"
            : "text-foreground/75 hover:text-foreground"
        )}
      >
        {/* Hover bg */}
        <span
          className={cn(
            "absolute inset-0 rounded-md bg-primary/5 dark:bg-primary/10 transition-opacity duration-150",
            open ? "opacity-100" : "opacity-0 group-hover:opacity-100"
          )}
        />

        <span className="relative z-10">{label}</span>

        <span ref={chevronRef} className="relative z-10 flex items-center will-change-transform">
          <HugeiconsIcon
            icon={ArrowDown01Icon}
            size={14}
            color="currentColor"
            strokeWidth={2}
            className="opacity-60"
          />
        </span>

        <span
          ref={triggerBarRef}
          style={{ transform: `scaleX(${isActive ? 1 : 0})`, transformOrigin: "left center" }}
          className="absolute bottom-0.5 left-3 right-3 h-0.5 rounded-full bg-primary will-change-transform"
        />
      </button>

      {/* Dropdown panel */}
      <div
        ref={panelRef}
        onMouseEnter={cancelClose}
        onMouseLeave={closePanel}
        style={{ opacity: 0, pointerEvents: "none" }}
        className={cn(
          "absolute top-[calc(100%+6px)] left-0 z-50",
          "min-w-52 overflow-hidden",
          "bg-background/95 backdrop-blur-md",
          "border border-border/60 shadow-lg shadow-black/8",
          "dark:shadow-black/30"
        )}
      >
        {/* Inner scroll wrapper */}
        <div ref={itemsRef} className="flex flex-col py-1.5">
          {/* "All X" header link */}
          <Link
            href={href}
            onClick={() => setOpen(false)}
            className={cn(
              "group flex items-center justify-between mx-1.5 mb-0.5 px-3 py-2.5 rounded-lg",
              "text-sm font-semibold text-foreground",
              "hover:bg-primary/8 dark:hover:bg-primary/12 transition-colors duration-150"
            )}
          >
            <span>All {label}</span>
            <span className="text-[10px] font-normal text-muted-foreground tracking-wide uppercase opacity-0 group-hover:opacity-100 transition-opacity duration-150">
              View all →
            </span>
          </Link>

          {/* Divider */}
          <div className="mx-3 my-1 h-px bg-border/50" />

          {/* Child links */}
          {childrenLinks.map((child) => (
            <Link
              key={child.label}
              href={child.href}
              onClick={() => setOpen(false)}
              className={cn(
                "flex items-center mx-1.5 px-3 py-2",
                "text-sm text-foreground/80 hover:text-foreground",
                "hover:bg-muted/70 dark:hover:bg-muted/40 transition-colors duration-150",
                "group"
              )}
            >
              {/* Dot accent */}
              <span className="mr-2.5 h-1 w-1 rounded-full bg-muted-foreground/30 group-hover:bg-primary/60 transition-colors duration-150 shrink-0" />
              {child.label}
            </Link>
          ))}
        </div>

        {/* Bottom glow accent */}
        <div className="h-px w-full bg-linear-to-r from-transparent via-primary/20 to-transparent" />
      </div>
    </div>
  );
}