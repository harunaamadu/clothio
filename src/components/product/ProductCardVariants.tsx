"use client";

import Link from "next/link";
import Image from "next/image";
import { useCartStore } from "@/store/cart.store";
import { useWishlistStore } from "@/store/wishlist.store";
import { formatPrice, calculateDiscount } from "@/lib/formatters";
import { cn } from "@/lib/utils";
import type { Product } from "@/types";
import { getImageUrl } from "@/lib/sanity/client";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  FavouriteIcon,
  ShoppingBag01Icon,
} from "@hugeicons/core-free-icons";

// ─── Star Rating ──────────────────────────────────────────────────────────────

function StarRatingInline({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <svg
          key={star}
          viewBox="0 0 20 20"
          className="w-3.5 h-3.5"
          fill={star <= Math.round(rating) ? "#f5a623" : "none"}
          stroke="#f5a623"
          strokeWidth={1.5}
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

// ─── Minimal Product Card ─────────────────────────────────────────────────────
// Layout: square image left, text right — like image 1.
// No border, no rounded corners, sharp and editorial.

interface ProductCardProps {
  product: Product;
  className?: string;
}

export function MinimalProductCard({ product, className }: ProductCardProps) {
  const { addItem } = useCartStore();
  const { toggle, has } = useWishlistStore();
  const isWishlisted = has(product._id);

  const discount = product.compareAtPrice
    ? calculateDiscount(product.price, product.compareAtPrice)
    : 0;

  const imageUrl = product.images?.[0]
    ? getImageUrl(product.images[0], 300, 300)
    : "/images/placeholder.jpg";

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
    <Link
      href={`/products/${product.slug.current}`}
      className={cn(
        "group flex items-center gap-4 bg-white p-3 border border-[#e4e4e7] hover:border-[#1a1a2e] transition-colors duration-200",
        className
      )}
    >
      {/* Square image */}
      <div className="relative w-20 h-20 shrink-0 bg-[#f4f4f5] overflow-hidden">
        <Image
          src={imageUrl}
          alt={product.name}
          fill
          sizes="80px"
          className="object-cover group-hover:scale-105 transition-transform duration-300"
        />
        {discount > 0 && (
          <span className="absolute top-1 left-1 bg-primary text-white text-[9px] font-bold px-1 py-0.5 leading-none">
            -{discount}%
          </span>
        )}
      </div>

      {/* Text */}
      <div className="flex-1 min-w-0">
        <p className="text-[10px] font-semibold uppercase tracking-widest text-[#a1a1aa] mb-0.5 truncate">
          {product.category?.name}
        </p>
        <h3 className="text-sm font-semibold text-[#18181b] leading-tight line-clamp-2 group-hover:text-primary transition-colors">
          {product.name}
        </h3>

        {/* Price row */}
        <div className="flex items-center gap-2 mt-2">
          <span className="text-sm font-bold text-primary">
            {formatPrice(product.price)}
          </span>
          {product.compareAtPrice && (
            <span className="text-xs text-[#a1a1aa] line-through">
              {formatPrice(product.compareAtPrice)}
            </span>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-col gap-1.5 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            toggle(product._id);
          }}
          className={cn(
            "w-7 h-7 flex items-center justify-center border transition-colors",
            isWishlisted
              ? "border-primary bg-primary text-white"
              : "border-[#e4e4e7] text-[#71717a] hover:border-primary hover:text-primary"
          )}
          aria-label="Wishlist"
        >
          <HugeiconsIcon
            icon={FavouriteIcon}
            size={13}
            color="currentColor"
            strokeWidth={isWishlisted ? 0 : 1.5}
            className={isWishlisted ? "fill-current" : ""}
          />
        </button>
        <button
          onClick={handleAddToCart}
          className="w-7 h-7 flex items-center justify-center border border-[#e4e4e7] text-[#71717a] hover:border-[#1a1a2e] hover:bg-[#1a1a2e] hover:text-white transition-colors"
          aria-label="Add to cart"
        >
          <HugeiconsIcon
            icon={ShoppingBag01Icon}
            size={13}
            color="currentColor"
            strokeWidth={1.5}
          />
        </button>
      </div>
    </Link>
  );
}

// ─── Best Product Card ────────────────────────────────────────────────────────
// Layout: square image left, text right with rating stars — like image 2.
// No border, no rounded corners. Strikethrough original price, sale price prominent.

export function BestProductCard({ product, className }: ProductCardProps) {
  const { addItem } = useCartStore();
  const { toggle, has } = useWishlistStore();
  const isWishlisted = has(product._id);

  const discount = product.compareAtPrice
    ? calculateDiscount(product.price, product.compareAtPrice)
    : 0;

  const imageUrl = product.images?.[0]
    ? getImageUrl(product.images[0], 300, 300)
    : "/images/placeholder.jpg";

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
    <Link
      href={`/products/${product.slug.current}`}
      className={cn(
        "group flex items-center gap-4 bg-white p-3 hover:bg-[#fafafa] transition-colors duration-200",
        className
      )}
    >
      {/* Square image — no border, soft bg */}
      <div className="relative w-20 h-20 shrink-0 bg-[#f9f9f9] overflow-hidden">
        <Image
          src={imageUrl}
          alt={product.name}
          fill
          sizes="80px"
          className="object-cover group-hover:scale-105 transition-transform duration-300"
        />
      </div>

      {/* Text */}
      <div className="flex-1 min-w-0">
        <h3 className="text-sm font-semibold text-[#18181b] leading-tight line-clamp-2 group-hover:text-primary transition-colors mb-1">
          {product.name}
        </h3>

        {/* Stars */}
        {product.rating !== undefined && product.rating > 0 ? (
          <div className="flex items-center gap-1.5 mb-1.5">
            <StarRatingInline rating={product.rating} />
            {product.reviewCount !== undefined && product.reviewCount > 0 && (
              <span className="text-[10px] text-[#a1a1aa]">
                ({product.reviewCount})
              </span>
            )}
          </div>
        ) : (
          <StarRatingInline rating={0} />
        )}

        {/* Price — strikethrough then sale price */}
        <div className="flex items-center gap-2 mt-1">
          {product.compareAtPrice && (
            <span className="text-xs text-[#a1a1aa] line-through">
              {formatPrice(product.compareAtPrice)}
            </span>
          )}
          <span
            className={cn(
              "text-sm font-bold",
              product.compareAtPrice ? "text-primary" : "text-[#18181b]"
            )}
          >
            {formatPrice(product.price)}
          </span>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-col gap-1.5 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            toggle(product._id);
          }}
          className={cn(
            "w-7 h-7 flex items-center justify-center border transition-colors",
            isWishlisted
              ? "border-primary bg-primary text-white"
              : "border-[#e4e4e7] text-[#71717a] hover:border-primary hover:text-primary"
          )}
          aria-label="Wishlist"
        >
          <HugeiconsIcon
            icon={FavouriteIcon}
            size={13}
            color="currentColor"
            strokeWidth={isWishlisted ? 0 : 1.5}
            className={isWishlisted ? "fill-current" : ""}
          />
        </button>
        <button
          onClick={handleAddToCart}
          className="w-7 h-7 flex items-center justify-center border border-[#e4e4e7] text-[#71717a] hover:border-[#1a1a2e] hover:bg-[#1a1a2e] hover:text-white transition-colors"
          aria-label="Add to cart"
        >
          <HugeiconsIcon
            icon={ShoppingBag01Icon}
            size={13}
            color="currentColor"
            strokeWidth={1.5}
          />
        </button>
      </div>
    </Link>
  );
}