import type { Metadata } from "next"
import { redirect } from "next/navigation"
import { auth } from "@/auth"
import Link from "next/link"
import Image from "next/image"
import { Package, ChevronRight } from "lucide-react"
import { getMyOrdersAction } from "@/server/actions/order.actions"
import { formatPrice, formatDate, formatOrderStatus } from "@/lib/formatters"
import { cn } from "@/lib/utils"

export const metadata: Metadata = { title: "My Orders" }

const STATUS_STYLES: Record<string, { bg: string; text: string }> = {
  PENDING:    { bg: "bg-yellow-50",  text: "text-yellow-800"  },
  PROCESSING: { bg: "bg-blue-50",    text: "text-blue-800"    },
  SHIPPED:    { bg: "bg-violet-50",  text: "text-violet-800"  },
  DELIVERED:  { bg: "bg-green-50",   text: "text-green-800"   },
  CANCELLED:  { bg: "bg-muted",      text: "text-muted-foreground" },
  REFUNDED:   { bg: "bg-orange-50",  text: "text-orange-800"  },
}

export default async function OrdersPage() {
  const session = await auth()
  if (!session?.user) redirect("/login?callbackUrl=/orders")

  const result = await getMyOrdersAction()
  const { orders = [] } = result.success ? result.data : {}

  /* ── Empty state ── */
  if (orders.length === 0) {
    return (
      <div className="container py-24 flex flex-col items-center gap-6 text-center">
        <div className="w-20 h-20 border border-border bg-muted flex items-center justify-center">
          <Package className="w-8 h-8 text-muted-foreground" />
        </div>
        <div className="space-y-1">
          <h1 className="font-display text-2xl font-bold text-foreground">No orders yet</h1>
          <p className="text-muted-foreground text-sm">
            When you place an order it will appear here.
          </p>
        </div>
        <Link
          href="/products"
          className="bg-primary text-primary-foreground font-semibold text-sm px-8 py-3 hover:opacity-90 transition-opacity"
        >
          Start Shopping
        </Link>
      </div>
    )
  }

  return (
    <div className="container py-8 lg:py-12">
      {/* Header */}
      <div className="pb-5 border-b border-border mb-8">
        <h1 className="font-display text-2xl md:text-3xl font-bold text-foreground">
          My Orders
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          {orders.length} {orders.length === 1 ? "order" : "orders"}
        </p>
      </div>

      <div className="space-y-3">
        {orders.map((order) => {
          const style = STATUS_STYLES[order.status] ?? STATUS_STYLES.PROCESSING
          return (
            <Link
              key={order.id}
              href={`/orders/${order.id}`}
              className="block border border-border hover:border-foreground/30 bg-card transition-colors group"
            >
              {/* Order meta row */}
              <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-3.5 border-b border-border">
                <div className="flex flex-wrap items-center gap-4 text-sm">
                  <span className="text-muted-foreground">
                    Order{" "}
                    <span className="font-mono font-semibold text-foreground">
                      #{order.id.slice(-8).toUpperCase()}
                    </span>
                  </span>
                  <span className="text-border select-none">·</span>
                  <span className="text-muted-foreground">{formatDate(order.createdAt)}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span
                    className={cn(
                      "text-xs font-semibold px-2.5 py-1 uppercase tracking-wide",
                      style.bg, style.text
                    )}
                  >
                    {formatOrderStatus(order.status)}
                  </span>
                  <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                </div>
              </div>

              {/* Items preview + total */}
              <div className="px-5 py-4 flex items-center justify-between gap-4">
                {/* Image stack */}
                <div className="flex items-center gap-3">
                  <div className="flex">
                    {order.items.slice(0, 4).map((item, i) => (
                      <div
                        key={item.id}
                        className="relative w-10 h-12 overflow-hidden bg-muted border border-background"
                        style={{ marginLeft: i > 0 ? "-6px" : "0", zIndex: 4 - i }}
                      >
                        {item.image && (
                          <Image
                            src={item.image}
                            alt={item.name}
                            fill
                            sizes="40px"
                            className="object-cover"
                          />
                        )}
                      </div>
                    ))}
                  </div>
                  {order.items.length > 4 && (
                    <span className="text-xs text-muted-foreground">
                      +{order.items.length - 4} more
                    </span>
                  )}
                  <div className="hidden sm:block ml-1">
                    <p className="text-sm font-medium text-foreground line-clamp-1">
                      {order.items[0]?.name}
                      {order.items.length > 1 && ` + ${order.items.length - 1} more`}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {order.items.length}{" "}
                      {order.items.length === 1 ? "item" : "items"}
                    </p>
                  </div>
                </div>

                {/* Total */}
                <div className="text-right shrink-0">
                  <p className="font-bold text-foreground">{formatPrice(order.total)}</p>
                  <p className="text-xs text-muted-foreground">incl. tax & shipping</p>
                </div>
              </div>
            </Link>
          )
        })}
      </div>
    </div>
  )
}