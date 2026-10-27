"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { storefrontNav } from "@/constants/navigation";

export function StorefrontNav() {
  const pathname = usePathname();

  return (
    <nav aria-label="Main" className="hidden justify-self-center lg:block">
      <ul className="flex items-center gap-8">
        {storefrontNav.map((item) => (
          <NavItem key={item.href} href={item.href} label={item.label} pathname={pathname} />
        ))}
      </ul>
    </nav>
  );
}

export function MobileNav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <div className="lg:hidden">
      <button
        type="button"
        aria-expanded={open}
        aria-controls="mobile-nav"
        aria-label={open ? "Close menu" : "Open menu"}
        onClick={() => setOpen((value) => !value)}
        className="grid size-10 place-items-center rounded-full hover:bg-neutral-100"
      >
        {open ? <CloseIcon /> : <MenuIcon />}
      </button>
      {open ? (
        <nav
          id="mobile-nav"
          aria-label="Main"
          className="absolute inset-x-0 top-full border-b border-[#e6dccb] bg-[#fbfaf7] shadow-[0_18px_40px_rgba(28,25,23,0.08)]"
        >
          <ul className="flex flex-col gap-1 p-3">
            {storefrontNav.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  aria-current={isActive(item.href, pathname) ? "page" : undefined}
                  className={`block rounded-xl border-l-2 px-4 py-3.5 text-base ${
                    isActive(item.href, pathname)
                      ? "border-[#c6a15a] bg-[#f6efe2] font-medium text-[#1c1917]"
                      : "border-transparent text-neutral-600"
                  }`}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      ) : null}
    </div>
  );
}

function NavItem({
  href,
  label,
  pathname,
}: {
  href: string;
  label: string;
  pathname: string;
}) {
  const active = isActive(href, pathname);
  return (
    <li>
      <Link
        href={href}
        aria-current={active ? "page" : undefined}
        className={`border-b-2 pb-1 text-[15px] font-medium transition-colors ${
          active ? "border-[#c6a15a] text-neutral-950" : "border-transparent text-neutral-500 hover:text-neutral-950"
        }`}
      >
        {label}
      </Link>
    </li>
  );
}

function isActive(href: string, pathname: string) {
  return href === "/" ? pathname === "/" : pathname.startsWith(href);
}

function MenuIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-6" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden="true">
      <path d="M4 7h16M4 12h16M4 17h16" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden="true">
      <path d="M6 6l12 12M18 6 6 18" />
    </svg>
  );
}
