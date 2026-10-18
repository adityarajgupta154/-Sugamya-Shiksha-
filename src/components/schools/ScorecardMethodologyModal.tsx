"use client";

import React from "react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import {
  ScoringConfig,
  DEFAULT_SCORING_CONFIG,
  ScoreCategoryKey,
} from "@/data/scoringConfigData";
import {
  Info,
  ShieldCheck,
  Scale,
  Award,
  AlertTriangle,
  BookOpen,
  Maximize2,
  Droplets,
  ShieldAlert,
  HelpCircle,
  ExternalLink,
} from "lucide-react";

interface ScorecardMethodologyModalProps {
  isOpen: boolean;
  onClose: () => void;
  isHindi: boolean;
  config?: ScoringConfig;
}

export function ScorecardMethodologyModal({
  isOpen,
  onClose,
  isHindi,
  config = DEFAULT_SCORING_CONFIG,
}: ScorecardMethodologyModalProps) {
  const meth = config.methodology;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isHindi ? meth.title_hi : meth.title_en}
      description={
        isHindi
          ? "यह स्कोर ऑन-साइट भौतिक ऑडिट डेटा और भारत सरकार के वैधानिक सार्वभौमिक सुगम्यता मानकों पर आधारित है।"
          : "Transparent breakdown of the 100-point universal design score computed from empirical field audits."
      }
      size="lg"
    >
      <div className="space-y-6 max-h-[75vh] overflow-y-auto pr-1 text-slate-800 text-sm">
        {/* Prominent Mandatory Research Disclaimer Banner */}
        <div className="p-4 rounded-xl bg-amber-50 border-2 border-amber-300 text-amber-950 flex items-start gap-3 shadow-xs">
          <AlertTriangle
            className="w-5 h-5 text-amber-700 shrink-0 mt-0.5"
            aria-hidden="true"
          />
          <div className="space-y-1">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-800 block">
              {isHindi ? "अनिवार्य शोध प्रकटीकरण (Mandatory Notice)" : "Mandatory Research Disclosure"}
            </span>
            <p className="font-semibold text-xs sm:text-sm">
              {isHindi ? config.disclaimer_hi : config.disclaimer_en}
            </p>
            <p className="text-xs text-amber-900/80">
              {isHindi
                ? "यह मूल्यांकन NCPEDP फेलोशिप शोध अध्ययन के अंतर्गत निष्पक्ष ऑन-साइट नापजोख पर आधारित है। यह किसी भी शिक्षा विभाग या नगर निगम का आधिकारिक अनापत्ति प्रमाण पत्र (NOC) नहीं है।"
                : "This assessment is generated through independent academic on-site field measurements under the NCPEDP Fellowship. It does not constitute a statutory clearance, compliance certificate, or government NOC."}
            </p>
          </div>
        </div>

        {/* Scoring Formula Box */}
        <div className="p-4 rounded-xl bg-slate-900 text-white space-y-3">
          <div className="flex items-center gap-2 text-teal-300 text-xs font-bold uppercase tracking-wider">
            <Scale className="w-4 h-4 text-teal-400" aria-hidden="true" />
            <span>{isHindi ? "स्कोर गणना सूत्र (Calculation Formula)" : "Scoring Mathematical Formula"}</span>
          </div>
          <div className="bg-slate-800/90 p-3 rounded-lg border border-slate-700 font-mono text-xs sm:text-sm text-teal-200 leading-relaxed whitespace-pre-line">
            {isHindi ? meth.formula_hi : meth.formula_en}
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            {isHindi ? meth.description_hi : meth.description_en}
          </p>
        </div>

        {/* 4 Architectural Category Pillars Breakdown */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-navy-900 text-base flex items-center gap-2">
              <Award className="w-4 h-4 text-teal-700" aria-hidden="true" />
              <span>{isHindi ? "4 मुख्य सुगम्यता स्तंभ एवं अधिकतम अंक" : "4 Core Architectural Pillars & Weights"}</span>
            </h3>
            <span className="text-xs font-bold text-teal-700 bg-teal-50 px-2.5 py-1 rounded-full border border-teal-200">
              {isHindi ? "कुल: 100 अंक" : "Total: 100 Points"}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {(Object.keys(config.categories) as ScoreCategoryKey[]).map((catKey) => {
              const cat = config.categories[catKey];
              return (
                <div
                  key={cat.key}
                  className="p-3.5 rounded-xl border border-slate-200 bg-white shadow-xs space-y-2 flex flex-col justify-between"
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {catKey === "entrance" && <Maximize2 className="w-4 h-4 text-teal-700" aria-hidden="true" />}
                        {catKey === "toilets" && <Droplets className="w-4 h-4 text-teal-700" aria-hidden="true" />}
                        {catKey === "classrooms" && <BookOpen className="w-4 h-4 text-teal-700" aria-hidden="true" />}
                        {catKey === "safety" && <ShieldAlert className="w-4 h-4 text-teal-700" aria-hidden="true" />}
                        <h4 className="font-bold text-sm text-navy-900">
                          {isHindi ? cat.name_hi : cat.name_en}
                        </h4>
                      </div>
                      <Badge variant="default" className="text-xs font-bold bg-teal-50 text-teal-800 border-teal-200">
                        {cat.weight} {isHindi ? "अंक" : "pts"}
                      </Badge>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      {isHindi ? cat.description_hi : cat.description_en}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                    <span>
                      {isHindi ? "संबंधित संकेतक" : "Covers"}: {cat.standardCategories.join(", ")}
                    </span>
                    <span className="font-semibold text-teal-800">
                      {cat.weight}% {isHindi ? "भार" : "weight"}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 3-Tier Classification Table (Accessible, Non-Color Only) */}
        <div className="space-y-3">
          <h3 className="font-bold text-navy-900 text-base flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-teal-700" aria-hidden="true" />
            <span>{isHindi ? "सुगम्यता श्रेणियां (3-Tier Classification)" : "3-Tier Accessibility Benchmarks"}</span>
          </h3>

          <div className="space-y-2">
            {config.tiers.map((tier) => (
              <div
                key={tier.id}
                className={`p-3 rounded-lg border flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${tier.bgClass} ${tier.borderClass}`}
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span
                      className="font-black text-sm px-2 py-0.5 rounded bg-white/80 border shadow-2xs"
                      aria-hidden="true"
                    >
                      {tier.symbol}
                    </span>
                    <span className="font-bold text-sm">
                      {isHindi ? tier.label_hi : tier.label_en}
                    </span>
                    <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded bg-white/70">
                      {tier.minScore} – {tier.maxScore} {isHindi ? "अंक" : "pts"}
                    </span>
                  </div>
                  <p className="text-xs text-slate-700 leading-snug">
                    {isHindi ? tier.description_hi : tier.description_en}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Statutory Standards Sources */}
        <div className="space-y-3 pt-2 border-t border-slate-200">
          <h3 className="font-bold text-navy-900 text-base flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-teal-700" aria-hidden="true" />
            <span>{isHindi ? "वैधानिक संदर्भ एवं मानक स्रोत" : "Statutory Standards Citations"}</span>
          </h3>
          <ul className="space-y-2 text-xs" role="list">
            {meth.statutorySources.map((src, idx) => (
              <li
                key={idx}
                className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 flex flex-col gap-1"
              >
                <div className="flex items-center justify-between font-semibold text-navy-900">
                  <span>{src.title}</span>
                  <span className="text-[11px] text-teal-700 font-mono">({src.year})</span>
                </div>
                <p className="text-slate-600 text-[11px]">{src.authority}</p>
                <p className="text-slate-500 italic text-[11px]">{src.relevance}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="pt-4 border-t border-slate-200 flex justify-end">
        <Button variant="secondary" size="sm" onClick={onClose}>
          {isHindi ? "समझ गया / बंद करें" : "Got It / Close"}
        </Button>
      </div>
    </Modal>
  );
}
