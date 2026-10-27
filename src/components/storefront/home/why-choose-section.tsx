const reasons = [
  {
    title: "Premium Quality",
    detail: "Built with high-grade materials",
    icon: <ShieldIcon />,
  },
  {
    title: "Modern Aesthetics",
    detail: "Enhances any space",
    icon: <PeopleIcon />,
  },
  {
    title: "Customer Support",
    detail: "Dedicated support team",
    icon: <SupportIcon />,
  },
  {
    title: "Secure Payment",
    detail: "Multiple payment options",
    icon: <BagIcon />,
  },
];

export function WhyChooseSection() {
  return (
    <section aria-labelledby="why-heading" className="py-16 text-neutral-900 lg:py-20">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <p className="text-center text-[11px] font-semibold tracking-[0.28em] text-[#c6a15a]">THE STUDIO</p>
        <h2
          id="why-heading"
          className="mt-3 text-center text-3xl font-semibold tracking-tight text-[#1c1917] sm:text-4xl"
        >
          Why choose Lotus Lights
        </h2>
        <ul className="mt-10 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
          {reasons.map((reason) => (
            <li key={reason.title} className="flex flex-col items-center rounded-3xl border border-[#ece4d6] bg-white px-3 py-6 text-center shadow-[0_12px_32px_rgba(28,25,23,0.04)] sm:px-4">
              <span className="grid size-14 place-items-center rounded-full border border-[#e6dccb] bg-[#fbf7ef] text-[#c6a15a]">
                {reason.icon}
              </span>
              <span className="mt-4 text-sm font-semibold text-[#1c1917] sm:text-base">{reason.title}</span>
              <span className="mt-1 max-w-[12rem] text-xs leading-5 text-neutral-500">
                {reason.detail}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function ShieldIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-7" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
      <path d="M12 3.8 19 6.3v5.2c0 4-2.7 6.8-7 8.5-4.3-1.7-7-4.5-7-8.5V6.3L12 3.8Z" />
    </svg>
  );
}

function PeopleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-7" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
      <circle cx="9" cy="9" r="2.2" />
      <circle cx="15.5" cy="9.5" r="1.8" />
      <path d="M5.2 17.2c.6-2.2 2.3-3.3 3.8-3.3s3.2 1.1 3.8 3.3" />
      <path d="M13 14.2c1-.4 2.1-.3 3 .2.9.6 1.5 1.6 1.8 3" />
    </svg>
  );
}

function SupportIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-7" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
      <path d="M5 12.5a7 7 0 0 1 14 0" />
      <path d="M5 12.5v3.2A1.8 1.8 0 0 0 6.8 17.5H8v-6H6.8A1.8 1.8 0 0 0 5 13.3v-.8Z" />
      <path d="M19 12.5v3.2a1.8 1.8 0 0 1-1.8 1.8H16v-6h1.2A1.8 1.8 0 0 1 19 13.3v-.8Z" />
    </svg>
  );
}

function BagIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-7" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
      <path d="M7 8.5h10l-.8 10H7.8L7 8.5Z" />
      <path d="M9.5 8.5V7.4a2.5 2.5 0 0 1 5 0v1.1" />
    </svg>
  );
}
