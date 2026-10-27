import Link from "next/link";
import { Suspense } from "react";
import { BrandLogo } from "@/components/layout/brand-logo";
import { CartLink } from "@/components/layout/storefront/cart-link";
import { SearchButton } from "@/components/layout/storefront/search-button";
import { MobileNav, StorefrontNav } from "@/components/layout/storefront/storefront-nav";
import { currentAccount } from "@/lib/current-session";

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

async function AccountLink() {
  const account = await currentAccount();
  if (!account) return <AccountIcon href="/login" label="Account" />;
  return <AccountIcon href="/profile" label="Profile" />;
}

function AccountIcon({ href, label }: { href: string; label: string }) {
  return (
    <Link href={href} aria-label={label} className="grid size-10 place-items-center rounded-full transition-colors hover:bg-[#f6efe2] hover:text-neutral-950">
      <UserIcon />
    </Link>
  );
}

function UserIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="size-[22px]"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="8" r="3.25" />
      <path d="M5.5 19.25c1.2-2.7 3.5-4 6.5-4s5.3 1.3 6.5 4" />
    </svg>
  );
}
