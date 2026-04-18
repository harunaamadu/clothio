"use client";

import Link from "next/link";
import {
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { navLinks } from "@/lib/constants";

export function MegaMenu() {
  const megaMenuLinks = navLinks.filter(
    (link) => link.children && link.children.length > 0,
  );

  return (
    <DrawerContent>
      <div className="layout relative py-24">
        <DrawerHeader className="px-0 sr-only">
          <DrawerTitle>Shop Categories</DrawerTitle>
        </DrawerHeader>

        {megaMenuLinks.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 py-8 md:grid-cols-2 lg:grid-cols-4">
            {megaMenuLinks.map((link) => (
              <div key={link.label}>
                <h3 className="mb-3 text-lg font-semibold">
                  <Link
                    href={link.href}
                    className="transition-colors hover:text-primary"
                  >
                    {link.label}
                  </Link>
                </h3>

                <ul className="space-y-2">
                  {link.children?.map((child) => (
                    <li key={child.label}>
                      <Link
                        href={child.href}
                        className="text-sm text-muted-foreground transition-colors hover:text-primary"
                      >
                        {child.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        ) : (
          <p className="py-8 text-center text-sm text-muted-foreground">
            No categories available.
          </p>
        )}
      </div>
    </DrawerContent>
  );
}