"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";
import { DEMO_TRACKER_ENTRIES, TrackerEntry } from "@/data/trackerData";
import { BeforeAfterTracker } from "@/components/tracker/BeforeAfterTracker";
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  ShieldAlert,
  Building,
  HelpCircle,
  FileCheck2,
  HeartHandshake,
} from "lucide-react";

export default function TrackerPage() {
  const { locale } = useLanguage();
  const isHi = locale === "hi";

  const [entries, setEntries] = useState<TrackerEntry[]>(DEMO_TRACKER_ENTRIES);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let cancelled = false;
    async function loadTrackerEntries() {
      try {
        setLoading(true);
        const { db } = await import("@/lib/firebase/firestore");
        if (!db || cancelled) {
          setLoading(false);
          return;
        }
        const { collection, query, where, getDocs, limit } = await import("firebase/firestore");
        // Only load verified entries for public presentation per PRD 6.2-E
        const q = query(
          collection(db, "trackerEntries"),
          where("verificationStatus", "==", "verified"),
          limit(50)
        );
        const snapshot = await getDocs(q);
        if (!snapshot.empty && !cancelled) {
          const loaded: TrackerEntry[] = [];
          snapshot.forEach((docSnap) => {
            loaded.push({ id: docSnap.id, ...docSnap.data() } as TrackerEntry);
          });
          setEntries(loaded);
        }
      } catch (err) {
        console.warn("Using demo tracker entries due to offline/firestore access:", err);
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadTrackerEntries();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-3.5 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-8 sm:space-y-12 min-w-0 max-w-full">
      {/* Hero Section */}
      <section className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold bg-teal-100 text-teal-900 border border-teal-300">
          <Sparkles className="w-3.5 h-3.5 text-teal-700" aria-hidden="true" />
          <span>{isHi ? "सुधार ट्रैकर" : "Accessibility Improvement Tracker"}</span>
        </div>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-navy-950 tracking-tight">
          {isHi
            ? "पहले और बाद: सुगम्यता सुधार ट्रैकर"
            : "Before & After: Accessibility Impact Tracker"}
        </h1>
        <p className="text-base sm:text-lg text-slate-600 leading-relaxed font-normal">
          {isHi
            ? "दानापुर के विद्यालयों में ऑन-साइट ऑडिट के दौरान पाई गई भौतिक बाधाएं, वैधानिक मानकों के आधार पर दिए गए सुझाव और विद्यालय प्रबंधन समिति (SMC) द्वारा किए गए वास्तविक सुधारों का सचित्र प्रमाण।"
            : "Transparent documentation of school infrastructure barriers identified during field audits, recommendations delivered under national standards, and verified transformations achieved on the ground."}
        </p>

        {/* Demo Notice Banner */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-100 text-amber-900 text-xs font-bold border border-amber-300">
            <ShieldAlert className="w-3.5 h-3.5 text-amber-800" aria-hidden="true" />
            <span>
              {isHi
                ? "प्रदर्शनात्मक डेमो डेटा — वास्तविक दानापुर सर्वेक्षण निष्कर्ष नहीं।"
                : "Illustrative demo data — not actual Danapur survey findings."}
            </span>
          </div>
        </div>

        {/* Academic Notice Pill */}
        <div className="inline-flex items-center gap-2 p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 font-medium text-left">
          <ShieldAlert className="w-4 h-4 text-amber-700 shrink-0" aria-hidden="true" />
          <span>
            {isHi
              ? "गोपनीयता एवं शुद्धता गारंटी: केवल शोध दल द्वारा मौके पर सत्यापित और प्रमाणित प्रविष्टियां ही सार्वजनिक प्रदर्शित की जाती हैं।"
              : "Verification Guarantee: Only on-site verified entries reviewed by the fellowship team are publicly visible."}
          </span>
        </div>
      </section>

      {/* Main Tracker Component */}
      <main id="main-content">
        <BeforeAfterTracker entries={entries} />
      </main>

      {/* Action / Callout Grid */}
      <section aria-labelledby="tracker-action-heading" className="pt-6">
        <h2 id="tracker-action-heading" className="sr-only">
          {isHi ? "संबंधित कार्यवाहियां" : "Related Actions"}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Card 1: Report Barrier */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 md:p-8 flex flex-col justify-between space-y-4 shadow-xs">
            <div className="space-y-2">
              <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center">
                <ShieldAlert className="w-5 h-5" aria-hidden="true" />
              </div>
              <h3 className="text-xl font-bold text-navy-900">
                {isHi ? "क्या आपके विद्यालय में कोई बाधा है?" : "Encountered a Barrier at Your School?"}
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                {isHi
                  ? "यदि दानापुर के किसी विद्यालय में रैंप, शौचालय या प्रवेश द्वार में सुगम्यता की कमी है, तो फोटो सहित बाधा रिपोर्ट दर्ज करें। शोध दल द्वारा निरीक्षण कर सुधार हेतु पहल की जाएगी।"
                  : "Submit an accessibility barrier report with photos. Our research team reviews submissions, verifies them on-site, and advocates for SMC rectification."}
              </p>
            </div>
            <Link
              href="/report-barrier"
              className="inline-flex items-center gap-2 text-teal-700 hover:text-teal-800 font-bold text-sm group"
            >
              <span>{isHi ? "बाधा रिपोर्ट दर्ज करें" : "Report an Accessibility Barrier"}</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
            </Link>
          </div>

          {/* Card 2: View School Directory */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 md:p-8 flex flex-col justify-between space-y-4 shadow-xs">
            <div className="space-y-2">
              <div className="w-10 h-10 rounded-xl bg-teal-100 text-teal-800 flex items-center justify-center">
                <Building className="w-5 h-5" aria-hidden="true" />
              </div>
              <h3 className="text-xl font-bold text-navy-900">
                {isHi ? "विद्यालय सुगम्यता स्कोरकार्ड देखें" : "Explore School Scorecards"}
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                {isHi
                  ? "दानापुर के सरकारी एवं निजी विद्यालयों के 100-बिंदु सुगम्यता स्कोर, 4 स्तंभों का भार एवं ऑडिट निष्कर्षों की विस्तृत डायरेक्टरी देखें।"
                  : "Inspect 100-point accessibility ratings, facility audits, and compliance breakdowns across all surveyed Danapur schools."}
              </p>
            </div>
            <Link
              href="/schools"
              className="inline-flex items-center gap-2 text-teal-700 hover:text-teal-800 font-bold text-sm group"
            >
              <span>{isHi ? "विद्यालय डायरेक्टरी देखें" : "View School Directory"}</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
