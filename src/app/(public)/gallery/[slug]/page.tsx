import { notFound } from "next/navigation";
import { galleryService } from "@/services/gallery.service";
import { Container } from "@/components/layout/container";
import { GalleryGrid } from "@/features/gallery/components/gallery-grid";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";
export const revalidate = 0;

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const album = await galleryService.findPublishedBySlug(slug);
  if (!album) return { title: "Not Found" };
  return { title: `${album.title} | Gallery`, description: album.description };
}

export default async function PublicAlbumDetailPage({ params }: Props) {
  const { slug } = await params;
  const album = await galleryService.findPublishedBySlug(slug);
  if (!album) notFound();

  const items = await galleryService.getItems(album._id.toString());

  return (
    <main>
      {/* Hero Banner */}
      <div className="relative bg-[#003d78] text-white py-16">
        {album.coverImage && (
          <div className="absolute inset-0">
            <img
              src={album.coverImage}
              alt=""
              className="w-full h-full object-cover opacity-30"
            />
          </div>
        )}
        <Container className="relative">
          <Link
            href="/gallery"
            className="inline-flex items-center gap-1.5 text-sm text-white/70 hover:text-white mb-4 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" /> Back to Gallery
          </Link>
          <h1 className="text-4xl font-bold">{album.title}</h1>
          {album.description && (
            <p className="mt-2 text-white/80 text-lg max-w-2xl">
              {album.description}
            </p>
          )}
          <p className="mt-3 text-white/60 text-sm">
            {items.length} {album.type === "video" ? "video" : "photo"}
            {items.length !== 1 ? "s" : ""}
          </p>
        </Container>
      </div>

      <Container className="py-10">
        {items.length === 0 ? (
          <p className="text-center text-muted-foreground py-12">
            This album is empty.
          </p>
        ) : (
          <GalleryGrid items={JSON.parse(JSON.stringify(items))} />
        )}
      </Container>
    </main>
  );
}
