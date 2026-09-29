"use client";

export function getYouTubeVideoId(url?: string | null): string | null {
  if (!url || typeof url !== "string") return null;
  const trimmed = url.trim();
  const regExp =
    /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?|shorts)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
  const match = trimmed.match(regExp);
  return match?.[1] ?? null;
}

export function getYouTubeEmbedUrl(url?: string | null): string | null {
  const id = getYouTubeVideoId(url);
  if (!id) return null;
  return `https://www.youtube-nocookie.com/embed/${id}?rel=0&modestbranding=1`;
}

interface RegionalVideoCardProps {
  image?: string;
  videoUrl?: string;
  videoCaption?: string;
  title?: string;
}

export function RegionalVideoCard({
  image,
  videoUrl,
  title = "School Campus Tour",
}: RegionalVideoCardProps) {
  const youtubeId = getYouTubeVideoId(videoUrl);

  // If a YouTube video is provided, embed it directly into the frame with no thumbnail image
  if (youtubeId) {
    return (
      <div className="relative aspect-video rounded-2xl overflow-hidden shadow-xl border-4 border-white bg-black">
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${youtubeId}?rel=0&modestbranding=1`}
          title={title}
          className="w-full h-full border-0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
        />
      </div>
    );
  }

  // If direct HTML5 video (e.g. .mp4)
  if (
    videoUrl &&
    (videoUrl.endsWith(".mp4") ||
      videoUrl.endsWith(".webm") ||
      videoUrl.startsWith("/slider-video/"))
  ) {
    return (
      <div className="relative aspect-video rounded-2xl overflow-hidden shadow-xl border-4 border-white bg-black">
        <video
          src={videoUrl}
          controls
          playsInline
          className="w-full h-full object-cover"
        />
      </div>
    );
  }

  // Fallback if no video is provided
  return (
    <div className="relative aspect-video rounded-2xl overflow-hidden shadow-xl border-4 border-white bg-slate-900">
      <img
        src={image || "/uploads/campus/morning-assembly-ground.jpg"}
        alt={title}
        className="w-full h-full object-cover"
      />
    </div>
  );
}
