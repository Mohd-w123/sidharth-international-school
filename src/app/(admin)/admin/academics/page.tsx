import { requirePermission } from "@/lib/auth/session";
import { getPrograms, getClasses, getSubjects, getCalendarEvents } from "@/actions/academics.actions";
import { AdminPageLayout } from "@/features/admin/components/admin-page-layout";
import { PageHeader } from "@/features/admin/components/page-header";
import { AcademicsManager } from "@/features/academics/components/academics-manager";

export const metadata = { title: "Academics | School CMS" };

interface Props {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default async function AdminAcademicsPage({ searchParams }: Props) {
  await requirePermission("academics.view");
  const params = await searchParams;
  const [programs, classes, subjects, calendarEvents] = await Promise.all([
    getPrograms(params),
    getClasses(params),
    getSubjects(params),
    getCalendarEvents(params),
  ]);

  return (
    <AdminPageLayout>
      <PageHeader title="Academics" description="Manage programs, classes, subjects, and calendar" />
      <AcademicsManager
        programs={JSON.parse(JSON.stringify(programs))}
        classes={JSON.parse(JSON.stringify(classes))}
        subjects={JSON.parse(JSON.stringify(subjects))}
        calendarEvents={JSON.parse(JSON.stringify(calendarEvents))}
      />
    </AdminPageLayout>
  );
}
