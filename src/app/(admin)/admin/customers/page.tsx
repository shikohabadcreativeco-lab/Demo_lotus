import { Suspense } from "react";
import { AdminPageHeader } from "@/components/admin/admin-shell";
import { listAccounts } from "@/lib/accounts";

type CustomerRow = {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  role: string;
  joined?: string;
};

export default function AdminCustomersPage() {
  return (
    <Suspense fallback={<div className="min-h-40" />}>
      <CustomersContent />
    </Suspense>
  );
}

async function CustomersContent() {
  const accounts = await listAccounts();
  const rows: CustomerRow[] = accounts.map((account) => ({
    id: account._id,
    fullName: account.fullName || "Shopper",
    email: account.email || "—",
    phone: account.fullPhone || account.phoneNumber || "—",
    role: account.role || "customer",
    joined: account.createdAt,
  }));
  const customers = rows.filter((row) => row.role !== "admin").length;

  return (
    <>
      <AdminPageHeader
        title="Customers"
        detail="Accounts that have signed up on the store."
      />
      <div className="mb-6 grid gap-4 sm:grid-cols-2">
        <Stat label="Accounts" value={String(rows.length)} />
        <Stat label="Customers" value={String(customers)} />
      </div>
      <div className="overflow-x-auto rounded-2xl border border-[#d5e2ea] bg-white">
        <table className="w-full min-w-[46rem] text-left text-sm">
          <thead className="border-b border-neutral-100 text-neutral-500">
            <tr>
              <th className="px-5 py-3 font-medium">Customer</th>
              <th className="px-5 py-3 font-medium">Phone</th>
              <th className="px-5 py-3 font-medium">Joined</th>
              <th className="px-5 py-3 font-medium">Role</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100">
            {rows.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-5 py-8 text-sm text-neutral-500">
                  No customers yet.
                </td>
              </tr>
            ) : null}
            {rows.map((row) => (
              <tr key={row.id} className="hover:bg-[#f4f8fb]">
                <td className="px-5 py-3">
                  <div className="flex items-center gap-3">
                    <span className="grid size-9 shrink-0 place-items-center rounded-full bg-[#e5f6f4] text-xs font-semibold text-[#145860]">
                      {initials(row.fullName)}
                    </span>
                    <span>
                      <span className="block font-medium text-[#172033]">{row.fullName}</span>
                      <span className="block text-xs text-neutral-500">{row.email}</span>
                    </span>
                  </div>
                </td>
                <td className="px-5 py-3 text-neutral-700">{row.phone}</td>
                <td className="px-5 py-3 text-neutral-600">{row.joined ? dateLabel(row.joined) : "—"}</td>
                <td className="px-5 py-3">
                  <span
                    className={`rounded-full px-2.5 py-1 text-xs font-medium capitalize ${
                      row.role === "admin" ? "bg-[#172033] text-[#b7f3ea]" : "bg-[#e5f6f4] text-[#145860]"
                    }`}
                  >
                    {row.role}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-[#d5e2ea] bg-white p-5">
      <p className="text-sm text-neutral-500">{label}</p>
      <p className="mt-2 text-2xl font-semibold text-[#172033]">{value}</p>
    </div>
  );
}

function initials(name: string) {
  return name
    .split(" ")
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("");
}

function dateLabel(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleDateString("en-IN", { dateStyle: "medium" });
}
