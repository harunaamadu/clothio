"use client";

import { useEffect, useState, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { formatPrice } from "@/lib/formatters";
import type { HeroBanner } from "@/types";
import { getImageUrl } from "@/lib/sanity/client";
import { ChevronLeft, ChevronRight } from "lucide-react";

// Fallback banners when Sanity has no data
const FALLBACK_BANNERS = [
  {
    _id: "1",
    title: "Women's Latest\nFashion Sale",
    subtitle: "Trending item",
    description: "Elevate your wardrobe with our curated collection",
    ctaText: "Shop Now",
    ctaLink: "/products?category=womens",
    badge: "Trending item",
    startingPrice: 20,
    bgColor: "#fdf2f0",
    accentColor: "#e94560",
  },
  {
    _id: "2",
    title: "Modern\nSunglasses",
    subtitle: "Trending accessories",
    description: "Complete your look with our premium eyewear collection",
    ctaText: "Shop Now",
    ctaLink: "/products?category=accessories",
    badge: "Trending accessories",
    startingPrice: 15,
    bgColor: "#f0f4fd",
    accentColor: "#1a1a2e",
  },
  {
    _id: "3",
    title: "New Fashion\nSummer Sale",
    subtitle: "Sale Offer",
    description: "The hottest styles of the season, now at unbeatable prices",
    ctaText: "Shop Now",
    ctaLink: "/products?sale=true",
    badge: "Sale Offer",
    startingPrice: 29.99,
    bgColor: "#f0fdf4",
    accentColor: "#22c55e",
  },
];

interface HeroCarouselProps {
  banners: HeroBanner[];
}

export function HeroCarousel({ banners }: HeroCarouselProps) {
  const [current, setCurrent] = useState(0);
  const items = banners.length > 0 ? banners : FALLBACK_BANNERS;

  const next = useCallback(() => setCurrent((c) => (c + 1) % items.length), [items.length]);
  const prev = () => setCurrent((c) => (c - 1 + items.length) % items.length);

  useEffect(() => {
    const timer = setInterval(next, 5000);
    return () => clearInterval(timer);
  }, [next]);

  return (
    <section className="relative overflow-hidden bg-[#f4f4f5]" style={{ height: "min(75vh, 600px)" }}>
      {items.map((item: any, index) => {
        const isActive = index === current;
        const imageUrl = item.image ? getImageUrl(item.image, 1200, 600) : null;

        return (
          <div
            key={item._id}
            className={cn(
              "absolute inset-0 flex items-center transition-all duration-700",
              isActive ? "opacity-100 translate-x-0" : index < current ? "opacity-0 -translate-x-full" : "opacity-0 translate-x-full"
            )}
            style={{ backgroundColor: item.bgColor ?? "#fdf2f0" }}
          >
            <div className="container h-full flex items-center">
              <div className="grid lg:grid-cols-2 gap-8 items-center w-full">
                {/* Text */}
                <div className={cn("space-y-4 text-center lg:text-left", isActive && "animate-fade-in")}>
                  {item.badge && (
                    <span
                      className="inline-block text-xs font-semibold uppercase tracking-widest px-3 py-1 rounded-full"
                      style={{
                        backgroundColor: `${item.accentColor ?? "#e94560"}20`,
                        color: item.accentColor ?? "#e94560",
                      }}
                    >
                      {item.badge}
                    </span>
                  )}
                  <h1
                    className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-[#1a1a2e] leading-tight whitespace-pre-line"
                  >
                    {item.title}
                  </h1>
                  {item.description && (
                    <p className="text-[#71717a] text-base max-w-md mx-auto lg:mx-0">
                      {item.description}
                    </p>
                  )}
                  {item.startingPrice && (
                    <p className="text-[#71717a] text-sm">
                      Starting at{" "}
                      <span className="text-2xl font-bold text-[#1a1a2e]">
                        {formatPrice(item.startingPrice)}
                      </span>
                    </p>
                  )}
                  <Link
                    href={item.ctaLink}
                    className="inline-flex items-center gap-2 px-8 py-3 text-white font-semibold rounded-full transition-all duration-200 hover:scale-105 hover:shadow-lg"
                    style={{ backgroundColor: item.accentColor ?? "#e94560" }}
                  >
                    {item.ctaText}
                    <ChevronRight className="w-4 h-4" />
                  </Link>
                </div>

                {/* Image */}
                {imageUrl && (
                  <div className="relative hidden lg:block h-full min-h-100">
                    <Image
                      src={imageUrl}
                      alt={item.title}
                      fill
                      priority={index === 0}
                      sizes="50vw"
                      className="object-contain object-center"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      })}

      {/* Navigation arrows */}
      {items.length > 1 && (
        <>
          <button
            onClick={prev}
            className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/80 hover:bg-white shadow-md flex items-center justify-center transition-all hover:scale-110"
            aria-label="Previous slide"
          >
            <ChevronLeft className="w-5 h-5 text-[#1a1a2e]" />
          </button>
          <button
            onClick={next}
            className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/80 hover:bg-white shadow-md flex items-center justify-center transition-all hover:scale-110"
            aria-label="Next slide"
          >
            <ChevronRight className="w-5 h-5 text-[#1a1a2e]" />
          </button>

          {/* Dots */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
            {items.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                className={cn(
                  "rounded-full transition-all duration-300",
                  i === current ? "w-6 h-2 bg-[#e94560]" : "w-2 h-2 bg-[#1a1a2e]/30 hover:bg-[#1a1a2e]/60"
                )}
                aria-label={`Go to slide ${i + 1}`}
              />
            ))}
          </div>
        </>
      )}
    </section>
  );
}