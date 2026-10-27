import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { LoginScreen } from "@/components/auth/login-screen";
import { currentAccount } from "@/lib/current-session";
import { safeNextPath } from "@/lib/return-path";

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}): Promise<Metadata> {
  const { next } = await searchParams;
  if (safeNextPath(next).startsWith("/admin")) {
    return { title: "Admin sign in | Lotus Lights" };
  }
  return { title: "Sign in | Lotus Lights" };
}

export default function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  return (
    <Suspense fallback={<div className="min-h-full flex-1 bg-[#f3efe8]" />}>
      <LoginContent searchParams={searchParams} />
    </Suspense>
  );
}

async function LoginContent({
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
  return <LoginScreen nextPath={nextPath} />;
}
