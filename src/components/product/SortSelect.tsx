"use client"

import { useRouter, usePathname, useSearchParams } from "next/navigation"
import { useCallback } from "react"
import { ArrowUpDown } from "lucide-react"
import type { SortOption } from "@/types"

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: "newest",     label: "Newest first"    },
  { value: "oldest",     label: "Oldest first"    },
  { value: "price-asc",  label: "Price: Low → High" },
  { value: "price-desc", label: "Price: High → Low" },
  { value: "name",       label: "Name A–Z"        },
]

interface SortSelectProps {
  total?: number
}

export function SortSelect({ total }: SortSelectProps) {
  const router       = useRouter()
  const pathname     = usePathname()
  const searchParams = useSearchParams()
  const current      = (searchParams.get("sort") ?? "newest") as SortOption

  const handleChange = useCallback(
    (value: SortOption) => {
      const params = new URLSearchParams(searchParams.toString())
      params.set("sort", value)
      params.delete("page") // reset to page 1 on sort change
      router.push(`${pathname}?${params.toString()}`)
    },
    [router, pathname, searchParams]
  )

  return (
    <div className="flex items-center justify-between gap-3 w-full">
      {/* Result count */}
      {total !== undefined && (
        <p className="text-sm text-[#71717a] shrink-0">
          <span className="font-medium text-[#18181b]">{total}</span>{" "}
          {total === 1 ? "product" : "products"}
        </p>
      )}

      {/* Sort dropdown */}
      <div className="relative flex items-center gap-2 ml-auto">
        <ArrowUpDown className="w-3.5 h-3.5 text-[#a1a1aa] shrink-0 pointer-events-none" />
        <select
          value={current}
          onChange={(e) => handleChange(e.target.value as SortOption)}
          className="appearance-none bg-white border border-[#e4e4e7] rounded-lg pl-2 pr-7 py-2 text-sm text-[#18181b] outline-none cursor-pointer hover:border-[#1a1a2e] focus:border-[#1a1a2e] focus:ring-2 focus:ring-[#1a1a2e]/10 transition-colors"
          aria-label="Sort products"
        >
          {SORT_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        {/* Custom chevron */}
        <svg
          className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#71717a]"
          fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </div>
    </div>
  )
}