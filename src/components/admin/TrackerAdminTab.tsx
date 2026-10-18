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
  TrackerEntry,
  TrackerStage,
  DEMO_TRACKER_ENTRIES,
} from "@/data/trackerData";
import { DEMO_SCHOOLS } from "@/data/schoolsData";
import {
  ArrowLeftRight,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Plus,
  Trash2,
  Edit,
  Save,
  X,
  Building,
  Calendar,
  Layers,
  Sparkles,
  ExternalLink,
  AlertCircle,
  FileCheck2,
  Eye,
} from "lucide-react";
import { clsx } from "clsx";

interface Props {
  isHindi: boolean;
}

const CATEGORY_OPTIONS = [
  { value: "ramp", label_hi: "रैंप एवं रेलिंग", label_en: "Ramp & Handrails" },
  { value: "toilet", label_hi: "दिव्यांग शौचालय (CwSN)", label_en: "Accessible Toilet" },
  { value: "entrance", label_hi: "मुख्य प्रवेश द्वार", label_en: "Main Entrance" },
  { value: "drinkingWater", label_hi: "पेयजल सुविधा", label_en: "Drinking Water" },
  { value: "classroom", label_hi: "कक्षा कक्ष एवं चौखट", label_en: "Classrooms & Doors" },
  { value: "pathway", label_hi: "आवागमन मार्ग", label_en: "Pedestrian Pathways" },
];

const BLANK_ENTRY: TrackerEntry = {
  id: "",
  schoolId: "sch-danapur-01",
  schoolName_hi: "राजकीय मध्य विद्यालय, दानापुर कैंट",
  schoolName_en: "Govt Middle School, Danapur Cantt",
  category: "ramp",
  barrier_hi: "",
  barrier_en: "",
  suggestion_hi: "",
  suggestion_en: "",
  improvement_hi: "",
  improvement_en: "",
  beforePhoto: {
    url: "https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&w=600&q=80",
    caption_hi: "पहले: बाधा की स्थिति",
    caption_en: "Before: Barrier state",
    date: new Date().toISOString().split("T")[0],
  },
  afterPhoto: {
    url: "",
    caption_hi: "",
    caption_en: "",
    date: "",
  },
  dates: {
    identifiedDate: new Date().toISOString().split("T")[0],
    suggestedDate: new Date().toISOString().split("T")[0],
    improvedDate: "",
  },
  stage: "barrier_identified",
  verificationStatus: "pending",
  verifiedBy: "शोधकर्ता, एनसीपीईडीपी फेलोशिप",
  statutoryReference: "Accessibility Code 2024, Clause 4.2",
  createdAt: new Date().toISOString(),
};

export function TrackerAdminTab({ isHindi }: Props) {
  const [entries, setEntries] = useState<TrackerEntry[]>(DEMO_TRACKER_ENTRIES);
  const [editingEntry, setEditingEntry] = useState<TrackerEntry | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState<"all" | "verified" | "pending">("all");
  const [schoolFilter, setSchoolFilter] = useState<string>("all");
  const [feedback, setFeedback] = useState<string>("");
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  useEffect(() => {
    async function loadData() {
      if (!db) return;
      try {
        const snap = await getDocs(collection(db, "trackerEntries"));
        if (!snap.empty) {
          const list: TrackerEntry[] = [];
          snap.forEach((d) => {
            list.push({ id: d.id, ...d.data() } as TrackerEntry);
          });
          setEntries(list);
        }
      } catch (err) {
        console.info("Using local demo tracker fallback");
      }
    }
    loadData();
  }, []);

  const showFeedback = (msg: string) => {
    setFeedback(msg);
    setTimeout(() => setFeedback(""), 4000);
  };

  // Toggle verification status (pending <-> verified)
  const handleToggleVerify = async (entry: TrackerEntry) => {
    const newStatus: "pending" | "verified" =
      entry.verificationStatus === "verified" ? "pending" : "verified";
    const updated: TrackerEntry = { ...entry, verificationStatus: newStatus };

    if (db) {
      try {
        await updateDoc(doc(db, "trackerEntries", entry.id), {
          verificationStatus: newStatus,
        });
      } catch (err) {
        console.warn("Could not update Firestore, local state updated:", err);
      }
    }

    setEntries((prev) => prev.map((e) => (e.id === entry.id ? updated : e)));
    showFeedback(
      newStatus === "verified"
        ? (isHindi ? "प्रविष्टि सत्यापित कर सार्वजनिक कर दी गई है!" : "Entry verified and published!")
        : (isHindi ? "प्रविष्टि अप्रकाशित (लंबित) कर दी गई है।" : "Entry moved to pending (unpublished).")
    );
  };

  // Delete Entry
  const handleDelete = async (id: string) => {
    if (db) {
      try {
        await deleteDoc(doc(db, "trackerEntries", id));
      } catch (err) {
        console.warn("Could not delete from Firestore:", err);
      }
    }

    setEntries((prev) => prev.filter((e) => e.id !== id));
    setDeleteConfirmId(null);
    showFeedback(isHindi ? "प्रविष्टि हटा दी गई।" : "Entry deleted successfully.");
  };

  // Save / Update Entry
  const handleSaveEntry = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingEntry) return;

    let id = editingEntry.id;
    if (!id) {
      id = `track-${Date.now()}`;
    }

    const schoolMatch = DEMO_SCHOOLS.find((s) => s.id === editingEntry.schoolId);
    const finalEntry: TrackerEntry = {
      ...editingEntry,
      id,
      schoolName_hi: schoolMatch ? schoolMatch.name_hi : editingEntry.schoolName_hi,
      schoolName_en: schoolMatch ? schoolMatch.name_en : editingEntry.schoolName_en,
    };

    if (db) {
      try {
        await setDoc(doc(db, "trackerEntries", id), finalEntry, { merge: true });
      } catch (err) {
        console.warn("Could not save to Firestore, local state updated:", err);
      }
    }

    const exists = entries.some((item) => item.id === id);
    if (exists) {
      setEntries((prev) => prev.map((item) => (item.id === id ? finalEntry : item)));
      showFeedback(isHindi ? "प्रविष्टि सफलतापूर्वक अपडेट की गई!" : "Entry updated successfully!");
    } else {
      setEntries((prev) => [finalEntry, ...prev]);
      showFeedback(isHindi ? "नई प्रविष्टि सफलतापूर्वक जोड़ी गई!" : "New tracker entry created!");
    }

    setIsModalOpen(false);
    setEditingEntry(null);
  };

  const filteredEntries = entries.filter((item) => {
    const matchesStatus =
      statusFilter === "all" || item.verificationStatus === statusFilter;
    const matchesSchool =
      schoolFilter === "all" || item.schoolId === schoolFilter;
    return matchesStatus && matchesSchool;
  });

  return (
    <div className="space-y-6">
      {/* Top Banner & Stats */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-teal-50 text-teal-800 border border-teal-200 mb-2">
            <Sparkles className="w-3.5 h-3.5 text-teal-600" aria-hidden="true" />
            <span>PRD 6.2-E • Feature E Control</span>
          </div>
          <h2 className="text-xl font-bold text-navy-900">
            {isHindi ? "पहले और बाद सुगम्यता ट्रैकर प्रबंधन" : "Before & After Accessibility Tracker Management"}
          </h2>
          <p className="text-xs text-slate-600 mt-1 max-w-2xl">
            {isHindi
              ? "विद्यालयों में चिन्हित अवरोधों, दिए गए तकनीकी सुझावों एवं धरातल पर हुए सुधारों को रिकॉर्ड, संपादित एवं सत्यापित करें। केवल सत्यापित रिकॉर्ड ही सार्वजनिक दिखते हैं।"
              : "Create, edit and verify before/after impact transformations. In accordance with PRD 6.2-E, only verified entries are visible to the public."}
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            setEditingEntry({ ...BLANK_ENTRY, id: `track-${Date.now()}` });
            setIsModalOpen(true);
          }}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-teal-600 hover:bg-teal-500 text-white text-xs font-bold transition-colors shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-400"
        >
          <Plus className="w-4 h-4" aria-hidden="true" />
          <span>{isHindi ? "नया सुधार रिकॉर्ड जोड़ें" : "Add Tracker Entry"}</span>
        </button>
      </div>

      {/* Feedback Alert */}
      {feedback && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-300 rounded-xl text-xs font-bold text-emerald-800 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" aria-hidden="true" />
          <span>{feedback}</span>
        </div>
      )}

      {/* Filters Bar */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-bold text-slate-700">{isHindi ? "सत्यापन स्थिति:" : "Status:"}</span>
          <button
            type="button"
            onClick={() => setStatusFilter("all")}
            className={clsx(
              "px-3 py-1.5 rounded-lg font-semibold transition-colors",
              statusFilter === "all"
                ? "bg-navy-900 text-white"
                : "bg-slate-100 text-slate-700 hover:bg-slate-200"
            )}
          >
            {isHindi ? "सभी" : "All"} ({entries.length})
          </button>
          <button
            type="button"
            onClick={() => setStatusFilter("verified")}
            className={clsx(
              "px-3 py-1.5 rounded-lg font-semibold transition-colors flex items-center gap-1",
              statusFilter === "verified"
                ? "bg-emerald-700 text-white"
                : "bg-emerald-50 text-emerald-800 hover:bg-emerald-100"
            )}
          >
            <ShieldCheck className="w-3.5 h-3.5" aria-hidden="true" />
            <span>{isHindi ? "सत्यापित (सार्वजनिक)" : "Verified (Public)"}</span>
            <span>({entries.filter((e) => e.verificationStatus === "verified").length})</span>
          </button>
          <button
            type="button"
            onClick={() => setStatusFilter("pending")}
            className={clsx(
              "px-3 py-1.5 rounded-lg font-semibold transition-colors flex items-center gap-1",
              statusFilter === "pending"
                ? "bg-amber-600 text-white"
                : "bg-amber-50 text-amber-800 hover:bg-amber-100"
            )}
          >
            <Clock className="w-3.5 h-3.5" aria-hidden="true" />
            <span>{isHindi ? "लंबित (अप्रमाणित)" : "Pending (Draft)"}</span>
            <span>({entries.filter((e) => e.verificationStatus === "pending").length})</span>
          </button>
        </div>

        {/* School Filter Dropdown */}
        <div className="flex items-center gap-2">
          <label htmlFor="admin-school-filter" className="font-bold text-slate-700">
            {isHindi ? "विद्यालय:" : "School:"}
          </label>
          <select
            id="admin-school-filter"
            value={schoolFilter}
            onChange={(e) => setSchoolFilter(e.target.value)}
            className="border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs text-slate-800 bg-white"
          >
            <option value="all">{isHindi ? "सभी विद्यालय" : "All Schools"}</option>
            {DEMO_SCHOOLS.map((s) => (
              <option key={s.id} value={s.id}>
                {isHindi ? s.name_hi : s.name_en}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Entries Table / List */}
      <div className="space-y-4">
        {filteredEntries.length === 0 ? (
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-8 text-center text-sm text-slate-500">
            {isHindi ? "कोई प्रविष्टि नहीं मिली।" : "No tracker entries match the current filter."}
          </div>
        ) : (
          filteredEntries.map((entry) => {
            const isVerified = entry.verificationStatus === "verified";
            return (
              <div
                key={entry.id}
                className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4 hover:border-slate-300 transition-colors"
              >
                <div className="space-y-2 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-md text-xs font-bold uppercase tracking-wider bg-teal-100 text-teal-800">
                      {entry.category}
                    </span>
                    <span className="font-bold text-sm text-navy-900">
                      {isHindi ? entry.schoolName_hi : entry.schoolName_en}
                    </span>
                    <span className="text-xs text-slate-400">•</span>
                    <span className="text-xs text-slate-500 flex items-center gap-1">
                      <Calendar className="w-3 h-3" aria-hidden="true" />
                      {entry.dates.identifiedDate}
                    </span>
                    {/* Status Pill */}
                    {isVerified ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" aria-hidden="true" />
                        <span>{isHindi ? "सार्वजनिक (Verified)" : "Public (Verified)"}</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-100 text-amber-800 border border-amber-300">
                        <Clock className="w-3 h-3 text-amber-600" aria-hidden="true" />
                        <span>{isHindi ? "लंबित / अप्रकाशित (Draft)" : "Pending (Private)"}</span>
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-slate-700 line-clamp-2">
                    <strong>{isHindi ? "बाधा: " : "Barrier: "}</strong>
                    {isHindi ? entry.barrier_hi : entry.barrier_en}
                  </p>

                  <p className="text-xs text-teal-800 line-clamp-1">
                    <strong>{isHindi ? "सुझाव: " : "Suggestion: "}</strong>
                    {isHindi ? entry.suggestion_hi : entry.suggestion_en}
                  </p>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => handleToggleVerify(entry)}
                    className={clsx(
                      "px-3 py-1.5 rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5",
                      isVerified
                        ? "bg-amber-100 hover:bg-amber-200 text-amber-900"
                        : "bg-emerald-600 hover:bg-emerald-700 text-white"
                    )}
                  >
                    <ShieldCheck className="w-3.5 h-3.5" aria-hidden="true" />
                    <span>{isVerified ? (isHindi ? "अप्रकाशित करें" : "Unverify") : (isHindi ? "सत्यापित करें" : "Verify & Publish")}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setEditingEntry({ ...entry });
                      setIsModalOpen(true);
                    }}
                    className="p-1.5 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-100 transition-colors"
                    aria-label={isHindi ? "संपादित करें" : "Edit entry"}
                  >
                    <Edit className="w-4 h-4" aria-hidden="true" />
                  </button>

                  <button
                    type="button"
                    onClick={() => setDeleteConfirmId(entry.id)}
                    className="p-1.5 rounded-lg border border-rose-200 text-rose-600 hover:bg-rose-50 transition-colors"
                    aria-label={isHindi ? "हटाएं" : "Delete entry"}
                  >
                    <Trash2 className="w-4 h-4" aria-hidden="true" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4"
        >
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full space-y-4 shadow-xl">
            <h3 className="text-base font-bold text-navy-900">
              {isHindi ? "क्या आप इसे हटाना चाहते हैं?" : "Confirm Delete"}
            </h3>
            <p className="text-xs text-slate-600">
              {isHindi
                ? "यह प्रविष्टि ट्रैकर से स्थायी रूप से हटा दी जाएगी।"
                : "This tracker entry will be permanently removed."}
            </p>
            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setDeleteConfirmId(null)}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-100"
              >
                {isHindi ? "रद्द करें" : "Cancel"}
              </button>
              <button
                type="button"
                onClick={() => handleDelete(deleteConfirmId)}
                className="px-3.5 py-1.5 rounded-lg text-xs font-bold bg-rose-600 text-white hover:bg-rose-700"
              >
                {isHindi ? "हटाएं" : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add / Edit Entry Modal */}
      {isModalOpen && editingEntry && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto"
        >
          <div className="bg-white rounded-2xl max-w-3xl w-full p-6 md:p-8 space-y-6 shadow-2xl my-8 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200">
              <h3 className="text-lg font-bold text-navy-900 flex items-center gap-2">
                <ArrowLeftRight className="w-5 h-5 text-teal-600" aria-hidden="true" />
                <span>
                  {editingEntry.id.startsWith("track-") && entries.some((e) => e.id === editingEntry.id)
                    ? (isHindi ? "ट्रैकर प्रविष्टि संपादित करें" : "Edit Tracker Entry")
                    : (isHindi ? "नई ट्रैकर प्रविष्टि जोड़ें" : "New Tracker Entry")}
                </span>
              </h3>
              <button
                type="button"
                onClick={() => {
                  setIsModalOpen(false);
                  setEditingEntry(null);
                }}
                className="p-1 rounded-lg hover:bg-slate-100 text-slate-500"
              >
                <X className="w-5 h-5" aria-hidden="true" />
              </button>
            </div>

            <form onSubmit={handleSaveEntry} className="space-y-5 text-xs">
              {/* Row 1: School & Category */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    {isHindi ? "विद्यालय चुनें *" : "Select School *"}
                  </label>
                  <select
                    value={editingEntry.schoolId}
                    onChange={(e) => {
                      const sch = DEMO_SCHOOLS.find((s) => s.id === e.target.value);
                      setEditingEntry((prev) =>
                        prev
                          ? {
                              ...prev,
                              schoolId: e.target.value,
                              schoolName_hi: sch ? sch.name_hi : prev.schoolName_hi,
                              schoolName_en: sch ? sch.name_en : prev.schoolName_en,
                            }
                          : null
                      );
                    }}
                    className="w-full border border-slate-300 rounded-lg p-2 text-slate-800"
                    required
                  >
                    {DEMO_SCHOOLS.map((s) => (
                      <option key={s.id} value={s.id}>
                        {isHindi ? s.name_hi : s.name_en}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    {isHindi ? "श्रेणी (Category) *" : "Category *"}
                  </label>
                  <select
                    value={editingEntry.category}
                    onChange={(e) =>
                      setEditingEntry((prev) =>
                        prev ? { ...prev, category: e.target.value as any } : null
                      )
                    }
                    className="w-full border border-slate-300 rounded-lg p-2 text-slate-800"
                  >
                    {CATEGORY_OPTIONS.map((c) => (
                      <option key={c.value} value={c.value}>
                        {isHindi ? c.label_hi : c.label_en}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Row 2: Stage & Verification Status */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    {isHindi ? "प्रगति चरण (Stage) *" : "Stage *"}
                  </label>
                  <select
                    value={editingEntry.stage}
                    onChange={(e) =>
                      setEditingEntry((prev) =>
                        prev ? { ...prev, stage: e.target.value as any } : null
                      )
                    }
                    className="w-full border border-slate-300 rounded-lg p-2 text-slate-800"
                  >
                    <option value="barrier_identified">
                      {isHindi ? "चरण 1: बाधा चिन्हित" : "Step 1: Barrier Identified"}
                    </option>
                    <option value="suggestion_given">
                      {isHindi ? "चरण 2: सुझाव दिया गया" : "Step 2: Suggestion Given"}
                    </option>
                    <option value="improvement_verified">
                      {isHindi ? "चरण 3: सुधार सत्यापित" : "Step 3: Improvement Verified"}
                    </option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    {isHindi ? "सार्वजनिक सत्यापन स्थिति *" : "Verification Status *"}
                  </label>
                  <select
                    value={editingEntry.verificationStatus}
                    onChange={(e) =>
                      setEditingEntry((prev) =>
                        prev ? { ...prev, verificationStatus: e.target.value as any } : null
                      )
                    }
                    className="w-full border border-slate-300 rounded-lg p-2 text-slate-800 font-bold"
                  >
                    <option value="verified">
                      {isHindi ? "सत्यापित (सार्वजनिक रूप से दर्शनीय)" : "Verified (Publicly Visible)"}
                    </option>
                    <option value="pending">
                      {isHindi ? "लंबित / ड्राफ्ट (केवल व्यवस्थापक हेतु)" : "Pending / Draft (Admin Only)"}
                    </option>
                  </select>
                </div>
              </div>

              {/* Barrier Description */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    {isHindi ? "चिन्हित अवरोध (हिन्दी) *" : "Barrier (Hindi) *"}
                  </label>
                  <textarea
                    rows={2}
                    value={editingEntry.barrier_hi}
                    onChange={(e) =>
                      setEditingEntry((prev) => (prev ? { ...prev, barrier_hi: e.target.value } : null))
                    }
                    className="w-full border border-slate-300 rounded-lg p-2 text-slate-800"
                    required
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    {isHindi ? "चिन्हित अवरोध (English) *" : "Barrier (English) *"}
                  </label>
                  <textarea
                    rows={2}
                    value={editingEntry.barrier_en}
                    onChange={(e) =>
                      setEditingEntry((prev) => (prev ? { ...prev, barrier_en: e.target.value } : null))
                    }
                    className="w-full border border-slate-300 rounded-lg p-2 text-slate-800"
                    required
                  />
                </div>
              </div>

              {/* Suggestion Description */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    {isHindi ? "सुझाव (हिन्दी) *" : "Suggestion (Hindi) *"}
                  </label>
                  <textarea
                    rows={2}
                    value={editingEntry.suggestion_hi}
                    onChange={(e) =>
                      setEditingEntry((prev) => (prev ? { ...prev, suggestion_hi: e.target.value } : null))
                    }
                    className="w-full border border-slate-300 rounded-lg p-2 text-slate-800"
                    required
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    {isHindi ? "सुझाव (English) *" : "Suggestion (English) *"}
                  </label>
                  <textarea
                    rows={2}
                    value={editingEntry.suggestion_en}
                    onChange={(e) =>
                      setEditingEntry((prev) => (prev ? { ...prev, suggestion_en: e.target.value } : null))
                    }
                    className="w-full border border-slate-300 rounded-lg p-2 text-slate-800"
                    required
                  />
                </div>
              </div>

              {/* Improvement Details (Optional if in progress) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    {isHindi ? "सत्यापित सुधार विवरण (हिन्दी)" : "Improvement Achieved (Hindi)"}
                  </label>
                  <textarea
                    rows={2}
                    value={editingEntry.improvement_hi || ""}
                    onChange={(e) =>
                      setEditingEntry((prev) => (prev ? { ...prev, improvement_hi: e.target.value } : null))
                    }
                    className="w-full border border-slate-300 rounded-lg p-2 text-slate-800"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    {isHindi ? "सत्यापित सुधार विवरण (English)" : "Improvement Achieved (English)"}
                  </label>
                  <textarea
                    rows={2}
                    value={editingEntry.improvement_en || ""}
                    onChange={(e) =>
                      setEditingEntry((prev) => (prev ? { ...prev, improvement_en: e.target.value } : null))
                    }
                    className="w-full border border-slate-300 rounded-lg p-2 text-slate-800"
                  />
                </div>
              </div>

              {/* Photos & Dates */}
              <div className="p-4 bg-slate-50 rounded-xl space-y-4 border border-slate-200">
                <h4 className="font-bold text-navy-900">
                  {isHindi ? "तस्वीरें एवं तिथियां" : "Photographs & Dates"}
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Before Photo */}
                  <div className="space-y-2">
                    <label className="block font-bold text-rose-800">
                      {isHindi ? "पहले की फोटो URL *" : "Before Photo URL *"}
                    </label>
                    <input
                      type="url"
                      value={editingEntry.beforePhoto.url}
                      onChange={(e) =>
                        setEditingEntry((prev) =>
                          prev
                            ? {
                                ...prev,
                                beforePhoto: { ...prev.beforePhoto, url: e.target.value },
                              }
                            : null
                        )
                      }
                      className="w-full border border-slate-300 rounded-lg p-2 text-slate-800"
                      required
                    />
                    <input
                      type="text"
                      placeholder={isHindi ? "फोटो कैप्शन (हिन्दी)" : "Caption (Hindi)"}
                      value={editingEntry.beforePhoto.caption_hi}
                      onChange={(e) =>
                        setEditingEntry((prev) =>
                          prev
                            ? {
                                ...prev,
                                beforePhoto: { ...prev.beforePhoto, caption_hi: e.target.value },
                              }
                            : null
                        )
                      }
                      className="w-full border border-slate-300 rounded-lg p-2 text-slate-800"
                    />
                    <input
                      type="date"
                      value={editingEntry.dates.identifiedDate}
                      onChange={(e) =>
                        setEditingEntry((prev) =>
                          prev
                            ? {
                                ...prev,
                                dates: { ...prev.dates, identifiedDate: e.target.value },
                                beforePhoto: { ...prev.beforePhoto, date: e.target.value },
                              }
                            : null
                        )
                      }
                      className="w-full border border-slate-300 rounded-lg p-2 text-slate-800"
                    />
                  </div>

                  {/* After Photo */}
                  <div className="space-y-2">
                    <label className="block font-bold text-emerald-800">
                      {isHindi ? "सुधार के बाद की फोटो URL" : "After Photo URL (Optional)"}
                    </label>
                    <input
                      type="url"
                      value={editingEntry.afterPhoto?.url || ""}
                      onChange={(e) =>
                        setEditingEntry((prev) =>
                          prev
                            ? {
                                ...prev,
                                afterPhoto: {
                                  url: e.target.value,
                                  caption_hi: prev.afterPhoto?.caption_hi || "सुधार के बाद की स्थिति",
                                  caption_en: prev.afterPhoto?.caption_en || "State after improvement",
                                  date: prev.afterPhoto?.date || new Date().toISOString().split("T")[0],
                                },
                              }
                            : null
                        )
                      }
                      className="w-full border border-slate-300 rounded-lg p-2 text-slate-800"
                    />
                    <input
                      type="text"
                      placeholder={isHindi ? "फोटो कैप्शन (हिन्दी)" : "Caption (Hindi)"}
                      value={editingEntry.afterPhoto?.caption_hi || ""}
                      onChange={(e) =>
                        setEditingEntry((prev) =>
                          prev && prev.afterPhoto
                            ? {
                                ...prev,
                                afterPhoto: { ...prev.afterPhoto, caption_hi: e.target.value },
                              }
                            : null
                        )
                      }
                      className="w-full border border-slate-300 rounded-lg p-2 text-slate-800"
                    />
                    <input
                      type="date"
                      value={editingEntry.dates.improvedDate || ""}
                      onChange={(e) =>
                        setEditingEntry((prev) =>
                          prev
                            ? {
                                ...prev,
                                dates: { ...prev.dates, improvedDate: e.target.value },
                                afterPhoto: prev.afterPhoto
                                  ? { ...prev.afterPhoto, date: e.target.value }
                                  : undefined,
                              }
                            : null
                        )
                      }
                      className="w-full border border-slate-300 rounded-lg p-2 text-slate-800"
                    />
                  </div>
                </div>
              </div>

              {/* Statutory Reference & Verifier */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    {isHindi ? "वैधानिक मानक संदर्भ (Clause)" : "Statutory Standard Reference"}
                  </label>
                  <input
                    type="text"
                    value={editingEntry.statutoryReference || ""}
                    onChange={(e) =>
                      setEditingEntry((prev) =>
                        prev ? { ...prev, statutoryReference: e.target.value } : null
                      )
                    }
                    placeholder="e.g. Accessibility Code 2024, Clause 4.2"
                    className="w-full border border-slate-300 rounded-lg p-2 text-slate-800"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    {isHindi ? "प्रमाणितकर्ता का नाम/पद" : "Verified By (Researcher / Fellowship)"}
                  </label>
                  <input
                    type="text"
                    value={editingEntry.verifiedBy || ""}
                    onChange={(e) =>
                      setEditingEntry((prev) =>
                        prev ? { ...prev, verifiedBy: e.target.value } : null
                      )
                    }
                    className="w-full border border-slate-300 rounded-lg p-2 text-slate-800"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => {
                    setIsModalOpen(false);
                    setEditingEntry(null);
                  }}
                  className="px-4 py-2 rounded-lg text-slate-600 font-semibold hover:bg-slate-100"
                >
                  {isHindi ? "रद्द करें" : "Cancel"}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-teal-600 hover:bg-teal-700 text-white font-bold flex items-center gap-2"
                >
                  <Save className="w-4 h-4" aria-hidden="true" />
                  <span>{isHindi ? "सहेजें (Save)" : "Save Entry"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
