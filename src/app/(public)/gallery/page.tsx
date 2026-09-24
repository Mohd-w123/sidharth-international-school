import { galleryService } from "@/services/gallery.service";
import { Container } from "@/components/layout/container";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import { Images, Video } from "lucide-react";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata: Metadata = {
  title: "Gallery",
  description: "Photo and video gallery",
};

interface Props {
  searchParams: Promise<{ page?: string; type?: string }>;
}

export default async function PublicGalleryPage({ searchParams }: Props) {
  const { page: pageParam, type } = await searchParams;
  const page = Math.max(1, Number(pageParam) || 1);
  const albumType =
    type === "photo" || type === "video" ? type : undefined;
  const result = await galleryService.findPublished(page, 12, albumType);

  return (
    <main>
      <div className="bg-[#003d78] text-white py-16">
        <Container>
          <h1 className="text-4xl font-bold">Gallery</h1>
          <p className="mt-2 text-white/80 text-lg">
            Explore our memories and moments
          </p>
        </Container>
      </div>

      <Container className="py-12">
        {/* Filter Tabs */}
        <div className="flex gap-2 mb-8">
          <Link
            href="/gallery"
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              !albumType
                ? "bg-[#003d78] text-white"
                : "bg-muted text-muted-foreground hover:bg-muted/80"
            }`}
          >
            All
          </Link>
          <Link
            href="/gallery?type=photo"
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors flex items-center gap-1.5 ${
              albumType === "photo"
                ? "bg-[#003d78] text-white"
                : "bg-muted text-muted-foreground hover:bg-muted/80"
            }`}
          >
            <Images className="h-3.5 w-3.5" /> Photos
          </Link>
          <Link
            href="/gallery?type=video"
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors flex items-center gap-1.5 ${
              albumType === "video"
                ? "bg-[#003d78] text-white"
                : "bg-muted text-muted-foreground hover:bg-muted/80"
            }`}
          >
            <Video className="h-3.5 w-3.5" /> Videos
          </Link>
        </div>

        {result.data.length === 0 ? (
          <p className="text-muted-foreground text-center py-12">
            No albums available yet.
          </p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {result.data.map((album) => (
              <Link key={album._id.toString()} href={`/gallery/${album.slug}`}>
                <Card className="group h-full overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                  <div className="aspect-video relative overflow-hidden">
                    {album.coverImage ? (
                      <img
                        src={album.coverImage}
                        alt={album.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-[#003d78] to-[#0b5699] flex items-center justify-center">
                        {album.type === "video" ? (
                          <Video className="h-12 w-12 text-white/40" />
                        ) : (
                          <Images className="h-12 w-12 text-white/40" />
                        )}
                      </div>
                    )}
                    <div className="absolute top-3 right-3">
                      <span className="bg-black/60 text-white text-xs px-2 py-1 rounded-full backdrop-blur-sm">
                        {album.type === "video" ? "Video" : "Photo"} Album
                      </span>
                    </div>
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-semibold text-lg group-hover:text-[#0b5699] transition-colors">
                      {album.title}
                    </h3>
                    {album.description && (
                      <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                        {album.description}
                      </p>
                    )}
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}

        {result.totalPages > 1 && (
          <div className="flex justify-center gap-2 mt-10">
            {Array.from({ length: result.totalPages }, (_, i) => (
              <Link
                key={i}
                href={`/gallery?page=${i + 1}${albumType ? `&type=${albumType}` : ""}`}
                className={`px-3 py-1.5 rounded text-sm font-medium transition-colors ${
                  page === i + 1
                    ? "bg-[#003d78] text-white"
                    : "bg-muted text-muted-foreground hover:bg-muted/80"
                }`}
              >
                {i + 1}
              </Link>
            ))}
          </div>
        )}
      </Container>
    </main>
  );
}
