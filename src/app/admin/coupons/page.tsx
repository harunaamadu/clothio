import { adminGetCoupons } from "@/server/actions/admin.actions";
import { requireAdmin } from "@/lib/admin-guard";
import AdminCouponsClient from "./coupons-client";

export const metadata = { title: "Coupons — Admin" };

export default async function AdminCouponsPage() {
  await requireAdmin();
  const coupons = await adminGetCoupons();
  return <AdminCouponsClient coupons={coupons} />;
}