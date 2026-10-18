"use client";

import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Modal } from "@/components/ui/Modal";
import {
  MessageSquare,
  Search,
  RefreshCw,
  Mail,
  Phone,
  User,
  Clock,
  CheckCircle2,
  AlertCircle,
  Trash2,
  Eye,
  Download,
  Filter,
  Check,
  Send,
  Sparkles,
  Inbox,
  ShieldCheck,
  ExternalLink,
  MessageCircle,
} from "lucide-react";
import { db } from "@/lib/firebase/firestore";
import {
  collection,
  onSnapshot,
  doc,
  updateDoc,
  deleteDoc,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";

export interface FeedbackItem {
  id: string;
  name: string;
  email: string;
  phone?: string | null;
  role: string;
  message: string;
  createdAt: string;
  status: "unread" | "read" | "resolved";
  adminNotes?: string;
  _localBackup?: boolean;
}

const DEFAULT_FEEDBACK_ITEMS: FeedbackItem[] = [
  {
    id: "demo-fb-1",
    name: "Ramesh Sharma",
    email: "ramesh.sharma@danapurschool.edu.in",
    phone: "9876543210",
    role: "teacher",
    message: "हमारे दानापुर विद्यालय में रैंप और सीडब्ल्यूएसएन शौचालय मानकों को लेकर एक कार्यशाला आयोजित करना चाहते हैं। क्या शोध टीम से कोई गाइडेंस मिल सकती है?",
    createdAt: "2026-10-17T11:30:00.000Z",
    status: "unread",
  },
  {
    id: "demo-fb-2",
    name: "Pooja Verma",
    email: "pooja.verma82@gmail.com",
    phone: "9812345678",
    role: "parent",
    message: "मेरी 9 वर्षीय बेटी व्हीलचेयर यूजर है। दानापुर कैंटोनमेंट के प्राइमरी स्कूल में भूतल पर कक्षाएं कराने के लिए आरपीडब्ल्यूडी एक्ट 2016 के तहत क्या नियम हैं?",
    createdAt: "2026-10-15T09:15:00.000Z",
    status: "read",
    adminNotes: "Sent guideline PDF link for RPwD Act 2016 Reasonable Accommodations.",
  },
  {
    id: "demo-fb-3",
    name: "Amit Kumar",
    email: "amit.danapur.student@outlook.com",
    phone: "9701234567",
    role: "student",
    message: "स्कूल के मुख्य गेट पर रैंप तो है लेकिन बहुत खड़ी ढलान है, बिना किसी की मदद के ऊपर नहीं जा सकते। कृपया अपनी रिपोर्ट में इस पर ध्यान दें।",
    createdAt: "2026-10-12T14:40:00.000Z",
    status: "resolved",
    adminNotes: "Survey audit verified: Slope is 1:8 instead of 1:12 standard. Logged in barrier tracker.",
  },
  {
    id: "demo-fb-4",
    name: "Sunita Kumari",
    email: "sunita.advocate@biharaccess.org",
    phone: "9431098765",
    role: "advocate",
    message: "सुगम्य शिक्षा बिहार की शोध पहल अत्यंत सराहनीय है। पटना जिले के ग्रामीण प्रखंडों में स्वयंसेवकों को सर्वे ट्रेनिंग देने हेतु हम सहयोग करना चाहते हैं।",
    createdAt: "2026-10-10T16:20:00.000Z",
    status: "read",
  },
];

const LOCAL_STORAGE_KEY = "ssb_local_feedback_submissions";

interface FeedbackAdminTabProps {
  isHindi: boolean;
}

export function FeedbackAdminTab({ isHindi }: FeedbackAdminTabProps) {
  const [feedbacks, setFeedbacks] = useState<FeedbackItem[]>(DEFAULT_FEEDBACK_ITEMS);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "unread" | "read" | "resolved">("all");
  const [roleFilter, setRoleFilter] = useState("all");

  // Selected feedback for inspection modal
  const [selectedFeedback, setSelectedFeedback] = useState<FeedbackItem | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [adminNoteInput, setAdminNoteInput] = useState("");

  // Delete modal state
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // Success / notification message
  const [successMessage, setSuccessMessage] = useState("");

  // Helper to load from local storage
  const loadLocalFeedbacks = (): FeedbackItem[] => {
    try {
      const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (!raw) return [];
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        return parsed.map((item: any) => ({
          id: item.id || "fb_" + Math.random().toString(36).slice(2, 8),
          name: item.name || "Anonymous",
          email: item.email || "",
          phone: item.phone || null,
          role: item.role || "other",
          message: item.message || "",
          createdAt: item.createdAt || new Date().toISOString(),
          status: item.status || "unread",
          adminNotes: item.adminNotes || "",
          _localBackup: true,
        }));
      }
    } catch (e) {
      console.warn("Could not read local feedback submissions:", e);
    }
    return [];
  };

  // Sync with Firestore & localStorage
  useEffect(() => {
    let unsubscribe: (() => void) | undefined;

    const syncFeedbacks = () => {
      setLoading(true);
      const localItems = loadLocalFeedbacks();

      if (!db) {
        // Fallback to local storage + defaults
        const existingIds = new Set(localItems.map((i) => i.id));
        const merged = [
          ...localItems,
          ...DEFAULT_FEEDBACK_ITEMS.filter((d) => !existingIds.has(d.id)),
        ];
        setFeedbacks(merged);
        setLoading(false);
        return;
      }

      try {
        const q = collection(db, "contactSubmissions");
        unsubscribe = onSnapshot(
          q,
          (snapshot) => {
            const firestoreItems: FeedbackItem[] = snapshot.docs.map((docSnap) => {
              const data = docSnap.data();
              let createdStr = new Date().toISOString();
              if (data.createdAt?.toDate) {
                createdStr = data.createdAt.toDate().toISOString();
              } else if (typeof data.createdAt === "string") {
                createdStr = data.createdAt;
              }
              return {
                id: docSnap.id,
                name: data.name || "Anonymous",
                email: data.email || "",
                phone: data.phone || null,
                role: data.role || "other",
                message: data.message || "",
                createdAt: createdStr,
                status: data.status || "unread",
                adminNotes: data.adminNotes || "",
              };
            });

            const freshLocal = loadLocalFeedbacks();
            const firestoreIds = new Set(firestoreItems.map((i) => i.id));
            const mergedLocal = freshLocal.filter((i) => !firestoreIds.has(i.id));

            // If empty, add defaults
            const currentIds = new Set([...firestoreItems.map((i) => i.id), ...mergedLocal.map((i) => i.id)]);
            const seedDefaults = DEFAULT_FEEDBACK_ITEMS.filter((d) => !currentIds.has(d.id));

            const allMerged = [...firestoreItems, ...mergedLocal, ...seedDefaults];
            allMerged.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

            setFeedbacks(allMerged);
            setLoading(false);
          },
          (err) => {
            console.warn("Firestore contactSubmissions listener error, using local:", err);
            const freshLocal = loadLocalFeedbacks();
            const existingIds = new Set(freshLocal.map((i) => i.id));
            const merged = [
              ...freshLocal,
              ...DEFAULT_FEEDBACK_ITEMS.filter((d) => !existingIds.has(d.id)),
            ];
            setFeedbacks(merged);
            setLoading(false);
          }
        );
      } catch (err) {
        console.warn("Firestore init error on contactSubmissions:", err);
        const freshLocal = loadLocalFeedbacks();
        const existingIds = new Set(freshLocal.map((i) => i.id));
        setFeedbacks([...freshLocal, ...DEFAULT_FEEDBACK_ITEMS.filter((d) => !existingIds.has(d.id))]);
        setLoading(false);
      }
    };

    syncFeedbacks();

    // Listen for custom event triggered when form is submitted on /about
    const handleNewSubmission = () => {
      const freshLocal = loadLocalFeedbacks();
      setFeedbacks((prev) => {
        const existingIds = new Set(prev.map((i) => i.id));
        const newOnes = freshLocal.filter((i) => !existingIds.has(i.id));
        return [...newOnes, ...prev];
      });
      showSuccess(isHindi ? "नया संदेश प्राप्त हुआ!" : "New feedback received!");
    };

    window.addEventListener("ssb_feedback_submitted", handleNewSubmission);
    window.addEventListener("storage", handleNewSubmission);

    return () => {
      if (unsubscribe) unsubscribe();
      window.removeEventListener("ssb_feedback_submitted", handleNewSubmission);
      window.removeEventListener("storage", handleNewSubmission);
    };
  }, [isHindi]);

  const showSuccess = (msg: string) => {
    setSuccessMessage(msg);
    setTimeout(() => setSuccessMessage(""), 4000);
  };

  // Status Updater
  const handleUpdateStatus = async (item: FeedbackItem, newStatus: "unread" | "read" | "resolved") => {
    // 1. Update in local state
    setFeedbacks((prev) =>
      prev.map((f) => (f.id === item.id ? { ...f, status: newStatus } : f))
    );

    if (selectedFeedback && selectedFeedback.id === item.id) {
      setSelectedFeedback((prev) => (prev ? { ...prev, status: newStatus } : null));
    }

    // 2. Update in localStorage
    try {
      const local = loadLocalFeedbacks();
      const updated = local.map((f) => (f.id === item.id ? { ...f, status: newStatus } : f));
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
    } catch (e) {}

    // 3. Update in Firestore if present
    if (db && !item._localBackup && !item.id.startsWith("demo-")) {
      try {
        await updateDoc(doc(db, "contactSubmissions", item.id), { status: newStatus });
      } catch (e) {
        console.warn("Could not update status in Firestore:", e);
      }
    }

    showSuccess(
      isHindi
        ? `स्थिति को "${newStatus === "resolved" ? "समाधानित" : newStatus === "read" ? "पढ़ा गया" : "अपठित"}" में बदला गया।`
        : `Status updated to ${newStatus}.`
    );
  };

  // Save Admin Notes
  const handleSaveAdminNote = async () => {
    if (!selectedFeedback) return;
    const noteText = adminNoteInput.trim();

    setFeedbacks((prev) =>
      prev.map((f) => (f.id === selectedFeedback.id ? { ...f, adminNotes: noteText } : f))
    );
    setSelectedFeedback((prev) => (prev ? { ...prev, adminNotes: noteText } : null));

    // Update in localStorage
    try {
      const local = loadLocalFeedbacks();
      const updated = local.map((f) =>
        f.id === selectedFeedback.id ? { ...f, adminNotes: noteText } : f
      );
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
    } catch (e) {}

    // Update in Firestore
    if (db && !selectedFeedback._localBackup && !selectedFeedback.id.startsWith("demo-")) {
      try {
        await updateDoc(doc(db, "contactSubmissions", selectedFeedback.id), {
          adminNotes: noteText,
        });
      } catch (e) {
        console.warn("Could not save note in Firestore:", e);
      }
    }

    showSuccess(isHindi ? "शोधकर्ता नोट सुरक्षित किया गया।" : "Internal note saved.");
  };

  // Delete Feedback
  const handleDeleteFeedback = async (id: string) => {
    // Remove from state
    setFeedbacks((prev) => prev.filter((f) => f.id !== id));
    if (selectedFeedback?.id === id) {
      setSelectedFeedback(null);
      setIsViewModalOpen(false);
    }
    setDeleteConfirmId(null);

    // Remove from localStorage
    try {
      const local = loadLocalFeedbacks();
      const filtered = local.filter((f) => f.id !== id);
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(filtered));
    } catch (e) {}

    // Remove from Firestore
    if (db && !id.startsWith("demo-")) {
      try {
        await deleteDoc(doc(db, "contactSubmissions", id));
      } catch (e) {
        console.warn("Could not delete from Firestore:", e);
      }
    }

    showSuccess(isHindi ? "संदेश सफलतापूर्वक हटा दिया गया।" : "Feedback message deleted.");
  };

  // Mark all unread as read
  const handleMarkAllRead = async () => {
    setFeedbacks((prev) => prev.map((f) => ({ ...f, status: f.status === "unread" ? "read" : f.status })));
    try {
      const local = loadLocalFeedbacks();
      const updated = local.map((f) => ({ ...f, status: f.status === "unread" ? "read" : f.status }));
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
    } catch (e) {}
    showSuccess(isHindi ? "सभी संदेशों को 'पढ़ा गया' के रूप में चिह्नित किया गया।" : "All marked as read.");
  };

  // Add Sample Feedback for testing
  const handleAddSampleFeedback = () => {
    const newSample: FeedbackItem = {
      id: "fb_" + Date.now(),
      name: isHindi ? "आलोक कुमार (परीक्षण)" : "Alok Kumar (Test)",
      email: "alok.danapur@example.com",
      phone: "9876501234",
      role: "parent",
      message: isHindi
        ? "यह एक परीक्षण फीडबैक संदेश है। कृपया दानापुर प्राथमिक विद्यालय के सुगम्यता स्कोरकार्ड को अद्यतन करें।"
        : "This is a live test feedback submission verifying the admin real-time sync.",
      createdAt: new Date().toISOString(),
      status: "unread",
      _localBackup: true,
    };

    try {
      const local = loadLocalFeedbacks();
      local.unshift(newSample);
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(local));
    } catch (e) {}

    setFeedbacks((prev) => [newSample, ...prev]);
    showSuccess(isHindi ? "नमूना फीडबैक संदेश जोड़ा गया!" : "Sample test feedback added!");
  };

  // Export to CSV
  const handleExportCSV = () => {
    const headers = ["ID", "Date & Time", "Name", "Email", "Phone", "Role", "Status", "Message", "Admin Notes"];
    const rows = filteredFeedbacks.map((f) => [
      `"${f.id}"`,
      `"${new Date(f.createdAt).toLocaleString(isHindi ? "hi-IN" : "en-IN")}"`,
      `"${(f.name || "").replace(/"/g, '""')}"`,
      `"${(f.email || "").replace(/"/g, '""')}"`,
      `"${(f.phone || "").replace(/"/g, '""')}"`,
      `"${f.role}"`,
      `"${f.status}"`,
      `"${(f.message || "").replace(/"/g, '""').replace(/\n/g, " ")}"`,
      `"${(f.adminNotes || "").replace(/"/g, '""')}"`,
    ]);

    const csvContent = "\uFEFF" + [headers.join(","), ...rows.map((r) => r.join(","))].join("\r\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `danapur_feedback_inquiries_${new Date().toISOString().split("T")[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Filtered list
  const filteredFeedbacks = feedbacks.filter((f) => {
    if (statusFilter !== "all" && f.status !== statusFilter) return false;
    if (roleFilter !== "all" && f.role !== roleFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      const matchName = f.name?.toLowerCase().includes(q);
      const matchEmail = f.email?.toLowerCase().includes(q);
      const matchPhone = f.phone?.includes(q);
      const matchMsg = f.message?.toLowerCase().includes(q);
      return matchName || matchEmail || matchPhone || matchMsg;
    }
    return true;
  });

  // Role translation helper
  const getRoleLabel = (role: string) => {
    switch (role) {
      case "student":
        return isHindi ? "दिव्यांग विद्यार्थी" : "Student";
      case "parent":
        return isHindi ? "अभिभावक" : "Parent";
      case "teacher":
        return isHindi ? "शिक्षक / विशेष शिक्षक" : "Teacher";
      case "advocate":
        return isHindi ? "कार्यकर्ता / अधिवक्ता" : "Advocate";
      case "official":
        return isHindi ? "शिक्षा अधिकारी" : "Official";
      default:
        return isHindi ? "अन्य" : "Other";
    }
  };

  // Stats calculation
  const totalCount = feedbacks.length;
  const unreadCount = feedbacks.filter((f) => f.status === "unread").length;
  const resolvedCount = feedbacks.filter((f) => f.status === "resolved").length;
  const parentStudentCount = feedbacks.filter((f) => f.role === "parent" || f.role === "student").length;

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-[#0B2D52] flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-teal-600" aria-hidden="true" />
              <span>{isHindi ? "प्रतिक्रिया एवं संदेश प्रबंधन" : "Feedback & Inquiries Inbox"}</span>
            </h2>
            {unreadCount > 0 && (
              <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-900 border border-amber-300 animate-pulse">
                {unreadCount} {isHindi ? "नए अपठित" : "new unread"}
              </span>
            )}
          </div>
          <p className="text-xs text-slate-500">
            {isHindi
              ? "वेबसाइट के अबाउट एवं संपर्क फॉर्म से प्राप्त सभी सुझाव, शोध प्रश्न एवं सामुदायिक प्रतिक्रियाएं।"
              : "All inquiries, research queries, and community feedback submitted via the website contact form."}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {unreadCount > 0 && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleMarkAllRead}
              className="text-xs text-slate-700"
            >
              <Check className="w-3.5 h-3.5 mr-1" />
              {isHindi ? "सभी को पढ़ा हुआ चिह्नित करें" : "Mark All Read"}
            </Button>
          )}

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleAddSampleFeedback}
            className="text-xs text-teal-800 border-teal-300 bg-teal-50/50 hover:bg-teal-100/50"
          >
            <Sparkles className="w-3.5 h-3.5 mr-1 text-teal-600" />
            {isHindi ? "+ टेस्ट संदेश जोड़ें" : "+ Add Test Feedback"}
          </Button>

          <Button
            type="button"
            variant="primary"
            size="sm"
            onClick={handleExportCSV}
            leftIcon={<Download className="w-3.5 h-3.5" />}
            className="text-xs bg-teal-700 hover:bg-teal-800 text-white"
          >
            {isHindi ? "CSV एक्सपोर्ट" : "Export CSV"}
          </Button>
        </div>
      </div>

      {/* Success alert banner */}
      {successMessage && (
        <div
          role="status"
          className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs sm:text-sm flex items-center gap-2 shadow-xs transition-all animate-fadeIn"
        >
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" aria-hidden="true" />
          <span className="font-medium">{successMessage}</span>
        </div>
      )}

      {/* Top 4 Stats Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4 border-slate-200 bg-white">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              {isHindi ? "कुल संदेश" : "Total Inquiries"}
            </span>
            <Inbox className="w-4 h-4 text-slate-400" />
          </div>
          <div className="text-2xl font-extrabold text-[#0B2D52] mt-2">{totalCount}</div>
          <div className="text-[11px] text-slate-500 mt-1">
            {isHindi ? "दानापुर शोध व जनसंपर्क" : "Danapur research inquiries"}
          </div>
        </Card>

        <Card className={`p-4 border-slate-200 ${unreadCount > 0 ? "bg-amber-50/70 border-amber-300" : "bg-white"}`}>
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-amber-800 uppercase tracking-wider">
              {isHindi ? "अपठित संदेश" : "Unread Messages"}
            </span>
            <Clock className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-2xl font-extrabold text-amber-900 mt-2">{unreadCount}</div>
          <div className="text-[11px] text-amber-700 mt-1">
            {isHindi ? "समीक्षा एवं उत्तर प्रतीक्षित" : "Pending admin review"}
          </div>
        </Card>

        <Card className="p-4 border-slate-200 bg-white">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-teal-800 uppercase tracking-wider">
              {isHindi ? "विद्यार्थी व अभिभावक" : "Parents & Students"}
            </span>
            <User className="w-4 h-4 text-teal-600" />
          </div>
          <div className="text-2xl font-extrabold text-teal-900 mt-2">{parentStudentCount}</div>
          <div className="text-[11px] text-slate-500 mt-1">
            {isHindi ? "समुदाय की प्रत्यक्ष आवाज़" : "Direct community voice"}
          </div>
        </Card>

        <Card className="p-4 border-slate-200 bg-white">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-emerald-800 uppercase tracking-wider">
              {isHindi ? "समाधानित / पूर्ण" : "Resolved / Actioned"}
            </span>
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-extrabold text-emerald-900 mt-2">{resolvedCount}</div>
          <div className="text-[11px] text-slate-500 mt-1">
            {isHindi ? "उत्तर दिए गए संदेश" : "Replied / Closed"}
          </div>
        </Card>
      </div>

      {/* Filter and Search Bar */}
      <Card className="p-4 border-slate-200 bg-white">
        <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={
                isHindi
                  ? "नाम, ईमेल, फोन नंबर या संदेश के शब्दों से खोजें..."
                  : "Search by name, email, phone, or message keywords..."
              }
              className="w-full pl-9 pr-3.5 py-2 text-xs sm:text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-600 focus:border-teal-600"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            )}
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-2">
            <label className="text-xs font-bold text-slate-600 shrink-0">
              {isHindi ? "स्थिति:" : "Status:"}
            </label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="px-3 py-2 text-xs sm:text-sm rounded-lg border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-teal-600"
            >
              <option value="all">{isHindi ? "सभी स्थितियां" : "All Status"}</option>
              <option value="unread">{isHindi ? "केवल अपठित (Unread)" : "Unread Only"}</option>
              <option value="read">{isHindi ? "पढ़ा गया (Read)" : "Read"}</option>
              <option value="resolved">{isHindi ? "समाधानित (Resolved)" : "Resolved"}</option>
            </select>
          </div>

          {/* Role Filter */}
          <div className="flex items-center gap-2">
            <label className="text-xs font-bold text-slate-600 shrink-0">
              {isHindi ? "भूमिका:" : "Role:"}
            </label>
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="px-3 py-2 text-xs sm:text-sm rounded-lg border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-teal-600"
            >
              <option value="all">{isHindi ? "सभी भूमिकाएं" : "All Roles"}</option>
              <option value="parent">{isHindi ? "अभिभावक (Parent)" : "Parent"}</option>
              <option value="student">{isHindi ? "दिव्यांग विद्यार्थी (Student)" : "Student"}</option>
              <option value="teacher">{isHindi ? "शिक्षक (Teacher)" : "Teacher"}</option>
              <option value="advocate">{isHindi ? "अधिवक्ता / संस्था" : "Advocate"}</option>
              <option value="official">{isHindi ? "अधिकारी (Official)" : "Official"}</option>
              <option value="other">{isHindi ? "अन्य (Other)" : "Other"}</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Main Feedback List / Table */}
      <Card className="border-slate-200 overflow-hidden bg-white">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <span className="text-xs font-bold text-slate-700">
            {isHindi ? `दिखाए जा रहे संदेश: ${filteredFeedbacks.length}` : `Showing ${filteredFeedbacks.length} feedback submissions`}
          </span>
          {(searchQuery || statusFilter !== "all" || roleFilter !== "all") && (
            <button
              type="button"
              onClick={() => {
                setSearchQuery("");
                setStatusFilter("all");
                setRoleFilter("all");
              }}
              className="text-xs text-teal-700 hover:text-teal-900 font-semibold"
            >
              {isHindi ? "फ़िल्टर हटाएं" : "Reset Filters"}
            </button>
          )}
        </div>

        {filteredFeedbacks.length === 0 ? (
          <div className="py-16 text-center text-slate-500 space-y-3">
            <Inbox className="w-10 h-10 text-slate-300 mx-auto" />
            <p className="text-sm font-semibold">
              {isHindi ? "कोई संदेश नहीं मिला।" : "No feedback messages found matching your criteria."}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 text-xs font-bold uppercase tracking-wider">
                  <th className="py-3 px-4">{isHindi ? "प्रेषक एवं भूमिका" : "Sender & Role"}</th>
                  <th className="py-3 px-4">{isHindi ? "संपर्क" : "Contact"}</th>
                  <th className="py-3 px-4">{isHindi ? "संदेश पूर्वावलोकन" : "Message Preview"}</th>
                  <th className="py-3 px-4">{isHindi ? "तिथि" : "Date"}</th>
                  <th className="py-3 px-4">{isHindi ? "स्थिति" : "Status"}</th>
                  <th className="py-3 px-4 text-right">{isHindi ? "कार्रवाई" : "Actions"}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredFeedbacks.map((item) => {
                  const isUnread = item.status === "unread";
                  return (
                    <tr
                      key={item.id}
                      className={`hover:bg-slate-50/80 transition-colors ${
                        isUnread ? "bg-amber-50/40 font-medium" : ""
                      }`}
                    >
                      {/* Sender & Role */}
                      <td className="py-3.5 px-4 align-top">
                        <div className="flex items-start gap-2.5">
                          <div className="w-8 h-8 rounded-full bg-teal-100 text-teal-800 font-bold flex items-center justify-center text-xs shrink-0 border border-teal-200 mt-0.5">
                            {(item.name || "U").charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <div className="font-bold text-[#0B2D52] flex items-center gap-1.5">
                              <span>{item.name}</span>
                              {isUnread && (
                                <span className="w-2 h-2 rounded-full bg-amber-500 shrink-0" title="Unread" />
                              )}
                            </div>
                            <span className="inline-block mt-0.5 px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-100 text-slate-700 border border-slate-200">
                              {getRoleLabel(item.role)}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Contact */}
                      <td className="py-3.5 px-4 align-top space-y-1">
                        <a
                          href={`mailto:${item.email}`}
                          className="flex items-center gap-1.5 text-xs text-teal-700 hover:text-teal-900 hover:underline"
                        >
                          <Mail className="w-3.5 h-3.5 shrink-0 text-slate-400" />
                          <span className="truncate max-w-[160px]">{item.email}</span>
                        </a>
                        {item.phone && (
                          <a
                            href={`tel:${item.phone}`}
                            className="flex items-center gap-1.5 text-xs text-slate-600 hover:text-slate-900"
                          >
                            <Phone className="w-3.5 h-3.5 shrink-0 text-slate-400" />
                            <span>{item.phone}</span>
                          </a>
                        )}
                      </td>

                      {/* Message Preview */}
                      <td className="py-3.5 px-4 align-top max-w-xs">
                        <p className="line-clamp-2 text-slate-700 text-xs sm:text-sm">
                          {item.message}
                        </p>
                        {item.adminNotes && (
                          <span className="inline-flex items-center gap-1 mt-1 text-[11px] text-teal-800 bg-teal-50 px-1.5 py-0.5 rounded border border-teal-200">
                            📝 {item.adminNotes}
                          </span>
                        )}
                      </td>

                      {/* Date */}
                      <td className="py-3.5 px-4 align-top text-xs text-slate-500 whitespace-nowrap">
                        <div className="flex items-center gap-1">
                          <Clock className="w-3 h-3 text-slate-400" />
                          <span>{new Date(item.createdAt).toLocaleDateString(isHindi ? "hi-IN" : "en-IN")}</span>
                        </div>
                        <span className="text-[10px] text-slate-400">
                          {new Date(item.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                        </span>
                      </td>

                      {/* Status Badge */}
                      <td className="py-3.5 px-4 align-top whitespace-nowrap">
                        {item.status === "unread" ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-900 border border-amber-300">
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-600 animate-pulse" />
                            {isHindi ? "अपठित" : "Unread"}
                          </span>
                        ) : item.status === "resolved" ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-900 border border-emerald-300">
                            <CheckCircle2 className="w-3 h-3 text-emerald-700" />
                            {isHindi ? "समाधानित" : "Resolved"}
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-800 border border-slate-300">
                            <Check className="w-3 h-3 text-slate-500" />
                            {isHindi ? "पढ़ा गया" : "Read"}
                          </span>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 align-top text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedFeedback(item);
                              setAdminNoteInput(item.adminNotes || "");
                              setIsViewModalOpen(true);
                              if (item.status === "unread") {
                                handleUpdateStatus(item, "read");
                              }
                            }}
                            className="p-1.5 rounded-lg text-slate-600 hover:text-teal-700 hover:bg-teal-50 transition-colors"
                            title={isHindi ? "पूर्ण विवरण देखें" : "View Details"}
                          >
                            <Eye className="w-4 h-4" />
                          </button>

                          {item.status !== "resolved" ? (
                            <button
                              type="button"
                              onClick={() => handleUpdateStatus(item, "resolved")}
                              className="p-1.5 rounded-lg text-emerald-700 hover:bg-emerald-50 transition-colors"
                              title={isHindi ? "समाधानित के रूप में चिह्नित करें" : "Mark as Resolved"}
                            >
                              <ShieldCheck className="w-4 h-4" />
                            </button>
                          ) : (
                            <button
                              type="button"
                              onClick={() => handleUpdateStatus(item, "read")}
                              className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 transition-colors"
                              title={isHindi ? "पुनः खोलें" : "Reopen as Read"}
                            >
                              <RefreshCw className="w-3.5 h-3.5" />
                            </button>
                          )}

                          <button
                            type="button"
                            onClick={() => setDeleteConfirmId(item.id)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-red-700 hover:bg-red-50 transition-colors"
                            title={isHindi ? "हटाएं" : "Delete"}
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* Inspection & Reply Modal */}
      {selectedFeedback && (
        <Modal
          isOpen={isViewModalOpen}
          onClose={() => setIsViewModalOpen(false)}
          title={isHindi ? "फीडबैक संदेश विवरण" : "Feedback Message Details"}
          size="lg"
        >
          <div className="space-y-5 text-left">
            {/* Sender Metadata Strip */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs sm:text-sm">
              <div>
                <span className="text-slate-400 text-xs block">{isHindi ? "प्रेषक का नाम" : "Sender Name"}</span>
                <span className="font-bold text-[#0B2D52] text-base">{selectedFeedback.name}</span>
                <div className="mt-1">
                  <span className="px-2 py-0.5 rounded text-xs font-semibold bg-teal-100 text-teal-800">
                    {getRoleLabel(selectedFeedback.role)}
                  </span>
                </div>
              </div>

              <div className="space-y-1">
                <span className="text-slate-400 text-xs block">{isHindi ? "संपर्क जानकारी" : "Contact Details"}</span>
                <a
                  href={`mailto:${selectedFeedback.email}`}
                  className="flex items-center gap-1.5 text-teal-700 hover:underline font-medium"
                >
                  <Mail className="w-3.5 h-3.5" />
                  <span>{selectedFeedback.email}</span>
                </a>
                {selectedFeedback.phone && (
                  <a
                    href={`tel:${selectedFeedback.phone}`}
                    className="flex items-center gap-1.5 text-slate-700 hover:underline"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>{selectedFeedback.phone}</span>
                  </a>
                )}
                <div className="text-[11px] text-slate-400 pt-1 flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  <span>
                    {new Date(selectedFeedback.createdAt).toLocaleString(isHindi ? "hi-IN" : "en-IN")}
                  </span>
                </div>
              </div>
            </div>

            {/* Message Body */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                {isHindi ? "पूर्ण संदेश / प्रश्न" : "Full Feedback / Query Message"}
              </label>
              <div className="p-4 rounded-xl bg-white border border-slate-300 text-slate-800 text-sm leading-relaxed whitespace-pre-wrap max-h-60 overflow-y-auto">
                {selectedFeedback.message}
              </div>
            </div>

            {/* Status Selector in Modal */}
            <div className="flex items-center gap-3">
              <label className="text-xs font-bold text-slate-700">
                {isHindi ? "वर्तमान स्थिति:" : "Current Status:"}
              </label>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleUpdateStatus(selectedFeedback, "unread")}
                  className={`px-3 py-1 rounded-lg text-xs font-bold border ${
                    selectedFeedback.status === "unread"
                      ? "bg-amber-100 text-amber-900 border-amber-300 ring-2 ring-amber-400"
                      : "bg-white text-slate-600 border-slate-300 hover:bg-slate-50"
                  }`}
                >
                  {isHindi ? "अपठित" : "Unread"}
                </button>
                <button
                  type="button"
                  onClick={() => handleUpdateStatus(selectedFeedback, "read")}
                  className={`px-3 py-1 rounded-lg text-xs font-bold border ${
                    selectedFeedback.status === "read"
                      ? "bg-slate-200 text-slate-900 border-slate-400 ring-2 ring-slate-400"
                      : "bg-white text-slate-600 border-slate-300 hover:bg-slate-50"
                  }`}
                >
                  {isHindi ? "पढ़ा गया" : "Read"}
                </button>
                <button
                  type="button"
                  onClick={() => handleUpdateStatus(selectedFeedback, "resolved")}
                  className={`px-3 py-1 rounded-lg text-xs font-bold border ${
                    selectedFeedback.status === "resolved"
                      ? "bg-emerald-100 text-emerald-900 border-emerald-400 ring-2 ring-emerald-400"
                      : "bg-white text-slate-600 border-slate-300 hover:bg-slate-50"
                  }`}
                >
                  {isHindi ? "समाधानित" : "Resolved"}
                </button>
              </div>
            </div>

            {/* Internal Admin Notes */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700">
                {isHindi ? "आंतरिक शोधकर्ता नोट (Admin Notes)" : "Internal Researcher Notes"}
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={adminNoteInput}
                  onChange={(e) => setAdminNoteInput(e.target.value)}
                  placeholder={
                    isHindi
                      ? "उदा. ईमेल पर रिपोर्ट भेजी गई, या बैरियर ट्रैकर में जोड़ा गया..."
                      : "e.g. Sent report PDF, followed up via call..."
                  }
                  className="flex-1 px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-600"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleSaveAdminNote}
                  className="text-xs"
                >
                  {isHindi ? "नोट सहेजें" : "Save Note"}
                </Button>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="pt-3 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
              <a
                href={`mailto:${selectedFeedback.email}?subject=${encodeURIComponent(
                  "Re: Sugamya Shiksha Bihar Inquiry - " + selectedFeedback.name
                )}&body=${encodeURIComponent(
                  `Dear ${selectedFeedback.name},\n\nThank you for reaching out to the Sugamya Shiksha Bihar Fellowship research project regarding:\n"${selectedFeedback.message}"\n\n`
                )}`}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-teal-700 hover:bg-teal-800 text-white shadow-xs"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{isHindi ? "ईमेल द्वारा उत्तर भेजें" : "Reply via Email"}</span>
              </a>

              <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setIsViewModalOpen(false)}
                  className="text-xs"
                >
                  {isHindi ? "बंद करें" : "Close"}
                </Button>
              </div>
            </div>
          </div>
        </Modal>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <Modal
          isOpen={true}
          onClose={() => setDeleteConfirmId(null)}
          title={isHindi ? "संदेश हटाने की पुष्टि" : "Confirm Deletion"}
          size="sm"
        >
          <div className="space-y-4 text-center">
            <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>
            <p className="text-sm text-slate-700">
              {isHindi
                ? "क्या आप वाकई इस संदेश को हटाना चाहते हैं? यह क्रिया पूर्ववत नहीं की जा सकती।"
                : "Are you sure you want to delete this feedback message? This action cannot be undone."}
            </p>
            <div className="flex items-center justify-center gap-3 pt-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setDeleteConfirmId(null)}
              >
                {isHindi ? "रद्द करें" : "Cancel"}
              </Button>
              <Button
                type="button"
                variant="primary"
                size="sm"
                onClick={() => handleDeleteFeedback(deleteConfirmId)}
                className="bg-red-600 hover:bg-red-700 text-white"
              >
                {isHindi ? "हटाएं" : "Delete"}
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
