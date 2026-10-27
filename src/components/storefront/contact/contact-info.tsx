import Image from "next/image";
import Link from "next/link";

const channels = [
  {
    title: "Call",
    value: "+91 98765 43210",
    href: "tel:+919876543210",
    note: "Monday–Saturday, 9:00 AM – 7:00 PM",
  },
  {
    title: "Email",
    value: "support@lotuslights.in",
    href: "mailto:support@lotuslights.in",
    note: "A reply within 24 hours",
  },
  {
    title: "Studio",
    value: "Firozabad, India",
    href: "https://www.google.com/maps/search/?api=1&query=Firozabad%2C%20India",
    note: "Monday–Saturday, 10:00 AM – 8:00 PM",
  },
];

export function ContactInfo() {
  return (
    <aside className="overflow-hidden rounded-3xl border border-[#ece4d6] bg-white shadow-[0_18px_40px_rgba(28,25,23,0.05)]">
      <div className="relative h-40">
        <Image
          src="/images/home/dining-room.jpg"
          alt="Lotus Lights lamps in a dining room"
          fill
          sizes="420px"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-black/10" />
        <p className="absolute bottom-4 left-5 text-sm font-semibold text-white">
          Lotus Lights Studio
        </p>
      </div>
      <div className="p-5 sm:p-6">
        <h2 className="text-lg font-semibold tracking-tight text-neutral-950">Reach the studio</h2>
        <ul className="mt-5 space-y-5">
          {channels.map((channel) => (
            <li key={channel.title}>
              <p className="text-[11px] font-semibold tracking-[0.16em] text-[#c6a15a]">
                {channel.title.toUpperCase()}
              </p>
              <a
                href={channel.href}
                className="mt-1 block text-sm font-medium text-neutral-950 hover:text-[#8a6a32]"
                {...(channel.href.startsWith("http")
                  ? { target: "_blank", rel: "noreferrer" }
                  : {})}
              >
                {channel.value}
              </a>
              <p className="mt-0.5 text-xs leading-5 text-neutral-500">{channel.note}</p>
            </li>
          ))}
        </ul>
        <div className="mt-5 overflow-hidden rounded-xl border border-neutral-200">
          <iframe
            title="Map of the Lotus Lights studio in Firozabad"
            src="https://maps.google.com/maps?q=Firozabad%2C%20India&z=12&output=embed"
            className="h-40 w-full"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
        <Link
          href="/faqs"
          className="mt-5 inline-flex text-sm font-medium text-[#8a6a32] hover:text-neutral-950"
        >
          Common questions
        </Link>
      </div>
    </aside>
  );
}
