import { requirePermission } from "@/lib/auth/session";
import { homepageService } from "@/services/homepage.service";
import { AdminPageLayout } from "@/features/admin/components/admin-page-layout";
import { PageHeader } from "@/features/admin/components/page-header";
import { HomepageEditor } from "@/features/homepage/components/homepage-editor";

export const metadata = { title: "Homepage Builder | School CMS" };

export default async function AdminHomepagePage() {
  await requirePermission("homepage.view");
  const config = await homepageService.getConfig();

  return (
    <AdminPageLayout>
      <PageHeader
        title="Homepage Builder"
        description="Configure and manage homepage sections"
      />
      <HomepageEditor config={JSON.parse(JSON.stringify(config))} />
    </AdminPageLayout>
  );
}
