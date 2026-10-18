"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";
import { VISUAL_GUIDE_TOPICS, VisualGuideTopic } from "@/data/visualGuideData";
import { VisualDiagramRenderer } from "@/components/visual-guide/ArchitecturalDiagrams";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";

export default function LearnAccessibilityPage() {
  const { locale } = useLanguage();
  const isHi = locale === "hi";

  const [activeTopicId, setActiveTopicId] = useState<string>(VISUAL_GUIDE_TOPICS[0].id);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const topicParam =
        params.get("topic") || params.get("tab") || window.location.hash.replace("#", "");
      if (topicParam) {
        const found = VISUAL_GUIDE_TOPICS.find(
          (t) =>
            t.id === topicParam ||
            t.slug === topicParam ||
            t.diagramType === topicParam ||
            topicParam.includes(t.diagramType)
        );
        if (found) {
          setActiveTopicId(found.id);
        }
      }
    }
  }, []);

  const activeTopic = VISUAL_GUIDE_TOPICS.find((t) => t.id === activeTopicId) || VISUAL_GUIDE_TOPICS[0];

  return (
    <div className="min-h-screen bg-background py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-10">
        {/* Header Breadcrumb & Title */}
        <header className="space-y-4">
          <nav aria-label="Breadcrumb" className="text-sm text-muted-foreground flex items-center gap-2">
            <Link href="/" className="hover:text-primary transition-colors focus-ring rounded">
              {isHi ? "मुख्य पृष्ठ" : "Home"}
            </Link>
            <span>/</span>
            <span className="text-foreground font-medium" aria-current="page">
              {isHi ? "सुगम्यता सीखें — विजुअल गाइड" : "Learn Accessibility — Visual Guide"}
            </span>
          </nav>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-border pb-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold mb-3">
                <span className="h-2 w-2 rounded-full bg-primary" />
                {isHi ? "चित्रात्मक स्थापत्य मार्गदर्शिका" : "Illustrated Architectural Standards"}
              </div>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-foreground tracking-tight">
                {isHi ? "सुगम्यता सीखें — विजुअल गाइड" : "Learn Accessibility — Visual Guide"}
              </h1>
              <p className="mt-2 text-base sm:text-lg text-muted-foreground max-w-3xl">
                {isHi
                  ? "विद्यालय परिसरों को दिव्यांग विद्यार्थियों के लिए वास्तव में बाधारहित बनाने हेतु आधिकारिक तकनीकी मानकों, सरल हिंदी व्याख्या और स्थापत्य रेखाचित्रों का संग्रह।"
                  : "Architectural schematics, clear statutory standard references, and easy explanations to make school campuses universally accessible for students with disabilities."}
              </p>
            </div>

            <div className="flex items-center gap-3">
              <Link href="/resources">
                <Button variant="outline" size="sm" className="gap-2">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  {isHi ? "ऑडिट फॉर्मेट डाउनलोड करें" : "Download Audit Format"}
                </Button>
              </Link>
            </div>
          </div>
        </header>

        {/* Feature Selector Tabs */}
        <div className="bg-card border border-border rounded-xl p-2 shadow-sm">
          <div
            role="tablist"
            aria-label={isHi ? "सुगम्यता विषय चयन" : "Accessibility topic tabs"}
            className="grid grid-cols-2 lg:grid-cols-4 gap-2"
          >
            {VISUAL_GUIDE_TOPICS.map((topic) => {
              const isSelected = topic.id === activeTopicId;
              return (
                <button
                  key={topic.id}
                  role="tab"
                  id={`tab-${topic.id}`}
                  aria-selected={isSelected}
                  aria-controls={`panel-${topic.id}`}
                  tabIndex={isSelected ? 0 : -1}
                  onClick={() => setActiveTopicId(topic.id)}
                  className={`flex flex-col text-left p-3 sm:p-4 rounded-lg transition-all focus-ring ${
                    isSelected
                      ? "bg-primary text-primary-foreground shadow-md font-semibold"
                      : "bg-muted/40 hover:bg-muted text-foreground"
                  }`}
                >
                  <span className="text-xs uppercase tracking-wider opacity-80">
                    {topic.diagramType === "ramp" && (isHi ? "ढलान एवं रेलिंग" : "Slope & Rails")}
                    {topic.diagramType === "toilet" && (isHi ? "स्वच्छता व पहुंच" : "Hygiene & Access")}
                    {topic.diagramType === "tactile" && (isHi ? "दृष्टिबाधित मार्गदर्शन" : "Vision Guide")}
                    {topic.diagramType === "classroom" && (isHi ? "बैठक व्यवस्था" : "Seating & Space")}
                  </span>
                  <span className="text-sm sm:text-base font-bold mt-1">
                    {isHi ? topic.title_hi : topic.title_en}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Active Topic Content Panel */}
        <section
          role="tabpanel"
          id={`panel-${activeTopic.id}`}
          aria-labelledby={`tab-${activeTopic.id}`}
          className="space-y-10"
        >
          {/* Top Banner: Official Standard Citation */}
          <div className="bg-amber-500/10 border-l-4 border-amber-500 rounded-r-xl p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Badge variant="primary_reference">
                  {isHi ? "वैधानिक तकनीकी संदर्भ" : "Official Standard Reference"}
                </Badge>
                <span className="text-xs font-mono font-medium text-amber-900 dark:text-amber-200">
                  {activeTopic.officialStandardClause}
                </span>
              </div>
              <h2 className="text-lg font-bold text-foreground">
                {activeTopic.officialStandard}
              </h2>
              <p className="text-xs text-muted-foreground">
                {isHi
                  ? "सभी मान भारत सरकार के शिक्षा मंत्रालय (MoE) एवं आवासन और शहरी कार्य मंत्रालय (MoHUA) के आधिकारिक कोड से प्रमाणित हैं।"
                  : "All specifications are strictly verified from the official Gazette codes of MoE and MoHUA, Govt. of India."}
              </p>
            </div>
            <Link
              href="/guidelines"
              className="inline-flex items-center text-xs font-semibold text-primary hover:underline shrink-0"
            >
              {isHi ? "दिशानिर्देश देखें →" : "View Guidelines →"}
            </Link>
          </div>

          {/* Core Visual Diagram Section (Image-Led Impeccable Craft) */}
          <div className="space-y-4">
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <h2 className="text-xl sm:text-2xl font-bold text-foreground">
                1. Architectural Diagram & Key Dimensions
              </h2>
              <span className="text-xs text-muted-foreground">
                {isHi ? "स्थापत्य रेखाचित्र एवं मानक आयाम (MoE & MoHUA Standards)" : "Accessible School Infrastructure Standards"}
              </span>
            </div>

            <VisualDiagramRenderer
              type={activeTopic.diagramType}
              altText={isHi ? activeTopic.altText_hi : activeTopic.altText_en}
            />
          </div>

          {/* Easy Explanation Block */}
          <div className="bg-card border border-border rounded-xl p-6 sm:p-8 space-y-4 shadow-sm">
            <div className="flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-600 font-bold">
                ✓
              </span>
              <h2 className="text-xl font-bold text-foreground">
                {isHi ? "2. सरल शब्दों में समझें (Easy Explanation)" : "2. Easy Explanation for School Stakeholders"}
              </h2>
            </div>

            <p className="text-base sm:text-lg leading-relaxed text-foreground">
              {isHi ? activeTopic.easyExplanation_hi : activeTopic.easyExplanation_en}
            </p>

            <div className="p-4 rounded-lg bg-muted/60 border border-border/80">
              <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">
                {isHi ? "अंग्रेजी अनुवाद / English Context" : "Hindi Summary / मुख्य बिंदु"}
              </h3>
              <p className="text-sm text-muted-foreground italic">
                {isHi ? activeTopic.easyExplanation_en : activeTopic.easyExplanation_hi}
              </p>
            </div>
          </div>

          {/* Key Specifications Table */}
          <div className="space-y-4">
            <h2 className="text-xl sm:text-2xl font-bold text-foreground">
              {isHi ? "3. प्रमुख तकनीकी विनिर्देश (Mandatory Technical Values)" : "3. Key Technical Specifications"}
            </h2>
            <div className="overflow-x-auto rounded-xl border border-border bg-card shadow-sm">
              <table className="w-full text-left text-sm">
                <caption className="sr-only">
                  {isHi ? `${activeTopic.title_hi} के अनिवार्य तकनीकी मानक` : `Mandatory technical standards for ${activeTopic.title_en}`}
                </caption>
                <thead className="bg-muted text-muted-foreground font-semibold border-b border-border">
                  <tr>
                    <th scope="col" className="p-3 sm:p-4">{isHi ? "पैरामीटर / घटक" : "Parameter"}</th>
                    <th scope="col" className="p-3 sm:p-4">{isHi ? "मानक मान (Standard Threshold)" : "Mandatory Standard"}</th>
                    <th scope="col" className="p-3 sm:p-4">{isHi ? "वैधानिक संदर्भ धारा" : "Clause / Document"}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {activeTopic.keySpecs.map((spec, idx) => (
                    <tr key={idx} className="hover:bg-muted/40 transition-colors">
                      <td className="p-3 sm:p-4 font-medium text-foreground">
                        {isHi ? spec.parameter_hi : spec.parameter_en}
                      </td>
                      <td className="p-3 sm:p-4 font-mono font-semibold text-primary">
                        {spec.standardValue}
                      </td>
                      <td className="p-3 sm:p-4 text-xs font-mono text-muted-foreground">
                        {spec.sourceClause}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Side-by-side Do's and Don'ts (Impeccable Visual Pattern) */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl sm:text-2xl font-bold text-foreground">
                {isHi ? "4. सही बनाम गलत: व्यावहारिक तुलना (Do's vs Don'ts)" : "4. Practical Field Comparison: Do's vs Don'ts"}
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {activeTopic.comparisons.map((comp, idx) => (
                <div key={idx} className="rounded-xl border border-border overflow-hidden bg-card shadow-sm flex flex-col">
                  {/* Correct side */}
                  <div className="bg-emerald-500/10 border-b border-emerald-500/20 p-4 space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-emerald-600 text-white text-xs font-bold">
                        ✓
                      </span>
                      <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-300">
                        {isHi ? "सही मानक पद्धति (Correct Standard)" : "Compliant Practice"}
                      </span>
                    </div>
                    <p className="text-sm font-semibold text-foreground pt-1">
                      {isHi ? comp.correct_hi : comp.correct_en}
                    </p>
                  </div>

                  {/* Incorrect side */}
                  <div className="bg-rose-500/10 border-b border-rose-500/20 p-4 space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-rose-600 text-white text-xs font-bold">
                        ✕
                      </span>
                      <span className="text-xs font-bold uppercase tracking-wider text-rose-800 dark:text-rose-300">
                        {isHi ? "सामान्य त्रुटि / विसंगति (Common Hazard)" : "Deficiency / Hazard"}
                      </span>
                    </div>
                    <p className="text-sm font-medium text-foreground pt-1">
                      {isHi ? comp.incorrect_hi : comp.incorrect_en}
                    </p>
                  </div>

                  {/* Engineering & Accessibility Rationale */}
                  <div className="p-4 bg-muted/40 text-xs text-muted-foreground flex-1 flex flex-col justify-end">
                    <span className="font-semibold text-foreground mb-1">
                      {isHi ? "वैज्ञानिक व सुरक्षा कारण:" : "Accessibility Rationale:"}
                    </span>
                    <p>{isHi ? comp.reason_hi : comp.reason_en}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* School Audit Quick Checklist */}
          <div className="bg-card border border-border rounded-xl p-6 sm:p-8 space-y-6 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-4">
              <div>
                <h2 className="text-xl font-bold text-foreground">
                  {isHi ? "5. फील्ड ऑडिट चेकलिस्ट (School Inspection Checklist)" : "5. Field Audit Checklist"}
                </h2>
                <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                  {isHi
                    ? "विद्यालय निरीक्षण के समय इन बिंदुओं की जांच अवश्य करें:"
                    : "Key verifiable indicators to verify during on-site school accessibility inspections:"}
                </p>
              </div>

              <Link href="/resources">
                <Button variant="secondary" size="sm">
                  {isHi ? "पूर्ण चेकलिस्ट शीट (PDF)" : "Download Checklist Sheet"}
                </Button>
              </Link>
            </div>

            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3" role="list">
              {(isHi ? activeTopic.auditChecklist_hi : activeTopic.auditChecklist_en).map((item, index) => (
                <li
                  key={index}
                  className="flex items-start gap-3 p-3 rounded-lg bg-muted/50 border border-border/60 text-sm"
                >
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md bg-primary/20 text-primary text-xs font-bold">
                    {index + 1}
                  </span>
                  <span className="text-foreground">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Footer Navigation / CTA */}
        <section className="bg-primary/5 border border-primary/20 rounded-2xl p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2">
            <h2 className="text-xl font-bold text-foreground">
              {isHi ? "समावेशी शिक्षा के अन्य आयामों को जानें" : "Explore More Pillars of Inclusive Education"}
            </h2>
            <p className="text-sm text-muted-foreground max-w-xl">
              {isHi
                ? "भौतिक बुनियादी ढांचे के साथ-साथ विशेष शिक्षक, उचित समायोजन और सहायक तकनीकों की भूमिका भी उतनी ही महत्वपूर्ण है।"
                : "Beyond physical accessibility, learn about reasonable accommodation, special educators, and assistive technology for children with special needs."}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <Link href="/inclusive-education">
              <Button size="md">
                {isHi ? "समावेशी शिक्षा हब →" : "Inclusive Education Hub →"}
              </Button>
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
