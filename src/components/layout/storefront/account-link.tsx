import Link from "next/link";
import { currentAccount } from "@/lib/current-session";

export async function AccountLink() {
  const account = await currentAccount();
  if (!account) return <AccountIcon href="/login" label="Account" />;
  return <AccountIcon href="/profile" label="Profile" />;
}

export function AccountIcon({ href, label }: { href: string; label: string }) {
  return (
    <Link href={href} aria-label={label} className="grid size-10 place-items-center rounded-full transition-colors hover:bg-[#f6efe2] hover:text-neutral-950">
      <UserIcon />
    </Link>
  );
}

function UserIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="size-[22px]"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="8" r="3.25" />
      <path d="M5.5 19.25c1.2-2.7 3.5-4 6.5-4s5.3 1.3 6.5 4" />
    </svg>
  );
}
