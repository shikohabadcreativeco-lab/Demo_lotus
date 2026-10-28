import { NextResponse } from "next/server";
import { createSession } from "@/lib/accounts";

const apiUrl = process.env.API_URL ?? "https://lotus-light-backend.vercel.app";

export async function POST(request: Request) {
  const payload = await readPayload(request);
  if (!payload) {
    return validationError("Please enter your email address.");
  }

  const email = payload.email.trim();
  const password = payload.password;
  const loginPath = payload.admin ? "/api/admin/login" : "/api/auth/login";

  if (!email) return validationError("Please enter your email address.");
  if (!password) return validationError("Please enter your password.");

  try {
    const upstream = await fetch(`${apiUrl}${loginPath}`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const signedIn = (await upstream.json()) as {
      success?: boolean;
      message?: string;
      token?: string;
      user?: {
        id?: string;
        fullName?: string;
        email?: string;
        phone?: string;
        role?: string;
      };
    };

    if (!upstream.ok || !signedIn.success || !signedIn.user?.id) {
      return NextResponse.json(
        {
          success: false,
          error: upstream.status === 401 ? "Authentication Failed" : "Request Failed",
          message: signedIn.message ?? "Unable to sign in.",
        },
        { status: upstream.status || 502 },
      );
    }

    const session = await createSession(signedIn.user.id, {
      role: signedIn.user.role,
      fullName: signedIn.user.fullName,
      email: signedIn.user.email ?? email,
      phone: signedIn.user.phone,
    });
    const response = NextResponse.json({
      success: true,
      message: signedIn.message ?? "Login successful! Authentication verified.",
      token: session.token,
      user: signedIn.user,
    });
    response.cookies.set("lotus_session", session.token, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      expires: session.expiresAt,
    });
    if (signedIn.token) {
      response.cookies.set("lotus_jwt", signedIn.token, {
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
        path: "/",
        expires: session.expiresAt,
      });
    }
    return response;
  } catch {
    return NextResponse.json(
      {
        success: false,
        error: "Server Error",
        message: "Unable to sign in right now. Check that MongoDB is running.",
      },
      { status: 503 },
    );
  }
}

async function readPayload(request: Request) {
  try {
    const body: unknown = await request.json();
    if (!body || typeof body !== "object") return null;
    const record = body as Record<string, unknown>;
    return {
      email: typeof record.email === "string" ? record.email : "",
      password: typeof record.password === "string" ? record.password : "",
      admin: record.admin === true,
    };
  } catch {
    return null;
  }
}

function validationError(message: string) {
  return NextResponse.json(
    {
      success: false,
      error: "Validation Error",
      message,
    },
    { status: 400 },
  );
}
