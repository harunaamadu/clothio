import Link from "next/link";
import type { Product } from "@/types";
import { ProductCard } from "@/components/product/ProductCard";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowRight01Icon, StarIcon } from "@hugeicons/core-free-icons";
import Title from "../ui/title";
import { product } from "@/sanity/schemas/schema";

interface NewArrivalsProps {
  products: Product[];
}

export function NewArrivals({ products }: NewArrivalsProps) {
  if (!products.length) {
    return (
      <section className="py-12 md:py-16">
        <div className="layout">
          <Title
            title="New Arrivals"
            eyebrow="Handpicked Coming Soon"
            description="Oops! It looks like we don't have any new arrivals at the moment. We're working hard to curate a selection of items we think you'll love, so please check back soon!"
          />

          <div className="flex items-center justify-center border border-dashed border-border/80 py-16 text-sm text-stone-500">
            No new arrivals at the moment — please check back soon.
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-12 md:py-16">
      <div className="layout">
        {/* Header */}
        <Title
          title="New Arrivals"
          eyebrow="Just In"
          href="/products?new=true"
          description="Hand picked product you will like to have."
        />

        {/* Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {products.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>

        {/* Mobile CTA */}
        <div className="mt-8 flex justify-center sm:hidden">
          <Link
            href="/products?new=true"
            className="inline-flex items-center gap-2 px-6 py-3 border border-[#1a1a2e] text-sm font-semibold text-[#1a1a2e] hover:bg-[#1a1a2e] hover:text-white transition-colors rounded-xl"
          >
            View all new arrivals
            <HugeiconsIcon icon={ArrowRight01Icon} size={16} strokeWidth={2} />
          </Link>
        </div>
      </div>
    </section>
  );
}
