import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { CheckoutExperience } from "@/components/storefront/checkout/checkout-experience";
import { currentAccount } from "@/lib/current-session";
import { listUserAddresses } from "@/lib/address-api";

export const metadata: Metadata = {
  title: "Checkout | Lotus Lights",
  description: "Enter a delivery address and place your Lotus Lights order.",
};

export default function CheckoutPage() {
  return (
    <Suspense fallback={<div className="min-h-[50vh] bg-[#f6f3ee]" />}>
      <CheckoutGate />
    </Suspense>
  );
}

async function CheckoutGate() {
  const account = await currentAccount();
  if (!account) redirect("/login?next=/checkout");
  const addresses = await listUserAddresses();
  const saved = addresses.find((address) => address.isDefault) ?? addresses[0];
  const street = [saved?.line, saved?.line2].filter(Boolean).join(", ");
  return (
    <CheckoutExperience
      contact={{
        fullName: saved?.fullName || account.fullName,
        email: account.email,
        phone: saved?.phone || account.phone,
        address: street,
        city: saved?.city ?? "",
        state: saved?.state ?? "",
        pin: saved?.pin ?? "",
        label: saved?.label ?? "",
      }}
    />
  );
}
