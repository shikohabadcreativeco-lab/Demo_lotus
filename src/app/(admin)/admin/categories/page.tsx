import { Suspense } from "react";
import { CategoryManager } from "@/components/admin/category-manager";
import { AdminPageHeader } from "@/components/admin/admin-shell";
import { listAdminCategories } from "@/lib/catalog";

export default function AdminCategoriesPage() {
  return (
    <Suspense fallback={<div className="min-h-40" />}>
      <CategoriesContent />
    </Suspense>
  );
}

async function CategoriesContent() {
  const { categories, source } = await listAdminCategories();

  return (
    <>
      <AdminPageHeader
        title="Categories"
        detail="Collections shown in the shop. Create, update, or deactivate them here."
      />
      <CategoryManager categories={categories} source={source} />
    </>
  );
}
