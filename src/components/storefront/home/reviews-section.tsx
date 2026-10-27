import Link from "next/link";

const reviews = [
  {
    quote:
      "Amazing quality and beautiful design. It completely transformed my workspace.",
    name: "Priya S.",
    city: "Bengaluru",
  },
  {
    quote: "Perfect lighting solution for my bedroom. Highly recommended!",
    name: "Rahul K.",
    city: "Mumbai",
  },
  {
    quote: "Stylish, durable and easy to install. Worth every penny.",
    name: "Ananya M.",
    city: "Delhi",
  },
];

export function ReviewsSection() {
  return (
    <section aria-labelledby="reviews-heading" className="pb-8 text-neutral-900">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <p className="text-center text-[11px] font-semibold tracking-[0.28em] text-[#c6a15a]">STORIES</p>
        <h2
          id="reviews-heading"
          className="mt-3 text-center text-3xl font-semibold tracking-tight text-[#1c1917] sm:text-4xl"
        >
          Loved by our customers
        </h2>
        <p className="mt-3 text-center">
          <Link
            href="/reviews"
            className="text-sm font-medium text-[#8a6a32] underline-offset-4 hover:underline"
          >
            Read all stories
          </Link>
        </p>
        <ul className="mt-10 grid gap-5 md:grid-cols-3">
          {reviews.map((review) => (
            <li
              key={review.name}
              className="relative flex flex-col overflow-hidden rounded-3xl border border-[#ece4d6] bg-white p-6 shadow-[0_12px_32px_rgba(28,25,23,0.05)]"
            >
              <span aria-hidden="true" className="absolute inset-x-0 top-0 h-1 bg-[#c6a15a]" />
              <Stars />
              <p className="mt-4 flex-1 text-sm leading-6 text-neutral-600">{review.quote}</p>
              <div className="mt-6 flex items-center gap-3">
                <span className="grid size-9 place-items-center rounded-full bg-[#efe6d6] text-xs font-semibold text-[#8a6a32]">
                  {review.name.slice(0, 1)}
                </span>
                <span>
                  <span className="block text-sm font-semibold">{review.name}</span>
                  <span className="block text-xs text-neutral-500">{review.city}</span>
                </span>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function Stars() {
  return (
    <p className="flex gap-1 text-[#e0b15a]" aria-label="5 stars">
      {Array.from({ length: 5 }, (_, index) => (
        <svg
          key={index}
          viewBox="0 0 20 20"
          className="size-4"
          fill="currentColor"
          aria-hidden="true"
        >
          <path d="m10 1.8 2.1 4.6 5 .6-3.7 3.4.9 5-4.3-2.4L5.7 15.4l.9-5L2.9 7l5-.6L10 1.8Z" />
        </svg>
      ))}
    </p>
  );
}
