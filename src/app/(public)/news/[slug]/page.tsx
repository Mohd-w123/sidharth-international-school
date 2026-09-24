import { notFound } from "next/navigation";
import { newsService } from "@/services/news.service";
import { Container } from "@/components/layout/container";
import { RichTextRenderer } from "@/components/shared/rich-text-renderer";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";
export const revalidate = 0;

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const news = await newsService.findPublishedBySlug(slug);
  if (!news) return { title: "Not Found" };
  return { title: news.title, description: news.excerpt };
}

export default async function PublicNewsDetailPage({ params }: Props) {
  const { slug } = await params;
  const news = await newsService.findPublishedBySlug(slug);
  if (!news) notFound();

  return (
    <main>
      <Container className="py-12 max-w-3xl">
        <article>
          {news.featuredImage && (
            <img src={news.featuredImage} alt={news.title} className="w-full aspect-video object-cover rounded-lg mb-6" />
          )}
          <h1 className="text-3xl font-bold mb-2">{news.title}</h1>
          <div className="flex items-center gap-3 text-sm text-muted-foreground mb-8">
            {news.publishedAt && <time>{new Date(news.publishedAt).toLocaleDateString()}</time>}
            {news.category && <span className="bg-muted px-2 py-0.5 rounded">{news.category}</span>}
          </div>
          {news.excerpt && <p className="text-lg text-muted-foreground mb-6">{news.excerpt}</p>}
          <RichTextRenderer content={news.content} />
        </article>
      </Container>
    </main>
  );
}
