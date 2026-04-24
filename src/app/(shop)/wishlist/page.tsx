import type { Metadata } from "next";
import { WishlistClient } from "@/components/wishlist/WishlistClient";

export const metadata: Metadata = {
  title: "My Wishlist",
  description: "View and manage your saved products.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function WishlistPage() {
  return (
    <main className="relative h-full w-full">
      <WishlistClient />
    </main>
  );
}