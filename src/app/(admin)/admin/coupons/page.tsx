import { AdminPageHeader } from "@/components/admin/admin-shell";
import { storeCoupons } from "@/lib/coupons";

export default function AdminCouponsPage() {
  const best = Math.max(...storeCoupons.map((coupon) => coupon.percent));

  return (
    <>
      <AdminPageHeader
        title="Coupons"
        detail="Codes shoppers can choose at checkout. Shipping is calculated after the discount."
      />
      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        <Stat label="Active codes" value={String(storeCoupons.length)} />
        <Stat label="Largest offer" value={`${best}%`} />
        <Stat label="Shown at checkout" value={String(storeCoupons.length)} hint="Every active code" />
      </div>
      <div className="grid gap-4 lg:grid-cols-3">
        {storeCoupons.map((coupon) => (
          <article key={coupon.code} className="rounded-2xl border border-[#d5e2ea] bg-white p-5">
            <div className="flex items-start justify-between gap-3">
              <p className="text-xs font-semibold tracking-[0.16em] text-[#1a6d78] uppercase">
                {coupon.percent}% off
              </p>
              <span className="rounded-full bg-[#e5f6f4] px-2.5 py-1 text-xs font-medium text-[#145860]">
                Active
              </span>
            </div>
            <h2 className="mt-3 font-mono text-xl font-semibold tracking-wide text-[#172033]">
              {coupon.code}
            </h2>
            <p className="mt-2 text-sm font-medium text-[#172033]">{coupon.label}</p>
            <p className="mt-2 text-sm leading-6 text-neutral-500">{coupon.detail}</p>
          </article>
        ))}
      </div>
    </>
  );
}

function Stat({ label, value, hint }: { label: string; value: string; hint?: string }) {
  return (
    <div className="rounded-2xl border border-[#d5e2ea] bg-white p-5">
      <p className="text-sm text-neutral-500">{label}</p>
      <p className="mt-2 text-2xl font-semibold text-[#172033]">{value}</p>
      {hint ? <p className="mt-1 text-xs text-neutral-400">{hint}</p> : null}
    </div>
  );
}
