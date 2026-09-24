import { notFound } from "next/navigation";
import { requirePermission } from "@/lib/auth/session";
import { getResultById } from "@/actions/result.actions";
import { AdminPageLayout } from "@/features/admin/components/admin-page-layout";
import { PageHeader } from "@/features/admin/components/page-header";
import { ResultForm } from "@/features/results/components/result-form";

export const metadata = { title: "Edit Result | School CMS" };

interface Props { params: Promise<{ id: string }>; }

export default async function EditResultPage({ params }: Props) {
  await requirePermission("results.update");
  const { id } = await params;
  const result = await getResultById(id);
  if (!result) notFound();
  return (
    <AdminPageLayout>
      <PageHeader title="Edit Result" description={`Editing: ${result.title}`} />
      <ResultForm initialData={JSON.parse(JSON.stringify(result))} />
    </AdminPageLayout>
  );
}
