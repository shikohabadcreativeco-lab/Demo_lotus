"use client";

import { useState } from "react";

const groups = [
  {
    title: "Orders",
    icon: <BagIcon />,
    items: [
      {
        q: "How do I place an order?",
        a: "Choose a light, set the quantity, and add it to your cart. Checkout asks for a delivery address and a payment method. You need to be signed in before the order is placed.",
      },
      {
        q: "Where can I see previous orders?",
        a: "Open your profile and choose Orders. Each order shows the lights, the delivery address, and the total.",
      },
      {
        q: "Can I change an order after it is placed?",
        a: "Write to support@lotuslights.in with your order number as soon as you can. Once the order has left Firozabad, the address and items can no longer be changed.",
      },
    ],
  },
  {
    title: "Shipping and returns",
    icon: <TruckIcon />,
    items: [
      {
        q: "How much does shipping cost?",
        a: "Shipping is free on orders of ₹500 or more. Smaller orders have a ₹99 shipping fee.",
      },
      {
        q: "How long does delivery take?",
        a: "Orders ship from Firozabad. Most addresses in India receive them in 3–7 business days.",
      },
      {
        q: "What is the return window?",
        a: "Unused lights can be returned within 7 days of delivery. The lamp should be in its original packing, with the care note.",
      },
    ],
  },
  {
    title: "The lights",
    icon: <LampIcon />,
    items: [
      {
        q: "Do the lamps include a warranty?",
        a: "Every Lotus Lights product includes a 1 year warranty for manufacturing defects.",
      },
      {
        q: "How do I install a lamp?",
        a: "Table and floor lamps plug into a nearby socket. Wall lights, pendants, and ceiling lights include mounting hardware and need the power switched off at the board before you connect them. The steps are on each product page.",
      },
      {
        q: "What if a light does not turn on?",
        a: "Check the switch, the bulb or LED fitting, and the socket. If it still stays dark, contact us with the product name and your order number.",
      },
    ],
  },
];

export function FaqList() {
  const [open, setOpen] = useState("How do I place an order?");

  return (
    <section className="rounded-3xl border border-[#ece4d6] bg-white p-4 shadow-[0_18px_40px_rgba(28,25,23,0.05)] sm:p-6">
      <div className="grid gap-8 lg:grid-cols-3">
        {groups.map((group) => (
          <div key={group.title}>
            <h2 className="flex items-center gap-2 text-sm font-semibold text-neutral-900">
              <span className="grid size-8 place-items-center rounded-full bg-[#f3eee6] text-[#c6a15a]">{group.icon}</span>
              {group.title}
            </h2>
            <ul className="mt-2">
              {group.items.map((item) => {
                const expanded = open === item.q;
                return (
                  <li key={item.q} className="border-b border-neutral-100 last:border-b-0">
                    <button
                      type="button"
                      aria-expanded={expanded}
                      onClick={() => setOpen(expanded ? "" : item.q)}
                      className="flex w-full cursor-pointer items-center justify-between gap-3 py-3 text-left text-sm text-neutral-600 hover:text-neutral-950"
                    >
                      {item.q}
                      <ChevronIcon open={expanded} />
                    </button>
                    {expanded ? <p className="pb-3 text-xs leading-5 text-neutral-500">{item.a}</p> : null}
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}

function ChevronIcon({ open }: { open: boolean }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={`size-4 shrink-0 text-neutral-400 transition-transform ${open ? "rotate-90" : ""}`}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      aria-hidden="true"
    >
      <path d="m9 6 6 6-6 6" />
    </svg>
  );
}

function BagIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true">
      <path d="M6.5 8.5h11l-.8 10h-9.4l-.8-10Z" />
      <path d="M9 8.5V7a3 3 0 0 1 6 0v1.5" />
    </svg>
  );
}

function TruckIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true">
      <path d="M3.5 7.5h10v8h-10v-8Z" />
      <path d="M13.5 11h3l2.2 2.6V15.5h-5.2" />
      <circle cx="7" cy="17.2" r="1.1" />
      <circle cx="16.2" cy="17.2" r="1.1" />
    </svg>
  );
}

function LampIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true">
      <path d="M9 20h6M12 16v4" />
      <path d="M8 16h8l1.2-6.2A6.2 6.2 0 0 0 12 4a6.2 6.2 0 0 0-5.2 5.8L8 16Z" />
    </svg>
  );
}
