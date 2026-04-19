"use server"

import { revalidatePath } from "next/cache"
import { ok, err, requireSession, type ActionResult } from "./_helpers"

// ─────────────────────────────────────────────────────────────────────────────
// CHANGED: The Wishlist Prisma model has been removed from schema.prisma.
// Wishlist state is now managed entirely client-side via the Zustand store
// (store/wishlist.store.ts) and persisted to localStorage.
//
// These server actions now act as a thin pass-through / no-op layer so that
// any existing call-sites continue to compile without changes. They confirm
// the user is authenticated but perform no DB operations.
//
// If you later add a DB-backed wishlist (e.g. for cross-device sync), replace
// the stub bodies below with real Prisma calls.
// ─────────────────────────────────────────────────────────────────────────────

// ─── Get wishlist ─────────────────────────────────────────────────────────────
// Returns an empty array — the client Zustand store is the source of truth.

export async function getWishlistAction(): Promise<ActionResult<string[]>> {
  await requireSession()
  return ok([])
}

// ─── Toggle wishlist item ─────────────────────────────────────────────────────
// No-op server-side; real toggle happens in useWishlistStore.toggle().

export async function toggleWishlistAction(
  _productId: string
): Promise<ActionResult<{ added: boolean }>> {
  await requireSession()
  // Cannot know client state server-side — always return added: true as hint
  return ok({ added: true })
}

// ─── Sync local wishlist to server ───────────────────────────────────────────
// No-op until a DB wishlist table is restored. Returns the local items as-is
// so the client store doesn't need to change its sync logic.

export async function syncWishlistAction(
  localItems: string[]
): Promise<ActionResult<string[]>> {
  await requireSession()

  if (!Array.isArray(localItems)) return err("Invalid wishlist data.")

  // Pass back the client items unchanged — no DB write
  revalidatePath("/wishlist")
  return ok(localItems)
}

// ─── Clear wishlist ───────────────────────────────────────────────────────────
// No-op; clear is handled by useWishlistStore.clear() in the client store.

export async function clearWishlistAction(): Promise<ActionResult> {
  await requireSession()
  revalidatePath("/wishlist")
  return ok(undefined)
}