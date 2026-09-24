"use client";

import { useState } from "react";
import { Lightbox } from "@/features/gallery/components/lightbox";

interface GalleryGridProps {
  items: {
    _id: string;
    url: string;
    thumbnailUrl?: string;
    title?: string;
    caption?: string;
    type: string;
  }[];
}

export function GalleryGrid({ items }: GalleryGridProps) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const imageItems = items.filter((i) => i.type === "image");
  const videoItems = items.filter((i) => i.type === "video");

  return (
    <>
      {imageItems.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {imageItems.map((item, idx) => (
            <button
              key={item._id}
              onClick={() => setLightboxIndex(idx)}
              className="group aspect-square rounded-lg overflow-hidden bg-muted relative"
            >
              <img
                src={item.thumbnailUrl || item.url}
                alt={item.title || "Gallery image"}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
              {item.title && (
                <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                  <p className="text-white text-xs truncate">{item.title}</p>
                </div>
              )}
            </button>
          ))}
        </div>
      )}

      {videoItems.length > 0 && (
        <div className="space-y-4 mt-6">
          <h3 className="text-lg font-semibold">Videos</h3>
          <div className="grid gap-4 sm:grid-cols-2">
            {videoItems.map((item) => (
              <div key={item._id} className="aspect-video rounded-lg overflow-hidden border">
                <iframe
                  src={item.url}
                  title={item.title || "Video"}
                  className="w-full h-full"
                  allowFullScreen
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {lightboxIndex !== null && (
        <Lightbox
          images={imageItems.map((i) => ({
            url: i.url,
            title: i.title,
            caption: i.caption,
          }))}
          initialIndex={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
        />
      )}
    </>
  );
}
