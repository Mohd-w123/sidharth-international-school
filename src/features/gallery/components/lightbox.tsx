"use client";

import { useState } from "react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

interface LightboxProps {
  images: { url: string; title?: string; caption?: string }[];
  initialIndex: number;
  onClose: () => void;
}

export function Lightbox({ images, initialIndex, onClose }: LightboxProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const current = images[currentIndex];

  const goNext = () => setCurrentIndex((i) => (i + 1) % images.length);
  const goPrev = () =>
    setCurrentIndex((i) => (i - 1 + images.length) % images.length);

  return (
    <div
      className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center"
      onClick={onClose}
    >
      <button
        onClick={onClose}
        className="absolute top-4 right-4 text-white/80 hover:text-white z-10"
      >
        <X className="h-8 w-8" />
      </button>

      {images.length > 1 && (
        <>
          <button
            onClick={(e) => {
              e.stopPropagation();
              goPrev();
            }}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-white/80 hover:text-white bg-white/10 rounded-full p-2 backdrop-blur-sm z-10"
          >
            <ChevronLeft className="h-8 w-8" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              goNext();
            }}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-white/80 hover:text-white bg-white/10 rounded-full p-2 backdrop-blur-sm z-10"
          >
            <ChevronRight className="h-8 w-8" />
          </button>
        </>
      )}

      <div
        className="max-w-[90vw] max-h-[85vh] flex flex-col items-center"
        onClick={(e) => e.stopPropagation()}
      >
        <img
          src={current?.url}
          alt={current?.title || "Gallery image"}
          className="max-w-full max-h-[75vh] object-contain rounded"
        />
        {(current?.title || current?.caption) && (
          <div className="text-center mt-4 text-white">
            {current.title && (
              <p className="font-semibold text-lg">{current.title}</p>
            )}
            {current.caption && (
              <p className="text-sm text-white/70 mt-1">{current.caption}</p>
            )}
          </div>
        )}
        <p className="text-white/50 text-sm mt-2">
          {currentIndex + 1} / {images.length}
        </p>
      </div>
    </div>
  );
}
