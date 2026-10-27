"use client";

import { useRouter } from "next/navigation";
import { useRef, useState, type FormEvent } from "react";

const suggestions = [
  { label: "Table lamps", q: "table lamp" },
  { label: "Floor lamps", q: "floor lamp" },
  { label: "Pendants", q: "pendant" },
  { label: "Wall lights", q: "sconce" },
  { label: "Desk lamps", q: "desk" },
  { label: "Brass", q: "brass" },
  { label: "Bedroom", q: "bedroom" },
];

export function SearchButton() {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState("");
  const router = useRouter();

  function open() {
    setQuery("");
    dialogRef.current?.showModal();
    requestAnimationFrame(() => inputRef.current?.focus());
  }

  function close() {
    dialogRef.current?.close();
  }

  function go(next: string) {
    const value = next.trim();
    router.push(value ? `/search?q=${encodeURIComponent(value)}` : "/search");
    close();
  }

  function search(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    go(query);
  }

  return (
    <>
      <button
        type="button"
        aria-label="Search"
        onClick={open}
        className="grid size-10 place-items-center rounded-full transition-colors hover:bg-[#f6efe2] hover:text-neutral-950"
      >
        <SearchIcon />
      </button>
      <dialog
        ref={dialogRef}
        aria-labelledby="search-heading"
        className="fixed inset-x-0 top-0 bottom-auto m-0 h-auto w-screen max-w-none rounded-none border-0 bg-transparent p-0 text-neutral-950 shadow-none outline-none backdrop:bg-[#1c1917]/55"
        onClick={(event) => {
          if (event.target === dialogRef.current) close();
        }}
        onClose={() => setQuery("")}
      >
        <div className="overflow-hidden rounded-b-3xl border-b border-[#e6dccb] bg-[#fbfaf7] shadow-[0_28px_70px_rgba(28,25,23,0.22)]">
          <span aria-hidden="true" className="block h-1 bg-[#c6a15a]" />
          <form autoComplete="off" onSubmit={search} className="mx-auto w-full max-w-3xl px-4 py-7 sm:px-8 sm:py-9">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="flex items-center gap-3 text-[11px] font-semibold tracking-[0.28em] text-[#c6a15a]">
                  THE COLLECTION
                  <span aria-hidden="true" className="h-px w-8 bg-[#c6a15a]" />
                </p>
                <h2 id="search-heading" className="mt-3 text-3xl font-semibold tracking-tight text-[#1c1917] sm:text-4xl">
                  Find a light
                </h2>
                <p className="mt-2 text-sm leading-6 text-neutral-500">
                  A room, a finish, or the lamp you have in mind.
                </p>
              </div>
              <button
                type="button"
                onClick={close}
                aria-label="Close search"
                className="grid size-10 shrink-0 place-items-center rounded-full border border-[#e6dccb] bg-white text-neutral-500 hover:border-[#c6a15a] hover:text-[#1c1917]"
              >
                <CloseIcon />
              </button>
            </div>

            <div className="mt-7 flex items-center gap-2 rounded-2xl border border-[#e6dccb] bg-white p-1.5 pl-4 shadow-[0_10px_28px_rgba(28,25,23,0.05)] focus-within:border-[#c6a15a]">
              <span className="text-[#c6a15a]">
                <FieldSearchIcon />
              </span>
              <input
                ref={inputRef}
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Table lamp, brass, bedroom"
                autoComplete="off"
                autoCorrect="off"
                spellCheck={false}
                enterKeyHint="search"
                aria-label="Search the shop"
                className="h-12 min-w-0 flex-1 bg-transparent text-base outline-none placeholder:text-neutral-400"
              />
              <button
                type="submit"
                className="h-12 shrink-0 rounded-xl bg-[#1c1917] px-5 text-sm font-medium text-white hover:bg-[#2a2420]"
              >
                Search
              </button>
            </div>

            <p className="mt-6 text-[11px] font-semibold tracking-[0.22em] text-[#8a6a32]">POPULAR</p>
            <ul className="mt-3 flex flex-wrap gap-2">
              {suggestions.map((item) => (
                <li key={item.q}>
                  <button
                    type="button"
                    onClick={() => go(item.q)}
                    className="rounded-full border border-[#e6dccb] bg-white px-4 py-2 text-sm text-neutral-700 shadow-[0_6px_16px_rgba(28,25,23,0.03)] hover:border-[#c6a15a] hover:bg-[#fbf7ef] hover:text-[#1c1917]"
                  >
                    {item.label}
                  </button>
                </li>
              ))}
            </ul>
          </form>
        </div>
      </dialog>
    </>
  );
}

function SearchIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="size-[22px] shrink-0"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="11" cy="11" r="6.5" />
      <path d="M16 16.5 20 20.5" />
    </svg>
  );
}

function FieldSearchIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="size-5 shrink-0"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="11" cy="11" r="6.5" />
      <path d="M16 16.5 20 20.5" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      <path d="M6 6l12 12M18 6 6 18" />
    </svg>
  );
}
