import { requirePermission } from "@/lib/auth/session";
import { getAdmissions } from "@/actions/admission.actions";
import { AdminPageLayout } from "@/features/admin/components/admin-page-layout";
import { PageHeader } from "@/features/admin/components/page-header";
import { AdmissionsTable } from "@/features/admissions/components/admissions-table";
import { buttonVariants } from "@/components/ui/button";
import Link from "next/link";
import { Plus } from "lucide-react";

export const metadata = { title: "Admissions | School CMS" };

interface Props { searchParams: Promise<Record<string, string | string[] | undefined>>; }

export default async function AdminAdmissionsPage({ searchParams }: Props) {
  await requirePermission("admissions.view");
  const params = await searchParams;
  const result = await getAdmissions(params);
  return (
    <AdminPageLayout>
      <PageHeader title="Admissions" description="Manage admission content" actions={<Link href="/admin/admissions/create" className={buttonVariants()}><Plus className="h-4 w-4 mr-2" /> New Content</Link>} />
      <AdmissionsTable data={JSON.parse(JSON.stringify(result))} />
    </AdminPageLayout>
  );
}
