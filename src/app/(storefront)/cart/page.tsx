import type { Metadata } from "next";
import { Suspense } from "react";
import { CartExperience } from "@/components/storefront/cart/cart-experience";
import { hasSignedInSession } from "@/lib/current-session";

export const metadata: Metadata = {
  title: "Cart | Lotus Lights",
  description: "Review the lights in your Lotus Lights cart before checkout.",
};

export default function CartPage() {
  return (
    <Suspense fallback={<div className="min-h-[50vh] bg-[#f6f3ee]" />}>
      <CartGate />
    </Suspense>
  );
}

async function CartGate() {
  const signedIn = await hasSignedInSession();
  return <CartExperience signedIn={signedIn} />;
}
