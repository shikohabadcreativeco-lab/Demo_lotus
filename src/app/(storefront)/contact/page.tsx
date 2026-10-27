import type { Metadata } from "next";
import Link from "next/link";
import { ContactForm } from "@/components/storefront/contact/contact-form";
import { ContactHero } from "@/components/storefront/contact/contact-hero";
import { ContactInfo } from "@/components/storefront/contact/contact-info";

export const metadata: Metadata = {
  title: "Contact | Lotus Lights",
  description:
    "Talk to the Lotus Lights studio in Firozabad about orders, lamps, and custom lighting. We reply within 24 hours.",
};

const topics = [
  {
    title: "Orders",
    detail: "Tracking, delivery across India, and returns within 7 days.",
    href: "/faqs",
  },
  {
    title: "Lamps",
    detail: "Finish, size, and which light belongs in a room.",
    href: "/shop",
  },
  {
    title: "Projects",
    detail: "A quote for a home, office, showroom, or store.",
    href: "/about",
  },
];

export default function ContactPage() {
  return (
    <>
      <ContactHero />
      <div className="mx-auto grid w-full max-w-7xl items-start gap-6 px-4 py-10 sm:px-6 lg:grid-cols-[minmax(0,1.15fr)_minmax(18rem,0.85fr)] lg:px-8 lg:py-14">
        <ContactForm />
        <ContactInfo />
      </div>
      <section className="mx-auto w-full max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
        <div className="grid gap-4 md:grid-cols-3">
          {topics.map((topic) => (
            <Link
              key={topic.title}
              href={topic.href}
              className="rounded-2xl border border-neutral-200 bg-white p-5 transition-colors hover:border-[#c6a15a]"
            >
              <p className="text-sm font-semibold text-neutral-950">{topic.title}</p>
              <p className="mt-2 text-sm leading-6 text-neutral-500">{topic.detail}</p>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
