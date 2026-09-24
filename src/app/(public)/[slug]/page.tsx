import { notFound } from "next/navigation";
import { pageService } from "@/services/page.service";
import { Container } from "@/components/layout/container";
import { RichTextRenderer } from "@/components/shared/rich-text-renderer";
import type { Metadata } from "next";
import { getDownloadUrl } from "@/lib/utils/format";
import { FileDown } from "lucide-react";

export const dynamic = "force-dynamic";
export const revalidate = 0;

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

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const page = await pageService.findPublishedBySlug(slug);
  if (!page) return { title: "Not Found" };
  return {
    title: page.seoTitle || page.title,
    description: page.seoDescription || page.description,
    keywords: page.seoKeywords,
  };
}

export default async function DynamicPage({ params }: Props) {
  const { slug } = await params;
  const page = await pageService.findPublishedBySlug(slug);
  if (!page) notFound();

  return (
    <main>
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

            {block.type === "team-grid" && Array.isArray(block.content.members) && (
              <div className="my-10">
                {Boolean(block.content.title) && (
                  <div className="text-center max-w-2xl mx-auto mb-8">
                    <h3 className="text-2xl sm:text-3xl font-bold text-[#002a54]">{String(block.content.title)}</h3>
                    {Boolean(block.content.subtitle) && (
                      <p className="text-sm text-slate-600 mt-1 font-normal">{String(block.content.subtitle)}</p>
                    )}
                    <div className="w-12 h-1 bg-[#ffb300] mx-auto mt-3 rounded-full" />
                  </div>
                )}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
                  {(block.content.members as any[]).map((member, mIdx) => (
                    <div
                      key={mIdx}
                      className="rounded-2xl border border-slate-200/80 bg-white overflow-hidden shadow-xs hover:shadow-lg transition-all duration-300 flex flex-col h-full group text-center"
                    >
                      <div className="relative aspect-[4/4.5] w-full overflow-hidden bg-slate-100">
                        <img
                          src={member.image || "https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=600&auto=format&fit=crop"}
                          alt={member.name}
                          className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
                        />
                      </div>
                      <div className="p-5 flex flex-col flex-1 bg-white">
                        <h4 className="font-bold text-base sm:text-lg text-[#002a54] mb-0.5 leading-snug">
                          {member.name}
                        </h4>
                        <p className="text-xs font-bold text-[#004080] tracking-wider uppercase mb-2">
                          {member.designation}
                        </p>
                        {member.bio && (
                          <p className="text-xs text-slate-600 leading-relaxed font-normal mt-auto">
                            {member.bio}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
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
