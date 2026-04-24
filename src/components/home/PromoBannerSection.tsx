"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Clock, Zap } from "lucide-react";
import { getImageUrl } from "@/lib/sanity/client";
import { formatPrice } from "@/lib/formatters";
import { cn } from "@/lib/utils";
import type { PromoBanner } from "@/types";
import Reveal from "../animations/reveal";

// ─── Static fallback data ─────────────────────────────────────────────────────
// Shown when Sanity returns no active promo banners.
// Admins replace these by creating promoBanner documents in the Studio.

const FALLBACK_BANNERS: PromoBanner[] = [
  {
    _id: "fallback-1",
    label: "Flash Sale",
    headline: "Up to 40% Off\nWinter Collection",
    subheadline: "Premium outerwear at unbeatable prices — this weekend only.",
    ctaText: "Shop Now",
    ctaLink: "/products?sale=true",
    image: { _type: "image", asset: { _ref: "", _type: "reference" } },
    accentColor: "#e94560",
    bgFrom: "#1a1a2e",
    bgTo: "#2d1f3d",
    timerEnabled: true,
    // 47h 33m from page load so the fallback timer always has time left
    expiresAt: new Date(
      Date.now() + 1000 * 60 * 60 * 47 + 1000 * 60 * 33,
    ).toISOString(),
    expiredLabel: "Sale Ended",
    isActive: true,
    order: 0,
  },
  {
    _id: "fallback-2",
    label: "New Collection",
    headline: "Spring / Summer\n2025 Arrivals",
    subheadline: "Fresh styles just dropped. Be the first to wear the season.",
    ctaText: "Explore Now",
    ctaLink: "/products?new=true",
    image: { _type: "image", asset: { _ref: "", _type: "reference" } },
    accentColor: "#f5a623",
    bgFrom: "#0f2027",
    bgTo: "#2c5364",
    timerEnabled: false,
    discountBadge: "NEW IN",
    isActive: true,
    order: 1,
  },
];

// ─── Countdown timer hook ─────────────────────────────────────────────────────

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  expired: boolean;
}

function useCountdown(expiresAt?: string): TimeLeft {
  const calc = useCallback((): TimeLeft => {
    if (!expiresAt)
      return { days: 0, hours: 0, minutes: 0, seconds: 0, expired: true };
    const diff = new Date(expiresAt).getTime() - Date.now();
    if (diff <= 0)
      return { days: 0, hours: 0, minutes: 0, seconds: 0, expired: true };
    return {
      days: Math.floor(diff / 86_400_000),
      hours: Math.floor((diff % 86_400_000) / 3_600_000),
      minutes: Math.floor((diff % 3_600_000) / 60_000),
      seconds: Math.floor((diff % 60_000) / 1_000),
      expired: false,
    };
  }, [expiresAt]);

  const [timeLeft, setTimeLeft] = useState<TimeLeft>(calc);

  useEffect(() => {
    setTimeLeft(calc());
    const id = setInterval(() => setTimeLeft(calc()), 1_000);
    return () => clearInterval(id);
  }, [calc]);

  return timeLeft;
}

// ─── Flip-digit timer unit ────────────────────────────────────────────────────

function TimerUnit({ value, label }: { value: number; label: string }) {
  const display = String(value).padStart(2, "0");
  return (
    <div className="flex flex-col items-center gap-1.5">
      <div
        className="relative w-12 h-13 sm:w-14 sm:h-15 flex items-center justify-center bg-white/10 border border-white/10 overflow-hidden"
        style={{ height: "52px" }}
      >
        {/* Visual fold line — pure CSS, no animation library */}
        <div className="absolute inset-x-0 top-1/2 h-px bg-black/25 z-10" />
        <div className="absolute inset-0 bg-linear-to-b from-white/5 to-transparent" />
        <span className="font-display text-xl sm:text-2xl font-bold text-white tabular-nums z-20 relative">
          {display}
        </span>
      </div>
      <span className="text-[9px] font-bold uppercase tracking-widest text-white/45 leading-none">
        {label}
      </span>
    </div>
  );
}

// ─── Separator colon ──────────────────────────────────────────────────────────

function Colon() {
  return (
    <div className="flex flex-col gap-1.5 pb-5 opacity-40">
      <span className="w-1.5 h-1.5 bg-white block animate-pulse" />
      <span className="w-1.5 h-1.5 bg-white block animate-pulse" />
    </div>
  );
}

// ─── Single slide ─────────────────────────────────────────────────────────────

function BannerSlide({
  banner,
  active,
}: {
  banner: PromoBanner;
  active: boolean;
}) {
  const timeLeft = useCountdown(
    banner.timerEnabled ? banner.expiresAt : undefined,
  );

  const imageUrl = banner.image?.asset?._ref
    ? getImageUrl(banner.image, 900, 900)
    : null;

  const accent = banner.accentColor ?? "#e94560";
  const bgFrom = banner.bgFrom ?? "#1a1a2e";
  const bgTo = banner.bgTo ?? "#2d2d4e";

  return (
    <div
      aria-hidden={!active}
      className={cn(
        "absolute inset-0 flex items-center w-full transition-all duration-700 ease-in-out",
        active
          ? "opacity-100 translate-x-0 pointer-events-auto"
          : "opacity-0 translate-x-8 pointer-events-none",
      )}
      style={{
        background: `linear-gradient(135deg, ${bgFrom} 0%, ${bgTo} 100%)`,
      }}
    >
      {/* Decorative blobs */}
      <div
        className="absolute -top-20 -right-20 w-96 h-96 rounded-full opacity-10 pointer-events-none blur-3xl"
        style={{ backgroundColor: accent }}
      />
      <div
        className="absolute -bottom-16 left-[20%] w-72 h-72 rounded-full opacity-8 pointer-events-none blur-2xl"
        style={{ backgroundColor: accent }}
      />

      <div className="relative z-10 h-full w-full flex items-center p-6 lg:p-8">
        <div className="grid lg:grid-cols-2 gap-4 lg:gap-12 items-center w-full py-12 lg:py-16">
          {/* ── Left: copy ── */}
          <div className="space-y-5 text-center lg:text-left order-2 lg:order-1">
            {/* Label badge */}
            <span
              className="absolute top-6 right-6 inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest px-3.5 py-1.5"
              style={{ backgroundColor: `${accent}22`, color: accent }}
            >
              <Zap className="w-3 h-3" />
              {banner.label}
            </span>

            {/* Headline — supports \n line breaks from Sanity */}
            <h2 className="font-display text-xl sm:text-3xl lg:text-4xl font-bold text-white leading-tight whitespace-pre-line">
              {banner.headline}
            </h2>

            {/* Discount pill */}
            {banner.discountBadge && (
              <div>
                <span
                  className="inline-block font-extrabold text-[11px] tracking-wide px-4 py-1.5 text-white"
                  style={{ backgroundColor: accent }}
                >
                  {banner.discountBadge}
                </span>
              </div>
            )}

            {/* Subheadline */}
            {banner.subheadline && (
              <p className="text-white/60 text-sm sm:text-base leading-relaxed max-w-sm mx-auto lg:mx-0">
                {banner.subheadline}
              </p>
            )}

            {/* ── Countdown timer ── */}
            {banner.timerEnabled && (
              <div className="pt-1">
                {timeLeft.expired ? (
                  /* Expired state */
                  <div className="inline-flex items-center gap-2 text-sm font-semibold text-white/40 border border-white/10 px-4 py-2">
                    <Clock className="w-4 h-4" />
                    {banner.expiredLabel ?? "Offer Ended"}
                  </div>
                ) : (
                  /* Live countdown */
                  <div className="space-y-2.5">
                    <div className="flex items-center gap-1.5 justify-center lg:justify-start">
                      <Clock className="w-3.5 h-3.5 text-white/40" />
                      <span className="text-[10px] font-bold uppercase tracking-widest text-white/40">
                        Offer ends in
                      </span>
                    </div>
                    <div className="flex items-end gap-2 justify-center lg:justify-start">
                      {timeLeft.days > 0 && (
                        <>
                          <TimerUnit value={timeLeft.days} label="Days" />
                          <Colon />
                        </>
                      )}
                      <TimerUnit value={timeLeft.hours} label="Hrs" />
                      <Colon />
                      <TimerUnit value={timeLeft.minutes} label="Min" />
                      <Colon />
                      <TimerUnit value={timeLeft.seconds} label="Sec" />
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* CTA button */}
            {banner.ctaLink && (
              <div className="pt-2">
                <Link
                  href={banner.ctaLink}
                  className="inline-flex items-center gap-2.5 font-bold text-sm px-7 py-3.5 text-white transition-all duration-200 hover:scale-105 hover:shadow-xl active:scale-100"
                  style={{ backgroundColor: accent }}
                >
                  {banner.ctaText ?? "Shop Now"}
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2.5}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
                    />
                  </svg>
                </Link>
              </div>
            )}
          </div>

          {/* ── Right: product image ── */}
          <div className="relative flex items-center justify-center order-1 lg:order-2">
            <div className="relative w-36 h-36 sm:w-72 sm:h-72 lg:w-full lg:h-90">
              {imageUrl ? (
                <Image
                  src={imageUrl}
                  alt={banner.image?.asset?.alt ?? banner.headline}
                  fill
                  priority
                  sizes="(max-width: 1024px) 288px, 45vw"
                  className="object-contain drop-shadow-2xl"
                />
              ) : (
                /* Placeholder silhouette when no Sanity image */
                <div className="w-full h-full flex items-center justify-center opacity-10">
                  <svg
                    viewBox="0 0 200 200"
                    className="w-48 h-48 text-white fill-current"
                  >
                    <path d="M100 20C55.8 20 20 55.8 20 100s35.8 80 80 80 80-35.8 80-80S144.2 20 100 20zm0 20c16.5 0 30 13.5 30 30S116.5 100 100 100s-30-13.5-30-30 13.5-30 30-30zm0 110c-25 0-46.5-13.5-58-33.5 0-19.5 38.5-30 58-30s58 10.5 58 30C146.5 136.5 125 150 100 150z" />
                  </svg>
                </div>
              )}
              {/* Accent glow ring */}
              <div
                className="absolute inset-0 rounded-full -z-10 scale-75 blur-3xl opacity-25"
                style={{ backgroundColor: accent }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Progress bar for auto-advance ───────────────────────────────────────────

function ProgressBar({
  active,
  duration,
  paused,
}: {
  active: boolean;
  duration: number;
  paused: boolean;
}) {
  return (
    <div className="h-0.5 bg-white/10 rounded-full overflow-hidden w-12 sm:w-16">
      {active && (
        <div
          className={cn(
            "h-full bg-white/70 rounded-full",
            paused ? "paused!" : null,
          )}
          style={{
            animation: `progress ${duration}ms linear forwards`,
          }}
        />
      )}
      <style>{`
        @keyframes progress {
          from { width: 0% }
          to   { width: 100% }
        }
      `}</style>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

interface PromoBannerProps {
  banners?: PromoBanner[];
}

const AUTO_ADVANCE_MS = 8_000; // 8 s — enough time to read the timer

export function PromoBannerSection({ banners: bannersProp }: PromoBannerProps) {
  const banners =
    bannersProp && bannersProp.length > 0 ? bannersProp : FALLBACK_BANNERS;
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const [showControls, setShowControls] = useState(false);

  const next = useCallback(
    () => setCurrent((c) => (c + 1) % banners.length),
    [banners.length],
  );
  const prev = useCallback(
    () => setCurrent((c) => (c - 1 + banners.length) % banners.length),
    [banners.length],
  );

  // Reset progress bar key when current changes
  const [barKey, setBarKey] = useState(0);
  useEffect(() => {
    setBarKey((k) => k + 1);
  }, [current]);

  // Auto-advance
  useEffect(() => {
    if (banners.length <= 1 || paused) return;
    timerRef.current = setInterval(next, AUTO_ADVANCE_MS);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [next, banners.length, paused]);

  if (banners.length === 0) return null;

  return (
    <Reveal>
      <section
        className="layout relative overflow-hidden w-full min-h-[90svh] md:min-h-2/3 md:h-125 py-10"
        onMouseEnter={() => {
          setPaused(true);
          setShowControls(true);
        }}
        onMouseLeave={() => {
          setPaused(false);
          setShowControls(false);
        }}
        aria-label="Promotional banners"
        data-reveal
      >
        {/* Slides */}
        {banners.map((banner, i) => (
          <BannerSlide
            key={banner._id}
            banner={banner}
            active={i === current}
          />
        ))}

        {/* Navigation — only rendered when there's more than one banner */}
        {banners.length > 1 && (
          <>
            {/* Prev / Next arrow buttons */}
            <button
              onClick={prev}
              className={cn(
                "absolute left-4 sm:left-5 top-1/2 -translate-y-1/2 z-20000 w-9 h-9 bg-white/10 text-white hover:bg-white/20 border border-white/20 flex items-center justify-center hover:cursor-pointer transition-all duration-300",
                showControls
                  ? "opacity-100 translate-x-0"
                  : "pointer-events-none opacity-0 -translate-x-10",
              )}
              aria-label="Previous banner"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <button
              onClick={next}
              className={cn(
                "absolute right-4 sm:right-5 top-1/2 -translate-y-1/2 z-20000 w-9 h-9 bg-white/10 text-white hover:bg-white/20 border border-white/20 flex items-center justify-center hover:cursor-pointer transition-all duration-300",
                showControls
                  ? "opacity-100 translate-x-0"
                  : "pointer-events-none opacity-0 translate-x-10",
              )}
              aria-label="Next banner"
            >
              <ChevronRight className="w-4 h-4" />
            </button>

            {/* Bottom nav: dot + progress bar pairs */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex items-center gap-3">
              {banners.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrent(i)}
                  className="flex flex-col items-center gap-1.5 group"
                  aria-label={`Go to banner ${i + 1}`}
                  aria-current={i === current ? "true" : undefined}
                >
                  {/* Dot */}
                  <span
                    className={cn(
                      "block rounded-full transition-all duration-300",
                      i === current
                        ? "w-2 h-2 bg-white"
                        : "w-1.5 h-1.5 bg-white/30 group-hover:bg-white/60",
                    )}
                  />
                  {/* Progress bar — only on the active slide */}
                  {i === current && (
                    <ProgressBar
                      key={barKey}
                      active={true}
                      duration={AUTO_ADVANCE_MS}
                      paused={paused}
                    />
                  )}
                </button>
              ))}
            </div>
          </>
        )}
      </section>
    </Reveal>
  );
}
