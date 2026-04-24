import { defineQuery } from 'next-sanity'
import { sanityClient } from './client'
import type { Product, ProductCategory, HeroBanner, BlogPost, ProductFiltersProps, PromoBanner } from '@/types'

// ─── GROQ Projections ─────────────────────────────────────────────────────────
// Defined once and reused across all queries to keep things DRY and consistent.

const IMAGE_PROJECTION = `{
  _type,
  asset,
  alt,
  hotspot,
  crop
}`

const CATEGORY_PROJECTION = `{
  _id,
  name,
  slug,
  description,
  image ${IMAGE_PROJECTION},
  "parentCategory": parentCategory->{ _id, name, slug }
}`

const PRODUCT_PROJECTION = `{
  _id,
  _createdAt,
  _updatedAt,
  name,
  slug,
  description,
  price,
  compareAtPrice,
  "images": images[] ${IMAGE_PROJECTION},
  "category": category-> ${CATEGORY_PROJECTION},
  tags,
  variants,
  isFeatured,
  isNewArrival,
  isBestSeller,
  stock,
  brand,
  material,
  careInstructions
}`

// Lighter projection used in listings — omits large fields like description/care
const PRODUCT_CARD_PROJECTION = `{
  _id,
  _createdAt,
  name,
  slug,
  price,
  compareAtPrice,
  "images": images[0..1] ${IMAGE_PROJECTION},
  "category": category->{ _id, name, slug },
  tags,
  variants,
  isFeatured,
  isNewArrival,
  isBestSeller,
  stock,
  brand
}`

// ─── Sort map ─────────────────────────────────────────────────────────────────

const SORT_MAP: Record<string, string> = {
  newest:      '_createdAt desc',
  oldest:      '_createdAt asc',
  'price-asc': 'price asc',
  'price-desc':'price desc',
  name:        'name asc',
}

// ─── Fetch helpers ────────────────────────────────────────────────────────────
// Thin wrapper so we can add `next` cache options in one place.

function fetchOne<T>(query: string, params: Record<string, unknown> = {}): Promise<T | null> {
  return sanityClient.fetch<T | null>(query, params, {
    next: { revalidate: 60, tags: ['sanity'] },
  })
}

function fetchMany<T>(query: string, params: Record<string, unknown> = {}): Promise<T[]> {
  return sanityClient.fetch<T[]>(query, params, {
    next: { revalidate: 60, tags: ['sanity'] },
  })
}

// ─── Products ─────────────────────────────────────────────────────────────────

/**
 * Flexible product listing query — supports filtering, sorting, and pagination.
 * All parameters are optional; sensible defaults apply.
 */
export async function getProducts(filters: ProductFiltersProps = {}): Promise<Product[]> {
  const {
    category,
    minPrice,
    maxPrice,
    sizes,
    colors,
    sort = 'newest',
    page = 1,
    perPage = 12,
    search,
    inStock,
    onSale,
  } = filters

  const conditions: string[] = ['_type == "product"']

  if (category)              conditions.push(`category->slug.current == $category`)
  if (search)                conditions.push(`name match $search`)
  if (minPrice !== undefined) conditions.push(`price >= $minPrice`)
  if (maxPrice !== undefined) conditions.push(`price <= $maxPrice`)
  if (inStock)               conditions.push(`stock > 0`)
  if (onSale)                conditions.push(`defined(compareAtPrice) && compareAtPrice > price`)
  if (sizes?.length)         conditions.push(`count(variants[size in $sizes]) > 0`)
  if (colors?.length)        conditions.push(`count(variants[color in $colors]) > 0`)

  const orderClause = SORT_MAP[sort] ?? '_createdAt desc'
  const offset = (page - 1) * perPage

  const query = `*[${conditions.join(' && ')}]
    | order(${orderClause})
    [$offset...$limit]
    ${PRODUCT_CARD_PROJECTION}`

  return fetchMany<Product>(query, {
    category: category ?? null,
    search: search ? `*${search}*` : null,
    minPrice: minPrice ?? null,
    maxPrice: maxPrice ?? null,
    sizes: sizes ?? [],
    colors: colors ?? [],
    offset,
    limit: offset + perPage,
  })
}

/**
 * Total count for the same filter set — used for pagination UI.
 */
export async function getProductCount(filters: Omit<ProductFiltersProps, 'page' | 'perPage' | 'sort'> = {}): Promise<number> {
  const {
    category,
    minPrice,
    maxPrice,
    sizes,
    colors,
    search,
    inStock,
    onSale,
  } = filters

  const conditions: string[] = ['_type == "product"']

  if (category)              conditions.push(`category->slug.current == $category`)
  if (search)                conditions.push(`name match $search`)
  if (minPrice !== undefined) conditions.push(`price >= $minPrice`)
  if (maxPrice !== undefined) conditions.push(`price <= $maxPrice`)
  if (inStock)               conditions.push(`stock > 0`)
  if (onSale)                conditions.push(`defined(compareAtPrice) && compareAtPrice > price`)
  if (sizes?.length)         conditions.push(`count(variants[size in $sizes]) > 0`)
  if (colors?.length)        conditions.push(`count(variants[color in $colors]) > 0`)

  const query = `count(*[${conditions.join(' && ')}])`

  return sanityClient.fetch<number>(query, {
    category: category ?? null,
    search: search ? `*${search}*` : null,
    minPrice: minPrice ?? null,
    maxPrice: maxPrice ?? null,
    sizes: sizes ?? [],
    colors: colors ?? [],
  }, { next: { revalidate: 60, tags: ['sanity'] } })
}

/**
 * Full product detail — includes description, care instructions, all images.
 */
export async function getProductBySlug(slug: string): Promise<Product | null> {
  const query = `*[_type == "product" && slug.current == $slug][0] ${PRODUCT_PROJECTION}`
  return fetchOne<Product>(query, { slug })
}

/**
 * Lookup by Sanity document _id — useful in server actions and webhooks.
 */
export async function getProductById(id: string): Promise<Product | null> {
  const query = `*[_type == "product" && _id == $id][0] ${PRODUCT_PROJECTION}`
  return fetchOne<Product>(query, { id })
}

/**
 * Lookup multiple products by an array of Sanity _ids at once.
 * Used by the wishlist page to resolve stored IDs into full product data.
 */
export async function getProductsByIds(ids: string[]): Promise<Product[]> {
  if (!ids.length) return []
  const query = `*[_type == "product" && _id in $ids] ${PRODUCT_CARD_PROJECTION}`
  return fetchMany<Product>(query, { ids })
}

// ─── Homepage product sets ────────────────────────────────────────────────────

export async function getFeaturedProducts(limit = 8): Promise<Product[]> {
  const query = `*[_type == "product" && isFeatured == true]
    | order(_createdAt desc)[0...$limit]
    ${PRODUCT_CARD_PROJECTION}`
  return fetchMany<Product>(query, { limit })
}

export async function getNewArrivals(limit = 8): Promise<Product[]> {
  const query = `*[_type == "product" && isNewArrival == true]
    | order(_createdAt desc)[0...$limit]
    ${PRODUCT_CARD_PROJECTION}`
  return fetchMany<Product>(query, { limit })
}

export async function getBestSellers(limit = 4): Promise<Product[]> {
  const query = `*[_type == "product" && isBestSeller == true]
    | order(_createdAt desc)[0...$limit]
    ${PRODUCT_CARD_PROJECTION}`
  return fetchMany<Product>(query, { limit })
}

export async function getOnSaleProducts(limit = 8): Promise<Product[]> {
  const query = `*[_type == "product" && defined(compareAtPrice) && compareAtPrice > price]
    | order(_createdAt desc)[0...$limit]
    ${PRODUCT_CARD_PROJECTION}`
  return fetchMany<Product>(query, { limit })
}

export async function getTopRatedProducts(limit = 8): Promise<Product[]> {
  const query = `*[_type == "product"]
    | order(coalesce(rating, 0) desc, _createdAt desc)[0...$limit]
    ${PRODUCT_CARD_PROJECTION}`
  return fetchMany<Product>(query, { limit })
}

/**
 * Related products — same category, excludes the current product.
 * Falls back to recent products from any category if not enough are found.
 */
export async function getRelatedProducts(
  productId: string,
  categoryId: string,
  limit = 4,
): Promise<Product[]> {
  const query = `*[_type == "product" && _id != $productId && category._ref == $categoryId]
    | order(_createdAt desc)[0...$limit]
    ${PRODUCT_CARD_PROJECTION}`

  const results = await fetchMany<Product>(query, { productId, categoryId, limit })

  // Fallback — fill remaining slots with recent products from other categories
  if (results.length < limit) {
    const excludeIds = [productId, ...results.map((p) => p._id)]
    const fallbackQuery = `*[_type == "product" && !(_id in $excludeIds)]
      | order(_createdAt desc)[0...$needed]
      ${PRODUCT_CARD_PROJECTION}`
    const fallback = await fetchMany<Product>(fallbackQuery, {
      excludeIds,
      needed: limit - results.length,
    })
    return [...results, ...fallback]
  }

  return results
}

/**
 * Search products by name — used for the search bar autocomplete.
 */
export async function searchProducts(query: string, limit = 8): Promise<Product[]> {
  if (!query.trim()) return []
  const groq = `*[_type == "product" && name match $query]
    | order(_createdAt desc)[0...$limit]
    ${PRODUCT_CARD_PROJECTION}`
  return fetchMany<Product>(groq, { query: `*${query}*`, limit })
}

/**
 * All distinct sizes across all products — used to populate the filter sidebar.
 */
export async function getAllSizes(): Promise<string[]> {
  const query = `array::unique(*[_type == "product"].variants[].size)`
  const result = await sanityClient.fetch<(string | null)[]>(query, {}, {
    next: { revalidate: 3600, tags: ['sanity'] },
  })
  return result.filter((s): s is string => s !== null && s !== undefined && s !== "").sort()
  // return result.filter((s): s is string => !!s).sort()
}

/**
 * All distinct colors across all products — used to populate the filter sidebar.
 */
export async function getAllColors(): Promise<{ name: string; hex?: string }[]> {
  const query = `array::unique(*[_type == "product"].variants[]{ "name": color, "hex": colorHex })`
  const result = await sanityClient.fetch<({ name: string | null; hex?: string | null })[]>(
    query, {}, { next: { revalidate: 3600, tags: ['sanity'] } }
  )
  return result.filter((c): c is { name: string; hex?: string } => !!c && !!c.name)
  // return result.filter((c): c is { name: string; hex?: string } => !!c.name)
}

/**
 * All distinct brands — used to populate the brand filter.
 */
export async function getAllBrands(): Promise<string[]> {
  const query = `array::unique(*[_type == "product" && defined(brand)].brand)`
  const result = await sanityClient.fetch<(string | null)[]>(query, {}, {
    next: { revalidate: 3600, tags: ['sanity'] },
  })
  return result.filter((b): b is string => !!b).sort()
}

// ─── Categories ───────────────────────────────────────────────────────────────

/**
 * Top-level categories only (no parentCategory set).
 */
export async function getCategories(): Promise<ProductCategory[]> {
  const query = `*[_type == "productCategory" && !defined(parentCategory)]
    | order(order asc)
    ${CATEGORY_PROJECTION}`
  return fetchMany<ProductCategory>(query)
}

/**
 * All categories, including subcategories — used for mega-menu.
 */
export async function getAllCategories(): Promise<ProductCategory[]> {
  const query = `*[_type == "productCategory"] | order(order asc) ${CATEGORY_PROJECTION}`
  return fetchMany<ProductCategory>(query)
}

export async function getCategoryBySlug(slug: string): Promise<ProductCategory | null> {
  const query = `*[_type == "productCategory" && slug.current == $slug][0] ${CATEGORY_PROJECTION}`
  return fetchOne<ProductCategory>(query, { slug })
}

/**
 * Each category with a count of products in it.
 */
export async function getCategoriesWithCount(): Promise<
  (ProductCategory & { productCount: number })[]
> {
  const query = `*[_type == "productCategory" && !defined(parentCategory)]
    | order(order asc)
    {
      ${CATEGORY_PROJECTION.slice(1, -1)},
      "productCount": count(*[_type == "product" && category._ref == ^._id])
    }`
  return fetchMany(query)
}

// ─── Hero Banners ─────────────────────────────────────────────────────────────

export async function getHeroBanners(): Promise<HeroBanner[]> {
  const query = `*[_type == "heroBanner" && isActive == true]
    | order(order asc)
    {
      _id,
      title,
      subtitle,
      description,
      badge,
      startingPrice,
      ctaText,
      ctaLink,
      bgImage ${IMAGE_PROJECTION},
      mobileImage ${IMAGE_PROJECTION},
      bgColor,
      accentColor,
      isActive,
      order
    }`
  return fetchMany<HeroBanner>(query)
}

// ─── Promo Banners ────────────────────────────────────────────────────────────
 
export async function getPromoBanners(): Promise<PromoBanner[]> {
  const query = `*[_type == "promoBanner" && isActive == true]
    | order(order asc)
    {
      _id,
      label,
      headline,
      subheadline,
      ctaText,
      ctaLink,
      image ${IMAGE_PROJECTION},
      accentColor,
      bgFrom,
      bgTo,
      timerEnabled,
      expiresAt,
      expiredLabel,
      discountBadge,
      isActive,
      order
    }`
  return fetchMany<PromoBanner>(query)
}

// ─── Blog ─────────────────────────────────────────────────────────────────────

export async function getBlogPosts(limit = 6): Promise<BlogPost[]> {
  const query = `*[_type == "blogPost"] | order(publishedAt desc)[0...$limit]
    {
      _id,
      title,
      slug,
      excerpt,
      mainImage ${IMAGE_PROJECTION},
      author { name, image ${IMAGE_PROJECTION} },
      categories,
      publishedAt,
      readTime
    }`
  return fetchMany<BlogPost>(query, { limit })
}

export async function getBlogPostBySlug(slug: string): Promise<BlogPost | null> {
  const query = `*[_type == "blogPost" && slug.current == $slug][0]
    {
      _id,
      title,
      slug,
      excerpt,
      body,
      mainImage ${IMAGE_PROJECTION},
      author { name, image ${IMAGE_PROJECTION} },
      categories,
      publishedAt,
      readTime
    }`
  return fetchOne<BlogPost>(query, { slug })
}

// ─── Price range ──────────────────────────────────────────────────────────────

/**
 * Min and max price across all products — used to initialise the price slider.
 */
export async function getPriceRange(): Promise<{ min: number; max: number }> {
  const query = `{
    "min": math::min(*[_type == "product"].price),
    "max": math::max(*[_type == "product"].price)
  }`
  const result = await sanityClient.fetch<{ min: number; max: number }>(query, {}, {
    next: { revalidate: 3600, tags: ['sanity'] },
  })
  return { min: result.min ?? 0, max: result.max ?? 1000 }
}