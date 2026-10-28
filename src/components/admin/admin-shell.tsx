"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { AdminAlertProvider } from "@/components/admin/admin-toast";
import { BrandLogo } from "@/components/layout/brand-logo";

const groups = [
  {
    label: "Overview",
    links: [{ href: "/admin", label: "Dashboard", icon: "grid" }],
  },
  {
    label: "Catalog",
    links: [
      { href: "/admin/products", label: "Products", icon: "lamp" },
      { href: "/admin/categories", label: "Categories", icon: "grid" },
      { href: "/admin/inventory", label: "Inventory", icon: "box" },
    ],
  },
  {
    label: "Commerce",
    links: [
      { href: "/admin/orders", label: "Orders", icon: "bag" },
      { href: "/admin/customers", label: "Customers", icon: "user" },
      { href: "/admin/coupons", label: "Coupons", icon: "tag" },
    ],
  },
  {
    label: "Studio",
    links: [
      { href: "/admin/contacts", label: "Messages", icon: "mail" },
      { href: "/admin/settings", label: "Settings", icon: "gear" },
    ],
  },
] as const;

const titles: Record<string, string> = {
  "/admin": "Dashboard",
  "/admin/products": "Products",
  "/admin/products/new": "New product",
  "/admin/categories": "Categories",
  "/admin/inventory": "Inventory",
  "/admin/orders": "Orders",
  "/admin/customers": "Customers",
  "/admin/coupons": "Coupons",
  "/admin/contacts": "Messages",
  "/admin/settings": "Settings",
};

export function AdminShell({
  name,
  email,
  children,
}: {
  name: string;
  email: string;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [pending, setPending] = useState(false);
  const pageTitle =
    titles[pathname] ||
    (pathname.startsWith("/admin/products/") ? "Edit product" : "Admin");

  async function signOut() {
    setPending(true);
    try {
      await fetch("/api/admin/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: "{}",
      });
    } finally {
      window.location.assign("/login");
    }
  }

  return (
    <AdminAlertProvider>
      <div className="admin-app flex min-h-dvh w-full flex-1 flex-col bg-[#efeae0] text-[#141a22] lg:flex-row">
        <aside className="bg-[#10161f] text-white lg:flex lg:w-64 lg:shrink-0 lg:flex-col">
          <div className="flex items-center justify-between px-5 py-5 lg:border-b lg:border-white/8">
            <div>
              <BrandLogo tone="light" />
              <p className="mt-2 text-[10px] font-medium tracking-[0.22em] text-[#c6a15a] uppercase">
                Commerce
              </p>
            </div>
            <Link href="/" className="text-xs text-white/50 lg:hidden">
              Store
            </Link>
          </div>
          <nav className="flex gap-4 overflow-x-auto px-4 py-3 lg:flex-1 lg:flex-col lg:gap-6 lg:overflow-visible lg:px-3 lg:py-6">
            {groups.map((group) => (
              <div key={group.label} className="flex shrink-0 flex-col gap-1">
                <p className="hidden px-3 pb-1 text-[10px] font-medium tracking-[0.2em] text-white/35 uppercase lg:block">
                  {group.label}
                </p>
                {group.links.map((link) => {
                  const active =
                    link.href === "/admin" ? pathname === "/admin" : pathname.startsWith(link.href);
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      className={`flex h-10 w-full min-w-36 items-center gap-3 rounded-lg px-3 text-[13px] ${
                        active
                          ? "bg-[#1c2838] font-medium text-[#f3ead7] shadow-[inset_2px_0_0_#c6a15a]"
                          : "text-white/60 hover:bg-white/10 hover:text-white"
                      }`}
                    >
                      <NavIcon name={link.icon} />
                      {link.label}
                    </Link>
                  );
                })}
              </div>
            ))}
          </nav>
          <div className="hidden border-t border-white/8 px-4 py-4 lg:block">
            <p className="truncate text-sm font-medium">{name || "Lotus Admin"}</p>
            <p className="mt-0.5 truncate text-xs text-white/40">{email}</p>
            <Link href="/" className="mt-3 inline-block text-xs text-[#c6a15a] hover:text-[#e8d5a8]">
              Open storefront
            </Link>
          </div>
        </aside>

        <div className="flex min-w-0 flex-1 flex-col">
          <header className="flex h-14 items-center justify-between border-b border-[#ddd4c6] bg-[#f7f3eb] px-4 lg:px-8">
            <div className="min-w-0">
              <p className="text-[11px] text-[#7a7164]">
                Lotus Lights <span className="text-[#c6a15a]">/</span> {pageTitle}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <span className="hidden text-right text-xs text-[#7a7164] sm:block">
                <span className="block font-medium text-[#141a22]">{name || "Lotus Admin"}</span>
                <span>{email}</span>
              </span>
              <button
                type="button"
                onClick={signOut}
                disabled={pending}
                className="h-9 rounded-md border border-[#141a22] px-3 text-xs font-medium tracking-wide uppercase hover:bg-[#141a22] hover:text-[#f3ead7] disabled:opacity-60"
              >
                {pending ? "…" : "Sign out"}
              </button>
            </div>
          </header>
          <main className="flex-1 px-4 py-6 lg:px-8 lg:py-7">{children}</main>
        </div>
      </div>
    </AdminAlertProvider>
  );
}

export function AdminPageHeader({
  title,
  detail,
  action,
}: {
  title: string;
  detail: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
      <div>
        <h1 className="text-[1.65rem] font-semibold tracking-tight">{title}</h1>
        <p className="mt-1 text-sm text-[#6d6558]">{detail}</p>
      </div>
      {action}
    </div>
  );
}

function NavIcon({ name }: { name: string }) {
  return (
    <svg viewBox="0 0 16 16" aria-hidden="true" className="size-3.5 shrink-0 opacity-80">
      {name === "lamp" ? (
        <path d="M8 1.8 3.6 7.4h8.8L8 1.8Zm-3.2 7.2h6.4v1.4H4.8V9Zm1.4 2.6h3.6V14H6.2v-2.4Z" fill="currentColor" />
      ) : name === "box" ? (
        <path d="M2.2 4.4 8 1.8l5.8 2.6v7.2L8 14.2 2.2 11.6V4.4Zm5.8.4L4 6.4 8 8.2l4-1.8-3.8-1.6Z" fill="currentColor" />
      ) : name === "bag" ? (
        <path
          d="M5 5.2V4.4a3 3 0 0 1 6 0v.8h2.2v8.2H2.8V5.2H5Zm1.4-.8a1.6 1.6 0 1 1 3.2 0v.8H6.4V4.4Z"
          fill="currentColor"
        />
      ) : name === "user" ? (
        <path d="M8 8.2A2.6 2.6 0 1 1 8 3a2.6 2.6 0 0 1 0 5.2ZM3.2 13.4c.4-2.2 2.2-3.4 4.8-3.4s4.4 1.2 4.8 3.4H3.2Z" fill="currentColor" />
      ) : name === "tag" ? (
        <path d="M8.8 2.2h4.8v4.8L8 12.6 3.2 7.8 8.8 2.2Zm3 .8h-2.4L5.2 7.8 8 10.6l4-4V3Z" fill="currentColor" />
      ) : name === "mail" ? (
        <path d="M2 4.2h12v7.6H2V4.2Zm1.4 1.2 4.6 3 4.6-3H3.4Z" fill="currentColor" />
      ) : name === "gear" ? (
        <path d="M6.6 1.8h2.8l.4 1.6 1.6.7 1.5-1 2 2-1 1.5.7 1.6 1.6.4v2.8l-1.6.4-.7 1.6 1 1.5-2 2-1.5-1-1.6.7-.4 1.6H6.6l-.4-1.6-1.6-.7-1.5 1-2-2 1-1.5-.7-1.6L1.8 9.4V6.6l1.6-.4.7-1.6-1-1.5 2-2 1.5 1 1.6-.7.4-1.6ZM8 10.2A2.2 2.2 0 1 0 8 5.8a2.2 2.2 0 0 0 0 4.4Z" fill="currentColor" />
      ) : (
        <path d="M2.4 2.4h5v5h-5v-5Zm6.2 0h5v5h-5v-5ZM2.4 8.6h5v5h-5v-5Zm6.2 0h5v5h-5v-5Z" fill="currentColor" />
      )}
    </svg>
  );
}
