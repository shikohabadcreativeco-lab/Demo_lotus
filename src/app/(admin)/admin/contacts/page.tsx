import { AdminPageHeader } from "@/components/admin/admin-shell";
import { ContactInbox } from "@/components/admin/contact-inbox";

export default function AdminContactsPage() {
  return (
    <>
      <AdminPageHeader title="Messages" detail="Notes sent from the contact page." />
      <ContactInbox />
    </>
  );
}
