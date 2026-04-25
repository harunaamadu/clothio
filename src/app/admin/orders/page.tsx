import { getAllOrders } from "@/server/actions/admin.actions";
import { requireAdmin } from "@/lib/admin-guard";
import AdminOrdersClient from "./orders-client";

export const metadata = { title: "Orders — Admin" };

export default async function AdminOrdersPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; status?: string }>;
}) {
  await requireAdmin();
  const { page, status } = await searchParams;
  const { orders, total, pages } = await getAllOrders(Number(page ?? 1), status);
  return <AdminOrdersClient orders={orders} total={total} pages={pages} currentPage={Number(page ?? 1)} />;
}