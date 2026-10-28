import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { apiUrl } from "@/lib/admin-backend";

export async function GET(request: Request) {
  const query = new URL(request.url).search;
  try {
    const response = await fetch(`${apiUrl}/api/reviews${query}`, {
      headers: { Accept: "application/json" },
      cache: "no-store",
    });
    return NextResponse.json(await response.json(), { status: response.status });
  } catch {
    return NextResponse.json({ success: false, message: "Review API is not running." }, { status: 503 });
  }
}

export async function POST(request: Request) {
  const token = (await cookies()).get("lotus_jwt")?.value;
  if (!token) {
    return NextResponse.json({ success: false, message: "Sign in to write a review." }, { status: 401 });
  }

  try {
    const response = await fetch(`${apiUrl}/api/reviews`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(await request.json().catch(() => ({}))),
      cache: "no-store",
    });
    return NextResponse.json(await response.json(), { status: response.status });
  } catch {
    return NextResponse.json({ success: false, message: "Review API is not running." }, { status: 503 });
  }
}
