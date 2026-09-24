import { requirePermission } from "@/lib/auth/session";
import { AdminPageLayout } from "@/features/admin/components/admin-page-layout";
import { PageHeader } from "@/features/admin/components/page-header";
import { CreatePageClient } from "@/app/(admin)/admin/pages/create/create-client";

export const metadata = { title: "Create Page | School CMS" };

export default async function AdminCreatePagePage() {
  await requirePermission("pages.create");

  return (
    <AdminPageLayout>
      <PageHeader
        title="Create Page"
        description="Design a new website page using layout content blocks"
      />
      <div className="max-w-6xl mx-auto py-2">
        <CreatePageClient />
      </div>
    </AdminPageLayout>
  );
}
