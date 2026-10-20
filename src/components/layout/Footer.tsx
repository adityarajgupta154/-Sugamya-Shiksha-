"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { useLanguage } from "@/context/LanguageContext";

export function Footer() {
  const { locale, t } = useLanguage();

  return (
    <footer className="w-full bg-navy-950 text-slate-300 border-t-4 border-teal-600 mt-auto cv-footer">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12 mb-10">
          {/* Col 1: Project Identity */}
          <div className="md:col-span-5 space-y-4">
            <div className="flex items-center gap-3">
              <div className="relative shrink-0 flex items-center justify-center">
                <Image
                  src="/logo.png"
                  alt="Sugamya Shiksha Bihar Emblem"
                  width={56}
                  height={56}
                  sizes="56px"
                  className="h-12 w-12 aspect-square object-contain drop-shadow-xs"
                />
              </div>
              <span className="text-xl font-bold text-white tracking-tight">
                {t("site.title", "Sugamya Shiksha Bihar")}
              </span>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed max-w-md">
              {t("footer.aboutProject")}
            </p>
            <div className="pt-1 text-xs text-teal-300 font-medium">
              📍 {t("footer.location", "Patna, Bihar, India")}
            </div>
          </div>

          {/* Col 2: Navigation */}
          <div className="md:col-span-7 space-y-3">
            <h3 className="text-sm font-bold uppercase tracking-wider text-teal-400">
              {t("footer.quickLinks", "Quick Links")}
            </h3>
            <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-1 text-sm">
              <li>
                <Link
                  href="/schools"
                  className="hover:text-teal-300 transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-teal-400 rounded min-h-[44px] inline-flex items-center py-1.5"
                >
                  {t("nav.directory", "School Directory")}
                </Link>
              </li>
              <li>
                <Link
                  href="/guidelines"
                  className="hover:text-teal-300 transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-teal-400 rounded min-h-[44px] inline-flex items-center py-1.5"
                >
                  {t("nav.guidelines", "Guidelines Library")}
                </Link>
              </li>
              <li>
                <Link
                  href="/reports"
                  className="hover:text-teal-300 transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-teal-400 rounded min-h-[44px] inline-flex items-center py-1.5"
                >
                  {t("nav.dashboard", "Research Dashboard")}
                </Link>
              </li>
              <li>
                <Link
                  href="/map"
                  className="hover:text-teal-300 transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-teal-400 rounded min-h-[44px] inline-flex items-center py-1.5"
                >
                  {t("nav.map", "School Accessibility Map")}
                </Link>
              </li>
              <li>
                <Link
                  href="/tracker"
                  className="hover:text-teal-300 transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-teal-400 rounded min-h-[44px] inline-flex items-center py-1.5"
                >
                  {t("nav.tracker", "Before & After Tracker")}
                </Link>
              </li>
              <li>
                <Link
                  href="/survey"
                  className="hover:text-teal-300 transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-teal-400 rounded min-h-[44px] inline-flex items-center py-1.5"
                >
                  {locale === "hi" ? "समुदाय सर्वेक्षण 2026" : "Community Survey 2026"}
                </Link>
              </li>
              <li>
                <Link
                  href="/report-barrier"
                  className="hover:text-teal-300 transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-teal-400 rounded min-h-[44px] inline-flex items-center py-1.5"
                >
                  {t("nav.reportBarrier", "Report an Accessibility Barrier")}
                </Link>
              </li>
              <li>
                <Link
                  href="/community-voices"
                  className="hover:text-teal-300 transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-teal-400 rounded min-h-[44px] inline-flex items-center py-1.5"
                >
                  {t("nav.voices", "Community Voices")}
                </Link>
              </li>
              <li>
                <Link
                  href="/awareness-advocacy"
                  className="hover:text-teal-300 transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-teal-400 rounded min-h-[44px] inline-flex items-center py-1.5"
                >
                  {t("nav.advocacy", "Awareness & Advocacy")}
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom copyright line with high contrast (>= 4.5:1) and 44px tap targets */}
        <div className="pt-8 border-t border-navy-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-300 font-medium">
          <p>
            © {new Date().getFullYear()} Sugamya Shiksha Bihar. {t("footer.rights")}
          </p>
          <div className="flex items-center gap-4 flex-wrap justify-center">
            <Link
              href="/about"
              className="hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-teal-400 rounded min-h-[44px] flex items-center px-1"
            >
              {t("nav.about", "About & Contact")}
            </Link>
            <span aria-hidden="true">•</span>
            <Link
              href="/admin"
              prefetch={false}
              className="hover:text-teal-300 transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-teal-400 rounded min-h-[44px] flex items-center px-1"
            >
              {locale === "hi" ? "व्यवस्थापक" : "Admin"}
            </Link>
            <span aria-hidden="true">•</span>
            <span className="min-h-[44px] flex items-center px-1 text-slate-400">
              {locale === "hi" ? "पटना, बिहार, भारत" : "Patna, Bihar, India"}
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
