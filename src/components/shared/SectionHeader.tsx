import Link from "next/link";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowRight01Icon } from "@hugeicons/core-free-icons";
import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface SectionHeaderProps {
  eyebrow?: string;
  title: string;
  description?: string | ReactNode;
  href?: string;
  hrefLabel?: string;
  align?: "left" | "center";
  className?: string;
}

export function SectionHeader({
  eyebrow,
  title,
  description,
  href,
  hrefLabel = "View all",
  align = "left",
  className,
}: SectionHeaderProps) {
  return (
    <div
      className={cn(
        "flex items-end justify-between mb-8",
        align === "center" && "flex-col items-center text-center gap-3",
        className
      )}
    >
      <div className={cn(align === "center" && "flex flex-col items-center")}>
        {eyebrow && (
          <p className="text-xs font-semibold uppercase tracking-widest text-[#e94560] mb-1">
            {eyebrow}
          </p>
        )}
        <h2 className="font-heading text-2xl md:text-3xl font-bold text-[#1a1a2e]">
          {title}
        </h2>
        {description && (
          <p className="mt-2 text-sm text-[#71717a] max-w-md">
            {description}
          </p>
        )}
      </div>

      {href && align !== "center" && (
        <Link
          href={href}
          className="hidden sm:inline-flex items-center gap-1.5 text-sm font-medium text-[#1a1a2e] hover:text-[#e94560] transition-colors group shrink-0"
        >
          {hrefLabel}
          <HugeiconsIcon
            icon={ArrowRight01Icon}
            size={16}
            strokeWidth={2}
            className="group-hover:translate-x-1 transition-transform"
          />
        </Link>
      )}

      {href && align === "center" && (
        <Link
          href={href}
          className="inline-flex items-center gap-1.5 text-sm font-medium text-[#e94560] hover:underline underline-offset-4 transition-colors group"
        >
          {hrefLabel}
          <HugeiconsIcon
            icon={ArrowRight01Icon}
            size={16}
            strokeWidth={2}
            className="group-hover:translate-x-1 transition-transform"
          />
        </Link>
      )}
    </div>
  );
}