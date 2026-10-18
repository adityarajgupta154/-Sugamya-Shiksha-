"use client";

import React, { useState, useEffect, useTransition, useMemo } from "react";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";
import {
  ResourceItem,
  ResourceCategory,
  RESOURCE_CATEGORIES,
  INITIAL_RESOURCES,
} from "@/data/resourcesData";
import {
  ResearchUpdate,
  INITIAL_RESEARCH_UPDATES,
} from "@/data/researchUpdatesData";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

export default function ResourcesPage() {
  const { locale } = useLanguage();
  const isHi = locale === "hi";

  const [activeTab, setActiveTab] = useState<"resources" | "research">("resources");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [resources, setResources] = useState<ResourceItem[]>(INITIAL_RESOURCES);
  const [researchUpdates, setResearchUpdates] = useState<ResearchUpdate[]>(INITIAL_RESEARCH_UPDATES);
  const [downloadNotice, setDownloadNotice] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  // Load resources from Firestore if available
  useEffect(() => {
    let cancelled = false;
    async function loadData() {
      try {
        const { db } = await import("@/lib/firebase/firestore");
        if (!db || cancelled) return;
        const { collection, getDocs, query, limit } = await import("firebase/firestore");
        const [resSnap, reportSnap] = await Promise.all([
          getDocs(query(collection(db, "resources"), limit(50))),
          getDocs(query(collection(db, "researchReports"), limit(50)))
        ]);

        if (!resSnap.empty && !cancelled) {
          const list: ResourceItem[] = [];
          resSnap.forEach((d) => {
            list.push({ id: d.id, ...d.data() } as ResourceItem);
          });
          setResources(list);
        }

        if (!reportSnap.empty && !cancelled) {
          const reports: ResearchUpdate[] = [];
          reportSnap.forEach((d) => {
            reports.push({ id: d.id, ...d.data() } as ResearchUpdate);
          });
          setResearchUpdates(reports);
        }
      } catch (err) {
        console.warn("Using seeded resources and research updates:", err);
      }
    }
    loadData();
    return () => {
      cancelled = true;
    };
  }, []);

  // Filter resources
  const filteredResources = useMemo(() => {
    return resources.filter((item) => {
      if (!item.published) return false;
      const matchesCategory =
        selectedCategory === "all" || item.category === selectedCategory;
      const query = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !query ||
        item.title_hi.toLowerCase().includes(query) ||
        item.title_en.toLowerCase().includes(query) ||
        item.description_hi.toLowerCase().includes(query) ||
        item.description_en.toLowerCase().includes(query) ||
        item.sourceOrg_hi.toLowerCase().includes(query) ||
        item.sourceOrg_en.toLowerCase().includes(query);
      return matchesCategory && matchesSearch;
    });
  }, [resources, selectedCategory, searchQuery]);

  // Handle Download Click
  const handleDownload = async (resource: ResourceItem) => {
    setDownloadNotice(
      isHi
        ? `"${resource.title_hi}" डाउनलोड प्रारंभ हो रहा है...`
        : `Starting download for "${resource.title_en}"...`
    );

    // Optimistic download count increment
    setResources((prev) =>
      prev.map((r) =>
        r.id === resource.id ? { ...r, downloadCount: (r.downloadCount || 0) + 1 } : r
      )
    );

    try {
      if (resource.id && !resource.id.startsWith("res-")) {
        const { db } = await import("@/lib/firebase/firestore");
        if (db) {
          const { doc, updateDoc, increment } = await import("firebase/firestore");
          const docRef = doc(db, "resources", resource.id);
          await updateDoc(docRef, { downloadCount: increment(1) });
        }
      }
    } catch (e) {
      // Ignore background analytics error
    }

    // Direct download trigger or link open
    if (resource.fileUrl && resource.fileUrl !== "#") {
      window.open(resource.fileUrl, "_blank", "noopener,noreferrer");
    } else {
      // For placeholder items create an instant text document download
      const content = `SUGAMYA SHIKSHA BIHAR — OFFICIAL RESOURCE REPOSITORY\n\nTitle (Hindi): ${resource.title_hi}\nTitle (English): ${resource.title_en}\nCategory: ${resource.category}\nSource: ${resource.sourceOrg_en}\nLast Updated: ${resource.updatedAt}\n\n[Official Gazette Document / Form Placeholder]\nFor official verification, visit the Ministry of Education (MoE) or DEPwD portal.`;
      const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${resource.id}.txt`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }

    setTimeout(() => setDownloadNotice(null), 4000);
  };

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
              {isHi ? "संसाधन व डाउनलोड केंद्र" : "Resource & Download Centre"}
            </span>
          </nav>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-border pb-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold mb-3">
                <span className="h-2 w-2 rounded-full bg-primary" />
                {isHi ? "निःशुल्क संसाधन एवं शोध प्रपत्र" : "Open Educational Repository"}
              </div>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-foreground tracking-tight">
                {isHi ? "संसाधन व डाउनलोड केंद्र" : "Resource & Download Centre"}
              </h1>
              <p className="mt-2 text-base sm:text-lg text-muted-foreground max-w-3xl">
                {isHi
                  ? "विद्यालय सुगम्यता ऑडिट प्रारूप, आरटीआई आवेदन टेम्प्लेट, आधिकारिक दिशानिर्देश (PDF), जागरूकता पोस्टर और दानापुर फेलोशिप शोध अपडेट।"
                  : "Free school accessibility audit formats, RTI application templates, official statutory guidelines (PDF), awareness posters, and fellowship research updates."}
              </p>
            </div>

            {/* View Switcher: Resources vs Research Updates */}
            <div className="flex items-center p-1 bg-muted rounded-xl border border-border">
              <button
                onClick={() => startTransition(() => setActiveTab("resources"))}
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors duration-150 focus-ring ${
                  activeTab === "resources"
                    ? "bg-card text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {isHi ? "संसाधन एवं प्रपत्र" : "All Resources"} ({resources.filter(r => r.published).length})
              </button>
              <button
                onClick={() => startTransition(() => setActiveTab("research"))}
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors duration-150 focus-ring ${
                  activeTab === "research"
                    ? "bg-card text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {isHi ? "शोध अपडेट" : "Research Updates"} ({researchUpdates.filter(r => r.published).length})
              </button>
            </div>
          </div>
        </header>

        {/* Live Status Toast for Downloads */}
        {downloadNotice && (
          <div
            role="status"
            aria-live="polite"
            className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-800 dark:text-emerald-300 text-sm font-medium flex items-center justify-between"
          >
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
              <span>{downloadNotice}</span>
            </div>
            <button
              onClick={() => setDownloadNotice(null)}
              className="text-xs font-semibold hover:underline"
            >
              ✕
            </button>
          </div>
        )}

        {/* Tab 1: General Resources Listing */}
        {activeTab === "resources" && (
          <section className="space-y-8" aria-label={isHi ? "संसाधन सूची" : "Resource items list"}>
            {/* Search and Category Filters */}
            <div className="space-y-4 bg-card border border-border rounded-xl p-4 sm:p-6 shadow-sm">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <Input
                    label={isHi ? "संसाधन खोजें" : "Search resources"}
                    id="resource-search"
                    placeholder={
                      isHi
                        ? "शीर्षक, विषय या संगठन द्वारा खोजें..."
                        : "Search by title, topic, or issuing organization..."
                    }
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                {searchQuery && (
                  <div className="sm:self-end">
                    <Button variant="ghost" size="sm" onClick={() => setSearchQuery("")}>
                      {isHi ? "हटाएं" : "Clear"}
                    </Button>
                  </div>
                )}
              </div>

              {/* 6 PRD Category Chips */}
              <div className="pt-2">
                <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground block mb-2">
                  {isHi ? "श्रेणी अनुसार फ़िल्टर करें:" : "Filter by Category:"}
                </span>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => setSelectedCategory("all")}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors focus-ring ${
                      selectedCategory === "all"
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground hover:bg-muted/80"
                    }`}
                  >
                    {isHi ? "सभी श्रेणियां" : "All Categories"}
                  </button>

                  {RESOURCE_CATEGORIES.map((cat) => {
                    const isSelected = selectedCategory === cat.id;
                    const count = resources.filter(
                      (r) => r.published && r.category === cat.id
                    ).length;
                    return (
                      <button
                        key={cat.id}
                        onClick={() => setSelectedCategory(cat.id)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 focus-ring ${
                          isSelected
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted text-muted-foreground hover:bg-muted/80"
                        }`}
                      >
                        <span>{isHi ? cat.label_hi : cat.label_en}</span>
                        <span className="opacity-70 text-[10px]">({count})</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Results Counter */}
            <div className="flex items-center justify-between text-xs text-muted-foreground px-1">
              <span>
                {isHi
                  ? `कुल ${filteredResources.length} संसाधन उपलब्ध`
                  : `Showing ${filteredResources.length} resources`}
              </span>
              <span>
                {isHi ? "सार्वजनिक उपयोग हेतु निःशुल्क" : "Free for public use & dissemination"}
              </span>
            </div>

            {/* Resources Grid */}
            {filteredResources.length === 0 ? (
              <div className="text-center py-16 bg-card border border-border rounded-xl space-y-3">
                <p className="text-muted-foreground">
                  {isHi ? "कोई संसाधन नहीं मिला।" : "No resources found matching your search."}
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedCategory("all");
                  }}
                >
                  {isHi ? "फ़िल्टर रीसेट करें" : "Reset Filters"}
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 cv-auto">
                {filteredResources.map((item) => (
                  <article
                    key={item.id}
                    className="bg-card border border-border rounded-xl p-6 shadow-sm hover:shadow-md transition-[border-color,box-shadow] duration-150 flex flex-col justify-between"
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between gap-2">
                        <Badge variant="default">
                          {RESOURCE_CATEGORIES.find((c) => c.id === item.category)?.label_en ||
                            item.category}
                        </Badge>
                        <div className="flex items-center gap-1.5 text-xs font-mono text-muted-foreground">
                          <span className="font-semibold text-primary px-1.5 py-0.5 rounded bg-primary/10">
                            {item.fileType}
                          </span>
                          <span>{item.fileSize}</span>
                        </div>
                      </div>

                      <h2 className="text-lg font-bold text-foreground hover:text-primary transition-colors">
                        {isHi ? item.title_hi : item.title_en}
                      </h2>

                      <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3">
                        {isHi ? item.description_hi : item.description_en}
                      </p>

                      <div className="text-xs text-muted-foreground pt-1 flex items-center justify-between">
                        <span>
                          {isHi ? "स्रोत:" : "Source:"}{" "}
                          <strong className="text-foreground">
                            {isHi ? item.sourceOrg_hi : item.sourceOrg_en}
                          </strong>
                        </span>
                        <span>{item.updatedAt}</span>
                      </div>
                    </div>

                    <div className="mt-6 pt-4 border-t border-border flex items-center justify-between gap-3">
                      <span className="text-xs text-muted-foreground font-mono">
                        {item.downloadCount || 0} {isHi ? "डाउनलोड" : "downloads"}
                      </span>

                      <Button
                        size="sm"
                        onClick={() => handleDownload(item)}
                        className="gap-2"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                        </svg>
                        {isHi ? "डाउनलोड करें" : "Download File"}
                      </Button>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </section>
        )}

        {/* Tab 2: Research Updates Listing */}
        {activeTab === "research" && (
          <section className="space-y-8" aria-label={isHi ? "शोध अपडेट सूची" : "Fellowship research updates list"}>
            <div className="bg-primary/5 border border-primary/20 rounded-xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-bold text-foreground">
                  {isHi ? "दानापुर फेलोशिप शोध टिप्पणियां एवं वर्किंग पेपर्स" : "Danapur Fellowship Research Notes & Working Papers"}
                </h2>
                <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                  {isHi
                    ? "एनसीपीईडीपी फेलोशिप के अंतर्गत दानापुर के विद्यालयों के स्थल निरीक्षण से प्राप्त प्राथमिक शोध निष्कर्ष।"
                    : "Interim qualitative & quantitative field findings from school visits conducted under the NCPEDP Fellowship."}
                </p>
              </div>
              <Badge variant="default">
                {isHi ? "फील्ड रिसर्च डेटा" : "Field Research"}
              </Badge>
            </div>

            <div className="space-y-6">
              {researchUpdates.map((update) => (
                <article
                  key={update.id}
                  className="bg-card border border-border rounded-xl p-6 sm:p-8 shadow-sm space-y-4"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border pb-3">
                    <div className="flex items-center gap-2">
                      <Badge variant="default">
                        {isHi ? update.category_hi : update.category}
                      </Badge>
                      <span className="text-xs font-mono text-muted-foreground">
                        {update.date}
                      </span>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      📍 {update.location}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-foreground">
                    {isHi ? update.title_hi : update.title_en}
                  </h3>

                  <p className="text-sm sm:text-base text-foreground leading-relaxed">
                    {isHi ? update.summary_hi : update.summary_en}
                  </p>

                  <div className="p-4 rounded-lg bg-muted/50 border border-border/70 space-y-2">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                      {isHi ? "मुख्य निष्कर्ष एवं टिप्पणियां:" : "Key Field Findings & Observations:"}
                    </h4>
                    <ul className="space-y-1.5" role="list">
                      {(isHi ? update.keyFindings_hi : update.keyFindings_en).map((finding, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-xs sm:text-sm text-foreground">
                          <span className="text-primary font-bold">▪</span>
                          <span>{finding}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="pt-2 flex flex-wrap items-center justify-between gap-4 text-xs text-muted-foreground">
                    <div>
                      {isHi ? "शोधकर्ता / लेखक:" : "Researcher / Author:"}{" "}
                      <strong className="text-foreground">
                        {isHi ? update.author_hi : update.author_en}
                      </strong>
                    </div>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        const text = `RESEARCH REPORT: ${update.title_en}\nDate: ${update.date}\nAuthor: ${update.author_en}\nLocation: ${update.location}\n\nSummary:\n${update.summary_en}\n\nDetailed Notes:\n${update.detailedNotes_en}\n\nKey Findings:\n${update.keyFindings_en.map((k) => "- " + k).join("\n")}`;
                        const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
                        const url = URL.createObjectURL(blob);
                        const a = document.createElement("a");
                        a.href = url;
                        a.download = `${update.slug}.txt`;
                        document.body.appendChild(a);
                        a.click();
                        document.body.removeChild(a);
                        URL.revokeObjectURL(url);
                      }}
                      className="gap-2"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      {isHi ? "शोध नोट डाउनलोड करें" : "Download Working Note"}
                    </Button>
                  </div>
                </article>
              ))}
            </div>
          </section>
        )}

        {/* Bottom Banner */}
        <section className="bg-card border border-border rounded-2xl p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2">
            <h2 className="text-xl font-bold text-foreground">
              {isHi ? "क्या आपके पास भी कोई उपयोगी प्रपत्र या सामग्री है?" : "Have useful formats or RTI templates to share?"}
            </h2>
            <p className="text-sm text-muted-foreground max-w-xl">
              {isHi
                ? "यदि आपके पास विद्यालय सुगम्यता से जुड़ी कोई वैध चेकलिस्ट या कानूनी प्रारूप है, तो शोधकर्ता से संपर्क कर साझा करें।"
                : "Contribute accessibility audit materials, advocacy templates, or legal precedents to assist fellow researchers and educators."}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <Link href="/about">
              <Button size="md" variant="outline">
                {isHi ? "शोधकर्ता से संपर्क करें →" : "Contact Researcher →"}
              </Button>
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
