import { homepageService } from "@/services/homepage.service";
import { newsService } from "@/services/news.service";
import { HomepageRenderer } from "@/features/homepage/components/homepage-renderer";
import { PublicHeader } from "@/components/layout/public-header";
import { PublicFooter } from "@/components/layout/public-footer";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function RootPage() {
  const [config, latestNews] = await Promise.all([
    homepageService.getPublishedConfig(),
    newsService.findPublished(1, 10).catch(() => ({ data: [] })),
  ]);

  if (!config || config.sections.length === 0) {
    return (
      <div className="flex min-h-screen flex-col">
        <PublicHeader />
        <main className="flex flex-1 flex-col items-center justify-center p-8">
          <h1 className="text-4xl font-bold text-primary">School CMS</h1>
          <p className="mt-4 text-muted-foreground">Website under construction. Check back soon.</p>
        </main>
        <PublicFooter />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col">
      <PublicHeader />
      <main className="flex-1">
        <HomepageRenderer
          sections={JSON.parse(JSON.stringify(config.sections))}
          latestNews={JSON.parse(JSON.stringify(latestNews.data))}
        />
      </main>
      <PublicFooter />
    </div>
  );
}
