import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Forgot password | Lotus Lights",
};

export default function ForgotPasswordPage() {
  return (
    <div className="flex min-h-full flex-1 items-center justify-center bg-[#e8e4dc] px-6 py-12 font-sans text-neutral-900">
      <form
        className="flex w-full max-w-md flex-col gap-4 rounded-3xl bg-white p-8"
        action="/forgot-password"
      >
        <div>
          <h1 className="text-2xl font-semibold">Forgot password</h1>
          <p className="mt-2 text-sm text-neutral-500">
            Remembered it?{" "}
            <Link href="/login" className="font-medium text-[#c6a15a]">
              Sign in
            </Link>
          </p>
        </div>
        <label className="text-sm font-medium">
          Email
          <input
            className="mt-2 h-11 w-full rounded-lg border border-neutral-200 px-3 text-sm outline-none focus:border-[#c6a15a]"
            type="email"
            name="email"
            autoComplete="email"
            required
          />
        </label>
        <button
          className="h-11 rounded-lg bg-[#c6a15a] text-sm font-medium text-white"
          type="submit"
        >
          Send reset link
        </button>
      </form>
    </div>
  );
}
