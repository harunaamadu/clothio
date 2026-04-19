import { z } from "zod"

// ─── Address ──────────────────────────────────────────────────────────────────
// CHANGED: fullName → name to match Address model rename in schema.prisma
// CHANGED: country defaults to "US" (mirrors Address.country @default("US"))
// REMOVED: phone — no longer in the Address model

export const addressSchema = z.object({
  name:       z.string().min(2, "Full name is required"),
  line1:      z.string().min(5, "Address line 1 is required"),
  line2:      z.string().optional(),
  city:       z.string().min(2, "City is required"),
  state:      z.string().min(2, "State / Province is required"),
  postalCode: z.string().min(3, "Postal code is required"),
  country:    z.string().min(2, "Country is required").default("US"),
})

// ─── Review ───────────────────────────────────────────────────────────────────
// CHANGED: body is now required (min 1 char) — the DB column is non-nullable
// REMOVED: verified — handled server-side, not a form field

export const reviewSchema = z.object({
  productId: z.string().min(1),
  rating:    z.number().int().min(1, "Rating required").max(5),
  title:     z.string().max(100).optional(),
  body:      z.string().min(1, "Review body is required").max(2000),
})

// ─── Cart item ────────────────────────────────────────────────────────────────
// Unchanged — used only in client-side Zustand store

export const cartItemSchema = z.object({
  productId: z.string(),
  variantId: z.string().optional(),
  quantity:  z.number().int().min(1).max(99),
  size:      z.string().optional(),
  color:     z.string().optional(),
})

export type AddressInput  = z.infer<typeof addressSchema>
export type ReviewInput   = z.infer<typeof reviewSchema>
export type CartItemInput = z.infer<typeof cartItemSchema>