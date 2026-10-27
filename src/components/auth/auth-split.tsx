import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { BrandLogo } from "@/components/layout/brand-logo";

type Feature = {
  label: string;
  icon: ReactNode;
};

export function AuthSplit({
  image,
  imageAlt,
  headline,
  description,
  features,
  children,
  back,
}: {
  image: string;
  imageAlt: string;
  headline: ReactNode;
  description: string;
  features: Feature[];
  children: ReactNode;
  back?: ReactNode;
}) {
  return (
    <div className="flex min-h-full flex-1 bg-[#e8e4dc] p-3 font-sans text-neutral-900 sm:p-4 lg:p-5">
      <div className="mx-auto grid w-full max-w-[1480px] overflow-hidden rounded-[28px] bg-white shadow-[0_18px_50px_rgba(40,32,20,0.08)] lg:min-h-[calc(100vh-2.5rem)] lg:grid-cols-[11fr_9fr]">
        <aside className="relative min-h-[240px] text-white sm:min-h-[320px] lg:min-h-[460px]">
          <Image
            src={image}
            alt={imageAlt}
            fill
            priority
            sizes="(min-width: 1024px) 55vw, 100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-black/20 to-black/75" />
          <div className="relative flex h-full min-h-[240px] flex-col p-6 sm:min-h-[320px] sm:p-10 lg:min-h-full">
            <BrandLogo tone="light" />
            <div className="mt-8 max-w-sm sm:mt-16">
              <h2 className="text-4xl font-semibold leading-[1.12] tracking-tight sm:text-5xl">
                {headline}
              </h2>
              <p className="mt-5 text-sm leading-6 text-white/80">{description}</p>
            </div>
            <ul className="mt-auto grid grid-cols-3 gap-3 pt-12 text-center">
              {features.map((feature) => (
                <li key={feature.label} className="flex flex-col items-center gap-2">
                  <span className="text-white/90">{feature.icon}</span>
                  <span className="text-[11px] leading-4 text-white/85">{feature.label}</span>
                </li>
              ))}
            </ul>
          </div>
        </aside>
        <section className="flex flex-col bg-white px-6 py-6 sm:px-12 lg:px-14">
          {back ?? (
            <Link
              href="/"
              className="inline-flex items-center gap-2 self-end text-sm text-neutral-500 transition-colors hover:text-neutral-800"
            >
              <span aria-hidden="true">←</span>
              Back to Home
            </Link>
          )}
          <div className="mx-auto flex w-full max-w-xl flex-1 flex-col justify-center py-8">
            {children}
          </div>
        </section>
      </div>
    </div>
  );
}

export function ShieldIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-7" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
      <path d="M12 3.5 19 6.2v5.4c0 4.2-2.8 7.2-7 8.9-4.2-1.7-7-4.7-7-8.9V6.2L12 3.5Z" />
      <path d="m9 12 2 2 4-4.5" />
    </svg>
  );
}

export function DesignIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-7" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
      <path d="M12 3.5 14.2 9H20l-4.7 3.4L17 18.5 12 15.2 7 18.5l1.7-6.1L4 9h5.8L12 3.5Z" />
    </svg>
  );
}

export function PeopleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-7" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
      <circle cx="9" cy="9" r="2.4" />
      <circle cx="16" cy="10" r="2" />
      <path d="M4.8 18.2c.7-2.4 2.6-3.7 4.2-3.7s3.5 1.3 4.2 3.7" />
      <path d="M13.2 14.6c1.3-.5 2.6-.4 3.6.2 1 .7 1.6 1.8 1.9 3.4" />
    </svg>
  );
}

export function TruckIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-7" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
      <path d="M3.5 7.5h11v8h-11v-8Z" />
      <path d="M14.5 10.5h3.2L20.5 14v1.5h-6" />
      <circle cx="7.5" cy="17.2" r="1.4" />
      <circle cx="17" cy="17.2" r="1.4" />
    </svg>
  );
}

export function WarrantyIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-7" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
      <circle cx="12" cy="12" r="7.5" />
      <path d="M12 8.2v4l2.4 1.6" />
    </svg>
  );
}

export function LockIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-7" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
      <rect x="6" y="10.5" width="12" height="8.5" rx="1.5" />
      <path d="M8.5 10.5V8.2a3.5 3.5 0 0 1 7 0v2.3" />
    </svg>
  );
}
