import { Suspense } from "react";
import { AdminPageHeader } from "@/components/admin/admin-shell";
import { OrderManager } from "@/components/admin/order-manager";
import { loadAdminOrders } from "@/lib/admin-orders";

export default function AdminOrdersPage() {
  return (
    <Suspense fallback={<div className="min-h-40" />}>
      <OrdersContent />
    </Suspense>
  );
}

async function OrdersContent() {
  const loaded = await loadAdminOrders();
  const orders = loaded.orders;
  const stats = loaded.stats;

  return (
    <>
      <AdminPageHeader
        title="Orders"
        detail="Update status, payment, shipping, and refunds."
      />
      {loaded.error ? <p className="mb-4 text-sm text-[#8a3030]">{loaded.error}</p> : null}
      <OrderManager
        key={orders.map((order) => `${order.id}:${order.updatedAt}`).join("|") || "empty"}
        orders={orders}
        stats={stats}
      />
    </>
  );
}
