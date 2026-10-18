"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";
import { SchoolRecommendation, DEMO_RECOMMENDATIONS } from "@/data/trackerData";
import {
  AlertCircle,
  CheckCircle2,
  ChevronRight,
  Clock,
  Coins,
  FileCheck2,
  HardHat,
  HelpCircle,
  Lightbulb,
  ListOrdered,
  Sparkles,
  UserCheck,
  Wrench,
  ArrowRight,
  ShieldAlert,
} from "lucide-react";
import { clsx } from "clsx";

interface SchoolRecommendationsProps {
  schoolId: string;
  recommendations?: SchoolRecommendation[];
  schoolName?: string;
}

const PRIORITY_BADGES_HI: Record<string, { label: string; bg: string; text: string; icon: any }> = {
  critical: {
    label: "अति-गंभीर (तत्काल सुधार आवश्यक)",
    bg: "bg-rose-100 border-rose-300",
    text: "text-rose-900",
    icon: AlertCircle,
  },
  high: {
    label: "उच्च प्राथमिकता",
    bg: "bg-amber-100 border-amber-300",
    text: "text-amber-900",
    icon: Clock,
  },
  medium: {
    label: "मध्यम प्राथमिकता (नियोजित)",
    bg: "bg-sky-100 border-sky-300",
    text: "text-sky-900",
    icon: Sparkles,
  },
};

const PRIORITY_BADGES_EN: Record<string, { label: string; bg: string; text: string; icon: any }> = {
  critical: {
    label: "Critical (Immediate Action)",
    bg: "bg-rose-100 border-rose-300",
    text: "text-rose-900",
    icon: AlertCircle,
  },
  high: {
    label: "High Priority",
    bg: "bg-amber-100 border-amber-300",
    text: "text-amber-900",
    icon: Clock,
  },
  medium: {
    label: "Medium Priority (Planned)",
    bg: "bg-sky-100 border-sky-300",
    text: "text-sky-900",
    icon: Sparkles,
  },
};

const COST_TIERS_HI: Record<string, { label: string; desc: string }> = {
  low_cost: {
    label: "कम लागत सुधार (₹0 - ₹2,000)",
    desc: "दहलीज हटाना, दरवाज़ा रुख उलटना, ग्रैब रेल या नल नीचे करना — स्थानीय मिस्त्री या SMC स्तर पर तुरंत संभव।",
  },
  medium_cost: {
    label: "मध्यम लागत सुधार (₹2,000 - ₹10,000)",
    desc: "ब्रेल साइनेज बोर्ड, स्पर्शनीय टाइल्स (TGSI), एंटी-स्किड फ्लोरिंग।",
  },
  structural: {
    label: "संरचनात्मक पुनर्निर्माण (सिविल कार्य)",
    desc: "रैंप ढलान 1:12 पर दोबारा ढालना, सुगम्य शौचालय ब्लॉक का नवनिर्माण — सर्व शिक्षा / शिक्षा विभाग बजट आवश्यक।",
  },
};

const COST_TIERS_EN: Record<string, { label: string; desc: string }> = {
  low_cost: {
    label: "Low-Cost Intervention (₹0 - ₹2,000)",
    desc: "Door swing reversal, grab rails, threshold leveling, tap lowering — immediately feasible via SMC funds.",
  },
  medium_cost: {
    label: "Medium-Cost Intervention (₹2,000 - ₹10,000)",
    desc: "Tactile ground surface indicators (TGSI), tactile & Braille room signage, non-slip coatings.",
  },
  structural: {
    label: "Structural Reconstruction (Civil Works)",
    desc: "Full ramp rebuilding to 1:12 slope, accessible toilet block construction — requires Department budget allocation.",
  },
};

const ACTION_PARTIES_HI: Record<string, string> = {
  SMC: "विद्यालय प्रबंधन समिति (SMC)",
  Headmaster: "प्रधानाध्यापक (Headmaster)",
  Education_Dept: "शिक्षा विभाग / BEO दानापुर",
  Local_Mason: "स्थानीय मिस्त्री / जनसहयोग",
};

const ACTION_PARTIES_EN: Record<string, string> = {
  SMC: "School Management Committee (SMC)",
  Headmaster: "School Headmaster / Principal",
  Education_Dept: "Education Department / BEO Danapur",
  Local_Mason: "Local Mason / Community Mobilization",
};

export function SchoolRecommendations({
  schoolId,
  recommendations,
  schoolName,
}: SchoolRecommendationsProps) {
  const { locale } = useLanguage();
  const isHi = locale === "hi";

  const [filterPriority, setFilterPriority] = useState<string>("all");

  // Load recommendations for this school or fallback to DEMO
  const recList =
    recommendations ||
    DEMO_RECOMMENDATIONS.filter((r) => r.schoolId === schoolId);

  // If no recommendations exist specifically, provide default Danapur recommendations
  const displayList =
    recList.length > 0
      ? recList
      : DEMO_RECOMMENDATIONS.filter((r) => r.schoolId === "sch-danapur-01");

  const filteredRecs = displayList.filter(
    (item) => filterPriority === "all" || item.priority === filterPriority
  );

  const priorityBadges = isHi ? PRIORITY_BADGES_HI : PRIORITY_BADGES_EN;
  const costTiers = isHi ? COST_TIERS_HI : COST_TIERS_EN;
  const actionParties = isHi ? ACTION_PARTIES_HI : ACTION_PARTIES_EN;

  return (
    <section
      aria-labelledby="recommendations-heading"
      className="bg-white rounded-2xl border border-slate-200 p-6 md:p-8 shadow-xs space-y-6"
    >
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-900 border border-amber-200 mb-2">
            <Lightbulb className="w-3.5 h-3.5 text-amber-600" aria-hidden="true" />
            <span>
              {isHi
                ? "ऑडिट आधारित सुधारात्मक अनुशंसाएं"
                : "Audit-Linked Remedial Recommendations"}
            </span>
          </div>
          <h2
            id="recommendations-heading"
            className="text-2xl font-bold text-navy-900 tracking-tight"
          >
            {isHi
              ? "सुगम्यता सुधार कार्ययोजना एवं प्राथमिकताएं"
              : "Accessibility Action Plan & Recommendations"}
          </h2>
          <p className="text-sm text-slate-600 mt-1 max-w-2xl">
            {isHi
              ? "भौतिक निरीक्षण में पाए गए विचलनों के आधार पर वैधानिक मानकों (Accessibility Code 2024) के अनुरूप प्राथमिकताप्राप्त कदम।"
              : "Prioritized engineering and architectural solutions mapped directly to audit findings and the 2024 National Educational Accessibility Code."}
          </p>
        </div>

        {/* Priority Filter */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs font-bold text-slate-600">
            {isHi ? "प्राथमिकता:" : "Priority:"}
          </span>
          <button
            type="button"
            onClick={() => setFilterPriority("all")}
            className={clsx(
              "px-3 py-1 rounded-lg text-xs font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-600",
              filterPriority === "all"
                ? "bg-navy-900 text-white"
                : "bg-slate-100 text-slate-700 hover:bg-slate-200"
            )}
          >
            {isHi ? "सभी" : "All"} ({displayList.length})
          </button>
          <button
            type="button"
            onClick={() => setFilterPriority("critical")}
            className={clsx(
              "px-3 py-1 rounded-lg text-xs font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-600",
              filterPriority === "critical"
                ? "bg-rose-700 text-white"
                : "bg-rose-50 text-rose-800 hover:bg-rose-100"
            )}
          >
            {isHi ? "गंभीर" : "Critical"}
          </button>
          <button
            type="button"
            onClick={() => setFilterPriority("high")}
            className={clsx(
              "px-3 py-1 rounded-lg text-xs font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-600",
              filterPriority === "high"
                ? "bg-amber-600 text-white"
                : "bg-amber-50 text-amber-800 hover:bg-amber-100"
            )}
          >
            {isHi ? "उच्च" : "High"}
          </button>
        </div>
      </div>

      {/* Recommendations Cards Grid */}
      <div className="grid grid-cols-1 gap-6">
        {filteredRecs.map((rec, index) => {
          const pBadge = priorityBadges[rec.priority] || priorityBadges.medium;
          const PriorityIcon = pBadge.icon;
          const costInfo = costTiers[rec.costTier] || costTiers.low_cost;
          const partyLabel = actionParties[rec.actionParty] || rec.actionParty;

          return (
            <div
              key={rec.id}
              className="rounded-xl border border-slate-200 bg-slate-50/50 p-5 md:p-6 space-y-4 hover:border-slate-300 transition-colors"
            >
              {/* Row 1: Badges & Parameter */}
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-navy-800 text-white text-xs font-bold flex items-center justify-center shrink-0">
                    {index + 1}
                  </span>
                  <span
                    className={clsx(
                      "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border",
                      pBadge.bg,
                      pBadge.text
                    )}
                  >
                    <PriorityIcon className="w-3.5 h-3.5" aria-hidden="true" />
                    <span>{pBadge.label}</span>
                  </span>
                </div>

                {/* Responsible Action Party */}
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-700 bg-white px-3 py-1 rounded-lg border border-slate-200">
                  <UserCheck className="w-3.5 h-3.5 text-teal-600" aria-hidden="true" />
                  <span>{isHi ? "उत्तरदायी इकाई: " : "Action: "}</span>
                  <span className="text-navy-900">{partyLabel}</span>
                </div>
              </div>

              {/* Row 2: Finding vs Recommendation */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Audit Finding */}
                <div className="bg-white rounded-lg p-4 border border-rose-100">
                  <div className="text-xs font-bold uppercase tracking-wider text-rose-800 flex items-center gap-1.5 mb-1.5">
                    <ShieldAlert className="w-3.5 h-3.5 text-rose-600" aria-hidden="true" />
                    <span>{isHi ? "ऑडिट में पाया गया विचलन" : "Field Audit Finding"}</span>
                  </div>
                  <p className="text-sm text-slate-800 leading-relaxed font-medium">
                    {isHi ? rec.finding_hi : rec.finding_en}
                  </p>
                </div>

                {/* Actionable Engineering Recommendation */}
                <div className="bg-teal-50/60 rounded-lg p-4 border border-teal-200">
                  <div className="text-xs font-bold uppercase tracking-wider text-teal-900 flex items-center gap-1.5 mb-1.5">
                    <Wrench className="w-3.5 h-3.5 text-teal-700" aria-hidden="true" />
                    <span>{isHi ? "अनुशंसित तकनीकी समाधान" : "Recommended Solution"}</span>
                  </div>
                  <p className="text-sm text-slate-900 leading-relaxed font-semibold">
                    {isHi ? rec.recommendation_hi : rec.recommendation_en}
                  </p>
                </div>
              </div>

              {/* Row 3: Statutory Reference & Cost Tier */}
              <div className="pt-3 border-t border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-600">
                <div className="flex items-center gap-2 font-medium text-navy-900">
                  <FileCheck2 className="w-4 h-4 text-teal-700 shrink-0" aria-hidden="true" />
                  <span>
                    <strong className="text-slate-500">{isHi ? "मानक संदर्भ: " : "Statutory Ref: "}</strong>
                    {rec.standardReference}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <Coins className="w-3.5 h-3.5 text-amber-700 shrink-0" aria-hidden="true" />
                  <span className="font-semibold text-slate-800">{costInfo.label}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Link to School Tracker Entries */}
      <div className="bg-navy-900 text-white rounded-xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-teal-400" aria-hidden="true" />
            <span>{isHi ? "क्या इस विद्यालय में सुधार हुआ है?" : "Has this school improved?"}</span>
          </h3>
          <p className="text-xs text-slate-300 mt-1">
            {isHi
              ? "पहले और बाद के सत्यापित फोटोग्राफिक प्रमाण एवं समयसीमा देखने हेतु सुधार ट्रैकर पर जाएं।"
              : "View verified before/after photographic transformations and progress logs in the Impact Tracker."}
          </p>
        </div>
        <Link
          href={`/tracker?school=${schoolId}`}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-teal-600 hover:bg-teal-500 text-white text-xs font-bold tracking-wide transition-colors shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-300"
        >
          <span>{isHi ? "सुधार ट्रैकर देखें" : "View Impact Tracker"}</span>
          <ArrowRight className="w-4 h-4" aria-hidden="true" />
        </Link>
      </div>
    </section>
  );
}
