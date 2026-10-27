"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState, type MouseEvent, type ReactNode } from "react";
import { publishedReviews } from "@/components/storefront/reviews/reviews-data";
import { addItem, FREE_SHIPPING_FROM } from "@/lib/cart-store";
import type { ProductCategory } from "@/lib/categories";
import { formatPrice, type Product, type ProductSpec } from "@/lib/products";

const specOrder = [
  "Body color",
  "Light color",
  "Finish",
  "Size",
  "Height",
  "Width",
  "Drop",
  "Diameter",
  "Material",
  "Watt",
  "Bulb",
  "Mount",
  "Set",
  "Brand",
];

const lightSwatches: Record<string, string> = {
  "warm white": "#f3d7a1",
  white: "#f4f4f2",
  "cool white": "#e7eef8",
  daylight: "#d5e4f7",
  amber: "#e39a3a",
  red: "#d64545",
  green: "#3aa76d",
  blue: "#3b6fd8",
  yellow: "#e2c04a",
  pink: "#e58aab",
  purple: "#7b5ea7",
  orange: "#e07a3d",
  rgb: "conic-gradient(#e24b4b, #e2c04a, #3aa76d, #3b6fd8, #e24b4b)",
};

export function ProductView({
  product,
  category,
}: {
  product: Product;
  category: ProductCategory;
}) {
  const router = useRouter();
  const reviewsRef = useRef<HTMLElement>(null);
  const photos =
    product.images.length > 0
      ? product.images
      : [{ src: category.image, alt: category.alt }];
  const reviews = publishedReviews.filter((review) => review.product === product.name);
  const rating =
    reviews.length === 0
      ? 0
      : reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length;
  const discount = discountPercent(product.price, product.compareAt);
  const inStock = product.stock !== 0;
  const maxQuantity = Math.min(9, product.stock && product.stock > 0 ? product.stock : 9);

  const [photo, setPhoto] = useState(0);
  const [fullView, setFullView] = useState(false);
  const [zooming, setZooming] = useState(false);
  const frameRef = useRef<HTMLDivElement>(null);
  const lensRef = useRef<HTMLSpanElement>(null);
  const zoomRef = useRef<HTMLDivElement>(null);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const [pin, setPin] = useState("");
  const [delivery, setDelivery] = useState<"ready" | "ok" | "bad">("ready");

  const current = photos[Math.min(photo, photos.length - 1)];
  const longDescription =
    product.details && product.details !== product.description ? product.details : "";
  const specs = orderedSpecs(product);
  const lights = lightColors(specs);
  const watts = wattOptions(specs);
  const [watt, setWatt] = useState("");
  const [light, setLight] = useState("");
  const chosenWatt = watts.includes(watt) ? watt : (watts[0] ?? "");
  const chosenLight = lights.includes(light) ? light : (lights[0] ?? "");
  const buyFacts = specs.filter(
    (spec) => spec.label !== "Light color" && spec.label !== "Brand" && spec.label !== "Watt",
  );

  function lineItem() {
    return {
      slug: product.slug,
      categorySlug: product.categorySlug,
      name: product.name,
      price: product.price,
      image: photos[0].src,
      alt: photos[0].alt,
      quantity,
      ...(chosenWatt ? { watt: chosenWatt } : {}),
      ...(chosenLight ? { lightColor: chosenLight } : {}),
    };
  }

  function openReviews() {
    reviewsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  useEffect(() => {
    if (!fullView) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setFullView(false);
      if (event.key === "ArrowRight") setPhoto((index) => (index + 1) % photos.length);
      if (event.key === "ArrowLeft") setPhoto((index) => (index - 1 + photos.length) % photos.length);
    };
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", onKey);
    };
  }, [fullView, photos.length]);

  function openFullView() {
    setZooming(false);
    setFullView(true);
  }

  function canZoom() {
    return window.matchMedia("(hover: hover) and (min-width: 1024px)").matches;
  }

  function hideZoom() {
    setZooming(false);
  }

  function moveZoom(event: MouseEvent<HTMLDivElement>) {
    if ((event.target as HTMLElement).closest("[data-full-view]")) {
      setZooming(false);
      return;
    }
    if (!canZoom()) {
      setZooming(false);
      return;
    }
    const frame = event.currentTarget.getBoundingClientRect();
    const lens = lensRef.current;
    const zoom = zoomRef.current;
    const photo = event.currentTarget.querySelector("img");
    if (!lens || !zoom || frame.width < 40 || frame.height < 40) return;

    const paneLeft = frame.right + 12;
    const paneTop = frame.top;
    const paneWidth = Math.max(window.innerWidth - paneLeft, 1);
    const paneHeight = Math.max(window.innerHeight - paneTop, 1);

    let lensWidth = frame.width * 0.38;
    let lensHeight = lensWidth * (paneHeight / paneWidth);
    if (lensHeight > frame.height) {
      lensHeight = frame.height;
      lensWidth = Math.min(frame.width, lensHeight * (paneWidth / paneHeight));
    }
    const x = Math.min(Math.max(event.clientX - frame.left - lensWidth / 2, 0), Math.max(frame.width - lensWidth, 0));
    const y = Math.min(Math.max(event.clientY - frame.top - lensHeight / 2, 0), Math.max(frame.height - lensHeight, 0));

    const naturalWidth = photo?.naturalWidth || frame.width;
    const naturalHeight = photo?.naturalHeight || frame.height;
    const frameAspect = frame.width / frame.height;
    const imageAspect = naturalWidth / naturalHeight;
    const coverWidth = imageAspect > frameAspect ? frame.height * imageAspect : frame.width;
    const coverHeight = imageAspect > frameAspect ? frame.height : frame.width / imageAspect;
    const cropX = (coverWidth - frame.width) / 2;
    const cropY = (coverHeight - frame.height) / 2;
    const scaleX = paneWidth / lensWidth;
    const scaleY = paneHeight / lensHeight;

    lens.style.width = `${lensWidth}px`;
    lens.style.height = `${lensHeight}px`;
    lens.style.transform = `translate(${x}px, ${y}px)`;
    zoom.style.left = `${paneLeft}px`;
    zoom.style.top = `${paneTop}px`;
    zoom.style.width = `${paneWidth}px`;
    zoom.style.height = `${paneHeight}px`;
    zoom.style.backgroundImage = `url("${photo?.currentSrc || current.src}")`;
    zoom.style.backgroundRepeat = "no-repeat";
    zoom.style.backgroundSize = `${coverWidth * scaleX}px ${coverHeight * scaleY}px`;
    zoom.style.backgroundPosition = `${-(cropX + x) * scaleX}px ${-(cropY + y) * scaleY}px`;
    setZooming(true);
  }

  function checkDelivery() {
    setDelivery(/^[1-9][0-9]{5}$/.test(pin) ? "ok" : "bad");
  }

  return (
    <article className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
      <nav aria-label="Breadcrumb" className="text-xs text-neutral-500">
        <ol className="flex flex-wrap items-center gap-2">
          <li>
            <Link href="/" className="hover:text-neutral-900">
              Home
            </Link>
          </li>
          <li aria-hidden="true">›</li>
          <li>
            <Link href="/shop" className="hover:text-neutral-900">
              Product
            </Link>
          </li>
          <li aria-hidden="true">›</li>
          <li className="text-neutral-700">{product.name}</li>
        </ol>
      </nav>

      <div className="relative mt-5 grid items-start gap-8 lg:grid-cols-[minmax(0,1.05fr)_minmax(300px,0.9fr)] lg:gap-12">
        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-start">
          <ul className="flex gap-2 sm:w-[72px] sm:flex-col">
            {photos.map((image, index) => (
              <li key={`${image.src}-${index}`} className="w-16 shrink-0 sm:w-full">
                <button
                  type="button"
                  aria-label={`Show photo ${index + 1}`}
                  aria-pressed={index === photo}
                  onMouseEnter={() => {
                    setPhoto(index);
                    setZooming(false);
                  }}
                  onFocus={() => setPhoto(index)}
                  onClick={() => setPhoto(index)}
                  className={`relative block aspect-square w-full cursor-pointer overflow-hidden rounded-xl bg-white ${
                    index === photo
                      ? "ring-2 ring-[#c6a15a]"
                      : "ring-1 ring-[#e6dccb] hover:ring-[#c6a15a]"
                  }`}
                >
                  <Image src={image.src} alt="" fill sizes="72px" className="object-cover" />
                </button>
              </li>
            ))}
          </ul>

          <div
            ref={frameRef}
            className="relative min-w-0 flex-1 overflow-hidden rounded-2xl bg-neutral-100 lg:cursor-crosshair"
            onMouseEnter={moveZoom}
            onMouseMove={moveZoom}
            onMouseLeave={hideZoom}
          >
            <div className="relative aspect-square sm:aspect-[5/4]">
              <Image
                src={current.src}
                alt={current.alt}
                fill
                priority
                sizes="(min-width: 1024px) 46vw, 100vw"
                className="pointer-events-none object-cover"
              />
              <button
                type="button"
                data-full-view
                onClick={openFullView}
                className="absolute inset-x-0 bottom-0 z-20 cursor-pointer bg-[#1c1917]/92 py-2.5 text-center text-xs font-medium tracking-wide text-white hover:bg-[#1c1917] sm:text-sm"
              >
                <span className="sm:hidden">Tap to see full view</span>
                <span className="hidden sm:inline">Click to see full view</span>
              </button>
            </div>
            <span
              ref={lensRef}
              aria-hidden="true"
              className={`pointer-events-none absolute top-0 left-0 z-10 border border-white/80 bg-white/30 ${
                zooming ? "hidden lg:block" : "hidden"
              }`}
            />
          </div>
        </div>
        {fullView ? (
          <FullView
            name={product.name}
            photos={photos}
            photo={photo}
            specs={specs}
            onSelect={setPhoto}
            onClose={() => setFullView(false)}
          />
        ) : null}
        <div
          ref={zoomRef}
          aria-hidden="true"
          className={`pointer-events-none fixed z-30 bg-white ${zooming ? "hidden lg:block" : "hidden"}`}
        />

        <div className="relative">
          <Link
            href={`/shop/${category.slug}`}
            className="text-xs font-semibold tracking-[0.14em] text-[#8a6a32] uppercase"
          >
            {category.name}
          </Link>
          <h1 className="mt-2 text-[1.65rem] font-bold tracking-tight text-neutral-950 sm:text-3xl">
            {product.name}
          </h1>

          {reviews.length > 0 ? (
            <button
              type="button"
              onClick={openReviews}
              className="mt-2 flex cursor-pointer items-center gap-2 text-sm text-neutral-500 hover:text-neutral-800"
            >
              <Stars value={rating} />
              <span>
                {rating.toFixed(1)} ({reviews.length} {reviews.length === 1 ? "review" : "reviews"})
              </span>
            </button>
          ) : null}

          <div className="mt-3 flex flex-wrap items-baseline gap-x-3 gap-y-1">
            <p className="text-3xl font-bold tracking-tight text-neutral-950">
              {formatPrice(product.price)}
            </p>
            {discount > 0 && product.compareAt ? (
              <>
                <p className="text-lg text-neutral-400 line-through">
                  {formatPrice(product.compareAt)}
                </p>
                <p className="text-sm font-bold tracking-wide text-[#e25b2a]">{discount}% OFF</p>
              </>
            ) : null}
          </div>

          {product.description ? (
            <p className="mt-4 max-w-md text-sm leading-6 text-neutral-600">{product.description}</p>
          ) : null}

          {watts.length > 0 ? (
            <div className="mt-5">
              <p id="watt-label" className="text-[11px] font-semibold tracking-[0.18em] text-[#8a6a32] uppercase">
                Watt
              </p>
              <div className="mt-2 flex flex-wrap gap-2" role="radiogroup" aria-labelledby="watt-label">
                {watts.map((option) => {
                  const selected = option === chosenWatt;
                  return (
                    <button
                      key={option}
                      type="button"
                      role="radio"
                      aria-checked={selected}
                      onClick={() => {
                        setWatt(option);
                        setAdded(false);
                      }}
                      className={`h-10 cursor-pointer rounded-full border px-4 text-sm font-medium ${
                        selected
                          ? "border-[#c6a15a] bg-[#1c1917] text-white"
                          : "border-[#e6dccb] bg-white text-neutral-800 hover:border-[#c6a15a]"
                      }`}
                    >
                      {option}
                    </button>
                  );
                })}
              </div>
            </div>
          ) : null}

          {lights.length > 0 ? (
            <div className="mt-5">
              <p id="light-label" className="text-[11px] font-semibold tracking-[0.18em] text-[#8a6a32] uppercase">
                Light color
              </p>
              <div className="mt-2 flex flex-wrap gap-2" role="radiogroup" aria-labelledby="light-label">
                {lights.map((name) => (
                  <LightChip
                    key={name}
                    name={name}
                    selected={name === chosenLight}
                    onSelect={() => {
                      setLight(name);
                      setAdded(false);
                    }}
                  />
                ))}
              </div>
            </div>
          ) : null}

          {buyFacts.length > 0 ? (
            <dl className="mt-5 grid max-w-md grid-cols-2 gap-x-6 gap-y-3 border-t border-neutral-200 pt-4">
              {buyFacts.map((spec) => (
                <div key={spec.label}>
                  <dt className="text-xs text-neutral-500">{spec.label}</dt>
                  <dd className="mt-0.5 text-sm font-medium text-neutral-900">{spec.value}</dd>
                </div>
              ))}
            </dl>
          ) : null}

          <div className="mt-5">
            <p id="quantity-label" className="text-sm font-medium text-neutral-800">
              Quantity:
            </p>
            <div className="mt-2 flex flex-wrap items-center gap-4">
            <div
              className="flex h-11 items-center rounded-lg border border-neutral-200 bg-white"
              aria-labelledby="quantity-label"
            >
              <button
                type="button"
                aria-label="Decrease quantity"
                className="grid h-11 w-11 cursor-pointer place-items-center text-lg text-neutral-600 hover:text-neutral-950"
                onClick={() => setQuantity((value) => Math.max(1, value - 1))}
              >
                −
              </button>
              <span
                className="grid h-11 w-10 place-items-center border-x border-neutral-200 text-sm font-medium"
                aria-live="polite"
              >
                {quantity}
              </span>
              <button
                type="button"
                aria-label="Increase quantity"
                className="grid h-11 w-11 cursor-pointer place-items-center text-lg text-neutral-600 hover:text-neutral-950"
                onClick={() => setQuantity((value) => Math.min(maxQuantity, value + 1))}
              >
                +
              </button>
            </div>
            <p className={`flex items-center gap-2 text-sm font-medium ${inStock ? "text-emerald-600" : "text-red-600"}`}>
              <span className={`size-2 rounded-full ${inStock ? "bg-emerald-500" : "bg-red-500"}`} />
              {inStock ? "In Stock" : "Out of stock"}
            </p>
            </div>
          </div>

            <div className="mt-5 grid grid-cols-1 gap-3 min-[420px]:grid-cols-2">
            <button
              type="button"
              disabled={!inStock}
              className="h-12 cursor-pointer rounded-lg border border-[#c6a15a] bg-white text-sm font-medium text-[#8a6a32] transition-colors hover:bg-[#fbf7ef] disabled:cursor-not-allowed disabled:opacity-50"
              onClick={() => {
                addItem(lineItem());
                setAdded(true);
              }}
            >
              Add to Cart
            </button>
            <button
              type="button"
              disabled={!inStock}
              className="h-12 cursor-pointer rounded-lg bg-[#c6a15a] text-sm font-medium text-white transition-colors hover:bg-[#b69048] disabled:cursor-not-allowed disabled:opacity-50"
              onClick={() => {
                addItem(lineItem());
                router.push("/checkout");
              }}
            >
              Buy Now
            </button>
          </div>
          {added ? (
            <p className="mt-3 text-sm text-neutral-600" role="status">
              Added to your cart.{" "}
              <Link href="/cart" className="font-medium text-[#8a6a32] hover:text-[#6d5224]">
                View cart
              </Link>
            </p>
          ) : null}

          <form
            className="mt-4 rounded-xl border border-neutral-200 bg-white px-4 py-3"
            onSubmit={(event) => {
              event.preventDefault();
              checkDelivery();
            }}
          >
            <div className="flex flex-wrap items-center gap-3">
              <label htmlFor="pincode" className="text-sm font-medium text-neutral-800">
                Check Delivery
              </label>
              <input
                id="pincode"
                inputMode="numeric"
                autoComplete="postal-code"
                maxLength={6}
                value={pin}
                placeholder="Pincode"
                onChange={(event) => {
                  setPin(event.target.value.replace(/\D/g, "").slice(0, 6));
                  setDelivery("ready");
                }}
                className="ml-auto h-9 w-28 rounded-md border border-neutral-200 px-3 text-sm outline-none placeholder:text-neutral-400 focus:border-[#c6a15a]"
              />
              <button
                type="submit"
                className="h-9 cursor-pointer rounded-md border border-[#c6a15a] px-3 text-sm font-medium text-[#8a6a32] hover:bg-[#fbf7ef]"
              >
                Check
              </button>
            </div>
            {delivery === "bad" ? (
              <p className="mt-3 text-sm text-red-600" role="status">
                Enter a 6-digit pincode to check delivery.
              </p>
            ) : (
              <p className="mt-3 flex items-center gap-2 text-sm text-emerald-600" role="status">
                <span className="size-2 rounded-full bg-emerald-500" />
                {delivery === "ok"
                  ? `Delivery available to ${pin} in 3–5 business days`
                  : "Delivered in 3–5 business days"}
              </p>
            )}
          </form>
        </div>
      </div>

      <ul className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <TrustCard
          icon={<TruckIcon />}
          title="Free Shipping"
          detail={`on orders above ${formatPrice(FREE_SHIPPING_FROM)}`}
        />
        <TrustCard icon={<ShieldIcon />} title="1 Year Warranty" detail="Premium Quality" />
        <TrustCard icon={<ReturnIcon />} title="7 Days Return" detail="Easy & Hassle free" />
        <TrustCard icon={<LockIcon />} title="Secure Payment" detail="100% Safe & Secure" />
      </ul>

      {longDescription || specs.length > 0 ? (
        <div
          className={`mt-10 grid gap-6 ${longDescription && specs.length > 0 ? "lg:grid-cols-2" : ""}`}
        >
          {longDescription ? (
            <section className="rounded-3xl border border-[#ece4d6] bg-white px-5 py-6 shadow-[0_12px_32px_rgba(28,25,23,0.04)] sm:px-6">
              <h2 className="text-lg font-semibold tracking-tight text-neutral-950">About this light</h2>
              <p className="mt-3 text-sm leading-7 text-neutral-600">{longDescription}</p>
            </section>
          ) : null}
          {specs.length > 0 ? (
            <section className="rounded-3xl border border-[#ece4d6] bg-white px-5 py-6 shadow-[0_12px_32px_rgba(28,25,23,0.04)] sm:px-6">
              <h2 className="text-lg font-semibold tracking-tight text-neutral-950">Specifications</h2>
              <dl className="mt-4 divide-y divide-[#f3eee6]">
                {specs.map((spec) => (
                  <div key={spec.label} className="grid grid-cols-1 gap-1 py-3 text-sm sm:grid-cols-[9rem_minmax(0,1fr)] sm:items-center sm:gap-4">
                    <dt className="text-neutral-500">{spec.label}</dt>
                    <dd className="font-medium text-neutral-900">
                      {spec.label === "Light color" ? (
                        <ul className="flex flex-wrap gap-2">
                          {lightColors([spec]).map((name) => (
                            <li key={name}>
                              <LightChip name={name} />
                            </li>
                          ))}
                        </ul>
                      ) : (
                        spec.value
                      )}
                    </dd>
                  </div>
                ))}
              </dl>
            </section>
          ) : null}
        </div>
      ) : null}

      {reviews.length > 0 ? (
        <section ref={reviewsRef} className="mt-8 scroll-mt-24">
          <h2 className="text-lg font-semibold tracking-tight text-neutral-950">Reviews</h2>
          <ul className="mt-4 grid gap-3">
            {reviews.map((review) => (
              <li key={review.id} className="rounded-xl border border-neutral-200 bg-white px-4 py-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="text-sm font-semibold text-neutral-900">
                    {review.name}
                    <span className="font-normal text-neutral-500"> · {review.city}</span>
                  </p>
                  <Stars value={review.rating} />
                </div>
                <p className="mt-2 text-sm leading-6 text-neutral-600">{review.quote}</p>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

    </article>
  );
}

function TrustCard({
  icon,
  title,
  detail,
}: {
  icon: ReactNode;
  title: string;
  detail: string;
}) {
  return (
    <li className="flex items-center gap-3 rounded-2xl border border-[#ece4d6] bg-white px-4 py-4 shadow-[0_10px_24px_rgba(28,25,23,0.04)]">
      <span className="grid size-10 shrink-0 place-items-center rounded-full bg-[#fbf7ef] text-[#c6a15a]">{icon}</span>
      <span>
        <span className="block text-sm font-semibold text-neutral-900">{title}</span>
        <span className="block text-xs text-neutral-500">{detail}</span>
      </span>
    </li>
  );
}

function Stars({ value }: { value: number }) {
  return (
    <span className="flex items-center gap-0.5" aria-hidden="true">
      {Array.from({ length: 5 }, (_, index) => {
        const fill = Math.max(0, Math.min(1, value - index));
        return (
          <span key={index} className="relative inline-block size-[18px]">
            <StarGlyph className="text-neutral-200" />
            <span className="absolute inset-y-0 left-0 overflow-hidden" style={{ width: `${fill * 100}%` }}>
              <StarGlyph className="text-[#e8b423]" />
            </span>
          </span>
        );
      })}
    </span>
  );
}

function StarGlyph({ className }: { className: string }) {
  return (
    <svg viewBox="0 0 20 20" className={`size-[18px] ${className}`} fill="currentColor" aria-hidden="true">
      <path d="m10 1.8 2.1 4.7 5.1.6-3.8 3.5.9 5.1L10 13.4 5.7 15.7l.9-5.1L2.8 7.1l5.1-.6L10 1.8Z" />
    </svg>
  );
}

function TruckIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-7" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
      <path d="M3 7h11v8H3zM14 10h4l3 3v2h-7" strokeLinejoin="round" />
      <circle cx="7" cy="17.5" r="1.5" />
      <circle cx="17" cy="17.5" r="1.5" />
    </svg>
  );
}

function ShieldIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-7" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
      <path d="M12 3.5 19 6.5v5.2c0 4.2-2.8 6.8-7 8.3-4.2-1.5-7-4.1-7-8.3V6.5L12 3.5Z" />
      <path d="m8.8 12 2.1 2.1 4.3-4.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ReturnIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-7" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
      <path d="M8 8H5V5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M5.2 8A7.5 7.5 0 1 1 6 16.5" strokeLinecap="round" />
    </svg>
  );
}

function LockIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-7" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
      <rect x="5" y="10" width="14" height="10" rx="2" />
      <path d="M8 10V8a4 4 0 0 1 8 0v2" strokeLinecap="round" />
    </svg>
  );
}

function discountPercent(price: number, compareAt?: number) {
  if (!compareAt || compareAt <= price) return 0;
  return Math.round((1 - price / compareAt) * 100);
}

function orderedSpecs(product: Product): ProductSpec[] {
  const specs = product.specs.filter((spec) => spec.value.trim());
  const hasBody = specs.some((spec) => spec.label === "Body color");
  const mapped = specs
    .filter((spec) => !(hasBody && spec.label === "Color"))
    .map((spec) => (spec.label === "Color" ? { label: "Body color", value: spec.value } : spec));
  const rank = (label: string) => {
    const index = specOrder.indexOf(label);
    return index === -1 ? specOrder.length : index;
  };
  return [...mapped].sort((left, right) => rank(left.label) - rank(right.label));
}

function wattOptions(specs: ProductSpec[]) {
  const value = specs.find((spec) => spec.label === "Watt")?.value ?? "";
  const options = value
    .split(",")
    .map((item) => item.trim().toUpperCase().replace(/\s+/g, ""))
    .filter((item) => /^\d{1,3}W$/.test(item))
    .map((item) => `${parseInt(item, 10)}W`);
  return [...new Set(options)].sort((left, right) => parseInt(left, 10) - parseInt(right, 10));
}

function lightColors(specs: ProductSpec[]) {
  const value = specs.find((spec) => spec.label === "Light color")?.value ?? "";
  return value
    .split(",")
    .map((name) => name.trim())
    .filter(Boolean);
}

function LightChip({
  name,
  selected = false,
  onSelect,
}: {
  name: string;
  selected?: boolean;
  onSelect?: () => void;
}) {
  const swatch = lightSwatches[name.toLowerCase()] ?? "#e7e2d8";
  const className = `inline-flex items-center gap-2 rounded-full border px-2.5 py-1 text-sm ${
    selected
      ? "border-[#c6a15a] bg-[#1c1917] text-white"
      : "border-[#e6dccb] bg-white text-neutral-800"
  } ${onSelect ? "cursor-pointer hover:border-[#c6a15a]" : ""}`;
  const dot = (
    <span
      className="size-3.5 rounded-full ring-1 ring-black/10"
      style={swatch.includes("gradient") ? { backgroundImage: swatch } : { backgroundColor: swatch }}
    />
  );
  if (!onSelect) {
    return (
      <span className={className}>
        {dot}
        {name}
      </span>
    );
  }
  return (
    <button type="button" role="radio" aria-checked={selected} onClick={onSelect} className={className}>
      {dot}
      {name}
    </button>
  );
}

function FullView({
  name,
  photos,
  photo,
  specs,
  onSelect,
  onClose,
}: {
  name: string;
  photos: Product["images"];
  photo: number;
  specs: ProductSpec[];
  onSelect: (index: number) => void;
  onClose: () => void;
}) {
  const current = photos[Math.min(photo, photos.length - 1)];
  const facts = specs.filter((spec) => spec.label !== "Brand").slice(0, 5);

  return (
    <div className="fixed inset-0 z-[80] flex items-end justify-center bg-black/70 sm:items-center sm:p-6" onClick={onClose}>
      <div
        role="dialog"
        aria-modal="true"
        aria-label={`${name} full view`}
        onClick={(event) => event.stopPropagation()}
        className="relative flex h-full w-full max-w-6xl flex-col overflow-hidden bg-white shadow-[0_24px_80px_rgba(0,0,0,0.28)] sm:h-[min(820px,92vh)] sm:rounded-xl lg:flex-row"
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close full view"
          className="absolute top-3 right-3 z-10 grid size-9 cursor-pointer place-items-center rounded-full text-2xl leading-none text-neutral-500 hover:bg-neutral-100 hover:text-neutral-950"
        >
          ×
        </button>
        <div className="relative min-h-0 flex-1 bg-white p-4 sm:p-8">
          <Image
            src={current.src}
            alt={current.alt}
            fill
            sizes="(min-width: 1024px) 70vw, 100vw"
            className="object-contain"
          />
        </div>
        <aside className="flex max-h-[40vh] w-full shrink-0 flex-col gap-4 overflow-y-auto border-t border-neutral-100 px-5 py-5 lg:max-h-none lg:w-80 lg:border-t-0 lg:border-l lg:px-6 lg:py-8">
          <h2 className="pr-8 text-base font-semibold leading-6 text-neutral-950">{name}</h2>
          {facts.length > 0 ? (
            <dl className="space-y-1.5 text-sm leading-6 text-neutral-600">
              {facts.map((spec) => (
                <div key={spec.label}>
                  <dt className="inline font-medium text-neutral-800">{spec.label}: </dt>
                  <dd className="inline">{spec.value}</dd>
                </div>
              ))}
            </dl>
          ) : null}
          <ul className="grid grid-cols-4 gap-2 lg:grid-cols-3">
            {photos.map((image, index) => (
              <li key={`${image.src}-full-${index}`}>
                <button
                  type="button"
                  aria-label={`Show photo ${index + 1}`}
                  aria-pressed={index === photo}
                  onClick={() => onSelect(index)}
                  className={`relative block aspect-square w-full cursor-pointer overflow-hidden rounded-md bg-neutral-50 ${
                    index === photo ? "ring-2 ring-[#c6a15a]" : "ring-1 ring-[#e6dccb] hover:ring-[#c6a15a]"
                  }`}
                >
                  <Image src={image.src} alt="" fill sizes="88px" className="object-cover" />
                </button>
              </li>
            ))}
          </ul>
        </aside>
      </div>
    </div>
  );
}
