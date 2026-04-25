"use client";

import { useState, useTransition } from "react";
import { createCoupon, updateCoupon, deleteCoupon } from "@/server/actions/admin.actions";
import { showToast } from "@/lib/toast";
import { useRouter } from "next/navigation";
import { AdminField } from "@/components/admin/admin-field";

export default function AdminCouponsClient({ coupons }: { coupons: any[] }) {
  const router = useRouter();
  const [showForm, setShowForm] = useState(false);
  const [, startTransition] = useTransition();

  async function handleCreate(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    startTransition(async () => {
      try {
        await createCoupon({
          code: (fd.get("code") as string).toUpperCase(),
          discount: Number(fd.get("discount")),
          maxUses: fd.get("maxUses") ? Number(fd.get("maxUses")) : undefined,
          expiresAt: fd.get("expiresAt") ? new Date(fd.get("expiresAt") as string) : undefined,
        });
        showToast.addedToCart("Coupon created", undefined, undefined);
        setShowForm(false);
        router.refresh();
      } catch (err: any) {
        showToast.error(err.message);
      }
    });
  }

  async function handleToggle(id: string, current: boolean) {
    startTransition(async () => {
      await updateCoupon(id, { isActive: !current });
      router.refresh();
    });
  }

  async function handleDelete(id: string) {
    startTransition(async () => {
      await deleteCoupon(id);
      showToast.removedFromCart("Coupon deleted");
      router.refresh();
    });
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs tracking-[0.5em] uppercase text-stone-600 mb-1">Admin</p>
          <h1 className="text-3xl font-light text-white" style={{ fontFamily: "Georgia, serif" }}>Coupons</h1>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="bg-white text-stone-900 px-5 py-2.5 text-xs tracking-[0.35em] uppercase hover:bg-stone-100">
          + New coupon
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleCreate} className="bg-stone-100 border border-stone-300 p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          <AdminField label="Code (e.g. LOOK20)" name="code" required />
          <AdminField label="Discount %" name="discount" type="number" required />
          <AdminField label="Max uses (blank = unlimited)" name="maxUses" type="number" />
          <AdminField label="Expires at" name="expiresAt" type="date" />
          <div className="md:col-span-2 flex gap-3 justify-end">
            <button type="button" onClick={() => setShowForm(false)} className="px-5 py-2.5 border border-stone-700 text-stone-400 text-xs tracking-[0.3em] uppercase">Cancel</button>
            <button type="submit" className="px-5 py-2.5 bg-white text-stone-900 text-xs tracking-[0.35em] uppercase">Create</button>
          </div>
        </form>
      )}

      <div className="bg-stone-100 border border-stone-300 overflow-x-auto">
        <table className="w-full text-sm min-w-150">
          <thead>
            <tr className="border-b border-stone-800">
              {["Code", "Discount", "Uses", "Max uses", "Expires", "Status", "Actions"].map((h) => (
                <th key={h} className="px-4 py-3 text-left text-[9px] tracking-[0.4em] uppercase text-stone-600 font-normal">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-300">
            {coupons.map((c) => {
              const expired = c.expiresAt && new Date(c.expiresAt) < new Date();
              const exhausted = c.maxUses && c.uses >= c.maxUses;
              return (
                <tr key={c.id} className="hover:bg-stone-800/10 transition-colors">
                  <td className="px-4 py-3 font-mono text-xs text-amber-400">{c.code}</td>
                  <td className="px-4 py-3 text-xs">{c.discount}%</td>
                  <td className="px-4 py-3 text-xs text-stone-500">{c.uses}</td>
                  <td className="px-4 py-3 text-xs text-stone-500">{c.maxUses ?? "∞"}</td>
                  <td className="px-4 py-3 text-xs text-stone-500">
                    {c.expiresAt ? new Date(c.expiresAt).toLocaleDateString("en-GB") : "Never"}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-[9px] tracking-[0.25em] uppercase ${
                      expired || exhausted ? "text-red-500" : c.isActive ? "text-green-600" : "text-stone-500"
                    }`}>
                      {expired ? "Expired" : exhausted ? "Exhausted" : c.isActive ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="px-4 py-3 flex gap-3">
                    <button onClick={() => handleToggle(c.id, c.isActive)} className="text-xs tracking-[0.2em] uppercase text-stone-500 hover:text-white transition-colors">
                      {c.isActive ? "Disable" : "Enable"}
                    </button>
                    <button onClick={() => handleDelete(c.id)} className="text-xs tracking-[0.2em] uppercase text-red-600 hover:text-red-400 transition-colors">
                      Delete
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}