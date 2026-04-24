import Link from "next/link";
import type { Product } from "@/types";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowRight01Icon } from "@hugeicons/core-free-icons";
import Reveal from "../animations/reveal";
import SimpleTitle from "../ui/simpleTitle";
import { BestProductCard } from "../product/ProductCardVariants";
import { getTopRatedProducts } from "@/lib/sanity/queries";

interface NewArrivalsProps {
  products: Product[];
}

export async function TopRatedProducts({ products }: NewArrivalsProps) {
  if (!products.length) {
    return (
      <div>
        <SimpleTitle title="Top Rated" fontSize="lg" />
        <Reveal>
          <div
            className="flex items-center justify-center border border-dashed border-border/80 py-16 text-sm text-stone-500"
            data-reveal
          >
            No top rated products at the moment — please check back soon.
          </div>
        </Reveal>
      </div>
    );
  }

  return (
    <div>
      <SimpleTitle title="Top Rated" fontSize="lg" />

      <Reveal>
        {/* List */}
        <div className="grid gap-4" data-reveal>
          {products.map((product) => (
            <BestProductCard key={product._id} product={product} />
          ))}
        </div>

        {/* Mobile CTA */}
        <div className="mt-8 flex justify-center sm:hidden" data-reveal>
          <Link
            href="/products?sort=rating"
            className="inline-flex items-center gap-2 px-6 py-3 border border-[#1a1a2e] text-sm font-semibold text-[#1a1a2e] hover:bg-[#1a1a2e] hover:text-white transition-colors"
          >
            View all top rated
            <HugeiconsIcon icon={ArrowRight01Icon} size={16} strokeWidth={2} />
          </Link>
        </div>
      </Reveal>
    </div>
  );
}