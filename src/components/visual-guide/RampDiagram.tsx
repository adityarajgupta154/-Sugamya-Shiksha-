"use client";

import React, { useState } from "react";
import { SchematicShell } from "./SchematicShell";
import { SCHEMATIC_MODULES_DATA } from "@/data/schematicData";
import { Maximize2, X, Sparkles, Check, Layers } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

interface DiagramProps {
  altText?: string;
}
const RAMP_3D_HOTSPOTS: Array<{
  id: string;
  num: number;
  top: string;
  left: string;
  label_en: string;
  label_hi: string;
  val: string;
  explanation_en: string;
  explanation_hi: string;
}> = [
  {
    id: "slope-ratio",
    num: 1,
    top: "54%",
    left: "52%",
    label_en: "Ramp slope",
    label_hi: "रैंप ढाल",
    val: "1:12 maximum (8.33%)",
    explanation_en: "A gentle 1:12 maximum incline ensures wheelchair users can climb without tipping backward. For long ramps, 1:15 to 1:20 is even easier.",
    explanation_hi: "अधिकतम 1:12 का आसान ढलान ताकि व्हीलचेयर सवार बिना थके और बिना पीछे पलटे सुरक्षित चढ़ सकें। लंबे रैंप हेतु 1:15 - 1:20 और भी बेहतर है।",
  },
  {
    id: "clear-width",
    num: 2,
    top: "84%",
    left: "14%",
    label_en: "Clear width",
    label_hi: "साफ़ चौड़ाई",
    val: "1200 mm minimum",
    explanation_en: "Unobstructed clear space between inner handrails allowing a wheelchair and an accompanying student or teacher to move freely.",
    explanation_hi: "दोनों रेलिंग के बीच कम से कम 1200 मिमी (1.2 मीटर) खुली जगह ताकि व्हीलचेयर और सहायक विद्यार्थी सुगमता से चल सकें।",
  },
  {
    id: "lower-rail",
    num: 3,
    top: "42%",
    left: "32%",
    label_en: "Lower handrail",
    label_hi: "निचली रेलिंग",
    val: "760 mm height",
    explanation_en: "Installed at 760 mm from finished floor level so primary school children and seated wheelchair users can comfortably reach and grip.",
    explanation_hi: "फर्श से 760 मिमी ऊंचाई पर, जिससे प्राथमिक कक्षा के छोटे बच्चे और व्हीलचेयर सवार बिना हाथ खिंचे सहज पकड़ सकें।",
  },
  {
    id: "upper-rail",
    num: 4,
    top: "27%",
    left: "49%",
    label_en: "Upper handrail",
    label_hi: "ऊपरी रेलिंग",
    val: "900 mm height",
    explanation_en: "Installed at 900 mm height to give sturdy, ergonomic support for older students, teachers, and adults with walking difficulties.",
    explanation_hi: "बड़े विद्यार्थियों, शिक्षकों और चलने में कठिनाई वाले वयस्कों के मजबूत सहारे के लिए 900 मिमी पर ऊपरी रेलिंग।",
  },
  {
    id: "handrail-ext",
    num: 5,
    top: "33%",
    left: "14%",
    label_en: "Handrail extension",
    label_hi: "रेलिंग का बढ़ा हिस्सा",
    val: "300 mm minimum",
    explanation_en: "Extends 300 mm horizontally beyond the ramp slope so a student can safely grip and balance before starting to climb or step off.",
    explanation_hi: "रैंप ढलान से 300 मिमी आगे समतल रेलिंग ताकि चढ़ते-उतरते समय विद्यार्थी का संतुलन पहले ही बन जाए।",
  },
  {
    id: "edge-curb",
    num: 6,
    top: "70%",
    left: "60%",
    label_en: "Edge curb",
    label_hi: "किनारे की उठी पट्टी",
    val: "100 mm height",
    explanation_en: "A continuous 100 mm raised edge curb prevents wheelchair front casters, crutches, and white canes from slipping off the ramp edge.",
    explanation_hi: "किनारे पर 100 मिमी ऊंची कंक्रीट पट्टी जिससे व्हीलचेयर के पहिए, बैसाखी या सफेद छड़ी फिसलकर नीचे न गिरें।",
  },
  {
    id: "landing-size",
    num: 7,
    top: "16%",
    left: "84%",
    label_en: "Landing platform",
    label_hi: "समतल प्लेटफॉर्म",
    val: "1500 × 1500 mm minimum",
    explanation_en: "A flat, level platform at the top entrance allowing full 360° wheelchair rotation and safe space to open the classroom door.",
    explanation_hi: "शीर्ष प्रवेश द्वार पर 1500 × 1500 मिमी समतल चबूतरा ताकि व्हीलचेयर 360° घूम सके और दरवाजा आसानी से खोला जा सके।",
  },
  {
    id: "landing-interval",
    num: 8,
    top: "80%",
    left: "75%",
    label_en: "Intermediate landing",
    label_hi: "विश्राम प्लेटफॉर्म",
    val: "Every 9 m of ramp run",
    explanation_en: "Every 9 meters of linear ramp or wherever the direction changes, a level resting platform must be provided to prevent student fatigue.",
    explanation_hi: "हर 9 मीटर की ढलान या दिशा बदलने वाले मोड़ पर समतल विश्राम प्लेटफॉर्म देना अनिवार्य है ताकि विद्यार्थी थके नहीं।",
  },
];

export function RampDiagram({ altText }: DiagramProps) {
  const data = SCHEMATIC_MODULES_DATA.ramp;
  const { locale } = useLanguage();
  const isHi = locale === "hi";

  const [selectedHotspotId, setSelectedHotspotId] = useState<string>("slope-ratio");
  const [isZoomOpen, setIsZoomOpen] = useState(false);

  const activeHotspot =
    RAMP_3D_HOTSPOTS.find((h) => h.id === selectedHotspotId) || RAMP_3D_HOTSPOTS[0];

  return (
    <SchematicShell data={data}>
      {({ isLegendMode, isHighContrast }) => (
        <div className="space-y-5">
          {/* Top Architectural Toolbar */}
          <div className="flex flex-wrap items-center justify-between gap-3 p-2 bg-white/95 rounded-xl border border-sky-200/90 shadow-2xs">
            <div className="flex items-center gap-2 px-2.5 py-1 text-xs font-bold text-[#0B2D52]">
              <Sparkles className="w-4 h-4 text-[#0284C7]" aria-hidden="true" />
              <span>{isHi ? "3D स्थापत्य मॉडल (आधिकारिक मानक)" : "3D Architectural Model (Statutory Standards)"}</span>
            </div>

            {/* Quick Action: Fullscreen Modal Zoom */}
            <div className="flex items-center gap-2">
              <span className="hidden sm:inline text-xs font-medium text-slate-500">
                {isHi ? "विस्तृत जांच के लिए ज़ूम करें" : "Click to enlarge details"}
              </span>
              <button
                type="button"
                onClick={() => setIsZoomOpen(true)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 hover:text-[#0284C7] shadow-2xs transition-colors cursor-pointer"
                title={isHi ? "चित्र को बड़ा करके देखें" : "Zoom into architectural image"}
                aria-label={isHi ? "चित्र को बड़ा करके देखें" : "Zoom into architectural image"}
              >
                <Maximize2 className="w-3.5 h-3.5" aria-hidden="true" />
                <span>{isHi ? "ज़ूम देखें" : "Enlarge"}</span>
              </button>
            </div>
          </div>

          {/* MAIN VISUAL CANVAS — 3D CAMPUS MODEL */}
          <div className="relative w-full rounded-2xl overflow-hidden border border-sky-200/90 shadow-sm bg-white">
            {/* Screen Reader plain-text description */}
            <div className="sr-only">
              {isHi ? data.srOnlyDescription_hi : data.srOnlyDescription_en}
            </div>

            <div className="relative w-full aspect-[2/1] bg-sky-50">
              <img
                src="/images/visual-guide/ramp-3d-model.jpg"
                alt={altText || data.title_en}
                className="w-full h-full object-cover select-none"
                loading="eager"
              />

              {/* Requirement 8 Overlay Badge: Intermediate Landing */}
              <div className="absolute right-3 bottom-3 sm:right-6 sm:bottom-4 bg-white/95 backdrop-blur-xs border border-sky-300 rounded-xl px-3.5 py-2 shadow-md hidden sm:flex items-center gap-2.5 animate-in fade-in">
                <span className="w-2.5 h-2.5 rounded-full bg-[#0284C7] animate-ping" />
                <div>
                  <p className="text-xs font-bold text-[#0B2D52]">
                    Landing every 9 m of ramp run or at a change of direction
                  </p>
                  <p className="text-[11px] text-[#0284C7] font-semibold">
                    हर 9 मीटर या दिशा बदलने पर समतल प्लेटफॉर्म
                  </p>
                </div>
              </div>

              {/* Interactive Hotspot Buttons for Student Exploration */}
              {RAMP_3D_HOTSPOTS.map((hotspot) => {
                const isSelected = selectedHotspotId === hotspot.id;
                return (
                  <button
                    key={hotspot.id}
                    type="button"
                    style={{ top: hotspot.top, left: hotspot.left }}
                    onClick={() => setSelectedHotspotId(hotspot.id)}
                    onMouseEnter={() => setSelectedHotspotId(hotspot.id)}
                    className={`hidden sm:flex absolute -translate-x-1/2 -translate-y-1/2 w-7 h-7 sm:w-8 sm:h-8 rounded-full items-center justify-center font-bold text-xs sm:text-sm shadow-md transition-all cursor-pointer ${
                      isSelected
                        ? "bg-amber-500 text-white ring-4 ring-amber-300 scale-125 z-20"
                        : "bg-[#0284C7] text-white hover:bg-sky-500 hover:scale-110 z-10"
                    }`}
                    aria-label={`${hotspot.label_en}: ${hotspot.val}`}
                    title={`${hotspot.label_en} / ${hotspot.label_hi}: ${hotspot.val}`}
                  >
                    {hotspot.num}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Mobile-Friendly Numbered Callouts Legend List (Below Image on Mobile < sm) */}
          <div className="sm:hidden space-y-2">
            <span className="text-xs font-bold text-slate-500 block uppercase tracking-wider">
              {isHi ? "मानक बिंदु चुनें (Tap to inspect):" : "Select Specification Marker:"}
            </span>
            <div className="grid grid-cols-2 gap-2">
              {RAMP_3D_HOTSPOTS.map((hotspot) => {
                const isSelected = selectedHotspotId === hotspot.id;
                return (
                  <button
                    key={hotspot.id}
                    type="button"
                    onClick={() => setSelectedHotspotId(hotspot.id)}
                    className={`flex items-center gap-2 p-2 rounded-xl text-left text-xs font-bold transition-all min-h-[44px] ${
                      isSelected
                        ? "bg-[#0B2D52] text-white shadow-xs ring-2 ring-teal-500"
                        : "bg-white text-slate-700 border border-slate-200 hover:bg-sky-50"
                    }`}
                  >
                    <span
                      className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 font-extrabold text-xs ${
                        isSelected ? "bg-amber-400 text-navy-950" : "bg-[#0284C7] text-white"
                      }`}
                    >
                      {hotspot.num}
                    </span>
                    <span className="truncate">{isHi ? hotspot.label_hi : hotspot.label_en}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* ACTIVE SPECIFICATION SPOTLIGHT CARD (Simple Student-Friendly Language) */}
          <div className="p-4 sm:p-5 rounded-2xl bg-white border border-sky-200/90 shadow-2xs">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-3 mb-3 border-b border-sky-100">
              <div className="flex items-center gap-3">
                <span className="w-8 h-8 rounded-full bg-amber-500 text-white font-extrabold text-sm flex items-center justify-center shrink-0 shadow-2xs">
                  {activeHotspot.num}
                </span>
                <div>
                  <h3 className="text-base sm:text-lg font-black text-[#0B2D52] flex items-center gap-2">
                    <span>{activeHotspot.label_en}</span>
                    <span className="text-slate-400 font-normal">/</span>
                    <span className="text-[#0284C7] font-bold">{activeHotspot.label_hi}</span>
                  </h3>
                  <p className="text-sm font-extrabold text-[#D97706]">
                    {activeHotspot.val}
                  </p>
                </div>
              </div>

              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-sans font-semibold bg-sky-50 text-[#0284C7] border border-sky-200 self-start md:self-auto break-words">
                <Check className="w-3.5 h-3.5 text-emerald-600" aria-hidden="true" />
                <span>Accessibility Code 2024 (Cl. 3.2)</span>
              </span>
            </div>

            <div className="space-y-1.5 text-xs sm:text-sm leading-relaxed">
              <p className="font-medium text-slate-800">
                <strong className="text-[#0B2D52]">Why it matters: </strong>
                {activeHotspot.explanation_en}
              </p>
              <p className="text-slate-600 font-normal">
                <strong className="text-[#0284C7]">सरल हिंदी व्याख्या: </strong>
                {activeHotspot.explanation_hi}
              </p>
            </div>
          </div>

          {/* ALL 8 KEY TECHNICAL SPECIFICATIONS QUICK GRID */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-600 flex items-center gap-2">
              <Layers className="w-3.5 h-3.5 text-[#0284C7]" aria-hidden="true" />
              <span>{isHi ? "सभी 8 अनिवार्य तकनीकी मानक (क्लिक करके जांचें)" : "All 8 Mandatory Technical Specifications (Click to Inspect)"}</span>
            </h4>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {RAMP_3D_HOTSPOTS.map((item) => {
                const isSelected = selectedHotspotId === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setSelectedHotspotId(item.id)}
                    className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                      isSelected
                        ? "bg-sky-50 border-[#0284C7] ring-2 ring-sky-200 shadow-2xs"
                        : "bg-white border-slate-200/90 hover:border-sky-300 hover:bg-slate-50/60"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-1 mb-1">
                      <span className={`w-5 h-5 rounded-full text-xs font-bold flex items-center justify-center shrink-0 ${
                        isSelected ? "bg-[#0284C7] text-white" : "bg-slate-100 text-slate-600"
                      }`}>
                        {item.num}
                      </span>
                      <span className="text-[11px] font-extrabold text-[#D97706] truncate">
                        {item.val.split(" ")[0]} {item.val.split(" ")[1] || ""}
                      </span>
                    </div>

                    <div className="text-xs font-bold text-[#0B2D52] truncate">
                      {isHi ? item.label_hi : item.label_en}
                    </div>
                    <div className="text-[11px] text-[#0284C7] font-semibold truncate">
                      {item.val}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* FULLSCREEN ZOOM MODAL */}
          {isZoomOpen && (
            <div
              className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6"
              role="dialog"
              aria-modal="true"
              aria-label="Enlarged architectural ramp schematic"
            >
              <div className="relative w-full max-w-5xl bg-white rounded-2xl overflow-hidden shadow-2xl p-4 sm:p-6 space-y-4">
                <div className="flex items-center justify-between border-b pb-3">
                  <div>
                    <h3 className="text-lg font-black text-[#0B2D52]">
                      {data.title_en} — {data.title_hi}
                    </h3>
                    <p className="text-xs text-slate-500">
                      High-Resolution Architectural Ramp Dimensions & Features
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

                <div className="w-full max-h-[75vh] overflow-auto rounded-xl border border-slate-200">
                  <img
                    src="/images/visual-guide/ramp-3d-model.jpg"
                    alt={altText || data.title_en}
                    className="w-full h-auto object-contain select-none"
                  />
                </div>

                <div className="flex items-center justify-between text-xs text-slate-600 pt-2">
                  <span>Mandatory Standards: Slope 1:12 | Width 1200 mm | Handrails 760 & 900 mm | Landing 1500×1500 mm</span>
                  <button
                    type="button"
                    onClick={() => setIsZoomOpen(false)}
                    className="px-4 py-1.5 rounded-lg bg-[#0284C7] text-white font-bold cursor-pointer hover:bg-sky-600"
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
// 2. CwSN TOILET SCHEMATIC — ARCHITECTURAL FLOOR PLAN REDESIGN (Reference Image Aligned)
