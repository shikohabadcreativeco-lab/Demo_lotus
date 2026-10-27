import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { apiUrl } from "@/lib/admin-backend";
import { currentAccount } from "@/lib/current-session";
import { recordOrder, type StoredOrderItem } from "@/lib/customer-records";

export async function POST(request: Request) {
  const account = await currentAccount();
  if (!account) return NextResponse.json({ success: false, message: "Sign in to place an order." }, { status: 401 });

  const body = await readBody(request);
  if (!body) return NextResponse.json({ success: false, message: "The order is incomplete." }, { status: 400 });

  const address = objectOf(body.address);
  const saved = await recordOrder(account.userId, {
    number: text(body.number),
    items: Array.isArray(body.items) ? body.items.filter(isItem) : [],
    subtotal: numberOf(body.subtotal),
    shipping: numberOf(body.shipping),
    total: numberOf(body.total),
    payment: text(body.payment),
    address: {
      fullName: text(address.fullName),
      phone: text(address.phone),
      line: text(address.line),
      city: text(address.city),
      state: text(address.state),
      pin: text(address.pin),
    },
  });
  if ("error" in saved && saved.error) {
    return NextResponse.json({ success: false, message: saved.error }, { status: 400 });
  }

  const token = (await cookies()).get("lotus_jwt")?.value;
  if (token && "order" in saved && saved.order) {
    const order = saved.order;
    await fetch(`${apiUrl}/api/orders`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        orderNumber: order.number,
        customer: {
          fullName: account.fullName,
          email: account.email,
          phone: account.phone,
        },
        items: order.items,
        address: order.address,
        subtotal: order.subtotal,
        shipping: order.shipping,
        total: order.total,
        paymentMethod: order.payment,
      }),
      cache: "no-store",
    }).catch(() => undefined);
  }

  return NextResponse.json({ success: true });
}

function isItem(value: unknown): value is StoredOrderItem {
  if (!value || typeof value !== "object") return false;
  const item = value as StoredOrderItem;
  return typeof item.name === "string" && typeof item.price === "number" && typeof item.quantity === "number";
}

async function readBody(request: Request) {
  try {
    const body: unknown = await request.json();
    if (!body || typeof body !== "object") return null;
    return body as Record<string, unknown>;
  } catch {
    return null;
  }
}

function objectOf(value: unknown) {
  return value && typeof value === "object" ? (value as Record<string, unknown>) : {};
}

function text(value: unknown) {
  return typeof value === "string" ? value : "";
}

function numberOf(value: unknown) {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}
