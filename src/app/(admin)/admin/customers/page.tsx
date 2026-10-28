import { Suspense } from "react";
import { CustomersContent } from "@/components/admin/customers-content";

export default function AdminCustomersPage() {
  return (
    <Suspense fallback={<div className="min-h-40" />}>
      <CustomersContent />
    </Suspense>
  );
}
