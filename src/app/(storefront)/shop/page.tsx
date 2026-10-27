import type { Metadata } from "next";
import { Suspense } from "react";
import { CategoryIndex } from "@/components/storefront/shop/category-index";
import { listShopCategories } from "@/lib/catalog";

export const metadata: Metadata = {
  title: "Product categories | Lotus Lights",
  description:
    "Browse Lotus Lights by category: table lamps, floor lamps, pendants, wall lights, desk lamps, and ceiling lights.",
};

export default function ShopPage() {
  return (
    <Suspense fallback={<div className="min-h-[50vh] bg-[#f6f3ee]" />}>
      <ShopCatalog />
    </Suspense>
  );
}

async function ShopCatalog() {
  const categories = await listShopCategories();
  return <CategoryIndex categories={categories} />;
}
