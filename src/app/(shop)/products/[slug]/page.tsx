import { auth } from "@/auth";
import { getProductBySlug, getRelatedProducts } from "@/lib/sanity/queries";
import { getProductReviewsAction } from "@/server/actions/review.actions";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import prisma from "@/lib/prisma/client";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { ProductImages } from "@/components/product/ProductImages";
import { ProductInfo } from "@/components/product/ProductInfo";
import { ProductReviews } from "@/components/product/ProductReview";
import { ProductGrid } from "@/components/product/ProductGrid";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return { title: "Product not found" };
  return {
    title: product.name,
    description: product.description?.slice(0, 155),
    openGraph: {
      title: product.name,
      description: product.description?.slice(0, 155),
      type: "website",
    },
  };
}

export default async function ProductDetailPage({ params }: PageProps) {
  const { slug } = await params;
  if (!slug) notFound();

  const [product, session] = await Promise.all([
    getProductBySlug(slug),
    auth(),
  ]);

  if (!product) notFound();

  const [reviewsResult, related] = await Promise.all([
    getProductReviewsAction(product._id),
    getRelatedProducts(product._id, product.category?._id ?? "", 4),
  ]);

  let userReviewId: string | null = null;

  if (session?.user?.id) {
    const myReview = await prisma.review.findUnique({
      where: {
        userId_productId: {
          userId: session.user.id,
          productId: product._id,
        },
      },
      select: { id: true },
    });
    userReviewId = myReview?.id ?? null;
  }

  const { reviews, averageRating, total } = reviewsResult.success
    ? reviewsResult.data
    : { reviews: [], averageRating: 0, total: 0 };

  return (
    <main className="w-full min-h-screen">
      <div className="layout py-8 space-y-12">
        {/* Breadcrumb */}
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href="/">Home</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>

            <BreadcrumbSeparator />

            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                {product.category?.slug?.current ? (
                  <Link
                    href={`/products?category=${product.category.slug.current}`}
                  >
                    {product.category.name}
                  </Link>
                ) : (
                  <Link href="/products">Products</Link>
                )}
              </BreadcrumbLink>
            </BreadcrumbItem>

            <BreadcrumbSeparator />

            <BreadcrumbItem>
              <BreadcrumbPage className="truncate max-w-45">
                {product.name}
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        {/* Product */}
        <section className="grid md:grid-cols-2 gap-10 lg:gap-16 items-start">
          <ProductImages
            images={product.images ?? []}
            productName={product.name}
          />
          <div className="lg:sticky lg:top-24">
            <ProductInfo
              key={product._id}
              product={product}
              reviewCount={total}
              averageRating={averageRating}
            />
          </div>
        </section>

        {/* Reviews */}
        <ProductReviews
          productId={product._id}
          reviews={reviews}
          averageRating={averageRating}
          total={total}
          userReviewId={userReviewId}
        />

        {/* Related */}
        {related.length > 0 && (
          <section className="space-y-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-primary mb-1">
                You may also like
              </p>
              <h2 className="text-2xl font-bold text-[#1a1a2e]">
                Related Products
              </h2>
            </div>
            <ProductGrid products={related} columns={4} />
          </section>
        )}
      </div>
    </main>
  );
}
