import { adminGetCategories } from "@/server/actions/admin.actions";
import { requireAdmin } from "@/lib/admin-guard";
import AdminCategoriesClient from "./categories-client";

export const metadata = { title: "Categories — Admin" };

export default async function AdminCategoriesPage() {
  await requireAdmin();
  const categories = await adminGetCategories();
  return <AdminCategoriesClient categories={categories} />;
}