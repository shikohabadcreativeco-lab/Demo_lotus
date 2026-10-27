import Image from "next/image";
import Link from "next/link";

const rooms = [
  {
    title: "Home",
    image: "/images/home/living-room.jpg",
    alt: "Warm lamps in a living room",
  },
  {
    title: "Office",
    image: "/images/home/workspace.jpg",
    alt: "A lamp lighting a desk",
  },
  {
    title: "Showroom",
    image: "/images/home/dining-room.jpg",
    alt: "Warm lamps displayed in a lounge",
  },
  {
    title: "Store",
    image: "/images/home/promo-lamp.jpg",
    alt: "A glowing lamp on a dark display",
  },
];

export function CategorySection() {
  return (
    <section aria-labelledby="rooms-heading" className="text-neutral-900">
      <div className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-[11px] font-semibold tracking-[0.28em] text-[#c6a15a]">THE ROOMS</p>
          <h2 id="rooms-heading" className="mt-3 text-3xl font-semibold tracking-tight text-[#1c1917] sm:text-4xl">
            Made for every space
          </h2>
          <p className="mt-4 text-sm leading-7 text-neutral-500 sm:text-base">
            The same lamps light a home, an office, a showroom, and a store.
            Warm, modern, and ready for the room you have.
          </p>
        </div>
        <ul className="mt-12 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4 lg:gap-6">
          {rooms.map((room) => (
            <li key={room.title}>
              <Link href="/shop" className="group block">
                <span className="relative block aspect-[3/4] overflow-hidden rounded-3xl shadow-[0_16px_36px_rgba(28,25,23,0.12)] sm:aspect-[4/5]">
                  <Image
                    src={room.image}
                    alt={room.alt}
                    fill
                    sizes="(min-width: 1024px) 25vw, 50vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <span className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/15 to-transparent" />
                  <span className="absolute inset-x-0 bottom-0 p-4 text-white">
                    <span className="text-[10px] font-semibold tracking-[0.22em] text-[#e6c48a] sm:text-[11px]">
                      SPACE
                    </span>
                    <span className="mt-1 block text-lg font-semibold tracking-tight sm:text-xl">
                      {room.title}
                    </span>
                  </span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
