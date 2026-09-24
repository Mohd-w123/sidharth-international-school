"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/layout/container";
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";

export interface NewsItem {
  _id?: string;
  id?: string;
  title: string;
  slug?: string;
  url?: string;
  excerpt?: string;
  description?: string;
  image?: string;
  featuredImage?: string;
  category?: string;
  date?: string;
  publishedAt?: string | Date;
}

interface NewsSectionSliderProps {
  title?: string;
  subtitle?: string;
  content?: Record<string, unknown>;
  latestNews?: NewsItem[];
}

const DEFAULT_SAMPLE_NEWS: NewsItem[] = [
  {
    title: "Inter-House Sports Competitions: Celebrating Talent, Skills & Sportsmanship.",
    slug: "inter-house-sports-competitions",
    date: "8th - 10th July'26",
    category: "EDUCATION WORLD AWARD",
    excerpt:
      "The Inter-House Sports Competitions for Grades I to XI were successfully organised, fostering teamwork, discipline, and sporting spirit among students.",
    image: "https://images.unsplash.com/photo-1577495508048-b635879837f1?q=80&w=1200&auto=format&fit=crop",
  },
  {
    title: "Investiture Ceremony 2026–27 | Saint Lawrence Public School. Empowering Young Minds Today, Inspiring Tomorrow's Leaders.",
    slug: "investiture-ceremony-2026-27",
    date: "18th July'26",
    category: "LEADERSHIP & CIVICS",
    excerpt:
      "A momentous day as the newly elected student council takes the pledge to uphold the values, integrity, and honor of Saint Lawrence Public School.",
    image: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?q=80&w=1200&auto=format&fit=crop",
  },
  {
    title: "Annual Science & Innovation Exhibition: Young Scientists Shaping the Future.",
    slug: "annual-science-innovation-exhibition",
    date: "25th August'26",
    category: "STEM & INNOVATION",
    excerpt:
      "Students showcased cutting-edge science models, robotics prototypes, and sustainable environmental solutions in our annual STEM exhibition.",
    image: "https://images.unsplash.com/photo-1581092921461-eab62e97a780?q=80&w=1200&auto=format&fit=crop",
  },
];

export function NewsSectionSlider({
  title = "Explore Latest News",
  subtitle = "Stay up to date with events, activities, and updates from one of the best CBSE schools in Jaipur.",
  content = {},
  latestNews = [],
}: NewsSectionSliderProps) {
  // Normalize items from DB latestNews, content.items, or default sample news
  const contentItems = Array.isArray(content.items) ? (content.items as NewsItem[]) : [];

  const rawList: NewsItem[] =
    latestNews.length > 0
      ? latestNews
      : contentItems.length > 0
        ? contentItems
        : DEFAULT_SAMPLE_NEWS;

  const newsList: NewsItem[] = rawList.map((item, idx) => {
    const itemImage = item.featuredImage || item.image || "https://images.unsplash.com/photo-1577495508048-b635879837f1?q=80&w=1200&auto=format&fit=crop";
    const itemSlug = item.slug || `news-item-${idx + 1}`;
    const itemDate =
      item.date ||
      (item.publishedAt
        ? new Date(item.publishedAt).toLocaleDateString("en-IN", {
            day: "numeric",
            month: "short",
            year: "numeric",
          })
        : "Latest News");

    return {
      _id: item._id || item.id || String(idx),
      title: item.title,
      slug: itemSlug,
      url: item.url || `/news/${itemSlug}`,
      excerpt: item.excerpt || item.description || "",
      image: itemImage,
      category: item.category || "CAMPUS UPDATE",
      date: itemDate,
    };
  });

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const total = newsList.length;

  const nextSlide = useCallback(() => {
    if (total <= 1) return;
    setCurrentIndex((prev) => (prev + 1) % total);
  }, [total]);

  const prevSlide = useCallback(() => {
    if (total <= 1) return;
    setCurrentIndex((prev) => (prev - 1 + total) % total);
  }, [total]);

  // Auto-play every 6 seconds, paused when hovering over card
  useEffect(() => {
    if (total <= 1 || isHovered) return;
    const timer = setInterval(() => {
      nextSlide();
    }, 6000);
    return () => clearInterval(timer);
  }, [total, isHovered, nextSlide]);

  if (newsList.length === 0) return null;

  const current = newsList[currentIndex] || newsList[0]!;

  return (
    <section className="py-16 md:py-24 bg-[#f8fafc]/60">
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
          <div className="w-16 h-1 bg-[#ffb300] mx-auto mt-4 rounded-full" />
        </div>

        {/* Main Featured News Card Container */}
        <div
          className="w-full max-w-6xl xl:max-w-7xl mx-auto"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <div className="rounded-2xl border border-slate-200/90 shadow-xl bg-white overflow-hidden transition-all duration-300">
            <div className="grid grid-cols-1 md:grid-cols-12 min-h-[400px] md:min-h-[460px]">
              {/* Left Column: Featured News Image */}
              <div className="md:col-span-7 relative min-h-[260px] md:min-h-full bg-slate-900 overflow-hidden group">
                {current.image && (
                  <Link href={current.url || `/news/${current.slug}`} className="block w-full h-full">
                    <Image
                      key={`news-img-${currentIndex}`}
                      src={current.image}
                      alt={current.title}
                      fill
                      className="object-cover object-center transition-transform duration-700 group-hover:scale-105"
                      sizes="(max-width: 768px) 100vw, 60vw"
                      unoptimized
                    />
                  </Link>
                )}

                {/* Yellow/Gold Category Badge in Top-Left */}
                {current.category && (
                  <div className="absolute top-4 left-4 z-10">
                    <span className="inline-block bg-[#ffb300] text-[#002a54] font-extrabold text-[10px] md:text-[11px] px-3 py-1 rounded-xs uppercase tracking-wider shadow-md">
                      {current.category}
                    </span>
                  </div>
                )}
              </div>

              {/* Right Column: News Content & Controls */}
              <div className="md:col-span-5 p-6 sm:p-8 md:p-10 flex flex-col justify-between bg-white">
                <div key={`news-text-${currentIndex}`} className="animate-in fade-in-50 duration-500">
                  {/* Date Tag */}
                  {current.date && (
                    <p className="text-[#004080] font-semibold text-xs md:text-sm tracking-wide mb-2.5">
                      {current.date}
                    </p>
                  )}

                  {/* Main Clickable Title */}
                  <Link
                    href={current.url || `/news/${current.slug}`}
                    className="block group"
                  >
                    <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-[#002a54] leading-snug tracking-tight mb-4 group-hover:text-[#004080] transition-colors line-clamp-3">
                      {current.title}
                    </h3>
                  </Link>

                  {/* Excerpt Paragraph */}
                  {current.excerpt && (
                    <p className="text-slate-600 text-xs sm:text-sm leading-relaxed line-clamp-4 font-normal">
                      {current.excerpt}
                    </p>
                  )}
                </div>

                {/* Bottom Navigation Controls */}
                <div className="pt-6 mt-4 border-t border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={prevSlide}
                      aria-label="Previous News Slide"
                      className="w-9 h-9 rounded-full border border-[#002a54]/30 text-[#002a54] hover:bg-[#002a54] hover:text-white hover:border-[#002a54] flex items-center justify-center transition-all duration-200 cursor-pointer"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={nextSlide}
                      aria-label="Next News Slide"
                      className="w-9 h-9 rounded-full border border-[#002a54]/30 text-[#002a54] hover:bg-[#002a54] hover:text-white hover:border-[#002a54] flex items-center justify-center transition-all duration-200 cursor-pointer"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                    <span className="text-xs font-semibold text-slate-500 ml-2 tracking-widest">
                      {currentIndex + 1} / {total}
                    </span>
                  </div>

                  <Link
                    href={current.url || `/news/${current.slug}`}
                    className="inline-flex items-center text-xs font-bold text-[#004080] hover:text-[#ffb300] transition-colors gap-1 group"
                  >
                    Read More
                    <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom News Preview Strip / Tabs */}
          {newsList.length > 1 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 mt-4">
              {newsList.slice(0, 3).map((item, idx) => {
                const isActive = idx === currentIndex;
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setCurrentIndex(idx)}
                    className={`text-left p-3.5 rounded-xl transition-all duration-300 border cursor-pointer ${
                      isActive
                        ? "bg-[#003d78] text-white border-[#003d78] shadow-md"
                        : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50 hover:border-slate-300"
                    }`}
                  >
                    <p
                      className={`text-[11px] font-bold mb-1 tracking-wider ${
                        isActive ? "text-[#ffb300]" : "text-slate-500"
                      }`}
                    >
                      {item.date}
                    </p>
                    <p className="text-xs font-semibold line-clamp-2 leading-snug">
                      {item.title}
                    </p>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </Container>
    </section>
  );
}
