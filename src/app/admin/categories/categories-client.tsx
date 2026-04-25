"use client";

import { useState, useTransition } from "react";
import { createCategory, updateCategory, deleteCategory } from "@/server/actions/admin.actions";
import { showToast } from "@/lib/toast";
import { useRouter } from "next/navigation";
import { AdminField } from "@/components/admin/admin-field";

export default function AdminCategoriesClient({ categories }: { categories: any[] }) {
  const router = useRouter();
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<any | null>(null);
  const [, startTransition] = useTransition();

  async function handleCreate(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    startTransition(async () => {
      try {
        await createCategory({
          name: fd.get("name") as string,
          slug: (fd.get("name") as string).toLowerCase().replace(/\s+/g, "-"),
          description: fd.get("description") as string,
          imageUrl: fd.get("imageUrl") as string,
        });
        showToast.addedToCart("Category created", undefined, undefined);
        setShowForm(false);
        router.refresh();
      } catch (err: any) {
        showToast.error(err.message);
      }
    });
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this category? Products will be uncategorised.")) return;
    startTransition(async () => {
      await deleteCategory(id);
      showToast.removedFromCart("Category deleted");
      router.refresh();
    });
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs tracking-[0.5em] uppercase text-stone-600 mb-1">Admin</p>
          <h1 className="text-3xl font-light text-white" style={{ fontFamily: "Georgia, serif" }}>
            Categories
          </h1>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="bg-white text-stone-900 px-5 py-2.5 text-xs tracking-[0.35em] uppercase hover:bg-stone-100 transition-colors">
          + New category
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleCreate} className="bg-stone-100 border border-stone-300 p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          <AdminField label="Name" name="name" required />
          <AdminField label="Image URL" name="imageUrl" />
          <div className="md:col-span-2">
            <AdminField label="Description" name="description" />
          </div>
          <div className="md:col-span-2 flex gap-3 justify-end">
            <button type="button" onClick={() => setShowForm(false)} className="px-5 py-2.5 border border-stone-700 text-stone-400 text-xs tracking-[0.3em] uppercase hover:border-stone-500">Cancel</button>
            <button type="submit" className="px-5 py-2.5 bg-white text-stone-900 text-xs tracking-[0.35em] uppercase hover:bg-stone-100">Create</button>
          </div>
        </form>
      )}

      <div className="bg-stone-100 border border-stone-300 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-stone-800">
              {["Category", "Slug", "Products", "Actions"].map((h) => (
                <th key={h} className="px-4 py-3 text-left text-[9px] tracking-[0.4em] uppercase text-stone-600 font-normal">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-300">
            {categories.map((cat) => (
              <tr key={cat.id} className="hover:bg-stone-800/40 transition-colors">
                <td className="px-4 py-3 text-xs">{cat.name}</td>
                <td className="px-4 py-3 text-xs text-stone-500 font-mono">{cat.slug}</td>
                <td className="px-4 py-3 text-xs text-stone-400">{cat._count.products}</td>
                <td className="px-4 py-3">
                  <button onClick={() => handleDelete(cat.id)} className="text-xs tracking-[0.2em] uppercase text-red-600 hover:text-red-400 transition-colors">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}