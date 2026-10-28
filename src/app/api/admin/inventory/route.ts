import { forwardAdmin } from "@/lib/admin-backend";

export async function GET() {
  return forwardAdmin("/api/inventory", "GET");
}

export async function POST(request: Request) {
  return forwardAdmin("/api/inventory", "POST", await readJson(request));
}

async function readJson(request: Request) {
  try {
    return await request.json();
  } catch {
    return {};
  }
}
