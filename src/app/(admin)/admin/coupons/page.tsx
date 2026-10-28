import { AdminPageHeader } from "@/components/admin/admin-shell";
import { AdminStat } from "@/components/admin/admin-ui";
import { storeCoupons } from "@/lib/coupons";

export default function AdminCouponsPage() {
  const best = Math.max(...storeCoupons.map((coupon) => coupon.percent));

  return (
    <>
      <AdminPageHeader
        title="Coupons"
        detail="Codes shoppers can choose at checkout. Shipping is added after the discount."
      />
      <div className="mb-6 grid gap-4 sm:grid-cols-2">
        <AdminStat label="Active codes" value={String(storeCoupons.length)} hint="Shown at checkout" />
        <AdminStat label="Largest offer" value={`${best}%`} hint="Best discount" />
      </div>
      <div className="grid gap-4 lg:grid-cols-3">
        {storeCoupons.map((coupon) => (
          <article
            key={coupon.code}
            className="rounded-xl border border-[#ddd4c6] bg-[#fbf8f2] p-5"
          >
            <div className="flex items-start justify-between gap-3">
              <p className="text-[10px] font-medium tracking-[0.18em] text-[#c6a15a] uppercase">
                {coupon.percent}% off
              </p>
              <span className="rounded px-2 py-0.5 text-[11px] font-medium bg-[#e7f3ee] text-[#1f5c45]">
                Active
              </span>
            </div>
            <h2 className="mt-4 font-mono text-xl font-semibold tracking-wide">{coupon.code}</h2>
            <p className="mt-2 text-sm font-medium">{coupon.label}</p>
            <p className="mt-2 text-sm leading-6 text-[#7a7164]">{coupon.detail}</p>
          </article>
        ))}
      </div>
    </>
  );
}
