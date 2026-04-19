"use client"

import { useState, useTransition } from "react"
import { useSession } from "next-auth/react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2, Pencil, Trash2, BadgeCheck } from "lucide-react"
import { StarRating } from "@/components/shared/StarRating"
import { formatRelativeDate } from "@/lib/formatters"
import { reviewSchema, type ReviewInput } from "@/schemas/checkout"
import {
  createReviewAction,
  updateReviewAction,
  deleteReviewAction,
} from "@/server/actions/review.actions"
import { cn } from "@/lib/utils"
import { toast } from "sonner"

// ─── Types ────────────────────────────────────────────────────────────────────

interface Review {
  id: string
  rating: number
  title?: string | null
  body: string
  createdAt: Date | string
  user: { name: string | null; image?: string | null }
}

interface ProductReviewsProps {
  productId: string
  reviews: Review[]
  averageRating: number
  total: number
  userReviewId?: string | null // ID of current user's review, if any
}

// ─── Rating breakdown bar ─────────────────────────────────────────────────────

function RatingBar({ star, count, total }: { star: number; count: number; total: number }) {
  const pct = total > 0 ? Math.round((count / total) * 100) : 0
  return (
    <div className="flex items-center gap-2 text-xs text-[#71717a]">
      <span className="w-3 text-right">{star}</span>
      <div className="flex-1 h-1.5 bg-[#f4f4f5] rounded-full overflow-hidden">
        <div
          className="h-full bg-[#f5a623] rounded-full transition-all duration-500"
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className="w-6 text-right">{count}</span>
    </div>
  )
}

// ─── Single review card ───────────────────────────────────────────────────────

function ReviewCard({
  review,
  isOwn,
  onEdit,
  onDelete,
}: {
  review: Review
  isOwn: boolean
  onEdit: () => void
  onDelete: () => void
}) {
  const [deleting, startDelete] = useTransition()

  return (
    <div className="py-5 border-b border-[#e4e4e7] last:border-0 space-y-2">
      <div className="flex items-start justify-between gap-3">
        {/* Avatar + name */}
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-[#1a1a2e] flex items-center justify-center shrink-0">
            {review.user.image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={review.user.image}
                alt={review.user.name ?? "User"}
                className="w-full h-full rounded-full object-cover"
              />
            ) : (
              <span className="text-white text-xs font-semibold">
                {review.user.name?.[0]?.toUpperCase() ?? "U"}
              </span>
            )}
          </div>
          <div>
            <p className="text-sm font-medium text-[#18181b] leading-none">
              {review.user.name ?? "Anonymous"}
            </p>
            <p className="text-[11px] text-[#a1a1aa] mt-0.5">
              {formatRelativeDate(review.createdAt)}
            </p>
          </div>
        </div>

        {/* Own review actions */}
        {isOwn && (
          <div className="flex gap-1">
            <button
              onClick={onEdit}
              className="p-1.5 rounded-lg text-[#71717a] hover:text-[#1a1a2e] hover:bg-[#f4f4f5] transition-colors"
              aria-label="Edit review"
            >
              <Pencil className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() =>
                startDelete(async () => {
                  const res = await deleteReviewAction(review.id)
                  if (res.success) toast.success("Review deleted")
                  else toast.error(res.error)
                  onDelete()
                })
              }
              disabled={deleting}
              className="p-1.5 rounded-lg text-[#71717a] hover:text-[#e94560] hover:bg-red-50 transition-colors"
              aria-label="Delete review"
            >
              {deleting ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Trash2 className="w-3.5 h-3.5" />
              )}
            </button>
          </div>
        )}
      </div>

      <StarRating rating={review.rating} size="sm" />

      {review.title && (
        <p className="text-sm font-semibold text-[#18181b]">{review.title}</p>
      )}
      <p className="text-sm text-[#71717a] leading-relaxed">{review.body}</p>
    </div>
  )
}

// ─── Review form ──────────────────────────────────────────────────────────────

function ReviewForm({
  productId,
  editId,
  defaultValues,
  onSuccess,
  onCancel,
}: {
  productId: string
  editId?: string
  defaultValues?: Partial<ReviewInput>
  onSuccess: () => void
  onCancel?: () => void
}) {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<ReviewInput, unknown, ReviewInput>({
    resolver: zodResolver(reviewSchema),
    defaultValues: { productId, rating: 0, ...defaultValues },
  })

  const ratingValue = watch("rating")

  const onSubmit = async (data: ReviewInput) => {
    const res = editId
      ? await updateReviewAction(editId, data)
      : await createReviewAction(data)

    if (res.success) {
      toast.success(editId ? "Review updated" : "Review posted!")
      onSuccess()
    } else {
      toast.error(res.error)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
      <input type="hidden" {...register("productId")} />

      {/* Star picker */}
      <div className="space-y-1">
        <label className="block text-sm font-medium text-[#18181b]">Your rating</label>
        <StarRating
          rating={ratingValue}
          size="lg"
          interactive
          onChange={(val) => setValue("rating", val, { shouldValidate: true })}
        />
        {errors.rating && (
          <p className="text-xs text-red-500">{errors.rating.message}</p>
        )}
      </div>

      {/* Title */}
      <div className="space-y-1.5">
        <label htmlFor="review-title" className="block text-sm font-medium text-[#18181b]">
          Title <span className="text-[#a1a1aa] font-normal">(optional)</span>
        </label>
        <input
          id="review-title"
          type="text"
          placeholder="Summarise your experience"
          {...register("title")}
          className="w-full rounded-xl border border-[#e4e4e7] bg-white px-4 py-2.5 text-sm outline-none focus:border-[#1a1a2e] focus:ring-2 focus:ring-[#1a1a2e]/10 transition-colors placeholder:text-[#a1a1aa]"
        />
      </div>

      {/* Body */}
      <div className="space-y-1.5">
        <label htmlFor="review-body" className="block text-sm font-medium text-[#18181b]">
          Review
        </label>
        <textarea
          id="review-body"
          rows={4}
          placeholder="Tell others about your experience with this product…"
          {...register("body")}
          className={cn(
            "w-full rounded-xl border bg-white px-4 py-2.5 text-sm outline-none resize-none transition-colors placeholder:text-[#a1a1aa]",
            "focus:border-[#1a1a2e] focus:ring-2 focus:ring-[#1a1a2e]/10",
            errors.body ? "border-red-400" : "border-[#e4e4e7]"
          )}
        />
        {errors.body && (
          <p className="text-xs text-red-500">{errors.body.message}</p>
        )}
      </div>

      <div className="flex gap-2">
        <button
          type="submit"
          disabled={isSubmitting}
          className="flex items-center gap-2 bg-[#1a1a2e] hover:bg-[#e94560] text-white font-semibold text-sm px-5 py-2.5 rounded-xl transition-colors disabled:opacity-60"
        >
          {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
          {isSubmitting
            ? editId ? "Saving…" : "Posting…"
            : editId ? "Save changes" : "Post review"}
        </button>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="px-5 py-2.5 text-sm font-medium text-[#71717a] hover:text-[#18181b] border border-[#e4e4e7] rounded-xl transition-colors"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  )
}

// ─── Main component ───────────────────────────────────────────────────────────

export function ProductReviews({
  productId,
  reviews: initialReviews,
  averageRating,
  total,
  userReviewId,
}: ProductReviewsProps) {
  const { data: session } = useSession()
  const [reviews, setReviews] = useState(initialReviews)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [showForm, setShowForm] = useState(false)

  const myReview = reviews.find((r) =>
    userReviewId ? r.id === userReviewId : false
  )

  // Rating distribution: count per star 1–5
  const distribution = [5, 4, 3, 2, 1].map((star) => ({
    star,
    count: reviews.filter((r) => r.rating === star).length,
  }))

  // Refresh after a mutation — re-fetch would be ideal, for now just re-sort
  const onMutate = () => {
    setShowForm(false)
    setEditingId(null)
  }

  return (
    <section className="space-y-6">
      <h2 className="font-display text-xl font-bold text-[#1a1a2e]">
        Customer Reviews
      </h2>

      {/* Summary block */}
      {total > 0 && (
        <div className="flex flex-col sm:flex-row gap-6 p-5 rounded-xl bg-[#f9f9f9] border border-[#e4e4e7]">
          {/* Big average */}
          <div className="flex flex-col items-center justify-center sm:border-r sm:border-[#e4e4e7] sm:pr-6 sm:min-w-30">
            <span className="font-display text-5xl font-bold text-[#1a1a2e]">
              {averageRating.toFixed(1)}
            </span>
            <StarRating rating={averageRating} size="md" className="mt-1" />
            <span className="text-xs text-[#71717a] mt-1">{total} reviews</span>
          </div>
          {/* Bars */}
          <div className="flex-1 space-y-2 justify-center flex flex-col">
            {distribution.map((d) => (
              <RatingBar key={d.star} star={d.star} count={d.count} total={total} />
            ))}
          </div>
        </div>
      )}

      {/* Write a review CTA */}
      {session && !myReview && !showForm && (
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 border border-[#1a1a2e] text-[#1a1a2e] hover:bg-[#1a1a2e] hover:text-white font-medium text-sm px-5 py-2.5 rounded-xl transition-colors"
        >
          <Pencil className="w-3.5 h-3.5" />
          Write a review
        </button>
      )}

      {!session && (
        <p className="text-sm text-[#71717a]">
          <a href="/login" className="font-medium text-[#e94560] hover:underline underline-offset-2">
            Sign in
          </a>{" "}
          to leave a review.
        </p>
      )}

      {/* New review form */}
      {showForm && (
        <div className="rounded-xl border border-[#e4e4e7] p-5 space-y-1">
          <h3 className="font-semibold text-sm text-[#18181b] mb-3">Your Review</h3>
          <ReviewForm
            productId={productId}
            onSuccess={onMutate}
            onCancel={() => setShowForm(false)}
          />
        </div>
      )}

      {/* Review list */}
      {reviews.length > 0 ? (
        <div className="divide-y divide-[#e4e4e7] rounded-xl border border-[#e4e4e7] px-5">
          {reviews.map((review) =>
            editingId === review.id ? (
              <div key={review.id} className="py-5">
                <ReviewForm
                  productId={productId}
                  editId={review.id}
                  defaultValues={{
                    rating: review.rating,
                    title:  review.title ?? undefined,
                    body:   review.body,
                  }}
                  onSuccess={onMutate}
                  onCancel={() => setEditingId(null)}
                />
              </div>
            ) : (
              <ReviewCard
                key={review.id}
                review={review}
                isOwn={!!userReviewId && review.id === userReviewId}
                onEdit={() => setEditingId(review.id)}
                onDelete={onMutate}
              />
            )
          )}
        </div>
      ) : (
        <p className="text-sm text-[#71717a] py-6 text-center border border-dashed border-[#e4e4e7] rounded-xl">
          No reviews yet. Be the first to share your thoughts!
        </p>
      )}
    </section>
  )
}