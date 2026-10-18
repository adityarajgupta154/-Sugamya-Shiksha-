"use client";

import React, { useState, useEffect, useMemo, useTransition } from "react";
import dynamic from "next/dynamic";
import { useLanguage } from "@/context/LanguageContext";
import { DEMO_SCHOOLS, SchoolItem } from "@/data/schoolsData";
import { SchoolMapListAlternative } from "@/components/map/SchoolMapListAlternative";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import {
  MapPin,
  Building2,
  Compass,
  Layers,
  Filter,
  Search,
  RotateCcw,
  AlertTriangle,
  CheckCircle2,
  List,
  Map as MapIcon,
  Columns,
  Sparkles,
  Info,
} from "lucide-react";

// Dynamically import Leaflet map with ssr: false to prevent window errors during SSR
const DanapurSchoolsMap = dynamic(
  () =>
    import("@/components/map/DanapurSchoolsMap").then(
      (mod) => mod.DanapurSchoolsMap
    ),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-[520px] rounded-2xl bg-slate-100 flex flex-col items-center justify-center gap-3 border border-slate-200">
        <div className="w-8 h-8 border-4 border-teal-600 border-t-transparent rounded-full animate-spin" />
        <span className="text-sm font-semibold text-navy-800">
          Loading Danapur interactive map...
        </span>
      </div>
    ),
  }
);

import { mergeSchoolsWithLocal } from "@/lib/customSchoolsStorage";

export default function InteractiveMapPage() {
  const { locale, t } = useLanguage();
  const isHindi = locale === "hi";

  // Data state
  const [schools, setSchools] = useState<SchoolItem[]>(() =>
    mergeSchoolsWithLocal(DEMO_SCHOOLS)
  );
  const [loading, setLoading] = useState(true);
  const [isPending, startTransition] = useTransition();

  // Filter state
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState<"all" | "government" | "private">("all");
  const [statusFilter, setStatusFilter] = useState<"all" | "audited" | "pending" | "follow_up_required">("all");
  const [facilityFilter, setFacilityFilter] = useState<string>("all");

  // View mode state: "map" | "list" | "split"
  const [viewMode, setViewMode] = useState<"map" | "list" | "split">("map");
  const [selectedSchool, setSelectedSchool] = useState<SchoolItem | null>(null);

  // Load published schools from Firestore, merged with local browser storage
  useEffect(() => {
    let cancelled = false;
    async function loadSchools() {
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
        console.info("Using demo schools for map (Firestore offline or query error)");
      } finally {
        if (!cancelled) {
          const merged = mergeSchoolsWithLocal(baseList);
          setSchools(merged.filter((s) => s.published));
          setLoading(false);
        }
      }
    }

    loadSchools();

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

  // Filtered schools
  const filteredSchools = useMemo(() => {
    return schools.filter((school) => {
      // Must be published
      if (!school.published) return false;

      // School type filter
      if (typeFilter !== "all" && school.type !== typeFilter) return false;

      // Audit status filter
      if (statusFilter !== "all" && school.auditStatus !== statusFilter) return false;

      // Facility filter
      if (facilityFilter !== "all") {
        if (facilityFilter === "ramp" && !school.facilities.ramp) return false;
        if (facilityFilter === "toilet" && !school.facilities.toilet) return false;
        if (facilityFilter === "drinkingWater" && !school.facilities.drinkingWater) return false;
        if (facilityFilter === "wideDoors" && !school.facilities.wideDoors) return false;
        if (facilityFilter === "tactilePath" && !school.facilities.tactilePath) return false;
      }

      // Bilingual search query filter (name, address, UDISE)
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const nameHi = (school.name_hi || "").toLowerCase();
        const nameEn = (school.name_en || "").toLowerCase();
        const addrHi = (school.address_hi || "").toLowerCase();
        const addrEn = (school.address_en || "").toLowerCase();
        const udise = (school.udiseCode || "").toLowerCase();
        const block = (school.block || "").toLowerCase();
        return (
          nameHi.includes(q) ||
          nameEn.includes(q) ||
          addrHi.includes(q) ||
          addrEn.includes(q) ||
          udise.includes(q) ||
          block.includes(q)
        );
      }

      return true;
    });
  }, [schools, typeFilter, statusFilter, facilityFilter, searchQuery]);

  const resetFilters = () => {
    setSearchQuery("");
    setTypeFilter("all");
    setStatusFilter("all");
    setFacilityFilter("all");
  };

  return (
    <div className="flex flex-col w-full py-8 px-4 sm:px-8 max-w-7xl mx-auto space-y-6">
      {/* Page Header */}
      <div className="space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-100 text-teal-900 text-xs font-bold border border-teal-300">
          <Compass className="w-3.5 h-3.5 text-teal-700" aria-hidden="true" />
          <span>{isHindi ? "दानापुर विद्यालय सुगम्यता मानचित्र" : "Danapur School Accessibility Map"}</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-black text-navy-900 tracking-tight font-hindi">
          {isHindi ? "दानापुर विद्यालय सुगम्यता इंटरएक्टिव मानचित्र" : "Danapur School Accessibility Interactive Map"}
        </h1>

        <p className="text-sm sm:text-base text-slate-600 max-w-4xl leading-relaxed">
          {isHindi
            ? "दानापुर, पटना के सरकारी एवं निजी विद्यालयों का भौगोलिक मानचित्र। यह उपकरण भौतिक निरीक्षण स्थिति (सत्यापित, पुनः निरीक्षण, प्रतीक्षित) और ऑन-साइट प्रमाणित सुगम सुविधाओं को प्रदर्शित करता है।"
            : "Explore spatial physical infrastructure accessibility of schools across Danapur subdivision, Patna. Track live audit inspection statuses, verified universal accessibility features, and empirical field findings."}
        </p>
      </div>

      {/* Mandatory Demo Data Notice Banner */}
      <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-300 text-amber-950 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs sm:text-sm">
        <div className="flex items-center gap-2 font-medium">
          <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" aria-hidden="true" />
          <span>
            {t(
              "common.demoNotice",
              "Illustrative demo data — not actual Danapur survey findings."
            )}
          </span>
        </div>
        <div className="text-slate-600 text-xs flex items-center gap-1 font-mono">
          <span>OpenStreetMap • Danapur Cantonment / Khagaul</span>
        </div>
      </div>

      {/* Search, Filter & View Mode Controls Bar */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
        {/* Top Row: Search + View Mode Switcher */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          {/* Search bar */}
          <div className="flex-1 max-w-xl">
            <Input
              label={isHindi ? "विद्यालय खोजें" : "Search schools"}
              hideLabel
              placeholder={
                isHindi
                  ? "विद्यालय नाम, पता या UDISE कोड से खोजें..."
                  : "Search school name, location or UDISE code in Danapur..."
              }
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-11 text-xs sm:text-sm"
            />
          </div>

          {/* View Mode Toggle: Map vs List vs Split */}
          <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl border border-slate-200 self-start sm:self-auto">
            <button
              onClick={() => setViewMode("map")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                viewMode === "map"
                  ? "bg-white text-navy-900 shadow-xs"
                  : "text-slate-600 hover:text-navy-900"
              }`}
              aria-pressed={viewMode === "map"}
            >
              <MapIcon className="w-3.5 h-3.5 text-teal-700" aria-hidden="true" />
              <span>{isHindi ? "मानचित्र दृश्य" : "Map View"}</span>
            </button>

            <button
              onClick={() => setViewMode("list")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                viewMode === "list"
                  ? "bg-white text-navy-900 shadow-xs"
                  : "text-slate-600 hover:text-navy-900"
              }`}
              aria-pressed={viewMode === "list"}
            >
              <List className="w-3.5 h-3.5 text-teal-700" aria-hidden="true" />
              <span>{isHindi ? "सुलभ सूची (List)" : "Accessible List"}</span>
            </button>

            <button
              onClick={() => setViewMode("split")}
              className={`hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                viewMode === "split"
                  ? "bg-white text-navy-900 shadow-xs"
                  : "text-slate-600 hover:text-navy-900"
              }`}
              aria-pressed={viewMode === "split"}
            >
              <Columns className="w-3.5 h-3.5 text-teal-700" aria-hidden="true" />
              <span>{isHindi ? "संयुक्त दृश्य (Split)" : "Split View"}</span>
            </button>
          </div>
        </div>

        {/* Second Row: Filters Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-3 border-t border-slate-100">
          {/* School Type Filter */}
          <div>
            <label htmlFor="map-type-filter" className="block text-xs font-bold text-slate-700 mb-1">
              {isHindi ? "विद्यालय प्रकार" : "School Type"}
            </label>
            <select
              id="map-type-filter"
              value={typeFilter}
              onChange={(e: any) => setTypeFilter(e.target.value)}
              className="w-full h-10 rounded-lg border border-slate-300 bg-white px-3 text-xs text-navy-900 focus:border-teal-600 focus:ring-1 focus:ring-teal-600"
            >
              <option value="all">{isHindi ? "सभी विद्यालय (All)" : "All School Types"}</option>
              <option value="government">{isHindi ? "🏛️ केवल सरकारी विद्यालय" : "🏛️ Government Only"}</option>
              <option value="private">{isHindi ? "🏫 केवल निजी विद्यालय" : "🏫 Private Only"}</option>
            </select>
          </div>

          {/* Audit Status Filter (Non-Colour-Only Labels) */}
          <div>
            <label htmlFor="map-status-filter" className="block text-xs font-bold text-slate-700 mb-1">
              {isHindi ? "ऑडिट निरीक्षण स्थिति" : "Audit Status"}
            </label>
            <select
              id="map-status-filter"
              value={statusFilter}
              onChange={(e: any) => setStatusFilter(e.target.value)}
              className="w-full h-10 rounded-lg border border-slate-300 bg-white px-3 text-xs text-navy-900 focus:border-teal-600 focus:ring-1 focus:ring-teal-600"
            >
              <option value="all">{isHindi ? "सभी स्थितियां (All)" : "All Statuses"}</option>
              <option value="audited">{isHindi ? "✓ सत्यापित (Audited)" : "✓ Audited"}</option>
              <option value="follow_up_required">{isHindi ? "▲ पुनः निरीक्षण (Follow-up)" : "▲ Follow-up Required"}</option>
              <option value="pending">{isHindi ? "⏳ प्रतीक्षित (Pending)" : "⏳ Pending"}</option>
            </select>
          </div>

          {/* Facility Filter */}
          <div>
            <label htmlFor="map-facility-filter" className="block text-xs font-bold text-slate-700 mb-1">
              {isHindi ? "अनिवार्य सुविधा" : "Verified Facility"}
            </label>
            <select
              id="map-facility-filter"
              value={facilityFilter}
              onChange={(e) => setFacilityFilter(e.target.value)}
              className="w-full h-10 rounded-lg border border-slate-300 bg-white px-3 text-xs text-navy-900 focus:border-teal-600 focus:ring-1 focus:ring-teal-600"
            >
              <option value="all">{isHindi ? "कोई भी सुविधा (All)" : "Any Facility"}</option>
              <option value="ramp">{isHindi ? "✓ रैंप व हैंडरेल उपलब्ध" : "✓ Ramp Available"}</option>
              <option value="toilet">{isHindi ? "✓ सुगम शौचालय उपलब्ध" : "✓ CwSN Toilet Available"}</option>
              <option value="drinkingWater">{isHindi ? "✓ पेयजल सुविधा उपलब्ध" : "✓ Drinking Water Available"}</option>
              <option value="wideDoors">{isHindi ? "✓ चौड़े द्वार (≥900mm)" : "✓ Wide Doors Available"}</option>
              <option value="tactilePath">{isHindi ? "✓ स्पर्शनीय पाथवे" : "✓ Tactile Path Available"}</option>
            </select>
          </div>

          {/* Results Count & Reset Button */}
          <div className="flex items-end justify-between gap-2">
            <span className="text-xs font-bold text-navy-900 py-2.5">
              {isHindi
                ? `${filteredSchools.length} विद्यालय मिले`
                : `${filteredSchools.length} schools matched`}
            </span>

            <Button
              variant="outline"
              size="sm"
              onClick={resetFilters}
              leftIcon={<RotateCcw className="w-3.5 h-3.5" />}
              className="text-xs h-10"
            >
              {isHindi ? "रीसेट" : "Reset"}
            </Button>
          </div>
        </div>
      </div>

      {/* Main Interactive Display Area */}
      <div className="w-full">
        {/* 1. Map View Mode */}
        {viewMode === "map" && (
          <div className="space-y-4">
            <DanapurSchoolsMap
              schools={filteredSchools}
              isHindi={isHindi}
              selectedSchoolId={selectedSchool?.id}
              onSchoolSelect={(s) => setSelectedSchool(s)}
            />

            {/* Quick Access List Drawer below map for keyboard users */}
            <div className="pt-2">
              <SchoolMapListAlternative
                schools={filteredSchools}
                isHindi={isHindi}
                onSelectOnMap={(s) => setSelectedSchool(s)}
              />
            </div>
          </div>
        )}

        {/* 2. Accessible List Only Mode */}
        {viewMode === "list" && (
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-teal-50 border border-teal-200 text-teal-900 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2 font-medium">
                <Info className="w-4 h-4 text-teal-700 shrink-0" aria-hidden="true" />
                <span>
                  {isHindi
                    ? "सुलभ पाठ्य सूची दृश्य: स्क्रीन रीडर एवं कीबोर्ड नेविगेशन हेतु अनुकूलित।"
                    : "Accessible tabular/list view optimized for screen readers and keyboard users."}
                </span>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setViewMode("map")}
                className="text-xs border-teal-300"
              >
                {isHindi ? "मानचित्र दृश्य खोलें" : "Switch to Map View"}
              </Button>
            </div>

            <SchoolMapListAlternative
              schools={filteredSchools}
              isHindi={isHindi}
            />
          </div>
        )}

        {/* 3. Split View Mode (Desktop) */}
        {viewMode === "split" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            <div className="lg:col-span-7 sticky top-20">
              <DanapurSchoolsMap
                schools={filteredSchools}
                isHindi={isHindi}
                selectedSchoolId={selectedSchool?.id}
                onSchoolSelect={(s) => setSelectedSchool(s)}
                className="h-[75vh]"
              />
            </div>

            <div className="lg:col-span-5 max-h-[75vh] overflow-y-auto pr-1">
              <SchoolMapListAlternative
                schools={filteredSchools}
                isHindi={isHindi}
                onSelectOnMap={(s) => setSelectedSchool(s)}
              />
            </div>
          </div>
        )}
      </div>

      {/* Mandatory Academic Research Score Notice Footer */}
      <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-slate-600 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2 italic">
        <span>
          {isHindi
            ? "यह मानचित्र एवं सुगम्यता स्कोर NCPEDP फेलोशिप शोध अध्ययन पर आधारित है, कोई आधिकारिक सरकारी प्रमाणन नहीं।"
            : "This interactive map and research scores represent academic fieldwork under the NCPEDP Fellowship — not an official government certification."}
        </span>
        <span className="font-semibold text-slate-700 not-italic">
          Danapur Subdivision • Patna District
        </span>
      </div>
    </div>
  );
}
