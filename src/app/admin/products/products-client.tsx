"use client";

import { useState, useTransition } from "react";
import { createProduct, updateProduct, deleteProduct } from "@/server/actions/admin.actions";
import { showToast } from "@/lib/toast";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { formatPrice } from "@/lib/currencies";
import { AdminField } from "@/components/admin/admin-field";

export default function AdminProductsClient({ products, total, pages, categories, currentPage }: {
  products: any[]; total: number; pages: number; categories: any[]; currentPage: number;
}) {
  const router = useRouter();
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<any | null>(null);
  const [, startTransition] = useTransition();

  async function handleCreate(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    startTransition(async () => {
      try {
        await createProduct({
          name: fd.get("name") as string,
          slug: (fd.get("name") as string).toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, ""),
          description: fd.get("description") as string,
          price: Number(fd.get("price")),
          compareAt: fd.get("compareAt") ? Number(fd.get("compareAt")) : undefined,
          categoryId: fd.get("categoryId") as string,
          isFeatured: fd.get("isFeatured") === "on",
        });
        showToast.addedToCart("Product created", undefined, undefined);
        setShowForm(false);
        router.refresh();
      } catch (err: any) {
        showToast.error(err.message);
      }
    });
  }

  async function handleArchive(id: string) {
    startTransition(async () => {
      await deleteProduct(id);
      showToast.removedFromCart("Product archived");
      router.refresh();
    });
  }

  async function handleToggleFeatured(id: string, current: boolean) {
    startTransition(async () => {
      await updateProduct(id, { isFeatured: !current });
      router.refresh();
    });
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs tracking-[0.5em] uppercase text-stone-600 mb-1">Admin</p>
          <h1 className="text-3xl font-normal">
            Products <span className="text-stone-600 text-xl">({total})</span>
          </h1>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-white text-stone-900 px-5 py-2.5 text-xs tracking-[0.35em] uppercase hover:bg-stone-100 transition-colors"
        >
          + New product
        </button>
      </div>

      {/* Create form */}
      {showForm && (
        <form onSubmit={handleCreate} className="bg-stone-100 border border-stone-300 p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          <AdminField label="Name" name="name" required />
          <AdminField label="Price (USD)" name="price" type="number" required />
          <AdminField label="Compare at price" name="compareAt" type="number" />
          <div className="flex flex-col gap-1.5">
            <label className="text-[9px] tracking-[0.4em] uppercase text-stone-500">Category</label>
            <select name="categoryId" required className="bg-stone-100 border border-stone-300  text-stone-300 px-3 py-2.5 text-sm focus:outline-none focus:border-stone-500">
              {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          <div className="md:col-span-2">
            <AdminField label="Description" name="description" />
          </div>
          <div className="flex items-center gap-2">
            <input type="checkbox" name="isFeatured" id="isFeatured" className="w-4 h-4" />
            <label htmlFor="isFeatured" className="text-xs tracking-[0.3em] uppercase text-stone-400">Featured</label>
          </div>
          <div className="md:col-span-2 flex gap-3 justify-end">
            <button type="button" onClick={() => setShowForm(false)} className="px-5 py-2.5 border border-stone-700 text-stone-400 text-xs tracking-[0.3em] uppercase hover:border-stone-500 transition-colors">Cancel</button>
            <button type="submit" className="px-5 py-2.5 bg-white text-stone-900 text-xs tracking-[0.35em] uppercase hover:bg-stone-100 transition-colors">Create</button>
          </div>
        </form>
      )}

      {/* Products table */}
      <div className="bg-stone-100 border border-stone-300 overflow-x-auto">
        <table className="w-full text-sm min-w-175">
          <thead>
            <tr className="border-b border-stone-800">
              {["Product", "Category", "Price", "Stock", "Featured", "Actions"].map((h) => (
                <th key={h} className="px-4 py-3 text-left text-[9px] tracking-[0.4em] uppercase text-stone-600 font-normal">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-300">
            {products.map((p) => (
              <tr key={p.id} className="hover:bg-stone-800/40 transition-colors">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="relative w-8 h-10 shrink-0 bg-stone-300 overflow-hidden">
                      {p.images[0]?.url && <Image src={p.images[0].url} alt={p.name} fill sizes="32px" className="object-cover" />}
                    </div>
                    <span className="text-xs">{p.name}</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-xs text-stone-500">{p.category.name}</td>
                <td className="px-4 py-3 text-xs">{formatPrice(p.price, "USD")}</td>
                <td className="px-4 py-3 text-xs text-stone-400">
                  {p.variants.reduce((s: number, v: any) => s + v.stock, 0)}
                </td>
                <td className="px-4 py-3">
                  <button
                    onClick={() => handleToggleFeatured(p.id, p.isFeatured)}
                    className={`text-[9px] tracking-[0.3em] uppercase px-2 py-1 border transition-colors ${
                      p.isFeatured
                        ? "border-amber-600 text-amber-500"
                        : "border-stone-700 text-stone-600 hover:border-stone-500"
                    }`}
                  >
                    {p.isFeatured ? "Featured" : "No"}
                  </button>
                </td>
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    <Link href={`/products/${p.slug}`} target="_blank" className="text-xs tracking-[0.2em] uppercase text-stone-500 hover:text-white transition-colors">View</Link>
                    <button onClick={() => handleArchive(p.id)} className="text-xs tracking-[0.2em] uppercase text-red-600 hover:text-red-400 transition-colors">Archive</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}