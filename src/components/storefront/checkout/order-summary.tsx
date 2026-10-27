import Image from "next/image";
import type { ReactNode } from "react";
import type { CartItem } from "@/lib/cart-store";
import { optionLabel, shippingOf, subtotalOf } from "@/lib/cart-store";
import { formatPrice } from "@/lib/products";

export function OrderSummary({
  items,
  discount = 0,
  discountLabel,
  coupon,
  action,
}: {
  items: CartItem[];
  discount?: number;
  discountLabel?: string;
  coupon?: ReactNode;
  action?: ReactNode;
}) {
  const subtotal = subtotalOf(items);
  const shipping = shippingOf(Math.max(0, subtotal - discount));
  const total = Math.max(0, subtotal - discount) + shipping;

  return (
    <aside className="h-fit rounded-3xl border border-[#efe6d6] bg-white p-5 shadow-[0_16px_40px_rgba(40,32,20,0.05)] sm:p-6 lg:sticky lg:top-24">
      <div className="flex items-baseline justify-between gap-3">
        <h2 className="text-lg font-semibold tracking-tight text-neutral-950">Order summary</h2>
        <p className="text-xs text-neutral-500">
          {items.length} {items.length === 1 ? "light" : "lights"}
        </p>
      </div>
      <ul className="mt-4 space-y-3">
        {items.map((item) => (
          <li key={`${item.categorySlug}-${item.slug}-${item.watt || ""}-${item.lightColor || ""}`} className="flex gap-3">
            <span className="relative size-14 shrink-0 overflow-hidden rounded-xl bg-[#f6f3ee]">
              <Image src={item.image} alt="" fill sizes="56px" className="object-cover" />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block truncate text-sm font-medium text-neutral-950">{item.name}</span>
              <span className="mt-0.5 block text-xs text-neutral-500">
                {optionLabel(item) ? `${optionLabel(item)} · ` : ""}Qty {item.quantity}
              </span>
            </span>
            <span className="text-sm font-medium text-neutral-950">{formatPrice(item.price * item.quantity)}</span>
          </li>
        ))}
      </ul>
      {coupon ? <div className="mt-4 border-t border-[#f0eadf] pt-4">{coupon}</div> : null}
      <dl className="mt-4 space-y-2 border-t border-[#f0eadf] pt-4 text-sm">
        <div className="flex justify-between text-neutral-500">
          <dt>Subtotal</dt>
          <dd>{formatPrice(subtotal)}</dd>
        </div>
        {discount > 0 ? (
          <div className="flex justify-between text-[#3f6808]">
            <dt>{discountLabel || "Discount"}</dt>
            <dd>−{formatPrice(discount)}</dd>
          </div>
        ) : null}
        <div className="flex justify-between text-neutral-500">
          <dt>Shipping</dt>
          <dd>{shipping === 0 ? "Free" : formatPrice(shipping)}</dd>
        </div>
        <div className="flex items-baseline justify-between pt-2 text-neutral-950">
          <dt className="text-base font-semibold">Total</dt>
          <dd className="text-xl font-semibold tracking-tight">{formatPrice(total)}</dd>
        </div>
      </dl>
      {action ? <div className="mt-5">{action}</div> : null}
      <ul className="mt-4 grid grid-cols-3 gap-2 text-center text-[11px] leading-4 text-neutral-500">
        <li className="rounded-xl bg-[#fbfaf7] px-2 py-2">Secure payment</li>
        <li className="rounded-xl bg-[#fbfaf7] px-2 py-2">Free over ₹500</li>
        <li className="rounded-xl bg-[#fbfaf7] px-2 py-2">3–7 day delivery</li>
      </ul>
    </aside>
  );
}
