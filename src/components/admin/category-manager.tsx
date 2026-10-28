"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useAdminAlert } from "@/components/admin/admin-toast";
import { AdminPanel, AdminStatus, adminField, adminPrimary, adminTh } from "@/components/admin/admin-ui";
import type { StoreCategory } from "@/lib/store-api";

const fieldClass = adminField;

const photoTypes = ["image/jpeg", "image/png", "image/webp"];
const maxPhotoBytes = 5 * 1024 * 1024;

export function CategoryManager({
  categories,
  source,
}: {
  categories: StoreCategory[];
  source: "api" | "local";
}) {
  const router = useRouter();
  const fileInput = useRef<HTMLInputElement>(null);
  const previewRef = useRef("");
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const { notify } = useAdminAlert();
  const [pending, setPending] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [photo, setPhoto] = useState<File | null>(null);
  const [preview, setPreview] = useState("");

  previewRef.current = preview;

  useEffect(() => {
    return () => {
      if (previewRef.current.startsWith("blob:")) URL.revokeObjectURL(previewRef.current);
    };
  }, []);

  function choosePhoto(file: File | null) {
    if (!file) return;
    if (!photoTypes.includes(file.type) || file.size > maxPhotoBytes) {
      setError("Use a JPG, PNG, or WebP photo under 5 MB.");
      return;
    }
    if (preview.startsWith("blob:")) URL.revokeObjectURL(preview);
    setPhoto(file);
    setPreview(URL.createObjectURL(file));
    setError("");
    setNotice("");
  }

  function clearPhoto() {
    if (preview.startsWith("blob:")) URL.revokeObjectURL(preview);
    setPhoto(null);
    setPreview("");
  }

  async function createCategory() {
    setPending(true);
    setError("");
    setNotice("");
    const body = new FormData();
    body.set("name", name);
    body.set("description", description);
    if (photo) body.set("photo", photo);
    const response = await fetch("/api/admin/categories", { method: "POST", body });
    const result = (await response.json()) as { message?: string };
    setPending(false);
    if (!response.ok) {
      const message = result.message ?? "Could not create this category.";
      setError(message);
      notify({ title: "Category not created", detail: message, tone: "error" });
      return;
    }
    setName("");
    setDescription("");
    clearPhoto();
    setNotice("Category added. It is saved in the database.");
    notify({ title: "Category added", detail: "It is saved in the catalog." });
    router.refresh();
  }

  return (
    <div className="space-y-6">
      {source === "local" ? (
        <p className="rounded-xl border border-[#ead9b0] bg-[#f3ead7] px-4 py-3 text-sm text-[#7a5a20]">
          Catalog API is offline. Showing the built-in shop collection.
        </p>
      ) : null}
      {notice ? (
        <p className="rounded-xl border border-[#cfe3d8] bg-[#e7f3ee] px-4 py-3 text-sm text-[#1f5c45]" role="alert">
          {notice}
        </p>
      ) : null}
      {error ? (
        <p className="rounded-xl border border-[#ead4d0] bg-[#f4e4e1] px-4 py-3 text-sm text-[#8a3030]" role="alert">
          {error}
        </p>
      ) : null}
      <form
        className="rounded-xl border border-[#ddd4c6] bg-[#fbf8f2] p-5"
        onSubmit={(event) => {
          event.preventDefault();
          void createCategory();
        }}
      >
        <p className="text-[10px] font-medium tracking-[0.18em] text-[#c6a15a] uppercase">New collection</p>
        <h2 className="mt-1 text-sm font-semibold">Add a category</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-3">
          <label className="block text-sm font-medium">
            Name
            <input
              className={fieldClass}
              required
              minLength={2}
              value={name}
              onChange={(event) => {
                setNotice("");
                setName(event.target.value);
              }}
            />
          </label>
          <label className="block text-sm font-medium">
            Description
            <input
              className={fieldClass}
              value={description}
              onChange={(event) => {
                setNotice("");
                setDescription(event.target.value);
              }}
            />
          </label>
          <div className="block text-sm font-medium">
            Photo
            <input
              ref={fileInput}
              className="sr-only"
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={(event) => {
                choosePhoto(event.target.files?.[0] ?? null);
                event.target.value = "";
              }}
            />
            {preview ? (
              <div className="mt-2 flex h-10 items-center gap-2 rounded-md border border-[#ddd4c6] bg-[#f7f3eb] px-2">
                <img src={preview} alt="" className="size-8 rounded-md object-cover" />
                <span className="min-w-0 flex-1 truncate text-sm font-normal text-neutral-600">{photo?.name}</span>
                <button
                  type="button"
                  onClick={() => fileInput.current?.click()}
                  className="shrink-0 text-sm font-medium text-[#1a6d78]"
                >
                  Change
                </button>
                <button type="button" onClick={clearPhoto} className="shrink-0 text-sm font-normal text-neutral-500">
                  Remove
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => fileInput.current?.click()}
                className="mt-2 flex h-10 w-full items-center justify-center gap-2 rounded-md border border-dashed border-[#c6a15a]/50 bg-[#f7f3eb] text-sm font-medium text-[#7a5a20] hover:border-[#c6a15a]"
              >
                <PlusIcon />
                Add photo
              </button>
            )}
          </div>
        </div>
        <p className="mt-2 text-xs text-[#7a7164]">JPG, PNG, or WebP, under 5 MB.</p>
        <button type="submit" disabled={pending || source !== "api"} className={`${adminPrimary} mt-4`}>
          {pending ? "Saving..." : "Create category"}
        </button>
      </form>
      <AdminPanel title="Collections" detail={`${categories.length} groups`}>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[44rem] text-left text-sm">
          <thead className="border-b border-[#eee6d8]">
            <tr>
              <th className={adminTh}>Category</th>
              <th className={adminTh}>Status</th>
              <th className={adminTh}>Summary</th>
              <th className={adminTh}>Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#f0eadf]">
            {categories.map((category) => (
              <CategoryRow
                key={category.id ?? category.slug}
                category={category}
                editable={source === "api"}
              />
            ))}
          </tbody>
        </table>
      </div>
      </AdminPanel>
    </div>
  );
}

function CategoryRow({
  category,
  editable,
}: {
  category: StoreCategory;
  editable: boolean;
}) {
  const router = useRouter();
  const { notify } = useAdminAlert();
  const fileInput = useRef<HTMLInputElement>(null);
  const previewRef = useRef("");
  const [name, setName] = useState(category.name);
  const [description, setDescription] = useState(category.summary);
  const [image, setImage] = useState(category.image);
  const [photo, setPhoto] = useState<File | null>(null);
  const [preview, setPreview] = useState("");
  const [active, setActive] = useState(category.isActive !== false);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");

  previewRef.current = preview;

  useEffect(() => {
    return () => {
      if (previewRef.current.startsWith("blob:")) URL.revokeObjectURL(previewRef.current);
    };
  }, []);

  function choosePhoto(file: File | null) {
    if (!file) return;
    if (!photoTypes.includes(file.type) || file.size > maxPhotoBytes) {
      setError("Use a JPG, PNG, or WebP photo under 5 MB.");
      return;
    }
    if (preview.startsWith("blob:")) URL.revokeObjectURL(preview);
    setPhoto(file);
    setPreview(URL.createObjectURL(file));
    setError("");
  }

  async function save() {
    if (!category.id) return;
    setPending(true);
    setError("");
    const body = new FormData();
    body.set("name", name);
    body.set("description", description);
    body.set("isActive", String(active));
    if (photo) body.set("photo", photo);
    const response = await fetch(`/api/admin/categories/${category.id}`, { method: "PUT", body });
    const result = (await response.json()) as { message?: string; data?: { image?: string } };
    setPending(false);
    if (!response.ok) {
      const message = result.message ?? "Could not update this category.";
      setError(message);
      notify({ title: "Category not saved", detail: message, tone: "error" });
      return;
    }
    if (result.data?.image) setImage(result.data.image);
    if (preview.startsWith("blob:")) URL.revokeObjectURL(preview);
    setPhoto(null);
    setPreview("");
    notify({ title: `${name} is saved`, detail: "The category is updated." });
    router.refresh();
  }

  async function deactivate() {
    if (!category.id) return;
    setPending(true);
    setError("");
    const response = await fetch(`/api/admin/categories/${category.id}`, { method: "DELETE" });
    const result = (await response.json()) as { message?: string };
    setPending(false);
    if (!response.ok) {
      const message = result.message ?? "Could not deactivate this category.";
      setError(message);
      notify({ title: "Could not deactivate", detail: message, tone: "error" });
      return;
    }
    notify({
      title: `${name} is deactivated`,
      detail: "This collection is now hidden from the shop.",
    });
    router.refresh();
  }

  const shown = preview || image;

  return (
    <tr>
      <td className="px-5 py-3">
        <input className="h-9 w-full rounded-md border border-[#ddd4c6] bg-[#f7f3eb] px-2 text-sm" value={name} onChange={(event) => setName(event.target.value)} disabled={!editable} />
        {error ? <span className="mt-1 block text-xs text-[#8a3030]">{error}</span> : null}
      </td>
      <td className="px-5 py-3">
        <AdminStatus value={category.isActive === false ? "hidden" : "active"} />
      </td>
      <td className="px-5 py-3">
        <input className="mb-2 h-9 w-full rounded-md border border-[#ddd4c6] bg-[#f7f3eb] px-2 text-sm" value={description} onChange={(event) => setDescription(event.target.value)} disabled={!editable} />
        <div className="flex items-center gap-3">
          {shown ? (
            <img src={shown} alt="" className="size-12 shrink-0 rounded-lg object-cover ring-1 ring-neutral-200" />
          ) : (
            <span className="grid size-12 shrink-0 place-items-center rounded-lg bg-neutral-100 text-[10px] text-neutral-400">
              No photo
            </span>
          )}
          <input
            ref={fileInput}
            className="sr-only"
            type="file"
            accept="image/jpeg,image/png,image/webp"
            disabled={!editable}
            onChange={(event) => {
              choosePhoto(event.target.files?.[0] ?? null);
              event.target.value = "";
            }}
          />
          <button
            type="button"
            onClick={() => fileInput.current?.click()}
            disabled={!editable}
            className="text-sm font-medium text-[#1a6d78] disabled:opacity-50"
          >
            {photo ? "Photo ready" : shown ? "Change photo" : "Add photo"}
          </button>
        </div>
      </td>
      <td className="px-5 py-3">
        <div className="flex flex-col items-start gap-2">
          <label className="flex items-center gap-2 text-xs text-neutral-600">
            <input type="checkbox" checked={active} onChange={(event) => setActive(event.target.checked)} disabled={!editable} />
            Active
          </label>
          <button type="button" onClick={() => void save()} disabled={!editable || pending} className="text-sm font-medium text-[#1a6d78] disabled:opacity-50">
            Save
          </button>
          <button type="button" onClick={() => void deactivate()} disabled={!editable || pending || category.isActive === false} className="text-sm text-neutral-500 disabled:opacity-50">
            Deactivate
          </button>
        </div>
      </td>
    </tr>
  );
}

function PlusIcon() {
  return (
    <svg viewBox="0 0 16 16" aria-hidden="true" className="size-4">
      <path d="M8 2.5v11M2.5 8h11" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}
