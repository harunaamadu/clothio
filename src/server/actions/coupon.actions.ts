"use server"

import { z } from "zod"
import { ok, err, requireSession, type ActionResult } from "./_helpers"

// ─── Types ────────────────────────────────────────────────────────────────────

export interface CouponResult {
  code: string
  type: "percentage" | "fixed"
  value: number          // percentage 0-100, or fixed USD amount
  minOrderAmount?: number
  description: string
  discountAmount: number // computed against the provided subtotal
  finalTotal: number
}

// ─── Static coupon registry ───────────────────────────────────────────────────
// Replace with a database-backed coupon table when you're ready to manage
// them dynamically from the admin dashboard.

const COUPONS: Record<
  string,
  {
    type: "percentage" | "fixed"
    value: number
    minOrderAmount?: number
    description: string
    active: boolean
    usageLimit?: number
  }
> = {
  WELCOME10: {
    type: "percentage",
    value: 10,
    description: "10% off your first order",
    active: true,
  },
  SAVE20: {
    type: "percentage",
    value: 20,
    minOrderAmount: 100,
    description: "20% off orders over $100",
    active: true,
  },
  FREESHIP: {
    type: "fixed",
    value: 5.99,
    description: "Free standard shipping",
    active: true,
  },
  CLOTHIO15: {
    type: "percentage",
    value: 15,
    minOrderAmount: 50,
    description: "15% off orders over $50",
    active: true,
  },
}

// ─── Validate coupon ──────────────────────────────────────────────────────────

const applyCouponSchema = z.object({
  code: z.string().min(1, "Coupon code is required").max(30).toUpperCase(),
  subtotal: z.number().min(0),
})

export async function validateCouponAction(
  input: unknown
): Promise<ActionResult<CouponResult>> {
  await requireSession()

  const parsed = applyCouponSchema.safeParse(input)
  if (!parsed.success) return err(parsed.error.errors[0].message)

  const { code, subtotal } = parsed.data
  const coupon = COUPONS[code]

  if (!coupon || !coupon.active) {
    return err("Invalid or expired coupon code.")
  }

  if (coupon.minOrderAmount && subtotal < coupon.minOrderAmount) {
    return err(
      `This coupon requires a minimum order of $${coupon.minOrderAmount.toFixed(2)}.`
    )
  }

  const discountAmount =
    coupon.type === "percentage"
      ? Math.min((subtotal * coupon.value) / 100, subtotal)
      : Math.min(coupon.value, subtotal)

  const finalTotal = Math.max(0, subtotal - discountAmount)

  return ok({
    code,
    type: coupon.type,
    value: coupon.value,
    minOrderAmount: coupon.minOrderAmount,
    description: coupon.description,
    discountAmount: Math.round(discountAmount * 100) / 100,
    finalTotal: Math.round(finalTotal * 100) / 100,
  })
}

// ─── Remove coupon ────────────────────────────────────────────────────────────
// Stateless — just returns the original subtotal so the cart can reset.

export async function removeCouponAction(
  subtotal: number
): Promise<ActionResult<{ finalTotal: number }>> {
  await requireSession()
  return ok({ finalTotal: subtotal })
}