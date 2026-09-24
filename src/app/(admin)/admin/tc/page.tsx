import { requirePermission } from "@/lib/auth/session";
import { getTCs } from "@/actions/tc.actions";
import { AdminPageLayout } from "@/features/admin/components/admin-page-layout";
import { PageHeader } from "@/features/admin/components/page-header";
import { TCTable } from "@/features/tc/components/tc-table";
import { buttonVariants } from "@/components/ui/button";
import Link from "next/link";
import { Plus } from "lucide-react";

export const metadata = { title: "Transfer Certificates | School CMS" };

interface Props { searchParams: Promise<Record<string, string | string[] | undefined>>; }

export default async function AdminTCPage({ searchParams }: Props) {
  await requirePermission("tc.view");
  const params = await searchParams;
  const result = await getTCs(params);
  return (
    <AdminPageLayout>
      <PageHeader title="Transfer Certificates" description="Issue and manage student transfer certificates" actions={<Link href="/admin/tc/create" className={buttonVariants()}><Plus className="h-4 w-4 mr-2" /> Issue TC</Link>} />
      <TCTable data={JSON.parse(JSON.stringify(result))} />
    </AdminPageLayout>
  );
}
