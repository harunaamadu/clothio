import React from "react";
import AsideCategory from "../layout/AsideCategory";
import { Product, PromoBanner } from "@/types";
import {
  getBestSellers,
  getFeaturedProducts,
  getNewArrivals,
  getTopRatedProducts,
  getPromoBanners,
} from "@/lib/sanity/queries";
import { NewArrivals } from "../layout/NewArrivals";
import { BestSellers } from "../layout/BestSellers";
import { TopRatedProducts } from "../layout/TopRatedProducts";
import { PromoBannerSection } from "./PromoBannerSection";
import { FeaturedProducts } from "../layout/FeaturedProducts";
import SimpleTitle from "../ui/simpleTitle";
import AdCard from "../layout/AdCard";

export const revalidate = 3600;

export default async function HomeLayout() {
  let featured: Product[] = [];
  let newArrivals: Product[] = [];
  let bestSellers: Product[] = [];
  let topRated: Product[] = [];
  let promoBanners: PromoBanner[] = [];

  await Promise.all([
    getFeaturedProducts()
      .then((data) => {
        featured = data;
      })
      .catch((err) => console.warn("Failed to fetch featured products:", err)),

    getNewArrivals()
      .then((data) => {
        newArrivals = data;
      })
      .catch((err) => console.warn("Failed to fetch new arrivals:", err)),

    getBestSellers()
      .then((data) => {
        bestSellers = data;
      })
      .catch((err) => console.warn("Failed to fetch best sellers:", err)),

    getTopRatedProducts()
      .then((data) => {
        topRated = data;
      })
      .catch((err) => console.warn("Failed to fetch topRated:", err)),

    getPromoBanners()
      .then((data) => {
        if (data.length > 0) promoBanners = data;
      })
      .catch((err) => console.warn("Failed to fetch promo banners:", err)),
  ]);

  return (
    <div className="w-full min-h-screen">
      <section className="relative w-full min-h-screen">
        <div className="layout grid gap-8 md:grid-cols-[280px_1fr] py-8 px-4">
          {/* Left sticky panel */}
          <aside className="relative h-full">
            <div className="sticky top-8 border-b">
              <AsideCategory />

              <div className="border mt-6 p-4 hidden md:block text-xs text-stone-400">
                <SimpleTitle title="advert &amp; more" fontSize="base" />

                <AdCard />
              </div>
            </div>
          </aside>

          {/* Right scrolling content */}
          <main className="grid gap-10">
            <div className="grid max-sm:grid-cols-1 grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* 1. render new products with minimal cards in 1 column */}
              <NewArrivals products={newArrivals} />

              {/* 2. render best products with title trending with minimal cards in 1 column */}
              <BestSellers products={bestSellers} />

              {/* 3. render top rated products with title trending with minimal cards in 1 column */}
              <TopRatedProducts products={topRated} />
            </div>

            <PromoBannerSection banners={promoBanners} />

            <FeaturedProducts products={featured} />
          </main>
        </div>
      </section>
    </div>
  );
}
