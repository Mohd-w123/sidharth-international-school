import { requirePermission } from "@/lib/auth/session";
import { AdminPageLayout } from "@/features/admin/components/admin-page-layout";
import { PageHeader } from "@/features/admin/components/page-header";
import { AlbumForm } from "@/features/gallery/components/album-form";

export const metadata = { title: "Create Album | School CMS" };

export default async function CreateAlbumPage() {
  await requirePermission("gallery.create");

  return (
    <AdminPageLayout>
      <PageHeader title="Create Album" description="Add a new photo or video album" />
      <AlbumForm />
    </AdminPageLayout>
  );
}
