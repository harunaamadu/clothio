import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Header } from "@/components/shared/Header";
import { Footer } from "@/components/shared/Footer";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  UserIcon,
  ShoppingBag01Icon,
  FavouriteIcon,
  Location01Icon,
  Setting07Icon,
} from "@hugeicons/core-free-icons";
import { cn } from "@/lib/utils";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: { default: "My Account", template: "%s | My Account" },
};

const navItems = [
  { href: "/dashboard", label: "Overview", icon: UserIcon },
  { href: "/dashboard/orders", label: "Orders", icon: ShoppingBag01Icon },
  { href: "/wishlist", label: "Wishlist", icon: FavouriteIcon },
  { href: "/dashboard/addresses", label: "Addresses", icon: Location01Icon },
  { href: "/dashboard/settings", label: "Settings", icon: Setting07Icon },
];

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session?.user) redirect("/login");

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <div className="layout py-8 flex-1">
        <div className="grid lg:grid-cols-[240px_1fr] gap-8 items-start">
          {/* Sidebar */}
          <aside className="lg:sticky lg:top-24 space-y-1">
            {/* User info */}
            <div className="p-4 border border-border mb-4 bg-card">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary flex items-center justify-center text-primary-foreground font-bold text-sm shrink-0">
                  {session.user.name?.[0]?.toUpperCase() ?? "U"}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-foreground truncate">
                    {session.user.name}
                  </p>
                  <p className="text-xs text-muted-foreground truncate">
                    {session.user.email}
                  </p>
                </div>
              </div>
            </div>

            {/* Nav */}
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-4 py-2.5 text-sm font-medium transition-colors",
                  "text-muted-foreground hover:text-foreground hover:bg-muted",
                )}
              >
                <HugeiconsIcon
                  icon={item.icon}
                  size={16}
                  color="currentColor"
                  strokeWidth={1.5}
                />
                {item.label}
              </Link>
            ))}
          </aside>

          {/* Main */}
          <main className="min-w-0">{children}</main>
        </div>
      </div>
      <Footer />
    </div>
  );
}