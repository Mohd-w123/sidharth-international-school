import { notFound } from "next/navigation";
import { resultService } from "@/services/result.service";
import { Container } from "@/components/layout/container";
import { RichTextRenderer } from "@/components/shared/rich-text-renderer";
import Link from "next/link";
import { ArrowLeft, Award } from "lucide-react";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";
export const revalidate = 0;

interface Props { params: Promise<{ slug: string }>; }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const item = await resultService.findPublishedBySlug(slug);
  if (!item) return { title: "Not Found" };
  return { title: `${item.title} | Results`, description: item.description };
}

export default async function PublicResultDetailPage({ params }: Props) {
  const { slug } = await params;
  const item = await resultService.findPublishedBySlug(slug);
  if (!item) notFound();

  return (
    <main>
      <div className="bg-[#003d78] text-white py-12">
        <Container>
          <Link href="/results" className="inline-flex items-center gap-1.5 text-sm text-white/70 hover:text-white mb-4">
            <ArrowLeft className="h-4 w-4" /> Back to Results
          </Link>
          <h1 className="text-3xl font-bold">{item.title}</h1>
          <div className="flex items-center gap-4 mt-3 text-sm text-white/80">
            <span>Session: {item.session}</span>
            {item.class && <span>Class: {item.class}</span>}
          </div>
        </Container>
      </div>

      <Container className="py-12 max-w-4xl">
        {item.description && (
          <div className="bg-amber-50 border-l-4 border-[#ffb300] p-4 rounded-r mb-8 text-amber-900 font-medium">
            {item.description}
          </div>
        )}
        {item.content && <RichTextRenderer content={item.content} />}
      </Container>
    </main>
  );
}
