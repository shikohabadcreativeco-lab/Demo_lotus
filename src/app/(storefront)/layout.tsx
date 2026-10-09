import { SiteFooter } from "@/components/layout/storefront/site-footer";
import { SiteHeader } from "@/components/layout/storefront/site-header";

export default function StorefrontLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-full flex-1 flex-col bg-[#f6f3ee] font-sans text-neutral-900">
      <SiteHeader />
      <main className="flex-1">{children}</main>
      <SiteFooter />
    </div>
  );
}
