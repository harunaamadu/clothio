import { HeroCarousel } from "@/components/home/HeroCarousel";
import { CategoryCarousel } from "@/components/layout/CategoryCarousel";
import { FALLBACK_BANNERS } from "@/lib/constants";
import { getFeaturedProducts, getHeroBanners, getPromoBanners } from "@/lib/sanity/queries";
import type { HeroBanner, Product, PromoBanner } from "@/types";
import Newsletter from "@/components/shared/Newsletter";
import HomeLayout from "@/components/home/HomeLayout";

export const revalidate = 3600;

export default async function HomePage() {
  let banners: HeroBanner[] = FALLBACK_BANNERS;
  let featured: Product[] = [];
  let promoBanners: PromoBanner[] = [];

  await Promise.all([
    getHeroBanners()
      .then((data) => { if (data.length > 0) banners = data; })
      .catch((err) => console.warn("Failed to fetch hero banners:", err)),

    getFeaturedProducts()
      .then((data) => { featured = data; })
      .catch((err) => console.warn("Failed to fetch featured products:", err)),

      getPromoBanners()
      .then((data) => { if (data.length > 0) promoBanners = data; })
      .catch((err) => console.warn("Failed to fetch promo banners:", err)),

  ]);

  return (
    <div className="relative flex flex-col w-full h-full space-y-0">
      <HeroCarousel banners={banners} />
      <CategoryCarousel />
      <HomeLayout />
      <Newsletter />
    </div>
  );
}