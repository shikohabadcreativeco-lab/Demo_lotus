import Link from "next/link";
import { Suspense } from "react";
import { AdminPageHeader } from "@/components/admin/admin-shell";
import { listAccounts } from "@/lib/accounts";
import { listProducts, listShopCategories } from "@/lib/catalog";
import { listAllOrders } from "@/lib/customer-records";

export default function AdminHomePage() {
  return (
    <Suspense fallback={<div className="min-h-40" />}>
      <DashboardContent />
    </Suspense>
  );
}

async function DashboardContent() {
  const [products, categories, orders, accounts] = await Promise.all([
    listProducts(),
    listShopCategories(),
    listAllOrders(),
    listAccounts(),
  ]);
  const cards = [
    { href: "/admin/products", label: "Products", value: products.length, detail: "Listed on the store" },
    { href: "/admin/categories", label: "Categories", value: categories.length, detail: "Shop collections" },
    { href: "/admin/orders", label: "Orders", value: orders.length, detail: "Placed by signed-in customers" },
    { href: "/admin/customers", label: "Customers", value: accounts.length, detail: "Accounts on the store" },
    { href: "/admin/contacts", label: "Messages", value: "Inbox", detail: "Contact form notes" },
    { href: "/admin/reviews", label: "Reviews", value: 0, detail: "Customer reviews" },
  ];

  return (
    <>
      <AdminPageHeader
        title="Dashboard"
        detail="A snapshot of the Lotus Lights store."
      />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {cards.map((card) => (
          <Link
            key={card.href}
            href={card.href}
            className="rounded-2xl border border-neutral-200 bg-white p-5 transition-colors hover:border-[#8fd4cc]"
          >
            <p className="text-sm text-neutral-500">{card.label}</p>
            <p className={`mt-2 font-semibold tracking-tight ${typeof card.value === "number" ? "text-3xl" : "text-2xl"}`}>
              {card.value}
            </p>
            <p className="mt-2 text-sm text-neutral-500">{card.detail}</p>
          </Link>
        ))}
      </div>
      <section className="mt-8 rounded-2xl border border-neutral-200 bg-white">
        <div className="flex items-center justify-between border-b border-neutral-100 px-5 py-4">
          <h2 className="text-sm font-semibold">Latest products</h2>
          <Link href="/admin/products/new" className="text-sm font-medium text-[#1a6d78]">
            Add product
          </Link>
        </div>
        <ul className="divide-y divide-neutral-100">
          {products.slice(-5).reverse().map((product) => (
            <li key={`${product.categorySlug}-${product.slug}`} className="flex items-center justify-between px-5 py-3 text-sm">
              <span>{product.name}</span>
              <span className="text-neutral-500">{product.categorySlug.replaceAll("-", " ")}</span>
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}
