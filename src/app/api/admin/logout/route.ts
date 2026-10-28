import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { deleteSession } from "@/lib/accounts";

const apiUrl = process.env.API_URL ?? "https://lotus-light-backend.vercel.app";

const clearedCookie = {
  httpOnly: true,
  sameSite: "lax" as const,
  secure: process.env.NODE_ENV === "production",
  path: "/",
  maxAge: 0,
};

export async function POST() {
  const jar = await cookies();
  const sessionToken = jar.get("lotus_session")?.value;
  const jwt = jar.get("lotus_jwt")?.value;

  if (jwt) {
    try {
      await fetch(`${apiUrl}/api/admin/logout`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${jwt}`,
        },
        body: "{}",
      });
    } catch {
      // The browser session is still cleared below so sign-out can finish.
    }
  }

  if (sessionToken) await deleteSession(sessionToken);

  const response = NextResponse.json({
    success: true,
    message: "Logged out successfully",
  });
  response.cookies.set("lotus_session", "", clearedCookie);
  response.cookies.set("lotus_jwt", "", clearedCookie);
  return response;
}
