import type { Metadata } from "next";
import { Suspense } from "react";
import { AdminFrame } from "@/components/admin/admin-frame";

export const metadata: Metadata = {
  title: "Admin | Lotus Lights",
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={<div className="min-h-dvh flex-1 bg-[#e6eef3]" />}>
      <AdminFrame>{children}</AdminFrame>
    </Suspense>
  );
}
