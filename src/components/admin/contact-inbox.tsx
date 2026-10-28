"use client";

import { useEffect, useState } from "react";
import { useAdminAlert } from "@/components/admin/admin-toast";
import { AdminStat, adminField, adminPrimary } from "@/components/admin/admin-ui";

type ContactStatus = "new" | "in_progress" | "resolved";

type Contact = {
  id: string;
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  status: ContactStatus;
  adminNote: string;
  createdAt: string;
  updatedAt: string;
};

type Counts = { all: number; new: number; in_progress: number; resolved: number };

const statuses: Array<{ id: "" | ContactStatus; label: string }> = [
  { id: "", label: "All" },
  { id: "new", label: "New" },
  { id: "in_progress", label: "In progress" },
  { id: "resolved", label: "Resolved" },
];

const statusLabel: Record<ContactStatus, string> = {
  new: "New",
  in_progress: "In progress",
  resolved: "Resolved",
};

const statusTone: Record<ContactStatus, string> = {
  new: "bg-[#e7f0ff] text-[#1d4f91]",
  in_progress: "bg-[#fff4e8] text-[#9a4d12]",
  resolved: "bg-[#e5f6f4] text-[#145860]",
};

const emptyCounts: Counts = { all: 0, new: 0, in_progress: 0, resolved: 0 };

export function ContactInbox() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [counts, setCounts] = useState<Counts>(emptyCounts);
  const [status, setStatus] = useState<"" | ContactStatus>("");
  const [search, setSearch] = useState("");
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [selectedId, setSelectedId] = useState("");
  const [note, setNote] = useState("");
  const [nextStatus, setNextStatus] = useState<ContactStatus>("new");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);
  const { notify } = useAdminAlert();
  const selected = contacts.find((contact) => contact.id === selectedId) ?? null;

  useEffect(() => {
    const params = new URLSearchParams({ page: String(page), limit: "8" });
    if (status) params.set("status", status);
    if (query) params.set("search", query);
    let ignore = false;
    void fetch(`/api/admin/contacts?${params.toString()}`, { cache: "no-store" })
      .then(async (response) => {
        const body = (await response.json()) as {
          success?: boolean;
          message?: string;
          data?: Contact[];
          pages?: number;
          counts?: Counts;
        };
        if (ignore) return;
        if (!response.ok || !body.success) {
          setError(body.message || "Unable to load messages.");
          setContacts([]);
          return;
        }
        setError("");
        setContacts(body.data ?? []);
        setPages(body.pages ?? 1);
        setCounts(body.counts ?? emptyCounts);
        setSelectedId((current) => current || body.data?.[0]?.id || "");
      })
      .catch(() => {
        if (!ignore) setError("Unable to load messages.");
      });
    return () => {
      ignore = true;
    };
  }, [page, query, status]);

  useEffect(() => {
    if (!selected) return;
    setNote(selected.adminNote);
    setNextStatus(selected.status);
  }, [selected]);

  async function save() {
    if (!selected) return;
    setPending(true);
    setMessage("");
    const response = await fetch(`/api/admin/contacts/${selected.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: nextStatus, adminNote: note }),
    });
    const body = (await response.json()) as { success?: boolean; message?: string; data?: Contact };
    setPending(false);
    if (!response.ok || !body.success || !body.data) {
      const fail = body.message || "Unable to update this message.";
      setMessage(fail);
      notify({ title: "Message not saved", detail: fail, tone: "error" });
      return;
    }
    setContacts((current) => current.map((contact) => (contact.id === body.data?.id ? body.data : contact)));
    setMessage("Saved.");
    notify({ title: "Message saved", detail: "Status and studio note are updated." });
  }

  async function remove() {
    if (!selected) return;
    setPending(true);
    setMessage("");
    const response = await fetch(`/api/admin/contacts/${selected.id}`, { method: "DELETE" });
    const body = (await response.json()) as { success?: boolean; message?: string };
    setPending(false);
    if (!response.ok || !body.success) {
      const fail = body.message || "Unable to remove this message.";
      setMessage(fail);
      notify({ title: "Message not removed", detail: fail, tone: "error" });
      return;
    }
    setContacts((current) => current.filter((contact) => contact.id !== selected.id));
    setSelectedId("");
    setCounts((current) => ({
      ...current,
      all: Math.max(0, current.all - 1),
      [selected.status]: Math.max(0, current[selected.status] - 1),
    }));
    setMessage("Message removed.");
    notify({ title: "Message removed", detail: "This enquiry is no longer in the inbox." });
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <AdminStat label="All" value={String(counts.all)} />
        <AdminStat label="New" value={String(counts.new)} />
        <AdminStat label="In progress" value={String(counts.in_progress)} />
        <AdminStat label="Resolved" value={String(counts.resolved)} />
      </div>

      <form
        className="flex flex-col gap-3 sm:flex-row"
        onSubmit={(event) => {
          event.preventDefault();
          setPage(1);
          setQuery(search.trim());
        }}
      >
        <input
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search name, email, or subject"
          aria-label="Search messages"
          className={`${adminField} mt-0 h-9 min-w-0 flex-1`}
        />
        <button type="submit" className={adminPrimary}>
          Search
        </button>
      </form>

      <div className="flex gap-2 overflow-x-auto">
        {statuses.map((item) => (
          <button
            key={item.label}
            type="button"
            onClick={() => {
              setStatus(item.id);
              setPage(1);
              setSelectedId("");
            }}
            className={`shrink-0 rounded-md px-3 py-1.5 text-xs font-medium tracking-wide uppercase ${
              status === item.id ? "bg-[#141a22] text-[#f3ead7]" : "border border-[#ddd4c6] bg-[#fbf8f2] text-[#5c564c]"
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>

      {error ? <p className="text-sm text-[#8a3030]">{error}</p> : null}

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(22rem,0.9fr)]">
        <div className="overflow-hidden rounded-xl border border-[#ddd4c6] bg-[#fbf8f2]">
          {contacts.length === 0 ? (
            <p className="px-5 py-10 text-sm text-[#7a7164]">No messages yet.</p>
          ) : (
            <ul className="divide-y divide-[#f0eadf]">
              {contacts.map((contact) => {
                const active = contact.id === selected?.id;
                return (
                  <li key={contact.id}>
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedId(contact.id);
                        setMessage("");
                      }}
                      className={`flex w-full items-start gap-3 px-5 py-4 text-left ${active ? "bg-[#f3ead7]" : "hover:bg-[#f3eee4]"}`}
                    >
                      <span className="grid size-10 shrink-0 place-items-center rounded-md bg-[#141a22] text-xs font-semibold text-[#f3ead7]">
                        {initials(contact.name)}
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="flex items-center justify-between gap-3">
                          <span className="truncate font-medium text-[#172033]">{contact.name}</span>
                          <span className="shrink-0 text-xs text-neutral-400">{when(contact.createdAt)}</span>
                        </span>
                        <span className="mt-0.5 block truncate text-sm text-neutral-600">{contact.subject}</span>
                        <span className="mt-1 block truncate text-xs text-neutral-400">{contact.message}</span>
                      </span>
                      <span className={`shrink-0 rounded-full px-2.5 py-1 text-[11px] font-medium ${statusTone[contact.status]}`}>
                        {statusLabel[contact.status]}
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
          {pages > 1 ? (
            <div className="flex items-center justify-between border-t border-neutral-100 px-5 py-3 text-sm">
              <button type="button" disabled={page <= 1} onClick={() => setPage((current) => current - 1)} className="text-[#1a6d78] disabled:opacity-40">
                Previous
              </button>
              <span className="text-neutral-500">
                {page} / {pages}
              </span>
              <button type="button" disabled={page >= pages} onClick={() => setPage((current) => current + 1)} className="text-[#1a6d78] disabled:opacity-40">
                Next
              </button>
            </div>
          ) : null}
        </div>

        {selected ? (
          <article className="rounded-xl border border-[#ddd4c6] bg-[#fbf8f2] p-5">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 className="text-lg font-semibold text-[#172033]">{selected.name}</h2>
                <p className="mt-1 text-sm text-neutral-500">{selected.email}</p>
                {selected.phone ? <p className="text-sm text-neutral-500">{selected.phone}</p> : null}
              </div>
              <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${statusTone[selected.status]}`}>
                {statusLabel[selected.status]}
              </span>
            </div>
            <p className="mt-4 text-xs font-semibold tracking-[0.14em] text-[#1a6d78] uppercase">{selected.subject}</p>
            <p className="mt-2 text-sm leading-6 whitespace-pre-line text-neutral-700">{selected.message}</p>
            <p className="mt-3 text-xs text-neutral-400">{fullDate(selected.createdAt)}</p>
            <label className="mt-5 block text-sm font-medium text-neutral-800">
              Status
              <select
                value={nextStatus}
                onChange={(event) => setNextStatus(event.target.value as ContactStatus)}
                className={adminField}
              >
                <option value="new">New</option>
                <option value="in_progress">In progress</option>
                <option value="resolved">Resolved</option>
              </select>
            </label>
            <label className="mt-4 block text-sm font-medium text-neutral-800">
              Admin note
              <textarea
                value={note}
                onChange={(event) => setNote(event.target.value.slice(0, 500))}
                rows={4}
                placeholder="What should the studio remember about this message?"
                className="mt-2 w-full resize-y rounded-md border border-[#ddd4c6] bg-[#f7f3eb] px-3 py-2 text-sm outline-none focus:border-[#c6a15a]"
              />
            </label>
            {message ? <p className="mt-3 text-sm text-neutral-600">{message}</p> : null}
            <div className="mt-4 flex gap-2">
              <button
                type="button"
                disabled={pending}
                onClick={() => void save()}
                className={adminPrimary}
              >
                {pending ? "Saving..." : "Save"}
              </button>
              <button
                type="button"
                disabled={pending}
                onClick={() => void remove()}
                className="h-11 rounded-xl px-4 text-sm text-neutral-500 hover:text-[#8a3030] disabled:opacity-60"
              >
                Remove
              </button>
            </div>
          </article>
        ) : (
          <div className="rounded-xl border border-dashed border-[#ddd4c6] bg-[#fbf8f2] px-5 py-10 text-sm text-[#7a7164]">
            Select a message to read it.
          </div>
        )}
      </div>
    </div>
  );
}

function initials(name: string) {
  return name
    .split(" ")
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("");
}

function when(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleDateString("en-IN", { day: "numeric", month: "short" });
}

function fullDate(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" });
}
