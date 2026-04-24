// ─── Auth & User ────────────────────────────────────────────────────────────

export type UserRole = "USER" | "ADMIN";

export interface User {
  id: string;
  name: string | null;
  email: string;
  image: string | null;
  role: UserRole;
  createdAt: Date;
}

// ─── Sanity Image ────────────────────────────────────────────────────────────

export interface SanityImage {
  _type: "image";
  asset: {
    url?: string;
    alt?: string;
    _ref: string;
    _type: "reference";
  };
  hotspot?: {
    x: number;
    y: number;
    height: number;
    width: number;
  };
  crop?: {
    top: number;
    bottom: number;
    left: number;
    right: number;
  };
}

// ─── Product ─────────────────────────────────────────────────────────────────

export interface ProductCategory {
  _id: string | any;
  name: string;
  slug: { current: string };
  description?: string;
  image?: SanityImage;
  parentCategory?: { _id: string; name: string; slug: { current: string } };
}

export interface ProductVariant {
  _key: string;
  size?: string;
  color?: string;
  colorHex?: string;
  price?: number;
  stock: number;
  sku?: string;
}

export interface  Product {
  _id: string;
  name: string;
  slug: { current: string };
  description?: string;
  price: number;
  compareAtPrice?: number;
  images: SanityImage[];
  category?: ProductCategory;
  variants?: ProductVariant[];
  stock?: number;
  sku?: string;
  isNewArrival?: boolean;
  isBestSeller?: boolean;
  isFeatured?: boolean;
  rating?: number;
  reviewCount?: number;
  tags?: string[];

  brand?: string;
  material?: string;
  careInstructions?: string;
  
  _createdAt?: string;
  _updatedAt?: string;
}

export interface PromoBanner {
  _id: string
  label: string
  headline: string
  subheadline?: string
  ctaText?: string
  ctaLink?: string
  image: SanityImage
  accentColor?: string
  bgFrom?: string
  bgTo?: string
  timerEnabled?: boolean
  expiresAt?: string        // ISO datetime string from Sanity
  expiredLabel?: string
  discountBadge?: string
  isActive: boolean
  order: number
}

// ─── Hero Banner ─────────────────────────────────────────────────────────────

export interface HeroBanner {
  _id: string;
  title: string;
  subtitle?: string;
  description?: string;
  ctaText: string;
  ctaLink: string;
  badge?: string;
  startingPrice?: number;
  bgColor?: string;
  accentColor?: string;
  image?: SanityImage;
  bgImage?: SanityImage;
  mobileImage?: SanityImage;
}

// ─── Cart ────────────────────────────────────────────────────────────────────

export interface CartItem {
  id: string;
  productId: string;
  variantId?: string;
  name: string;
  slug: string;
  image: string | SanityImage | null | any;
  price: number;
  quantity: number;
  size?: string;
  color?: string;
  stock: number;
}

// ─── Order ───────────────────────────────────────────────────────────────────

export type OrderStatus =
  | "PENDING"
  | "PROCESSING"
  | "SHIPPED"
  | "DELIVERED"
  | "CANCELLED"
  | "REFUNDED";

export interface OrderItem {
  id: string;
  productId: string;
  variantId?: string;
  name: string;
  image: string | SanityImage;
  price: number;
  quantity: number;
  size?: string;
  color?: string;
}

export interface ShippingAddress {
  name: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

export interface Order {
  id: string;
  userId: string;
  items: OrderItem[];
  status: OrderStatus;
  subtotal: number;
  shippingCost: number;
  tax: number;
  total: number;
  shippingAddress: ShippingAddress;
  stripePaymentIntentId?: string;
  stripeSessionId?: string;
  createdAt: Date;
  updatedAt: Date;
}

// ─── Review ──────────────────────────────────────────────────────────────────

export interface Review {
  id: string;
  productId: string;
  userId: string;
  userName: string;
  userImage?: string;
  rating: number;
  title?: string;
  body: string;
  createdAt: Date;
}

// ─── Blog Post ───────────────────────────────────────────────────────────────

export interface BlogPost {
  _id: string;
  title: string;
  slug: { current: string };
  excerpt?: string;
  body?: unknown; // Portable Text
  coverImage?: SanityImage;
  author?: {
    name: string;
    image?: SanityImage;
  };
  publishedAt?: string;
  tags?: string[];
}

// ─── Filters & Sorting ───────────────────────────────────────────────────────

export type SortOption =
  | "featured"
  | "newest"
  | "oldest"
  | "name"
  | "price-asc"
  | "price-desc"
  | "rating"
  | "best-selling";

export interface ProductFiltersProps {
  category?: string;
  sub?: string;
  search?: string;
  inStock?: number | boolean;
  onSale?: boolean;
  new?: boolean;
  minPrice?: number;
  maxPrice?: number;
  sizes?: string[];
  colors?: string[];
  brands?: string[];
  sort?: SortOption;
  page?: number;
  perPage?: number;
  limit?: number;
}

// ─── API Responses ───────────────────────────────────────────────────────────

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ApiError {
  error: string | Record<string, unknown>;
  status?: number;
}

// ─── Checkout ────────────────────────────────────────────────────────────────

export interface CheckoutFormData {
  email: string;
  name: string;
  phone?: string;
  address: ShippingAddress;
  saveAddress?: boolean;
}

export interface StripeCheckoutSession {
  sessionId: string;
  url: string;
}

export type BrandCategory =
  | "Fashion"
  | "Footwear"
  | "Jewellery"
  | "Cosmetics";

export interface BrandDirectoryItem {
  category: BrandCategory;
  items: string[];
}
