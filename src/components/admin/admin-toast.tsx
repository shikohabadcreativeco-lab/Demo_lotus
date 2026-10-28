"use client";

import { createContext, useCallback, useContext, useEffect, useId, useMemo, useState } from "react";

export type AdminAlertTone = "success" | "warning" | "error";

export type AdminAlertInput = {
  title: string;
  detail?: string;
  tone?: AdminAlertTone;
};

type AlertItem = AdminAlertInput & { id: string; tone: AdminAlertTone };

type AdminAlertContextValue = {
  notify: (alert: AdminAlertInput) => void;
};

const AdminAlertContext = createContext<AdminAlertContextValue | null>(null);

export function AdminAlertProvider({ children }: { children: React.ReactNode }) {
  const [alerts, setAlerts] = useState<AlertItem[]>([]);

  const notify = useCallback((alert: AdminAlertInput) => {
    const item: AlertItem = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      title: alert.title,
      detail: alert.detail,
      tone: alert.tone ?? "success",
    };
    setAlerts((current) => [...current.slice(-2), item]);
  }, []);

  const dismiss = useCallback((id: string) => {
    setAlerts((current) => current.filter((alert) => alert.id !== id));
  }, []);

  const value = useMemo(() => ({ notify }), [notify]);

  return (
    <AdminAlertContext.Provider value={value}>
      {children}
      <div className="pointer-events-none fixed top-5 right-4 z-[80] flex w-[min(24rem,calc(100vw-2rem))] flex-col gap-3 sm:top-6 sm:right-6">
        {alerts.map((alert) => (
          <AdminToast key={alert.id} alert={alert} onClose={() => dismiss(alert.id)} />
        ))}
      </div>
    </AdminAlertContext.Provider>
  );
}

export function useAdminAlert() {
  const context = useContext(AdminAlertContext);
  if (!context) {
    return {
      notify: (alert: AdminAlertInput) => {
        window.alert(alert.title);
      },
    };
  }
  return context;
}

function AdminToast({
  alert,
  onClose,
}: {
  alert: AlertItem;
  onClose: () => void;
}) {
  const titleId = useId();
  const tone = tones[alert.tone];

  useEffect(() => {
    const timer = window.setTimeout(onClose, 4600);
    return () => window.clearTimeout(timer);
  }, [onClose]);

  return (
    <div
      role="status"
      aria-labelledby={titleId}
      className="admin-toast-enter pointer-events-auto overflow-hidden rounded-2xl border border-white/70 bg-[#fbfefe]/95 shadow-[0_22px_50px_rgba(23,32,51,0.18)] backdrop-blur-md"
    >
      <div className="flex">
        <span className={`w-1.5 shrink-0 ${tone.bar}`} />
        <div className="flex min-w-0 flex-1 items-start gap-3 px-4 py-3.5">
          <span className={`mt-0.5 grid size-9 shrink-0 place-items-center rounded-full ${tone.icon}`}>
            {alert.tone === "error" ? <ErrorIcon /> : alert.tone === "warning" ? <WarnIcon /> : <CheckIcon />}
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-[10px] font-semibold tracking-[0.18em] text-[#1a6d78] uppercase">
              Lotus Lights
            </p>
            <p id={titleId} className="mt-0.5 text-sm font-semibold tracking-tight text-[#172033]">
              {alert.title}
            </p>
            {alert.detail ? (
              <p className="mt-1 text-xs leading-5 text-[#4a5b6e]">{alert.detail}</p>
            ) : null}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="mt-0.5 grid size-7 shrink-0 place-items-center rounded-full text-[#6b7a8a] hover:bg-[#eef4f6] hover:text-[#172033]"
            aria-label="Dismiss alert"
          >
            <CloseIcon />
          </button>
        </div>
      </div>
      <span className={`admin-toast-meter block h-0.5 ${tone.bar}`} />
    </div>
  );
}

const tones: Record<AdminAlertTone, { bar: string; icon: string }> = {
  success: {
    bar: "bg-[#1a6d78]",
    icon: "bg-[#e5f6f4] text-[#145860]",
  },
  warning: {
    bar: "bg-[#c6a15a]",
    icon: "bg-[#f7f0e2] text-[#8a6a2a]",
  },
  error: {
    bar: "bg-[#b45454]",
    icon: "bg-[#fdecec] text-[#8a3030]",
  },
};

function CheckIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="size-4">
      <path
        d="M6.5 12.5 10 16l7.5-8"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function WarnIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="size-4">
      <path d="M12 8v5" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
      <circle cx="12" cy="16.2" r="1" fill="currentColor" />
    </svg>
  );
}

function ErrorIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="size-4">
      <path d="M8 8l8 8M16 8l-8 8" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg viewBox="0 0 16 16" aria-hidden="true" className="size-3.5">
      <path d="M4 4l8 8M12 4l-8 8" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}
