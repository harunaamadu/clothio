"use server";

import { revalidatePath } from "next/cache";
import { reviewSchema } from "@/schemas/checkout";
import prisma from "@/lib/prisma/client";
import { ok, err, requireSession, type ActionResult } from "./_helpers";

// ─── Get reviews for a product ────────────────────────────────────────────────

export async function getProductReviewsAction(productId: string) {
  const reviews = await prisma.review.findMany({
    where: { productId },
    orderBy: { createdAt: "desc" },
    include: {
      user: { select: { name: true, image: true } },
    },
  });

  const avg =
    reviews.length > 0
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
      : 0;

  return ok({
    reviews,
    averageRating: Math.round(avg * 10) / 10,
    total: reviews.length,
  });
}

// ─── Get current user's review for a product ─────────────────────────────────

export async function getMyReviewAction(productId: string) {
  const session = await requireSession();

  const review = await prisma.review.findUnique({
    where: { userId_productId: { userId: session.user.id, productId } },
  });

  return ok(review);
}

// ─── Create review ────────────────────────────────────────────────────────────

export async function createReviewAction(
  input: unknown,
): Promise<ActionResult<{ id: string }>> {
  const session = await requireSession();

  const parsed = reviewSchema.safeParse(input);
  if (!parsed.success) return err(parsed.error.issues[0].message);

  // Check for a previous purchase (DELIVERED or SHIPPED) to mark as verified
  const hasPurchased = await prisma.orderItem.findFirst({
    where: {
      productId: parsed.data.productId,
      order: {
        userId: session.user.id,
        status: { in: ["DELIVERED", "SHIPPED"] },
      },
    },
    select: { id: true },
  });

  const existing = await prisma.review.findUnique({
    where: {
      userId_productId: {
        userId: session.user.id,
        productId: parsed.data.productId,
      },
    },
    select: { id: true },
  });
  if (existing) return err("You have already reviewed this product.");

  await prisma.product.upsert({
    where: { id: parsed.data.productId },
    update: {},
    create: {
      id: parsed.data.productId,
      name: "Sanity Product",
      slug: parsed.data.productId,
      price: 0,
      category: "unknown",
    },
  });

  const review = await prisma.review.create({
    data: {
      userId: session.user.id,
      productId: parsed.data.productId,
      rating: parsed.data.rating,
      title: parsed.data.title,
      // CHANGED: body is required (non-nullable) — reviewSchema enforces min(1)
      body: parsed.data.body,
      // REMOVED: verified field no longer in Review model
    },
    select: { id: true },
  });

  revalidatePath(`/products/${parsed.data.productId}`);
  return ok({ id: review.id });
}

// ─── Update review ────────────────────────────────────────────────────────────

export async function updateReviewAction(
  reviewId: string,
  input: unknown,
): Promise<ActionResult> {
  const session = await requireSession();

  const parsed = reviewSchema.safeParse(input);
  if (!parsed.success) return err(parsed.error.issues[0].message);

  const review = await prisma.review.findUnique({
    where: { id: reviewId },
    select: { userId: true, productId: true },
  });

  if (!review) return err("Review not found.");
  if (review.userId !== session.user.id) return err("Permission denied.");

  await prisma.review.update({
    where: { id: reviewId },
    data: {
      rating: parsed.data.rating,
      title: parsed.data.title,
      // CHANGED: body required
      body: parsed.data.body,
    },
  });

  revalidatePath(`/products/${review.productId}`);
  return ok(undefined);
}

// ─── Delete review ────────────────────────────────────────────────────────────

export async function deleteReviewAction(
  reviewId: string,
): Promise<ActionResult> {
  const session = await requireSession();

  const review = await prisma.review.findUnique({
    where: { id: reviewId },
    select: { userId: true, productId: true },
  });

  if (!review) return err("Review not found.");

  const isOwner = review.userId === session.user.id;
  const isAdmin = session.user.role === "ADMIN";
  if (!isOwner && !isAdmin) return err("Permission denied.");

  await prisma.review.delete({ where: { id: reviewId } });

  revalidatePath(`/products/${review.productId}`);
  return ok(undefined);
}
