import { notFound } from "next/navigation";
import { requirePermission } from "@/lib/auth/session";
import { getMenuById } from "@/actions/menu.actions";
import { AdminPageLayout } from "@/features/admin/components/admin-page-layout";
import { PageHeader } from "@/features/admin/components/page-header";
import { MenuBuilder } from "@/features/menus/components/menu-builder";

export const metadata = { title: "Edit Menu | School CMS" };

interface Props { params: Promise<{ id: string }>; }

export default async function EditMenuPage({ params }: Props) {
  await requirePermission("menus.update");
  const { id } = await params;
  const menu = await getMenuById(id);
  if (!menu) notFound();
  return (
    <AdminPageLayout>
      <PageHeader title="Edit Menu" description={`Editing: ${menu.name}`} />
      <MenuBuilder initialData={JSON.parse(JSON.stringify(menu))} />
    </AdminPageLayout>
  );
}
