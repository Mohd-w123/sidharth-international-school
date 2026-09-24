import { requirePermission } from "@/lib/auth/session";
import { getPageById } from "@/actions/page.actions";
import { Container } from "@/components/layout/container";
import { RichTextRenderer } from "@/components/shared/rich-text-renderer";
import { getDownloadUrl } from "@/lib/utils/format";
import { FileDown } from "lucide-react";
import { notFound } from "next/navigation";

export const metadata = { title: "Page Preview | School CMS" };

interface Props {
  params: Promise<{ id: string }>;
}

function getEmbedUrl(url: string) {
  if (!url) return "";
  let videoId = "";
  if (url.includes("youtube.com/watch?v=")) {
    videoId = url.split("v=")[1]?.split("&")[0] || "";
  } else if (url.includes("youtu.be/")) {
    videoId = url.split("youtu.be/")[1]?.split("?")[0] || "";
  } else if (url.includes("youtube.com/embed/")) {
    return url;
  }
  return videoId ? `https://www.youtube.com/embed/${videoId}` : url;
}

export default async function AdminPagePreviewPage({ params }: Props) {
  // Ensure authenticated user can view pages
  await requirePermission("pages.view");
  const { id } = await params;
  const page = await getPageById(id);

  if (!page) {
    notFound();
  }

  return (
    <main className="w-full min-h-screen bg-background">
      {/* Notice header for draft states */}
      <div className="bg-amber-500 text-white py-1.5 text-center text-xs font-semibold tracking-wider uppercase select-none">
        Previewing Draft Version of page: &ldquo;{page.title}&rdquo;
      </div>

      {page.banner && (
        <div className="relative h-48 md:h-64 bg-primary/10">
          <img src={page.banner} alt={page.title} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
            <h1 className="text-3xl md:text-4xl font-bold text-white">{page.title}</h1>
          </div>
        </div>
      )}
      <Container className="py-12">
        {!page.banner && <h1 className="text-3xl font-bold mb-6">{page.title}</h1>}
        {page.description && <p className="text-lg text-muted-foreground mb-8">{page.description}</p>}
        
        {page.blocks.map((block, idx) => (
          <div key={idx} className="my-6">
            {block.type === "rich-text" && typeof block.content.html === "string" && (
              <RichTextRenderer content={block.content.html} />
            )}
            
            {block.type === "image" && typeof block.content.url === "string" && (
              <figure className="my-8">
                <img src={block.content.url} alt={(block.content.alt as string) || ""} className="rounded-lg w-full max-h-[500px] object-cover" />
                {typeof block.content.caption === "string" && <figcaption className="text-sm text-muted-foreground mt-2 text-center">{block.content.caption}</figcaption>}
              </figure>
            )}

            {block.type === "video" && typeof block.content.url === "string" && block.content.url && (
              <div className="aspect-video my-8 rounded-lg overflow-hidden border bg-black">
                <iframe
                  src={getEmbedUrl(block.content.url)}
                  className="w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            )}

            {block.type === "button" && typeof block.content.url === "string" && (
              <div className="my-6">
                <a
                  href={block.content.url}
                  className="inline-flex items-center justify-center bg-primary text-primary-foreground hover:bg-primary/95 px-6 py-2.5 rounded-md font-medium text-sm transition shadow-sm"
                >
                  {(block.content.text as string) || "Learn More"}
                </a>
              </div>
            )}

            {block.type === "attachment" && typeof block.content.url === "string" && (
              <div className="my-6">
                <a
                  href={getDownloadUrl(block.content.url, (block.content.label as string) || "Document")}
                  download
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-3 p-4 border rounded-lg bg-card hover:bg-muted/40 transition w-full sm:w-auto"
                >
                  <FileDown className="h-5 w-5 text-primary shrink-0" />
                  <div className="text-left">
                    <p className="text-sm font-semibold text-foreground leading-none">
                      {(block.content.label as string) || "Download Document"}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">Click to view or download file</p>
                  </div>
                </a>
              </div>
            )}

            {block.type === "content-block" && (
              <div className="my-6 p-6 border-l-4 border-primary bg-muted/40 rounded-r-lg space-y-2">
                {typeof block.content.title === "string" && block.content.title && (
                  <h3 className="text-lg font-semibold tracking-tight text-foreground">{block.content.title}</h3>
                )}
                {typeof block.content.subtitle === "string" && block.content.subtitle && (
                  <p className="text-xs font-medium uppercase tracking-wider text-primary">{block.content.subtitle}</p>
                )}
                {typeof block.content.body === "string" && block.content.body && (
                  <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">{block.content.body}</p>
                )}
              </div>
            )}
          </div>
        ))}
      </Container>
    </main>
  );
}
