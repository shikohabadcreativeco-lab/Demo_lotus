import Image from "next/image";
import Link from "next/link";
import type { ProductCategory } from "@/lib/categories";
import { formatPrice, type Product } from "@/lib/products";

export function CategoryDetail({
  category,
  products,
  others,
}: {
  category: ProductCategory;
  products: Product[];
  others: ProductCategory[];
}) {
  const listed = products;

  return (
    <>
      <section className="relative min-h-[280px] overflow-hidden sm:min-h-[320px]">
        <Image
          src="/images/shop/category-hero.jpg"
          alt="A brass lamp lighting a quiet evening room"
          fill
          priority
          sizes="100vw"
          className="object-cover object-[center_40%]"
        />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(12,10,8,0.88)_0%,rgba(12,10,8,0.55)_46%,rgba(12,10,8,0.2)_100%)]" />
        <div className="relative mx-auto flex min-h-[280px] w-full max-w-7xl items-center px-6 py-12 sm:min-h-[320px] sm:px-10">
          <div className="max-w-xl">
            <nav aria-label="Breadcrumb" className="text-xs text-white/70">
              <ol className="flex flex-wrap items-center gap-2">
                <li>
                  <Link href="/" className="hover:text-white">
                    Home
                  </Link>
                </li>
                <li aria-hidden="true">›</li>
                <li>
                  <Link href="/shop" className="hover:text-white">
                    Product
                  </Link>
                </li>
                <li aria-hidden="true">›</li>
                <li className="text-white">{category.name}</li>
              </ol>
            </nav>
            <p className="mt-6 text-[11px] font-semibold tracking-[0.28em] text-[#e6c48a]">
              PRODUCT CATEGORY
            </p>
            <h1 className="mt-3 text-4xl font-semibold tracking-tight text-white sm:text-5xl">
              {category.name}
            </h1>
            <p className="mt-4 max-w-md text-sm leading-6 text-white/80">{category.summary}</p>
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        {listed.length > 0 ? (
          <ul className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {listed.map((product) => {
              const photo = product.images[0] ?? { src: category.image, alt: category.alt };
              return (
                <li key={product.slug}>
                  <Link
                    href={`/shop/${category.slug}/${product.slug}`}
                    className="group block overflow-hidden rounded-3xl border border-[#ece4d6] bg-white shadow-[0_16px_36px_rgba(28,25,23,0.06)]"
                  >
                    <span className="relative block aspect-square overflow-hidden bg-[#f6f3ee]">
                      <Image
                        src={photo.src}
                        alt={photo.alt}
                        fill
                        sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    </span>
                    <span className="block px-4 py-4">
                      <span className="text-[11px] font-semibold tracking-[0.18em] text-[#c6a15a]">
                        {category.name.toUpperCase()}
                      </span>
                      <span className="mt-1 block text-base font-semibold text-neutral-900">
                        {product.name}
                      </span>
                      <span className="mt-1 block text-sm font-medium text-[#8a6a32]">
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
              );
            })}
          </ul>
        ) : (
          <div className="rounded-3xl border border-[#e6dccb] bg-white px-6 py-12 text-center shadow-[0_12px_32px_rgba(40,32,20,0.05)] sm:px-10">
            <span className="mx-auto grid size-14 place-items-center rounded-full bg-[#f6f1e8] text-[#c6a15a]">
              <LampIcon />
            </span>
            <h2 className="mt-5 text-2xl font-semibold tracking-tight">No lights listed yet</h2>
            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-neutral-500">
              {category.detail}
            </p>
            <Link
              href="/shop"
              className="mt-6 inline-flex h-11 items-center justify-center rounded-lg bg-[#c6a15a] px-5 text-sm font-medium text-white transition-colors hover:bg-[#b69048]"
            >
              All categories
            </Link>
          </div>
        )}

        <div className="mt-14">
          <h2 className="text-2xl font-semibold tracking-tight">Other categories</h2>
          <ul className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-5">
            {others.map((item) => (
              <li key={item.slug}>
                <Link href={`/shop/${item.slug}`} className="group block">
                  <span className="relative block aspect-[4/3] overflow-hidden rounded-2xl">
                    <Image
                      src={item.image}
                      alt={item.alt}
                      fill
                      sizes="(min-width: 1024px) 18vw, 50vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </span>
                  <span className="mt-2 block text-sm font-semibold text-neutral-800">
                    {item.name}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}

function LampIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-7" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
      <path d="M8 10.5h8l-1.2 4.2H9.2L8 10.5Z" />
      <path d="M12 14.7V18" />
      <path d="M9 18.5h6" />
      <path d="M12 4.5v3" />
    </svg>
  );
}
