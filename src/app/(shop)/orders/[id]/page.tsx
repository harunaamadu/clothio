import type { Metadata } from "next"
import { notFound, redirect } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { auth } from "@/auth"
import { getOrderAction } from "@/server/actions/order.actions"
import { formatPrice, formatDate, formatOrderStatus } from "@/lib/formatters"
import { CancelOrderButton } from "@/components/orders/CancelOrderButton"
import { cn } from "@/lib/utils"
import {
  Package, MapPin, CreditCard, ChevronLeft,
  Truck, CheckCircle2, Clock,
} from "lucide-react"

export const metadata: Metadata = { title: "Order Details" }

const STATUS_STYLES: Record<string, { bg: string; text: string }> = {
  PENDING:    { bg: "bg-yellow-50",  text: "text-yellow-800"       },
  PROCESSING: { bg: "bg-blue-50",    text: "text-blue-800"         },
  SHIPPED:    { bg: "bg-violet-50",  text: "text-violet-800"       },
  DELIVERED:  { bg: "bg-green-50",   text: "text-green-800"        },
  CANCELLED:  { bg: "bg-muted",      text: "text-muted-foreground" },
  REFUNDED:   { bg: "bg-orange-50",  text: "text-orange-800"       },
}

const TIMELINE = [
  { status: "PENDING",    label: "Order placed",  icon: Clock        },
  { status: "PROCESSING", label: "Processing",    icon: Package      },
  { status: "SHIPPED",    label: "Shipped",       icon: Truck        },
  { status: "DELIVERED",  label: "Delivered",     icon: CheckCircle2 },
]
const TIMELINE_ORDER = ["PENDING", "PROCESSING", "SHIPPED", "DELIVERED"]

/* ── Section wrapper ── */
function Section({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn("border border-border p-5 bg-card space-y-4", className)}>
      {children}
    </div>
  )
}

/* ── Section heading ── */
function SectionHeading({ icon: Icon, children }: { icon: React.ElementType; children: React.ReactNode }) {
  return (
    <h2 className="font-semibold text-sm text-foreground flex items-center gap-2 pb-3 border-b border-border">
      <Icon className="w-4 h-4" />
      {children}
    </h2>
  )
}

export default async function OrderDetailPage({ params }: { params: { id: string } }) {
  const session = await auth()
  if (!session?.user) redirect("/login")

  const result = await getOrderAction(params.id)
  if (!result.success || !result.data) notFound()
  const order = result.data

  const stepIndex   = TIMELINE_ORDER.indexOf(order.status)
  const isCancellable = ["PENDING", "PROCESSING"].includes(order.status)
  const showTimeline  = !["CANCELLED", "REFUNDED"].includes(order.status)
  const style = STATUS_STYLES[order.status] ?? STATUS_STYLES.PROCESSING

  return (
    <div className="layout">

      {/* Back link */}
      <Link
        href="/orders"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors group"
      >
        <ChevronLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
        Back to orders
      </Link>

      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-4 pb-6 border-b border-border">
        <div>
          <h1 className="font-display text-2xl font-bold text-foreground">
            Order #{order.id.slice(-8).toUpperCase()}
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Placed on {formatDate(order.createdAt)}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span
            className={cn(
              "text-xs font-semibold px-3 py-1.5 uppercase tracking-wide",
              style.bg, style.text
            )}
          >
            {formatOrderStatus(order.status)}
          </span>
          {isCancellable && <CancelOrderButton orderId={order.id} />}
        </div>
      </div>

      {/* Timeline */}
      {showTimeline && (
        <Section>
          <SectionHeading icon={Package}>Order Progress</SectionHeading>
          <div className="relative flex items-start justify-between pt-2">
            {/* Track background */}
            <div className="absolute left-4 right-4 top-5 h-0.5 bg-border z-0" />
            {/* Track fill */}
            <div
              className="absolute left-4 top-5 h-0.5 bg-primary z-0 transition-all duration-700"
              style={{
                width: stepIndex < 0
                  ? "0%"
                  : `${(stepIndex / (TIMELINE.length - 1)) * (100 - 8)}%`,
                right: "auto",
              }}
            />

            {TIMELINE.map((t, i) => {
              const done   = i <= stepIndex
              const active = i === stepIndex
              const Icon   = t.icon
              return (
                <div key={t.status} className="flex flex-col items-center gap-2 relative z-10 w-20">
                  <div
                    className={cn(
                      "w-10 h-10 flex items-center justify-center border-2 transition-colors",
                      done
                        ? "bg-primary border-primary text-primary-foreground"
                        : "bg-card border-border text-muted-foreground",
                      active && "ring-4 ring-primary/10"
                    )}
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                  <span
                    className={cn(
                      "text-xs font-medium text-center leading-tight hidden sm:block",
                      done ? "text-foreground" : "text-muted-foreground"
                    )}
                  >
                    {t.label}
                  </span>
                </div>
              )
            })}
          </div>
        </Section>
      )}

      {/* Two-column layout */}
      <div className="grid lg:grid-cols-[1fr_300px] gap-5">

        {/* ── Items ── */}
        <Section>
          <SectionHeading icon={Package}>
            Items ({order.items.length})
          </SectionHeading>
          <div className="divide-y divide-border">
            {order.items.map((item) => (
              <div key={item.id} className="flex gap-4 py-4 first:pt-0 last:pb-0">
                <div className="relative w-16 h-20 overflow-hidden bg-muted shrink-0">
                  {item.image && (
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      sizes="64px"
                      className="object-cover"
                    />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground line-clamp-2">
                    {item.name}
                  </p>
                  {(item.size || item.color) && (
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {[item.color, item.size].filter(Boolean).join(" · ")}
                    </p>
                  )}
                  <p className="text-xs text-muted-foreground mt-1">
                    Qty: {item.quantity}
                  </p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-sm font-semibold text-foreground">
                    {formatPrice(item.price * item.quantity)}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {formatPrice(item.price)} each
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Section>

        {/* ── Right column ── */}
        <div className="space-y-4">

          {/* Shipping address */}
          {order.shippingAddress && (
            <Section>
              <SectionHeading icon={MapPin}>Shipping Address</SectionHeading>
              <div className="text-sm space-y-0.5">
                <p className="font-medium text-foreground">
                  {order.shippingAddress.name}
                </p>
                <p className="text-muted-foreground">{order.shippingAddress.line1}</p>
                {order.shippingAddress.line2 && (
                  <p className="text-muted-foreground">{order.shippingAddress.line2}</p>
                )}
                <p className="text-muted-foreground">
                  {order.shippingAddress.city}, {order.shippingAddress.state}{" "}
                  {order.shippingAddress.postalCode}
                </p>
                <p className="text-muted-foreground">{order.shippingAddress.country}</p>
              </div>
            </Section>
          )}

          {/* Payment summary */}
          <Section>
            <SectionHeading icon={CreditCard}>Payment Summary</SectionHeading>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between text-muted-foreground">
                <span>Subtotal</span>
                <span>{formatPrice(order.subtotal)}</span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>Shipping</span>
                <span>
                  {order.shippingCost === 0 ? "Free" : formatPrice(order.shippingCost)}
                </span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>Tax</span>
                <span>{formatPrice(order.tax)}</span>
              </div>
              <div className="flex justify-between font-bold text-base text-foreground border-t border-border pt-3">
                <span>Total</span>
                <span>{formatPrice(order.total)}</span>
              </div>
            </div>
          </Section>
        </div>
      </div>
    </div>
  )
}