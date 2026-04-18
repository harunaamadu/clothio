import { createClient } from 'next-sanity'
import imageUrlBuilder, { SanityImageSource } from '@sanity/image-url'

export const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!
export const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET!
export const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION ?? '2024-01-01'

// Read-only public client (used in Server Components & fetching)
export const sanityClient = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: process.env.NODE_ENV === 'production',
})

// Write / authenticated client (mutations, webhooks)
export const sanityWriteClient = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false,
  token: process.env.SANITY_API_TOKEN,
})

// Image URL builder
const builder = imageUrlBuilder(sanityClient)

export function urlForImage(source: SanityImageSource) {
  return builder.image(source)
}

export function getImageUrl(
  source: SanityImageSource,
  width = 800,
  height = 800
): string {
  return urlForImage(source)
    .width(width)
    .height(height)
    .fit('crop')
    .auto('format')
    .url()
}