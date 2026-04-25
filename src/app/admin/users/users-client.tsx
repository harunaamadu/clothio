"use client";

import { useState, useTransition } from "react";
import { updateUserRole, deleteUser } from "@/server/actions/admin.actions";
import { showToast } from "@/lib/toast";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function AdminUsersClient({ users, total, pages, currentPage }: {
  users: any[]; total: number; pages: number; currentPage: number;
}) {
  const router = useRouter();
  const [, startTransition] = useTransition();

  async function handleRoleChange(userId: string, role: "CUSTOMER" | "ADMIN") {
    startTransition(async () => {
      await updateUserRole(userId, role);
      showToast.addedToCart("Role updated", undefined, undefined);
      router.refresh();
    });
  }

  async function handleDelete(userId: string, name: string) {
    if (!confirm(`Delete ${name}? This cannot be undone.`)) return;
    startTransition(async () => {
      await deleteUser(userId);
      showToast.removedFromCart("User deleted");
      router.refresh();
    });
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <p className="text-xs tracking-[0.5em] uppercase text-stone-600 mb-1">Admin</p>
        <h1 className="text-3xl font-normal">
          Users <span className="text-stone-600 text-xl">({total})</span>
        </h1>
      </div>

      <div className="bg-stone-100 border border-stone-300 overflow-x-auto">
        <table className="w-full text-sm min-w-150">
          <thead>
            <tr className="border-b border-stone-800">
              {["User", "Joined", "Orders", "Reviews", "Role", "Actions"].map((h) => (
                <th key={h} className="px-4 py-3 text-left text-[9px] tracking-[0.4em] uppercase text-stone-600 font-normal">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-300">
            {users.map((user) => (
              <tr key={user.id} className="hover:bg-stone-800/10 transition-colors">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="w-7 h-7 rounded-full bg-stone-700 overflow-hidden flex items-center justify-center shrink-0">
                      {user.image
                        ? <Image src={user.image} alt={user.name ?? ""} width={28} height={28} className="object-cover" />
                        : <span className="text-xs text-stone-400">{user.name?.[0]?.toUpperCase() ?? "?"}</span>
                      }
                    </div>
                    <div>
                      <p className="text-xs">{user.name ?? "—"}</p>
                      <p className="text-xs text-stone-500">{user.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 text-xs text-stone-500">
                  {new Date(user.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                </td>
                <td className="px-4 py-3 text-xs text-stone-400">{user._count.orders}</td>
                <td className="px-4 py-3 text-xs text-stone-400">{user._count.reviews}</td>
                <td className="px-4 py-3">
                  <select
                    defaultValue={user.role}
                    onChange={(e) => handleRoleChange(user.id, e.target.value as any)}
                    className="bg-stone-100 border border-stone-300 text-xs tracking-wide px-2 py-1.5 focus:outline-none focus:border-stone-500"
                  >
                    <option value="CUSTOMER">Customer</option>
                    <option value="ADMIN">Admin</option>
                  </select>
                </td>
                <td className="px-4 py-3">
                  <button
                    onClick={() => handleDelete(user.id, user.name ?? user.email)}
                    className="text-xs tracking-[0.2em] uppercase text-red-600 hover:text-red-400 transition-colors"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {pages > 1 && (
        <div className="flex gap-1">
          {Array.from({ length: pages }).map((_, i) => (
            <Link key={i} href={`/admin/users?page=${i + 1}`}
              className={`w-8 h-8 flex items-center justify-center text-xs transition-all ${currentPage === i + 1 ? "bg-white text-stone-900" : "bg-stone-900 border border-stone-800 text-stone-500 hover:text-white"}`}>
              {i + 1}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}