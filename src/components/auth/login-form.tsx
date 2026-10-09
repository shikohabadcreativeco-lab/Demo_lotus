"use client";

import Link from "next/link";
import { GoldButton, PasswordField, SocialAuth, TextField } from "@/components/auth/auth-fields";

export function LoginForm() {
  return (
    <form
      className="flex flex-col gap-5"
      onSubmit={(event) => event.preventDefault()}
    >
      <div>
        <h1 className="text-3xl font-semibold tracking-tight text-neutral-950">
          Welcome Back
        </h1>
        <p className="mt-2 text-sm text-neutral-500">
          Sign in to your Lotus Lights account to continue
        </p>
      </div>
      <TextField
        label="Email or Phone Number"
        name="email"
        type="text"
        placeholder="Enter your email or phone number"
        autoComplete="username"
      />
      <PasswordField
        label="Password"
        name="password"
        placeholder="Enter your password"
        autoComplete="current-password"
      />
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
      <GoldButton>Sign In</GoldButton>
      <SocialAuth />
      <p className="text-center text-sm text-neutral-500">
        Don&apos;t have an account?{" "}
        <Link href="/signup" className="font-semibold text-[#c6a15a]">
          Sign Up
        </Link>
      </p>
    </form>
  );
}
