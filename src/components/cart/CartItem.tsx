"use client";

import Image from "next/image";
import Link from "next/link";
import { useCartStore } from "@/store/cart.store";
import { formatPrice } from "@/lib/formatters";
import type { CartItem as CartItemType } from "@/types";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Delete02Icon,
  MinusSignIcon,
  PlusSignIcon,
} from "@hugeicons/core-free-icons";

export function CartItem({ item }: { item: CartItemType }) {
  const { updateQuantity, removeItem } = useCartStore();

  return (
    <div className="flex gap-3 p-4">
      {/* Image */}
      <Link href={`/products/${item.slug}`} className="shrink-0">
        <div
          className="w-18 h-22 relative rounded-lg overflow-hidden bg-[#f4f4f5]"
          style={{ width: 72, height: 88 }}
        >
          {item.image ? (
            <Image
              src={item.image}
              alt={item.name}
              fill
              sizes="72px"
              className="object-cover"
            />
          ) : (
            <div className="w-full h-full bg-[#e4e4e7]" />
          )}
        </div>
      </Link>

      {/* Details */}
      <div className="flex-1 min-w-0">
        <Link href={`/products/${item.slug}`}>
          <p className="text-sm font-medium text-[#18181b] line-clamp-2 hover:text-[#e94560] transition-colors leading-snug">
            {item.name}
          </p>
        </Link>
        {(item.size || item.color) && (
          <p className="text-xs text-[#71717a] mt-0.5">
            {[item.color, item.size].filter(Boolean).join(" · ")}
          </p>
        )}
        <p className="text-sm font-semibold text-[#18181b] mt-1">
          {formatPrice(item.price)}
        </p>

        {/* Quantity */}
        <div className="flex items-center gap-2 mt-2">
          <button
            onClick={() => updateQuantity(item.id, item.quantity - 1)}
            className="w-6 h-6 rounded-full border border-[#e4e4e7] hover:border-[#1a1a2e] flex items-center justify-center transition-colors"
            aria-label="Decrease quantity"
          >
            <HugeiconsIcon
              icon={MinusSignIcon}
              size={24}
              color="currentColor"
              strokeWidth={1.5}
              className="w-3 h-3"
            />
          </button>
          <span className="text-sm font-medium w-5 text-center">
            {item.quantity}
          </span>
          <button
            onClick={() => updateQuantity(item.id, item.quantity + 1)}
            disabled={item.quantity >= item.stock}
            className="w-6 h-6 rounded-full border border-[#e4e4e7] hover:border-[#1a1a2e] flex items-center justify-center transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            aria-label="Increase quantity"
          >
            <HugeiconsIcon
              icon={PlusSignIcon}
              size={24}
              color="currentColor"
              strokeWidth={1.5}
              className="w-3 h-3"
            />
          </button>
        </div>
      </div>

      {/* Remove */}
      <div className="flex flex-col items-end justify-between">
        <button
          onClick={() => removeItem(item.id)}
          className="p-1 text-[#a1a1aa] hover:text-[#e94560] transition-colors"
          aria-label="Remove item"
        >
          <HugeiconsIcon
            icon={Delete02Icon}
            size={24}
            color="currentColor"
            strokeWidth={1.5}
            className="w-3.5 h-3.5"
          />
        </button>
        <p className="text-xs font-medium text-[#71717a]">
          {formatPrice(item.price * item.quantity)}
        </p>
      </div>
    </div>
  );
}
