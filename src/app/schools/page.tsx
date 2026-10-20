"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";
import { DEMO_SCHOOLS, SchoolItem } from "@/data/schoolsData";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import {
  Building2,
  ShieldCheck,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Search,
  Filter,
  MapPin,
  Calendar,
  Sparkles,
  ArrowRight,
  Accessibility,
  Eye,
  Check,
  X,
} from "lucide-react";
import dynamic from "next/dynamic";
import { useTransition, useMemo, useCallback } from "react";

const DanapurSchoolsMap = dynamic(
  () =>
    import("@/components/map/DanapurSchoolsMap").then(
      (mod) => mod.DanapurSchoolsMap
    ),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-[500px] rounded-2xl bg-slate-100 flex flex-col items-center justify-center gap-3 border border-slate-200">
        <div className="w-8 h-8 border-4 border-teal-600 border-t-transparent rounded-full animate-spin" />
        <span className="text-sm font-semibold text-navy-800">
          Loading map...
        </span>
      </div>
    ),
  }
);

import { mergeSchoolsWithLocal } from "@/lib/customSchoolsStorage";

export default function SchoolsDirectoryPage() {
  const { locale, t } = useLanguage();
  const [schools, setSchools] = useState<SchoolItem[]>(() =>
    mergeSchoolsWithLocal(DEMO_SCHOOLS).filter((s) => s.published)
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState<"all" | "government" | "private">("all");
  const [statusFilter, setStatusFilter] = useState<"all" | "audited" | "pending" | "follow_up_required">("all");
  const [viewMode, setViewMode] = useState<"cards" | "map">("cards");
  const [isPending, startTransition] = useTransition();

  const isHindi = locale === "hi";

  // Load from Firestore if online, merge with locally saved custom schools, filtering published only
  useEffect(() => {
    let cancelled = false;

    async function loadFirestoreSchools() {
      let baseList = DEMO_SCHOOLS;
      try {
        const { db } = await import("@/lib/firebase/firestore");
        if (db && !cancelled) {
          const { collection, getDocs, query, where, limit } = await import("firebase/firestore");
          const q = query(collection(db, "schools"), where("published", "==", true), limit(50));
          const snap = await getDocs(q);
          if (!snap.empty && !cancelled) {
            baseList = snap.docs.map((d) => ({ id: d.id, ...d.data() } as SchoolItem));
          }
        }
      } catch (err) {
        console.info("Using demo schools dataset (Firestore offline or no records)");
      }

      if (!cancelled) {
        const merged = mergeSchoolsWithLocal(baseList);
        setSchools(merged.filter((s) => s.published));
      }
    }

    loadFirestoreSchools();

    // Listen to real-time custom events when admin adds/edits/deletes a school
    const handleSync = () => {
      setSchools((curr) => {
        const merged = mergeSchoolsWithLocal(curr.length ? curr : DEMO_SCHOOLS);
        return merged.filter((s) => s.published);
      });
    };

    window.addEventListener("ssb_schools_updated", handleSync);
    window.addEventListener("storage", handleSync);

    return () => {
      cancelled = true;
      window.removeEventListener("ssb_schools_updated", handleSync);
      window.removeEventListener("storage", handleSync);
    };
  }, []);

  const filteredSchools = useMemo(() => {
    return schools.filter((school) => {
      // Only published schools on public directory per PRD 11.3 & ADR 0005
      if (!school.published) return false;

      // Type filter
      if (typeFilter !== "all" && school.type !== typeFilter) return false;

      // Status filter
      if (statusFilter !== "all" && school.auditStatus !== statusFilter) return false;

      // Bilingual Search query (matches Hindi or English name, address, UDISE code or block)
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const nameHi = (school.name_hi || "").toLowerCase();
        const nameEn = (school.name_en || "").toLowerCase();
        const addressHi = (school.address_hi || "").toLowerCase();
        const addressEn = (school.address_en || "").toLowerCase();
        const udise = (school.udiseCode || "").toLowerCase();
        const block = (school.block || "").toLowerCase();
        return (
          nameHi.includes(q) ||
          nameEn.includes(q) ||
          addressHi.includes(q) ||
          addressEn.includes(q) ||
          udise.includes(q) ||
          block.includes(q)
        );
      }

      return true;
    });
  }, [schools, typeFilter, statusFilter, searchQuery]);

  return (
    <div className="flex flex-col w-full py-6 sm:py-10 px-3 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-6 sm:space-y-8 min-w-0">
      {/* Header Banner */}
      <div className="space-y-3 sm:space-y-4 max-w-3xl">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-100 text-teal-900 text-xs font-bold border border-teal-300">
          <Building2 className="w-3.5 h-3.5 text-teal-700" aria-hidden="true" />
          <span>{isHindi ? "विद्यालय सुगम्यता निर्देशिका" : "School Accessibility Directory"}</span>
        </div>
        <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black text-navy-800 tracking-tight font-hindi">
          {t("schools.title", "School Accessibility Directory")}
        </h1>
        <p className="text-sm sm:text-lg text-slate-600 leading-relaxed font-normal">
          {t("schools.subtitle")}
        </p>
      </div>


      {/* Filter and Search Bar */}
      <div className="bg-white p-4 sm:p-5 rounded-xl border border-slate-200 shadow-xs space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 sm:gap-4 items-center">
          {/* Search Input (5 cols on md+) */}
          <div className="md:col-span-5">
            <Input
              label={t("common.search", "Search")}
              hideLabel
              placeholder={isHindi ? "विद्यालय, क्षेत्र या UDISE खोजें" : "Search school, area or UDISE"}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-11 text-sm"
            />
          </div>

          {/* School Type Filter (3 cols on md+) */}
          <div className="md:col-span-3">
            <label htmlFor="school-type-select" className="sr-only">
              {t("schools.filterType")}
            </label>
            <select
              id="school-type-select"
              value={typeFilter}
              onChange={(e: any) => {
                const val = e.target.value;
                startTransition(() => setTypeFilter(val));
              }}
              className="w-full h-11 rounded-md border border-slate-300 bg-white px-3 text-sm text-navy-900 focus:border-teal-600 focus:ring-1 focus:ring-teal-600"
            >
              <option value="all">{t("schools.allTypes")}</option>
              <option value="government">
                🏛️ {isHindi ? "सरकारी विद्यालय (Government)" : "Government Schools"}
              </option>
              <option value="private">
                🏫 {isHindi ? "निजी विद्यालय (Private)" : "Private Schools"}
              </option>
            </select>
          </div>

          {/* Audit Status Filter (3 cols on md+) */}
          <div className="md:col-span-3">
            <label htmlFor="school-status-select" className="sr-only">
              {t("schools.filterStatus")}
            </label>
            <select
              id="school-status-select"
              value={statusFilter}
              onChange={(e: any) => {
                const val = e.target.value;
                startTransition(() => setStatusFilter(val));
              }}
              className="w-full h-11 rounded-md border border-slate-300 bg-white px-3 text-sm text-navy-900 focus:border-teal-600 focus:ring-1 focus:ring-teal-600"
            >
              <option value="all">{t("schools.allStatuses")}</option>
              <option value="audited">
                ✓ {isHindi ? "ऑडिट पूर्ण (Audited)" : "Audited"}
              </option>
              <option value="follow_up_required">
                ! {isHindi ? "पुनः निरीक्षण आवश्यक (Follow-up)" : "Follow-up Required"}
              </option>
              <option value="pending">
                ⏳ {isHindi ? "प्रक्रियाधीन (Pending)" : "Pending"}
              </option>
            </select>
          </div>

          {/* Reset Filters (1 col on md+) */}
          <div className="md:col-span-1 flex justify-start md:justify-end">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                startTransition(() => {
                  setSearchQuery("");
                  setTypeFilter("all");
                  setStatusFilter("all");
                });
              }}
              title={t("schools.clearFilters")}
              className="text-xs text-slate-500 hover:text-navy-900 whitespace-nowrap min-h-[44px]"
            >
              {isHindi ? "रीसेट" : "Reset"}
            </Button>
          </div>
        </div>

        {/* Results count & View Mode Switcher */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-500 pt-3 border-t border-slate-100">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-navy-900">
              {t("schools.resultsCount", `Showing ${filteredSchools.length} schools`).replace(
                "{count}",
                String(filteredSchools.length)
              )}
            </span>
            <span aria-hidden="true">•</span>
            <span className="font-medium text-teal-800">
              {isHindi ? "सत्यापित डेटा केवल" : "Verified Public Records Only"}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center p-1 bg-slate-100 rounded-lg border border-slate-200">
              <button
                onClick={() => startTransition(() => setViewMode("cards"))}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-bold transition-colors duration-150 ${
                  viewMode === "cards"
                    ? "bg-white text-navy-900 shadow-xs"
                    : "text-slate-600 hover:text-navy-900"
                }`}
                aria-pressed={viewMode === "cards"}
              >
                <span>📋</span>
                <span>{isHindi ? "कार्ड्स सूची" : "Cards Grid"}</span>
              </button>

              <button
                onClick={() => startTransition(() => setViewMode("map"))}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-bold transition-colors duration-150 ${
                  viewMode === "map"
                    ? "bg-white text-navy-900 shadow-xs"
                    : "text-slate-600 hover:text-navy-900"
                }`}
                aria-pressed={viewMode === "map"}
              >
                <span>🗺️</span>
                <span>{isHindi ? "मानचित्र दृश्य" : "Map View"}</span>
              </button>
            </div>

            <Link href="/map" className="hidden sm:inline-flex">
              <Button variant="outline" size="sm" className="text-xs h-8">
                {isHindi ? "पूर्ण मानचित्र ↗" : "Full Map ↗"}
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Main View Area: Either Interactive Map or Cards Grid */}
      {viewMode === "map" ? (
        <div className="space-y-4">
          <DanapurSchoolsMap schools={filteredSchools} isHindi={isHindi} />
        </div>
      ) : filteredSchools.length === 0 ? (
        <div className="bg-white rounded-xl border border-slate-200 p-12 text-center space-y-4">
          <Building2 className="w-12 h-12 text-slate-300 mx-auto" aria-hidden="true" />
          <h2 className="text-xl font-bold text-navy-800">
            {t("schools.noSchoolsFound")}
          </h2>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              startTransition(() => {
                setSearchQuery("");
                setTypeFilter("all");
                setStatusFilter("all");
              });
            }}
          >
            {t("schools.clearFilters")}
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6 cv-auto min-w-0">
          {filteredSchools.map((school) => (
            <SchoolCardItem
              key={school.id}
              school={school}
              isHindi={isHindi}
              t={t}
            />
          ))}
        </div>
      )}
    </div>
  );
}

const SchoolCardItem = React.memo(function SchoolCardItem({
  school,
  isHindi,
  t,
}: {
  school: SchoolItem;
  isHindi: boolean;
  t: (key: string, fallback?: string) => string;
}) {
  const schoolName = isHindi ? school.name_hi : school.name_en;
  const schoolAddress = isHindi ? school.address_hi : school.address_en;

  return (
    <Card
      as="article"
      variant="interactive"
      className="flex flex-col justify-between h-full border-slate-200 hover:border-teal-600 shadow-xs hover:shadow-md transition-[border-color,box-shadow] duration-150 group"
    >
      <div className="space-y-4">
        {/* Status & Type Badges (Non-color only) */}
        <div className="flex flex-wrap items-center justify-between gap-2">
          <Badge variant={school.type === "government" ? "government" : "private"}>
            {school.type === "government"
              ? t("common.government", "Government")
              : t("common.private", "Private")}
          </Badge>

          <Badge variant={school.auditStatus}>
            {school.auditStatus === "audited" && t("common.audited", "Audited")}
            {school.auditStatus === "follow_up_required" &&
              t("common.followUpRequired", "Follow-up Required")}
            {school.auditStatus === "pending" && t("common.pending", "Pending")}
          </Badge>
        </div>

        {/* School Name & Location */}
        <div className="space-y-1.5">
          <CardTitle as="h2" className="text-lg leading-snug group-hover:text-teal-800 transition-colors duration-150">
            {schoolName}
          </CardTitle>
          <p className="text-xs text-slate-500 flex items-start gap-1.5 leading-relaxed">
            <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" aria-hidden="true" />
            <span>{schoolAddress}</span>
          </p>
        </div>

        {/* Score & Facilities Strip */}
        <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-100 space-y-2.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1">
              <span className="text-xs font-semibold text-slate-600">
                {isHindi ? "सुगम्यता स्कोर" : "Accessibility Score"}
              </span>
            </div>

            {school.auditStatus === "pending" ? (
              <span className="text-xs font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                {isHindi ? "मूल्यांकन प्रतीक्षित" : "Pending Audit"}
              </span>
            ) : (
              <div className="flex items-center gap-2">
                <span
                  className={`text-[10px] font-black px-2 py-0.5 rounded-full border shadow-2xs ${
                    school.score >= 80
                      ? "bg-emerald-50 text-emerald-800 border-emerald-300"
                      : school.score >= 50
                      ? "bg-amber-50 text-amber-800 border-amber-300"
                      : "bg-rose-50 text-rose-800 border-rose-300"
                  }`}
                >
                  {school.score >= 80 ? "✓" : school.score >= 50 ? "▲" : "✕"}{" "}
                  {school.score >= 80
                    ? isHindi
                      ? "उच्च"
                      : "High"
                    : school.score >= 50
                    ? isHindi
                      ? "मध्यम"
                      : "Moderate"
                    : isHindi
                    ? "बाधाएं"
                    : "Barriers"}
                </span>
                <div className="flex items-baseline gap-0.5">
                  <span className="text-lg font-black text-navy-900">{school.score}</span>
                  <span className="text-xs text-slate-500">/100</span>
                </div>
              </div>
            )}
          </div>


          {/* Facilities checklist icons */}
          <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between text-xs text-slate-600">
            <span className="text-[11px] font-medium text-slate-500">
              {t("schools.card.facilitiesAvailable", "Facilities")}:
            </span>
            <div className="flex items-center gap-2 text-xs">
              <span
                title={isHindi ? "रैंप" : "Ramp"}
                className={`flex items-center gap-0.5 ${
                  school.facilities.ramp ? "text-teal-700 font-bold" : "text-slate-400 line-through"
                }`}
              >
                {school.facilities.ramp ? "✓" : "✕"} {isHindi ? "रैंप" : "Ramp"}
              </span>
              <span aria-hidden="true">•</span>
              <span
                title={isHindi ? "शौचालय" : "Toilet"}
                className={`flex items-center gap-0.5 ${
                  school.facilities.toilet ? "text-teal-700 font-bold" : "text-slate-400 line-through"
                }`}
              >
                {school.facilities.toilet ? "✓" : "✕"} {isHindi ? "शौचालय" : "WASH"}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Footer link to School Detail */}
      <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between">
        <div className="text-[11px] text-slate-400">
          {school.lastAuditDate && (
            <span>
              {t("schools.card.lastAudited")}: {school.lastAuditDate}
            </span>
          )}
        </div>

        <Link
          href={`/schools/${school.id}`}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-teal-700 hover:text-teal-900 transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-600 rounded p-1"
        >
          <span>{t("schools.card.viewProfile", "View Audit Findings")}</span>
          <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
        </Link>
      </div>
    </Card>
  );
});
