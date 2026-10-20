"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";
import { DEMO_DOWNLOADABLE_REPORTS, DownloadableReport } from "@/data/trackerData";
import {
  FileText,
  Download,
  Search,
  Filter,
  Calendar,
  Layers,
  Sparkles,
  ShieldCheck,
  Building,
  HardDrive,
  CheckCircle2,
  ExternalLink,
  BookOpen,
  ArrowRight,
  AlertCircle,
} from "lucide-react";
import { clsx } from "clsx";

const REPORT_TYPE_LABELS_HI: Record<string, string> = {
  all: "सभी रिपोर्ट्स",
  school_audit: "विद्यालय ऑडिट रिपोर्ट्स",
  research_interim: "अंतरिम शोध प्रतिवेदन",
  smc_guide: "SMC सुगम्यता मार्गदर्शिका",
  standards_summary: "मानक संदर्भ तालिका",
};

const REPORT_TYPE_LABELS_EN: Record<string, string> = {
  all: "All Reports",
  school_audit: "School Audit Reports",
  research_interim: "Interim Research Reports",
  smc_guide: "SMC Rectification Guides",
  standards_summary: "Standards Matrix",
};

export default function ReportsPage() {
  const { locale } = useLanguage();
  const isHi = locale === "hi";

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState<string>("all");
  const [reports, setReports] = useState<DownloadableReport[]>(DEMO_DOWNLOADABLE_REPORTS);
  const [downloadSuccessModal, setDownloadSuccessModal] = useState<DownloadableReport | null>(null);

  const typeLabels = isHi ? REPORT_TYPE_LABELS_HI : REPORT_TYPE_LABELS_EN;

  // Filter reports
  const filteredReports = reports.filter((rep) => {
    const matchesType = selectedType === "all" || rep.reportType === selectedType;
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      !q ||
      rep.title_hi.toLowerCase().includes(q) ||
      rep.title_en.toLowerCase().includes(q) ||
      rep.description_hi.toLowerCase().includes(q) ||
      rep.description_en.toLowerCase().includes(q);
    return matchesType && matchesSearch;
  });

  const handleDownload = (report: DownloadableReport) => {
    // Increment download counter locally
    setReports((prev) =>
      prev.map((r) =>
        r.id === report.id ? { ...r, downloadCount: r.downloadCount + 1 } : r
      )
    );
    // Open feedback modal or initiate mock download
    setDownloadSuccessModal(report);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      {/* Hero Header */}
      <section className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold bg-teal-100 text-teal-900 border border-teal-300">
          <FileText className="w-3.5 h-3.5 text-teal-700" aria-hidden="true" />
          <span>{isHi ? "शोध प्रलेखन केंद्र" : "Research Publications Hub"}</span>
        </div>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-navy-950 tracking-tight">
          {isHi
            ? "डाउनलोड करने योग्य शोध एवं ऑडिट रिपोर्ट्स"
            : "Downloadable Research & School Audit Reports"}
        </h1>
        <p className="text-base sm:text-lg text-slate-600 leading-relaxed font-normal">
          {isHi
            ? "पटना के विद्यालयों में किए गए भौतिक सुगम्यता ऑडिट के आधिकारिक निष्कर्ष, शोध प्रतिवेदन, स्कूल प्रबंधन समितियों (SMC) के लिए कम लागत वाली मार्गदर्शिका और वैधानिक अनुपालन तालिकाएं।"
            : "Official quantitative audit logs, interim fellowship monographs, low-cost architectural manuals for School Management Committees, and national compliance matrices."}
        </p>

        {/* Academic Fellowship Badge */}
        <div className="inline-flex items-center gap-2 p-3 rounded-xl bg-slate-100 border border-slate-200 text-xs text-slate-700 font-medium text-left">
          <ShieldCheck className="w-4 h-4 text-teal-700 shrink-0" aria-hidden="true" />
          <span>
            {isHi
              ? "सुगम्य शिक्षा बिहार शोध परियोजना के अंतर्गत प्रकाशित आधिकारिक अध्ययन सामग्री।"
              : "Published under the Sugamya Shiksha Bihar Research Project on School Infrastructure Accessibility."}
          </span>
        </div>
      </section>

      {/* Search and Filters Bar */}
      <section
        aria-label={isHi ? "रिपोर्ट्स खोज एवं फ़िल्टर" : "Reports Search & Filter"}
        className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4"
      >
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" aria-hidden="true" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={
                isHi
                  ? "शीर्षक, विद्यालय या विषय द्वारा खोजें (जैसे: दानापुर, रैंप, SMC)..."
                  : "Search reports by title, school name, or keyword..."
              }
              className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-800 placeholder-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-600 focus-visible:bg-white"
            />
          </div>

          {/* Type Filter Buttons */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0" role="tablist" aria-label={isHi ? "रिपोर्ट प्रकार" : "Report Type"}>
            {Object.entries(typeLabels).map(([typeKey, typeLabel]) => {
              const count =
                typeKey === "all"
                  ? reports.length
                  : reports.filter((r) => r.reportType === typeKey).length;
              return (
                <button
                  key={typeKey}
                  type="button"
                  onClick={() => setSelectedType(typeKey)}
                  className={clsx(
                    "px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-600",
                    selectedType === typeKey
                      ? "bg-navy-900 text-white shadow-xs"
                      : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                  )}
                >
                  {typeLabel} ({count})
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Reports Listing Grid */}
      <main id="main-content">
        {filteredReports.length === 0 ? (
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-12 text-center">
            <Layers className="w-12 h-12 text-slate-400 mx-auto mb-3" aria-hidden="true" />
            <h3 className="text-lg font-bold text-slate-800">
              {isHi ? "कोई रिपोर्ट नहीं मिली" : "No Reports Found"}
            </h3>
            <p className="text-sm text-slate-600 mt-1">
              {isHi
                ? "कृपया अपनी खोज शब्दावली बदलें अथवा फ़िल्टर रीसेट करें।"
                : "Please adjust your search keywords or clear your category filter."}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredReports.map((report) => (
              <article
                key={report.id}
                className="bg-white rounded-2xl border border-slate-200 p-6 md:p-8 flex flex-col justify-between space-y-6 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="space-y-4">
                  {/* Top Meta Badges */}
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <span className="px-3 py-1 rounded-md text-xs font-bold uppercase tracking-wider bg-teal-100 text-teal-800">
                      {typeLabels[report.reportType] || report.reportType}
                    </span>
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold bg-slate-100 text-slate-700 border border-slate-200">
                      <HardDrive className="w-3.5 h-3.5 text-slate-500" aria-hidden="true" />
                      <span>{report.fileFormat} • {report.fileSize}</span>
                    </span>
                  </div>

                  {/* Title & Description */}
                  <div>
                    <h2 className="text-xl font-bold text-navy-900 leading-snug tracking-tight">
                      {isHi ? report.title_hi : report.title_en}
                    </h2>
                    <p className="text-sm text-slate-600 leading-relaxed mt-2">
                      {isHi ? report.description_hi : report.description_en}
                    </p>
                  </div>
                </div>

                {/* Card Footer: Metadata & Download CTA */}
                <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-4 text-xs text-slate-500">
                    <span className="flex items-center gap-1 font-medium">
                      <Calendar className="w-3.5 h-3.5" aria-hidden="true" />
                      {report.publishedDate}
                    </span>
                    <span className="flex items-center gap-1 font-medium">
                      <Download className="w-3.5 h-3.5 text-teal-600" aria-hidden="true" />
                      <span>{report.downloadCount} {isHi ? "डाउनलोड" : "downloads"}</span>
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleDownload(report)}
                    className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-teal-700 hover:bg-teal-600 text-white text-xs font-bold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-400"
                  >
                    <Download className="w-4 h-4" aria-hidden="true" />
                    <span>{isHi ? "रिपोर्ट डाउनलोड करें (PDF)" : "Download Report (PDF)"}</span>
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </main>

      {/* Download Success / Notice Modal */}
      {downloadSuccessModal && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={isHi ? "डाउनलोड सफल" : "Download Initiated"}
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4"
          onClick={() => setDownloadSuccessModal(null)}
        >
          <div
            className="bg-white rounded-2xl max-w-lg w-full p-6 md:p-8 space-y-6 shadow-2xl border border-slate-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-7 h-7" aria-hidden="true" />
            </div>

            <div className="text-center space-y-2">
              <h3 className="text-xl font-bold text-navy-900">
                {isHi ? "डाउनलोड प्रारंभ किया गया" : "Report Download Initiated"}
              </h3>
              <p className="text-sm font-semibold text-teal-800">
                {isHi ? downloadSuccessModal.title_hi : downloadSuccessModal.title_en}
              </p>
              <p className="text-xs text-slate-500">
                {isHi
                  ? "प्रारूप: PDF • आकार: " + downloadSuccessModal.fileSize + " • एनसीपीईडीपी फेलोशिप शोध प्रकाशन"
                  : "Format: PDF • Size: " + downloadSuccessModal.fileSize + " • NCPEDP Fellowship Research Publication"}
              </p>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-xs text-slate-600 leading-relaxed space-y-2">
              <p className="font-semibold text-slate-800">
                {isHi ? "शोध उपयोग हेतु निर्देश:" : "Academic & Research Usage Note:"}
              </p>
              <p>
                {isHi
                  ? "यह प्रतिवेदन शैक्षणिक एवं नीतिगत सुधार के उद्देश्य से तैयार किया गया है। किसी भी शोध उद्धरण में 'Sugamya Shiksha Bihar / NCPEDP Fellowship (Danapur School Study)' का उल्लेख अवश्य करें।"
                  : "This report is generated for academic, administrative, and policy advocacy. Please cite as 'Sugamya Shiksha Bihar / NCPEDP Fellowship Danapur Study 2026'."}
              </p>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setDownloadSuccessModal(null)}
                className="w-full px-4 py-2.5 rounded-xl bg-navy-900 text-white font-bold text-xs hover:bg-navy-800 transition-colors"
              >
                {isHi ? "सम्पन्न (Done)" : "Close"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
