import { Suspense } from "react";
import { DashboardContent } from "@/components/admin/dashboard-content";

export default function AdminHomePage() {
  return (
    <Suspense fallback={<div className="min-h-40" />}>
      <DashboardContent />
    </Suspense>
  );
}
