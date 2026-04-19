"use client"

import { useRouter, usePathname, useSearchParams } from "next/navigation"
import { useCallback, useState } from "react"
import { X, ChevronDown, SlidersHorizontal } from "lucide-react"
import { cn } from "@/lib/utils"
import { formatPrice } from "@/lib/formatters"

// ─── Types ────────────────────────────────────────────────────────────────────

interface FilterOption { value: string; label: string; count?: number }

interface ProductFiltersProps {
  sizes?:   FilterOption[]
  colors?:  FilterOption[]
  brands?:  FilterOption[]
  minPrice?: number
  maxPrice?: number
  className?: string
}

// ─── Collapsible section ──────────────────────────────────────────────────────

function Section({
  title, defaultOpen = true, children,
}: {
  title: string; defaultOpen?: boolean; children: React.ReactNode
}) {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <div className="border-b border-[#e4e4e7] pb-4">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between py-3 text-sm font-semibold text-[#18181b] hover:text-[#e94560] transition-colors"
      >
        {title}
        <ChevronDown className={cn("w-4 h-4 transition-transform text-[#71717a]", open && "rotate-180")} />
      </button>
      {open && <div className="pt-1 space-y-1">{children}</div>}
    </div>
  )
}

// ─── Checkbox option ──────────────────────────────────────────────────────────

function CheckOption({
  label, checked, onChange, count, color,
}: {
  label: string; checked: boolean; onChange: () => void; count?: number; color?: string
}) {
  return (
    <label className="flex items-center gap-2.5 cursor-pointer group py-0.5">
      <div
        onClick={onChange}
        className={cn(
          "w-4 h-4 rounded border shrink-0 flex items-center justify-center transition-colors cursor-pointer",
          checked
            ? "bg-[#1a1a2e] border-[#1a1a2e]"
            : "border-[#d4d4d8] group-hover:border-[#1a1a2e]"
        )}
      >
        {checked && (
          <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        )}
      </div>
      {color && (
        <span
          className="w-3.5 h-3.5 rounded-full border border-[#e4e4e7] shrink-0"
          style={{ backgroundColor: color }}
        />
      )}
      <span className="text-sm text-[#18181b] group-hover:text-[#e94560] transition-colors flex-1 leading-none">
        {label}
      </span>
      {count !== undefined && (
        <span className="text-[11px] text-[#a1a1aa]">{count}</span>
      )}
    </label>
  )
}

// ─── Main component ───────────────────────────────────────────────────────────

export function ProductFilters({
  sizes   = [],
  colors  = [],
  brands  = [],
  minPrice = 0,
  maxPrice = 500,
  className,
}: ProductFiltersProps) {
  const router       = useRouter()
  const pathname     = usePathname()
  const searchParams = useSearchParams()

  // Parse current filter state from URL
  const activeCategories = searchParams.getAll("category")
  const activeSizes      = searchParams.getAll("size")
  const activeColors     = searchParams.getAll("color")
  const activeBrands     = searchParams.getAll("brand")
  const activeMin        = Number(searchParams.get("minPrice") ?? minPrice)
  const activeMax        = Number(searchParams.get("maxPrice") ?? maxPrice)
  const inStock          = searchParams.get("inStock") === "true"
  const onSale           = searchParams.get("onSale")  === "true"

  const [priceRange, setPriceRange] = useState<[number, number]>([activeMin, activeMax])

  // Check if any non-default filters are active
  const hasActiveFilters =
    activeSizes.length > 0 ||
    activeColors.length > 0 ||
    activeBrands.length > 0 ||
    activeMin > minPrice ||
    activeMax < maxPrice ||
    inStock ||
    onSale

  // Generic URL-based toggle helper
  const toggleParam = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString())
      const current = params.getAll(key)
      params.delete(key)
      if (current.includes(value)) {
        current.filter((v) => v !== value).forEach((v) => params.append(key, v))
      } else {
        ;[...current, value].forEach((v) => params.append(key, v))
      }
      params.delete("page")
      router.push(`${pathname}?${params.toString()}`)
    },
    [router, pathname, searchParams]
  )

  const toggleBoolean = useCallback(
    (key: string, current: boolean) => {
      const params = new URLSearchParams(searchParams.toString())
      if (current) params.delete(key)
      else params.set(key, "true")
      params.delete("page")
      router.push(`${pathname}?${params.toString()}`)
    },
    [router, pathname, searchParams]
  )

  const applyPriceRange = useCallback(() => {
    const params = new URLSearchParams(searchParams.toString())
    params.set("minPrice", String(priceRange[0]))
    params.set("maxPrice", String(priceRange[1]))
    params.delete("page")
    router.push(`${pathname}?${params.toString()}`)
  }, [router, pathname, searchParams, priceRange])

  const clearAll = useCallback(() => {
    const params = new URLSearchParams()
    const sort = searchParams.get("sort")
    if (sort) params.set("sort", sort)
    router.push(`${pathname}?${params.toString()}`)
  }, [router, pathname, searchParams])

  return (
    <aside className={cn("space-y-0", className)}>
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-[#e4e4e7]">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="w-4 h-4 text-[#1a1a2e]" />
          <span className="font-semibold text-sm text-[#18181b]">Filters</span>
        </div>
        {hasActiveFilters && (
          <button
            onClick={clearAll}
            className="flex items-center gap-1 text-xs text-[#e94560] hover:underline underline-offset-2"
          >
            <X className="w-3 h-3" />
            Clear all
          </button>
        )}
      </div>

      {/* In Stock / On Sale quick toggles */}
      <div className="py-4 border-b border-[#e4e4e7] space-y-1">
        <CheckOption
          label="In stock only"
          checked={inStock}
          onChange={() => toggleBoolean("inStock", inStock)}
        />
        <CheckOption
          label="On sale"
          checked={onSale}
          onChange={() => toggleBoolean("onSale", onSale)}
        />
      </div>

      {/* Price range */}
      <Section title="Price">
        <div className="space-y-3 pt-1">
          <input
            type="range"
            min={minPrice}
            max={maxPrice}
            step={5}
            value={priceRange[1]}
            onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
            onMouseUp={applyPriceRange}
            onTouchEnd={applyPriceRange}
            className="w-full accent-[#1a1a2e]"
          />
          <div className="flex justify-between text-xs text-[#71717a]">
            <span>{formatPrice(priceRange[0])}</span>
            <span>{formatPrice(priceRange[1])}</span>
          </div>
        </div>
      </Section>

      {/* Sizes */}
      {sizes.length > 0 && (
        <Section title="Size">
          {sizes.map((s) => (
            <CheckOption
              key={s.value}
              label={s.label}
              count={s.count}
              checked={activeSizes.includes(s.value)}
              onChange={() => toggleParam("size", s.value)}
            />
          ))}
        </Section>
      )}

      {/* Colors */}
      {colors.length > 0 && (
        <Section title="Color">
          {colors.map((c) => (
            <CheckOption
              key={c.value}
              label={c.label}
              count={c.count}
              color={c.value}
              checked={activeColors.includes(c.value)}
              onChange={() => toggleParam("color", c.value)}
            />
          ))}
        </Section>
      )}

      {/* Brands */}
      {brands.length > 0 && (
        <Section title="Brand">
          {brands.map((b) => (
            <CheckOption
              key={b.value}
              label={b.label}
              count={b.count}
              checked={activeBrands.includes(b.value)}
              onChange={() => toggleParam("brand", b.value)}
            />
          ))}
        </Section>
      )}
    </aside>
  )
}