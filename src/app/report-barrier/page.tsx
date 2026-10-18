"use client";

import React, { useState, useEffect, useTransition } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { ReportBarrierForm } from "@/components/barriers/ReportBarrierForm";
import { VerifiedBarriersList } from "@/components/barriers/VerifiedBarriersList";
import { DEMO_BARRIER_REPORTS, BarrierReportItem } from "@/data/barrierReportsData";
import {
  ShieldAlert,
  Send,
  ShieldCheck,
  Info,
  Clock,
  Sparkles,
  Lock,
  FileCheck2,
} from "lucide-react";

export default function ReportBarrierPage() {
  const { locale } = useLanguage();
  const isHindi = locale === "hi";

  const [activeTab, setActiveTab] = useState<"submit" | "verified">("submit");
  const [reports, setReports] = useState<BarrierReportItem[]>(DEMO_BARRIER_REPORTS);
  const [loading, setLoading] = useState<boolean>(true);
  const [isPending, startTransition] = useTransition();

  // Load verified barrier reports from Firestore
  useEffect(() => {
    let cancelled = false;
    async function loadVerifiedReports() {
      try {
        const { db } = await import("@/lib/firebase/firestore");
        if (!db || cancelled) {
          setLoading(false);
          return;
        }
        const { collection, query, where, getDocs } = await import("firebase/firestore");
        const q = query(
          collection(db, "barrierReports"),
          where("status", "==", "verified")
        );
        const snap = await getDocs(q);
        if (!snap.empty && !cancelled) {
          const list: BarrierReportItem[] = [];
          snap.forEach((d) => list.push({ id: d.id, ...d.data() } as BarrierReportItem));
          setReports(list);
        }
      } catch (err) {
        console.info("Using demo barrier reports (Firestore offline or query error)");
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }
    loadVerifiedReports();
    return () => {
      cancelled = true;
    };
  }, []);

  const verifiedCount = reports.filter((r) => r.status === "verified").length;

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Hero Section */}
        <div className="bg-gradient-to-br from-navy-900 via-navy-850 to-teal-950 rounded-3xl p-8 sm:p-12 text-white shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 space-y-4 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-teal-500/20 border border-teal-400/30 text-teal-300 text-xs font-bold uppercase tracking-wider">
              <ShieldAlert className="w-4 h-4 text-amber-400" />
              <span>{isHindi ? "सामुदायिक निगरानी एवं शोध" : "Community Monitoring & Research"}</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white leading-tight font-hindi">
              {isHindi ? "अभिगम्यता बाधा रिपोर्ट करें" : "Report an Accessibility Barrier"}
            </h1>

            <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-hindi">
              {isHindi
                ? "दानापुर के विद्यालयों में रैंप, शौचालय, चौड़े द्वार, पेयजल, स्पर्शनीय मार्ग या आपात निकास संबंधी बाधाओं की जानकारी साझा करें। आपके द्वारा दी गई जानकारी का उपयोग विद्यालय प्रबंधन समिति (SMC) व शिक्षा विभाग के साथ पैरवी और अकादमिक शोध हेतु किया जाता है।"
                : "Report physical infrastructure barriers at Danapur schools (steep ramps, narrow doors, inaccessible toilets, lack of drinking water). Your observations empower advocacy with School Management Committees (SMC) and ground academic research."}
            </p>

            {/* Privacy Promise Banner */}
            <div className="pt-2 flex flex-wrap items-center gap-4 text-xs text-teal-200">
              <span className="flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-amber-400" />
                <span>{isHindi ? "रिपोर्टर की पहचान पूर्णतः गोपनीय" : "Reporter details strictly private"}</span>
              </span>
              <span className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-teal-300" />
                <span>{isHindi ? "प्रकाशन से पूर्व एडमिन सत्यापन" : "Pending admin review before publishing"}</span>
              </span>
              <span className="flex items-center gap-1.5">
                <FileCheck2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>{isHindi ? "एनसीपीईडीपी फेलोशिप शोध" : "NCPEDP Fellowship Research"}</span>
              </span>
            </div>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-slate-200 bg-white rounded-2xl p-1.5 shadow-sm">
          <button
            type="button"
            onClick={() => setActiveTab("submit")}
            className={`flex-1 py-3 px-4 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-2 ${
              activeTab === "submit"
                ? "bg-teal-700 text-white shadow-md"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
            }`}
          >
            <Send className="w-4 h-4" />
            <span>{isHindi ? "नई बाधा रिपोर्ट दर्ज करें" : "Submit Barrier Report"}</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("verified")}
            className={`flex-1 py-3 px-4 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-2 ${
              activeTab === "verified"
                ? "bg-teal-700 text-white shadow-md"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>
              {isHindi
                ? `सत्यापित सामुदायिक रिपोर्टें (${verifiedCount})`
                : `Verified Community Reports (${verifiedCount})`}
            </span>
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === "submit" ? (
          <div className="space-y-6">
            <ReportBarrierForm
              onSuccess={(id) => {
                // Keep on success view or auto-refresh
              }}
            />
          </div>
        ) : (
          <div className="space-y-6">
            {/* Demo Notice Banner */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-100 text-amber-900 text-xs font-bold border border-amber-300">
                <ShieldAlert className="w-3.5 h-3.5 text-amber-800" aria-hidden="true" />
                <span>
                  {isHindi
                    ? "प्रदर्शनात्मक डेमो डेटा — वास्तविक दानापुर सर्वेक्षण निष्कर्ष नहीं।"
                    : "Illustrative demo data — not actual Danapur survey findings."}
                </span>
              </div>
            </div>

            <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 text-xs text-emerald-900 flex items-start gap-3">
              <ShieldCheck className="w-5 h-5 shrink-0 text-emerald-700 mt-0.5" />
              <p className="leading-relaxed">
                {isHindi
                  ? "नीचे दी गई रिपोर्टें स्थानीय नागरिकों, छात्रों व अभिभावकों द्वारा दर्ज की गई हैं तथा शोधकर्ता द्वारा भौतिक निरीक्षण या विद्यालय आंकड़ों से सत्यापित की जा चुकी हैं।"
                  : "The reports below were submitted by local community members, parents, and students, and have been physically verified or cross-referenced against school data by the researcher."}
              </p>
            </div>
            <VerifiedBarriersList reports={reports} />
          </div>
        )}

        {/* Academic Research Disclaimer */}
        <div className="p-4 rounded-2xl bg-slate-100 border border-slate-200 text-center text-xs text-slate-500">
          <p>
            {isHindi
              ? "अभिगम्यता बाधा रिपोर्टिंग प्रणाली एनसीपीईडीपी फेलोशिप के अंतर्गत दानापुर, पटना क्षेत्र के विद्यालयों में समावेशी शिक्षा को बढ़ावा देने के उद्देश्य से संचालित एक स्वतंत्र शैक्षणिक पहल है।"
              : "This accessibility barrier reporting system is an independent research initiative under the NCPEDP Fellowship, advancing inclusive education across schools in Danapur, Patna."}
          </p>
        </div>
      </div>
    </div>
  );
}
