import { AdminPageHeader } from "@/components/admin/admin-shell";
import { InventoryManager } from "@/components/admin/inventory-manager";

export default function AdminInventoryPage() {
  return (
    <>
      <AdminPageHeader
        title="Inventory"
        detail="Remaining units. A purchase reduces product stock and this count together."
      />
      <InventoryManager />
    </>
  );
}
