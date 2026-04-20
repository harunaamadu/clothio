import { HeroCarousel } from "@/components/home/HeroCarousel";
import { CategoryCarousel } from "@/components/home/CategoryCarousel";
import { FeaturedProducts } from "@/components/home/FeaturedProducts";
import { FALLBACK_BANNERS } from "@/lib/constants";
import { getBestSellers, getFeaturedProducts, getHeroBanners, getNewArrivals } from "@/lib/sanity/queries";
import type { HeroBanner, Product } from "@/types";
import { NewArrivals } from "@/components/home/NewArrivals";
import { BestSellers } from "@/components/home/BestSellers";

export const revalidate = 3600;

export default async function HomePage() {
  let banners: HeroBanner[] = FALLBACK_BANNERS;
  let featured: Product[] = [];
  let newArrivals: Product[] = [];
  let bestSellers: Product[] = [];

  await Promise.all([
    getHeroBanners()
      .then((data) => { if (data.length > 0) banners = data; })
      .catch((err) => console.warn("Failed to fetch hero banners:", err)),

    getFeaturedProducts()
      .then((data) => { featured = data; })
      .catch((err) => console.warn("Failed to fetch featured products:", err)),
      
    getNewArrivals()
      .then((data) => { newArrivals = data; })
      .catch((err) => console.warn("Failed to fetch new arrivals:", err)),
      
    getBestSellers()
      .then((data) => { bestSellers = data; })
      .catch((err) => console.warn("Failed to fetch best sellers:", err)),

  ]);

  return (
    <div className="space-y-0">
      <HeroCarousel banners={banners} />
      <CategoryCarousel />
      <FeaturedProducts products={featured} />
      <NewArrivals products={newArrivals} />
      <BestSellers products={bestSellers} />
    </div>
  );
}