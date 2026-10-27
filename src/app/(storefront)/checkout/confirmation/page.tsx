import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { OrderConfirmation } from "@/components/storefront/checkout/order-confirmation";
import { hasSignedInSession } from "@/lib/current-session";

export const metadata: Metadata = {
  title: "Order confirmed | Lotus Lights",
  description: "Your Lotus Lights order is confirmed.",
};

export default function ConfirmationPage() {
  return (
    <Suspense fallback={<div className="min-h-[50vh] bg-[#f6f3ee]" />}>
      <ConfirmationGate />
    </Suspense>
  );
}

async function ConfirmationGate() {
  if (!(await hasSignedInSession())) {
    redirect("/login?next=/checkout/confirmation");
  }
  return <OrderConfirmation />;
}
