import Image from "next/image";
import Link from "next/link";

const values = [
  {
    title: "Warmth first",
    detail: "Each lamp is chosen for the colour of the light it throws, then for the shape of the shade.",
  },
  {
    title: "Quiet materials",
    detail: "Metal, glass, and fabric that sit in a room without asking for attention.",
  },
  {
    title: "A light you can trust",
    detail: "Every piece includes a 1 year warranty for manufacturing defects, and unused lamps can go back within 7 days.",
  },
  {
    title: "Help after the order",
    detail: "The same studio that packs the box answers questions about fitting, bulbs, and delivery.",
  },
];

export function AboutStory() {
  return (
    <div className="mx-auto w-full max-w-7xl space-y-6 px-4 pb-16 sm:px-6 lg:px-8">
      <section className="overflow-hidden rounded-3xl border border-[#ece4d6] bg-white shadow-[0_18px_40px_rgba(28,25,23,0.05)]">
        <div className="grid lg:grid-cols-2">
          <div className="relative min-h-72">
            <Image
              src="/images/home/workspace.jpg"
              alt="Desk lamp lighting a workspace"
              fill
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="object-cover"
            />
          </div>
          <div className="flex flex-col justify-center px-6 py-8 sm:px-10">
            <p className="flex items-center gap-3 text-[11px] font-semibold tracking-[0.22em] text-[#c6a15a]">
              THE STUDIO
              <span aria-hidden="true" className="h-px w-8 bg-[#c6a15a]" />
            </p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-neutral-950">
              Light for every space, from Firozabad
            </h2>
            <p className="mt-4 text-sm leading-6 text-neutral-500">
              Lotus Lights started as a small studio making lamps for rooms that
              felt too bright in the day and too dark at night. We still pack
              every order in Firozabad and ship across India.
            </p>
            <p className="mt-3 text-sm leading-6 text-neutral-500">
              Table lamps, floor lamps, pendants, and wall lights are chosen for
              a home, an office, a showroom, or a store. The line stays modern.
              The light stays warm.
            </p>
            <dl className="mt-6 grid grid-cols-3 gap-4 border-t border-neutral-100 pt-6">
              <div>
                <dt className="text-[11px] font-semibold tracking-[0.16em] text-[#c6a15a]">STUDIO</dt>
                <dd className="mt-1 text-sm font-medium text-neutral-900">Firozabad</dd>
              </div>
              <div>
                <dt className="text-[11px] font-semibold tracking-[0.16em] text-[#c6a15a]">DELIVERY</dt>
                <dd className="mt-1 text-sm font-medium text-neutral-900">Across India</dd>
              </div>
              <div>
                <dt className="text-[11px] font-semibold tracking-[0.16em] text-[#c6a15a]">REPLY</dt>
                <dd className="mt-1 text-sm font-medium text-neutral-900">Within a day</dd>
              </div>
            </dl>
          </div>
        </div>
      </section>

      <section aria-labelledby="values-heading" className="rounded-3xl border border-[#ece4d6] bg-white p-6 shadow-[0_18px_40px_rgba(28,25,23,0.05)] sm:p-8">
        <p className="text-[11px] font-semibold tracking-[0.22em] text-[#c6a15a]">HOW WE WORK</p>
        <h2 id="values-heading" className="mt-2 text-2xl font-semibold tracking-tight text-neutral-950">
          What you can expect
        </h2>
        <ul className="mt-6 grid gap-4 sm:grid-cols-2">
          {values.map((value, index) => (
            <li key={value.title} className="rounded-xl bg-[#f6f3ee] p-5">
              <p className="text-[11px] font-semibold tracking-[0.18em] text-[#c6a15a]">
                {String(index + 1).padStart(2, "0")}
              </p>
              <h3 className="mt-1 text-base font-semibold text-neutral-950">{value.title}</h3>
              <p className="mt-2 text-sm leading-6 text-neutral-500">{value.detail}</p>
            </li>
          ))}
        </ul>
      </section>

      <section className="overflow-hidden rounded-3xl border border-[#ece4d6] bg-white shadow-[0_18px_40px_rgba(28,25,23,0.05)]">
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
            <p className="text-[11px] font-semibold tracking-[0.22em] text-[#c6a15a]">VISIT THE SHOP</p>
            <h2 className="mt-2 text-2xl font-semibold tracking-tight text-neutral-950">
              Find a light for the space
            </h2>
            <p className="mt-2 max-w-lg text-sm leading-6 text-neutral-500">
              Browse the collection, or write to the studio if you want help
              choosing a lamp for a particular space.
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              <Link
                href="/shop"
                className="inline-flex h-11 items-center rounded-lg bg-[#d7b07a] px-5 text-sm font-medium text-neutral-900 hover:bg-[#c9a36a]"
              >
                Shop now
              </Link>
              <Link
                href="/contact"
                className="inline-flex h-11 items-center rounded-lg border border-neutral-200 px-5 text-sm font-medium text-neutral-800 hover:border-[#c6a15a]"
              >
                Contact the studio
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
