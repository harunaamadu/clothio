import { Footer } from "@/components/shared/Footer";
import { Header } from "@/components/shared/Header";
import type { Metadata } from "next";

type DashboardRole = "user" | "admin";

function getMetadata(role: DashboardRole): Metadata {
  const siteName = process.env.WEBSITE_NAME ?? "Clothio";

  const metadataMap: Record<DashboardRole, Metadata> = {
    user: {
      title: `My Account`,
      description:
        "Manage your orders, addresses, wishlist, and account settings.",
    },
    admin: {
      title: `Admin Dashboard`,
      description: "Manage products, customers, orders, and store analytics.",
    },
  };

  return metadataMap[role];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug?: string[] }>;
}): Promise<Metadata> {
  const resolved = await params;
  const firstSegment = resolved?.slug?.[0];

  const role: DashboardRole = firstSegment === "admin" ? "admin" : "user";

  return getMetadata(role);
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main>
      <Header />
      <div className="w-full min-h-screen">{children}</div>
      <Footer />
    </main>
  );
}
