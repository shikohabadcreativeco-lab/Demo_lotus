import type { Metadata } from "next";
import { PolicyGrid } from "@/components/storefront/support/policy-grid";
import { SupportPage } from "@/components/storefront/support/support-page";

export const metadata: Metadata = {
  title: "Returns | Lotus Lights",
  description: "How to return an unused Lotus Lights lamp within 7 days of delivery.",
};

export default function ReturnsPage() {
  return (
    <SupportPage
      crumb="Returns"
      eyebrow="7 DAYS"
      title="Changed your"
      titleLine="mind"
      intro="Unused lights can come back within 7 days of delivery, in the packing they arrived in."
      image="/images/home/promo-lamp.jpg"
      current="/returns"
      highlights={[
        { title: "7 days", detail: "From the delivery date", icon: <ClockIcon /> },
        { title: "Unused", detail: "Original packing", icon: <BoxIcon /> },
        { title: "Refund", detail: "Original payment method", icon: <CardIcon /> },
        { title: "Warranty", detail: "1 year, separate from returns", icon: <ShieldIcon /> },
      ]}
    >
      <PolicyGrid
        sections={[
          {
            title: "What can be returned",
            icon: <BoxIcon />,
            body: "Unused lights can be returned within 7 days of delivery. The lamp should be in its original packing, with the care note. Lights that have been fitted, damaged, or used are not eligible.",
          },
          {
            title: "How to start",
            icon: <MailIcon />,
            body: "Write to support@lotuslights.in or call +91 98765 43210 with your order number. You can also send a message from the Support section of your profile. We reply within 24 hours with the return steps.",
          },
          {
            title: "Sending it back",
            icon: <TruckIcon />,
            body: "Pack the lamp the way it arrived. We arrange collection from the delivery address in India, or share a drop-off option if collection is not available for that pin code.",
          },
          {
            title: "Refunds",
            icon: <CardIcon />,
            body: "After the lamp reaches Firozabad and we check that it is unused, the refund goes back to the original payment method. Cash on delivery orders are refunded to the bank or UPI details you share with support.",
          },
          {
            title: "Warranty is separate",
            icon: <ShieldIcon />,
            body: "A manufacturing defect is covered by the 1 year warranty, even after the 7-day return window. Damage from a fall, water, or a repair done outside Lotus Lights is not covered.",
          },
          {
            title: "Questions",
            icon: <ChatIcon />,
            body: "If you are unsure whether a light qualifies, write before you send it. Include the product name and a photo of the lamp in its packing.",
          },
        ]}
      />
    </SupportPage>
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

function BoxIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
      <path d="M4 8.5 12 4.5l8 4v11l-8 4-8-4v-11Z" />
      <path d="M4 8.5 12 12.5 20 8.5" />
      <path d="M12 12.5V19.5" />
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

function CardIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
      <rect x="3.5" y="6" width="17" height="12" rx="2" />
      <path d="M3.5 10h17" />
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

function ChatIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
      <path d="M6 16.5 4.8 19.2A.6.6 0 0 0 5.4 20H16a4 4 0 0 0 4-4V9a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v5.2a3 3 0 0 0 2 2.8Z" />
    </svg>
  );
}
