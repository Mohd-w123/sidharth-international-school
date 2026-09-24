import { requirePermission } from "@/lib/auth/session";
import { getForms } from "@/actions/form.actions";
import { AdminPageLayout } from "@/features/admin/components/admin-page-layout";
import { PageHeader } from "@/features/admin/components/page-header";
import { FormsTable } from "@/features/forms/components/forms-table";
import { buttonVariants } from "@/components/ui/button";
import Link from "next/link";
import { Plus } from "lucide-react";

export const metadata = { title: "Form Builder | School CMS" };

interface Props { searchParams: Promise<Record<string, string | string[] | undefined>>; }

export default async function AdminFormsPage({ searchParams }: Props) {
  await requirePermission("forms.view");
  const params = await searchParams;
  const result = await getForms(params);
  return (
    <AdminPageLayout>
      <PageHeader title="Dynamic Form Builder" description="Create and manage custom public forms and view user submissions" actions={<Link href="/admin/forms/create" className={buttonVariants()}><Plus className="h-4 w-4 mr-2" /> New Form</Link>} />
      <FormsTable data={JSON.parse(JSON.stringify(result))} />
    </AdminPageLayout>
  );
}
