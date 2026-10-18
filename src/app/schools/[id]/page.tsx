"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useLanguage } from "@/context/LanguageContext";
import { DEMO_SCHOOLS, SchoolItem } from "@/data/schoolsData";
import { Card, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import {
  ArrowLeft,
  MapPin,
  Calendar,
  Building2,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Hash,
  Globe,
  ClipboardList,
  BarChart3,
  FileSearch,
} from "lucide-react";
import { Download, FileText, ArrowLeftRight } from "lucide-react";
import { SchoolScorecard } from "@/components/schools/SchoolScorecard";
import {
  DEFAULT_SCORING_CONFIG,
  ScoringConfig,
  ScoreCategoryKey,
} from "@/data/scoringConfigData";
import {
  calculateScorecard,
  ScorecardResult,
} from "@/lib/scorecardCalculator";
import { DEFAULT_STANDARDS } from "@/data/standardsData";
import { SchoolRecommendations } from "@/components/schools/SchoolRecommendations";
import { BeforeAfterTracker } from "@/components/tracker/BeforeAfterTracker";
import {
  DEMO_TRACKER_ENTRIES,
  DEMO_RECOMMENDATIONS,
  DEMO_DOWNLOADABLE_REPORTS,
} from "@/data/trackerData";

/**
 * Facility key → i18n key mapping
 * Displayed as a checklist with ✓ / ✕ indicators plus text (non-colour-only per WCAG 1.4.1)
 */
const FACILITY_KEYS: (keyof SchoolItem["facilities"])[] = [
  "ramp",
  "toilet",
  "drinkingWater",
  "wideDoors",
  "tactilePath",
  "emergencyExit",
];

function buildFallbackScorecard(
  school: SchoolItem,
  config: ScoringConfig = DEFAULT_SCORING_CONFIG
): ScorecardResult {
  const rawBreakdown = school.scoreBreakdown || {
    entrance: Math.round(school.score * 0.3),
    toilets: Math.round(school.score * 0.3),
    classrooms: Math.round(school.score * 0.25),
    safety: Math.round(school.score * 0.15),
  };

  const getCatResult = (key: ScoreCategoryKey, maxWeight: number, defaultEvaluated: number) => {
    const earned = Math.min(maxWeight, rawBreakdown[key] ?? 0);
    const ratio = maxWeight > 0 ? earned / maxWeight : 0;
    const compliant = Math.round(ratio * defaultEvaluated);
    return {
      key,
      name_en: config.categories[key]?.name_en || key,
      name_hi: config.categories[key]?.name_hi || key,
      maxWeight,
      evaluatedCount: defaultEvaluated,
      compliantCount: compliant,
      deficientCount: defaultEvaluated - compliant,
      compliancePercentage: Math.round(ratio * 100),
      pointsEarned: earned,
      isAssessed: school.auditStatus !== "pending",
      deficiencies: [],
      iconName: config.categories[key]?.iconName || "BarChart3",
    };
  };

  const categories = {
    entrance: getCatResult("entrance", config.categories.entrance?.weight ?? 30, 4),
    toilets: getCatResult("toilets", config.categories.toilets?.weight ?? 30, 6),
    classrooms: getCatResult("classrooms", config.categories.classrooms?.weight ?? 25, 2),
    safety: getCatResult("safety", config.categories.safety?.weight ?? 15, 2),
  };

  const overall = school.auditStatus === "pending" ? 0 : school.score;
  const tier =
    config.tiers.find((t) => overall >= t.minScore && overall <= t.maxScore) ||
    config.tiers[config.tiers.length - 1];

  return {
    overallScore: overall,
    exactScore: overall,
    tier,
    categories,
    totalEvaluated: 14,
    totalCompliant: Math.round((overall / 100) * 14),
    totalDeficiencies: 14 - Math.round((overall / 100) * 14),
    overallComplianceRate: overall,
    disclaimer_en: config.disclaimer_en,
    disclaimer_hi: config.disclaimer_hi,
    methodology: config.methodology,
    calculatedAt: school.lastAuditDate || new Date().toISOString(),
    configVersion: config.version,
  };
}

export default function SchoolDetailPage() {
  const params = useParams();
  const schoolId = params?.id as string;
  const { locale, t } = useLanguage();
  const isHindi = locale === "hi";

  const [school, setSchool] = useState<SchoolItem | null>(null);
  const [scoringConfig, setScoringConfig] = useState<ScoringConfig>(DEFAULT_SCORING_CONFIG);
  const [scorecardResult, setScorecardResult] = useState<ScorecardResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    let cancelled = false;
    async function loadSchool() {
      let activeConfig = DEFAULT_SCORING_CONFIG;
      let activeSchool: SchoolItem | null = null;
      let auditMeasurements: any = undefined;

      // Try Firestore with parallel fetches
      try {
        const { db } = await import("@/lib/firebase/firestore");
        if (db && !cancelled) {
          const { doc, getDoc, collection, query, where, getDocs, limit } = await import("firebase/firestore");
          const [configSnap, schoolSnap, auditSnap] = await Promise.all([
            getDoc(doc(db, "scoringConfig", "v1")).catch(() => null),
            getDoc(doc(db, "schools", schoolId)).catch(() => null),
            getDocs(
              query(
                collection(db, "audits"),
                where("schoolId", "==", schoolId),
                where("status", "==", "verified"),
                limit(1)
              )
            ).catch(() => null),
          ]);

          if (configSnap && configSnap.exists()) {
            activeConfig = configSnap.data() as ScoringConfig;
            if (!cancelled) setScoringConfig(activeConfig);
          }

          if (schoolSnap && schoolSnap.exists()) {
            const data = { id: schoolSnap.id, ...schoolSnap.data() } as SchoolItem;
            if (data.published) {
              activeSchool = data;
            }
          }

          if (auditSnap && !auditSnap.empty) {
            const auditData = auditSnap.docs[0].data();
            if (auditData.measurements) {
              auditMeasurements = auditData.measurements;
            }
          }
        }
      } catch (err) {
        console.info("Firestore offline, falling back to demo data");
      }

      // Fallback to demo data
      if (!activeSchool) {
        const demoSchool = DEMO_SCHOOLS.find(
          (s) => s.id === schoolId && s.published
        );
        if (demoSchool) {
          activeSchool = demoSchool;
        } else {
          setNotFound(true);
        }
      }

      if (activeSchool) {
        setSchool(activeSchool);
        if (auditMeasurements) {
          setScorecardResult(calculateScorecard(auditMeasurements, DEFAULT_STANDARDS, activeConfig));
        } else {
          setScorecardResult(buildFallbackScorecard(activeSchool, activeConfig));
        }
      }

      setLoading(false);
    }

    if (schoolId) {
      loadSchool();
    }
  }, [schoolId]);

  // Loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] py-20">
        <div className="flex flex-col items-center gap-3 text-navy-800">
          <div
            className="w-8 h-8 border-4 border-teal-600 border-t-transparent rounded-full animate-spin"
            aria-hidden="true"
          />
          <span className="font-semibold text-base">
            {isHindi
              ? "विद्यालय डेटा लोड हो रहा है..."
              : "Loading school profile..."}
          </span>
        </div>
      </div>
    );
  }

  // Not found / unpublished
  if (notFound || !school) {
    return (
      <div className="max-w-xl mx-auto py-20 px-4 text-center space-y-5">
        <div className="w-16 h-16 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
          <Building2 className="w-8 h-8" aria-hidden="true" />
        </div>
        <h1 className="text-2xl font-bold text-navy-800">
          {isHindi
            ? "विद्यालय प्रोफ़ाइल उपलब्ध नहीं है"
            : "School Profile Not Available"}
        </h1>
        <p className="text-sm text-slate-600">
          {isHindi
            ? "यह विद्यालय अभी तक प्रकाशित या सत्यापित नहीं किया गया है।"
            : "This school record has not been published or verified yet."}
        </p>
        <Link href="/schools">
          <Button variant="outline" leftIcon={<ArrowLeft className="w-4 h-4" />}>
            {t("schools.detail.backToDirectory")}
          </Button>
        </Link>
      </div>
    );
  }

  const schoolName = isHindi ? school.name_hi : school.name_en;
  const schoolAddress = isHindi ? school.address_hi : school.address_en;
  const findings = isHindi ? school.findings_hi : school.findings_en;



  return (
    <div className="flex flex-col w-full py-8 px-4 sm:px-8 max-w-5xl mx-auto space-y-8">
      {/* Back Navigation */}
      <nav aria-label={isHindi ? "ब्रेडक्रम्ब" : "Breadcrumb"}>
        <Link
          href="/schools"
          className="inline-flex items-center gap-2 text-sm font-semibold text-teal-700 hover:text-teal-900 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-600 rounded p-1"
        >
          <ArrowLeft className="w-4 h-4" aria-hidden="true" />
          <span>{t("schools.detail.backToDirectory")}</span>
        </Link>
      </nav>

      {/* Demo Data Notice */}
      {school.isDemo && (
        <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-300 text-amber-900 flex items-center gap-2 text-xs sm:text-sm font-medium">
          <AlertTriangle
            className="w-4 h-4 text-amber-600 shrink-0"
            aria-hidden="true"
          />
          <span>
            {t(
              "common.demoNotice",
              "Illustrative demo data — not actual Danapur survey findings."
            )}
          </span>
        </div>
      )}

      {/* School Header Card */}
      <Card as="article" className="p-0 overflow-hidden border-slate-200">
        {/* Top gradient strip indicating audit status */}
        <div
          className={`h-2 w-full ${
            school.auditStatus === "audited"
              ? "bg-gradient-to-r from-emerald-500 to-teal-500"
              : school.auditStatus === "follow_up_required"
              ? "bg-gradient-to-r from-red-500 to-amber-500"
              : "bg-gradient-to-r from-amber-400 to-yellow-300"
          }`}
          aria-hidden="true"
        />

        <div className="p-6 sm:p-8 space-y-6">
          {/* Badges Row */}
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant={school.type === "government" ? "government" : "private"}>
              {school.type === "government"
                ? t("common.government", "Government")
                : t("common.private", "Private")}
            </Badge>
            <Badge variant={school.auditStatus}>
              {school.auditStatus === "audited" &&
                t("common.audited", "Audited")}
              {school.auditStatus === "follow_up_required" &&
                t("common.followUpRequired", "Follow-up Required")}
              {school.auditStatus === "pending" &&
                t("common.pending", "Pending")}
            </Badge>
            {school.isDemo && (
              <Badge variant="default" className="text-[10px]">
                Demo Record
              </Badge>
            )}
          </div>

          {/* Title & Address */}
          <div className="space-y-3">
            <h1 className="text-2xl sm:text-4xl font-black text-navy-800 tracking-tight font-hindi leading-tight">
              {schoolName}
            </h1>
            <div className="flex items-start gap-2 text-sm text-slate-600">
              <MapPin
                className="w-4 h-4 text-slate-400 shrink-0 mt-0.5"
                aria-hidden="true"
              />
              <span>{schoolAddress}</span>
            </div>
          </div>

          {/* Meta Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
            {school.udiseCode && (
              <div className="flex items-center gap-3 p-3 rounded-lg bg-slate-50 border border-slate-100">
                <Hash
                  className="w-5 h-5 text-teal-600 shrink-0"
                  aria-hidden="true"
                />
                <div>
                  <span className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                    {t("schools.detail.udiseCode")}
                  </span>
                  <span className="text-sm font-bold text-navy-900 font-mono">
                    {school.udiseCode}
                  </span>
                </div>
              </div>
            )}

            <div className="flex items-center gap-3 p-3 rounded-lg bg-slate-50 border border-slate-100">
              <Globe
                className="w-5 h-5 text-teal-600 shrink-0"
                aria-hidden="true"
              />
              <div>
                <span className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                  {t("schools.detail.blockArea")}
                </span>
                <span className="text-sm font-bold text-navy-900">
                  {school.block}, Patna
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 rounded-lg bg-slate-50 border border-slate-100">
              <MapPin
                className="w-5 h-5 text-teal-600 shrink-0"
                aria-hidden="true"
              />
              <div>
                <span className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                  {t("schools.detail.coordinates")}
                </span>
                <span className="text-sm font-bold text-navy-900 font-mono">
                  {school.geo.lat.toFixed(4)}, {school.geo.lng.toFixed(4)}
                </span>
              </div>
            </div>

            {school.lastAuditDate && (
              <div className="flex items-center gap-3 p-3 rounded-lg bg-slate-50 border border-slate-100">
                <Calendar
                  className="w-5 h-5 text-teal-600 shrink-0"
                  aria-hidden="true"
                />
                <div>
                  <span className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                    {t("schools.card.lastAudited")}
                  </span>
                  <span className="text-sm font-bold text-navy-900">
                    {school.lastAuditDate}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      </Card>

      {/* Content Grid: Scorecard + Facilities */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Scorecard Component (PRD 6.2-C & Task 10) */}
        {scorecardResult && (
          <SchoolScorecard
            scorecard={scorecardResult}
            isHindi={isHindi}
            schoolName={schoolName}
            lastAuditDate={school.lastAuditDate}
            auditStatus={school.auditStatus}
            config={scoringConfig}
          />
        )}

        {/* Facilities Checklist */}
        <Card as="section" className="border-slate-200">
          <div className="flex items-center gap-2 mb-5 pb-3 border-b border-slate-100">
            <ClipboardList
              className="w-5 h-5 text-teal-700"
              aria-hidden="true"
            />
            <h2 className="text-lg font-bold text-navy-800">
              {t("schools.detail.facilitiesTitle")}
            </h2>
          </div>

          <ul className="space-y-3" role="list">
            {FACILITY_KEYS.map((key) => {
              const available = school.facilities[key];
              return (
                <li
                  key={key}
                  className={`flex items-center gap-3 p-3 rounded-lg border transition-colors ${
                    available
                      ? "bg-emerald-50/50 border-emerald-200"
                      : "bg-red-50/30 border-red-200/60"
                  }`}
                >
                  {/* Icon + text indicator — never colour alone per WCAG 1.4.1 */}
                  {available ? (
                    <CheckCircle2
                      className="w-5 h-5 text-emerald-600 shrink-0"
                      aria-hidden="true"
                    />
                  ) : (
                    <XCircle
                      className="w-5 h-5 text-red-500 shrink-0"
                      aria-hidden="true"
                    />
                  )}
                  <span
                    className={`text-sm font-medium ${
                      available ? "text-emerald-900" : "text-red-800"
                    }`}
                  >
                    {t(`schools.facilitiesList.${key}`)}
                  </span>
                  <span
                    className={`ml-auto text-xs font-bold px-2 py-0.5 rounded ${
                      available
                        ? "bg-emerald-100 text-emerald-700"
                        : "bg-red-100 text-red-700"
                    }`}
                    aria-label={
                      available
                        ? `${t(`schools.facilitiesList.${key}`)}: ${
                            isHindi ? "उपलब्ध" : "Available"
                          }`
                        : `${t(`schools.facilitiesList.${key}`)}: ${
                            isHindi ? "अनुपलब्ध" : "Not Available"
                          }`
                    }
                  >
                    {available
                      ? isHindi
                        ? "✓ उपलब्ध"
                        : "✓ Available"
                      : isHindi
                      ? "✕ अनुपलब्ध"
                      : "✕ Not Available"}
                  </span>
                </li>
              );
            })}
          </ul>
        </Card>
      </div>

      {/* Verified Field Audit Findings */}
      {findings && findings.length > 0 && (
        <Card as="section" className="border-slate-200">
          <div className="flex items-center gap-2 mb-5 pb-3 border-b border-slate-100">
            <FileSearch
              className="w-5 h-5 text-teal-700"
              aria-hidden="true"
            />
            <h2 className="text-lg font-bold text-navy-800">
              {t("schools.detail.findingsTitle")}
            </h2>
          </div>

          <ol className="space-y-3" role="list">
            {findings.map((finding, idx) => (
              <li
                key={idx}
                className="flex items-start gap-3 p-4 rounded-lg bg-slate-50 border border-slate-100"
              >
                <span
                  className="flex items-center justify-center w-7 h-7 rounded-full bg-navy-800 text-white text-xs font-bold shrink-0 mt-0.5"
                  aria-hidden="true"
                >
                  {idx + 1}
                </span>
                <p className="text-sm text-slate-800 leading-relaxed font-hindi">
                  {finding}
                </p>
              </li>
            ))}
          </ol>

          {/* Inspection summary note */}
          <div className="mt-5 pt-4 border-t border-slate-100 flex items-start gap-2 text-[11px] text-slate-500">
            <ShieldCheck
              className="w-4 h-4 text-teal-600 shrink-0 mt-0.5"
              aria-hidden="true"
            />
            <p className="italic">
              {isHindi
                ? "उपरोक्त निष्कर्ष शोध दल द्वारा ऑन-साइट भौतिक निरीक्षण पर आधारित एवं सत्यापित हैं। यह किसी सरकारी संस्था का आधिकारिक प्रमाणन नहीं है।"
                : "Above findings are based on verified on-site physical inspection by the research team. This is not an official government certification or endorsement."}
            </p>
          </div>
        </Card>
      )}

      {/* School Recommendations linked to audit findings (Task 15) */}
      <SchoolRecommendations
        schoolId={school.id}
        schoolName={schoolName}
      />

      {/* Before & After Tracker Entries for this School (Task 15 & PRD 6.2-E) */}
      {DEMO_TRACKER_ENTRIES.filter(
        (e) => e.schoolId === school.id && e.verificationStatus === "verified"
      ).length > 0 && (
        <section aria-label={isHindi ? "इस विद्यालय का सुधार ट्रैकर" : "School Impact Tracker"}>
          <BeforeAfterTracker
            entries={DEMO_TRACKER_ENTRIES.filter((e) => e.schoolId === school.id)}
            showSchoolFilter={false}
            title={
              isHindi
                ? `${schoolName} — पहले और बाद: सत्यापित सुधार`
                : `${schoolName} — Before & After: Verified Improvements`
            }
            subtitle={
              isHindi
                ? "इस विद्यालय में चिन्हित किए गए अवरोधों पर SMC एवं स्थानीय सहयोग से हुए वास्तविक भौतिक सुधार।"
                : "Tangible physical transformations achieved at this school following audit recommendations."
            }
          />
        </section>
      )}

      {/* Downloadable Audit Report Card (Task 15) */}
      <div className="bg-slate-900 text-white rounded-2xl p-6 md:p-8 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-sm">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-teal-900/60 text-teal-300 border border-teal-700">
            <FileText className="w-3.5 h-3.5" aria-hidden="true" />
            <span>{isHindi ? "आधिकारिक शोध दस्तावेज" : "Official Research Documentation"}</span>
          </div>
          <h3 className="text-xl font-bold text-white">
            {isHindi
              ? `${schoolName} — विस्तृत सुगम्यता ऑडिट रिपोर्ट (PDF)`
              : `${schoolName} — Detailed Accessibility Audit Report (PDF)`}
          </h3>
          <p className="text-sm text-slate-300 max-w-2xl leading-relaxed">
            {isHindi
              ? "सभी ऑन-साइट भौतिक नापजोख, 100-बिंदु स्कोरकार्ड विश्लेषण, वैधानिक विचलन तालिका एवं SMC कार्ययोजना की पूर्ण रिपोर्ट डाउनलोड करें।"
              : "Download the complete quantitative measurement logs, 100-point scorecard breakdown, statutory clause violations, and SMC action blueprint."}
          </p>
        </div>
        <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0">
          <Link
            href="/reports"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-teal-600 hover:bg-teal-500 text-white text-sm font-bold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-300"
          >
            <Download className="w-4 h-4" aria-hidden="true" />
            <span>{isHindi ? "रिपोर्ट्स केंद्र पर जाएं" : "Go to Reports Hub"}</span>
          </Link>
        </div>
      </div>

      {/* Footer: Back to Directory */}
      <div className="pt-4 flex justify-center">
        <Link href="/schools">
          <Button
            variant="outline"
            size="md"
            leftIcon={<ArrowLeft className="w-4 h-4" />}
          >
            {t("schools.detail.backToDirectory")}
          </Button>
        </Link>
      </div>
    </div>
  );
}
