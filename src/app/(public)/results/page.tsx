import { resultService } from "@/services/result.service";
import { Container } from "@/components/layout/container";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { Award, Calendar, ArrowRight } from "lucide-react";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata: Metadata = { title: "Results & Academic Highlights", description: "CBSE and Internal Board Examination Results" };

export default async function PublicResultsPage() {
  const result = await resultService.findPublished();

  return (
    <main>
      <div className="bg-[#003d78] text-white py-16">
        <Container>
          <h1 className="text-4xl font-bold">Academic Results</h1>
          <p className="mt-2 text-white/80 text-lg">Excellence in CBSE Board and Institutional Examinations</p>
        </Container>
      </div>

      <Container className="py-12">
        {result.data.length === 0 ? (
          <p className="text-muted-foreground text-center py-12">No result announcements available at this time.</p>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {result.data.map((item) => (
              <Card key={item._id.toString()} className="group hover:shadow-lg transition-all border-l-4 border-l-[#ffb300]">
                <CardHeader>
                  <div className="flex items-center gap-2 text-xs text-[#0b5699] font-semibold mb-1">
                    <Calendar className="h-3.5 w-3.5" /> Session {item.session}
                    {item.class && <span className="bg-muted text-muted-foreground px-2 py-0.5 rounded text-xs ml-auto">{item.class}</span>}
                  </div>
                  <CardTitle className="text-lg group-hover:text-[#0b5699] transition-colors">{item.title}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {item.description && <p className="text-sm text-muted-foreground line-clamp-3">{item.description}</p>}
                  <Link href={`/results/${item.slug}`} className="inline-flex items-center gap-1.5 text-sm font-medium text-[#003d78] hover:text-[#0b5699]">
                    View Full Highlights <ArrowRight className="h-4 w-4" />
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </Container>
    </main>
  );
}
