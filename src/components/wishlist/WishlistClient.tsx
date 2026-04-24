"use client"

import Link from "next/link"
import { useWishlistStore } from "@/store/wishlist.store"
import { ProductCard } from "@/components/product/ProductCard"
import { useEffect, useState } from "react"
import { getProductsByIds } from "@/lib/sanity/queries"
import type { Product } from "@/types"
import { HugeiconsIcon } from "@hugeicons/react"
import { FavouriteIcon, Delete02Icon } from "@hugeicons/core-free-icons"
import { LoadingSpinner } from "@/components/shared/LoadingSpinner"
import Title from "../ui/title"

export function WishlistClient() {
  const { items: wishlistIds, clear } = useWishlistStore()
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (wishlistIds.length === 0) {
      setProducts([])
      setLoading(false)
      return
    }
    setLoading(true)
    getProductsByIds(wishlistIds)
      .then(setProducts)
      .finally(() => setLoading(false))
  }, [wishlistIds])

  /* ── Spinner ── */
  if (loading) {
    return (
      <div className="layout py-24 flex justify-center">
        <LoadingSpinner size="lg" label="Loading wishlist..." />
      </div>
    )
  }

  /* ── Empty state ── */
  if (wishlistIds.length === 0) {
    return (
      <div className="layout py-24 flex flex-col items-center gap-6 text-center">
        <div className="w-20 h-20 border border-border bg-muted flex items-center justify-center">
          <HugeiconsIcon
            icon={FavouriteIcon}
            size={32}
            className="text-muted-foreground"
            color="currentColor"
            strokeWidth={1.5}
          />
        </div>
        <div className="space-y-1">
          <h1 className="font-heading text-2xl font-bold text-foreground">
            Your wishlist is empty
          </h1>
          <p className="text-muted-foreground text-sm">
            Save items you love to come back to them later.
          </p>
        </div>
        <Link
          href="/products"
          className="bg-primary text-primary-foreground font-semibold text-sm px-8 py-3 hover:opacity-90 transition-opacity"
        >
          Discover Products
        </Link>
      </div>
    )
  }

  return (
    <div className="layout py-8 lg:py-12">
      {/* Header */}
      <Title eyebrow="your favourites" title="My Wishlist" button buttonLabel="Clear all" buttonIcon="bin" buttonAction={clear} />

      {products.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {products.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      ) : (
        /* IDs exist but products were removed from Sanity */
        <div className="border border-dashed border-border py-14 text-center space-y-2">
          <p className="text-sm text-muted-foreground">
            Some saved products are no longer available.
          </p>
          <button
            onClick={clear}
            className="text-sm font-medium text-primary hover:opacity-80 underline underline-offset-2 transition-opacity"
          >
            Clear wishlist
          </button>
        </div>
      )}
    </div>
  )
}