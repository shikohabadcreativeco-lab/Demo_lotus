import Image from "next/image";
import Link from "next/link";

export function CtaSection() {
  return (
    <section aria-labelledby="cta-heading" className="pb-16 text-neutral-900">
      <div className="mx-auto w-full max-w-7xl px-4 pt-10 sm:px-6 lg:px-8">
        <div className="relative min-h-[280px] overflow-hidden rounded-3xl shadow-[0_16px_40px_rgba(40,32,20,0.12)]">
          <Image
            src="/images/home/cta-lamp.jpg"
            alt="Table lamp with a warm glowing shade"
            fill
            sizes="100vw"
            className="object-cover object-[82%_center]"
          />
          <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(0,0,0,0.9)_0%,rgba(0,0,0,0.62)_42%,transparent_74%)]" />
          <div className="relative flex min-h-[280px] max-w-md flex-col justify-center px-6 py-10 sm:px-12 lg:max-w-xl">
            <h2
              id="cta-heading"
              className="text-3xl font-semibold tracking-tight text-white sm:text-4xl"
            >
              Ready to Transform Your Space?
            </h2>
            <p className="mt-3 text-sm text-white/80">
              Light a home, an office, a showroom, or a store.
            </p>
            <Link
              href="/shop"
              className="mt-6 inline-flex h-11 w-fit items-center rounded-lg bg-[#e6c48a] px-6 text-sm font-medium text-neutral-900 transition-colors hover:bg-[#dcb56f]"
            >
              Shop Now
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
