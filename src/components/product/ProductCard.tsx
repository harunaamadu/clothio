"use client";

import Link from "next/link";
import Image from "next/image";
import { useCartStore } from "@/store/cart.store";
import { useWishlistStore } from "@/store/wishlist.store";
import { formatPrice, calculateDiscount } from "@/lib/formatters";
import { StarRating } from "@/components/shared/StarRating";
import { cn } from "@/lib/utils";
import type { Product } from "@/types";
import { getImageUrl } from "@/lib/sanity/client";
import { Heart, ShoppingBag, Eye } from "lucide-react";

interface ProductCardProps {
  product: Product;
  className?: string;
}

export function ProductCard({ product, className }: ProductCardProps) {
  const addItem = useCartStore((s) => s.addItem);
  const { toggle, has } = useWishlistStore();
  const isWishlisted = has(product._id);
  const discount = product.compareAtPrice
    ? calculateDiscount(product.price, product.compareAtPrice)
    : 0;

  const imageUrl = product.images?.[0]
    ? getImageUrl(product.images[0], 600, 750)
    : "/images/placeholder.jpg";
  const hoverImageUrl = product.images?.[1]
    ? getImageUrl(product.images[1], 600, 750)
    : null;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const defaultVariant = product.variants?.[0];
    addItem({
      productId: product._id,
      variantId: defaultVariant?._key,
      name: product.name,
      slug: product.slug.current,
      image: imageUrl,
      price: product.price,
      quantity: 1,
      size: defaultVariant?.size,
      color: defaultVariant?.color,
      stock: product.stock ?? defaultVariant?.stock ?? 10,
    });
  };

  return (
    <div
      className={cn(
        "group relative bg-white rounded-xl overflow-hidden border border-[#e4e4e7] hover:border-primary/30 hover:shadow-lg transition-all duration-300",
        className
      )}
    >
      {/* Image */}
      <Link href={`/products/${product.slug.current}`} className="block relative aspect-3/4 overflow-hidden bg-[#f4f4f5]">
        <Image
          src={imageUrl}
          alt={product.name}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          className="object-cover product-card-image"
        />
        {hoverImageUrl && (
          <Image
            src={hoverImageUrl}
            alt={`${product.name} alternate`}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-cover absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          />
        )}

        {/* Badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          {product.isNewArrival && (
            <span className="bg-[#1a1a2e] text-white text-[10px] font-semibold px-2 py-0.5 rounded-full">
              NEW
            </span>
          )}
          {discount > 0 && (
            <span className="bg-primary text-white text-[10px] font-semibold px-2 py-0.5 rounded-full">
              -{discount}%
            </span>
          )}
          {product.isBestSeller && (
            <span className="bg-[#f5a623] text-[#1a1a2e] text-[10px] font-semibold px-2 py-0.5 rounded-full">
              HOT
            </span>
          )}
        </div>

        {/* Actions overlay */}
        <div className="absolute top-2 right-2 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-all duration-200 translate-x-2 group-hover:translate-x-0">
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              toggle(product._id);
            }}
            className={cn(
              "w-8 h-8 rounded-full flex items-center justify-center shadow-md transition-colors",
              isWishlisted
                ? "bg-primary text-white"
                : "bg-white text-[#18181b] hover:bg-primary hover:text-white"
            )}
            aria-label="Toggle wishlist"
          >
            <Heart className={cn("w-3.5 h-3.5", isWishlisted && "fill-current")} />
          </button>
          <Link
            href={`/products/${product.slug.current}`}
            className="w-8 h-8 rounded-full bg-white text-[#18181b] hover:bg-[#1a1a2e] hover:text-white flex items-center justify-center shadow-md transition-colors"
            aria-label="Quick view"
            onClick={(e) => e.stopPropagation()}
          >
            <Eye className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Add to cart bottom */}
        <div className="absolute bottom-0 left-0 right-0 translate-y-full group-hover:translate-y-0 transition-transform duration-200">
          <button
            onClick={handleAddToCart}
            className="w-full bg-[#1a1a2e] hover:bg-primary text-white text-xs font-semibold py-2.5 flex items-center justify-center gap-2 transition-colors"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            Add to Cart
          </button>
        </div>
      </Link>

      {/* Info */}
      <div className="p-3">
        <p className="text-[10px] text-[#71717a] uppercase tracking-wide mb-1">
          {product.category?.name}
        </p>
        <Link href={`/products/${product.slug.current}`}>
          <h3 className="text-sm font-medium text-[#18181b] line-clamp-1 hover:text-primary transition-colors">
            {product.name}
          </h3>
        </Link>

        {product.rating !== undefined && product.rating > 0 && (
          <div className="flex items-center gap-1 mt-1">
            <StarRating rating={product.rating} size="xs" />
            <span className="text-[10px] text-[#71717a]">({product.reviewCount ?? 0})</span>
          </div>
        )}

        <div className="flex items-center gap-2 mt-2">
          <span className="text-sm font-semibold text-[#18181b]">
            {formatPrice(product.price)}
          </span>
          {product.compareAtPrice && (
            <span className="text-xs text-[#71717a] line-through">
              {formatPrice(product.compareAtPrice)}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}