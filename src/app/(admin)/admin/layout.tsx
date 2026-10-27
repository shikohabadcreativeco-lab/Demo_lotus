import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { AdminShell } from "@/components/admin/admin-shell";
import { currentAccount } from "@/lib/current-session";

export const metadata: Metadata = {
  title: "Admin | Lotus Lights",
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={<div className="min-h-dvh flex-1 bg-[#e6eef3]" />}>
      <AdminFrame>{children}</AdminFrame>
    </Suspense>
  );
}

async function AdminFrame({ children }: { children: React.ReactNode }) {
  const account = await currentAccount();
  if (!account) redirect("/login?next=/admin");
  if (account.role !== "admin") redirect("/");

  return (
    <AdminShell name={account.fullName} email={account.email}>
      {children}
    </AdminShell>
  );
}
