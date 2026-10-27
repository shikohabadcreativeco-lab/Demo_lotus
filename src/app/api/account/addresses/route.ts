import { NextResponse } from "next/server";
import { addressRequest } from "@/lib/address-api";
import { currentAccount } from "@/lib/current-session";

export async function POST(request: Request) {
  const account = await currentAccount();
  if (!account) return NextResponse.json({ success: false, message: "Sign in to save an address." }, { status: 401 });

  const body = await readBody(request);
  if (!body) return NextResponse.json({ success: false, message: "Enter the address." }, { status: 400 });

  const id = text(body.id);

  if (body.action === "default") {
    if (!id) return NextResponse.json({ success: false, message: "Choose an address." }, { status: 400 });
    const updated = await addressRequest(`/api/addresses/${encodeURIComponent(id)}/default`, { method: "PATCH" });
    return NextResponse.json(
      { success: updated.ok, message: updated.message || (updated.ok ? "" : "Unable to set the default address.") },
      { status: updated.ok ? 200 : updated.status },
    );
  }

  if (body.action === "instructions") {
    if (!id) return NextResponse.json({ success: false, message: "Choose an address." }, { status: 400 });
    const updated = await addressRequest(`/api/addresses/${encodeURIComponent(id)}`, {
      method: "PATCH",
      body: JSON.stringify({ landmark: text(body.instructions) }),
    });
    return NextResponse.json(
      { success: updated.ok, message: updated.message || (updated.ok ? "" : "Unable to save the landmark.") },
      { status: updated.ok ? 200 : updated.status },
    );
  }

  const payload = {
    fullName: text(body.fullName),
    phone: text(body.phone),
    addressLine1: text(body.line),
    addressLine2: text(body.line2),
    landmark: text(body.instructions),
    city: text(body.city),
    state: text(body.state),
    pincode: text(body.pin),
    country: text(body.country) || "India",
    addressType: text(body.addressType) || text(body.label),
  };

  const saved = id
    ? await addressRequest(`/api/addresses/${encodeURIComponent(id)}`, {
        method: "PATCH",
        body: JSON.stringify(payload),
      })
    : await addressRequest("/api/addresses", {
        method: "POST",
        body: JSON.stringify(payload),
      });

  if (!saved.ok) {
    return NextResponse.json(
      { success: false, message: saved.message || "Unable to save this address." },
      { status: saved.status || 400 },
    );
  }

  const created = saved.data && typeof saved.data === "object" && "id" in saved.data ? String(saved.data.id) : id;
  if (body.isDefault === true && created) {
    await addressRequest(`/api/addresses/${encodeURIComponent(created)}/default`, { method: "PATCH" });
  }

  return NextResponse.json({ success: true, address: saved.data });
}

export async function DELETE(request: Request) {
  const account = await currentAccount();
  if (!account) return NextResponse.json({ success: false, message: "Sign in to update addresses." }, { status: 401 });
  const id = new URL(request.url).searchParams.get("id") ?? "";
  if (!id) return NextResponse.json({ success: false, message: "Choose an address." }, { status: 400 });

  const removed = await addressRequest(`/api/addresses/${encodeURIComponent(id)}`, { method: "DELETE" });
  return NextResponse.json(
    { success: removed.ok, message: removed.message || (removed.ok ? "" : "Unable to remove this address.") },
    { status: removed.ok ? 200 : removed.status },
  );
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

function text(value: unknown) {
  return typeof value === "string" ? value : "";
}
