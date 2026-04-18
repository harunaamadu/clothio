"use client";

import Link from "next/link";
import { useState, useEffect, useRef, useCallback } from "react";
import { useSession, signOut } from "next-auth/react";
import { useCartStore } from "@/store/cart.store";
import { useWishlistStore } from "@/store/wishlist.store";
import { CartSheet } from "@/components/cart/CartSheet";
import { MobileNav } from "./MobileNav";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { navLinks } from "@/lib/constants";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  ArrowDown01Icon,
  FavouriteIcon,
  Layout01Icon,
  Logout01Icon,
  PackageIcon,
  Search01Icon,
  Search02Icon,
  ShoppingBag01Icon,
  UserIcon,
} from "@hugeicons/core-free-icons";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Button } from "../ui/button";
import Image from "next/image";

import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";

import { MegaMenu } from "./MegaMenu";
import { DropDownMenu } from "./DropDownMenu";

export function Header() {
  const { data: session } = useSession();
  const itemCount = useCartStore((s) => s.itemCount);
  const wishlistCount = useWishlistStore((s) => s.items.length);
  const [cartOpen, setCartOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // ── Scroll behaviour ───────────────────────────────────────────────────────
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const lastScrollY = useRef(0);

  const pathname = usePathname();
  const [openMenu, setOpenMenu] = useState(false);

  const handleScroll = useCallback(() => {
    const y = window.scrollY;
    const delta = y - lastScrollY.current;

    setScrolled(y > 24);

    if (y < 80) {
      setHidden(false);
    } else if (delta > 6) {
      setHidden(true);
    } else if (delta < -4) {
      setHidden(false);
    }

    lastScrollY.current = y;
  }, []);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  // ── Active-path check ──────────────────────────────────────────────────────
  const isCurrentPath = useCallback(
    (href: string) => pathname === href || pathname.startsWith(`${href}/`),
    [pathname],
  );

  const categoriesLink = navLinks.find((link) => link.label === "Categories");

  // Get all links that have children (for mega menu display)
  const megaMenuLinks = navLinks.filter(
    (link) => link.children && link.children.length > 0,
  );

  return (
    <>
      {/* Top bar */}
      <div className="layout flex items-center justify-center bg-muted text-xs py-2">
        <span>Free shipping on orders over $55 &nbsp;·&nbsp;</span>
        <Link
          href="/products?sale=true"
          className="inline-flex items-center gap-1 underline underline-offset-2 hover:text-primary transition-colors"
        >
          Shop the Sale →
        </Link>
      </div>

      {/* Main header */}
      <motion.header
        animate={{ y: hidden ? "-100%" : "0%" }}
        transition={{ duration: 0.36, ease: [0.32, 0, 0.67, 0] }}
        className={cn(
          "sticky top-0 inset-x-0 z-100 transition-all duration-300 layer",
          scrolled
            ? "bg-background/75 backdrop-blur-md border-b border-neutral-100 shadow-sm shadow-black/4"
            : "bg-background",
        )}
      >
        <div className="layout">
          <div className="flex items-center justify-between h-16 gap-4">
            {/* Mobile nav trigger */}
            <MobileNav navLinks={navLinks} />

            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 shrink-0">
              <span className="font-heading text-2xl font-bold tracking-tight">
                Cloth<span className="text-primary">io</span>
              </span>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden lg:flex items-center gap-1">
              {navLinks.map((link) => {
                if (link.type === "mega") {
                  return (
                    <Drawer key={link.label} direction="top">
                      <DrawerTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-sm font-medium"
                        >
                          {link.label}
                        </Button>
                      </DrawerTrigger>
                      <MegaMenu />
                    </Drawer>
                  );
                }

                if (link.type === "dropdown" && link.children) {
                  return (
                    <DropDownMenu
                      key={link.label}
                      label={link.label}
                      href={link.href}
                      childrenLinks={link.children}
                      isActive={isCurrentPath(link.href)}
                    />
                  );
                }

                return (
                  <Button
                    key={link.label}
                    variant="ghost"
                    size="sm"
                    className="relative group p-0 text-sm font-medium"
                  >
                    <Link
                      href={link.href}
                      className={cn(
                        "px-3 py-2",
                        link.label === "Sale"
                          ? "text-rose-600 hover:bg-rose-50"
                          : "hover:bg-muted",
                      )}
                    >
                      {link.label}
                    </Link>

                    <span
                      className={cn(
                        "absolute bottom-0 right-0 h-0.5 w-0 bg-primary transition-all group-hover:w-full",
                        isCurrentPath(link.href) && "w-full",
                      )}
                    />
                  </Button>
                );
              })}
            </nav>

            {/* Right actions */}
            <div className="flex items-center gap-1">
              {/* Search */}
              <div className="relative">
                {searchOpen ? (
                  <div className="flex items-center border border-[#e4e4e7] rounded-full px-3 py-1.5 bg-[#f4f4f5]">
                    <HugeiconsIcon
                      icon={Search01Icon}
                      size={24}
                      color="currentColor"
                      strokeWidth={1.5}
                      className="w-4 h-4 text-[#71717a] shrink-0"
                    />
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
                  <Button
                    onClick={() => setSearchOpen(true)}
                    aria-label="Search"
                    variant="ghost"
                    size="icon-lg"
                  >
                    <HugeiconsIcon
                      icon={Search02Icon}
                      size={24}
                      color="currentColor"
                      strokeWidth={1.5}
                      className="w-5 h-5 text-[#18181b]"
                    />
                  </Button>
                )}
              </div>

              {/* Wishlist */}
              <Button
                // href="/wishlist"
                aria-label="Wishlist"
                variant="ghost"
                size="icon-lg"
              >
                <HugeiconsIcon
                  icon={FavouriteIcon}
                  size={24}
                  color="currentColor"
                  strokeWidth={1.5}
                  className="w-5 h-5 text-[#18181b]"
                />
                {wishlistCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-[#e94560] text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                    {wishlistCount > 9 ? "9+" : wishlistCount}
                  </span>
                )}
              </Button>

              {/* Cart */}
              <Button
                onClick={() => setCartOpen(true)}
                aria-label="Cart"
                variant="ghost"
                size="icon-lg"
              >
                <HugeiconsIcon
                  icon={ShoppingBag01Icon}
                  size={24}
                  color="currentColor"
                  strokeWidth={1.5}
                  className="w-5 h-5 text-[#18181b]"
                />
                {itemCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-[#e94560] text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                    {itemCount > 9 ? "9+" : itemCount}
                  </span>
                )}
              </Button>

              {/* User */}
              {session?.user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      aria-label="User Button"
                      variant="ghost"
                      size="icon-lg"
                    >
                      {session.user.image ? (
                        <Image
                          src={session.user.image}
                          alt={session.user.name ?? "User"}
                          className="w-7 h-7 rounded-full object-cover"
                          width={28}
                          height={28}
                        />
                      ) : (
                        <div className="w-7 h-7 rounded-full bg-rose-700 flex items-center justify-center">
                          <span className="text-white text-xs font-medium">
                            {session.user.name?.[0]?.toUpperCase() ?? "U"}
                          </span>
                        </div>
                      )}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-52">
                    <div className="px-3 py-2">
                      <p className="text-sm font-medium truncate">
                        {session.user.name}
                      </p>
                      <p className="text-xs text-[#71717a] truncate">
                        {session.user.email}
                      </p>
                    </div>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link
                        href="/dashboard"
                        className="flex items-center gap-2"
                      >
                        <HugeiconsIcon
                          icon={Layout01Icon}
                          size={24}
                          color="currentColor"
                          strokeWidth={1.5}
                          className="w-4 h-4"
                        />{" "}
                        Dashboard
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/orders" className="flex items-center gap-2">
                        <HugeiconsIcon
                          icon={PackageIcon}
                          size={24}
                          color="currentColor"
                          strokeWidth={1.5}
                          className="w-4 h-4"
                        />{" "}
                        My Orders
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={() => signOut({ callbackUrl: "/" })}
                      className="text-rose-600 focus:text-rose-400 flex items-center gap-2"
                    >
                      <HugeiconsIcon
                        icon={Logout01Icon}
                        size={24}
                        color="currentColor"
                        strokeWidth={1.5}
                        className="w-4 h-4"
                      />{" "}
                      Sign Out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Link
                  href="/login"
                  className="hidden sm:flex items-center gap-1.5 px-3 py-2 text-sm font-medium hover:bg-muted hover:text-foreground aria-expanded:bg-muted aria-expanded:text-foreground dark:hover:bg-muted/50 transition-all"
                >
                  <HugeiconsIcon
                    icon={UserIcon}
                    size={24}
                    color="currentColor"
                    strokeWidth={1.5}
                    className="w-4 h-4"
                  />{" "}
                  Sign In
                </Link>
              )}
            </div>
          </div>
        </div>
      </motion.header>

      <CartSheet open={cartOpen} onClose={() => setCartOpen(false)} />
    </>
  );
}
