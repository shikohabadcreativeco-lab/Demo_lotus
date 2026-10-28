"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useAdminAlert } from "@/components/admin/admin-toast";
import { AdminEmpty, AdminPanel, AdminStatus, adminTh } from "@/components/admin/admin-ui";
import { getCategory } from "@/lib/categories";
import { formatPrice } from "@/lib/products";
import type { StoreProduct } from "@/lib/store-api";

export function AdminProductTable({
  products,
  source,
}: {
  products: StoreProduct[];
  source: "api" | "local";
}) {
  return (
    <>
      {source === "local" ? (
        <p className="mb-4 rounded-xl border border-[#ead9b0] bg-[#f3ead7] px-4 py-3 text-sm text-[#7a5a20]">
          Catalog API is offline. Showing the built-in shop collection.
        </p>
      ) : null}
      <AdminPanel title="Catalog" detail={`${products.length} lamps`}>
        {products.length === 0 ? (
          <AdminEmpty>No products yet.</AdminEmpty>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[48rem] text-left text-sm">
              <thead className="border-b border-[#eee6d8]">
                <tr>
                  <th className={adminTh}>Product</th>
                  <th className={adminTh}>Category</th>
                  <th className={adminTh}>Price</th>
                  <th className={adminTh}>Stock</th>
                  <th className={adminTh}>Status</th>
                  <th className={adminTh} />
                </tr>
              </thead>
              <tbody className="divide-y divide-[#f0eadf]">
                {products.map((product) => (
                  <ProductRow
                    key={product.id ?? `${product.categorySlug}-${product.slug}`}
                    product={product}
                    editable={source === "api" && Boolean(product.id)}
                  />
                ))}
              </tbody>
            </table>
          </div>
        )}
      </AdminPanel>
    </>
  );
}

function ProductRow({
  product,
  editable,
}: {
  product: StoreProduct;
  editable: boolean;
}) {
  const router = useRouter();
  const { notify } = useAdminAlert();
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  const photo = product.images[0];
  const categoryName = product.categoryName || getCategory(product.categorySlug)?.name || product.categorySlug;

  async function deactivate() {
    if (!product.id) return;
    setPending(true);
    setError("");
    const response = await fetch(`/api/admin/products/${product.id}`, { method: "DELETE" });
    const result = (await response.json()) as { message?: string };
    setPending(false);
    if (!response.ok) {
      const message = result.message ?? "Could not deactivate this product.";
      setError(message);
      notify({ title: "Could not deactivate", detail: message, tone: "error" });
      return;
    }
    notify({
      title: `${product.name} is deactivated`,
      detail: "This lamp is now hidden from the storefront.",
    });
    router.refresh();
  }

  return (
    <tr className="hover:bg-[#f3eee4]">
      <td className="px-5 py-3">
        <span className="flex items-center gap-3">
          <span className="relative size-12 shrink-0 overflow-hidden rounded-md bg-[#eee6d8]">
            {photo ? <Image src={photo.src} alt="" fill sizes="48px" className="object-cover" /> : null}
          </span>
          <span>
            <span className="block font-medium">{product.name}</span>
            <span className="mt-0.5 block max-w-xs truncate text-xs text-[#7a7164]">{product.description}</span>
            {error ? <span className="mt-1 block text-xs text-[#8a3030]">{error}</span> : null}
          </span>
        </span>
      </td>
      <td className="px-5 py-3 text-[#5c564c]">{categoryName}</td>
      <td className="px-5 py-3 font-medium">
        {formatPrice(product.price)}
        {product.compareAt ? (
          <span className="mt-0.5 block text-xs text-[#9a9184] line-through">{formatPrice(product.compareAt)}</span>
        ) : null}
      </td>
      <td className="px-5 py-3 text-[#5c564c]">{typeof product.stock === "number" ? product.stock : "—"}</td>
      <td className="px-5 py-3">
        <AdminStatus value={product.isActive === false ? "hidden" : "active"} />
      </td>
      <td className="px-5 py-3 text-right">
        {editable ? (
          <span className="flex justify-end gap-3 text-xs font-medium tracking-wide uppercase">
            <Link href={`/admin/products/${product.id}`} className="text-[#1a6d78]">
              Edit
            </Link>
            <button
              type="button"
              onClick={() => void deactivate()}
              disabled={pending || product.isActive === false}
              className="text-[#7a7164] disabled:opacity-40"
            >
              Hide
            </button>
          </span>
        ) : null}
      </td>
    </tr>
  );
}
