import { programService } from "@/services/academics.service";
import { Container } from "@/components/layout/container";
import { Card, CardContent } from "@/components/ui/card";
import { GraduationCap } from "lucide-react";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata: Metadata = { title: "Academics", description: "Academic programs and curriculum" };

export default async function PublicAcademicsPage() {
  const result = await programService.findPublished();

  return (
    <main>
      <div className="bg-[#003d78] text-white py-16">
        <Container>
          <h1 className="text-4xl font-bold">Academics</h1>
          <p className="mt-2 text-white/80 text-lg">Our curriculum and academic programs</p>
        </Container>
      </div>
      <Container className="py-12">
        {result.data.length === 0 ? (
          <p className="text-muted-foreground text-center py-12">Academic information coming soon.</p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {result.data.map((prog) => (
              <Card key={prog._id.toString()} className="group overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                <div className="aspect-video relative overflow-hidden bg-gradient-to-br from-[#003d78]/10 to-[#0b5699]/5">
                  {prog.image ? (
                    <img src={prog.image} alt={prog.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center"><GraduationCap className="h-16 w-16 text-[#003d78]/20" /></div>
                  )}
                </div>
                <CardContent className="p-5">
                  <h3 className="font-semibold text-xl group-hover:text-[#0b5699] transition-colors">{prog.name}</h3>
                  {prog.description && <p className="text-sm text-muted-foreground mt-2 line-clamp-3">{prog.description}</p>}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </Container>
    </main>
  );
}
