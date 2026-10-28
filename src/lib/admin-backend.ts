import { cookies } from "next/headers";
import { NextResponse } from "next/server";

const apiUrl = process.env.API_URL ?? "https://lotus-light-backend.vercel.app";

export async function forwardAdmin(path: string, method: string, body?: unknown) {
  const token = (await cookies()).get("lotus_jwt")?.value;
  if (!token) {
    return NextResponse.json(
      { success: false, message: "Sign in again as an admin." },
      { status: 401 },
    );
  }

  try {
    const response = await fetch(`${apiUrl}${path}`, {
      method,
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
        ...(body === undefined ? {} : { "Content-Type": "application/json" }),
      },
      body: body === undefined ? undefined : JSON.stringify(body),
      cache: "no-store",
    });
    const payload = (await response.json()) as { message?: string; success?: boolean };
    return NextResponse.json(payload, { status: response.status });
  } catch {
    return NextResponse.json(
      { success: false, message: "Catalog API is not running." },
      { status: 503 },
    );
  }
}

export async function adminToken() {
  return (await cookies()).get("lotus_jwt")?.value ?? "";
}

export { apiUrl };
