import { forwardAdmin } from "@/lib/admin-backend";

type RouteContext = { params: Promise<{ itemId: string }> };

export async function PUT(request: Request, context: RouteContext) {
  const { itemId } = await context.params;
  return forwardAdmin(`/api/inventory/${itemId}`, "PUT", await readJson(request));
}

export async function DELETE(_request: Request, context: RouteContext) {
  const { itemId } = await context.params;
  return forwardAdmin(`/api/inventory/${itemId}`, "DELETE");
}

async function readJson(request: Request) {
  try {
    return await request.json();
  } catch {
    return {};
  }
}
