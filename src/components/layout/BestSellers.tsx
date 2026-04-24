import Link from "next/link";
import type { Product } from "@/types";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowRight01Icon, StarIcon } from "@hugeicons/core-free-icons";
import Title from "../ui/title";
import Reveal from "../animations/reveal";
import { MinimalProductCard } from "../product/ProductCardVariants";
import SimpleTitle from "../ui/simpleTitle";

interface BestSellersProps {
  products: Product[];
}

export function BestSellers({ products }: BestSellersProps) {
  if (!products.length) {
    return (
      <section className="py-12 md:py-16 text-stone-700 bg-stone-50 dark:bg-stone-800 dark:text-stone-50">
        <div className="layout">
          <SimpleTitle title="Trending" fontSize="lg" />

          <Reveal>
            <div
              className="flex items-center justify-center border border-dashed border-border/80 py-16 text-sm text-stone-500"
              data-reveal
            >
              No best sellers at the moment — please check back soon.
            </div>
          </Reveal>
        </div>
      </section>
    );
  }

  return (
    <div>
      {/* Header */}
      <SimpleTitle title="Trending" fontSize="lg" />

      {/* Grid */}
      <Reveal>
        <div className="grid gap-4" data-reveal>
          {products.map((product) => (
            <MinimalProductCard key={product._id} product={product} />
          ))}
        </div>

        {/* Mobile CTA */}
        <div className="mt-8 flex justify-center sm:hidden" data-reveal>
          <Link
            href="/products?featured=true"
            className="inline-flex items-center gap-2 px-6 py-3 border border-[#1a1a2e] text-sm font-semibold text-[#1a1a2e] hover:bg-[#1a1a2e] hover:text-white transition-colors rounded-xl"
          >
            View all featured
            <HugeiconsIcon icon={ArrowRight01Icon} size={16} strokeWidth={2} />
          </Link>
        </div>
      </Reveal>
    </div>
  );
}
