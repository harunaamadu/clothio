import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  DashboardSquare01Icon,
  ShoppingBag01Icon,
  UserGroupIcon,
  Setting07Icon,
  Notification01Icon,
  LogoutSquare01Icon,
  PresentationBarChart01Icon,
} from "@hugeicons/core-free-icons";
import { cn } from "@/lib/utils";
import type { Metadata } from "next";
import { signOut } from "@/auth";

export const metadata: Metadata = {
  title: { default: "Admin", template: "%s | Admin" },
};

const navItems = [
  { href: "/admin", label: "Overview", icon: DashboardSquare01Icon, exact: true },
  { href: "/admin/orders", label: "Orders", icon: ShoppingBag01Icon },
  { href: "/admin/customers", label: "Customers", icon: UserGroupIcon },
  { href: "/admin/analytics", label: "Analytics", icon: PresentationBarChart01Icon },
  { href: "/admin/settings", label: "Settings", icon: Setting07Icon },
];

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session?.user) redirect("/login");
  if (session.user.role !== "ADMIN") redirect("/access-denied");

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex">
      {/* Sidebar */}
      <aside className="w-64 shrink-0 border-r border-[#1a1a1a] flex flex-col sticky top-0 h-screen">
        {/* Logo */}
        <div className="px-6 py-5 border-b border-[#1a1a1a]">
          <Link href="/admin" className="flex items-center gap-2.5">
            <div className="w-7 h-7 bg-[#e94560] flex items-center justify-center">
              <span className="text-white text-xs font-black">C</span>
            </div>
            <div>
              <span className="text-white text-sm font-bold tracking-tight">
                Clothio
              </span>
              <span className="block text-[10px] text-[#71717a] uppercase tracking-widest -mt-0.5">
                Admin
              </span>
            </div>
          </Link>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 text-sm font-medium transition-colors",
                "text-[#71717a] hover:text-white hover:bg-[#1a1a1a]",
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
        </nav>

        {/* Bottom */}
        <div className="px-3 py-4 border-t border-[#1a1a1a] space-y-0.5">
          <Link
            href="/admin/notifications"
            className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-[#71717a] hover:text-white hover:bg-[#1a1a1a] transition-colors"
          >
            <HugeiconsIcon icon={Notification01Icon} size={16} color="currentColor" strokeWidth={1.5} />
            Notifications
          </Link>

          {/* User info */}
          <div className="flex items-center gap-3 px-3 py-3 mt-2 border border-[#1a1a1a]">
            <div className="w-8 h-8 bg-[#e94560] flex items-center justify-center text-white text-xs font-bold shrink-0">
              {session.user.name?.[0]?.toUpperCase() ?? "A"}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-white truncate">
                {session.user.name}
              </p>
              <p className="text-[10px] text-[#71717a] truncate">
                {session.user.email}
              </p>
            </div>
            <form
              action={async () => {
                "use server";
                await signOut({ redirectTo: "/" });
              }}
            >
              <button
                type="submit"
                className="text-[#71717a] hover:text-[#e94560] transition-colors"
                aria-label="Sign out"
              >
                <HugeiconsIcon icon={LogoutSquare01Icon} size={15} color="currentColor" strokeWidth={1.5} />
              </button>
            </form>
          </div>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header className="h-14 border-b border-[#1a1a1a] px-6 flex items-center justify-between shrink-0">
          <p className="text-xs text-[#71717a] font-mono">
            {new Date().toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
          </p>
          <Link
            href="/"
            className="text-xs text-[#71717a] hover:text-white transition-colors"
          >
            ← Back to store
          </Link>
        </header>

        <main className="flex-1 p-6 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}