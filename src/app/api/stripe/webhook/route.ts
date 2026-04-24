import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import prisma from "@/lib/prisma/client";
import type Stripe from "stripe";

export async function POST(req: Request) {
  const body = await req.text();
  const sig = req.headers.get("stripe-signature")!;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err: any) {
    console.error("Webhook signature failed:", err.message);
    return NextResponse.json({ error: err.message }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;

    const lineItems = await stripe.checkout.sessions.listLineItems(
      session.id,
      { expand: ["data.price.product"] }
    );

    await prisma.order.create({
      data: {
        userId: session.metadata!.userId,
        stripeSessionId: session.id,
        stripePaymentIntentId: session.payment_intent as string,
        status: "PROCESSING",
        subtotal: (session.amount_subtotal ?? 0) / 100,
        shippingCost: (session.shipping_cost?.amount_total ?? 0) / 100,
        tax: (session.total_details?.amount_tax ?? 0) / 100,
        total: (session.amount_total ?? 0) / 100,
        shippingAddressId: session.metadata!.shippingAddressId || null,
        items: {
          create: lineItems.data.map((li) => {
            const product = li.price?.product as Stripe.Product;
            return {
              productId: product.metadata?.productId ?? "",
              variantId: product.metadata?.variantId || null,
              name: product.name,
              image: product.images?.[0] ?? "",
              price: (li.price?.unit_amount ?? 0) / 100,
              quantity: li.quantity ?? 1,
              size: product.metadata?.size || null,
              color: product.metadata?.color || null,
            };
          }),
        },
      },
    });
  }

  return NextResponse.json({ received: true });
}