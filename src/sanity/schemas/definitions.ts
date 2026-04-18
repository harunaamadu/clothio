import { defineType, defineField, defineArrayMember } from 'sanity'

// ─── Product Category ─────────────────────────────────────────────────────────

export const productCategory = defineType({
  name: 'productCategory',
  title: 'Product Category',
  type: 'document',
  fields: [
    defineField({ name: 'name', title: 'Name', type: 'string', validation: (r) => r.required() }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: 'name' },
      validation: (r) => r.required(),
    }),
    defineField({ name: 'description', title: 'Description', type: 'text', rows: 2 }),
    defineField({
      name: 'image',
      title: 'Category Image',
      type: 'image',
      options: { hotspot: true },
    }),
    defineField({
      name: 'parentCategory',
      title: 'Parent Category',
      type: 'reference',
      to: [{ type: 'productCategory' }],
    }),
    defineField({ name: 'order', title: 'Display Order', type: 'number', initialValue: 0 }),
  ],
  preview: {
    select: { title: 'name', media: 'image' },
  },
})

// ─── Product ──────────────────────────────────────────────────────────────────

export const product = defineType({
  name: 'product',
  title: 'Product',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Product Name',
      type: 'string',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: 'name', maxLength: 96 },
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'array',
      of: [defineArrayMember({ type: 'block' })],
    }),
    defineField({
      name: 'price',
      title: 'Price (USD)',
      type: 'number',
      validation: (r) => r.required().min(0),
    }),
    defineField({
      name: 'compareAtPrice',
      title: 'Compare At Price',
      description: 'Original price before discount',
      type: 'number',
    }),
    defineField({
      name: 'images',
      title: 'Images',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'image',
          options: { hotspot: true },
          fields: [
            defineField({ name: 'alt', title: 'Alt Text', type: 'string' }),
          ],
        }),
      ],
      validation: (r) => r.min(1).error('At least one image is required'),
    }),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'reference',
      to: [{ type: 'productCategory' }],
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'tags',
      title: 'Tags',
      type: 'array',
      of: [defineArrayMember({ type: 'string' })],
      options: { layout: 'tags' },
    }),
    defineField({
      name: 'variants',
      title: 'Variants',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'variant',
          title: 'Variant',
          fields: [
            defineField({ name: 'color', title: 'Color Name', type: 'string' }),
            defineField({ name: 'colorHex', title: 'Color Hex', type: 'string', description: 'e.g. #FF5733' }),
            defineField({ name: 'size', title: 'Size', type: 'string' }),
            defineField({ name: 'stock', title: 'Stock', type: 'number', initialValue: 10 }),
            defineField({ name: 'price', title: 'Override Price', type: 'number', description: 'Leave blank to use product price' }),
            defineField({ name: 'sku', title: 'SKU', type: 'string' }),
          ],
          preview: {
            select: { color: 'color', size: 'size', stock: 'stock' },
            prepare: ({ color, size, stock }) => ({
              title: [color, size].filter(Boolean).join(' / ') || 'Variant',
              subtitle: `Stock: ${stock ?? 0}`,
            }),
          },
        }),
      ],
    }),
    defineField({ name: 'isFeatured', title: 'Featured Product', type: 'boolean', initialValue: false }),
    defineField({ name: 'isNewArrival', title: 'New Arrival', type: 'boolean', initialValue: false }),
    defineField({ name: 'isBestSeller', title: 'Best Seller', type: 'boolean', initialValue: false }),
    defineField({
      name: 'stock',
      title: 'Default Stock',
      type: 'number',
      initialValue: 100,
      description: 'Used when no variants are defined',
    }),
    defineField({ name: 'brand', title: 'Brand', type: 'string' }),
    defineField({ name: 'material', title: 'Material', type: 'string' }),
    defineField({ name: 'careInstructions', title: 'Care Instructions', type: 'text', rows: 2 }),
  ],
  preview: {
    select: { title: 'name', media: 'images.0', price: 'price' },
    prepare: ({ title, media, price }) => ({
      title,
      media,
      subtitle: price ? `$${price}` : 'No price set',
    }),
  },
  orderings: [
    { title: 'Newest', name: 'createdAtDesc', by: [{ field: '_createdAt', direction: 'desc' }] },
    { title: 'Price ↑', name: 'priceAsc', by: [{ field: 'price', direction: 'asc' }] },
    { title: 'Price ↓', name: 'priceDesc', by: [{ field: 'price', direction: 'desc' }] },
    { title: 'Name A–Z', name: 'nameAsc', by: [{ field: 'name', direction: 'asc' }] },
  ],
})

// ─── Hero Banner ──────────────────────────────────────────────────────────────

export const heroBanner = defineType({
  name: 'heroBanner',
  title: 'Hero Banner',
  type: 'document',
  fields: [
    defineField({ name: 'title', title: 'Title', type: 'string', validation: (r) => r.required() }),
    defineField({ name: 'subtitle', title: 'Subtitle', type: 'string' }),
    defineField({ name: 'description', title: 'Description', type: 'text', rows: 2 }),
    defineField({ name: 'badge', title: 'Badge Label', type: 'string', description: 'e.g. "Trending item"' }),
    defineField({ name: 'startingPrice', title: 'Starting Price', type: 'number' }),
    defineField({ name: 'ctaText', title: 'CTA Button Text', type: 'string', initialValue: 'Shop Now' }),
    defineField({ name: 'ctaLink', title: 'CTA Link', type: 'string', initialValue: '/products' }),
    defineField({
      name: 'bgImage',
      title: 'Background Image',
      type: 'image',
      options: { hotspot: true },
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'image',
      title: 'Desktop Image',
      type: 'image',
      options: { hotspot: true },
    }),
    defineField({
      name: 'mobileImage',
      title: 'Mobile Image (optional)',
      type: 'image',
      options: { hotspot: true },
    }),
    defineField({ name: 'bgColor', title: 'Background Color', type: 'string', description: 'CSS color, e.g. #fdf2f0', initialValue: '#fdf2f0' }),
    defineField({ name: 'accentColor', title: 'Accent Color', type: 'string', description: 'Button & badge color', initialValue: '#e94560' }),
    defineField({ name: 'isActive', title: 'Active', type: 'boolean', initialValue: true }),
    defineField({ name: 'order', title: 'Display Order', type: 'number', initialValue: 0 }),
  ],
  preview: {
    select: { title: 'title', media: 'image', active: 'isActive' },
    prepare: ({ title, media, active }) => ({
      title,
      media,
      subtitle: active ? '✓ Active' : '✗ Inactive',
    }),
  },
  orderings: [
    { title: 'Display Order', name: 'orderAsc', by: [{ field: 'order', direction: 'asc' }] },
  ],
})

// ─── Blog Post ────────────────────────────────────────────────────────────────

export const blogPost = defineType({
  name: 'blogPost',
  title: 'Blog Post',
  type: 'document',
  fields: [
    defineField({ name: 'title', title: 'Title', type: 'string', validation: (r) => r.required() }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: 'title' },
      validation: (r) => r.required(),
    }),
    defineField({ name: 'excerpt', title: 'Excerpt', type: 'text', rows: 2 }),
    defineField({
      name: 'mainImage',
      title: 'Main Image',
      type: 'image',
      options: { hotspot: true },
      fields: [
        defineField({ name: 'alt', title: 'Alt Text', type: 'string' }),
      ],
    }),
    defineField({
      name: 'body',
      title: 'Body',
      type: 'array',
      of: [defineArrayMember({ type: 'block' })],
    }),
    defineField({
      name: 'author',
      title: 'Author',
      type: 'object',
      fields: [
        defineField({ name: 'name', title: 'Name', type: 'string' }),
        defineField({ name: 'image', title: 'Photo', type: 'image', options: { hotspot: true } }),
      ],
    }),
    defineField({
      name: 'categories',
      title: 'Categories',
      type: 'array',
      of: [defineArrayMember({ type: 'string' })],
      options: { layout: 'tags' },
    }),
    defineField({
      name: 'publishedAt',
      title: 'Published At',
      type: 'datetime',
      initialValue: () => new Date().toISOString(),
    }),
    defineField({ name: 'readTime', title: 'Read Time (minutes)', type: 'number' }),
  ],
  preview: {
    select: { title: 'title', media: 'mainImage', publishedAt: 'publishedAt' },
    prepare: ({ title, media, publishedAt }) => ({
      title,
      media,
      subtitle: publishedAt ? new Date(publishedAt).toLocaleDateString() : 'Draft',
    }),
  },
})