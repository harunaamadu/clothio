import { adminGetUsers } from "@/server/actions/admin.actions";
import { requireAdmin } from "@/lib/admin-guard";
import AdminUsersClient from "./users-client";

export const metadata = { title: "Users — Admin" };

export default async function AdminUsersPage({ searchParams }: { searchParams: Promise<{ page?: string; search?: string }> }) {
  await requireAdmin();
  const { page, search } = await searchParams;
  const { users, total, pages } = await adminGetUsers(Number(page ?? 1), search);
  return <AdminUsersClient users={users} total={total} pages={pages} currentPage={Number(page ?? 1)} />;
}