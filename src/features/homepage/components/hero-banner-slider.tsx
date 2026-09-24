"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/layout/container";
import { ChevronLeft, ChevronRight } from "lucide-react";

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

export function HeroBannerSlider({ content }: HeroBannerSliderProps) {
  // Normalize raw banners from array or legacy single-banner format
  const rawBanners = Array.isArray(content.banners) ? (content.banners as Record<string, unknown>[]) : [];

  const banners: BannerSlide[] =
    rawBanners.length > 0
      ? rawBanners.map((b, idx) => {
          const img =
            (b?.image as string) ||
            (b?.backgroundImage as string) ||
            (b?.url as string) ||
            (b?.imageUrl as string) ||
            (idx === 0 ? (content.backgroundImage as string) : "") ||
            "";

          return {
            badge: (b?.badge as string) || (idx === 0 ? (content.badge as string) : "") || "BE THE LIGHT",
            title:
              (b?.title as string) ||
              (idx === 0 ? (content.title as string) : "") ||
              "Saint Lawrence Public School – One of the Best Schools in Jaipur",
            description:
              (b?.description as string) ||
              (b?.subtitle as string) ||
              (idx === 0 ? (content.description as string) || (content.subtitle as string) : "") ||
              "Where every child is known by name, nurtured by purpose, and inspired to lead with empathy, integrity, perseverance, and autonomy.",
            image: img,
            primaryButtonText:
              (b?.primaryButtonText as string) ||
              (b?.buttonText as string) ||
              (idx === 0 ? (content.buttonText as string) : "") ||
              "Enquire Now",
            primaryButtonUrl:
              (b?.primaryButtonUrl as string) ||
              (b?.buttonUrl as string) ||
              (idx === 0 ? (content.buttonUrl as string) : "") ||
              "/admissions",
            secondaryButtonText:
              (b?.secondaryButtonText as string) ||
              (idx === 0 ? (content.secondaryButtonText as string) : "") ||
              "Latest News",
            secondaryButtonUrl:
              (b?.secondaryButtonUrl as string) ||
              (idx === 0 ? (content.secondaryButtonUrl as string) : "") ||
              "/news",
          };
        }).filter((b) => Boolean(b && b.image && b.image.trim().length > 0))
      : content.backgroundImage && String(content.backgroundImage).trim().length > 0
        ? [
            {
              badge: (content.badge as string) || "BE THE LIGHT",
              title:
                (content.title as string) ||
                "Saint Lawrence Public School – One of the Best Schools in Jaipur",
              description:
                (content.subtitle as string) ||
                (content.description as string) ||
                "Where every child is known by name, nurtured by purpose, and inspired to lead with empathy, integrity, perseverance, and autonomy.",
              image: String(content.backgroundImage).trim(),
              primaryButtonText:
                (content.buttonText as string) ||
                (content.primaryButtonText as string) ||
                "Enquire Now",
              primaryButtonUrl:
                (content.buttonUrl as string) ||
                (content.primaryButtonUrl as string) ||
                "/admissions",
              secondaryButtonText:
                (content.secondaryButtonText as string) || "Latest News",
              secondaryButtonUrl:
                (content.secondaryButtonUrl as string) || "/news",
            },
          ]
        : [];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const slideCount = banners.length;

  // Keep index within bounds if slide count changes
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

  // Auto-play timer (5 seconds), pauses on mouse hover
  useEffect(() => {
    if (slideCount <= 1 || isHovered) return;
    const timer = setInterval(() => {
      nextSlide();
    }, 5000);
    return () => clearInterval(timer);
  }, [slideCount, isHovered, nextSlide]);

  if (slideCount === 0) {
    return (
      <section className="relative min-h-[60vh] flex items-center justify-center bg-[#002a54] text-white py-20 text-center">
        <Container>
          <span className="inline-block text-[#ffb300] font-bold text-xs md:text-sm tracking-widest uppercase mb-3">
            BE THE LIGHT
          </span>
          <h1 className="text-3xl md:text-5xl font-extrabold mb-4">
            Saint Lawrence Public School – One of the Best Schools in Jaipur
          </h1>
          <p className="text-white/80 max-w-2xl mx-auto mb-8 text-base">
            Where every child is known by name, nurtured by purpose, and inspired to lead with empathy, integrity, perseverance, and autonomy.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/admissions"
              className="px-7 py-3 rounded-md bg-[#ffb300] text-[#002a54] font-bold text-sm md:text-base hover:bg-[#ffa000] transition-all shadow-lg"
            >
              Enquire Now
            </Link>
            <Link
              href="/news"
              className="px-7 py-3 rounded-md border border-white/80 bg-white/10 backdrop-blur-xs text-white font-semibold text-sm md:text-base hover:bg-white/20 transition-all shadow-md"
            >
              Latest News
            </Link>
          </div>
        </Container>
      </section>
    );
  }

  const currentBanner = banners[currentIndex] || banners[0]!;

  return (
    <section
      className="relative min-h-[65vh] md:min-h-[75vh] lg:min-h-[82vh] flex items-center overflow-hidden bg-[#001f3f]"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Background Images with Cross-Fade */}
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
                className="object-cover object-center"
                sizes="100vw"
                unoptimized
              />
            )}
            {/* Rich Navy Blue Gradient Overlay for High Text Readability */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#002a54]/95 via-[#003d78]/80 to-[#002a54]/40" />
            <div className="absolute inset-0 bg-black/20" />
          </div>
        );
      })}

      {/* Main Banner Content */}
      <Container className="relative z-10 py-24 md:py-32 lg:py-36">
        <div key={`slide-content-${currentIndex}`} className="max-w-4xl lg:max-w-5xl text-left transition-all duration-500">
          {currentBanner.badge && (
            <div className="mb-3 animate-in fade-in-50 slide-in-from-bottom-2 duration-500">
              <span className="inline-block text-[#ffb300] font-bold text-xs md:text-sm tracking-widest uppercase drop-shadow-sm">
                {currentBanner.badge}
              </span>
            </div>
          )}

          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-white leading-tight md:leading-[1.15] tracking-tight mb-6 drop-shadow-md animate-in fade-in-50 slide-in-from-bottom-3 duration-600">
            {currentBanner.title}
          </h1>

          {currentBanner.description && (
            <p className="text-white/90 text-sm sm:text-base md:text-lg lg:text-xl leading-relaxed mb-8 max-w-3xl drop-shadow-sm animate-in fade-in-50 slide-in-from-bottom-4 duration-600">
              {currentBanner.description}
            </p>
          )}

          <div className="flex flex-wrap items-center gap-4 pt-2 animate-in fade-in-50 slide-in-from-bottom-5 duration-600">
            {currentBanner.primaryButtonText && (
              <Link
                href={currentBanner.primaryButtonUrl || "/admissions"}
                className="px-7 py-3 rounded-md bg-[#ffb300] text-[#002a54] font-bold text-sm md:text-base hover:bg-[#ffa000] transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5"
              >
                {currentBanner.primaryButtonText}
              </Link>
            )}

            {currentBanner.secondaryButtonText && (
              <Link
                href={currentBanner.secondaryButtonUrl || "/news"}
                className="px-7 py-3 rounded-md border border-white/80 bg-white/10 backdrop-blur-xs text-white font-semibold text-sm md:text-base hover:bg-white/20 hover:border-white transition-all shadow-md hover:-translate-y-0.5"
              >
                {currentBanner.secondaryButtonText}
              </Link>
            )}
          </div>
        </div>
      </Container>

      {/* Navigation Arrows (Only shown when multiple banners exist) */}
      {slideCount > 1 && (
        <>
          <button
            type="button"
            onClick={prevSlide}
            aria-label="Previous Banner Slide"
            className="absolute left-4 top-1/2 -translate-y-1/2 z-20 h-10 w-10 md:h-12 md:w-12 rounded-full bg-black/30 hover:bg-black/60 border border-white/20 backdrop-blur-xs text-white flex items-center justify-center transition-all opacity-70 hover:opacity-100 hover:scale-110 cursor-pointer"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
          <button
            type="button"
            onClick={nextSlide}
            aria-label="Next Banner Slide"
            className="absolute right-4 top-1/2 -translate-y-1/2 z-20 h-10 w-10 md:h-12 md:w-12 rounded-full bg-black/30 hover:bg-black/60 border border-white/20 backdrop-blur-xs text-white flex items-center justify-center transition-all opacity-70 hover:opacity-100 hover:scale-110 cursor-pointer"
          >
            <ChevronRight className="h-6 w-6" />
          </button>

          {/* Slide Indicator Dots / Pills */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2.5">
            {banners.map((_, idx) => (
              <button
                key={`indicator-${idx}`}
                type="button"
                onClick={() => setCurrentIndex(idx)}
                aria-label={`Go to slide ${idx + 1}`}
                className={`transition-all duration-300 rounded-full cursor-pointer ${
                  idx === currentIndex
                    ? "w-8 h-2.5 bg-[#ffb300]"
                    : "w-2.5 h-2.5 bg-white/50 hover:bg-white/80"
                }`}
              />
            ))}
          </div>
        </>
      )}
    </section>
  );
}
