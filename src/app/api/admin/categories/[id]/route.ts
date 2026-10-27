import { unlink } from "node:fs/promises";
import { NextResponse } from "next/server";
import { forwardAdmin } from "@/lib/admin-backend";
import { categoryPhotoError, saveCategoryPhoto } from "@/lib/category-photo";
import { currentAccount } from "@/lib/current-session";

type RouteContext = { params: Promise<{ id: string }> };

export async function PUT(request: Request, context: RouteContext) {
  const account = await currentAccount();
  if (!account || account.role !== "admin") {
    return NextResponse.json({ message: "Only an admin can update categories." }, { status: 401 });
  }

  const { id } = await context.params;
  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return NextResponse.json({ message: "Could not read the category." }, { status: 400 });
  }

  const body: { name: string; description: string; isActive: boolean; image?: string } = {
    name: text(form, "name"),
    description: text(form, "description"),
    isActive: form.get("isActive") === "true",
  };
  const photo = form.get("photo");
  let filepath = "";

  if (photo instanceof File && photo.size > 0) {
    const message = categoryPhotoError(photo);
    if (message) return NextResponse.json({ message }, { status: 400 });
    try {
      const saved = await saveCategoryPhoto(photo);
      body.image = saved.src;
      filepath = saved.filepath;
    } catch {
      return NextResponse.json({ message: "Could not save the category photo." }, { status: 500 });
    }
  }

  const result = await forwardAdmin(`/api/categories/${id}`, "PUT", body);
  if (result.status >= 400 && filepath) {
    await unlink(filepath).catch(() => undefined);
  }
  return result;
}

export async function DELETE(_request: Request, context: RouteContext) {
  const account = await currentAccount();
  if (!account || account.role !== "admin") {
    return NextResponse.json({ message: "Only an admin can deactivate categories." }, { status: 401 });
  }

  const { id } = await context.params;
  return forwardAdmin(`/api/categories/${id}`, "DELETE");
}

function text(form: FormData, key: string) {
  const value = form.get(key);
  return typeof value === "string" ? value.trim() : "";
}
