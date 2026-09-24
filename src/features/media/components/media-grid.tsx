"use client";

import { useState, useTransition } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { SearchFilterBar } from "@/features/admin/components/search-filter-bar";
import { PaginationControls } from "@/features/admin/components/pagination-controls";
import { EmptyState } from "@/components/shared/empty-state";
import { MediaUploadDialog } from "./media-upload-dialog";
import { deleteMedia } from "@/actions/media.actions";
import { Upload, Trash2, FileText, Film } from "lucide-react";
import { toast } from "sonner";
import type { PaginatedResult } from "@/lib/cms";

interface MediaItem {
  _id: string;
  filename: string;
  originalName: string;
  url: string;
  mimeType: string;
  size: number;
  width?: number;
  height?: number;
  alt?: string;
  createdAt: string;
}

interface MediaGridProps {
  data: PaginatedResult<MediaItem>;
}

export function MediaGrid({ data }: MediaGridProps) {
  const [showUpload, setShowUpload] = useState(false);
  const [isPending, startTransition] = useTransition();

  const handleDelete = (id: string) => {
    startTransition(async () => {
      const result = await deleteMedia(id);
      if (result.error) toast.error(result.error);
      else toast.success(result.success);
    });
  };

  const isImage = (mimeType: string) => mimeType.startsWith("image/");
  const isVideo = (mimeType: string) => mimeType.startsWith("video/");

  return (
    <div className="space-y-4">
      <SearchFilterBar
        searchPlaceholder="Search files..."
        statusOptions={[
          { value: "all", label: "All Types" },
          { value: "image", label: "Images" },
          { value: "application", label: "Documents" },
          { value: "video", label: "Videos" },
        ]}
        actions={
          <Button onClick={() => setShowUpload(true)}>
            <Upload className="h-4 w-4 mr-2" /> Upload
          </Button>
        }
      />

      {data.data.length === 0 ? (
        <EmptyState
          title="No media files"
          description="Upload your first file to get started."
          action={<Button onClick={() => setShowUpload(true)}><Upload className="h-4 w-4 mr-2" /> Upload</Button>}
        />
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {data.data.map((item) => (
            <Card key={item._id} className="group relative overflow-hidden">
              <div className="aspect-square relative bg-muted flex items-center justify-center">
                {isImage(item.mimeType) ? (
                  <Image src={item.url} alt={item.alt || item.originalName} fill className="object-cover" sizes="200px" />
                ) : isVideo(item.mimeType) ? (
                  <Film className="h-8 w-8 text-muted-foreground" />
                ) : (
                  <FileText className="h-8 w-8 text-muted-foreground" />
                )}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <Button size="sm" variant="ghost" className="text-white hover:text-white" onClick={() => handleDelete(item._id)} disabled={isPending}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <div className="p-2">
                <p className="text-xs truncate">{item.originalName}</p>
              </div>
            </Card>
          ))}
        </div>
      )}

      <PaginationControls page={data.page} totalPages={data.totalPages} total={data.total} />
      <MediaUploadDialog open={showUpload} onOpenChange={setShowUpload} />
    </div>
  );
}
