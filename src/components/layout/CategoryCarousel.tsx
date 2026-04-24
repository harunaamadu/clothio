import { getCategoriesWithCount } from "@/lib/sanity/queries";
import CategoryCarouselClient from "../home/CategoryCarouselClient";

export async function CategoryCarousel() {
  type Categories = Awaited<ReturnType<typeof getCategoriesWithCount>>;
  let categories: Categories = [];

  try {
    categories = await getCategoriesWithCount();
  } catch (error) {
    console.warn("Sanity fetch failed for categories:", error);
  }

  return <CategoryCarouselClient categories={categories} />;
}