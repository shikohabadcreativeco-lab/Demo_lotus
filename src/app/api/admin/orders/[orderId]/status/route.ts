import { forwardAdmin } from "@/lib/admin-backend";

type RouteContext = { params: Promise<{ orderId: string }> };

export async function PATCH(request: Request, context: RouteContext) {
  const { orderId } = await context.params;
  return forwardAdmin(`/api/admin/orders/${orderId}/status`, "PATCH", await readJson(request));
}

async function readJson(request: Request) {
  try {
    return await request.json();
  } catch {
    return {};
  }
}
