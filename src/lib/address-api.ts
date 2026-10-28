import { cookies } from "next/headers";
import type { SavedAddress } from "@/lib/customer-records";

const apiUrl = process.env.API_URL ?? "https://lotus-light-backend.vercel.app";

export type AddressInput = {
  fullName: string;
  phone: string;
  addressLine1: string;
  addressLine2: string;
  landmark: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
  addressType: string;
};

type AddressRecord = {
  id?: string;
  fullName?: string;
  phone?: string;
  addressLine1?: string;
  addressLine2?: string;
  landmark?: string;
  city?: string;
  state?: string;
  pincode?: string;
  country?: string;
  addressType?: string;
  isDefault?: boolean;
};

export async function listUserAddresses(): Promise<SavedAddress[]> {
  const result = await addressRequest("/api/addresses");
  if (!result.ok || !Array.isArray(result.data)) return [];
  return result.data.map(toSavedAddress).filter((address) => address.id);
}

export async function addressRequest(path: string, init: RequestInit = {}) {
  const token = (await cookies()).get("lotus_jwt")?.value ?? "";
  if (!token) return { ok: false, status: 401, message: "Sign in to save an address.", data: null };

  try {
    const response = await fetch(`${apiUrl}${path}`, {
      ...init,
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
        ...(init.body ? { "Content-Type": "application/json" } : {}),
      },
      cache: "no-store",
    });
    const body = (await response.json().catch(() => null)) as { success?: boolean; message?: string; data?: unknown } | null;
    return {
      ok: response.ok && body?.success !== false,
      status: response.status,
      message: body?.message || "",
      data: body?.data ?? null,
    };
  } catch {
    return { ok: false, status: 502, message: "Address service is unavailable.", data: null };
  }
}

export function toSavedAddress(record: unknown): SavedAddress {
  const item = (record && typeof record === "object" ? record : {}) as AddressRecord;
  const addressType = item.addressType === "work" || item.addressType === "other" ? item.addressType : "home";
  return {
    id: item.id || "",
    userId: "",
    label: addressType === "work" ? "Work" : addressType === "other" ? "Other" : "Home",
    addressType,
    fullName: item.fullName || "",
    phone: item.phone || "",
    line: item.addressLine1 || "",
    line2: item.addressLine2 || "",
    city: item.city || "",
    state: item.state || "",
    pin: item.pincode || "",
    country: item.country || "India",
    instructions: item.landmark || "",
    isDefault: Boolean(item.isDefault),
  };
}
