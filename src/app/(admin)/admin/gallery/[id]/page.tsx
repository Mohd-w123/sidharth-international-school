import { notFound } from "next/navigation";
import { requirePermission } from "@/lib/auth/session";
import { getAlbumById, getGalleryItems } from "@/actions/gallery.actions";
import { AdminPageLayout } from "@/features/admin/components/admin-page-layout";
import { PageHeader } from "@/features/admin/components/page-header";
import { AlbumForm } from "@/features/gallery/components/album-form";

export const metadata = { title: "Edit Album | School CMS" };

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EditAlbumPage({ params }: Props) {
  await requirePermission("gallery.update");
  const { id } = await params;
  const album = await getAlbumById(id);
  if (!album) notFound();

  const items = await getGalleryItems(id);

  return (
    <AdminPageLayout>
      <PageHeader title="Edit Album" description={`Editing: ${album.title}`} />
      <AlbumForm
        initialData={JSON.parse(JSON.stringify(album))}
        initialItems={JSON.parse(JSON.stringify(items))}
      />
    </AdminPageLayout>
  );
}
