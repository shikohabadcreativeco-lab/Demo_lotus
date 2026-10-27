import { Suspense } from "react";
import { AdminPageHeader } from "@/components/admin/admin-shell";
import { inventoryRows } from "@/lib/admin-samples";
import { listProducts } from "@/lib/catalog";

export default function AdminInventoryPage() {
  return (
    <Suspense fallback={<div className="min-h-40" />}>
      <InventoryContent />
    </Suspense>
  );
}

async function InventoryContent() {
  const products = await listProducts();
  const rows = inventoryRows(products);
  const onHand = rows.reduce((sum, row) => sum + row.stock, 0);
  const remaining = rows.filter((row) => row.stock > 0);
  const low = rows.filter((row) => row.stock > 0 && row.stock <= 5).length;
  const outRows = rows.filter((row) => row.stock === 0);

  return (
    <>
      <AdminPageHeader
        title="Inventory"
        detail="Stock for the current catalog."
      />
      <div className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <Stat label="Total SKUs" value={String(rows.length)} hint="Every product" />
        <Stat label="Products remaining" value={String(remaining.length)} hint="Still in stock" />
        <Stat label="Pieces remaining" value={String(onHand)} hint="Units on hand" />
        <Stat label="Low stock" value={String(low)} hint="5 or fewer" />
        <Stat label="Out of stock" value={String(outRows.length)} hint="Nothing left to sell" />
      </div>
      <p className="mb-6 rounded-2xl border border-[#d5e2ea] bg-white px-5 py-4 text-sm text-[#172033]">
        {remaining.length} of {rows.length} products remain in stock. {outRows.length}{" "}
        {outRows.length === 1 ? "is" : "are"} out of stock
        {outRows.length > 0 ? `: ${outRows.map((row) => row.name).join(", ")}` : ""}. {onHand} pieces
        are still on hand.
      </p>
      <div className="overflow-x-auto rounded-2xl border border-[#d5e2ea] bg-white">
        <table className="w-full min-w-[40rem] text-left text-sm">
          <thead className="border-b border-neutral-100 text-neutral-500">
            <tr>
              <th className="px-5 py-3 font-medium">Product</th>
              <th className="px-5 py-3 font-medium">On hand</th>
              <th className="px-5 py-3 font-medium">Level</th>
              <th className="px-5 py-3 font-medium">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100">
            {rows.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-5 py-8 text-sm text-neutral-500">
                  No products yet.
                </td>
              </tr>
            ) : null}
            {rows.map((row) => {
              const tone = stockTone(row.stock);
              return (
                <tr key={row.id} className="hover:bg-[#f4f8fb]">
                  <td className="px-5 py-4">
                    <p className="font-medium text-[#172033]">{row.name}</p>
                    <p className="mt-0.5 text-xs text-neutral-500">{row.category}</p>
                  </td>
                  <td className="px-5 py-4 font-medium text-[#172033]">{row.stock}</td>
                  <td className="px-5 py-4">
                    <div className="h-2 w-36 overflow-hidden rounded-full bg-[#e6eef3]">
                      <div
                        className={`h-full rounded-full ${tone.bar}`}
                        style={{ width: `${Math.min(100, Math.round((row.stock / 40) * 100))}%` }}
                      />
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${tone.badge}`}>{tone.label}</span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </>
  );
}

function Stat({ label, value, hint }: { label: string; value: string; hint?: string }) {
  return (
    <div className="rounded-2xl border border-[#d5e2ea] bg-white p-5">
      <p className="text-sm text-neutral-500">{label}</p>
      <p className="mt-2 text-2xl font-semibold text-[#172033]">{value}</p>
      {hint ? <p className="mt-1 text-xs text-neutral-400">{hint}</p> : null}
    </div>
  );
}

function stockTone(stock: number) {
  if (stock === 0) {
    return { label: "Out of stock", badge: "bg-[#fdecec] text-[#8a3030]", bar: "bg-[#e7b4b4]" };
  }
  if (stock <= 5) {
    return { label: "Low stock", badge: "bg-[#fff4e8] text-[#9a4d12]", bar: "bg-[#e3b48a]" };
  }
  return { label: "In stock", badge: "bg-[#e5f6f4] text-[#145860]", bar: "bg-[#1a6d78]" };
}
