"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useTransition } from "react";
import { useCartStore, useCartSubtotal } from "@/store/cart.store";
import { validateCouponAction } from "@/server/actions/coupon.actions";
import { formatPrice } from "@/lib/formatters";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import type { CouponResult } from "@/server/actions/coupon.actions";
import Title from "../ui/title";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  MinusSignIcon,
  PlusSignIcon,
  Delete02Icon,
  ShoppingBag01Icon,
  ArrowRight01Icon,
  Tag01Icon,
  Tick01Icon,
} from "@hugeicons/core-free-icons";

const SHIPPING_THRESHOLD = 55;
const SHIPPING_COST = 5.99;

export function CartPageClient() {
  const subtotal = useCartSubtotal();
  const { items, updateQuantity, removeItem, clearCart } = useCartStore();
  const [couponCode, setCouponCode] = useState("");
  const [coupon, setCoupon] = useState<CouponResult | null>(null);
  const [couponError, setCouponError] = useState("");
  const [applyingCoupon, startCoupon] = useTransition();

  const shippingCost = subtotal >= SHIPPING_THRESHOLD ? 0 : SHIPPING_COST;
  const discount = coupon?.discountAmount ?? 0;
  const total = Math.max(0, subtotal - discount + shippingCost);

  const handleApplyCoupon = () => {
    if (!couponCode.trim()) return;
    setCouponError("");
    startCoupon(async () => {
      const res = await validateCouponAction({ code: couponCode, subtotal });
      if (res.success) {
        setCoupon(res.data);
        toast.success(`Coupon applied — ${res.data.description}`);
      } else {
        setCouponError(res.error);
        setCoupon(null);
      }
    });
  };

  const handleRemoveCoupon = () => {
    setCoupon(null);
    setCouponCode("");
    setCouponError("");
  };

  /* ── Empty state ── */
  if (items.length === 0) {
    return (
      <div className="layout py-24 flex flex-col items-center gap-6 text-center">
        <div className="w-20 h-20 border border-border bg-muted flex items-center justify-center">
          <HugeiconsIcon
            icon={ShoppingBag01Icon}
            size={32}
            className="text-muted-foreground"
            color="currentColor"
            strokeWidth={1.5}
          />
        </div>
        <div className="space-y-1">
          <h1 className="font-heading text-2xl font-bold text-foreground">
            Your cart is empty
          </h1>
          <p className="text-muted-foreground text-sm">
            Add some products to get started.
          </p>
        </div>
        <Link
          href="/products"
          className="bg-primary text-primary-foreground hover:opacity-90 font-semibold text-sm px-8 py-3 transition-opacity"
        >
          Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="layout py-8 lg:py-12">
      {/* Page header */}
      <Title
        eyebrow="Your Bag"
        title={`My Cart (${items.reduce((s, i) => s + i.quantity, 0)} items)`}
        button
        buttonLabel="Clear all"
        buttonIcon="bin"
        buttonAction={clearCart}
      />

      <div className="grid lg:grid-cols-[1fr_380px] gap-12">
        {/* ── Item list ── */}
        <div>
          {/* Column headers */}
          <div className="hidden md:grid grid-cols-[2fr_1fr_1fr_1fr] gap-4 pb-3 border-b border-border text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            <span>Product</span>
            <span className="text-center">Price</span>
            <span className="text-center">Quantity</span>
            <span className="text-right">Total</span>
          </div>

          {items.map((item) => (
            <div
              key={item.id}
              className="grid grid-cols-[auto_1fr] md:grid-cols-[2fr_1fr_1fr_1fr] gap-4 py-5 border-b border-border items-center"
            >
              {/* Image + info */}
              <div className="flex gap-4 items-start col-span-2 md:col-span-1">
                <Link href={`/products/${item.slug}`} className="shrink-0">
                  <div className="relative w-16 h-20 overflow-hidden bg-muted">
                    {item.image ? (
                      <Image
                        src={item.image as string}
                        alt={item.name}
                        fill
                        sizes="64px"
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-border" />
                    )}
                  </div>
                </Link>
                <div className="min-w-0 pt-0.5">
                  <Link href={`/products/${item.slug}`}>
                    <p className="text-sm font-medium text-foreground line-clamp-2 hover:text-primary transition-colors">
                      {item.name}
                    </p>
                  </Link>
                  {(item.size || item.color) && (
                    <p className="text-xs text-muted-foreground mt-1">
                      {[item.color, item.size].filter(Boolean).join(" · ")}
                    </p>
                  )}
                  {/* Mobile price */}
                  <p className="text-sm font-semibold text-foreground mt-1.5 md:hidden">
                    {formatPrice(item.price)}
                  </p>
                </div>
              </div>

              {/* Unit price */}
              <p className="hidden md:block text-sm text-foreground text-center">
                {formatPrice(item.price)}
              </p>

              {/* Qty stepper */}
              <div className="flex items-center justify-start md:justify-center">
                <button
                  onClick={() => updateQuantity(item.id, item.quantity - 1)}
                  className="w-8 h-8 border border-border flex items-center justify-center hover:border-foreground transition-colors"
                  aria-label="Decrease"
                >
                  <HugeiconsIcon icon={MinusSignIcon} size={12} color="currentColor" strokeWidth={2} />
                </button>
                <span className="w-9 h-8 border-t border-b border-border flex items-center justify-center text-sm font-medium">
                  {item.quantity}
                </span>
                <button
                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                  disabled={item.quantity >= item.stock}
                  className="w-8 h-8 border border-border flex items-center justify-center hover:border-foreground disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                  aria-label="Increase"
                >
                  <HugeiconsIcon icon={PlusSignIcon} size={12} color="currentColor" strokeWidth={2} />
                </button>
              </div>

              {/* Line total + remove (desktop) */}
              <div className="hidden md:flex items-center justify-end gap-4">
                <span className="text-sm font-semibold text-foreground">
                  {formatPrice(item.price * item.quantity)}
                </span>
                <button
                  onClick={() => removeItem(item.id)}
                  className="text-muted-foreground hover:text-destructive transition-colors"
                  aria-label="Remove item"
                >
                  <HugeiconsIcon icon={Delete02Icon} size={16} color="currentColor" strokeWidth={1.5} />
                </button>
              </div>

              {/* Mobile remove */}
              <button
                onClick={() => removeItem(item.id)}
                className="md:hidden text-muted-foreground hover:text-destructive transition-colors justify-self-end"
                aria-label="Remove item"
              >
                <HugeiconsIcon icon={Delete02Icon} size={16} color="currentColor" strokeWidth={1.5} />
              </button>
            </div>
          ))}
        </div>

        {/* ── Order summary ── */}
        <div className="lg:sticky lg:top-24">
          <div className="border border-border p-6 space-y-5 bg-card">
            <h2 className="font-heading font-semibold text-lg text-foreground border-b border-border pb-4">
              Order Summary
            </h2>

            {/* Free-shipping progress */}
            {subtotal < SHIPPING_THRESHOLD ? (
              <div className="space-y-2 py-1">
                <p className="text-xs text-muted-foreground">
                  Add{" "}
                  <span className="font-semibold text-foreground">
                    {formatPrice(SHIPPING_THRESHOLD - subtotal)}
                  </span>{" "}
                  more for free shipping
                </p>
                <div className="h-1 bg-muted overflow-hidden">
                  <div
                    className="h-full bg-primary transition-all duration-300"
                    style={{
                      width: `${Math.min(100, (subtotal / SHIPPING_THRESHOLD) * 100)}%`,
                    }}
                  />
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2 text-xs font-medium text-green-700 bg-green-50 px-3 py-2">
                <HugeiconsIcon icon={Tick01Icon} size={14} color="currentColor" strokeWidth={2} />
                You qualify for free shipping!
              </div>
            )}

            {/* Coupon */}
            <div className="space-y-2">
              {coupon ? (
                <div className="flex items-center justify-between border border-green-200 bg-green-50 px-3 py-2">
                  <div className="flex items-center gap-2 text-sm text-green-700">
                    <HugeiconsIcon icon={Tag01Icon} size={14} color="currentColor" strokeWidth={1.5} />
                    <span className="font-medium">{coupon.code}</span>
                    <span className="text-xs">
                      −{formatPrice(coupon.discountAmount)}
                    </span>
                  </div>
                  <button
                    onClick={handleRemoveCoupon}
                    className="text-xs text-green-600 hover:text-green-800 underline"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <div className="flex gap-0">
                  <input
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                    onKeyDown={(e) => e.key === "Enter" && handleApplyCoupon()}
                    placeholder="Coupon code"
                    className="flex-1 border border-border px-3 py-2 text-sm outline-none focus:border-foreground transition-colors placeholder:text-muted-foreground bg-background"
                  />
                  <button
                    onClick={handleApplyCoupon}
                    disabled={applyingCoupon || !couponCode.trim()}
                    className="bg-primary text-primary-foreground text-sm font-medium px-4 py-2 hover:opacity-90 disabled:opacity-50 transition-opacity shrink-0"
                  >
                    Apply
                  </button>
                </div>
              )}
              {couponError && (
                <p className="text-xs text-destructive">{couponError}</p>
              )}
            </div>

            {/* Totals */}
            <div className="space-y-3 text-sm border-t border-border pt-4">
              <div className="flex justify-between text-muted-foreground">
                <span>Subtotal</span>
                <span>{formatPrice(subtotal)}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-green-700 font-medium">
                  <span>Discount</span>
                  <span>−{formatPrice(discount)}</span>
                </div>
              )}
              <div className="flex justify-between text-muted-foreground">
                <span>Shipping</span>
                <span>
                  {shippingCost === 0 ? "Free" : formatPrice(shippingCost)}
                </span>
              </div>
              <div className="flex justify-between font-bold text-base text-foreground border-t border-border pt-3">
                <span>Total</span>
                <span>{formatPrice(total)}</span>
              </div>
            </div>

            <Link
              href="/checkout"
              className="flex items-center justify-center gap-2 w-full bg-primary text-primary-foreground font-semibold text-sm py-3.5 hover:opacity-90 transition-opacity"
            >
              Proceed to Checkout
              <HugeiconsIcon icon={ArrowRight01Icon} size={16} color="currentColor" strokeWidth={2} />
            </Link>

            <Link
              href="/products"
              className="flex items-center justify-center gap-1.5 w-full text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              ← Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}