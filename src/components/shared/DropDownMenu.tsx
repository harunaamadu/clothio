"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowDown01Icon } from "@hugeicons/core-free-icons";

type NavChild = {
  label: string;
  href: string;
};

type Props = {
  label: string;
  href: string;
  childrenLinks: NavChild[];
  isActive: boolean;
};

export function DropDownMenu({
  label,
  href,
  childrenLinks,
  isActive,
}: Props) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="group relative flex items-center gap-1 px-3 py-2 text-sm font-medium"
        >
          {label}

          <HugeiconsIcon
            icon={ArrowDown01Icon}
            size={24}
            color="currentColor"
            strokeWidth={1.5}
            className="h-3.5 w-3.5 opacity-60"
          />

          <span
            className={cn(
              "absolute bottom-0 right-0 h-0.5 w-0 bg-primary transition-all group-hover:w-full",
              isActive && "w-full",
            )}
          />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="start" className="w-48 z-110 relative">
        <DropdownMenuItem asChild>
          <Link href={href} className="font-medium">
            All {label}
          </Link>
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        {childrenLinks.map((child) => (
          <DropdownMenuItem key={child.label} asChild>
            <Link href={child.href}>{child.label}</Link>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}