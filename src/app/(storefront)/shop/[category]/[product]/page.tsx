import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { ProductView } from "@/components/storefront/shop/product-view";
import { findProduct, findShopCategory, lookupProduct } from "@/lib/catalog";
import { products } from "@/lib/products";

type ProductPageProps = {
  params: Promise<{ category: string; product: string }>;
};

export function generateStaticParams() {
  // Cache Components requires at least one path before any lights are listed.
  if (products.length === 0) {
    return [{ category: "table-lamps", product: "_" }];
  }
  return products.map((product) => ({
    category: product.categorySlug,
    product: product.slug,
  }));
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { category: categorySlug, product: slug } = await params;
  const product = await lookupProduct(categorySlug, slug);
  if (!product) return { title: "Product | Lotus Lights" };
  return {
    title: `${product.name} | Lotus Lights`,
    description: product.description,
  };
}

export default function ProductPage({ params }: ProductPageProps) {
  return (
    <Suspense fallback={<div className="min-h-[50vh] bg-[#f6f3ee]" />}>
      <ProductContent params={params} />
    </Suspense>
  );
}

async function ProductContent({ params }: ProductPageProps) {
  const { category: categorySlug, product: slug } = await params;
  const category = await findShopCategory(categorySlug);
  const product = await findProduct(categorySlug, slug);
  if (!category || !product) notFound();
  return (
    <ProductView
      key={`${product.categorySlug}-${product.slug}`}
      product={product}
      category={category}
    />
  );
}
