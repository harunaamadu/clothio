"use server"

import { revalidatePath } from "next/cache"
import { z } from "zod"
// CHANGED: import UserRole (was Role) and updated OrderStatus (no CONFIRMED)
import prisma from "@/lib/prisma/client"
import { ok, err, requireAdminSession, type ActionResult } from "./_helpers"
import { OrderStatus, UserRole } from "@/generated/prisma/enums"
import type { AdminStats } from "@/types/admin"

export async function getAdminStatsAction(): Promise<ActionResult<AdminStats>> {
  await requireAdminSession()

  const [totalUsers, totalOrders, revenueAgg, pendingOrders, recentOrders] =
    await Promise.all([
      prisma.user.count(),
      prisma.order.count(),
      prisma.order.aggregate({
        _sum: { total: true },
        where: { status: { notIn: ["CANCELLED", "REFUNDED"] } },
      }),
      prisma.order.count({ where: { status: "PENDING" } }),
      prisma.order.findMany({
        take: 10,
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          status: true,
          total: true,
          createdAt: true,
          user: { select: { name: true, email: true } },
        },
      }),
    ])

  return ok({
    totalUsers,
    totalOrders,
    totalRevenue: revenueAgg._sum.total ?? 0,
    pendingOrders,
    recentOrders,
  })
}

// ─── List users ───────────────────────────────────────────────────────────────

export async function listUsersAction(page = 1, perPage = 20) {
  await requireAdminSession()

  const [users, total] = await Promise.all([
    prisma.user.findMany({
      skip: (page - 1) * perPage,
      take: perPage,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        // CHANGED: type is UserRole
        role: true,
        createdAt: true,
        _count: { select: { orders: true } },
      },
    }),
    prisma.user.count(),
  ])

  return ok({ users, total, page, perPage, totalPages: Math.ceil(total / perPage) })
}

// ─── Update user role ─────────────────────────────────────────────────────────

export async function updateUserRoleAction(
  userId: string,
  // CHANGED: role param type is UserRole (was Role)
  role: UserRole
): Promise<ActionResult<{ id: string; role: UserRole }>> {
  const session = await requireAdminSession()

  if (userId === session.user.id) {
    return err("You cannot change your own role.")
  }

  const user = await prisma.user.update({
    where: { id: userId },
    data: { role },
    select: { id: true, role: true },
  })

  revalidatePath("/dashboard/admin/users")
  return ok(user)
}

// ─── Delete user ──────────────────────────────────────────────────────────────

export async function deleteUserAction(userId: string): Promise<ActionResult> {
  const session = await requireAdminSession()

  if (userId === session.user.id) {
    return err("You cannot delete your own account from the admin panel.")
  }

  await prisma.user.delete({ where: { id: userId } })

  revalidatePath("/dashboard/admin/users")
  return ok(undefined)
}

// ─── List all orders ──────────────────────────────────────────────────────────

export async function listAllOrdersAction(
  page = 1,
  perPage = 20,
  status?: OrderStatus
) {
  await requireAdminSession()

  const where = status ? { status } : {}

  const [orders, total] = await Promise.all([
    prisma.order.findMany({
      where,
      skip: (page - 1) * perPage,
      take: perPage,
      orderBy: { createdAt: "desc" },
      include: {
        user: { select: { name: true, email: true } },
        // CHANGED: productName → name, imageUrl → image in items
        items: { select: { name: true, quantity: true, price: true } },
        // CHANGED: address → shippingAddress
        shippingAddress: true,
      },
    }),
    prisma.order.count({ where }),
  ])

  return ok({ orders, total, page, perPage, totalPages: Math.ceil(total / perPage) })
}

// ─── Update order status ──────────────────────────────────────────────────────

const updateOrderStatusSchema = z.object({
  orderId: z.string().min(1),
  status:  z.nativeEnum(OrderStatus),
  // REMOVED: notes field (no longer in Order model)
})

export async function updateOrderStatusAction(
  input: z.infer<typeof updateOrderStatusSchema>
): Promise<ActionResult<{ id: string; status: OrderStatus }>> {
  await requireAdminSession()

  const parsed = updateOrderStatusSchema.safeParse(input)
  if (!parsed.success) return err(parsed.error.issues[0].message)

  const order = await prisma.order.findUnique({
    where: { id: parsed.data.orderId },
    select: { id: true, status: true },
  })
  if (!order) return err("Order not found.")

  // Guard terminal states — cannot update delivered/cancelled/refunded orders
  const terminal: OrderStatus[] = ["DELIVERED", "CANCELLED", "REFUNDED"]
  if (terminal.includes(order.status)) {
    return err(`Cannot update an order that is already ${order.status.toLowerCase()}.`)
  }

  const updated = await prisma.order.update({
    where: { id: parsed.data.orderId },
    data: { status: parsed.data.status },
    select: { id: true, status: true },
  })

  revalidatePath("/dashboard/admin/orders")
  revalidatePath(`/orders/${parsed.data.orderId}`)
  return ok(updated)
}

// ─── Revenue by period ────────────────────────────────────────────────────────

export async function getRevenueByPeriodAction(days = 30) {
  await requireAdminSession()

  const since = new Date()
  since.setDate(since.getDate() - days)

  const orders = await prisma.order.findMany({
    where: {
      createdAt: { gte: since },
      status: { notIn: ["CANCELLED", "REFUNDED"] },
    },
    select: { total: true, createdAt: true },
    orderBy: { createdAt: "asc" },
  })

  // Group totals by ISO date string "YYYY-MM-DD"
  const grouped = orders.reduce<Record<string, number>>((acc, o) => {
    const day = o.createdAt.toISOString().slice(0, 10)
    acc[day] = (acc[day] ?? 0) + o.total
    return acc
  }, {})

  return ok(
    Object.entries(grouped).map(([date, revenue]) => ({ date, revenue }))
  )
}