import { Container } from "@/components/layout/container";
import { SectionWrapper } from "@/components/layout/section-wrapper";
import type { HomepageSectionInput } from "@/lib/validations/homepage";
import {
  ChevronDown,
  CheckCircle2,
  ArrowRight,
  FlaskConical,
  Laptop,
  MonitorPlay,
  Bus,
  ShieldCheck,
  Trophy,
  Droplets,
  BookOpen,
  Star,
  Sparkles,
  Phone,
  Mail,
  GraduationCap,
  Building,
  HeartHandshake,
} from "lucide-react";
import Link from "next/link";
import { HeroBannerSlider } from "./hero-banner-slider";
import { NewsSectionSlider } from "./news-section-slider";
import { TestimonialsSlider } from "./testimonials-slider";

interface HomepageRendererProps {
  sections: HomepageSectionInput[];
  latestNews?: any[];
}

export function HomepageRenderer({ sections, latestNews }: HomepageRendererProps) {
  const enabledSections = sections.filter((s) => s.isEnabled).sort((a, b) => a.order - b.order);

  return (
    <>
      {enabledSections.map((section, index) => (
        <HomepageSection key={section._id ?? index} section={section} latestNews={latestNews} />
      ))}
    </>
  );
}

function HomepageSection({
  section,
  latestNews,
}: {
  section: HomepageSectionInput;
  latestNews?: any[];
}) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const content = (section.content || {}) as Record<string, any>;

  switch (section.type) {
    case "hero":
      return <HeroBannerSlider content={content} />;

    case "news":
      return (
        <NewsSectionSlider
          title={section.title || "Latest News & Happenings"}
          subtitle={(content.subtitle as string) || "Stay updated with announcements, events, and achievements at Siddharth International School."}
          content={content}
          latestNews={latestNews}
        />
      );

    case "announcement":
      return (
        <div className="bg-[#680000] text-white py-3 border-b border-[#D4A72C]/30">
          <Container className="text-center text-xs md:text-sm font-semibold tracking-wide flex items-center justify-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-[#D4A72C] animate-pulse" />
            <span>{content.text as string}</span>
          </Container>
        </div>
      );

    case "introduction":
      return (
        <section className="py-16 md:py-24 bg-white border-b border-slate-100">
          <Container>
            <div className="max-w-4xl mx-auto text-center px-4">
              {content.subtitle && (
                <span className="inline-block text-[#A30000] font-bold text-xs md:text-sm tracking-widest uppercase mb-3 bg-[#A30000]/5 px-3.5 py-1 rounded-full border border-[#A30000]/15">
                  {content.subtitle as string}
                </span>
              )}
              {section.title && (
                <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-[#680000] tracking-tight mb-5 leading-tight">
                  {section.title}
                </h2>
              )}
              {content.description && (
                <p className="text-slate-700 text-sm sm:text-base md:text-lg leading-relaxed max-w-3xl mx-auto font-normal">
                  {content.description as string}
                </p>
              )}
              <div className="w-20 h-1 bg-[#D4A72C] mx-auto mt-6 rounded-full" />
            </div>
          </Container>
        </section>
      );

    // Modi World School Section 2: Academics / 4 Developmental Stages
    case "vision":
    case "academics": {
      const items = (Array.isArray(content.items) ? content.items : []) as {
        title: string;
        tag?: string;
        description?: string;
        image?: string;
      }[];

      const defaultStages = [
        {
          title: "Foundation Stage",
          tag: "Class Nursery to II (Ages 3 to 8 Years)",
          description: "Jolly Kids Early Childhood Division. Play-based, joyful, and experiential pedagogy focused on phonics, numeracy, and sensory development.",
          image: "/uploads/events/sports-day-races.jpg",
          link: "/curriculum",
        },
        {
          title: "Preparatory Stage",
          tag: "Class III to V (Ages 8 to 11 Years)",
          description: "CBSE - NCERT Curriculum. Conceptual foundations in Mathematics, Science, and Languages (English/Hindi). Sports & Arts Integration.",
          image: "/uploads/campus/morning-assembly-ground.jpg",
          link: "/curriculum",
        },
        {
          title: "Middle Stage",
          tag: "Class VI to VIII (Ages 11 to 14 Years)",
          description: "CBSE - NCERT Curriculum. Science laboratory experiments, computer coding & digital literacy, athletics training, and ethical leadership.",
          image: "/uploads/campus/siddharth-academic-block.jpg",
          link: "/curriculum",
        },
        {
          title: "Secondary Stage",
          tag: "Class IX to XII (Ages 14 to 18 Years)",
          description: "CBSE - NCERT Curriculum. Rigorous board examination excellence, specialized Science & Commerce streams, and career mentoring.",
          image: "/uploads/campus/siddharth-campus-main.jpg",
          link: "/curriculum",
        },
      ];

      const stagesToRender = items.length >= 4 ? items.slice(0, 4) : defaultStages;

      return (
        <section className="py-16 md:py-24 bg-[#faf8f5] border-b border-slate-200/60">
          <Container>
            {/* Modi World School Style Header */}
            <div className="max-w-4xl mx-auto text-center mb-12 md:mb-16">
              <span className="inline-block text-[#D4A72C] font-extrabold text-xs md:text-sm tracking-widest uppercase mb-2">
                ACADEMICS
              </span>
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold text-[#680000] tracking-tight mb-3">
                {section.title || "Four Developmental Stages"}
              </h2>
              {content.description && (
                <p className="text-slate-600 text-sm sm:text-base md:text-lg max-w-2xl mx-auto font-normal">
                  {content.description as string}
                </p>
              )}
              <div className="w-16 h-1 bg-[#D4A72C] mx-auto mt-4 rounded-full" />
            </div>

            {/* 4-Stage Cards Grid (Modi World School Section 2 exact layout) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-7 max-w-7xl mx-auto">
              {stagesToRender.map((stage, idx) => {
                const img =
                  stage.image ||
                  defaultStages[idx]?.image ||
                  "/uploads/campus/siddharth-campus-main.jpg";

                return (
                  <div
                    key={idx}
                    className="group bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between hover:-translate-y-1.5"
                  >
                    <div>
                      {/* Top Image */}
                      <div className="relative aspect-[16/11] w-full overflow-hidden bg-slate-100">
                        <img
                          src={img}
                          alt={stage.title}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                        <span className="absolute bottom-3 left-3 bg-[#680000]/90 text-white font-bold text-[10px] uppercase tracking-wider px-2.5 py-1 rounded-md backdrop-blur-xs">
                          Stage {idx + 1}
                        </span>
                      </div>

                      {/* Content */}
                      <div className="p-5 sm:p-6">
                        <h3 className="text-lg sm:text-xl font-bold text-[#680000] group-hover:text-[#A30000] transition-colors mb-1.5">
                          {stage.title}
                        </h3>
                        {stage.tag && (
                          <p className="text-xs font-semibold text-[#D4A72C] uppercase tracking-wide mb-3">
                            {stage.tag}
                          </p>
                        )}
                        {stage.description && (
                          <p className="text-slate-600 text-xs sm:text-sm leading-relaxed font-normal">
                            {stage.description}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Bottom CTA */}
                    <div className="px-5 sm:px-6 pb-5 pt-2 border-t border-slate-100">
                      <Link
                        href="/curriculum"
                        className="inline-flex items-center gap-1.5 text-xs font-bold text-[#680000] group-hover:text-[#A30000] group-hover:gap-2.5 transition-all"
                      >
                        <span>Learn More</span>
                        <ArrowRight className="h-3.5 w-3.5 text-[#D4A72C]" />
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          </Container>
        </section>
      );
    }

    // Modi World School Section 3: Why School / "One Campus, Multiple Opportunities"
    case "why-choose-us": {
      const opportunityPoints = [
        "Best Schooling In Udaipurwati & Shekhawati Region",
        "Plethora of subject options from Pre-Primary to Grade XII",
        "Specialised sports coaching in addition to regular CBSE Board and yearly exams",
        "Best CBSE School In Udaipurwati in Academic Excellence",
        "High-tech Science Laboratories, Computer Hub & Smart Classrooms",
        "Govt-Certified Safe Drinking Water & Modern Sanitary Facilities (CBMO Approved)",
        "Safe & Secure Campus with 24/7 CCTV Surveillance & GPS-Tracked Bus Fleet",
      ];

      return (
        <section className="py-16 md:py-24 bg-white border-b border-slate-200/60">
          <Container>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center max-w-7xl mx-auto">
              {/* Left Column: Why Siddharth International School */}
              <div className="lg:col-span-5 space-y-5">
                <div>
                  <span className="inline-block text-[#A30000] font-bold text-xs tracking-widest uppercase mb-2">
                    WHY SIDDHARTH INTERNATIONAL SCHOOL
                  </span>
                  <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#680000] tracking-tight leading-tight">
                    A Legacy of Academic Discipline, Values & Innovation
                  </h2>
                  <div className="w-16 h-1 bg-[#D4A72C] mt-3 rounded-full" />
                </div>

                <div className="space-y-4 text-slate-700 text-sm sm:text-base leading-relaxed font-normal">
                  <p>
                    Siddharth International School, Nangal, Udaipurwati is run by <strong>Shree Shyam Shiksha Samiti</strong> (Reg. 68/झूं/11-12). It is not only one of the leading CBSE schools in the Shekhawati region, but our noble motive of imparting affordable and high-calibre English-medium education sets a benchmark in Rajasthan.
                  </p>
                  <p>
                    A trusted institution for parents across Jhunjhunu and Sikar districts, Siddharth International School provides an idyllic and capacious campus for the holistic growth of every child.
                  </p>
                </div>

                <div className="pt-2">
                  <Link
                    href="/about"
                    className="inline-flex items-center gap-2 bg-[#8A0000] hover:bg-[#680000] text-white font-bold text-sm px-7 py-3.5 rounded-lg shadow-md hover:shadow-lg transition-all border border-[#D4A72C]/30"
                  >
                    <span>About Us</span>
                    <ArrowRight className="h-4 w-4 text-[#D4A72C]" />
                  </Link>
                </div>
              </div>

              {/* Right Column: One Campus Multiple Opportunities Checklist */}
              <div className="lg:col-span-7 bg-[#faf8f5] rounded-3xl p-6 sm:p-9 border border-slate-200 shadow-sm">
                <div className="mb-6">
                  <span className="inline-block text-[#D4A72C] font-extrabold text-xs tracking-widest uppercase mb-1">
                    CAMPUS ADVANTAGE
                  </span>
                  <h3 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-[#680000]">
                    One Campus, Multiple Opportunities
                  </h3>
                </div>

                <ul className="space-y-4">
                  {opportunityPoints.map((point, i) => (
                    <li key={i} className="flex items-start gap-3 group">
                      <div className="shrink-0 mt-0.5 w-6 h-6 rounded-full bg-[#8A0000]/10 flex items-center justify-center text-[#8A0000] group-hover:bg-[#8A0000] group-hover:text-white transition-colors">
                        <CheckCircle2 className="h-4 w-4 text-[#D4A72C]" />
                      </div>
                      <span className="text-slate-800 text-sm sm:text-base font-medium leading-snug">
                        {point}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </Container>
        </section>
      );
    }

    // Modi World School Section 4: Amenities (Campus Facilities)
    case "facilities":
    case "amenities": {
      const amenitiesList = [
        {
          title: "Science Labs",
          desc: "Fully outfitted Physics, Chemistry, and Biology laboratories with state-of-the-art apparatus and safety equipment.",
          icon: FlaskConical,
        },
        {
          title: "Computer & IT Lab",
          desc: "High-speed internet, modern computer terminals, and coding curricula to build 21st-century digital competencies.",
          icon: Laptop,
        },
        {
          title: "Digital Classrooms",
          desc: "Spacious, well-ventilated, smart-board equipped classrooms creating interactive and joyful learning experiences.",
          icon: MonitorPlay,
        },
        {
          title: "Safe Transport",
          desc: "Extensive fleet of GPS-tracked school buses covering Nangal, Udaipurwati, Chirana, Todpura, and neighboring villages.",
          icon: Bus,
        },
        {
          title: "24/7 Security & CCTV",
          desc: "Round-the-clock gated campus security and high-definition CCTV surveillance across all corridors and playgrounds.",
          icon: ShieldCheck,
        },
        {
          title: "Sports Complex",
          desc: "Spacious grounds for cricket, athletics, sack race, obstacle courses, volleyball, badminton, and daily yoga.",
          icon: Trophy,
        },
        {
          title: "Safe Drinking Water & Sanitation",
          desc: "Certified safe drinking water and modern hygienic washrooms inspected & approved by Rajasthan Health Department.",
          icon: Droplets,
        },
        {
          title: "Library & Resource Hub",
          desc: "Thousands of reference books, educational journals, encyclopedia, and quiet reading zones nurturing young scholars.",
          icon: BookOpen,
        },
      ];

      return (
        <section className="py-16 md:py-24 bg-white border-b border-slate-200/60">
          <Container>
            {/* Header */}
            <div className="max-w-4xl mx-auto text-center mb-12 md:mb-16">
              <span className="inline-block text-[#D4A72C] font-extrabold text-xs md:text-sm tracking-widest uppercase mb-2">
                FACILITIES
              </span>
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold text-[#680000] tracking-tight mb-3">
                Amenities
              </h2>
              <p className="text-slate-600 text-sm sm:text-base md:text-lg max-w-2xl mx-auto font-normal">
                World-class infrastructure designed to foster intellectual curiosity, physical fitness, and student well-being.
              </p>
              <div className="w-16 h-1 bg-[#D4A72C] mx-auto mt-4 rounded-full" />
            </div>

            {/* 8 Amenities Grid (Modi World School Section 4 exact layout) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
              {amenitiesList.map((item, idx) => {
                const IconComponent = item.icon;
                return (
                  <div
                    key={idx}
                    className="p-6 rounded-2xl bg-[#faf8f5] border border-slate-200/80 hover:border-[#D4A72C] hover:bg-white shadow-xs hover:shadow-lg transition-all duration-300 flex flex-col justify-between group hover:-translate-y-1"
                  >
                    <div>
                      <div className="w-12 h-12 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-[#8A0000] mb-4 shadow-2xs group-hover:bg-[#8A0000] group-hover:text-white transition-colors">
                        <IconComponent className="h-6 w-6 text-[#D4A72C] group-hover:text-white transition-colors" />
                      </div>
                      <h3 className="font-bold text-lg text-[#680000] mb-2 leading-snug">
                        {item.title}
                      </h3>
                      <p className="text-slate-600 text-xs sm:text-sm leading-relaxed font-normal">
                        {item.desc}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </Container>
        </section>
      );
    }

    // Modi World School Section 6: "School You Would Want To Be In" (Sports & Campus Life Showcase)
    case "school-life":
    case "campus-life":
    case "student-development": {
      const activities = [
        { title: "CRICKET", image: "/uploads/campus/siddharth-campus-main.jpg" },
        { title: "ATHLETICS & SACK RACE", image: "/uploads/events/sports-day-races.jpg" },
        { title: "PATRIOTIC CELEBRATIONS", image: "/uploads/events/national-flag-celebration.jpg" },
        { title: "MORNING ASSEMBLY & YOGA", image: "/uploads/campus/morning-assembly-ground.jpg" },
        { title: "SPORTS HOUSE CHAMPIONS", image: "/uploads/events/national-flag-celebration.jpg" },
        { title: "SMART LABS & CODING", image: "/uploads/campus/siddharth-academic-block.jpg" },
        { title: "SPECTRA ANNUAL SPORTS", image: "/uploads/events/sports-day-races.jpg" },
        { title: "LEADERSHIP & FELICITATIONS", image: "/uploads/leadership/principal-and-director.jpg" },
      ];

      return (
        <section className="py-16 md:py-24 bg-[#faf8f5] border-b border-slate-200/60">
          <Container>
            {/* Header */}
            <div className="max-w-4xl mx-auto text-center mb-12 md:mb-16">
              <span className="inline-block text-[#D4A72C] font-extrabold text-xs md:text-sm tracking-widest uppercase mb-2">
                CAMPUS VIBES & SPORTS
              </span>
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold text-[#680000] tracking-tight mb-3">
                School You Would Want To Be In
              </h2>
              <p className="text-slate-600 text-sm sm:text-base md:text-lg max-w-2xl mx-auto font-normal">
                From high-spirited athletics and national day formations to morning prayer assemblies and science discovery.
              </p>
              <div className="w-16 h-1 bg-[#D4A72C] mx-auto mt-4 rounded-full" />
            </div>

            {/* 4-Column Activity Gallery Grid (Modi World School Section 6 exact layout) */}
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 max-w-7xl mx-auto">
              {activities.map((act, i) => (
                <div
                  key={i}
                  className="group relative rounded-2xl overflow-hidden aspect-[4/3] bg-slate-200 shadow-sm hover:shadow-xl transition-all duration-300"
                >
                  <img
                    src={act.image}
                    alt={act.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent" />
                  <div className="absolute bottom-0 inset-x-0 p-3 sm:p-4 text-center">
                    <span className="font-extrabold text-white text-xs sm:text-sm md:text-base tracking-wider uppercase drop-shadow-md group-hover:text-[#D4A72C] transition-colors">
                      {act.title}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <div className="text-center mt-10">
              <Link
                href="/gallery"
                className="inline-flex items-center gap-2 bg-[#8A0000] hover:bg-[#680000] text-white font-bold text-sm px-8 py-3.5 rounded-lg shadow-md hover:shadow-lg transition-all border border-[#D4A72C]/30"
              >
                <span>View Full Photo & Video Gallery</span>
                <ArrowRight className="h-4 w-4 text-[#D4A72C]" />
              </Link>
            </div>
          </Container>
        </section>
      );
    }

    // Leadership Desk (Chairman, Director, Principal)
    case "chairman-message":
    case "director-message":
    case "principal-message": {
      const designationText =
        (content.designation as string) ||
        (section.type === "director-message"
          ? "DIRECTOR, SIDDHARTH INTERNATIONAL SCHOOL"
          : section.type === "chairman-message"
            ? "CHAIRMAN, SIDDHARTH INTERNATIONAL SCHOOL"
            : "PRINCIPAL, SIDDHARTH INTERNATIONAL SCHOOL");

      const defaultLeaderImage =
        section.type === "director-message"
          ? "/uploads/leadership/director-welcome-safa.jpg"
          : section.type === "principal-message"
            ? "/uploads/leadership/principal-and-director.jpg"
            : "/uploads/campus/siddharth-campus-main.jpg";

      const leaderImage = (content.image as string) || defaultLeaderImage;

      const rawDescription = typeof content.description === "string" ? content.description : "";
      const paragraphs = rawDescription.split(/\n\s*\n/).filter(Boolean);

      return (
        <section
          id={section.type}
          className="py-16 md:py-24 bg-white border-b border-slate-200/60 scroll-mt-20"
        >
          <Container>
            {/* Header */}
            <div className="max-w-4xl mx-auto text-center mb-12 md:mb-16">
              <span className="inline-block text-[#D4A72C] font-extrabold text-xs md:text-sm tracking-widest uppercase mb-2">
                LEADERSHIP DESK
              </span>
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold text-[#680000] tracking-tight mb-3">
                {section.title || "Message from the Desk"}
              </h2>
              {content.subtitle && (
                <p className="text-slate-600 text-sm sm:text-base md:text-lg max-w-3xl mx-auto font-normal">
                  {content.subtitle as string}
                </p>
              )}
              <div className="w-16 h-1 bg-[#D4A72C] mx-auto mt-4 rounded-full" />
            </div>

            {/* 2-Column Leader Showcase */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center max-w-6xl mx-auto">
              {/* Leader Photo */}
              <div className="lg:col-span-5 flex justify-center">
                <div className="relative w-full max-w-[360px] aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl border-4 border-white bg-slate-100 group ring-1 ring-slate-200">
                  <img
                    src={leaderImage}
                    alt={content.name ? String(content.name) : "Leadership"}
                    className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </div>

              {/* Leader Message Text */}
              <div className="lg:col-span-7 space-y-4">
                <span className="inline-block text-[#A30000] font-bold text-xs tracking-widest uppercase bg-[#A30000]/5 px-3 py-1 rounded-md border border-[#A30000]/20">
                  {designationText}
                </span>
                {content.name && (
                  <h3 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#680000] tracking-tight">
                    {content.name as string}
                  </h3>
                )}

                <div className="space-y-4 text-slate-700 text-sm sm:text-base leading-relaxed font-normal pt-2">
                  {paragraphs.length > 0 ? (
                    paragraphs.map((p, idx) => (
                      <p key={idx} className="leading-relaxed">
                        {p}
                      </p>
                    ))
                  ) : rawDescription ? (
                    <p className="whitespace-pre-line leading-relaxed">{rawDescription}</p>
                  ) : null}
                </div>
              </div>
            </div>
          </Container>
        </section>
      );
    }

    // Modi World School Section 5: Testimonials Slider / Grid
    case "testimonials":
      return (
        <TestimonialsSlider
          title={section.title || "Testimonials"}
          subtitle={(content.subtitle as string) || "What parents and representatives share about our school"}
          content={content}
        />
      );

    // Modi World School Section 8: Regional Overview Banner ("Best CBSE School In Rajasthan")
    case "regional-overview":
    case "about-banner":
      return (
        <section className="py-16 md:py-24 bg-[#faf8f5] border-b border-slate-200/60">
          <Container>
            <div className="max-w-5xl mx-auto text-center px-4">
              <span className="inline-block text-[#D4A72C] font-extrabold text-xs md:text-sm tracking-widest uppercase mb-2">
                EXCELLENCE IN SHEKHAWATI
              </span>
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold text-[#680000] tracking-tight mb-5 leading-tight">
                {section.title || "Best CBSE School In Udaipurwati, Rajasthan"}
              </h2>
              <div className="w-16 h-1 bg-[#D4A72C] mx-auto mb-6 rounded-full" />
              <p className="text-slate-700 text-sm sm:text-base md:text-lg leading-relaxed max-w-3xl mx-auto font-normal mb-8">
                {content.description ||
                  "Siddharth International School is a flagship co-educational English-medium institution managed by Shree Shyam Shiksha Samiti. Sprawling on Sikar Road, Nangal, Udaipurwati, the campus is idyllic and capacious for the holistic growth of every child. Its serene location, experienced faculty, and secure environment make it the foremost choice for parents across Rajasthan."}
              </p>

              <div className="flex flex-wrap items-center justify-center gap-4">
                <Link
                  href="/admissions"
                  className="bg-[#8A0000] hover:bg-[#680000] text-white font-bold text-sm px-8 py-3.5 rounded-lg shadow-md hover:shadow-lg transition-all border border-[#D4A72C]/30"
                >
                  Apply for Admission
                </Link>
                <Link
                  href="/mandatory-disclosure"
                  className="bg-white hover:bg-slate-50 text-[#680000] font-bold text-sm px-8 py-3.5 rounded-lg border border-slate-300 shadow-xs hover:shadow-md transition-all"
                >
                  Mandatory Disclosure
                </Link>
              </div>
            </div>
          </Container>
        </section>
      );

    // Statistics Bar
    case "statistics":
      return (
        <section className="py-14 md:py-20 bg-[#680000] text-white border-y border-[#D4A72C]/30 relative overflow-hidden">
          <Container className="relative z-10">
            {section.title && (
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-center mb-10 tracking-tight text-white">
                {section.title}
              </h2>
            )}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center max-w-5xl mx-auto">
              {Array.isArray(content.items) &&
                (content.items as { value: string; label: string }[]).map((item, i) => (
                  <div key={i} className="p-3">
                    <p className="text-4xl md:text-5xl font-black text-[#D4A72C] tracking-tight">
                      {item.value}
                    </p>
                    <p className="text-xs sm:text-sm text-white/90 uppercase tracking-wider font-semibold mt-2">
                      {item.label}
                    </p>
                  </div>
                ))}
            </div>
          </Container>
        </section>
      );

    // Modi World School Footer CTA: "An Exclusive After School / Admissions Open"
    case "cta":
    case "contact-cta": {
      const bgImage =
        (content.image as string) ||
        (content.backgroundImage as string) ||
        "/uploads/campus/morning-assembly-ground.jpg";

      return (
        <section className="relative py-20 md:py-28 overflow-hidden bg-[#680000] text-white">
          {/* Background Image with Dark Red Overlay */}
          <div className="absolute inset-0 z-0">
            <img
              src={bgImage}
              alt={section.title || "Admissions"}
              className="w-full h-full object-cover object-center"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#680000]/95 via-[#8A0000]/90 to-[#680000]/95" />
          </div>

          <Container className="relative z-10 text-center">
            <div className="max-w-4xl mx-auto space-y-6">
              <span className="inline-block text-[#D4A72C] font-extrabold text-xs md:text-sm tracking-widest uppercase bg-black/30 px-4 py-1.5 rounded-full border border-[#D4A72C]/40">
                ADMISSIONS OPEN · SESSION 2026–27
              </span>

              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black tracking-tight text-white leading-tight drop-shadow-md">
                {section.title || "Admissions Open for Academic Session 2026–27"}
              </h2>

              <p className="text-white/90 text-sm sm:text-base md:text-lg leading-relaxed max-w-2xl mx-auto font-normal drop-shadow-sm">
                {content.description ||
                  "Siddharth International School, Nangal, Udaipurwati, Pre-Primary to Class XII. Through a rich learning experience which enriches every child academically, physically, and morally, we cultivate the leaders of tomorrow."}
              </p>

              {/* Phone & Email direct contact bar */}
              <div className="flex flex-wrap items-center justify-center gap-6 pt-2 text-sm font-semibold">
                <a
                  href="tel:+917568419751"
                  className="flex items-center gap-2 hover:text-[#D4A72C] transition-colors"
                >
                  <Phone className="h-4 w-4 text-[#D4A72C]" />
                  <span>+91 7568419751</span>
                </a>
                <span className="hidden sm:inline text-white/40">|</span>
                <a
                  href="mailto:siddharthinternationalschool15@gmail.com"
                  className="flex items-center gap-2 hover:text-[#D4A72C] transition-colors"
                >
                  <Mail className="h-4 w-4 text-[#D4A72C]" />
                  <span>siddharthinternationalschool15@gmail.com</span>
                </a>
              </div>

              <div className="pt-4">
                <Link
                  href={(content.buttonUrl as string) || "/admissions"}
                  className="inline-block bg-[#D4A72C] hover:bg-[#b88f20] text-[#680000] font-black text-sm sm:text-base px-9 py-4 rounded-xl shadow-xl hover:shadow-2xl hover:-translate-y-0.5 transition-all tracking-wide"
                >
                  {(content.buttonText as string) || "Apply for Admission"}
                </Link>
              </div>
            </div>
          </Container>
        </section>
      );
    }

    // FAQ Accordion
    case "faq": {
      const items = Array.isArray(content.items)
        ? (content.items as { question: string; answer: string }[])
        : [];

      return (
        <section className="py-16 md:py-24 bg-[#faf8f5] border-b border-slate-200/60">
          <Container>
            {/* Header */}
            <div className="max-w-4xl mx-auto text-center mb-12 md:mb-16">
              <span className="inline-block text-[#D4A72C] font-extrabold text-xs md:text-sm tracking-widest uppercase mb-2">
                FREQUENTLY ASKED
              </span>
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold text-[#680000] tracking-tight mb-3">
                {section.title || "Frequently Asked Questions"}
              </h2>
              {content.description && (
                <p className="text-slate-600 text-sm sm:text-base md:text-lg max-w-2xl mx-auto font-normal">
                  {content.description as string}
                </p>
              )}
              <div className="w-16 h-1 bg-[#D4A72C] mx-auto mt-4 rounded-full" />
            </div>

            {/* Accordion FAQ Cards */}
            <div className="max-w-4xl mx-auto space-y-3.5">
              {items.map((item, i) => (
                <details
                  key={i}
                  className="group rounded-2xl border border-slate-200/90 bg-white shadow-xs hover:border-[#D4A72C]/60 transition-all overflow-hidden [&_summary::-webkit-details-marker]:hidden"
                >
                  <summary className="flex items-center justify-between p-5 sm:p-6 font-bold text-sm sm:text-base text-[#680000] cursor-pointer select-none">
                    <span>{item.question}</span>
                    <span className="shrink-0 ml-4 text-[#A30000] transition-transform duration-300 group-open:rotate-180">
                      <ChevronDown className="w-5 h-5" />
                    </span>
                  </summary>
                  <div className="px-5 sm:px-6 pb-6 pt-1 text-slate-700 text-xs sm:text-sm leading-relaxed border-t border-slate-100 font-normal">
                    {item.answer}
                  </div>
                </details>
              ))}
            </div>
          </Container>
        </section>
      );
    }

    default:
      return null;
  }
}
