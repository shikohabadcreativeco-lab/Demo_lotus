import Link from "next/link";
import { BrandLogo } from "@/components/layout/brand-logo";

const columns = [
  {
    title: "Quick Links",
    links: [
      { href: "/", label: "Home" },
      { href: "/shop", label: "Product" },
      { href: "/about", label: "About Us" },
    ],
  },
  {
    title: "Support",
    links: [
      { href: "/faqs", label: "FAQs" },
      { href: "/shipping-policy", label: "Shipping Policy" },
      { href: "/returns", label: "Returns" },
      { href: "/terms", label: "Terms & Conditions" },
    ],
  },
];

export function SiteFooter() {
  return (
    <footer className="mt-auto bg-[#1c1917] text-[#e7e0d4]">
      <div className="mx-auto grid w-full max-w-7xl gap-10 px-4 py-12 sm:px-6 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1.3fr] lg:px-8">
        <div className="sm:col-span-2 lg:col-span-1">
          <BrandLogo tone="light" />
          <p className="mt-4 max-w-xs text-sm leading-6 text-white/60">
            Warm lights for homes, offices, showrooms, and stores. Made in Firozabad.
          </p>
        </div>
        {columns.map((column) => (
          <nav key={column.title} aria-label={column.title}>
            <p className="text-[11px] font-semibold tracking-[0.22em] text-[#c6a15a] uppercase">{column.title}</p>
            <ul className="mt-4 space-y-2.5 text-sm text-white/70">
              {column.links.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="hover:text-white">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        ))}
        <div>
          <p className="text-[11px] font-semibold tracking-[0.22em] text-[#c6a15a] uppercase">Contact</p>
          <ul className="mt-4 space-y-2.5 text-sm text-white/70">
            <li>
              <a href="tel:+919876543210" className="hover:text-white">+91 98765 43210</a>
            </li>
            <li>
              <a href="mailto:support@lotuslights.in" className="break-all hover:text-white">support@lotuslights.in</a>
            </li>
            <li>Firozabad, India</li>
          </ul>
          <div className="mt-5 flex gap-3 text-[#e6c48a]">
            <a href="mailto:support@lotuslights.in" aria-label="Email" className="hover:text-white">
              <MailIcon />
            </a>
            <Link href="/reviews" aria-label="Reviews" className="hover:text-white">
              <PlayIcon />
            </Link>
            <Link href="/shop" aria-label="Shop" className="hover:text-white">
              <BagIcon />
            </Link>
          </div>
        </div>
      </div>
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-3 border-t border-white/10 px-4 py-5 text-xs text-white/50 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between sm:px-6 lg:px-8">
        <p>© 2026 Lotus Lights. All rights reserved.</p>
        <p>
          Developed by{" "}
          <a
            href="https://www.instagram.com/skb_creative/"
            target="_blank"
            rel="noreferrer"
            className="font-medium text-[#e6c48a] hover:text-white"
          >
            Shikohabad Creative Co.
          </a>
        </p>
        <p className="flex gap-3">
          <Link href="/privacy" className="hover:text-white">
            Privacy Policy
          </Link>
          <span aria-hidden="true">|</span>
          <Link href="/terms" className="hover:text-white">
            Terms & Conditions
          </Link>
        </p>
      </div>
    </footer>
  );
}

function MailIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
      <rect x="4" y="6" width="16" height="12" rx="1.5" />
      <path d="m5 7 7 6 7-6" />
    </svg>
  );
}

function PlayIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
      <circle cx="12" cy="12" r="8" />
      <path d="m10.5 9.5 5 2.5-5 2.5v-5Z" fill="currentColor" stroke="none" />
    </svg>
  );
}

function BagIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
      <path d="M7 8h10l-.8 10H7.8L7 8Z" />
      <path d="M9.5 8V6.8a2.5 2.5 0 0 1 5 0V8" />
    </svg>
  );
}
