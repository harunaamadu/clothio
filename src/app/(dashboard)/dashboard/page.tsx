import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import prisma from "@/lib/prisma/client";
import { formatPrice, formatDate, formatOrderStatus } from "@/lib/formatters";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  ShoppingBag01Icon,
  FavouriteIcon,
  Location01Icon,
  ArrowRight01Icon,
} from "@hugeicons/core-free-icons";
import { cn } from "@/lib/utils";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Overview" };

const STATUS_STYLES: Record<string, string> = {
  PENDING:    "bg-yellow-50 text-yellow-700",
  PROCESSING: "bg-blue-50 text-blue-700",
  SHIPPED:    "bg-violet-50 text-violet-700",
  DELIVERED:  "bg-green-50 text-green-700",
  CANCELLED:  "bg-muted text-muted-foreground",
  REFUNDED:   "bg-orange-50 text-orange-700",
};

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const [orderCount, recentOrders, addressCount] = await Promise.all([
    prisma.order.count({ where: { userId: session.user.id } }),
    prisma.order.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: "desc" },
      take: 3,
      select: {
        id: true,
        status: true,
        total: true,
        createdAt: true,
        items: { select: { name: true }, take: 1 },
      },
    }),
    prisma.address.count({ where: { userId: session.user.id } }),
  ]);

  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";
  const firstName = session.user.name?.split(" ")[0] ?? "there";

  return (
    <div className="space-y-8">
      {/* Greeting */}
      <div className="border-b border-border pb-6">
        <p className="text-xs font-semibold uppercase tracking-widest text-primary mb-1">
          Dashboard
        </p>
        <h1 className="font-heading text-2xl md:text-3xl font-bold text-foreground">
          {greeting}, {firstName}!
        </h1>
        <p className="text-muted-foreground text-sm mt-1">
          Here's a quick overview of your account.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          {
            label: "Total Orders",
            value: orderCount,
            icon: ShoppingBag01Icon,
            href: "/dashboard/orders",
          },
          {
            label: "Saved Items",
            value: "—",
            icon: FavouriteIcon,
            href: "/wishlist",
            note: "From local store",
          },
          {
            label: "Addresses",
            value: addressCount,
            icon: Location01Icon,
            href: "/dashboard/addresses",
          },
        ].map((stat) => (
          <Link
            key={stat.label}
            href={stat.href}
            className="group border border-border bg-card p-5 hover:border-foreground/30 transition-colors"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="w-10 h-10 bg-muted flex items-center justify-center">
                <HugeiconsIcon
                  icon={stat.icon}
                  size={18}
                  color="currentColor"
                  strokeWidth={1.5}
                  className="text-foreground"
                />
              </div>
              <HugeiconsIcon
                icon={ArrowRight01Icon}
                size={14}
                color="currentColor"
                strokeWidth={2}
                className="text-muted-foreground group-hover:text-foreground group-hover:translate-x-0.5 transition-all"
              />
            </div>
            <p className="text-2xl font-bold text-foreground">{stat.value}</p>
            <p className="text-xs text-muted-foreground mt-0.5">{stat.label}</p>
          </Link>
        ))}
      </div>

      {/* Recent orders */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold text-foreground">Recent Orders</h2>
          <Link
            href="/dashboard/orders"
            className="text-xs text-primary hover:underline underline-offset-2 flex items-center gap-1"
          >
            View all
            <HugeiconsIcon icon={ArrowRight01Icon} size={12} strokeWidth={2} />
          </Link>
        </div>

        {recentOrders.length === 0 ? (
          <div className="border border-dashed border-border py-12 text-center">
            <p className="text-sm text-muted-foreground">No orders yet.</p>
            <Link
              href="/products"
              className="text-sm text-primary hover:underline underline-offset-2 mt-2 inline-block"
            >
              Start shopping →
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-border border border-border">
            {recentOrders.map((order) => (
              <Link
                key={order.id}
                href={`/orders/${order.id}`}
                className="flex items-center justify-between px-5 py-4 hover:bg-muted/50 transition-colors group"
              >
                <div>
                  <p className="text-sm font-medium text-foreground">
                    #{order.id.slice(-8).toUpperCase()}
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {order.items[0]?.name ?? "Order"} · {formatDate(order.createdAt)}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span
                    className={cn(
                      "text-[10px] font-semibold uppercase tracking-wide px-2 py-1",
                      STATUS_STYLES[order.status] ?? "bg-muted text-muted-foreground"
                    )}
                  >
                    {formatOrderStatus(order.status)}
                  </span>
                  <span className="text-sm font-semibold text-foreground">
                    {formatPrice(order.total)}
                  </span>
                  <HugeiconsIcon
                    icon={ArrowRight01Icon}
                    size={14}
                    strokeWidth={2}
                    className="text-muted-foreground group-hover:text-foreground group-hover:translate-x-0.5 transition-all"
                  />
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}