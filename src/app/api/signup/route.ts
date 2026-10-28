import { NextResponse } from "next/server";
import { createSession } from "@/lib/accounts";

const apiUrl = process.env.API_URL ?? "https://lotus-light-backend.vercel.app";

const countryCodes = new Set(["+91", "+1", "+44"]);

export async function POST(request: Request) {
  const payload = await readPayload(request);
  if (!payload) {
    return validationError("Please enter your full name.");
  }

  const fullName = payload.fullName.trim();
  const email = payload.email.trim().toLowerCase();
  const phoneCountryCode = payload.phoneCountryCode.trim();
  const phoneNumber = payload.phoneNumber.replace(/\D/g, "");
  const password = payload.password;

  if (!fullName) return validationError("Please enter your full name.");
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return validationError("Please enter a valid email address.");
  }
  if (!countryCodes.has(phoneCountryCode) || phoneNumber.length < 10) {
    return validationError("Please enter a valid phone number.");
  }
  if (password.length < 8) {
    return validationError("Use at least 8 characters for your password.");
  }
  if (!payload.termsAccepted) {
    return validationError("Please accept the Terms & Conditions.");
  }

  try {
    const upstream = await fetch(`${apiUrl}/api/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({
        fullName,
        email,
        phone: `${phoneCountryCode}${phoneNumber}`,
        password,
        termsAccepted: true,
      }),
    });
    const created = (await upstream.json()) as {
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

    if (!upstream.ok || !created.success || !created.user?.id) {
      return NextResponse.json(
        {
          success: false,
          error: upstream.status === 409 ? "Account Exists" : "Request Failed",
          message: created.message ?? "Unable to create your account.",
        },
        { status: upstream.status || 502 },
      );
    }

    const session = await createSession(created.user.id, {
      role: created.user.role,
      fullName: created.user.fullName ?? fullName,
      email: created.user.email ?? email,
      phone: created.user.phone ?? `${phoneCountryCode}${phoneNumber}`,
    });
    const response = NextResponse.json({
      success: true,
      message: created.message ?? "Account created.",
      token: session.token,
      user: {
        id: created.user.id,
        fullName: created.user.fullName ?? fullName,
        email: created.user.email ?? email,
        phone: created.user.phone ?? `${phoneCountryCode}${phoneNumber}`,
        role: created.user.role ?? "user",
      },
    });
    response.cookies.set("lotus_session", session.token, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      expires: session.expiresAt,
    });
    if (created.token) {
      response.cookies.set("lotus_jwt", created.token, {
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
        message: "Unable to create your account right now.",
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
      fullName: typeof record.fullName === "string" ? record.fullName : "",
      email: typeof record.email === "string" ? record.email : "",
      phoneCountryCode:
        typeof record.phoneCountryCode === "string" ? record.phoneCountryCode : "+91",
      phoneNumber: typeof record.phoneNumber === "string" ? record.phoneNumber : "",
      password: typeof record.password === "string" ? record.password : "",
      termsAccepted: record.termsAccepted === true,
    };
  } catch {
    return null;
  }
}

function validationError(message: string) {
  return NextResponse.json(
    { success: false, error: "Validation Error", message },
    { status: 400 },
  );
}
