"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { BrandLogo } from "@/components/layout/brand-logo";

const links = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/products", label: "Products" },
  { href: "/admin/categories", label: "Categories" },
  { href: "/admin/orders", label: "Orders" },
  { href: "/admin/customers", label: "Customers" },
  { href: "/admin/contacts", label: "Messages" },
  { href: "/admin/inventory", label: "Inventory" },
  { href: "/admin/coupons", label: "Coupons" },
  { href: "/admin/reviews", label: "Reviews" },
  { href: "/admin/settings", label: "Settings" },
] as const;

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
    <div className="flex min-h-dvh w-full flex-1 flex-col bg-[#e6eef3] font-sans text-neutral-950 lg:flex-row">
      <aside className="border-b border-white/10 bg-[#172033] text-white lg:flex lg:w-64 lg:shrink-0 lg:flex-col lg:border-r lg:border-b-0">
        <div className="flex items-center justify-between gap-3 px-4 py-3 lg:block lg:border-b lg:border-white/10 lg:px-5 lg:py-5">
          <div>
            <BrandLogo tone="light" />
            <p className="mt-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#8ee0d6]">
              Admin Panel
            </p>
          </div>
          <Link href="/" className="text-sm text-white/70 hover:text-white lg:hidden">
            View store
          </Link>
        </div>
        <nav className="flex gap-1 overflow-x-auto px-3 pb-3 lg:flex-1 lg:flex-col lg:overflow-visible lg:p-3">
          {links.map((link) => {
            const active =
              link.href === "/admin" ? pathname === "/admin" : pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`shrink-0 rounded-lg px-3 py-2 text-sm ${
                  active
                    ? "bg-white/10 font-semibold text-[#b7f3ea]"
                    : "text-white/70 hover:bg-white/10 hover:text-white"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>
        <div className="hidden border-t border-white/10 p-4 lg:block">
          <Link href="/" className="text-sm text-white/70 hover:text-white">
            View store
          </Link>
        </div>
      </aside>
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex items-center justify-between gap-3 border-b border-[#d5e2ea] bg-[#f4f8fb] px-4 py-3 lg:px-8 lg:py-4">
          <div className="min-w-0">
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#1a6d78]">
              Admin Panel
            </p>
            <p className="truncate text-sm font-medium text-[#172033]">{name || "Lotus Admin"}</p>
            <p className="truncate text-xs text-neutral-500">{email}</p>
          </div>
          <button
            type="button"
            onClick={signOut}
            disabled={pending}
            className="shrink-0 rounded-lg border border-[#172033] px-3 py-2 text-sm font-medium text-[#172033] hover:bg-[#172033] hover:text-[#b7f3ea]"
          >
            {pending ? "Signing out..." : "Sign out"}
          </button>
        </header>
        <main className="flex-1 px-4 py-6 lg:px-8 lg:py-8">{children}</main>
      </div>
    </div>
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
    <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
        <p className="mt-1 text-sm text-neutral-500">{detail}</p>
      </div>
      {action}
    </div>
  );
}
