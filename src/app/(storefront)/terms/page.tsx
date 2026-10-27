import type { Metadata } from "next";
import { PolicyGrid } from "@/components/storefront/support/policy-grid";
import { SupportPage } from "@/components/storefront/support/support-page";

export const metadata: Metadata = {
  title: "Terms & Conditions | Lotus Lights",
  description: "The terms for using Lotus Lights and buying a light from the store.",
};

export default function TermsPage() {
  return (
    <SupportPage
      crumb="Terms & Conditions"
      eyebrow="THE STORE"
      title="How shopping"
      titleLine="with us works"
      intro="These terms cover your account, orders, delivery, returns, and warranty."
      image="/images/home/workspace.jpg"
      current="/terms"
      highlights={[
        { title: "Your account", detail: "Needed to place an order", icon: <UserIcon /> },
        { title: "Prices in ₹", detail: "Shown with the discount", icon: <TagIcon /> },
        { title: "7-day returns", detail: "Unused, original packing", icon: <ReturnIcon /> },
        { title: "1 year warranty", detail: "Manufacturing defects", icon: <ShieldIcon /> },
      ]}
    >
      <PolicyGrid
        sections={[
          {
            title: "Using your account",
            icon: <UserIcon />,
            body: "You need an account to place an order. Keep your sign-in details private. You can sign out from your profile at any time, which ends that session.",
          },
          {
            title: "Orders and prices",
            icon: <TagIcon />,
            body: "Prices are shown in Indian rupees and include the discount displayed on the product page. An order is confirmed when checkout finishes and the order appears under Orders on your profile.",
          },
          {
            title: "Delivery",
            icon: <TruckIcon />,
            body: "Shipping is free on orders of ₹500 or more. Smaller orders include a ₹99 shipping fee. Most deliveries in India arrive in 3–7 business days from dispatch in Firozabad.",
          },
          {
            title: "Returns",
            icon: <ReturnIcon />,
            body: "Unused lights can be returned within 7 days of delivery, in their original packing. Refunds go back to the original payment method after we receive and check the lamp.",
          },
          {
            title: "Warranty",
            icon: <ShieldIcon />,
            body: "Each light includes a 1 year warranty for manufacturing defects. The warranty does not cover damage from a fall, water, or a repair done outside Lotus Lights.",
          },
          {
            title: "Payments",
            icon: <CardIcon />,
            body: "Checkout accepts UPI, card, and cash on delivery. Card details are used only to place that order and are not stored on your profile.",
          },
          {
            title: "Contact",
            icon: <MailIcon />,
            body: "Questions about these terms can go to support@lotuslights.in or +91 98765 43210. Lotus Lights is based in Firozabad, India.",
          },
        ]}
      />
    </SupportPage>
  );
}

function UserIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
      <circle cx="12" cy="8" r="3" />
      <path d="M6 18.5c.9-2.4 2.8-3.5 6-3.5s5.1 1.1 6 3.5" />
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

function TruckIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
      <path d="M3.5 7.5h10v8h-10v-8Z" />
      <path d="M13.5 11h3l2.2 2.6V15.5h-5.2" />
      <circle cx="7" cy="17.2" r="1.1" />
      <circle cx="16.2" cy="17.2" r="1.1" />
    </svg>
  );
}

function ReturnIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
      <path d="M8 8H5.5V5.5" />
      <path d="M5.8 8A7 7 0 1 1 5 13" />
    </svg>
  );
}

function ShieldIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
      <path d="M12 3.8 19 6.3v5.2c0 4-2.7 6.8-7 8.5-4.3-1.7-7-4.5-7-8.5V6.3L12 3.8Z" />
      <path d="m9.2 12 1.8 1.8 3.8-4" />
    </svg>
  );
}

function CardIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
      <rect x="3.5" y="6" width="17" height="12" rx="2" />
      <path d="M3.5 10h17" />
    </svg>
  );
}

function MailIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
      <rect x="4" y="6" width="16" height="12" rx="2" />
      <path d="m5 8 7 5 7-5" />
    </svg>
  );
}
