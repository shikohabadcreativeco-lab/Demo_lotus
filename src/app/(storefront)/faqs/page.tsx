import type { Metadata } from "next";
import { FaqList } from "@/components/storefront/support/faq-list";
import { SupportPage } from "@/components/storefront/support/support-page";

export const metadata: Metadata = {
  title: "FAQs | Lotus Lights",
  description: "Answers about Lotus Lights orders, shipping, returns, and installation.",
};

export default function FaqsPage() {
  return (
    <SupportPage
      crumb="FAQs"
      eyebrow="COMMON QUESTIONS"
      title="Answers, before"
      titleLine="you write in"
      intro="Short answers about ordering, delivery, returns, and looking after your light."
      image="/images/home/living-room.jpg"
      current="/faqs"
      highlights={[
        { title: "Orders", detail: "Sign in, then checkout", icon: <BagIcon /> },
        { title: "Shipping", detail: "Free from ₹500", icon: <TruckIcon /> },
        { title: "Returns", detail: "7 days, unused lights", icon: <ReturnIcon /> },
        { title: "Warranty", detail: "1 year on every light", icon: <ShieldIcon /> },
      ]}
    >
      <FaqList />
    </SupportPage>
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
