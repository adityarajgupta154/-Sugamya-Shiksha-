"use client";

import React, { useState, useEffect, useTransition } from "react";
import { useLanguage } from "@/context/LanguageContext";
import {
  CampaignItem,
  CampaignType,
  CAMPAIGN_TYPE_META,
  DEMO_CAMPAIGN_ITEMS,
} from "@/data/campaignData";
import {
  mergeCampaignsWithLocal,
  getCustomCampaigns,
} from "@/lib/customCampaignStorage";
import {
  Megaphone,
  Download,
  Calendar,
  MapPin,
  Play,
  FileText,
  ChevronDown,
  ChevronUp,
  Tag,
  ExternalLink,
  Sparkles,
  Share2,
  Subtitles,
} from "lucide-react";

export default function AwarenessAdvocacyPage() {
  const { locale } = useLanguage();
  const isHindi = locale === "hi";

  const [campaignItems, setCampaignItems] = useState<CampaignItem[]>(() =>
    mergeCampaignsWithLocal(DEMO_CAMPAIGN_ITEMS)
  );
  const [selectedType, setSelectedType] = useState<string>("all");
  const [expandedTranscriptId, setExpandedTranscriptId] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Load published items from Firestore + LocalStorage
  useEffect(() => {
    let cancelled = false;

    function refreshFromStorage() {
      setCampaignItems((prev) => mergeCampaignsWithLocal(prev));
    }

    async function loadCampaign() {
      try {
        const { db } = await import("@/lib/firebase/firestore");
        if (!db || cancelled) {
          setCampaignItems(mergeCampaignsWithLocal(DEMO_CAMPAIGN_ITEMS));
          setLoading(false);
          return;
        }
        const { collection, query, where, getDocs } = await import("firebase/firestore");
        const q = query(
          collection(db, "campaignItems"),
          where("published", "==", true)
        );
        const snap = await getDocs(q);
        if (!snap.empty && !cancelled) {
          const list: CampaignItem[] = [];
          snap.forEach((d) => list.push({ id: d.id, ...d.data() } as CampaignItem));
          setCampaignItems(mergeCampaignsWithLocal(list));
        } else if (!cancelled) {
          setCampaignItems(mergeCampaignsWithLocal(DEMO_CAMPAIGN_ITEMS));
        }
      } catch (err) {
        console.info("Using demo/local campaign items (Firestore fallback)");
        setCampaignItems(mergeCampaignsWithLocal(DEMO_CAMPAIGN_ITEMS));
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadCampaign();

    const handleSync = () => refreshFromStorage();
    window.addEventListener("ssb_campaign_updated", handleSync);
    window.addEventListener("storage", handleSync);

    return () => {
      cancelled = true;
      window.removeEventListener("ssb_campaign_updated", handleSync);
      window.removeEventListener("storage", handleSync);
    };
  }, []);

  const publishedItems = campaignItems.filter((item) => item.published === true);

  const filteredItems = publishedItems.filter((item) => {
    if (selectedType !== "all" && item.type !== selectedType) return false;
    return true;
  });

  const toggleTranscript = (id: string) => {
    setExpandedTranscriptId((prev) => (prev === id ? null : id));
  };

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-10">
        {/* Hero Section */}
        <div className="bg-gradient-to-br from-navy-950 via-teal-950 to-navy-900 rounded-3xl p-8 sm:p-12 text-white shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 space-y-5 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-400/20 border border-amber-300/30 text-amber-300 text-xs font-bold uppercase tracking-wider">
              <Megaphone className="w-4 h-4 text-amber-300" />
              <span>{isHindi ? "डिजिटल अभियान एवं सामुदायिक लामबंदी" : "Public Awareness & Advocacy"}</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white leading-tight font-hindi">
              {isHindi ? "जागरूकता एवं समुदाय लामबंदी" : "Awareness & Community Advocacy"}
            </h1>

            <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-hindi">
              {isHindi
                ? "स्कूलों को सभी बच्चों के लिए बाधारहित बनाने के उद्देश्य से सोशल मीडिया अभियान, सूचनात्मक पोस्टर, रील्स, कैप्शन युक्त वीडियो एवं शिक्षक-SMC कार्यशालाएं। समाज में समझ और बदलाव लाने का साझा प्रयास।"
                : "Multichannel advocacy campaign advancing accessible educational infrastructure across Bihar through infographics, reels, accessible captioned videos, and grassroots School Management Committee (SMC) workshops."}
            </p>

            <div className="flex flex-wrap items-center gap-4 text-xs text-teal-200 pt-1">
              <span className="flex items-center gap-1.5">
                <Subtitles className="w-4 h-4 text-teal-300" />
                <span>{isHindi ? "कैप्शन व ट्रांसक्रिप्ट सहित वीडियो" : "Captioned Videos & Accessible Transcripts"}</span>
              </span>
              <span className="flex items-center gap-1.5">
                <Download className="w-4 h-4 text-amber-300" />
                <span>{isHindi ? "मुद्रण योग्य पोस्टर डाउनलोड" : "Printable High-Res Posters"}</span>
              </span>
            </div>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          <button
            type="button"
            onClick={() => setSelectedType("all")}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
              selectedType === "all"
                ? "bg-navy-900 text-white shadow-md"
                : "bg-white hover:bg-slate-100 text-slate-700 border border-slate-200"
            }`}
          >
            {isHindi ? `सभी सामग्री (${publishedItems.length})` : `All Materials (${publishedItems.length})`}
          </button>

          {(["poster", "video", "reel", "workshop", "mobilisation"] as CampaignType[]).map((type) => {
            const count = publishedItems.filter((i) => i.type === type).length;
            const meta = CAMPAIGN_TYPE_META[type];
            const isSelected = selectedType === type;

            return (
              <button
                key={type}
                type="button"
                onClick={() => setSelectedType(type)}
                className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all shrink-0 ${
                  isSelected
                    ? "bg-teal-700 text-white shadow-md"
                    : "bg-white hover:bg-slate-100 text-slate-700 border border-slate-200"
                }`}
              >
                <span>{meta.icon}</span>
                <span>{isHindi ? meta.label_hi : meta.label_en}</span>
                <span className="opacity-70 text-[11px]">({count})</span>
              </button>
            );
          })}
        </div>

        {/* Campaign Items Feed */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {filteredItems.map((item) => {
            const meta = CAMPAIGN_TYPE_META[item.type];
            const title = isHindi ? item.title_hi : item.title_en;
            const desc = isHindi ? item.description_hi : item.description_en;
            const transcript = isHindi ? item.transcript_hi : item.transcript_en;
            const isTranscriptOpen = expandedTranscriptId === item.id;

            return (
              <article
                key={item.id}
                className="bg-white rounded-3xl border border-slate-200 shadow-sm hover:shadow-xl transition-all overflow-hidden flex flex-col justify-between space-y-4"
              >
                {/* Media Preview Box */}
                <div className="relative bg-slate-900 aspect-video overflow-hidden group">
                  {item.type === "video" || item.type === "reel" ? (
                    <video
                      controls
                      poster={item.thumbnailUrl}
                      className="w-full h-full object-cover"
                      preload="metadata"
                      aria-label={title}
                    >
                      <source src={item.mediaUrl} type="video/mp4" />
                      {item.captionsUrl && (
                        <track
                          src={item.captionsUrl}
                          kind="subtitles"
                          srcLang={locale}
                          label={isHindi ? "हिन्दी / English Subtitles" : "Subtitles"}
                          default
                        />
                      )}
                      Your browser does not support HTML5 video.
                    </video>
                  ) : (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={item.mediaUrl}
                      alt={title}
                      style={{
                        objectFit: item.frameSettings?.objectFit || "cover",
                        objectPosition:
                          item.frameSettings?.objectPosition ||
                          (item.frameSettings?.posX !== undefined && item.frameSettings?.posY !== undefined
                            ? `${item.frameSettings.posX}% ${item.frameSettings.posY}%`
                            : "center center"),
                        transform:
                          item.frameSettings?.scale && item.frameSettings.scale > 1
                            ? `scale(${item.frameSettings.scale})`
                            : undefined,
                      }}
                      className="w-full h-full transition-transform duration-300"
                    />
                  )}

                  {/* Format Badge overlay */}
                  <div className="absolute top-3 left-3 z-10">
                    <span
                      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border shadow-xs ${meta.badgeClass}`}
                    >
                      <span>{meta.icon}</span>
                      <span>{isHindi ? meta.label_hi : meta.label_en}</span>
                    </span>
                  </div>
                </div>

                {/* Content Box */}
                <div className="p-6 pt-0 space-y-4 flex-1 flex flex-col justify-between">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-xs text-slate-500">
                      <span className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        <span>{new Date(item.date).toLocaleDateString()}</span>
                      </span>
                      {item.location && (
                        <span className="flex items-center gap-1.5 text-teal-700 font-semibold truncate max-w-[200px]">
                          <MapPin className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                          <span className="truncate">{item.location}</span>
                        </span>
                      )}
                    </div>

                    <h2 className="text-lg font-black text-navy-900 leading-snug font-hindi">
                      {title}
                    </h2>

                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-hindi">
                      {desc}
                    </p>

                    {/* Tags */}
                    {item.tags && item.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {item.tags.map((tag, tIdx) => (
                          <span
                            key={tIdx}
                            className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 text-[10px] font-medium"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Accessible Transcript Accordion (for Videos & Reels) */}
                  {transcript && (
                    <div className="pt-2 border-t border-slate-100">
                      <button
                        type="button"
                        onClick={() => toggleTranscript(item.id)}
                        className="w-full flex items-center justify-between py-2 text-xs font-bold text-teal-800 hover:text-teal-900"
                        aria-expanded={isTranscriptOpen}
                      >
                        <span className="flex items-center gap-1.5">
                          <FileText className="w-3.5 h-3.5" />
                          <span>{isHindi ? "सुलभ प्रतिलेख (Transcript) पढ़ें" : "Read Full Transcript"}</span>
                        </span>
                        {isTranscriptOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </button>

                      {isTranscriptOpen && (
                        <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-700 font-hindi leading-relaxed mt-1 animate-fade-in">
                          {transcript}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Download / Action Button */}
                  {item.downloadUrl && (
                    <div className="pt-3 border-t border-slate-100 flex justify-end">
                      <a
                        href={item.downloadUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-teal-50 hover:bg-teal-100 text-teal-900 font-bold text-xs transition-colors"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>{isHindi ? "उच्च गुणवत्ता में डाउनलोड करें" : "Download High-Res"}</span>
                      </a>
                    </div>
                  )}
                </div>
              </article>
            );
          })}
        </div>

        {/* Campaign Support & Action CTA */}
        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm text-center space-y-4 max-w-3xl mx-auto">
          <Sparkles className="w-8 h-8 text-amber-500 mx-auto" />
          <h2 className="text-xl font-bold text-navy-900">
            {isHindi ? "सामुदायिक जागरूकता में सहयोग करें" : "Support School Accessibility Awareness"}
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-xl mx-auto">
            {isHindi
              ? "इन पोस्टरों और दिशानिर्देशों को अपने स्थानीय विद्यालय प्रबंधन समिति (SMC) और अभिभावक बैठकों में साझा करें ताकि हर बच्चे के लिए स्कूल सुगम बन सके।"
              : "Share these advocacy resources with your local School Management Committee (SMC), headmasters, and parent forums to champion accessible education across Bihar."}
          </p>
        </div>
      </div>
    </div>
  );
}
