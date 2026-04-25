import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { getUserOrders } from "@/server/actions/order.actions";
import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { statusConfig, orderSteps } from "@/lib/order-status";

export const metadata: Metadata = { title: "Orders — LOOK" };

export default async function OrdersPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const orders = await getUserOrders();

  return (
    <main className="min-h-screen bg-[#fafaf8]">

      {/* Header */}
      <div className="bg-white border-b border-stone-200">
        <div className="max-w-5xl mx-auto px-6 py-14">
          <p className="text-xs tracking-[0.5em] uppercase text-stone-400 mb-4">
            Your account
          </p>
          <div className="flex items-end justify-between gap-4">
            <h1
              className="text-5xl font-light text-stone-900 leading-none tracking-tight"
            >
              Orders
            </h1>
            {orders.length > 0 && (
              <p className="text-xs text-stone-400 tracking-widest uppercase pb-1">
                {orders.length} {orders.length === 1 ? "order" : "orders"}
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-12">

        {orders.length === 0 ? (
          /* Empty state */
          <div className="flex flex-col items-center justify-center py-32 gap-6 text-center">
            <div className="w-16 h-16 rounded-full bg-stone-100 flex items-center justify-center">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
                <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4zM3 6h18M16 10a4 4 0 01-8 0"/>
              </svg>
            </div>
            <div>
              <p
                className="text-xl font-light text-stone-900 mb-2"
                style={{ fontFamily: "Georgia, serif" }}
              >
                No orders yet
              </p>
              <p className="text-sm text-stone-400 max-w-xs leading-relaxed">
                When you place an order it will appear here.
              </p>
            </div>
            <Link
              href="/products"
              className="bg-stone-900 text-white px-8 py-3 text-xs tracking-[0.35em] uppercase hover:bg-stone-700 transition-colors"
            >
              Start shopping
            </Link>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {orders.map((order) => {
              const config = statusConfig[order.status] ?? statusConfig.PENDING;
              const firstImage = order.items[0]?.product.images[0]?.url;
              const extraItems = order.items.length - 3;

              return (
                <Link
                  key={order.id}
                  href={`/dashboard/orders/${order.id}`}
                  className="group bg-white border border-stone-200 hover:border-stone-400 hover:shadow-sm transition-all duration-200"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center gap-5 p-6">

                    {/* Image strip */}
                    <div className="flex -space-x-3 shrink-0">
                      {order.items.slice(0, 3).map((item, i) => (
                        <div
                          key={item.id}
                          className="relative w-14 h-18 overflow-hidden bg-stone-100 border-2 border-white"
                          style={{ zIndex: 3 - i }}
                        >
                          {item.product.images[0]?.url ? (
                            <Image
                              src={item.product.images[0].url}
                              alt={item.product.name}
                              fill
                              sizes="56px"
                              className="object-cover"
                            />
                          ) : (
                            <div className="w-full h-full bg-stone-200" />
                          )}
                        </div>
                      ))}
                      {extraItems > 0 && (
                        <div
                          className="relative w-14 h-18 bg-stone-100 border-2 border-white flex items-center justify-center"
                          style={{ zIndex: 0 }}
                        >
                          <span className="text-xs text-stone-500 tracking-wide">
                            +{extraItems}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Order info */}
                    <div className="flex-1 flex flex-col gap-1.5 min-w-0">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <p className="text-xs tracking-[0.3em] uppercase text-stone-400 mb-1">
                            Order #{order.id.slice(-8).toUpperCase()}
                          </p>
                          <p
                            className="text-base text-stone-900 font-light truncate"
                            style={{ fontFamily: "Georgia, serif" }}
                          >
                            {order.items.length === 1
                              ? order.items[0].product.name
                              : `${order.items[0].product.name} + ${order.items.length - 1} more`}
                          </p>
                        </div>

                        {/* Arrow */}
                        <svg
                          width="16" height="16" viewBox="0 0 16 16" fill="none"
                          className="shrink-0 mt-1 text-stone-300 group-hover:text-stone-900 group-hover:translate-x-1 transition-all duration-200"
                        >
                          <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </div>

                      <div className="flex flex-wrap items-center gap-4 mt-1">
                        {/* Status badge */}
                        <span className={`flex items-center gap-1.5 text-xs tracking-[0.25em] uppercase ${config.color}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />
                          {config.label}
                        </span>

                        <span className="text-stone-200">|</span>

                        <span className="text-xs text-stone-400">
                          {new Date(order.createdAt).toLocaleDateString("en-GB", {
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                          })}
                        </span>

                        <span className="text-stone-200">|</span>

                        <span className="text-xs text-stone-700 font-medium">
                          ${order.total.toFixed(2)}
                        </span>

                        <span className="text-stone-200">|</span>

                        <span className="text-xs text-stone-400">
                          {order.items.reduce((s, i) => s + i.quantity, 0)}{" "}
                          {order.items.reduce((s, i) => s + i.quantity, 0) === 1 ? "item" : "items"}
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}