import { auth } from "@/auth"
import { redirect } from "next/navigation"
import prisma from "@/lib/prisma/client";

// ─── Shared result type ───────────────────────────────────────────────────────
// Every server action returns ActionResult<T> so callers always get a
// consistent { success, data?, error? } envelope — no thrown errors escape.

export type ActionResult<T = void> =
  | { success: true; data: T }
  | { success: false; error: string }

export function ok<T>(data: T): ActionResult<T> {
  return { success: true, data }
}

export function err(message: string): ActionResult<never> {
  return { success: false, error: message }
}

// ─── Session helpers ──────────────────────────────────────────────────────────

export async function getSession() {
  return auth()
}

export async function requireSession() {
  const session = await auth()
  if (!session?.user?.id) redirect("/login")
  return session
}

export async function requireAdminSession() {
  const session = await auth()
  if (!session?.user?.id) redirect("/login")
  if (session.user.role !== "ADMIN") redirect("/")
  return session
}

export async function getSessionUser() {
  const session = await auth()
  if (!session?.user?.id) return null
  return prisma.user.findUnique({
    where: { id: session.user.id },
    select: { id: true, name: true, email: true, image: true, role: true },
  })
}