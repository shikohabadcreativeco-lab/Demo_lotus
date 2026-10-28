import { cookies } from "next/headers";
import { apiUrl } from "@/lib/admin-backend";

export type ContactCounts = { all: number; new: number; in_progress: number; resolved: number };

const empty: ContactCounts = { all: 0, new: 0, in_progress: 0, resolved: 0 };

export async function loadContactCounts(): Promise<ContactCounts> {
  const token = (await cookies()).get("lotus_jwt")?.value ?? "";
  if (!token) return empty;
  try {
    const response = await fetch(`${apiUrl}/api/admin/contacts?page=1&limit=1`, {
      headers: { Accept: "application/json", Authorization: `Bearer ${token}` },
      cache: "no-store",
    });
    const body = (await response.json()) as { counts?: ContactCounts };
    return body.counts ?? empty;
  } catch {
    return empty;
  }
}
