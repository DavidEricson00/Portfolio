import ContactsAdmin from "@/components/admin/ContactsAdmin";

export const dynamic = "force-dynamic";

export default function AdminContatosPage() {
  return <ContactsAdmin initialContacts={[]} />;
}