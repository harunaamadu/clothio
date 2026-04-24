"use client";

import { formatPrice } from "@/lib/formatters";
import { CartItem } from "./CartItem";
// import { X, ShoppingBag, ArrowRight } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  CancelIcon,
  ShoppingBag01Icon,
  ShoppingBasketCheckOut01Icon,
} from "@hugeicons/core-free-icons";

import { useCartItemCount, useCartItems, useCartSubtotal } from "@/store/cart.store";

interface CartSheetProps {
  open: boolean;
  onClose: () => void;
}

export function CartSheet({ open, onClose }: CartSheetProps) {
  const items = useCartItems();
  const itemCount = useCartItemCount();
  const subtotal = useCartSubtotal();

  return (
    <>
      {/* Backdrop */}
      {open && (
        <div
          className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm"
          onClick={onClose}
        />
      )}

      {/* Drawer */}
      <div
        className={cn(
          "fixed top-0 right-0 z-110 h-full w-full max-w-sm bg-white shadow-2xl flex flex-col transition-transform duration-300",
          open ? "translate-x-0" : "translate-x-full",
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#e4e4e7]">
          <div className="flex items-center gap-2">
            <HugeiconsIcon
              icon={ShoppingBag01Icon}
              size={24}
              color="currentColor"
              strokeWidth={1.5}
              className="w-5 h-5 text-[#1a1a2e]"
            />
            <h2 className="font-display font-semibold text-lg">
              Cart
              {itemCount > 0 && (
                <span className="ml-2 text-sm font-normal text-[#71717a]">
                  ({itemCount} {itemCount === 1 ? "item" : "items"})
                </span>
              )}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-[#f4f4f5] transition-colors"
          >
            <HugeiconsIcon
              icon={CancelIcon}
              size={24}
              color="currentColor"
              strokeWidth={1.5}
              className="w-5 h-5"
            />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-4 px-5 text-center">
              <div className="w-16 h-16 rounded-full bg-[#f4f4f5] flex items-center justify-center">
                <HugeiconsIcon
                  icon={ShoppingBag01Icon}
                  size={24}
                  color="currentColor"
                  strokeWidth={1.5}
                  className="w-7 h-7 text-[#a1a1aa]"
                />
              </div>
              <div>
                <p className="font-medium text-[#18181b] mb-1">
                  Your cart is empty
                </p>
                <p className="text-sm text-[#71717a]">
                  Add some products to get started
                </p>
              </div>
              <button
                onClick={onClose}
                className="mt-2 bg-[#1a1a2e] text-white text-sm font-medium px-6 py-2.5 hover:bg-primary transition-colors"
              >
                Continue Shopping
              </button>
            </div>
          ) : (
            <div className="divide-y divide-[#e4e4e7]">
              {items.map((item) => (
                <CartItem key={item.id} item={item} />
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t border-[#e4e4e7] px-5 py-4 space-y-4">
            {/* Subtotal */}
            <div className="space-y-2 text-sm">
              <div className="flex justify-between text-[#71717a]">
                <span>Subtotal</span>
                <span>{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between text-[#71717a]">
                <span>Shipping</span>
                <span>{subtotal >= 55 ? "Free" : formatPrice(5.99)}</span>
              </div>
              <div className="flex justify-between font-semibold text-base text-[#18181b] pt-2 border-t border-[#e4e4e7]">
                <span>Total</span>
                <span>
                  {formatPrice(subtotal + (subtotal >= 55 ? 0 : 5.99))}
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-2">
              <Link
                href="/checkout"
                onClick={onClose}
                className="flex items-center justify-center gap-2 w-full bg-[#1a1a2e] hover:bg-primary text-white font-semibold text-sm py-3 transition-colors"
              >
                Checkout
                <HugeiconsIcon
                  icon={ShoppingBasketCheckOut01Icon}
                  size={24}
                  color="currentColor"
                  strokeWidth={1.5}
                  className="w-4 h-4"
                />
              </Link>
              <Link
                href="/cart"
                onClick={onClose}
                className="flex items-center justify-center w-full border border-[#e4e4e7] hover:border-[#1a1a2e] text-[#18181b] font-medium text-sm py-3 transition-colors"
              >
                View Cart
              </Link>
            </div>

            <p className="text-[10px] text-center text-[#71717a]">
              Secure checkout · Free returns · SSL encrypted
            </p>
          </div>
        )}
      </div>
    </>
  );
}
