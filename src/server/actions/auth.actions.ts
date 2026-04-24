"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import bcrypt from "bcryptjs"
import { z } from "zod"
import prisma from "@/lib/prisma/client"
import { registerSchema } from "@/schemas/auth"
import { ok, err, requireSession, type ActionResult } from "./_helpers"

// ─── Register ─────────────────────────────────────────────────────────────────
// Used by RegisterForm via a direct server-action call (replaces fetch /api/register).

export async function registerAction(
  input: z.infer<typeof registerSchema>
): Promise<ActionResult<{ id: string; email: string }>> {
  const parsed = registerSchema.safeParse(input)
  if (!parsed.success) return err(parsed.error.issues[0].message)

  const { name, email, password } = parsed.data
  const normalizedEmail = email.toLowerCase().trim()

  const existing = await prisma.user.findUnique({
    where: { email: normalizedEmail },
    select: { id: true },
  })
  if (existing) return err("An account with this email already exists.")

  const hashedPassword = await bcrypt.hash(password, 12)

  const user = await prisma.user.create({
    data: { name: name.trim(), email: normalizedEmail, password: hashedPassword },
    select: { id: true, email: true },
  })

  return ok(user)
}

// ─── Update profile ───────────────────────────────────────────────────────────

const updateProfileSchema = z.object({
  name:  z.string().min(2, "Name must be at least 2 characters").max(50),
  image: z.string().url("Invalid image URL").optional().or(z.literal("")),
})

export async function updateProfileAction(
  input: z.infer<typeof updateProfileSchema>
): Promise<ActionResult<{ name: string | null; image: string | null }>> {
  const session = await requireSession()

  const parsed = updateProfileSchema.safeParse(input)
  if (!parsed.success) return err(parsed.error.issues[0].message)

  const updated = await prisma.user.update({
    where: { id: session.user.id },
    data: {
      name:  parsed.data.name.trim(),
      image: parsed.data.image || null,
    },
    select: { name: true, image: true },
  })

  revalidatePath("/dashboard")
  return ok(updated)
}

// ─── Update password ──────────────────────────────────────────────────────────

const updatePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Must contain at least one uppercase letter")
      .regex(/[0-9]/, "Must contain at least one number"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((d) => d.newPassword === d.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  })

export async function updatePasswordAction(
  input: z.infer<typeof updatePasswordSchema>
): Promise<ActionResult> {
  const session = await requireSession()

  const parsed = updatePasswordSchema.safeParse(input)
  if (!parsed.success) return err(parsed.error.issues[0].message)

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { password: true },
  })

  if (!user?.password) {
    return err("This account uses social sign-in and has no password to update.")
  }

  const isValid = await bcrypt.compare(parsed.data.currentPassword, user.password)
  if (!isValid) return err("Current password is incorrect.")

  if (parsed.data.currentPassword === parsed.data.newPassword) {
    return err("New password must be different from your current password.")
  }

  const hashed = await bcrypt.hash(parsed.data.newPassword, 12)

  await prisma.user.update({
    where: { id: session.user.id },
    data: { password: hashed },
  })

  return ok(undefined)
}

// ─── Delete account ───────────────────────────────────────────────────────────

export async function deleteAccountAction(
  confirmPassword: string
): Promise<ActionResult> {
  const session = await requireSession()

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { password: true },
  })

  if (user?.password) {
    const isValid = await bcrypt.compare(confirmPassword, user.password)
    if (!isValid) return err("Password is incorrect.")
  }

  await prisma.user.delete({ where: { id: session.user.id } })

  redirect("/")
}