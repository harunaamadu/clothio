import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import prisma from "@/lib/prisma/client";
import { formatPrice, formatDate, formatOrderStatus } from "@/lib/formatters";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  ShoppingBag01Icon,
  UserGroupIcon,
  DollarCircleIcon,
  Clock01Icon,
  ArrowRight01Icon,
  AnalyticsUpIcon,
} from "@hugeicons/core-free-icons";
import { cn } from "@/lib/utils";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Overview" };

const STATUS_STYLES: Record<string, string> = {
  PENDING:    "bg-yellow-500/10 text-yellow-400",
  PROCESSING: "bg-blue-500/10 text-blue-400",
  SHIPPED:    "bg-violet-500/10 text-violet-400",
  DELIVERED:  "bg-green-500/10 text-green-400",
  CANCELLED:  "bg-[#1a1a1a] text-[#71717a]",
  REFUNDED:   "bg-orange-500/10 text-orange-400",
};

export default async function AdminPage() {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") redirect("/access-denied");

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
        take: 8,
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          status: true,
          total: true,
          createdAt: true,
          user: { select: { name: true, email: true } },
          items: { select: { name: true }, take: 1 },
        },
      }),
    ]);

  const stats = [
    {
      label: "Total Revenue",
      value: formatPrice(revenueAgg._sum.total ?? 0),
      icon: DollarCircleIcon,
      color: "#22c55e",
    },
    {
      label: "Total Orders",
      value: totalOrders.toLocaleString(),
      icon: ShoppingBag01Icon,
      color: "#3b82f6",
    },
    {
      label: "Total Customers",
      value: totalUsers.toLocaleString(),
      icon: UserGroupIcon,
      color: "#a855f7",
    },
    {
      label: "Pending Orders",
      value: pendingOrders.toLocaleString(),
      icon: Clock01Icon,
      color: "#f59e0b",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <p className="text-xs text-[#71717a] uppercase tracking-widest font-semibold mb-1">
          Overview
        </p>
        <h1 className="text-white font-heading text-2xl font-bold">
          Dashboard
        </h1>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="border border-[#1a1a1a] bg-[#0f0f0f] p-5 space-y-4"
          >
            <div className="flex items-center justify-between">
              <div
                className="w-9 h-9 flex items-center justify-center"
                style={{ backgroundColor: `${stat.color}15` }}
              >
                <HugeiconsIcon
                  icon={stat.icon}
                  size={16}
                  color={stat.color}
                  strokeWidth={1.5}
                />
              </div>
              <HugeiconsIcon
                icon={AnalyticsUpIcon}
                size={14}
                color="#22c55e"
                strokeWidth={1.5}
              />
            </div>
            <div>
              <p className="text-2xl font-bold text-white font-heading">
                {stat.value}
              </p>
              <p className="text-xs text-[#71717a] mt-0.5">{stat.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Recent orders */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-white">Recent Orders</h2>
          <Link
            href="/admin/orders"
            className="flex items-center gap-1 text-xs text-[#71717a] hover:text-white transition-colors"
          >
            View all
            <HugeiconsIcon icon={ArrowRight01Icon} size={12} strokeWidth={2} />
          </Link>
        </div>

        <div className="border border-[#1a1a1a] overflow-hidden">
          {/* Table header */}
          <div className="grid grid-cols-[1fr_1fr_auto_auto] gap-4 px-5 py-3 border-b border-[#1a1a1a] text-[10px] font-semibold uppercase tracking-widest text-[#71717a]">
            <span>Order</span>
            <span>Customer</span>
            <span>Status</span>
            <span className="text-right">Total</span>
          </div>

          {recentOrders.length === 0 ? (
            <div className="py-12 text-center text-sm text-[#71717a]">
              No orders yet.
            </div>
          ) : (
            recentOrders.map((order) => (
              <Link
                key={order.id}
                href={`/admin/orders/${order.id}`}
                className="grid grid-cols-[1fr_1fr_auto_auto] gap-4 px-5 py-4 border-b border-[#1a1a1a] last:border-0 hover:bg-[#0f0f0f] transition-colors items-center group"
              >
                <div>
                  <p className="text-xs font-mono font-semibold text-white">
                    #{order.id.slice(-8).toUpperCase()}
                  </p>
                  <p className="text-[10px] text-[#71717a] mt-0.5">
                    {formatDate(order.createdAt)}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-white truncate">
                    {order.user.name ?? "—"}
                  </p>
                  <p className="text-[10px] text-[#71717a] truncate">
                    {order.user.email}
                  </p>
                </div>
                <span
                  className={cn(
                    "text-[10px] font-semibold uppercase tracking-wide px-2 py-1",
                    STATUS_STYLES[order.status] ?? "bg-[#1a1a1a] text-[#71717a]"
                  )}
                >
                  {formatOrderStatus(order.status)}
                </span>
                <div className="flex items-center gap-2 justify-end">
                  <span className="text-sm font-semibold text-white">
                    {formatPrice(order.total)}
                  </span>
                  <HugeiconsIcon
                    icon={ArrowRight01Icon}
                    size={13}
                    strokeWidth={2}
                    className="text-[#71717a] group-hover:text-white group-hover:translate-x-0.5 transition-all"
                  />
                </div>
              </Link>
            ))
          )}
        </div>
      </div>
    </div>
  );
}