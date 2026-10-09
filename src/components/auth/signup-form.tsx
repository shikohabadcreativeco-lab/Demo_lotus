"use client";

import Link from "next/link";
import { GoldButton, PasswordField, SocialAuth, TextField } from "@/components/auth/auth-fields";

export function SignupForm() {
  return (
    <form
      className="flex flex-col gap-4"
      onSubmit={(event) => event.preventDefault()}
    >
      <div>
        <h1 className="text-3xl font-semibold tracking-tight text-neutral-950">
          Create an Account
        </h1>
        <p className="mt-2 text-sm text-neutral-500">
          Sign up to get started with Lotus Lights
        </p>
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
          <a href="/contact" className="text-[#c6a15a]">
            Terms &amp; Conditions
          </a>{" "}
          and{" "}
          <a href="/contact" className="text-[#c6a15a]">
            Privacy Policy
          </a>
        </span>
      </label>
      <GoldButton>Create Account</GoldButton>
      <SocialAuth />
      <p className="text-center text-sm text-neutral-500">
        Already have an account?{" "}
        <Link href="/login" className="font-semibold text-[#c6a15a]">
          Sign In
        </Link>
      </p>
    </form>
  );
}
