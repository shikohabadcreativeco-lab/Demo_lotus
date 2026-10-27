"use client";

import { useState } from "react";

export function SignOutButton() {
  const [pending, setPending] = useState(false);

  async function signOut() {
    setPending(true);
    try {
      await fetch("/api/auth/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: "{}",
      });
    } finally {
      window.location.assign("/");
    }
  }

  return (
    <button
      type="button"
      onClick={signOut}
      disabled={pending}
      className="h-12 cursor-pointer rounded-lg bg-[#c6a15a] px-6 text-sm font-medium text-white transition-colors hover:bg-[#b69048] disabled:cursor-not-allowed disabled:opacity-60"
    >
      {pending ? "Signing out..." : "Sign out"}
    </button>
  );
}
