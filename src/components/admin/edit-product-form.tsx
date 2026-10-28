"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useAdminAlert } from "@/components/admin/admin-toast";
import { adminField, adminFieldArea, adminGhost, adminPrimary } from "@/components/admin/admin-ui";
import type { StoreProduct } from "@/lib/store-api";

const fieldClass = adminField;

export function EditProductForm({
  product,
  categories,
}: {
  product: StoreProduct;
  categories: Array<{ id?: string; slug: string; name: string }>;
}) {
  const router = useRouter();
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);
  const [name, setName] = useState(product.name);
  const [description, setDescription] = useState(product.description);
  const [brand, setBrand] = useState(product.brand ?? "Lotus Light");
  const [price, setPrice] = useState(String(product.price));
  const [compareAt, setCompareAt] = useState(product.compareAt ? String(product.compareAt) : "");
  const [stock, setStock] = useState(String(product.stock ?? 0));
  const [category, setCategory] = useState(product.categorySlug);
  const [active, setActive] = useState(product.isActive !== false);
  const { notify } = useAdminAlert();

  async function save() {
    if (!product.id) return;
    setPending(true);
    setError("");
    const response = await fetch(`/api/admin/products/${product.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name,
        description,
        brand,
        price: Number(price),
        compareAt: compareAt ? Number(compareAt) : null,
        stock: Number(stock),
        category,
        isActive: active,
      }),
    });
    const result = (await response.json()) as { message?: string };
    setPending(false);
    if (!response.ok) {
      const message = result.message ?? "Could not update this product.";
      setError(message);
      notify({ title: "Product not saved", detail: message, tone: "error" });
      return;
    }
    notify({
      title: active ? `${name} is saved` : `${name} is deactivated`,
      detail: active ? "The catalog is updated." : "This lamp is now hidden from the storefront.",
    });
    window.setTimeout(() => {
      router.push("/admin/products");
      router.refresh();
    }, 700);
  }

  return (
    <form
      className="max-w-3xl rounded-xl border border-[#ddd4c6] bg-[#fbf8f2] p-6"
      onSubmit={(event) => {
        event.preventDefault();
        void save();
      }}
    >
      {error ? (
        <p className="mb-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700" role="alert">
          {error}
        </p>
      ) : null}
      <div className="grid gap-5 sm:grid-cols-2">
        <label className="block text-sm font-medium sm:col-span-2">
          Product name
          <input className={fieldClass} required minLength={2} value={name} onChange={(event) => setName(event.target.value)} />
        </label>
        <label className="block text-sm font-medium">
          Category
          <select className={fieldClass} required value={category} onChange={(event) => setCategory(event.target.value)}>
            {categories.map((item) => (
              <option key={item.slug} value={item.slug}>
                {item.name}
              </option>
            ))}
          </select>
        </label>
        <label className="block text-sm font-medium">
          Brand
          <input className={fieldClass} value={brand} onChange={(event) => setBrand(event.target.value)} />
        </label>
        <label className="block text-sm font-medium">
          Selling price (INR)
          <input className={fieldClass} required inputMode="numeric" value={price} onChange={(event) => setPrice(event.target.value)} />
        </label>
        <label className="block text-sm font-medium">
          Compare-at price
          <input className={fieldClass} inputMode="numeric" value={compareAt} onChange={(event) => setCompareAt(event.target.value)} placeholder="Optional" />
        </label>
        <label className="block text-sm font-medium">
          Stock
          <input className={fieldClass} required inputMode="numeric" value={stock} onChange={(event) => setStock(event.target.value)} />
        </label>
        <label className="block text-sm font-medium sm:col-span-2">
          Description
          <textarea className={adminFieldArea} required minLength={8} value={description} onChange={(event) => setDescription(event.target.value)} />
        </label>
        <label className="flex items-center gap-2 text-sm font-medium">
          <input type="checkbox" checked={active} onChange={(event) => setActive(event.target.checked)} />
          Active on the shop
        </label>
      </div>
      <div className="mt-6 flex gap-3">
        <button type="submit" disabled={pending} className={adminPrimary}>
          {pending ? "Saving..." : "Save product"}
        </button>
        <Link href="/admin/products" className={adminGhost}>
          Cancel
        </Link>
      </div>
    </form>
  );
}
