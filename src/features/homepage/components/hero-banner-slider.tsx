"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/layout/container";
import {
  ChevronLeft,
  ChevronRight,
  Sparkles,
  ArrowRight,
  GraduationCap,
  Award,
  BookOpen,
  Bus,
} from "lucide-react";

export interface BannerSlide {
  badge?: string;
  title: string;
  description?: string;
  image: string;
  primaryButtonText?: string;
  primaryButtonUrl?: string;
  secondaryButtonText?: string;
  secondaryButtonUrl?: string;
}

interface HeroBannerSliderProps {
  content: Record<string, unknown>;
}

const DEFAULT_SLIDES: BannerSlide[] = [
  {
    badge: "AFFILIATED TO CBSE, NEW DELHI",
    title: "Inspiring Excellence, Character & Lifelong Learning",
    description:
      "A Premier CBSE Co-Educational English Medium Institution in Nangal, Udaipurwati. Empowering young minds with academic brilliance, modern technology, and timeless values.",
    image: "/uploads/campus/siddharth-campus-main.jpg",
    primaryButtonText: "Apply For Admission",
    primaryButtonUrl: "/admissions",
    secondaryButtonText: "Explore Campus",
    secondaryButtonUrl: "/gallery",
  },
  {
    badge: "VALUES • DISCIPLINE • HOLISTIC GROWTH",
    title: "Nurturing 21st Century Leaders with Strong Moral Integrity",
    description:
      "Where inspiring morning assemblies, passionate mentorship, and personalized care build well-rounded global citizens ready to make a positive impact.",
    image: "/uploads/campus/morning-assembly-ground.jpg",
    primaryButtonText: "Academic Programs",
    primaryButtonUrl: "/academics",
    secondaryButtonText: "Mandatory Disclosures",
    secondaryButtonUrl: "/mandatory-disclosure",
  },
  {
    badge: "SPORTS • ATHLETICS • AGILITY",
    title: "Champions on the Field, Scholars in the Classroom",
    description:
      "Expansive athletic grounds, dedicated coaching in track & field, cricket, volleyball, and holistic fitness fostering true sportsmanship and teamwork.",
    image: "/uploads/events/sports-day-races.jpg",
    primaryButtonText: "Campus Life & Sports",
    primaryButtonUrl: "/gallery",
    secondaryButtonText: "Contact Us",
    secondaryButtonUrl: "/contact",
  },
];

export function HeroBannerSlider({ content }: HeroBannerSliderProps) {
  // Normalize raw banners from array or legacy single-banner format
  const rawBanners = Array.isArray(content.banners)
    ? (content.banners as Record<string, unknown>[])
    : [];

  let banners: BannerSlide[] =
    rawBanners.length > 0
      ? rawBanners
          .map((b, idx) => {
            const img =
              (b?.image as string) ||
              (b?.backgroundImage as string) ||
              (b?.url as string) ||
              (b?.imageUrl as string) ||
              (idx === 0 ? (content.backgroundImage as string) : "") ||
              "";

            return {
              badge:
                (b?.badge as string) ||
                (idx === 0 ? (content.badge as string) : "") ||
                "AFFILIATED TO CBSE, NEW DELHI",
              title:
                (b?.title as string) ||
                (idx === 0 ? (content.title as string) : "") ||
                "Siddharth International School – Nangal, Udaipurwati",
              description:
                (b?.description as string) ||
                (b?.subtitle as string) ||
                (idx === 0
                  ? (content.description as string) ||
                    (content.subtitle as string)
                  : "") ||
                "A Premier Co-Educational English Medium CBSE Institution in Nangal, Udaipurwati.",
              image: img,
              primaryButtonText:
                (b?.primaryButtonText as string) ||
                (b?.buttonText as string) ||
                (idx === 0 ? (content.buttonText as string) : "") ||
                "Apply Now",
              primaryButtonUrl:
                (b?.primaryButtonUrl as string) ||
                (b?.buttonUrl as string) ||
                (idx === 0 ? (content.buttonUrl as string) : "") ||
                "/admissions",
              secondaryButtonText:
                (b?.secondaryButtonText as string) ||
                (idx === 0 ? (content.secondaryButtonText as string) : "") ||
                "Explore Campus",
              secondaryButtonUrl:
                (b?.secondaryButtonUrl as string) ||
                (idx === 0 ? (content.secondaryButtonUrl as string) : "") ||
                "/gallery",
            };
          })
          .filter((b) => Boolean(b && b.image && b.image.trim().length > 0))
      : content.backgroundImage &&
          String(content.backgroundImage).trim().length > 0
        ? [
            {
              badge:
                (content.badge as string) || "AFFILIATED TO CBSE, NEW DELHI",
              title:
                (content.title as string) ||
                "Siddharth International School – Nangal, Udaipurwati",
              description:
                (content.subtitle as string) ||
                (content.description as string) ||
                "A Premier Co-Educational English Medium CBSE Institution in Nangal, Udaipurwati.",
              image: String(content.backgroundImage).trim(),
              primaryButtonText:
                (content.buttonText as string) ||
                (content.primaryButtonText as string) ||
                "Apply Now",
              primaryButtonUrl:
                (content.buttonUrl as string) ||
                (content.primaryButtonUrl as string) ||
                "/admissions",
              secondaryButtonText:
                (content.secondaryButtonText as string) || "Explore Campus",
              secondaryButtonUrl:
                (content.secondaryButtonUrl as string) || "/gallery",
            },
          ]
        : [];

  // Fallback to high-quality default campus slides if no banners configured
  if (banners.length === 0) {
    banners = DEFAULT_SLIDES;
  }

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const slideCount = banners.length;

  useEffect(() => {
    if (currentIndex >= slideCount && slideCount > 0) {
      setCurrentIndex(0);
    }
  }, [currentIndex, slideCount]);

  const nextSlide = useCallback(() => {
    if (slideCount <= 1) return;
    setCurrentIndex((prev) => (prev + 1) % slideCount);
  }, [slideCount]);

  const prevSlide = useCallback(() => {
    if (slideCount <= 1) return;
    setCurrentIndex((prev) => (prev - 1 + slideCount) % slideCount);
  }, [slideCount]);

  // Auto-play timer (6 seconds), pauses on mouse hover
  useEffect(() => {
    if (slideCount <= 1 || isHovered) return;
    const timer = setInterval(() => {
      nextSlide();
    }, 6000);
    return () => clearInterval(timer);
  }, [slideCount, isHovered, nextSlide]);

  const currentBanner = banners[currentIndex] || banners[0]!;

  return (
    <div className="relative">
      <section
        className="relative min-h-[70vh] sm:min-h-[76vh] md:min-h-[82vh] lg:min-h-[86vh] flex items-center overflow-hidden bg-slate-950"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Background Images with Cross-Fade & Subtle Zoom */}
        {banners.map((banner, index) => {
          const isActive = index === currentIndex;
          return (
            <div
              key={`slide-bg-${index}`}
              className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                isActive ? "opacity-100 z-0" : "opacity-0 -z-10 pointer-events-none"
              }`}
            >
              {banner.image && (
                <Image
                  src={banner.image}
                  alt={banner.title || "School Banner"}
                  fill
                  priority={index === 0}
                  className={`object-cover object-center transition-transform duration-7000 ease-out ${
                    isActive ? "scale-105" : "scale-100"
                  }`}
                  sizes="100vw"
                  unoptimized
                />
              )}

              {/* 
                CRITICAL REQUIREMENT: DECREASED RED COLOR OPACITY
                - Dark subtle vignette on left for razor-sharp text legibility (no eye strain)
                - Very low red warmth (only 12% opacity) so the actual photographs of campus,
                  students, sports, and assembly grounds remain bright, crisp, and vivid!
              */}
              <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/50 to-black/15" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30" />
              <div className="absolute inset-0 bg-[#680000]/12 mix-blend-multiply pointer-events-none" />
            </div>
          );
        })}

        {/* Main Banner Content */}
        <Container className="relative z-10 py-20 sm:py-24 md:py-32">
          <div
            key={`slide-content-${currentIndex}`}
            className="max-w-3xl lg:max-w-4xl text-left"
          >
            {/* Badge */}
            {currentBanner.badge && (
              <div className="mb-4 inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-black/40 backdrop-blur-md border border-[#D4A72C]/50 shadow-sm animate-in fade-in-50 slide-in-from-bottom-2 duration-500">
                <Sparkles className="h-3.5 w-3.5 text-[#D4A72C]" />
                <span className="text-[#D4A72C] font-bold text-xs tracking-wider uppercase">
                  {currentBanner.badge}
                </span>
              </div>
            )}

            {/* Title */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-white leading-[1.12] tracking-tight mb-5 drop-shadow-[0_2px_12px_rgba(0,0,0,0.8)] animate-in fade-in-50 slide-in-from-bottom-3 duration-600">
              {currentBanner.title}
            </h1>

            {/* Description */}
            {currentBanner.description && (
              <p className="text-white/95 text-base sm:text-lg md:text-xl leading-relaxed mb-8 max-w-2xl drop-shadow-[0_1px_5px_rgba(0,0,0,0.8)] font-normal animate-in fade-in-50 slide-in-from-bottom-4 duration-600">
                {currentBanner.description}
              </p>
            )}

            {/* Call-to-Action Buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-1 animate-in fade-in-50 slide-in-from-bottom-5 duration-600">
              {currentBanner.primaryButtonText && (
                <Link
                  href={currentBanner.primaryButtonUrl || "/admissions"}
                  className="px-7 py-3.5 rounded-md bg-[#D4A72C] text-[#1A1A1A] font-bold text-sm md:text-base hover:bg-[#b88f20] transition-all shadow-xl hover:shadow-2xl hover:-translate-y-0.5 flex items-center gap-2 group cursor-pointer"
                >
                  <span>{currentBanner.primaryButtonText}</span>
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              )}

              {currentBanner.secondaryButtonText && (
                <Link
                  href={currentBanner.secondaryButtonUrl || "/gallery"}
                  className="px-7 py-3.5 rounded-md border border-white/30 bg-white/10 hover:bg-white/20 backdrop-blur-md text-white font-semibold text-sm md:text-base hover:border-white transition-all shadow-lg hover:-translate-y-0.5 flex items-center gap-2 cursor-pointer"
                >
                  <span>{currentBanner.secondaryButtonText}</span>
                </Link>
              )}
            </div>
          </div>
        </Container>

        {/* Navigation Controls (Only shown when multiple slides exist) */}
        {slideCount > 1 && (
          <>
            {/* Left Arrow */}
            <button
              type="button"
              onClick={prevSlide}
              aria-label="Previous Slide"
              className="absolute left-4 sm:left-6 top-1/2 -translate-y-1/2 z-20 h-11 w-11 sm:h-13 sm:w-13 rounded-full bg-black/40 hover:bg-[#8A0000] border border-white/20 backdrop-blur-md text-white flex items-center justify-center transition-all duration-200 shadow-xl hover:scale-110 cursor-pointer"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>

            {/* Right Arrow */}
            <button
              type="button"
              onClick={nextSlide}
              aria-label="Next Slide"
              className="absolute right-4 sm:right-6 top-1/2 -translate-y-1/2 z-20 h-11 w-11 sm:h-13 sm:w-13 rounded-full bg-black/40 hover:bg-[#8A0000] border border-white/20 backdrop-blur-md text-white flex items-center justify-center transition-all duration-200 shadow-xl hover:scale-110 cursor-pointer"
            >
              <ChevronRight className="h-6 w-6" />
            </button>

            {/* Bottom Controls Bar: Slide Counter & Indicators */}
            <div className="absolute bottom-6 sm:bottom-8 left-1/2 -translate-x-1/2 z-20 flex items-center gap-4 bg-black/50 backdrop-blur-md px-5 py-2 rounded-full border border-white/15 shadow-xl">
              <span className="text-[#D4A72C] font-mono font-bold text-xs tracking-wider">
                0{currentIndex + 1}
              </span>

              {/* Indicator Pills */}
              <div className="flex items-center gap-2">
                {banners.map((_, idx) => (
                  <button
                    key={`indicator-${idx}`}
                    type="button"
                    onClick={() => setCurrentIndex(idx)}
                    aria-label={`Go to slide ${idx + 1}`}
                    className={`transition-all duration-300 rounded-full cursor-pointer ${
                      idx === currentIndex
                        ? "w-7 h-2 bg-[#D4A72C]"
                        : "w-2 h-2 bg-white/40 hover:bg-white/70"
                    }`}
                  />
                ))}
              </div>

              <span className="text-white/60 font-mono text-xs">
                0{slideCount}
              </span>
            </div>
          </>
        )}
      </section>

      {/* 
        MODI WORLD SCHOOL-STYLE 4 QUICK PILLARS RIBBON
        Overlapping or directly attached beneath the hero slider for maximum prestige
      */}
      <div className="relative z-20 bg-gradient-to-r from-[#680000] via-[#8A0000] to-[#680000] text-white py-4 shadow-xl border-y border-[#D4A72C]/30">
        <Container>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 divide-y md:divide-y-0 md:divide-x divide-white/15">
            <div className="flex items-center gap-3 pt-2 md:pt-0">
              <div className="h-10 w-10 rounded-lg bg-white/10 flex items-center justify-center shrink-0 border border-white/20">
                <GraduationCap className="h-5 w-5 text-[#D4A72C]" />
              </div>
              <div>
                <p className="text-xs font-bold text-white uppercase tracking-wide">
                  CBSE Curriculum
                </p>
                <p className="text-[11px] text-white/75">
                  Senior Secondary (All Streams)
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 pt-2 md:pt-0 md:pl-4">
              <div className="h-10 w-10 rounded-lg bg-white/10 flex items-center justify-center shrink-0 border border-white/20">
                <BookOpen className="h-5 w-5 text-[#D4A72C]" />
              </div>
              <div>
                <p className="text-xs font-bold text-white uppercase tracking-wide">
                  Smart Classrooms
                </p>
                <p className="text-[11px] text-white/75">
                  Digital Tech & Science Labs
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 pt-2 md:pt-0 md:pl-4">
              <div className="h-10 w-10 rounded-lg bg-white/10 flex items-center justify-center shrink-0 border border-white/20">
                <Award className="h-5 w-5 text-[#D4A72C]" />
              </div>
              <div>
                <p className="text-xs font-bold text-white uppercase tracking-wide">
                  Sports & Arts
                </p>
                <p className="text-[11px] text-white/75">
                  Extensive Grounds & Activities
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 pt-2 md:pt-0 md:pl-4">
              <div className="h-10 w-10 rounded-lg bg-white/10 flex items-center justify-center shrink-0 border border-white/20">
                <Bus className="h-5 w-5 text-[#D4A72C]" />
              </div>
              <div>
                <p className="text-xs font-bold text-white uppercase tracking-wide">
                  Safe Transport
                </p>
                <p className="text-[11px] text-white/75">
                  Nangal & Udaipurwati Routes
                </p>
              </div>
            </div>
          </div>
        </Container>
      </div>
    </div>
  );
}
