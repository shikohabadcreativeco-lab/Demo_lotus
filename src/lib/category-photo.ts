import { randomBytes } from "node:crypto";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const imageTypes = new Map([
  ["image/jpeg", "jpg"],
  ["image/jpg", "jpg"],
  ["image/png", "png"],
  ["image/webp", "webp"],
]);

export const maxCategoryPhotoBytes = 5 * 1024 * 1024;

export function categoryPhotoError(file: File) {
  if (!imageTypes.has(file.type) || file.size > maxCategoryPhotoBytes) {
    return "Use a JPG, PNG, or WebP photo under 5 MB.";
  }
  return "";
}

export async function saveCategoryPhoto(file: File) {
  const extension = imageTypes.get(file.type) ?? "jpg";
  const filename = `${randomBytes(8).toString("hex")}.${extension}`;
  const directory = path.join(process.cwd(), "public", "uploads", "categories");
  const filepath = path.join(directory, filename);
  await mkdir(directory, { recursive: true });
  await writeFile(filepath, Buffer.from(await file.arrayBuffer()));
  return { src: `/uploads/categories/${filename}`, filepath };
}
