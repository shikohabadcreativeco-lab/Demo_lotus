import { apiUrl } from "@/lib/admin-backend";

export type StoreReview = {
  _id: string;
  productId: string;
  productName: string;
  user: { _id: string; fullName: string; email: string };
  rating: number;
  title: string;
  body: string;
  status: "pending" | "approved" | "rejected";
  adminNote: string;
  city?: string;
  room?: string;
  createdAt: string;
  updatedAt: string;
};

export function isPublishedReview(review: StoreReview) {
  return review.status !== "rejected";
}

export async function fetchPublicReviews(product?: string) {
  const params = new URLSearchParams({ limit: "50" });
  if (product) params.set("product", product);
  try {
    const response = await fetch(`${apiUrl}/api/reviews?${params}`, {
      headers: { Accept: "application/json" },
      cache: "no-store",
    });
    const payload = (await response.json()) as { reviews?: StoreReview[]; total?: number };
    const reviews = (payload.reviews ?? []).filter(isPublishedReview);
    return {
      reviews,
      total: payload.total ?? reviews.length,
    };
  } catch {
    return { reviews: [] as StoreReview[], total: 0 };
  }
}
