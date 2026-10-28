import Link from "next/link";
import { Suspense } from "react";
import { AdminProductTable } from "@/components/admin/admin-product-table";
import { AdminPageHeader } from "@/components/admin/admin-shell";
import { AdminStat, adminPrimary } from "@/components/admin/admin-ui";
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
  const products = catalog.products;
  const skus = products.length;
  const stock = products.reduce((sum, product) => sum + (typeof product.stock === "number" ? product.stock : 0), 0);
  const active = products.filter((product) => product.isActive !== false).length;
  const out = products.filter((product) => (product.stock ?? 0) === 0).length;

  return (
    <>
      <AdminPageHeader
        title="Products"
        detail="Lamps listed on the store. Hide a piece without deleting it."
        action={
          <Link href="/admin/products/new" className={adminPrimary}>
            Add product
          </Link>
        }
      />
      <div className="mb-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <AdminStat label="Products" value={String(products.length)} hint={`${active} live on the shop`} />
        <AdminStat label="SKUs" value={String(skus)} hint="Every listed lamp" />
        <AdminStat label="Total stock" value={String(stock)} hint="Pieces on hand" />
        <AdminStat label="Out of stock" value={String(out)} hint="Nothing left to sell" />
      </div>
      {added === "1" ? (
        <p className="mb-4 rounded-xl border border-[#cfe3d8] bg-[#e7f3ee] px-4 py-3 text-sm text-[#1f5c45]" role="status">
          Product added. It is in this list and in its shop category.
        </p>
      ) : null}
      <AdminProductTable products={products} source={catalog.source} />
    </>
  );
}
