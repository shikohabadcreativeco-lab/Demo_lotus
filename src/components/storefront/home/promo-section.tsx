import Image from "next/image";
import Link from "next/link";

const highlights = [
  {
    title: "Energy Efficient",
    detail: "Save up to 80% energy",
    icon: <BoltIcon />,
  },
  {
    title: "Modern Design",
    detail: "Premium aesthetics",
    icon: <SparkIcon />,
  },
  {
    title: "Easy Installation",
    detail: "DIY friendly",
    icon: <PlugIcon />,
  },
  {
    title: "Long Lasting",
    detail: "Up to 50,000 hours",
    icon: <ClockIcon />,
  },
];

export function PromoSection() {
  return (
    <section aria-labelledby="promo-heading" className="text-neutral-900">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="relative min-h-[360px] overflow-hidden rounded-3xl shadow-[0_16px_40px_rgba(40,32,20,0.12)]">
          <Image
            src="/images/home/promo-lamp.jpg"
            alt="Black dome lamp glowing over a dark table"
            fill
            sizes="100vw"
            className="object-cover object-[80%_center]"
          />
          <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(0,0,0,0.9)_0%,rgba(0,0,0,0.7)_40%,transparent_72%)]" />
          <div className="relative flex min-h-[360px] max-w-md flex-col justify-center px-6 py-12 sm:px-12 lg:max-w-lg">
            <h2
              id="promo-heading"
              className="text-3xl font-semibold leading-tight tracking-tight text-white sm:text-4xl"
            >
              More Than Just a Light
              <br />
              A Better Way to Live
            </h2>
            <p className="mt-4 max-w-md text-sm leading-6 text-white/80">
              Transform your home with a lighting experience that&apos;s designed
              for comfort, style and well-being.
            </p>
            <Link
              href="/shop"
              className="mt-8 inline-flex h-12 w-fit items-center rounded-lg bg-[#e6c48a] px-7 text-sm font-medium text-neutral-900 transition-colors hover:bg-[#dcb56f]"
            >
              Shop Now
            </Link>
          </div>
        </div>
        <ul className="mt-8 grid grid-cols-2 gap-6 rounded-3xl bg-white px-5 py-6 shadow-[0_8px_24px_rgba(40,32,20,0.04)] md:grid-cols-4 md:divide-x md:divide-neutral-200">
          {highlights.map((item) => (
            <li key={item.title} className="flex items-center gap-3 md:px-4 md:first:pl-0">
              <span className="text-[#c6a15a]">{item.icon}</span>
              <span>
                <span className="block text-sm font-semibold">{item.title}</span>
                <span className="block text-xs text-neutral-500">{item.detail}</span>
              </span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function BoltIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-8" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
      <path d="M13 3.5 6.5 13h5l-1 7.5L18 11h-5l0-7.5Z" />
    </svg>
  );
}

function SparkIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-8" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
      <path d="M12 4.5c.4 2.4 1.6 3.6 4 4-2.4.4-3.6 1.6-4 4-.4-2.4-1.6-3.6-4-4 2.4-.4 3.6-1.6 4-4Z" />
      <path d="M17.5 14.5c.2 1.1.8 1.7 1.9 1.9-1.1.2-1.7.8-1.9 1.9-.2-1.1-.8-1.7-1.9-1.9 1.1-.2 1.7-.8 1.9-1.9Z" />
    </svg>
  );
}

function PlugIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-8" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
      <path d="M9 4.5v5M15 4.5v5" />
      <path d="M8 9.5h8v2.2a4 4 0 0 1-4 4 4 4 0 0 1-4-4V9.5Z" />
      <path d="M12 15.7V19" />
    </svg>
  );
}

function ClockIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-8" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
      <circle cx="12" cy="12" r="7" />
      <path d="M12 8.5V12l2.4 1.6" />
    </svg>
  );
}
