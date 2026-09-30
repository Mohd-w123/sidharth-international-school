import { Container } from "@/components/layout/container";
import { SectionWrapper } from "@/components/layout/section-wrapper";
import type { HomepageSectionInput } from "@/lib/validations/homepage";
import {
  ChevronDown,
  CheckCircle2,
  Check,
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
  Play,
} from "lucide-react";
import Link from "next/link";
import { HeroBannerSlider } from "./hero-banner-slider";
import { NewsSectionSlider } from "./news-section-slider";
import { TestimonialsSlider } from "./testimonials-slider";
import { RegionalVideoCard } from "./regional-video-card";

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
        <div className="bg-[#851e51] text-white py-3 border-b border-[#D4A72C]/30">
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
                <span className="inline-block text-[#00306E] font-semibold text-xs md:text-sm tracking-widest uppercase mb-3">
                  {content.subtitle as string}
                </span>
              )}
              {section.title && (
                <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-[#252525] tracking-tight mb-5 leading-tight">
                  {section.title}
                </h2>
              )}
              {content.description && (
                <p className="text-[#4D5765] text-sm sm:text-base md:text-lg leading-relaxed max-w-3xl mx-auto font-normal">
                  {content.description as string}
                </p>
              )}
              <div className="w-20 h-1 bg-[#A22965] mx-auto mt-6 rounded-full" />
            </div>
          </Container>
        </section>
      );

    // Modi World School Section 2: Academics / 4 Developmental Stages
    case "vision":
    case "academics": {
      const defaultStages = [
        {
          title: "Foundation Stage",
          tag: "Class Nursery to II (Ages 3 to 8 Years)",
          sub: "Jolly Kids Early Childhood - Pre Primary Division:",
          description: "Play-based, joyful, and experiential pedagogy focused on phonics, early numeracy, and sensory motor development.",
          image: "/uploads/events/sports-day-races.jpg",
          link: "/curriculum",
        },
        {
          title: "Preparatory Stage",
          tag: "Class III to V (Ages 8 to 11 Years)",
          sub: "CBSE - NCERT Curriculum. Sports Curriculum",
          description: "Conceptual foundations in Mathematics, Environmental Science, and Languages (English/Hindi). Sports & Arts Integration.",
          image: "/uploads/campus/morning-assembly-ground.jpg",
          link: "/curriculum",
        },
        {
          title: "Middle Stage",
          tag: "Class VI to VIII (Ages 11 to 14 Years)",
          sub: "CBSE - NCERT Curriculum. Sports Curriculum",
          description: "Hands-on Science laboratory experiments, computer coding & digital literacy, athletics coaching, and ethical character building.",
          image: "/uploads/campus/siddharth-academic-block.jpg",
          link: "/curriculum",
        },
        {
          title: "Secondary Stage",
          tag: "Class IX to XII (Ages 14 to 18 Years)",
          sub: "CBSE - NCERT Curriculum, Sports Curriculum",
          description: "Rigorous board examination excellence, specialized Science & Commerce streams, career counseling, and leadership grooming.",
          image: "/uploads/campus/siddharth-campus-main.jpg",
          link: "/curriculum",
        },
      ];

      const stages = Array.isArray(content.items) && content.items.length > 0
        ? (content.items as typeof defaultStages)
        : defaultStages;

      return (
        <section className="py-16 md:py-24 bg-white border-b border-slate-100">
          <Container>
            {/* Modi World School Exact Header */}
            <div className="max-w-4xl mx-auto text-center mb-12 md:mb-16">
              <span className="text-[#00306E] font-medium text-base tracking-wide block mb-2">
                {(content.subtitle as string) || "Siddharth International School Wisdom Campus | Best CBSE School Of Rajasthan"}
              </span>
              <h2 className="text-3xl sm:text-4xl lg:text-[40px] font-bold text-[#252525] tracking-tight">
                {section.title || "Academics"}
              </h2>
            </div>

            {/* 4-Stage Horizontal Cards Grid (2x2 layout matching Modi) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 max-w-6xl mx-auto">
              {stages.map((stage, idx) => (
                <div
                  key={idx}
                  className="group bg-white rounded-[10px] p-6 sm:p-9 border border-[#F0F0F0] shadow-2xs hover:shadow-md transition-all duration-300 flex flex-col sm:flex-row gap-6 items-start sm:items-center hover:-translate-y-0.5"
                >
                  {/* Left Square Image */}
                  <div className="w-full sm:w-[220px] aspect-square rounded-[8px] overflow-hidden shrink-0 bg-slate-100 relative">
                    <img
                      src={stage.image || "/uploads/campus/siddharth-campus-main.jpg"}
                      alt={stage.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>

                  {/* Right Content */}
                  <div className="flex-1 space-y-2">
                    <h3 className="text-[22px] font-semibold text-[#252525] group-hover:text-[#D20936] transition-colors leading-snug">
                      <Link href={stage.link || "/curriculum"}>
                        {stage.title}
                      </Link>
                    </h3>
                    {stage.tag && (
                      <p className="text-[16px] font-bold text-[#252525] leading-snug">
                        {stage.tag}
                      </p>
                    )}
                    {stage.sub && (
                      <p className="text-[15px] font-normal text-[#777777] underline leading-relaxed">
                        {stage.sub}
                      </p>
                    )}
                    <p className="text-[15px] text-[#4D5765] leading-[1.7]">
                      {stage.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </Container>
        </section>
      );
    }

    // Modi World School Section 3: Why School / "One Campus, Multiple Opportunities" (Full-bleed 50/50 split)
    case "why-choose-us": {
      const defaultOpportunityPoints = [
        "Best Schooling In Shekhawati Region",
        "Plethora of subject options from Jolly Kids to Grade XII",
        "Specialised sports coaching in addition to regular CBSE Board and yearly exams.",
        "Best CBSE School In India In Academic Excellence",
        "Best Boarding School In Rajasthan",
        "Best Budget Boarding Private School In India",
      ];

      const opportunityPoints: string[] = Array.isArray(content.points) && content.points.length > 0
        ? (content.points as string[])
        : Array.isArray(content.items) && content.items.length > 0
          ? (content.items as { title?: string; text?: string }[]).map((p) => p.title || p.text || String(p))
          : defaultOpportunityPoints;

      const campusImage =
        (content.image as string) ||
        (content.backgroundImage as string) ||
        "/uploads/campus/siddharth-campus-main.jpg";

      const hasCustomDescription = typeof content.description === "string" && content.description.trim().length > 0;

      return (
        <section className="w-full bg-[#A22965] text-white overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[580px] lg:min-h-[640px]">
            {/* Left 50%: Campus Photo matching Modi DSC06202 */}
            <div className="relative min-h-[380px] lg:min-h-full w-full bg-slate-900">
              <img
                src={campusImage}
                alt={section.title || "Siddharth International School Campus"}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/10" />
            </div>

            {/* Right 50%: Deep Wine Red background with White Text matching Modi #A22965 */}
            <div className="bg-[#A22965] p-8 sm:p-12 lg:p-16 xl:p-20 flex flex-col justify-center text-white">
              <h1 className="text-3xl sm:text-4xl lg:text-[45px] font-semibold !text-white mb-6 leading-tight">
                {section.title || "Why Siddharth International School"}
              </h1>

              <div className="space-y-4 !text-white text-[16px] font-light leading-[1.7] mb-8 font-sans">
                {hasCustomDescription ? (
                  <p className="whitespace-pre-line leading-relaxed">{content.description}</p>
                ) : (
                  <>
                    <p>
                      <span className="font-normal">Siddharth International School Wisdom Campus, one of the Best CBSE Schools of Rajasthan, is run by </span><strong className="font-bold !text-white">Shree Shyam Shiksha Samiti</strong><span className="font-normal"> (Reg. 68/झूं/11-12) An ISO certified CBSE School in Rajasthan, India. It is not only one of the </span><strong className="font-bold !text-white">Top CBSE Schools in Rajasthan</strong><span className="font-normal"> but our noble motive of imparting affordable education for all students also makes us a premier educational institution in Rajasthan.</span>
                    </p>
                    <p>
                      <span className="font-normal">A Top &amp; Best </span><strong className="font-bold !text-white">English Medium School in Rajasthan</strong><span className="font-normal">, Siddharth International School is the Trust of students &amp; parents from across Jhunjhunu, Sikar, and surrounding regions, providing an idyllic and capacious campus for the holistic growth of every child.</span>
                    </p>
                  </>
                )}
              </div>

              <div className="pt-2 mb-6 border-t border-white/20">
                <small className="!text-white text-[15px] font-normal block mb-1">
                  {(content.subHeadingTag as string) || "One Campus"}
                </small>
                <h2 className="text-2xl sm:text-3xl font-semibold !text-white">
                  {(content.subHeading as string) || "Multiple opportunities"}
                </h2>
              </div>

              <ul className="space-y-3.5 mb-8">
                {opportunityPoints.map((point, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="shrink-0 mt-1 text-white">
                      <Check className="h-4 w-4" />
                    </span>
                    <span className="text-white text-[15px] font-normal leading-snug">
                      {point}
                    </span>
                  </li>
                ))}
              </ul>

              <div>
                <Link
                  href={(content.buttonUrl as string) || "/about"}
                  className="inline-block px-11 py-4 bg-white text-[#4D5765] hover:bg-[#252525] hover:text-white text-base font-normal rounded-none transition-all shadow-xs self-start"
                >
                  {(content.buttonText as string) || "About Us"}
                </Link>
              </div>
            </div>
          </div>
        </section>
      );
    }

    // Modi World School Section 4: Amenities (8 Bordered Cards)
    case "facilities":
    case "amenities": {
      const iconMap: Record<string, any> = {
        Droplets,
        Laptop,
        FlaskConical,
        MonitorPlay,
        ShieldCheck,
        Bus,
        Trophy,
        BookOpen,
        Sparkles,
      };

      const defaultAmenitiesList = [
        { title: "Cafeteria & Dining", icon: Droplets },
        { title: "VR & Computer Lab", icon: Laptop },
        { title: "Science Labs", icon: FlaskConical },
        { title: "Digital Classrooms", icon: MonitorPlay },
        { title: "Safe Campus & Security", icon: ShieldCheck },
        { title: "Transport", icon: Bus },
        { title: "Sports Complex", icon: Trophy },
        { title: "Library & Resource Hub", icon: BookOpen },
      ];

      const amenitiesList = Array.isArray(content.items) && content.items.length > 0
        ? (content.items as { title: string; image?: string; icon?: any; desc?: string }[]).map((item, idx) => {
            let IconComponent = Sparkles;
            if (typeof item.icon === "string" && iconMap[item.icon]) {
              IconComponent = iconMap[item.icon];
            } else if (item.icon && typeof item.icon !== "string") {
              IconComponent = item.icon;
            } else {
              IconComponent = defaultAmenitiesList[idx % defaultAmenitiesList.length]?.icon || Sparkles;
            }
            return {
              title: item.title,
              icon: IconComponent,
              desc: item.desc,
            };
          })
        : defaultAmenitiesList;

      return (
        <section className="py-16 md:py-24 bg-white border-b border-slate-100">
          <Container>
            {/* Header matching Modi */}
            <div className="text-center mb-12 md:mb-14">
              <h2 className="text-3xl sm:text-4xl lg:text-[40px] font-bold text-[#252525]">
                {section.title || "Amenities"}
              </h2>
            </div>

            {/* 8 Amenities Grid (4-column layout matching Modi e61eaba) */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-5 sm:gap-6 max-w-6xl mx-auto">
              {amenitiesList.map((item, idx) => {
                const IconComponent = item.icon || Sparkles;
                return (
                  <div
                    key={idx}
                    className="p-6 sm:p-7 rounded-[8px] bg-white border border-[#A22965] shadow-2xs hover:shadow-lg transition-all duration-300 text-center flex flex-col items-center justify-center group hover:-translate-y-1"
                  >
                    <div className="w-14 h-14 rounded-full bg-[#A22965]/10 flex items-center justify-center text-[#A22965] mb-4 group-hover:bg-[#A22965] group-hover:text-white transition-colors">
                      <IconComponent className="h-7 w-7 text-[#A22965] group-hover:text-white transition-colors" />
                    </div>
                    <h3 className="font-semibold text-base sm:text-[20px] text-[#00306E] group-hover:text-[#D20936] transition-colors leading-snug">
                      {item.title}
                    </h3>
                  </div>
                );
              })}
            </div>
          </Container>
        </section>
      );
    }

    // Modi World School Section 6: "School You Would Want To Be In" (12 Sports & Activity Showcase)
    case "school-life":
    case "campus-life":
    case "student-development": {
      const defaultActivities = [
        { title: "BADMINTON", image: "/uploads/campus/siddharth-campus-main.jpg" },
        { title: "CRICKET", image: "/uploads/campus/morning-assembly-ground.jpg" },
        { title: "BASKET BALL", image: "/uploads/events/sports-day-races.jpg" },
        { title: "LAWN TENNIS", image: "/uploads/campus/siddharth-academic-block.jpg" },
        { title: "SWIMMING", image: "/uploads/events/sports-day-races.jpg" },
        { title: "WRESTLING", image: "/uploads/events/national-flag-celebration.jpg" },
        { title: "SHOOTING", image: "/uploads/campus/morning-assembly-ground.jpg" },
        { title: "ARCHERY", image: "/uploads/campus/siddharth-campus-main.jpg" },
        { title: "MARTIAL ARTS", image: "/uploads/events/sports-day-races.jpg" },
        { title: "SKATING", image: "/uploads/campus/siddharth-academic-block.jpg" },
        { title: "FOOTBALL", image: "/uploads/events/sports-day-races.jpg" },
        { title: "CLUBS", image: "/uploads/events/national-flag-celebration.jpg" },
      ];

      const activities = Array.isArray(content.items) && content.items.length > 0
        ? (content.items as typeof defaultActivities)
        : defaultActivities;

      return (
        <section className="py-16 md:py-24 bg-white border-b border-slate-100">
          <Container>
            {/* Header */}
            <div className="text-center mb-12 md:mb-14">
              <h2 className="text-3xl sm:text-4xl lg:text-[40px] font-bold text-[#252525]">
                {section.title || "School You Would Want To Be In"}
              </h2>
            </div>

            {/* 4-Column Activity Gallery Grid (12 cards with caption BELOW image matching Modi exactly) */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 max-w-7xl mx-auto">
              {activities.map((act, i) => (
                <figure key={i} className="gallery-item group text-center">
                  <div className="overflow-hidden rounded-[10px] aspect-[16/10] bg-slate-100 shadow-2xs">
                    <img
                      src={act.image || "/uploads/campus/siddharth-campus-main.jpg"}
                      alt={act.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                  <figcaption className="text-center font-bold text-[#252525] text-xs sm:text-[15px] uppercase tracking-wide mt-3 group-hover:text-[#00306E] transition-colors">
                    {act.title}
                  </figcaption>
                </figure>
              ))}
            </div>

            <div className="text-center mt-12">
              <Link
                href={(content.buttonUrl as string) || "/gallery"}
                className="inline-flex items-center gap-2 bg-[#A22965] hover:bg-[#851e51] text-white font-bold text-sm px-8 py-3.5 rounded-lg shadow-md hover:shadow-lg transition-all"
              >
                <span>{(content.buttonText as string) || "View Full Photo & Video Gallery"}</span>
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
          className="py-16 md:py-24 bg-white border-b border-slate-100 scroll-mt-20"
        >
          <Container>
            {/* Header */}
            <div className="max-w-4xl mx-auto text-center mb-12 md:mb-14">
              <span className="inline-block text-[#A22965] font-semibold text-xs tracking-widest uppercase mb-2">
                LEADERSHIP DESK
              </span>
              <h2 className="text-3xl sm:text-4xl font-bold text-[#252525] tracking-tight">
                {section.title || "Message from the Desk"}
              </h2>
            </div>

            {/* 2-Column Leader Showcase */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center max-w-6xl mx-auto">
              {/* Leader Photo */}
              <div className="lg:col-span-5 flex justify-center">
                <div className="relative w-full max-w-[340px] aspect-[4/5] rounded-2xl overflow-hidden shadow-xl border-4 border-white bg-slate-100 group ring-1 ring-slate-200">
                  <img
                    src={leaderImage}
                    alt={content.name ? String(content.name) : "Leadership"}
                    className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
              </div>

              {/* Leader Message Text */}
              <div className="lg:col-span-7 space-y-4">
                <span className="inline-block text-[#A22965] font-bold text-xs tracking-widest uppercase bg-[#A22965]/10 px-3 py-1 rounded-md border border-[#A22965]/20">
                  {designationText}
                </span>
                {content.name && (
                  <h3 className="text-2xl sm:text-3xl font-bold text-[#252525] tracking-tight">
                    {content.name as string}
                  </h3>
                )}

                <div className="space-y-4 text-[#4D5765] text-sm sm:text-base leading-relaxed font-normal pt-2">
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
          subtitle={(content.subtitle as string) || ""}
          content={content}
        />
      );

    // Modi World School Section 8: Regional Overview Banner ("Best CBSE School In Rajasthan")
    case "regional-overview":
    case "about-banner": {
      const eyebrow =
        (content.subtitle as string) || "Premier Senior Secondary Institution";
      const title = section.title || "Best CBSE School In Rajasthan";
      const rawDesc = (content.description as string) || "";
      const descParagraphs = rawDesc
        ? rawDesc.split(/\n\s*\n/).filter((p) => p.trim().length > 0)
        : [];

      const primaryBtnText =
        (content.primaryButtonText as string) ||
        (content.buttonText as string) ||
        "Apply for Admission";
      const primaryBtnUrl =
        (content.primaryButtonUrl as string) ||
        (content.buttonUrl as string) ||
        "/admissions";

      const secondaryBtnText =
        (content.secondaryButtonText as string) || "Mandatory Disclosure";
      const secondaryBtnUrl =
        (content.secondaryButtonUrl as string) || "/mandatory-disclosure";

      const videoThumb =
        (content.image as string) ||
        (content.backgroundImage as string) ||
        "/uploads/campus/morning-assembly-ground.jpg";

      const videoLink =
        (content.videoUrl as string) ||
        (content.videoTourUrl as string) ||
        "/gallery";

      const videoCaption =
        (content.videoCaption as string) ||
        "Campus Video Tour · Siddharth International School";

      return (
        <section className="py-16 md:py-24 bg-[#F5F5F5] border-b border-slate-200/60">
          <Container>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 items-center max-w-7xl mx-auto">
              {/* Left Column: Text */}
              <div>
                {eyebrow && (
                  <span className="block text-[#00306E] font-semibold text-base mb-2">
                    {eyebrow}
                  </span>
                )}
                <h3 className="text-3xl sm:text-4xl lg:text-[40px] font-bold text-[#252525] mb-5 tracking-tight leading-tight">
                  {title}
                </h3>
                <div className="space-y-4 text-[#4D5765] text-base leading-[1.7] mb-8 font-normal">
                  {descParagraphs.length > 0 ? (
                    descParagraphs.map((p, pIdx) => (
                      <p key={pIdx} className="leading-relaxed">
                        {p}
                      </p>
                    ))
                  ) : rawDesc ? (
                    <p className="whitespace-pre-line leading-relaxed">{rawDesc}</p>
                  ) : (
                    <>
                      <p>
                        <span className="font-normal">Siddharth International School, one of the </span>
                        <strong className="font-bold text-[#252525]">Best CBSE Schools in Rajasthan</strong>
                        <span className="font-normal">, is a flagship institution run by Shree Shyam Shiksha Samiti which was established in 2011. Being among the </span>
                        <strong className="font-bold text-[#252525]">Best CBSE Schools in Rajasthan</strong>
                        <span className="font-normal">, it expanded organically with state-of-the-art infrastructure.</span>
                      </p>
                      <p>
                        Sprawling over an expansive, green campus, the environment is idyllic and capacious for the holistic growth of a child. Its serene location and secure environment makes this Best CBSE School in Rajasthan an ideal place for children.
                      </p>
                    </>
                  )}
                </div>

                <div className="flex flex-wrap gap-4">
                  {primaryBtnText && (
                    <Link
                      href={primaryBtnUrl}
                      className="bg-[#A22965] hover:bg-[#851e51] text-white font-bold text-sm px-8 py-3.5 rounded-lg shadow-md hover:shadow-lg transition-all"
                    >
                      {primaryBtnText}
                    </Link>
                  )}
                  {secondaryBtnText && (
                    <Link
                      href={secondaryBtnUrl}
                      className="bg-[#D4A72C]/15 hover:bg-[#D4A72C] text-[#851e51] hover:text-[#591036] font-bold text-sm px-7 py-3.5 rounded-lg border-2 border-[#D4A72C] shadow-xs hover:shadow-md transition-all inline-flex items-center gap-2.5 hover:scale-105 active:scale-95"
                    >
                      <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#D4A72C] opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-[#A22965]"></span>
                      </span>
                      <span>{secondaryBtnText}</span>
                    </Link>
                  )}
                </div>
              </div>

              {/* Right Column: Video Frame / Visual (Supports YouTube links + lightboxes) */}
              <RegionalVideoCard
                image={videoThumb}
                videoUrl={videoLink}
                videoCaption={videoCaption}
                title={title}
              />
            </div>
          </Container>
        </section>
      );
    }

    // Statistics Bar
    case "statistics":
      return (
        <section className="py-14 md:py-20 bg-[#851e51] text-white border-y border-[#D4A72C]/30 relative overflow-hidden">
          <Container className="relative z-10">
            {section.title && (
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-center mb-10 tracking-tight !text-white">
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
        <section className="relative py-20 md:py-28 overflow-hidden bg-[#A22965] text-white">
          {/* Background Image with Wine Red Overlay */}
          <div className="absolute inset-0 z-0">
            <img
              src={bgImage}
              alt={section.title || "Admissions"}
              className="w-full h-full object-cover object-center"
            />
            <div className="absolute inset-0 bg-[#A22965]/92" />
          </div>

          <Container className="relative z-10 text-center">
            <div className="max-w-4xl mx-auto space-y-6">
              <div className="flex flex-wrap items-center justify-center gap-3">
                <span className="inline-block text-[#D4A72C] font-extrabold text-xs md:text-sm tracking-widest uppercase bg-black/30 px-4 py-1.5 rounded-full border border-[#D4A72C]/40">
                  ADMISSIONS OPEN · SESSION 2026–27
                </span>
                <span className="inline-block text-white font-bold text-xs md:text-sm tracking-wider uppercase bg-black/30 px-4 py-1.5 rounded-full border border-white/20">
                  School Plus
                </span>
              </div>

              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight !text-white leading-tight drop-shadow-sm">
                {section.title || "An Exclusive After School Extended Hours Program"}
              </h2>

              <p className="text-white/95 text-sm sm:text-base md:text-lg leading-relaxed max-w-2xl mx-auto font-normal">
                {content.description ||
                  "Siddharth International School, Best CBSE School In Rajasthan, Nursery to 12th. Through a unique learning experience which will enrich the child both academically and personally, we strive to cultivate the leaders of tomorrow, today."}
              </p>

              {/* Phone & Email direct contact bar matching Modi */}
              <div className="flex flex-wrap items-center justify-center gap-6 pt-2 text-sm font-semibold">
                <a
                  href="tel:+917568419751"
                  className="flex items-center gap-2 hover:text-[#D4A72C] transition-colors"
                >
                  <Phone className="h-4 w-4 text-[#D4A72C]" />
                  <span>+91-7568419751</span>
                </a>
                <span className="hidden sm:inline text-white/40">|</span>
                <a
                  href="tel:+917568419752"
                  className="flex items-center gap-2 hover:text-[#D4A72C] transition-colors"
                >
                  <Phone className="h-4 w-4 text-[#D4A72C]" />
                  <span>+91-7568419752</span>
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
                  className="inline-block bg-white text-[#252525] hover:bg-[#252525] hover:text-white font-bold text-sm sm:text-base px-9 py-4 rounded-none shadow-xl hover:shadow-2xl hover:-translate-y-0.5 transition-all tracking-wide"
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
        <section className="py-16 md:py-24 bg-[#F5F5F5] border-b border-slate-200/60">
          <Container>
            {/* Header */}
            <div className="max-w-4xl mx-auto text-center mb-12 md:mb-16">
              <span className="inline-block text-[#A22965] font-semibold text-xs tracking-widest uppercase mb-2">
                FREQUENTLY ASKED
              </span>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#252525] tracking-tight mb-3">
                {section.title || "Frequently Asked Questions"}
              </h2>
            </div>

            {/* Accordion FAQ Cards */}
            <div className="max-w-4xl mx-auto space-y-3.5">
              {items.map((item, i) => (
                <details
                  key={i}
                  className="group rounded-2xl border border-slate-200/90 bg-white shadow-xs hover:border-[#A22965]/40 transition-all overflow-hidden [&_summary::-webkit-details-marker]:hidden"
                >
                  <summary className="flex items-center justify-between p-5 sm:p-6 font-bold text-sm sm:text-base text-[#252525] hover:text-[#A22965] cursor-pointer select-none transition-colors">
                    <span>{item.question}</span>
                    <span className="shrink-0 ml-4 text-[#A22965] transition-transform duration-300 group-open:rotate-180">
                      <ChevronDown className="w-5 h-5" />
                    </span>
                  </summary>
                  <div className="px-5 sm:px-6 pb-6 pt-1 text-[#4D5765] text-xs sm:text-sm leading-relaxed border-t border-slate-100 font-normal">
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
