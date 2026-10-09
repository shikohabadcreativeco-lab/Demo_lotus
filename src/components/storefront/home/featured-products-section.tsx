const products = ["Product 1", "Product 2", "Product 3", "Product 4"];

export function FeaturedProductsSection() {
  return (
    <section aria-labelledby="featured-heading" className="border-b border-foreground/15">
      <div className="mx-auto w-full max-w-6xl px-6 py-12">
        <h2 id="featured-heading" className="text-2xl font-semibold">
          Featured products
        </h2>
        <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {products.map((product) => (
            <li key={product} className="border border-foreground/15 p-6">
              <div className="mb-4 aspect-square border border-foreground/15" />
              <p>{product}</p>
              <p>Price</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
