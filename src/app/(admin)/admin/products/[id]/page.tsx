import { notFound } from "next/navigation";
import { Suspense } from "react";
import { AdminPageHeader } from "@/components/admin/admin-shell";
import { EditProductForm } from "@/components/admin/edit-product-form";
import { listShopCategories } from "@/lib/catalog";
import { fetchProduct } from "@/lib/store-api";

export default function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  return (
    <Suspense fallback={<div className="min-h-40" />}>
      <EditContent params={params} />
    </Suspense>
  );
}

async function EditContent({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [product, categories] = await Promise.all([fetchProduct(id), listShopCategories()]);
  if (!product?.id) notFound();

  return (
    <>
      <AdminPageHeader title="Edit product" detail="Update the price, stock, brand, or visibility." />
      <EditProductForm
        product={product}
        categories={categories.map((category) => ({
          id: category.id,
          slug: category.slug,
          name: category.name,
        }))}
      />
    </>
  );
}
