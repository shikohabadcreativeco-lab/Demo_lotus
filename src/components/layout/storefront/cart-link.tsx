"use client";

import Link from "next/link";
import { useCart } from "@/components/storefront/cart/use-cart";
import { countOf } from "@/lib/cart-store";

export function CartLink() {
  const items = useCart();
  const count = countOf(items);
  const label = count === 0 ? "Cart" : `Cart, ${count} ${count === 1 ? "item" : "items"}`;

  return (
    <Link href="/cart" aria-label={label} className="relative grid size-10 place-items-center rounded-full transition-colors hover:bg-[#f6efe2] hover:text-neutral-950">
      <CartIcon />
      {count > 0 ? (
        <span className="absolute -top-1.5 -right-2 grid h-4 min-w-4 place-items-center rounded-full bg-neutral-950 px-1 text-[10px] font-semibold text-white">
          {count > 9 ? "9+" : count}
        </span>
      ) : null}
    </Link>
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
