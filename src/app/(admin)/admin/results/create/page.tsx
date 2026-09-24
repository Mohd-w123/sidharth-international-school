import { requirePermission } from "@/lib/auth/session";
import { AdminPageLayout } from "@/features/admin/components/admin-page-layout";
import { PageHeader } from "@/features/admin/components/page-header";
import { ResultForm } from "@/features/results/components/result-form";

export const metadata = { title: "Publish Result | School CMS" };

export default async function CreateResultPage() {
  await requirePermission("results.create");
  return (
    <AdminPageLayout>
      <PageHeader title="Publish Result" description="Create a new exam result entry" />
      <ResultForm />
    </AdminPageLayout>
  );
}
