clothio/
├── app/
│   ├── layout.tsx                        ← Root layout (fonts, providers, toaster)
│   ├── globals.css                       ← Tailwind v4 + CSS variables
│   ├── page.tsx                          ← Home page
│   ├── not-found.tsx
│   ├── (auth)/
│   │   ├── layout.tsx                    ← Auth layout (centered card)
│   │   ├── login/page.tsx
│   │   ├── register/page.tsx
│   │   └── forgot-password/page.tsx
│   ├── (shop)/
│   │   ├── layout.tsx                    ← Shop layout (header + footer)
│   │   ├── products/
│   │   │   ├── page.tsx                  ← Product listing with filters
│   │   │   └── [slug]/page.tsx           ← Product detail
│   │   ├── cart/page.tsx
│   │   ├── checkout/page.tsx
│   │   ├── wishlist/page.tsx
│   │   └── orders/
│   │       ├── page.tsx
│   │       └── [id]/page.tsx
│   ├── (dashboard)/
│   │   └── dashboard/
│   │       ├── page.tsx                  ← User dashboard
│   │       └── layout.tsx
│   └── api/
│       ├── auth/[...nextauth]/route.ts   ✅
│       ├── register/route.ts             ← POST: create user with bcrypt
│       ├── products/route.ts
│       ├── cart/route.ts
│       ├── orders/route.ts
│       └── webhook/stripe/route.ts       ← Stripe webhook handler
│
├── components/
│   ├── layout/
│   │   ├── Header.tsx                    ← Navbar: logo, search, nav, cart icon
│   │   ├── Footer.tsx
│   │   ├── MobileNav.tsx
│   │   └── Providers.tsx                 ← SessionProvider + ThemeProvider
│   ├── home/
│   │   ├── HeroCarousel.tsx              ← Embla carousel banners
│   │   ├── CategoryGrid.tsx
│   │   ├── FeaturedProducts.tsx
│   │   ├── NewArrivals.tsx
│   │   ├── BestSellers.tsx
│   │   ├── PromoBanner.tsx
│   │   └── NewsletterSection.tsx
│   ├── product/
│   │   ├── ProductCard.tsx               ← Card with wishlist, quick-add
│   │   ├── ProductGrid.tsx
│   │   ├── ProductFilters.tsx
│   │   ├── ProductImages.tsx             ← Image gallery with zoom
│   │   ├── ProductInfo.tsx               ← Price, variants, add to cart
│   │   ├── ProductReviews.tsx
│   │   └── SortSelect.tsx
│   ├── cart/
│   │   ├── CartSheet.tsx                 ← Slide-over cart drawer
│   │   ├── CartItem.tsx
│   │   └── CartSummary.tsx
│   ├── auth/
│   │   ├── LoginForm.tsx
│   │   ├── RegisterForm.tsx
│   │   └── OAuthButtons.tsx
│   └── shared/
│       ├── StarRating.tsx
│       ├── PriceDisplay.tsx
│       ├── SectionHeader.tsx
│       └── LoadingSpinner.tsx
│
├── lib/
│   ├── prisma/client.ts                  ✅
│   ├── sanity/
│   │   ├── client.ts                     ✅
│   │   └── queries.ts                    ✅
│   ├── auth/
│   │   └── helpers.ts                    ← getCurrentUser(), requireAuth()
│   └── utils/
│       ├── cn.ts                         ← clsx + tailwind-merge
│       ├── formatters.ts                 ← formatPrice, formatDate
│       └── stripe.ts                     ← Stripe client
│
├── store/
│   ├── cart.store.ts                     ← Zustand cart (persisted)
│   └── wishlist.store.ts                 ← Zustand wishlist
│
├── hooks/
│   ├── useCart.ts
│   ├── useWishlist.ts
│   └── useProducts.ts
│
├── schemas/
│   ├── auth.ts                           ✅
│   └── checkout.ts                       ✅
│
├── types/
│   └── index.ts                          ✅
│
├── sanity/
│   ├── sanity.config.ts                  ← Sanity Studio config
│   ├── schemas/
│   │   ├── index.ts                      ← Barrel export
│   │   ├── product.ts                    ✅
│   │   ├── productCategory.ts
│   │   ├── heroBanner.ts
│   │   └── blogPost.ts
│   └── lib/
│       └── image.ts
│
├── prisma/
│   └── schema.prisma                     ✅
│
├── public/
│   ├── images/
│   └── icons/
│
├── auth.ts                               ✅
├── middleware.ts                         ← Route protection
├── next.config.ts                        ✅
├── tsconfig.json                         ✅
├── package.json                          ✅
└── .env.example                          ✅