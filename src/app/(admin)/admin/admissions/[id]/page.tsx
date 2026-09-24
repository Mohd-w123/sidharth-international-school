import { notFound } from "next/navigation";
import { requirePermission } from "@/lib/auth/session";
import { getAdmissionById } from "@/actions/admission.actions";
import { AdminPageLayout } from "@/features/admin/components/admin-page-layout";
import { PageHeader } from "@/features/admin/components/page-header";
import { AdmissionForm } from "@/features/admissions/components/admission-form";

export const metadata = { title: "Edit Admission | School CMS" };

interface Props { params: Promise<{ id: string }>; }

export default async function EditAdmissionPage({ params }: Props) {
  await requirePermission("admissions.update");
  const { id } = await params;
  const admission = await getAdmissionById(id);
  if (!admission) notFound();
  return (
    <AdminPageLayout>
      <PageHeader title="Edit Admission Content" description={`Editing: ${admission.title}`} />
      <AdmissionForm initialData={JSON.parse(JSON.stringify(admission))} />
    </AdminPageLayout>
  );
}
