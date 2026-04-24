import Image from "next/image";
import Link from "next/link";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { getAllCategories } from "@/lib/sanity/queries";
import { getImageUrl } from "@/lib/sanity/client";
import type { ProductCategory } from "@/types";
import SimpleTitle from "../ui/simpleTitle";
import Reveal from "../animations/reveal";

// Icon map for known category name fragments
const ICON_MAP: Record<string, string> = {
  cloth: "/assets/icons/svg/dress.svg",
  dress: "/assets/icons/svg/dress.svg",
  wear: "/assets/icons/svg/dress.svg",
  shirt: "/assets/icons/svg/dress.svg",
  shoe: "/assets/icons/svg/shoes.svg",
  footwear: "/assets/icons/svg/shoes.svg",
  boot: "/assets/icons/svg/shoes.svg",
  sandal: "/assets/icons/svg/shoes.svg",
  jewel: "/assets/icons/svg/jewelry.svg",
  ring: "/assets/icons/svg/jewelry.svg",
  necklace: "/assets/icons/svg/jewelry.svg",
  cosmetic: "/assets/icons/svg/cosmetics.svg",
  makeup: "/assets/icons/svg/cosmetics.svg",
  beauty: "/assets/icons/svg/cosmetics.svg",
  perfume: "/assets/icons/svg/perfume.svg",
  fragrance: "/assets/icons/svg/perfume.svg",
};

function getCategoryIcon(name: string): string {
  const n = name.toLowerCase();
  for (const [key, icon] of Object.entries(ICON_MAP)) {
    if (n.includes(key)) return icon;
  }
  return "/assets/icons/svg/dress.svg"; // default fallback
}

const AsideCategory = async () => {
  let allCategories: ProductCategory[] = [];

  try {
    allCategories = await getAllCategories();
  } catch (error) {
    console.warn("Failed to fetch categories:", error);
  }

  // Split into top-level and children
  const topLevel = allCategories.filter((c) => !c.parentCategory);
  const children = allCategories.filter((c) => !!c.parentCategory);

  // Group children by parent _id
  const childMap = children.reduce<Record<string, ProductCategory[]>>(
    (acc, child) => {
      const parentId = child.parentCategory?._id;
      if (!parentId) return acc;
      if (!acc[parentId]) acc[parentId] = [];
      acc[parentId].push(child);
      return acc;
    },
    {},
  );

  if (!topLevel.length) {
    return (
      <div className="text-sm text-[#71717a] py-4 text-center border border-dashed border-[#e4e4e7] rounded-lg">
        No categories yet.
      </div>
    );
  }

  return (
    <div>
      <SimpleTitle title="category" fontSize="base" />

      <Reveal>
        <Accordion type="single" collapsible className="w-full" data-reveal>
          {topLevel.map((category, index) => {
            const icon = getCategoryIcon(category.name);
            const imageUrl = category.image
              ? getImageUrl(category.image, 24, 24)
              : null;
            const subs = childMap[category._id] ?? [];

            return (
              <AccordionItem key={category._id} value={`item-${index}`}>
                <AccordionTrigger className="flex items-center gap-2 text-sm font-medium text-[#18181b] hover:text-primary transition-colors">
                  {imageUrl ? (
                    <Image
                      src={imageUrl}
                      alt={category.name}
                      width={16}
                      height={16}
                      className="object-cover shrink-0"
                    />
                  ) : (
                    <Image
                      src={icon}
                      alt={category.name}
                      width={16}
                      height={16}
                      className="object-cover shrink-0"
                    />
                  )}
                  {category.name}
                </AccordionTrigger>

                <AccordionContent>
                  {subs.length > 0 ? (
                    <ul className="space-y-1 pl-6 pt-1">
                      {subs.map((sub) => (
                        <li key={sub._id}>
                          <Link
                            href={`/products?category=${sub.slug.current}`}
                            className="text-sm text-[#71717a] hover:text-primary transition-colors block py-0.5"
                          >
                            {sub.name}
                          </Link>
                        </li>
                      ))}
                      <li>
                        <Link
                          href={`/products?category=${category.slug.current}`}
                          className="text-xs font-medium text-primary hover:underline underline-offset-2 block py-0.5"
                        >
                          View all {category.name}
                        </Link>
                      </li>
                    </ul>
                  ) : (
                    <div className="pl-6 pt-1">
                      <Link
                        href={`/products?category=${category.slug.current}`}
                        className="text-sm text-[#71717a] hover:text-primary transition-colors"
                      >
                        View all {category.name}
                      </Link>
                    </div>
                  )}
                </AccordionContent>
              </AccordionItem>
            );
          })}
        </Accordion>
      </Reveal>
    </div>
  );
};

export default AsideCategory;
