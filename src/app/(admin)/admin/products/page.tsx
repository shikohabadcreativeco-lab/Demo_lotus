import Link from "next/link";
import { Suspense } from "react";
import { AdminProductTable } from "@/components/admin/admin-product-table";
import { AdminPageHeader } from "@/components/admin/admin-shell";
import { listAdminProducts } from "@/lib/catalog";

export default function AdminProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ added?: string }>;
}) {
  return (
    <Suspense fallback={<div className="min-h-40" />}>
      <ProductsContent searchParams={searchParams} />
    </Suspense>
  );
}

async function ProductsContent({
  searchParams,
}: {
  searchParams: Promise<{ added?: string }>;
}) {
  const [{ added }, catalog] = await Promise.all([searchParams, listAdminProducts()]);

  return (
    <>
      <AdminPageHeader
        title="Products"
        detail="Every lamp currently listed on the store."
        action={
          <Link
            href="/admin/products/new"
            className="inline-flex h-10 items-center rounded-lg bg-[#172033] px-4 text-sm font-semibold text-[#b7f3ea] hover:bg-[#24344a]"
          >
            Add product
          </Link>
        }
      />
      {added === "1" ? (
        <p className="mb-4 rounded-xl bg-[#e5f6f4] px-4 py-3 text-sm text-[#145860]" role="status">
          Product added. It is in this list and in its shop category.
        </p>
      ) : null}
      <AdminProductTable products={catalog.products} source={catalog.source} />
    </>
  );
}
