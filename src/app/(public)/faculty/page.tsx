import { facultyService } from "@/services/faculty.service";
import { Container } from "@/components/layout/container";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import { User, Mail } from "lucide-react";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata: Metadata = {
  title: "Faculty",
  description: "Meet our dedicated teaching staff",
};

interface Props {
  searchParams: Promise<{ department?: string }>;
}

export default async function PublicFacultyPage({ searchParams }: Props) {
  const { department } = await searchParams;
  const result = await facultyService.findPublished(1, 100, department);
  const departments = await facultyService.findAllDepartments();

  return (
    <main>
      <div className="bg-[#003d78] text-white py-16">
        <Container>
          <h1 className="text-4xl font-bold">Our Faculty</h1>
          <p className="mt-2 text-white/80 text-lg">
            Meet our dedicated and experienced teaching staff
          </p>
        </Container>
      </div>

      <Container className="py-12">
        {/* Department Filter */}
        {departments.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-8">
            <Link
              href="/faculty"
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                !department
                  ? "bg-[#003d78] text-white"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              }`}
            >
              All
            </Link>
            {departments.map((dept) => (
              <Link
                key={dept}
                href={`/faculty?department=${encodeURIComponent(dept)}`}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  department === dept
                    ? "bg-[#003d78] text-white"
                    : "bg-muted text-muted-foreground hover:bg-muted/80"
                }`}
              >
                {dept}
              </Link>
            ))}
          </div>
        )}

        {result.data.length === 0 ? (
          <p className="text-muted-foreground text-center py-12">
            No faculty members to display.
          </p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {result.data.map((member) => (
              <Card
                key={member._id.toString()}
                className="group overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
              >
                <div className="aspect-[3/4] relative overflow-hidden bg-gradient-to-br from-[#003d78]/10 to-[#0b5699]/5">
                  {member.photo ? (
                    <img
                      src={member.photo}
                      alt={member.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <User className="h-20 w-20 text-muted-foreground/30" />
                    </div>
                  )}
                </div>
                <CardContent className="p-4 text-center">
                  <h3 className="font-semibold text-lg">{member.name}</h3>
                  <p className="text-[#0b5699] text-sm font-medium">
                    {member.designation}
                  </p>
                  {member.department && (
                    <p className="text-muted-foreground text-xs mt-1">
                      {member.department}
                      {member.subject ? ` • ${member.subject}` : ""}
                    </p>
                  )}
                  {member.qualification && (
                    <p className="text-muted-foreground text-xs mt-1">
                      {member.qualification}
                    </p>
                  )}
                  {member.email && (
                    <a
                      href={`mailto:${member.email}`}
                      className="inline-flex items-center gap-1 text-xs text-[#0b5699] hover:underline mt-2"
                    >
                      <Mail className="h-3 w-3" /> {member.email}
                    </a>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </Container>
    </main>
  );
}
