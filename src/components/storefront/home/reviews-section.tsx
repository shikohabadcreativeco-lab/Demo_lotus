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
        <h2
          id="reviews-heading"
          className="text-center text-3xl font-semibold tracking-tight sm:text-4xl"
        >
          Loved by Our Customers
        </h2>
        <ul className="mt-10 grid gap-5 md:grid-cols-3">
          {reviews.map((review) => (
            <li
              key={review.name}
              className="flex flex-col rounded-3xl bg-white p-6 shadow-[0_10px_30px_rgba(40,32,20,0.06)]"
            >
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
