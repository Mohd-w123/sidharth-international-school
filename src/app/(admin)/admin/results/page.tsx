import { requirePermission } from "@/lib/auth/session";
import { getResults } from "@/actions/result.actions";
import { AdminPageLayout } from "@/features/admin/components/admin-page-layout";
import { PageHeader } from "@/features/admin/components/page-header";
import { ResultsTable } from "@/features/results/components/results-table";
import { buttonVariants } from "@/components/ui/button";
import Link from "next/link";
import { Plus } from "lucide-react";

export const metadata = { title: "Results | School CMS" };

interface Props { searchParams: Promise<Record<string, string | string[] | undefined>>; }

export default async function AdminResultsPage({ searchParams }: Props) {
  await requirePermission("results.view");
  const params = await searchParams;
  const result = await getResults(params);
  return (
    <AdminPageLayout>
      <PageHeader title="Exam Results" description="Manage academic and board examination result announcements" actions={<Link href="/admin/results/create" className={buttonVariants()}><Plus className="h-4 w-4 mr-2" /> Publish Result</Link>} />
      <ResultsTable data={JSON.parse(JSON.stringify(result))} />
    </AdminPageLayout>
  );
}
