import type { Metadata } from "next";
import { PolicyGrid } from "@/components/storefront/support/policy-grid";
import { SupportPage } from "@/components/storefront/support/support-page";
import { FREE_SHIPPING_FROM, SHIPPING_FEE } from "@/lib/cart-store";
import { formatPrice } from "@/lib/products";

export const metadata: Metadata = {
  title: "Shipping Policy | Lotus Lights",
  description: "How Lotus Lights ships orders across India, including cost and delivery time.",
};

export default function ShippingPolicyPage() {
  return (
    <SupportPage
      crumb="Shipping Policy"
      eyebrow="DELIVERY"
      title="From the studio"
      titleLine="to your door"
      intro="What to expect from the time you place an order until the light reaches you."
      image="/images/home/dining-room.jpg"
      current="/shipping-policy"
      highlights={[
        { title: "Across India", detail: "Packed in Firozabad", icon: <PinIcon /> },
        { title: "Free shipping", detail: `Orders of ${formatPrice(FREE_SHIPPING_FROM)}+`, icon: <TagIcon /> },
        { title: formatPrice(SHIPPING_FEE), detail: "On smaller orders", icon: <RupeeIcon /> },
        { title: "3–7 days", detail: "After dispatch", icon: <ClockIcon /> },
      ]}
    >
      <PolicyGrid
        sections={[
          {
            title: "Where we ship",
            icon: <PinIcon />,
            body: "Lotus Lights delivers across India. Orders leave our studio in Firozabad.",
          },
          {
            title: "Shipping cost",
            icon: <TagIcon />,
            body: `Shipping is free on orders of ${formatPrice(FREE_SHIPPING_FROM)} or more. Orders below that amount include a ${formatPrice(SHIPPING_FEE)} shipping fee, shown at checkout before you pay.`,
          },
          {
            title: "Delivery time",
            icon: <ClockIcon />,
            body: "Most orders arrive in 3–7 business days after they are dispatched. Remote PIN codes can take a little longer. The product page also lets you check a PIN code before you buy.",
          },
          {
            title: "After you place an order",
            icon: <BagIcon />,
            body: "You will see the order on your profile under Orders, with the lights, the address, and the total. If you need the address changed, write to support@lotuslights.in with the order number before it leaves Firozabad.",
          },
          {
            title: "If a parcel arrives damaged",
            icon: <BoxIcon />,
            body: "Photograph the outer box and the light, then contact us within 48 hours of delivery. We will arrange a replacement or a return.",
          },
        ]}
      />
    </SupportPage>
  );
}

function PinIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
      <path d="M12 21s6-5.2 6-10a6 6 0 1 0-12 0c0 4.8 6 10 6 10Z" />
      <circle cx="12" cy="11" r="1.8" />
    </svg>
  );
}

function TagIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
      <path d="M4.5 12.2 12.2 4.5H19v6.8l-7.7 7.7L4.5 12.2Z" />
      <circle cx="15.5" cy="8.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

function RupeeIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
      <path d="M7 6h10M7 10h10M7 6c4 0 6 1.6 6 4.2S11 15 7 18" />
    </svg>
  );
}

function ClockIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
      <circle cx="12" cy="12" r="7.5" />
      <path d="M12 8.5V12l2.5 2" />
    </svg>
  );
}

function BagIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
      <path d="M6.5 8.5h11l-.8 10h-9.4l-.8-10Z" />
      <path d="M9 8.5V7a3 3 0 0 1 6 0v1.5" />
    </svg>
  );
}

function BoxIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
      <path d="m4.5 8 7.5-3.5L19.5 8 12 11.5 4.5 8Z" />
      <path d="M12 11.5V20l7.5-3.5V8M4.5 8v8.5L12 20" />
    </svg>
  );
}
