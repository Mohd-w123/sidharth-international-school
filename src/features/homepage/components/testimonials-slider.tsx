"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { Container } from "@/components/layout/container";
import { ChevronLeft, ChevronRight, Quote } from "lucide-react";

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
      "As a doctor and mother, I value Saint Lawrence Public School's nurturing environment. The school combines academic excellence with holistic development, fostering empathy, confidence, and curiosity.",
    name: "Dr. Anju Sharma",
    role: "Mother of Nyra Sharma (Grade I-Tulip)",
    avatar:
      "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=400&auto=format&fit=crop",
  },
  {
    quote:
      "Choosing Saint Lawrence Public School for our son was the best decision. The faculty’s focus on conceptual learning, moral integrity, and modern sports facilities has truly transformed his confidence.",
    name: "Mr. Rajesh Mathur",
    role: "Father of Aarav Mathur (Grade V-Lotus)",
    avatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=400&auto=format&fit=crop",
  },
  {
    quote:
      "The educators go above and beyond to ensure every student’s strengths are identified and nurtured. Saint Lawrence genuinely delivers a well-rounded foundation for future leaders.",
    name: "Mrs. Sunita Verma",
    role: "Mother of Riya Verma (Grade VIII-Rose)",
    avatar:
      "https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=400&auto=format&fit=crop",
  },
  {
    quote:
      "The safe, inclusive campus culture and individual academic attention have made a huge difference in my children's enthusiasm for coming to school every single day.",
    name: "Dr. Alok K. Sen",
    role: "Parent of Tanvi Sen (Grade III-Daisy)",
    avatar:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=400&auto=format&fit=crop",
  },
];

export function TestimonialsSlider({
  title = "Parent Testimonials",
  subtitle = "",
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
      name: item.name || (item as { title?: string }).title || "Parent",
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

  const current = testimonials[currentIndex] || testimonials[0]!;

  return (
    <section className="py-16 md:py-24 bg-white">
      <Container>
        {/* Top Centered Section Header */}
        <div className="max-w-3xl mx-auto text-center mb-10 md:mb-14">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#002a54] tracking-tight mb-3">
            {title}
          </h2>
          {subtitle && (
            <p className="text-slate-600 text-sm sm:text-base leading-relaxed max-w-2xl mx-auto font-normal">
              {subtitle}
            </p>
          )}
          <div className="w-16 h-1 bg-[#ffb300] mx-auto mt-3 rounded-full" />
        </div>

        {/* Main Testimonial Card Container */}
        <div
          className="w-full max-w-5xl xl:max-w-6xl mx-auto"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <div className="relative rounded-3xl bg-[#f8fafc] border border-slate-200/80 p-8 sm:p-12 md:p-16 shadow-sm hover:shadow-md transition-all duration-300">
            {/* Big Stylized Gold Quotes */}
            <div className="text-[#ffb300]/60 mb-4 select-none">
              <Quote className="w-12 h-12 md:w-14 md:h-14 fill-[#ffb300]/20 rotate-180" />
            </div>

            {/* Testimonial Quote Text with Smooth Fade Transition */}
            <div
              key={`testimonial-quote-${currentIndex}`}
              className="animate-in fade-in-50 duration-500"
            >
              <blockquote className="text-slate-700 text-base sm:text-lg md:text-xl lg:text-2xl italic font-normal leading-relaxed mb-8 max-w-4xl">
                &ldquo;{current.quote}&rdquo;
              </blockquote>

              {/* Author Row */}
              <div className="flex items-center gap-4 pt-2">
                {current.avatar && (
                  <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full overflow-hidden border-2 border-[#ffb300] shadow-sm relative shrink-0 bg-slate-200">
                    <Image
                      src={current.avatar}
                      alt={current.name}
                      fill
                      className="object-cover object-center"
                      sizes="56px"
                      unoptimized
                    />
                  </div>
                )}
                <div>
                  <h3 className="font-bold text-sm sm:text-base md:text-lg text-[#002a54] leading-snug">
                    {current.name}
                  </h3>
                  {current.role && (
                    <p className="text-xs sm:text-sm text-slate-500 font-normal mt-0.5">
                      {current.role}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Bottom Navigation Controls */}
            {total > 1 && (
              <div className="flex items-center justify-center gap-4 mt-8 pt-4">
                <button
                  type="button"
                  onClick={prevSlide}
                  aria-label="Previous Testimonial"
                  className="w-9 h-9 rounded-full bg-[#003d78] text-white hover:bg-[#002a54] active:scale-95 flex items-center justify-center transition-all shadow-sm cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>

                {/* Indicator Dots / Pills */}
                <div className="flex items-center gap-1.5">
                  {testimonials.map((_, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setCurrentIndex(idx)}
                      aria-label={`Go to testimonial ${idx + 1}`}
                      className={`transition-all duration-300 rounded-full cursor-pointer ${
                        idx === currentIndex
                          ? "w-6 h-2 bg-[#ffb300]"
                          : "w-2 h-2 bg-slate-300 hover:bg-slate-400"
                      }`}
                    />
                  ))}
                </div>

                <button
                  type="button"
                  onClick={nextSlide}
                  aria-label="Next Testimonial"
                  className="w-9 h-9 rounded-full bg-[#003d78] text-white hover:bg-[#002a54] active:scale-95 flex items-center justify-center transition-all shadow-sm cursor-pointer"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>
      </Container>
    </section>
  );
}
