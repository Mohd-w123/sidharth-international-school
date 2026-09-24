import { requirePermission } from "@/lib/auth/session";
import { AdminPageLayout } from "@/features/admin/components/admin-page-layout";
import { PageHeader } from "@/features/admin/components/page-header";
import { NewsForm } from "@/features/news/components/news-form";

export const metadata = { title: "New Article | School CMS" };

export default async function CreateNewsPage() {
  await requirePermission("news.create");
  return (
    <AdminPageLayout>
      <PageHeader title="Create Article" description="Write a new news article" />
      <NewsForm />
    </AdminPageLayout>
  );
}
