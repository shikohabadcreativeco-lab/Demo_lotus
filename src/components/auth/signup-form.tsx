"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";
import { GoldButton, PasswordField, SocialAuth, TextField } from "@/components/auth/auth-fields";

export function SignupForm({ nextPath = "/" }: { nextPath?: string }) {
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    setPending(true);
    setError("");

    try {
      const response = await fetch("/api/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          fullName: String(data.get("name") ?? ""),
          email: String(data.get("email") ?? ""),
          phoneCountryCode: String(data.get("countryCode") ?? "+91"),
          phoneNumber: String(data.get("phone") ?? ""),
          password: String(data.get("password") ?? ""),
          termsAccepted: data.get("terms") === "on",
        }),
      });
      const body = (await response.json()) as { success?: boolean; message?: string };

      if (!response.ok || !body.success) {
        setError(body.message ?? "Unable to create your account.");
        return;
      }

      window.location.assign(nextPath);
    } catch {
      setError("Unable to create your account right now.");
    } finally {
      setPending(false);
    }
  }

  return (
    <form className="flex flex-col gap-4" onSubmit={onSubmit}>
      <div>
        <h1 className="text-3xl font-semibold tracking-tight text-neutral-950">
          Create an Account
        </h1>
        <p className="mt-2 text-sm text-neutral-500">
          Sign up to get started with Lotus Lights
        </p>
        {error ? (
          <p className="mt-3 text-sm text-red-600" role="alert">
            {error}
          </p>
        ) : null}
      </div>
      <TextField
        label="Full Name"
        name="name"
        placeholder="Enter your full name"
        autoComplete="name"
      />
      <TextField
        label="Email Address"
        name="email"
        type="email"
        placeholder="Enter your email address"
        autoComplete="email"
      />
      <label className="block text-sm font-medium text-neutral-800">
        Phone Number
        <span className="mt-2 flex gap-2">
          <select
            name="countryCode"
            defaultValue="+91"
            aria-label="Country code"
            className="h-12 rounded-lg border border-neutral-200 bg-white px-3 text-sm outline-none focus:border-[#c6a15a]"
          >
            <option value="+91">+91</option>
            <option value="+1">+1</option>
            <option value="+44">+44</option>
          </select>
          <input
            className="h-12 w-full rounded-lg border border-neutral-200 px-4 text-sm outline-none placeholder:text-neutral-400 focus:border-[#c6a15a]"
            type="tel"
            name="phone"
            placeholder="Enter your phone number"
            autoComplete="tel"
            required
          />
        </span>
      </label>
      <PasswordField
        label="Password"
        name="password"
        placeholder="Create a password"
        autoComplete="new-password"
      />
      <label className="flex items-start gap-2 text-sm text-neutral-600">
        <input
          type="checkbox"
          name="terms"
          required
          className="mt-0.5 size-4 accent-[#c6a15a]"
        />
        <span>
          I agree to the{" "}
          <Link href="/terms" className="text-[#c6a15a]">
            Terms &amp; Conditions
          </Link>{" "}
          and{" "}
          <Link href="/privacy" className="text-[#c6a15a]">
            Privacy Policy
          </Link>
        </span>
      </label>
      <GoldButton disabled={pending}>
        {pending ? "Creating account..." : "Create Account"}
      </GoldButton>
      <SocialAuth />
      <p className="text-center text-sm text-neutral-500">
        Already have an account?{" "}
        <Link
          href={nextPath === "/" ? "/login" : `/login?next=${encodeURIComponent(nextPath)}`}
          className="font-semibold text-[#c6a15a]"
        >
          Sign In
        </Link>
      </p>
    </form>
  );
}
