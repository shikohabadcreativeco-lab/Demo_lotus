import Link from "next/link";
import { BrandLogo } from "@/components/layout/brand-logo";
import { LoginForm } from "@/components/auth/login-form";

const duties = [
  { title: "Products", detail: "Add lights, prices, and stock." },
  { title: "Orders", detail: "See what customers have placed." },
  { title: "Store", detail: "Review accounts, coupons, and settings." },
];

export function AdminLoginScreen({ nextPath }: { nextPath: string }) {
  return (
    <div className="grid min-h-dvh w-full flex-1 bg-[#e6eef3] font-sans text-neutral-950 lg:grid-cols-2">
      <aside className="relative flex flex-col bg-[#172033] px-6 py-6 text-white sm:px-10 sm:py-8 lg:px-14 lg:py-10">
        <BrandLogo tone="light" />
        <div className="flex flex-1 flex-col justify-center py-10">
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#8ee0d6]">
            Admin Panel
          </p>
          <h2 className="mt-3 max-w-md text-4xl font-semibold tracking-tight sm:text-5xl">
            Manage Lotus Lights.
          </h2>
          <p className="mt-4 max-w-sm text-sm leading-6 text-white/70">
            This page is only for staff. Shoppers sign in from the store.
          </p>
          <ul className="mt-8 max-w-md divide-y divide-white/10 border-y border-white/10">
            {duties.map((item, index) => (
              <li key={item.title} className="flex items-start gap-4 py-4">
                <span className="mt-0.5 text-xs font-semibold tracking-[0.16em] text-[#8ee0d6]">
                  0{index + 1}
                </span>
                <span>
                  <span className="block text-sm font-semibold text-white">{item.title}</span>
                  <span className="mt-1 block text-sm text-white/65">{item.detail}</span>
                </span>
              </li>
            ))}
          </ul>
        </div>
      </aside>

      <section className="flex flex-col px-5 py-6 sm:px-10 lg:px-14 lg:pt-10">
        <div className="flex items-center justify-between gap-4 lg:h-12">
          <p className="inline-flex items-center gap-2.5 rounded-full bg-[#172033] py-2 pl-3 pr-4 text-lg font-semibold tracking-tight text-white shadow-[0_10px_28px_rgba(23,32,51,0.16)] lg:text-xl">
            <span className="size-2 shrink-0 rounded-full bg-[#8ee0d6]" aria-hidden="true" />
            Admin Panel
          </p>
          <Link
            href="/"
            className="shrink-0 text-sm font-medium text-[#1a6d78] transition-colors hover:text-[#172033]"
          >
            View store
          </Link>
        </div>
        <div className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center py-10">
          <div className="rounded-2xl border border-[#d5e2ea] bg-white p-6 shadow-[0_18px_50px_rgba(23,32,51,0.08)] sm:p-8">
            <LoginForm nextPath={nextPath} />
          </div>
        </div>
      </section>
    </div>
  );
}
