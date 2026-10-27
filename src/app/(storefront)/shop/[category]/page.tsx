import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { CategoryDetail } from "@/components/storefront/shop/category-detail";
import { findShopCategory, listProductsByCategory, listShopCategories } from "@/lib/catalog";
import { productCategories } from "@/lib/categories";

type CategoryPageProps = {
  params: Promise<{ category: string }>;
};

export function generateStaticParams() {
  return productCategories.map((category) => ({ category: category.slug }));
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { category: slug } = await params;
  const category = await findShopCategory(slug);
  if (!category) return { title: "Category | Lotus Lights" };
  return {
    title: `${category.name} | Lotus Lights`,
    description: category.summary,
  };
}

export default function CategoryPage({ params }: CategoryPageProps) {
  return (
    <Suspense fallback={<div className="min-h-[50vh] bg-[#f6f3ee]" />}>
      <CategoryCatalog params={params} />
    </Suspense>
  );
}

async function CategoryCatalog({ params }: CategoryPageProps) {
  const { category: slug } = await params;
  const category = await findShopCategory(slug);
  if (!category) notFound();
  const [products, categories] = await Promise.all([
    listProductsByCategory(category.slug),
    listShopCategories(),
  ]);
  const others = categories.filter((item) => item.slug !== category.slug);
  return <CategoryDetail category={category} products={products} others={others} />;
}
