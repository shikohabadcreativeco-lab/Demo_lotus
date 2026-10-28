import Link from "next/link";
import { AdminPageHeader } from "@/components/admin/admin-shell";
import { AdminEmpty, AdminPanel, AdminStat, AdminStatus, adminGhost, adminPrimary } from "@/components/admin/admin-ui";
import { loadContactCounts } from "@/lib/admin-contacts";
import { loadAdminOrders } from "@/lib/admin-orders";
import { inventoryRows } from "@/lib/admin-samples";
import { listAccounts } from "@/lib/accounts";
import { listProducts } from "@/lib/catalog";
import { formatPrice } from "@/lib/products";

export async function DashboardContent() {
  const [products, ordersPack, accounts, messages] = await Promise.all([
    listProducts(),
    loadAdminOrders(),
    listAccounts(),
    loadContactCounts(),
  ]);

  const orders = ordersPack.orders;
  const stock = inventoryRows(products);
  const low = stock.filter((row) => row.stock > 0 && row.stock <= 5);
  const out = stock.filter((row) => row.stock === 0);
  const open = orders.filter((order) => order.orderStatus !== "delivered" && order.orderStatus !== "cancelled");
  const shoppers = accounts.filter((account) => account.role !== "admin").length;
  const recent = orders.slice(0, 7);
  const alerts = [
    ...out.map((row) => ({ href: "/admin/inventory", title: row.name, detail: "Out of stock", kind: "Stock" })),
    ...low.map((row) => ({ href: "/admin/inventory", title: row.name, detail: `${row.stock} left`, kind: "Stock" })),
    ...open.slice(0, 5).map((order) => ({
      href: "/admin/orders",
      title: order.orderNumber,
      detail: `${order.orderStatus} · ${formatPrice(order.total)}`,
      kind: "Order",
    })),
    ...(messages.new > 0
      ? [{ href: "/admin/contacts", title: `${messages.new} new enquir${messages.new === 1 ? "y" : "ies"}`, detail: "Contact inbox", kind: "Inbox" }]
      : []),
  ].slice(0, 7);

  return (
    <>
      <AdminPageHeader
        title="Dashboard"
        detail="Live sales, stock, and studio work."
        action={
          <div className="flex gap-2">
            <Link href="/admin/orders" className={adminGhost}>
              Orders
            </Link>
            <Link href="/admin/products/new" className={adminPrimary}>
              Add product
            </Link>
          </div>
        }
      />

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <AdminStat
          featured
          href="/admin/orders"
          label="Paid revenue"
          value={formatPrice(ordersPack.stats.revenue)}
          hint={`${ordersPack.stats.totalOrders} paid and unpaid orders`}
        />
        <AdminStat href="/admin/orders" label="Open orders" value={String(open.length)} hint="Awaiting delivery" />
        <AdminStat
          href="/admin/inventory"
          label="Catalog"
          value={String(products.length)}
          hint={`${out.length} out · ${low.length} low`}
        />
        <AdminStat
          href="/admin/contacts"
          label="Inbox"
          value={String(messages.new)}
          hint={`${shoppers} customers`}
        />
      </div>

      <div className="mt-5 grid gap-4 xl:grid-cols-[minmax(0,1.55fr)_minmax(19rem,0.85fr)]">
        <AdminPanel
          title="Orders"
          detail="Newest checkouts."
          action={
            <Link href="/admin/orders" className="text-xs font-medium tracking-wide text-[#1a6d78] uppercase">
              View all
            </Link>
          }
        >
          {recent.length === 0 ? (
            <AdminEmpty>No orders yet.</AdminEmpty>
          ) : (
            <table className="w-full text-left text-sm">
              <thead className="border-b border-[#eee6d8] text-[10px] font-medium tracking-[0.14em] text-[#8a8172] uppercase">
                <tr>
                  <th className="px-5 py-2.5 font-medium">Order</th>
                  <th className="px-5 py-2.5 font-medium">Customer</th>
                  <th className="px-5 py-2.5 font-medium">Total</th>
                  <th className="px-5 py-2.5 font-medium">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#f0eadf]">
                {recent.map((order) => (
                  <tr key={order.id} className="hover:bg-[#f3eee4]">
                    <td className="px-5 py-3">
                      <Link href="/admin/orders" className="font-medium">
                        {order.orderNumber}
                      </Link>
                      <p className="mt-0.5 text-xs text-[#7a7164]">{dateLabel(order.createdAt)}</p>
                    </td>
                    <td className="px-5 py-3 text-[#3d3932]">
                      {order.customer.fullName || order.address.fullName}
                    </td>
                    <td className="px-5 py-3 font-medium">{formatPrice(order.total)}</td>
                    <td className="px-5 py-3">
                      <AdminStatus value={order.orderStatus} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </AdminPanel>

        <AdminPanel title="Queue" detail="Work still open.">
          {alerts.length === 0 ? (
            <AdminEmpty>Queue is clear.</AdminEmpty>
          ) : (
            <ul className="divide-y divide-[#f0eadf]">
              {alerts.map((alert) => (
                <li key={`${alert.kind}-${alert.title}`}>
                  <Link href={alert.href} className="flex items-center justify-between gap-3 px-5 py-3 hover:bg-[#f3eee4]">
                    <span>
                      <span className="block text-[10px] tracking-[0.14em] text-[#c6a15a] uppercase">{alert.kind}</span>
                      <span className="mt-0.5 block text-sm font-medium">{alert.title}</span>
                    </span>
                    <span className="text-xs capitalize text-[#7a7164]">{alert.detail}</span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </AdminPanel>
      </div>
    </>
  );
}

function dateLabel(value: string) {
  const match = value.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (!match) return "—";
  return `${match[3]} / ${match[2]} / ${match[1]}`;
}
