import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { stripe } from "@/lib/stripe";

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { items, shippingAddressId } = await req.json();

  const lineItems = items.map((item: any) => ({
    price_data: {
      currency: "usd",
      product_data: {
        name: item.name,
        images: item.image ? [item.image] : [],
        metadata: {
          productId: item.productId,
          variantId: item.variantId ?? "",
          size: item.size ?? "",
          color: item.color ?? "",
        },
      },
      unit_amount: Math.round(item.price * 100), // cents
    },
    quantity: item.quantity,
  }));

  const checkoutSession = await stripe.checkout.sessions.create({
    mode: "payment",
    customer_email: session.user.email,
    line_items: lineItems,
    shipping_address_collection: {
      allowed_countries: ["US", "GB", "CA", "AU", "GH"],
    },
    metadata: {
      userId: session.user.id,
      shippingAddressId: shippingAddressId ?? "",
    },
    success_url: `${process.env.NEXT_PUBLIC_URL}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.NEXT_PUBLIC_URL}/cart`,
  });

  return NextResponse.json({ url: checkoutSession.url });
}