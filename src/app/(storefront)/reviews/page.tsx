import type { Metadata } from "next";
import { Suspense } from "react";
import { ReviewsExperience } from "@/components/storefront/reviews/reviews-experience";
import { listProducts } from "@/lib/catalog";
import { fetchPublicReviews } from "@/lib/reviews-api";

export const metadata: Metadata = {
  title: "Reviews | Lotus Lights",
  description:
    "Read customer stories about Lotus Lights and share how a lamp changed your space.",
};

export default function ReviewsPage() {
  return (
    <Suspense fallback={<div className="min-h-[50vh]" />}>
      <ReviewsFromApi />
    </Suspense>
  );
}

async function ReviewsFromApi() {
  const [{ reviews }, products] = await Promise.all([fetchPublicReviews(), listProducts()]);
  return (
    <ReviewsExperience
      initialReviews={reviews}
      products={products.map((product) => ({
        id: product.id || product.slug,
        name: product.name,
        category: product.categoryName || product.categorySlug.replaceAll("-", " "),
      }))}
    />
  );
}
