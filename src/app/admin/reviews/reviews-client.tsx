"use client";

import { useTransition } from "react";
import { adminDeleteReview } from "@/server/actions/admin.actions";
import { showToast } from "@/lib/toast";
import StarRating from "@/components/shared/StarRating";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function AdminReviewsClient({ reviews, total, pages, currentPage }: {
  reviews: any[]; total: number; pages: number; currentPage: number;
}) {
  const router = useRouter();
  const [, startTransition] = useTransition();

  async function handleDelete(id: string) {
    if (!confirm("Delete this review?")) return;
    startTransition(async () => {
      await adminDeleteReview(id);
      showToast.removedFromCart("Review deleted");
      router.refresh();
    });
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <p className="text-xs tracking-[0.5em] uppercase text-stone-600 mb-1">Admin</p>
        <h1 className="text-3xl font-normal">
          Reviews <span className="text-stone-600 text-xl">({total})</span>
        </h1>
      </div>

      <div className="flex flex-col gap-3">
        {reviews.map((r) => (
          <div key={r.id} className="bg-stone-100 border border-stone-300 p-5 flex flex-col gap-3">
            <div className="flex items-start justify-between gap-4">
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-3">
                  <StarRating rating={r.rating} size="sm" />
                  <span className="text-xs tracking-[0.3em] uppercase text-stone-500">
                    {new Date(r.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                  </span>
                </div>
                {r.title && <p className="text-sm">{r.title}</p>}
                <p className="text-xs text-stone-400 leading-relaxed max-w-2xl">{r.body}</p>
              </div>
              <button onClick={() => handleDelete(r.id)} className="shrink-0 text-xs tracking-[0.2em] uppercase text-red-600 hover:text-red-400 transition-colors">
                Delete
              </button>
            </div>
            <div className="flex items-center gap-6 pt-2 border-t border-stone-800">
              <div className="text-xs text-stone-600">
                By: <span className="text-stone-400">{r.user.name ?? r.user.email}</span>
              </div>
              <div className="text-xs text-stone-600">
                Product:{" "}
                <Link href={`/products/${r.product.slug}`} target="_blank" className="text-amber-500 hover:text-amber-300 transition-colors">
                  {r.product.name}
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>

      {pages > 1 && (
        <div className="flex gap-1">
          {Array.from({ length: pages }).map((_, i) => (
            <Link key={i} href={`/admin/reviews?page=${i + 1}`}
              className={`w-8 h-8 flex items-center justify-center text-xs transition-all ${currentPage === i + 1 ? "bg-white text-stone-900" : "bg-stone-900 border border-stone-800 text-stone-500 hover:text-white"}`}>
              {i + 1}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}