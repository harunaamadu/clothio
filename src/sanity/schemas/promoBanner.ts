import { defineType, defineField } from 'sanity'

// ─── Promo Banner ─────────────────────────────────────────────────────────────
 
export const promoBanner = defineType({
  name: 'promoBanner',
  title: 'Promo Banner',
  type: 'document',
  fields: [
    defineField({
      name: 'label',
      title: 'Label',
      type: 'string',
      description: 'e.g. "Flash Sale", "Weekend Deal"',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'headline',
      title: 'Headline',
      type: 'string',
      description: 'Main bold title shown on the banner',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'subheadline',
      title: 'Subheadline',
      type: 'string',
      description: 'Supporting text under the headline',
    }),
    defineField({
      name: 'ctaText',
      title: 'CTA Button Text',
      type: 'string',
      initialValue: 'Shop Now',
    }),
    defineField({
      name: 'ctaLink',
      title: 'CTA Link',
      type: 'string',
      initialValue: '/products',
    }),
    defineField({
      name: 'image',
      title: 'Product / Promo Image',
      type: 'image',
      options: { hotspot: true },
      fields: [
        defineField({ name: 'alt', title: 'Alt Text', type: 'string' }),
      ],
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'accentColor',
      title: 'Accent Color',
      type: 'string',
      description: 'Hex color for the badge and CTA button, e.g. #e94560',
      initialValue: '#e94560',
    }),
    defineField({
      name: 'bgFrom',
      title: 'Background Gradient From',
      type: 'string',
      description: 'Start color of the section gradient, e.g. #1a1a2e',
      initialValue: '#1a1a2e',
    }),
    defineField({
      name: 'bgTo',
      title: 'Background Gradient To',
      type: 'string',
      description: 'End color of the section gradient, e.g. #2d2d4e',
      initialValue: '#2d2d4e',
    }),
    // ── Timer ────────────────────────────────────────────────────────────────
    defineField({
      name: 'timerEnabled',
      title: 'Enable Countdown Timer',
      type: 'boolean',
      description: 'Show a live countdown clock on this banner',
      initialValue: true,
    }),
    defineField({
      name: 'expiresAt',
      title: 'Offer Expires At',
      type: 'datetime',
      description: 'When the timer hits zero the banner switches to its expired state',
    }),
    defineField({
      name: 'expiredLabel',
      title: 'Expired Label',
      type: 'string',
      description: 'Text shown after the timer expires, e.g. "Offer Ended"',
      initialValue: 'Offer Ended',
    }),
    // ── Discount badge ────────────────────────────────────────────────────────
    defineField({
      name: 'discountBadge',
      title: 'Discount Badge',
      type: 'string',
      description: 'e.g. "UP TO 40% OFF" — shown in the accent-colored pill',
    }),
    defineField({
      name: 'isActive',
      title: 'Active',
      type: 'boolean',
      initialValue: true,
    }),
    defineField({
      name: 'order',
      title: 'Display Order',
      type: 'number',
      initialValue: 0,
    }),
  ],
  preview: {
    select: { title: 'headline', media: 'image', active: 'isActive' },
    prepare: ({ title, media, active }) => ({
      title,
      media,
      subtitle: active ? '✓ Active' : '✗ Inactive',
    }),
  },
})