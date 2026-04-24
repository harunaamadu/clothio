import { ProductFilters } from "@/components/product/ProductFilters";
import {
  ProductGrid,
  ProductGridSkeleton,
} from "@/components/product/ProductGrid";
import { SortSelect } from "@/components/product/SortSelect";
import { SectionHeader } from "@/components/shared/SectionHeader";
import { Button } from "@/components/ui/button";
import {
  getAllBrands,
  getAllColors,
  getAllSizes,
  getCategories,
  getPriceRange,
  getProductCount,
  getProducts,
} from "@/lib/sanity/queries";
import { ProductFiltersProps } from "@/types";
import {
  ArrowLeft01Icon,
  FilterHorizontalIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Metadata } from "next";
import React, { Suspense } from "react";

export const metadata: Metadata = { title: "All Products" };

interface PageProps {
  searchParams: {
    category?: string;
    search?: string;
    sort?: string;
    page?: string;
    minPrice?: string;
    maxPrice?: string;
    size?: string | string[];
    color?: string | string[];
    brand?: string | string[];
    inStock?: string;
    onSale?: string;
  };
}

function toArray(val?: string | string[]): string[] {
  if (!val) return [];
  return Array.isArray(val) ? val : [val];
}

export default async function ProductsPage({ searchParams }: PageProps) {
  const page = Math.max(1, Number(searchParams.page ?? 1));
  const perPage = 12;

  //   const filters:Filters = {
  const filters: ProductFiltersProps = {
    category: searchParams.category,
    search: searchParams.search,
    minPrice: searchParams.minPrice ? Number(searchParams.minPrice) : undefined,
    maxPrice: searchParams.maxPrice ? Number(searchParams.maxPrice) : undefined,
    sizes: toArray(searchParams.size),
    colors: toArray(searchParams.color),
    brands: toArray(searchParams.brand),
    inStock: searchParams.inStock === "true",
  };

  const [products, total, categories, sizes, colors, brands, priceRange] =
    await Promise.all([
      getProducts(filters),
      getProductCount(filters),
      getCategories(),
      getAllSizes(),
      getAllColors(),
      getAllBrands(),
      getPriceRange(),
    ]);

  const totalPages = Math.ceil(total / perPage);

  const title = searchParams.search
    ? `Results for "${searchParams.search}`
    : searchParams.category
      ? (categories.find((c) => c.slug.current === searchParams.category)
          ?.name ?? "Products")
      : "All Products";

  return (
    <main className="w-full">
      <section className="layout py-8 lg:py-12">
        <SectionHeader
          eyebrow="All Products"
          title={title}
          description={
            searchParams.search && (
              <span className="">{total} results found</span>
            )
          }
          align="left"
        />

        <div className="flex gap-8 w-full h-full">
          <aside className="hidden lg:block  w-56 shrink-0 md:sticky md:top-6">
            <ProductFilters
              sizes={sizes.map((s) => ({ value: s, label: s }))}
              colors={colors.map((c) => ({
                value: c.name,
                label: c.name,
                color: c.hex,
              }))}
              brands={brands.map((b) => ({ value: b, label: b }))}
              minPrice={priceRange.min}
              maxPrice={priceRange.max}
            />
          </aside>

          {/* Main COntents */}
          <div className="flex-1 min-w-0 space-y-5">
            {/* Sort & count bar */}
            <div className="flex items-center justify-between gap-4 w-full">
              {/* Mobile filter button */}
              <Button
                variant="ghost"
                className="lg:hidden flex items-center gap-2"
              >
                <HugeiconsIcon
                  icon={FilterHorizontalIcon}
                  size={24}
                  color="currentColor"
                  strokeWidth={1.5}
                  className="w-3 h-3"
                />
                Filters{" "}
              </Button>

              <SortSelect total={total} />
            </div>

            {/* Products Grid */}
            <Suspense fallback={<ProductGridSkeleton count={perPage} />}>
              <ProductGrid products={products} />
            </Suspense>

            {/* Pagination */}
            {totalPages > 1 && (
              <Pagination
                current={page}
                total={totalPages}
                searchParams={searchParams}
              />
            )}
          </div>
        </div>
      </section>
    </main>
  );
}

function Pagination({
  current,
  total,
  searchParams,
}: {
  current: number;
  total: number;
  searchParams: Record<string, string | string[] | undefined>;
}) {
  function buildHref(page: number) {
    const params = new URLSearchParams();
    Object.entries(searchParams).forEach(([k, v]) => {
      if (k === "page") return;
      if (Array.isArray(v)) v.forEach((val) => params.append(k, val));
      else if (v) params.set(k, v);
    });
    params.set("page", String(page));
    return `/products?${params.toString()}`;
  }

  const pages = Array.from({ length: total }, (_, i) => i + 1).filter(
    (p) => p === 1 || p === total || Math.abs(p - current) <= 2,
  );

  return (
    <nav
      className="flex items-center justify-center gap-1.5 pt-4"
      aria-label="Pagination"
    >
      {/* Prev page */}
      {current > 1 && (
        <a
          href={buildHref(current - 1)}
          className="flex items-center gap-2 px-3 py-2 border border-border/40 text-sm hover:border-primary transition-all"
        >
          <HugeiconsIcon
            icon={ArrowLeft01Icon}
            size={24}
            color="currentColor"
            strokeWidth={1.5}
            className="w-3 h-3"
          />
          Prev
        </a>
      )}

      {pages.map((p, i) => {
        const prev = pages[i - 1];
        const showEllipsis = prev && p - prev > 1;

        return (
          <div key={p} className="flex items-center gap-1.5">
            {showEllipsis && <span className="px-2 text-sm">...</span>}
            <a
              href={buildHref(p)}
              className={`w-9 aspect-square flex items-center justify-center text-sm font-medium transition-colors ${
                p === current
                  ? "bg-primary text-stone-100"
                  : "border border-border/50 hover:border-primary"
              }`}
            >
              {p}
            </a>
          </div>
        );
      })}

      {/* Next page */}
      {current < total && (
        <a
          href={buildHref(current + 1)}
          className="flex items-center gap-2 px-3 py-2 border border-border/40 text-sm hover:border-primary transition-all"
        >
          Next
          <HugeiconsIcon
            icon={ArrowLeft01Icon}
            size={24}
            color="currentColor"
            strokeWidth={1.5}
            className="w-3 h-3"
          />
        </a>
      )}
    </nav>
  );
}
