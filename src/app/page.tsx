"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useLanguage } from "@/context/LanguageContext";
import { Card, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import {
  Search,
  ArrowRight,
  Play,
  Building2,
  FileText,
  Users,
  BarChart3,
  GraduationCap,
  PieChart,
  Target,
  Sparkles,
  School,
  CheckCircle,
  Layers,
  FileCheck2,
  ChevronRight,
  ExternalLink,
} from "lucide-react";

// Hero Slides Definition — 2 panoramic assets communicating accessibility and inclusive education in Bihar
interface HeroSlide {
  id: string;
  src: string;
  alt: string;
  alt_hi: string;
  title: string;
  title_hi: string;
  objectPosition: string;
}

const HERO_SLIDES: HeroSlide[] = [
  {
    id: "slide-1",
    src: "/Campus Sunset Learning by the River-opt.png",
    alt: "Student in wheelchair and mentor overlooking Danapur riverside and Patna horizon at sunset from accessible school balcony",
    alt_hi: "दानापुर गंगा तट और पटना क्षितिज के सामने सुगम्य विद्यालय बालकनी से सूर्यास्त देखते हुए शिक्षक और व्हीलचेयर पर छात्र",
    title: "Campus Sunset Learning by the River",
    title_hi: "नदी तट पर सूर्यास्त के समय समावेशी अध्ययन",
    objectPosition: "object-[45%_center] md:object-[50%_center] lg:object-center",
  },
  {
    id: "slide-2",
    src: "/Inclusive School Pathway at Sunrise-opt.png",
    alt: "Smiling student in wheelchair moving forward on accessible school pathway with stainless handrails and tactile paving at sunrise",
    alt_hi: "सूर्योदय के समय स्टेनलेस हैंडरेल और स्पर्शनीय पेविंग युक्त सुगम्य विद्यालय मार्ग पर आगे बढ़ती मुस्कुराती दिव्यांग छात्रा",
    title: "Inclusive School Pathway at Sunrise",
    title_hi: "सूर्योदय के समय सुगम्य विद्यालय पथ",
    objectPosition: "object-[60%_center] md:object-[55%_center] lg:object-center",
  },
  {
    id: "slide-3",
    src: "/Hopeful Journey to School-opt.png",
    alt: "Student with backpack in wheelchair moving forward along accessible school corridor with stainless handrails and ramp towards sunny campus",
    alt_hi: "धूप खिली सुबह में सुगम्य विद्यालय कॉरिडोर और स्टेनलेस हैंडरेल युक्त रैंप पर आगे बढ़ता व्हीलचेयर युक्त छात्र",
    title: "Hopeful Journey to School",
    title_hi: "विद्यालय की ओर आशावादी सफर",
    objectPosition: "object-[65%_center] md:object-[60%_center] lg:object-center",
  },
];

// 4-item continuous track: [Slide 1, Slide 2, Slide 3, Slide 1 clone] for seamless infinite right-to-left glide
const DISPLAY_SLIDES: HeroSlide[] = [
  HERO_SLIDES[0],
  HERO_SLIDES[1],
  HERO_SLIDES[2],
  {
    ...HERO_SLIDES[0],
    id: "slide-1-clone",
  },
];

export default function HomePage() {
  const { locale, t } = useLanguage();
  const isHindi = locale === "hi";

  const [firestoreContent, setFirestoreContent] = useState<any>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(true);
  const [isPaused, setIsPaused] = useState(false);

  // Automatic smooth slide rotation every 5.5 seconds; pauses on hover or focus
  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => {
        if (prev < HERO_SLIDES.length) return prev + 1;
        return 1;
      });
    }, 5500);

    return () => clearInterval(interval);
  }, [isPaused]);

  // Seamless snap back when reaching clone slide (index 3) so forward slide continues infinitely without flicker
  const handleTransitionEnd = (e: React.TransitionEvent<HTMLDivElement>) => {
    if (e.target !== e.currentTarget) return;
    if (currentIndex === HERO_SLIDES.length) {
      setIsTransitioning(false);
      setCurrentIndex(0);
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setIsTransitioning(true);
        });
      });
    }
  };

  // Safety fallback for transitionend in backgrounded tabs
  useEffect(() => {
    if (currentIndex === HERO_SLIDES.length && isTransitioning) {
      const timer = setTimeout(() => {
        setIsTransitioning(false);
        setCurrentIndex(0);
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            setIsTransitioning(true);
          });
        });
      }, 1250);
      return () => clearTimeout(timer);
    }
  }, [currentIndex, isTransitioning]);

  useEffect(() => {
    let cancelled = false;
    // Defer loading site content so initial render, FCP and LCP are instantaneous
    const timer = setTimeout(async () => {
      try {
        const { db } = await import("@/lib/firebase/firestore");
        if (!db || cancelled) return;
        const { doc, getDoc } = await import("firebase/firestore");
        const homeDoc = await getDoc(doc(db, "siteContent", "home"));
        if (!cancelled && homeDoc.exists()) {
          setFirestoreContent(homeDoc.data());
        }
      } catch (err) {
        // Fallback to static copy
      }
    }, 400);

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, []);

  // Bilingual Headlines matching Image 1
  const heroHeadlineHindi =
    firestoreContent?.heroHindi ||
    "हर बच्चे के लिए\nसुगम विद्यालय,\nहर बच्चे के लिए समान शिक्षा।";

  const heroHeadlineEnglish =
    firestoreContent?.heroTitleEn ||
    "Accessible Schools\nfor Every Child,\nEqual Education for All.";

  const heroSubline = isHindi
    ? firestoreContent?.heroSublineHi ||
      "दानापुर, पटना, बिहार में विद्यालय सुगम्यता शोध एवं समावेशी शिक्षा को बढ़ावा।"
    : firestoreContent?.heroEnglish ||
      "Researching School Accessibility and Advancing Inclusive Education in Danapur, Patna, Bihar.";

  return (
    <div className="flex flex-col w-full bg-[#FCFDFE]">
      {/* =========================================================================
          HERO SECTION — Full-width Panoramic Background Slider with Smooth Slide Animation
          ========================================================================= */}
      <section
        className="relative w-full overflow-hidden min-h-[500px] sm:min-h-[540px] md:min-h-[580px] lg:min-h-[620px] xl:min-h-[660px] flex items-center border-b border-slate-100 group/hero"
        aria-labelledby="hero-heading"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        onFocus={() => setIsPaused(true)}
        onBlur={() => setIsPaused(false)}
      >
        {/* Full-width Panoramic Hero Background Slider Track with Butter-Smooth Hardware-Accelerated Slide Animation */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          <div
            className="flex w-[400%] h-full motion-reduce:!transition-none"
            style={{
              transform: `translate3d(-${(currentIndex * 100) / DISPLAY_SLIDES.length}%, 0, 0)`,
              transition: isTransitioning
                ? "transform 1100ms cubic-bezier(0.22, 1, 0.36, 1)"
                : "none",
              willChange: "transform",
            }}
            onTransitionEnd={handleTransitionEnd}
          >
            {DISPLAY_SLIDES.map((slide, idx) => (
              <div
                key={slide.id}
                aria-hidden={idx !== (currentIndex === HERO_SLIDES.length ? 0 : currentIndex)}
                className="w-1/4 h-full shrink-0 relative overflow-hidden"
              >
                <Image
                  src={slide.src}
                  alt={isHindi ? slide.alt_hi : slide.alt}
                  fill
                  priority={idx === 0}
                  quality={85}
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 100vw, 1920px"
                  className={`object-cover select-none ${slide.objectPosition}`}
                />
              </div>
            ))}
          </div>

          {/* Soft atmospheric gradient on left to ensure crisp text contrast over sky area without obscuring image */}
          <div
            className="absolute inset-0 z-[2] bg-gradient-to-r from-white/70 via-white/25 to-transparent md:from-white/50 md:via-white/10 md:to-transparent lg:from-white/35 lg:via-transparent lg:to-transparent pointer-events-none"
            aria-hidden="true"
          />

          {/* Subtle bottom transition into page background */}
          <div
            className="absolute bottom-0 left-0 right-0 z-[2] h-10 sm:h-14 bg-gradient-to-t from-[#FCFDFE] via-[#FCFDFE]/40 to-transparent pointer-events-none"
            aria-hidden="true"
          />
        </div>

        {/* Content Container positioned over the left/sky area matching Reference Screenshot */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full relative z-10 py-14 sm:py-20 lg:py-24">
          <div className="max-w-xl lg:max-w-lg xl:max-w-xl space-y-5 sm:space-y-6 text-left">
            {/* Primary Headline matching Reference Image typography & colors */}
            <h1
              id="hero-heading"
              className="text-4xl sm:text-5xl lg:text-[46px] xl:text-[50px] font-black tracking-tight leading-[1.18] font-sans"
            >
              {isHindi ? (
                <>
                  <span className="block text-[#0B2D52]">हर बच्चे के लिए</span>
                  <span className="block text-[#078F8A]">सुगम विद्यालय,</span>
                  <span className="block text-[#0B2D52]">हर बच्चे के लिए समान शिक्षा।</span>
                </>
              ) : (
                <>
                  <span className="block text-[#078F8A]">Accessible Schools</span>
                  <span className="block text-[#0B2D52]">for Every Child,</span>
                  <span className="block text-[#0B2D52]">Equal Education for All.</span>
                </>
              )}
            </h1>

            {/* Supporting Text matching Reference Screenshot */}
            <p className="text-base sm:text-lg text-[#243B53] max-w-xl leading-relaxed font-normal">
              Researching School Accessibility and Advancing Inclusive Education in Danapur, Patna, Bihar.
            </p>

            {/* Action Buttons matching Reference Screenshot */}
            <div className="pt-2 flex flex-wrap items-center gap-4">
              {/* Primary Action Button: Explore School Accessibility */}
              <Link href="/schools">
                <button
                  type="button"
                  className="inline-flex items-center gap-2.5 bg-[#0B2D52] hover:bg-[#07213d] text-white px-6 sm:px-7 py-3.5 sm:py-4 rounded-full font-bold text-sm sm:text-base shadow-md hover:shadow-lg transition-all active:scale-95 focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-teal-600 focus-visible:ring-offset-2 cursor-pointer"
                >
                  <Search className="w-4 h-4 text-teal-300 stroke-[2.5]" aria-hidden="true" />
                  <span>
                    {isHindi ? "Explore School Accessibility" : "Explore School Accessibility"}
                  </span>
                  <ArrowRight className="w-4 h-4 stroke-[2.5]" aria-hidden="true" />
                </button>
              </Link>

              {/* Secondary Action Button: Watch Project Video */}
              <Link href="/awareness-advocacy">
                <button
                  type="button"
                  className="inline-flex items-center gap-2.5 bg-white hover:bg-slate-50 text-[#0B2D52] border border-slate-200/90 hover:border-teal-500 px-6 sm:px-7 py-3.5 sm:py-4 rounded-full font-bold text-sm sm:text-base shadow-xs hover:shadow-md transition-all active:scale-95 focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-teal-600 focus-visible:ring-offset-2 cursor-pointer"
                >
                  <span className="w-6 h-6 rounded-full bg-[#0284C7] text-white flex items-center justify-center shrink-0">
                    <Play className="w-3.5 h-3.5 fill-white ml-0.5" aria-hidden="true" />
                  </span>
                  <span>Watch Project Video</span>
                </button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 2: FOUR FEATURE CARDS — Matching Image 1
          ========================================================================= */}
      <section
        className="py-10 sm:py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full"
        aria-label={isHindi ? "प्रमुख सुविधाएं" : "Key Platform Features"}
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* Card 1: Explore School Accessibility (Soft Blue) */}
          <Link
            href="/schools"
            className="group flex flex-col justify-between p-6 rounded-2xl bg-[#EAF6FD] border border-[#D4EDFD] hover:border-[#0284C7]/50 hover:shadow-lg transition-all duration-200 focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-blue-500"
          >
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-xl bg-white shadow-xs flex items-center justify-center text-[#0284C7] shrink-0">
                <School className="w-6 h-6 stroke-[2]" aria-hidden="true" />
              </div>
              <div className="space-y-1.5">
                <h2 className="text-base sm:text-lg font-bold text-[#0B2D52] group-hover:text-[#0284C7] transition-colors">
                  Explore School Accessibility
                </h2>
                <p className="text-xs sm:text-[13px] text-slate-600 leading-relaxed font-normal">
                  Find schools, audit status and available facilities in Danapur.
                </p>
              </div>
            </div>
            <div className="pt-4 flex justify-end">
              <span className="w-8 h-8 rounded-full bg-[#0284C7] text-white flex items-center justify-center shadow-xs group-hover:translate-x-1 transition-transform">
                <ChevronRight className="w-4 h-4 stroke-[2.5]" aria-hidden="true" />
              </span>
            </div>
          </Link>

          {/* Card 2: Read Guidelines (Soft Mint Green) */}
          <Link
            href="/guidelines"
            className="group flex flex-col justify-between p-6 rounded-2xl bg-[#EAF7F0] border border-[#CEF0DD] hover:border-[#0D9488]/50 hover:shadow-lg transition-all duration-200 focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-teal-500"
          >
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-xl bg-white shadow-xs flex items-center justify-center text-[#0D9488] shrink-0">
                <FileText className="w-6 h-6 stroke-[2]" aria-hidden="true" />
              </div>
              <div className="space-y-1.5">
                <h2 className="text-base sm:text-lg font-bold text-[#0B2D52] group-hover:text-[#0D9488] transition-colors">
                  Read Guidelines
                </h2>
                <p className="text-xs sm:text-[13px] text-slate-600 leading-relaxed font-normal">
                  Laws, policies and accessibility standards in simple Hindi.
                </p>
              </div>
            </div>
            <div className="pt-4 flex justify-end">
              <span className="w-8 h-8 rounded-full bg-[#0D9488] text-white flex items-center justify-center shadow-xs group-hover:translate-x-1 transition-transform">
                <ChevronRight className="w-4 h-4 stroke-[2.5]" aria-hidden="true" />
              </span>
            </div>
          </Link>

          {/* Card 3: Participate in Survey (Soft Amber) */}
          <Link
            href="/survey"
            prefetch={false}
            className="group flex flex-col justify-between p-6 rounded-2xl bg-[#FFF6E3] border border-[#FDE6BA] hover:border-[#D97706]/50 hover:shadow-lg transition-all duration-200 focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-amber-500"
          >
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-xl bg-white shadow-xs flex items-center justify-center text-[#D97706] shrink-0">
                <Users className="w-6 h-6 stroke-[2]" aria-hidden="true" />
              </div>
              <div className="space-y-1.5">
                <h2 className="text-base sm:text-lg font-bold text-[#0B2D52] group-hover:text-[#D97706] transition-colors">
                  Participate in Survey
                </h2>
                <p className="text-xs sm:text-[13px] text-slate-600 leading-relaxed font-normal">
                  Help us understand school accessibility in Danapur.
                </p>
              </div>
            </div>
            <div className="pt-4 flex justify-end">
              <span className="w-8 h-8 rounded-full bg-[#D97706] text-white flex items-center justify-center shadow-xs group-hover:translate-x-1 transition-transform">
                <ChevronRight className="w-4 h-4 stroke-[2.5]" aria-hidden="true" />
              </span>
            </div>
          </Link>

          {/* Card 4: View Research Findings (Soft Lavender) */}
          <Link
            href="/reports"
            className="group flex flex-col justify-between p-6 rounded-2xl bg-[#F2EEFF] border border-[#DFD5FD] hover:border-[#7C3AED]/50 hover:shadow-lg transition-all duration-200 focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-purple-500"
          >
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-xl bg-white shadow-xs flex items-center justify-center text-[#7C3AED] shrink-0">
                <BarChart3 className="w-6 h-6 stroke-[2]" aria-hidden="true" />
              </div>
              <div className="space-y-1.5">
                <h2 className="text-base sm:text-lg font-bold text-[#0B2D52] group-hover:text-[#7C3AED] transition-colors">
                  View Research Findings
                </h2>
                <p className="text-xs sm:text-[13px] text-slate-600 leading-relaxed font-normal">
                  Explore data, reports and insights from the field.
                </p>
              </div>
            </div>
            <div className="pt-4 flex justify-end">
              <span className="w-8 h-8 rounded-full bg-[#7C3AED] text-white flex items-center justify-center shadow-xs group-hover:translate-x-1 transition-transform">
                <ChevronRight className="w-4 h-4 stroke-[2.5]" aria-hidden="true" />
              </span>
            </div>
          </Link>
        </div>
      </section>

      {/* =========================================================================
          SECTION 3: RESEARCH STATISTICS STRIP — Matching Image 2
          ========================================================================= */}
      <section
        className="py-4 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full"
        aria-label="Research Survey Statistics"
      >
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-6 sm:p-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 divide-y sm:divide-y-0 sm:divide-x divide-slate-100">
            {/* Stat 1: 05 Schools Surveyed */}
            <div className="flex items-center gap-4 pt-4 sm:pt-0 sm:px-4 first:sm:pl-0">
              <div className="w-12 h-12 rounded-xl bg-blue-50 text-[#0B2D52] flex items-center justify-center shrink-0">
                <GraduationCap className="w-6 h-6" aria-hidden="true" />
              </div>
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <span className="text-3xl font-black text-[#0B2D52] tabular-nums">05</span>
                  <span className="bg-[#EAF6FD] text-[#0284C7] border border-[#D4EDFD] text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                    Demo Data
                  </span>
                </div>
                <span className="text-sm font-bold text-slate-800 block">
                  Schools Surveyed
                </span>
                <span className="text-[11px] text-slate-400 block font-normal">
                  (Illustrative only – not actual Danapur data)
                </span>
              </div>
            </div>

            {/* Stat 2: 03 Government Schools */}
            <div className="flex items-center gap-4 pt-4 sm:pt-0 sm:px-4">
              <div className="w-12 h-12 rounded-xl bg-teal-50 text-[#0D9488] flex items-center justify-center shrink-0">
                <Building2 className="w-6 h-6" aria-hidden="true" />
              </div>
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <span className="text-3xl font-black text-[#0B2D52] tabular-nums">03</span>
                  <span className="bg-[#EAF7F0] text-[#0D9488] border border-[#CEF0DD] text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                    Demo Data
                  </span>
                </div>
                <span className="text-sm font-bold text-slate-800 block">
                  Government Schools
                </span>
                <span className="text-[11px] text-slate-400 block font-normal">
                  (Illustrative only – not actual Danapur data)
                </span>
              </div>
            </div>

            {/* Stat 3: 02 Private Schools */}
            <div className="flex items-center gap-4 pt-4 sm:pt-0 sm:px-4">
              <div className="w-12 h-12 rounded-xl bg-blue-50 text-[#2563EB] flex items-center justify-center shrink-0">
                <School className="w-6 h-6" aria-hidden="true" />
              </div>
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <span className="text-3xl font-black text-[#0B2D52] tabular-nums">02</span>
                  <span className="bg-[#EAF6FD] text-[#2563EB] border border-[#D4EDFD] text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                    Demo Data
                  </span>
                </div>
                <span className="text-sm font-bold text-slate-800 block">
                  Private Schools
                </span>
                <span className="text-[11px] text-slate-400 block font-normal">
                  (Illustrative only – not actual Danapur data)
                </span>
              </div>
            </div>

            {/* Stat 4: 60% Example Score */}
            <div className="flex items-center gap-4 pt-4 sm:pt-0 sm:px-4 last:sm:pr-0">
              <div className="w-12 h-12 rounded-xl bg-sky-50 text-[#0284C7] flex items-center justify-center shrink-0">
                <PieChart className="w-6 h-6" aria-hidden="true" />
              </div>
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <span className="text-3xl font-black text-[#0B2D52] tabular-nums">60%</span>
                  <span className="bg-[#EAF6FD] text-[#0284C7] border border-[#D4EDFD] text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                    Demo Data
                  </span>
                </div>
                <span className="text-sm font-bold text-slate-800 block">
                  Example Accessibility Score
                </span>
                <span className="text-[11px] text-slate-400 block font-normal">
                  (Illustrative only – not actual Danapur data)
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 4: ABOUT THE PROJECT SECTION — Matching Image 1
          ========================================================================= */}
      <section
        className="py-14 sm:py-18 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full"
        aria-labelledby="about-section-heading"
      >
        <div className="space-y-6">
          {/* Small Section Label matching Image 1 */}
          <div className="flex items-center gap-2">
            <span className="w-6 h-0.5 bg-[#078F8A] rounded-full" aria-hidden="true" />
            <span className="text-xs font-bold uppercase tracking-widest text-[#078F8A]">
              {isHindi ? "परियोजना परिचय" : "ABOUT THE PROJECT"}
            </span>
          </div>

          {/* Three-part Desktop Layout matching Image 1 */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-stretch">
            {/* Left Column: Main Bold Heading */}
            <div className="lg:col-span-5 flex flex-col justify-center">
              <h2
                id="about-section-heading"
                className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#0B2D52] leading-tight tracking-tight font-sans"
              >
                {isHindi
                  ? "समावेशी बिहार के लिए सुगम विद्यालयों का निर्माण"
                  : "Building Accessible Schools for an Inclusive Bihar"}
              </h2>
            </div>

            {/* Middle Column: Detailed Description */}
            <div className="lg:col-span-4 flex flex-col justify-center">
              <p className="text-slate-600 text-sm sm:text-base leading-relaxed font-normal">
                {isHindi
                  ? "सुगम्य शिक्षा बिहार, NCPEDP फेलोशिप शोध परियोजना के अंतर्गत एक डिजिटल शोध एवं संसाधन मंच है, जो दानापुर, पटना के विद्यालयों में भौतिक बुनियादी ढांचे की सुगम्यता का अध्ययन करने और सभी बच्चों के लिए समावेशी शिक्षा को बढ़ावा देने पर केंद्रित है।"
                  : "Sugamya Shiksha Bihar is a digital research and resource platform under the NCPEDP Fellowship Research Project, focused on understanding physical infrastructure accessibility of schools in Danapur, Patna and advancing inclusive education for all children."}
              </p>
            </div>

            {/* Right Column: "Our Goal" Card matching Image 2 */}
            <div className="lg:col-span-3">
              <div className="h-full bg-[#F0FDF9] border border-teal-100 rounded-2xl p-6 sm:p-7 shadow-xs flex flex-col justify-between space-y-4">
                <div className="space-y-3">
                  <div className="w-11 h-11 rounded-full bg-teal-600/10 text-[#078F8A] flex items-center justify-center shadow-xs">
                    <Target className="w-6 h-6 stroke-[2.2]" aria-hidden="true" />
                  </div>
                  <div>
                    <h3 className="text-base sm:text-lg font-black text-[#0B2D52] mb-1">
                      {isHindi ? "हमारा लक्ष्य" : "Our Goal"}
                    </h3>
                    <p className="text-xs sm:text-[13px] text-slate-700 leading-relaxed font-normal">
                      {isHindi
                        ? "ऐसे सुगम, समावेशी और स्वागत योग्य विद्यालय बनाना जहाँ हर बच्चा सीख सके और आगे बढ़ सके।"
                        : "To create accessible, inclusive and welcoming schools where every child can learn and thrive."}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 5: COMMUNITY AWARENESS & ADVOCACY (PRD Sections 5, 8 & 9)
          ========================================================================= */}
      <section
        className="py-14 sm:py-16 px-4 sm:px-6 lg:px-8 bg-white border-t border-slate-100"
        aria-labelledby="campaign-heading"
      >
        <div className="max-w-7xl mx-auto space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <span className="w-5 h-0.5 bg-[#078F8A] rounded-full" aria-hidden="true" />
                <span className="text-xs font-bold uppercase tracking-wider text-[#078F8A]">
                  {isHindi ? "जागरूकता एवं सहभागिता" : "ADVOCACY & ENGAGEMENT"}
                </span>
              </div>
              <h2
                id="campaign-heading"
                className="text-2xl sm:text-3xl font-extrabold text-[#0B2D52] tracking-tight"
              >
                {isHindi ? "जागरूकता एवं सामुदायिक पैरवी" : "Awareness & Community Advocacy"}
              </h2>
            </div>
            <Link href="/awareness-advocacy">
              <Button variant="ghost" size="sm" rightIcon={<ArrowRight className="w-4 h-4" />}>
                {isHindi ? "सभी अभियान देखें" : "View All Campaigns"}
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                id: 1,
                type: isHindi ? "पोस्टर एवं रील श्रृंखला" : "Poster & Reel Series",
                title:
                  isHindi
                    ? "स्कूल का रैंप वास्तव में सुगम कब बनता है?"
                    : "What Makes a School Ramp Usable?",
                desc:
                  isHindi
                    ? "एक सचित्र मार्गदर्शिका जो 1:12 ढलान वाले सुरक्षित रैंप और खतरनाक अत्यधिक ढलान वाले रैंप के बीच अंतर समझाती है।"
                    : "A visual guide illustrating the difference between a 1:12 gentle ramp with double handrails and an unsafe steep ramp.",
              },
              {
                id: 2,
                type: isHindi ? "कार्यशाला" : "Workshop",
                title:
                  isHindi
                    ? "दानापुर शिक्षक अभिगम्यता संवाद"
                    : "Danapur Educators Accessibility Dialogue",
                desc:
                  isHindi
                    ? "स्कूल के प्रधानाध्यापकों और शिक्षकों के साथ 'उचित समायोजन' (Reasonable Accommodation) और न्यूनतम बदलावों पर संवादात्मक बैठक।"
                    : "Interactive workshop bringing together school principals and teachers on reasonable accommodation and basic modifications.",
              },
              {
                id: 3,
                type: isHindi ? "वीडियो व्याख्यान" : "Video Explainer",
                title:
                  isHindi
                    ? "स्कूलों के लिए RPwD अधिनियम 2016 को समझें"
                    : "Understanding RPwD Act 2016 for Schools",
                desc:
                  isHindi
                    ? "हिन्दी सबटाइटल के साथ संक्षिप्त शैक्षणिक वीडियो जो स्कूलों को सुगम बनाने के कानूनी दायित्व को स्पष्ट करता है।"
                    : "Short educational video with Hindi subtitles explaining the statutory obligation to make school buildings accessible.",
              },
            ].map((item) => (
              <Card
                key={item.id}
                as="article"
                className="flex flex-col justify-between p-6 rounded-2xl border-slate-200/90 hover:border-[#078F8A] hover:shadow-md transition-all bg-white"
              >
                <div className="space-y-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#078F8A] bg-teal-50 px-2.5 py-1 rounded-md inline-block">
                    {item.type}
                  </span>
                  <CardTitle as="h3" className="text-base sm:text-lg text-[#0B2D52]">
                    {item.title}
                  </CardTitle>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                    {item.desc}
                  </p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 6: BEFORE & AFTER TRACKER HIGHLIGHT (Feature E — PRD 6.2-E)
          ========================================================================= */}
      <section
        className="py-14 sm:py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-white to-[#F8FBFD] border-t border-slate-100"
        aria-labelledby="tracker-heading"
      >
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="max-w-3xl space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-teal-50 text-teal-800 border border-teal-200">
                <Sparkles className="w-3.5 h-3.5 text-[#078F8A]" aria-hidden="true" />
                <span>
                  {isHindi ? "प्रमुख शोध विशेषता E (PRD 6.2-E)" : "Core Feature E (PRD 6.2-E)"}
                </span>
              </div>
              <h2
                id="tracker-heading"
                className="text-2xl sm:text-3xl font-extrabold text-[#0B2D52] tracking-tight"
              >
                {isHindi
                  ? "पहले और बाद: सुगम्यता सुधार ट्रैकर"
                  : "Before & After: Accessibility Impact Tracker"}
              </h2>
              <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-normal">
                {isHindi
                  ? "विद्यालयों में पाई गई भौतिक बाधा → वैधानिक सुझाव → धरातल पर हुआ प्रमाणित सुधार। वास्तविक फोटो साक्ष्य और समयसीमा के साथ।"
                  : "Per-school journey: Barrier Identified → Standard Suggestion Given → Verified Improvement Achieved. Backed by field photographic evidence."}
              </p>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <Link href="/tracker">
                <Button variant="primary" size="md" rightIcon={<ArrowRight className="w-4 h-4" />}>
                  {isHindi ? "सुधार ट्रैकर देखें" : "Explore Impact Tracker"}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
