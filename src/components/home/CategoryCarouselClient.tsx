"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { getImageUrl } from "@/lib/sanity/client";
import Title from "../ui/title";
import Reveal from "../animations/reveal";

const ACCENT_COLOURS = [
  { bg: "#fdf2f0", text: "#e94560" },
  { bg: "#f0f4fd", text: "#3b5bdb" },
  { bg: "#f0fdf4", text: "#22c55e" },
  { bg: "#fffbeb", text: "#d97706" },
];

export default function CategoryCarouselClient({
  categories,
}: {
  categories: any[];
}) {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(1);
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!api) return;

    const update = () => {
      setCount(api.scrollSnapList().length);
      setCurrent(api.selectedScrollSnap() + 1);
    };

    update();
    api.on("select", update);

    return () => {
      api.off("select", update);
    };
  }, [api]);

  return (
    <section className="py-10 md:py-14">
      <div className="layout overflow-hidden">
        <Title title="Shop by Category" eyebrow="Browse" href="/products" />

        <Reveal>
          {categories.length === 0 ? (
            <div
              className="flex items-center justify-center border py-16 text-sm text-stone-400"
              data-reveal
            >
              No categories available yet.
            </div>
          ) : (
            <>
              <Carousel
                setApi={setApi}
                opts={{ align: "start", loop: false }}
                className="relative w-full"
                data-reveal
              >
                <CarouselContent className="-ml-3">
                  {categories.map((category, index) => {
                    const accent =
                      ACCENT_COLOURS[index % ACCENT_COLOURS.length];
                    const imageUrl = category.image
                      ? getImageUrl(category.image, 400, 300)
                      : null;

                    return (
                      <CarouselItem
                        key={category._id}
                        className="py-4 pl-3 basis-full sm:basis-1/3 md:basis-1/4 lg:basis-1/5"
                      >
                        <Link
                          href={`/products?category=${category.slug.current}`}
                          className="group block"
                        >
                          <div
                            className="relative w-full flex items-center gap-4 border-2 p-4 transition-all duration-300 hover:border-primary/50 hover:shadow-lg hover:-translate-y-1"
                            style={{
                              backgroundColor: imageUrl ? "#ffffff" : accent.bg,
                            }}
                          >
                            {/* Image Section */}
                            {imageUrl ? (
                              <div className="shrink-0 w-16 h-16 relative overflow-hidden">
                                <Image
                                  src={imageUrl}
                                  alt={category.name}
                                  width={64}
                                  height={64}
                                  className="object-contain w-full h-full transition-transform duration-300 group-hover:scale-110"
                                />
                              </div>
                            ) : (
                              <div className="shrink-0 w-16 h-16 bg-gray-100 flex items-center justify-center">
                                <span className="text-3xl">📦</span>
                              </div>
                            )}

                            {/* Text Content */}
                            <div className="flex-1 min-w-0">
                              <p className="font-semibold text-base md:text-lg truncate group-hover:text-primary transition-colors">
                                {category.name}
                              </p>
                              <div className="flex items-center gap-2 mt-1">
                                <span className="text-xs font-medium text-primary">
                                  {category.productCount}
                                </span>
                                <span className="text-xs text-muted-foreground">
                                  items
                                </span>
                              </div>
                            </div>

                            {/* Arrow Indicator */}
                            <div className="shrink-0 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-0 group-hover:translate-x-1">
                              <svg
                                className="w-5 h-5 text-primary"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M9 5l7 7-7 7"
                                />
                              </svg>
                            </div>
                          </div>
                        </Link>
                      </CarouselItem>
                    );
                  })}
                </CarouselContent>

                <CarouselPrevious className="hidden sm:flex -left-4" />
                <CarouselNext className="hidden sm:flex -right-4" />
              </Carousel>

              <div
                className="md:hidden! pt-4 text-center text-sm text-muted-foreground"
                data-reveal
              >
                Slide {current} of {count}
              </div>
            </>
          )}
        </Reveal>
      </div>
    </section>
  );
}
