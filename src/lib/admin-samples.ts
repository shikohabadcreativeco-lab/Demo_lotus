import type { AdminOrder, OrderStats } from "@/lib/admin-orders";

export type InventoryRow = {
  id: string;
  name: string;
  category: string;
  stock: number;
  sample: boolean;
};

export function inventoryRows(
  products: Array<{ slug: string; name: string; categorySlug: string; categoryName?: string; stock?: number }>,
): InventoryRow[] {
  return products.map((product) => ({
    id: product.slug,
    name: product.name,
    category: product.categoryName || label(product.categorySlug),
    stock: typeof product.stock === "number" ? product.stock : 0,
    sample: false,
  }));
}

export function statsForOrders(orders: AdminOrder[]): OrderStats {
  const byOrderStatus: Record<string, number> = {};
  const byPaymentStatus: Record<string, number> = {};
  let revenue = 0;
  for (const order of orders) {
    byOrderStatus[order.orderStatus] = (byOrderStatus[order.orderStatus] ?? 0) + 1;
    byPaymentStatus[order.paymentStatus] = (byPaymentStatus[order.paymentStatus] ?? 0) + 1;
    if (order.paymentStatus === "paid") revenue += order.total;
  }
  return { totalOrders: orders.length, revenue, byOrderStatus, byPaymentStatus };
}

function label(slug: string) {
  return slug
    .split("-")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}
