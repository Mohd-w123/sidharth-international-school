"use client";

import Image from "next/image";
import { Container } from "@/components/layout/container";
import {
  GraduationCap,
  Award,
  BookOpen,
  Bus,
} from "lucide-react";

export interface HeroContent {
  videoUrl?: string;
  backgroundVideo?: string;
  posterImage?: string;
  backgroundImage?: string;
}

interface HeroBannerSliderProps {
  content: Record<string, unknown>;
}

export function HeroBannerSlider({ content }: HeroBannerSliderProps) {
  // Support dynamic videoUrl or backgroundVideo with fallback to user's video
  const videoUrl =
    (content.videoUrl as string) ||
    (content.backgroundVideo as string) ||
    (content.video as string) ||
    "/slider-video/slider-video.mp4";

  const posterImage =
    (content.posterImage as string) ||
    (content.backgroundImage as string) ||
    (Array.isArray(content.banners) && (content.banners[0]?.image as string)) ||
    "/uploads/campus/morning-assembly-ground.jpg";

  return (
    <div className="relative">
      {/* 
        PURE VIDEO HERO SECTION
        Clean, uninterrupted, bright video with zero text overlay and zero dark opacity.
      */}
      <section className="relative w-full h-[55vh] sm:h-[65vh] md:h-[75vh] lg:h-[84vh] overflow-hidden bg-black">
        {videoUrl ? (
          <video
            key={videoUrl}
            autoPlay
            loop
            muted
            playsInline
            preload="auto"
            poster={posterImage}
            className="w-full h-full object-cover object-center"
          >
            <source src={videoUrl} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        ) : (
          <Image
            src={posterImage}
            alt="School Video Banner"
            fill
            priority
            className="object-cover object-center"
            sizes="100vw"
          />
        )}
      </section>

      {/* 4 Quick Pillars Ribbon directly beneath Hero */}
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
