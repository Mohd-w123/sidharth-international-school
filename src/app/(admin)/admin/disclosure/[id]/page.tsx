/* eslint-disable @typescript-eslint/no-explicit-any */
import { notFound } from "next/navigation";
import { requirePermission } from "@/lib/auth/session";
import { getDisclosureCategoryById, getDisclosureSections } from "@/actions/disclosure.actions";
import { AdminPageLayout } from "@/features/admin/components/admin-page-layout";
import { PageHeader } from "@/features/admin/components/page-header";
import { DisclosureSectionManager } from "@/features/disclosure/components/disclosure-section-manager";

export const metadata = { title: "Disclosure Category | School CMS" };

interface Props { params: Promise<{ id: string }>; }

export default async function DisclosureCategoryDetailPage({ params }: Props) {
  await requirePermission("disclosure.view");
  const { id } = await params;
  const category = await getDisclosureCategoryById(id);
  if (!category) notFound();
  const sections = await getDisclosureSections(id);

  return (
    <AdminPageLayout>
      <PageHeader title={category.name} description="Manage sections, fields, tables, and documents" />
      <DisclosureSectionManager
        categoryId={id}
        categoryName={category.name}
        sections={JSON.parse(JSON.stringify(sections))}
      />
    </AdminPageLayout>
  );
}
