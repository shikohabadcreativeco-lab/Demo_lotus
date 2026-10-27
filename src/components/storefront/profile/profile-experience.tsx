"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { SignOutButton } from "@/components/storefront/profile/sign-out-button";
import { addItem, optionLabel } from "@/lib/cart-store";
import type { SavedAddress, StoredOrder } from "@/lib/customer-records";
import { formatPrice } from "@/lib/products";

const sections = [
  { id: "account", label: "My account" },
  { id: "addresses", label: "Addresses" },
  { id: "orders", label: "Orders" },
  { id: "support", label: "Support" },
] as const;

export type ProfileSection = (typeof sections)[number]["id"];

const states = [
  "Karnataka",
  "Maharashtra",
  "Delhi",
  "Tamil Nadu",
  "Telangana",
  "Kerala",
  "Gujarat",
  "Rajasthan",
  "Uttar Pradesh",
  "West Bengal",
  "Punjab",
  "Haryana",
  "Goa",
  "Andhra Pradesh",
  "Madhya Pradesh",
  "Other",
];

const fieldClass =
  "mt-2 h-11 w-full rounded-xl border border-[#e6dccb] bg-[#fbfaf7] px-3.5 text-sm text-neutral-950 outline-none transition-colors placeholder:text-neutral-400 focus:border-[#c6a15a] focus:bg-white";

export function ProfileExperience({
  section,
  name,
  email,
  phone,
  role,
  memberSince,
  addresses,
  orders,
}: {
  section: ProfileSection;
  name: string;
  email: string;
  phone: string;
  role: string;
  memberSince: string;
  addresses: SavedAddress[];
  orders: StoredOrder[];
}) {
  return (
    <div className="mx-auto grid w-full max-w-6xl gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[250px_minmax(0,1fr)] lg:py-14">
      <aside className="h-fit rounded-3xl border border-[#ece4d6] bg-white p-4 shadow-[0_18px_40px_rgba(28,25,23,0.04)]">
        <p className="px-3 pt-2 text-[11px] font-semibold tracking-[0.28em] text-[#c6a15a]">ACCOUNT</p>
        <p className="mt-2 px-3 text-lg font-semibold tracking-tight text-[#1c1917]">{name}</p>
        <nav className="mt-5 flex gap-2 overflow-x-auto lg:flex-col" aria-label="Account">
          {sections.map((item) => {
            const active = item.id === section;
            const href = item.id === "account" ? "/profile" : `/profile?section=${item.id}`;
            return (
              <Link
                key={item.id}
                href={href}
                aria-current={active ? "page" : undefined}
                className={`shrink-0 rounded-xl border-l-2 px-3 py-2.5 text-sm ${
                  active
                    ? "border-[#c6a15a] bg-[#fbf7ef] font-medium text-[#1c1917]"
                    : "border-transparent text-neutral-500 hover:bg-[#fbfaf7] hover:text-[#1c1917]"
                }`}
              >
                {item.label}
                {item.id === "orders" ? (
                  <span className="ml-2 text-xs text-neutral-400">{orders.length}</span>
                ) : null}
              </Link>
            );
          })}
        </nav>
        <div className="mt-5 border-t border-[#f0eadf] px-1 pt-4">
          <SignOutButton />
        </div>
      </aside>

      {section === "account" ? (
        <AccountPanel name={name} email={email} phone={phone} role={role} memberSince={memberSince} orders={orders.length} addresses={addresses.length} />
      ) : null}
      {section === "addresses" ? <AddressPanel addresses={addresses} fallbackName={name} fallbackPhone={phone} /> : null}
      {section === "orders" ? <OrderPanel orders={orders} /> : null}
      {section === "support" ? <SupportPanel name={name} email={email} phone={phone} /> : null}
    </div>
  );
}

function AccountPanel({
  name,
  email,
  phone,
  role,
  memberSince,
  orders,
  addresses,
}: {
  name: string;
  email: string;
  phone: string;
  role: string;
  memberSince: string;
  orders: number;
  addresses: number;
}) {
  const initial = name.trim().charAt(0).toUpperCase() || "L";
  const phoneLabel = phone ? formatPhone(phone) : "Not added";
  return (
    <section>
      <div className="border-b border-[#e6dccb] pb-6">
        <p className="flex items-center gap-3 text-[11px] font-semibold tracking-[0.28em] text-[#c6a15a]">
          YOUR ACCOUNT
          <span aria-hidden="true" className="h-px w-8 bg-[#c6a15a]" />
        </p>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight text-[#1c1917]">My account</h1>
        <p className="mt-2 max-w-md text-sm leading-6 text-neutral-500">
          {memberSince ? `With Lotus Lights since ${memberSince}.` : "Your Lotus Lights account."}
        </p>
      </div>

      <div className="relative mt-8 overflow-hidden rounded-3xl border border-[#ece4d6] bg-white shadow-[0_18px_40px_rgba(28,25,23,0.05)]">
        <span aria-hidden="true" className="absolute inset-x-0 top-0 h-1 bg-[#c6a15a]" />
        <div className="flex items-center gap-5 px-6 py-6 sm:px-8">
          <span className="grid size-16 shrink-0 place-items-center rounded-full border border-[#e6dccb] bg-[#fbf7ef] text-xl font-semibold tracking-tight text-[#8a6a32]">
            {initial}
          </span>
          <div>
            <p className="text-[11px] font-semibold tracking-[0.22em] text-[#8a6a32] uppercase">
              {role === "admin" ? "Admin" : "Customer"}
            </p>
            <p className="mt-1 text-2xl font-semibold tracking-tight text-[#1c1917]">{name}</p>
          </div>
        </div>
        <dl className="grid border-t border-[#f3eee6] sm:grid-cols-2">
          <div className="px-6 py-5 sm:px-8">
            <dt className="text-[11px] font-semibold tracking-[0.16em] text-neutral-400 uppercase">Email</dt>
            <dd className="mt-1 break-all text-sm font-medium text-[#1c1917]">{email || "Not added"}</dd>
          </div>
          <div className="border-t border-[#f3eee6] px-6 py-5 sm:border-t-0 sm:border-l sm:px-8">
            <dt className="text-[11px] font-semibold tracking-[0.16em] text-neutral-400 uppercase">Phone</dt>
            <dd className="mt-1 text-sm font-medium text-[#1c1917]">{phoneLabel}</dd>
          </div>
        </dl>
      </div>

      <ul className="mt-5 grid gap-4 sm:grid-cols-3">
        <li>
          <Link
            href="/profile?section=addresses"
            className="flex h-full flex-col rounded-3xl border border-[#ece4d6] bg-white p-5 shadow-[0_18px_40px_rgba(28,25,23,0.04)] transition-colors hover:border-[#c6a15a]"
          >
            <p className="text-[11px] font-semibold tracking-[0.22em] text-[#8a6a32] uppercase">Addresses</p>
            <p className="mt-4 text-lg font-semibold tracking-tight text-[#1c1917]">
              {addresses === 0 ? "None saved" : `${addresses} saved`}
            </p>
            <p className="mt-1 text-sm leading-6 text-neutral-500">Used automatically at checkout.</p>
          </Link>
        </li>
        <li>
          <Link
            href="/profile?section=orders"
            className="flex h-full flex-col rounded-3xl border border-[#ece4d6] bg-white p-5 shadow-[0_18px_40px_rgba(28,25,23,0.04)] transition-colors hover:border-[#c6a15a]"
          >
            <p className="text-[11px] font-semibold tracking-[0.22em] text-[#8a6a32] uppercase">Orders</p>
            <p className="mt-4 text-lg font-semibold tracking-tight text-[#1c1917]">
              {orders === 0 ? "No orders yet" : `${orders} previous ${orders === 1 ? "order" : "orders"}`}
            </p>
            <p className="mt-1 text-sm leading-6 text-neutral-500">Receipts, delivery, and tracking.</p>
          </Link>
        </li>
        <li>
          <Link
            href="/profile?section=support"
            className="flex h-full flex-col rounded-3xl border border-[#ece4d6] bg-white p-5 shadow-[0_18px_40px_rgba(28,25,23,0.04)] transition-colors hover:border-[#c6a15a]"
          >
            <p className="text-[11px] font-semibold tracking-[0.22em] text-[#8a6a32] uppercase">Support</p>
            <p className="mt-4 text-lg font-semibold tracking-tight text-[#1c1917]">We are here</p>
            <p className="mt-1 text-sm leading-6 text-neutral-500">Ask about an order or a light.</p>
          </Link>
        </li>
      </ul>

      {role === "admin" ? (
        <Link
          href="/admin"
          className="mt-5 inline-flex h-11 items-center rounded-xl bg-[#1c1917] px-5 text-sm font-medium text-white hover:bg-[#2a241c]"
        >
          Open admin
        </Link>
      ) : null}
    </section>
  );
}

function AddressPanel({
  addresses,
  fallbackName,
  fallbackPhone,
}: {
  addresses: SavedAddress[];
  fallbackName: string;
  fallbackPhone: string;
}) {
  const [editing, setEditing] = useState<string | null>(null);
  const [noteId, setNoteId] = useState<string | null>(null);
  const defaultId = addresses.find((address) => address.isDefault)?.id ?? addresses[0]?.id ?? "";
  const editingAddress = addresses.find((address) => address.id === editing);

  return (
    <section>
      <div className="flex flex-wrap items-end justify-between gap-4 border-b border-[#e6dccb] pb-6">
        <div>
          <p className="text-sm text-neutral-500">
            <Link href="/profile" className="hover:text-[#8a6a32]">
              Your account
            </Link>
            <span className="mx-2" aria-hidden="true">
              ›
            </span>
            <span className="text-[#8a6a32]">Your addresses</span>
          </p>
          <p className="mt-5 flex items-center gap-3 text-[11px] font-semibold tracking-[0.28em] text-[#c6a15a]">
            ADDRESS BOOK
            <span aria-hidden="true" className="h-px w-8 bg-[#c6a15a]" />
          </p>
          <h1 className="mt-3 text-4xl font-semibold tracking-tight text-[#1c1917]">Your addresses</h1>
          <p className="mt-2 max-w-md text-sm leading-6 text-neutral-500">
            The default address is filled in at checkout. You can still change it on an order.
          </p>
        </div>
        <p className="text-[11px] font-semibold tracking-[0.22em] text-neutral-400 uppercase">
          {addresses.length} saved
        </p>
      </div>

      {editing === "new" ? (
        <AddressForm
          title="Add a new address"
          initial={{
            label: "Home",
            addressType: "home",
            fullName: fallbackName,
            phone: fallbackPhone,
            line: "",
            line2: "",
            city: "",
            state: "Uttar Pradesh",
            pin: "",
            country: "India",
            instructions: "",
            isDefault: addresses.length === 0,
          }}
          onClose={() => setEditing(null)}
        />
      ) : null}
      {editingAddress ? (
        <AddressForm title="Edit address" initial={editingAddress} onClose={() => setEditing(null)} />
      ) : null}

      <ul className="mt-8 grid items-stretch gap-5 sm:grid-cols-2">
        <li>
          <button
            type="button"
            onClick={() => {
              setNoteId(null);
              setEditing("new");
            }}
            className="flex h-full min-h-72 w-full cursor-pointer flex-col items-start justify-between rounded-3xl border border-dashed border-[#d9cdb8] bg-white/80 p-6 text-left transition-colors hover:border-[#c6a15a] hover:bg-white"
          >
            <span className="grid size-12 place-items-center rounded-full border border-[#e6dccb] text-2xl leading-none font-light text-[#8a6a32]">
              +
            </span>
            <span>
              <span className="block text-lg font-semibold tracking-tight text-[#1c1917]">Add address</span>
              <span className="mt-1 block max-w-[16rem] text-sm leading-6 text-neutral-500">
                Home, studio, or another place we should deliver.
              </span>
            </span>
          </button>
        </li>
        {addresses.map((address) => {
          const isDefault = address.id === defaultId;
          return (
            <li
              key={address.id}
              className={`relative flex min-h-72 flex-col overflow-hidden rounded-3xl border bg-white shadow-[0_18px_40px_rgba(28,25,23,0.05)] ${
                isDefault ? "border-[#c6a15a]" : "border-[#ece4d6]"
              }`}
            >
              {isDefault ? <span aria-hidden="true" className="absolute inset-x-0 top-0 h-1 bg-[#c6a15a]" /> : null}
              <div className="flex items-start justify-between gap-3 px-6 pt-6">
                <p className="text-[11px] font-semibold tracking-[0.22em] text-[#8a6a32] uppercase">{address.label}</p>
                {isDefault ? (
                  <span className="rounded-full border border-[#c6a15a] bg-[#fbf7ef] px-2.5 py-1 text-[10px] font-semibold tracking-[0.16em] text-[#8a6a32] uppercase">
                    Default
                  </span>
                ) : null}
              </div>
              <p className="mt-4 px-6 text-xl font-semibold tracking-tight text-[#1c1917]">{address.fullName}</p>
              <div className="mt-3 space-y-0.5 px-6 text-sm leading-6 text-neutral-600">
                <p className="whitespace-pre-line">{address.line}</p>
                {address.line2 ? <p>{address.line2}</p> : null}
                <p>
                  {address.city}, {address.state} {address.pin}
                </p>
                <p>{address.country || "India"}</p>
              </div>
              <p className="mt-4 px-6 text-sm text-[#1c1917]">
                <span className="mr-2 text-[11px] font-semibold tracking-[0.16em] text-neutral-400 uppercase">Phone</span>
                {formatPhone(address.phone)}
              </p>
              {address.instructions ? (
                <p className="mx-6 mt-4 rounded-2xl bg-[#fbf7ef] px-3 py-2 text-sm leading-6 text-neutral-600">{address.instructions}</p>
              ) : null}
              <button
                type="button"
                onClick={() => setNoteId(noteId === address.id ? null : address.id)}
                className="mt-3 w-fit cursor-pointer px-6 text-sm text-[#8a6a32] hover:underline"
              >
                {address.instructions ? "Edit landmark" : "Add a landmark"}
              </button>
              {noteId === address.id ? (
                <div className="px-6">
                  <InstructionsForm address={address} onDone={() => setNoteId(null)} />
                </div>
              ) : null}
              <div className="mt-auto flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-[#f3eee6] px-6 py-4">
                <button
                  type="button"
                  onClick={() => {
                    setNoteId(null);
                    setEditing(address.id);
                  }}
                  className="cursor-pointer text-[13px] font-medium tracking-wide text-[#1c1917] hover:text-[#8a6a32]"
                >
                  Edit
                </button>
                <RemoveAddress id={address.id} />
                {isDefault ? null : <SetDefaultAddress id={address.id} />}
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

function formatPhone(phone: string) {
  const digits = phone.replace(/\D/g, "");
  if (digits.length === 12 && digits.startsWith("91")) return `+91 ${digits.slice(2, 7)} ${digits.slice(7)}`;
  if (digits.length === 10) return `${digits.slice(0, 5)} ${digits.slice(5)}`;
  return phone;
}

function AddressForm({
  title,
  initial,
  onClose,
}: {
  title: string;
  initial: Omit<SavedAddress, "id" | "userId"> & { id?: string };
  onClose: () => void;
}) {
  const router = useRouter();
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  async function onSubmit(formData: FormData) {
    setPending(true);
    setError("");
    const response = await fetch("/api/account/addresses", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: initial.id,
        addressType: String(formData.get("addressType") ?? "home"),
        fullName: String(formData.get("fullName") ?? ""),
        phone: String(formData.get("phone") ?? ""),
        line: String(formData.get("line") ?? ""),
        line2: String(formData.get("line2") ?? ""),
        city: String(formData.get("city") ?? ""),
        state: String(formData.get("state") ?? ""),
        pin: String(formData.get("pin") ?? ""),
        country: String(formData.get("country") ?? "India"),
        instructions: String(formData.get("instructions") ?? ""),
        isDefault: formData.get("isDefault") === "on",
      }),
    });
    const body = (await response.json()) as { success?: boolean; message?: string };
    setPending(false);
    if (!response.ok || !body.success) {
      setError(body.message ?? "Unable to save this address.");
      return;
    }
    onClose();
    router.refresh();
  }

  return (
    <form
      className="mt-8 rounded-3xl border border-[#ece4d6] bg-white p-6 shadow-[0_18px_40px_rgba(28,25,23,0.05)] sm:p-8"
      onSubmit={(event) => {
        event.preventDefault();
        void onSubmit(new FormData(event.currentTarget));
      }}
    >
      <p className="text-[11px] font-semibold tracking-[0.22em] text-[#c6a15a]">DELIVERY</p>
      <h2 className="mt-2 text-2xl font-semibold tracking-tight text-[#1c1917]">{title}</h2>
      {error ? <p className="mt-2 text-sm text-red-600">{error}</p> : null}
      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <label className="text-sm font-medium text-neutral-800">
          Address type
          <select name="addressType" defaultValue={initial.addressType || "home"} className={fieldClass}>
            <option value="home">Home</option>
            <option value="work">Work</option>
            <option value="other">Other</option>
          </select>
        </label>
        <label className="text-sm font-medium text-neutral-800">
          Full name
          <input name="fullName" required defaultValue={initial.fullName} className={fieldClass} />
        </label>
        <label className="text-sm font-medium text-neutral-800 sm:col-span-2">
          Address line 1
          <input name="line" required defaultValue={initial.line} className={fieldClass} placeholder="House, street, area" />
        </label>
        <label className="text-sm font-medium text-neutral-800">
          Address line 2
          <input name="line2" defaultValue={initial.line2} className={fieldClass} placeholder="Apartment, floor" />
        </label>
        <label className="text-sm font-medium text-neutral-800">
          Country
          <input name="country" defaultValue={initial.country || "India"} className={fieldClass} />
        </label>
        <label className="text-sm font-medium text-neutral-800">
          City
          <input name="city" required defaultValue={initial.city} className={fieldClass} />
        </label>
        <label className="text-sm font-medium text-neutral-800">
          State
          <select name="state" defaultValue={initial.state || "Karnataka"} className={fieldClass}>
            {states.map((state) => (
              <option key={state}>{state}</option>
            ))}
          </select>
        </label>
        <label className="text-sm font-medium text-neutral-800">
          PIN code
          <input name="pin" required inputMode="numeric" defaultValue={initial.pin} className={fieldClass} placeholder="560001" />
        </label>
        <label className="text-sm font-medium text-neutral-800">
          Phone
          <input name="phone" required defaultValue={initial.phone} className={fieldClass} placeholder="98765 43210" />
        </label>
        <label className="text-sm font-medium text-neutral-800 sm:col-span-2">
          Landmark
          <textarea
            name="instructions"
            rows={3}
            maxLength={160}
            defaultValue={initial.instructions}
            placeholder="Near a market, hospital, or gate."
            className="mt-2 w-full resize-y rounded-xl border border-[#e6dccb] bg-[#fbfaf7] px-3.5 py-2.5 text-sm outline-none placeholder:text-neutral-400 focus:border-[#c6a15a] focus:bg-white"
          />
        </label>
        <label className="flex items-center gap-2 text-sm text-neutral-800 sm:col-span-2">
          <input name="isDefault" type="checkbox" defaultChecked={initial.isDefault} className="size-4 accent-[#c6a15a]" />
          Use as my default address
        </label>
      </div>
      <div className="mt-5 flex gap-2">
        <button
          type="submit"
          disabled={pending}
          className="h-11 cursor-pointer rounded-xl bg-[#1c1917] px-5 text-sm font-medium text-white hover:bg-[#2a241c] disabled:opacity-60"
        >
          {pending ? "Saving..." : "Save address"}
        </button>
        <button type="button" onClick={onClose} className="h-11 cursor-pointer rounded-lg px-4 text-sm text-neutral-600">
          Cancel
        </button>
      </div>
    </form>
  );
}

function RemoveAddress({ id }: { id: string }) {
  const router = useRouter();
  const [pending, setPending] = useState(false);

  return (
    <button
      type="button"
      disabled={pending}
      onClick={async () => {
        setPending(true);
        await fetch(`/api/account/addresses?id=${encodeURIComponent(id)}`, { method: "DELETE" });
        router.refresh();
      }}
      className="cursor-pointer text-[13px] font-medium tracking-wide text-neutral-500 hover:text-[#1c1917] disabled:opacity-60"
    >
      {pending ? "Removing..." : "Remove"}
    </button>
  );
}

function SetDefaultAddress({ id }: { id: string }) {
  const router = useRouter();
  const [pending, setPending] = useState(false);

  return (
    <button
      type="button"
      disabled={pending}
      onClick={async () => {
        setPending(true);
        await fetch("/api/account/addresses", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ action: "default", id }),
        });
        router.refresh();
      }}
      className="cursor-pointer text-[13px] font-medium tracking-wide text-[#8a6a32] hover:underline disabled:opacity-60"
    >
      {pending ? "Saving..." : "Set as default"}
    </button>
  );
}

function InstructionsForm({ address, onDone }: { address: SavedAddress; onDone: () => void }) {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const [note, setNote] = useState(address.instructions);

  return (
    <form
      className="mt-3"
      onSubmit={async (event) => {
        event.preventDefault();
        setPending(true);
        await fetch("/api/account/addresses", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ action: "instructions", id: address.id, instructions: note }),
        });
        onDone();
        router.refresh();
      }}
    >
      <textarea
        value={note}
        onChange={(event) => setNote(event.target.value.slice(0, 160))}
        rows={3}
        placeholder="Landmark, gate code, or when someone is home."
        className="w-full resize-y rounded-lg border border-[#e6dccb] px-3 py-2 text-sm outline-none focus:border-[#c6a15a]"
      />
      <div className="mt-2 flex gap-3">
        <button type="submit" disabled={pending} className="cursor-pointer text-sm font-medium text-[#8a6a32] hover:underline">
          {pending ? "Saving..." : "Save"}
        </button>
        <button type="button" onClick={onDone} className="cursor-pointer text-sm text-neutral-500 hover:underline">
          Cancel
        </button>
      </div>
    </form>
  );
}

type OrderTab = "orders" | "again" | "unshipped";
type OrderRange = "30" | "90" | "year" | "past-year" | "all";

const orderTabs: { id: OrderTab; label: string }[] = [
  { id: "orders", label: "Orders" },
  { id: "again", label: "Buy again" },
  { id: "unshipped", label: "Not yet shipped" },
];

const thisYear = new Date().getFullYear();

const orderRanges: { id: OrderRange; label: string }[] = [
  { id: "30", label: "last 30 days" },
  { id: "90", label: "past 3 months" },
  { id: "year", label: String(thisYear) },
  { id: "past-year", label: String(thisYear - 1) },
  { id: "all", label: "all orders" },
];

function OrderPanel({ orders }: { orders: StoredOrder[] }) {
  const [tab, setTab] = useState<OrderTab>("orders");
  const [range, setRange] = useState<OrderRange>("30");
  const [draft, setDraft] = useState("");
  const [query, setQuery] = useState("");
  const [added, setAdded] = useState("");

  const ranged = orders.filter((order) => inRange(order, range) && matchesOrder(order, query));
  const visible = tab === "unshipped" ? ranged.filter((order) => !isShipped(order)) : ranged;
  const again = buyAgainItems(ranged);
  const period = placedIn(range);
  const nextRange = widerRange(range);

  return (
    <section>
      <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-[11px] font-semibold tracking-[0.28em] text-[#c6a15a]">YOUR ACCOUNT</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-neutral-950">Your orders</h1>
        </div>
        <form
          className="flex w-full gap-2 lg:max-w-md"
          onSubmit={(event) => {
            event.preventDefault();
            setQuery(draft.trim());
          }}
        >
          <label className="flex min-w-0 flex-1 items-center gap-2 rounded-full border border-[#e6dccb] bg-white px-4 shadow-[0_8px_24px_rgba(28,25,23,0.04)] focus-within:border-[#c6a15a]">
            <OrderSearchIcon />
            <input
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
              placeholder="Search all orders"
              aria-label="Search all orders"
              className="h-11 min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-neutral-400"
            />
          </label>
          <button
            type="submit"
            className="h-11 shrink-0 cursor-pointer rounded-full bg-[#1c1917] px-4 text-sm font-medium text-white hover:bg-[#2a2420] sm:px-5"
          >
            Search
          </button>
        </form>
      </div>

      <div className="mt-6 flex gap-1 overflow-x-auto border-b border-[#ece4d6] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {orderTabs.map((item) => {
          const active = tab === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => setTab(item.id)}
              className={`shrink-0 cursor-pointer border-b-2 px-4 py-3 text-sm ${
                active
                  ? "border-[#c6a15a] font-semibold text-[#1c1917]"
                  : "border-transparent text-neutral-500 hover:text-[#1c1917]"
              }`}
            >
              {item.label}
            </button>
          );
        })}
      </div>

      <div className="mt-5 flex flex-wrap items-center gap-2 text-sm text-neutral-600">
        <span>
          <span className="font-semibold text-[#1c1917]">{tab === "again" ? again.length : visible.length}</span>{" "}
          {tab === "again" ? "lights from orders in" : "orders placed in"}
        </span>
        <PeriodMenu value={range} onChange={setRange} />
      </div>

      {tab === "again" ? (
        again.length === 0 ? (
          <OrderEmpty
            title="Nothing to buy again"
            detail={`No lights from orders placed in ${period} are ready to add back to your bag.`}
            action={nextRange ? { label: nextRange.label, onClick: () => setRange(nextRange.id) } : undefined}
          />
        ) : (
          <ul className="mt-6 grid gap-4 sm:grid-cols-2">
            {again.map((item) => {
              const key = `${item.categorySlug}-${item.slug}-${item.watt || ""}-${item.lightColor || ""}`;
              const href = productHref(item);
              const choice = optionLabel(item);
              return (
                <li key={key} className="flex gap-4 rounded-3xl border border-[#ece4d6] bg-white p-4 shadow-[0_12px_32px_rgba(28,25,23,0.04)]">
                  {href ? (
                    <Link href={href} className="relative size-20 shrink-0 overflow-hidden rounded-2xl bg-[#f6f3ee]">
                      {item.image ? <Image src={item.image} alt="" fill sizes="80px" className="object-cover" /> : null}
                    </Link>
                  ) : (
                    <span className="relative size-20 shrink-0 overflow-hidden rounded-2xl bg-[#f6f3ee]">
                      {item.image ? <Image src={item.image} alt="" fill sizes="80px" className="object-cover" /> : null}
                    </span>
                  )}
                  <span className="flex min-w-0 flex-1 flex-col">
                    <span className="truncate text-sm font-semibold text-[#1c1917]">{item.name}</span>
                    {choice ? <span className="mt-1 text-xs text-neutral-500">{choice}</span> : null}
                    <span className="mt-1 text-sm font-medium text-[#8a6a32]">{formatPrice(item.price)}</span>
                    <button
                      type="button"
                      onClick={() => {
                        addItem({
                          slug: item.slug,
                          categorySlug: item.categorySlug,
                          name: item.name,
                          price: item.price,
                          image: item.image,
                          alt: item.name,
                          quantity: 1,
                          watt: item.watt,
                          lightColor: item.lightColor,
                        });
                        setAdded(key);
                      }}
                      className="mt-3 h-9 w-fit cursor-pointer rounded-full bg-[#1c1917] px-4 text-sm font-medium text-white hover:bg-[#2a2420]"
                    >
                      {added === key ? "Added" : "Buy again"}
                    </button>
                  </span>
                </li>
              );
            })}
          </ul>
        )
      ) : visible.length === 0 ? (
        <OrderEmpty
          title={query ? "No matching orders" : "No orders in this period"}
          detail={
            query
              ? `Nothing matches “${query}” in ${period}.`
              : `Looks like you have not placed an order in ${period}.`
          }
          action={
            query
              ? { label: "Clear search", onClick: () => { setDraft(""); setQuery(""); } }
              : nextRange
                ? { label: nextRange.label, onClick: () => setRange(nextRange.id) }
                : undefined
          }
        />
      ) : (
        <ul className="mt-6 space-y-5">
          {visible.map((order) => {
            const discount = Math.max(0, order.subtotal + order.shipping - order.total);
            const addressLines = deliveryLines(order.address);
            const onlyProduct = order.items.length === 1 ? productHref(order.items[0]) : "";
            return (
              <li
                key={order.number}
                className={`relative overflow-hidden rounded-3xl border border-[#efe6d6] bg-white shadow-[0_16px_40px_rgba(40,32,20,0.04)] ${
                  onlyProduct ? "transition-colors hover:border-[#c6a15a]" : ""
                }`}
              >
                {onlyProduct ? (
                  <Link href={onlyProduct} aria-label={`Open ${order.items[0].name}`} className="absolute inset-0 z-10 rounded-3xl" />
                ) : null}
                <div className="grid gap-4 bg-[#fbfaf7] px-5 py-4 sm:grid-cols-2 sm:px-6 lg:grid-cols-4">
                  <div>
                    <p className="text-[11px] font-medium tracking-wide text-neutral-500 uppercase">Order placed</p>
                    <p className="mt-1 text-sm font-medium text-neutral-950">{formatWhen(order.placedAt)}</p>
                  </div>
                  <div>
                    <p className="text-[11px] font-medium tracking-wide text-neutral-500 uppercase">Total</p>
                    <p className="mt-1 text-sm font-semibold text-neutral-950">{formatPrice(order.total)}</p>
                  </div>
                  <div>
                    <p className="text-[11px] font-medium tracking-wide text-neutral-500 uppercase">Ship to</p>
                    <p className="mt-1 text-sm font-medium text-neutral-950">{order.address.fullName || "Delivery address"}</p>
                    <p className="text-xs text-neutral-500">{order.address.city}</p>
                  </div>
                  <div className="lg:text-right">
                    <p className="text-[11px] font-medium tracking-wide text-neutral-500 uppercase">Order</p>
                    <p className="mt-1 text-sm font-medium text-neutral-950">{order.number}</p>
                    <span className={`mt-2 inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${statusTone(order.status)}`}>
                      {order.status}
                    </span>
                  </div>
                </div>

                {order.courier || order.trackingNumber ? (
                  <div className="grid gap-4 border-b border-[#f0eadf] bg-[#fbf7ef] px-5 py-4 sm:grid-cols-2 sm:px-6">
                    <div>
                      <p className="text-[11px] font-medium tracking-wide text-neutral-500 uppercase">Courier</p>
                      <p className="mt-1 text-sm font-semibold text-neutral-950">{order.courier || "Not added yet"}</p>
                    </div>
                    <div>
                      <p className="text-[11px] font-medium tracking-wide text-neutral-500 uppercase">Tracking number</p>
                      <p className="mt-1 font-mono text-sm font-semibold tracking-wide text-neutral-950">
                        {order.trackingNumber || "Not added yet"}
                      </p>
                    </div>
                  </div>
                ) : null}

                <ul className="divide-y divide-[#f0eadf] px-5 sm:px-6">
                  {order.items.map((item) => {
                    const choice = optionLabel(item);
                    const href = onlyProduct ? "" : productHref(item);
                    return (
                      <li key={`${order.number}-${item.slug}-${item.watt || ""}-${item.lightColor || ""}`} className="relative flex gap-4 py-4">
                        {href ? (
                          <Link href={href} aria-label={`Open ${item.name}`} className="absolute inset-0 z-10" />
                        ) : null}
                        <span className="relative size-16 shrink-0 overflow-hidden rounded-xl bg-[#f6f3ee] sm:size-[4.5rem]">
                          {item.image ? <Image src={item.image} alt="" fill sizes="72px" className="object-cover" /> : null}
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="block truncate text-sm font-semibold text-neutral-950">{item.name}</span>
                          <span className="mt-1 block text-xs text-neutral-500">
                            {choice ? `${choice} · ` : ""}Qty {item.quantity}
                          </span>
                          {item.quantity > 1 ? (
                            <span className="mt-1 block text-xs text-neutral-400">{formatPrice(item.price)} each</span>
                          ) : null}
                        </span>
                        <span className="text-sm font-semibold text-neutral-950">{formatPrice(item.price * item.quantity)}</span>
                      </li>
                    );
                  })}
                </ul>

                <div className="grid gap-5 border-t border-[#f0eadf] px-5 py-5 sm:px-6 lg:grid-cols-[minmax(0,1fr)_16rem]">
                  <div>
                    <p className="text-[11px] font-medium tracking-wide text-neutral-500 uppercase">Delivery</p>
                    {order.address.fullName ? (
                      <p className="mt-2 text-sm font-medium text-neutral-950">{order.address.fullName}</p>
                    ) : null}
                    {order.address.phone ? <p className="text-sm text-neutral-600">{order.address.phone}</p> : null}
                    {addressLines.map((line) => (
                      <p key={line} className="text-sm leading-6 text-neutral-600">
                        {line}
                      </p>
                    ))}
                    <p className="mt-2 text-xs text-neutral-500">{order.payment}</p>
                  </div>
                  <dl className="space-y-1.5 text-sm">
                    <div className="flex justify-between text-neutral-500">
                      <dt>Subtotal</dt>
                      <dd>{formatPrice(order.subtotal)}</dd>
                    </div>
                    {discount > 0 ? (
                      <div className="flex justify-between text-[#3f6808]">
                        <dt>Savings</dt>
                        <dd>−{formatPrice(discount)}</dd>
                      </div>
                    ) : null}
                    <div className="flex justify-between text-neutral-500">
                      <dt>Shipping</dt>
                      <dd>{order.shipping === 0 ? "Free" : formatPrice(order.shipping)}</dd>
                    </div>
                    <div className="flex justify-between border-t border-[#f0eadf] pt-2 text-base font-semibold text-neutral-950">
                      <dt>Total</dt>
                      <dd>{formatPrice(order.total)}</dd>
                    </div>
                  </dl>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}

function OrderEmpty({
  title,
  detail,
  action,
}: {
  title: string;
  detail: string;
  action?: { label: string; onClick: () => void };
}) {
  return (
    <div className="mt-6 rounded-3xl border border-[#ece4d6] bg-white px-6 py-14 text-center shadow-[0_12px_32px_rgba(28,25,23,0.04)]">
      <p className="text-lg font-semibold text-[#1c1917]">{title}</p>
      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-neutral-500">{detail}</p>
      {action ? (
        <button
          type="button"
          onClick={action.onClick}
          className="mt-5 cursor-pointer text-sm font-medium text-[#8a6a32] underline-offset-4 hover:underline"
        >
          {action.label}
        </button>
      ) : (
        <Link
          href="/shop"
          className="mt-5 inline-flex h-11 items-center rounded-full bg-[#1c1917] px-5 text-sm font-medium text-white hover:bg-[#2a2420]"
        >
          Browse lights
        </Link>
      )}
    </div>
  );
}

function placedIn(range: OrderRange) {
  if (range === "30") return "the last 30 days";
  if (range === "90") return "the past 3 months";
  if (range === "year") return String(thisYear);
  if (range === "past-year") return String(thisYear - 1);
  return "any period";
}

function inRange(order: StoredOrder, range: OrderRange) {
  if (range === "all") return true;
  const placed = Date.parse(order.placedAt);
  if (Number.isNaN(placed)) return false;
  const date = new Date(placed);
  if (range === "year" || range === "past-year") {
    const year = range === "year" ? thisYear : thisYear - 1;
    return date.getFullYear() === year;
  }
  const days = range === "30" ? 30 : 90;
  const age = Date.now() - placed;
  return age >= 0 && age <= days * 86_400_000;
}

function matchesOrder(order: StoredOrder, query: string) {
  const needle = query.trim().toLowerCase();
  if (!needle) return true;
  const haystack = [
    order.number,
    order.payment,
    order.courier,
    order.trackingNumber,
    order.address.fullName,
    order.address.city,
    order.address.line,
    ...order.items.flatMap((item) => [item.name, item.watt, item.lightColor]),
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
  return haystack.includes(needle);
}

function isShipped(order: StoredOrder) {
  return Boolean(order.courier?.trim() || order.trackingNumber?.trim());
}

function statusTone(status: StoredOrder["status"]) {
  if (status === "Cancelled") return "bg-[#fdecec] text-[#8a3030]";
  if (status === "Shipped" || status === "Delivered") return "bg-[#e7f4ea] text-[#2f7d4a]";
  if (status === "Processing" || status === "Confirmed") return "bg-[#e5f0ff] text-[#1d4f91]";
  return "bg-[#eef2f6] text-[#3d4d63]";
}

function buyAgainItems(orders: StoredOrder[]) {
  const seen = new Set<string>();
  const items: StoredOrder["items"] = [];
  for (const order of orders) {
    for (const item of order.items) {
      if (!item.slug || !item.categorySlug) continue;
      const key = `${item.categorySlug}-${item.slug}-${item.watt || ""}-${item.lightColor || ""}`;
      if (seen.has(key)) continue;
      seen.add(key);
      items.push(item);
    }
  }
  return items;
}

function widerRange(range: OrderRange) {
  if (range === "30") return { id: "90" as const, label: "View orders in the past 3 months" };
  if (range === "90") return { id: "year" as const, label: `View orders from ${thisYear}` };
  if (range === "year") return { id: "past-year" as const, label: `View orders from ${thisYear - 1}` };
  if (range === "past-year") return { id: "all" as const, label: "View all orders" };
  return null;
}

function PeriodMenu({ value, onChange }: { value: OrderRange; onChange: (value: OrderRange) => void }) {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const current = orderRanges.find((item) => item.id === value) ?? orderRanges[0];

  useEffect(() => {
    if (!open) return;
    function onPointer(event: MouseEvent) {
      if (!menuRef.current?.contains(event.target as Node)) setOpen(false);
    }
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", onPointer);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onPointer);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div ref={menuRef} className="relative">
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label="Order period"
        onClick={() => setOpen((currentOpen) => !currentOpen)}
        className="inline-flex h-10 cursor-pointer items-center gap-2 rounded-full border border-[#e6dccb] bg-white px-4 text-sm font-medium text-[#1c1917] shadow-[0_8px_20px_rgba(28,25,23,0.05)] hover:border-[#c6a15a]"
      >
        {current.label}
        <ChevronIcon open={open} />
      </button>
      {open ? (
        <ul
          role="listbox"
          aria-label="Order period"
          className="absolute left-0 z-20 mt-2 min-w-48 overflow-hidden rounded-2xl border border-[#ece4d6] bg-[#fbfaf7] py-1.5 shadow-[0_18px_40px_rgba(28,25,23,0.12)]"
        >
          {orderRanges.map((item) => {
            const active = item.id === value;
            return (
              <li key={item.id} role="presentation">
                <button
                  type="button"
                  role="option"
                  aria-selected={active}
                  onClick={() => {
                    onChange(item.id);
                    setOpen(false);
                  }}
                  className={`flex w-full cursor-pointer items-center justify-between gap-6 px-4 py-2.5 text-left text-sm ${
                    active ? "bg-white font-medium text-[#8a6a32]" : "text-[#1c1917] hover:bg-white"
                  }`}
                >
                  {item.label}
                  {active ? <span className="text-[#c6a15a]">✓</span> : null}
                </button>
              </li>
            );
          })}
        </ul>
      ) : null}
    </div>
  );
}

function ChevronIcon({ open }: { open: boolean }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 20 20"
      className={`size-4 text-[#c6a15a] transition-transform ${open ? "rotate-180" : ""}`}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
    >
      <path d="m5 7.5 5 5 5-5" />
    </svg>
  );
}

function OrderSearchIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="size-4 shrink-0 text-[#c6a15a]" fill="none" stroke="currentColor" strokeWidth="1.75">
      <circle cx="11" cy="11" r="6.5" />
      <path d="M16 16.5 20 20.5" />
    </svg>
  );
}

function productHref(item: StoredOrder["items"][number]) {
  if (!item.slug || !item.categorySlug) return "";
  return `/shop/${item.categorySlug}/${item.slug}`;
}

function deliveryLines(address: StoredOrder["address"]) {
  const line = address.line.trim();
  const extras = [address.city, address.state, address.pin]
    .map((part) => part.trim())
    .filter((part) => part && !line.toLowerCase().includes(part.toLowerCase()));
  return [line, extras.join(", ")].filter(Boolean);
}

const supportSubjects = ["Order support", "Delivery", "Returns", "A light I bought", "Something else"];

function SupportPanel({ name, email, phone }: { name: string; email: string; phone: string }) {
  const [sent, setSent] = useState(false);

  return (
    <section>
      <h1 className="text-3xl font-bold tracking-tight text-neutral-950">Support</h1>
      <p className="mt-2 text-sm text-neutral-500">Write to us about an order, a delivery, or a light.</p>

      <ul className="mt-6 grid gap-3 sm:grid-cols-3">
        <li className="rounded-2xl border border-neutral-200 bg-white p-5">
          <p className="text-xs font-semibold tracking-[0.16em] text-[#c6a15a]">CALL</p>
          <a href="tel:+919876543210" className="mt-2 block text-sm font-semibold text-neutral-950 hover:text-[#8a6a32]">
            +91 98765 43210
          </a>
          <p className="mt-1 text-xs text-neutral-500">Mon – Sat, 9:00 AM – 7:00 PM</p>
        </li>
        <li className="rounded-2xl border border-neutral-200 bg-white p-5">
          <p className="text-xs font-semibold tracking-[0.16em] text-[#c6a15a]">EMAIL</p>
          <a href="mailto:support@lotuslights.in" className="mt-2 block text-sm font-semibold text-neutral-950 hover:text-[#8a6a32]">
            support@lotuslights.in
          </a>
          <p className="mt-1 text-xs text-neutral-500">We reply within 24 hours</p>
        </li>
        <li className="rounded-2xl border border-neutral-200 bg-white p-5">
          <p className="text-xs font-semibold tracking-[0.16em] text-[#c6a15a]">STUDIO</p>
          <p className="mt-2 text-sm font-semibold text-neutral-950">Firozabad, India</p>
          <p className="mt-1 text-xs text-neutral-500">Mon – Sat, 10:00 AM – 8:00 PM</p>
        </li>
      </ul>

      {sent ? (
        <div className="mt-4 rounded-2xl border border-neutral-200 bg-white px-6 py-10">
          <p className="text-lg font-semibold text-neutral-950">Message sent</p>
          <p className="mt-2 max-w-md text-sm leading-6 text-neutral-500">
            We received your note and will reply within 24 hours{email ? ` at ${email}` : ""}.
          </p>
          <button
            type="button"
            onClick={() => setSent(false)}
            className="mt-5 h-11 cursor-pointer rounded-lg bg-[#c6a15a] px-4 text-sm font-medium text-white hover:bg-[#b69048]"
          >
            Send another message
          </button>
        </div>
      ) : (
        <form
          className="mt-4 rounded-2xl border border-neutral-200 bg-white p-5"
          onSubmit={(event) => {
            event.preventDefault();
            setSent(true);
          }}
        >
          <h2 className="text-lg font-semibold text-neutral-950">Contact us</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <label className="text-sm font-medium text-neutral-800">
              Name
              <input name="name" required defaultValue={name} className={fieldClass} />
            </label>
            <label className="text-sm font-medium text-neutral-800">
              Email
              <input name="email" type="email" required defaultValue={email} className={fieldClass} />
            </label>
            <label className="text-sm font-medium text-neutral-800">
              Phone
              <input name="phone" defaultValue={phone} className={fieldClass} />
            </label>
            <label className="text-sm font-medium text-neutral-800">
              Subject
              <select name="subject" required defaultValue="Order support" className={fieldClass}>
                {supportSubjects.map((subject) => (
                  <option key={subject}>{subject}</option>
                ))}
              </select>
            </label>
            <label className="text-sm font-medium text-neutral-800 sm:col-span-2">
              Message
              <textarea
                name="message"
                required
                rows={5}
                maxLength={500}
                placeholder="Tell us the order number, or what you need help with."
                className="mt-2 w-full resize-y rounded-lg border border-neutral-200 bg-white px-3 py-2.5 text-sm outline-none placeholder:text-neutral-400 focus:border-[#c6a15a]"
              />
            </label>
          </div>
          <button
            type="submit"
            className="mt-5 h-11 cursor-pointer rounded-lg bg-[#c6a15a] px-4 text-sm font-medium text-white hover:bg-[#b69048]"
          >
            Send message
          </button>
        </form>
      )}

      <nav aria-label="Help pages" className="mt-4 flex flex-wrap gap-2">
        <Link href="/faqs" className="rounded-full border border-neutral-200 bg-white px-4 py-2 text-sm text-neutral-700 hover:border-[#c6a15a] hover:text-[#8a6a32]">
          FAQs
        </Link>
        <Link href="/shipping-policy" className="rounded-full border border-neutral-200 bg-white px-4 py-2 text-sm text-neutral-700 hover:border-[#c6a15a] hover:text-[#8a6a32]">
          Shipping Policy
        </Link>
        <Link href="/returns" className="rounded-full border border-neutral-200 bg-white px-4 py-2 text-sm text-neutral-700 hover:border-[#c6a15a] hover:text-[#8a6a32]">
          Returns
        </Link>
        <Link href="/privacy" className="rounded-full border border-neutral-200 bg-white px-4 py-2 text-sm text-neutral-700 hover:border-[#c6a15a] hover:text-[#8a6a32]">
          Privacy Policy
        </Link>
        <Link href="/terms" className="rounded-full border border-neutral-200 bg-white px-4 py-2 text-sm text-neutral-700 hover:border-[#c6a15a] hover:text-[#8a6a32]">
          Terms & Conditions
        </Link>
      </nav>
    </section>
  );
}

function formatWhen(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(date);
}
