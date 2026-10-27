"use client";

import { useState, type ReactNode } from "react";

const fieldClass =
  "h-12 w-full rounded-lg border border-neutral-200 bg-white px-4 text-sm text-neutral-900 outline-none placeholder:text-neutral-400 focus:border-[#c6a15a]";

export function TextField({
  label,
  name,
  type = "text",
  placeholder,
  autoComplete,
}: {
  label: string;
  name: string;
  type?: string;
  placeholder: string;
  autoComplete?: string;
}) {
  return (
    <label className="block text-sm font-medium text-neutral-800">
      {label}
      <input
        className={`${fieldClass} mt-2`}
        type={type}
        name={name}
        placeholder={placeholder}
        autoComplete={autoComplete}
        required
      />
    </label>
  );
}

export function PasswordField({
  label,
  name,
  placeholder,
  autoComplete,
}: {
  label: string;
  name: string;
  placeholder: string;
  autoComplete?: string;
}) {
  const [visible, setVisible] = useState(false);

  return (
    <label className="block text-sm font-medium text-neutral-800">
      {label}
      <span className="relative mt-2 block">
        <input
          className={`${fieldClass} pr-11`}
          type={visible ? "text" : "password"}
          name={name}
          placeholder={placeholder}
          autoComplete={autoComplete}
          required
        />
        <button
          type="button"
          className="absolute top-1/2 right-3 -translate-y-1/2 text-neutral-400"
          aria-label={visible ? "Hide password" : "Show password"}
          onClick={() => setVisible((value) => !value)}
        >
          {visible ? <EyeOffIcon /> : <EyeIcon />}
        </button>
      </span>
    </label>
  );
}

export function GoldButton({
  children,
  disabled,
}: {
  children: ReactNode;
  disabled?: boolean;
}) {
  return (
    <button
      type="submit"
      disabled={disabled}
      className="h-12 w-full rounded-lg bg-[#c6a15a] text-sm font-medium text-white transition-colors hover:bg-[#b69048] disabled:cursor-not-allowed disabled:opacity-60"
    >
      {children}
    </button>
  );
}

export function SocialAuth() {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-3 text-[11px] tracking-[0.16em] text-neutral-400">
        <span className="h-px flex-1 bg-neutral-200" />
        OR CONTINUE WITH
        <span className="h-px flex-1 bg-neutral-200" />
      </div>
      <button type="button" className={socialClass}>
        <GoogleIcon />
        Continue with Google
      </button>
    </div>
  );
}

const socialClass =
  "flex h-12 w-full items-center justify-center gap-2 rounded-lg border border-neutral-200 bg-white text-sm font-medium text-neutral-800 transition-colors hover:bg-neutral-50";

function EyeIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
      <path d="M2.8 12S6.2 6.8 12 6.8 21.2 12 21.2 12 17.8 17.2 12 17.2 2.8 12 2.8 12Z" />
      <circle cx="12" cy="12" r="2.4" />
    </svg>
  );
}

function EyeOffIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
      <path d="M4 5.5 19 19" />
      <path d="M9.2 9.4A3 3 0 0 0 12 15a3 3 0 0 0 2.6-1.5" />
      <path d="M6.2 7.8C4.4 9.1 3 11 2.8 12c0 0 3.4 5.2 9.2 5.2 1.4 0 2.7-.3 3.8-.8" />
      <path d="M10 6.9c.6-.1 1.3-.1 2-.1 5.8 0 9.2 5.2 9.2 5.2a16 16 0 0 1-2.2 2.7" />
    </svg>
  );
}

function GoogleIcon() {
  return (
    <svg viewBox="0 0 48 48" className="size-5" aria-hidden="true">
      <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.7 29.3 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.2 8 3.1l5.7-5.7C34.2 6.1 29.4 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.7-.4-3.5z" />
      <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 15.1 19 12 24 12c3.1 0 5.8 1.2 8 3.1l5.7-5.7C34.2 6.1 29.4 4 24 4 16.3 4 9.6 8.3 6.3 14.7z" />
      <path fill="#4CAF50" d="M24 44c5.2 0 10-2 13.6-5.2l-6.3-5.3C29.2 35.1 26.7 36 24 36c-5.3 0-9.7-3.3-11.3-8l-6.5 5C9.5 39.6 16.2 44 24 44z" />
      <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-1.1 3.2-3.5 5.7-6.6 7.2l6.3 5.3C37.4 38.4 44 34 44 24c0-1.3-.1-2.7-.4-3.5z" />
    </svg>
  );
}
