import { ProductCard } from "./ProductCard"
import { MinimalProductCard, BestProductCard } from "./ProductCardVariants"
import type { Product } from "@/types"
import { cn } from "@/lib/utils"

type CardVariant = "default" | "minimal" | "best"

interface ProductGridProps {
  products: Product[]
  columns?: 2 | 3 | 4
  className?: string
  variant?: CardVariant
}

// Skeleton card shown while products are loading
export function ProductCardSkeleton() {
  return (
    <div className="rounded-xl border border-[#e4e4e7] overflow-hidden bg-white">
      <div className="aspect-3/4 skeleton" />
      <div className="p-3 space-y-2">
        <div className="h-2.5 w-16 skeleton rounded-full" />
        <div className="h-3.5 w-3/4 skeleton rounded-full" />
        <div className="h-3 w-20 skeleton rounded-full" />
        <div className="h-4 w-14 skeleton rounded-full" />
      </div>
    </div>
  )
}

export function ProductGridSkeleton({ count = 12 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  )
}

export function ProductGrid({
  products,
  columns = 4,
  className,
  variant = "default",
}: ProductGridProps) {
  const colClass = {
    2: "grid-cols-2",
    3: "grid-cols-2 sm:grid-cols-3",
    4: "grid-cols-2 sm:grid-cols-3 lg:grid-cols-4",
  }[columns]

  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-3 text-center">
        <div className="w-16 h-16 rounded-full bg-[#f4f4f5] flex items-center justify-center">
          <svg
            className="w-7 h-7 text-[#a1a1aa]"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
            />
          </svg>
        </div>
        <div>
          <p className="font-display font-semibold text-[#18181b]">No products found</p>
          <p className="text-sm text-[#71717a] mt-1">
            Try adjusting your filters or search term.
          </p>
        </div>
      </div>
    )
  }

  // Minimal and Best variants stack vertically as a list, not a grid
  if (variant === "minimal" || variant === "best") {
    const Card = variant === "minimal" ? MinimalProductCard : BestProductCard
    return (
      <div className={cn("flex flex-col divide-y divide-[#f4f4f5]", className)}>
        {products.map((product) => (
          <Card key={product._id} product={product} />
        ))}
      </div>
    )
  }

  return (
    <div className={cn(`grid ${colClass} gap-4`, className)}>
      {products.map((product) => (
        <ProductCard key={product._id} product={product} />
      ))}
    </div>
  )
}