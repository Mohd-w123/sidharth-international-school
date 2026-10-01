"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { Container } from "@/components/layout/container";
import { Star, ChevronLeft, ChevronRight, Quote } from "lucide-react";

export interface TestimonialItem {
  quote: string;
  name: string;
  role?: string;
  designation?: string;
  avatar?: string;
  image?: string;
}

interface TestimonialsSliderProps {
  title?: string;
  subtitle?: string;
  content?: Record<string, unknown>;
}

const DEFAULT_SAMPLE_TESTIMONIALS: TestimonialItem[] = [
  {
    quote:
      "The verdant, sprawling campus is undeniably what makes Siddharth International School truly distinguished. It is profoundly inspiring to observe students immersed in their studies within such a beautiful and conducive environment. The school’s administration has clearly invested extraordinary effort to ensure that the pursuit of academic excellence harmoniously blends with serenity and exemplary discipline.",
    name: "Shri Brijendra Ola",
    role: "Distinguished Dignitary & Former Minister, Rajasthan",
    avatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=400&auto=format&fit=crop",
  },
  {
    quote:
      "The level of discipline here is exemplary. Each student epitomizes strong values, respect, and a deep sense of responsibility—qualities that are the undeniable hallmarks of an outstanding educational institution. From the impeccably hygienic facilities to the structured routines and devoted faculty, this institution establishes a gold standard in schooling.",
    name: "Lt. General K.K. Repswal (Retd.)",
    role: "SM, VSM, Former Chief of Staff",
    avatar:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=400&auto=format&fit=crop",
  },
  {
    quote:
      "I was deeply impressed by the school’s robust commitment to discipline and its nature-friendly environment. The deliberate focus on values and character-building initiatives is truly commendable. Furthermore, the level of security, supervision, and order maintained across the campus is equally impressive.",
    name: "Shri Mridul Kachawa IPS",
    role: "Superintendent of Police",
    avatar:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=400&auto=format&fit=crop",
  },
  {
    quote:
      "The academic culture here is outstanding. The focus on conceptual learning & innovation is clearly visible in every corner of Siddharth International School. The leadership and management deserve appreciation for their experience-driven approach in shaping young minds with such precision and dedication.",
    name: "Shri Brijesh Upadhayaya IPS",
    role: "Senior Indian Police Service Officer",
    avatar:
      "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=400&auto=format&fit=crop",
  },
  {
    quote:
      "Visiting this institution fills me with immense pride. The school has grown into a center of excellence with world-class facilities and a vibrant learning culture. The transformation reflects years of consistent effort and a holistic vision for student success.",
    name: "Shri Sachin Rahar IAS",
    role: "Indian Administrative Service Officer",
    avatar:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=400&auto=format&fit=crop",
  },
  {
    quote:
      "The campus boasts outstanding infrastructure, encompassing modern pedagogical environments, comprehensively outfitted research laboratories, and innovative learning hubs. This setting provides an intrinsically nurturing foundation for student growth. The administration’s unwavering diligence is praiseworthy.",
    name: "Shri Ravi Jain IAS",
    role: "Senior Administrator & Public Servant",
    avatar:
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=400&auto=format&fit=crop",
  },
  {
    quote:
      "Enrolling our child at Siddharth International School has been a remarkable decision. The emphasis on discipline, campus hygiene, safe water facilities, and individual teacher attention has helped our child flourish with confidence.",
    name: "Dr. Mukesh Kumar Bagadi",
    role: "Parent Representative (BAMS Doctor), Udaipurwati",
    avatar:
      "https://images.unsplash.com/photo-1537368910025-700350fe46c7?q=80&w=400&auto=format&fit=crop",
  },
  {
    quote:
      "The modern infrastructure, well-equipped labs, and safe transportation provided by Siddharth International School set a genuine benchmark in the Shekhawati region. The leadership is always receptive and transparent.",
    name: "Mr. Arvind Badiwal",
    role: "Parent Representative & Businessman, Udaipurwati",
    avatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=400&auto=format&fit=crop",
  },
];

export function TestimonialsSlider({
  title = "Testimonials",
  subtitle = "What dignitaries, administrative leaders & parents share about our institution",
  content = {},
}: TestimonialsSliderProps) {
  // Normalize items from content.items or default testimonials
  const contentItems = Array.isArray(content.items)
    ? (content.items as TestimonialItem[])
    : [];

  const rawList: TestimonialItem[] =
    contentItems.length > 0 ? contentItems : DEFAULT_SAMPLE_TESTIMONIALS;

  const testimonials: TestimonialItem[] = rawList.map((item) => {
    const rawAvatar = item.avatar || item.image || "";
    return {
      quote:
        item.quote ||
        (item as { description?: string }).description ||
        (item as { text?: string }).text ||
        "",
      name: item.name || (item as { title?: string }).title || "Dignitary",
      role: item.role || item.designation || "",
      avatar: typeof rawAvatar === "string" ? rawAvatar.trim() : "",
    };
  });

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const total = testimonials.length;

  const nextSlide = useCallback(() => {
    if (total <= 1) return;
    setCurrentIndex((prev) => (prev + 1) % total);
  }, [total]);

  const prevSlide = useCallback(() => {
    if (total <= 1) return;
    setCurrentIndex((prev) => (prev - 1 + total) % total);
  }, [total]);

  // Auto-play timer (6 seconds), pauses when mouse hovers
  useEffect(() => {
    if (total <= 1 || isHovered) return;
    const timer = setInterval(() => {
      nextSlide();
    }, 6000);
    return () => clearInterval(timer);
  }, [total, isHovered, nextSlide]);

  if (testimonials.length === 0) return null;

  // Index for multi-card view (shows 2 cards on desktop, 1 on mobile)
  const currentFirst = testimonials[currentIndex] || testimonials[0]!;
  const nextIndex = (currentIndex + 1) % total;
  const currentSecond = testimonials[nextIndex] || testimonials[0]!;

  return (
    <section className="py-16 md:py-24 bg-[#F5F5F5] border-b border-slate-200/60">
      <Container>
        {/* Top Centered Section Header matching Modi World School */}
        <div className="max-w-4xl mx-auto text-center mb-12 md:mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-[40px] font-bold text-[#252525] tracking-tight">
            {title}
          </h2>
        </div>

        {/* 2-Card Slider Container matching Modi's reactheme-addon-slider */}
        <div
          className="w-full max-w-6xl mx-auto"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
            {/* Card 1 */}
            <div className="bg-white border border-[#ECECEC] rounded-lg p-7 sm:p-10 flex flex-col justify-between shadow-2xs hover:shadow-md transition-shadow">
              <div>
                <p className="text-[#4D5765] text-base leading-[1.7] mb-6 font-normal">
                  {currentFirst.quote}
                </p>
                <div className="flex items-center gap-1 text-[#FFB800] mb-6">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-[#FFB800]" />
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-[#ECECEC] flex items-center gap-4">
                {currentFirst.avatar && (
                  <div className="w-14 h-14 rounded-full overflow-hidden shrink-0 border border-[#ECECEC]">
                    <img
                      src={currentFirst.avatar}
                      alt={currentFirst.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <div>
                  <h3 className="font-semibold text-lg sm:text-xl text-[#00306E] leading-snug">
                    {currentFirst.name}
                  </h3>
                  {currentFirst.role && (
                    <p className="text-sm text-[#777777] font-normal mt-0.5">
                      {currentFirst.role}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Card 2 (hidden on mobile, visible on tablet/desktop) */}
            <div className="hidden md:flex bg-white border border-[#ECECEC] rounded-lg p-7 sm:p-10 flex-col justify-between shadow-2xs hover:shadow-md transition-shadow">
              <div>
                <p className="text-[#4D5765] text-base leading-[1.7] mb-6 font-normal">
                  {currentSecond.quote}
                </p>
                <div className="flex items-center gap-1 text-[#FFB800] mb-6">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-[#FFB800]" />
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-[#ECECEC] flex items-center gap-4">
                {currentSecond.avatar && (
                  <div className="w-14 h-14 rounded-full overflow-hidden shrink-0 border border-[#ECECEC]">
                    <img
                      src={currentSecond.avatar}
                      alt={currentSecond.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <div>
                  <h3 className="font-semibold text-lg sm:text-xl text-[#00306E] leading-snug">
                    {currentSecond.name}
                  </h3>
                  {currentSecond.role && (
                    <p className="text-sm text-[#777777] font-normal mt-0.5">
                      {currentSecond.role}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Slider Navigation Controls */}
          {total > 1 && (
            <div className="flex items-center justify-center gap-4 mt-10">
              <button
                type="button"
                onClick={prevSlide}
                aria-label="Previous Testimonials"
                className="w-10 h-10 rounded-full border border-slate-300 bg-white text-[#4D5765] hover:bg-[#8A0000] hover:text-white hover:border-[#8A0000] flex items-center justify-center transition-all shadow-xs cursor-pointer"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              {/* Indicator Dots */}
              <div className="flex items-center gap-2">
                {testimonials.map((_, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setCurrentIndex(idx)}
                    aria-label={`Go to slide ${idx + 1}`}
                    className={`transition-all duration-300 rounded-full cursor-pointer ${idx === currentIndex
                      ? "w-6 h-2 bg-[#8A0000]"
                      : "w-2 h-2 bg-slate-300 hover:bg-slate-400"
                      }`}
                  />
                ))}
              </div>

              <button
                type="button"
                onClick={nextSlide}
                aria-label="Next Testimonials"
                className="w-10 h-10 rounded-full border border-slate-300 bg-white text-[#4D5765] hover:bg-[#8A0000] hover:text-white hover:border-[#8A0000] flex items-center justify-center transition-all shadow-xs cursor-pointer"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>
      </Container>
    </section>
  );
}
