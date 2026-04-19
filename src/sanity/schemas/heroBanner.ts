import { defineType, defineField, defineArrayMember } from 'sanity'

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