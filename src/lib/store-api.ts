import { cookies } from "next/headers";
import { connection } from "next/server";
import type { ProductCategory } from "@/lib/categories";
import type { Product, ProductImage, ProductSpec } from "@/lib/products";

const apiUrl = process.env.API_URL ?? "https://lotus-light-backend.vercel.app";

export type StoreCategory = ProductCategory & {
  id?: string;
  isActive?: boolean;
};

export type StoreProduct = Product & {
  id?: string;
  brand?: string;
  categoryName?: string;
  isActive?: boolean;
};

export type ProductQuery = {
  search?: string;
  category?: string;
  brand?: string;
  minPrice?: string;
  maxPrice?: string;
  inStock?: string;
  sort?: string;
  page?: string;
  limit?: string;
  includeInactive?: boolean;
};

export type ProductPage = {
  products: StoreProduct[];
  total: number;
  page: number;
  pages: number;
};

export async function fetchCategories(includeInactive = false) {
  const params = new URLSearchParams();
  if (includeInactive) params.set("includeInactive", "true");
  const payload = await getJson(`/api/categories${params.size ? `?${params}` : ""}`);
  if (!payload || !Array.isArray(payload.data)) return null;
  return payload.data.map(mapCategory).filter((category) => category.slug);
}

export async function fetchCategory(idOrSlug: string) {
  const payload = await getJson(`/api/categories/${encodeURIComponent(idOrSlug)}`);
  if (!payload) return null;
  if (payload.status === 404) return undefined;
  if (!payload.data || Array.isArray(payload.data)) return null;
  return mapCategory(payload.data);
}

export async function fetchProducts(query: ProductQuery = {}): Promise<ProductPage | null> {
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(query)) {
    if (key === "includeInactive") continue;
    if (typeof value === "string" && value.trim()) params.set(key, value.trim());
  }
  if (query.includeInactive) params.set("includeInactive", "true");
  if (!params.has("limit")) params.set("limit", "100");

  const payload = await getJson(`/api/products?${params}`);
  if (!payload || !Array.isArray(payload.data)) return null;

  const pagination = payload.pagination ?? {};
  return {
    products: payload.data.map(mapProduct).filter((product) => product.slug && product.categorySlug),
    total: numberValue(pagination.total) ?? payload.data.length,
    page: numberValue(pagination.page) ?? 1,
    pages: numberValue(pagination.pages) ?? 1,
  };
}

export async function fetchProduct(idOrSlug: string) {
  const payload = await getJson(`/api/products/${encodeURIComponent(idOrSlug)}`);
  if (!payload) return null;
  if (payload.status === 404) return undefined;
  if (!payload.data || Array.isArray(payload.data)) return null;
  const product = mapProduct(payload.data);
  return product.slug ? product : null;
}

async function getJson(path: string) {
  await connection();
  try {
    const headers: Record<string, string> = { Accept: "application/json" };
    const token = (await cookies()).get("lotus_jwt")?.value;
    if (token) headers.Authorization = `Bearer ${token}`;

    const response = await fetch(`${apiUrl}${path}`, {
      headers,
      cache: "no-store",
    });
    const body = (await response.json()) as {
      data?: unknown;
      pagination?: Record<string, unknown>;
    };
    return { status: response.status, data: body.data, pagination: body.pagination };
  } catch {
    return null;
  }
}

function mapCategory(record: unknown): StoreCategory {
  const item = asRecord(record);
  const name = text(item.name) || "Category";
  const image = text(item.image) || "/images/home/living-room.jpg";
  return {
    id: text(item._id),
    slug: text(item.slug),
    name,
    summary: text(item.description),
    detail: text(item.description),
    image,
    alt: name,
    isActive: item.isActive !== false,
  };
}

function mapProduct(record: unknown): StoreProduct {
  const item = asRecord(record);
  const name = text(item.name);
  const listPrice = numberValue(item.price) ?? 0;
  const discount = numberValue(item.discountPrice);
  const onSale = discount !== undefined && discount > 0 && discount < listPrice;
  const category = asRecord(item.category);
  const specs = specsOf(item.specs);
  const brand = text(item.brand);
  if (brand && !specs.some((spec) => spec.label.toLowerCase() === "brand")) {
    specs.push({ label: "Brand", value: brand });
  }

  return {
    id: text(item._id),
    slug: text(item.slug),
    name,
    categorySlug: text(category.slug),
    categoryName: text(category.name),
    price: onSale ? discount : listPrice,
    compareAt: onSale ? listPrice : undefined,
    description: text(item.description),
    details: text(item.details) || text(item.description),
    images: imagesOf(item.images, name),
    specs,
    stock: numberValue(item.stock),
    brand,
    isActive: item.isActive !== false,
  };
}

function imagesOf(value: unknown, name: string): ProductImage[] {
  if (!Array.isArray(value)) return [];
  return value.flatMap((image) => {
    if (typeof image === "string" && image.trim()) return [{ src: image.trim(), alt: name }];
    const record = asRecord(image);
    const src = text(record.src);
    if (!src) return [];
    return [{ src, alt: text(record.alt) || name }];
  });
}

function specsOf(value: unknown): ProductSpec[] {
  if (!Array.isArray(value)) return [];
  return value.flatMap((spec) => {
    const record = asRecord(spec);
    const label = text(record.label);
    const specValue = text(record.value);
    if (!label || !specValue) return [];
    return [{ label, value: specValue }];
  });
}

function asRecord(value: unknown) {
  return value && typeof value === "object" ? (value as Record<string, unknown>) : {};
}

function text(value: unknown) {
  if (typeof value === "string") return value.trim();
  if (typeof value === "number") return String(value);
  return "";
}

function numberValue(value: unknown) {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string" && value.trim() && Number.isFinite(Number(value))) {
    return Number(value);
  }
  return undefined;
}
