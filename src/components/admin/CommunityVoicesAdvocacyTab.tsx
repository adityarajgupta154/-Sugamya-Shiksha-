"use client";

import React, { useState, useEffect } from "react";
import { db } from "@/lib/firebase/firestore";
import {
  collection,
  getDocs,
  doc,
  setDoc,
  deleteDoc,
  updateDoc,
} from "firebase/firestore";
import {
  CommunityVoiceItem,
  CommunityRole,
  DEMO_COMMUNITY_VOICES,
} from "@/data/communityVoicesData";
import {
  CampaignItem,
  CampaignType,
  CAMPAIGN_TYPE_META,
  DEMO_CAMPAIGN_ITEMS,
} from "@/data/campaignData";
import {
  Heart,
  Megaphone,
  CheckCircle2,
  XCircle,
  Plus,
  Trash2,
  Edit,
  Lock,
  ShieldCheck,
  Eye,
  FileText,
  AlertTriangle,
  X,
  Save,
} from "lucide-react";

interface Props {
  isHindi: boolean;
}

export function CommunityVoicesAdvocacyTab({ isHindi }: Props) {
  const [subTab, setSubTab] = useState<"voices" | "campaign">("voices");
  const [feedback, setFeedback] = useState<string>("");

  // Voices state
  const [voices, setVoices] = useState<CommunityVoiceItem[]>(DEMO_COMMUNITY_VOICES);
  const [editingVoice, setEditingVoice] = useState<CommunityVoiceItem | null>(null);
  const [isVoiceModalOpen, setIsVoiceModalOpen] = useState(false);

  // Campaign state
  const [campaigns, setCampaigns] = useState<CampaignItem[]>(DEMO_CAMPAIGN_ITEMS);
  const [editingCampaign, setEditingCampaign] = useState<CampaignItem | null>(null);
  const [isCampaignModalOpen, setIsCampaignModalOpen] = useState(false);

  // Load from Firestore if online
  useEffect(() => {
    async function loadData() {
      if (!db) return;
      try {
        const vSnap = await getDocs(collection(db, "communityVoices"));
        if (!vSnap.empty) {
          const list: CommunityVoiceItem[] = [];
          vSnap.forEach((d) => list.push({ id: d.id, ...d.data() } as CommunityVoiceItem));
          setVoices(list);
        }
        const cSnap = await getDocs(collection(db, "campaignItems"));
        if (!cSnap.empty) {
          const list: CampaignItem[] = [];
          cSnap.forEach((d) => list.push({ id: d.id, ...d.data() } as CampaignItem));
          setCampaigns(list);
        }
      } catch (e) {
        console.warn("Using demo data for voices/advocacy admin:", e);
      }
    }
    loadData();
  }, []);

  const notify = (msg: string) => {
    setFeedback(msg);
    setTimeout(() => setFeedback(""), 3500);
  };

  // Toggle Voice Publish
  const handleToggleVoicePublish = async (item: CommunityVoiceItem) => {
    if (!item.consentRecorded && !item.published) {
      alert(
        isHindi
          ? "त्रुटि: बिना रिकॉर्डेड सहमति (Recorded Consent) के कहानी को प्रकाशित नहीं किया जा सकता।"
          : "Error: Cannot publish a story without documented consent flag."
      );
      return;
    }

    const nextState = !item.published;
    if (db) {
      try {
        await updateDoc(doc(db, "communityVoices", item.id), { published: nextState });
      } catch (e) {
        console.warn("Firestore update error:", e);
      }
    }
    setVoices((prev) =>
      prev.map((v) => (v.id === item.id ? { ...v, published: nextState } : v))
    );
    notify(nextState ? "कहानी प्रकाशित की गई!" : "कहानी अप्रकाशित की गई।");
  };

  // Delete Voice
  const handleDeleteVoice = async (id: string) => {
    if (db) {
      try {
        await deleteDoc(doc(db, "communityVoices", id));
      } catch (e) {
        console.warn("Firestore delete error:", e);
      }
    }
    setVoices((prev) => prev.filter((v) => v.id !== id));
    notify("कहानी हटा दी गई।");
  };

  // Save Voice (Add/Edit)
  const handleSaveVoice = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingVoice) return;

    const id = editingVoice.id || `voice-${Date.now()}`;
    const cleanItem = { ...editingVoice, id };

    if (db) {
      try {
        await setDoc(doc(db, "communityVoices", id), cleanItem, { merge: true });
      } catch (e) {
        console.warn("Firestore save error:", e);
      }
    }

    setVoices((prev) => {
      const idx = prev.findIndex((v) => v.id === id);
      if (idx >= 0) {
        const copy = [...prev];
        copy[idx] = cleanItem;
        return copy;
      }
      return [cleanItem, ...prev];
    });

    setIsVoiceModalOpen(false);
    setEditingVoice(null);
    notify("कहानी सुरक्षित सहेज ली गई!");
  };

  // Toggle Campaign Publish
  const handleToggleCampaignPublish = async (item: CampaignItem) => {
    const nextState = !item.published;
    if (db) {
      try {
        await updateDoc(doc(db, "campaignItems", item.id), { published: nextState });
      } catch (e) {
        console.warn("Firestore update error:", e);
      }
    }
    setCampaigns((prev) =>
      prev.map((c) => (c.id === item.id ? { ...c, published: nextState } : c))
    );
    notify(nextState ? "सामग्री प्रकाशित की गई!" : "सामग्री अप्रकाशित की गई।");
  };

  // Delete Campaign Item
  const handleDeleteCampaign = async (id: string) => {
    if (db) {
      try {
        await deleteDoc(doc(db, "campaignItems", id));
      } catch (e) {
        console.warn("Firestore delete error:", e);
      }
    }
    setCampaigns((prev) => prev.filter((c) => c.id !== id));
    notify("अभियान सामग्री हटा दी गई।");
  };

  // Save Campaign Item (Add/Edit)
  const handleSaveCampaign = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCampaign) return;

    const id = editingCampaign.id || `camp-${Date.now()}`;
    const cleanItem = { ...editingCampaign, id };

    if (db) {
      try {
        await setDoc(doc(db, "campaignItems", id), cleanItem, { merge: true });
      } catch (e) {
        console.warn("Firestore save error:", e);
      }
    }

    setCampaigns((prev) => {
      const idx = prev.findIndex((c) => c.id === id);
      if (idx >= 0) {
        const copy = [...prev];
        copy[idx] = cleanItem;
        return copy;
      }
      return [cleanItem, ...prev];
    });

    setIsCampaignModalOpen(false);
    setEditingCampaign(null);
    notify("अभियान सामग्री सहेज ली गई!");
  };

  return (
    <div className="space-y-6 pt-4">
      {/* Sub-tab Navigation */}
      <div className="flex items-center justify-between gap-4 border-b pb-3 flex-wrap">
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setSubTab("voices")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              subTab === "voices"
                ? "bg-teal-700 text-white shadow-sm"
                : "bg-slate-100 hover:bg-slate-200 text-slate-700"
            }`}
          >
            <Heart className="w-4 h-4" />
            <span>{isHindi ? `सामुदायिक आवाज़ें (${voices.length})` : `Community Voices (${voices.length})`}</span>
          </button>

          <button
            type="button"
            onClick={() => setSubTab("campaign")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              subTab === "campaign"
                ? "bg-teal-700 text-white shadow-sm"
                : "bg-slate-100 hover:bg-slate-200 text-slate-700"
            }`}
          >
            <Megaphone className="w-4 h-4" />
            <span>{isHindi ? `जागरूकता अभियान (${campaigns.length})` : `Campaign Items (${campaigns.length})`}</span>
          </button>
        </div>

        {subTab === "voices" ? (
          <button
            type="button"
            onClick={() => {
              setEditingVoice({
                id: "",
                role: "student",
                title_hi: "",
                title_en: "",
                story_hi: "",
                story_en: "",
                keyTheme_hi: "सुगम्यता अनुभव",
                keyTheme_en: "Accessibility Experience",
                isAnonymous: true,
                authorDisplayName_hi: "एक छात्र (दानापुर)",
                authorDisplayName_en: "A Student (Danapur)",
                consentRecorded: true,
                consentDetails: {
                  consentDate: new Date().toISOString().split("T")[0],
                  consentType: "written",
                  isMinor: false,
                  hasPhotoConsent: false,
                },
                published: true,
                createdAt: new Date().toISOString(),
              });
              setIsVoiceModalOpen(true);
            }}
            className="px-3 py-2 rounded-xl bg-navy-900 hover:bg-navy-800 text-white text-xs font-bold flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>{isHindi ? "नई कहानी जोड़ें" : "Add Story"}</span>
          </button>
        ) : (
          <button
            type="button"
            onClick={() => {
              setEditingCampaign({
                id: "",
                type: "poster",
                title_hi: "",
                title_en: "",
                description_hi: "",
                description_en: "",
                mediaUrl: "",
                thumbnailUrl: "",
                date: new Date().toISOString().split("T")[0],
                tags: ["Advocacy"],
                published: true,
              });
              setIsCampaignModalOpen(true);
            }}
            className="px-3 py-2 rounded-xl bg-navy-900 hover:bg-navy-800 text-white text-xs font-bold flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>{isHindi ? "नया अभियान आइटम जोड़ें" : "Add Campaign Item"}</span>
          </button>
        )}
      </div>

      {feedback && (
        <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-300 text-xs font-semibold text-emerald-900 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>{feedback}</span>
        </div>
      )}

      {/* VOICES SUB-TAB */}
      {subTab === "voices" && (
        <div className="space-y-3">
          {voices.map((v) => (
            <div
              key={v.id}
              className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3"
            >
              <div className="space-y-1 flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-teal-50 text-teal-800 border border-teal-200 uppercase">
                    {v.role}
                  </span>
                  {v.isAnonymous ? (
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 flex items-center gap-1">
                      <Lock className="w-3 h-3" />
                      Anonymous
                    </span>
                  ) : null}
                  {v.consentRecorded ? (
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-800 flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3 text-emerald-600" />
                      Consent OK
                    </span>
                  ) : (
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-rose-50 text-rose-800 flex items-center gap-1">
                      <AlertTriangle className="w-3 h-3 text-rose-600" />
                      No Consent
                    </span>
                  )}
                  {v.published ? (
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800">
                      Published
                    </span>
                  ) : (
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-100 text-amber-900">
                      Unpublished
                    </span>
                  )}
                </div>

                <h4 className="text-sm font-bold text-navy-900 leading-snug">
                  {isHindi ? v.title_hi : v.title_en}
                </h4>
                <p className="text-xs text-slate-500 line-clamp-1">{isHindi ? v.story_hi : v.story_en}</p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => handleToggleVoicePublish(v)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                    v.published
                      ? "bg-slate-100 hover:bg-slate-200 text-slate-700"
                      : "bg-teal-700 hover:bg-teal-800 text-white"
                  }`}
                >
                  {v.published ? (isHindi ? "अप्रकाशित करें" : "Unpublish") : (isHindi ? "प्रकाशित करें" : "Publish")}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setEditingVoice(v);
                    setIsVoiceModalOpen(true);
                  }}
                  className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-600"
                >
                  <Edit className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  onClick={() => handleDeleteVoice(v.id)}
                  className="p-1.5 rounded-lg hover:bg-rose-50 text-rose-600"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* CAMPAIGN SUB-TAB */}
      {subTab === "campaign" && (
        <div className="space-y-3">
          {campaigns.map((c) => {
            const meta = CAMPAIGN_TYPE_META[c.type];
            return (
              <div
                key={c.id}
                className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3"
              >
                <div className="space-y-1 flex-1">
                  <div className="flex items-center gap-2">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${meta.badgeClass}`}>
                      {meta.icon} {isHindi ? meta.label_hi : meta.label_en}
                    </span>
                    {c.published ? (
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800">
                        Published
                      </span>
                    ) : (
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-100 text-amber-900">
                        Unpublished
                      </span>
                    )}
                    <span className="text-[10px] text-slate-400 font-mono">{c.date}</span>
                  </div>

                  <h4 className="text-sm font-bold text-navy-900 leading-snug">
                    {isHindi ? c.title_hi : c.title_en}
                  </h4>
                  <p className="text-xs text-slate-500 line-clamp-1">{isHindi ? c.description_hi : c.description_en}</p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => handleToggleCampaignPublish(c)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                      c.published
                        ? "bg-slate-100 hover:bg-slate-200 text-slate-700"
                        : "bg-teal-700 hover:bg-teal-800 text-white"
                    }`}
                  >
                    {c.published ? (isHindi ? "अप्रकाशित करें" : "Unpublish") : (isHindi ? "प्रकाशित करें" : "Publish")}
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setEditingCampaign(c);
                      setIsCampaignModalOpen(true);
                    }}
                    className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-600"
                  >
                    <Edit className="w-4 h-4" />
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDeleteCampaign(c.id)}
                    className="p-1.5 rounded-lg hover:bg-rose-50 text-rose-600"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Voice Add/Edit Modal */}
      {isVoiceModalOpen && editingVoice && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4"
        >
          <div className="bg-white rounded-2xl p-6 max-w-xl w-full max-h-[90vh] overflow-y-auto space-y-4">
            <div className="flex justify-between items-center border-b pb-2">
              <h3 className="text-sm font-bold text-navy-900">
                {editingVoice.id ? "कहानी संपादित करें" : "नई कहानी जोड़ें"}
              </h3>
              <button
                type="button"
                onClick={() => setIsVoiceModalOpen(false)}
                className="text-slate-400"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveVoice} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700">भूमिका (Role):</label>
                  <select
                    value={editingVoice.role}
                    onChange={(e) =>
                      setEditingVoice({ ...editingVoice, role: e.target.value as any })
                    }
                    className="w-full mt-1 p-2 border rounded-lg"
                  >
                    <option value="student">Student</option>
                    <option value="parent">Parent</option>
                    <option value="teacher">Teacher</option>
                    <option value="advocate">Advocate</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-700">सहमति रिकॉर्ड दर्ज (Consent):</label>
                  <div className="mt-2 flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={editingVoice.consentRecorded}
                      onChange={(e) =>
                        setEditingVoice({
                          ...editingVoice,
                          consentRecorded: e.target.checked,
                        })
                      }
                      className="rounded text-teal-600"
                    />
                    <span className="font-medium">Consent Confirmed</span>
                  </div>
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700">शीर्षक (हिन्दी):</label>
                <input
                  type="text"
                  required
                  value={editingVoice.title_hi}
                  onChange={(e) =>
                    setEditingVoice({ ...editingVoice, title_hi: e.target.value })
                  }
                  className="w-full mt-1 p-2 border rounded-lg"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700">Title (English):</label>
                <input
                  type="text"
                  required
                  value={editingVoice.title_en}
                  onChange={(e) =>
                    setEditingVoice({ ...editingVoice, title_en: e.target.value })
                  }
                  className="w-full mt-1 p-2 border rounded-lg"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700">अनुभव / कहानी (हिन्दी):</label>
                <textarea
                  rows={3}
                  required
                  value={editingVoice.story_hi}
                  onChange={(e) =>
                    setEditingVoice({ ...editingVoice, story_hi: e.target.value })
                  }
                  className="w-full mt-1 p-2 border rounded-lg"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700">Story (English):</label>
                <textarea
                  rows={3}
                  required
                  value={editingVoice.story_en}
                  onChange={(e) =>
                    setEditingVoice({ ...editingVoice, story_en: e.target.value })
                  }
                  className="w-full mt-1 p-2 border rounded-lg"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t">
                <button
                  type="button"
                  onClick={() => setIsVoiceModalOpen(false)}
                  className="px-3 py-1.5 border rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-teal-700 text-white font-bold rounded-lg"
                >
                  Save Story
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Campaign Add/Edit Modal */}
      {isCampaignModalOpen && editingCampaign && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4"
        >
          <div className="bg-white rounded-2xl p-6 max-w-xl w-full max-h-[90vh] overflow-y-auto space-y-4">
            <div className="flex justify-between items-center border-b pb-2">
              <h3 className="text-sm font-bold text-navy-900">
                {editingCampaign.id ? "अभियान सामग्री संपादन" : "नया अभियान आइटम"}
              </h3>
              <button
                type="button"
                onClick={() => setIsCampaignModalOpen(false)}
                className="text-slate-400"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveCampaign} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700">प्रकार (Format):</label>
                  <select
                    value={editingCampaign.type}
                    onChange={(e) =>
                      setEditingCampaign({ ...editingCampaign, type: e.target.value as any })
                    }
                    className="w-full mt-1 p-2 border rounded-lg"
                  >
                    <option value="poster">Poster</option>
                    <option value="video">Video Explainer</option>
                    <option value="reel">Reels / Shorts</option>
                    <option value="workshop">Workshop</option>
                    <option value="mobilisation">Mobilisation</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-700">दिनांक (Date):</label>
                  <input
                    type="date"
                    value={editingCampaign.date}
                    onChange={(e) =>
                      setEditingCampaign({ ...editingCampaign, date: e.target.value })
                    }
                    className="w-full mt-1 p-2 border rounded-lg"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700">शीर्षक (हिन्दी):</label>
                <input
                  type="text"
                  required
                  value={editingCampaign.title_hi}
                  onChange={(e) =>
                    setEditingCampaign({ ...editingCampaign, title_hi: e.target.value })
                  }
                  className="w-full mt-1 p-2 border rounded-lg"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700">Title (English):</label>
                <input
                  type="text"
                  required
                  value={editingCampaign.title_en}
                  onChange={(e) =>
                    setEditingCampaign({ ...editingCampaign, title_en: e.target.value })
                  }
                  className="w-full mt-1 p-2 border rounded-lg"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700">Media URL (Video/Image):</label>
                <input
                  type="url"
                  required
                  value={editingCampaign.mediaUrl}
                  onChange={(e) =>
                    setEditingCampaign({ ...editingCampaign, mediaUrl: e.target.value })
                  }
                  placeholder="https://..."
                  className="w-full mt-1 p-2 border rounded-lg"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700">सुलभ प्रतिलेख (Transcript/Subtitles):</label>
                <textarea
                  rows={2}
                  value={editingCampaign.transcript_hi || ""}
                  onChange={(e) =>
                    setEditingCampaign({ ...editingCampaign, transcript_hi: e.target.value })
                  }
                  placeholder="Video transcript for screen readers / deaf users..."
                  className="w-full mt-1 p-2 border rounded-lg"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t">
                <button
                  type="button"
                  onClick={() => setIsCampaignModalOpen(false)}
                  className="px-3 py-1.5 border rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-teal-700 text-white font-bold rounded-lg"
                >
                  Save Item
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
