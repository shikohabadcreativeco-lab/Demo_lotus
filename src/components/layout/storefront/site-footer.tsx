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
      { href: "/contact", label: "FAQs" },
      { href: "/contact", label: "Shipping Policy" },
      { href: "/contact", label: "Terms & Conditions" },
    ],
  },
];

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-neutral-200 bg-white text-neutral-700">
      <div className="mx-auto grid w-full max-w-7xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-[1.4fr_1fr_1fr_1.3fr] lg:px-8">
        <BrandLogo />
        {columns.map((column) => (
          <nav key={column.title} aria-label={column.title}>
            <p className="text-sm font-semibold text-neutral-950">{column.title}</p>
            <ul className="mt-4 space-y-2 text-sm text-neutral-500">
              {column.links.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="hover:text-neutral-900">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        ))}
        <div>
          <p className="text-sm font-semibold text-neutral-950">Contact</p>
          <ul className="mt-4 space-y-2 text-sm text-neutral-500">
            <li>
              <a href="tel:+919876543210">+91 98765 43210</a>
            </li>
            <li>
              <a href="mailto:support@lotuslights.in">support@lotuslights.in</a>
            </li>
            <li>Bengaluru, India</li>
          </ul>
          <div className="mt-5 flex gap-3 text-neutral-700">
            <a href="mailto:support@lotuslights.in" aria-label="Email" className="hover:text-neutral-950">
              <MailIcon />
            </a>
            <Link href="/reviews" aria-label="Reviews" className="hover:text-neutral-950">
              <PlayIcon />
            </Link>
            <Link href="/shop" aria-label="Shop" className="hover:text-neutral-950">
              <BagIcon />
            </Link>
          </div>
        </div>
      </div>
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-3 border-t border-neutral-200 px-4 py-5 text-xs text-neutral-500 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
        <p>© 2026 Lotus Lights. All rights reserved.</p>
        <p className="flex gap-3">
          <Link href="/contact" className="hover:text-neutral-900">
            Privacy Policy
          </Link>
          <span aria-hidden="true">|</span>
          <Link href="/contact" className="hover:text-neutral-900">
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
