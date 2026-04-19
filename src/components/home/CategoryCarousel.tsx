import Link from "next/link";
import Image from "next/image";
import { getCategoriesWithCount } from "@/lib/sanity/queries";
import { getImageUrl } from "@/lib/sanity/client";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Title from "../ui/title";
import Reveal from "../animations/reveal";

// Fallback accent colours when a category has no image
const ACCENT_COLOURS = [
  { bg: "#fdf2f0", text: "#e94560" },
  { bg: "#f0f4fd", text: "#3b5bdb" },
  { bg: "#f0fdf4", text: "#22c55e" },
  { bg: "#fffbeb", text: "#d97706" },
  { bg: "#fdf4ff", text: "#a855f7" },
  { bg: "#fff1f2", text: "#f43f5e" },
  { bg: "#f0f9ff", text: "#0ea5e9" },
  { bg: "#fef3c7", text: "#b45309" },
];

function CategoryIcon({ name, colour }: { name: string; colour: string }) {
  const n = name.toLowerCase();

  if (n.includes("men") && !n.includes("women"))
    return (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        className="w-8 h-8"
        stroke={colour}
        strokeWidth={1.5}
      >
        <path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
      </svg>
    );

  if (n.includes("women") || n.includes("dress") || n.includes("frock"))
    return (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        className="w-8 h-8"
        stroke={colour}
        strokeWidth={1.5}
      >
        <path d="M12 2L8 8l-4 2 2 12h12l2-12-4-2-4-6z" />
      </svg>
    );

  if (n.includes("jewel") || n.includes("ring") || n.includes("necklace"))
    return (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        className="w-8 h-8"
        stroke={colour}
        strokeWidth={1.5}
      >
        <path d="M12 21.593c-5.63-5.539-11-10.297-11-14.402C1 3.518 3.318 1 6.5 1c1.966 0 3.699 1.042 4.5 2.5.801-1.458 2.534-2.5 4.5-2.5C18.682 1 21 3.518 21 7.191c0 4.105-5.37 8.863-11 14.402z" />
      </svg>
    );

  if (n.includes("shoe") || n.includes("footwear") || n.includes("boot"))
    return (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        className="w-8 h-8"
        stroke={colour}
        strokeWidth={1.5}
      >
        <path d="M2 18l1.5-6L9 6l4 2 4-2 3 4-1 8H2z" />
      </svg>
    );

  if (n.includes("bag") || n.includes("purse") || n.includes("wallet"))
    return (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        className="w-8 h-8"
        stroke={colour}
        strokeWidth={1.5}
      >
        <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
        <line x1="3" y1="6" x2="21" y2="6" />
        <path d="M16 10a4 4 0 01-8 0" />
      </svg>
    );

  if (
    n.includes("perfume") ||
    n.includes("fragrance") ||
    n.includes("cosmetic")
  )
    return (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        className="w-8 h-8"
        stroke={colour}
        strokeWidth={1.5}
      >
        <path d="M9 3h6v3H9zM8 6h8l1 14H7L8 6z" />
        <path d="M12 3V1m0 0H9m3 0h3" />
      </svg>
    );

  if (n.includes("glass") || n.includes("sunglass") || n.includes("lens"))
    return (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        className="w-8 h-8"
        stroke={colour}
        strokeWidth={1.5}
      >
        <circle cx="7" cy="13" r="4" />
        <circle cx="17" cy="13" r="4" />
        <path d="M11 13h2M3 13H1M21 13h2M7 9L5 7M17 9l2-2" />
      </svg>
    );

  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className="w-8 h-8"
      stroke={colour}
      strokeWidth={1.5}
    >
      <path d="M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82z" />
      <line x1="7" y1="7" x2="7.01" y2="7" />
    </svg>
  );
}

export async function CategoryCarousel() {
  let categories: Awaited<ReturnType<typeof getCategoriesWithCount>> = [];

  try {
    categories = await getCategoriesWithCount();
  } catch (error) {
    console.warn("Sanity fetch failed for categories:", error);
  }

  return (
    <section className="py-10 md:py-14 bg-background">
      <div className="layout">
        {/* Header */}
        <Title title="Shop by Category" eyebrow="Browse" href="/products" />

        <Reveal>
          {/* Empty state */}
          {categories.length === 0 ? (
            <div
              className="flex items-center justify-center border border-dashed border-border py-16 text-sm text-stone-400"
              data-reveal
            >
              No categories available yet — check back soon.
            </div>
          ) : (
            <Carousel
              opts={{ align: "start", loop: false }}
              className="relative w-full"
              data-reveal
            >
              <CarouselContent className="-ml-3">
                {categories.map((category, index) => {
                  const accent = ACCENT_COLOURS[index % ACCENT_COLOURS.length];
                  const imageUrl = category.image
                    ? getImageUrl(category.image, 400, 300)
                    : null;

                  return (
                    <CarouselItem
                      key={category._id}
                      className="pl-3 basis-1/2 sm:basis-1/3 md:basis-1/4 lg:basis-1/5"
                    >
                      <Link
                        href={`/products?category=${category.slug.current}`}
                        className="group block h-full bg-background"
                      >
                        <div
                          className="relative flex items-center justify-between gap-3 border border-border p-2 transition-all duration-200 hover:border-primary/40 hover:shadow-md aspect-2/1 w-full"
                          style={{
                            backgroundColor: imageUrl ? undefined : accent.bg,
                          }}
                        >
                          {imageUrl ? (
                            <div className="flex items-center gap-2 h-full w-full">
                              <Image
                                src={imageUrl}
                                alt={category.name}
                                width={60}
                                height={60}
                                className="object-contain bg-stone-200 block p-2 aspect-square opacity-80 group-hover:opacity-100 transition-opacity duration-300"
                              />

                              <div className="relative z-10 w-full text-left px-1 flex items-start justify-between">
                                <div>
                                  <p className="font-semibold text-sm leading-tight">
                                    {category.name}
                                  </p>
                                  <span className="text-xs font-normal text-primary group-hover:text-primary/80 transition-colors">
                                    Show All
                                  </span>
                                </div>
                                <p className="text-[11px] mt-0.5">
                                  {category.productCount}{" "}
                                  {category.productCount === 1 ||
                                  category.productCount === 0
                                    ? "item"
                                    : "items"}
                                </p>
                              </div>
                            </div>
                          ) : (
                            <>
                              <div
                                className="w-14 h-14 flex items-center justify-center group-hover:scale-110 transition-transform duration-200 shrink-0"
                                style={{ backgroundColor: `${accent.text}1a` }}
                              >
                                <CategoryIcon
                                  name={category.name}
                                  colour={accent.text}
                                />
                              </div>
                              <div className="block">
                                <p className="font-semibold text-[11px] text-stone-400 leading-tight">
                                  {category.name}
                                </p>
                                <p className="mt-0.5">
                                  {category.productCount}{" "}
                                  {category.productCount === 1
                                    ? "item"
                                    : "items"}
                                </p>
                              </div>
                            </>
                          )}
                        </div>
                      </Link>
                    </CarouselItem>
                  );
                })}
              </CarouselContent>

              <CarouselPrevious className="hidden sm:flex -left-4 border-[#e4e4e7] bg-white hover:bg-[#1a1a2e] hover:text-white hover:border-[#1a1a2e] transition-colors" />
              <CarouselNext className="hidden sm:flex -right-4 border-[#e4e4e7] bg-white hover:bg-[#1a1a2e] hover:text-white hover:border-[#1a1a2e] transition-colors" />
            </Carousel>
          )}
        </Reveal>
      </div>
    </section>
  );
}
