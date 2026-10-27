import type { Metadata } from "next";
import { ReviewsExperience } from "@/components/storefront/reviews/reviews-experience";

export const metadata: Metadata = {
  title: "Reviews | Lotus Lights",
  description:
    "Read customer stories about Lotus Lights and share how a lamp changed your room.",
};

export default function ReviewsPage() {
  return <ReviewsExperience />;
}
