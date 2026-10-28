import { Suspense } from "react";
import { CategorySection } from "@/components/storefront/home/category-section";
import { CtaSection } from "@/components/storefront/home/cta-section";
import { HeroSection } from "@/components/storefront/home/hero-section";
import { PromoSection } from "@/components/storefront/home/promo-section";
import { ReviewsSection } from "@/components/storefront/home/reviews-section";
import { WhyChooseSection } from "@/components/storefront/home/why-choose-section";

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <CategorySection />
      <PromoSection />
      <WhyChooseSection />
      <Suspense fallback={<div className="min-h-64" />}>
        <ReviewsSection />
      </Suspense>
      <CtaSection />
    </>
  );
}
