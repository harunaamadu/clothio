import { auth } from "@/auth";
import { redirect, notFound } from "next/navigation";
import { getOrderById } from "@/server/actions/order.actions";
import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Order Detail — LOOK" };

const statusConfig: Record<string, { label: string; color: string; dot: string; step: number }> = {
  PENDING:   { label: "Pending",   color: "text-amber-600",  dot: "bg-amber-400",  step: 1 },
  CONFIRMED: { label: "Confirmed", color: "text-blue-600",   dot: "bg-blue-400",   step: 2 },
  SHIPPED:   { label: "Shipped",   color: "text-violet-600", dot: "bg-violet-400", step: 3 },
  DELIVERED: { label: "Delivered", color: "text-green-600",  dot: "bg-green-400",  step: 4 },
  CANCELLED: { label: "Cancelled", color: "text-red-500",    dot: "bg-red-400",    step: 0 },
};

const steps = ["Pending", "Confirmed", "Shipped", "Delivered"];

interface OrderDetailPageProps {
  params: Promise<{ orderId: string }>;
}

export default async function OrderDetailPage({ params }: OrderDetailPageProps) {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const { orderId } = await params;
  const order = await getOrderById(orderId);
  if (!order) notFound();

  const config = statusConfig[order.status] ?? statusConfig.PENDING;
  const isCancelled = order.status === "CANCELLED";

  return (
    <main className="min-h-screen bg-[#fafaf8]">

      {/* Header */}
      <div className="bg-white border-b border-stone-200">
        <div className="max-w-5xl mx-auto px-6 py-10">
          <Link
            href="/dashboard/orders"
            className="inline-flex items-center gap-2 text-xs tracking-[0.35em] uppercase text-stone-400 hover:text-stone-900 transition-colors mb-6 group"
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="group-hover:-translate-x-0.5 transition-transform">
              <path d="M10 7H4M6 4L3 7l3 3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            All orders
          </Link>

          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <p className="text-sm tracking-[0.4em] uppercase text-stone-400 mb-2">
                Order #{order.id.slice(-8).toUpperCase()}
              </p>
              <h1
                className="text-4xl font-light text-stone-900 leading-none tracking-tight"
                style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
              >
                Order detail
              </h1>
            </div>
            <div className="flex flex-col items-start sm:items-end gap-1 pb-0.5">
              <span className={`flex items-center gap-1.5 text-sm tracking-[0.3em] uppercase font-medium ${config.color}`}>
                <span className={`w-2 h-2 rounded-full ${config.dot} animate-pulse`} />
                {config.label}
              </span>
              <p className="text-xs text-stone-400">
                Placed{" "}
                {new Date(order.createdAt).toLocaleDateString("en-GB", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-12 flex flex-col gap-8">

        {/* Progress tracker */}
        {!isCancelled && (
          <div className="bg-background border border-stone-200 p-8">
            <p className="text-sm tracking-[0.45em] uppercase text-stone-400 mb-8">
              Order progress
            </p>
            <div className="relative flex items-start justify-between">
              {/* Progress line */}
              <div className="absolute top-3.5 left-0 right-0 h-px bg-stone-100 z-0" />
              <div
                className="absolute top-3.5 left-0 h-px bg-stone-900 z-0 transition-all duration-700"
                style={{
                  width: `${((config.step - 1) / (steps.length - 1)) * 100}%`,
                }}
              />

              {steps.map((step, i) => {
                const stepNum = i + 1;
                const done = config.step >= stepNum;
                const current = config.step === stepNum;
                return (
                  <div key={step} className="relative z-10 flex flex-col items-center gap-3">
                    <div
                      className={`w-7 h-7 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${
                        done
                          ? "bg-stone-900 border-stone-900"
                          : "bg-white border-stone-200"
                      }`}
                    >
                      {done ? (
                        <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                          <path d="M1.5 5l2.5 2.5 4.5-4" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      ) : (
                        <span className="w-2 h-2 rounded-full bg-stone-200" />
                      )}
                    </div>
                    <span
                      className={`text-[9px] tracking-[0.3em] uppercase whitespace-nowrap ${
                        current
                          ? "text-stone-900 font-medium"
                          : done
                          ? "text-stone-500"
                          : "text-stone-300"
                      }`}
                    >
                      {step}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {isCancelled && (
          <div className="bg-red-50 border border-red-200 p-6 flex items-center gap-4">
            <div className="w-10 h-10 bg-red-100 flex items-center justify-center shrink-0">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M2 2l12 12M14 2L2 14" stroke="#ef4444" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            </div>
            <div>
              <p className="text-sm text-red-700 font-medium mb-0.5">Order Cancelled</p>
              <p className="text-xs text-red-500">
                This order has been cancelled. If you were charged, a refund will appear within 5–10 business days.
              </p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-8">

          {/* Left — order items */}
          <div className="flex flex-col gap-4">
            <p className="text-xs tracking-[0.45em] uppercase text-stone-400">
              {order.items.length} {order.items.length === 1 ? "item" : "items"}
            </p>

            <div className="flex flex-col gap-3">
              {order.items.map((item) => (
                <div
                  key={item.id}
                  className="flex gap-5 bg-white border border-stone-200 p-5"
                >
                  {/* Image */}
                  <Link
                    href={`/products/${item.product.slug}`}
                    className="relative w-20 h-28 shrink-0 overflow-hidden bg-stone-100"
                  >
                    {item.product.images[0]?.url ? (
                      <Image
                        src={item.product.images[0].url}
                        alt={item.product.name}
                        fill
                        sizes="80px"
                        className="object-cover hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full bg-stone-200" />
                    )}
                  </Link>

                  {/* Details */}
                  <div className="flex-1 flex flex-col gap-1.5 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="text-[9px] tracking-[0.35em] uppercase text-stone-400 mb-1">
                          {item.product.category.name}
                        </p>
                        <Link
                          href={`/products/${item.product.slug}`}
                          className="text-sm text-stone-900 hover:text-stone-600 transition-colors leading-snug"
                          style={{ fontFamily: "Georgia, serif" }}
                        >
                          {item.product.name}
                        </Link>
                      </div>
                      <p className="text-sm text-stone-900 shrink-0">
                        ${(item.price * item.quantity).toFixed(2)}
                      </p>
                    </div>

                    <div className="flex items-center gap-3 mt-auto flex-wrap">
                      <span className="text-xs text-stone-400">
                        Qty: {item.quantity}
                      </span>
                      <span className="text-stone-200">·</span>
                      <span className="text-xs text-stone-400">
                        ${item.price.toFixed(2)} each
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right — summary */}
          <div className="flex flex-col gap-4">

            {/* Order summary */}
            <div className="bg-white border border-stone-200 p-6 flex flex-col gap-4">
              <p className="text-xs tracking-[0.45em] uppercase text-stone-400">
                Summary
              </p>

              <div className="flex flex-col gap-2.5 text-sm">
                <div className="flex justify-between text-stone-500">
                  <span className="text-xs tracking-[0.3em] uppercase">Subtotal</span>
                  <span>${order.total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-stone-500">
                  <span className="text-xs tracking-[0.3em] uppercase">Shipping</span>
                  <span className="text-xs uppercase text-stone-400">Free</span>
                </div>
                <div className="h-px bg-stone-100" />
                <div className="flex justify-between text-stone-900 font-medium">
                  <span className="text-xs tracking-[0.3em] uppercase">Total</span>
                  <span>${order.total.toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* Order meta */}
            <div className="bg-white border border-stone-200 p-6 flex flex-col gap-4">
              <p className="text-xs tracking-[0.45em] uppercase text-stone-400">
                Details
              </p>
              <div className="flex flex-col gap-3">
                {[
                  { label: "Order ID", value: order.id.slice(-8).toUpperCase() },
                  {
                    label: "Date",
                    value: new Date(order.createdAt).toLocaleDateString("en-GB", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    }),
                  },
                  { label: "Status", value: config.label },
                  {
                    label: "Payment",
                    value: "Pending (Stripe coming soon)",
                  },
                ].map((row) => (
                  <div key={row.label} className="flex justify-between items-start gap-4">
                    <span className="text-xs tracking-[0.3em] uppercase text-stone-400 shrink-0">
                      {row.label}
                    </span>
                    <span className="text-xs text-stone-700 text-right">
                      {row.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col gap-2">
              <Link
                href="/products"
                className="w-full bg-stone-900 text-white py-3 text-xs tracking-[0.35em] uppercase text-center hover:bg-stone-700 transition-colors"
              >
                Continue shopping
              </Link>
              <Link
                href="/contact"
                className="w-full border border-stone-200 text-stone-500 py-3 text-xs tracking-[0.35em] uppercase text-center hover:border-stone-900 hover:text-stone-900 transition-all"
              >
                Need help?
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}