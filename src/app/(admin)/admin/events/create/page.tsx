import { requirePermission } from "@/lib/auth/session";
import { AdminPageLayout } from "@/features/admin/components/admin-page-layout";
import { PageHeader } from "@/features/admin/components/page-header";
import { EventForm } from "@/features/events/components/event-form";

export const metadata = { title: "New Event | School CMS" };

export default async function CreateEventPage() {
  await requirePermission("events.create");
  return (
    <AdminPageLayout>
      <PageHeader title="Create Event" description="Schedule a new school event" />
      <EventForm />
    </AdminPageLayout>
  );
}
