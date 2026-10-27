import { forwardAdmin } from "@/lib/admin-backend";

export async function GET() {
  return forwardAdmin("/api/admin/orders", "GET");
}
