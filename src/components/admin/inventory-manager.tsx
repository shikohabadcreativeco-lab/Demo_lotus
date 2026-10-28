"use client";

import { useEffect, useState } from "react";
import { useAdminAlert } from "@/components/admin/admin-toast";
import { AdminEmpty, AdminPanel, AdminStat, adminField, adminPrimary, adminTh } from "@/components/admin/admin-ui";
import { formatPrice } from "@/lib/products";

type InventoryItem = {
  id: string;
  _id?: string;
  name: string;
  sku: string;
  category: string;
  price: number;
  stock: number;
  remaining?: number;
  threshold: number;
  status: "in_stock" | "low" | "out" | string;
};

export function InventoryManager() {
  const { notify } = useAdminAlert();
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [error, setError] = useState("");
  const [pending, setPending] = useState("");
  const [draft, setDraft] = useState({
    name: "",
    sku: "",
    category: "",
    price: "",
    stock: "",
    threshold: "5",
  });

  async function load() {
    const response = await fetch("/api/admin/inventory", { cache: "no-store" });
    const body = (await response.json()) as { success?: boolean; message?: string; items?: InventoryItem[]; data?: InventoryItem[] };
    if (!response.ok || !body.success) {
      setError(body.message || "Could not load inventory.");
      setItems([]);
      return;
    }
    setError("");
    setItems(body.items ?? body.data ?? []);
  }

  useEffect(() => {
    void load();
  }, []);

  const remaining = items.reduce((sum, item) => sum + item.stock, 0);
  const low = items.filter((item) => item.stock > 0 && item.stock <= item.threshold).length;
  const out = items.filter((item) => item.stock <= 0).length;

  async function createItem() {
    setPending("create");
    const response = await fetch("/api/admin/inventory", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: draft.name,
        sku: draft.sku,
        category: draft.category,
        price: Number(draft.price),
        stock: Number(draft.stock),
        threshold: Number(draft.threshold),
      }),
    });
    const body = (await response.json()) as { success?: boolean; message?: string };
    setPending("");
    if (!response.ok || !body.success) {
      notify({ title: "Item not added", detail: body.message, tone: "error" });
      return;
    }
    setDraft({ name: "", sku: "", category: "", price: "", stock: "", threshold: "5" });
    notify({ title: "Inventory item added", detail: "Remaining stock is saved." });
    await load();
  }

  async function adjust(id: string, adjustment: number) {
    setPending(id);
    const response = await fetch(`/api/admin/inventory/${id}/stock`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ adjustment }),
    });
    const body = (await response.json()) as { success?: boolean; message?: string; item?: InventoryItem };
    setPending("");
    if (!response.ok || !body.success || !body.item) {
      notify({ title: "Stock not updated", detail: body.message, tone: "error" });
      return;
    }
    setItems((current) => current.map((item) => (item.id === body.item?.id || item._id === body.item?._id ? body.item! : item)));
    notify({
      title: `${body.item.name} remaining: ${body.item.stock}`,
      detail: "Product stock and inventory are in sync.",
    });
  }

  return (
    <div className="space-y-5">
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <AdminStat featured label="Remaining" value={String(remaining)} hint="Pieces still on hand" />
        <AdminStat label="SKUs" value={String(items.length)} hint="Inventory rows" />
        <AdminStat label="Low stock" value={String(low)} hint="At or below threshold" />
        <AdminStat label="Out of stock" value={String(out)} hint="Nothing left" />
      </div>

      <form
        className="rounded-xl border border-[#ddd4c6] bg-[#fbf8f2] p-5"
        onSubmit={(event) => {
          event.preventDefault();
          void createItem();
        }}
      >
        <p className="text-[10px] font-medium tracking-[0.18em] text-[#c6a15a] uppercase">New item</p>
        <h2 className="mt-1 text-sm font-semibold">Add inventory</h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-3 xl:grid-cols-6">
          <label className="text-sm font-medium">
            Name
            <input className={adminField} required value={draft.name} onChange={(event) => setDraft({ ...draft, name: event.target.value })} />
          </label>
          <label className="text-sm font-medium">
            SKU
            <input className={adminField} required value={draft.sku} onChange={(event) => setDraft({ ...draft, sku: event.target.value })} />
          </label>
          <label className="text-sm font-medium">
            Category
            <input className={adminField} value={draft.category} onChange={(event) => setDraft({ ...draft, category: event.target.value })} />
          </label>
          <label className="text-sm font-medium">
            Price
            <input className={adminField} required inputMode="numeric" value={draft.price} onChange={(event) => setDraft({ ...draft, price: event.target.value })} />
          </label>
          <label className="text-sm font-medium">
            Remaining
            <input className={adminField} required inputMode="numeric" value={draft.stock} onChange={(event) => setDraft({ ...draft, stock: event.target.value })} />
          </label>
          <label className="text-sm font-medium">
            Threshold
            <input className={adminField} required inputMode="numeric" value={draft.threshold} onChange={(event) => setDraft({ ...draft, threshold: event.target.value })} />
          </label>
        </div>
        <button type="submit" disabled={pending === "create"} className={`${adminPrimary} mt-4`}>
          {pending === "create" ? "Saving..." : "Add item"}
        </button>
      </form>

      {error ? <p className="text-sm text-[#8a3030]">{error}</p> : null}

      <AdminPanel title="Stock sheet" detail="Remaining count is shared with the product catalog.">
        {items.length === 0 ? (
          <AdminEmpty>No inventory yet. Restart the API so catalog lamps are synced.</AdminEmpty>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[48rem] text-left text-sm">
              <thead className="border-b border-[#eee6d8]">
                <tr>
                  <th className={adminTh}>Item</th>
                  <th className={adminTh}>SKU</th>
                  <th className={adminTh}>Remaining</th>
                  <th className={adminTh}>Threshold</th>
                  <th className={adminTh}>Status</th>
                  <th className={adminTh}>Adjust</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#f0eadf]">
                {items.map((item) => {
                  const id = item.id || item._id || "";
                  const tone = item.stock <= 0 ? "out" : item.stock <= item.threshold ? "low" : "ok";
                  return (
                    <tr key={id} className="hover:bg-[#f3eee4]">
                      <td className="px-5 py-3">
                        <p className="font-medium">{item.name}</p>
                        <p className="mt-0.5 text-xs text-[#7a7164]">
                          {item.category || "Uncategorised"} · {formatPrice(item.price)}
                        </p>
                      </td>
                      <td className="px-5 py-3 font-mono text-xs">{item.sku}</td>
                      <td className="px-5 py-3 text-lg font-semibold">{item.stock}</td>
                      <td className="px-5 py-3 text-[#5c564c]">{item.threshold}</td>
                      <td className="px-5 py-3">
                        <span
                          className={`rounded px-2 py-0.5 text-[11px] font-medium ${
                            tone === "out"
                              ? "bg-[#f4e4e1] text-[#8a3030]"
                              : tone === "low"
                                ? "bg-[#f3ead7] text-[#7a5a20]"
                                : "bg-[#e7f3ee] text-[#1f5c45]"
                          }`}
                        >
                          {tone === "out" ? "Out of stock" : tone === "low" ? "Low stock" : "In stock"}
                        </span>
                      </td>
                      <td className="px-5 py-3">
                        <div className="flex gap-2">
                          <button
                            type="button"
                            disabled={pending === id}
                            onClick={() => void adjust(id, -1)}
                            className="grid size-8 place-items-center rounded-md border border-[#ddd4c6] text-sm hover:border-[#141a22]"
                          >
                            −
                          </button>
                          <button
                            type="button"
                            disabled={pending === id}
                            onClick={() => void adjust(id, 1)}
                            className="grid size-8 place-items-center rounded-md border border-[#ddd4c6] text-sm hover:border-[#141a22]"
                          >
                            +
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </AdminPanel>
    </div>
  );
}
