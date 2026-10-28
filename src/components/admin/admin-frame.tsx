import { redirect } from "next/navigation";
import { AdminShell } from "@/components/admin/admin-shell";
import { currentAccount } from "@/lib/current-session";

export async function AdminFrame({ children }: { children: React.ReactNode }) {
  const account = await currentAccount();
  if (!account) redirect("/login?next=/admin");
  if (account.role !== "admin") redirect("/");

  return (
    <AdminShell name={account.fullName} email={account.email}>
      {children}
    </AdminShell>
  );
}
