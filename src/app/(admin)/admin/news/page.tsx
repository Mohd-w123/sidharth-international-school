import { requirePermission } from "@/lib/auth/session";
import { getNews } from "@/actions/news.actions";
import { AdminPageLayout } from "@/features/admin/components/admin-page-layout";
import { PageHeader } from "@/features/admin/components/page-header";
import { NewsTable } from "@/features/news/components/news-table";
import { buttonVariants } from "@/components/ui/button";
import Link from "next/link";
import { Plus } from "lucide-react";

export const metadata = { title: "News | School CMS" };

interface Props {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default async function AdminNewsPage({ searchParams }: Props) {
  await requirePermission("news.view");
  const params = await searchParams;
  const result = await getNews(params);

  return (
    <AdminPageLayout>
      <PageHeader
        title="News"
        description="Manage news articles"
        actions={
          <Link href="/admin/news/create" className={buttonVariants()}><Plus className="h-4 w-4 mr-2" /> New Article</Link>
        }
      />
      <NewsTable data={JSON.parse(JSON.stringify(result))} />
    </AdminPageLayout>
  );
}
