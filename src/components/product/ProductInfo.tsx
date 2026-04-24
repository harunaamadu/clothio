"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ShoppingBag,
  Heart,
  Share2,
  Truck,
  RotateCcw,
  ShieldCheck,
  Minus,
  Plus,
} from "lucide-react";
import { useCartStore } from "@/store/cart.store";
import { useWishlistStore } from "@/store/wishlist.store";
import { StarRating } from "@/components/shared/StarRating";
import { formatPrice, calculateDiscount } from "@/lib/formatters";
import { getImageUrl } from "@/lib/sanity/client";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import type { Product, ProductVariant } from "@/types";
import { PortableText } from "next-sanity";

import { HugeiconsIcon } from "@hugeicons/react";
import { ShoppingBag01Icon, Tick01Icon } from "@hugeicons/core-free-icons";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { Button } from "../ui/button";

interface ProductInfoProps {
  product: Product;
  reviewCount?: number;
  averageRating?: number;
}

// All unique values for a variant dimension
function uniqueValues(variants: ProductVariant[], key: keyof ProductVariant) {
  return [...new Set(variants.map((v) => v[key]).filter(Boolean))] as string[];
}

export function ProductInfo({
  product,
  reviewCount = 0,
  averageRating = 0,
}: ProductInfoProps) {
  const { addItem } = useCartStore();
  const { toggle, has } = useWishlistStore();

  const isWishlisted = has(product._id);
  const discount = product.compareAtPrice
    ? calculateDiscount(product.price, product.compareAtPrice)
    : 0;

  const sizes = uniqueValues(product.variants ?? [], "size");
  const colors = uniqueValues(product.variants ?? [], "color");

  const [selectedSize, setSelectedSize] = useState<string>(sizes[0] ?? "");
  const [selectedColor, setSelectedColor] = useState<string>(colors[0] ?? "");
  const [quantity, setQuantity] = useState(1);

  // Matching variant for the current selection
  const activeVariant = product.variants?.find(
    (v) =>
      (!selectedSize || v.size === selectedSize) &&
      (!selectedColor || v.color === selectedColor),
  );

  const effectivePrice = activeVariant?.price ?? product.price;
  const effectiveStock = activeVariant?.stock ?? product.stock ?? 0;
  const isOutOfStock = effectiveStock === 0;

  const [addState, setAddState] = useState<"idle" | "loading" | "success">(
    "idle",
  );

  const handleAddToCart = async () => {
    if (isOutOfStock || addState !== "idle") return;

    setAddState("loading");

    // Simulate brief feedback delay
    await new Promise((r) => setTimeout(r, 500));

    const imageUrl = product.images?.[0]
      ? getImageUrl(product.images[0], 600, 750)
      : "/images/placeholder.jpg";

    addItem({
      productId: product._id,
      variantId: activeVariant?._key,
      name: product.name,
      slug: product.slug.current,
      image: imageUrl,
      price: effectivePrice,
      quantity,
      size: selectedSize || undefined,
      color: selectedColor || undefined,
      stock: effectiveStock,
    });

    setAddState("success");
    setTimeout(() => setAddState("idle"), 2000);
  };

  const handleShare = async () => {
    const url = window.location.href;
    if (navigator.share) {
      await navigator.share({ title: product.name, url }).catch(() => {});
    } else {
      await navigator.clipboard.writeText(url);
      toast.success("Link copied to clipboard");
    }
  };

  return (
    <div className="space-y-5">
      {/* Category breadcrumb */}
      {product.category && (
        <Link
          href={`/products?category=${product.category.slug.current}`}
          className="text-xs font-semibold uppercase tracking-widest text-primary hover:underline underline-offset-2"
        >
          {product.category.name}
        </Link>
      )}

      {/* Name */}
      <h1 className="font-display text-2xl md:text-3xl font-bold text-[#1a1a2e] leading-tight">
        {product.name}
      </h1>

      {/* Rating row */}
      {reviewCount > 0 && (
        <div className="flex items-center gap-2">
          <StarRating rating={averageRating} size="sm" />
          <span className="text-sm text-stone-500">
            {averageRating.toFixed(1)} · {reviewCount} review
            {reviewCount !== 1 && "s"}
          </span>
        </div>
      )}

      {/* Price */}
      <div className="flex items-baseline gap-3">
        <span className="font-display text-2xl font-bold text-[#1a1a2e]">
          {formatPrice(effectivePrice)}
        </span>
        {product.compareAtPrice && (
          <span className="text-base text-[#a1a1aa] line-through">
            {formatPrice(product.compareAtPrice)}
          </span>
        )}
        {discount > 0 && (
          <span className="text-sm font-semibold text-white bg-primary px-2 py-0.5">
            -{discount}%
          </span>
        )}
      </div>

      <hr className="border-[#e4e4e7]" />

      {/* Color picker */}
      {colors.length > 0 && (
        <div className="space-y-2">
          <p className="text-sm font-medium ">
            Color:{" "}
            <span className="font-normal text-stone-500">{selectedColor}</span>
          </p>
          <div className="flex flex-wrap gap-2">
            {colors.map((color) => {
              const variant = product.variants?.find((v) => v.color === color);
              const hex = variant?.colorHex;
              const outOfStock = (variant?.stock ?? 1) === 0;
              return (
                <button
                  key={color}
                  onClick={() => !outOfStock && setSelectedColor(color)}
                  disabled={outOfStock}
                  title={color}
                  className={cn(
                    "relative w-8 h-8 border-2 transition-all",
                    selectedColor === color
                      ? "border-[#1a1a2e] scale-110 shadow-md"
                      : "border-[#e4e4e7] hover:border-[#a1a1aa]",
                    outOfStock && "opacity-40 cursor-not-allowed",
                  )}
                  style={hex ? { backgroundColor: hex } : undefined}
                  aria-label={color}
                  aria-pressed={selectedColor === color}
                >
                  {!hex && (
                    <span className="absolute inset-0 flex items-center justify-center text-[8px] font-bold text-[#1a1a2e]">
                      {color.slice(0, 2).toUpperCase()}
                    </span>
                  )}
                  {/* Crossed-out line for out-of-stock colour */}
                  {outOfStock && (
                    <span className="absolute inset-0 flex items-center justify-center">
                      <span className="w-full h-px bg-stone-text-stone-500 rotate-45 block" />
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Size picker */}
      {sizes.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium ">
              Size:{" "}
              <span className="font-normal text-stone-500">{selectedSize}</span>
            </p>
            <button className="text-xs text-stone-500 underline underline-offset-2 hover:text-[#1a1a2e]">
              Size guide
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {sizes.map((size) => {
              const variant = product.variants?.find(
                (v) =>
                  v.size === size &&
                  (!selectedColor || v.color === selectedColor),
              );
              const outOfStock = variant ? variant.stock === 0 : false;
              return (
                <button
                  key={size}
                  onClick={() => !outOfStock && setSelectedSize(size)}
                  disabled={outOfStock}
                  className={cn(
                    "min-w-10 h-9 px-3 border text-sm font-medium transition-all",
                    selectedSize === size
                      ? "border-[#1a1a2e] bg-[#1a1a2e] text-white"
                      : "border-[#e4e4e7]  hover:border-[#1a1a2e]",
                    outOfStock &&
                      "opacity-40 cursor-not-allowed line-through text-[#a1a1aa]",
                  )}
                  aria-pressed={selectedSize === size}
                >
                  {size}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Quantity + Add to cart */}
      <div className="flex gap-3">
        {/* Quantity stepper */}
        <div className="flex items-center border border-[#e4e4e7] overflow-hidden">
          <button
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            className="w-10 h-12 flex items-center justify-center  hover:bg-[#f4f4f5] transition-colors"
            aria-label="Decrease quantity"
          >
            <Minus className="w-3.5 h-3.5" />
          </button>
          <span className="w-10 text-center text-sm font-semibold ">
            {quantity}
          </span>
          <button
            onClick={() => setQuantity((q) => Math.min(effectiveStock, q + 1))}
            disabled={quantity >= effectiveStock}
            className="w-10 h-12 flex items-center justify-center  hover:bg-[#f4f4f5] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            aria-label="Increase quantity"
          >
            <Plus className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Add to cart */}
        <Button
          size="lg"
          onClick={handleAddToCart}
          disabled={isOutOfStock || addState === "loading"}
          className={cn(
            "flex-1 gap-2 font-semibold py-6",
            addState === "success" &&
              "bg-green-500 hover:bg-green-500 text-white",
            isOutOfStock && "cursor-not-allowed",
          )}
        >
          {addState === "loading" ? (
            <>
              <LoadingSpinner size="sm" />
              Adding...
            </>
          ) : addState === "success" ? (
            <>
              <HugeiconsIcon icon={Tick01Icon} size={16} strokeWidth={1.8} />
              Added!
            </>
          ) : (
            <>
              <HugeiconsIcon
                icon={ShoppingBag01Icon}
                size={16}
                strokeWidth={1.5}
              />
              {isOutOfStock ? "Out of Stock" : "Add to Cart"}
            </>
          )}
        </Button>

        {/* Wishlist */}
        <Button
          variant="ghost"
          size="lg"
          onClick={() => toggle(product._id)}
          className={cn(
            "w-12 h-12 border flex items-center justify-center transition-colors",
            isWishlisted
              ? "border-primary bg-primary/5 text-primary"
              : "border-[#e4e4e7] text-stone-500 hover:border-primary hover:text-primary",
          )}
          aria-label="Toggle wishlist"
        >
          <Heart className={cn("w-4 h-4", isWishlisted && "fill-current")} />
        </Button>

        {/* Share */}
        <Button
          variant="ghost"
          size="lg"
          onClick={handleShare}
          className="w-12 h-12 border border-[#e4e4e7] text-stone-500 hover:border-[#1a1a2e] hover:text-[#1a1a2e] flex items-center justify-center transition-colors"
          aria-label="Share product"
        >
          <Share2 className="w-4 h-4" />
        </Button>
      </div>

      {/* Stock nudge */}
      {!isOutOfStock && effectiveStock <= 5 && (
        <p className="text-xs font-medium text-primary flex items-center gap-1">
          <span className="w-1.5 h-1.5 bg-primary animate-pulse inline-block" />
          Only {effectiveStock} left in stock
        </p>
      )}

      {/* Trust badges */}
      <div className="grid grid-cols-3 gap-2 pt-1">
        {[
          { icon: Truck, label: "Free shipping over $55" },
          { icon: RotateCcw, label: "Free 30-day returns" },
          { icon: ShieldCheck, label: "Secure checkout" },
        ].map(({ icon: Icon, label }) => (
          <div
            key={label}
            className="flex flex-col items-center gap-1.5 p-2.5 bg-[#f9f9f9] border border-[#e4e4e7] text-center"
          >
            <Icon className="w-4 h-4 text-[#1a1a2e]" />
            <span className="text-[10px] text-stone-500 leading-tight">
              {label}
            </span>
          </div>
        ))}
      </div>

      {/* Description */}
      {product.description && (
        <div className="pt-1 space-y-2">
          <h3 className="text-sm font-semibold ">Description</h3>
          <div className="text-sm text-stone-500 leading-relaxed prose prose-sm max-w-none">
            {Array.isArray(product.description) ? (
              <PortableText value={product.description} />
            ) : (
              <p>{product.description}</p>
            )}
          </div>
        </div>
      )}

      {/* Details */}
      {(product.material || product.brand || product.careInstructions) && (
        <div className="space-y-2 text-sm">
          {product.brand && (
            <div className="flex gap-3">
              <span className="text-[#a1a1aa] w-20 shrink-0">Brand</span>
              <span className=" font-medium">{product.brand}</span>
            </div>
          )}
          {product.material && (
            <div className="flex gap-3">
              <span className="text-[#a1a1aa] w-20 shrink-0">Material</span>
              <span className="">{product.material}</span>
            </div>
          )}
          {product.careInstructions && (
            <div className="flex gap-3">
              <span className="text-[#a1a1aa] w-20 shrink-0">Care</span>
              <span className="">{product.careInstructions}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
