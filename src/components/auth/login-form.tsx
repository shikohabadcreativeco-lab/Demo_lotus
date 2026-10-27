"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";
import { GoldButton, PasswordField, SocialAuth, TextField } from "@/components/auth/auth-fields";

export function LoginForm({ nextPath = "/" }: { nextPath?: string }) {
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    setPending(true);
    setError("");

    try {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          email: String(data.get("email") ?? ""),
          password: String(data.get("password") ?? ""),
          admin: nextPath.startsWith("/admin"),
        }),
      });
      const body = (await response.json()) as {
        success?: boolean;
        message?: string;
        user?: { role?: string };
      };

      if (!response.ok || !body.success) {
        setError(body.message ?? "Unable to sign in.");
        return;
      }

      const destination = body.user?.role === "admin" && nextPath === "/" ? "/admin" : nextPath;
      window.location.assign(destination);
    } catch {
      setError("Unable to sign in right now.");
    } finally {
      setPending(false);
    }
  }

  const admin = nextPath.startsWith("/admin");

  return (
    <form className="flex flex-col gap-5" onSubmit={onSubmit}>
      <div>
        <h1 className="text-3xl font-semibold tracking-tight text-neutral-950">
          {admin ? "Admin Panel" : "Welcome Back"}
        </h1>
        <p className="mt-2 text-sm text-neutral-500">
          {admin
            ? "Staff sign-in for managing the Lotus Lights store."
            : "Sign in to your Lotus Lights account to continue"}
        </p>
        {error ? (
          <p className="mt-3 text-sm text-red-600" role="alert">
            {error}
          </p>
        ) : null}
      </div>
      <TextField
        label={admin ? "Admin email" : "Email or Phone Number"}
        name="email"
        type={admin ? "email" : "text"}
        placeholder={admin ? "Enter your admin email" : "Enter your email or phone number"}
        autoComplete="username"
      />
      <PasswordField
        label="Password"
        name="password"
        placeholder="Enter your password"
        autoComplete="current-password"
      />
      {admin ? (
        <div className="flex justify-end text-sm">
          <Link href="/forgot-password" className="font-medium text-[#1a6d78] hover:text-[#172033]">
            Forgot password?
          </Link>
        </div>
      ) : (
        <div className="flex items-center justify-between gap-3 text-sm">
          <label className="flex items-center gap-2 text-neutral-700">
            <input
              type="checkbox"
              name="remember"
              className="size-4 accent-[#c6a15a]"
            />
            Remember me
          </label>
          <Link href="/forgot-password" className="font-medium text-[#c6a15a]">
            Forgot password?
          </Link>
        </div>
      )}
      {admin ? (
        <button
          type="submit"
          disabled={pending}
          className="h-12 w-full rounded-lg bg-[#172033] text-sm font-semibold text-[#b7f3ea] transition-colors hover:bg-[#24344a] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {pending ? "Signing in..." : "Sign in to Admin Panel"}
        </button>
      ) : (
        <GoldButton disabled={pending}>{pending ? "Signing in..." : "Sign In"}</GoldButton>
      )}
      {admin ? null : <SocialAuth />}
      {admin ? null : (
        <p className="text-center text-sm text-neutral-500">
          Don&apos;t have an account?{" "}
          <Link
            href={nextPath === "/" ? "/signup" : `/signup?next=${encodeURIComponent(nextPath)}`}
            className="font-semibold text-[#c6a15a]"
          >
            Sign Up
          </Link>
        </p>
      )}
    </form>
  );
}
