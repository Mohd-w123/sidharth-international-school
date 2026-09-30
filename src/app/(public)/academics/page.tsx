import {
  programService,
  classService,
  subjectService,
  calendarService,
} from "@/services/academics.service";
import { PublicAcademicsView } from "@/features/academics/components/public-academics-view";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata: Metadata = {
  title: "Academics & Curriculum | Siddharth International School",
  description:
    "Explore academic programs, classes, curriculum subjects, and academic calendar at Siddharth International School, Nangal (Udaipurwati). Affiliated to CBSE, New Delhi.",
};

export default async function PublicAcademicsPage() {
  const [programsRes, classesRes, subjectsRes, calendarRes] = await Promise.all([
    programService.findPublished(),
    classService.findPublished(),
    subjectService.findPublished(),
    calendarService.findPublished("2026-2027"),
  ]);

  const programs = programsRes.data.map((p) => ({
    _id: String(p._id),
    name: p.name,
    slug: p.slug,
    description: p.description || "",
    image: p.image || "",
    order: p.order || 0,
  }));

  const classes = classesRes.data.map((c) => ({
    _id: String(c._id),
    name: c.name,
    slug: c.slug,
    program: c.program ? String(c.program) : "",
    section: c.section || "",
    description: c.description || "",
    order: c.order || 0,
  }));

  const subjects = subjectsRes.data.map((s) => ({
    _id: String(s._id),
    name: s.name,
    code: s.code || "",
    department: s.department || "General Curriculum",
    description: s.description || "",
    order: s.order || 0,
  }));

  const calendarEvents = calendarRes.data.map((e) => ({
    _id: String(e._id),
    title: e.title,
    description: e.description || "",
    date: e.date instanceof Date ? e.date.toISOString() : String(e.date),
    endDate: e.endDate instanceof Date ? e.endDate.toISOString() : e.endDate ? String(e.endDate) : undefined,
    type: e.type,
    session: e.session,
  }));

  return (
    <PublicAcademicsView
      programs={programs}
      classes={classes}
      subjects={subjects}
      calendarEvents={calendarEvents}
    />
  );
}
