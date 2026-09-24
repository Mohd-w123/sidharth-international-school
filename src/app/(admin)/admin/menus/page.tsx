import { requirePermission } from "@/lib/auth/session";
import { getMenus } from "@/actions/menu.actions";
import { AdminPageLayout } from "@/features/admin/components/admin-page-layout";
import { PageHeader } from "@/features/admin/components/page-header";
import { MenusList } from "@/features/menus/components/menus-list";
import { buttonVariants } from "@/components/ui/button";
import Link from "next/link";
import { Plus } from "lucide-react";

export const metadata = { title: "Menus | School CMS" };

export default async function AdminMenusPage() {
  await requirePermission("menus.view");
  const menus = await getMenus();

  return (
    <AdminPageLayout>
      <PageHeader
        title="Menus"
        description="Manage navigation menus"
        actions={
          <Link href="/admin/menus/create" className={buttonVariants()}><Plus className="h-4 w-4 mr-2" /> New Menu</Link>
        }
      />
      <MenusList menus={JSON.parse(JSON.stringify(menus))} />
    </AdminPageLayout>
  );
}
