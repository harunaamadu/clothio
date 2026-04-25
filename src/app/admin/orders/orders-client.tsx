"use client";

import { useState, useTransition } from "react";
import { updateOrderStatus } from "@/server/actions/admin.actions";
import { statusConfig, orderSteps } from "@/lib/order-status";
import { showToast } from "@/lib/toast";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { formatPrice } from "@/lib/currencies";

const allStatuses = ["PENDING", "CONFIRMED", "SHIPPED", "DELIVERED", "CANCELLED"];

export default function AdminOrdersClient({
  orders, total, pages, currentPage,
}: {
  orders: any[]; total: number; pages: number; currentPage: number;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [, startTransition] = useTransition();

  function setStatus(status: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (status === "ALL") params.delete("status");
    else params.set("status", status);
    params.delete("page");
    router.push(`/admin/orders?${params.toString()}`);
  }

  async function handleStatusChange(orderId: string, status: string) {
    startTransition(async () => {
      try {
        await updateOrderStatus(orderId, status);
        showToast.addedToCart("Order status updated", undefined, undefined);
        router.refresh();
      } catch (err: any) {
        showToast.error(err.message);
      }
    });
  }

  const activeStatus = searchParams.get("status") ?? "ALL";

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs tracking-[0.5em] uppercase text-stone-600 mb-1">Admin</p>
          <h1 className="text-3xl font-normal">
            Orders <span className="text-stone-600 text-xl">({total})</span>
          </h1>
        </div>
      </div>

      {/* Status filter */}
      <div className="flex gap-1 flex-wrap">
        {["ALL", ...allStatuses].map((s) => {
          const config = s !== "ALL" ? statusConfig[s] : null;
          return (
            <button
              key={s}
              onClick={() => setStatus(s)}
              className={`px-4 py-2 text-xs tracking-[0.3em] uppercase transition-all ${
                activeStatus === s
                  ? "bg-white text-stone-900"
                  : "bg-stone-100 border border-stone-300  text-stone-400 hover:text-inherit"
              }`}
            >
              {s === "ALL" ? "All" : config?.label}
            </button>
          );
        })}
      </div>

      {/* Table */}
      <div className="bg-stone-100 border border-stone-300 overflow-hidden overflow-x-auto">
        <table className="w-full text-sm min-w-175">
          <thead>
            <tr className="border-b border-stone-800">
              {["Order", "Customer", "Date", "Items", "Total", "Status", "Actions"].map((h) => (
                <th key={h} className="px-4 py-3 text-left text-[9px] tracking-[0.4em] uppercase text-stone-600 font-normal">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-800">
            {orders.map((order) => {
              const config = statusConfig[order.status] ?? statusConfig.PENDING;
              return (
                <tr key={order.id} className="hover:bg-stone-800/40 transition-colors">
                  <td className="px-4 py-3">
                    <Link href={`/admin/orders/${order.id}`} className="text-xs tracking-widest text-amber-500 hover:text-amber-300 transition-colors">
                      #{order.id.slice(-8).toUpperCase()}
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-xs text-stone-300">
                    <div>{order.user?.name ?? "Guest"}</div>
                    <div className="text-stone-600">{order.user?.email}</div>
                  </td>
                  <td className="px-4 py-3 text-xs text-stone-500">
                    {new Date(order.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                  </td>
                  <td className="px-4 py-3 text-xs text-stone-400">{order.items.length}</td>
                  <td className="px-4 py-3 text-xs text-white font-medium">{formatPrice(order.total, "USD")}</td>
                  <td className="px-4 py-3">
                    <span className={`flex items-center gap-1.5 text-[9px] tracking-[0.25em] uppercase ${config.color}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />
                      {config.label}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <select
                      defaultValue={order.status}
                      onChange={(e) => handleStatusChange(order.id, e.target.value)}
                      className="bg-stone-800 border border-stone-700 text-stone-300 text-xs tracking-wide px-2 py-1.5 focus:outline-none focus:border-stone-500"
                    >
                      {allStatuses.map((s) => (
                        <option key={s} value={s}>{statusConfig[s]?.label ?? s}</option>
                      ))}
                    </select>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {pages > 1 && (
        <div className="flex gap-1">
          {Array.from({ length: pages }).map((_, i) => (
            <Link
              key={i}
              href={`/admin/orders?page=${i + 1}${activeStatus !== "ALL" ? `&status=${activeStatus}` : ""}`}
              className={`w-8 h-8 flex items-center justify-center text-xs transition-all ${
                currentPage === i + 1
                  ? "bg-white text-stone-900"
                  : "bg-stone-900 border border-stone-800 text-stone-500 hover:text-white"
              }`}
            >
              {i + 1}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}