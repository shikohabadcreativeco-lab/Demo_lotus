import { forwardAdmin } from "@/lib/admin-backend";

type RouteContext = { params: Promise<{ orderId: string }> };

export async function PATCH(request: Request, context: RouteContext) {
  const { orderId } = await context.params;
  return forwardAdmin(`/api/admin/orders/${orderId}/payment`, "PATCH", await request.json().catch(() => ({})));
}
