"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";
import { useCart } from "@/components/storefront/cart/use-cart";
import { CheckoutSteps } from "@/components/storefront/checkout/checkout-steps";
import { OrderSummary } from "@/components/storefront/checkout/order-summary";
import { clearCart, shippingOf, subtotalOf } from "@/lib/cart-store";
import { quoteCoupon, storeCoupons } from "@/lib/coupons";
import { createOrderNumber, saveOrder, type PaymentMethod } from "@/lib/order";
import { formatPrice } from "@/lib/products";

const states = [
  "Karnataka",
  "Maharashtra",
  "Delhi",
  "Tamil Nadu",
  "Telangana",
  "Kerala",
  "Gujarat",
  "Rajasthan",
  "Uttar Pradesh",
  "West Bengal",
  "Punjab",
  "Haryana",
  "Goa",
  "Andhra Pradesh",
  "Madhya Pradesh",
  "Other",
];

const payments: { id: PaymentMethod; detail: string }[] = [
  { id: "UPI", detail: "Any UPI app" },
  { id: "Card", detail: "Debit or credit" },
  { id: "Cash on delivery", detail: "Pay on arrival" },
];

const labelClass = "block text-xs font-medium tracking-wide text-neutral-500 uppercase";
const fieldClass =
  "mt-1.5 h-11 w-full rounded-xl border border-[#e6dccb] bg-[#fbfaf7] px-3.5 text-sm text-neutral-950 outline-none transition-colors placeholder:text-neutral-400 focus:border-[#c6a15a] focus:bg-white";

export type CheckoutContact = {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  pin: string;
  label: string;
};

export function CheckoutExperience({ contact }: { contact: CheckoutContact }) {
  const items = useCart();
  const router = useRouter();
  const [ready, setReady] = useState(false);
  const [error, setError] = useState("");
  const [couponError, setCouponError] = useState("");
  const [payment, setPayment] = useState<PaymentMethod>("Cash on delivery");
  const [upiId, setUpiId] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvv, setCardCvv] = useState("");
  const [coupon, setCoupon] = useState("");
  const [appliedCode, setAppliedCode] = useState("");

  useEffect(() => {
    setReady(true);
  }, []);

  const subtotalNow = subtotalOf(items);
  const liveQuote = appliedCode ? quoteCoupon(appliedCode, subtotalNow) : null;
  const liveDiscount = liveQuote?.ok ? liveQuote.amount : 0;
  const totalNow = Math.max(0, subtotalNow - liveDiscount) + shippingOf(Math.max(0, subtotalNow - liveDiscount));

  async function placeOrder(formData: FormData) {
    if (items.length === 0) {
      setError("Your cart is empty.");
      return;
    }
    const fullName = String(formData.get("fullName") ?? "").trim();
    const email = String(formData.get("email") ?? "").trim();
    const phone = String(formData.get("phone") ?? "").replace(/[^\d]/g, "");
    const address = String(formData.get("address") ?? "").trim();
    const city = String(formData.get("city") ?? "").trim();
    const state = String(formData.get("state") ?? "").trim();
    const pin = String(formData.get("pin") ?? "").trim();

    if (fullName.length < 2) return setError("Enter the name for this order.");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return setError("Enter a valid email address.");
    if (phone.length < 10) return setError("Enter a 10-digit phone number.");
    if (address.length < 5) return setError("Enter the delivery address.");
    if (city.length < 2) return setError("Enter the city.");
    if (!/^\d{6}$/.test(pin)) return setError("Enter a 6-digit PIN code.");
    if (payment === "UPI" && !/^[\w.-]+@[\w.-]+$/.test(upiId.trim())) {
      return setError("Enter a UPI ID such as name@bank.");
    }
    if (payment === "Card") {
      const digits = cardNumber.replace(/\D/g, "");
      if (digits.length < 12 || digits.length > 19) return setError("Enter the card number.");
      if (!/^\d{2}\/\d{2}$/.test(cardExpiry.trim())) return setError("Enter the expiry as MM/YY.");
      if (!/^\d{3,4}$/.test(cardCvv.trim())) return setError("Enter the card security code.");
    }

    const subtotal = subtotalOf(items);
    const quote = appliedCode ? quoteCoupon(appliedCode, subtotal) : null;
    if (quote && !quote.ok) return setError(quote.message);
    const discount = quote?.ok ? quote.amount : 0;
    const shipping = shippingOf(Math.max(0, subtotal - discount));
    const order = {
      number: createOrderNumber(),
      items,
      subtotal,
      shipping,
      discount,
      coupon: quote?.ok ? quote.code : undefined,
      total: Math.max(0, subtotal - discount) + shipping,
      details: {
        fullName,
        email,
        phone,
        address,
        city,
        state,
        pin,
        payment,
      },
    };
    saveOrder(order);
    try {
      await fetch("/api/account/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          number: order.number,
          items: order.items,
          subtotal: order.subtotal,
          shipping: order.shipping,
          total: order.total,
          payment: order.details.payment,
          address: {
            fullName,
            phone,
            line: address,
            city,
            state,
            pin,
          },
        }),
      });
    } catch {
      // The confirmation still shows from this browser if the account list cannot be reached.
    }
    clearCart();
    router.push("/checkout/confirmation");
  }

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
      <CheckoutSteps current={1} />
      <div className="mt-8 flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-[11px] font-semibold tracking-[0.28em] text-[#c6a15a]">DELIVERY</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-neutral-950 sm:text-4xl">Checkout</h1>
        </div>
        <Link href="/cart" className="text-sm font-medium text-[#8a6a32] hover:text-[#6d5224]">
          Back to cart
        </Link>
      </div>

      {!ready ? <div className="mt-10 min-h-80" /> : null}

      {ready && items.length === 0 ? (
        <div className="mt-10 rounded-3xl border border-[#e6dccb] bg-white px-6 py-16 text-center">
          <h2 className="text-2xl font-semibold tracking-tight">Nothing to check out</h2>
          <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-neutral-500">
            Add a light to your cart before entering a delivery address.
          </p>
          <Link
            href="/shop"
            className="mt-6 inline-flex h-11 items-center justify-center rounded-lg bg-[#c6a15a] px-5 text-sm font-medium text-white hover:bg-[#b69048]"
          >
            Browse categories
          </Link>
        </div>
      ) : null}

      {ready && items.length > 0 ? (
        <form
          className="mt-8 grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_22rem]"
          onSubmit={(event) => {
            event.preventDefault();
            placeOrder(new FormData(event.currentTarget));
          }}
        >
          <div className="overflow-hidden rounded-3xl border border-[#efe6d6] bg-white shadow-[0_16px_40px_rgba(40,32,20,0.04)]">
            <FormSection step="1" title="Contact" detail="The order note goes to this email and phone.">
              <div className="grid gap-4 sm:grid-cols-2">
                <label className={`${labelClass} sm:col-span-2`}>
                  Full name
                  <input name="fullName" required autoComplete="name" defaultValue={contact.fullName} className={fieldClass} placeholder="Your name" />
                </label>
                <label className={labelClass}>
                  Email
                  <input name="email" type="email" required autoComplete="email" defaultValue={contact.email} className={fieldClass} placeholder="you@email.com" />
                </label>
                <label className={labelClass}>
                  Phone
                  <input name="phone" type="tel" required autoComplete="tel" defaultValue={contact.phone} className={fieldClass} placeholder="98765 43210" />
                </label>
              </div>
            </FormSection>

            <FormSection step="2" title="Shipping address" detail={contact.label ? `Filled from your default address, ${contact.label}. Change anything for this order.` : "Most orders arrive in 3–7 business days."}>
              <div className="grid gap-4 sm:grid-cols-6">
                <label className={`${labelClass} sm:col-span-6`}>
                  Address
                  <input name="address" required autoComplete="street-address" defaultValue={contact.address} className={fieldClass} placeholder="House, street, area" />
                </label>
                <label className={`${labelClass} sm:col-span-2`}>
                  City
                  <input name="city" required autoComplete="address-level2" defaultValue={contact.city} className={fieldClass} placeholder="Firozabad" />
                </label>
                <label className={`${labelClass} sm:col-span-2`}>
                  State
                  <select name="state" defaultValue={states.includes(contact.state) ? contact.state : "Karnataka"} className={fieldClass}>
                    {states.map((state) => (
                      <option key={state}>{state}</option>
                    ))}
                  </select>
                </label>
                <label className={`${labelClass} sm:col-span-2`}>
                  PIN code
                  <input name="pin" required inputMode="numeric" autoComplete="postal-code" maxLength={6} defaultValue={contact.pin} className={fieldClass} placeholder="560001" />
                </label>
              </div>
            </FormSection>

            <FormSection step="3" title="Payment" detail="Choose how you want to pay for this order.">
              <div className="grid gap-2 sm:grid-cols-3">
                {payments.map((method) => {
                  const selected = payment === method.id;
                  return (
                    <label
                      key={method.id}
                      className={`flex cursor-pointer items-center gap-3 rounded-2xl border px-3 py-3 ${
                        selected ? "border-[#c6a15a] bg-[#fbf7ef] ring-1 ring-[#c6a15a]" : "border-[#e6dccb] bg-[#fbfaf7] hover:border-[#c6a15a]"
                      }`}
                    >
                      <input
                        type="radio"
                        name="payment"
                        value={method.id}
                        checked={selected}
                        onChange={() => setPayment(method.id)}
                        className="sr-only"
                      />
                      <PaymentMark method={method.id} selected={selected} />
                      <span>
                        <span className="block text-sm font-medium text-neutral-950">{method.id}</span>
                        <span className="mt-0.5 block text-xs text-neutral-500">{method.detail}</span>
                      </span>
                    </label>
                  );
                })}
              </div>
              {payment === "UPI" ? (
                <label className={`${labelClass} mt-4`}>
                  UPI ID
                  <input
                    value={upiId}
                    onChange={(event) => setUpiId(event.target.value)}
                    className={fieldClass}
                    placeholder="name@upi"
                    autoComplete="off"
                  />
                </label>
              ) : null}
              {payment === "Card" ? (
                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  <label className={`${labelClass} sm:col-span-2`}>
                    Card number
                    <input
                      value={cardNumber}
                      onChange={(event) => setCardNumber(event.target.value)}
                      inputMode="numeric"
                      autoComplete="cc-number"
                      className={fieldClass}
                      placeholder="1234 5678 9012 3456"
                    />
                  </label>
                  <label className={labelClass}>
                    Expiry
                    <input
                      value={cardExpiry}
                      onChange={(event) => setCardExpiry(event.target.value)}
                      autoComplete="cc-exp"
                      className={fieldClass}
                      placeholder="MM/YY"
                    />
                  </label>
                  <label className={labelClass}>
                    CVV
                    <input
                      value={cardCvv}
                      onChange={(event) => setCardCvv(event.target.value)}
                      inputMode="numeric"
                      autoComplete="cc-csc"
                      className={fieldClass}
                      placeholder="123"
                    />
                  </label>
                </div>
              ) : null}
              {payment === "Cash on delivery" ? (
                <p className="mt-4 text-sm leading-6 text-neutral-500">
                  Pay when the light arrives. Keep the phone number reachable for the delivery.
                </p>
              ) : null}
            </FormSection>
          </div>
          <OrderSummary
            items={items}
            discount={liveDiscount}
            discountLabel={liveQuote?.ok ? liveQuote.code : undefined}
            coupon={
              <div>
                <p className={labelClass}>Coupon</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {storeCoupons.map((offer) => {
                    const selected = appliedCode === offer.code;
                    return (
                      <button
                        key={offer.code}
                        type="button"
                        onClick={() => {
                          setCoupon(offer.code);
                          setAppliedCode(offer.code);
                          setCouponError("");
                          setError("");
                        }}
                        className={`cursor-pointer rounded-full border px-3 py-1 text-xs font-medium ${
                          selected
                            ? "border-[#c6a15a] bg-[#fbf7ef] text-[#8a6a32]"
                            : "border-[#e6dccb] bg-white text-neutral-700 hover:border-[#c6a15a]"
                        }`}
                      >
                        {offer.code} · {offer.percent}%
                      </button>
                    );
                  })}
                </div>
                <div className="mt-2 flex gap-2">
                  <label className="sr-only" htmlFor="coupon">
                    Coupon code
                  </label>
                  <input
                    id="coupon"
                    value={coupon}
                    onChange={(event) => setCoupon(event.target.value.toUpperCase())}
                    className="h-11 min-w-0 flex-1 rounded-xl border border-[#e6dccb] bg-[#fbfaf7] px-3 text-sm uppercase outline-none placeholder:normal-case placeholder:text-neutral-400 focus:border-[#c6a15a] focus:bg-white"
                    placeholder="Enter code"
                    autoComplete="off"
                  />
                  <button
                    type="button"
                    className="h-11 cursor-pointer rounded-xl border border-[#c6a15a] px-3 text-sm font-medium text-[#8a6a32] hover:bg-[#fbf7ef]"
                    onClick={() => {
                      const quote = quoteCoupon(coupon, subtotalOf(items));
                      if (!quote.ok) {
                        setAppliedCode("");
                        setCouponError(quote.message);
                        return;
                      }
                      setAppliedCode(quote.code);
                      setCouponError("");
                      setError("");
                    }}
                  >
                    Apply
                  </button>
                </div>
                {couponError ? (
                  <p className="mt-2 text-sm text-red-600" role="alert">
                    {couponError}
                  </p>
                ) : null}
                {appliedCode ? (
                  <p className="mt-2 text-sm text-[#3f6808]" role="status">
                    {appliedCode} is applied.
                  </p>
                ) : null}
              </div>
            }
            action={
              <div>
                {error ? (
                  <p className="mb-3 text-sm text-red-600" role="alert">
                    {error}
                  </p>
                ) : null}
                <button
                  type="submit"
                  className="flex h-12 w-full cursor-pointer items-center justify-between rounded-xl bg-[#c6a15a] px-5 text-sm font-medium text-white transition-colors hover:bg-[#b69048]"
                >
                  <span>Place order</span>
                  <span>{formatPrice(totalNow)}</span>
                </button>
              </div>
            }
          />
        </form>
      ) : null}
    </div>
  );
}

function FormSection({
  step,
  title,
  detail,
  children,
}: {
  step: string;
  title: string;
  detail: string;
  children: ReactNode;
}) {
  return (
    <section className="border-t border-[#f0eadf] p-6 first:border-t-0 sm:p-8">
      <div className="flex items-start gap-3">
        <span className="grid size-8 shrink-0 place-items-center rounded-full bg-[#1c1917] text-xs font-semibold text-white">
          {step}
        </span>
        <div>
          <h2 className="text-base font-semibold tracking-tight text-neutral-950">{title}</h2>
          <p className="mt-0.5 text-sm text-neutral-500">{detail}</p>
        </div>
      </div>
      <div className="mt-5">{children}</div>
    </section>
  );
}

function PaymentMark({ method, selected }: { method: PaymentMethod; selected: boolean }) {
  return (
    <span
      className={`grid size-9 shrink-0 place-items-center rounded-full ${
        selected ? "bg-[#c6a15a] text-white" : "bg-white text-[#8a6a32] ring-1 ring-[#e6dccb]"
      }`}
    >
      {method === "UPI" ? <UpiIcon /> : method === "Card" ? <CardIcon /> : <CashIcon />}
    </span>
  );
}

function UpiIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      <path d="M7 7h10v10H7z" strokeLinejoin="round" />
      <path d="m9 12 2 2 4-4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function CardIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      <rect x="3.5" y="6" width="17" height="12" rx="2" />
      <path d="M3.5 10h17" />
    </svg>
  );
}

function CashIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      <rect x="3.5" y="6.5" width="17" height="11" rx="2" />
      <circle cx="12" cy="12" r="2" />
    </svg>
  );
}
