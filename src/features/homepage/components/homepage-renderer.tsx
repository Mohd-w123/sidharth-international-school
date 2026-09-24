import { Container } from "@/components/layout/container";
import { SectionWrapper } from "@/components/layout/section-wrapper";
import type { HomepageSectionInput } from "@/lib/validations/homepage";
import { ChevronDown } from "lucide-react";
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
  const content = section.content as Record<string, any>;

  switch (section.type) {
    case "hero":
      return <HeroBannerSlider content={content} />;

    case "news":
      return (
        <NewsSectionSlider
          title={section.title || "Explore Latest News"}
          subtitle={(content.subtitle as string) || "Stay up to date with events, activities, and updates from one of the best CBSE schools in Jaipur."}
          content={content}
          latestNews={latestNews}
        />
      );

    case "announcement":
      return (
        <div className="bg-accent text-accent-foreground py-3">
          <Container className="text-center text-sm font-medium">
            {content.text as string}
          </Container>
        </div>
      );

    case "introduction":
      return (
        <SectionWrapper background="default" className="py-16 md:py-24 bg-white">
          <Container>
            <div className="max-w-5xl mx-auto text-center px-4">
              {content.subtitle && (
                <span className="inline-block text-[#ffb300] font-bold text-xs md:text-sm tracking-widest uppercase mb-2">
                  {content.subtitle as string}
                </span>
              )}
              {section.title && (
                <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-[#002a54] tracking-tight mb-6">
                  {section.title}
                </h2>
              )}
              {content.description && (
                <p className="text-slate-600 text-sm sm:text-base md:text-lg lg:text-xl leading-relaxed max-w-4xl mx-auto font-normal">
                  {content.description as string}
                </p>
              )}
              <div className="w-16 h-1 bg-[#ffb300] mx-auto mt-6 rounded-full" />
            </div>
          </Container>
        </SectionWrapper>
      );

    case "vision": {
      const items = (Array.isArray(content.items) ? content.items : []) as {
        title: string;
        tag?: string;
        description?: string;
      }[];

      const cardColors = [
        { bg: "bg-[#fdfbf2]", border: "border-[#ffb300]" },
        { bg: "bg-[#eff6ff]", border: "border-[#1e40af]" },
        { bg: "bg-[#faf5f0]", border: "border-[#9a3412]" },
        { bg: "bg-[#f0f4f8]", border: "border-[#002a54]" },
        { bg: "bg-[#fdfbf2]", border: "border-[#ffb300]" },
      ];

      return (
        <section className="py-16 md:py-24 bg-white">
          <Container>
            {/* Top Centered Section Header */}
            <div className="max-w-4xl mx-auto text-center mb-12 md:mb-16">
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-[#002a54] tracking-tight mb-4">
                {section.title || "Vision of Saint Lawrence Public School"}
              </h2>
              {content.description && (
                <p className="text-slate-600 text-sm sm:text-base md:text-lg leading-relaxed max-w-3xl mx-auto font-normal">
                  {content.description as string}
                </p>
              )}
              <div className="w-16 h-1 bg-[#ffb300] mx-auto mt-4 rounded-full" />
            </div>

            {/* 5-Column Developmental Stage Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 lg:gap-5 max-w-7xl mx-auto">
              {items.map((item, idx) => {
                const color = cardColors[idx % cardColors.length]!;
                return (
                  <div
                    key={idx}
                    className={`rounded-2xl p-5 sm:p-6 ${color.bg} border-l-[3.5px] ${color.border} shadow-xs hover:shadow-md transition-all duration-300 flex flex-col justify-between`}
                  >
                    <div>
                      <h3 className="text-lg sm:text-xl font-bold text-[#002a54] tracking-tight mb-1">
                        {item.title}
                      </h3>
                      {item.tag && (
                        <p className="text-[10px] sm:text-[11px] font-bold text-[#002a54] tracking-wider uppercase mb-3">
                          {item.tag}
                        </p>
                      )}
                      {item.description && (
                        <p className="text-slate-600 text-xs sm:text-[13px] leading-relaxed font-normal">
                          {item.description}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </Container>
        </section>
      );
    }

    case "student-development": {
      const items = Array.isArray(content.items)
        ? (content.items as { title: string; description?: string; image?: string }[])
        : [];

      return (
        <section className="py-16 md:py-24 bg-[#f8fafc]/70">
          <Container>
            {/* Top Centered Section Header */}
            <div className="max-w-4xl mx-auto text-center mb-12 md:mb-16">
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-[#002a54] tracking-tight mb-3">
                {section.title || "Student Development at a Leading CBSE School in Jaipur"}
              </h2>
              {content.subtitle && (
                <p className="text-slate-600 text-sm sm:text-base md:text-lg leading-relaxed max-w-3xl mx-auto font-normal">
                  {content.subtitle as string}
                </p>
              )}
              <div className="w-16 h-1 bg-[#ffb300] mx-auto mt-4 rounded-full" />
            </div>

            {/* 6 Dimensions 3-Column Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 max-w-7xl mx-auto">
              {items.map((item, idx) => (
                <div
                  key={idx}
                  className="rounded-3xl overflow-hidden bg-white shadow-md hover:shadow-xl border border-slate-200/80 transition-all duration-300 flex flex-col h-full group"
                >
                  {item.image && (
                    <div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-100">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    </div>
                  )}
                  <div className="p-6 sm:p-7 flex flex-col flex-1 bg-white">
                    <h3 className="text-lg sm:text-xl font-bold text-[#002a54] mb-2 leading-snug">
                      {item.title}
                    </h3>
                    {item.description && (
                      <p className="text-slate-600 text-xs sm:text-sm leading-relaxed font-normal">
                        {item.description}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </Container>
        </section>
      );
    }

    case "manifesto": {
      const items = Array.isArray(content.items)
        ? (content.items as { title: string; description?: string }[])
        : [];
      const image =
        (content.image as string) ||
        "https://images.unsplash.com/photo-1577896851231-70ef18881754?q=80&w=1000&auto=format&fit=crop";

      return (
        <section className="py-16 md:py-24 bg-[#1b3d6c] text-white">
          <Container>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center max-w-7xl mx-auto">
              {/* Left Column: Image */}
              <div className="lg:col-span-6 flex justify-center">
                <div className="relative w-full aspect-[4/3] sm:aspect-[16/11] rounded-3xl overflow-hidden shadow-2xl border border-white/10 group">
                  <img
                    src={image}
                    alt={section.title || "School Manifesto"}
                    className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
              </div>

              {/* Right Column: Content */}
              <div className="lg:col-span-6 text-white space-y-6">
                <div>
                  <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white mb-3">
                    {section.title || "The Saint Lawrence Manifesto"}
                  </h2>
                  {content.description && (
                    <p className="text-white/80 text-sm sm:text-base leading-relaxed mb-4 font-normal">
                      {content.description as string}
                    </p>
                  )}
                  <div className="w-16 h-1 bg-[#ffb300] rounded-full" />
                </div>

                {/* Manifesto Principles List */}
                <div className="space-y-4">
                  {items.map((item, idx) => (
                    <div key={idx} className="flex items-start gap-3">
                      <span className="w-2 h-2 rounded-full bg-[#ffb300] mt-2 shrink-0" />
                      <div>
                        <h4 className="font-bold text-sm sm:text-base text-white">
                          {item.title}
                        </h4>
                        {item.description && (
                          <p className="text-white/80 text-xs sm:text-sm leading-relaxed mt-0.5 font-normal">
                            {item.description}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {/* CTA Button */}
                {content.buttonText && (
                  <div className="pt-2">
                    <a
                      href={(content.buttonUrl as string) || "/admissions"}
                      className="inline-block bg-[#ffb300] hover:bg-[#ffa000] text-[#002a54] font-bold text-sm sm:text-base px-8 py-3.5 rounded-lg shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all"
                    >
                      {content.buttonText as string}
                    </a>
                  </div>
                )}
              </div>
            </div>
          </Container>
        </section>
      );
    }

    case "why-choose-us": {
      const items = Array.isArray(content.items)
        ? (content.items as { title: string; description?: string; image?: string }[])
        : [];

      return (
        <section className="py-16 md:py-24 bg-[#1b3d6c] text-white">
          <Container>
            {/* Top Centered Section Header */}
            <div className="max-w-4xl mx-auto text-center mb-12 md:mb-16">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white mb-3">
                {section.title || "Why Choose Us"}
              </h2>
              {content.subtitle && (
                <p className="text-white/80 text-sm sm:text-base md:text-lg leading-relaxed max-w-3xl mx-auto font-normal">
                  {content.subtitle as string}
                </p>
              )}
              <div className="w-16 h-1 bg-[#ffb300] mx-auto mt-4 rounded-full" />
            </div>

            {/* 3-Column Card Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 max-w-7xl mx-auto">
              {items.map((item, idx) => (
                <div
                  key={idx}
                  className="rounded-3xl overflow-hidden bg-white shadow-xl flex flex-col h-full group hover:shadow-2xl transition-all duration-300"
                >
                  {item.image && (
                    <div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-100">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    </div>
                  )}
                  <div className="p-6 sm:p-8 flex flex-col flex-1 bg-white">
                    <h3 className="text-lg sm:text-xl font-bold text-[#002a54] mb-3 leading-snug">
                      {item.title}
                    </h3>
                    {item.description && (
                      <p className="text-slate-600 text-xs sm:text-sm leading-relaxed font-normal">
                        {item.description}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </Container>
        </section>
      );
    }

    case "director-message":
    case "chairman-message":
    case "principal-message": {
      const designationText =
        (content.designation as string) ||
        (section.type === "director-message"
          ? "DIRECTOR"
          : section.type === "chairman-message"
            ? "CHAIRMAN"
            : "PRINCIPAL");

      const rawDescription = typeof content.description === "string" ? content.description : "";
      const paragraphs = rawDescription.split(/\n\s*\n/).filter(Boolean);

      return (
        <SectionWrapper background="default" className="py-16 md:py-24 bg-white">
          <Container>
            {/* Top Centered Section Header */}
            <div className="max-w-4xl mx-auto text-center mb-12 md:mb-16">
              {section.title && (
                <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-[#002a54] tracking-tight mb-3">
                  {section.title}
                </h2>
              )}
              {content.subtitle && (
                <p className="text-slate-600 text-sm sm:text-base md:text-lg leading-relaxed max-w-3xl mx-auto font-normal">
                  {content.subtitle as string}
                </p>
              )}
              <div className="w-16 h-1 bg-[#ffb300] mx-auto mt-4 rounded-full" />
            </div>

            {/* 2-Column Grid Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-center max-w-6xl xl:max-w-7xl mx-auto">
              {/* Leader Photo Column */}
              {content.image ? (
                <div className="lg:col-span-5 flex justify-center">
                  <div className="relative w-full max-w-[380px] aspect-[4/5] sm:aspect-[3/4] rounded-2xl overflow-hidden shadow-2xl border border-slate-100 bg-slate-100 group">
                    <img
                      src={content.image as string}
                      alt={content.name ? String(content.name) : section.title || "Leadership"}
                      className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                </div>
              ) : null}

              {/* Leader Message Column */}
              <div className={content.image ? "lg:col-span-7" : "lg:col-span-12 max-w-4xl mx-auto"}>
                {designationText && (
                  <span className="inline-block text-[#004080] font-bold text-xs tracking-widest uppercase mb-2">
                    {designationText}
                  </span>
                )}
                {content.name && (
                  <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#002a54] tracking-tight mb-5">
                    {content.name as string}
                  </h3>
                )}

                <div className="space-y-4 text-slate-600 text-sm sm:text-base md:text-lg leading-relaxed font-normal">
                  {paragraphs.length > 0 ? (
                    paragraphs.map((p, idx) => (
                      <p key={idx}>{p}</p>
                    ))
                  ) : rawDescription ? (
                    <p className="whitespace-pre-line">{rawDescription}</p>
                  ) : null}
                </div>
              </div>
            </div>
          </Container>
        </SectionWrapper>
      );
    }

    case "statistics":
      return (
        <SectionWrapper background="primary" className="py-16 md:py-24">
          <Container>
            {section.title && <h2 className="text-3xl md:text-4xl font-bold text-center mb-10">{section.title}</h2>}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center max-w-6xl mx-auto">
              {Array.isArray(content.items) && (content.items as { value: string; label: string }[]).map((item, i) => (
                <div key={i} className="p-4">
                  <p className="text-4xl md:text-5xl font-extrabold text-[#ffb300]">{item.value}</p>
                  <p className="text-sm md:text-base opacity-90 mt-2 font-medium">{item.label}</p>
                </div>
              ))}
            </div>
          </Container>
        </SectionWrapper>
      );

    case "programs":
    case "facilities":
    case "achievements":
      return (
        <SectionWrapper className="py-16 md:py-24">
          <Container>
            {section.title && <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#002a54] text-center mb-4">{section.title}</h2>}
            {content.description && <p className="text-center text-slate-600 mb-12 max-w-3xl mx-auto text-sm sm:text-base md:text-lg">{content.description as string}</p>}
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {Array.isArray(content.items) && (content.items as { title: string; description?: string; image?: string }[]).map((item, i) => (
                <div key={i} className="rounded-xl border border-slate-200/80 p-6 text-center shadow-xs hover:shadow-md transition-shadow bg-white">
                  {item.image && <img src={item.image} alt={item.title} className="w-20 h-20 mx-auto mb-4 rounded-lg object-cover" />}
                  <h3 className="font-bold text-lg text-[#002a54] mb-2">{item.title}</h3>
                  {item.description && <p className="text-sm text-slate-600 leading-relaxed">{item.description}</p>}
                </div>
              ))}
            </div>
          </Container>
        </SectionWrapper>
      );

    case "cta":
    case "contact-cta": {
      const bgImage =
        (content.image as string) ||
        (content.backgroundImage as string) ||
        "https://images.unsplash.com/photo-1577495508048-b635879837f1?q=80&w=1600&auto=format&fit=crop";

      return (
        <section className="relative py-20 md:py-28 overflow-hidden bg-[#002a54] text-white">
          {/* Background Image */}
          {bgImage && (
            <div className="absolute inset-0 z-0">
              <img
                src={bgImage}
                alt={section.title || "Admissions"}
                className="w-full h-full object-cover object-center"
              />
              {/* Deep Blue Overlay */}
              <div className="absolute inset-0 bg-gradient-to-r from-[#002a54]/95 via-[#003d78]/85 to-[#002a54]/95" />
            </div>
          )}

          <Container className="relative z-10 text-center">
            <div className="max-w-4xl mx-auto">
              {section.title && (
                <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight text-white mb-6 leading-tight drop-shadow-md">
                  {section.title}
                </h2>
              )}
              {content.description && (
                <p className="text-white/90 text-sm sm:text-base md:text-lg lg:text-xl leading-relaxed mb-8 max-w-3xl mx-auto font-normal drop-shadow-sm">
                  {content.description as string}
                </p>
              )}
              {content.buttonText && (
                <a
                  href={(content.buttonUrl as string) || "/admissions"}
                  className="inline-block bg-[#ffb300] hover:bg-[#ffa000] text-[#002a54] font-bold text-sm sm:text-base px-8 py-3.5 rounded-lg shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all"
                >
                  {content.buttonText as string}
                </a>
              )}
            </div>
          </Container>
        </section>
      );
    }

    case "video":
      return (
        <SectionWrapper>
          <Container className="max-w-4xl">
            {section.title && <h2 className="text-3xl font-bold text-center mb-8">{section.title}</h2>}
            {content.videoUrl && (
              <div className="aspect-video rounded-lg overflow-hidden">
                <iframe src={content.videoUrl as string} className="w-full h-full" allowFullScreen />
              </div>
            )}
          </Container>
        </SectionWrapper>
      );

    case "faq": {
      const items = Array.isArray(content.items)
        ? (content.items as { question: string; answer: string }[])
        : [];

      return (
        <section className="py-16 md:py-24 bg-[#f8fafc]/60">
          <Container>
            {/* Top Centered Section Header */}
            <div className="max-w-4xl mx-auto text-center mb-12 md:mb-16">
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-[#002a54] tracking-tight mb-3">
                {section.title || "Frequently Asked Questions"}
              </h2>
              {content.description && (
                <p className="text-slate-600 text-sm sm:text-base md:text-lg leading-relaxed max-w-3xl mx-auto font-normal">
                  {content.description as string}
                </p>
              )}
              <div className="w-16 h-1 bg-[#ffb300] mx-auto mt-4 rounded-full" />
            </div>

            {/* Accordion FAQ Cards */}
            <div className="max-w-4xl mx-auto space-y-3.5">
              {items.map((item, i) => (
                <details
                  key={i}
                  className="group rounded-2xl border border-slate-200/90 bg-white shadow-xs hover:border-slate-300 transition-all overflow-hidden [&_summary::-webkit-details-marker]:hidden"
                >
                  <summary className="flex items-center justify-between p-5 sm:p-6 font-bold text-sm sm:text-base text-[#002a54] cursor-pointer select-none">
                    <span>{item.question}</span>
                    <span className="shrink-0 ml-4 text-[#004080] transition-transform duration-300 group-open:rotate-180">
                      <ChevronDown className="w-5 h-5" />
                    </span>
                  </summary>
                  <div className="px-5 sm:px-6 pb-6 pt-1 text-slate-600 text-xs sm:text-sm leading-relaxed border-t border-slate-100 font-normal">
                    {item.answer}
                  </div>
                </details>
              ))}
            </div>
          </Container>
        </section>
      );
    }

    case "testimonials":
      return (
        <TestimonialsSlider
          title={section.title || "Parent Testimonials"}
          subtitle={content.subtitle as string}
          content={content}
        />
      );

    default:
      return (
        <SectionWrapper>
          <Container>
            {section.title && <h2 className="text-3xl font-bold text-center mb-4">{section.title}</h2>}
            {content.description && <p className="text-center text-muted-foreground">{content.description as string}</p>}
          </Container>
        </SectionWrapper>
      );
  }
}
