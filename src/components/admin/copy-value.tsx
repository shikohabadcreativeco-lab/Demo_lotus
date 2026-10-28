"use client";

import { useAdminAlert } from "@/components/admin/admin-toast";

export function CopyValue({
  label,
  value,
  href,
}: {
  label: string;
  value: string;
  href?: string;
}) {
  const { notify } = useAdminAlert();

  async function copy() {
    try {
      await navigator.clipboard.writeText(value);
      notify({ title: `${label} copied`, detail: value });
    } catch {
      notify({ title: "Could not copy", detail: value, tone: "error" });
    }
  }

  return (
    <div className="border-t border-[#eee6d8] px-5 py-4 sm:px-6">
      <dt className="text-[10px] font-medium tracking-[0.16em] text-[#8a8172] uppercase">{label}</dt>
      <dd className="mt-1.5 flex items-center justify-between gap-3 text-sm font-medium">
        {href ? (
          <a href={href} className="hover:text-[#1a6d78]">
            {value}
          </a>
        ) : (
          <span>{value}</span>
        )}
        <button
          type="button"
          onClick={() => void copy()}
          className="shrink-0 text-xs font-medium text-[#1a6d78] hover:text-[#172033]"
        >
          Copy
        </button>
      </dd>
    </div>
  );
}
