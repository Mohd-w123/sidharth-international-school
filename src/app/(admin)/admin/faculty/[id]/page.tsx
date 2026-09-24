import { notFound } from "next/navigation";
import { requirePermission } from "@/lib/auth/session";
import { getFacultyById } from "@/actions/faculty.actions";
import { AdminPageLayout } from "@/features/admin/components/admin-page-layout";
import { PageHeader } from "@/features/admin/components/page-header";
import { FacultyForm } from "@/features/faculty/components/faculty-form";

export const metadata = { title: "Edit Faculty | School CMS" };

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EditFacultyPage({ params }: Props) {
  await requirePermission("faculty.update");
  const { id } = await params;
  const faculty = await getFacultyById(id);
  if (!faculty) notFound();

  return (
    <AdminPageLayout>
      <PageHeader title="Edit Faculty" description={`Editing: ${faculty.name}`} />
      <FacultyForm initialData={JSON.parse(JSON.stringify(faculty))} />
    </AdminPageLayout>
  );
}
