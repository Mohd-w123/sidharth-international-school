import { notFound } from "next/navigation";
import { requirePermission } from "@/lib/auth/session";
import { getTCById } from "@/actions/tc.actions";
import { AdminPageLayout } from "@/features/admin/components/admin-page-layout";
import { PageHeader } from "@/features/admin/components/page-header";
import { TCForm } from "@/features/tc/components/tc-form";

export const metadata = { title: "Edit Transfer Certificate | School CMS" };

interface Props { params: Promise<{ id: string }>; }

export default async function EditTCPage({ params }: Props) {
  await requirePermission("tc.update");
  const { id } = await params;
  const tc = await getTCById(id);
  if (!tc) notFound();

  return (
    <AdminPageLayout>
      <PageHeader title="Edit Transfer Certificate" description={`Editing TC: ${tc.tcNumber}`} />
      <TCForm initialData={JSON.parse(JSON.stringify(tc))} />
    </AdminPageLayout>
  );
}
