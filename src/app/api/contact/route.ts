import { NextResponse } from "next/server";
import { apiUrl } from "@/lib/admin-backend";

export async function POST(request: Request) {
  const body = await readJson(request);
  if (!body) return NextResponse.json({ success: false, message: "Enter your message." }, { status: 400 });

  try {
    const response = await fetch(`${apiUrl}/api/contact`, {
      method: "POST",
      headers: { Accept: "application/json", "Content-Type": "application/json" },
      body: JSON.stringify(body),
      cache: "no-store",
    });
    const payload = (await response.json().catch(() => null)) as { success?: boolean; message?: string } | null;
    return NextResponse.json(payload ?? { success: false, message: "Unable to send this message." }, {
      status: response.status,
    });
  } catch {
    return NextResponse.json({ success: false, message: "Unable to send this message." }, { status: 503 });
  }
}

async function readJson(request: Request) {
  try {
    const body: unknown = await request.json();
    return body && typeof body === "object" ? body : null;
  } catch {
    return null;
  }
}
