"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { CheckoutSteps } from "@/components/storefront/checkout/checkout-steps";
import { OrderSummary } from "@/components/storefront/checkout/order-summary";
import { useCart } from "@/components/storefront/cart/use-cart";
import { optionLabel, removeItem, setQuantity } from "@/lib/cart-store";
import { getCategory } from "@/lib/categories";
import { formatPrice } from "@/lib/products";

export function CartExperience({ signedIn }: { signedIn: boolean }) {
  const items = useCart();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setReady(true);
  }, []);

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
      <CheckoutSteps current={0} />
      <div className="mt-8 flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-[11px] font-semibold tracking-[0.28em] text-[#c6a15a]">YOUR BAG</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">Cart</h1>
        </div>
        <Link href="/shop" className="text-sm font-medium text-[#8a6a32] hover:text-[#6d5224]">
          Continue shopping
        </Link>
      </div>

      {!ready ? <div className="mt-10 min-h-80" /> : null}

      {ready && items.length === 0 ? (
        <div className="mt-10 rounded-3xl border border-[#e6dccb] bg-white px-6 py-16 text-center">
          <h2 className="text-2xl font-semibold tracking-tight">Your cart is empty</h2>
          <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-neutral-500">
            Add a lamp from the collection, then come back here to review it.
          </p>
          <Link
            href="/shop"
            className="mt-6 inline-flex h-11 items-center justify-center rounded-lg bg-[#c6a15a] px-5 text-sm font-medium text-white transition-colors hover:bg-[#b69048]"
          >
            Browse categories
          </Link>
        </div>
      ) : null}

      {ready && items.length > 0 ? (
        <div className="mt-8 grid items-start gap-8 lg:grid-cols-[minmax(0,1.4fr)_minmax(280px,0.8fr)]">
          <ul className="space-y-4">
            {items.map((item) => {
              const category = getCategory(item.categorySlug);
              return (
                <li
                  key={`${item.categorySlug}-${item.slug}-${item.watt || ""}-${item.lightColor || ""}`}
                  className="flex gap-4 rounded-3xl bg-white p-4 shadow-[0_12px_32px_rgba(40,32,20,0.05)] sm:p-5"
                >
                  <Link
                    href={`/shop/${item.categorySlug}/${item.slug}`}
                    aria-label={item.name}
                    className="relative size-24 shrink-0 overflow-hidden rounded-2xl bg-[#f6f3ee] sm:size-28"
                  >
                    <Image src={item.image} alt={item.alt} fill sizes="112px" className="object-cover" />
                  </Link>
                  <div className="flex min-w-0 flex-1 flex-col">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-[11px] font-semibold tracking-[0.18em] text-[#c6a15a]">
                          {category?.name ?? "Lotus Lights"}
                        </p>
                        <Link
                          href={`/shop/${item.categorySlug}/${item.slug}`}
                          className="mt-1 block text-lg font-semibold tracking-tight hover:text-[#8a6a32]"
                        >
                          {item.name}
                        </Link>
                      </div>
                      <p className="text-sm font-semibold text-neutral-950">
                        {formatPrice(item.price * item.quantity)}
                      </p>
                    </div>
                    <p className="mt-1 text-sm text-neutral-500">
                      {optionLabel(item) ? `${optionLabel(item)} · ` : ""}
                      {formatPrice(item.price)} each
                    </p>
                    <div className="mt-auto flex items-center justify-between gap-3 pt-4">
                      <div className="flex h-10 w-28 items-center justify-between rounded-lg border border-neutral-200 px-1">
                        <button
                          type="button"
                          aria-label={`Decrease quantity of ${item.name}`}
                          className="grid size-8 place-items-center rounded-md text-lg hover:bg-neutral-100"
                          onClick={() =>
                            setQuantity(item.slug, item.categorySlug, item.quantity - 1, item.watt || "", item.lightColor || "")
                          }
                        >
                          −
                        </button>
                        <span className="text-sm font-medium">{item.quantity}</span>
                        <button
                          type="button"
                          aria-label={`Increase quantity of ${item.name}`}
                          className="grid size-8 place-items-center rounded-md text-lg hover:bg-neutral-100"
                          onClick={() =>
                            setQuantity(item.slug, item.categorySlug, item.quantity + 1, item.watt || "", item.lightColor || "")
                          }
                        >
                          +
                        </button>
                      </div>
                      <button
                        type="button"
                        className="text-sm text-neutral-500 hover:text-neutral-900"
                        onClick={() => removeItem(item.slug, item.categorySlug, item.watt || "", item.lightColor || "")}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
          <OrderSummary
            items={items}
            action={
              <div>
                <Link
                  href={signedIn ? "/checkout" : "/login?next=/checkout"}
                  className="inline-flex h-12 w-full items-center justify-center rounded-lg bg-[#c6a15a] text-sm font-medium text-white transition-colors hover:bg-[#b69048]"
                >
                  {signedIn ? "Checkout" : "Sign in to checkout"}
                </Link>
                {signedIn ? null : (
                  <p className="mt-3 text-center text-xs leading-5 text-neutral-500">
                    You can browse and add lights without an account. Sign in to place the order.
                  </p>
                )}
              </div>
            }
          />
        </div>
      ) : null}
    </div>
  );
}
