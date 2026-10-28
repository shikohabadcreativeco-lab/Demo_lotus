import { AdminPageHeader } from "@/components/admin/admin-shell";
import { AdminPanel, AdminStat, adminTh } from "@/components/admin/admin-ui";
import { listAccounts } from "@/lib/accounts";

type CustomerRow = {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  role: string;
  joined?: string;
};

export async function CustomersContent() {
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
        detail="People who created a store account."
      />
      <div className="mb-6 grid gap-4 sm:grid-cols-2">
        <AdminStat label="Customers" value={String(customers)} hint="Store accounts" />
        <AdminStat label="Staff" value={String(rows.length - customers)} hint="Admin seats" />
      </div>
      <AdminPanel title="Directory" detail="Signed-up accounts.">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[46rem] text-left text-sm">
          <thead className="border-b border-[#eee6d8]">
            <tr>
              <th className={adminTh}>Customer</th>
              <th className={adminTh}>Phone</th>
              <th className={adminTh}>Joined</th>
              <th className={adminTh}>Role</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#f0eadf]">
            {rows.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-5 py-8 text-sm text-[#7a7164]">
                  No customers yet.
                </td>
              </tr>
            ) : null}
            {rows.map((row) => (
              <tr key={row.id} className="hover:bg-[#f3eee4]">
                <td className="px-5 py-3">
                  <div className="flex items-center gap-3">
                    <span className="grid size-9 shrink-0 place-items-center rounded-md bg-[#141a22] text-xs font-semibold text-[#f3ead7]">
                      {initials(row.fullName)}
                    </span>
                    <span>
                      <span className="block font-medium">{row.fullName}</span>
                      <span className="block text-xs text-[#7a7164]">{row.email}</span>
                    </span>
                  </div>
                </td>
                <td className="px-5 py-3 text-[#5c564c]">{row.phone}</td>
                <td className="px-5 py-3 text-[#5c564c]">{row.joined ? dateLabel(row.joined) : "—"}</td>
                <td className="px-5 py-3">
                  <span
                    className={`rounded px-2 py-0.5 text-[11px] font-medium capitalize ${
                      row.role === "admin" ? "bg-[#141a22] text-[#f3ead7]" : "bg-[#e7f3ee] text-[#1f5c45]"
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
      </AdminPanel>
    </>
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
  const match = value.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (!match) return "—";
  return `${match[3]}/${match[2]}/${match[1]}`;
}
