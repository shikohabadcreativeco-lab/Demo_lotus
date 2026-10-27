"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { CheckoutSteps } from "@/components/storefront/checkout/checkout-steps";
import { formatPrice } from "@/lib/products";
import { optionLabel } from "@/lib/cart-store";
import { readOrder, type PlacedOrder } from "@/lib/order";

export function OrderConfirmation() {
  const [order, setOrder] = useState<PlacedOrder | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setOrder(readOrder());
    setReady(true);
  }, []);

  if (!ready) return <div className="mx-auto min-h-80 w-full max-w-3xl px-4 py-14" />;

  if (!order) {
    return (
      <div className="mx-auto w-full max-w-3xl px-4 py-16 text-center">
        <h1 className="text-3xl font-semibold tracking-tight">No order to show</h1>
        <p className="mt-3 text-sm leading-6 text-neutral-500">
          Place an order from your cart and the confirmation will appear here.
        </p>
        <Link
          href="/shop"
          className="mt-6 inline-flex h-11 items-center justify-center rounded-lg bg-[#c6a15a] px-5 text-sm font-medium text-white hover:bg-[#b69048]"
        >
          Browse categories
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-10 sm:px-6 lg:py-14">
      <CheckoutSteps current={2} />
      <div className="mt-8 rounded-3xl bg-white px-6 py-10 text-center shadow-[0_12px_32px_rgba(40,32,20,0.05)] sm:px-10">
        <span className="mx-auto grid size-14 place-items-center rounded-full bg-[#e7f4ea] text-[#2f7d4a]">
          <CheckIcon />
        </span>
        <p className="mt-5 text-[11px] font-semibold tracking-[0.28em] text-[#c6a15a]">ORDER PLACED</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight">Thank you</h1>
        <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-neutral-500">
          Order <span className="font-medium text-neutral-800">{order.number}</span> is confirmed.
          A note will go to {order.details.email}.
        </p>
      </div>

      <section className="mt-6 rounded-3xl bg-white p-6 sm:p-8">
        <h2 className="text-lg font-semibold">Lights in this order</h2>
        <ul className="mt-4 space-y-4">
          {order.items.map((item) => (
            <li key={`${item.categorySlug}-${item.slug}-${item.watt || ""}-${item.lightColor || ""}`} className="flex gap-3">
              <span className="relative size-16 shrink-0 overflow-hidden rounded-xl">
                <Image src={item.image} alt="" fill sizes="64px" className="object-cover" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-sm font-medium">{item.name}</span>
                <span className="mt-1 block text-xs text-neutral-500">
                  {optionLabel(item) ? `${optionLabel(item)} · ` : ""}Qty {item.quantity}
                </span>
              </span>
              <span className="text-sm font-medium">{formatPrice(item.price * item.quantity)}</span>
            </li>
          ))}
        </ul>
        <dl className="mt-5 space-y-2 border-t border-neutral-100 pt-4 text-sm">
          {order.discount ? (
            <div className="flex justify-between text-[#3f6808]">
              <dt>{order.coupon || "Discount"}</dt>
              <dd>−{formatPrice(order.discount)}</dd>
            </div>
          ) : null}
          <div className="flex justify-between text-neutral-500">
            <dt>Shipping</dt>
            <dd>{order.shipping === 0 ? "Free" : formatPrice(order.shipping)}</dd>
          </div>
          <div className="flex justify-between font-semibold text-neutral-950">
            <dt>Total</dt>
            <dd>{formatPrice(order.total)}</dd>
          </div>
        </dl>
      </section>

      <section className="mt-6 grid gap-6 sm:grid-cols-2">
        <div className="rounded-3xl bg-white p-6">
          <h2 className="text-lg font-semibold">Deliver to</h2>
          <p className="mt-3 text-sm leading-6 text-neutral-600">
            {order.details.fullName}
            <br />
            {order.details.address}
            <br />
            {order.details.city}, {order.details.state} {order.details.pin}
            <br />
            {order.details.phone}
          </p>
        </div>
        <div className="rounded-3xl bg-white p-6">
          <h2 className="text-lg font-semibold">Payment</h2>
          <p className="mt-3 text-sm leading-6 text-neutral-600">{order.details.payment}</p>
          <p className="mt-2 text-sm leading-6 text-neutral-500">
            {order.details.payment === "Cash on delivery"
              ? "Pay when the order arrives."
              : "Payment is noted with this order."}
          </p>
        </div>
      </section>

      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <Link
          href="/shop"
          className="inline-flex h-12 flex-1 items-center justify-center rounded-lg bg-[#c6a15a] text-sm font-medium text-white hover:bg-[#b69048]"
        >
          Continue shopping
        </Link>
        <Link
          href="/"
          className="inline-flex h-12 flex-1 items-center justify-center rounded-lg border border-neutral-200 bg-white text-sm font-medium text-neutral-800 hover:bg-neutral-50"
        >
          Back to home
        </Link>
      </div>
    </div>
  );
}

function CheckIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-7" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      <path d="m6.5 12.5 3.2 3.2 7.8-8" />
    </svg>
  );
}
