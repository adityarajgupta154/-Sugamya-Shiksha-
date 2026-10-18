"use client";

import React, { useState } from "react";
import { SchematicShell } from "./SchematicShell";
import { SCHEMATIC_MODULES_DATA } from "@/data/schematicData";
import { Maximize2, X, Sparkles, Check, Layers } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

interface DiagramProps {
  altText?: string;
}
const TOILET_HOTSPOTS: Array<{
  id: string;
  num: number;
  top: string;
  left: string;
  label_en: string;
  label_hi: string;
  val: string;
}> = [
  { id: "room-width", num: 1, top: "4.5%", left: "49%", label_en: "Room width", label_hi: "कक्ष की चौड़ाई", val: "2000 mm" },
  { id: "room-depth", num: 2, top: "47%", left: "6.5%", label_en: "Room depth", label_hi: "कक्ष की गहराई", val: "2200 mm" },
  { id: "turning-circle", num: 3, top: "58.5%", left: "46%", label_en: "Turning circle", label_hi: "घुमाव दायरा", val: "Ø 1500 mm" },
  { id: "washbasin", num: 4, top: "30.5%", left: "41.5%", label_en: "Wash basin", label_hi: "वॉश बेसिन", val: "750 mm" },
  { id: "wc-seat", num: 5, top: "37%", left: "71%", label_en: "WC seat height", label_hi: "कमोड सीट", val: "450–480 mm" },
  { id: "l-grabbar", num: 6, top: "24.5%", left: "92.5%", label_en: "L-grab bar", label_hi: "L-ग्रैब बार", val: "700 × 600 mm" },
  { id: "foldup-grabbar", num: 7, top: "39%", left: "92%", label_en: "Fold-up bar", label_hi: "फोल्ड-अप बार", val: "800 mm" },
  { id: "emergency-cord", num: 8, top: "63.5%", left: "92%", label_en: "Alarm cord", label_hi: "अलार्म कॉर्ड", val: "100 & 900 mm" },
  { id: "clear-door", num: 9, top: "88%", left: "35%", label_en: "Clear door", label_hi: "सुलभ द्वार", val: "900 mm" },
];

export function ToiletDiagram({ altText }: DiagramProps) {
  const data = SCHEMATIC_MODULES_DATA.toilet;
  const { locale } = useLanguage();
  const isHi = locale === "hi";

  const [selectedSpecId, setSelectedSpecId] = useState<string>("turning-circle");
  const [isZoomOpen, setIsZoomOpen] = useState(false);

  // Active specification for the spotlight card
  const activeSpec =
    data.callouts.find((c) => c.id === selectedSpecId) || data.callouts[2];

  return (
    <SchematicShell data={data}>
      {({ isHighContrast }) => (
        <div className="space-y-5">
          {/* TOP ARCHITECTURAL TOOLBAR */}
          <div className="flex flex-wrap items-center justify-between gap-3 p-2 bg-white/95 rounded-xl border border-sky-200/90 shadow-2xs">
            <div className="flex items-center gap-2 px-2.5 py-1 text-xs font-bold text-[#0B2D52]">
              <Sparkles className="w-4 h-4 text-[#0284C7]" aria-hidden="true" />
              <span>
                {isHi
                  ? "स्थापत्य तल-योजना (शीर्ष दृश्य) — आधिकारिक आयाम"
                  : "Architectural Floor Plan (Top-Down Plan View) — Statutory Dimensions"}
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
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 hover:text-[#0284C7] shadow-2xs transition-colors cursor-pointer"
                title={isHi ? "रेखाचित्र को बड़ा करके देखें" : "Zoom into architectural drawing"}
                aria-label={isHi ? "रेखाचित्र को बड़ा करके देखें" : "Zoom into architectural drawing"}
              >
                <Maximize2 className="w-3.5 h-3.5" aria-hidden="true" />
                <span>{isHi ? "ज़ूम देखें" : "Enlarge"}</span>
              </button>
            </div>
          </div>

          {/* MAIN VISUAL CANVAS — HIGH RESOLUTION TOP-DOWN ARCHITECTURAL FLOOR PLAN */}
          <div className="relative w-full rounded-2xl overflow-hidden border border-sky-200/90 shadow-xs bg-[#F4FAFD]">
            {/* Screen Reader plain-text description */}
            <div className="sr-only">
              {isHi ? data.srOnlyDescription_hi : data.srOnlyDescription_en}
            </div>

            <div className="relative w-full aspect-[3/2] bg-[#F4FAFD] flex items-center justify-center overflow-hidden">
              <img
                src="/images/visual-guide/Accessible School Toilet Layout Diagram.png"
                alt={altText || (isHi ? data.title_hi : data.title_en)}
                className="w-full h-full object-contain select-none"
                loading="eager"
              />

              {/* Interactive Hotspot Buttons for Student & Auditor Exploration */}
              {TOILET_HOTSPOTS.map((hotspot) => {
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
                      <span
                        className={`absolute inline-flex h-7 w-7 rounded-full opacity-75 ${
                          isSelected ? "bg-[#0066FF] animate-ping" : "bg-sky-400 group-hover:bg-[#0066FF]"
                        }`}
                      />
                      <span
                        className={`relative inline-flex items-center justify-center h-6 w-6 rounded-full text-[11px] font-black shadow-md border-2 transition-transform duration-150 group-hover:scale-115 ${
                          isSelected
                            ? "bg-[#0066FF] text-white border-white ring-2 ring-blue-300"
                            : "bg-white text-[#0066FF] border-[#0066FF] group-hover:bg-blue-50"
                        }`}
                      >
                        {hotspot.num}
                      </span>
                    </span>

                    <span className="absolute left-1/2 -translate-x-1/2 -top-7 hidden group-hover:flex items-center px-2 py-0.5 rounded-md bg-[#0B2D52] text-white text-[10px] font-bold whitespace-nowrap shadow-md pointer-events-none z-20">
                      {isHi ? hotspot.label_hi : hotspot.label_en} ({hotspot.val})
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* ACTIVE SPECIFICATION SPOTLIGHT CARD (Simple Student-Friendly Language) */}
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

              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-mono font-semibold bg-sky-50 text-[#0284C7] border border-sky-200 self-start md:self-auto">
                <Check className="w-3.5 h-3.5 text-emerald-600" aria-hidden="true" />
                <span>Accessibility Code 2024 (Cl. 5.1 &amp; Harmonised Cl. 5.3)</span>
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

          {/* ALL 9 MANDATORY TECHNICAL SPECIFICATIONS QUICK-SELECTOR GRID */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-600 flex items-center gap-2">
              <Layers className="w-3.5 h-3.5 text-[#0066FF]" aria-hidden="true" />
              <span>
                {isHi
                  ? "सभी 9 अनिवार्य तकनीकी मानक (क्लिक करके जांचें)"
                  : "All 9 Mandatory Technical Specifications (Click to Inspect)"}
              </span>
            </h4>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5">
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

          {/* FULLSCREEN ZOOM MODAL */}
          {isZoomOpen && (
            <div
              className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6"
              role="dialog"
              aria-modal="true"
              aria-label="Enlarged architectural toilet schematic"
            >
              <div className="relative w-full max-w-6xl bg-white rounded-2xl overflow-hidden shadow-2xl p-4 sm:p-6 space-y-4">
                <div className="flex items-center justify-between border-b pb-3">
                  <div>
                    <h3 className="text-lg font-black text-[#0B2D52]">
                      {data.title_en} — {data.title_hi}
                    </h3>
                    <p className="text-xs text-slate-500">
                      High-Resolution Architectural Floor Plan &amp; Statutory Key Dimensions
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

                <div className="w-full max-h-[75vh] overflow-auto rounded-xl border border-slate-200 bg-[#F4FAFD] p-2 flex items-center justify-center">
                  <img
                    src="/images/visual-guide/Accessible School Toilet Layout Diagram.png"
                    alt={altText || (isHi ? data.title_hi : data.title_en)}
                    className="max-w-full max-h-[72vh] w-auto h-auto object-contain select-none"
                  />
                </div>

                <div className="flex items-center justify-between text-xs text-slate-600 pt-2">
                  <span>
                    Mandatory Dimensions: Room 2000×2200 mm | Turning Circle Ø 1500 mm | Basin 750 mm | WC 450–480 mm | Bars 700×600 &amp; 800 mm | Door 900 mm | Alarm 100 &amp; 900 mm
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
