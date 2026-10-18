"use client";

import React, { useState } from "react";
import { SchematicShell } from "./SchematicShell";
import { SCHEMATIC_MODULES_DATA } from "@/data/schematicData";
import { Maximize2, X, Sparkles, Check, Layers } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

interface DiagramProps {
  altText?: string;
}
const TACTILE_HOTSPOTS: Array<{
  id: string;
  num: number;
  top: string;
  left: string;
  label_en: string;
  label_hi: string;
  val: string;
}> = [
  {
    id: "guiding-pattern",
    num: 1,
    top: "22%",
    left: "16%",
    label_en: "Directional guiding tile",
    label_hi: "दिशा सूचक टाइल",
    val: "300 × 300 mm",
  },
  {
    id: "path-width",
    num: 3,
    top: "78%",
    left: "36%",
    label_en: "Continuous pathway width",
    label_hi: "मार्ग की निरंतर चौड़ाई",
    val: "300–600 mm",
  },
  {
    id: "warning-pattern",
    num: 2,
    top: "44%",
    left: "60%",
    label_en: "Warning tactile tile",
    label_hi: "चेतावनी टाइल",
    val: "300 × 300 mm",
  },
  {
    id: "hazard-distance",
    num: 4,
    top: "20%",
    left: "83%",
    label_en: "Hazard warning setback",
    label_hi: "चेतावनी दूरी",
    val: "300 mm before stairs",
  },
];

export function TactileDiagram({ altText }: DiagramProps) {
  const data = SCHEMATIC_MODULES_DATA.tactile;
  const { locale } = useLanguage();
  const isHi = locale === "hi";

  const [selectedSpecId, setSelectedSpecId] = useState<string>("guiding-pattern");
  const [isZoomOpen, setIsZoomOpen] = useState(false);

  // Active specification for the spotlight card
  const activeSpec =
    data.callouts.find((c) => c.id === selectedSpecId) || data.callouts[0];

  return (
    <SchematicShell data={data}>
      {({ isHighContrast }) => (
        <div className="space-y-5">
          {/* TOP ARCHITECTURAL TOOLBAR */}
          <div className="flex flex-wrap items-center justify-between gap-3 p-2 bg-white/95 rounded-xl border border-sky-200/90 shadow-2xs">
            <div className="flex items-center gap-2 px-2.5 py-1 text-xs font-bold text-[#0B2D52]">
              <Sparkles className="w-4 h-4 text-[#0066FF]" aria-hidden="true" />
              <span>
                {isHi
                  ? "शैक्षणिक इन्फोग्राफिक — स्पर्शनीय पेविंग एवं मानक आयाम"
                  : "Educational Infographic — Tactile Paving & Statutory Dimensions"}
              </span>
            </div>

            {/* Quick Action: Fullscreen Modal Zoom */}
            <div className="flex items-center gap-2">
              <span className="hidden sm:inline text-xs font-medium text-slate-500">
                {isHi ? "विस्तृत जांच के लिए ज़ूम करें" : "Click to enlarge details"}
              </span>
              <button
                type="button"
                onClick={() => setIsZoomOpen(true)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 hover:text-[#0066FF] shadow-2xs transition-colors cursor-pointer"
                title={isHi ? "चित्र को बड़ा करके देखें" : "Zoom into tactile infographic"}
                aria-label={isHi ? "चित्र को बड़ा करके देखें" : "Zoom into tactile infographic"}
              >
                <Maximize2 className="w-3.5 h-3.5" aria-hidden="true" />
                <span>{isHi ? "ज़ूम देखें" : "Enlarge"}</span>
              </button>
            </div>
          </div>

          {/* MAIN VISUAL CANVAS — REALISTIC SCHOOL WALKWAY INFOGRAPHIC */}
          <div className="relative w-full rounded-2xl overflow-hidden border border-sky-200/90 shadow-xs bg-white">
            {/* Screen Reader plain-text description */}
            <div className="sr-only">
              {isHi ? data.srOnlyDescription_hi : data.srOnlyDescription_en}
            </div>

            <div className="relative w-full aspect-[2/1] bg-slate-100 overflow-hidden">
              <picture>
                <source srcSet="/images/visual-guide/tactile-pathway.webp" type="image/webp" />
                <img
                  src="/images/visual-guide/tactile-pathway.png"
                  alt={altText || data.title_en}
                  className="w-full h-full object-cover select-none"
                  loading="eager"
                />
              </picture>

              {/* INTERACTIVE HOTSPOT PIN OVERLAYS (Aligned to the 4 Key Callouts) */}
              <div className="hidden sm:block">
              {TACTILE_HOTSPOTS.map((hotspot) => {
                const isSelected = selectedSpecId === hotspot.id;
                return (
                  <button
                    key={hotspot.id}
                    type="button"
                    style={{ top: hotspot.top, left: hotspot.left }}
                    onClick={() => setSelectedSpecId(hotspot.id)}
                    className="absolute -translate-x-1/2 -translate-y-1/2 group cursor-pointer focus:outline-hidden z-10"
                    aria-label={`${hotspot.label_en}: ${hotspot.val}`}
                  >
                    <span className="relative flex items-center justify-center">
                      {/* Pulse Ring */}
                      <span
                        className={`absolute inline-flex h-8 w-8 rounded-full opacity-75 animate-ping ${
                          isSelected ? "bg-[#0066FF]" : "bg-amber-400 group-hover:bg-[#0066FF]"
                        }`}
                      />
                      {/* Central Badge */}
                      <span
                        className={`relative inline-flex items-center justify-center h-7 w-7 rounded-full text-xs font-black shadow-md border-2 transition-transform duration-150 group-hover:scale-115 ${
                          isSelected
                            ? "bg-[#0066FF] text-white border-white ring-2 ring-blue-300"
                            : "bg-white text-[#0066FF] border-[#0066FF] group-hover:bg-blue-50"
                        }`}
                      >
                        {hotspot.num}
                      </span>
                    </span>

                    {/* Hover Floating Mini Tooltip */}
                    <span className="absolute left-1/2 -translate-x-1/2 -top-8 hidden group-hover:flex items-center px-2 py-0.5 rounded-md bg-[#0B2D52] text-white text-[10px] font-bold whitespace-nowrap shadow-md pointer-events-none z-20">
                      {isHi ? hotspot.label_hi : hotspot.label_en} ({hotspot.val})
                    </span>
                  </button>
                );
              })}
              </div>

              {/* Requirement Feature Badge: Harmonised Guidelines Reference */}
              <div className="absolute left-3 bottom-3 sm:left-4 sm:bottom-4 bg-white/95 backdrop-blur-xs border border-sky-300 rounded-xl px-3 py-1.5 shadow-md hidden sm:flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#0066FF] animate-pulse" />
                <div>
                  <p className="text-[11px] font-bold text-[#0B2D52]">
                    Harmonised Guidelines 2021 (Cl. 4.3 &amp; 4.4)
                  </p>
                  <p className="text-[10px] text-[#0284C7] font-semibold">
                    Directional Lineal Bars &amp; Hazard Blister Warning Tiles
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Mobile Callout Legend List (<sm) - Eliminates overlapping dots on small screens */}
          <div className="sm:hidden grid grid-cols-2 gap-2 pt-1">
            {TACTILE_HOTSPOTS.map((hotspot) => {
              const isSelected = selectedSpecId === hotspot.id;
              return (
                <button
                  key={hotspot.id}
                  type="button"
                  onClick={() => setSelectedSpecId(hotspot.id)}
                  className={`flex items-center gap-2 p-2 rounded-xl text-left border transition-all min-h-[44px] ${
                    isSelected
                      ? "bg-blue-50 border-[#0066FF] shadow-2xs"
                      : "bg-white border-slate-200 hover:bg-slate-50"
                  }`}
                  aria-label={`${hotspot.label_en}: ${hotspot.val}`}
                >
                  <span
                    className={`w-6 h-6 rounded-full text-xs font-black flex items-center justify-center shrink-0 ${
                      isSelected
                        ? "bg-[#0066FF] text-white"
                        : "bg-blue-100 text-[#0066FF]"
                    }`}
                  >
                    {hotspot.num}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-bold text-navy-900 truncate">
                      {isHi ? hotspot.label_hi : hotspot.label_en}
                    </p>
                    <p className="text-[11px] text-blue-600 font-semibold truncate">
                      {hotspot.val}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>

          {/* ================================================================
              ACTIVE SPECIFICATION SPOTLIGHT CARD (Simple Student-Friendly Language)
              ================================================================ */}
          <div className="p-4 sm:p-5 rounded-2xl bg-white border border-sky-200/90 shadow-2xs">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-3 mb-3 border-b border-sky-100">
              <div className="flex items-center gap-3">
                <span className="w-8 h-8 rounded-full bg-[#0066FF] text-white font-black text-sm flex items-center justify-center shrink-0 shadow-2xs">
                  {activeSpec.num}
                </span>
                <div>
                  <h3 className="text-base sm:text-lg font-black text-[#0B2D52] flex items-center gap-2">
                    <span>{activeSpec.label_en}</span>
                    <span className="text-slate-400 font-normal">/</span>
                    <span className="text-[#0284C7] font-bold">{activeSpec.label_hi}</span>
                  </h3>
                  <p className="text-sm font-extrabold text-[#0066FF]">
                    {activeSpec.value}
                    {activeSpec.sub_en && (
                      <span className="ml-2 text-xs font-semibold text-slate-500">
                        ({isHi ? activeSpec.sub_hi : activeSpec.sub_en})
                      </span>
                    )}
                  </p>
                </div>
              </div>

              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-sans font-medium break-words max-w-full bg-sky-50 text-[#0284C7] border border-sky-200 self-start md:self-auto">
                <Check className="w-3.5 h-3.5 text-emerald-600" aria-hidden="true" />
                <span>Accessibility Code 2024 (Cl. 2.4 &amp; Harmonised Cl. 4.3)</span>
              </span>
            </div>

            <div className="space-y-1.5 text-xs sm:text-sm leading-relaxed">
              <p className="font-medium text-slate-800">
                <strong className="text-[#0B2D52]">Why it matters: </strong>
                {activeSpec.studentFriendly_en}
              </p>
              <p className="text-slate-600 font-normal">
                <strong className="text-[#0284C7]">सरल हिंदी व्याख्या: </strong>
                {activeSpec.studentFriendly_hi}
              </p>
            </div>
          </div>

          {/* ================================================================
              ALL 6 MANDATORY TECHNICAL SPECIFICATIONS QUICK-SELECTOR GRID
              ================================================================ */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-600 flex items-center gap-2">
              <Layers className="w-3.5 h-3.5 text-[#0066FF]" aria-hidden="true" />
              <span>
                {isHi
                  ? "सभी 6 अनिवार्य तकनीकी मानक (क्लिक करके जांचें)"
                  : "All 6 Mandatory Technical Specifications (Click to Inspect)"}
              </span>
            </h4>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
              {data.callouts.map((item) => {
                const isSelected = selectedSpecId === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setSelectedSpecId(item.id)}
                    className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                      isSelected
                        ? "bg-sky-50 border-[#0066FF] ring-2 ring-sky-200 shadow-2xs"
                        : "bg-white border-slate-200/90 hover:border-sky-300 hover:bg-slate-50/60"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-1 mb-1">
                      <span
                        className={`w-5 h-5 rounded-full text-xs font-bold flex items-center justify-center shrink-0 ${
                          isSelected ? "bg-[#0066FF] text-white" : "bg-slate-100 text-slate-600"
                        }`}
                      >
                        {item.num}
                      </span>
                      <span className="text-[11px] font-extrabold text-[#0066FF] truncate">
                        {item.value.split(" ")[0]} {item.value.split(" ")[1] || ""}
                      </span>
                    </div>

                    <div className="text-xs font-bold text-[#0B2D52] truncate">
                      {isHi ? item.label_hi : item.label_en}
                    </div>
                    <div className="text-[11px] text-[#0284C7] font-semibold truncate">
                      {item.value}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* ================================================================
              FULLSCREEN ZOOM MODAL
              ================================================================ */}
          {isZoomOpen && (
            <div
              className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6"
              role="dialog"
              aria-modal="true"
              aria-label="Enlarged tactile pathway educational diagram"
            >
              <div className="relative w-full max-w-6xl bg-white rounded-2xl overflow-hidden shadow-2xl p-4 sm:p-6 space-y-4">
                <div className="flex items-center justify-between border-b pb-3">
                  <div>
                    <h3 className="text-lg font-black text-[#0B2D52]">
                      {data.title_en} — {data.title_hi}
                    </h3>
                    <p className="text-xs text-slate-500">
                      High-Resolution Campus Walkway Tactile Dimensions &amp; Layout
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsZoomOpen(false)}
                    className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 cursor-pointer"
                    aria-label="Close enlarged view"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="w-full max-h-[75vh] overflow-auto rounded-xl border border-slate-200 bg-slate-50">
                  <picture>
                    <source srcSet="/images/visual-guide/tactile-pathway.webp" type="image/webp" />
                    <img
                      src="/images/visual-guide/tactile-pathway.png"
                      alt={altText || data.title_en}
                      className="w-full h-auto object-contain select-none"
                    />
                  </picture>
                </div>

                <div className="flex items-center justify-between text-xs text-slate-600 pt-2">
                  <span>
                    Mandatory Specifications: Guiding Tile 300×300 mm | Warning Tile 300×300 mm | Pathway Width 300–600 mm | Hazard Warning Setback 300 mm
                  </span>
                  <button
                    type="button"
                    onClick={() => setIsZoomOpen(false)}
                    className="px-4 py-1.5 rounded-lg bg-[#0066FF] text-white font-bold cursor-pointer hover:bg-blue-600"
                  >
                    {isHi ? "बंद करें" : "Close"}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </SchematicShell>
  );
}

// ============================================================================
// ============================================================================
// 4. INCLUSIVE CLASSROOM SCHEMATIC — TOP-DOWN PLAN VIEW
