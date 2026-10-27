import type { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";

const related = [
  { href: "/faqs", label: "FAQs" },
  { href: "/shipping-policy", label: "Shipping" },
  { href: "/returns", label: "Returns" },
  { href: "/privacy", label: "Privacy" },
  { href: "/terms", label: "Terms" },
];

export function SupportPage({
  crumb,
  eyebrow,
  title,
  titleLine,
  intro,
  image,
  highlights,
  current,
  children,
}: {
  crumb: string;
  eyebrow: string;
  title: string;
  titleLine?: string;
  intro: string;
  image: string;
  highlights: { title: string; detail: string; icon: ReactNode }[];
  current: string;
  children: ReactNode;
}) {
  return (
    <>
      <section aria-labelledby="support-heading">
        <div className="relative min-h-[300px] overflow-hidden sm:min-h-[340px]">
          <Image
            src={image}
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover object-[70%_center]"
          />
          <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(12,10,8,0.88)_0%,rgba(12,10,8,0.62)_38%,rgba(12,10,8,0.18)_68%,rgba(12,10,8,0.45)_100%)]" />
          <div className="relative mx-auto flex min-h-[300px] w-full max-w-7xl items-center justify-between gap-10 px-6 py-12 sm:min-h-[340px] sm:px-10">
            <div className="max-w-xl">
              <nav aria-label="Breadcrumb" className="text-xs text-white/70">
                <ol className="flex items-center gap-2">
                  <li>
                    <Link href="/" className="hover:text-white">
                      Home
                    </Link>
                  </li>
                  <li aria-hidden="true">›</li>
                  <li className="text-white">{crumb}</li>
                </ol>
              </nav>
              <p className="mt-6 flex items-center gap-3 text-[11px] font-semibold tracking-[0.28em] text-[#e6c48a]">
                {eyebrow}
                <span aria-hidden="true" className="h-px w-10 bg-[#e6c48a]" />
              </p>
              <h1 id="support-heading" className="mt-3 text-4xl font-semibold tracking-tight text-white sm:text-5xl">
                {title}
                {titleLine ? (
                  <>
                    <br />
                    {titleLine}
                  </>
                ) : null}
              </h1>
              <p className="mt-4 max-w-md text-sm leading-6 text-white/80">{intro}</p>
            </div>
            <p className="hidden text-right text-white lg:block">
              <span className="block text-3xl font-semibold tracking-[0.28em]">LOTUS</span>
              <span className="mt-1 block text-sm font-medium tracking-[0.42em] text-white/90">LIGHTS</span>
              <span className="mt-3 block text-[11px] tracking-[0.32em] text-[#e6c48a]">A BRIGHTER HOME</span>
            </p>
          </div>
        </div>
        <ul className="mx-auto grid w-full max-w-7xl grid-cols-1 gap-6 px-6 py-8 sm:grid-cols-2 sm:px-10 lg:grid-cols-4">
          {highlights.map((item) => (
            <li key={item.title} className="flex items-center gap-3">
              <span className="grid size-12 shrink-0 place-items-center rounded-full bg-[#f3eee6] text-[#c6a15a]">
                {item.icon}
              </span>
              <span>
                <span className="block text-sm font-semibold text-neutral-900">{item.title}</span>
                <span className="block text-xs text-neutral-500">{item.detail}</span>
              </span>
            </li>
          ))}
        </ul>
      </section>

      <div className="mx-auto w-full max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
        {children}
        <section className="mt-6 overflow-hidden rounded-3xl border border-[#ece4d6] bg-white shadow-[0_18px_40px_rgba(28,25,23,0.05)]">
          <div className="grid lg:grid-cols-[280px_minmax(0,1fr)]">
            <div className="relative min-h-44">
              <Image
                src="/images/home/cta-lamp.jpg"
                alt="Glowing table lamp"
                fill
                sizes="280px"
                className="object-cover"
              />
            </div>
            <div className="flex flex-col justify-center px-6 py-8 sm:px-8">
              <p className="text-[11px] font-semibold tracking-[0.22em] text-[#c6a15a]">STILL NEED HELP</p>
              <h2 className="mt-2 text-2xl font-semibold tracking-tight text-neutral-950">Talk to the studio</h2>
              <p className="mt-2 max-w-lg text-sm leading-6 text-neutral-500">
                Call +91 98765 43210 or write to support@lotuslights.in. We reply within 24 hours.
              </p>
              <div className="mt-5 flex flex-wrap items-center gap-3">
                <Link
                  href="/contact"
                  className="inline-flex h-11 items-center rounded-lg bg-[#d7b07a] px-5 text-sm font-medium text-neutral-900 hover:bg-[#c9a36a]"
                >
                  Contact us
                </Link>
                <nav aria-label="More support" className="flex flex-wrap gap-2">
                  {related.map((item) => {
                    const active = item.href === current;
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        aria-current={active ? "page" : undefined}
                        className={`rounded-full px-4 py-2 text-sm ${
                          active
                            ? "bg-[#f6efe2] font-medium text-[#8a6a32]"
                            : "text-neutral-600 hover:text-neutral-950"
                        }`}
                      >
                        {item.label}
                      </Link>
                    );
                  })}
                </nav>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
