"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState, type FormEvent, type ReactNode } from "react";
import {
  publishedReviews,
  reviewSummary,
  rooms,
  type Review,
  type Room,
} from "@/components/storefront/reviews/reviews-data";

const MAX_REVIEW = 400;

type Filter = "all" | "5" | "4" | Room;

export function ReviewsExperience() {
  const [reviews, setReviews] = useState(publishedReviews);
  const [filter, setFilter] = useState<Filter>("all");
  const [name, setName] = useState("");
  const [city, setCity] = useState("");
  const [room, setRoom] = useState<Room | "">("");
  const [product, setProduct] = useState("");
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [quote, setQuote] = useState("");
  const [notice, setNotice] = useState("");
  const summary = reviewSummary(reviews);

  const visible = useMemo(() => {
    return reviews.filter((review) => {
      if (filter === "5" || filter === "4") return review.rating === Number(filter);
      if (filter === "all") return true;
      return review.room === filter;
    });
  }, [filter, reviews]);

  const filters: { id: Filter; label: string }[] = [
    { id: "all", label: "All stories" },
    { id: "5", label: "5 stars" },
    { id: "4", label: "4 stars" },
    ...rooms.map((item) => ({ id: item, label: item })),
  ];

  function shareReview(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!room || rating < 1) {
      setNotice("Choose a star rating before sharing your story.");
      return;
    }

    const next: Review = {
      id: `story-${Date.now()}`,
      quote: quote.trim(),
      name: name.trim(),
      city: city.trim(),
      rating,
      room,
      product: product.trim() || room,
    };

    setReviews((current) => [next, ...current]);
    setFilter("all");
    setNotice(`Thank you, ${next.name.split(" ")[0]}. Your story is now in the list.`);
    setName("");
    setCity("");
    setRoom("");
    setProduct("");
    setRating(0);
    setQuote("");
  }

  return (
    <>
      <section aria-labelledby="reviews-page-heading">
        <div className="relative min-h-[300px] overflow-hidden sm:min-h-[340px]">
          <Image
            src="/images/home/bedroom.jpg"
            alt="Bedroom with warm bedside lamps"
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
                  <li className="text-white">Reviews</li>
                </ol>
              </nav>
              <p className="mt-6 flex items-center gap-3 text-[11px] font-semibold tracking-[0.28em] text-[#e6c48a]">
                CUSTOMER STORIES
                <span aria-hidden="true" className="h-px w-10 bg-[#e6c48a]" />
              </p>
              <h1
                id="reviews-page-heading"
                className="mt-3 text-4xl font-semibold tracking-tight text-white sm:text-5xl"
              >
                Loved by Our
                <br />
                Customers
              </h1>
              <p className="mt-4 max-w-md text-sm leading-6 text-white/80">
                Homes, offices, showrooms, and stores across India share how
                Lotus Lights changed a space. Read their stories, or leave one of your own.
              </p>
            </div>
            <div className="hidden text-right text-white [text-shadow:0_2px_18px_rgba(0,0,0,0.55)] lg:block">
              <p className="text-6xl font-semibold tracking-tight">
                {summary.average.toFixed(1)}
              </p>
              <Stars rating={Math.round(summary.average)} className="mt-2 justify-end" />
              <p className="mt-3 text-[11px] tracking-[0.28em] text-[#e6c48a]">
                OUT OF 5
              </p>
            </div>
          </div>
        </div>
        <ul className="mx-auto grid w-full max-w-7xl grid-cols-1 gap-6 px-6 py-8 sm:grid-cols-2 sm:px-10 lg:grid-cols-4">
          <Highlight
            icon={<StarIcon />}
            title={`${summary.average.toFixed(1)} average`}
            detail="Across every story on this page"
          />
          <Highlight
            icon={<ChatIcon />}
            title={`${summary.total} stories`}
            detail="From spaces using Lotus Lights"
          />
          <Highlight
            icon={<SparkIcon />}
            title={`${summary.fiveStar} five-star`}
            detail="Customers who loved the glow"
          />
          <Highlight
            icon={<PinIcon />}
            title={`${summary.cities} cities`}
            detail="Bengaluru, Mumbai, Delhi and more"
          />
        </ul>
      </section>

      <div className="mx-auto grid w-full max-w-7xl items-start gap-6 px-4 pb-16 sm:px-6 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] lg:px-8">
        <section aria-labelledby="story-list-heading">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="flex items-center gap-3 text-[11px] font-semibold tracking-[0.22em] text-[#c6a15a]">
                FROM OUR CUSTOMERS
                <span aria-hidden="true" className="h-px w-8 bg-[#c6a15a]" />
              </p>
              <h2
                id="story-list-heading"
                className="mt-3 text-3xl font-semibold tracking-tight text-neutral-950"
              >
                Recent stories
              </h2>
            </div>
            <p className="text-sm text-neutral-500">
              Showing {visible.length} of {reviews.length}
            </p>
          </div>
          <div className="mt-5 flex flex-wrap gap-2" role="group" aria-label="Filter stories">
            {filters.map((item) => {
              const active = filter === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  aria-pressed={active}
                  onClick={() => setFilter(item.id)}
                  className={`h-9 rounded-full px-3.5 text-xs font-medium transition-colors ${
                    active
                      ? "bg-[#d7b07a] text-neutral-900"
                      : "bg-white text-neutral-600 ring-1 ring-black/5 hover:text-neutral-950"
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </div>
          {visible.length === 0 ? (
            <p className="mt-6 rounded-3xl border border-[#ece4d6] bg-white px-6 py-10 text-sm text-neutral-500">
              No stories match this filter yet.
            </p>
          ) : (
            <ul className="mt-6 space-y-4">
              {visible.map((review) => (
                <li
                  key={review.id}
                  className="rounded-3xl border border-[#ece4d6] bg-white p-6 shadow-[0_18px_40px_rgba(28,25,23,0.05)]"
                >
                  <div className="flex items-center justify-between gap-3">
                    <Stars rating={review.rating} />
                    <span className="text-xs text-neutral-400">{review.room}</span>
                  </div>
                  <p className="mt-4 text-sm leading-6 text-neutral-600">{review.quote}</p>
                  <p className="mt-3 text-xs font-medium text-[#8a6a32]">{review.product}</p>
                  <div className="mt-5 flex items-center gap-3">
                    <span className="grid size-9 place-items-center rounded-full bg-[#f3eee6] text-xs font-semibold text-[#8a6a32]">
                      {review.name.slice(0, 1)}
                    </span>
                    <span>
                      <span className="block text-sm font-semibold text-neutral-900">
                        {review.name}
                      </span>
                      <span className="block text-xs text-neutral-500">{review.city}</span>
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section
          aria-labelledby="share-heading"
          className="rounded-3xl border border-[#ece4d6] bg-white p-6 shadow-[0_18px_40px_rgba(28,25,23,0.05)] sm:p-8 lg:sticky lg:top-24"
        >
          <p className="flex items-center gap-3 text-[11px] font-semibold tracking-[0.22em] text-[#c6a15a]">
            SHARE YOUR EXPERIENCE
            <span aria-hidden="true" className="h-px w-8 bg-[#c6a15a]" />
          </p>
          <h2
            id="share-heading"
            className="mt-3 text-3xl font-semibold tracking-tight text-neutral-950"
          >
            Write a review
          </h2>
          <p className="mt-2 text-sm leading-6 text-neutral-500">
            Tell us about the space, the light, and how it feels there.
          </p>
          {notice ? (
            <p className="mt-4 rounded-lg bg-[#f3eee6] px-4 py-3 text-sm text-neutral-800" role="status">
              {notice}
            </p>
          ) : null}
          <form className="mt-6 space-y-4" onSubmit={shareReview}>
            <div className="grid gap-4 sm:grid-cols-2">
              <TextField label="Full Name" name="name" required value={name} onChange={setName} placeholder="Enter your name" autoComplete="name" />
              <TextField label="City" name="city" required value={city} onChange={setCity} placeholder="Enter your city" autoComplete="address-level2" />
            </div>
            <label className="block text-sm font-medium text-neutral-800">
              <span>
                Room <RequiredMark />
              </span>
              <span className="relative mt-2 block">
                <select
                  name="room"
                  required
                  value={room}
                  onChange={(event) => setRoom(event.target.value as Room | "")}
                  className="h-12 w-full appearance-none rounded-lg border border-neutral-200 bg-white px-4 pr-10 text-sm text-neutral-900 outline-none invalid:text-neutral-400 focus:border-[#c6a15a]"
                >
                  <option value="" disabled>
                    Select a room
                  </option>
                  {rooms.map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
                <ChevronIcon />
              </span>
            </label>
            <TextField label="Product" name="product" value={product} onChange={setProduct} placeholder="Which light did you choose?" />
            <fieldset>
              <legend className="text-sm font-medium text-neutral-800">
                Rating <RequiredMark />
              </legend>
              <div className="mt-2 flex gap-1" role="radiogroup" aria-label="Rating">
                {[1, 2, 3, 4, 5].map((value) => {
                  const active = value <= (hoveredRating || rating);
                  return (
                    <button
                      key={value}
                      type="button"
                      role="radio"
                      aria-checked={rating === value}
                      aria-label={`${value} star${value === 1 ? "" : "s"}`}
                      onMouseEnter={() => setHoveredRating(value)}
                      onMouseLeave={() => setHoveredRating(0)}
                      onClick={() => setRating(value)}
                      className={`grid size-10 place-items-center rounded-lg border transition-colors ${
                        active
                          ? "border-[#d7b07a] bg-[#f3eee6] text-[#c6a15a]"
                          : "border-neutral-200 text-neutral-300 hover:text-[#c6a15a]"
                      }`}
                    >
                      <StarGlyph />
                    </button>
                  );
                })}
              </div>
            </fieldset>
            <label className="block text-sm font-medium text-neutral-800">
              <span>
                Your story <RequiredMark />
              </span>
              <span className="relative mt-2 block">
                <textarea
                  name="quote"
                  required
                  rows={5}
                  maxLength={MAX_REVIEW}
                  value={quote}
                  onChange={(event) => setQuote(event.target.value)}
                  placeholder="How did the light change your space?"
                  className="w-full resize-y rounded-lg border border-neutral-200 px-4 pt-3 pb-8 text-sm text-neutral-900 outline-none placeholder:text-neutral-400 focus:border-[#c6a15a]"
                />
                <span
                  className={`pointer-events-none absolute right-3 bottom-3 text-xs ${
                    quote.length >= MAX_REVIEW ? "text-red-500" : "text-neutral-400"
                  }`}
                >
                  {quote.length}/{MAX_REVIEW}
                </span>
              </span>
            </label>
            <button
              type="submit"
              className="inline-flex h-12 w-full items-center justify-center rounded-lg bg-[#d7b07a] text-sm font-medium text-neutral-900 transition-colors hover:bg-[#c9a36a]"
            >
              Share story
            </button>
          </form>
        </section>
      </div>
    </>
  );
}

function Highlight({
  icon,
  title,
  detail,
}: {
  icon: ReactNode;
  title: string;
  detail: string;
}) {
  return (
    <li className="flex items-center gap-3">
      <span className="grid size-12 shrink-0 place-items-center rounded-full bg-[#f3eee6] text-[#c6a15a]">
        {icon}
      </span>
      <span>
        <span className="block text-sm font-semibold text-neutral-900">{title}</span>
        <span className="block text-xs text-neutral-500">{detail}</span>
      </span>
    </li>
  );
}

function TextField({
  label,
  name,
  value,
  onChange,
  placeholder,
  required,
  autoComplete,
}: {
  label: string;
  name: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  required?: boolean;
  autoComplete?: string;
}) {
  return (
    <label className="block text-sm font-medium text-neutral-800">
      <span>
        {label} {required ? <RequiredMark /> : null}
      </span>
      <input
        name={name}
        required={required}
        value={value}
        autoComplete={autoComplete}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
        className="mt-2 h-12 w-full rounded-lg border border-neutral-200 bg-white px-4 text-sm text-neutral-900 outline-none placeholder:text-neutral-400 focus:border-[#c6a15a]"
      />
    </label>
  );
}

function Stars({ rating, className = "" }: { rating: number; className?: string }) {
  return (
    <p className={`flex gap-1 text-[#c6a15a] ${className}`} aria-label={`${rating} out of 5 stars`}>
      {Array.from({ length: 5 }, (_, index) => (
        <svg
          key={index}
          viewBox="0 0 20 20"
          className={`size-4 ${index < rating ? "" : "opacity-30"}`}
          fill="currentColor"
          aria-hidden="true"
        >
          <path d="m10 1.8 2.1 4.6 5 .6-3.7 3.4.9 5-4.3-2.4L5.7 15.4l.9-5L2.9 7l5-.6L10 1.8Z" />
        </svg>
      ))}
    </p>
  );
}

function RequiredMark() {
  return (
    <span className="text-red-500" aria-hidden="true">
      *
    </span>
  );
}

function StarGlyph() {
  return (
    <svg viewBox="0 0 20 20" className="size-4" fill="currentColor" aria-hidden="true">
      <path d="m10 1.8 2.1 4.6 5 .6-3.7 3.4.9 5-4.3-2.4L5.7 15.4l.9-5L2.9 7l5-.6L10 1.8Z" />
    </svg>
  );
}

function ChevronIcon() {
  return (
    <svg viewBox="0 0 24 24" className="pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2 text-neutral-400" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true">
      <path d="m7 10 5 5 5-5" />
    </svg>
  );
}

function StarIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
      <path d="m12 3.5 2.2 4.8 5.2.6-3.9 3.5 1.1 5.2L12 15.1 7.4 17.6l1.1-5.2L4.6 8.9l5.2-.6L12 3.5Z" />
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

function SparkIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
      <path d="M12 3.5 13.4 9 19 10.5 13.4 12 12 17.5 10.6 12 5 10.5 10.6 9 12 3.5Z" />
    </svg>
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
