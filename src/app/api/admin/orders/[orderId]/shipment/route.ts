import { forwardAdmin } from "@/lib/admin-backend";

type RouteContext = { params: Promise<{ orderId: string }> };

export async function PUT(request: Request, context: RouteContext) {
  const { orderId } = await context.params;
  return forwardAdmin(
    `/api/admin/orders/${encodeURIComponent(orderId)}/shipment`,
    "PUT",
    await request.json().catch(() => ({})),
  );
}
