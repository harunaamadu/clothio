"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { useCartStore } from "@/store/cart.store";
import { useWishlistStore } from "@/store/wishlist.store";
import { CartSheet } from "@/components/cart/CartSheet";
import { MobileNav } from "./MobileNav";
import {
  ShoppingBag,
  Heart,
  Search,
  User,
  ChevronDown,
  LogOut,
  LayoutDashboard,
  Package,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

const navLinks = [
  { label: "Home", href: "/" },
  {
    label: "Men's",
    href: "/products?category=mens",
    children: [
      { label: "Shirts", href: "/products?category=mens&sub=shirts" },
      { label: "Shorts & Jeans", href: "/products?category=mens&sub=shorts" },
      { label: "Jackets", href: "/products?category=mens&sub=jackets" },
      { label: "Shoes", href: "/products?category=mens&sub=shoes" },
    ],
  },
  {
    label: "Women's",
    href: "/products?category=womens",
    children: [
      { label: "Dresses", href: "/products?category=womens&sub=dresses" },
      { label: "Tops", href: "/products?category=womens&sub=tops" },
      { label: "Skirts", href: "/products?category=womens&sub=skirts" },
      { label: "Bags", href: "/products?category=womens&sub=bags" },
    ],
  },
  {
    label: "Jewelry",
    href: "/products?category=jewelry",
    children: [
      { label: "Earrings", href: "/products?category=jewelry&sub=earrings" },
      { label: "Necklaces", href: "/products?category=jewelry&sub=necklaces" },
      { label: "Rings", href: "/products?category=jewelry&sub=rings" },
      { label: "Bracelets", href: "/products?category=jewelry&sub=bracelets" },
    ],
  },
  { label: "Sale", href: "/products?sale=true" },
];

export function Header() {
  const { data: session } = useSession();
  const itemCount = useCartStore((s) => s.itemCount);
  const wishlistCount = useWishlistStore((s) => s.items.length);
  const [cartOpen, setCartOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  return (
    <>
      {/* Top bar */}
      <div className="bg-[#1a1a2e] text-white text-xs py-2 text-center">
        Free shipping on orders over $55 &nbsp;·&nbsp;
        <Link href="/products?sale=true" className="underline underline-offset-2 hover:text-[#f5a623] transition-colors">
          Shop the Sale →
        </Link>
      </div>

      {/* Main header */}
      <header
        className={cn(
          "sticky top-0 z-50 bg-white border-b border-[#e4e4e7] transition-shadow duration-200",
          scrolled && "shadow-md"
        )}
      >
        <div className="container">
          <div className="flex items-center justify-between h-16 gap-4">
            {/* Mobile nav trigger */}
            <MobileNav navLinks={navLinks} />

            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 shrink-0">
              <span className="font-display text-2xl font-bold text-[#1a1a2e] tracking-tight">
                Clot<span className="text-[#e94560]">hio</span>
              </span>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden lg:flex items-center gap-1">
              {navLinks.map((link) =>
                link.children ? (
                  <DropdownMenu key={link.label}>
                    <DropdownMenuTrigger asChild>
                      <button className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-[#18181b] hover:text-[#e94560] transition-colors rounded-md hover:bg-[#f4f4f5]">
                        {link.label}
                        <ChevronDown className="w-3.5 h-3.5 opacity-60" />
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start" className="w-48">
                      <DropdownMenuItem asChild>
                        <Link href={link.href} className="font-medium">
                          All {link.label}
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      {link.children.map((child) => (
                        <DropdownMenuItem key={child.label} asChild>
                          <Link href={child.href}>{child.label}</Link>
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                ) : (
                  <Link
                    key={link.label}
                    href={link.href}
                    className={cn(
                      "px-3 py-2 text-sm font-medium rounded-md transition-colors",
                      link.label === "Sale"
                        ? "text-[#e94560] hover:bg-red-50"
                        : "text-[#18181b] hover:text-[#e94560] hover:bg-[#f4f4f5]"
                    )}
                  >
                    {link.label}
                  </Link>
                )
              )}
            </nav>

            {/* Right actions */}
            <div className="flex items-center gap-1">
              {/* Search */}
              <div className="relative">
                {searchOpen ? (
                  <div className="flex items-center border border-[#e4e4e7] rounded-full px-3 py-1.5 bg-[#f4f4f5]">
                    <Search className="w-4 h-4 text-[#71717a] shrink-0" />
                    <input
                      autoFocus
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && searchQuery.trim()) {
                          window.location.href = `/products?search=${encodeURIComponent(searchQuery)}`;
                        }
                        if (e.key === "Escape") {
                          setSearchOpen(false);
                          setSearchQuery("");
                        }
                      }}
                      onBlur={() => {
                        if (!searchQuery) setSearchOpen(false);
                      }}
                      placeholder="Search products..."
                      className="ml-2 bg-transparent text-sm outline-none w-40 placeholder:text-[#a1a1aa]"
                    />
                  </div>
                ) : (
                  <button
                    onClick={() => setSearchOpen(true)}
                    className="p-2 rounded-full hover:bg-[#f4f4f5] transition-colors"
                    aria-label="Search"
                  >
                    <Search className="w-5 h-5 text-[#18181b]" />
                  </button>
                )}
              </div>

              {/* Wishlist */}
              <Link
                href="/wishlist"
                className="relative p-2 rounded-full hover:bg-[#f4f4f5] transition-colors"
                aria-label="Wishlist"
              >
                <Heart className="w-5 h-5 text-[#18181b]" />
                {wishlistCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-[#e94560] text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                    {wishlistCount > 9 ? "9+" : wishlistCount}
                  </span>
                )}
              </Link>

              {/* Cart */}
              <button
                onClick={() => setCartOpen(true)}
                className="relative p-2 rounded-full hover:bg-[#f4f4f5] transition-colors"
                aria-label="Cart"
              >
                <ShoppingBag className="w-5 h-5 text-[#18181b]" />
                {itemCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-[#e94560] text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                    {itemCount > 9 ? "9+" : itemCount}
                  </span>
                )}
              </button>

              {/* User */}
              {session ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="flex items-center gap-2 p-1.5 rounded-full hover:bg-[#f4f4f5] transition-colors">
                      {session.user.image ? (
                        <img
                          src={session.user.image}
                          alt={session.user.name ?? "User"}
                          className="w-7 h-7 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-7 h-7 rounded-full bg-[#1a1a2e] flex items-center justify-center">
                          <span className="text-white text-xs font-medium">
                            {session.user.name?.[0]?.toUpperCase() ?? "U"}
                          </span>
                        </div>
                      )}
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-52">
                    <div className="px-3 py-2">
                      <p className="text-sm font-medium truncate">{session.user.name}</p>
                      <p className="text-xs text-[#71717a] truncate">{session.user.email}</p>
                    </div>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link href="/dashboard" className="flex items-center gap-2">
                        <LayoutDashboard className="w-4 h-4" /> Dashboard
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/orders" className="flex items-center gap-2">
                        <Package className="w-4 h-4" /> My Orders
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={() => signOut({ callbackUrl: "/" })}
                      className="text-[#e94560] focus:text-[#e94560] flex items-center gap-2"
                    >
                      <LogOut className="w-4 h-4" /> Sign Out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Link
                  href="/login"
                  className="hidden sm:flex items-center gap-1.5 px-3 py-2 text-sm font-medium rounded-md hover:bg-[#f4f4f5] transition-colors"
                >
                  <User className="w-4 h-4" />
                  Sign In
                </Link>
              )}
            </div>
          </div>
        </div>
      </header>

      <CartSheet open={cartOpen} onClose={() => setCartOpen(false)} />
    </>
  );
}