"use server"

import { revalidatePath } from "next/cache"
import { z } from "zod"
import prisma from "@/lib/prisma/client"
import { ok, err, requireSession, type ActionResult } from "./_helpers"
import { OrderStatus } from "@/generated/prisma/enums"

// ─── Get current user's orders ────────────────────────────────────────────────

export async function getMyOrdersAction(page = 1, perPage = 10) {
  const session = await requireSession()

  const [orders, total] = await Promise.all([
    prisma.order.findMany({
      where: { userId: session.user.id },
      skip: (page - 1) * perPage,
      take: perPage,
      orderBy: { createdAt: "desc" },
      include: {
        items: {
          select: {
            id: true,
            // CHANGED: productName → name
            name: true,
            // CHANGED: imageUrl → image
            image: true,
            price: true,
            quantity: true,
            size: true,
            color: true,
          },
        },
        // CHANGED: address → shippingAddress
        shippingAddress: true,
      },
    }),
    prisma.order.count({ where: { userId: session.user.id } }),
  ])

  return ok({ orders, total, page, perPage, totalPages: Math.ceil(total / perPage) })
}

// ─── Get single order ─────────────────────────────────────────────────────────

export async function getOrderAction(orderId: string) {
  const session = await requireSession()

  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: {
      items: true,
      // CHANGED: address → shippingAddress
      shippingAddress: true,
      user: { select: { name: true, email: true } },
    },
  })

  if (!order) return err("Order not found.")

  if (order.userId !== session.user.id && session.user.role !== "ADMIN") {
    return err("You don't have permission to view this order.")
  }

  return ok(order)
}

// ─── Place order ──────────────────────────────────────────────────────────────

const placeOrderSchema = z.object({
  stripeSessionId: z.string().min(1),
  // CHANGED: stripePaymentId → stripePaymentIntentId
  stripePaymentIntentId: z.string().optional(),
  subtotal:     z.number().min(0),
  shippingCost: z.number().min(0),
  // CHANGED: taxAmount → tax
  tax:   z.number().min(0),
  total: z.number().min(0),
  // CHANGED: addressId → shippingAddressId
  shippingAddressId: z.string().optional(),
  items: z
    .array(
      z.object({
        productId: z.string(),
        variantId: z.string().optional(),
        // CHANGED: productName → name
        name:  z.string(),
        // CHANGED: imageUrl → image, now required (non-nullable in DB)
        image: z.string().min(1, "Product image is required"),
        price:    z.number().min(0),
        quantity: z.number().int().min(1),
        size:  z.string().optional(),
        color: z.string().optional(),
      })
    )
    .min(1, "Order must have at least one item"),
})

export async function placeOrderAction(
  input: z.infer<typeof placeOrderSchema>
): Promise<ActionResult<{ id: string }>> {
  const session = await requireSession()

  const parsed = placeOrderSchema.safeParse(input)
  if (!parsed.success) return err(parsed.error.issues[0].message)

  const { items, ...orderData } = parsed.data

  // Idempotency guard — prevent duplicate orders for the same Stripe session
  const existing = await prisma.order.findUnique({
    where: { stripeSessionId: orderData.stripeSessionId },
    select: { id: true },
  })
  if (existing) return ok({ id: existing.id })

  const order = await prisma.order.create({
    data: {
      ...orderData,
      userId: session.user.id,
      // CHANGED: skip CONFIRMED — orders land directly in PROCESSING
      status: "PROCESSING",
      items: {
        create: items.map((item) => ({
          productId: item.productId,
          variantId: item.variantId,
          // CHANGED: productName → name
          name:  item.name,
          // CHANGED: imageUrl → image
          image: item.image,
          price:    item.price,
          quantity: item.quantity,
          size:  item.size,
          color: item.color,
        })),
      },
    },
    select: { id: true },
  })

  revalidatePath("/orders")
  return ok({ id: order.id })
}

// ─── Cancel order ─────────────────────────────────────────────────────────────

export async function cancelOrderAction(orderId: string): Promise<ActionResult> {
  const session = await requireSession()

  const order = await prisma.order.findUnique({
    where: { id: orderId },
    select: { userId: true, status: true },
  })

  if (!order) return err("Order not found.")
  if (order.userId !== session.user.id) return err("Permission denied.")

  // CHANGED: removed CONFIRMED from cancellable set (status no longer exists)
  const cancellable: OrderStatus[] = ["PENDING", "PROCESSING"]
  if (!cancellable.includes(order.status)) {
    return err(
      `Orders with status "${order.status.toLowerCase()}" cannot be cancelled. Please contact support.`
    )
  }

  await prisma.order.update({
    where: { id: orderId },
    data: { status: "CANCELLED" },
  })

  revalidatePath("/orders")
  revalidatePath(`/orders/${orderId}`)
  return ok(undefined)
}