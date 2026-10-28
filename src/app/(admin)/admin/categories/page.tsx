import { Suspense } from "react";
import { CategoryManager } from "@/components/admin/category-manager";
import { AdminPageHeader } from "@/components/admin/admin-shell";
import { AdminStat } from "@/components/admin/admin-ui";
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
  const active = categories.filter((category) => category.isActive !== false).length;
  const hidden = categories.length - active;

  return (
    <>
      <AdminPageHeader
        title="Categories"
        detail="Shop collections. Add a photo, then save or hide a group."
      />
      <div className="mb-5 grid gap-3 sm:grid-cols-3">
        <AdminStat label="Categories" value={String(categories.length)} hint="All collections" />
        <AdminStat label="Active" value={String(active)} hint="Shown in the shop" />
        <AdminStat label="Hidden" value={String(hidden)} hint="Deactivated" />
      </div>
      <CategoryManager categories={categories} source={source} />
    </>
  );
}
