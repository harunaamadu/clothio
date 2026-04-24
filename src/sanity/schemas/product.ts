import { defineType, defineField, defineArrayMember } from "sanity";

// ─── Product ──────────────────────────────────────────────────────────────────

export const product = defineType({
  name: "product",
  title: "Product",
  type: "document",
  fields: [
    defineField({
      name: "name",
      title: "Product Name",
      type: "string",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "name", maxLength: 96 },
      validation: (r) => r.required(),
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "array",
      of: [defineArrayMember({ type: "block" })],
    }),
    defineField({
      name: "price",
      title: "Price (USD)",
      type: "number",
      validation: (r) => r.required().min(0),
    }),
    defineField({
      name: "compareAtPrice",
      title: "Compare At Price",
      description: "Original price before discount",
      type: "number",
    }),
    defineField({
      name: "images",
      title: "Images",
      type: "array",
      of: [
        defineArrayMember({
          type: "image",
          options: { hotspot: true },
          fields: [
            defineField({ name: "alt", title: "Alt Text", type: "string" }),
          ],
        }),
      ],
      validation: (r) => r.min(1).error("At least one image is required"),
    }),
    defineField({
      name: "category",
      title: "Category",
      type: "reference",
      to: [{ type: "productCategory" }],
      validation: (r) => r.required(),
    }),
    defineField({
      name: "tags",
      title: "Tags",
      type: "array",
      of: [defineArrayMember({ type: "string" })],
      options: { layout: "tags" },
    }),
    defineField({
      name: "variants",
      title: "Variants",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          name: "variant",
          title: "Variant",
          fields: [
            defineField({ name: "color", title: "Color Name", type: "string" }),
            defineField({
              name: "colorHex",
              title: "Color Hex",
              type: "string",
              description: "e.g. #FF5733",
            }),
            defineField({ name: "size", title: "Size", type: "string" }),
            defineField({
              name: "stock",
              title: "Stock",
              type: "number",
              initialValue: 10,
            }),
            defineField({
              name: "price",
              title: "Override Price",
              type: "number",
              description: "Leave blank to use product price",
            }),
            defineField({ name: "sku", title: "SKU", type: "string" }),
          ],
          preview: {
            select: { color: "color", size: "size", stock: "stock" },
            prepare: ({ color, size, stock }) => ({
              title: [color, size].filter(Boolean).join(" / ") || "Variant",
              subtitle: `Stock: ${stock ?? 0}`,
            }),
          },
        }),
      ],
    }),
    defineField({
      name: "isFeatured",
      title: "Featured Product",
      type: "boolean",
      initialValue: false,
    }),
    defineField({
      name: "isNewArrival",
      title: "New Arrival",
      type: "boolean",
      initialValue: false,
    }),
    defineField({
      name: "isBestSeller",
      title: "Best Seller",
      type: "boolean",
      initialValue: false,
    }),
    defineField({
      name: "stock",
      title: "Default Stock",
      type: "number",
      initialValue: 100,
      description: "Used when no variants are defined",
    }),
    defineField({ name: "brand", title: "Brand", type: "string" }),
    defineField({ name: "material", title: "Material", type: "string" }),
    defineField({
      name: "careInstructions",
      title: "Care Instructions",
      type: "text",
      rows: 2,
    }),

    defineField({
      name: "rating",
      title: "Average Rating",
      type: "number",
      readOnly: true,
    }),
    defineField({
      name: "reviewCount",
      title: "Review Count",
      type: "number",
      readOnly: true,
    }),
  ],
  preview: {
    select: { title: "name", media: "images.0", price: "price" },
    prepare: ({ title, media, price }) => ({
      title,
      media,
      subtitle: price ? `$${price}` : "No price set",
    }),
  },
  orderings: [
    {
      title: "Newest",
      name: "createdAtDesc",
      by: [{ field: "_createdAt", direction: "desc" }],
    },
    {
      title: "Price ↑",
      name: "priceAsc",
      by: [{ field: "price", direction: "asc" }],
    },
    {
      title: "Price ↓",
      name: "priceDesc",
      by: [{ field: "price", direction: "desc" }],
    },
    {
      title: "Name A–Z",
      name: "nameAsc",
      by: [{ field: "name", direction: "asc" }],
    },
  ],
});
