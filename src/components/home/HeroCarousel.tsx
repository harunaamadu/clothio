"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import Autoplay from "embla-carousel-autoplay";

import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { formatPrice } from "@/lib/formatters";
import type { HeroBanner } from "@/types";
import { FALLBACK_BANNERS } from "@/lib/constants";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowRight04Icon } from "@hugeicons/core-free-icons";
import { Badge } from "../ui/badge";

interface HeroCarouselProps {
  banners: HeroBanner[];
}

export function HeroCarousel({ banners }: HeroCarouselProps) {
  const items = banners.length ? banners : FALLBACK_BANNERS;
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [showControls, setShowControls] = useState(false);

  const autoplay = useRef(
    Autoplay({
      delay: 6000,
      stopOnInteraction: true,
      stopOnFocusIn: true,
    }),
  );

  useEffect(() => {
    if (!api) return;

    const updateCurrent = () => {
      setCurrent(api.selectedScrollSnap());
    };

    updateCurrent();
    api.on("select", updateCurrent);

    return () => {
      api.off("select", updateCurrent);
    };
  }, [api]);

  return (
    <section
      className="layout group relative h-[85vh] max-h-160 min-h-150 overflow-hidden"
      onMouseEnter={() => setShowControls(true)}
      onMouseLeave={() => setShowControls(false)}
    >
      {/* Grain texture */}
      <div
        className="pointer-events-none absolute inset-0 z-10 opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          backgroundRepeat: "repeat",
          backgroundSize: "128px",
        }}
      />
      <Carousel
        setApi={setApi}
        opts={{
          loop: true,
          align: "start",
        }}
        plugins={[autoplay.current]}
        className="h-full"
      >
        <CarouselContent className="h-full">
          {items.map((item, index) => {
            const heroImage = item.bgImage || item.image?.url;

            return (
              <AnimatePresence mode="wait">
                <CarouselItem
                  key={index}
                  className="h-full relative overflow-hidden"
                >
                  <div className="h-full py-12 md:py-16">
                    <div className="h-full p-4 md:p-6">
                      <div className="grid h-full items-center gap-10 lg:grid-cols-2">
                        {/* Text */}
                        <motion.div
                          className="space-y-6 text-center lg:text-left"
                          initial="hidden"
                          animate="show"
                          variants={{
                            hidden: {},
                            show: {
                              transition: { staggerChildren: 0.12 },
                            },
                          }}
                        >
                          {item.badge && (
                            <Badge
                              className="inline-block text-xs font-semibold uppercase tracking-[0.2em]"
                              style={{
                                backgroundColor: `${item.accentColor ?? "#e94560"}15`,
                                color: item.accentColor ?? "#e94560",
                              }}
                            >
                              {item.badge}
                            </Badge>
                          )}

                          <motion.h1
                            variants={{
                              hidden: { opacity: 0, y: 30 },
                              show: { opacity: 1, y: 0 },
                            }}
                            className="font-heading text-4xl font-bold leading-tight sm:text-5xl lg:text-7xl"
                          >
                            {item.title}
                          </motion.h1>

                          {item.description && (
                            <motion.p
                              variants={{
                                hidden: { opacity: 0, y: 30 },
                                show: { opacity: 1, y: 0 },
                              }}
                              className="mx-auto max-w-lg text-muted-foreground lg:mx-0"
                            >
                              {item.description}
                            </motion.p>
                          )}

                          {item.startingPrice && (
                            <motion.div
                              variants={{
                                hidden: { opacity: 0, y: 30 },
                                show: { opacity: 1, y: 0 },
                              }}
                              className="text-sm text-muted-foreground"
                            >
                              <p className="text-sm text-muted-foreground">
                                Starting at{" "}
                                <em
                                  className="text-xl not-italic font-bold"
                                  style={{
                                    color: item.acc entColor ?? "#e94560",
                                  }}
                                >
                                  {formatPrice(item.startingPrice)}
                                </em>
                              </p>
                            </motion.div>
                          )}

                          <motion.div
                            variants={{
                              hidden: { opacity: 0, y: 30 },
                              show: { opacity: 1, y: 0 },
                            }}
                          >
                            <Link
                              href={item.ctaLink}
                              className="inline-flex items-center gap-2 px-8 py-4 font-semibold text-white shadow-lg transition hover:scale-105"
                              style={{
                                backgroundColor: item.accentColor ?? "#e94560",
                              }}
                            >
                              {item.ctaText}
                              <HugeiconsIcon
                                icon={ArrowRight04Icon}
                                size={18}
                                color="currentColor"
                              />
                            </Link>
                          </motion.div>
                        </motion.div>

                        {/* Image */}
                        {heroImage && (
                          <div className="absolute inset-0 w-[101%] hidden lg:block">
                            <motion.div
                              initial={{ opacity: 0, x: 90 }}
                              animate={{ opacity: 1, x: -10 }}
                              transition={{ duration: 0.8 }}
                              className="absolute inset-0 -z-10"
                            >
                              <motion.div
                                animate={{ y: [0, -12, 0] }}
                                transition={{
                                  duration: 4,
                                  repeat: Infinity,
                                  ease: "easeInOut",
                                }}
                                className="relative h-full w-full"
                              >
                                <Image
                                  src={heroImage}
                                  alt={item.title}
                                  fill
                                  priority={index === 0}
                                  sizes="100vw"
                                  className="object-cover"
                                />
                              </motion.div>
                            </motion.div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </CarouselItem>
              </AnimatePresence>
            );
          })}
        </CarouselContent>

        {/* Prev / Next */}
        <CarouselPrevious
          className={cn(
            "left-4 transition-all duration-300",
            showControls
              ? "opacity-100 translate-x-0"
              : "pointer-events-none opacity-0 -translate-x-10",
          )}
        />

        <CarouselNext
          className={cn(
            "right-4 transition-all duration-300",
            showControls
              ? "opacity-100 translate-x-0"
              : "pointer-events-none opacity-0 translate-x-10",
          )}
        />
      </Carousel>

      {/* Dots */}
      <div className="absolute bottom-6 left-1/2 flex -translate-x-1/2 gap-2">
        {items.map((_, index) => (
          <button
            key={index}
            onClick={() => api?.scrollTo(index)}
            className={cn(
              "h-2 rounded-full transition-all duration-300",
              current === index
                ? "w-8 bg-primary"
                : "w-2 bg-black/20 hover:bg-black/40",
            )}
          />
        ))}
      </div>
    </section>
  );
}
