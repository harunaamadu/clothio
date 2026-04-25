"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, Variants } from "framer-motion";
import Autoplay from "embla-carousel-autoplay";

import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

import { cn } from "@/lib/utils";
import { formatPrice } from "@/lib/formatters";
import type { HeroBanner } from "@/types";
import { FALLBACK_BANNERS } from "@/lib/constants";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowRight04Icon } from "@hugeicons/core-free-icons";
import { Badge } from "../ui/badge";
import { urlFor } from "@/lib/sanity/client";

interface HeroCarouselProps {
  banners: HeroBanner[];
}

const textVariants: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: (delay: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1], delay },
  }),
};

export function HeroCarousel({ banners }: HeroCarouselProps) {
  const items = banners.length ? banners : FALLBACK_BANNERS;
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [showControls, setShowControls] = useState(false);
  const [animKey, setAnimKey] = useState(0);

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
      setAnimKey((k) => k + 1);
    };

    updateCurrent();
    api.on("select", updateCurrent);

    return () => {
      api.off("select", updateCurrent);
    };
  }, [api]);

  return (
    <section
      className="relative layout h-[85vh] max-h-160 min-h-150 overflow-hidden"
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
        opts={{ loop: true, align: "start" }}
        plugins={[autoplay.current]}
        className="h-full"
      >
        <CarouselContent className="h-full">
          {items.map((item, index) => {
            const heroImage = item.bgImage?.asset
              ? urlFor(item.bgImage).width(1400).quality(90).url()
              : null;

            const mobileHeroImage = item.mobileImage?.asset
              ? urlFor(item.mobileImage).width(1400).quality(90).url()
              : null;

            const isActive = current === index;

            return (
              <CarouselItem
                key={index}
                className="relative w-full min-h-[calc(100svh-200px)] md:h-full overflow-hidden"
              >
                <div className="h-full py-12 md:py-16">
                  <div className="h-full p-4 md:p-6">
                    <div className="grid items-center gap-10 lg:grid-cols-2">
                      {/* Text — only animate when this slide is active */}
                      {isActive && (
                        <div
                          key={animKey}
                          className="relative space-y-6 text-center lg:text-left z-10 text-white"
                        >
                          {item.badge && (
                            <motion.div
                              custom={0}
                              variants={textVariants}
                              initial="hidden"
                              animate="show"
                            >
                              <Badge
                                className="inline-block text-xs font-semibold uppercase tracking-[0.2em]"
                                style={{
                                  backgroundColor: `${item.accentColor ?? "#e94560"}90`,
                                  color: "#ffffff",
                                }}
                              >
                                {item.badge}
                              </Badge>
                            </motion.div>
                          )}

                          <motion.h1
                            key={`title-${animKey}`}
                            custom={0.1}
                            variants={textVariants}
                            initial="hidden"
                            animate="show"
                            className="font-heading text-4xl font-bold leading-tight sm:text-5xl lg:text-7xl"
                          >
                            {item.title}
                          </motion.h1>

                          {item.description && (
                            <motion.p
                              key={`desc-${animKey}`}
                              custom={0.2}
                              variants={textVariants}
                              initial="hidden"
                              animate="show"
                              className="mx-auto max-w-lg text-stone-300 lg:mx-0"
                            >
                              {item.description}
                            </motion.p>
                          )}

                          {item.startingPrice && (
                            <motion.p
                              key={`price-${animKey}`}
                              custom={0.3}
                              variants={textVariants}
                              initial="hidden"
                              animate="show"
                              className="text-sm text-stone-100"
                            >
                              Starting at{" "}
                              <em
                                className="text-xl not-italic font-bold"
                                style={{ color: item.accentColor ?? "#e94560" }}
                              >
                                {formatPrice(item.startingPrice)}
                              </em>
                            </motion.p>
                          )}

                          <motion.div
                            key={`cta-${animKey}`}
                            custom={0.4}
                            variants={textVariants}
                            initial="hidden"
                            animate="show"
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
                        </div>
                      )}

                      {/* Spacer for inactive slides to preserve grid layout */}
                      {!isActive && <div />}

                      <div className="absolute inset-0 w-screen bg-black/50 block z-0" />

                      {/* Image */}
                      {heroImage && (
                        <div className="absolute inset-0 w-[101%] hidden lg:block">
                          <motion.div
                            key={`img-${animKey}`}
                            initial={{ opacity: 0, x: 90 }}
                            animate={{ opacity: 1, x: -10 }}
                            transition={{
                              duration: 0.8,
                              ease: [0.22, 1, 0.36, 1],
                            }}
                            className="absolute inset-0 -z-10"
                          >
                            <motion.div
                              animate={{ y: [0, -8, 0] }}
                              transition={{
                                duration: 4,
                                repeat: Infinity,
                                ease: "easeInOut",
                              }}
                              className="relative h-full w-full z-1"
                            >
                              <Image
                                src={heroImage}
                                alt={item.title}
                                fill
                                priority={index === 0}
                                sizes="100vw"
                                className="object-cover object-top-right -translate-y-32"
                              />
                            </motion.div>
                          </motion.div>
                        </div>
                      )}

                      {mobileHeroImage && (
                        <div className="absolute inset-0 w-[101%] h-full block lg:hidden -z-10">
                          <motion.div
                            key={`img-${animKey}`}
                            initial={{ opacity: 0, x: 90 }}
                            animate={{ opacity: 1, x: -10 }}
                            transition={{
                              duration: 0.8,
                              ease: [0.22, 1, 0.36, 1],
                            }}
                            className="absolute inset-0"
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
                                src={mobileHeroImage}
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
            );
          })}
        </CarouselContent>

        {/* Prev / Next */}
        <CarouselPrevious
          className={cn(
            "left-4 z-20 transition-all duration-300",
            showControls
              ? "opacity-100 translate-x-0"
              : "pointer-events-none opacity-0 -translate-x-10",
          )}
        />
        <CarouselNext
          className={cn(
            "right-4 z-20 transition-all duration-300",
            showControls
              ? "opacity-100 translate-x-0"
              : "pointer-events-none opacity-0 translate-x-10",
          )}
        />
      </Carousel>

      {/* Dots */}
      <div className="absolute bottom-6 left-1/2 z-20 flex -translate-x-1/2 gap-2">
        {items.map((_, index) => (
          <button
            key={index}
            onClick={() => api?.scrollTo(index)}
            className={cn(
              "h-2 transition-all hover:cursor-pointer duration-300",
              current === index
                ? "w-8 bg-primary hover:bg-primary/80"
                : "w-2 bg-black/20 hover:bg-black/40",
            )}
          />
        ))}
      </div>
    </section>
  );
}
