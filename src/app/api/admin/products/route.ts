import { randomBytes } from "node:crypto";
import { mkdir, unlink, writeFile } from "node:fs/promises";
import path from "node:path";
import { NextResponse } from "next/server";
import { adminToken, apiUrl } from "@/lib/admin-backend";
import { currentAccount } from "@/lib/current-session";
import type { ProductSpec } from "@/lib/products";

const imageTypes = new Map([
  ["image/jpeg", "jpg"],
  ["image/jpg", "jpg"],
  ["image/png", "png"],
  ["image/webp", "webp"],
]);

const maxPhotoBytes = 5 * 1024 * 1024;

export async function POST(request: Request) {
  const account = await currentAccount();
  if (!account || account.role !== "admin") {
    return NextResponse.json({ message: "Only an admin can add products." }, { status: 401 });
  }

  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return NextResponse.json({ message: "Could not read the product form." }, { status: 400 });
  }

  const token = await adminToken();
  if (!token) {
    return NextResponse.json({ message: "Sign in again as an admin." }, { status: 401 });
  }

  const name = text(form, "name");
  const categorySlug = text(form, "category");
  const description = text(form, "description");
  const details = text(form, "details");
  const brand = text(form, "brand") || "Lotus Light";
  const price = wholeNumber(text(form, "price"));
  const compareAt = text(form, "compareAt") ? wholeNumber(text(form, "compareAt")) : null;
  const stock = wholeNumber(text(form, "stock"));
  const photos = form
    .getAll("photos")
    .filter((item): item is File => item instanceof File && item.size > 0);

  if (name.length < 2 || name.length > 80) {
    return NextResponse.json(
      { message: "Enter a product name between 2 and 80 characters." },
      { status: 400 },
    );
  }
  if (!categorySlug) {
    return NextResponse.json({ message: "Choose a category from the list." }, { status: 400 });
  }
  if (price === null || price < 1 || price > 10_000_000) {
    return NextResponse.json({ message: "Enter a price in rupees." }, { status: 400 });
  }
  if (compareAt !== null && (compareAt <= price || compareAt > 10_000_000)) {
    return NextResponse.json(
      { message: "Compare-at price must be higher than the selling price." },
      { status: 400 },
    );
  }
  if (description.length < 8 || description.length > 400) {
    return NextResponse.json(
      { message: "Add a short description, up to 400 characters." },
      { status: 400 },
    );
  }
  if (details.length > 2000) {
    return NextResponse.json(
      { message: "Keep the longer description under 2000 characters." },
      { status: 400 },
    );
  }
  if (stock === null || stock > 100_000) {
    return NextResponse.json({ message: "Enter how many pieces are in stock." }, { status: 400 });
  }
  if (photos.length < 1 || photos.length > 5) {
    return NextResponse.json({ message: "Add between 1 and 5 photos." }, { status: 400 });
  }
  if (photos.some((photo) => !imageTypes.has(photo.type) || photo.size > maxPhotoBytes)) {
    return NextResponse.json(
      { message: "Use JPG, PNG, or WebP photos under 5 MB each." },
      { status: 400 },
    );
  }

  const specs = specList([
    ["Finish", text(form, "finish")],
    ["Size", text(form, "size")],
    ["Material", text(form, "material")],
    ["Body color", text(form, "bodyColor")],
    ["Light color", text(form, "lightColor")],
    ["Watt", text(form, "watt")],
    ["Bulb", text(form, "bulb")],
  ]);
  if (specs === null) {
    return NextResponse.json(
      { message: "Keep each detail under 120 characters." },
      { status: 400 },
    );
  }

  const directory = path.join(process.cwd(), "public", "uploads", "products");
  const savedFiles: string[] = [];
  const images: Array<{ src: string; alt: string }> = [];

  try {
    await mkdir(directory, { recursive: true });
    for (const photo of photos) {
      const extension = imageTypes.get(photo.type) ?? "jpg";
      const filename = `${randomBytes(8).toString("hex")}.${extension}`;
      const filepath = path.join(directory, filename);
      await writeFile(filepath, Buffer.from(await photo.arrayBuffer()));
      savedFiles.push(filepath);
      images.push({ src: `/uploads/products/${filename}`, alt: name });
    }
  } catch {
    await Promise.all(savedFiles.map((filepath) => unlink(filepath).catch(() => undefined)));
    return NextResponse.json({ message: "Could not save the product photos." }, { status: 500 });
  }

  let categoryId = "";
  try {
    const categoryResponse = await fetch(`${apiUrl}/api/categories`, {
      headers: { Accept: "application/json", Authorization: `Bearer ${token}` },
      cache: "no-store",
    });
    const categoryPayload = (await categoryResponse.json()) as {
      data?: Array<{ _id?: string; slug?: string }>;
    };
    categoryId =
      categoryPayload.data?.find((category) => category.slug === categorySlug)?._id ?? "";
  } catch {
    categoryId = "";
  }

  if (!categoryId) {
    await Promise.all(savedFiles.map((filepath) => unlink(filepath).catch(() => undefined)));
    return NextResponse.json({ message: "Choose a category from the list." }, { status: 400 });
  }

  const listPrice = compareAt ?? price;
  const discountPrice = compareAt ? price : undefined;

  try {
    const response = await fetch(`${apiUrl}/api/products`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        name,
        description,
        details,
        price: listPrice,
        discountPrice,
        category: categoryId,
        brand,
        images: images.map((image) => image.src),
        stock,
        specs,
      }),
      cache: "no-store",
    });
    const payload = (await response.json()) as { message?: string; data?: { slug?: string } };
    if (!response.ok) {
      await Promise.all(savedFiles.map((filepath) => unlink(filepath).catch(() => undefined)));
      return NextResponse.json(
        { message: payload.message ?? "Could not add this product." },
        { status: response.status },
      );
    }
    return NextResponse.json({ success: true, product: payload.data });
  } catch {
    await Promise.all(savedFiles.map((filepath) => unlink(filepath).catch(() => undefined)));
    return NextResponse.json({ message: "Catalog API is not running." }, { status: 503 });
  }
}

function text(form: FormData, key: string) {
  const value = form.get(key);
  return typeof value === "string" ? value.trim() : "";
}

function wholeNumber(value: string) {
  if (!/^\d+$/.test(value)) return null;
  const amount = Number(value);
  return Number.isSafeInteger(amount) ? amount : null;
}

function specList(pairs: Array<[string, string]>): ProductSpec[] | null {
  const specs: ProductSpec[] = [];
  for (const [label, value] of pairs) {
    if (!value) continue;
    if (value.length > 120) return null;
    specs.push({ label, value });
  }
  return specs;
}
