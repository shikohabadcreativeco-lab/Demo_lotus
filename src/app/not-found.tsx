import Link from "next/link";
import { SiteFooter } from "@/components/layout/storefront/site-footer";
import { SiteHeader } from "@/components/layout/storefront/site-header";

export default function NotFound() {
  return (
    <div className="flex min-h-full flex-1 flex-col bg-[#f6f3ee] font-sans text-neutral-900">
      <SiteHeader />
      <main className="flex flex-1 items-center">
        <section className="mx-auto w-full max-w-xl px-6 py-20 text-center">
          <p className="text-[11px] font-semibold tracking-[0.28em] text-[#c6a15a]">404</p>
          <h1 className="mt-3 text-4xl font-semibold tracking-tight text-neutral-950">
            This page is not in the shop
          </h1>
          <p className="mt-3 text-sm leading-6 text-neutral-500">
            The link may be old, or the light may have moved. You can search the catalog or go back to the home page.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link
              href="/search"
              className="inline-flex h-11 items-center rounded-lg bg-[#c6a15a] px-5 text-sm font-medium text-white hover:bg-[#b69048]"
            >
              Search lights
            </Link>
            <Link
              href="/"
              className="inline-flex h-11 items-center rounded-lg border border-neutral-200 bg-white px-5 text-sm font-medium text-neutral-800 hover:border-[#c6a15a]"
            >
              Back home
            </Link>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
