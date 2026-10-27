import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { SignupScreen } from "@/components/auth/signup-screen";
import { currentAccount } from "@/lib/current-session";
import { safeNextPath } from "@/lib/return-path";

export const metadata: Metadata = {
  title: "Create an account | Lotus Lights",
};

export default function SignupPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  return (
    <Suspense fallback={<div className="min-h-full flex-1 bg-[#f3efe8]" />}>
      <SignupContent searchParams={searchParams} />
    </Suspense>
  );
}

async function SignupContent({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const { next } = await searchParams;
  const nextPath = safeNextPath(next);
  const account = await currentAccount();
  if (account) {
    redirect(nextPath === "/" ? (account.role === "admin" ? "/admin" : "/profile") : nextPath);
  }
  return <SignupScreen nextPath={nextPath} />;
}
