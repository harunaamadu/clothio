import { HeroCarousel } from "@/components/home/HeroCarousel";
import { FALLBACK_BANNERS } from "@/lib/constants";
// import { CategoryGrid } from "@/components/home/CategoryGrid";
// import { NewArrivals } from "@/components/home/NewArrivals";
// import { BestSellers } from "@/components/home/BestSellers";
// import { PromoBanner } from "@/components/home/PromoBanner";
// import { FeaturedProducts } from "@/components/home/FeaturedProducts";
// import { NewsletterSection } from "@/components/home/NewsletterSection";
// import { getHeroBanners, getNewArrivals, getBestSellers, getFeaturedProducts } from "@/lib/sanity/queries";

export const revalidate = 3600; // revalidate every hour

export default async function HomePage() {
  // const [banners, newArrivals, bestSellers, featured] = await Promise.all([
  //   getHeroBanners(),
  //   getNewArrivals(),
  //   getBestSellers(),
  //   getFeaturedProducts(),
  // ]);

  return (
    <div className="space-y-0">
      <HeroCarousel banners={FALLBACK_BANNERS} />
      {/* <CategoryGrid />
      <NewArrivals products={newArrivals} />
      <PromoBanner />
      <BestSellers products={bestSellers} />
      <FeaturedProducts products={featured} />
      <NewsletterSection /> */}
    </div>
  );
}