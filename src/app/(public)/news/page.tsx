import { newsService } from "@/services/news.service";
import { Container } from "@/components/layout/container";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata: Metadata = {
  title: "News",
  description: "Latest news and updates",
};

interface Props {
  searchParams: Promise<{ page?: string }>;
}

export default async function PublicNewsPage({ searchParams }: Props) {
  const { page: pageParam } = await searchParams;
  const page = Math.max(1, Number(pageParam) || 1);
  const result = await newsService.findPublished(page, 12);

  return (
    <main>
      <Container className="py-12">
        <h1 className="text-3xl font-bold mb-8">News & Updates</h1>
        {result.data.length === 0 ? (
          <p className="text-muted-foreground">No news articles available.</p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {result.data.map((item) => (
              <Link key={item._id.toString()} href={`/news/${item.slug}`}>
                <Card className="h-full hover:shadow-md transition-shadow">
                  {item.featuredImage && (
                    <div className="aspect-video relative overflow-hidden rounded-t-lg">
                      <img src={item.featuredImage} alt={item.title} className="w-full h-full object-cover" />
                    </div>
                  )}
                  <CardHeader>
                    <CardTitle className="text-lg line-clamp-2">{item.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {item.excerpt && <p className="text-sm text-muted-foreground line-clamp-3">{item.excerpt}</p>}
                    <p className="text-xs text-muted-foreground mt-2">
                      {item.publishedAt ? new Date(item.publishedAt).toLocaleDateString() : ""}
                    </p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
        {result.totalPages > 1 && (
          <div className="flex justify-center gap-2 mt-8">
            {Array.from({ length: result.totalPages }, (_, i) => (
              <Link
                key={i}
                href={`/news?page=${i + 1}`}
                className={`px-3 py-1 rounded text-sm ${page === i + 1 ? "bg-primary text-primary-foreground" : "bg-muted"}`}
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
