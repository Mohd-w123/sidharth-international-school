import { requirePermission } from "@/lib/auth/session";
import { AdminPageLayout } from "@/features/admin/components/admin-page-layout";
import { PageHeader } from "@/features/admin/components/page-header";
import { TCForm } from "@/features/tc/components/tc-form";

export const metadata = { title: "Issue Transfer Certificate | School CMS" };

export default async function CreateTCPage() {
  await requirePermission("tc.create");
  return (
    <AdminPageLayout>
      <PageHeader title="Issue Transfer Certificate" description="Create a new student TC record" />
      <TCForm />
    </AdminPageLayout>
  );
}
