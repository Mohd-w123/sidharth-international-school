import { notFound } from "next/navigation";
import { requirePermission } from "@/lib/auth/session";
import { getFormById, getFormSubmissions } from "@/actions/form.actions";
import { AdminPageLayout } from "@/features/admin/components/admin-page-layout";
import { PageHeader } from "@/features/admin/components/page-header";
import { SubmissionsTable } from "@/features/forms/components/submissions-table";

export const metadata = { title: "Form Submissions | School CMS" };

interface Props {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ page?: string }>;
}

export default async function FormSubmissionsPage({ params, searchParams }: Props) {
  await requirePermission("forms.submissions");
  const { id } = await params;
  const { page: pageParam } = await searchParams;
  const page = Math.max(1, Number(pageParam) || 1);

  const form = await getFormById(id);
  if (!form) notFound();

  const submissions = await getFormSubmissions(id, page);

  return (
    <AdminPageLayout>
      <PageHeader title={`Submissions: ${form.title}`} description={`Total responses: ${submissions.total}`} />
      <SubmissionsTable
        data={JSON.parse(JSON.stringify(submissions))}
        formFields={JSON.parse(JSON.stringify(form.fields || []))}
      />
    </AdminPageLayout>
  );
}
