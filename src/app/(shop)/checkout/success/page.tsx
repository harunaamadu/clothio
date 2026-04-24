import Link from "next/link";
import type { Metadata } from "next";
import { HugeiconsIcon } from "@hugeicons/react";
import { CheckmarkBadge03Icon } from "@hugeicons/core-free-icons";

export const metadata: Metadata = { title: "Order Confirmed" };

export default function CheckoutSuccessPage() {
  return (
    <div className="layout py-24 flex flex-col items-center gap-6 text-center">
      <div className="w-20 h-20 bg-emerald-100 border border-emerald-200/80 text-emerald-700 flex items-center justify-center">
        <span className="text-4xl">
          <HugeiconsIcon
            icon={CheckmarkBadge03Icon}
            size={48}
            color="currentColor"
            strokeWidth={2.4}
          />
        </span>
      </div>
      <div className="space-y-1">
        <h1 className="font-heading text-2xl font-bold">Order Confirmed!</h1>
        <p className="text-muted-foreground text-sm">
          Thank you for your purchase. You'll receive a confirmation email
          shortly.
        </p>
      </div>
      <div className="flex gap-3">
        <Link
          href="/orders"
          className="bg-primary text-primary-foreground font-semibold text-sm px-6 py-3 hover:opacity-90 transition-opacity"
        >
          View Orders
        </Link>
        <Link
          href="/products"
          className="border border-border text-sm font-semibold px-6 py-3 hover:border-foreground transition-colors"
        >
          Continue Shopping
        </Link>
      </div>
    </div>
  );
}
