// Re-export individual schemas defined in index.ts
// and assemble the schemaTypes array for sanity.config.ts
import { product, productCategory, heroBanner, blogPost } from './definitions'

export { product, productCategory, heroBanner, blogPost }
export const schemaTypes = [productCategory, product, heroBanner, blogPost]