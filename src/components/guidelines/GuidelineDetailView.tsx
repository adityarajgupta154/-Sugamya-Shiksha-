"use client";

import React from "react";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";
import { GUIDELINES_DATA, GuidelineItem } from "@/data/guidelinesData";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Tabs } from "@/components/ui/Tabs";
import {
  ArrowLeft,
  ExternalLink,
  CheckSquare,
  FileText,
  BookmarkCheck,
  Sparkles,
} from "lucide-react";

export function GuidelineDetailView({ slug }: { slug: string }) {
  const { locale, t } = useLanguage();

  const guideline = GUIDELINES_DATA.find((g) => g.slug === slug || g.id === slug);

  if (!guideline) {
    return (
      <div className="max-w-3xl mx-auto py-20 px-4 text-center space-y-4">
        <h1 className="text-2xl font-bold text-navy-800">
          {locale === "hi" ? "दिशानिर्देश नहीं मिला" : "Guideline Not Found"}
        </h1>
        <p className="text-slate-600">
          {locale === "hi"
            ? "अनुरोधित दिशानिर्देश उपलब्ध नहीं है या हटा दिया गया है।"
            : "The requested guideline could not be found or has been moved."}
        </p>
        <Link href="/guidelines" prefetch={true}>
          <Button variant="primary">
            {locale === "hi" ? "दिशानिर्देश लाइब्रेरी में वापस जाएँ" : "Back to Guidelines Library"}
          </Button>
        </Link>
      </div>
    );
  }

  const isHindi = locale === "hi";

  const tabs = [
    {
      id: "provisions",
      label: (
        <span className="flex items-center gap-2">
          <FileText className="w-4 h-4 text-teal-600" aria-hidden="true" />
          <span>{t("guidelines.mainProvisions", "Main Provisions")}</span>
        </span>
      ),
      content: (
        <div className="space-y-4 pt-2">
          <h3 className="text-lg font-bold text-navy-800">
            {isHindi ? "प्रमुख वैधानिक प्रावधान" : "Key Statutory Provisions"}
          </h3>
          <ul className="space-y-3" role="list">
            {(isHindi ? guideline.mainProvisions_hi : guideline.mainProvisions_en).map(
              (prov, idx) => (
                <li
                  key={idx}
                  className="flex items-start gap-3 p-3.5 rounded-lg bg-slate-50 border border-slate-200/80 text-navy-900"
                >
                  <span className="w-6 h-6 rounded-full bg-teal-100 text-teal-800 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                    {idx + 1}
                  </span>
                  <span className="text-base leading-relaxed">{prov}</span>
                </li>
              )
            )}
          </ul>
        </div>
      ),
    },
    {
      id: "checklist",
      label: (
        <span className="flex items-center gap-2">
          <CheckSquare className="w-4 h-4 text-emerald-600" aria-hidden="true" />
          <span>{t("guidelines.checklistTitle", "School Compliance Checklist")}</span>
        </span>
      ),
      content: (
        <div className="space-y-4 pt-2">
          <div className="p-4 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-900 text-sm">
            <p className="font-semibold">
              {isHindi
                ? "विद्यालय स्व-मूल्यांकन एवं ऑडिट चेकलिस्ट"
                : "School Self-Assessment & Audit Checklist"}
            </p>
            <p className="text-xs text-emerald-800 mt-1">
              {isHindi
                ? "यह चेकलिस्ट विद्यालय प्राचार्यों, शिक्षकों और शोधकर्ताओं को परिसर का भौतिक निरीक्षण करने में सहायता करती है।"
                : "This checklist aids school principals, teachers, and field auditors during physical infrastructure inspections."}
            </p>
          </div>

          <div className="space-y-3" role="list">
            {(isHindi ? guideline.checklist_hi : guideline.checklist_en).map(
              (item, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-3 p-4 rounded-lg bg-white border border-slate-200 shadow-xs"
                >
                  <input
                    type="checkbox"
                    id={`check-${idx}`}
                    className="w-5 h-5 rounded border-slate-300 text-teal-600 focus:ring-teal-500 mt-0.5 cursor-pointer"
                  />
                  <label
                    htmlFor={`check-${idx}`}
                    className="text-base text-slate-800 font-medium cursor-pointer"
                  >
                    {item}
                  </label>
                </div>
              )
            )}
          </div>
        </div>
      ),
    },
    {
      id: "sections",
      label: (
        <span className="flex items-center gap-2">
          <BookmarkCheck className="w-4 h-4 text-amber-600" aria-hidden="true" />
          <span>{t("guidelines.relatedSections", "Related Sections & Clauses")}</span>
        </span>
      ),
      content: (
        <div className="space-y-4 pt-2">
          <h3 className="text-lg font-bold text-navy-800">
            {isHindi ? "संबंधित अध्याय एवं तकनीकी खंड" : "Related Chapters & Technical Clauses"}
          </h3>
          <ul className="space-y-2.5" role="list">
            {(isHindi ? guideline.relatedSections_hi : guideline.relatedSections_en).map(
              (sec, idx) => (
                <li
                  key={idx}
                  className="p-3 rounded-lg bg-slate-50 border border-slate-200 text-sm font-medium text-slate-700 flex items-center gap-2"
                >
                  <span className="text-teal-700 font-bold" aria-hidden="true">§</span>
                  <span>{sec}</span>
                </li>
              )
            )}
          </ul>
        </div>
      ),
    },
  ];

  return (
    <div className="flex flex-col w-full py-8 px-4 sm:px-8 max-w-5xl mx-auto space-y-8">
      {/* Back button */}
      <div>
        <Link
          href="/guidelines"
          prefetch={true}
          className="inline-flex items-center gap-2 text-sm font-bold text-teal-700 hover:text-teal-900 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-600 rounded p-1"
        >
          <ArrowLeft className="w-4 h-4" aria-hidden="true" />
          <span>{locale === "hi" ? "दिशानिर्देश लाइब्रेरी पर वापस जाएँ" : "Back to Guidelines Library"}</span>
        </Link>
      </div>

      {/* Main Header Card */}
      <article className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-10 space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            {guideline.isPrimaryReference ? (
              <Badge variant="primary_reference" className="text-xs">
                ⭐ {t("guidelines.primaryReferenceBadge", "Primary Technical Reference")}
              </Badge>
            ) : (
              <Badge variant="default" className="text-xs">
                {guideline.year}
              </Badge>
            )}
            <span className="text-xs text-slate-500 font-medium">
              {guideline.officialOrg}
            </span>
          </div>

          <a
            href={guideline.officialUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-teal-700 hover:text-teal-900 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-600 rounded p-1"
          >
            <span>{t("guidelines.officialDocument", "Official Document")}</span>
            <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" />
            <span className="sr-only">({t("common.externalLink", "Opens in new tab")})</span>
          </a>
        </div>

        <div className="space-y-3">
          <h1 className="text-2xl sm:text-4xl font-extrabold text-navy-800 tracking-tight font-hindi leading-tight">
            {isHindi ? guideline.title_hi : guideline.title_en}
          </h1>
          <p className="text-base sm:text-lg text-slate-600 leading-relaxed font-medium">
            {isHindi ? guideline.shortSummary_hi : guideline.shortSummary_en}
          </p>
        </div>

        {/* Easy Language Summary Box */}
        <div className="p-5 sm:p-6 rounded-xl bg-teal-50/70 border border-teal-200 text-teal-950 space-y-2">
          <div className="flex items-center gap-2 text-teal-800 font-bold text-sm">
            <Sparkles className="w-4 h-4 text-amber-600" aria-hidden="true" />
            <span>{t("guidelines.easyExplanation", "Easy-Language Summary")}</span>
          </div>
          <p className="text-base sm:text-lg leading-relaxed text-slate-800 font-normal">
            {isHindi ? guideline.easyExplanation_hi : guideline.easyExplanation_en}
          </p>
        </div>

        {/* Tabs for Provisions, Checklist, and Related Sections */}
        <div className="pt-4 border-t border-slate-100">
          <Tabs
            tabs={tabs}
            defaultTab="provisions"
            ariaLabel="Guideline details and checklists"
          />
        </div>

        {/* Footer download & official link bar */}
        <div className="pt-6 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-xs text-slate-500">
            <span>{locale === "hi" ? "आधिकारिक पोर्टल स्रोत:" : "Official Portal Source:"} </span>
            <span className="font-semibold text-slate-700">{guideline.officialOrg}</span>
          </div>

          <a
            href={guideline.officialUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto"
          >
            <Button
              variant="secondary"
              size="md"
              className="w-full sm:w-auto"
              rightIcon={<ExternalLink className="w-4 h-4" />}
            >
              {locale === "hi" ? "आधिकारिक स्रोत / पोर्टल खोलें" : "Open Official Source / Portal"}
            </Button>
          </a>
        </div>
      </article>
    </div>
  );
}
