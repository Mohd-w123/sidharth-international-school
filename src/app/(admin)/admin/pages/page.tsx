import { requirePermission } from "@/lib/auth/session";
import { getPages } from "@/actions/page.actions";
import { AdminPageLayout } from "@/features/admin/components/admin-page-layout";
import { PageHeader } from "@/features/admin/components/page-header";
import { PagesTable } from "@/features/pages/components/pages-table";
import { buttonVariants } from "@/components/ui/button";
import Link from "next/link";
import { Plus } from "lucide-react";

export const metadata = { title: "Pages | School CMS" };

interface Props {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default async function AdminPagesPage({ searchParams }: Props) {
  await requirePermission("pages.view");
  const params = await searchParams;
  const result = await getPages(params);

  return (
    <AdminPageLayout>
      <PageHeader
        title="Pages"
        description="Manage website pages"
        actions={
          <Link href="/admin/pages/create" className={buttonVariants()}><Plus className="h-4 w-4 mr-2" /> New Page</Link>
        }
      />
      <PagesTable data={JSON.parse(JSON.stringify(result))} />
    </AdminPageLayout>
  );
}
