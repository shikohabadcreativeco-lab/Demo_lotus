import { unlink } from "node:fs/promises";
import { NextResponse } from "next/server";
import { forwardAdmin } from "@/lib/admin-backend";
import { categoryPhotoError, saveCategoryPhoto } from "@/lib/category-photo";
import { currentAccount } from "@/lib/current-session";

export async function POST(request: Request) {
  const account = await currentAccount();
  if (!account || account.role !== "admin") {
    return NextResponse.json({ message: "Only an admin can add categories." }, { status: 401 });
  }

  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return NextResponse.json({ message: "Could not read the category." }, { status: 400 });
  }

  const name = text(form, "name");
  const description = text(form, "description");
  const photo = form.get("photo");
  let image = "";
  let filepath = "";

  if (photo instanceof File && photo.size > 0) {
    const message = categoryPhotoError(photo);
    if (message) return NextResponse.json({ message }, { status: 400 });
    try {
      const saved = await saveCategoryPhoto(photo);
      image = saved.src;
      filepath = saved.filepath;
    } catch {
      return NextResponse.json({ message: "Could not save the category photo." }, { status: 500 });
    }
  }

  const result = await forwardAdmin("/api/categories", "POST", { name, description, image });
  if (result.status >= 400 && filepath) {
    await unlink(filepath).catch(() => undefined);
  }
  return result;
}

function text(form: FormData, key: string) {
  const value = form.get(key);
  return typeof value === "string" ? value.trim() : "";
}
