import { requirePermission } from "@/lib/auth/session";
import { getAlbums } from "@/actions/gallery.actions";
import { AdminPageLayout } from "@/features/admin/components/admin-page-layout";
import { PageHeader } from "@/features/admin/components/page-header";
import { GalleryTable } from "@/features/gallery/components/gallery-table";
import { buttonVariants } from "@/components/ui/button";
import Link from "next/link";
import { Plus } from "lucide-react";

export const metadata = { title: "Gallery | School CMS" };

interface Props {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default async function AdminGalleryPage({ searchParams }: Props) {
  await requirePermission("gallery.view");
  const params = await searchParams;
  const result = await getAlbums(params);

  return (
    <AdminPageLayout>
      <PageHeader
        title="Gallery"
        description="Manage photo and video albums"
        actions={
          <Link href="/admin/gallery/create" className={buttonVariants()}>
            <Plus className="h-4 w-4 mr-2" /> New Album
          </Link>
        }
      />
      <GalleryTable data={JSON.parse(JSON.stringify(result))} />
    </AdminPageLayout>
  );
}
