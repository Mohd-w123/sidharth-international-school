import { requirePermission } from "@/lib/auth/session";
import { getMedia } from "@/actions/media.actions";
import { AdminPageLayout } from "@/features/admin/components/admin-page-layout";
import { PageHeader } from "@/features/admin/components/page-header";
import { MediaGrid } from "@/features/media/components/media-grid";

export const metadata = { title: "Media Library | School CMS" };

interface Props {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default async function AdminMediaPage({ searchParams }: Props) {
  await requirePermission("media.view");
  const params = await searchParams;
  const result = await getMedia(params);

  return (
    <AdminPageLayout>
      <PageHeader title="Media Library" description="Manage uploaded files" />
      <MediaGrid data={JSON.parse(JSON.stringify(result))} />
    </AdminPageLayout>
  );
}
