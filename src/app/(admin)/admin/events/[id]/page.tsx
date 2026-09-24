import { notFound } from "next/navigation";
import { requirePermission } from "@/lib/auth/session";
import { getEventById } from "@/actions/event.actions";
import { AdminPageLayout } from "@/features/admin/components/admin-page-layout";
import { PageHeader } from "@/features/admin/components/page-header";
import { EventForm } from "@/features/events/components/event-form";

export const metadata = { title: "Edit Event | School CMS" };

interface Props { params: Promise<{ id: string }>; }

export default async function EditEventPage({ params }: Props) {
  await requirePermission("events.update");
  const { id } = await params;
  const event = await getEventById(id);
  if (!event) notFound();
  return (
    <AdminPageLayout>
      <PageHeader title="Edit Event" description={`Editing: ${event.title}`} />
      <EventForm initialData={JSON.parse(JSON.stringify(event))} />
    </AdminPageLayout>
  );
}
