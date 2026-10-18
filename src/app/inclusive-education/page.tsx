"use client";

import React, { useState, useEffect, useTransition } from "react";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";
import { INCLUSIVE_EDUCATION_TOPICS, InclusiveEducationTopic } from "@/data/inclusiveEducationData";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";

export default function InclusiveEducationPage() {
  const { locale } = useLanguage();
  const isHi = locale === "hi";

  const [topics, setTopics] = useState<InclusiveEducationTopic[]>(INCLUSIVE_EDUCATION_TOPICS);
  const [selectedTopicId, setSelectedTopicId] = useState<string>(INCLUSIVE_EDUCATION_TOPICS[0].id);
  const [isLoading, setIsLoading] = useState(false);
  const [isPending, startTransition] = useTransition();

  // Fetch customizable topics from Firestore if present
  useEffect(() => {
    let cancelled = false;
    async function loadTopics() {
      try {
        const { db } = await import("@/lib/firebase/firestore");
        if (!db || cancelled) return;
        const { collection, getDocs } = await import("firebase/firestore");
        const colRef = collection(db, "inclusiveEducation");
        const snap = await getDocs(colRef);
        if (!snap.empty && !cancelled) {
          const list: InclusiveEducationTopic[] = [];
          snap.forEach((docSnap) => {
            list.push({ id: docSnap.id, ...docSnap.data() } as InclusiveEducationTopic);
          });
          setTopics(list);
          setSelectedTopicId(list[0]?.id || INCLUSIVE_EDUCATION_TOPICS[0].id);
        }
      } catch (err) {
        console.warn("Using seeded inclusive education topics:", err);
      }
    }
    loadTopics();
    return () => {
      cancelled = true;
    };
  }, []);

  const activeTopic = topics.find((t) => t.id === selectedTopicId) || topics[0];

  return (
    <div className="min-h-screen bg-background py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-10">
        {/* Navigation Breadcrumb */}
        <header className="space-y-4">
          <nav aria-label="Breadcrumb" className="text-sm text-muted-foreground flex items-center gap-2">
            <Link href="/" className="hover:text-primary transition-colors focus-ring rounded">
              {isHi ? "मुख्य पृष्ठ" : "Home"}
            </Link>
            <span>/</span>
            <span className="text-foreground font-medium" aria-current="page">
              {isHi ? "समावेशी शिक्षा हब" : "Inclusive Education Hub"}
            </span>
          </nav>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-border pb-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 text-xs font-semibold mb-3">
                <span className="h-2 w-2 rounded-full bg-emerald-500" />
                {isHi ? "समान अवसर • बाधारहित अध्ययन" : "Equal Opportunity • Zero Rejection"}
              </div>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-foreground tracking-tight">
                {isHi ? "समावेशी शिक्षा हब (Inclusive Education Hub)" : "Inclusive Education Hub"}
              </h1>
              <p className="mt-2 text-base sm:text-lg text-muted-foreground max-w-3xl">
                {isHi
                  ? "विद्यालयों में दिव्यांग बच्चों के पूर्ण समावेशन के 5 मुख्य स्तंभ — अवधारणा, उचित समायोजन (Reasonable Accommodation), विशेष शिक्षक, सुगम शिक्षण सामग्री और सहायक तकनीक।"
                  : "The 5 core pillars of inclusive education — foundations, reasonable accommodation, special educators, accessible learning materials, and assistive technology."}
              </p>
            </div>

            <div className="flex items-center gap-3">
              <Link href="/learn-accessibility">
                <Button variant="outline" size="sm" className="gap-2">
                  <svg className="w-4 h-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  {isHi ? "विजुअल गाइड देखें →" : "View Visual Guide →"}
                </Button>
              </Link>
            </div>
          </div>
        </header>

        {/* 5 Pillars Quick Navigation Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {topics.map((item, index) => {
            const isSelected = item.id === selectedTopicId;
            return (
              <button
                key={item.id}
                onClick={() => startTransition(() => setSelectedTopicId(item.id))}
                className={`p-4 rounded-xl border text-left transition-colors duration-150 flex flex-col justify-between focus-ring ${
                  isSelected
                    ? "border-primary bg-primary/10 shadow-sm"
                    : "border-border bg-card hover:bg-muted/50"
                }`}
              >
                <div>
                  <span className="text-xs font-mono font-bold text-muted-foreground">
                    0{index + 1}
                  </span>
                  <h2 className="text-sm sm:text-base font-bold text-foreground mt-1 line-clamp-2">
                    {isHi ? item.title_hi : item.title_en}
                  </h2>
                </div>
                <div className="mt-3 pt-2 border-t border-border/50 text-xs text-muted-foreground flex items-center justify-between">
                  <span className="truncate">{item.slug}</span>
                  <span className={`text-xs ${isSelected ? "text-primary font-bold" : "text-muted-foreground"}`}>
                    {isSelected ? "●" : "→"}
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Active Pillar Full Deep Dive Card */}
        {activeTopic && (
          <article className="space-y-8 bg-card border border-border rounded-2xl p-6 sm:p-10 shadow-sm">
            {/* Topic Header & Citation */}
            <div className="space-y-3 border-b border-border pb-6">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-primary bg-primary/10 px-3 py-1 rounded-full">
                  {isHi ? "स्तंभ विवरण (Pillar Overview)" : "Core Pillar Breakdown"}
                </span>

                <div className="flex items-center gap-2">
                  <Badge variant="primary_reference">
                    {activeTopic.officialReference}
                  </Badge>
                </div>
              </div>

              <h2 className="text-2xl sm:text-3xl font-extrabold text-foreground">
                {isHi ? activeTopic.title_hi : activeTopic.title_en}
              </h2>
              <p className="text-base sm:text-lg font-medium text-primary">
                {isHi ? activeTopic.tagline_hi : activeTopic.tagline_en}
              </p>
            </div>

            {/* Core Explanation & Summary */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-6">
                <div>
                  <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-2">
                    {isHi ? "विस्तृत विवरण (In-Depth Context)" : "Detailed Pedagogical & Legal Context"}
                  </h3>
                  <p className="text-base sm:text-lg leading-relaxed text-foreground whitespace-pre-line">
                    {isHi ? activeTopic.detailedContent_hi : activeTopic.detailedContent_en}
                  </p>
                </div>

                {/* Key Legal / Policy Provisions */}
                <div className="space-y-3 pt-4">
                  <h3 className="text-base font-bold text-foreground flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-emerald-500" />
                    {isHi ? "प्रमुख वैधानिक एवं नीतिगत प्रावधान" : "Statutory & Policy Entitlements"}
                  </h3>
                  <div className="space-y-2">
                    {(isHi ? activeTopic.keyProvisions_hi : activeTopic.keyProvisions_en).map((prov, i) => (
                      <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-muted/40 border border-border/60 text-sm">
                        <span className="font-mono text-xs font-bold text-primary mt-0.5">
                          §{i + 1}
                        </span>
                        <span className="text-foreground">{prov}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action Steps for Schools Sidebar */}
              <div className="space-y-6">
                <div className="bg-muted/40 border border-border rounded-xl p-5 space-y-4">
                  <div className="flex items-center gap-2">
                    <span className="flex h-6 w-6 items-center justify-center rounded bg-primary text-primary-foreground text-xs font-bold">
                      !
                    </span>
                    <h3 className="text-base font-bold text-foreground">
                      {isHi ? "स्कूल व SMC हेतु कार्ययोजना" : "Actionable Steps for Schools & SMC"}
                    </h3>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {isHi
                      ? "विद्यालय प्रबंधन समिति और प्रधानाध्यापकों द्वारा उठाए जाने वाले ठोस कदम:"
                      : "Immediate practical actions for headmasters and School Management Committees:"}
                  </p>
                  <ul className="space-y-2.5" role="list">
                    {(isHi ? activeTopic.actionSteps_hi : activeTopic.actionSteps_en).map((step, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-xs sm:text-sm text-foreground">
                        <span className="text-primary font-bold">✓</span>
                        <span>{step}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Official Reference Link Box */}
                <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-4 space-y-2 text-xs">
                  <span className="font-bold text-amber-900 dark:text-amber-200 uppercase tracking-wider">
                    {isHi ? "आधिकारिक स्रोत" : "Official Authority Source"}
                  </span>
                  <p className="text-foreground font-medium">
                    {activeTopic.officialReference}
                  </p>
                  {activeTopic.officialReferenceUrl && (
                    <a
                      href={activeTopic.officialReferenceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-primary hover:underline font-semibold pt-1"
                    >
                      {isHi ? "मंत्रालय पोर्टल पर देखें ↗" : "Official Portal Link ↗"}
                    </a>
                  )}
                </div>
              </div>
            </div>

            {/* Bilingual Reference Toggle */}
            <div className="border-t border-border pt-6 mt-8">
              <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">
                {isHi ? "द्विभाषी सारांश (English Summary)" : "द्विभाषी सारांश (Hindi Summary)"}
              </h3>
              <p className="text-sm text-muted-foreground italic leading-relaxed">
                {isHi ? activeTopic.summary_en : activeTopic.summary_hi}
              </p>
            </div>
          </article>
        )}

        {/* Bottom Banner to Guidelines & Resources */}
        <section className="bg-card border border-border rounded-2xl p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2">
            <h2 className="text-xl font-bold text-foreground">
              {isHi ? "संसाधन व डाउनलोड केंद्र में उपयोगी सामग्री देखें" : "Explore Helpful Materials in Resource Centre"}
            </h2>
            <p className="text-sm text-muted-foreground max-w-xl">
              {isHi
                ? "समावेशी शिक्षा, आरटीआई आवेदन प्रारूप, विद्यालय ऑडिट चेकलिस्ट और जागरूकता पोस्टर निःशुल्क डाउनलोड करें।"
                : "Download RTI templates, school audit formats, awareness posters, and statutory checklists for free."}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <Link href="/resources">
              <Button size="md">
                {isHi ? "डाउनलोड केंद्र पर जाएं →" : "Go to Resource Centre →"}
              </Button>
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
