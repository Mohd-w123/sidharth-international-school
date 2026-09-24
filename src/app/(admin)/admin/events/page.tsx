import { requirePermission } from "@/lib/auth/session";
import { getEvents } from "@/actions/event.actions";
import { AdminPageLayout } from "@/features/admin/components/admin-page-layout";
import { PageHeader } from "@/features/admin/components/page-header";
import { EventsTable } from "@/features/events/components/events-table";
import { buttonVariants } from "@/components/ui/button";
import Link from "next/link";
import { Plus } from "lucide-react";

export const metadata = { title: "Events | School CMS" };

interface Props {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default async function AdminEventsPage({ searchParams }: Props) {
  await requirePermission("events.view");
  const params = await searchParams;
  const result = await getEvents(params);

  return (
    <AdminPageLayout>
      <PageHeader
        title="Events"
        description="Manage school events"
        actions={
          <Link href="/admin/events/create" className={buttonVariants()}><Plus className="h-4 w-4 mr-2" /> New Event</Link>
        }
      />
      <EventsTable data={JSON.parse(JSON.stringify(result))} />
    </AdminPageLayout>
  );
}
