import { requirePermission } from "@/lib/auth/session";
import { getDisclosureCategories } from "@/actions/disclosure.actions";
import { AdminPageLayout } from "@/features/admin/components/admin-page-layout";
import { PageHeader } from "@/features/admin/components/page-header";
import { DisclosureManager } from "@/features/disclosure/components/disclosure-manager";

export const metadata = { title: "Mandatory Disclosure | School CMS" };

interface Props { searchParams: Promise<Record<string, string | string[] | undefined>>; }

export default async function AdminDisclosurePage({ searchParams }: Props) {
  await requirePermission("disclosure.view");
  const params = await searchParams;
  const result = await getDisclosureCategories(params);
  return (
    <AdminPageLayout>
      <PageHeader title="Mandatory Public Disclosure" description="Manage CBSE disclosure categories and sections" />
      <DisclosureManager data={JSON.parse(JSON.stringify(result))} />
    </AdminPageLayout>
  );
}
