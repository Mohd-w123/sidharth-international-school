import { requirePermission } from "@/lib/auth/session";
import { AdminPageLayout } from "@/features/admin/components/admin-page-layout";
import { PageHeader } from "@/features/admin/components/page-header";
import { FormBuilder } from "@/features/forms/components/form-builder";

export const metadata = { title: "Create Form | School CMS" };

export default async function CreateFormPage() {
  await requirePermission("forms.create");
  return (
    <AdminPageLayout>
      <PageHeader title="Create Form" description="Design a new custom dynamic form" />
      <FormBuilder />
    </AdminPageLayout>
  );
}
