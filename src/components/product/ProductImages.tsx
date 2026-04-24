"use client"

import { useState, useCallback } from "react"
import Image from "next/image"
import { ChevronLeft, ChevronRight, ZoomIn, X } from "lucide-react"
import { getImageUrl } from "@/lib/sanity/client"
import { cn } from "@/lib/utils"
import type { SanityImage } from "@/types"

interface ProductImagesProps {
  images: SanityImage[]
  productName: string
}

export function ProductImages({ images, productName }: ProductImagesProps) {
  const [activeIndex, setActiveIndex]   = useState(0)
  const [zoomOpen, setZoomOpen]         = useState(false)
  const [zoomIndex, setZoomIndex]       = useState(0)

  const urls = images.map((img) => ({
    full:  getImageUrl(img, 1200, 1200),
    thumb: getImageUrl(img, 200, 200),
    alt:   img.asset.alt ?? productName,
  }))

  const prev = useCallback(() =>
    setActiveIndex((i) => (i - 1 + urls.length) % urls.length), [urls.length])
  const next = useCallback(() =>
    setActiveIndex((i) => (i + 1) % urls.length), [urls.length])

  const openZoom = (index: number) => {
    setZoomIndex(index)
    setZoomOpen(true)
  }

  const zoomPrev = () => setZoomIndex((i) => (i - 1 + urls.length) % urls.length)
  const zoomNext = () => setZoomIndex((i) => (i + 1) % urls.length)

  return (
    <>
      <div className="flex gap-3 lg:flex-row flex-col-reverse">
        {/* Thumbnail strip — vertical on desktop, horizontal on mobile */}
        {urls.length > 1 && (
          <div className="flex lg:flex-col gap-2 overflow-x-auto lg:overflow-y-auto lg:max-h-130 pb-1 lg:pb-0">
            {urls.map((img, i) => (
              <button
                key={i}
                onClick={() => setActiveIndex(i)}
                className={cn(
                  "relative shrink-0 w-16 h-20 lg:w-14 lg:h-17 overflow-hidden border-2 transition-all",
                  i === activeIndex
                    ? "border-[#1a1a2e] shadow-sm"
                    : "border-[#e4e4e7] hover:border-[#a1a1aa]"
                )}
                aria-label={`View image ${i + 1}`}
              >
                <Image
                  src={img.thumb}
                  alt={img.alt}
                  fill
                  sizes="64px"
                  className="object-cover"
                />
              </button>
            ))}
          </div>
        )}

        {/* Main image */}
        <div className="relative flex-1 aspect-square lg:aspect-4/5 overflow-hidden bg-[#f4f4f5] group">
          <Image
            src={urls[activeIndex]?.full ?? ""}
            alt={urls[activeIndex]?.alt ?? productName}
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover transition-opacity duration-300"
          />

          {/* Zoom button */}
          <button
            onClick={() => openZoom(activeIndex)}
            className="absolute top-3 right-3 w-9 h-9 bg-white/90 hover:bg-white flex items-center justify-center shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
            aria-label="Zoom image"
          >
            <ZoomIn className="w-4 h-4 text-[#1a1a2e]" />
          </button>

          {/* Prev / Next arrows */}
          {urls.length > 1 && (
            <>
              <button
                onClick={prev}
                className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-white/90 hover:bg-white flex items-center justify-center shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
                aria-label="Previous image"
              >
                <ChevronLeft className="w-4 h-4 text-[#1a1a2e]" />
              </button>
              <button
                onClick={next}
                className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-white/90 hover:bg-white flex items-center justify-center shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
                aria-label="Next image"
              >
                <ChevronRight className="w-4 h-4 text-[#1a1a2e]" />
              </button>
            </>
          )}

          {/* Dot indicators (mobile) */}
          {urls.length > 1 && (
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 lg:hidden">
              {urls.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setActiveIndex(i)}
                  className={cn(
                    "rounded-full transition-all",
                    i === activeIndex
                      ? "w-4 h-1.5 bg-[#1a1a2e]"
                      : "w-1.5 h-1.5 bg-white/70"
                  )}
                  aria-label={`Image ${i + 1}`}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ── Lightbox / zoom overlay ── */}
      {zoomOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center"
          onClick={() => setZoomOpen(false)}
        >
          {/* Close */}
          <button
            onClick={() => setZoomOpen(false)}
            className="absolute top-4 right-4 w-10 h-10 bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
            aria-label="Close zoom"
          >
            <X className="w-5 h-5 text-white" />
          </button>

          {/* Image */}
          <div
            className="relative w-full max-w-3xl aspect-square mx-6"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={urls[zoomIndex]?.full ?? ""}
              alt={urls[zoomIndex]?.alt ?? productName}
              fill
              sizes="(max-width: 768px) 100vw, 768px"
              className="object-contain"
            />
          </div>

          {/* Nav arrows in zoom */}
          {urls.length > 1 && (
            <>
              <button
                onClick={(e) => { e.stopPropagation(); zoomPrev() }}
                className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
                aria-label="Previous"
              >
                <ChevronLeft className="w-5 h-5 text-white" />
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); zoomNext() }}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
                aria-label="Next"
              >
                <ChevronRight className="w-5 h-5 text-white" />
              </button>
            </>
          )}

          {/* Counter */}
          <p className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white/60 text-sm">
            {zoomIndex + 1} / {urls.length}
          </p>
        </div>
      )}
    </>
  )
}