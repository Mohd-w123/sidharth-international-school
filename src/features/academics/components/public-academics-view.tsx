"use client";

import { useState } from "react";
import Link from "next/link";
import { Container } from "@/components/layout/container";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  GraduationCap,
  BookOpen,
  Calendar,
  Award,
  CheckCircle2,
  Sparkles,
  Clock,
  Compass,
  Atom,
  Languages,
  Cpu,
  TrendingUp,
  Dumbbell,
  ArrowRight,
  ChevronRight,
  ShieldCheck,
  Check,
  CalendarDays,
  School,
  FileCheck,
} from "lucide-react";

export interface ProgramItem {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  order: number;
}

export interface ClassItem {
  _id: string;
  name: string;
  slug: string;
  program?: string;
  section?: string;
  description?: string;
  order: number;
}

export interface SubjectItem {
  _id: string;
  name: string;
  code?: string;
  department?: string;
  description?: string;
  order: number;
}

export interface CalendarEventItem {
  _id: string;
  title: string;
  description?: string;
  date: string | Date;
  endDate?: string | Date;
  type: "holiday" | "exam" | "event" | "meeting" | "other";
  session: string;
}

interface PublicAcademicsViewProps {
  programs: ProgramItem[];
  classes: ClassItem[];
  subjects: SubjectItem[];
  calendarEvents: CalendarEventItem[];
}

export function PublicAcademicsView({
  programs,
  classes,
  subjects,
  calendarEvents,
}: PublicAcademicsViewProps) {
  const [activeTab, setActiveTab] = useState<"programs" | "subjects" | "calendar" | "pedagogy">("programs");
  const [selectedProgramSlug, setSelectedProgramSlug] = useState<string>(programs[0]?.slug || "");

  // Group classes by program ID
  const classesByProgram = new Map<string, ClassItem[]>();
  classes.forEach((cls) => {
    const pId = cls.program ? String(cls.program) : "unassigned";
    const existing = classesByProgram.get(pId) || [];
    existing.push(cls);
    classesByProgram.set(pId, existing);
  });

  // Group subjects by department
  const subjectsByDept = new Map<string, SubjectItem[]>();
  subjects.forEach((subj) => {
    const dept = subj.department || "General Curriculum";
    const existing = subjectsByDept.get(dept) || [];
    existing.push(subj);
    subjectsByDept.set(dept, existing);
  });

  const activeProgram =
    programs.find((p) => p.slug === selectedProgramSlug) || programs[0];
  const activeProgramClasses = activeProgram
    ? classesByProgram.get(String(activeProgram._id)) || []
    : [];

  const getEventTypeBadge = (type: CalendarEventItem["type"]) => {
    switch (type) {
      case "exam":
        return <Badge className="bg-red-600 hover:bg-red-700 text-white font-semibold">Examination</Badge>;
      case "holiday":
        return <Badge className="bg-amber-600 hover:bg-amber-700 text-white font-semibold">Holiday</Badge>;
      case "meeting":
        return <Badge className="bg-blue-600 hover:bg-blue-700 text-white font-semibold">PTM / Meeting</Badge>;
      case "event":
      default:
        return <Badge className="bg-[#8A0000] hover:bg-[#680000] text-white font-semibold">Event / Activity</Badge>;
    }
  };

  const getDeptIcon = (dept: string) => {
    const lower = dept.toLowerCase();
    if (lower.includes("sci") || lower.includes("bio") || lower.includes("chem") || lower.includes("phy")) {
      return <Atom className="h-5 w-5 text-[#8A0000]" />;
    }
    if (lower.includes("math")) {
      return <Compass className="h-5 w-5 text-[#8A0000]" />;
    }
    if (lower.includes("lang") || lower.includes("eng") || lower.includes("hin")) {
      return <Languages className="h-5 w-5 text-[#8A0000]" />;
    }
    if (lower.includes("tech") || lower.includes("comput") || lower.includes("ai")) {
      return <Cpu className="h-5 w-5 text-[#8A0000]" />;
    }
    if (lower.includes("comm") || lower.includes("econ") || lower.includes("bus")) {
      return <TrendingUp className="h-5 w-5 text-[#8A0000]" />;
    }
    if (lower.includes("phys") || lower.includes("sport")) {
      return <Dumbbell className="h-5 w-5 text-[#8A0000]" />;
    }
    return <BookOpen className="h-5 w-5 text-[#8A0000]" />;
  };

  return (
    <div className="bg-slate-50 min-h-screen">
      {/* 
        HERO SECTION
        Curated Modi World School-Style Hero with rich #8A0000 gradient, gold highlights & stats
      */}
      <section className="relative bg-gradient-to-br from-[#680000] via-[#8A0000] to-[#591036] text-white py-16 md:py-24 overflow-hidden border-b-4 border-[#D4A72C]">
        <div className="absolute inset-0 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:20px_20px] opacity-10 pointer-events-none" />

        <Container className="relative z-10">
          <div className="max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-[#D4A72C] text-xs font-bold uppercase tracking-wider">
              <ShieldCheck className="h-4 w-4" />
              <span>Affiliated to CBSE, New Delhi · Co-Educational</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.15] text-white">
              Academic Excellence & Holistic Learning
            </h1>

            <p className="text-white/90 text-base sm:text-lg leading-relaxed font-normal">
              At Siddharth International School, our curriculum bridges rigorous CBSE board standards with 21st-century experiential pedagogy. From foundational kindergarten to senior secondary career streams, we empower every child to excel academically and lead ethically.
            </p>

            <div className="pt-3 flex flex-wrap gap-4 items-center">
              <Link
                href="/admissions"
                className="inline-flex items-center gap-2 px-7 py-3 rounded-lg bg-[#D4A72C] hover:bg-[#b88f20] text-[#680000] font-bold text-sm shadow-lg hover:shadow-xl transition-all hover:scale-105 active:scale-95"
              >
                <span>Apply for Admission 2026-27</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/mandatory-disclosure"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-white/10 hover:bg-white/20 text-white font-semibold text-sm border border-white/20 backdrop-blur-sm transition-all"
              >
                <FileCheck className="h-4 w-4 text-[#D4A72C]" />
                <span>CBSE Mandatory Disclosure</span>
              </Link>
            </div>
          </div>

          {/* Quick Academic Key Metrics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-12 pt-8 border-t border-white/15">
            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
              <div className="text-2xl sm:text-3xl font-extrabold text-[#D4A72C]">CBSE</div>
              <div className="text-xs text-white/80 font-medium mt-0.5">National Curriculum Framework</div>
            </div>
            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
              <div className="text-2xl sm:text-3xl font-extrabold text-white">Nursery - XII</div>
              <div className="text-xs text-white/80 font-medium mt-0.5">All Academic Stages Offered</div>
            </div>
            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
              <div className="text-2xl sm:text-3xl font-extrabold text-white">1 : 25</div>
              <div className="text-xs text-white/80 font-medium mt-0.5">Optimal Teacher-Student Ratio</div>
            </div>
            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
              <div className="text-2xl sm:text-3xl font-extrabold text-[#D4A72C]">100%</div>
              <div className="text-xs text-white/80 font-medium mt-0.5">Smart Classrooms & STEM Labs</div>
            </div>
          </div>
        </Container>
      </section>

      {/* 
        NAVIGATION TABS BAR
        Allows seamless switching between Programs, Subjects, Calendar, and Pedagogy
      */}
      <section className="sticky top-20 z-40 bg-white border-b border-slate-200 shadow-xs">
        <Container>
          <div className="flex items-center gap-2 sm:gap-4 overflow-x-auto py-3 no-scrollbar">
            <button
              onClick={() => setActiveTab("programs")}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-lg font-bold text-sm whitespace-nowrap transition-all cursor-pointer ${activeTab === "programs"
                ? "bg-[#8A0000] text-white shadow-md shadow-[#8A0000]/20"
                : "bg-slate-100 hover:bg-slate-200 text-slate-700"
                }`}
            >
              <School className="h-4 w-4" />
              <span>Academic Programs & Classes ({programs.length})</span>
            </button>

            <button
              onClick={() => setActiveTab("subjects")}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-lg font-bold text-sm whitespace-nowrap transition-all cursor-pointer ${activeTab === "subjects"
                ? "bg-[#8A0000] text-white shadow-md shadow-[#8A0000]/20"
                : "bg-slate-100 hover:bg-slate-200 text-slate-700"
                }`}
            >
              <BookOpen className="h-4 w-4" />
              <span>Curriculum & Subjects ({subjects.length})</span>
            </button>

            <button
              onClick={() => setActiveTab("calendar")}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-lg font-bold text-sm whitespace-nowrap transition-all cursor-pointer ${activeTab === "calendar"
                ? "bg-[#8A0000] text-white shadow-md shadow-[#8A0000]/20"
                : "bg-slate-100 hover:bg-slate-200 text-slate-700"
                }`}
            >
              <Calendar className="h-4 w-4" />
              <span>Academic Calendar 2026-27 ({calendarEvents.length})</span>
            </button>

            <button
              onClick={() => setActiveTab("pedagogy")}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-lg font-bold text-sm whitespace-nowrap transition-all cursor-pointer ${activeTab === "pedagogy"
                ? "bg-[#8A0000] text-white shadow-md shadow-[#8A0000]/20"
                : "bg-slate-100 hover:bg-slate-200 text-slate-700"
                }`}
            >
              <Sparkles className="h-4 w-4" />
              <span>Pedagogy & Infrastructure</span>
            </button>
          </div>
        </Container>
      </section>

      {/* MAIN CONTENT AREA */}
      <Container className="py-12 md:py-16">
        {/* ========================================================
            TAB 1: ACADEMIC PROGRAMS & DYNAMIC CLASSES
           ======================================================== */}
        {activeTab === "programs" && (
          <div className="space-y-12">
            <div>
              <span className="text-[#8A0000] font-bold text-xs uppercase tracking-wider block mb-1">
                Progressive Academic Journey
              </span>
              <h2 className="text-3xl font-extrabold text-[#252525] tracking-tight">
                Academic Programs & Stage-Wise Wings
              </h2>
              <p className="text-slate-600 text-base max-w-3xl mt-2 leading-relaxed font-normal">
                Our educational structure follows the latest National Education Policy (NEP) stages, systematically guiding students from play-based early foundation to specialized senior secondary board and entrance success.
              </p>
            </div>

            {/* Program Selection Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {programs.map((prog, idx) => {
                const isSelected = prog.slug === activeProgram?.slug;
                const progClasses = classesByProgram.get(String(prog._id)) || [];

                return (
                  <div
                    key={prog._id}
                    onClick={() => setSelectedProgramSlug(prog.slug)}
                    className={`relative rounded-2xl overflow-hidden border-2 transition-all cursor-pointer duration-300 flex flex-col bg-white shadow-sm hover:shadow-xl group ${isSelected
                      ? "border-[#8A0000] ring-4 ring-[#8A0000]/10 shadow-lg"
                      : "border-slate-200 hover:border-[#8A0000]/50"
                      }`}
                  >
                    <div className="aspect-[16/10] relative overflow-hidden bg-slate-900">
                      {prog.image ? (
                        <img
                          src={prog.image}
                          alt={prog.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#8A0000]/20 to-[#680000]/10">
                          <GraduationCap className="h-16 w-16 text-[#8A0000]" />
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                      <div className="absolute top-3 left-3">
                        <span className="bg-[#8A0000] text-white text-[11px] font-bold px-2.5 py-1 rounded-md shadow-md uppercase tracking-wider">
                          Stage {idx + 1}
                        </span>
                      </div>

                      <div className="absolute bottom-3 left-4 right-4 text-white">
                        <h3 className="font-extrabold text-xl leading-tight group-hover:text-[#D4A72C] transition-colors">
                          {prog.name}
                        </h3>
                        <span className="text-xs text-white/80 font-medium">
                          {progClasses.length} Classes Enrolled
                        </span>
                      </div>
                    </div>

                    <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                      <p className="text-slate-600 text-sm leading-relaxed font-normal">
                        {prog.description || "Comprehensive academic development aligned with CBSE curriculum."}
                      </p>

                      <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                        <span className="text-xs font-semibold text-slate-500">
                          Click to view classes & details
                        </span>
                        <ChevronRight className={`h-4 w-4 text-[#8A0000] transition-transform ${isSelected ? "translate-x-1" : ""}`} />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Active Program Spotlight Detail */}
            {activeProgram && (
              <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-md space-y-8">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-200">
                  <div>
                    <span className="text-[#8A0000] font-bold text-xs uppercase tracking-wider block">
                      Active Stage Spotlight
                    </span>
                    <h3 className="text-2xl sm:text-3xl font-extrabold text-[#252525] mt-1">
                      {activeProgram.name}
                    </h3>
                  </div>

                  <Link
                    href="/admissions"
                    className="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg bg-[#8A0000] hover:bg-[#680000] text-white font-bold text-sm shadow-md transition-all self-start md:self-auto"
                  >
                    <span>Enquire for {activeProgram.name}</span>
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>

                <div className="space-y-4">
                  <h4 className="text-base font-bold text-[#252525] flex items-center gap-2">
                    <BookOpen className="h-5 w-5 text-[#8A0000]" />
                    <span>Classes & Sections in this Wing ({activeProgramClasses.length})</span>
                  </h4>

                  {activeProgramClasses.length === 0 ? (
                    <p className="text-slate-500 text-sm">No classes assigned to this program yet.</p>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {activeProgramClasses.map((cls) => (
                        <div
                          key={cls._id}
                          className="bg-slate-50 border border-slate-200/80 rounded-xl p-4.5 hover:border-[#8A0000]/40 transition-colors"
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-extrabold text-base text-[#252525]">
                              {cls.name}
                            </span>
                            {cls.section && (
                              <span className="bg-[#8A0000]/10 text-[#8A0000] text-xs font-bold px-2 py-0.5 rounded">
                                Sec: {cls.section}
                              </span>
                            )}
                          </div>
                          {cls.description && (
                            <p className="text-slate-600 text-xs mt-2 leading-relaxed font-normal">
                              {cls.description}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ========================================================
            TAB 2: CURRICULUM & SUBJECTS OFFERINGS
           ======================================================== */}
        {activeTab === "subjects" && (
          <div className="space-y-10">
            <div>
              <span className="text-[#8A0000] font-bold text-xs uppercase tracking-wider block mb-1">
                CBSE Aligned Offerings
              </span>
              <h2 className="text-3xl font-extrabold text-[#252525] tracking-tight">
                Curriculum Subjects & Specialized Departments
              </h2>
              <p className="text-slate-600 text-base max-w-3xl mt-2 leading-relaxed font-normal">
                Our academic framework combines strong core fundamentals with high-tech coding, AI education, and senior secondary specialization streams in Science, Commerce, and Humanities.
              </p>
            </div>

            {/* Department Groups Grid */}
            <div className="space-y-8">
              {Array.from(subjectsByDept.entries()).map(([department, deptSubjects]) => (
                <div
                  key={department}
                  className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-4"
                >
                  <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
                    <div className="p-2.5 rounded-xl bg-[#8A0000]/10 shrink-0">
                      {getDeptIcon(department)}
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-[#252525]">
                        {department}
                      </h3>
                      <span className="text-xs text-slate-500 font-medium">
                        {deptSubjects.length} Subject Offerings
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
                    {deptSubjects.map((subj) => (
                      <div
                        key={subj._id}
                        className="bg-slate-50 rounded-xl p-4 border border-slate-200/80 hover:bg-slate-100/60 transition-colors"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <span className="font-bold text-sm text-[#252525]">
                            {subj.name}
                          </span>
                          {subj.code && (
                            <span className="font-mono text-[10px] font-bold bg-[#8A0000] text-white px-2 py-0.5 rounded shrink-0">
                              {subj.code}
                            </span>
                          )}
                        </div>
                        {subj.description && (
                          <p className="text-slate-600 text-xs mt-2 leading-relaxed font-normal">
                            {subj.description}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ========================================================
            TAB 3: ACADEMIC CALENDAR & EXAM DATES
           ======================================================== */}
        {activeTab === "calendar" && (
          <div className="space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-[#8A0000] font-bold text-xs uppercase tracking-wider block mb-1">
                  Session 2026 - 2027
                </span>
                <h2 className="text-3xl font-extrabold text-[#252525] tracking-tight">
                  Academic Calendar & Term Schedules
                </h2>
                <p className="text-slate-600 text-base max-w-2xl mt-1 leading-relaxed font-normal">
                  Official timeline for assessments, term examinations, vacations, parent-teacher conferences, and celebrations.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-500 bg-white border border-slate-200 px-3 py-1.5 rounded-lg shadow-xs">
                  {calendarEvents.length} Key Dates Listed
                </span>
              </div>
            </div>

            {/* Calendar Events Timeline List */}
            {calendarEvents.length === 0 ? (
              <div className="bg-white rounded-2xl p-12 text-center border border-slate-200">
                <CalendarDays className="h-12 w-12 text-slate-300 mx-auto mb-3" />
                <h3 className="text-lg font-bold text-slate-700">No Calendar Events Published Yet</h3>
                <p className="text-slate-500 text-xs mt-1">Calendar events added in the admin portal will appear here.</p>
              </div>
            ) : (
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm divide-y divide-slate-100 overflow-hidden">
                {calendarEvents.map((evt, idx) => {
                  const evtDate = new Date(evt.date);
                  const formattedDate = !isNaN(evtDate.getTime())
                    ? evtDate.toLocaleDateString("en-IN", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })
                    : String(evt.date);

                  return (
                    <div
                      key={evt._id}
                      className="p-5 sm:p-6 hover:bg-slate-50/70 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                    >
                      <div className="flex items-start gap-4">
                        {/* Date badge */}
                        <div className="w-14 sm:w-16 h-14 sm:h-16 rounded-xl bg-[#8A0000]/10 text-[#8A0000] border border-[#8A0000]/20 flex flex-col items-center justify-center shrink-0">
                          <span className="text-xs font-bold uppercase tracking-wider">
                            {!isNaN(evtDate.getTime())
                              ? evtDate.toLocaleString("en-IN", { month: "short" })
                              : "Date"}
                          </span>
                          <span className="text-lg sm:text-xl font-extrabold leading-none mt-0.5">
                            {!isNaN(evtDate.getTime()) ? evtDate.getDate() : idx + 1}
                          </span>
                        </div>

                        {/* Title & Description */}
                        <div>
                          <div className="flex items-center gap-2.5 flex-wrap">
                            <h3 className="text-base sm:text-lg font-bold text-[#252525]">
                              {evt.title}
                            </h3>
                            {getEventTypeBadge(evt.type)}
                          </div>
                          {evt.description && (
                            <p className="text-slate-600 text-xs sm:text-sm mt-1 leading-relaxed font-normal">
                              {evt.description}
                            </p>
                          )}
                          <div className="flex items-center gap-4 text-slate-400 text-xs mt-2 font-medium">
                            <span className="flex items-center gap-1">
                              <Calendar className="h-3.5 w-3.5" />
                              {formattedDate}
                            </span>
                            <span className="font-semibold text-slate-500">
                              Session: {evt.session}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* ========================================================
            TAB 4: PEDAGOGY & INFRASTRUCTURE
           ======================================================== */}
        {activeTab === "pedagogy" && (
          <div className="space-y-10">
            <div>
              <span className="text-[#8A0000] font-bold text-xs uppercase tracking-wider block mb-1">
                Teaching & Infrastructure
              </span>
              <h2 className="text-3xl font-extrabold text-[#252525] tracking-tight">
                Pedagogy, Laboratories & Academic Facilities
              </h2>
              <p className="text-slate-600 text-base max-w-3xl mt-2 leading-relaxed font-normal">
                Academic success requires not just textbooks, but modern scientific infrastructure, dedicated mentors, and an atmosphere that encourages active exploration.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Feature 1 */}
              <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-4">
                <div className="w-12 h-12 rounded-xl bg-[#8A0000]/10 text-[#8A0000] flex items-center justify-center">
                  <Atom className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold text-[#252525]">
                  Modern Science Laboratories
                </h3>
                <p className="text-slate-600 text-sm leading-relaxed font-normal">
                  Well-equipped Physics, Chemistry, and Biology laboratories provide students with safe, hands-on environments to perform CBSE prescribed experiments and explore scientific theories firsthand.
                </p>
                <ul className="space-y-2 text-xs text-slate-700 pt-2 border-t border-slate-100 font-medium">
                  <li className="flex items-center gap-2"><Check className="h-4 w-4 text-[#8A0000]" /> Dedicated apparatus for senior secondary board practicals</li>
                  <li className="flex items-center gap-2"><Check className="h-4 w-4 text-[#8A0000]" /> Safety equipment, fire extinguishers, and first-aid protocols</li>
                  <li className="flex items-center gap-2"><Check className="h-4 w-4 text-[#8A0000]" /> Supervised by qualified lab demonstrators & teachers</li>
                </ul>
              </div>

              {/* Feature 2 */}
              <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-4">
                <div className="w-12 h-12 rounded-xl bg-[#8A0000]/10 text-[#8A0000] flex items-center justify-center">
                  <Cpu className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold text-[#252525]">
                  Advanced Computer & AI Lab
                </h3>
                <p className="text-slate-600 text-sm leading-relaxed font-normal">
                  High-speed networked computer labs equipped with modern PCs and broadband internet. Students learn coding in Python, web development, cybersecurity, and artificial intelligence basics.
                </p>
                <ul className="space-y-2 text-xs text-slate-700 pt-2 border-t border-slate-100 font-medium">
                  <li className="flex items-center gap-2"><Check className="h-4 w-4 text-[#8A0000]" /> 1:1 student-to-computer ratio during lab sessions</li>
                  <li className="flex items-center gap-2"><Check className="h-4 w-4 text-[#8A0000]" /> Licensed educational software & programming IDEs</li>
                  <li className="flex items-center gap-2"><Check className="h-4 w-4 text-[#8A0000]" /> Content filtering & safe internet browsing protocols</li>
                </ul>
              </div>

              {/* Feature 3 */}
              <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-4">
                <div className="w-12 h-12 rounded-xl bg-[#8A0000]/10 text-[#8A0000] flex items-center justify-center">
                  <BookOpen className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold text-[#252525]">
                  Comprehensive Library & Resource Center
                </h3>
                <p className="text-slate-600 text-sm leading-relaxed font-normal">
                  Our library houses thousands of titles across literature, reference encyclopedias, national journals, competitive exam manuals, and multilingual readers to cultivate lifelong reading habits.
                </p>
                <ul className="space-y-2 text-xs text-slate-700 pt-2 border-t border-slate-100 font-medium">
                  <li className="flex items-center gap-2"><Check className="h-4 w-4 text-[#8A0000]" /> Rich collection of CBSE NCERT textbooks & reference guides</li>
                  <li className="flex items-center gap-2"><Check className="h-4 w-4 text-[#8A0000]" /> Quiet reading zones & periodicals section</li>
                  <li className="flex items-center gap-2"><Check className="h-4 w-4 text-[#8A0000]" /> Digital book lending & reading club activities</li>
                </ul>
              </div>

              {/* Feature 4 */}
              <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-4">
                <div className="w-12 h-12 rounded-xl bg-[#8A0000]/10 text-[#8A0000] flex items-center justify-center">
                  <Award className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold text-[#252525]">
                  Continuous Assessment & Remedial Care
                </h3>
                <p className="text-slate-600 text-sm leading-relaxed font-normal">
                  Through Periodic Assessments and holistic feedback, our educators identify each learner's unique strengths and provide special after-school remedial sessions to clear doubts without exam anxiety.
                </p>
                <ul className="space-y-2 text-xs text-slate-700 pt-2 border-t border-slate-100 font-medium">
                  <li className="flex items-center gap-2"><Check className="h-4 w-4 text-[#8A0000]" /> Regular parent-teacher meetings & individual counseling</li>
                  <li className="flex items-center gap-2"><Check className="h-4 w-4 text-[#8A0000]" /> Personalized remedial classes for core subjects</li>
                  <li className="flex items-center gap-2"><Check className="h-4 w-4 text-[#8A0000]" /> Entrance exam mentorship for JEE / NEET / CUET aspirants</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* 
          BOTTOM ADMISSION CALLOUT BANNER
        */}
        <div className="mt-16 bg-gradient-to-r from-[#680000] to-[#8A0000] rounded-3xl p-8 sm:p-12 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-8 border-2 border-[#D4A72C]/40">
          <div className="space-y-2 max-w-2xl text-center md:text-left">
            <span className="text-[#D4A72C] font-bold text-xs uppercase tracking-wider block">
              Admission Open 2026 - 2027
            </span>
            <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Ready to Join the Siddharth Family?
            </h3>
            <p className="text-white/85 text-sm sm:text-base leading-relaxed font-normal">
              Admissions are open for Pre-Primary to Class XII for the upcoming academic session. Experience world-class CBSE education in Nangal, Udaipurwati.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3.5 shrink-0 w-full sm:w-auto">
            <Link
              href="/admissions"
              className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl bg-[#D4A72C] hover:bg-[#b88f20] text-[#680000] font-bold text-sm shadow-lg hover:shadow-xl transition-all"
            >
              <span>Apply Online</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-sm border border-white/20 backdrop-blur-sm transition-all"
            >
              <span>Contact School</span>
            </Link>
          </div>
        </div>
      </Container>
    </div>
  );
}
