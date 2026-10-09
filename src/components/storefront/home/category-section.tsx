import Image from "next/image";
import Link from "next/link";

const rooms = [
  {
    title: "Living Room",
    image: "/images/home/living-room.jpg",
    alt: "Living room with warm table lamps",
  },
  {
    title: "Bedroom",
    image: "/images/home/bedroom.jpg",
    alt: "Bedroom with glowing bedside lamps",
  },
  {
    title: "Workspace",
    image: "/images/home/workspace.jpg",
    alt: "Desk with a sculptural lamp and a plant",
  },
  {
    title: "Dining Room",
    image: "/images/home/dining-room.jpg",
    alt: "Lounge and dining area with warm lamps",
  },
];

export function CategorySection() {
  return (
    <section aria-labelledby="rooms-heading" className="text-neutral-900">
      <div className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
        <div className="mx-auto max-w-2xl text-center">
          <h2 id="rooms-heading" className="text-3xl font-semibold tracking-tight sm:text-4xl">
            Designed for Modern Living
          </h2>
          <p className="mt-4 text-sm leading-7 text-neutral-500 sm:text-base">
            Elegant. Functional. Timeless. Our premium lighting solution brings
            warmth and sophistication to every space.
          </p>
        </div>
        <ul className="mt-12 grid grid-cols-2 gap-4 lg:grid-cols-4 lg:gap-6">
          {rooms.map((room) => (
            <li key={room.title}>
              <Link href="/shop" className="group block">
                <span className="relative block aspect-[4/3] overflow-hidden rounded-2xl shadow-[0_10px_30px_rgba(40,32,20,0.08)]">
                  <Image
                    src={room.image}
                    alt={room.alt}
                    fill
                    sizes="(min-width: 1024px) 25vw, 50vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </span>
                <span className="mt-3 block text-sm font-semibold text-neutral-800 sm:text-base">
                  {room.title}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
