import { Suspense } from "react";
import { BrandLogo } from "@/components/layout/brand-logo";
import { AccountIcon, AccountLink } from "@/components/layout/storefront/account-link";
import { CartLink } from "@/components/layout/storefront/cart-link";
import { SearchButton } from "@/components/layout/storefront/search-button";
import { MobileNav, StorefrontNav } from "@/components/layout/storefront/storefront-nav";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-[#e6dccb] bg-[#fbfaf7]/95 text-neutral-950 shadow-[0_1px_0_rgba(198,161,90,0.45)] backdrop-blur">
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between gap-2 px-3 sm:px-6 lg:grid lg:h-[76px] lg:grid-cols-[auto_1fr_auto] lg:gap-6 lg:px-10">
        <BrandLogo />
        <StorefrontNav />
        <div className="flex items-center gap-1 text-neutral-800 sm:gap-4">
          <MobileNav />
          <SearchButton />
          <Suspense fallback={<AccountIcon href="/login" label="Account" />}>
            <AccountLink />
          </Suspense>
          <CartLink />
        </div>
      </div>
    </header>
  );
}
