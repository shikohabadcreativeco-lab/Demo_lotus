import Link from "next/link";
import { BrandLogo } from "@/components/layout/brand-logo";
import { storefrontNav } from "@/constants/navigation";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-neutral-100 bg-white/95 text-neutral-950 backdrop-blur">
      <div className="mx-auto grid h-[76px] w-full max-w-7xl grid-cols-[auto_1fr_auto] items-center gap-6 px-6 sm:px-10">
        <BrandLogo />
        <nav aria-label="Main" className="justify-self-center">
          <ul className="flex items-center gap-4 sm:gap-8">
            {storefrontNav.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="text-sm font-medium text-neutral-500 transition-colors hover:text-neutral-950 sm:text-[15px]"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div className="flex items-center gap-4 text-neutral-800 sm:gap-5">
          <button
            type="button"
            aria-label="Search"
            className="transition-colors hover:text-neutral-950"
          >
            <SearchIcon />
          </button>
          <Link
            href="/login"
            aria-label="Account"
            className="transition-colors hover:text-neutral-950"
          >
            <UserIcon />
          </Link>
          <Link
            href="/cart"
            aria-label="Cart, 1 item"
            className="relative transition-colors hover:text-neutral-950"
          >
            <CartIcon />
            <span className="absolute -top-0.5 -right-1 size-2 rounded-full bg-red-500" />
          </Link>
        </div>
      </div>
    </header>
  );
}

function SearchIcon() {
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
      <circle cx="11" cy="11" r="6.5" />
      <path d="M16 16.5 20 20.5" />
    </svg>
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

function CartIcon() {
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
      <path d="M6.2 7.5h11.6l-1 12.2H7.2L6.2 7.5Z" />
      <path d="M9 7.5V6.4a3 3 0 0 1 6 0v1.1" />
    </svg>
  );
}
