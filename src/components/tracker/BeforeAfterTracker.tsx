"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useLanguage } from "@/context/LanguageContext";
import { TrackerEntry, TrackerStage } from "@/data/trackerData";
import {
  CheckCircle2,
  Clock,
  ArrowRight,
  ShieldCheck,
  Building,
  Calendar,
  Layers,
  Sparkles,
  ExternalLink,
  ChevronRight,
  SlidersHorizontal,
  Eye,
  FileCheck2,
  AlertTriangle,
} from "lucide-react";
import { clsx } from "clsx";

interface BeforeAfterTrackerProps {
  entries: TrackerEntry[];
  showSchoolFilter?: boolean;
  selectedSchoolId?: string;
  onSchoolChange?: (schoolId: string) => void;
  title?: string;
  subtitle?: string;
}

const CATEGORY_NAMES_HI: Record<string, string> = {
  ramp: "रैंप एवं रेलिंग",
  toilet: "दिव्यांग शौचालय (CwSN)",
  entrance: "मुख्य प्रवेश द्वार",
  drinkingWater: "पेयजल सुविधा",
  classroom: "कक्षा कक्ष एवं चौखट",
  pathway: "आवागमन मार्ग (Pathway)",
};

const CATEGORY_NAMES_EN: Record<string, string> = {
  ramp: "Ramp & Handrails",
  toilet: "Accessible CwSN Toilet",
  entrance: "Main Entrance",
  drinkingWater: "Drinking Water Tap",
  classroom: "Classroom & Threshold",
  pathway: "Pedestrian Pathway",
};

export function BeforeAfterTracker({
  entries,
  showSchoolFilter = true,
  selectedSchoolId = "all",
  onSchoolChange,
  title,
  subtitle,
}: BeforeAfterTrackerProps) {
  const { locale } = useLanguage();
  const isHi = locale === "hi";

  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [activeSchool, setActiveSchool] = useState<string>(selectedSchoolId);
  const [photoViewMode, setPhotoViewMode] = useState<Record<string, "split" | "before" | "after">>({});
  const [selectedPhotoModal, setSelectedPhotoModal] = useState<{ url: string; caption: string; label: string } | null>(null);

  // Filter only verified entries for public presentation per PRD 6.2-E
  const publicVerifiedEntries = entries.filter(
    (e) => e.verificationStatus === "verified"
  );

  // Apply filters
  const filteredEntries = publicVerifiedEntries.filter((entry) => {
    const matchesCategory =
      activeCategory === "all" || entry.category === activeCategory;
    const matchesSchool =
      activeSchool === "all" || entry.schoolId === activeSchool;
    return matchesCategory && matchesSchool;
  });

  // Unique schools for filter dropdown
  const uniqueSchools = Array.from(
    new Map(
      publicVerifiedEntries.map((e) => [
        e.schoolId,
        { id: e.schoolId, name_hi: e.schoolName_hi, name_en: e.schoolName_en },
      ])
    ).values()
  );

  const handleSchoolSelect = (schoolId: string) => {
    setActiveSchool(schoolId);
    if (onSchoolChange) {
      onSchoolChange(schoolId);
    }
  };

  const getCardMode = (id: string): "split" | "before" | "after" => {
    return photoViewMode[id] || "split";
  };

  const setCardMode = (id: string, mode: "split" | "before" | "after") => {
    setPhotoViewMode((prev) => ({ ...prev, [id]: mode }));
  };

  return (
    <div className="space-y-8">
      {/* Header and Controls */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 md:p-8 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-slate-100">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-teal-50 text-teal-800 border border-teal-200 mb-3">
              <Sparkles className="w-3.5 h-3.5 text-teal-600" aria-hidden="true" />
              <span>{isHi ? "सुधार प्रभाव ट्रैकर • PRD 6.2-E" : "Impact & Rectification Tracker • PRD 6.2-E"}</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-navy-900 tracking-tight">
              {title || (isHi ? "पहले और बाद: सुगम्यता परिवर्तन ट्रैकर" : "Before & After: Accessibility Impact Tracker")}
            </h2>
            <p className="text-sm md:text-base text-slate-600 mt-2 max-w-3xl leading-relaxed">
              {subtitle ||
                (isHi
                  ? "विद्यालयों में पाई गई भौतिक बाधा, सुगम्यता मानकों के अनुरूप दिया गया तकनीकी सुझाव और धरातल पर हुए सत्यापित सुधार की 3-चरणीय यात्रा।"
                  : "A 3-stage journey: barrier identified in school audit → technical suggestion per Accessibility Code 2024 → verified improvement achieved on the ground.")}
            </p>
          </div>

          {/* Verification Guarantee Stamp */}
          <div className="shrink-0 bg-emerald-50 border border-emerald-200 rounded-xl p-4 flex items-center gap-3.5 text-left">
            <div className="w-10 h-10 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0">
              <ShieldCheck className="w-6 h-6" aria-hidden="true" />
            </div>
            <div>
              <div className="text-xs font-bold text-emerald-900 uppercase tracking-wide">
                {isHi ? "100% सत्यापित प्रविष्टियां" : "Strictly Verified Entries"}
              </div>
              <div className="text-xs text-emerald-800 font-medium">
                {isHi ? "केवल शोधकर्ता द्वारा प्रमाणित रिकॉर्ड" : "Only verified by NCPEDP Fellowship"}
              </div>
            </div>
          </div>
        </div>

        {/* Filter Toolbar */}
        <div className="pt-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Category Chips */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0" role="tablist" aria-label={isHi ? "श्रेणी फ़िल्टर" : "Category Filter"}>
            <button
              type="button"
              onClick={() => setActiveCategory("all")}
              className={clsx(
                "px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-600",
                activeCategory === "all"
                  ? "bg-navy-900 text-white shadow-xs"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200"
              )}
            >
              {isHi ? "सभी श्रेणियां" : "All Categories"} ({publicVerifiedEntries.length})
            </button>
            {Object.entries(isHi ? CATEGORY_NAMES_HI : CATEGORY_NAMES_EN).map(
              ([catKey, catLabel]) => {
                const count = publicVerifiedEntries.filter((e) => e.category === catKey).length;
                if (count === 0) return null;
                return (
                  <button
                    key={catKey}
                    type="button"
                    onClick={() => setActiveCategory(catKey)}
                    className={clsx(
                      "px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-600",
                      activeCategory === catKey
                        ? "bg-teal-700 text-white shadow-xs"
                        : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                    )}
                  >
                    {catLabel} ({count})
                  </button>
                );
              }
            )}
          </div>

          {/* School Selector Dropdown (Optional) */}
          {showSchoolFilter && uniqueSchools.length > 1 && (
            <div className="flex items-center gap-2 self-start md:self-auto">
              <label htmlFor="school-filter-select" className="text-xs font-semibold text-slate-700 shrink-0">
                <Building className="w-3.5 h-3.5 inline mr-1 text-slate-500" aria-hidden="true" />
                {isHi ? "विद्यालय:" : "School:"}
              </label>
              <select
                id="school-filter-select"
                value={activeSchool}
                onChange={(e) => handleSchoolSelect(e.target.value)}
                className="bg-white border border-slate-300 rounded-lg px-3 py-1.5 text-xs text-slate-800 font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-600"
              >
                <option value="all">
                  {isHi ? "सभी विद्यालय (दानापुर)" : "All Schools (Danapur)"}
                </option>
                {uniqueSchools.map((s) => (
                  <option key={s.id} value={s.id}>
                    {isHi ? s.name_hi : s.name_en}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>
      </div>

      {/* Tracker Entries List */}
      {filteredEntries.length === 0 ? (
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-12 text-center">
          <Layers className="w-12 h-12 text-slate-400 mx-auto mb-3" aria-hidden="true" />
          <h3 className="text-lg font-bold text-slate-800">
            {isHi ? "कोई सत्यापित ट्रैकर प्रविष्टि नहीं मिली" : "No Verified Tracker Entries Found"}
          </h3>
          <p className="text-sm text-slate-600 mt-1">
            {isHi
              ? "चयनित श्रेणी या विद्यालय के लिए वर्तमान में कोई प्रमाणित सुधार प्रविष्टि उपलब्ध नहीं है।"
              : "No verified improvements currently available for the selected filters."}
          </p>
        </div>
      ) : (
        <div className="space-y-10">
          {filteredEntries.map((entry) => {
            const currentMode = getCardMode(entry.id);
            const isCompleted = entry.stage === "improvement_verified";

            return (
              <article
                key={entry.id}
                className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden hover:shadow-md transition-shadow"
              >
                {/* Card Top Banner */}
                <div className="bg-slate-50 px-6 py-4 border-b border-slate-200 flex flex-wrap items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <span className="px-3 py-1 rounded-md text-xs font-bold uppercase tracking-wider bg-teal-100 text-teal-800">
                      {isHi
                        ? CATEGORY_NAMES_HI[entry.category] || entry.category
                        : CATEGORY_NAMES_EN[entry.category] || entry.category}
                    </span>
                    <Link
                      href={`/schools/${entry.schoolId}`}
                      className="font-bold text-navy-900 hover:text-teal-700 hover:underline transition-colors flex items-center gap-1.5 text-sm md:text-base"
                    >
                      <Building className="w-4 h-4 text-slate-500 shrink-0" aria-hidden="true" />
                      <span>{isHi ? entry.schoolName_hi : entry.schoolName_en}</span>
                    </Link>
                  </div>

                  {/* Verification Pill */}
                  <div className="flex items-center gap-2">
                    {isCompleted ? (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" aria-hidden="true" />
                        <span>{isHi ? "सुधार सत्यापित" : "Improvement Verified"}</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-300">
                        <Clock className="w-3.5 h-3.5 text-amber-700" aria-hidden="true" />
                        <span>{isHi ? "सुझाव दिया गया • प्रगति में" : "Suggestion Given • In Progress"}</span>
                      </span>
                    )}
                  </div>
                </div>

                <div className="p-6 md:p-8 space-y-8">
                  {/* 3-Step Journey Timeline Stepper (PRD 6.2-E) */}
                  <div className="relative">
                    <h3 className="sr-only">
                      {isHi ? "सुधार प्रगति के 3 चरण" : "3-Stage Rectification Progress"}
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
                      {/* Step 1: Barrier Identified */}
                      <div className="relative bg-rose-50/60 rounded-xl p-5 border border-rose-200/80 flex flex-col justify-between">
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-200 text-rose-900">
                              <span className="w-2 h-2 rounded-full bg-rose-600" aria-hidden="true" />
                              {isHi ? "चरण 1: चिन्हित अवरोध" : "Step 1: Barrier Identified"}
                            </span>
                            <span className="text-xs text-rose-800 flex items-center gap-1 font-medium">
                              <Calendar className="w-3 h-3" aria-hidden="true" />
                              {entry.dates.identifiedDate}
                            </span>
                          </div>
                          <p className="text-sm text-slate-800 font-medium leading-relaxed mt-2">
                            {isHi ? entry.barrier_hi : entry.barrier_en}
                          </p>
                        </div>
                        <div className="mt-4 pt-3 border-t border-rose-200/60 text-xs text-rose-700 font-medium flex items-center gap-1">
                          <AlertTriangle className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                          <span>{isHi ? "ऑडिट निरीक्षण में दर्ज" : "Logged in field audit"}</span>
                        </div>
                      </div>

                      {/* Step 2: Suggestion Given */}
                      <div className="relative bg-amber-50/60 rounded-xl p-5 border border-amber-200/80 flex flex-col justify-between">
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-200 text-amber-900">
                              <span className="w-2 h-2 rounded-full bg-amber-600" aria-hidden="true" />
                              {isHi ? "चरण 2: सुगम्यता सुझाव" : "Step 2: Technical Suggestion"}
                            </span>
                            <span className="text-xs text-amber-800 flex items-center gap-1 font-medium">
                              <Calendar className="w-3 h-3" aria-hidden="true" />
                              {entry.dates.suggestedDate}
                            </span>
                          </div>
                          <p className="text-sm text-slate-800 font-medium leading-relaxed mt-2">
                            {isHi ? entry.suggestion_hi : entry.suggestion_en}
                          </p>
                        </div>
                        {entry.statutoryReference && (
                          <div className="mt-4 pt-3 border-t border-amber-200/60 text-xs text-amber-900 font-semibold flex items-center gap-1">
                            <FileCheck2 className="w-3.5 h-3.5 text-amber-700 shrink-0" aria-hidden="true" />
                            <span>{entry.statutoryReference}</span>
                          </div>
                        )}
                      </div>

                      {/* Step 3: Improvement Achieved */}
                      <div
                        className={clsx(
                          "relative rounded-xl p-5 border flex flex-col justify-between",
                          isCompleted
                            ? "bg-emerald-50/70 border-emerald-300"
                            : "bg-slate-50 border-slate-200 opacity-80"
                        )}
                      >
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <span
                              className={clsx(
                                "inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold",
                                isCompleted
                                  ? "bg-emerald-200 text-emerald-900"
                                  : "bg-slate-200 text-slate-700"
                              )}
                            >
                              <span
                                className={clsx(
                                  "w-2 h-2 rounded-full",
                                  isCompleted ? "bg-emerald-600" : "bg-slate-400"
                                )}
                                aria-hidden="true"
                              />
                              {isHi ? "चरण 3: सत्यापित सुधार" : "Step 3: Verified Improvement"}
                            </span>
                            {entry.dates.improvedDate && (
                              <span className="text-xs text-emerald-800 flex items-center gap-1 font-medium">
                                <Calendar className="w-3 h-3" aria-hidden="true" />
                                {entry.dates.improvedDate}
                              </span>
                            )}
                          </div>
                          {isCompleted ? (
                            <p className="text-sm text-slate-800 font-medium leading-relaxed mt-2">
                              {isHi ? entry.improvement_hi : entry.improvement_en}
                            </p>
                          ) : (
                            <p className="text-sm text-slate-500 italic mt-2">
                              {isHi
                                ? "विद्यालय प्रबंधन समिति (SMC) द्वारा कार्य प्रगति पर है। सुधार पूर्ण होने पर सत्यापन कर अद्यतन किया जाएगा।"
                                : "Remedial action in progress with the SMC. Will be verified upon on-site completion."}
                            </p>
                          )}
                        </div>
                        {isCompleted && entry.verifiedBy && (
                          <div className="mt-4 pt-3 border-t border-emerald-200/60 text-xs text-emerald-900 font-semibold flex items-center gap-1.5">
                            <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0" aria-hidden="true" />
                            <span>
                              {isHi ? `प्रमाणितकर्ता: ${entry.verifiedBy}` : `Verified by: ${entry.verifiedBy}`}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Visual Comparator (Before & After Photos) */}
                  <div className="bg-slate-900 text-white rounded-xl p-5 md:p-6 space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div>
                        <h4 className="text-base font-bold text-white flex items-center gap-2">
                          <Eye className="w-4 h-4 text-teal-400" aria-hidden="true" />
                          <span>{isHi ? "तस्वीर प्रमाण तुलना (Photo Evidence)" : "Photo Evidence Comparison"}</span>
                        </h4>
                        <p className="text-xs text-slate-400 mt-0.5">
                          {isHi
                            ? "सुधार से पूर्व और पश्चात की वास्तविक फोटोग्राफिक साक्ष्य।"
                            : "Field photographs documenting state before and after intervention."}
                        </p>
                      </div>

                      {/* Photo Display View Toggle */}
                      {entry.afterPhoto && (
                        <div
                          className="flex items-center bg-slate-800 p-1 rounded-lg border border-slate-700 self-start sm:self-auto"
                          role="group"
                          aria-label={isHi ? "तस्वीर दृश्य चयन" : "Photo view mode"}
                        >
                          <button
                            type="button"
                            onClick={() => setCardMode(entry.id, "split")}
                            aria-pressed={currentMode === "split"}
                            className={clsx(
                              "px-2.5 py-1 rounded text-xs font-semibold transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-teal-400",
                              currentMode === "split"
                                ? "bg-teal-600 text-white"
                                : "text-slate-300 hover:text-white"
                            )}
                          >
                            {isHi ? "आमने-सामने (Split)" : "Side-by-Side"}
                          </button>
                          <button
                            type="button"
                            onClick={() => setCardMode(entry.id, "before")}
                            aria-pressed={currentMode === "before"}
                            className={clsx(
                              "px-2.5 py-1 rounded text-xs font-semibold transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-teal-400",
                              currentMode === "before"
                                ? "bg-rose-700 text-white"
                                : "text-slate-300 hover:text-white"
                            )}
                          >
                            {isHi ? "केवल पहले (Before)" : "Before Only"}
                          </button>
                          <button
                            type="button"
                            onClick={() => setCardMode(entry.id, "after")}
                            aria-pressed={currentMode === "after"}
                            className={clsx(
                              "px-2.5 py-1 rounded text-xs font-semibold transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-teal-400",
                              currentMode === "after"
                                ? "bg-emerald-700 text-white"
                                : "text-slate-300 hover:text-white"
                            )}
                          >
                            {isHi ? "केवल बाद (After)" : "After Only"}
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Photos Grid */}
                    <div
                      className={clsx(
                        "grid gap-4",
                        currentMode === "split" && entry.afterPhoto
                          ? "grid-cols-1 md:grid-cols-2"
                          : "grid-cols-1"
                      )}
                    >
                      {/* Before Photo */}
                      {(currentMode === "split" || currentMode === "before" || !entry.afterPhoto) && (
                        <div className="relative group rounded-lg overflow-hidden border border-slate-700 bg-slate-800">
                          <div className="absolute top-3 left-3 z-10 px-2.5 py-1 rounded-md text-xs font-bold uppercase tracking-wider bg-rose-600 text-white shadow-md">
                            {isHi ? "पहले (Before)" : "Before Rectification"}
                          </div>
                          <div className="relative aspect-video w-full">
                            <img
                              src={entry.beforePhoto.url}
                              alt={isHi ? entry.beforePhoto.caption_hi : entry.beforePhoto.caption_en}
                              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                            />
                          </div>
                          <div className="p-3 bg-slate-800/95 flex items-center justify-between gap-3 text-xs text-slate-300">
                            <span className="font-medium">
                              {isHi ? entry.beforePhoto.caption_hi : entry.beforePhoto.caption_en}
                            </span>
                            <button
                              type="button"
                              onClick={() =>
                                setSelectedPhotoModal({
                                  url: entry.beforePhoto.url,
                                  caption: isHi ? entry.beforePhoto.caption_hi : entry.beforePhoto.caption_en,
                                  label: isHi ? "पहले (Before)" : "Before",
                                })
                              }
                              className="shrink-0 text-teal-400 hover:text-teal-300 underline font-semibold focus-visible:outline-none"
                            >
                              {isHi ? "बड़ा देखें" : "Enlarge"}
                            </button>
                          </div>
                        </div>
                      )}

                      {/* After Photo */}
                      {(currentMode === "split" || currentMode === "after") && entry.afterPhoto && (
                        <div className="relative group rounded-lg overflow-hidden border border-slate-700 bg-slate-800">
                          <div className="absolute top-3 left-3 z-10 px-2.5 py-1 rounded-md text-xs font-bold uppercase tracking-wider bg-emerald-600 text-white shadow-md flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5" aria-hidden="true" />
                            <span>{isHi ? "अब (After)" : "After Rectification"}</span>
                          </div>
                          <div className="relative aspect-video w-full">
                            <img
                              src={entry.afterPhoto.url}
                              alt={isHi ? entry.afterPhoto.caption_hi : entry.afterPhoto.caption_en}
                              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                            />
                          </div>
                          <div className="p-3 bg-slate-800/95 flex items-center justify-between gap-3 text-xs text-slate-300">
                            <span className="font-medium text-emerald-300">
                              {isHi ? entry.afterPhoto.caption_hi : entry.afterPhoto.caption_en}
                            </span>
                            <button
                              type="button"
                              onClick={() =>
                                setSelectedPhotoModal({
                                  url: entry.afterPhoto!.url,
                                  caption: isHi ? entry.afterPhoto!.caption_hi : entry.afterPhoto!.caption_en,
                                  label: isHi ? "अब (After)" : "After",
                                })
                              }
                              className="shrink-0 text-teal-400 hover:text-teal-300 underline font-semibold focus-visible:outline-none"
                            >
                              {isHi ? "बड़ा देखें" : "Enlarge"}
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}

      {/* Photo Lightbox Modal */}
      {selectedPhotoModal && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={selectedPhotoModal.label}
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4"
          onClick={() => setSelectedPhotoModal(null)}
        >
          <div
            className="bg-slate-900 border border-slate-700 rounded-2xl max-w-4xl w-full overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-4 bg-slate-800 flex items-center justify-between border-b border-slate-700">
              <span className="font-bold text-white text-sm">
                {selectedPhotoModal.label}: {selectedPhotoModal.caption}
              </span>
              <button
                type="button"
                onClick={() => setSelectedPhotoModal(null)}
                className="px-3 py-1 rounded bg-slate-700 text-slate-200 hover:bg-slate-600 text-xs font-bold"
              >
                {isHi ? "बंद करें (Close)" : "Close"}
              </button>
            </div>
            <div className="p-4 bg-black flex items-center justify-center">
              <img
                src={selectedPhotoModal.url}
                alt={selectedPhotoModal.caption}
                className="max-h-[75vh] w-auto object-contain rounded"
              />
            </div>
            <div className="p-3 bg-slate-800 text-center text-xs text-slate-400">
              {selectedPhotoModal.caption}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
