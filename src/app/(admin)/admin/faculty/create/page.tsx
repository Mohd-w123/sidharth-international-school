import { requirePermission } from "@/lib/auth/session";
import { AdminPageLayout } from "@/features/admin/components/admin-page-layout";
import { PageHeader } from "@/features/admin/components/page-header";
import { FacultyForm } from "@/features/faculty/components/faculty-form";

export const metadata = { title: "Add Faculty | School CMS" };

export default async function CreateFacultyPage() {
  await requirePermission("faculty.create");
  return (
    <AdminPageLayout>
      <PageHeader title="Add Faculty" description="Create a new faculty profile" />
      <FacultyForm />
    </AdminPageLayout>
  );
}
