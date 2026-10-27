"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { SavedPopup } from "@/components/admin/saved-popup";
import { formatPrice } from "@/lib/products";

const fieldClass =
  "mt-2 w-full rounded-lg border border-neutral-200 bg-white px-3 py-2.5 text-sm text-neutral-950 outline-none placeholder:text-neutral-400 focus:border-[#1a6d78]";

const maxPhotos = 5;
const photoTypes = ["image/jpeg", "image/png", "image/webp"];
const lightChoices = [
  "Warm white",
  "White",
  "Cool white",
  "Daylight",
  "Amber",
  "Red",
  "Green",
  "Blue",
  "Yellow",
  "Pink",
  "Purple",
  "Orange",
  "RGB",
];
const wattChoices = ["5W", "7W", "9W", "12W", "15W", "18W", "24W", "36W", "48W"];

function sortWatts(values: string[]) {
  return [...new Set(values)].sort((left, right) => parseInt(left, 10) - parseInt(right, 10));
}

function toggleWatt(selected: string[], choice: string) {
  const next = selected.includes(choice) ? selected.filter((item) => item !== choice) : [...selected, choice];
  return sortWatts(next).join(", ");
}

const lightSwatches: Record<string, string> = {
  "Warm white": "#f3d7a1",
  White: "#f4f4f2",
  "Cool white": "#e7eef8",
  Daylight: "#d5e4f7",
  Amber: "#e39a3a",
  Red: "#d64545",
  Green: "#3aa76d",
  Blue: "#3b6fd8",
  Yellow: "#e2c04a",
  Pink: "#e58aab",
  Purple: "#7b5ea7",
  Orange: "#e07a3d",
  RGB: "conic-gradient(#e24b4b, #e2c04a, #3aa76d, #3b6fd8, #e24b4b)",
};

type DraftPhoto = {
  id: string;
  file: File;
  url: string;
};

type Draft = {
  name: string;
  category: string;
  price: string;
  compareAt: string;
  brand: string;
  stock: string;
  description: string;
  details: string;
  finish: string;
  size: string;
  bulb: string;
  material: string;
  bodyColor: string;
  lightColor: string;
  watt: string;
};

const emptyDraft: Draft = {
  name: "",
  category: "",
  price: "",
  compareAt: "",
  brand: "Lotus Light",
  stock: "1",
  description: "",
  details: "",
  finish: "",
  size: "",
  bulb: "",
  material: "",
  bodyColor: "",
  lightColor: "",
  watt: "",
};

export function AddProductForm({
  categories,
}: {
  categories: Array<{ slug: string; name: string }>;
}) {
  const router = useRouter();
  const fileInput = useRef<HTMLInputElement>(null);
  const photosRef = useRef<DraftPhoto[]>([]);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [popup, setPopup] = useState("");
  const [pending, setPending] = useState(false);
  const [draft, setDraft] = useState<Draft>(emptyDraft);
  const [photos, setPhotos] = useState<DraftPhoto[]>([]);
  const [active, setActive] = useState(0);
  const [extraWatt, setExtraWatt] = useState("");

  photosRef.current = photos;

  useEffect(() => {
    return () => {
      photosRef.current.forEach((photo) => URL.revokeObjectURL(photo.url));
    };
  }, []);

  function update(key: keyof Draft, value: string) {
    setNotice("");
    setDraft((current) => ({ ...current, [key]: value }));
  }

  function addPhotos(list: FileList | null) {
    if (!list || list.length === 0) return;
    setNotice("");
    const next = [...photos];
    let message = "";
    for (const file of Array.from(list)) {
      if (next.length >= maxPhotos) {
        message = "A product can have up to 5 photos.";
        break;
      }
      if (!photoTypes.includes(file.type) || file.size > 5 * 1024 * 1024) {
        message = "Use JPG, PNG, or WebP photos under 5 MB each.";
        continue;
      }
      next.push({
        id: crypto.randomUUID(),
        file,
        url: URL.createObjectURL(file),
      });
    }
    setPhotos(next);
    setError(message);
    if (fileInput.current) fileInput.current.value = "";
  }

  function removePhoto(id: string) {
    setPhotos((current) => {
      const removed = current.find((photo) => photo.id === id);
      if (removed) URL.revokeObjectURL(removed.url);
      return current.filter((photo) => photo.id !== id);
    });
    setActive(0);
  }

  function makeMain(id: string) {
    setPhotos((current) => {
      const chosen = current.find((photo) => photo.id === id);
      if (!chosen) return current;
      return [chosen, ...current.filter((photo) => photo.id !== id)];
    });
    setActive(0);
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (photos.length < 1) {
      setError("Add at least one product photo.");
      return;
    }
    setPending(true);
    setError("");
    setNotice("");
    const body = new FormData(event.currentTarget);
    photos.forEach((photo) => body.append("photos", photo.file));

    try {
      const response = await fetch("/api/admin/products", { method: "POST", body });
      const result = (await response.json()) as { message?: string; success?: boolean };
      if (!response.ok || !result.success) {
        setError(result.message ?? "Could not add this product.");
        setPending(false);
        return;
      }
      photos.forEach((photo) => URL.revokeObjectURL(photo.url));
      setPhotos([]);
      setActive(0);
      setDraft(emptyDraft);
      setExtraWatt("");
      if (fileInput.current) fileInput.current.value = "";
      setNotice("Product added. It is saved in the database.");
      setPopup("Product added");
      setPending(false);
      router.refresh();
    } catch {
      setError("Could not add this product.");
      setPending(false);
    }
  }

  const categoryName =
    categories.find((category) => category.slug === draft.category)?.name ?? "Category";
  const priceLabel = /^\d+$/.test(draft.price) ? formatPrice(Number(draft.price)) : "Price";
  const selectedLights = draft.lightColor.split(", ").filter(Boolean);
  const selectedWatts = sortWatts(draft.watt.split(", ").filter(Boolean));
  const specs = [
    ["Body color", draft.bodyColor],
    ["Light color", draft.lightColor],
    ["Finish", draft.finish],
    ["Size", draft.size],
    ["Material", draft.material],
    ["Watt", selectedWatts.join(", ")],
    ["Bulb", draft.bulb],
  ].filter((spec) => spec[1].trim());
  const shown = photos[Math.min(active, Math.max(photos.length - 1, 0))];

  return (
    <>
    <form onSubmit={onSubmit} className="flex flex-col gap-6">
      <div className="rounded-2xl border border-neutral-200 bg-white p-6">
        {notice ? (
          <p className="mb-5 rounded-lg bg-[#dcfce7] px-3 py-2 text-sm font-medium text-[#166534]" role="alert">
            {notice}
          </p>
        ) : null}
        {error ? (
          <p className="mb-5 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700" role="alert">
            {error}
          </p>
        ) : null}
        <div className="grid gap-5 sm:grid-cols-2">
          <label className="block text-sm font-medium text-neutral-800 sm:col-span-2">
            Product name
            <input
              className={fieldClass}
              name="name"
              required
              minLength={2}
              maxLength={80}
              placeholder="Arc Table Lamp"
              value={draft.name}
              onChange={(event) => update("name", event.target.value)}
            />
          </label>
          <label className="block text-sm font-medium text-neutral-800">
            Category
            <select
              className={fieldClass}
              name="category"
              required
              value={draft.category}
              onChange={(event) => update("category", event.target.value)}
            >
              <option value="" disabled>
                Choose a category
              </option>
              {categories.map((category) => (
                <option key={category.slug} value={category.slug}>
                  {category.name}
                </option>
              ))}
            </select>
          </label>
          <label className="block text-sm font-medium text-neutral-800">
            Price (INR)
            <input
              className={fieldClass}
              name="price"
              inputMode="numeric"
              required
              pattern="[0-9]+"
              placeholder="12400"
              value={draft.price}
              onChange={(event) => update("price", event.target.value)}
            />
          </label>
          <label className="block text-sm font-medium text-neutral-800">
            Compare-at price
            <input
              className={fieldClass}
              name="compareAt"
              inputMode="numeric"
              pattern="[0-9]*"
              placeholder="20700"
              value={draft.compareAt}
              onChange={(event) => update("compareAt", event.target.value)}
            />
          </label>
          <label className="block text-sm font-medium text-neutral-800">
            Brand
            <input
              className={fieldClass}
              name="brand"
              maxLength={60}
              placeholder="Lotus Light"
              value={draft.brand}
              onChange={(event) => update("brand", event.target.value)}
            />
          </label>
          <label className="block text-sm font-medium text-neutral-800">
            Stock
            <input
              className={fieldClass}
              name="stock"
              inputMode="numeric"
              required
              pattern="[0-9]+"
              value={draft.stock}
              onChange={(event) => update("stock", event.target.value)}
            />
          </label>
          <label className="block text-sm font-medium text-neutral-800 sm:col-span-2">
            Short description
            <textarea
              className={`${fieldClass} min-h-24 resize-y`}
              name="description"
              required
              minLength={8}
              maxLength={400}
              placeholder="A brass arc that throws a warm pool of light across a sofa."
              value={draft.description}
              onChange={(event) => update("description", event.target.value)}
            />
          </label>
          <label className="block text-sm font-medium text-neutral-800 sm:col-span-2">
            Longer description
            <textarea
              className={`${fieldClass} min-h-28 resize-y`}
              name="details"
              maxLength={2000}
              placeholder="Where it belongs, how it is used, and what is included."
              value={draft.details}
              onChange={(event) => update("details", event.target.value)}
            />
          </label>
          <label className="block text-sm font-medium text-neutral-800">
            Finish
            <input
              className={fieldClass}
              name="finish"
              maxLength={60}
              placeholder="Brushed brass"
              value={draft.finish}
              onChange={(event) => update("finish", event.target.value)}
            />
          </label>
          <label className="block text-sm font-medium text-neutral-800">
            Body color
            <input
              className={fieldClass}
              name="bodyColor"
              maxLength={60}
              placeholder="Warm ceramic"
              value={draft.bodyColor}
              onChange={(event) => update("bodyColor", event.target.value)}
            />
          </label>
          <div className="sm:col-span-2">
            <p className="text-sm font-medium text-neutral-800">Light color</p>
            <p className="mt-1 text-xs text-neutral-500">
              Choose the light this lamp gives. Strip lights can use more than one color.
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              {lightChoices.map((choice) => {
                const on = selectedLights.includes(choice);
                const swatch = lightSwatches[choice];
                return (
                  <button
                    key={choice}
                    type="button"
                    aria-pressed={on}
                    onClick={() => {
                      const next = on
                        ? selectedLights.filter((item) => item !== choice)
                        : [...selectedLights, choice];
                      update("lightColor", next.join(", "));
                    }}
                    className={`inline-flex cursor-pointer items-center gap-2 rounded-full border px-3 py-1.5 text-sm ${
                      on
                        ? "border-[#16a34a] bg-[#dcfce7] text-[#166534]"
                        : "border-neutral-200 bg-white text-neutral-700 hover:border-neutral-300"
                    }`}
                  >
                    <span
                      className="size-3.5 rounded-full ring-1 ring-black/10"
                      style={
                        swatch.includes("gradient")
                          ? { backgroundImage: swatch }
                          : { backgroundColor: swatch }
                      }
                    />
                    {choice}
                  </button>
                );
              })}
            </div>
            <input type="hidden" name="lightColor" value={draft.lightColor} />
          </div>
          <div className="sm:col-span-2">
            <p className="text-sm font-medium text-neutral-800">Watt</p>
            <p className="mt-1 text-xs text-neutral-500">
              Choose every watt this light is sold in. The customer picks one before it goes in the cart.
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              {[...wattChoices, ...selectedWatts.filter((choice) => !wattChoices.includes(choice))].map((choice) => {
                const on = selectedWatts.includes(choice);
                return (
                  <button
                    key={choice}
                    type="button"
                    aria-pressed={on}
                    onClick={() => update("watt", toggleWatt(selectedWatts, choice))}
                    className={`cursor-pointer rounded-full border px-3 py-1.5 text-sm ${
                      on
                        ? "border-[#16a34a] bg-[#dcfce7] text-[#166534]"
                        : "border-neutral-200 bg-white text-neutral-700 hover:border-neutral-300"
                    }`}
                  >
                    {choice}
                  </button>
                );
              })}
            </div>
            <div className="mt-3 flex max-w-xs items-center gap-2">
              <input
                className="h-10 w-24 rounded-lg border border-neutral-200 px-3 text-sm outline-none focus:border-[#1a6d78]"
                inputMode="numeric"
                maxLength={3}
                placeholder="20"
                aria-label="Other watt"
                value={extraWatt}
                onChange={(event) => setExtraWatt(event.target.value.replace(/\D/g, "").slice(0, 3))}
              />
              <button
                type="button"
                className="h-10 cursor-pointer rounded-lg border border-neutral-200 px-3 text-sm font-medium text-neutral-700 hover:border-neutral-300"
                onClick={() => {
                  const amount = Number(extraWatt);
                  if (!Number.isInteger(amount) || amount < 1 || amount > 500) return;
                  const label = `${amount}W`;
                  update(
                    "watt",
                    sortWatts(selectedWatts.includes(label) ? selectedWatts : [...selectedWatts, label]).join(", "),
                  );
                  setExtraWatt("");
                }}
              >
                Add watt
              </button>
            </div>
            <input type="hidden" name="watt" value={selectedWatts.join(", ")} />
          </div>
          <label className="block text-sm font-medium text-neutral-800">
            Size
            <input
              className={fieldClass}
              name="size"
              maxLength={60}
              placeholder="58 cm"
              value={draft.size}
              onChange={(event) => update("size", event.target.value)}
            />
          </label>
          <label className="block text-sm font-medium text-neutral-800">
            Bulb
            <input
              className={fieldClass}
              name="bulb"
              maxLength={60}
              placeholder="E27, up to 12W"
              value={draft.bulb}
              onChange={(event) => update("bulb", event.target.value)}
            />
          </label>
          <label className="block text-sm font-medium text-neutral-800">
            Material
            <input
              className={fieldClass}
              name="material"
              maxLength={60}
              placeholder="Brass and linen"
              value={draft.material}
              onChange={(event) => update("material", event.target.value)}
            />
          </label>
        </div>
        <div className="mt-6 flex flex-wrap gap-3">
          <button
            type="submit"
            disabled={pending}
            className="h-11 rounded-lg bg-[#172033] px-5 text-sm font-semibold text-[#b7f3ea] hover:bg-[#24344a] disabled:opacity-60"
          >
            {pending ? "Adding product..." : "Add product"}
          </button>
          <Link
            href="/admin/products"
            className="grid h-11 place-items-center rounded-lg border border-neutral-200 px-5 text-sm text-neutral-700 hover:border-neutral-400"
          >
            Cancel
          </Link>
        </div>
      </div>

      <section className="rounded-2xl border border-neutral-200 bg-white p-6">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="text-sm font-semibold">Photos</h2>
            <p className="mt-1 text-xs text-neutral-500">
              Up to 5. The first photo is the main image on the shop.
            </p>
          </div>
          <button
            type="button"
            onClick={() => fileInput.current?.click()}
            disabled={photos.length >= maxPhotos}
            className="h-10 rounded-lg border border-neutral-200 px-3 text-sm text-neutral-800 hover:border-neutral-400 disabled:opacity-50"
          >
            Add photos
          </button>
          <input
            ref={fileInput}
            className="sr-only"
            type="file"
            accept="image/jpeg,image/png,image/webp"
            multiple
            onChange={(event) => addPhotos(event.target.files)}
          />
        </div>
        <ul className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-5">
          {Array.from({ length: maxPhotos }, (_, index) => {
            const photo = photos[index];
            return (
              <li key={photo?.id ?? `empty-${index}`}>
                {photo ? (
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => setActive(index)}
                      className={`block aspect-square w-full overflow-hidden rounded-xl bg-[#e6eef3] ${
                        index === active ? "ring-2 ring-[#1a6d78]" : "ring-1 ring-neutral-200"
                      }`}
                    >
                      <img
                        src={photo.url}
                        alt={`Photo ${index + 1} preview`}
                        className="size-full object-cover"
                      />
                    </button>
                    <span className="absolute top-2 left-2 rounded-full bg-white/90 px-2 py-0.5 text-[10px] font-semibold text-neutral-700">
                      {index === 0 ? "Main" : index + 1}
                    </span>
                    <button
                      type="button"
                      onClick={() => removePhoto(photo.id)}
                      className="absolute top-2 right-2 grid size-6 place-items-center rounded-full bg-white text-sm text-neutral-700 shadow"
                      aria-label={`Remove photo ${index + 1}`}
                    >
                      ×
                    </button>
                    {index > 0 ? (
                      <button
                        type="button"
                        onClick={() => makeMain(photo.id)}
                        className="mt-2 text-xs font-medium text-[#1a6d78]"
                      >
                        Make main
                      </button>
                    ) : null}
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => fileInput.current?.click()}
                    className="grid aspect-square w-full place-items-center rounded-xl border border-dashed border-neutral-300 bg-[#e6eef3] text-xs text-neutral-500"
                  >
                    Photo {index + 1}
                  </button>
                )}
              </li>
            );
          })}
        </ul>
      </section>

      <section className="rounded-2xl border border-neutral-200 bg-[#f6f3ee] p-4 sm:p-6">
        <h2 className="text-sm font-semibold">Shop preview</h2>
        <p className="mt-1 text-xs text-neutral-500">
          This is the product page customers will see after you add it.
        </p>
        <article className="mt-5">
          <p className="text-xs text-neutral-500">Home › Product › {categoryName} › {draft.name || "Product name"}</p>
          <div className="mt-4 grid items-start gap-6 lg:grid-cols-[minmax(0,1.05fr)_minmax(240px,0.95fr)]">
            <div>
              <div className="overflow-hidden rounded-3xl bg-white shadow-[0_16px_40px_rgba(40,32,20,0.08)]">
                {shown ? (
                  <img
                    src={shown.url}
                    alt={draft.name || "Product photo"}
                    className="aspect-square w-full object-cover"
                  />
                ) : (
                  <div className="grid aspect-square place-items-center text-sm text-neutral-400">
                    Add a photo to preview it here
                  </div>
                )}
              </div>
              {photos.length > 1 ? (
                <ul className={`mt-3 grid gap-3 ${photos.length > 4 ? "grid-cols-5" : "grid-cols-4"}`}>
                  {photos.map((photo, index) => (
                    <li key={photo.id}>
                      <button
                        type="button"
                        aria-label={`Show photo ${index + 1}`}
                        aria-pressed={index === active}
                        onClick={() => setActive(index)}
                        className={`block aspect-square w-full overflow-hidden rounded-xl bg-white ${
                          index === active ? "ring-2 ring-[#c6a15a]" : "ring-1 ring-neutral-200"
                        }`}
                      >
                        <img src={photo.url} alt="" className="size-full object-cover" />
                      </button>
                    </li>
                  ))}
                </ul>
              ) : null}
            </div>
            <div className="rounded-3xl bg-white p-6 shadow-[0_16px_40px_rgba(40,32,20,0.06)]">
              <p className="text-[11px] font-semibold tracking-[0.28em] text-[#c6a15a]">
                {categoryName.toUpperCase()}
              </p>
              <h3 className="mt-3 text-3xl font-semibold tracking-tight text-neutral-950">
                {draft.name || "Product name"}
              </h3>
              <p className="mt-4 text-2xl font-semibold text-[#8a6a32]">{priceLabel}</p>
              <p className="mt-4 text-sm leading-6 text-neutral-500">
                {draft.description || "The short description will appear here."}
              </p>
              <div className="mt-8 flex gap-3">
                <div className="grid h-12 w-36 place-items-center rounded-lg border border-neutral-200 text-sm">
                  1
                </div>
                <div className="grid h-12 flex-1 place-items-center rounded-lg bg-[#c6a15a] text-sm font-medium text-white">
                  Add to cart
                </div>
              </div>
            </div>
          </div>
          <div className="mt-6 grid gap-6 lg:grid-cols-2">
            <section className="rounded-3xl bg-white p-6">
              <h3 className="text-xl font-semibold tracking-tight">About this light</h3>
              <p className="mt-3 text-sm leading-7 text-neutral-500">
                {draft.details || draft.description || "The longer description will appear here."}
              </p>
            </section>
            <section className="rounded-3xl bg-white p-6">
              <h3 className="text-xl font-semibold tracking-tight">Details</h3>
              {specs.length > 0 ? (
                <dl className="mt-4 divide-y divide-neutral-100">
                  {specs.map(([label, value]) => (
                    <div key={label} className="flex items-start justify-between gap-6 py-3 text-sm">
                      <dt className="text-neutral-500">{label}</dt>
                      <dd className="text-right font-medium text-neutral-900">
                        {label === "Light color" ? (
                          <span className="flex flex-wrap justify-end gap-1.5">
                            {value.split(", ").filter(Boolean).map((name) => {
                              const swatch = lightSwatches[name] ?? "#e7e2d8";
                              return (
                                <span
                                  key={name}
                                  className="inline-flex items-center gap-1.5 rounded-full border border-neutral-200 px-2 py-0.5 text-xs font-medium"
                                >
                                  <span
                                    className="size-2.5 rounded-full ring-1 ring-black/10"
                                    style={
                                      swatch.includes("gradient")
                                        ? { backgroundImage: swatch }
                                        : { backgroundColor: swatch }
                                    }
                                  />
                                  {name}
                                </span>
                              );
                            })}
                          </span>
                        ) : (
                          value
                        )}
                      </dd>
                    </div>
                  ))}
                </dl>
              ) : (
                <p className="mt-3 text-sm leading-6 text-neutral-500">
                  Body color, light color, watt, finish, size, and material will show here.
                </p>
              )}
            </section>
          </div>
        </article>
      </section>
    </form>
    {popup ? (
      <SavedPopup
        title={popup}
        detail="It is saved in the database."
        onClose={() => setPopup("")}
      />
    ) : null}
    </>
  );
}
