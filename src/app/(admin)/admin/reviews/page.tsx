import { AdminPageHeader } from "@/components/admin/admin-shell";

export default function AdminReviewsPage() {
  return (
    <>
      <AdminPageHeader title="Reviews" detail="Reviews left by customers." />
      <div className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Stat label="Published" value="0" />
        <Stat label="Average" value="—" hint="Out of 5" />
        <Stat label="5 star" value="0" />
        <Stat label="4 star" value="0" />
      </div>
      <div className="rounded-2xl border border-[#d5e2ea] bg-white px-5 py-8 text-sm text-neutral-500">
        No customer reviews yet.
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
