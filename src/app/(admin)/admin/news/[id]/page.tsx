import { notFound } from "next/navigation";
import { requirePermission } from "@/lib/auth/session";
import { getNewsById } from "@/actions/news.actions";
import { AdminPageLayout } from "@/features/admin/components/admin-page-layout";
import { PageHeader } from "@/features/admin/components/page-header";
import { NewsForm } from "@/features/news/components/news-form";

export const metadata = { title: "Edit Article | School CMS" };

interface Props { params: Promise<{ id: string }>; }

export default async function EditNewsPage({ params }: Props) {
  await requirePermission("news.update");
  const { id } = await params;
  const news = await getNewsById(id);
  if (!news) notFound();
  return (
    <AdminPageLayout>
      <PageHeader title="Edit Article" description={`Editing: ${news.title}`} />
      <NewsForm initialData={JSON.parse(JSON.stringify(news))} />
    </AdminPageLayout>
  );
}
