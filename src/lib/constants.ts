import { HeroBanner } from "@/types";

type NavlinkProps = {
  label: string;
  href: string;
  type: "link" | "dropdown" | "mega";
  children?: { label: string; href: string }[];
}

export const navLinks:NavlinkProps[] = [
  { label: "Home", href: "/", type: "link" },
  {
    label: "Categories",
    href: "/products?category=mens",
    type: "mega",
    children: [
      { label: "Shirts", href: "/products?category=mens&sub=shirts" },
      { label: "Shorts & Jeans", href: "/products?category=mens&sub=shorts" },
      { label: "Jackets", href: "/products?category=mens&sub=jackets" },
      { label: "Shoes", href: "/products?category=mens&sub=shoes" },
    ],
  },
  {
    label: "Men's",
    href: "/products?category=mens",
    type: "dropdown",
    children: [
      { label: "Shirts", href: "/products?category=mens&sub=shirts" },
      { label: "Shorts & Jeans", href: "/products?category=mens&sub=shorts" },
      { label: "Jackets", href: "/products?category=mens&sub=jackets" },
      { label: "Shoes", href: "/products?category=mens&sub=shoes" },
    ],
  },
  {
    label: "Women's",
    href: "/products?category=womens",
    type: "dropdown",
    children: [
      { label: "Dresses", href: "/products?category=womens&sub=dresses" },
      { label: "Tops", href: "/products?category=womens&sub=tops" },
      { label: "Skirts", href: "/products?category=womens&sub=skirts" },
      { label: "Bags", href: "/products?category=womens&sub=bags" },
    ],
  },
  {
    label: "Jewelry",
    href: "/products?category=jewelry",
    type: "dropdown",
    children: [
      { label: "Earrings", href: "/products?category=jewelry&sub=earrings" },
      { label: "Necklaces", href: "/products?category=jewelry&sub=necklaces" },
      { label: "Rings", href: "/products?category=jewelry&sub=rings" },
      { label: "Bracelets", href: "/products?category=jewelry&sub=bracelets" },
    ],
  },
  { label: "Sale", href: "/products?sale=true", type: "link" },
];

// type FallbackImageProps = {
//   _id: string;
//   title: string;
//   subtitle?: string;
//   description?: string;
//   ctaText: string;
//   ctaLink: string;
//   badge?: string;
//   startingPrice?: number;
//   bgColor?: string;
//   bgImage?: string;
//   accentColor?: string;
// }

export const FALLBACK_BANNERS:HeroBanner[] = [
  {
    _id: "1",
    title: "Women's Latest\nFashion Sale",
    subtitle: "Trending item",
    description: "Elevate your wardrobe with our curated collection",
    ctaText: "Shop Now",
    ctaLink: "/products?category=womens",
    badge: "Trending item",
    startingPrice: 20,
    bgColor: "#fdf2f0",
    bgImage: "/assets/banner/trending_women.jpg",
    accentColor: "#e94560",
  },
  {
    _id: "2",
    title: "Modern\nSunglasses",
    subtitle: "Trending accessories",
    description: "Complete your look with our premium eyewear collection",
    ctaText: "Shop Now",
    ctaLink: "/products?category=accessories",
    badge: "Trending accessories",
    startingPrice: 15,
    bgColor: "#f0f4fd",
    bgImage: "/assets/banner/sunglasses_banner.jpg",
    accentColor: "#1a1a2e",
  },
  {
    _id: "3",
    title: "New Fashion\nSummer Sale",
    subtitle: "Sale Offer",
    description: "The hottest styles of the season, now at unbeatable prices",
    ctaText: "Shop Now",
    ctaLink: "/products?sale=true",
    badge: "Sale Offer",
    startingPrice: 29.99,
    bgColor: "#f0fdf4",
    bgImage: "/assets/banner/new_fashion.jpg",
    accentColor: "#22c55e",
  },
];

type FooterLink = {
  label: string;
  href: string;
};

type FooterLinks = {
  Shop: FooterLink[];
  Help: FooterLink[];
  Company: FooterLink[];
  Legal: FooterLink[];
};

export const footerLinks: FooterLinks = {
  Shop: [
    { label: "Men's Fashion", href: "/products?category=mens" },
    { label: "Women's Fashion", href: "/products?category=womens" },
    { label: "Jewelry", href: "/products?category=jewelry" },
    { label: "New Arrivals", href: "/products?new=true" },
    { label: "Sale", href: "/products?sale=true" },
  ],

  Help: [
    { label: "FAQs", href: "/faq" },
    { label: "Shipping Policy", href: "/shipping" },
    { label: "Returns & Exchanges", href: "/returns" },
    { label: "Track Order", href: "/orders" },
    { label: "Contact Us", href: "/contact" },
  ],

  Company: [
    { label: "About Clothio", href: "/about" },
    { label: "Blog", href: "/blog" },
    { label: "Careers", href: "/careers" },
    { label: "Our Story", href: "/our-story" },
    { label: "Affiliate Program", href: "/affiliate" },
  ],

  Legal: [
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Terms of Service", href: "/terms" },
    { label: "Cookie Policy", href: "/cookies" },
    { label: "Accessibility", href: "/accessibility" },
    { label: "Refund Policy", href: "/refund-policy" },
  ],
};
