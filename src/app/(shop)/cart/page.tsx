import type { Metadata } from "next";
import { CartPageClient } from "@/components/cart/CartPageClient";

export const metadata: Metadata = {
  title: "My Cart",
  description: "Review your selected items and proceed to checkout.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function CartPage() {
  return (
    <main className="relative h-full w-full">
      <CartPageClient />
    </main>
  );
}