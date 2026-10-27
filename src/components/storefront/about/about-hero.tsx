import Image from "next/image";
import Link from "next/link";

const highlights = [
  {
    title: "Firozabad studio",
    detail: "Designed and packed here",
    icon: <PinIcon />,
  },
  {
    title: "Every space",
    detail: "Home, office, showroom, store",
    icon: <LampIcon />,
  },
  {
    title: "1 year warranty",
    detail: "On every light",
    icon: <ShieldIcon />,
  },
  {
    title: "A real reply",
    detail: "Within 24 hours",
    icon: <ChatIcon />,
  },
];

export function AboutHero() {
  return (
    <section aria-labelledby="about-heading">
      <div className="relative min-h-[300px] overflow-hidden sm:min-h-[340px]">
        <Image
          src="/images/home/living-room.jpg"
          alt="Living room lit by a warm table lamp"
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
                <li className="text-white">About</li>
              </ol>
            </nav>
            <p className="mt-6 flex items-center gap-3 text-[11px] font-semibold tracking-[0.28em] text-[#e6c48a]">
              OUR STORY
              <span aria-hidden="true" className="h-px w-10 bg-[#e6c48a]" />
            </p>
            <h1
              id="about-heading"
              className="mt-3 text-4xl font-semibold tracking-tight text-white sm:text-5xl"
            >
              Light for every
              <br />
              place you open
            </h1>
            <p className="mt-4 max-w-md text-sm leading-6 text-white/80">
              Lotus Lights designs lamps in Firozabad for homes, offices,
              showrooms, and stores that want warmth and a clear shape.
            </p>
          </div>
          <p className="hidden text-right text-white lg:block">
            <span className="block text-3xl font-semibold tracking-[0.28em]">
              LOTUS
            </span>
            <span className="mt-1 block text-sm font-medium tracking-[0.42em] text-white/90">
              LIGHTS
            </span>
            <span className="mt-3 block text-[11px] tracking-[0.32em] text-[#e6c48a]">
              EVERY SPACE
            </span>
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
              <span className="block text-sm font-semibold text-neutral-900">
                {item.title}
              </span>
              <span className="block text-xs text-neutral-500">{item.detail}</span>
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}

function PinIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
      <path d="M12 21s6-5.2 6-10a6 6 0 1 0-12 0c0 4.8 6 10 6 10Z" />
      <circle cx="12" cy="11" r="1.8" />
    </svg>
  );
}

function LampIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
      <path d="M8 10.5 12 4l4 6.5H8Z" />
      <path d="M12 10.5V18" />
      <path d="M8.5 18h7" />
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

function ChatIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
      <path d="M6 16.5 4.8 19.2A.6.6 0 0 0 5.4 20H16a4 4 0 0 0 4-4V9a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v5.2a3 3 0 0 0 2 2.8Z" />
    </svg>
  );
}
