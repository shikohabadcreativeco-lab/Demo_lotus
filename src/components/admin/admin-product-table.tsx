"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
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
        <p className="mb-4 rounded-xl bg-amber-50 px-4 py-3 text-sm text-amber-800">
          The catalog API is offline, so this list is the built-in shop collection.
        </p>
      ) : null}
      <div className="overflow-x-auto rounded-2xl border border-neutral-200 bg-white">
        <table className="w-full min-w-[44rem] text-left text-sm">
          <thead className="border-b border-neutral-100 text-neutral-500">
            <tr>
              <th className="px-5 py-3 font-medium">Product</th>
              <th className="px-5 py-3 font-medium">Category</th>
              <th className="px-5 py-3 font-medium">Price</th>
              <th className="px-5 py-3 font-medium">Stock</th>
              <th className="px-5 py-3 font-medium">Status</th>
              <th className="px-5 py-3 font-medium" />
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100">
            {products.map((product) => (
              <ProductRow key={product.id ?? `${product.categorySlug}-${product.slug}`} product={product} editable={source === "api" && Boolean(product.id)} />
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

function ProductRow({ product, editable }: { product: StoreProduct; editable: boolean }) {
  const router = useRouter();
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
      setError(result.message ?? "Could not deactivate this product.");
      return;
    }
    router.refresh();
  }

  return (
    <tr>
      <td className="px-5 py-3">
        <span className="flex items-center gap-3">
          <span className="relative size-12 shrink-0 overflow-hidden rounded-lg bg-neutral-100">
            {photo ? <Image src={photo.src} alt="" fill sizes="48px" className="object-cover" /> : null}
          </span>
          <span>
            <span className="block font-medium">{product.name}</span>
            <span className="mt-0.5 block max-w-xs truncate text-xs text-neutral-500">{product.description}</span>
            {error ? <span className="mt-1 block text-xs text-red-700">{error}</span> : null}
          </span>
        </span>
      </td>
      <td className="px-5 py-3 text-neutral-600">{categoryName}</td>
      <td className="px-5 py-3">
        {formatPrice(product.price)}
        {product.compareAt ? (
          <span className="mt-0.5 block text-xs text-neutral-400 line-through">{formatPrice(product.compareAt)}</span>
        ) : null}
      </td>
      <td className="px-5 py-3 text-neutral-600">{typeof product.stock === "number" ? product.stock : "—"}</td>
      <td className="px-5 py-3 text-neutral-600">{product.isActive === false ? "Hidden" : "Active"}</td>
      <td className="px-5 py-3 text-right">
        {editable ? (
          <span className="flex justify-end gap-3">
            <Link href={`/admin/products/${product.id}`} className="font-medium text-[#1a6d78]">
              Edit
            </Link>
            <button type="button" onClick={() => void deactivate()} disabled={pending || product.isActive === false} className="text-neutral-500 disabled:opacity-50">
              Deactivate
            </button>
          </span>
        ) : null}
      </td>
    </tr>
  );
}
