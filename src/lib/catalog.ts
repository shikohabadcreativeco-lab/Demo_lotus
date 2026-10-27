import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { connection } from "next/server";
import { getCategory, productCategories } from "@/lib/categories";
import {
  products as seedProducts,
  type Product,
  type ProductImage,
  type ProductSpec,
} from "@/lib/products";
import {
  fetchCategories,
  fetchCategory,
  fetchProduct,
  fetchProducts,
  type ProductQuery,
  type StoreCategory,
  type StoreProduct,
} from "@/lib/store-api";

const storePath = path.join(process.cwd(), ".data", "products.json");

export type NewProduct = {
  name: string;
  categorySlug: string;
  price: number;
  description: string;
  details: string;
  stock: number;
  images: ProductImage[];
  specs: ProductSpec[];
};

let writeChain: Promise<void> = Promise.resolve();

export async function listProducts() {
  const page = await fetchProducts({ limit: "100" });
  if (page) return page.products;
  return localProducts();
}

export async function listAdminProducts() {
  const page = await fetchProducts({ limit: "100", includeInactive: true });
  if (page) return { products: page.products, source: "api" as const };
  return { products: await localProducts(), source: "local" as const };
}

export async function listShopCategories(): Promise<StoreCategory[]> {
  const categories = await fetchCategories(false);
  if (categories) return categories.filter((category) => category.isActive !== false);
  return productCategories.map((category) => ({ ...category, isActive: true }));
}

export async function listAdminCategories() {
  const categories = await fetchCategories(true);
  if (categories) return { categories, source: "api" as const };
  return {
    categories: productCategories.map((category) => ({ ...category, isActive: true })),
    source: "local" as const,
  };
}

export async function findShopCategory(slug: string) {
  const remote = await fetchCategory(slug);
  if (remote) return remote;
  return getCategory(slug) ?? null;
}

export async function searchProducts(query: ProductQuery) {
  const page = await fetchProducts({ ...query, limit: query.limit || "12" });
  if (page) return { ...page, source: "api" as const };

  const products = filterLocal(await localProducts(), query);
  const pageNumber = positive(query.page);
  const limit = positive(query.limit || "12");
  const start = (pageNumber - 1) * limit;
  return {
    products: products.slice(start, start + limit),
    total: products.length,
    page: pageNumber,
    pages: Math.max(1, Math.ceil(products.length / limit)),
    source: "local" as const,
  };
}

export async function listProductsByCategory(categorySlug: string) {
  const page = await fetchProducts({ category: categorySlug, limit: "100" });
  if (page) return page.products;
  const catalog = await localProducts();
  return catalog.filter((product) => product.categorySlug === categorySlug);
}

export async function lookupProduct(categorySlug: string, slug: string) {
  const remote = await fetchProduct(slug);
  if (remote && remote.categorySlug === categorySlug) return remote;
  if (remote) return undefined;
  return localLookup(categorySlug, slug);
}

export async function findProduct(categorySlug: string, slug: string) {
  await connection();
  return lookupProduct(categorySlug, slug);
}

export function addProduct(input: NewProduct) {
  const run = writeChain.then(() => insertProduct(input));
  writeChain = run.then(
    () => undefined,
    () => undefined,
  );
  return run;
}

async function insertProduct(input: NewProduct): Promise<{ product?: Product; error?: string }> {
  const name = input.name.trim();
  const description = input.description.trim();
  const details = input.details.trim();

  if (name.length < 2) return { error: "Enter the product name." };
  if (!getCategory(input.categorySlug)) return { error: "Choose a category." };
  if (!Number.isInteger(input.price) || input.price < 1) {
    return { error: "Enter a price in rupees." };
  }
  if (description.length < 8) return { error: "Add a short description." };
  if (!Number.isInteger(input.stock) || input.stock < 0) {
    return { error: "Enter how many are in stock." };
  }
  if (input.images.length < 1 || input.images.length > 5) {
    return { error: "Add between 1 and 5 photos." };
  }
  if (input.images.some((image) => !image.src.startsWith("/uploads/products/"))) {
    return { error: "Add a product photo." };
  }

  const added = await readAdded();
  const product: Product = {
    slug: uniqueSlug(name, [...seedProducts, ...added]),
    name,
    categorySlug: input.categorySlug,
    price: input.price,
    description,
    details: details || description,
    images: input.images.map((image) => ({
      src: image.src,
      alt: image.alt.trim() || name,
    })),
    specs: input.specs
      .map((spec) => ({ label: spec.label.trim(), value: spec.value.trim() }))
      .filter((spec) => spec.label && spec.value),
    stock: input.stock,
  };

  added.push(product);
  await writeAdded(added);
  return { product };
}

async function localProducts(): Promise<StoreProduct[]> {
  await connection();
  const added = await readAdded();
  return [...seedProducts, ...added];
}

async function localLookup(categorySlug: string, slug: string) {
  const seeded = seedProducts.find(
    (product) => product.categorySlug === categorySlug && product.slug === slug,
  );
  if (seeded) return seeded;
  const added = await readAdded();
  return added.find((product) => product.categorySlug === categorySlug && product.slug === slug);
}

function filterLocal(products: Product[], query: ProductQuery) {
  const words = (query.search ?? "").toLowerCase().split(/\s+/).filter(Boolean);
  const minPrice = numeric(query.minPrice);
  const maxPrice = numeric(query.maxPrice);

  return products
    .filter((product) => {
      if (query.category && product.categorySlug !== query.category) return false;
      if (query.brand) {
        const brand = product.specs.find((spec) => spec.label.toLowerCase() === "brand")?.value ?? "Lotus Light";
        if (brand.toLowerCase() !== query.brand.toLowerCase()) return false;
      }
      if (minPrice !== null && product.price < minPrice) return false;
      if (maxPrice !== null && product.price > maxPrice) return false;
      if (query.inStock === "true" && product.stock === 0) return false;
      if (query.inStock === "false" && product.stock !== 0) return false;
      if (words.length === 0) return true;
      const category = getCategory(product.categorySlug)?.name ?? "";
      const specs = product.specs.map((spec) => `${spec.label} ${spec.value}`).join(" ");
      const haystack = `${product.name} ${product.description} ${product.details} ${category} ${specs}`.toLowerCase();
      return words.every((word) => haystack.includes(word));
    })
    .sort((left, right) => compareProducts(left, right, query.sort));
}

function compareProducts(left: Product, right: Product, sort?: string) {
  if (sort === "price_low") return left.price - right.price;
  if (sort === "price_high") return right.price - left.price;
  if (sort === "name_asc") return left.name.localeCompare(right.name);
  return 0;
}

function positive(value: string | undefined) {
  const parsed = Number.parseInt(value ?? "", 10);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : 1;
}

function numeric(value: string | undefined) {
  if (!value || !/^\d+$/.test(value)) return null;
  return Number(value);
}

function uniqueSlug(name: string, existing: Product[]) {
  const base =
    name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 60) || "product";
  const taken = new Set(existing.map((product) => product.slug));
  if (!taken.has(base)) return base;
  let count = 2;
  while (taken.has(`${base}-${count}`)) count += 1;
  return `${base}-${count}`;
}

async function readAdded(): Promise<Product[]> {
  try {
    const raw = await readFile(storePath, "utf8");
    const parsed = JSON.parse(raw) as { products?: Product[] };
    return Array.isArray(parsed.products) ? parsed.products : [];
  } catch {
    return [];
  }
}

async function writeAdded(products: Product[]) {
  await mkdir(path.dirname(storePath), { recursive: true });
  await writeFile(storePath, JSON.stringify({ products }, null, 2));
}
