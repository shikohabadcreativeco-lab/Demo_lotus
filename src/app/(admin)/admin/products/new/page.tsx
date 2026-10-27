import { Suspense } from "react";
import { AddProductForm } from "@/components/admin/add-product-form";
import { AdminPageHeader } from "@/components/admin/admin-shell";
import { listShopCategories } from "@/lib/catalog";

export default function NewProductPage() {
  return (
    <Suspense fallback={<div className="min-h-40" />}>
      <NewProductContent />
    </Suspense>
  );
}

async function NewProductContent() {
  const categories = await listShopCategories();

  return (
    <>
      <AdminPageHeader
        title="Add product"
        detail="Add up to 5 photos. The preview below matches the product page on the shop."
      />
      <AddProductForm
        categories={categories.map((category) => ({
          slug: category.slug,
          name: category.name,
        }))}
      />
    </>
  );
}
