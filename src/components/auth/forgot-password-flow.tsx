"use client";

import Link from "next/link";
import { useEffect, useRef, useState, type FormEvent, type ReactNode } from "react";
import { AuthSplit, LockIcon as FeatureLock, ShieldIcon as FeatureShield, WarrantyIcon } from "@/components/auth/auth-split";

type Step = "request" | "otp" | "reset" | "success";

const OTP_LENGTH = 6;
const RESEND_SECONDS = 45;

export function ForgotPasswordFlow() {
  const [step, setStep] = useState<Step>("request");
  const [identifier, setIdentifier] = useState("");
  const [code, setCode] = useState("");
  const [secondsLeft, setSecondsLeft] = useState(RESEND_SECONDS);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (step !== "otp") return;
    const timer = window.setInterval(() => {
      setSecondsLeft((current) => (current > 0 ? current - 1 : 0));
    }, 1000);
    return () => window.clearInterval(timer);
  }, [step]);

  function sendCode(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const value = identifier.trim();
    if (!isContact(value)) {
      setError("Enter a valid email address or phone number.");
      return;
    }
    setIdentifier(value);
    setError("");
    setCode("");
    setSecondsLeft(RESEND_SECONDS);
    setStep("otp");
  }

  function verifyCode(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (code.replace(/\D/g, "").length !== OTP_LENGTH) {
      setError("Enter the 6-digit verification code.");
      return;
    }
    setError("");
    setPassword("");
    setConfirmPassword("");
    setStep("reset");
  }

  function resetPassword(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (password.length < 8) {
      setError("Use at least 8 characters.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    setError("");
    setStep("success");
  }

  const stepIndex = step === "request" ? 0 : step === "otp" ? 1 : step === "reset" ? 2 : 3;

  function goBack() {
    setError("");
    setStep(step === "reset" ? "otp" : "request");
  }

  const backControl =
    step === "otp" || step === "reset" ? (
      <button
        type="button"
        onClick={goBack}
        className="inline-flex items-center gap-2 self-end text-sm text-neutral-500 transition-colors hover:text-neutral-800"
      >
        <span aria-hidden="true">←</span>
        Back
      </button>
    ) : (
      <Link
        href="/login"
        className="inline-flex items-center gap-2 self-end text-sm text-neutral-500 transition-colors hover:text-neutral-800"
      >
        <span aria-hidden="true">←</span>
        Back to Login
      </Link>
    );

  return (
    <AuthSplit
      image="/images/auth/login-panel.jpg"
      imageAlt="Circular ring lamp glowing on a wooden table"
      headline={
        <>
          Reset your
          <br />
          password
        </>
      }
      description="We’ll send a short code, then you can choose a new password and get back to your account."
      features={[
        { label: "Private code", icon: <FeatureShield /> },
        { label: "Takes a minute", icon: <WarrantyIcon /> },
        { label: "Secure sign-in", icon: <FeatureLock /> },
      ]}
      back={backControl}
    >
      <div className="flex flex-col gap-6">
        <Progress step={stepIndex} />

        {step === "request" ? (
          <form className="flex flex-col gap-5" onSubmit={sendCode}>
            <StepHeading
              icon={<MailIcon />}
              title="Forgot Password?"
              detail="No worries. Enter your email or phone number and we’ll send a verification code."
            />
            <label className="block text-sm font-medium text-neutral-800">
              Email or Phone Number
              <span className="relative mt-2 block">
                <span className="pointer-events-none absolute top-1/2 left-3.5 -translate-y-1/2 text-neutral-400">
                  <MailIcon small />
                </span>
                <input
                  name="identifier"
                  type="text"
                  required
                  autoComplete="username"
                  placeholder="Enter your email or phone number"
                  value={identifier}
                  onChange={(event) => setIdentifier(event.target.value)}
                  className={fieldClass}
                />
              </span>
            </label>
            <FormError message={error} />
            <SubmitButton>Send Verification Code</SubmitButton>
          </form>
        ) : null}

        {step === "otp" ? (
          <form className="flex flex-col gap-5" onSubmit={verifyCode}>
            <StepHeading
              icon={<ShieldIcon />}
              title="Verify OTP"
              detail={`We’ve sent a 6-digit code to ${identifier}`}
            />
            <OtpFields value={code} onChange={setCode} />
            <p className="text-sm text-neutral-500">
              Didn&apos;t receive the code?{" "}
              {secondsLeft > 0 ? (
                <span className="font-medium text-[#c6a15a]">
                  Resend in {formatTime(secondsLeft)}
                </span>
              ) : (
                <button
                  type="button"
                  className="font-medium text-[#c6a15a] hover:text-[#9a7438]"
                  onClick={() => {
                    setCode("");
                    setSecondsLeft(RESEND_SECONDS);
                    setError("");
                  }}
                >
                  Resend code
                </button>
              )}
            </p>
            <FormError message={error} />
            <SubmitButton>Verify Code</SubmitButton>
          </form>
        ) : null}

        {step === "reset" ? (
          <form className="flex flex-col gap-5" onSubmit={resetPassword}>
            <StepHeading
              icon={<LockIcon />}
              title="Reset Your Password"
              detail="Create a new password for your Lotus Lights account."
            />
            <div className="space-y-4">
              <SecretField
                label="New Password"
                name="password"
                placeholder="Enter new password"
                autoComplete="new-password"
                value={password}
                onChange={setPassword}
              />
              <SecretField
                label="Confirm New Password"
                name="confirmPassword"
                placeholder="Confirm new password"
                autoComplete="new-password"
                value={confirmPassword}
                onChange={setConfirmPassword}
              />
            </div>
            <FormError message={error} />
            <SubmitButton>Reset Password</SubmitButton>
          </form>
        ) : null}

        {step === "success" ? (
          <div className="flex flex-col gap-5">
            <SuccessMark />
            <div>
              <h1 className="text-3xl font-semibold tracking-tight text-neutral-950">
                Password reset successful
              </h1>
              <p className="mt-2 max-w-md text-sm leading-6 text-neutral-500">
                Your password has been updated. You can sign in with it now.
              </p>
            </div>
            <Link
              href="/login"
              className="inline-flex h-12 w-full items-center justify-center rounded-lg bg-[#c6a15a] text-sm font-medium text-white transition-colors hover:bg-[#b69048]"
            >
              Go to Login
            </Link>
          </div>
        ) : null}
      </div>
    </AuthSplit>
  );
}

function isContact(value: string) {
  if (value.includes("@")) return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  const digits = value.replace(/[^\d]/g, "");
  return digits.length >= 10 && digits.length <= 15;
}

function formatTime(total: number) {
  const minutes = Math.floor(total / 60);
  const seconds = total % 60;
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

const fieldClass =
  "h-12 w-full rounded-lg border border-neutral-200 bg-white pr-4 pl-10 text-sm text-neutral-900 outline-none placeholder:text-neutral-400 focus:border-[#c6a15a]";

const progressLabels = ["Account", "Code", "Password", "Done"];

function Progress({ step }: { step: number }) {
  return (
    <ol className="grid grid-cols-4 gap-2" aria-label="Reset progress">
      {progressLabels.map((label, index) => {
        const complete = index < step;
        const current = index === step;
        return (
          <li key={label}>
            <span
              className={`block h-1 rounded-full ${
                complete || current ? "bg-[#c6a15a]" : "bg-neutral-200"
              }`}
            />
            <span
              className={`mt-2 block text-[11px] font-medium ${
                current ? "text-neutral-950" : "text-neutral-400"
              }`}
            >
              {label}
            </span>
          </li>
        );
      })}
    </ol>
  );
}

function StepHeading({
  icon,
  title,
  detail,
}: {
  icon: ReactNode;
  title: string;
  detail: string;
}) {
  return (
    <div>
      <span className="grid size-12 place-items-center rounded-full bg-[#f6f1e8] text-[#c6a15a]">
        {icon}
      </span>
      <h1 className="mt-4 text-3xl font-semibold tracking-tight text-neutral-950">
        {title}
      </h1>
      <p className="mt-2 max-w-md text-sm leading-6 text-neutral-500">{detail}</p>
    </div>
  );
}

function FormError({ message }: { message: string }) {
  if (!message) return null;
  return (
    <p className="mt-3 text-sm text-red-600" role="alert">
      {message}
    </p>
  );
}

function SubmitButton({ children }: { children: ReactNode }) {
  return (
    <button
      type="submit"
      className="h-12 w-full rounded-lg bg-[#c6a15a] text-sm font-medium text-white transition-colors hover:bg-[#b69048]"
    >
      {children}
    </button>
  );
}

function OtpFields({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  const inputs = useRef<Array<HTMLInputElement | null>>([]);
  const digits = Array.from({ length: OTP_LENGTH }, (_, index) =>
    /\d/.test(value[index] ?? "") ? value[index] : "",
  );

  function commit(next: string[]) {
    onChange(next.map((digit) => digit || " ").join(""));
  }

  return (
    <div className="grid grid-cols-6 gap-2 sm:gap-3" role="group" aria-label="Verification code">
      {Array.from({ length: OTP_LENGTH }, (_, index) => (
        <input
          key={index}
          ref={(node) => {
            inputs.current[index] = node;
          }}
          inputMode="numeric"
          autoFocus={index === 0}
          autoComplete={index === 0 ? "one-time-code" : "off"}
          aria-label={`Digit ${index + 1}`}
          maxLength={1}
          value={digits[index]}
          placeholder="–"
          className="h-14 w-full rounded-xl border border-neutral-200 text-center text-lg text-neutral-900 outline-none placeholder:text-neutral-300 focus:border-[#c6a15a] focus:ring-2 focus:ring-[#c6a15a]/20"
          onChange={(event) => {
            const digit = event.target.value.replace(/\D/g, "").slice(-1);
            const next = [...digits];
            next[index] = digit;
            commit(next);
            if (digit) inputs.current[index + 1]?.focus();
          }}
          onKeyDown={(event) => {
            if (event.key === "Backspace" && !digits[index]) {
              inputs.current[index - 1]?.focus();
            }
          }}
          onPaste={(event) => {
            event.preventDefault();
            const pasted = event.clipboardData
              .getData("text")
              .replace(/\D/g, "")
              .slice(0, OTP_LENGTH)
              .split("");
            const next = Array.from({ length: OTP_LENGTH }, (_, slot) => pasted[slot] ?? "");
            commit(next);
            inputs.current[Math.min(pasted.length, OTP_LENGTH - 1)]?.focus();
          }}
        />
      ))}
    </div>
  );
}

function SecretField({
  label,
  name,
  placeholder,
  autoComplete,
  value,
  onChange,
}: {
  label: string;
  name: string;
  placeholder: string;
  autoComplete: string;
  value: string;
  onChange: (value: string) => void;
}) {
  const [visible, setVisible] = useState(false);

  return (
    <label className="block text-sm font-medium text-neutral-800">
      {label}
      <span className="relative mt-2 block">
        <input
          name={name}
          type={visible ? "text" : "password"}
          required
          minLength={8}
          autoComplete={autoComplete}
          placeholder={placeholder}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className="h-12 w-full rounded-lg border border-neutral-200 bg-white px-4 pr-11 text-sm text-neutral-900 outline-none placeholder:text-neutral-400 focus:border-[#c6a15a]"
        />
        <button
          type="button"
          className="absolute top-1/2 right-3 -translate-y-1/2 text-neutral-400"
          aria-label={visible ? "Hide password" : "Show password"}
          onClick={() => setVisible((current) => !current)}
        >
          {visible ? <EyeOffIcon /> : <EyeIcon />}
        </button>
      </span>
    </label>
  );
}

function SuccessMark() {
  return (
    <div className="relative h-24 w-24">
      <span className="absolute top-1 left-4 size-2 rotate-12 rounded-sm bg-[#e7b15a]" />
      <span className="absolute top-6 left-0 size-1.5 rounded-sm bg-[#d8a15a]" />
      <span className="absolute top-0 right-6 size-2 rounded-full bg-[#7dcea0]" />
      <span className="absolute top-7 right-1 size-2 rotate-45 rounded-sm bg-[#e07a5f]" />
      <span className="absolute right-3 bottom-6 size-1.5 rounded-full bg-[#c6a15a]" />
      <span className="absolute bottom-4 left-2 size-2 rounded-sm bg-[#8fbf9f]" />
      <span className="absolute bottom-1 left-10 size-1.5 rotate-12 rounded-sm bg-[#e6c48a]" />
      <span className="absolute inset-0 m-auto grid size-16 place-items-center rounded-full bg-[#2f9e6b] text-white shadow-[0_8px_20px_rgba(47,158,107,0.35)]">
        <svg viewBox="0 0 24 24" className="size-8" fill="none" stroke="currentColor" strokeWidth="2.4" aria-hidden="true">
          <path d="m6 12.5 4 4 8-9" />
        </svg>
      </span>
    </div>
  );
}

function MailIcon({ small = false }: { small?: boolean }) {
  return (
    <svg viewBox="0 0 24 24" className={small ? "size-4" : "size-7"} fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
      <rect x="4" y="6" width="16" height="12" rx="2" />
      <path d="m5 8 7 5 7-5" />
    </svg>
  );
}

function ShieldIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-7" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
      <path d="M12 3.8 19 6.4v5.2c0 4.1-2.8 6.9-7 8.6-4.2-1.7-7-4.5-7-8.6V6.4L12 3.8Z" />
      <path d="m9 12 2 2 4-4.5" />
    </svg>
  );
}

function LockIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-7" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
      <rect x="6" y="10.5" width="12" height="8.5" rx="1.8" />
      <path d="M8.5 10.5V8.2a3.5 3.5 0 0 1 7 0v2.3" />
    </svg>
  );
}

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
