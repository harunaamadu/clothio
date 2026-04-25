import { getWishlist } from "@/server/actions/wishlist.actions";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import ProductCard from "@/components/shared/ProductCard";

export const metadata: Metadata = {
  title: "Wishlist — LOOK",
};

export default async function WishlistPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const wishlist = await getWishlist();

  return (
    <main className="min-h-screen bg-[#fafaf8]">
      {/* Header */}
      <div className="bg-white border-b border-stone-200">
        <div className="max-w-7xl mx-auto px-6 py-14">
          <p className="text-xs tracking-[0.5em] uppercase text-stone-400 mb-4">
            Your account
          </p>
          <div className="flex items-end justify-between">
            <h1
              className="text-5xl font-light text-stone-900 leading-none tracking-tight"
            >
              Wishlist
            </h1>
            {wishlist.length > 0 && (
              <p className="text-xs text-stone-400 tracking-widest uppercase">
                {wishlist.length} {wishlist.length === 1 ? "piece" : "pieces"}
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-16">
        {wishlist.length === 0 ? (
          /* Empty state */
          <div className="flex flex-col items-center justify-center py-32 gap-6 text-center">
            <div className="w-16 h-16 rounded-full bg-stone-100 flex items-center justify-center">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
              </svg>
            </div>
            <div>
              <p
                className="text-xl font-light text-stone-900 mb-2"
                style={{ fontFamily: "Georgia, serif" }}
              >
                Your wishlist is empty
              </p>
              <p className="text-sm text-stone-400 max-w-xs leading-relaxed">
                Save pieces you love by clicking the heart icon on any product.
              </p>
            </div>
            <Link
              href="/products"
              className="bg-stone-900 text-white px-8 py-3 text-xs tracking-[0.35em] uppercase hover:bg-stone-700 transition-colors"
            >
              Explore the collection
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-14">
            {wishlist.map(({ product }) => (
              <ProductCard
                key={product.id}
                id={product.id}
                name={product.name}
                slug={product.slug}
                price={product.price}
                compareAt={product.compareAt}
                images={product.images}
                category={product.category}
                variants={product.variants}
              />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}