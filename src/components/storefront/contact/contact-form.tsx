"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

const subjects = ["An order", "A lamp", "A project", "Something else"];

const MAX_MESSAGE = 500;

export function ContactForm() {
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);
  const [sent, setSent] = useState<{ name: string; email: string } | null>(
    null,
  );
  const panelRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!sent) return;
    panelRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
  }, [sent]);

  if (sent) {
    return (
      <section
        ref={panelRef}
        role="status"
        aria-labelledby="contact-form-heading"
        className="rounded-3xl border border-[#ece4d6] bg-white p-6 shadow-[0_18px_40px_rgba(28,25,23,0.05)] sm:p-8"
      >
        <p className="flex items-center gap-3 text-[11px] font-semibold tracking-[0.22em] text-[#c6a15a]">
          MESSAGE SENT
          <span aria-hidden="true" className="h-px w-8 bg-[#c6a15a]" />
        </p>
        <h2
          id="contact-form-heading"
          className="mt-3 text-3xl font-semibold tracking-tight text-neutral-950"
        >
          Thank you, {sent.name.split(" ")[0]}.
        </h2>
        <p className="mt-3 max-w-md text-sm leading-6 text-neutral-500">
          Your message has been sent. We will reply within 24 hours at {sent.email}.
        </p>
        <button
          type="button"
          onClick={() => {
            setSent(null);
            setMessage("");
          }}
          className="mt-8 inline-flex h-12 items-center justify-center rounded-lg bg-[#d7b07a] px-6 text-sm font-medium text-neutral-900 transition-colors hover:bg-[#c9a36a]"
        >
          Send another message
        </button>
      </section>
    );
  }

  return (
    <section
      aria-labelledby="contact-form-heading"
      className="rounded-3xl border border-[#ece4d6] bg-white p-6 shadow-[0_18px_40px_rgba(28,25,23,0.05)] sm:p-8"
    >
      <p className="text-[11px] font-semibold tracking-[0.22em] text-[#c6a15a]">WRITE TO US</p>
      <h2
        id="contact-form-heading"
        className="mt-2 text-3xl font-semibold tracking-tight text-neutral-950"
      >
        Send a message
      </h2>
      <p className="mt-2 max-w-lg text-sm leading-6 text-neutral-500">
        Tell us what you need. Include an order number if you already have one.
      </p>
      <form
        className="mt-5"
        onSubmit={(event) => {
          event.preventDefault();
          const data = new FormData(event.currentTarget);
          const name = String(data.get("name") ?? "").trim();
          const email = String(data.get("email") ?? "").trim();
          setPending(true);
          setError("");
          void fetch("/api/contact", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              name,
              email,
              phone: String(data.get("phone") ?? ""),
              subject: String(data.get("subject") ?? ""),
              message,
            }),
          })
            .then(async (response) => {
              const body = (await response.json()) as { success?: boolean; message?: string };
              if (!response.ok || !body.success) {
                setError(body.message || "Unable to send this message.");
                return;
              }
              setSent({ name, email });
            })
            .catch(() => setError("Unable to send this message."))
            .finally(() => setPending(false));
        }}
      >
        {error ? <p className="mb-4 text-sm text-red-600">{error}</p> : null}
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Name" name="name" required autoComplete="name" placeholder="Your name" icon={<UserIcon />} />
          <Field label="Email" name="email" type="email" required autoComplete="email" placeholder="Your email" icon={<MailIcon />} />
          <Field label="Phone" name="phone" type="tel" autoComplete="tel" placeholder="Phone, if you like" icon={<PhoneIcon />} className="sm:col-span-2" />
          <label className="block text-sm font-medium text-neutral-800 sm:col-span-2">
            <span>
              Subject <RequiredMark />
            </span>
            <span className="relative mt-2 block">
              <select
                name="subject"
                required
                defaultValue=""
                className="h-12 w-full appearance-none rounded-lg border border-neutral-200 bg-white px-4 pr-10 text-sm text-neutral-900 outline-none invalid:text-neutral-400 focus:border-[#c6a15a]"
              >
                <option value="" disabled>
                  What is this about?
                </option>
                {subjects.map((subject) => (
                  <option key={subject} value={subject}>
                    {subject}
                  </option>
                ))}
              </select>
              <ChevronIcon />
            </span>
          </label>
        </div>
        <label className="mt-4 block text-sm font-medium text-neutral-800">
          <span>
            Message <RequiredMark />
          </span>
          <span className="relative mt-2 block">
            <textarea
              name="message"
              required
              rows={4}
              maxLength={MAX_MESSAGE}
              value={message}
              onChange={(event) => setMessage(event.target.value)}
              placeholder="Tell us how we can help you..."
              className="w-full resize-y rounded-lg border border-neutral-200 px-4 pt-3 pb-8 text-sm text-neutral-900 outline-none placeholder:text-neutral-400 focus:border-[#c6a15a]"
            />
            <span
              className={`pointer-events-none absolute right-3 bottom-3 text-xs ${
                message.length >= MAX_MESSAGE ? "text-red-500" : "text-neutral-400"
              }`}
            >
              {message.length}/{MAX_MESSAGE}
            </span>
          </span>
        </label>
        <button
          type="submit"
          disabled={pending}
          className="mt-5 inline-flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-[#d7b07a] text-sm font-medium text-neutral-900 transition-colors hover:bg-[#c9a36a] disabled:opacity-60"
        >
          <SendIcon />
          {pending ? "Sending..." : "Send Message"}
        </button>
      </form>
    </section>
  );
}

function Field({
  label,
  name,
  type = "text",
  required,
  placeholder,
  autoComplete,
  icon,
  className = "",
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  placeholder: string;
  autoComplete?: string;
  icon: ReactNode;
  className?: string;
}) {
  return (
    <label className={`block text-sm font-medium text-neutral-800 ${className}`}>
      <span>
        {label} {required ? <RequiredMark /> : null}
      </span>
      <span className="relative mt-2 block">
        <span className="pointer-events-none absolute top-1/2 left-3.5 -translate-y-1/2 text-neutral-400">
          {icon}
        </span>
        <input
          name={name}
          type={type}
          required={required}
          placeholder={placeholder}
          autoComplete={autoComplete}
          className="h-12 w-full rounded-lg border border-neutral-200 bg-white pr-4 pl-10 text-sm text-neutral-900 outline-none placeholder:text-neutral-400 focus:border-[#c6a15a]"
        />
      </span>
    </label>
  );
}

function RequiredMark() {
  return (
    <span className="text-red-500" aria-hidden="true">
      *
    </span>
  );
}

function UserIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true">
      <circle cx="12" cy="8" r="3" />
      <path d="M6 18.5c.9-2.4 2.8-3.5 6-3.5s5.1 1.1 6 3.5" />
    </svg>
  );
}

function PhoneIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true">
      <path d="M8 4.5h2.2l1 3-1.6 1a12 12 0 0 0 5.9 5.9l1-1.6 3 1V17a1.5 1.5 0 0 1-1.5 1.5A13.5 13.5 0 0 1 6.5 6 1.5 1.5 0 0 1 8 4.5Z" />
    </svg>
  );
}

function MailIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true">
      <rect x="4" y="6" width="16" height="12" rx="1.5" />
      <path d="m5 8 7 5 7-5" />
    </svg>
  );
}

function ChevronIcon() {
  return (
    <svg viewBox="0 0 24 24" className="pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2 text-neutral-400" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true">
      <path d="m7 10 5 5 5-5" />
    </svg>
  );
}

function SendIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true">
      <path d="m4.5 11.5 15-7-7 15-1.5-6.5L4.5 11.5Z" />
    </svg>
  );
}
