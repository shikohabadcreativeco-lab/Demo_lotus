import Link from "next/link";
import { Suspense } from "react";
import { AdminPageHeader } from "@/components/admin/admin-shell";
import { CopyValue } from "@/components/admin/copy-value";
import { currentAccount } from "@/lib/current-session";

const store = {
  name: "Lotus Lights",
  studio: "Firozabad, India",
  email: "support@lotuslights.in",
  phone: "+91 98765 43210",
  phoneHref: "tel:+919876543210",
};

const policies = [
  {
    title: "Shipping",
    value: "3–7 business days",
    detail: "Orders leave the Firozabad studio and deliver across India.",
    href: "/shipping-policy",
  },
  {
    title: "Returns",
    value: "7 days",
    detail: "Unused lamps can be returned within 7 days of delivery.",
    href: "/returns",
  },
  {
    title: "Warranty",
    value: "1 year",
    detail: "Manufacturing defects are covered for one year.",
    href: "/terms",
  },
] as const;

const shortcuts = [
  { href: "/admin/products", label: "Products", detail: "Edit the lights on the store" },
  { href: "/admin/categories", label: "Categories", detail: "Shop collections" },
  { href: "/admin/coupons", label: "Coupons", detail: "Codes used at checkout" },
  { href: "/contact", label: "Contact page", detail: "What shoppers see for support" },
] as const;

export default function AdminSettingsPage() {
  return (
    <Suspense fallback={<div className="min-h-40" />}>
      <SettingsDetails />
    </Suspense>
  );
}

async function SettingsDetails() {
  const account = await currentAccount();
  const name = account?.fullName || "Lotus Admin";
  const email = account?.email || "admin@lotuslights.com";
  const phone = account?.phone || "Not added";

  return (
    <>
      <AdminPageHeader
        title="Settings"
        detail="The store profile published on Lotus Lights, and the account signed in to this panel."
      />

      <div className="grid items-start gap-6 xl:grid-cols-[20rem_minmax(0,1fr)]">
        <section className="rounded-xl border border-[#ddd4c6] bg-[#fbf8f2] p-6">
          <div className="flex items-center gap-4">
            <span className="grid size-14 shrink-0 place-items-center rounded-2xl bg-[#e5f6f4] text-lg font-semibold text-[#145860]">
              {initials(name)}
            </span>
            <div className="min-w-0">
              <p className="truncate text-lg font-semibold tracking-tight">{name}</p>
              <p className="truncate text-sm text-neutral-500">{email}</p>
            </div>
          </div>
          <p className="mt-5 inline-flex rounded-full bg-[#e5f6f4] px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-[#145860]">
            Admin
          </p>
          <dl className="mt-6 space-y-4 border-t border-neutral-100 pt-5 text-sm">
            <AccountRow label="Phone" value={phone} />
            <AccountRow label="Store" value={store.name} />
          </dl>
          <Link
            href="/"
            className="mt-6 inline-flex text-sm font-medium text-[#1a6d78] hover:text-[#172033]"
          >
            View the storefront
          </Link>
        </section>

        <div className="grid gap-6">
          <section className="rounded-xl border border-[#ddd4c6] bg-[#fbf8f2]">
            <header className="border-b border-neutral-100 px-5 py-4 sm:px-6">
              <h2 className="text-sm font-semibold">Store profile</h2>
              <p className="mt-1 text-sm text-neutral-500">
                Shown to shoppers in the footer and on the contact page.
              </p>
            </header>
            <dl className="grid sm:grid-cols-2">
              <CopyValue label="Store name" value={store.name} />
              <CopyValue label="Studio" value={store.studio} />
              <CopyValue label="Support email" value={store.email} href={`mailto:${store.email}`} />
              <CopyValue label="Support phone" value={store.phone} href={store.phoneHref} />
            </dl>
          </section>

          <section>
            <h2 className="text-sm font-semibold">Customer policies</h2>
            <p className="mt-1 text-sm text-neutral-500">The terms already published on the site.</p>
            <div className="mt-4 grid gap-4 md:grid-cols-3">
              {policies.map((policy) => (
                <Link
                  key={policy.title}
                  href={policy.href}
                  className="rounded-xl border border-[#ddd4c6] bg-[#fbf8f2] p-5 transition-colors hover:border-[#c6a15a]"
                >
                  <p className="text-sm text-neutral-500">{policy.title}</p>
                  <p className="mt-2 text-2xl font-semibold tracking-tight">{policy.value}</p>
                  <p className="mt-2 text-sm leading-6 text-neutral-500">{policy.detail}</p>
                </Link>
              ))}
            </div>
          </section>

          <section className="rounded-xl border border-[#ddd4c6] bg-[#fbf8f2]">
            <header className="border-b border-neutral-100 px-5 py-4 sm:px-6">
              <h2 className="text-sm font-semibold">Manage the store</h2>
            </header>
            <ul className="divide-y divide-neutral-100">
              {shortcuts.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="flex items-center justify-between gap-4 px-5 py-4 text-sm transition-colors hover:bg-neutral-50 sm:px-6"
                  >
                    <span>
                      <span className="block font-medium">{item.label}</span>
                      <span className="mt-1 block text-neutral-500">{item.detail}</span>
                    </span>
                    <span aria-hidden="true" className="text-neutral-400">
                      →
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        </div>
      </div>
    </>
  );
}

function AccountRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between gap-4">
      <dt className="text-neutral-500">{label}</dt>
      <dd className="text-right font-medium">{value}</dd>
    </div>
  );
}

function initials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  const letters = parts.slice(0, 2).map((part) => part[0]?.toUpperCase() ?? "");
  return letters.join("") || "LL";
}
