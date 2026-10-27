import { forwardAdmin } from "@/lib/admin-backend";

type RouteContext = { params: Promise<{ orderId: string }> };

export async function POST(request: Request, context: RouteContext) {
  const { orderId } = await context.params;
  return forwardAdmin(`/api/admin/orders/${orderId}/refund`, "POST", await request.json().catch(() => ({})));
}
