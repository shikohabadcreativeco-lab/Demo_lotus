import { cookies } from "next/headers";
import { MongoClient } from "mongodb";
import { apiUrl } from "@/lib/admin-backend";
import { listAllOrders } from "@/lib/customer-records";

export type AdminOrder = {
  id: string;
  orderNumber: string;
  customer: { fullName: string; email: string; phone: string };
  items: Array<{ name: string; quantity: number; price: number; watt?: string; lightColor?: string }>;
  address: { fullName: string; phone: string; line: string; city: string; state: string; pin: string };
  subtotal: number;
  shipping: number;
  discount: number;
  total: number;
  paymentMethod: string;
  orderStatus: string;
  paymentStatus: string;
  courier: string;
  trackingNumber: string;
  refund: { status: string; reason: string; initiatedAt: string | null };
  createdAt: string;
  updatedAt: string;
};

export type OrderStats = {
  totalOrders: number;
  revenue: number;
  byOrderStatus: Record<string, number>;
  byPaymentStatus: Record<string, number>;
};

const backendDbUrl = process.env.BACKEND_MONGO_URI ?? "mongodb://127.0.0.1:27017/lotus_light";

export async function loadAdminOrders() {
  const token = (await cookies()).get("lotus_jwt")?.value ?? "";
  if (!token) return { orders: [] as AdminOrder[], stats: emptyStats(), error: "Sign in again as an admin." };

  await copyStoreOrders();

  try {
    const headers = { Accept: "application/json", Authorization: `Bearer ${token}` };
    const [ordersResponse, statsResponse] = await Promise.all([
      fetch(`${apiUrl}/api/admin/orders`, { headers, cache: "no-store" }),
      fetch(`${apiUrl}/api/admin/orders/stats`, { headers, cache: "no-store" }),
    ]);
    const ordersPayload = (await ordersResponse.json()) as { data?: AdminOrder[]; message?: string };
    const statsPayload = (await statsResponse.json()) as { data?: OrderStats; message?: string };
    if (!ordersResponse.ok) {
      return { orders: [] as AdminOrder[], stats: emptyStats(), error: ordersPayload.message ?? "Could not load orders." };
    }
    return {
      orders: ordersPayload.data ?? [],
      stats: statsPayload.data ?? emptyStats(),
      error: "",
    };
  } catch {
    return { orders: [] as AdminOrder[], stats: emptyStats(), error: "Order API is not running." };
  }
}

async function copyStoreOrders() {
  let client: MongoClient | undefined;
  try {
    const localOrders = await listAllOrders();
    if (localOrders.length === 0) return;
    client = new MongoClient(backendDbUrl, { serverSelectionTimeoutMS: 800 });
    await client.connect();
    const orders = client.db().collection("orders");
    const now = new Date();
    for (const order of localOrders) {
      await orders.updateOne(
        { orderNumber: order.number },
        {
          $setOnInsert: {
            orderNumber: order.number,
            userId: order.userId,
            customer: {
              fullName: order.address.fullName,
              email: "",
              phone: order.address.phone,
            },
            items: order.items.map((item) => ({
              name: item.name,
              quantity: item.quantity,
              price: item.price,
              image: item.image,
              slug: item.slug,
              ...(item.watt ? { watt: item.watt } : {}),
              ...(item.lightColor ? { lightColor: item.lightColor } : {}),
            })),
            address: order.address,
            subtotal: order.subtotal,
            shipping: order.shipping,
            discount: 0,
            total: order.total,
            paymentMethod: order.payment,
            orderStatus: "pending",
            paymentStatus: "pending",
            courier: "",
            trackingNumber: "",
            refund: { status: "none", reason: "", initiatedAt: null },
            createdAt: new Date(order.placedAt),
            updatedAt: now,
          },
        },
        { upsert: true },
      );
    }
  } catch {
    return;
  } finally {
    await client?.close();
  }
}

function emptyStats(): OrderStats {
  return { totalOrders: 0, revenue: 0, byOrderStatus: {}, byPaymentStatus: {} };
}
