"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
  AuditMeasurements,
  compareAuditAgainstStandards,
  AuditComparisonResult,
} from "@/lib/auditComparison";
import {
  DEFAULT_STANDARDS,
  AccessibilityStandard,
} from "@/data/standardsData";
import { calculateScorecard } from "@/lib/scorecardCalculator";
import { DEMO_SCHOOLS, SchoolItem } from "@/data/schoolsData";
import { db } from "@/lib/firebase/firestore";
import { storage } from "@/lib/firebase/storage";
import {
  doc,
  setDoc,
  collection,
  getDocs,
  updateDoc,
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { Button } from "@/components/ui/Button";
import { Input, Textarea } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import { Modal } from "@/components/ui/Modal";
import {
  CheckCircle2,
  AlertTriangle,
  Camera,
  Upload,
  Save,
  ShieldCheck,
  ChevronRight,
  ChevronLeft,
  Sparkles,
  Info,
  Building2,
  ArrowRight,
  RefreshCw,
} from "lucide-react";

export interface AuditRecord {
  id: string;
  schoolId: string;
  schoolName: string;
  auditorId: string;
  auditorName: string;
  date: string;
  status: "draft" | "verified";
  measurements: AuditMeasurements;
  photos: { [sectionKey: string]: string[] };
  deficiencies: any[];
  complianceRate: number;
  generalNotes: string;
  updatedAt: string;
}

interface AuditToolFormProps {
  isHindi: boolean;
  onAuditSaved?: (audit: AuditRecord) => void;
  existingAudit?: AuditRecord | null;
}

const SECTIONS = [
  { id: "ramp", label_en: "1. Ramp & Slope", label_hi: "1. रैंप एवं ढलान", icon: "📐" },
  { id: "doors", label_en: "2. Doors & Entrances", label_hi: "2. प्रवेश द्वार", icon: "🚪" },
  { id: "toilets", label_en: "3. CwSN Toilets", label_hi: "3. सुगम शौचालय", icon: "🚻" },
  { id: "railings", label_en: "4. Railings & Rails", label_hi: "4. रेलिंग व हैंडरेल", icon: "🪜" },
  { id: "classrooms", label_en: "5. Classrooms", label_hi: "5. कक्षा कक्ष", icon: "🏫" },
  { id: "pathways", label_en: "6. Pathways & Ground", label_hi: "6. परिसर रास्ते", icon: "🛣️" },
  { id: "signage", label_en: "7. Signage & Braille", label_hi: "7. संकेतक व ब्रेल", icon: "🪧" },
  { id: "drinkingWater", label_en: "8. Drinking Water", label_hi: "8. पेयजल सुविधा", icon: "🚰" },
  { id: "emergencyExits", label_en: "9. Emergency Exits", label_hi: "9. आपातकालीन निकास", icon: "🚨" },
] as const;

export function AuditToolForm({ isHindi, onAuditSaved, existingAudit }: AuditToolFormProps) {
  // Active school & auditor metadata
  const [schools, setSchools] = useState<SchoolItem[]>(DEMO_SCHOOLS);
  const [selectedSchoolId, setSelectedSchoolId] = useState<string>(
    existingAudit?.schoolId || DEMO_SCHOOLS[0].id
  );
  const [auditorName, setAuditorName] = useState<string>(
    existingAudit?.auditorName || "Aditya Kumar (Fellow)"
  );
  const [auditDate, setAuditDate] = useState<string>(
    existingAudit?.date || new Date().toISOString().split("T")[0]
  );
  const [auditStatus, setAuditStatus] = useState<"draft" | "verified">(
    existingAudit?.status || "draft"
  );
  const [generalNotes, setGeneralNotes] = useState<string>(
    existingAudit?.generalNotes || ""
  );

  // Active section in stepper (mobile-friendly)
  const [currentSectionIndex, setCurrentSectionIndex] = useState<number>(0);

  // Active standards configuration
  const [standards, setStandards] = useState<AccessibilityStandard[]>(DEFAULT_STANDARDS);

  // Measurements State
  const [measurements, setMeasurements] = useState<AuditMeasurements>(
    existingAudit?.measurements || {
      ramp: { slopeRatio: 12, clearWidthMm: 1200, landingDimensionsMm: 1500, hasDualHandrails: true, hasTactileWarning: false, surfaceNonSlip: true },
      doors: { mainDoorWidthMm: 900, classroomDoorWidthMm: 900, maxThresholdHeightMm: 10, hasEasyLeverHandles: true },
      toilets: { hasDedicatedCwsnToilet: true, cubicleWidthMm: 2000, cubicleLengthMm: 2200, turningCircleMm: 1500, wcSeatHeightMm: 460, grabBarHeightMm: 760, isDoorOutwardOpening: true, hasEmergencyAlarm: false },
      railings: { lowerRailHeightMm: 760, upperRailHeightMm: 900, hasContinuousExtensions: true, gripDiameterMm: 40 },
      classrooms: { aisleWidthMm: 1200, hasAccessibleDesk: true, deskKneeClearanceMm: 650, blackboardHeightMm: 800, hasStepFreeAccess: true },
      pathways: { mainPathwayWidthMm: 1200, surfaceCondition: "paved_smooth", hasTactilePath: false, hasObstacles: false },
      signage: { hasBrailleSignage: false, signMountingHeightMm: 1500, hasHighContrast: true, hasAccessibleSymbol: true },
      drinkingWater: { tapHeightMm: 800, hasWheelchairKneeRecess: true, tapOperationType: "lever", hasSlipResistantFloor: true },
      emergencyExits: { exitDoorWidthMm: 1200, isEvacuationRouteStepFree: true, hasDualAlarm: false },
    }
  );

  // Photos state: mapping section -> array of photo URLs
  const [photos, setPhotos] = useState<{ [sec: string]: string[] }>(
    existingAudit?.photos || {}
  );
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);
  const [statusMsg, setStatusMsg] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  // Load live schools & standards from Firestore if present
  useEffect(() => {
    async function loadData() {
      if (!db) return;
      try {
        const schSnap = await getDocs(collection(db, "schools"));
        if (!schSnap.empty) {
          const list: SchoolItem[] = [];
          schSnap.forEach((d) => list.push({ id: d.id, ...d.data() } as SchoolItem));
          setSchools(list);
        }

        const stdSnap = await getDocs(collection(db, "standards"));
        if (!stdSnap.empty) {
          const list: AccessibilityStandard[] = [];
          stdSnap.forEach((d) => list.push({ id: d.id, ...d.data() } as AccessibilityStandard));
          setStandards(list);
        }
      } catch (e) {
        console.warn("Using default schools and standards fallback in audit tool:", e);
      }
    }
    loadData();
  }, []);

  // Compute live deficiencies against active standards
  const comparisonResult: AuditComparisonResult = useMemo(() => {
    return compareAuditAgainstStandards(measurements, standards);
  }, [measurements, standards]);

  const currentSection = SECTIONS[currentSectionIndex];

  // Deficiencies in current active section
  const sectionDeficiencies = comparisonResult.deficiencies.filter(
    (d) => d.category === currentSection.id
  );

  // Handle Photo Upload
  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingPhoto(true);
    try {
      const sectionKey = currentSection.id;
      if (storage) {
        const fileRef = ref(
          storage,
          `audits/${selectedSchoolId}_${Date.now()}_${sectionKey}.jpg`
        );
        await uploadBytes(fileRef, file);
        const url = await getDownloadURL(fileRef);
        setPhotos((prev) => ({
          ...prev,
          [sectionKey]: [...(prev[sectionKey] || []), url],
        }));
      } else {
        // Fallback local preview URL
        const localUrl = URL.createObjectURL(file);
        setPhotos((prev) => ({
          ...prev,
          [sectionKey]: [...(prev[sectionKey] || []), localUrl],
        }));
      }
      setStatusMsg(isHindi ? "फोटो संलग्न हो गया।" : "Photo attached to section.");
      setTimeout(() => setStatusMsg(""), 3000);
    } catch (err: any) {
      alert("Photo upload failed: " + err.message);
    } finally {
      setIsUploadingPhoto(false);
    }
  };

  // Save Audit Handler
  const handleSaveAudit = async () => {
    setIsSaving(true);
    const auditId = existingAudit?.id || `audit-${selectedSchoolId}-${Date.now()}`;
    const selectedSchool = schools.find((s) => s.id === selectedSchoolId);

    const auditRecord: AuditRecord = {
      id: auditId,
      schoolId: selectedSchoolId,
      schoolName: selectedSchool ? (isHindi ? selectedSchool.name_hi : selectedSchool.name_en) : selectedSchoolId,
      auditorId: "auditor-fellow",
      auditorName,
      date: auditDate,
      status: auditStatus,
      measurements,
      photos,
      deficiencies: comparisonResult.deficiencies,
      complianceRate: comparisonResult.complianceRate,
      generalNotes,
      updatedAt: new Date().toISOString(),
    };

    try {
      if (db) {
        await setDoc(doc(db, "audits", auditId), auditRecord);

        // If verified, update the school's auditStatus, 100-pt score, scoreBreakdown, and facilities
        if (auditStatus === "verified" && selectedSchoolId) {
          const schoolRef = doc(db, "schools", selectedSchoolId);
          const scorecard = calculateScorecard(measurements, standards);

          await updateDoc(schoolRef, {
            auditStatus: scorecard.overallScore >= 70 ? "audited" : "follow_up_required",
            score: scorecard.overallScore,
            scoreBreakdown: {
              entrance: scorecard.categories.entrance.pointsEarned,
              toilets: scorecard.categories.toilets.pointsEarned,
              classrooms: scorecard.categories.classrooms.pointsEarned,
              safety: scorecard.categories.safety.pointsEarned,
            },
            lastAuditDate: auditDate,
            facilities: {
              ramp: (measurements.ramp?.clearWidthMm || 0) >= 1200 && (measurements.ramp?.slopeRatio || 0) >= 12,
              toilet: measurements.toilets?.hasDedicatedCwsnToilet === true && measurements.toilets?.isDoorOutwardOpening === true,
              wideDoors: (measurements.doors?.mainDoorWidthMm || 0) >= 900,
              tactilePath: measurements.pathways?.hasTactilePath === true,
              drinkingWater: (measurements.drinkingWater?.tapHeightMm || 999) <= 800,
              emergencyExit: (measurements.emergencyExits?.exitDoorWidthMm || 0) >= 1200,
            },
          });
        }
      }

      setStatusMsg(
        isHindi
          ? auditStatus === "verified"
            ? "ऑडिट सफलतापूर्वक सत्यापित एवं सहेजा गया! विद्यालय प्रोफाइल अपडेट हुई।"
            : "ऑडिट ड्राफ्ट के रूप में सहेजा गया।"
          : auditStatus === "verified"
          ? "Audit verified & saved! School profile updated."
          : "Audit saved as Draft."
      );

      if (onAuditSaved) onAuditSaved(auditRecord);
    } catch (err: any) {
      alert("Error saving audit: " + err.message);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6 pb-20">
      {/* Top Banner & Quick Controls */}
      <div className="bg-navy-900 text-white rounded-xl p-4 sm:p-6 shadow-md border border-navy-800 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-teal-600 text-white text-lg font-bold shadow-xs">
              ⚡
            </span>
            <div>
              <h1 className="text-lg sm:text-xl font-bold leading-tight">
                {isHindi ? "स्मार्ट विद्यालय सुगम्यता ऑडिट टूल" : "Smart School Accessibility Audit Tool"}
              </h1>
              <p className="text-xs text-teal-300">
                {isHindi
                  ? "स्थल निरीक्षण • स्वचालित मानक तुलना • ड्राफ्ट से सत्यापन वर्कफ़्लो"
                  : "On-site Mobile Inspection • Live Standards Comparison • Draft/Verified"}
              </p>
            </div>
          </div>

          {/* Workflow Status Toggle */}
          <div className="flex items-center gap-2 self-start sm:self-auto">
            <span className="text-xs text-slate-300 font-semibold">
              {isHindi ? "ऑडिट स्थिति:" : "Status:"}
            </span>
            <div className="flex rounded-lg border border-navy-700 bg-navy-800 p-1">
              <button
                type="button"
                onClick={() => setAuditStatus("draft")}
                className={`px-3 py-1 text-xs font-bold rounded transition-all min-h-[36px] ${
                  auditStatus === "draft"
                    ? "bg-amber-600 text-white shadow-xs"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                {isHindi ? "ड्राफ्ट (Draft)" : "Draft"}
              </button>
              <button
                type="button"
                onClick={() => setAuditStatus("verified")}
                className={`px-3 py-1 text-xs font-bold rounded transition-all min-h-[36px] ${
                  auditStatus === "verified"
                    ? "bg-emerald-600 text-white shadow-xs"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                {isHindi ? "सत्यापित (Verified)" : "Verified"}
              </button>
            </div>
          </div>
        </div>

        {/* School & Auditor Selector Row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3 border-t border-navy-800 text-xs">
          <div>
            <label className="block text-slate-300 font-medium mb-1">
              {isHindi ? "विद्यालय का चयन करें" : "Target School"}
            </label>
            <select
              value={selectedSchoolId}
              onChange={(e) => setSelectedSchoolId(e.target.value)}
              className="w-full rounded-md bg-navy-800 border border-navy-700 p-2.5 text-white font-medium min-h-[44px]"
            >
              {schools.map((s) => (
                <option key={s.id} value={s.id}>
                  {isHindi ? s.name_hi : s.name_en} ({s.type})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-slate-300 font-medium mb-1">
              {isHindi ? "ऑडिटर का नाम" : "Auditor Name"}
            </label>
            <input
              type="text"
              value={auditorName}
              onChange={(e) => setAuditorName(e.target.value)}
              className="w-full rounded-md bg-navy-800 border border-navy-700 p-2.5 text-white min-h-[44px]"
            />
          </div>

          <div>
            <label className="block text-slate-300 font-medium mb-1">
              {isHindi ? "निरीक्षण तिथि" : "Inspection Date"}
            </label>
            <input
              type="date"
              value={auditDate}
              onChange={(e) => setAuditDate(e.target.value)}
              className="w-full rounded-md bg-navy-800 border border-navy-700 p-2.5 text-white min-h-[44px]"
            />
          </div>
        </div>
      </div>

      {/* Live Compliance Scorecard Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
            {isHindi ? "अनुपालन दर" : "Compliance Rate"}
          </span>
          <div className="flex items-baseline gap-2 mt-0.5">
            <span
              className={`text-2xl font-black ${
                comparisonResult.complianceRate >= 80
                  ? "text-emerald-600"
                  : comparisonResult.complianceRate >= 50
                  ? "text-amber-600"
                  : "text-rose-600"
              }`}
            >
              {comparisonResult.complianceRate}%
            </span>
            <span className="text-xs text-slate-500">
              ({comparisonResult.totalEvaluated - comparisonResult.totalDeficiencies}/{comparisonResult.totalEvaluated} {isHindi ? "मानक" : "passed"})
            </span>
          </div>
        </div>

        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
            {isHindi ? "कुल विसंगतियां" : "Deficiencies"}
          </span>
          <div className="text-2xl font-black text-rose-600 mt-0.5">
            {comparisonResult.totalDeficiencies}
          </div>
        </div>

        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
            {isHindi ? "प्रमाणित मानक" : "Active Standards"}
          </span>
          <div className="text-2xl font-black text-navy-800 mt-0.5">
            {standards.length}
          </div>
        </div>

        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
            {isHindi ? "सार्वजनिक दृश्यता" : "Public Status"}
          </span>
          <div className="mt-1">
            <span
              className={`inline-flex items-center gap-1 px-2.5 py-1 rounded text-xs font-bold ${
                auditStatus === "verified"
                  ? "bg-emerald-100 text-emerald-800"
                  : "bg-amber-100 text-amber-800"
              }`}
            >
              {auditStatus === "verified" ? "✓ Public Visible" : "⏳ Admin Draft Only"}
            </span>
          </div>
        </div>
      </div>

      {/* Mobile Touch Stepper Jump-Bar (Large Buttons) */}
      <div className="overflow-x-auto pb-2 scrollbar-none">
        <div className="flex items-center gap-2 min-w-max">
          {SECTIONS.map((sec, idx) => {
            const isCurrent = idx === currentSectionIndex;
            const defs = comparisonResult.deficiencies.filter((d) => d.category === sec.id);
            const hasDef = defs.length > 0;
            return (
              <button
                key={sec.id}
                onClick={() => setCurrentSectionIndex(idx)}
                className={`flex items-center gap-2 px-3.5 py-2.5 rounded-lg text-xs font-bold transition-all min-h-[48px] focus-ring ${
                  isCurrent
                    ? "bg-navy-800 text-white shadow-sm"
                    : "bg-slate-100 hover:bg-slate-200 text-slate-700"
                }`}
              >
                <span>{sec.icon}</span>
                <span>{isHindi ? sec.label_hi.split(". ")[1] : sec.label_en.split(". ")[1]}</span>
                {hasDef ? (
                  <span className="h-5 px-1.5 rounded-full bg-rose-500 text-white text-[10px] flex items-center justify-center font-bold">
                    {defs.length}
                  </span>
                ) : (
                  <span className="h-4 w-4 rounded-full bg-emerald-500 text-white text-[10px] flex items-center justify-center">
                    ✓
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Active Section Card with Large Inputs */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 sm:p-6 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-3">
          <div className="flex items-center gap-2">
            <span className="text-xl">{currentSection.icon}</span>
            <h2 className="text-lg font-bold text-navy-800">
              {isHindi ? currentSection.label_hi : currentSection.label_en}
            </h2>
          </div>

          <span className="text-xs text-slate-500 font-mono">
            Section {currentSectionIndex + 1} of {SECTIONS.length}
          </span>
        </div>

        {/* 1. RAMP FIELDS */}
        {currentSection.id === "ramp" && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {isHindi ? "ढलान अनुपात (1:X) — दर्ज करें X" : "Slope Ratio (1:X) — Enter X"}
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-slate-500 font-bold text-sm">1 :</span>
                  <input
                    type="number"
                    step="0.5"
                    value={measurements.ramp?.slopeRatio || ""}
                    onChange={(e) =>
                      setMeasurements((m) => ({
                        ...m,
                        ramp: { ...m.ramp, slopeRatio: parseFloat(e.target.value) || 0 },
                      }))
                    }
                    placeholder="12"
                    className="w-full pl-9 pr-3 py-2.5 rounded-md border border-slate-300 font-mono text-sm min-h-[48px]"
                  />
                </div>
                <p className="text-[11px] text-slate-500 mt-1">
                  {isHindi ? "मानक: 1:12 अधिकतम (12 या उससे अधिक मान्य)" : "Statutory: 1:12 Max (12+ is compliant)"}
                </p>
              </div>

              <Input
                label={isHindi ? "रैंप आंतरिक चौड़ाई (मिमी)" : "Ramp Clear Width (mm)"}
                type="number"
                value={measurements.ramp?.clearWidthMm || ""}
                onChange={(e) =>
                  setMeasurements((m) => ({
                    ...m,
                    ramp: { ...m.ramp, clearWidthMm: parseInt(e.target.value) || 0 },
                  }))
                }
                placeholder="1200"
                className="min-h-[48px]"
              />

              <Input
                label={isHindi ? "समतल लैंडिंग आयाम (मिमी)" : "Landing Dimensions (mm)"}
                type="number"
                value={measurements.ramp?.landingDimensionsMm || ""}
                onChange={(e) =>
                  setMeasurements((m) => ({
                    ...m,
                    ramp: { ...m.ramp, landingDimensionsMm: parseInt(e.target.value) || 0 },
                  }))
                }
                placeholder="1500"
                className="min-h-[48px]"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
              <label className="flex items-center gap-3 p-3 rounded-lg border border-slate-200 bg-slate-50 cursor-pointer min-h-[48px]">
                <input
                  type="checkbox"
                  checked={measurements.ramp?.hasDualHandrails ?? true}
                  onChange={(e) =>
                    setMeasurements((m) => ({
                      ...m,
                      ramp: { ...m.ramp, hasDualHandrails: e.target.checked },
                    }))
                  }
                  className="h-5 w-5 rounded text-teal-600"
                />
                <span className="text-xs font-semibold text-slate-800">
                  {isHindi ? "दोनों तरफ दोहरी रेलिंग" : "Bilateral Dual Handrails"}
                </span>
              </label>

              <label className="flex items-center gap-3 p-3 rounded-lg border border-slate-200 bg-slate-50 cursor-pointer min-h-[48px]">
                <input
                  type="checkbox"
                  checked={measurements.ramp?.hasTactileWarning ?? false}
                  onChange={(e) =>
                    setMeasurements((m) => ({
                      ...m,
                      ramp: { ...m.ramp, hasTactileWarning: e.target.checked },
                    }))
                  }
                  className="h-5 w-5 rounded text-teal-600"
                />
                <span className="text-xs font-semibold text-slate-800">
                  {isHindi ? "300 मिमी स्पर्श चेतावनी टाइल" : "300mm Tactile Warning Strips"}
                </span>
              </label>

              <label className="flex items-center gap-3 p-3 rounded-lg border border-slate-200 bg-slate-50 cursor-pointer min-h-[48px]">
                <input
                  type="checkbox"
                  checked={measurements.ramp?.surfaceNonSlip ?? true}
                  onChange={(e) =>
                    setMeasurements((m) => ({
                      ...m,
                      ramp: { ...m.ramp, surfaceNonSlip: e.target.checked },
                    }))
                  }
                  className="h-5 w-5 rounded text-teal-600"
                />
                <span className="text-xs font-semibold text-slate-800">
                  {isHindi ? "एंटी-स्किड गैर-फिसलन सतह" : "Slip-Resistant Surface"}
                </span>
              </label>
            </div>
          </div>
        )}

        {/* 2. DOORS FIELDS */}
        {currentSection.id === "doors" && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Input
                label={isHindi ? "मुख्य प्रवेश द्वार चौड़ाई (मिमी)" : "Main Door Clear Width (mm)"}
                type="number"
                value={measurements.doors?.mainDoorWidthMm || ""}
                onChange={(e) =>
                  setMeasurements((m) => ({
                    ...m,
                    doors: { ...m.doors, mainDoorWidthMm: parseInt(e.target.value) || 0 },
                  }))
                }
                placeholder="900"
                className="min-h-[48px]"
              />

              <Input
                label={isHindi ? "कक्षा का दरवाजा चौड़ाई (मिमी)" : "Classroom Door Width (mm)"}
                type="number"
                value={measurements.doors?.classroomDoorWidthMm || ""}
                onChange={(e) =>
                  setMeasurements((m) => ({
                    ...m,
                    doors: { ...m.doors, classroomDoorWidthMm: parseInt(e.target.value) || 0 },
                  }))
                }
                placeholder="900"
                className="min-h-[48px]"
              />

              <Input
                label={isHindi ? "देहरी की ऊंचाई (मिमी - अधिकतम 12)" : "Threshold Step Height (mm - Max 12)"}
                type="number"
                value={measurements.doors?.maxThresholdHeightMm || ""}
                onChange={(e) =>
                  setMeasurements((m) => ({
                    ...m,
                    doors: { ...m.doors, maxThresholdHeightMm: parseInt(e.target.value) || 0 },
                  }))
                }
                placeholder="10"
                className="min-h-[48px]"
              />
            </div>

            <label className="flex items-center gap-3 p-3 rounded-lg border border-slate-200 bg-slate-50 cursor-pointer min-h-[48px]">
              <input
                type="checkbox"
                checked={measurements.doors?.hasEasyLeverHandles ?? true}
                onChange={(e) =>
                  setMeasurements((m) => ({
                    ...m,
                    doors: { ...m.doors, hasEasyLeverHandles: e.target.checked },
                  }))
                }
                className="h-5 w-5 rounded text-teal-600"
              />
              <span className="text-xs font-semibold text-slate-800">
                {isHindi ? "लीवर-प्रकार के आसान हैंडल (D-Handle)" : "Lever / D-Type Accessible Door Handles"}
              </span>
            </label>
          </div>
        )}

        {/* 3. TOILETS FIELDS */}
        {currentSection.id === "toilets" && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <label className="flex items-center gap-3 p-3 rounded-lg border border-slate-200 bg-slate-50 cursor-pointer min-h-[48px]">
                <input
                  type="checkbox"
                  checked={measurements.toilets?.hasDedicatedCwsnToilet ?? true}
                  onChange={(e) =>
                    setMeasurements((m) => ({
                      ...m,
                      toilets: { ...m.toilets, hasDedicatedCwsnToilet: e.target.checked },
                    }))
                  }
                  className="h-5 w-5 rounded text-teal-600"
                />
                <span className="text-xs font-semibold text-slate-800">
                  {isHindi ? "समर्पित CwSN सुगम शौचालय उपस्थित है" : "Dedicated CwSN Accessible Toilet Exists"}
                </span>
              </label>

              <label className="flex items-center gap-3 p-3 rounded-lg border border-slate-200 bg-slate-50 cursor-pointer min-h-[48px]">
                <input
                  type="checkbox"
                  checked={measurements.toilets?.isDoorOutwardOpening ?? true}
                  onChange={(e) =>
                    setMeasurements((m) => ({
                      ...m,
                      toilets: { ...m.toilets, isDoorOutwardOpening: e.target.checked },
                    }))
                  }
                  className="h-5 w-5 rounded text-teal-600"
                />
                <span className="text-xs font-semibold text-slate-800">
                  {isHindi ? "दरवाजा बाहर की ओर खुलता है (सुरक्षा मानक)" : "Door Swings Outward (Mandatory Safety)"}
                </span>
              </label>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              <Input
                label={isHindi ? "क्यूबिकल चौड़ाई (मिमी)" : "Cubicle Width (mm)"}
                type="number"
                value={measurements.toilets?.cubicleWidthMm || ""}
                onChange={(e) =>
                  setMeasurements((m) => ({
                    ...m,
                    toilets: { ...m.toilets, cubicleWidthMm: parseInt(e.target.value) || 0 },
                  }))
                }
                placeholder="2000"
                className="min-h-[48px]"
              />

              <Input
                label={isHindi ? "क्यूबिकल लंबाई (मिमी)" : "Cubicle Length (mm)"}
                type="number"
                value={measurements.toilets?.cubicleLengthMm || ""}
                onChange={(e) =>
                  setMeasurements((m) => ({
                    ...m,
                    toilets: { ...m.toilets, cubicleLengthMm: parseInt(e.target.value) || 0 },
                  }))
                }
                placeholder="2200"
                className="min-h-[48px]"
              />

              <Input
                label={isHindi ? "घुमाव चक्र (मिमी)" : "Turning Space (mm)"}
                type="number"
                value={measurements.toilets?.turningCircleMm || ""}
                onChange={(e) =>
                  setMeasurements((m) => ({
                    ...m,
                    toilets: { ...m.toilets, turningCircleMm: parseInt(e.target.value) || 0 },
                  }))
                }
                placeholder="1500"
                className="min-h-[48px]"
              />

              <Input
                label={isHindi ? "कमोड सीट ऊंचाई (मिमी)" : "WC Seat Height (mm)"}
                type="number"
                value={measurements.toilets?.wcSeatHeightMm || ""}
                onChange={(e) =>
                  setMeasurements((m) => ({
                    ...m,
                    toilets: { ...m.toilets, wcSeatHeightMm: parseInt(e.target.value) || 0 },
                  }))
                }
                placeholder="460"
                className="min-h-[48px]"
              />
            </div>
          </div>
        )}

        {/* 4. RAILINGS FIELDS */}
        {currentSection.id === "railings" && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Input
                label={isHindi ? "निचली रेलिंग ऊंचाई (मिमी - मानक 760)" : "Lower Rail Height (mm - Std 760)"}
                type="number"
                value={measurements.railings?.lowerRailHeightMm || ""}
                onChange={(e) =>
                  setMeasurements((m) => ({
                    ...m,
                    railings: { ...m.railings, lowerRailHeightMm: parseInt(e.target.value) || 0 },
                  }))
                }
                placeholder="760"
                className="min-h-[48px]"
              />

              <Input
                label={isHindi ? "ऊपरी रेलिंग ऊंचाई (मिमी - मानक 900)" : "Upper Rail Height (mm - Std 900)"}
                type="number"
                value={measurements.railings?.upperRailHeightMm || ""}
                onChange={(e) =>
                  setMeasurements((m) => ({
                    ...m,
                    railings: { ...m.railings, upperRailHeightMm: parseInt(e.target.value) || 0 },
                  }))
                }
                placeholder="900"
                className="min-h-[48px]"
              />

              <Input
                label={isHindi ? "रेलिंग व्यास (मिमी - 38-45)" : "Grip Diameter (mm - 38-45)"}
                type="number"
                value={measurements.railings?.gripDiameterMm || ""}
                onChange={(e) =>
                  setMeasurements((m) => ({
                    ...m,
                    railings: { ...m.railings, gripDiameterMm: parseInt(e.target.value) || 0 },
                  }))
                }
                placeholder="40"
                className="min-h-[48px]"
              />
            </div>

            <label className="flex items-center gap-3 p-3 rounded-lg border border-slate-200 bg-slate-50 cursor-pointer min-h-[48px]">
              <input
                type="checkbox"
                checked={measurements.railings?.hasContinuousExtensions ?? true}
                onChange={(e) =>
                  setMeasurements((m) => ({
                    ...m,
                    railings: { ...m.railings, hasContinuousExtensions: e.target.checked },
                  }))
                }
                className="h-5 w-5 rounded text-teal-600"
              />
              <span className="text-xs font-semibold text-slate-800">
                {isHindi ? "300 मिमी का सुरक्षित क्षैतिज विस्तार उपस्थित" : "300mm Horizontal End Extensions Present"}
              </span>
            </label>
          </div>
        )}

        {/* 5. CLASSROOMS FIELDS */}
        {currentSection.id === "classrooms" && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label={isHindi ? "कक्षा गलियारा चौड़ाई (मिमी - न्यूनतम 1200)" : "Desk Aisle Width (mm - Min 1200)"}
                type="number"
                value={measurements.classrooms?.aisleWidthMm || ""}
                onChange={(e) =>
                  setMeasurements((m) => ({
                    ...m,
                    classrooms: { ...m.classrooms, aisleWidthMm: parseInt(e.target.value) || 0 },
                  }))
                }
                placeholder="1200"
                className="min-h-[48px]"
              />

              <Input
                label={isHindi ? "डेस्क घुटना अवकाश (मिमी - न्यूनतम 650)" : "Desk Knee Clearance (mm - Min 650)"}
                type="number"
                value={measurements.classrooms?.deskKneeClearanceMm || ""}
                onChange={(e) =>
                  setMeasurements((m) => ({
                    ...m,
                    classrooms: { ...m.classrooms, deskKneeClearanceMm: parseInt(e.target.value) || 0 },
                  }))
                }
                placeholder="650"
                className="min-h-[48px]"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <label className="flex items-center gap-3 p-3 rounded-lg border border-slate-200 bg-slate-50 cursor-pointer min-h-[48px]">
                <input
                  type="checkbox"
                  checked={measurements.classrooms?.hasAccessibleDesk ?? true}
                  onChange={(e) =>
                    setMeasurements((m) => ({
                      ...m,
                      classrooms: { ...m.classrooms, hasAccessibleDesk: e.target.checked },
                    }))
                  }
                  className="h-5 w-5 rounded text-teal-600"
                />
                <span className="text-xs font-semibold text-slate-800">
                  {isHindi ? "व्हीलचेयर सुलभ डेस्क उपलब्ध है" : "Wheelchair Accessible Desk Present"}
                </span>
              </label>

              <label className="flex items-center gap-3 p-3 rounded-lg border border-slate-200 bg-slate-50 cursor-pointer min-h-[48px]">
                <input
                  type="checkbox"
                  checked={measurements.classrooms?.hasStepFreeAccess ?? true}
                  onChange={(e) =>
                    setMeasurements((m) => ({
                      ...m,
                      classrooms: { ...m.classrooms, hasStepFreeAccess: e.target.checked },
                    }))
                  }
                  className="h-5 w-5 rounded text-teal-600"
                />
                <span className="text-xs font-semibold text-slate-800">
                  {isHindi ? "कक्षा में बाधारहित समतल प्रवेश" : "Step-Free Level Entrance into Classroom"}
                </span>
              </label>
            </div>
          </div>
        )}

        {/* 6. PATHWAYS FIELDS */}
        {currentSection.id === "pathways" && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label={isHindi ? "मुख्य परिसर मार्ग चौड़ाई (मिमी)" : "Primary Pathway Width (mm)"}
                type="number"
                value={measurements.pathways?.mainPathwayWidthMm || ""}
                onChange={(e) =>
                  setMeasurements((m) => ({
                    ...m,
                    pathways: { ...m.pathways, mainPathwayWidthMm: parseInt(e.target.value) || 0 },
                  }))
                }
                placeholder="1200"
                className="min-h-[48px]"
              />

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {isHindi ? "मार्ग सतह की स्थिति" : "Surface Condition"}
                </label>
                <select
                  value={measurements.pathways?.surfaceCondition || "paved_smooth"}
                  onChange={(e) =>
                    setMeasurements((m) => ({
                      ...m,
                      pathways: { ...m.pathways, surfaceCondition: e.target.value as any },
                    }))
                  }
                  className="w-full rounded-md border border-slate-300 p-2.5 bg-white text-xs min-h-[48px]"
                >
                  <option value="paved_smooth">Paved & Smooth (पक्की व समतल)</option>
                  <option value="uneven">Uneven / Cracked (उबड़-खाबड़ / टूटी)</option>
                  <option value="unpaved_dirt">Unpaved / Muddy (कच्चा मार्ग / मिट्टी)</option>
                </select>
              </div>
            </div>

            <label className="flex items-center gap-3 p-3 rounded-lg border border-slate-200 bg-slate-50 cursor-pointer min-h-[48px]">
              <input
                type="checkbox"
                checked={measurements.pathways?.hasTactilePath ?? false}
                onChange={(e) =>
                  setMeasurements((m) => ({
                    ...m,
                    pathways: { ...m.pathways, hasTactilePath: e.target.checked },
                  }))
                }
                className="h-5 w-5 rounded text-teal-600"
              />
              <span className="text-xs font-semibold text-slate-800">
                {isHindi ? "गेट से भवन तक स्पर्श पथ (TGSI)" : "Continuous Tactile Guiding Path from Gate to Building"}
              </span>
            </label>
          </div>
        )}

        {/* 7. SIGNAGE FIELDS */}
        {currentSection.id === "signage" && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label={isHindi ? "साइनेज स्थापना ऊंचाई (मिमी - 1400-1600)" : "Sign Mounting Height (mm - 1400-1600)"}
                type="number"
                value={measurements.signage?.signMountingHeightMm || ""}
                onChange={(e) =>
                  setMeasurements((m) => ({
                    ...m,
                    signage: { ...m.signage, signMountingHeightMm: parseInt(e.target.value) || 0 },
                  }))
                }
                placeholder="1500"
                className="min-h-[48px]"
              />

              <div className="flex flex-col justify-center space-y-2">
                <label className="flex items-center gap-3 p-3 rounded-lg border border-slate-200 bg-slate-50 cursor-pointer min-h-[48px]">
                  <input
                    type="checkbox"
                    checked={measurements.signage?.hasBrailleSignage ?? false}
                    onChange={(e) =>
                      setMeasurements((m) => ({
                        ...m,
                        signage: { ...m.signage, hasBrailleSignage: e.target.checked },
                      }))
                    }
                    className="h-5 w-5 rounded text-teal-600"
                  />
                  <span className="text-xs font-semibold text-slate-800">
                    {isHindi ? "उभरी हुई ब्रेल लिपि में संकेतक" : "Tactile & Braille Embossed Signs"}
                  </span>
                </label>
              </div>
            </div>
          </div>
        )}

        {/* 8. DRINKING WATER FIELDS */}
        {currentSection.id === "drinkingWater" && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label={isHindi ? "नल स्थापना ऊंचाई (मिमी - अधिकतम 800)" : "Tap Operating Height (mm - Max 800)"}
                type="number"
                value={measurements.drinkingWater?.tapHeightMm || ""}
                onChange={(e) =>
                  setMeasurements((m) => ({
                    ...m,
                    drinkingWater: { ...m.drinkingWater, tapHeightMm: parseInt(e.target.value) || 0 },
                  }))
                }
                placeholder="800"
                className="min-h-[48px]"
              />

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {isHindi ? "नल का प्रकार" : "Tap Mechanism"}
                </label>
                <select
                  value={measurements.drinkingWater?.tapOperationType || "lever"}
                  onChange={(e) =>
                    setMeasurements((m) => ({
                      ...m,
                      drinkingWater: { ...m.drinkingWater, tapOperationType: e.target.value as any },
                    }))
                  }
                  className="w-full rounded-md border border-slate-300 p-2.5 bg-white text-xs min-h-[48px]"
                >
                  <option value="lever">Lever Type / आसान लीवर नल</option>
                  <option value="push">Push Button / सेंसर या पुश नल</option>
                  <option value="twist_knob">Twist Knob / गोल घूमने वाला नल (Deficient)</option>
                </select>
              </div>
            </div>

            <label className="flex items-center gap-3 p-3 rounded-lg border border-slate-200 bg-slate-50 cursor-pointer min-h-[48px]">
              <input
                type="checkbox"
                checked={measurements.drinkingWater?.hasWheelchairKneeRecess ?? true}
                onChange={(e) =>
                  setMeasurements((m) => ({
                    ...m,
                    drinkingWater: { ...m.drinkingWater, hasWheelchairKneeRecess: e.target.checked },
                  }))
                }
                className="h-5 w-5 rounded text-teal-600"
              />
              <span className="text-xs font-semibold text-slate-800">
                {isHindi ? "काउंटर के नीचे व्हीलचेयर घुटने की जगह (650 मिमी)" : "650mm Knee Clearance Under Water Counter"}
              </span>
            </label>
          </div>
        )}

        {/* 9. EMERGENCY EXITS FIELDS */}
        {currentSection.id === "emergencyExits" && (
          <div className="space-y-4">
            <Input
              label={isHindi ? "निकास द्वार चौड़ाई (मिमी - न्यूनतम 1200)" : "Exit Doorway Clear Width (mm - Min 1200)"}
              type="number"
              value={measurements.emergencyExits?.exitDoorWidthMm || ""}
              onChange={(e) =>
                setMeasurements((m) => ({
                  ...m,
                  emergencyExits: { ...m.emergencyExits, exitDoorWidthMm: parseInt(e.target.value) || 0 },
                }))
              }
              placeholder="1200"
              className="min-h-[48px]"
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <label className="flex items-center gap-3 p-3 rounded-lg border border-slate-200 bg-slate-50 cursor-pointer min-h-[48px]">
                <input
                  type="checkbox"
                  checked={measurements.emergencyExits?.isEvacuationRouteStepFree ?? true}
                  onChange={(e) =>
                    setMeasurements((m) => ({
                      ...m,
                      emergencyExits: { ...m.emergencyExits, isEvacuationRouteStepFree: e.target.checked },
                    }))
                  }
                  className="h-5 w-5 rounded text-teal-600"
                />
                <span className="text-xs font-semibold text-slate-800">
                  {isHindi ? "निकासी मार्ग पूरी तरह सीढ़ी-मुक्त (समतल/रैंप)" : "Evacuation Route Step-Free to Safe Zone"}
                </span>
              </label>

              <label className="flex items-center gap-3 p-3 rounded-lg border border-slate-200 bg-slate-50 cursor-pointer min-h-[48px]">
                <input
                  type="checkbox"
                  checked={measurements.emergencyExits?.hasDualAlarm ?? false}
                  onChange={(e) =>
                    setMeasurements((m) => ({
                      ...m,
                      emergencyExits: { ...m.emergencyExits, hasDualAlarm: e.target.checked },
                    }))
                  }
                  className="h-5 w-5 rounded text-teal-600"
                />
                <span className="text-xs font-semibold text-slate-800">
                  {isHindi ? "दृश्य (लाइट) एवं श्रव्य दोनों अलार्म" : "Dual Visual (Strobe) & Audible Alarm"}
                </span>
              </label>
            </div>
          </div>
        )}

        {/* Live Section Deficiencies Box */}
        {sectionDeficiencies.length > 0 ? (
          <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 space-y-3">
            <div className="flex items-center gap-2 text-rose-800 font-bold text-xs uppercase tracking-wider">
              <AlertTriangle className="w-4 h-4 text-rose-600" />
              <span>
                {isHindi ? "पहचानी गई विसंगतियां (Deficiencies Flagged)" : "Deficiencies Detected Against Standards"}
              </span>
            </div>
            <div className="space-y-2">
              {sectionDeficiencies.map((d, i) => (
                <div key={i} className="text-xs text-rose-900 bg-white/70 p-3 rounded-lg border border-rose-100 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold">{isHindi ? d.parameter_hi : d.parameter}</span>
                    <Badge variant="rejected" className="text-[10px]">
                      {d.severity.toUpperCase()}
                    </Badge>
                  </div>
                  <p>{isHindi ? d.message_hi : d.message_en}</p>
                  <div className="text-[10px] text-slate-600 font-mono">
                    <strong>Ref:</strong> {d.sourceDocument} ({d.sourceClause})
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>
              {isHindi
                ? "वर्तमान में दर्ज किए गए मान आधिकारिक वैधानिक मानकों के अनुरूप हैं।"
                : "All currently entered values in this section comply with statutory standards."}
            </span>
          </div>
        )}

        {/* Section Notes & Photo Attachment */}
        <div className="pt-4 border-t border-slate-200 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex-1">
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {isHindi ? "इस खंड से संबंधित फील्ड नोट्स" : "Section Field Notes"}
              </label>
              <input
                type="text"
                placeholder={isHindi ? "विशिष्ट प्रेक्षण, बाधाएं या टिप्पणी दर्ज करें..." : "Enter specific site observations..."}
                value={(measurements as any)[currentSection.id]?.notes || ""}
                onChange={(e) => {
                  const sec = currentSection.id;
                  setMeasurements((m) => ({
                    ...m,
                    [sec]: { ...(m as any)[sec], notes: e.target.value },
                  }));
                }}
                className="w-full text-xs rounded-md border border-slate-300 p-2.5 min-h-[44px]"
              />
            </div>

            {/* Photo Capture / Upload Button */}
            <div className="relative shrink-0">
              <input
                type="file"
                id={`photo-input-${currentSection.id}`}
                accept="image/*"
                capture="environment"
                className="sr-only"
                onChange={handlePhotoUpload}
                disabled={isUploadingPhoto}
              />
              <label
                htmlFor={`photo-input-${currentSection.id}`}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-teal-700 hover:bg-teal-800 text-white text-xs font-bold cursor-pointer min-h-[44px] shadow-xs select-none"
              >
                <Camera className="w-4 h-4" />
                <span>{isUploadingPhoto ? "Uploading..." : isHindi ? "फोटो खींचें / जोड़ें" : "Take Photo"}</span>
              </label>
            </div>
          </div>

          {/* Attached Photos Gallery */}
          {photos[currentSection.id]?.length > 0 && (
            <div className="flex flex-wrap gap-2 pt-2">
              {photos[currentSection.id].map((url, pIdx) => (
                <div key={pIdx} className="relative group rounded-lg overflow-hidden border border-slate-300 w-20 h-20 bg-slate-100">
                  <img src={url} alt={`Inspection ${pIdx + 1}`} className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Stepper Navigation Buttons (Bottom of Section) */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-200">
          <Button
            variant="outline"
            disabled={currentSectionIndex === 0}
            onClick={() => setCurrentSectionIndex((prev) => Math.max(0, prev - 1))}
            leftIcon={<ChevronLeft className="w-4 h-4" />}
            className="min-h-[48px]"
          >
            {isHindi ? "पिछला खंड" : "Previous"}
          </Button>

          {currentSectionIndex < SECTIONS.length - 1 ? (
            <Button
              variant="primary"
              onClick={() => setCurrentSectionIndex((prev) => Math.min(SECTIONS.length - 1, prev + 1))}
              rightIcon={<ChevronRight className="w-4 h-4" />}
              className="min-h-[48px]"
            >
              {isHindi ? "अगला खंड" : "Next Section"}
            </Button>
          ) : (
            <Button
              variant="secondary"
              onClick={handleSaveAudit}
              isLoading={isSaving}
              leftIcon={<Save className="w-4 h-4" />}
              className="min-h-[48px]"
            >
              {isHindi ? "ऑडिट पूर्ण एवं सुरक्षित करें" : "Finish & Save Audit"}
            </Button>
          )}
        </div>
      </div>

      {/* General Audit Notes & Sticky Bottom Action Bar */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 sm:p-6 shadow-sm space-y-4">
        <Textarea
          label={isHindi ? "समग्र विद्यालय ऑडिट निष्कर्ष एवं अनुशंसाएं" : "Overall Audit Findings & Recommendations"}
          rows={3}
          value={generalNotes}
          onChange={(e) => setGeneralNotes(e.target.value)}
          placeholder={
            isHindi
              ? "विद्यालय प्रांगण, प्रधानाध्यापक से चर्चा, और आवश्यक रेट्रोफिटिंग के बारे में समग्र टिप्पणी लिखें..."
              : "Summary recommendations for retrofitting, SMC discussion, and prioritised civil works..."
          }
        />

        {statusMsg && (
          <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-300 text-xs font-bold text-emerald-800 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{statusMsg}</span>
          </div>
        )}

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
          <div className="text-xs text-slate-500">
            {auditStatus === "verified" ? (
              <span className="text-emerald-700 font-semibold flex items-center gap-1">
                <ShieldCheck className="w-4 h-4 inline" />
                {isHindi
                  ? "सत्यापित स्थिति: सार्वजनिक विद्यालय पृष्ठ एवं स्कोरकार्ड तुरंत अपडेट होंगे।"
                  : "Verified status: School directory & scorecard will update immediately."}
              </span>
            ) : (
              <span className="text-amber-700 font-semibold flex items-center gap-1">
                <Info className="w-4 h-4 inline" />
                {isHindi
                  ? "ड्राफ्ट स्थिति: यह ऑडिट केवल व्यवस्थापक को दिखेगा, जनता को नहीं।"
                  : "Draft status: Only visible to admin. Will not affect public pages."}
              </span>
            )}
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <Button
              variant="secondary"
              onClick={handleSaveAudit}
              isLoading={isSaving}
              leftIcon={<Save className="w-4 h-4" />}
              className="w-full sm:w-auto min-h-[48px]"
            >
              {isHindi
                ? auditStatus === "verified"
                  ? "सत्यापित ऑडिट सहेजें"
                  : "ड्राफ्ट ऑडिट सहेजें"
                : auditStatus === "verified"
                ? "Save Verified Audit"
                : "Save Draft Audit"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
