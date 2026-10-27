import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import {
  ProfileExperience,
  type ProfileSection,
} from "@/components/storefront/profile/profile-experience";
import { findUserById } from "@/lib/accounts";
import { currentAccount } from "@/lib/current-session";
import { listUserAddresses } from "@/lib/address-api";
import { listOrders } from "@/lib/customer-records";

export const metadata: Metadata = {
  title: "My account | Lotus Lights",
  description: "Your Lotus Lights account, addresses, and previous orders.",
};

export default function ProfilePage({
  searchParams,
}: {
  searchParams: Promise<{ section?: string }>;
}) {
  return (
    <Suspense fallback={<div className="min-h-[50vh] bg-[#f6f3ee]" />}>
      <ProfileDetails searchParams={searchParams} />
    </Suspense>
  );
}

async function ProfileDetails({
  searchParams,
}: {
  searchParams: Promise<{ section?: string }>;
}) {
  const account = await currentAccount();
  if (!account) redirect("/login?next=/profile");

  const [{ section }, user, addresses, orders] = await Promise.all([
    searchParams,
    findUserById(account.userId),
    listUserAddresses(),
    listOrders(account.userId),
  ]);

  const phone =
    account.phone ||
    (user && "phone" in user && typeof user.phone === "string" && user.phone
      ? user.phone
      : user?.fullPhone || "");
  const createdAt =
    user?.createdAt instanceof Date
      ? user.createdAt.toISOString()
      : typeof user?.createdAt === "string"
        ? user.createdAt
        : "";

  return (
    <ProfileExperience
      section={sectionOf(section)}
      name={account.fullName || "Lotus customer"}
      email={account.email}
      phone={phone}
      role={account.role}
      memberSince={formatMonth(createdAt)}
      addresses={addresses}
      orders={orders}
    />
  );
}

function sectionOf(value: string | undefined): ProfileSection {
  if (value === "addresses" || value === "orders" || value === "support") return value;
  return "account";
}

function formatMonth(value: string) {
  const date = new Date(value);
  if (!value || Number.isNaN(date.getTime())) return "";
  return new Intl.DateTimeFormat("en-IN", { month: "long", year: "numeric" }).format(date);
}
