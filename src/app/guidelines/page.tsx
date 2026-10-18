"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";
import { GUIDELINES_DATA, GuidelineItem } from "@/data/guidelinesData";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import {
  BookOpen,
  Award,
  ExternalLink,
  ArrowRight,
  Search,
  FileText,
  ShieldCheck,
  CheckCircle2,
  Bookmark,
} from "lucide-react";

export default function GuidelinesPage() {
  const { locale, t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState("");

  const primaryGuideline = GUIDELINES_DATA.find((g) => g.isPrimaryReference);
  const otherGuidelines = GUIDELINES_DATA.filter((g) => !g.isPrimaryReference);

  const filteredGuidelines = otherGuidelines.filter((g) => {
    const title = locale === "hi" ? g.title_hi : g.title_en;
    const summary = locale === "hi" ? g.shortSummary_hi : g.shortSummary_en;
    const q = searchQuery.toLowerCase();
    return title.toLowerCase().includes(q) || summary.toLowerCase().includes(q);
  });

  return (
    <div className="flex flex-col w-full py-10 px-4 sm:px-8 max-w-7xl mx-auto space-y-12">
      {/* Header Banner */}
      <div className="space-y-4 max-w-3xl">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-100 text-teal-900 text-xs font-bold border border-teal-300">
          <Bookmark className="w-3.5 h-3.5 text-teal-700" aria-hidden="true" />
          <span>Section 4 • PRD Laws, Policies & Guidelines Library</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-navy-800 tracking-tight font-hindi">
          {t("guidelines.title", "Laws, Policies & Accessibility Guidelines")}
        </h1>
        <p className="text-base sm:text-xl text-slate-600 leading-relaxed">
          {t(
            "guidelines.subtitle",
            "Clear, accessible explanations of legal frameworks, building standards, and education policies governing inclusive schools."
          )}
        </p>
      </div>

      {/* Visually Prominent Technical Reference: Accessibility Code 2024 */}
      {primaryGuideline && (
        <section aria-labelledby="primary-reference-heading">
          <div className="relative rounded-2xl bg-gradient-to-br from-navy-900 via-navy-800 to-teal-950 text-white p-6 sm:p-10 border-4 border-amber-500 shadow-xl overflow-hidden">
            <div className="relative z-10 space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <Badge variant="primary_reference" className="text-sm px-3.5 py-1">
                  ⭐ {t("guidelines.primaryReferenceBadge", "Primary Technical Reference")}
                </Badge>
                <span className="text-xs text-amber-300 font-semibold uppercase tracking-wider bg-black/40 px-3 py-1 rounded-full border border-amber-500/30">
                  {primaryGuideline.officialOrg} • {primaryGuideline.year}
                </span>
              </div>

              <div className="space-y-3">
                <h2
                  id="primary-reference-heading"
                  className="text-2xl sm:text-4xl font-extrabold text-white leading-tight font-hindi"
                >
                  {locale === "hi"
                    ? primaryGuideline.title_hi
                    : primaryGuideline.title_en}
                </h2>
                <p className="text-base sm:text-lg text-teal-100 max-w-4xl leading-relaxed">
                  {locale === "hi"
                    ? primaryGuideline.shortSummary_hi
                    : primaryGuideline.shortSummary_en}
                </p>
              </div>

              <div className="p-4 sm:p-6 rounded-xl bg-white/10 backdrop-blur-xs border border-white/20 text-slate-100 text-sm sm:text-base leading-relaxed">
                <p>
                  {locale === "hi"
                    ? primaryGuideline.easyExplanation_hi
                    : primaryGuideline.easyExplanation_en}
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-4 pt-2">
                <Link href={`/guidelines/${primaryGuideline.slug}`}>
                  <Button
                    variant="accent"
                    size="lg"
                    className="font-bold text-white shadow-md bg-amber-600 hover:bg-amber-500 border-amber-400"
                    rightIcon={<ArrowRight className="w-5 h-5" />}
                  >
                    {locale === "hi" ? "पूर्ण प्रावधान एवं चेकलिस्ट देखें" : "View Full Provisions & Checklist"}
                  </Button>
                </Link>

                <a
                  href={primaryGuideline.officialUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-md bg-white/10 hover:bg-white/20 text-white font-semibold text-base border border-white/30 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-400 min-h-[48px]"
                >
                  <span>{t("guidelines.viewDocument", "View Official Source")}</span>
                  <ExternalLink className="w-4 h-4" aria-hidden="true" />
                  <span className="sr-only">({t("common.externalLink", "Opens in new tab")})</span>
                </a>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Important Official Sources Block (PRD Section 7) */}
      <section
        className="rounded-xl bg-teal-50/70 border border-teal-200 p-6 sm:p-8 space-y-6"
        aria-labelledby="official-sources-heading"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-teal-200/60 pb-4">
          <div>
            <h2
              id="official-sources-heading"
              className="text-xl sm:text-2xl font-bold text-teal-950"
            >
              🏛️ {t("guidelines.officialSourcesTitle", "Important Official Sources")}
            </h2>
            <p className="text-sm text-teal-900/80 mt-1">
              {t(
                "guidelines.officialSourcesDesc",
                "Authoritative primary sources and standards documents published by the Government of India and UNICEF."
              )}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {[
            {
              id: 1,
              title:
                locale === "hi"
                  ? "शैक्षणिक संस्थानों के लिए अभिगम्यता कोड (PDF)"
                  : "Accessibility Code for Educational Institutions (PDF)",
              org:
                locale === "hi"
                  ? "शिक्षा मंत्रालय, भारत सरकार (जनवरी 2024)"
                  : "Ministry of Education, Govt. of India (January 2024)",
              url: "https://www.education.gov.in",
            },
            {
              id: 2,
              title:
                locale === "hi"
                  ? "मानक एवं दिशानिर्देश लाइब्रेरी"
                  : "Standards & Guidelines Library",
              org:
                locale === "hi"
                  ? "दिव्यांगजन सशक्तिकरण विभाग (DEPwD)"
                  : "Department of Empowerment of Persons with Disabilities",
              url: "https://disabilityaffairs.gov.in",
            },
            {
              id: 3,
              title:
                locale === "hi"
                  ? "दिव्यांग बच्चों के लिए स्कूलों को सुगम बनाना"
                  : "Making Schools Accessible to Children with Disabilities",
              org: locale === "hi" ? "यूनिसेफ इंडिया (UNICEF India)" : "UNICEF India",
              url: "https://www.unicef.org/india",
            },
          ].map((source) => (
            <div
              key={source.id}
              className="bg-white p-5 rounded-lg border border-teal-200 shadow-xs flex flex-col justify-between space-y-4 hover:border-teal-600 transition-colors"
            >
              <div className="space-y-1.5">
                <span className="text-xs font-semibold text-teal-700 bg-teal-100/60 px-2 py-0.5 rounded">
                  {t("common.officialSource", "Official Source")}
                </span>
                <h3 className="text-base font-bold text-navy-900 leading-snug">
                  {source.title}
                </h3>
                <p className="text-xs text-slate-600">{source.org}</p>
              </div>

              <a
                href={source.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-sm font-bold text-teal-700 hover:text-teal-900 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-600 rounded p-1"
              >
                <span>{locale === "hi" ? "दस्तावेज़ खोलें" : "Open Document"}</span>
                <ExternalLink className="w-4 h-4" aria-hidden="true" />
                <span className="sr-only">({t("common.externalLink", "Opens in new tab")})</span>
              </a>
            </div>
          ))}
        </div>
      </section>

      {/* Guidelines Search & Grid */}
      <section className="space-y-6" aria-labelledby="guidelines-list-heading">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2
              id="guidelines-list-heading"
              className="text-2xl font-bold text-navy-800"
            >
              {locale === "hi" ? "सभी प्रमुख अधिनियम एवं नीतियां (9 दिशानिर्देश)" : "All Statutory Acts & Policies (9 Guidelines)"}
            </h2>
            <p className="text-sm text-slate-600">
              {locale === "hi"
                ? "कानूनी प्रावधान, आसान हिन्दी व्याख्या, संबंधित धाराएं और स्कूल ऑडिट चेकलिस्ट।"
                : "Legal provisions, easy explanations, related clauses, and school audit checklists."}
            </p>
          </div>

          <div className="w-full sm:w-72">
            <Input
              label={locale === "hi" ? "दिशानिर्देश खोजें" : "Search guidelines"}
              hideLabel
              placeholder={locale === "hi" ? "शीर्षक या विषय खोजें..." : "Search by title or topic..."}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-10 text-sm"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredGuidelines.map((item) => (
            <Card
              key={item.id}
              as="article"
              variant="interactive"
              className="flex flex-col justify-between h-full border-slate-200 hover:border-teal-600 shadow-xs hover:shadow-md transition-all"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs text-slate-500">
                  <span className="font-semibold text-teal-700 bg-teal-50 px-2 py-0.5 rounded border border-teal-100">
                    {item.year}
                  </span>
                  <span className="truncate max-w-[150px]">{item.officialOrg}</span>
                </div>

                <CardTitle as="h3" className="text-lg leading-snug">
                  {locale === "hi" ? item.title_hi : item.title_en}
                </CardTitle>

                <p className="text-sm text-slate-600 leading-relaxed">
                  {locale === "hi" ? item.shortSummary_hi : item.shortSummary_en}
                </p>
              </div>

              <div className="pt-6 mt-4 border-t border-slate-100 flex items-center justify-between">
                <Link
                  href={`/guidelines/${item.slug}`}
                  className="inline-flex items-center gap-1.5 text-sm font-bold text-teal-700 hover:text-teal-900 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-600 rounded p-1"
                >
                  <span>{locale === "hi" ? "व्याख्या व चेकलिस्ट" : "Read & Checklist"}</span>
                  <ArrowRight className="w-4 h-4" aria-hidden="true" />
                </Link>

                <a
                  href={item.officialUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-slate-500 hover:text-navy-900 inline-flex items-center gap-1 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-teal-600 p-1 rounded"
                >
                  <span>{locale === "hi" ? "आधिकारिक पोर्टल" : "Official Link"}</span>
                  <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" />
                  <span className="sr-only">({t("common.externalLink", "Opens in new tab")})</span>
                </a>
              </div>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}
