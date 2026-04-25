"use client";

import { useState } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  ArrowRight01Icon,
  CancelIcon,
  Menu01Icon,
  Search01Icon,
  SearchList01Icon,
} from "@hugeicons/core-free-icons";
import { Button } from "../ui/button";

interface NavLink {
  label: string;
  href: string;
  children?: { label: string; href: string }[];
}

interface MobileNavProps {
  navLinks: NavLink[];
  searchQuery: string;
  setSearchQuery: React.Dispatch<React.SetStateAction<string>>;
}

export function MobileNav({
  navLinks,
  searchQuery,
  setSearchQuery,
}: MobileNavProps) {
  const [open, setOpen] = useState(false);
  const [expanded, setExpanded] = useState<string | null>(null);

  return (
    <>
      <Button
        variant={`ghost`}
        size={`icon-lg`}
        className="lg:hidden "
        onClick={() => setOpen(true)}
        aria-label="Open menu"
      >
        <HugeiconsIcon
          icon={SearchList01Icon}
          size={24}
          color="currentColor"
          strokeWidth={1.5}
          className="w-5 h-5"
        />
      </Button>

      {/* Backdrop */}
      {open && (
        <div
          className="fixed inset-0 min-h-screen z-50 bg-black/40 backdrop-blur-sm"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Drawer */}
      <div
        className={cn(
          "fixed top-0 left-0 z-50 min-h-screen w-72 bg-background shadow-2xl flex flex-col transition-transform duration-300",
          open ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex items-center justify-between p-4 border-b border-border/30">
          <h3 className="text-xl font-bold">
            Clot<span className="text-primary">hio</span>
          </h3>

          <button
            onClick={() => setOpen(false)}
            className="p-1.5 rounded-md hover:bg-[#f4f4f5] transition-colors"
          >
            <HugeiconsIcon
              icon={CancelIcon}
              size={24}
              color="currentColor"
              strokeWidth={1.5}
              className="w-5 h-5"
            />
          </button>
        </div>

        <div className="relative p-4">
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
              }}
              placeholder="Search products..."
              className="ml-2 bg-transparent text-sm outline-none w-40 placeholder:text-[#a1a1aa]"
            />
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto py-2">
          {navLinks.map((link) => (
            <div key={link.label}>
              {link.children ? (
                <>
                  <button
                    onClick={() =>
                      setExpanded(expanded === link.label ? null : link.label)
                    }
                    className="w-full flex items-center justify-between px-4 py-3 text-sm font-medium hover:bg-[#f4f4f5] transition-colors"
                  >
                    {link.label}
                    <HugeiconsIcon
                      icon={ArrowRight01Icon}
                      size={24}
                      color="currentColor"
                      strokeWidth={1.5}
                      className={cn(
                        "w-4 h-4 transition-transform",
                        expanded === link.label && "rotate-90",
                      )}
                    />
                  </button>
                  {expanded === link.label && (
                    <div className="bg-[#f4f4f5]">
                      <Link
                        href={link.href}
                        onClick={() => setOpen(false)}
                        className="block px-8 py-2.5 text-sm font-medium hover:text-primary transition-colors"
                      >
                        All {link.label}
                      </Link>
                      {link.children.map((child) => (
                        <Link
                          key={child.label}
                          href={child.href}
                          onClick={() => setOpen(false)}
                          className="block px-8 py-2.5 text-sm text-[#71717a] hover:text-primary transition-colors"
                        >
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <Link
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className={cn(
                    "block px-4 py-3 text-sm font-medium hover:bg-[#f4f4f5] transition-colors",
                    link.label === "Sale" && "text-primary",
                  )}
                >
                  {link.label}
                </Link>
              )}
            </div>
          ))}
        </nav>

        <div className="p-4 border-t border-[#e4e4e7] space-y-2">
          <p className="text-xs">
            ©{new Date().getFullYear()}{" "}
            <em className="font-semibold text-stone-900">
              {process.env.WEBSITE_NAME || "Clothio"}
            </em>
            . All rights reserved.
          </p>
        </div>
      </div>
    </>
  );
}
