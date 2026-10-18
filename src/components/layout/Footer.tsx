"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { useLanguage } from "@/context/LanguageContext";
import { ShieldAlert, BookOpen, Heart, Building, CheckSquare, Info } from "lucide-react";

export function Footer() {
  const { locale, t } = useLanguage();

  return (
    <footer className="w-full bg-navy-950 text-slate-300 border-t-4 border-teal-600 mt-auto cv-footer">
      {/* Mandatory Disclaimers Strip */}
      <div className="bg-navy-900 border-b border-navy-800 py-3.5 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3 text-xs text-slate-300">
          <div className="flex items-center gap-2 text-amber-300">
            <ShieldAlert className="w-4 h-4 shrink-0" aria-hidden="true" />
            <span className="font-medium">
              {t(
                "common.scoreDisclaimer",
                "This is an academic research score based on standard indicators, not an official government certification."
              )}
            </span>
          </div>
          <div className="flex items-center gap-2 text-slate-400">
            <span className="font-semibold text-slate-200">
              {t("common.demoNotice", "Illustrative demo data — not actual Danapur survey findings.")}
            </span>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Col 1: Project Identity */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="relative shrink-0 flex items-center justify-center">
                <Image
                  src="/logo.png"
                  alt="Sugamya Shiksha Bihar Emblem"
                  width={96}
                  height={71}
                  sizes="96px"
                  className="h-10 w-auto object-contain drop-shadow-xs"
                />
              </div>
              <span className="text-xl font-bold text-white tracking-tight">
                {t("site.title", "Sugamya Shiksha Bihar")}
              </span>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed">
              {t("footer.aboutProject")}
            </p>
            <div className="pt-2 text-xs text-teal-300 font-medium">
              📍 {t("footer.location", "Danapur, Patna, Bihar, India")}
            </div>
          </div>

          {/* Col 2: Navigation */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold uppercase tracking-wider text-teal-400">
              {t("footer.quickLinks", "Quick Links")}
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/guidelines"
                  className="hover:text-teal-300 transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-teal-400 rounded"
                >
                  {t("nav.guidelines", "Guidelines Library")}
                </Link>
              </li>
              <li>
                <Link
                  href="/schools"
                  className="hover:text-teal-300 transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-teal-400 rounded"
                >
                  {t("nav.directory", "School Directory")}
                </Link>
              </li>
              <li>
                <Link
                  href="/reports"
                  className="hover:text-teal-300 transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-teal-400 rounded"
                >
                  {t("nav.dashboard", "Research Dashboard")}
                </Link>
              </li>
              <li>
                <Link
                  href="/map"
                  className="hover:text-teal-300 transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-teal-400 rounded"
                >
                  {t("nav.map", "School Accessibility Map")}
                </Link>
              </li>
              <li>
                <Link
                  href="/tracker"
                  className="hover:text-teal-300 transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-teal-400 rounded"
                >
                  {t("nav.tracker", "Before & After Tracker")}
                </Link>
              </li>
              <li>
                <Link
                  href="/reports"
                  className="hover:text-teal-300 transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-teal-400 rounded"
                >
                  {t("nav.reports", "Research Reports")}
                </Link>
              </li>
              <li>
                <Link
                  href="/report-barrier"
                  className="hover:text-teal-300 transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-teal-400 rounded"
                >
                  {t("nav.reportBarrier", "Report an Accessibility Barrier")}
                </Link>
              </li>
              <li>
                <Link
                  href="/community-voices"
                  className="hover:text-teal-300 transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-teal-400 rounded"
                >
                  {t("nav.voices", "Community Voices")}
                </Link>
              </li>
              <li>
                <Link
                  href="/awareness-advocacy"
                  className="hover:text-teal-300 transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-teal-400 rounded"
                >
                  {t("nav.advocacy", "Awareness & Advocacy")}
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Research & Standards */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold uppercase tracking-wider text-teal-400">
              {locale === "hi" ? "मानक एवं संदर्भ" : "Standards & Framework"}
            </h3>
            <ul className="space-y-2 text-sm text-slate-400">
              <li>{locale === "hi" ? "शैक्षिक संस्थानों हेतु अभिगम्यता संहिता 2024" : "Accessibility Code for Educational Institutions 2024"}</li>
              <li>{locale === "hi" ? "सामंजस्यपूर्ण दिशानिर्देश 2021" : "Harmonised Guidelines 2021"}</li>
              <li>{locale === "hi" ? "RPwD अधिनियम 2016 एवं नियम 2017" : "RPwD Act 2016 & Rules 2017"}</li>
              <li>{locale === "hi" ? "शिक्षा का अधिकार (RTE) अधिनियम 2009" : "Right to Education (RTE) Act 2009"}</li>
              <li>{locale === "hi" ? "राष्ट्रीय शिक्षा नीति (NEP) 2020" : "National Education Policy (NEP) 2020"}</li>
            </ul>
          </div>

          {/* Col 4: Accessibility Commitment */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold uppercase tracking-wider text-teal-400">
              {locale === "hi" ? "डिजिटल अभिगम्यता" : "Digital Accessibility"}
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              {t("footer.accessibilityCommitment")}
            </p>
            <div className="p-3 rounded-lg bg-navy-900 border border-navy-800 text-xs text-slate-300 space-y-1">
              <div className="font-semibold text-teal-300 flex items-center gap-1.5">
                <CheckSquare className="w-3.5 h-3.5" aria-hidden="true" />
                <span>{locale === "hi" ? "WCAG 2.2 स्तर AA लक्ष्य" : "WCAG 2.2 Level AA Target"}</span>
              </div>
              <p className="text-slate-400">
                {locale === "hi"
                  ? "पूर्ण कीबोर्ड संचालन, स्क्रीन रीडर सहयोगिता, उच्च कंट्रास्ट एवं पाठ आकार समायोजन सुविधा उपलब्ध।"
                  : "Full keyboard navigation, screen reader support, high contrast mode, and text resizing supported."}
              </p>
            </div>
          </div>
        </div>

        {/* Bottom copyright line */}
        <div className="pt-8 border-t border-navy-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>
            © {new Date().getFullYear()} Sugamya Shiksha Bihar. {t("footer.rights")}
          </p>
          <div className="flex items-center gap-4">
            <Link
              href="/about"
              className="hover:text-slate-300 transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-teal-400 rounded"
            >
              {t("nav.about", "About & Contact")}
            </Link>
            <span aria-hidden="true">•</span>
            <Link
              href="/admin"
              prefetch={false}
              className="hover:text-teal-400 transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-teal-400 rounded"
            >
              {locale === "hi" ? "व्यवस्थापक" : "Admin"}
            </Link>
            <span aria-hidden="true">•</span>
            <span>{locale === "hi" ? "दानापुर, पटना, बिहार" : "Danapur, Patna, Bihar"}</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
