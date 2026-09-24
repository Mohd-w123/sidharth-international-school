import { requirePermission } from "@/lib/auth/session";
import { AdminPageLayout } from "@/features/admin/components/admin-page-layout";
import { PageHeader } from "@/features/admin/components/page-header";
import { MenuBuilder } from "@/features/menus/components/menu-builder";

export const metadata = { title: "Create Menu | School CMS" };

export default async function CreateMenuPage() {
  await requirePermission("menus.create");
  return (
    <AdminPageLayout>
      <PageHeader title="Create Menu" description="Build a new navigation menu" />
      <MenuBuilder />
    </AdminPageLayout>
  );
}
