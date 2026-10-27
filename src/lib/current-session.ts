import { ObjectId } from "mongodb";
import { cookies } from "next/headers";
import { findSession } from "@/lib/accounts";

export async function currentAccount() {
  const cookieStore = await cookies();
  const token = cookieStore.get("lotus_session")?.value;
  if (!token) return null;
  const session = await findSession(token);
  if (!session) return null;

  const userId = session.userId instanceof ObjectId ? session.userId.toHexString() : String(session.userId ?? "");

  return {
    userId,
    role: session.role === "admin" ? "admin" : "user",
    fullName: typeof session.fullName === "string" ? session.fullName : "",
    email: typeof session.email === "string" ? session.email : "",
    phone: typeof session.phone === "string" ? session.phone : "",
  };
}

export async function hasSignedInSession() {
  return Boolean(await currentAccount());
}
