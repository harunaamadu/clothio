"use server"

import { revalidatePath } from "next/cache"
import { z } from "zod"
// CHANGED: addressSchema now uses `name` (not fullName), no phone field
import { addressSchema } from "@/schemas/checkout"
import prisma from "@/lib/prisma/client"
import { ok, err, requireSession, type ActionResult } from "./_helpers"

// ─── Get all addresses ────────────────────────────────────────────────────────

export async function getAddressesAction() {
  const session = await requireSession()

  const addresses = await prisma.address.findMany({
    where: { userId: session.user.id },
    // CHANGED: removed createdAt from orderBy — Address no longer has timestamps
    orderBy: { isDefault: "desc" },
  })

  return ok(addresses)
}

// ─── Add address ──────────────────────────────────────────────────────────────

export async function addAddressAction(
  input: unknown
): Promise<ActionResult<{ id: string }>> {
  const session = await requireSession()

  const parsed = addressSchema.safeParse(input)
  if (!parsed.success) return err(parsed.error.errors[0].message)

  // Count existing addresses to decide whether to auto-set default
  const existingCount = await prisma.address.count({
    where: { userId: session.user.id },
  })

  const address = await prisma.address.create({
    data: {
      // parsed.data fields: name, line1, line2, city, state, postalCode, country
      ...parsed.data,
      userId:    session.user.id,
      isDefault: existingCount === 0, // first address is always default
    },
    select: { id: true },
  })

  revalidatePath("/dashboard/settings")
  revalidatePath("/checkout")
  return ok({ id: address.id })
}

// ─── Update address ───────────────────────────────────────────────────────────

export async function updateAddressAction(
  addressId: string,
  input: unknown
): Promise<ActionResult> {
  const session = await requireSession()

  const parsed = addressSchema.safeParse(input)
  if (!parsed.success) return err(parsed.error.errors[0].message)

  const address = await prisma.address.findUnique({
    where: { id: addressId },
    select: { userId: true },
  })

  if (!address)                          return err("Address not found.")
  if (address.userId !== session.user.id) return err("Permission denied.")

  await prisma.address.update({
    where: { id: addressId },
    data: parsed.data,
  })

  revalidatePath("/dashboard/settings")
  revalidatePath("/checkout")
  return ok(undefined)
}

// ─── Delete address ───────────────────────────────────────────────────────────

export async function deleteAddressAction(addressId: string): Promise<ActionResult> {
  const session = await requireSession()

  const address = await prisma.address.findUnique({
    where: { id: addressId },
    select: { userId: true, isDefault: true },
  })

  if (!address)                          return err("Address not found.")
  if (address.userId !== session.user.id) return err("Permission denied.")

  await prisma.address.delete({ where: { id: addressId } })

  // If the deleted address was the default, promote the next most-recent one
  if (address.isDefault) {
    // CHANGED: no createdAt on Address — just find any remaining address
    const next = await prisma.address.findFirst({
      where: { userId: session.user.id },
      select: { id: true },
    })
    if (next) {
      await prisma.address.update({
        where: { id: next.id },
        data: { isDefault: true },
      })
    }
  }

  revalidatePath("/dashboard/settings")
  revalidatePath("/checkout")
  return ok(undefined)
}

// ─── Set default address ──────────────────────────────────────────────────────

export async function setDefaultAddressAction(
  addressId: string
): Promise<ActionResult> {
  const session = await requireSession()

  const address = await prisma.address.findUnique({
    where: { id: addressId },
    select: { userId: true },
  })

  if (!address)                          return err("Address not found.")
  if (address.userId !== session.user.id) return err("Permission denied.")

  // Atomic: unset all → set chosen one
  await prisma.$transaction([
    prisma.address.updateMany({
      where: { userId: session.user.id },
      data:  { isDefault: false },
    }),
    prisma.address.update({
      where: { id: addressId },
      data:  { isDefault: true },
    }),
  ])

  revalidatePath("/dashboard/settings")
  revalidatePath("/checkout")
  return ok(undefined)
}

// ─── Notification preferences ─────────────────────────────────────────────────
// Stored locally (Zustand / localStorage) until a UserPreferences table is added.

const notificationPrefsSchema = z.object({
  orderUpdates: z.boolean(),
  promotions:   z.boolean(),
  newArrivals:  z.boolean(),
  reviews:      z.boolean(),
})

export type NotificationPrefs = z.infer<typeof notificationPrefsSchema>

export const DEFAULT_NOTIFICATION_PREFS: NotificationPrefs = {
  orderUpdates: true,
  promotions:   false,
  newArrivals:  false,
  reviews:      true,
}

export async function updateNotificationPrefsAction(
  input: unknown
): Promise<ActionResult<NotificationPrefs>> {
  await requireSession()

  const parsed = notificationPrefsSchema.safeParse(input)
  if (!parsed.success) return err("Invalid notification preferences.")

  // TODO: persist to UserPreferences table once added to schema
  return ok(parsed.data)
}