import Link from "next/link";

export const adminPrimary =
  "inline-flex h-9 items-center justify-center rounded-md bg-[#141a22] px-4 text-xs font-semibold tracking-[0.12em] text-[#f3ead7] uppercase transition-colors hover:bg-[#1f2a38] disabled:opacity-60";

export const adminGhost =
  "inline-flex h-9 items-center justify-center rounded-md border border-[#cfc6b6] bg-transparent px-4 text-xs font-medium tracking-[0.08em] uppercase text-[#141a22] hover:border-[#141a22]";

export const adminField =
  "mt-2 h-10 w-full rounded-md border border-[#ddd4c6] bg-[#f7f3eb] px-3 text-sm text-[#141a22] outline-none placeholder:text-[#9a9184] focus:border-[#c6a15a]";

export const adminFieldArea = `${adminField} h-auto min-h-24 py-2.5`;

export const adminTh =
  "px-5 py-2.5 font-medium text-[10px] tracking-[0.14em] text-[#8a8172] uppercase";

export function AdminStat({
  label,
  value,
  hint,
  href,
  featured = false,
}: {
  label: string;
  value: string;
  hint?: string;
  href?: string;
  featured?: boolean;
}) {
  const className = featured
    ? "block rounded-xl bg-[#141a22] p-5 text-[#f3ead7] shadow-[0_18px_40px_rgba(20,26,34,0.18)]"
    : "block rounded-xl border border-[#ddd4c6] bg-[#fbf8f2] p-5";
  const body = (
    <>
      <p className={`text-[10px] font-medium tracking-[0.18em] uppercase ${featured ? "text-[#c6a15a]" : "text-[#8a8172]"}`}>
        {label}
      </p>
      <p className="mt-3 font-semibold tracking-tight text-[1.7rem] leading-none">{value}</p>
      {hint ? <p className={`mt-2 text-xs ${featured ? "text-white/50" : "text-[#7a7164]"}`}>{hint}</p> : null}
    </>
  );

  if (href) {
    return (
      <Link href={href} className={`${className} transition-transform hover:-translate-y-0.5`}>
        {body}
      </Link>
    );
  }

  return <div className={className}>{body}</div>;
}

export function AdminPanel({
  title,
  detail,
  action,
  children,
}: {
  title: string;
  detail?: string;
  action?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section className="overflow-hidden rounded-xl border border-[#ddd4c6] bg-[#fbf8f2]">
      <div className="flex items-center justify-between gap-4 border-b border-[#eee6d8] px-5 py-3.5">
        <div>
          <h2 className="text-sm font-semibold">{title}</h2>
          {detail ? <p className="mt-0.5 text-xs text-[#7a7164]">{detail}</p> : null}
        </div>
        {action}
      </div>
      {children}
    </section>
  );
}

export function AdminEmpty({ children }: { children: React.ReactNode }) {
  return <p className="px-5 py-9 text-sm text-[#7a7164]">{children}</p>;
}

export function AdminStatus({ value }: { value: string }) {
  const tone =
    value === "paid" || value === "delivered" || value === "active" || value === "confirmed"
      ? "bg-[#e7f3ee] text-[#1f5c45]"
      : value === "pending" || value === "processing" || value === "shipped" || value === "low"
        ? "bg-[#f3ead7] text-[#7a5a20]"
        : value === "failed" || value === "cancelled" || value === "hidden" || value === "out"
          ? "bg-[#f4e4e1] text-[#8a3030]"
          : "bg-[#ece7de] text-[#5c564c]";
  return <span className={`rounded px-2 py-0.5 text-[11px] font-medium capitalize ${tone}`}>{value}</span>;
}
