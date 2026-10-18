"use client";

import React, { useState } from "react";
import { useAccessibility } from "@/context/AccessibilityContext";
import { useLanguage } from "@/context/LanguageContext";
import { SchematicModuleData, SchematicPrinciple } from "@/data/schematicData";
import { Lightbulb, Info, Eye, Layers } from "lucide-react";

interface SchematicShellProps {
  data: SchematicModuleData;
  children: (props: { isLegendMode: boolean; isHighContrast: boolean }) => React.ReactNode;
}

export function SchematicShell({ data, children }: SchematicShellProps) {
  const { highContrast } = useAccessibility();
  const { locale } = useLanguage();
  const isHi = locale === "hi";

  const [isLegendMode, setIsLegendMode] = useState(false);

  return (
    <section
      aria-labelledby={`schematic-title-${data.id}`}
      className={`w-full overflow-hidden rounded-2xl sm:rounded-3xl border transition-colors ${
        highContrast
          ? "bg-black text-white border-2 border-white shadow-none"
          : "bg-gradient-to-b from-[#F0F8FF] via-[#F4F9FD] to-[#FFFFFF] border-sky-200/90 shadow-sm"
      } p-4 sm:p-6 lg:p-8`}
    >
      {/* 1. TOP HEADER & KEY TIP BOX */}
      <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4 sm:gap-6 pb-6 border-b border-sky-100/80">
        {/* Title Block */}
        <div className="space-y-1.5 max-w-2xl">
          <div className="flex items-center gap-2 flex-wrap mb-2">
            <span
              className={`inline-flex items-center gap-1.5 text-xs font-mono font-semibold px-2.5 py-1 rounded-md ${
                highContrast
                  ? "bg-white text-black font-bold"
                  : "bg-white/95 border border-sky-200 text-[#078F8A] shadow-2xs"
              }`}
            >
              <Info className="w-3.5 h-3.5" aria-hidden="true" />
              <span>{data.officialStandard} ({data.officialClause})</span>
            </span>
            <button
              type="button"
              onClick={() => setIsLegendMode(!isLegendMode)}
              className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-md transition-colors cursor-pointer ${
                isLegendMode
                  ? "bg-[#0284C7] text-white"
                  : highContrast
                  ? "border border-white text-white hover:bg-white hover:text-black"
                  : "bg-white border border-slate-200 text-slate-700 hover:bg-slate-50"
              }`}
              aria-pressed={isLegendMode}
              title={isHi ? "कॉलआउट विवरण सूची मोड चालू/बंद करें" : "Toggle diagram callout legend mode"}
            >
              <Layers className="w-3.5 h-3.5" aria-hidden="true" />
              <span>{isLegendMode ? (isHi ? "ग्राफिक मोड" : "Diagram Mode") : (isHi ? "विवरण सूची (Legend)" : "Callout Legend")}</span>
            </button>
          </div>

          <h2
            id={`schematic-title-${data.id}`}
            className={`text-2xl sm:text-3xl font-black tracking-tight leading-tight ${
              highContrast ? "text-white" : "text-[#0B2D52]"
            }`}
          >
            {data.title_en}
          </h2>

          <p
            className={`text-xl sm:text-2xl font-black ${
              highContrast ? "text-yellow-300" : "text-[#0284C7]"
            }`}
          >
            {data.title_hi}
          </p>

          <p
            className={`text-sm sm:text-base leading-relaxed ${
              highContrast ? "text-slate-200" : "text-slate-600"
            }`}
          >
            <span>{data.subtitle_en}</span>
            <span className="mx-2 text-slate-400">/</span>
            <span>{data.subtitle_hi}</span>
          </p>
        </div>

        {/* Key-Tip Box matching Image 2 */}
        <div
          className={`shrink-0 rounded-2xl p-4 sm:p-5 transition-all max-w-md w-full lg:w-auto ${
            highContrast
              ? "bg-slate-900 border-2 border-yellow-300 text-white"
              : "bg-white/95 border border-sky-200/90 shadow-xs"
          }`}
          role="region"
          aria-label={isHi ? "प्रमुख वैधानिक नियम" : "Key Statutory Rule"}
        >
          <div className="flex items-start gap-3">
            <div
              className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                highContrast ? "bg-yellow-400 text-black" : "bg-amber-50 text-amber-500 shadow-2xs"
              }`}
            >
              <Lightbulb className="w-5 h-5 stroke-[2.2]" aria-hidden="true" />
            </div>

            <div className="space-y-1">
              <div className="text-sm sm:text-base font-bold flex flex-wrap items-baseline gap-1.5">
                <span className={highContrast ? "text-slate-200" : "text-[#0B2D52]"}>
                  {data.keyTip.highlight_en} / {data.keyTip.highlight_hi}:
                </span>
                <span className={highContrast ? "text-yellow-300 font-black" : "text-amber-600 font-extrabold text-base sm:text-lg"}>
                  {isHi ? data.keyTip.value_hi : data.keyTip.value_en}
                </span>
              </div>

              <div className={`text-xs sm:text-[13px] leading-relaxed font-medium ${
                highContrast ? "text-slate-300" : "text-slate-600"
              }`}>
                {isHi ? data.keyTip.subTip_hi : data.keyTip.subTip_en}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. MAIN SVG CANVAS AREA */}
      <div className="my-6">
        <figure
          className="relative w-full overflow-hidden rounded-xl sm:rounded-2xl"
          role="group"
          aria-label={isHi ? data.title_hi : data.title_en}
        >
          {/* Detailed Plain-text description for Assistive Technologies */}
          <div className="sr-only">
            {isHi ? data.srOnlyDescription_hi : data.srOnlyDescription_en}
          </div>

          {/* SVG Diagram Canvas */}
          <div className="w-full">
            {children({ isLegendMode, isHighContrast: highContrast })}
          </div>
        </figure>

        {/* Legend Mode / Accessible Callout Breakdown Table */}
        {isLegendMode && (
          <div
            className={`mt-4 p-4 sm:p-5 rounded-2xl border animate-in fade-in duration-150 ${
              highContrast
                ? "bg-slate-950 border-white text-white"
                : "bg-white border-sky-200/90 shadow-xs"
            }`}
          >
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100">
              <h3 className="text-sm font-bold text-[#0B2D52] flex items-center gap-2">
                <Eye className="w-4 h-4 text-[#0284C7]" aria-hidden="true" />
                <span>{isHi ? "आरेख कॉलआउट संदर्भ सूची" : "Schematic Callouts & Exact Dimensions"}</span>
              </h3>
              <span className="text-xs text-slate-500 font-mono">
                {data.callouts.length} {isHi ? "मानक पैरामीटर" : "Parameters"}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {data.callouts.map((item) => (
                <div
                  key={item.id}
                  className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 flex items-start gap-2.5"
                >
                  <span className="w-6 h-6 rounded-full bg-[#0284C7] text-white text-xs font-bold flex items-center justify-center shrink-0">
                    {item.num}
                  </span>
                  <div className="space-y-0.5 min-w-0">
                    <div className="text-xs font-bold text-[#0B2D52] truncate">
                      {isHi ? item.label_hi : item.label_en}
                    </div>
                    <div className="text-xs font-extrabold text-[#0284C7]">
                      {item.value}
                    </div>
                    {(item.sub_en || item.sub_hi) && (
                      <div className="text-[11px] text-slate-500 truncate">
                        {isHi ? item.sub_hi : item.sub_en}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* 3. BOTTOM 3 PRINCIPLE CARDS MATCHING IMAGE 2 */}
      <div className="pt-6 border-t border-sky-100/90">
        <h3 className="sr-only">
          {isHi ? "3 प्रमुख स्थापत्य सिद्धांत" : "3 Core Design Principles"}
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 sm:gap-4">
          {data.principles.map((principle) => (
            <PrincipleCard
              key={principle.number}
              principle={principle}
              highContrast={highContrast}
              isHi={isHi}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function PrincipleCard({
  principle,
  highContrast,
  isHi,
}: {
  principle: SchematicPrinciple;
  highContrast: boolean;
  isHi: boolean;
}) {
  const cleanHiTitle = principle.title_hi.replace(/^\d+\.\s*/, "");

  return (
    <div
      className={`rounded-2xl p-5 sm:p-6 transition-all flex flex-col sm:flex-row items-start gap-4 ${
        highContrast
          ? "bg-slate-900 border-2 border-white text-white"
          : "bg-white border border-sky-200/80 shadow-2xs hover:shadow-xs hover:border-sky-300"
      }`}
    >
      {/* Circular Icon matching Reference Image */}
      <div
        className={`w-14 h-14 rounded-full flex items-center justify-center shrink-0 border ${
          highContrast
            ? "bg-white text-black border-white"
            : "bg-sky-50 text-[#0284C7] border-sky-100/90 shadow-2xs"
        }`}
        aria-hidden="true"
      >
        <PrincipleIcon icon={principle.icon} />
      </div>

      {/* Content Block */}
      <div className="space-y-2 min-w-0 flex-1">
        <h4 className="text-base sm:text-lg font-extrabold leading-snug">
          <span className={highContrast ? "text-white" : "text-[#0B2D52]"}>
            {principle.title_en}
          </span>
          <span className="mx-1.5 text-slate-400 font-normal">/</span>
          <span className={highContrast ? "text-yellow-300" : "text-[#0284C7]"}>
            {cleanHiTitle}
          </span>
        </h4>

        {/* Bilingual Explanations */}
        <div
          className={`space-y-1 text-xs sm:text-[13px] leading-relaxed ${
            highContrast ? "text-slate-200" : "text-slate-600"
          }`}
        >
          <p className="font-medium text-slate-700 dark:text-slate-200">
            {principle.desc_en}
          </p>
          <p className="text-slate-500 font-normal">
            {principle.desc_hi}
          </p>
        </div>
      </div>
    </div>
  );
}

function PrincipleIcon({ icon }: { icon: SchematicPrinciple["icon"] }) {
  switch (icon) {
    case "slope":
      return (
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <polygon points="3,20 21,20 21,8" />
        </svg>
      );
    case "handrail":
      return (
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="3" y1="8" x2="21" y2="8" />
          <line x1="3" y1="14" x2="21" y2="14" />
          <line x1="6" y1="8" x2="6" y2="20" />
          <line x1="18" y1="8" x2="18" y2="20" />
        </svg>
      );
    case "landing":
      return (
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <polygon points="12 2 2 7 12 12 22 7 12 2" />
          <polyline points="2 17 12 22 22 17" />
          <polyline points="2 12 12 17 22 12" />
        </svg>
      );
    case "turning":
      return (
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 12a9 9 0 1 1-6.219-8.56" />
          <polyline points="21 3 21 9 15 9" />
        </svg>
      );
    case "grabbar":
      return (
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4 18V6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12" />
          <line x1="10" y1="12" x2="14" y2="12" />
        </svg>
      );
    case "fixtures":
      return (
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="9" />
          <line x1="12" y1="8" x2="12" y2="12" />
          <line x1="12" y1="16" x2="12.01" y2="16" />
        </svg>
      );
    case "tactile-guide":
      return (
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="6" y1="3" x2="6" y2="21" />
          <line x1="12" y1="3" x2="12" y2="21" />
          <line x1="18" y1="3" x2="18" y2="21" />
        </svg>
      );
    case "contrast":
      return (
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <path d="M12 2a10 10 0 0 1 0 20Z" fill="currentColor" />
        </svg>
      );
    case "route":
      return (
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="6" cy="19" r="3" />
          <path d="M9 19h8.5a3.5 3.5 0 0 0 0-7h-11a3.5 3.5 0 0 1 0-7H15" />
          <circle cx="18" cy="5" r="3" />
        </svg>
      );
    case "aisle":
      return (
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="4" y1="4" x2="4" y2="20" />
          <line x1="20" y1="4" x2="20" y2="20" />
          <polyline points="8 12 12 8 16 12" />
          <line x1="12" y1="8" x2="12" y2="16" />
        </svg>
      );
    case "desk":
      return (
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="6" width="18" height="6" rx="2" />
          <line x1="6" y1="12" x2="6" y2="20" />
          <line x1="18" y1="12" x2="18" y2="20" />
        </svg>
      );
    case "board":
      return (
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="2" y="4" width="20" height="12" rx="2" />
          <line x1="2" y1="20" x2="22" y2="20" />
          <line x1="12" y1="16" x2="12" y2="20" />
        </svg>
      );
    default:
      return null;
  }
}
