import Image from "next/image";
import Link from "next/link";

export function ContactHero() {
  return (
    <section aria-labelledby="contact-heading" className="relative min-h-[380px] overflow-hidden sm:min-h-[440px]">
      <Image
        src="/images/home/living-room.jpg"
        alt="Warmly lit living room with Lotus Lights lamps"
        fill
        priority
        sizes="100vw"
        className="object-cover object-[70%_center]"
      />
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(12,10,8,0.88)_0%,rgba(12,10,8,0.55)_46%,rgba(12,10,8,0.22)_100%)]" />
      <div className="relative mx-auto flex min-h-[380px] w-full max-w-7xl flex-col justify-end px-6 py-12 sm:min-h-[440px] sm:px-10 lg:justify-center">
        <nav aria-label="Breadcrumb" className="text-xs text-white/75">
          <ol className="flex items-center gap-2">
            <li>
              <Link href="/" className="hover:text-white">
                Home
              </Link>
            </li>
            <li aria-hidden="true">›</li>
            <li className="text-white">Contact</li>
          </ol>
        </nav>
        <p className="mt-6 flex items-center gap-3 text-[11px] font-semibold tracking-[0.28em] text-[#e6c48a]">
          GET IN TOUCH
          <span aria-hidden="true" className="h-px w-10 bg-[#e6c48a]" />
        </p>
        <h1
          id="contact-heading"
          className="mt-3 max-w-xl text-4xl font-semibold tracking-tight text-white sm:text-6xl"
        >
          We&apos;re here
          <br />
          to help
        </h1>
        <p className="mt-4 max-w-md text-sm leading-6 text-white/80 sm:text-base">
          Ask about an order, a lamp, or a room you want to light. The Firozabad studio replies within 24 hours.
        </p>
      </div>
    </section>
  );
}
