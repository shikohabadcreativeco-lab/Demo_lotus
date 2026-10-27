import { NextResponse } from "next/server";
import { adminToken, apiUrl } from "@/lib/admin-backend";
import { currentAccount } from "@/lib/current-session";

type RouteContext = { params: Promise<{ id: string }> };

export async function PUT(request: Request, context: RouteContext) {
  const account = await currentAccount();
  if (!account || account.role !== "admin") {
    return NextResponse.json({ message: "Only an admin can update products." }, { status: 401 });
  }

  const token = await adminToken();
  if (!token) {
    return NextResponse.json({ message: "Sign in again as an admin." }, { status: 401 });
  }

  const { id } = await context.params;
  const body = await request.json().catch(() => null);
  if (!body || typeof body !== "object") {
    return NextResponse.json({ message: "Could not read the product." }, { status: 400 });
  }

  const record = body as Record<string, unknown>;
  const selling = numberValue(record.price);
  const compareAt = record.compareAt === null || record.compareAt === "" ? null : numberValue(record.compareAt);
  if (selling === null) {
    return NextResponse.json({ message: "Enter a price in rupees." }, { status: 400 });
  }

  let price = selling;
  let discountPrice: number | null = null;
  if (compareAt !== null) {
    if (compareAt <= selling) {
      return NextResponse.json(
        { message: "Compare-at price must be higher than the selling price." },
        { status: 400 },
      );
    }
    price = compareAt;
    discountPrice = selling;
  }

  try {
    const response = await fetch(`${apiUrl}/api/products/${id}`, {
      method: "PUT",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        name: record.name,
        description: record.description,
        brand: record.brand,
        category: record.category,
        stock: record.stock,
        isActive: record.isActive,
        price,
        discountPrice,
      }),
      cache: "no-store",
    });
    const payload = (await response.json()) as { message?: string };
    return NextResponse.json(
      { success: response.ok, message: payload.message },
      { status: response.status },
    );
  } catch {
    return NextResponse.json({ message: "Catalog API is not running." }, { status: 503 });
  }
}

export async function DELETE(_request: Request, context: RouteContext) {
  const account = await currentAccount();
  if (!account || account.role !== "admin") {
    return NextResponse.json({ message: "Only an admin can deactivate products." }, { status: 401 });
  }

  const token = await adminToken();
  if (!token) {
    return NextResponse.json({ message: "Sign in again as an admin." }, { status: 401 });
  }

  const { id } = await context.params;
  try {
    const response = await fetch(`${apiUrl}/api/products/${id}`, {
      method: "DELETE",
      headers: { Accept: "application/json", Authorization: `Bearer ${token}` },
      cache: "no-store",
    });
    const payload = (await response.json()) as { message?: string };
    return NextResponse.json(
      { success: response.ok, message: payload.message },
      { status: response.status },
    );
  } catch {
    return NextResponse.json({ message: "Catalog API is not running." }, { status: 503 });
  }
}

function numberValue(value: unknown) {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string" && /^\d+$/.test(value)) return Number(value);
  return null;
}
