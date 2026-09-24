import { requirePermission } from "@/lib/auth/session";
import { getPageById } from "@/actions/page.actions";
import { AdminPageLayout } from "@/features/admin/components/admin-page-layout";
import { PageHeader } from "@/features/admin/components/page-header";
import { EditPageClient } from "@/app/(admin)/admin/pages/[id]/edit-client";
import { notFound } from "next/navigation";

export const metadata = { title: "Edit Page | School CMS" };

interface Props {
  params: Promise<{ id: string }>;
}

export default async function AdminEditPagePage({ params }: Props) {
  await requirePermission("pages.update");
  const { id } = await params;
  const page = await getPageById(id);

  if (!page) {
    notFound();
  }

  return (
    <AdminPageLayout>
      <PageHeader
        title={`Edit Page: ${page.title}`}
        description="Update attributes, banner, or content blocks of this page"
      />
      <div className="max-w-6xl mx-auto py-2">
        <EditPageClient pageData={JSON.parse(JSON.stringify(page))} />
      </div>
    </AdminPageLayout>
  );
}
