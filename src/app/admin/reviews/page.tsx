import { adminGetReviews } from "@/server/actions/admin.actions";
import { requireAdmin } from "@/lib/admin-guard";
import AdminReviewsClient from "./reviews-client";

export const metadata = { title: "Reviews — Admin" };

export default async function AdminReviewsPage({ searchParams }: { searchParams: Promise<{ page?: string }> }) {
  await requireAdmin();
  const { page } = await searchParams;
  const { reviews, total, pages } = await adminGetReviews(Number(page ?? 1));
  return <AdminReviewsClient reviews={reviews} total={total} pages={pages} currentPage={Number(page ?? 1)} />;
}