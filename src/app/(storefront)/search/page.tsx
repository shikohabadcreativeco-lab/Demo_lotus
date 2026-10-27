import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";
import { SearchQueryField } from "@/components/storefront/shop/search-query-field";
import { listShopCategories, searchProducts } from "@/lib/catalog";
import { getCategory } from "@/lib/categories";
import { formatPrice } from "@/lib/products";

export const metadata: Metadata = {
  title: "Search | Lotus Lights",
  description: "Search Lotus Lights by name, brand, price, and stock.",
};

type SearchQuery = {
  q?: string;
  category?: string;
  brand?: string;
  minPrice?: string;
  maxPrice?: string;
  inStock?: string;
  sort?: string;
  page?: string;
};

const sorts = [
  { value: "newest", label: "Newest" },
  { value: "price_low", label: "Price: low" },
  { value: "price_high", label: "Price: high" },
  { value: "name_asc", label: "Name A–Z" },
] as const;

const fieldClass =
  "mt-2 h-11 w-full rounded-xl border border-[#e6dccb] bg-white px-3 text-sm text-[#1c1917] outline-none placeholder:text-neutral-400 focus:border-[#c6a15a]";

export default function SearchPage({
  searchParams,
}: {
  searchParams: Promise<SearchQuery>;
}) {
  return (
    <Suspense fallback={<div className="mx-auto min-h-[50vh] w-full max-w-7xl px-4 py-12" />}>
      <SearchResults searchParams={searchParams} />
    </Suspense>
  );
}

async function SearchResults({
  searchParams,
}: {
  searchParams: Promise<SearchQuery>;
}) {
  const query = await searchParams;
  const search = (query.q ?? "").trim();
  const sort = query.sort || "newest";
  const [categories, results] = await Promise.all([
    listShopCategories(),
    searchProducts({
      search,
      category: query.category,
      brand: query.brand,
      minPrice: query.minPrice,
      maxPrice: query.maxPrice,
      inStock: query.inStock,
      sort,
      page: query.page,
      limit: "12",
    }),
  ]);
  const activeCategory = categories.find((category) => category.slug === query.category);

  const cards = results.products.map((product) => {
    const category = getCategory(product.categorySlug);
    const categoryName =
      categories.find((item) => item.slug === product.categorySlug)?.name ??
      category?.name ??
      "Lotus Lights";
    return { product, categoryName, photo: product.images[0] };
  });
  const featured = cards.length === 1 ? cards[0] : null;

  return (
    <section className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
      <p className="flex items-center gap-3 text-[11px] font-semibold tracking-[0.28em] text-[#c6a15a]">
        THE COLLECTION
        <span aria-hidden="true" className="h-px w-8 bg-[#c6a15a]" />
      </p>
      <div className="mt-3 flex flex-wrap items-end justify-between gap-3">
        <h1 className="text-3xl font-semibold tracking-tight text-[#1c1917] sm:text-4xl">
          {search ? `Results for “${search}”` : "All lights"}
        </h1>
        <p className="rounded-full border border-[#e6dccb] bg-white px-3.5 py-1.5 text-sm text-[#8a6a32]">
          {results.total} {results.total === 1 ? "light" : "lights"}
        </p>
      </div>

      <form autoComplete="off" action="/search" className="mt-7">
        <div className="flex items-center gap-2 rounded-2xl border border-[#e6dccb] bg-white p-1.5 pl-4 shadow-[0_10px_28px_rgba(28,25,23,0.05)] focus-within:border-[#c6a15a]">
          <SearchIcon />
          <SearchQueryField query={search} />
          <button
            type="submit"
            className="h-12 shrink-0 rounded-xl bg-[#1c1917] px-5 text-sm font-medium text-white hover:bg-[#2a2420]"
          >
            Search
          </button>
        </div>

        <div className="-mx-4 mt-5 flex gap-2 overflow-x-auto px-4 pb-1 [scrollbar-width:none] sm:mx-0 sm:px-0 [&::-webkit-scrollbar]:hidden">
          <CategoryChip href={searchHref({ ...query, category: undefined, page: undefined })} active={!query.category}>
            All
          </CategoryChip>
          {categories.map((category) => (
            <CategoryChip
              key={category.slug}
              href={searchHref({ ...query, category: category.slug, page: undefined })}
              active={query.category === category.slug}
            >
              {category.name}
            </CategoryChip>
          ))}
        </div>

        <div className="relative mt-4 overflow-hidden rounded-3xl border border-[#ece4d6] bg-white shadow-[0_16px_36px_rgba(28,25,23,0.04)]">
          <span aria-hidden="true" className="absolute inset-x-0 top-0 h-1 bg-[#c6a15a]" />
          <div className="grid gap-4 p-4 sm:grid-cols-2 sm:p-6 lg:grid-cols-[1.2fr_0.7fr_0.7fr_1fr_1fr_auto] lg:items-end">
            <label className="block text-[11px] font-semibold tracking-[0.18em] text-[#8a6a32]">
              BRAND
              <input
                name="brand"
                defaultValue={query.brand ?? ""}
                placeholder="Lotus Light"
                autoComplete="off"
                className={fieldClass}
              />
            </label>
            <label className="block text-[11px] font-semibold tracking-[0.18em] text-[#8a6a32]">
              MIN ₹
              <input
                name="minPrice"
                inputMode="numeric"
                defaultValue={query.minPrice ?? ""}
                placeholder="500"
                autoComplete="off"
                className={fieldClass}
              />
            </label>
            <label className="block text-[11px] font-semibold tracking-[0.18em] text-[#8a6a32]">
              MAX ₹
              <input
                name="maxPrice"
                inputMode="numeric"
                defaultValue={query.maxPrice ?? ""}
                placeholder="30000"
                autoComplete="off"
                className={fieldClass}
              />
            </label>
            <label className="block text-[11px] font-semibold tracking-[0.18em] text-[#8a6a32]">
              STOCK
              <select name="inStock" defaultValue={query.inStock ?? ""} className={fieldClass}>
                <option value="">Any stock</option>
                <option value="true">In stock</option>
                <option value="false">Out of stock</option>
              </select>
            </label>
            <label className="block text-[11px] font-semibold tracking-[0.18em] text-[#8a6a32]">
              SORT
              <select name="sort" defaultValue={sort} className={fieldClass}>
                {sorts.map((item) => (
                  <option key={item.value} value={item.value}>
                    {item.label}
                  </option>
                ))}
              </select>
            </label>
            <button
              type="submit"
              className="h-11 rounded-xl bg-[#1c1917] px-5 text-sm font-medium text-white hover:bg-[#2a2420]"
            >
              Apply
            </button>
          </div>
          {query.category ? <input type="hidden" name="category" value={query.category} /> : null}
        </div>
      </form>

      {activeCategory || query.brand || query.minPrice || query.maxPrice || query.inStock ? (
        <p className="mt-4 text-sm text-neutral-500">
          Showing {activeCategory ? activeCategory.name : "all categories"}
          {query.brand ? ` · ${query.brand}` : ""}
          {query.minPrice || query.maxPrice
            ? ` · ₹${query.minPrice || "0"}–₹${query.maxPrice || "any"}`
            : ""}
          {query.inStock === "true" ? " · In stock" : ""}
          {query.inStock === "false" ? " · Out of stock" : ""}
          {" · "}
          <Link href={search ? `/search?q=${encodeURIComponent(search)}` : "/search"} className="font-medium text-[#8a6a32] hover:text-[#6d5224]">
            Clear filters
          </Link>
        </p>
      ) : null}

      {cards.length === 0 ? (
        <div className="relative mt-10 overflow-hidden rounded-3xl border border-[#ece4d6] bg-white px-6 py-16 text-center shadow-[0_16px_36px_rgba(28,25,23,0.04)]">
          <span aria-hidden="true" className="absolute inset-x-0 top-0 h-1 bg-[#c6a15a]" />
          <h2 className="text-2xl font-semibold tracking-tight">No matching lights</h2>
          <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-neutral-500">
            Try a room, a finish, a brand, or a wider price range.
          </p>
          <Link
            href="/shop"
            className="mt-6 inline-flex h-11 items-center rounded-xl bg-[#1c1917] px-5 text-sm font-medium text-white hover:bg-[#2a2420]"
          >
            Browse categories
          </Link>
        </div>
      ) : featured ? (
        <Link
          href={`/shop/${featured.product.categorySlug}/${featured.product.slug}`}
          className="group mt-8 grid overflow-hidden rounded-3xl border border-[#ece4d6] bg-white shadow-[0_18px_40px_rgba(28,25,23,0.06)] lg:grid-cols-[1.15fr_0.85fr]"
        >
          <span className="relative block aspect-[4/3] overflow-hidden bg-[#f3eee6] lg:aspect-auto lg:min-h-[420px]">
            {featured.photo ? (
              <Image
                src={featured.photo.src}
                alt={featured.photo.alt}
                fill
                priority
                sizes="(min-width: 1024px) 55vw, 100vw"
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
            ) : null}
          </span>
          <span className="relative flex flex-col justify-center px-6 py-8 sm:px-8">
            <span aria-hidden="true" className="absolute inset-x-0 top-0 h-1 bg-[#c6a15a] lg:inset-x-auto lg:inset-y-0 lg:left-0 lg:h-auto lg:w-1" />
            <span className="text-[11px] font-semibold tracking-[0.22em] text-[#c6a15a]">
              {featured.categoryName.toUpperCase()}
            </span>
            <span className="mt-3 text-3xl font-semibold tracking-tight text-[#1c1917]">
              {featured.product.name}
            </span>
            {featured.product.description ? (
              <span className="mt-3 line-clamp-3 text-sm leading-6 text-neutral-500">
                {featured.product.description}
              </span>
            ) : null}
            <span className="mt-5 text-lg font-medium text-[#8a6a32]">
              {formatPrice(featured.product.price)}
              {featured.product.compareAt ? (
                <span className="ml-2 text-sm font-normal text-neutral-400 line-through">
                  {formatPrice(featured.product.compareAt)}
                </span>
              ) : null}
            </span>
            <span className="mt-6 inline-flex h-11 w-fit items-center rounded-xl bg-[#1c1917] px-5 text-sm font-medium text-white">
              View this light
            </span>
          </span>
        </Link>
      ) : (
        <ul className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {cards.map(({ product, categoryName, photo }) => (
            <li key={`${product.categorySlug}-${product.slug}`}>
              <Link
                href={`/shop/${product.categorySlug}/${product.slug}`}
                className="group relative block overflow-hidden rounded-3xl border border-[#ece4d6] bg-white shadow-[0_16px_36px_rgba(28,25,23,0.06)]"
              >
                <span aria-hidden="true" className="absolute inset-x-0 top-0 z-10 h-1 bg-[#c6a15a]" />
                <span className="relative block aspect-[4/3] overflow-hidden bg-[#f3eee6]">
                  {photo ? (
                    <Image
                      src={photo.src}
                      alt={photo.alt}
                      fill
                      sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : null}
                </span>
                <span className="block px-5 py-5">
                  <span className="block text-[11px] font-semibold tracking-[0.18em] text-[#c6a15a]">
                    {categoryName.toUpperCase()}
                  </span>
                  <span className="mt-1 block text-lg font-semibold text-[#1c1917]">{product.name}</span>
                  <span className="mt-2 block text-sm font-medium text-[#8a6a32]">
                    {formatPrice(product.price)}
                    {product.compareAt ? (
                      <span className="ml-2 text-xs font-normal text-neutral-400 line-through">
                        {formatPrice(product.compareAt)}
                      </span>
                    ) : null}
                  </span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}

      {results.pages > 1 ? (
        <nav className="mt-8 flex flex-wrap gap-2" aria-label="Search pages">
          {Array.from({ length: results.pages }, (_, index) => {
            const page = String(index + 1);
            const href = searchHref({ ...query, page });
            const current = results.page === index + 1;
            return (
              <Link
                key={page}
                href={href}
                aria-current={current ? "page" : undefined}
                className={`grid size-10 place-items-center rounded-full border text-sm ${
                  current
                    ? "border-[#c6a15a] bg-[#f6efe2] font-semibold text-[#8a6a32]"
                    : "border-neutral-200 bg-white text-neutral-700 hover:border-neutral-400"
                }`}
              >
                {page}
              </Link>
            );
          })}
        </nav>
      ) : null}
    </section>
  );
}

function CategoryChip({
  href,
  active,
  children,
}: {
  href: string;
  active: boolean;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className={`shrink-0 rounded-full px-4 py-2 text-sm ${
        active
          ? "bg-[#1c1917] font-medium text-white"
          : "border border-[#e6dccb] bg-white text-neutral-700 hover:border-[#c6a15a] hover:bg-[#fbf7ef]"
      }`}
    >
      {children}
    </Link>
  );
}

function SearchIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="size-5 shrink-0 text-[#c6a15a]"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
    >
      <circle cx="11" cy="11" r="6.5" />
      <path d="M16 16.5 20 20.5" />
    </svg>
  );
}

function searchHref(query: SearchQuery) {
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(query)) {
    if (value) params.set(key, value);
  }
  const search = params.toString();
  return search ? `/search?${search}` : "/search";
}
