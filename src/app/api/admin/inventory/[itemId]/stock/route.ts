import { forwardAdmin } from "@/lib/admin-backend";

type RouteContext = { params: Promise<{ itemId: string }> };

export async function PATCH(request: Request, context: RouteContext) {
  const { itemId } = await context.params;
  return forwardAdmin(`/api/inventory/${itemId}/stock`, "PATCH", await readJson(request));
}

async function readJson(request: Request) {
  try {
    return await request.json();
  } catch {
    return {};
  }
}
