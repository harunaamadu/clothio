"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface NavLink {
  label: string;
  href: string;
  children?: { label: string; href: string }[];
}

export function MobileNav({ navLinks }: { navLinks: NavLink[] }) {
  const [open, setOpen] = useState(false);
  const [expanded, setExpanded] = useState<string | null>(null);

  return (
    <>
      <button
        className="lg:hidden p-2 rounded-md hover:bg-[#f4f4f5] transition-colors"
        onClick={() => setOpen(true)}
        aria-label="Open menu"
      >
        <Menu className="w-5 h-5" />
      </button>

      {/* Backdrop */}
      {open && (
        <div
          className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Drawer */}
      <div
        className={cn(
          "fixed top-0 left-0 z-50 h-full w-72 bg-white shadow-2xl flex flex-col transition-transform duration-300",
          open ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex items-center justify-between p-4 border-b border-[#e4e4e7]">
          <span className="font-display text-xl font-bold text-[#1a1a2e]">
            Clot<span className="text-[#e94560]">hio</span>
          </span>
          <button
            onClick={() => setOpen(false)}
            className="p-1.5 rounded-md hover:bg-[#f4f4f5] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto py-2">
          {navLinks.map((link) => (
            <div key={link.label}>
              {link.children ? (
                <>
                  <button
                    onClick={() => setExpanded(expanded === link.label ? null : link.label)}
                    className="w-full flex items-center justify-between px-4 py-3 text-sm font-medium hover:bg-[#f4f4f5] transition-colors"
                  >
                    {link.label}
                    <ChevronRight
                      className={cn(
                        "w-4 h-4 transition-transform",
                        expanded === link.label && "rotate-90"
                      )}
                    />
                  </button>
                  {expanded === link.label && (
                    <div className="bg-[#f4f4f5]">
                      <Link
                        href={link.href}
                        onClick={() => setOpen(false)}
                        className="block px-8 py-2.5 text-sm font-medium hover:text-[#e94560] transition-colors"
                      >
                        All {link.label}
                      </Link>
                      {link.children.map((child) => (
                        <Link
                          key={child.label}
                          href={child.href}
                          onClick={() => setOpen(false)}
                          className="block px-8 py-2.5 text-sm text-[#71717a] hover:text-[#e94560] transition-colors"
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
                    link.label === "Sale" && "text-[#e94560]"
                  )}
                >
                  {link.label}
                </Link>
              )}
            </div>
          ))}
        </nav>

        <div className="p-4 border-t border-[#e4e4e7] space-y-2">
          <Link
            href="/login"
            onClick={() => setOpen(false)}
            className="block w-full text-center py-2.5 text-sm font-medium border border-[#1a1a2e] rounded-full hover:bg-[#1a1a2e] hover:text-white transition-colors"
          >
            Sign In
          </Link>
          <Link
            href="/register"
            onClick={() => setOpen(false)}
            className="block w-full text-center py-2.5 text-sm font-medium bg-[#e94560] text-white rounded-full hover:bg-[#d63651] transition-colors"
          >
            Create Account
          </Link>
        </div>
      </div>
    </>
  );
}