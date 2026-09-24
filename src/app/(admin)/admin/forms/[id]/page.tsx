import { notFound } from "next/navigation";
import { requirePermission } from "@/lib/auth/session";
import { getFormById } from "@/actions/form.actions";
import { AdminPageLayout } from "@/features/admin/components/admin-page-layout";
import { PageHeader } from "@/features/admin/components/page-header";
import { FormBuilder } from "@/features/forms/components/form-builder";

export const metadata = { title: "Edit Form | School CMS" };

interface Props { params: Promise<{ id: string }>; }

export default async function EditFormPage({ params }: Props) {
  await requirePermission("forms.update");
  const { id } = await params;
  const form = await getFormById(id);
  if (!form) notFound();

  return (
    <AdminPageLayout>
      <PageHeader title="Edit Form" description={`Editing: ${form.title}`} />
      <FormBuilder initialData={JSON.parse(JSON.stringify(form))} />
    </AdminPageLayout>
  );
}
