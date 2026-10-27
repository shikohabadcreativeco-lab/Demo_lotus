import Image from "next/image";
import Link from "next/link";
import type { ProductCategory } from "@/lib/categories";

export function CategoryIndex({ categories }: { categories: ProductCategory[] }) {
  return (
    <>
      <section className="relative min-h-[300px] overflow-hidden sm:min-h-[340px]">
        <Image
          src="/images/home/living-room.jpg"
          alt="Warmly lit living room"
          fill
          priority
          sizes="100vw"
          className="object-cover object-[70%_center]"
        />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(12,10,8,0.88)_0%,rgba(12,10,8,0.62)_42%,rgba(12,10,8,0.22)_100%)]" />
        <div className="relative mx-auto flex min-h-[300px] w-full max-w-7xl items-center px-6 py-12 sm:min-h-[340px] sm:px-10">
          <div className="max-w-xl">
            <nav aria-label="Breadcrumb" className="text-xs text-white/70">
              <ol className="flex items-center gap-2">
                <li>
                  <Link href="/" className="hover:text-white">
                    Home
                  </Link>
                </li>
                <li aria-hidden="true">›</li>
                <li className="text-white">Product</li>
              </ol>
            </nav>
            <p className="mt-6 flex items-center gap-3 text-[11px] font-semibold tracking-[0.28em] text-[#e6c48a]">
              PRODUCT CATEGORY
              <span aria-hidden="true" className="h-px w-10 bg-[#e6c48a]" />
            </p>
            <h1 className="mt-3 text-4xl font-semibold tracking-tight text-white sm:text-5xl">
              Shop by
              <br />
              category
            </h1>
            <p className="mt-4 max-w-md text-sm leading-6 text-white/80">
              Table lamps, pendants, wall lights, and more. Choose a category,
              then pick a light once it is listed.
            </p>
          </div>
        </div>
      </section>

      <section aria-labelledby="categories-heading" className="mx-auto w-full max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-16">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 id="categories-heading" className="text-3xl font-semibold tracking-tight">
              Product categories
            </h2>
            <p className="mt-2 max-w-xl text-sm leading-6 text-neutral-500">
              Browse the Lotus Lights collection. Open a category to see the lights listed there.
            </p>
          </div>
          <p className="text-sm font-medium text-[#8a6a32]">
            {categories.length} categories
          </p>
        </div>

        <ul className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((category) => (
            <li key={category.slug}>
              <Link href={`/shop/${category.slug}`} className="group block">
                <span className="relative block aspect-[4/3] overflow-hidden rounded-3xl shadow-[0_16px_36px_rgba(28,25,23,0.1)]">
                  <Image
                    src={category.image}
                    alt={category.alt}
                    fill
                    sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <span className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/15 to-transparent" />
                  <span className="absolute inset-x-0 bottom-0 p-5 text-white">
                    <span className="text-[11px] font-semibold tracking-[0.22em] text-[#e6c48a]">
                      CATEGORY
                    </span>
                    <span className="mt-1 block text-2xl font-semibold tracking-tight">
                      {category.name}
                    </span>
                  </span>
                </span>
                <span className="mt-3 block text-sm leading-6 text-neutral-500">
                  {category.summary}
                </span>
                <span className="mt-2 inline-flex items-center gap-2 text-sm font-medium text-[#8a6a32] transition-colors group-hover:text-[#6d5224]">
                  View category
                  <span aria-hidden="true">→</span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}
