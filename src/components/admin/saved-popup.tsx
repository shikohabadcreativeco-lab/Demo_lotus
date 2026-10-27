"use client";

import { useEffect, useRef } from "react";

export function SavedPopup({
  title,
  detail,
  onClose,
}: {
  title: string;
  detail: string;
  onClose: () => void;
}) {
  const closeButton = useRef<HTMLButtonElement>(null);
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

  useEffect(() => {
    closeButton.current?.focus();
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") onCloseRef.current();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <div
      className="fixed inset-0 z-50 grid place-items-center bg-[#172033]/45 px-4"
      onClick={onClose}
    >
      <div
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="saved-popup-title"
        className="w-full max-w-sm rounded-2xl border border-[#b7ebc9] bg-[#f3fbf6] p-6 shadow-[0_24px_70px_rgba(22,101,52,0.22)]"
        onClick={(event) => event.stopPropagation()}
      >
        <span className="grid size-12 place-items-center rounded-full bg-[#16a34a] text-white">
          <svg viewBox="0 0 24 24" aria-hidden="true" className="size-6">
            <path
              d="M6 12.5 10 16.5 18 8"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
        <h2 id="saved-popup-title" className="mt-4 text-xl font-semibold tracking-tight text-[#166534]">
          {title}
        </h2>
        <p className="mt-2 text-sm leading-6 text-[#166534]">{detail}</p>
        <button
          ref={closeButton}
          type="button"
          onClick={onClose}
          className="mt-6 h-11 w-full rounded-lg bg-[#16a34a] text-sm font-semibold text-white hover:bg-[#15803d]"
        >
          OK
        </button>
      </div>
    </div>
  );
}
