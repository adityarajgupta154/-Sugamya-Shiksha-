"use client";

import React, { useState, useEffect, useTransition } from "react";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";
import {
  CommunityVoiceItem,
  CommunityRole,
  DEMO_COMMUNITY_VOICES,
} from "@/data/communityVoicesData";
import { SubmitStoryModal } from "@/components/voices/SubmitStoryModal";
import {
  Heart,
  Quote,
  ShieldCheck,
  Lock,
  Plus,
  Users,
  GraduationCap,
  School,
  Sparkles,
  Building2,
  Calendar,
  AlertTriangle,
} from "lucide-react";

export default function CommunityVoicesPage() {
  const { locale } = useLanguage();
  const isHindi = locale === "hi";

  const [voices, setVoices] = useState<CommunityVoiceItem[]>(DEMO_COMMUNITY_VOICES);
  const [selectedRole, setSelectedRole] = useState<string>("all");
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [isPending, startTransition] = useTransition();

  // Fetch verified published voices from Firestore
  useEffect(() => {
    let cancelled = false;
    async function loadVoices() {
      try {
        const { db } = await import("@/lib/firebase/firestore");
        if (!db || cancelled) {
          setLoading(false);
          return;
        }
        const { collection, query, where, getDocs, limit } = await import("firebase/firestore");
        const q = query(
          collection(db, "communityVoices"),
          where("published", "==", true),
          where("consentRecorded", "==", true),
          limit(50)
        );
        const snap = await getDocs(q);
        if (!snap.empty && !cancelled) {
          const list: CommunityVoiceItem[] = [];
          snap.forEach((d) => list.push({ id: d.id, ...d.data() } as CommunityVoiceItem));
          setVoices(list);
        }
      } catch (e) {
        console.info("Using demo community voices (Firestore query fallback)");
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }
    loadVoices();
    return () => {
      cancelled = true;
    };
  }, []);

  // Filter published only (and role if selected)
  const publishedVoices = voices.filter(
    (v) => v.published === true && v.consentRecorded === true
  );

  const filtered = publishedVoices.filter((v) => {
    if (selectedRole !== "all" && v.role !== selectedRole) return false;
    return true;
  });

  const roleMeta: Record<
    CommunityRole,
    { label_hi: string; label_en: string; icon: any; badgeBg: string }
  > = {
    student: {
      label_hi: "विद्यार्थी (Student)",
      label_en: "Student",
      icon: GraduationCap,
      badgeBg: "bg-teal-100 text-teal-900 border-teal-300",
    },
    parent: {
      label_hi: "अभिभावक (Parent)",
      label_en: "Parent",
      icon: Users,
      badgeBg: "bg-purple-100 text-purple-900 border-purple-300",
    },
    teacher: {
      label_hi: "शिक्षक (Teacher)",
      label_en: "Teacher",
      icon: School,
      badgeBg: "bg-blue-100 text-blue-900 border-blue-300",
    },
    advocate: {
      label_hi: "अधिवक्ता (Advocate)",
      label_en: "Advocate",
      icon: ShieldCheck,
      badgeBg: "bg-amber-100 text-amber-900 border-amber-300",
    },
  };

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-10">
        {/* Hero Section */}
        <div className="bg-gradient-to-br from-navy-950 via-navy-900 to-teal-950 rounded-3xl p-8 sm:p-12 text-white shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 space-y-5 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-teal-500/20 border border-teal-400/30 text-teal-300 text-xs font-bold uppercase tracking-wider">
              <Heart className="w-4 h-4 text-rose-400" />
              <span>{isHindi ? "सजीव अनुभव एवं सामुदायिक दृष्टिकोण" : "Lived Experiences & Dignity"}</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white leading-tight font-hindi">
              {isHindi ? "सामुदायिक अनुभव एवं आवाज़ें" : "Community Voices for Inclusive Schools"}
            </h1>

            <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-hindi">
              {isHindi
                ? "दानापुर के दिव्यांग छात्र-छात्राओं, उनके अभिभावकों, शिक्षकों और अधिकार कार्यकर्ताओं के वास्तविक अनुभव। प्रत्येक प्रविष्टि स्पष्ट सहमति, गरिमा और बाल संरक्षण नीति के कड़े मानकों के अनुरूप दर्ज की गई है।"
                : "Real experiences of students with disabilities, parents, teachers, and disability advocates in Danapur, Patna. Every narrative is recorded with documented consent, strict privacy protection, and child safeguarding standards."}
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-4">
              <button
                type="button"
                onClick={() => setIsModalOpen(true)}
                className="px-6 py-3 rounded-xl bg-teal-500 hover:bg-teal-400 text-navy-950 font-black text-xs sm:text-sm shadow-lg transition-transform active:scale-95 flex items-center gap-2 cursor-pointer"
              >
                <Plus className="w-4 h-4 stroke-[3]" />
                <span>{isHindi ? "अपना अनुभव साझा करें" : "Share Your Lived Experience"}</span>
              </button>

              <span className="text-xs text-teal-200 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>{isHindi ? "पूर्ण सहमति आधारित अभिलेख" : "Consent-Gated Documentation"}</span>
              </span>
            </div>
          </div>
        </div>

        {/* Demo Notice Banner */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-100 text-amber-900 text-xs font-bold border border-amber-300">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-800" aria-hidden="true" />
            <span>
              {isHindi
                ? "प्रदर्शनात्मक डेमो डेटा — वास्तविक दानापुर सर्वेक्षण निष्कर्ष नहीं।"
                : "Illustrative demo data — not actual Danapur survey findings."}
            </span>
          </div>
        </div>

        {/* Role Filter Chips */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          <button
            type="button"
            onClick={() => setSelectedRole("all")}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
              selectedRole === "all"
                ? "bg-navy-900 text-white shadow-md"
                : "bg-white hover:bg-slate-100 text-slate-700 border border-slate-200"
            }`}
          >
            {isHindi ? `सभी अनुभव (${publishedVoices.length})` : `All Voices (${publishedVoices.length})`}
          </button>

          {(["student", "parent", "teacher", "advocate"] as CommunityRole[]).map((r) => {
            const count = publishedVoices.filter((v) => v.role === r).length;
            const meta = roleMeta[r];
            const Icon = meta.icon;
            const isSelected = selectedRole === r;

            return (
              <button
                key={r}
                type="button"
                onClick={() => setSelectedRole(r)}
                className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all shrink-0 ${
                  isSelected
                    ? "bg-teal-700 text-white shadow-md"
                    : "bg-white hover:bg-slate-100 text-slate-700 border border-slate-200"
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{isHindi ? meta.label_hi : meta.label_en}</span>
                <span className="opacity-70 text-[11px]">({count})</span>
              </button>
            );
          })}
        </div>

        {/* Stories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {filtered.map((item) => {
            const meta = roleMeta[item.role];
            const Icon = meta.icon;
            const storyText = isHindi ? item.story_hi : item.story_en;
            const titleText = isHindi ? item.title_hi : item.title_en;
            const authorText = isHindi ? item.authorDisplayName_hi : item.authorDisplayName_en;
            const themeText = isHindi ? item.keyTheme_hi : item.keyTheme_en;
            const schoolText = isHindi ? item.schoolName_hi : item.schoolName_en;

            return (
              <article
                key={item.id}
                className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm hover:shadow-xl transition-all flex flex-col justify-between space-y-6 relative overflow-hidden group"
              >
                <div className="space-y-4">
                  {/* Top Badges */}
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <span
                      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${meta.badgeBg}`}
                    >
                      <Icon className="w-3.5 h-3.5" />
                      <span>{isHindi ? meta.label_hi : meta.label_en}</span>
                    </span>

                    <div className="flex items-center gap-2">
                      {item.isAnonymous ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-200">
                          <Lock className="w-3 h-3 text-slate-500" />
                          <span>{isHindi ? "पहचान सुरक्षित" : "Anonymous"}</span>
                        </span>
                      ) : null}

                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                        <ShieldCheck className="w-3 h-3 text-emerald-600" />
                        <span>{isHindi ? "सहमति दर्ज" : "Consent Verified"}</span>
                      </span>
                    </div>
                  </div>

                  {/* Title */}
                  <h2 className="text-lg sm:text-xl font-black text-navy-900 leading-snug font-hindi">
                    {titleText}
                  </h2>

                  {/* Theme pill */}
                  <div className="inline-block px-2.5 py-0.5 rounded-md bg-teal-50 text-teal-800 text-[11px] font-semibold border border-teal-100">
                    {isHindi ? "मुख्य विषय: " : "Theme: "}
                    {themeText}
                  </div>

                  {/* Pull Quote Box */}
                  <div className="relative bg-slate-50/80 p-5 rounded-2xl border border-slate-100 text-sm text-slate-800 leading-relaxed font-hindi">
                    <Quote className="w-6 h-6 text-teal-300 absolute -top-2 -left-2 rotate-180 opacity-50" />
                    <p className="relative z-10 italic">{storyText}</p>
                  </div>

                  {/* Context info (School, date) */}
                  {schoolText && (
                    <p className="text-xs text-slate-500 flex items-center gap-1.5">
                      <Building2 className="w-3.5 h-3.5 text-slate-400" />
                      <span>{schoolText}</span>
                    </p>
                  )}
                </div>

                {/* Footer: Author & Child Protection Notice */}
                <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-full bg-navy-100 text-navy-800 flex items-center justify-center font-bold text-xs shrink-0">
                      {item.role === "student" ? "छ" : item.role === "parent" ? "अ" : item.role === "teacher" ? "शि" : "ना"}
                    </div>
                    <div>
                      <p className="font-bold text-navy-950 leading-tight">{authorText}</p>
                      <p className="text-[10px] text-slate-400">
                        {new Date(item.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  {item.isIllustration && item.role === "student" && (
                    <span className="text-[9px] text-slate-400 italic text-right max-w-[130px] leading-tight">
                      {isHindi ? "बाल गोपनीयता: प्रतीकात्मक चित्रण" : "Child Privacy: Symbolic representation"}
                    </span>
                  )}
                </div>
              </article>
            );
          })}
        </div>

        {/* Modal */}
        <SubmitStoryModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSuccess={() => {
            // refresh
          }}
        />

        {/* Mandatory Research Notice */}
        <div className="p-5 rounded-2xl bg-slate-100 border border-slate-200 text-center text-xs text-slate-600 max-w-3xl mx-auto space-y-1">
          <p className="font-bold text-navy-900">
            {isHindi ? "अनुसंधान नैतिकता एवं बाल संरक्षण नीति:" : "Research Ethics & Child Protection Standards:"}
          </p>
          <p className="leading-relaxed">
            {isHindi
              ? "यह मंच एनसीपीईडीपी फेलोशिप के तहत शोध और पैरवी के लिए संचालित है। विद्यार्थियों की किसी भी तस्वीर का प्रकाशन माता-पिता/अभिभावक की लिखित सहमति के बिना नहीं किया जाता है।"
              : "Operated under the NCPEDP Fellowship, this platform strictly respects research consent. No identifiable photographs of minor students are published without explicit written guardian consent."}
          </p>
        </div>
      </div>
    </div>
  );
}
