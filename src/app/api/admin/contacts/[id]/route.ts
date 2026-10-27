import { forwardAdmin } from "@/lib/admin-backend";

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(_request: Request, context: RouteContext) {
  const { id } = await context.params;
  return forwardAdmin(`/api/admin/contacts/${encodeURIComponent(id)}`, "GET");
}

export async function PATCH(request: Request, context: RouteContext) {
  const { id } = await context.params;
  return forwardAdmin(`/api/admin/contacts/${encodeURIComponent(id)}`, "PATCH", await readJson(request));
}

export async function DELETE(_request: Request, context: RouteContext) {
  const { id } = await context.params;
  return forwardAdmin(`/api/admin/contacts/${encodeURIComponent(id)}`, "DELETE");
}

async function readJson(request: Request) {
  try {
    return await request.json();
  } catch {
    return {};
  }
}
