import { adminGetProducts } from "@/server/actions/admin.actions";
import { getAllCategories } from "@/server/services/product.service";
import { requireAdmin } from "@/lib/admin-guard";
import AdminProductsClient from "./products-client";

export const metadata = { title: "Products — Admin" };

export default async function AdminProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; search?: string }>;
}) {
  await requireAdmin();
  const { page, search } = await searchParams;
  const [{ products, total, pages }, categories] = await Promise.all([
    adminGetProducts(Number(page ?? 1), search),
    getAllCategories(),
  ]);
  return <AdminProductsClient products={products} total={total} pages={pages} categories={categories} currentPage={Number(page ?? 1)} />;
}