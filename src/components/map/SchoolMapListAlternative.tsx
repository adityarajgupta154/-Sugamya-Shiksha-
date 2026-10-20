"use client";

import React from "react";
import Link from "next/link";
import { SchoolItem } from "@/data/schoolsData";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import {
  Building2,
  MapPin,
  Calendar,
  Hash,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Globe,
  ExternalLink,
} from "lucide-react";

interface SchoolMapListAlternativeProps {
  schools: SchoolItem[];
  isHindi: boolean;
  onSelectOnMap?: (school: SchoolItem) => void;
}

export function SchoolMapListAlternative({
  schools,
  isHindi,
  onSelectOnMap,
}: SchoolMapListAlternativeProps) {
  if (schools.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-slate-200 p-8 text-center space-y-3">
        <Building2 className="w-10 h-10 text-slate-300 mx-auto" aria-hidden="true" />
        <h3 className="text-base font-bold text-navy-800">
          {isHindi ? "कोई विद्यालय रिकॉर्ड नहीं मिला" : "No Schools Found"}
        </h3>
        <p className="text-xs text-slate-500">
          {isHindi
            ? "कृपया अपने फ़िल्टर मानदंड बदलकर पुनः प्रयास करें।"
            : "Try adjusting your search query or filters."}
        </p>
      </div>
    );
  }

  return (
    <div
      className="space-y-4"
      role="region"
      aria-label={
        isHindi
          ? "मानचित्र का सुलभ सूची विकल्प — पटना विद्यालय"
          : "Accessible List Alternative to Map — Patna Schools"
      }
    >
      <div className="flex items-center justify-between text-xs text-slate-500 pb-1 border-b border-slate-200">
        <span className="font-semibold text-navy-900">
          {isHindi
            ? `कीबोर्ड-सुलभ विद्यालय सूची (${schools.length} विद्यालय)`
            : `Keyboard-Accessible School List (${schools.length} Schools)`}
        </span>
        <span className="italic">
          {isHindi ? "स्क्रीन रीडर हेतु अनुकूलित" : "Optimized for screen readers"}
        </span>
      </div>

      <div className="space-y-3">
        {schools.map((school) => {
          const schoolName = isHindi ? school.name_hi : school.name_en;
          const schoolAddress = isHindi ? school.address_hi : school.address_en;

          // Non-colour status indicator
          const isAudited = school.auditStatus === "audited";
          const isFollowUp = school.auditStatus === "follow_up_required";
          const isPending = school.auditStatus === "pending";

          const facilitiesList = [
            { key: "ramp", label: isHindi ? "रैंप" : "Ramp", val: school.facilities.ramp },
            { key: "toilet", label: isHindi ? "शौचालय" : "CwSN Toilet", val: school.facilities.toilet },
            { key: "drinkingWater", label: isHindi ? "पेयजल" : "Drinking Water", val: school.facilities.drinkingWater },
            { key: "wideDoors", label: isHindi ? "चौड़े द्वार" : "Wide Doors", val: school.facilities.wideDoors },
            { key: "tactilePath", label: isHindi ? "स्पर्शनीय पाथवे" : "Tactile Path", val: school.facilities.tactilePath },
            { key: "emergencyExit", label: isHindi ? "आपात निकास" : "Emergency Exit", val: school.facilities.emergencyExit },
          ];

          return (
            <article
              key={school.id}
              className="bg-white rounded-xl border border-slate-200 p-4 sm:p-5 shadow-xs hover:border-teal-600 transition-all space-y-4"
              aria-labelledby={`school-title-${school.id}`}
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                <div className="space-y-1.5 flex-1">
                  {/* Status & Type Badges (Icon + Shape + Text) */}
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge variant={school.type === "government" ? "government" : "private"}>
                      {school.type === "government"
                        ? isHindi
                          ? "सरकारी"
                          : "Government"
                        : isHindi
                        ? "निजी"
                        : "Private"}
                    </Badge>

                    {/* Non-colour-only status badge */}
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold border ${
                        isAudited
                          ? "bg-emerald-50 text-emerald-800 border-emerald-300"
                          : isFollowUp
                          ? "bg-amber-50 text-amber-800 border-amber-300"
                          : "bg-slate-50 text-slate-800 border-slate-300"
                      }`}
                    >
                      <span aria-hidden="true">
                        {isAudited ? "✓" : isFollowUp ? "▲" : "⏳"}
                      </span>
                      <span>
                        {isAudited
                          ? isHindi
                            ? "सत्यापित (Audited)"
                            : "Audited"
                          : isFollowUp
                          ? isHindi
                            ? "पुनः निरीक्षण (Follow-up)"
                            : "Follow-up Required"
                          : isHindi
                          ? "प्रतीक्षित (Pending)"
                          : "Pending"}
                      </span>
                    </span>

                    {school.udiseCode && (
                      <span className="text-[11px] font-mono text-slate-400 bg-slate-50 px-2 py-0.5 rounded border border-slate-100">
                        UDISE: {school.udiseCode}
                      </span>
                    )}
                  </div>

                  <h3
                    id={`school-title-${school.id}`}
                    className="text-base sm:text-lg font-bold text-navy-900 leading-snug font-hindi pt-0.5"
                  >
                    {schoolName}
                  </h3>

                  <p className="text-xs text-slate-600 flex items-start gap-1.5 leading-relaxed">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" aria-hidden="true" />
                    <span>{schoolAddress}</span>
                  </p>
                </div>

                {/* Score Column */}
                <div className="sm:text-right shrink-0">
                  <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider block">
                    {isHindi ? "शोध स्कोर" : "Research Score"}
                  </span>
                  {isPending ? (
                    <span className="text-xs font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200 inline-block mt-1">
                      {isHindi ? "मूल्यांकन प्रतीक्षित" : "Pending Audit"}
                    </span>
                  ) : (
                    <div>
                      <div className="flex items-baseline sm:justify-end gap-1 mt-0.5">
                        <span className="text-2xl font-black text-navy-900 tabular-nums">
                          {school.score}
                        </span>
                        <span className="text-xs text-slate-400 font-bold">/100 pts</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Verified Facilities Checklist */}
              <div className="pt-2 border-t border-slate-100">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block mb-1.5">
                  {isHindi ? "सुविधा उपलब्धता (भौतिक निरीक्षण)" : "Verified Facility Indicators:"}
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 text-xs">
                  {facilitiesList.map((f) => (
                    <div
                      key={f.key}
                      className={`flex items-center gap-1.5 p-2 rounded-lg border text-xs font-medium ${
                        f.val
                          ? "bg-emerald-50/60 text-emerald-900 border-emerald-200"
                          : "bg-slate-50 text-slate-400 border-slate-200 line-through"
                      }`}
                    >
                      <span aria-hidden="true" className="font-bold">
                        {f.val ? "✓" : "✕"}
                      </span>
                      <span className="truncate">{f.label}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons & Coordinates */}
              <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs">
                <div className="text-slate-500 font-mono text-[11px] flex items-center gap-2">
                  <span>
                    GPS: {school.geo.lat.toFixed(4)}, {school.geo.lng.toFixed(4)}
                  </span>
                  {onSelectOnMap && (
                    <button
                      onClick={() => onSelectOnMap(school)}
                      className="text-teal-700 hover:text-teal-900 underline font-semibold cursor-pointer"
                    >
                      {isHindi ? "मानचित्र पर दिखाएं" : "Show on Map"}
                    </button>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <Link href={`/schools/${school.id}`}>
                    <Button
                      variant="secondary"
                      size="sm"
                      rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
                      className="text-xs font-bold"
                    >
                      {isHindi ? "पूर्ण ऑडिट प्रोफ़ाइल देखें" : "View Audit Profile"}
                    </Button>
                  </Link>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}
