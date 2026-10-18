"use client";

import React, { useState } from "react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import {
  ScorecardResult,
  CategoryScoreResult,
} from "@/lib/scorecardCalculator";
import {
  ScoringConfig,
  DEFAULT_SCORING_CONFIG,
  ScoreCategoryKey,
} from "@/data/scoringConfigData";
import { ScorecardMethodologyModal } from "./ScorecardMethodologyModal";
import {
  BarChart3,
  HelpCircle,
  AlertTriangle,
  CheckCircle2,
  AlertOctagon,
  Maximize2,
  Droplets,
  BookOpen,
  ShieldAlert,
  Info,
  Calendar,
  Sparkles,
  ArrowUpRight,
} from "lucide-react";

interface SchoolScorecardProps {
  scorecard: ScorecardResult;
  isHindi: boolean;
  schoolName: string;
  lastAuditDate?: string;
  auditStatus?: "audited" | "pending" | "follow_up_required";
  config?: ScoringConfig;
}

export function SchoolScorecard({
  scorecard,
  isHindi,
  schoolName,
  lastAuditDate,
  auditStatus = "audited",
  config = DEFAULT_SCORING_CONFIG,
}: SchoolScorecardProps) {
  const [isMethodologyOpen, setIsMethodologyOpen] = useState(false);

  // Pillar icon mapping
  const getPillarIcon = (key: ScoreCategoryKey) => {
    switch (key) {
      case "entrance":
        return <Maximize2 className="w-4 h-4 text-teal-700 shrink-0" aria-hidden="true" />;
      case "toilets":
        return <Droplets className="w-4 h-4 text-teal-700 shrink-0" aria-hidden="true" />;
      case "classrooms":
        return <BookOpen className="w-4 h-4 text-teal-700 shrink-0" aria-hidden="true" />;
      case "safety":
        return <ShieldAlert className="w-4 h-4 text-teal-700 shrink-0" aria-hidden="true" />;
      default:
        return <BarChart3 className="w-4 h-4 text-teal-700 shrink-0" aria-hidden="true" />;
    }
  };

  const tier = scorecard.tier;

  return (
    <>
      <Card as="section" className="border-slate-200 shadow-xs p-6 space-y-6">
        {/* Header with Title & Methodology Action */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-teal-50 text-teal-800 flex items-center justify-center shrink-0 border border-teal-200">
              <BarChart3 className="w-5 h-5 text-teal-700" aria-hidden="true" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-navy-900 leading-tight">
                {isHindi ? "सुगम्यता मूल्यांकन स्कोरकार्ड" : "School Accessibility Scorecard"}
              </h2>
              <span className="text-[11px] text-slate-500 font-medium">
                {isHindi ? "100-अंकीय सार्वभौमिक डिजाइन मूल्यांकन" : "100-Point Universal Design Evaluation"}
              </span>
            </div>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsMethodologyOpen(true)}
            leftIcon={<HelpCircle className="w-3.5 h-3.5 text-teal-700" />}
            className="text-xs font-semibold self-start sm:self-auto border-teal-200 text-teal-800 hover:bg-teal-50"
            aria-haspopup="dialog"
          >
            {isHindi ? "यह स्कोर कैसे निकाला गया?" : "How this score is calculated"}
          </Button>
        </div>

        {/* If audit is pending */}
        {auditStatus === "pending" ? (
          <div className="flex flex-col items-center justify-center py-10 text-center space-y-3 bg-amber-50/50 rounded-xl border border-amber-200 p-6">
            <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center text-amber-700">
              <AlertTriangle className="w-6 h-6" aria-hidden="true" />
            </div>
            <div className="space-y-1">
              <h3 className="font-bold text-navy-900 text-base">
                {isHindi ? "मूल्यांकन ऑडिट प्रतीक्षित" : "Physical Audit Pending"}
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 max-w-md">
                {isHindi
                  ? "इस विद्यालय का प्राथमिक स्थल निरीक्षण अभी पूर्ण नहीं हुआ है। ऑडिट सत्यापन के उपरांत आधिकारिक शोध स्कोर प्रकाशित किया जाएगा।"
                  : "On-site quantitative measurements are scheduled. The verified research scorecard will be published upon audit verification."}
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Top Score Banner: Donut + Total Points + Tier Badge */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 p-4 sm:p-5 rounded-xl bg-slate-50 border border-slate-200/80">
              {/* Overall Points & Label */}
              <div className="space-y-2">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                  {isHindi ? "कुल शोध स्कोर (100 में से)" : "Total Research Score (Out of 100)"}
                </span>

                <div className="flex items-baseline gap-2">
                  <span className="text-5xl sm:text-6xl font-black text-navy-900 tabular-nums tracking-tight">
                    {scorecard.overallScore}
                  </span>
                  <span className="text-lg sm:text-xl text-slate-400 font-bold">
                    / 100
                  </span>
                </div>

                {/* Tier Badge with Non-Colour Indicator (Icon + Symbol + Text) */}
                <div className="flex items-center gap-2 pt-1 flex-wrap">
                  <span
                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black border shadow-2xs ${tier.bgClass} ${tier.borderClass}`}
                  >
                    <span className="text-sm font-black" aria-hidden="true">
                      {tier.symbol}
                    </span>
                    <span>{isHindi ? tier.badgeText_hi : tier.badgeText_en}</span>
                  </span>

                  {lastAuditDate && (
                    <span className="text-[11px] text-slate-500 flex items-center gap-1 font-medium">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" aria-hidden="true" />
                      <span>
                        {isHindi ? "जांच तिथि" : "Audited"}: {lastAuditDate}
                      </span>
                    </span>
                  )}
                </div>
              </div>

              {/* Accessible SVG Donut Visual Meter */}
              <div className="flex items-center gap-4 self-center sm:self-auto">
                <div
                  className="w-24 h-24 sm:w-28 sm:h-28 relative shrink-0"
                  role="img"
                  aria-label={`${isHindi ? "स्कोर मीटर" : "Score Meter"}: ${scorecard.overallScore} ${
                    isHindi ? "अंक" : "points"
                  } (${isHindi ? tier.label_hi : tier.label_en})`}
                >
                  <svg
                    viewBox="0 0 36 36"
                    className="w-full h-full -rotate-90"
                    aria-hidden="true"
                  >
                    {/* Background Ring */}
                    <circle
                      cx="18"
                      cy="18"
                      r="15.5"
                      fill="none"
                      stroke="#e2e8f0"
                      strokeWidth="3.2"
                    />
                    {/* Active Progress Arc */}
                    <circle
                      cx="18"
                      cy="18"
                      r="15.5"
                      fill="none"
                      stroke={tier.colorHex}
                      strokeWidth="3.2"
                      strokeDasharray={`${(scorecard.overallScore / 100) * 97.4} 97.4`}
                      strokeLinecap="round"
                      className="transition-all duration-700 ease-out"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                    <span className="text-lg font-black text-navy-900 tabular-nums leading-none">
                      {scorecard.overallScore}%
                    </span>
                    <span className="text-[10px] font-bold text-slate-500 uppercase mt-0.5">
                      {isHindi ? "अनुपालन" : "Score"}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* 4 Architectural Categories Breakdown */}
            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-700 uppercase tracking-wider">
                  {isHindi ? "स्तंभवार सुगम्यता विवरण (Category Breakdown)" : "Pillar Breakdown & Weight Distribution"}
                </span>
                <span className="text-slate-500 text-[11px]">
                  {isHindi ? "मानक अनुरूपता अनुपात" : "Standard Compliance Ratio"}
                </span>
              </div>

              <div className="space-y-3.5">
                {(Object.keys(scorecard.categories) as ScoreCategoryKey[]).map((catKey) => {
                  const cat = scorecard.categories[catKey];
                  const pct = cat.compliancePercentage;

                  // Semantic color token per WCAG non-colour-only requirement
                  const barColor =
                    pct >= 80 ? "bg-teal-600" : pct >= 50 ? "bg-amber-500" : "bg-rose-500";
                  const statusSymbol = pct >= 80 ? "✓" : pct >= 50 ? "▲" : "✕";

                  return (
                    <div
                      key={catKey}
                      className="p-3 rounded-lg border border-slate-100 bg-white hover:border-slate-200 transition-colors space-y-2"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          {getPillarIcon(catKey)}
                          <span className="font-bold text-sm text-navy-900">
                            {isHindi ? cat.name_hi : cat.name_en}
                          </span>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          <span className="text-xs font-mono font-bold text-navy-900 tabular-nums">
                            {cat.pointsEarned} / {cat.maxWeight} {isHindi ? "अंक" : "pts"}
                          </span>
                          <span
                            className="text-[11px] font-bold px-1.5 py-0.5 rounded bg-slate-100 text-slate-700"
                            title={`${cat.compliantCount} of ${cat.evaluatedCount} indicators compliant`}
                          >
                            {statusSymbol} {cat.compliancePercentage}%
                          </span>
                        </div>
                      </div>

                      {/* Accessible Progress Bar (WCAG 2.2 AA) */}
                      <div
                        className="w-full h-2.5 rounded-full bg-slate-100 overflow-hidden"
                        role="progressbar"
                        aria-valuenow={cat.pointsEarned}
                        aria-valuemin={0}
                        aria-valuemax={cat.maxWeight}
                        aria-label={`${isHindi ? cat.name_hi : cat.name_en}: ${cat.pointsEarned} ${
                          isHindi ? "अंक प्राप्त" : "points earned"
                        } out of ${cat.maxWeight} maximum (${cat.compliancePercentage}%)`}
                      >
                        <div
                          className={`h-full rounded-full transition-all duration-500 ease-out ${barColor}`}
                          style={{ width: `${Math.min(100, (cat.pointsEarned / cat.maxWeight) * 100)}%` }}
                        />
                      </div>

                      {/* Details & Deficiencies count if evaluated */}
                      <div className="flex items-center justify-between text-[11px] text-slate-500 pt-0.5">
                        <span>
                          {cat.evaluatedCount > 0 ? (
                            <>
                              {isHindi ? "जाँचे गए संकेतक" : "Evaluated"}: {cat.compliantCount}/{cat.evaluatedCount}{" "}
                              {isHindi ? "मानक अनुरूप" : "compliant"}
                            </>
                          ) : (
                            <span className="text-slate-400 italic">
                              {isHindi ? "इस श्रेणी का नापजोख प्रतीक्षित" : "Measurements pending for this pillar"}
                            </span>
                          )}
                        </span>

                        {cat.deficientCount > 0 && (
                          <span className="text-rose-700 font-semibold flex items-center gap-1">
                            <AlertOctagon className="w-3 h-3 text-rose-600" aria-hidden="true" />
                            <span>
                              {cat.deficientCount} {isHindi ? "बाधाएं चिह्नित" : "barriers identified"}
                            </span>
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Mandatory Academic Research Disclaimer Box */}
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-600 space-y-1">
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800">
                <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" aria-hidden="true" />
                <span>{isHindi ? "वैधानिक शोध सूचना" : "Academic Research Notice"}</span>
              </div>
              <p className="text-xs leading-relaxed font-hindi">
                {isHindi ? scorecard.disclaimer_hi : scorecard.disclaimer_en}
              </p>
              <p className="text-[11px] text-slate-500 italic">
                {isHindi
                  ? "यह स्कोर किसी सरकारी प्रमाणीकरण या अनापत्ति प्रमाण-पत्र (NOC) का विकल्प नहीं है। यह NCPEDP फेलोशिप शोध अध्ययन के अंतर्गत निर्मित स्वतंत्र विश्लेषणात्मक मूल्यांकन है।"
                  : "This research score is not an official government certification or building endorsement. It is an independent academic research evaluation developed under the NCPEDP Fellowship."}
              </p>
            </div>
          </div>
        )}
      </Card>

      {/* Methodology Modal */}
      <ScorecardMethodologyModal
        isOpen={isMethodologyOpen}
        onClose={() => setIsMethodologyOpen(false)}
        isHindi={isHindi}
        config={config}
      />
    </>
  );
}
