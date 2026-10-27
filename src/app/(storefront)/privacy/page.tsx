import type { Metadata } from "next";
import { PolicyGrid } from "@/components/storefront/support/policy-grid";
import { SupportPage } from "@/components/storefront/support/support-page";

export const metadata: Metadata = {
  title: "Privacy Policy | Lotus Lights",
  description: "How Lotus Lights uses the details you share when you shop or write to us.",
};

export default function PrivacyPage() {
  return (
    <SupportPage
      crumb="Privacy Policy"
      eyebrow="YOUR DETAILS"
      title="What we keep,"
      titleLine="and why"
      intro="Account, order, and message details are used to deliver a light and to answer you."
      image="/images/home/bedroom.jpg"
      current="/privacy"
      highlights={[
        { title: "Account", detail: "Name, email, phone", icon: <UserIcon /> },
        { title: "Orders", detail: "Address and totals", icon: <BagIcon /> },
        { title: "Payments", detail: "Not stored on profile", icon: <CardIcon /> },
        { title: "Your choice", detail: "Ask us to remove it", icon: <ShieldIcon /> },
      ]}
    >
      <PolicyGrid
        sections={[
          {
            title: "What we collect",
            icon: <UserIcon />,
            body: "When you create an account we store your name, email, and phone number. Checkout adds a delivery address. If you write to us, we keep the message so we can reply.",
          },
          {
            title: "How we use it",
            icon: <BagIcon />,
            body: "We use these details to place and deliver orders, show them on your profile, and answer questions about a light. We do not sell your details.",
          },
          {
            title: "Payments",
            icon: <CardIcon />,
            body: "Checkout accepts UPI, card, and cash on delivery. Card details are used only to place that order and are not stored on your profile.",
          },
          {
            title: "Who sees an order",
            icon: <TruckIcon />,
            body: "Delivery partners receive the name, phone number, and address needed to bring the parcel. Support staff can see an order when you ask for help.",
          },
          {
            title: "How long we keep it",
            icon: <ClockIcon />,
            body: "Order records stay on your profile so you can look them up later. You can update your name, phone, and addresses from your profile while you are signed in.",
          },
          {
            title: "Asking us to remove it",
            icon: <ShieldIcon />,
            body: "Write to support@lotuslights.in from the email on your account if you want your account closed. We keep what the law requires for completed orders, and remove the rest.",
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

function BagIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
      <path d="M6.5 8.5h11l-.8 10h-9.4l-.8-10Z" />
      <path d="M9 8.5V7a3 3 0 0 1 6 0v1.5" />
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

function ClockIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
      <circle cx="12" cy="12" r="7.5" />
      <path d="M12 8.5V12l2.5 2" />
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
