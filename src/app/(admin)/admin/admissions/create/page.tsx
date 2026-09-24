import { requirePermission } from "@/lib/auth/session";
import { AdminPageLayout } from "@/features/admin/components/admin-page-layout";
import { PageHeader } from "@/features/admin/components/page-header";
import { AdmissionForm } from "@/features/admissions/components/admission-form";

export const metadata = { title: "New Admission Content | School CMS" };

export default async function CreateAdmissionPage() {
  await requirePermission("admissions.create");
  return (
    <AdminPageLayout>
      <PageHeader title="New Admission Content" description="Create admission information" />
      <AdmissionForm />
    </AdminPageLayout>
  );
}
