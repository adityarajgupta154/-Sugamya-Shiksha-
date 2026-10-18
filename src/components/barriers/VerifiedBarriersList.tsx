"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";
import { BarrierReportItem, BARRIER_CATEGORIES } from "@/data/barrierReportsData";
import { BarrierCategory } from "@/lib/barrierReportValidation";
import {
  ShieldCheck,
  MapPin,
  Calendar,
  ExternalLink,
  Filter,
  Eye,
  AlertTriangle,
  Building2,
  X,
} from "lucide-react";

interface VerifiedBarriersListProps {
  reports: BarrierReportItem[];
}

export function VerifiedBarriersList({ reports }: VerifiedBarriersListProps) {
  const { locale } = useLanguage();
  const isHindi = locale === "hi";

  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [activePhoto, setActivePhoto] = useState<string | null>(null);

  // Filter only verified reports
  const verifiedReports = reports.filter((r) => r.status === "verified");

  const filtered = verifiedReports.filter((r) => {
    if (selectedCategory !== "all" && r.category !== selectedCategory) {
      return false;
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Category Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        <button
          type="button"
          onClick={() => setSelectedCategory("all")}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 ${
            selectedCategory === "all"
              ? "bg-navy-900 text-white shadow-md"
              : "bg-slate-100 hover:bg-slate-200 text-slate-700"
          }`}
        >
          {isHindi ? `सभी श्रेणियां (${verifiedReports.length})` : `All Categories (${verifiedReports.length})`}
        </button>

        {BARRIER_CATEGORIES.map((cat) => {
          const count = verifiedReports.filter((r) => r.category === cat.id).length;
          if (count === 0) return null;
          const isSelected = selectedCategory === cat.id;

          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shrink-0 ${
                isSelected
                  ? "bg-teal-700 text-white shadow-md"
                  : "bg-slate-100 hover:bg-slate-200 text-slate-700"
              }`}
            >
              <span>{cat.icon}</span>
              <span>{isHindi ? cat.label_hi : cat.label_en}</span>
              <span className="opacity-70 text-[10px]">({count})</span>
            </button>
          );
        })}
      </div>

      {/* Reports Grid */}
      {filtered.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-3xl border border-slate-200 shadow-sm space-y-3">
          <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-slate-400">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <p className="text-sm font-bold text-slate-700">
            {isHindi ? "इस श्रेणी में कोई सत्यापित रिपोर्ट नहीं है।" : "No verified reports in this category."}
          </p>
          <p className="text-xs text-slate-500">
            {isHindi
              ? "यदि आपने इस विद्यालय में कोई बाधा देखी है, तो ऊपर दिए गए फॉर्म से रिपोर्ट दर्ज करें।"
              : "If you observed physical barriers at a school, submit a report using the form above."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filtered.map((report) => {
            const catMeta = BARRIER_CATEGORIES.find((c) => c.id === report.category);

            return (
              <article
                key={report.id}
                className="bg-white rounded-3xl p-6 border border-slate-200 shadow-md hover:shadow-lg transition-all flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  {/* Top Badges */}
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-teal-50 text-teal-900 border border-teal-200">
                      <span>{catMeta?.icon}</span>
                      <span>{isHindi ? catMeta?.label_hi : catMeta?.label_en}</span>
                    </span>

                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      <span>{isHindi ? "सत्यापित रिपोर्ट" : "Verified Barrier"}</span>
                    </span>
                  </div>

                  {/* School Title */}
                  <div>
                    <h3 className="text-base font-black text-navy-900 leading-snug">
                      {report.schoolName}
                    </h3>
                    <div className="flex items-center gap-3 text-xs text-slate-500 pt-1">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" />
                        <span>{new Date(report.createdAt).toLocaleDateString()}</span>
                      </span>
                      {report.schoolId && (
                        <Link
                          href={`/schools/${report.schoolId}`}
                          className="text-teal-700 hover:underline font-bold flex items-center gap-1"
                        >
                          <Building2 className="w-3.5 h-3.5" />
                          <span>{isHindi ? "विद्यालय प्रोफ़ाइल" : "School Profile"}</span>
                          <ExternalLink className="w-3 h-3" />
                        </Link>
                      )}
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-sm text-slate-700 leading-relaxed font-hindi bg-slate-50/80 p-3.5 rounded-2xl border border-slate-100">
                    {report.description}
                  </p>

                  {/* Evidence Photos */}
                  {report.photos && report.photos.length > 0 && (
                    <div className="space-y-1.5 pt-1">
                      <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                        {isHindi ? "प्रमाण चित्र:" : "Evidence Photos:"}
                      </span>
                      <div className="flex gap-2">
                        {report.photos.map((p, pIdx) => (
                          <button
                            key={pIdx}
                            type="button"
                            onClick={() => setActivePhoto(p.url)}
                            className="w-16 h-16 rounded-xl overflow-hidden border border-slate-200 hover:ring-2 hover:ring-teal-600 transition-all cursor-pointer shrink-0"
                          >
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={p.url} alt={p.name} className="w-full h-full object-cover" />
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Admin Note if available */}
                  {report.adminNotes && (
                    <div className="p-3 rounded-xl bg-amber-50/70 border border-amber-200 text-xs text-amber-950 space-y-1">
                      <span className="font-bold block">
                        {isHindi ? "शोधकर्ता अवलोकन / कार्यवाही:" : "Researcher Observation / Action:"}
                      </span>
                      <p className="text-amber-900 leading-relaxed">{report.adminNotes}</p>
                    </div>
                  )}
                </div>

                {/* Footer disclaimer */}
                <div className="pt-2 border-t border-slate-100 text-[10px] text-slate-400 italic">
                  {isHindi
                    ? "रिपोर्टर की व्यक्तिगत जानकारी गोपनीयता नीति के तहत सुरक्षित रखी गई है।"
                    : "Reporter contact identity kept strictly confidential per research ethics."}
                </div>
              </article>
            );
          })}
        </div>
      )}

      {/* Lightbox Modal */}
      {activePhoto && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in"
          onClick={() => setActivePhoto(null)}
        >
          <div
            className="relative max-w-3xl max-h-[90vh] bg-black rounded-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setActivePhoto(null)}
              aria-label="Close photo"
              className="absolute top-3 right-3 p-2 rounded-full bg-white/20 hover:bg-white/40 text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={activePhoto} alt="Barrier evidence" className="max-w-full max-h-[85vh] object-contain" />
          </div>
        </div>
      )}
    </div>
  );
}
