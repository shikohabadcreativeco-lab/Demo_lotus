import Image from "next/image";
import Link from "next/link";

const benefits = [
  {
    title: "Free Shipping",
    detail: "on orders above ₹500",
    icon: <TruckIcon />,
  },
  {
    title: "1 Year Warranty",
    detail: "Premium Quality",
    icon: <ShieldIcon />,
  },
  {
    title: "7 Days Return",
    detail: "Easy & Hassle Free",
    icon: <ReturnIcon />,
  },
  {
    title: "Secure Payment",
    detail: "100% Safe & Secure",
    icon: <LockIcon />,
  },
];

export function HeroSection() {
  return (
    <section aria-labelledby="hero-heading" className="bg-[#f6f3ee] text-neutral-900">
      <div className="relative min-h-[480px] w-full overflow-hidden sm:min-h-[600px]">
        <Image
          src="/images/home-hero.jpg"
          alt="Circular ring lamp glowing on a wooden table"
          fill
          priority
          sizes="100vw"
          className="object-cover object-[68%_center]"
        />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(12,10,8,0.82)_0%,rgba(12,10,8,0.42)_36%,rgba(12,10,8,0.08)_68%,rgba(12,10,8,0.28)_100%)]" />
        <div className="relative mx-auto flex min-h-[480px] w-full max-w-7xl flex-col justify-center px-5 py-14 sm:min-h-[600px] sm:px-10 lg:px-12">
          <div className="max-w-md lg:max-w-lg">
            <p className="flex items-center gap-3 text-[11px] font-semibold tracking-[0.28em] text-[#e6c48a]">
              FIROZABAD STUDIO
              <span aria-hidden="true" className="h-px w-8 bg-[#e6c48a]" />
            </p>
            <h1
              id="hero-heading"
              className="mt-4 text-[2.35rem] font-semibold leading-[1.05] tracking-tight text-white [text-shadow:0_2px_16px_rgba(0,0,0,0.45)] sm:text-5xl lg:text-6xl"
            >
              Light for
              <br />
              every place
              <br />
              you open
            </h1>
            <p className="mt-6 max-w-sm text-sm leading-6 text-white/85 sm:text-base">
              Modern lamps for homes, offices, showrooms, and stores. Warm light,
              made in Firozabad.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-5">
              <Link
                href="/shop"
                className="inline-flex h-12 items-center rounded-lg bg-[#e6c48a] px-7 text-sm font-medium text-neutral-900 transition-colors hover:bg-[#dcb56f]"
              >
                Shop Now
              </Link>
              <Link
                href="/about"
                className="inline-flex items-center gap-2.5 text-sm font-medium text-white"
              >
                <span className="grid size-8 place-items-center rounded-full border border-white/80">
                  <PlayIcon />
                </span>
                Our story
              </Link>
            </div>
          </div>
        </div>
      </div>
      <ul className="mx-auto grid w-full max-w-7xl grid-cols-2 gap-3 px-4 py-8 sm:px-6 lg:grid-cols-4 lg:px-8">
        {benefits.map((benefit) => (
          <li
            key={benefit.title}
            className="flex items-center gap-3 rounded-2xl border border-[#ece4d6] bg-white px-3 py-4 shadow-[0_10px_24px_rgba(28,25,23,0.04)]"
          >
            <span className="grid size-11 shrink-0 place-items-center rounded-full bg-[#fbf7ef] text-[#c6a15a]">
              {benefit.icon}
            </span>
            <span className="min-w-0">
              <span className="block text-sm font-semibold text-neutral-900">
                {benefit.title}
              </span>
              <span className="block text-xs leading-5 text-neutral-500">{benefit.detail}</span>
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}

function PlayIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-3.5 translate-x-px" fill="currentColor" aria-hidden="true">
      <path d="M8 6.5v11l9-5.5-9-5.5Z" />
    </svg>
  );
}

function TruckIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
      <path d="M3.5 7.5h10.5v8H3.5v-8Z" />
      <path d="M14 11h3.1L20 14.2V15.5h-6" />
      <circle cx="7.2" cy="17.4" r="1.3" />
      <circle cx="16.6" cy="17.4" r="1.3" />
    </svg>
  );
}

function ShieldIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
      <path d="M12 3.8 19 6.3v5.2c0 4-2.7 6.8-7 8.5-4.3-1.7-7-4.5-7-8.5V6.3L12 3.8Z" />
      <path d="m9.2 12 1.8 1.8 3.8-4" />
    </svg>
  );
}

function ReturnIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
      <path d="M7.5 8.5H16a3.5 3.5 0 0 1 0 7H8" />
      <path d="M10 5.8 7.2 8.5 10 11.2" />
    </svg>
  );
}

function LockIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
      <rect x="6.5" y="10.5" width="11" height="8" rx="1.5" />
      <path d="M9 10.5V8.4a3 3 0 0 1 6 0v2.1" />
    </svg>
  );
}
