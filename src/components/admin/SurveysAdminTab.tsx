"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input, Textarea } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import { Modal } from "@/components/ui/Modal";
import {
  Search,
  RefreshCw,
  Eye,
  Trash2,
  Edit,
  Save,
  Plus,
  X,
  Check,
  CheckCircle2,
  AlertCircle,
  AlertTriangle,
  Clock,
  ShieldCheck,
  ShieldAlert,
  Inbox,
  Mail,
  Phone,
  UserCheck,
  Sparkles,
  Download,
  ClipboardList,
  ChevronRight,
  ChevronDown,
  Layers,
  HelpCircle,
  ExternalLink,
} from "lucide-react";
import { doc, getDoc, getDocs, setDoc, deleteDoc, collection, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase/firestore";
import {
  DEFAULT_COMMUNITY_SURVEY,
  DEMO_SURVEY_RESPONSES,
  SurveyDefinition,
  SurveyQuestion,
  QuestionType,
} from "@/data/surveyData";
import {
  SURVEY_COLLECTIONS,
  SurveyResponseDoc,
  normalizeSurveyResponse,
} from "@/data/surveyConstants";

export function SurveysAdminTab() {
  const { user, isAdmin } = useAuth();
  const { locale, t } = useLanguage();
  const isHindi = locale === "hi";

  const [surveyDef, setSurveyDef] = useState<SurveyDefinition>(DEFAULT_COMMUNITY_SURVEY);
  const [surveyResponses, setSurveyResponses] = useState<SurveyResponseDoc[]>(
    DEMO_SURVEY_RESPONSES.map((d) => normalizeSurveyResponse(d, d.id))
  );
  const [isSurveyLoading, setIsSurveyLoading] = useState(false);
  const [surveyFetchError, setSurveyFetchError] = useState("");
  const [surveyFilter, setSurveyFilter] = useState("all");
  const [surveySearchQuery, setSurveySearchQuery] = useState("");
  const [surveyRoleFilter, setSurveyRoleFilter] = useState("all");
  const [surveyPageLimit, setSurveyPageLimit] = useState(10);
  const [isSavingSurvey, setIsSavingSurvey] = useState(false);
  const [surveySuccess, setSurveySuccess] = useState("");
  const [selectedResponse, setSelectedResponse] = useState<SurveyResponseDoc | null>(null);
  const [isViewingResponse, setIsViewingResponse] = useState(false);
  const [isEditingSurveyMeta, setIsEditingSurveyMeta] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<SurveyQuestion | null>(null);
  const [isAddingQuestion, setIsAddingQuestion] = useState(false);
  const [isEditingQuestionModal, setIsEditingQuestionModal] = useState(false);
  const [responseDeleteConfirmId, setResponseDeleteConfirmId] = useState<string | null>(null);

  // Dedicated Real-Time Listener for Survey Responses (Unsubscribes on unmount)
  useEffect(() => {
    if (!isAdmin) return;

    const surveyTitleMap: Record<string, string> = {
      [surveyDef.id]: isHindi ? surveyDef.title_hi : surveyDef.title_en,
      "danapur-community-survey-2026": isHindi
        ? "दानापुर विद्यालय अभिगम्यता समुदाय सर्वेक्षण 2026"
        : "Danapur School Accessibility Community Survey 2026",
    };

    const loadLocalSubmissions = (): SurveyResponseDoc[] => {
      try {
        const raw = localStorage.getItem("ssb_local_survey_submissions");
        if (!raw) return [];
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          return parsed.map((d) => normalizeSurveyResponse(d, d.id, surveyTitleMap));
        }
      } catch (e) {}
      return [];
    };

    if (!db) {
      const localDocs = loadLocalSubmissions();
      if (localDocs.length > 0) {
        setSurveyResponses(localDocs);
      }
      return;
    }

    setIsSurveyLoading(true);
    setSurveyFetchError("");

    const q = collection(db, SURVEY_COLLECTIONS.RESPONSES);
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const docs = snapshot.docs.map((d) =>
          normalizeSurveyResponse(d.data(), d.id, surveyTitleMap)
        );
        const localDocs = loadLocalSubmissions();
        const existingIds = new Set(docs.map((d) => d.id));
        const merged = [...docs, ...localDocs.filter((d) => !existingIds.has(d.id))];
        setSurveyResponses(merged);
        setIsSurveyLoading(false);
        setSurveyFetchError("");
      },
      (err) => {
        console.error("Firestore onSnapshot error on surveyResponses:", err);
        const localDocs = loadLocalSubmissions();
        if (localDocs.length > 0) {
          setSurveyResponses(localDocs);
        }
        setSurveyFetchError(
          isHindi
            ? `सर्वेक्षण प्रतिक्रियाएं लोड करने में त्रुटि: ${err.message}`
            : `Failed to load survey responses from Firestore: ${err.message}`
        );
        setIsSurveyLoading(false);
      }
    );

    return () => unsubscribe();
  }, [isAdmin, surveyDef.id, isHindi, surveyDef.title_en, surveyDef.title_hi]);

  // Handle Save Survey Definition
  const handleSaveSurvey = async (updated: SurveyDefinition) => {
    setIsSavingSurvey(true);
    if (db) {
      try {
        await setDoc(doc(db, "surveys", updated.id), updated, { merge: true });
      } catch (err) {
        console.warn("Could not save survey to Firestore:", err);
      }
    }
    setSurveyDef(updated);
    setIsSavingSurvey(false);
    setSurveySuccess(
      isHindi ? "सर्वेक्षण विन्यास सफलतापूर्वक सहेजा गया!" : "Survey configuration saved successfully!"
    );
    setTimeout(() => setSurveySuccess(""), 4000);
  };

  // Handle Save Question
  const handleSaveQuestion = async (qToSave: SurveyQuestion) => {
    let updatedQuestions: SurveyQuestion[];
    if (isAddingQuestion) {
      updatedQuestions = [...surveyDef.questions, qToSave];
    } else {
      updatedQuestions = surveyDef.questions.map((q) => (q.id === qToSave.id ? qToSave : q));
    }
    const updatedSurvey = {
      ...surveyDef,
      questions: updatedQuestions,
      updatedAt: new Date().toISOString().split("T")[0],
    };
    await handleSaveSurvey(updatedSurvey);
    setIsEditingQuestionModal(false);
    setEditingQuestion(null);
    setIsAddingQuestion(false);
  };

  // Handle Delete Question
  const handleDeleteQuestion = async (questionId: string) => {
    const updatedQuestions = surveyDef.questions.filter((q) => q.id !== questionId);
    const updatedSurvey = {
      ...surveyDef,
      questions: updatedQuestions,
      updatedAt: new Date().toISOString().split("T")[0],
    };
    await handleSaveSurvey(updatedSurvey);
  };

  // Handle Move Question
  const handleMoveQuestion = async (index: number, direction: "up" | "down") => {
    const newIdx = direction === "up" ? index - 1 : index + 1;
    if (newIdx < 0 || newIdx >= surveyDef.questions.length) return;
    const reordered = [...surveyDef.questions];
    const [moved] = reordered.splice(index, 1);
    reordered.splice(newIdx, 0, moved);
    const updatedSurvey = {
      ...surveyDef,
      questions: reordered,
      updatedAt: new Date().toISOString().split("T")[0],
    };
    await handleSaveSurvey(updatedSurvey);
  };

  // Handle Delete Survey Response (DPDP Act 2023)
  const handleDeleteResponse = async (respId: string) => {
    if (db) {
      try {
        await deleteDoc(doc(db, SURVEY_COLLECTIONS.RESPONSES, respId));
      } catch (err: any) {
        console.error("Could not delete survey response from Firestore:", err);
      }
    }
    try {
      const raw = localStorage.getItem("ssb_local_survey_submissions");
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          const updated = parsed.filter((r: any) => r.id !== respId);
          localStorage.setItem("ssb_local_survey_submissions", JSON.stringify(updated));
        }
      }
    } catch (e) {}
    setSurveyResponses((prev) => prev.filter((r) => r.id !== respId));
    setResponseDeleteConfirmId(null);
    setSurveySuccess(isHindi ? "प्रतिक्रिया हटा दी गई।" : "Survey response removed.");
    setTimeout(() => setSurveySuccess(""), 4000);
  };

  // Export to CSV (RFC 4180 with UTF-8 BOM) — Exports consented respondent data with survey details
  const handleExportCSV = () => {
    const baseHeaders = ["Response ID", "Survey Title", "Submitted At", "Name", "Email", "Phone", "Role", "Consent Given", "Consent Timestamp"];
    const questionHeaders = surveyDef.questions.map(
      (q, idx) => `Q${idx + 1}: ${(q.label_en || q.id).replace(/"/g, '""')}`
    );
    const allHeaders = [...baseHeaders, ...questionHeaders];

    // Export responses where consent was recorded per DPDP Act 2023
    const consentedResponses = filteredSurveyResponses.filter((r) => r.consentGiven === true);

    const rows = consentedResponses.map((r) => {
      const surveyTitle = r.surveyTitle || surveyDef.title_en;
      const baseData = [
        `"${r.id}"`,
        `"${surveyTitle.replace(/"/g, '""')}"`,
        `"${r.submittedAt || ""}"`,
        `"${(r.name || "").replace(/"/g, '""')}"`,
        `"${(r.email || "").replace(/"/g, '""')}"`,
        `"${(r.phone || "").replace(/"/g, '""')}"`,
        `"${r.role || "other"}"`,
        r.consentGiven ? "Yes" : "No",
        `"${r.consentAt || r.submittedAt || ""}"`,
      ];

      const answersData = surveyDef.questions.map((q) => {
        const ans = r.answers?.[q.id];
        if (ans === undefined || ans === null) return '""';
        if (Array.isArray(ans)) return `"${ans.join("; ").replace(/"/g, '""')}"`;
        return `"${String(ans).replace(/"/g, '""')}"`;
      });

      return [...baseData, ...answersData].join(",");
    });

    const csvContent = "\uFEFF" + [allHeaders.join(","), ...rows].join("\r\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `danapur_survey_responses_${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Export to JSON
  const handleExportJSON = () => {
    const exportData = {
      survey: surveyDef,
      exportedAt: new Date().toISOString(),
      totalResponses: filteredSurveyResponses.length,
      responses: filteredSurveyResponses,
    };
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `danapur_survey_responses_${new Date().toISOString().split("T")[0]}.json`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Manual trigger to refresh survey responses
  const handleManualRefresh = async () => {
    if (!db) return;
    setIsSurveyLoading(true);
    setSurveyFetchError("");
    try {
      const snap = await getDocs(collection(db, SURVEY_COLLECTIONS.RESPONSES));
      const surveyTitleMap: Record<string, string> = {
        [surveyDef.id]: isHindi ? surveyDef.title_hi : surveyDef.title_en,
        "danapur-community-survey-2026": isHindi
          ? "दानापुर विद्यालय अभिगम्यता समुदाय सर्वेक्षण 2026"
          : "Danapur School Accessibility Community Survey 2026",
      };
      const docs = snap.docs.map((d) => normalizeSurveyResponse(d.data(), d.id, surveyTitleMap));
      setSurveyResponses(docs);
      setSurveySuccess(isHindi ? "प्रतिक्रियाएं ताज़ा की गईं।" : "Responses refreshed from Firestore.");
      setTimeout(() => setSurveySuccess(""), 3000);
    } catch (err: any) {
      console.error("Manual refresh error:", err);
      setSurveyFetchError(err.message || "Failed to fetch responses");
    } finally {
      setIsSurveyLoading(false);
    }
  };

  // Filtered and Sorted Survey Responses (Survey Filter, Role Filter, Search, Newest First)
  const filteredSurveyResponses = surveyResponses
    .filter((resp) => {
      // 1. Filter by survey
      if (surveyFilter !== "all" && resp.surveyId !== surveyFilter) {
        return false;
      }
      // 2. Filter by role
      if (surveyRoleFilter !== "all" && resp.role !== surveyRoleFilter) {
        return false;
      }
      // 3. Filter by search query
      if (surveySearchQuery.trim()) {
        const q = surveySearchQuery.toLowerCase().trim();
        const name = (resp.name || "").toLowerCase();
        const email = (resp.email || "").toLowerCase();
        const phone = (resp.phone || "").toLowerCase();
        const id = (resp.id || "").toLowerCase();
        const surveyTitle = (resp.surveyTitle || "").toLowerCase();
        if (
          !name.includes(q) &&
          !email.includes(q) &&
          !phone.includes(q) &&
          !id.includes(q) &&
          !surveyTitle.includes(q)
        ) {
          return false;
        }
      }
      return true;
    })
    .sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime());

  // Pagination slice (limit + load more)
  const paginatedSurveyResponses = filteredSurveyResponses.slice(0, surveyPageLimit);
  const hasMoreSurveyResponses = filteredSurveyResponses.length > surveyPageLimit;


  return (
    <>
      <div className="space-y-8 pt-4">
        {/* Header & Quick Action Buttons */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold text-navy-800">
                {isHindi ? "सामुदायिक सर्वेक्षण एवं प्रतिक्रिया प्रबंधन" : "Community Survey & Responses Management"}
              </h2>
              <p className="text-xs text-slate-500">
                {isHindi
                  ? "सर्वेक्षण प्रश्न विन्यास, लाइव स्थिति, जन-प्रतिक्रियाएं एवं डेटा निर्यात"
                  : "Survey question schema, publishing status, public responses, and research data export"}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <Link href="/survey" target="_blank">
                <Button variant="outline" size="sm" leftIcon={<ExternalLink className="w-3.5 h-3.5" />}>
                  {isHindi ? "लाइव फॉर्म देखें" : "View Live Form"}
                </Button>
              </Link>
              <Button
                variant="secondary"
                size="sm"
                leftIcon={<Plus className="w-4 h-4" />}
                onClick={() => {
                  setEditingQuestion({
                    id: `q_${Date.now()}`,
                    label_hi: "",
                    label_en: "",
                    type: "radio",
                    required: true,
                    options: [
                      { label_hi: "हाँ", label_en: "Yes", value: "yes" },
                      { label_hi: "नहीं", label_en: "No", value: "no" },
                    ],
                  });
                  setIsAddingQuestion(true);
                  setIsEditingQuestionModal(true);
                }}
              >
                {isHindi ? "नया प्रश्न जोड़ें" : "Add Question"}
              </Button>
              <Button
                variant="outline"
                size="sm"
                leftIcon={<Edit className="w-3.5 h-3.5" />}
                onClick={() => setIsEditingSurveyMeta(true)}
              >
                {isHindi ? "शीर्षक / स्थिति बदलें" : "Edit Survey Info"}
              </Button>
            </div>
          </div>

          {surveySuccess && (
            <div role="status" className="p-3.5 rounded-lg bg-emerald-50 border border-emerald-300 text-xs font-semibold text-emerald-800 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" aria-hidden="true" />
              <span>{surveySuccess}</span>
            </div>
          )}

          {/* Active Survey Summary Card */}
          <Card as="section" className="p-6 border-slate-200 shadow-xs space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Badge variant={surveyDef.published ? "verified" : "rejected"} className="text-xs">
                  {surveyDef.published
                    ? (isHindi ? "सक्रिय / लाइव (Published)" : "Active / Published")
                    : (isHindi ? "अप्रकाशित (Draft)" : "Draft / Unpublished")}
                </Badge>
                <span className="text-xs text-slate-400 font-mono">ID: {surveyDef.id}</span>
              </div>
              <div className="text-xs text-slate-500">
                {isHindi ? "अंतिम अद्यतन: " : "Last Updated: "}
                <span className="font-medium text-navy-800">{surveyDef.updatedAt}</span>
              </div>
            </div>

            <div className="space-y-1.5">
              <h3 className="text-lg font-bold text-navy-900">
                {isHindi ? surveyDef.title_hi : surveyDef.title_en}
              </h3>
              <p className="text-xs sm:text-sm text-slate-600">
                {isHindi ? surveyDef.description_hi : surveyDef.description_en}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-4 pt-2 text-xs text-slate-500 border-t border-slate-100">
              <span>
                <strong>{isHindi ? "लक्षित समूह: " : "Target Audience: "}</strong>
                {isHindi ? surveyDef.targetAudience_hi : surveyDef.targetAudience_en}
              </span>
              <span>•</span>
              <span>
                <strong>{isHindi ? "कुल प्रश्न: " : "Total Questions: "}</strong>
                {surveyDef.questions.length}
              </span>
            </div>
          </Card>

          {/* Questions Schema Builder List */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-navy-900">
                {isHindi ? "सर्वेक्षण प्रश्न सूची (Questionnaire Schema)" : "Survey Questions Schema"}
              </h3>
              <span className="text-xs text-slate-500">
                {isHindi ? "क्रमबद्ध एवं प्रकार-आधारित प्रश्न" : "Ordered questions with input types"}
              </span>
            </div>

            <div className="space-y-3">
              {surveyDef.questions.map((q, qIdx) => (
                <div
                  key={q.id}
                  className="bg-white p-4 sm:p-5 rounded-lg border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4 hover:border-teal-500 transition-colors"
                >
                  <div className="space-y-1.5 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-xs font-bold text-teal-800 bg-teal-50 px-2 py-0.5 rounded">
                        Q{qIdx + 1}
                      </span>
                      <Badge variant="default" className="text-[10px] uppercase font-mono">
                        {q.type}
                      </Badge>
                      {q.required ? (
                        <span className="text-[10px] font-semibold text-amber-800 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200">
                          {isHindi ? "अनिवार्य" : "Required"}
                        </span>
                      ) : (
                        <span className="text-[10px] text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">
                          {isHindi ? "वैकल्पिक" : "Optional"}
                        </span>
                      )}
                      <span className="text-[11px] text-slate-400 font-mono">[{q.id}]</span>
                    </div>

                    <h4 className="text-sm sm:text-base font-bold text-navy-900">
                      {isHindi ? q.label_hi : q.label_en}
                    </h4>

                    {q.options && q.options.length > 0 && (
                      <div className="flex flex-wrap items-center gap-1.5 pt-1">
                        <span className="text-[11px] text-slate-400 font-medium">
                          {isHindi ? "विकल्प:" : "Options:"}
                        </span>
                        {q.options.map((opt) => (
                          <span
                            key={opt.value}
                            className="text-[11px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded"
                          >
                            {isHindi ? opt.label_hi : opt.label_en}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0 self-end md:self-center border-t md:border-t-0 pt-2 md:pt-0">
                    <Button
                      variant="ghost"
                      size="sm"
                      disabled={qIdx === 0}
                      onClick={() => handleMoveQuestion(qIdx, "up")}
                      className="px-2 text-xs"
                      aria-label="Move question up"
                    >
                      ↑
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      disabled={qIdx === surveyDef.questions.length - 1}
                      onClick={() => handleMoveQuestion(qIdx, "down")}
                      className="px-2 text-xs"
                      aria-label="Move question down"
                    >
                      ↓
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setEditingQuestion({ ...q });
                        setIsAddingQuestion(false);
                        setIsEditingQuestionModal(true);
                      }}
                      leftIcon={<Edit className="w-3.5 h-3.5" />}
                    >
                      {isHindi ? "संपादित करें" : "Edit"}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteQuestion(q.id)}
                      className="text-red-600 hover:bg-red-50"
                      leftIcon={<Trash2 className="w-3.5 h-3.5" />}
                    >
                      {isHindi ? "हटाएं" : "Delete"}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Survey Responses Section & Export Controls */}
          <div className="space-y-4 pt-6 border-t border-slate-200">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="text-xl font-bold text-navy-900 flex items-center gap-2">
                    <span>{isHindi ? "प्राप्त सर्वेक्षण प्रतिक्रियाएं" : "Collected Survey Responses"}</span>
                    <Badge variant="verified" className="text-xs">
                      {surveyResponses.length} {isHindi ? "दर्ज" : "Total"}
                    </Badge>
                  </h3>
                  {db && (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" aria-hidden="true" />
                      <span>{isHindi ? "लाइव सिंक सक्रिय" : "Live Firestore Sync"}</span>
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  {isHindi
                    ? "सार्वजनिक सहभागिता से प्राप्त डेटा • पूर्णतः सहमति-आधारित • डीपीडीपी अधिनियम 2023"
                    : "Verified responses submitted by students, parents, teachers, and advocates"}
                </p>
              </div>

              {/* Data Export & Refresh Action Buttons */}
              <div className="flex flex-wrap items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleManualRefresh}
                  disabled={isSurveyLoading}
                  leftIcon={<RefreshCw className={`w-3.5 h-3.5 ${isSurveyLoading ? "animate-spin" : ""}`} />}
                  title={isHindi ? "ताज़ा करें (Refresh)" : "Refresh Responses"}
                >
                  {isHindi ? "ताज़ा करें" : "Refresh"}
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={handleExportCSV}
                  leftIcon={<Download className="w-4 h-4" />}
                >
                  {isHindi ? "CSV निर्यात (Excel/Sheets)" : "Export CSV"}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleExportJSON}
                  leftIcon={<Download className="w-4 h-4" />}
                >
                  {isHindi ? "JSON निर्यात" : "Export JSON"}
                </Button>
              </div>
            </div>

            {/* Quick Analytics Counters */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                {
                  label: isHindi ? "कुल प्रतिक्रियाएं" : "Total Responses",
                  count: surveyResponses.length,
                  color: "text-navy-900 bg-slate-50",
                },
                {
                  label: isHindi ? "अभिभावक" : "Parents",
                  count: surveyResponses.filter((r) => r.role === "parent").length,
                  color: "text-teal-900 bg-teal-50",
                },
                {
                  label: isHindi ? "विद्यार्थी" : "Students",
                  count: surveyResponses.filter((r) => r.role === "student").length,
                  color: "text-amber-900 bg-amber-50",
                },
                {
                  label: isHindi ? "शिक्षक / अधिवक्ता" : "Teachers & Advocates",
                  count: surveyResponses.filter((r) => ["teacher", "advocate"].includes(r.role)).length,
                  color: "text-purple-900 bg-purple-50",
                },
              ].map((stat, idx) => (
                <div key={idx} className={`p-4 rounded-xl border border-slate-200 ${stat.color} space-y-1`}>
                  <span className="text-2xl font-black">{stat.count}</span>
                  <p className="text-xs font-semibold">{stat.label}</p>
                </div>
              ))}
            </div>

            {/* Search & Filter Toolbar */}
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" aria-hidden="true" />
                <input
                  type="search"
                  value={surveySearchQuery}
                  onChange={(e) => setSurveySearchQuery(e.target.value)}
                  placeholder={isHindi ? "नाम, ईमेल, फोन नंबर या आईडी से खोजें..." : "Search by name, email, phone or response ID..."}
                  className="w-full pl-9 pr-3 py-2 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-600 focus:border-teal-600"
                  aria-label={isHindi ? "प्रतिक्रियाएं खोजें" : "Search responses"}
                />
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <label htmlFor="survey-filter-select" className="text-xs font-semibold text-slate-700 whitespace-nowrap">
                  {isHindi ? "सर्वेक्षण:" : "Survey:"}
                </label>
                <select
                  id="survey-filter-select"
                  value={surveyFilter}
                  onChange={(e) => setSurveyFilter(e.target.value)}
                  className="text-xs bg-white border border-slate-200 rounded-lg px-2.5 py-2 text-slate-700 focus:outline-none focus:ring-2 focus:ring-teal-600 focus:border-teal-600 max-w-[200px] truncate"
                >
                  <option value="all">{isHindi ? "सभी सर्वेक्षण (All Surveys)" : "All Surveys"}</option>
                  <option value={surveyDef.id}>
                    {isHindi ? surveyDef.title_hi : surveyDef.title_en}
                  </option>
                </select>

                <label htmlFor="survey-role-filter" className="text-xs font-semibold text-slate-700 whitespace-nowrap">
                  {isHindi ? "भूमिका:" : "Role:"}
                </label>
                <select
                  id="survey-role-filter"
                  value={surveyRoleFilter}
                  onChange={(e) => setSurveyRoleFilter(e.target.value)}
                  className="text-xs bg-white border border-slate-200 rounded-lg px-2.5 py-2 text-slate-700 focus:outline-none focus:ring-2 focus:ring-teal-600 focus:border-teal-600"
                >
                  <option value="all">{isHindi ? "सभी भूमिकाएं (All)" : "All Roles"}</option>
                  <option value="student">{isHindi ? "विद्यार्थी (Student)" : "Student"}</option>
                  <option value="parent">{isHindi ? "अभिभावक (Parent)" : "Parent"}</option>
                  <option value="teacher">{isHindi ? "शिक्षक (Teacher)" : "Teacher"}</option>
                  <option value="advocate">{isHindi ? "अधिवक्ता / कार्यकर्ता (Advocate)" : "Advocate"}</option>
                  <option value="other">{isHindi ? "अन्य (Other)" : "Other"}</option>
                </select>

                {(surveySearchQuery || surveyRoleFilter !== "all" || surveyFilter !== "all") && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setSurveySearchQuery("");
                      setSurveyRoleFilter("all");
                      setSurveyFilter("all");
                    }}
                    className="text-xs text-slate-500 hover:text-slate-800"
                  >
                    {isHindi ? "फ़िल्टर हटाएं" : "Clear"}
                  </Button>
                )}
              </div>
            </div>

            {/* Accessible Error State Banner */}
            {surveyFetchError && (
              <div
                role="alert"
                className="p-4 rounded-xl bg-red-50 border border-red-300 text-red-900 text-xs sm:text-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
              >
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-red-600 shrink-0" aria-hidden="true" />
                  <div>
                    <span className="font-bold">{isHindi ? "डेटा लोड त्रुटि: " : "Error loading responses: "}</span>
                    <span>{surveyFetchError}</span>
                  </div>
                </div>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={handleManualRefresh}
                  className="shrink-0 text-xs"
                >
                  {isHindi ? "पुनः प्रयास करें" : "Retry"}
                </Button>
              </div>
            )}

            {/* DPDP Act 2023 Compliance Notice */}
            <div className="p-3.5 rounded-lg bg-teal-50/70 border border-teal-200 text-xs text-teal-950 flex items-start gap-2.5">
              <ShieldAlert className="w-4 h-4 text-teal-700 shrink-0 mt-0.5" aria-hidden="true" />
              <div className="space-y-1">
                <div className="font-bold">
                  {isHindi ? "डीपीडीपी अधिनियम 2023 अनुपालन (DPDP Act 2023 Compliance):" : "DPDP Act 2023 Research Compliance:"}
                </div>
                <p className="text-slate-700 leading-relaxed">
                  {isHindi
                    ? "प्रतिभागियों का व्यक्तिगत विवरण (नाम, गूगल ईमेल, संपर्क नंबर) शोध उद्देश्य हेतु स्पष्ट सहमति के साथ संग्रहीत किया गया है। प्रतिभागी के अधिकार के तहत, व्यवस्थापक किसी भी समय 'डेटा हटाएं' बटन दबाकर संबंधित प्रतिभागी का संपूर्ण व्यक्तिगत डेटा मिटा सकते हैं।"
                    : "Respondent personal details (verified Google name, email, and 10-digit mobile number) are stored strictly for academic research under affirmative consent. In adherence to the Digital Personal Data Protection Act 2023 right to erasure, administrators can permanently delete any respondent's record upon request."}
                </p>
              </div>
            </div>

            {/* Filtered Responses Results Count */}
            <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500 font-medium">
              <span>
                {isHindi
                  ? `कुल ${surveyResponses.length} में से ${paginatedSurveyResponses.length} प्रतिक्रियाएं प्रदर्शित (फ़िल्टर परिणाम: ${filteredSurveyResponses.length})`
                  : `Showing ${paginatedSurveyResponses.length} of ${filteredSurveyResponses.length} filtered responses (${surveyResponses.length} total in Firestore)`}
              </span>
              <span className="text-slate-400">
                {isHindi ? "नवीनतम पहले प्रदर्शित" : "Sorted: newest first"}
              </span>
            </div>

            {/* Accessible Loading Spinner */}
            {isSurveyLoading && surveyResponses.length === 0 && (
              <div role="status" className="p-12 text-center bg-white rounded-xl border border-slate-200 space-y-3">
                <div className="w-8 h-8 border-3 border-teal-600 border-t-transparent rounded-full animate-spin mx-auto" aria-hidden="true" />
                <p className="text-sm font-semibold text-navy-900">
                  {isHindi ? "सर्वेक्षण प्रतिक्रियाएं लोड हो रही हैं..." : "Loading survey responses from Firestore..."}
                </p>
              </div>
            )}

            {/* Accessible Empty State (0 responses in Firestore) */}
            {!isSurveyLoading && surveyResponses.length === 0 && !surveyFetchError && (
              <div className="text-center py-12 bg-white rounded-xl border border-dashed border-slate-300 space-y-2">
                <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
                  <Inbox className="w-6 h-6" aria-hidden="true" />
                </div>
                <h4 className="text-base font-bold text-navy-900">
                  {isHindi ? "अभी तक कोई प्रतिक्रिया प्राप्त नहीं हुई है।" : "No responses yet."}
                </h4>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  {isHindi
                    ? "जैसे ही प्रतिभागी सर्वेक्षण पूरा करेंगे, उनकी प्रतिक्रियाएं यहाँ वास्तविक समय (real-time) में दिखाई देंगी।"
                    : "As respondents submit the survey form, their responses will appear here in real-time."}
                </p>
              </div>
            )}

            {/* Filtered Empty State (matches == 0 but total > 0) */}
            {!isSurveyLoading && surveyResponses.length > 0 && filteredSurveyResponses.length === 0 && (
              <div className="text-center py-12 bg-white rounded-xl border border-dashed border-slate-300 space-y-3">
                <p className="text-sm text-slate-500 font-medium">
                  {isHindi ? "खोजे गए मानदंडों से कोई प्रतिक्रिया मेल नहीं खाती।" : "No responses match your search or filter criteria."}
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setSurveySearchQuery("");
                    setSurveyRoleFilter("all");
                    setSurveyFilter("all");
                  }}
                >
                  {isHindi ? "फ़िल्टर साफ़ करें" : "Clear Filters"}
                </Button>
              </div>
            )}

            {/* Responses List Cards */}
            <div className="space-y-3 pt-1">
              {paginatedSurveyResponses.map((resp) => {
                const schoolAnswer = resp.answers?.q_school_name || "Danapur School";
                const rating = resp.answers?.q_overall_rating;
                const isConfirming = responseDeleteConfirmId === resp.id;

                return (
                  <div
                    key={resp.id}
                    className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4 hover:border-teal-500 transition-colors"
                  >
                    <div className="space-y-2 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-[10px] font-semibold text-teal-800 bg-teal-50 px-2 py-0.5 rounded border border-teal-200 truncate max-w-xs">
                          {resp.surveyTitle || "Danapur Community Survey 2026"}
                        </span>
                        <Badge variant="default" className="text-[10px] uppercase font-bold">
                          {resp.role}
                        </Badge>
                        <span className="text-sm font-bold text-navy-900 flex items-center gap-1.5">
                          <UserCheck className="w-3.5 h-3.5 text-teal-600" aria-hidden="true" />
                          {resp.name}
                        </span>
                        {resp.consentGiven && (
                          <span className="text-[10px] font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 flex items-center gap-1">
                            <Check className="w-3 h-3 text-emerald-600" aria-hidden="true" />
                            {isHindi ? "सहमति सत्यापित" : "Consent Verified"}
                          </span>
                        )}
                        {resp.demo && (
                          <Badge variant="default" className="text-[10px]">
                            Demo
                          </Badge>
                        )}
                        <span className="text-xs text-slate-400 font-mono ml-auto">
                          {resp.submittedAt ? new Date(resp.submittedAt).toLocaleString() : ""}
                        </span>
                      </div>

                      {/* Verified contact & email details */}
                      <div className="flex flex-wrap items-center gap-2 text-xs text-slate-600">
                        {resp.email && (
                          <span className="flex items-center gap-1.5 font-mono text-slate-700 bg-slate-50 px-2.5 py-1 rounded border border-slate-200">
                            <Mail className="w-3 h-3 text-teal-600" aria-hidden="true" />
                            {resp.email}
                          </span>
                        )}
                        {resp.phone && (
                          <span className="flex items-center gap-1.5 font-mono text-slate-700 bg-slate-50 px-2.5 py-1 rounded border border-slate-200">
                            <Phone className="w-3 h-3 text-teal-600" aria-hidden="true" />
                            {resp.phone}
                          </span>
                        )}
                      </div>

                      <div className="text-sm font-semibold text-navy-900 flex items-center gap-2">
                        <span>{String(schoolAnswer)}</span>
                        {rating && (
                          <span className="text-xs font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded">
                            ⭐ {rating} / 5
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-end md:self-center shrink-0">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSelectedResponse(resp);
                          setIsViewingResponse(true);
                        }}
                        leftIcon={<Eye className="w-3.5 h-3.5" />}
                      >
                        {isHindi ? "उत्तर देखें" : "View Answers"}
                      </Button>

                      {isConfirming ? (
                        <div className="flex items-center gap-1.5 bg-red-50 p-1.5 rounded-lg border border-red-200">
                          <span className="text-[11px] font-semibold text-red-700 px-1">
                            {isHindi ? "डेटा हटाएं?" : "Delete DPDP Data?"}
                          </span>
                          <Button
                            variant="danger"
                            size="sm"
                            onClick={() => handleDeleteResponse(resp.id)}
                          >
                            {isHindi ? "हाँ हटाएं" : "Confirm"}
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setResponseDeleteConfirmId(null)}
                          >
                            ✕
                          </Button>
                        </div>
                      ) : (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-red-600 hover:bg-red-50"
                          onClick={() => setResponseDeleteConfirmId(resp.id)}
                          leftIcon={<Trash2 className="w-3.5 h-3.5" />}
                          title={isHindi ? "डीपीडीपी व्यक्तिगत डेटा हटाएं" : "Delete respondent data (DPDP Act 2023)"}
                        >
                          {isHindi ? "डेटा हटाएं" : "Delete Data"}
                        </Button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Pagination Controls (Limit + Load More) */}
            {hasMoreSurveyResponses && (
              <div className="pt-4 text-center">
                <Button
                  variant="outline"
                  onClick={() => setSurveyPageLimit((prev) => prev + 10)}
                  className="text-xs font-semibold px-6 border-slate-300 hover:border-teal-600"
                >
                  {isHindi
                    ? `और प्रतिक्रियाएं लोड करें (+10) • ${filteredSurveyResponses.length - paginatedSurveyResponses.length} शेष`
                    : `Load More (+10) • ${filteredSurveyResponses.length - paginatedSurveyResponses.length} remaining`}
                </Button>
              </div>
            )}
          </div>
        </div>

      {/* Modal for Editing / Adding Survey Question */}
      {isEditingQuestionModal && editingQuestion && (
        <Modal
          isOpen={isEditingQuestionModal}
          onClose={() => {
            setIsEditingQuestionModal(false);
            setEditingQuestion(null);
            setIsAddingQuestion(false);
          }}
          title={
            isAddingQuestion
              ? (isHindi ? "नया सर्वेक्षण प्रश्न जोड़ें" : "Add New Survey Question")
              : (isHindi ? "प्रश्न संपादित करें" : "Edit Survey Question")
          }
          size="lg"
        >
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSaveQuestion(editingQuestion);
            }}
            className="space-y-4"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label={isHindi ? "प्रश्न पहचानकर्ता (ID)" : "Question Identifier (ID)"}
                required
                value={editingQuestion.id}
                onChange={(e) =>
                  setEditingQuestion({
                    ...editingQuestion,
                    id: e.target.value.toLowerCase().replace(/[^a-z0-9_]+/g, "_"),
                  })
                }
                disabled={!isAddingQuestion}
              />

              <div className="space-y-1.5">
                <label
                  htmlFor="admin-question-type"
                  className="block text-sm font-semibold text-navy-800"
                >
                  {isHindi ? "प्रश्न प्रकार (Type)" : "Input Type"}
                </label>
                <select
                  id="admin-question-type"
                  value={editingQuestion.type}
                  onChange={(e) =>
                    setEditingQuestion({
                      ...editingQuestion,
                      type: e.target.value as QuestionType,
                    })
                  }
                  className="w-full h-11 rounded-md border border-slate-300 bg-white px-3 text-sm text-navy-900 focus:border-teal-600 focus:ring-1 focus:ring-teal-600"
                >
                  <option value="radio">{isHindi ? "एकल विकल्प (Radio)" : "Single Choice (Radio)"}</option>
                  <option value="checkbox">{isHindi ? "बहु विकल्प (Checkbox)" : "Multiple Choice (Checkbox)"}</option>
                  <option value="text">{isHindi ? "संक्षिप्त उत्तर (Text)" : "Short Text (Text)"}</option>
                  <option value="textarea">{isHindi ? "विस्तृत उत्तर (Textarea)" : "Long Narrative (Textarea)"}</option>
                  <option value="number">{isHindi ? "रेटिंग 1-5 (Number / Rating)" : "Rating 1 to 5 (Rating)"}</option>
                  <option value="select">{isHindi ? "ड्रॉपडाउन (Select)" : "Dropdown (Select)"}</option>
                </select>
              </div>
            </div>

            <Input
              label={isHindi ? "प्रश्न शीर्षक (हिन्दी)" : "Question Label (Hindi)"}
              required
              value={editingQuestion.label_hi}
              onChange={(e) =>
                setEditingQuestion({ ...editingQuestion, label_hi: e.target.value })
              }
            />

            <Input
              label={isHindi ? "प्रश्न शीर्षक (अंग्रेज़ी)" : "Question Label (English)"}
              required
              value={editingQuestion.label_en}
              onChange={(e) =>
                setEditingQuestion({ ...editingQuestion, label_en: e.target.value })
              }
            />

            <Input
              label={isHindi ? "सहायक पाठ (हिन्दी, वैकल्पिक)" : "Help / Subtitle Text (Hindi, optional)"}
              value={editingQuestion.helpText_hi || ""}
              onChange={(e) =>
                setEditingQuestion({ ...editingQuestion, helpText_hi: e.target.value })
              }
            />

            <Input
              label={isHindi ? "सहायक पाठ (अंग्रेज़ी, वैकल्पिक)" : "Help / Subtitle Text (English, optional)"}
              value={editingQuestion.helpText_en || ""}
              onChange={(e) =>
                setEditingQuestion({ ...editingQuestion, helpText_en: e.target.value })
              }
            />

            {/* Required Toggle */}
            <div className="pt-1">
              <label className="flex items-center gap-2 text-sm font-semibold cursor-pointer">
                <input
                  type="checkbox"
                  checked={editingQuestion.required}
                  onChange={(e) =>
                    setEditingQuestion({ ...editingQuestion, required: e.target.checked })
                  }
                  className="w-4 h-4 rounded border-slate-300 text-teal-600 focus:ring-teal-600"
                />
                <span className="text-navy-800">
                  {isHindi ? "यह प्रश्न अनिवार्य (Required) है" : "Mark question as mandatory"}
                </span>
              </label>
            </div>

            {/* Options textarea for choice types */}
            {["radio", "checkbox", "select"].includes(editingQuestion.type) && (
              <div className="space-y-1.5 p-4 rounded-lg bg-slate-50 border border-slate-200">
                <Textarea
                  label={
                    isHindi
                      ? "विकल्प सूची — प्रति पंक्ति एक विकल्प: [हिन्दी लेबल | अंग्रेज़ी लेबल | मान]"
                      : "Options List — one option per line: [Hindi Label | English Label | value]"
                  }
                  rows={4}
                  value={(editingQuestion.options || [])
                    .map((opt) => `${opt.label_hi} | ${opt.label_en} | ${opt.value}`)
                    .join("\n")}
                  onChange={(e) => {
                    const parsedOptions = e.target.value
                      .split("\n")
                      .filter((line) => line.trim().length > 0)
                      .map((line) => {
                        const parts = line.split("|").map((p) => p.trim());
                        const hi = parts[0] || "";
                        const en = parts[1] || hi;
                        const val =
                          parts[2] ||
                          en.toLowerCase().replace(/[^a-z0-9]+/g, "_").slice(0, 30);
                        return { label_hi: hi, label_en: en, value: val };
                      });
                    setEditingQuestion({ ...editingQuestion, options: parsedOptions });
                  }}
                />
                <p className="text-[11px] text-slate-500">
                  {isHindi
                    ? "उदाहरण: हाँ | Yes | yes"
                    : "Format example: Yes (Accessible) | Yes (Accessible) | yes"}
                </p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="pt-4 flex items-center justify-end gap-3 border-t">
              <Button
                type="button"
                variant="ghost"
                onClick={() => {
                  setIsEditingQuestionModal(false);
                  setEditingQuestion(null);
                  setIsAddingQuestion(false);
                }}
              >
                {isHindi ? "रद्द करें" : "Cancel"}
              </Button>
              <Button type="submit" variant="primary" leftIcon={<Save className="w-4 h-4" />}>
                {isHindi ? "प्रश्न सहेजें" : "Save Question"}
              </Button>
            </div>
          </form>
        </Modal>
      )}

      {/* Modal for Editing Survey Info & Publishing */}
      {isEditingSurveyMeta && (
        <Modal
          isOpen={isEditingSurveyMeta}
          onClose={() => setIsEditingSurveyMeta(false)}
          title={isHindi ? "सर्वेक्षण विन्यास एवं प्रकाशन" : "Survey Information & Publishing"}
          size="md"
        >
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSaveSurvey(surveyDef);
              setIsEditingSurveyMeta(false);
            }}
            className="space-y-4"
          >
            <Input
              label={isHindi ? "सर्वेक्षण शीर्षक (हिन्दी)" : "Survey Title (Hindi)"}
              required
              value={surveyDef.title_hi}
              onChange={(e) => setSurveyDef({ ...surveyDef, title_hi: e.target.value })}
            />

            <Input
              label={isHindi ? "सर्वेक्षण शीर्षक (अंग्रेज़ी)" : "Survey Title (English)"}
              required
              value={surveyDef.title_en}
              onChange={(e) => setSurveyDef({ ...surveyDef, title_en: e.target.value })}
            />

            <Textarea
              label={isHindi ? "सर्वेक्षण विवरण (हिन्दी)" : "Survey Description (Hindi)"}
              rows={3}
              value={surveyDef.description_hi}
              onChange={(e) => setSurveyDef({ ...surveyDef, description_hi: e.target.value })}
            />

            <Textarea
              label={isHindi ? "सर्वेक्षण विवरण (अंग्रेज़ी)" : "Survey Description (English)"}
              rows={3}
              value={surveyDef.description_en}
              onChange={(e) => setSurveyDef({ ...surveyDef, description_en: e.target.value })}
            />

            <div className="pt-2">
              <label className="flex items-center gap-2 text-sm font-semibold cursor-pointer">
                <input
                  type="checkbox"
                  checked={surveyDef.published}
                  onChange={(e) => setSurveyDef({ ...surveyDef, published: e.target.checked })}
                  className="w-4 h-4 rounded border-slate-300 text-teal-600 focus:ring-teal-600"
                />
                <span className="text-navy-900">
                  {isHindi
                    ? "प्रकाशित / सक्रिय (जनता हेतु फॉर्म खोलें)"
                    : "Published / Active (Accept public submissions)"}
                </span>
              </label>
            </div>

            <div className="pt-4 flex items-center justify-end gap-3 border-t">
              <Button
                type="button"
                variant="ghost"
                onClick={() => setIsEditingSurveyMeta(false)}
              >
                {isHindi ? "रद्द करें" : "Cancel"}
              </Button>
              <Button type="submit" variant="primary" leftIcon={<Save className="w-4 h-4" />}>
                {isHindi ? "सहेजें" : "Save Changes"}
              </Button>
            </div>
          </form>
        </Modal>
      )}

      {/* Modal for Viewing Full Survey Response */}
      {isViewingResponse && selectedResponse && (
        <Modal
          isOpen={isViewingResponse}
          onClose={() => {
            setIsViewingResponse(false);
            setSelectedResponse(null);
          }}
          title={isHindi ? "सर्वेक्षण प्रतिक्रिया विवरण" : "Survey Response Details"}
          size="lg"
        >
          <div className="space-y-6">
            {/* Metadata Bar */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div>
                <span className="text-slate-400 block font-medium">Response ID</span>
                <span className="font-mono font-bold text-navy-900 truncate block">
                  {selectedResponse.id}
                </span>
              </div>
              <div>
                <span className="text-slate-400 block font-medium">Respondent Role</span>
                <span className="font-bold text-navy-900 capitalize">
                  {selectedResponse.role || "N/A"}
                </span>
              </div>
              <div>
                <span className="text-slate-400 block font-medium">Participant Name</span>
                <span className="font-bold text-navy-900">
                  {selectedResponse.name || (selectedResponse.isAnonymous ? "Anonymous" : "N/A")}
                </span>
              </div>
              <div>
                <span className="text-slate-400 block font-medium">Date Submitted</span>
                <span className="font-bold text-navy-900">
                  {selectedResponse.submittedAt
                    ? new Date(selectedResponse.submittedAt).toLocaleString()
                    : "N/A"}
                </span>
              </div>
            </div>

            {/* Respondent Verified Credentials Bar (DPDP Act 2023) */}
            <div className="p-4 rounded-xl bg-teal-50/70 border border-teal-200 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div>
                <span className="text-teal-800 font-semibold block">Google Email (Verified)</span>
                <span className="font-mono text-navy-900 font-bold block truncate">
                  {selectedResponse.email || "N/A"}
                </span>
              </div>
              <div>
                <span className="text-teal-800 font-semibold block">Contact Number</span>
                <span className="font-mono text-navy-900 font-bold block">
                  {selectedResponse.phone || "N/A"}
                </span>
              </div>
              <div>
                <span className="text-teal-800 font-semibold block">DPDP Act Research Consent</span>
                <span className="font-semibold text-emerald-800 flex items-center gap-1 mt-0.5">
                  <Check className="w-3.5 h-3.5 text-emerald-600" aria-hidden="true" />
                  {selectedResponse.consentGiven ? (isHindi ? "सत्यापित सहमति" : "Consent Recorded") : (isHindi ? "सहमति नहीं" : "No Consent")}
                  {selectedResponse.consentAt && (
                    <span className="text-[10px] text-slate-500 font-mono ml-1">
                      ({new Date(selectedResponse.consentAt).toLocaleDateString()})
                    </span>
                  )}
                </span>
              </div>
            </div>

            {/* Question by Question Answers */}
            <div className="space-y-4">
              <h4 className="text-sm font-bold text-navy-900 border-b border-slate-200 pb-2">
                {isHindi ? "प्रश्नोत्तरी उत्तर (Submitted Answers)" : "Questionnaire Answers"}
              </h4>

              <div className="space-y-3">
                {surveyDef.questions.map((q, qIdx) => {
                  const ans = selectedResponse.answers?.[q.id];
                  let displayAns: React.ReactNode = isHindi ? "कोई उत्तर नहीं दिया गया" : "No answer provided";

                  if (ans !== undefined && ans !== null && ans !== "") {
                    if (Array.isArray(ans)) {
                      displayAns = (
                        <div className="flex flex-wrap gap-1 pt-1">
                          {ans.map((v) => {
                            const opt = q.options?.find((o) => o.value === v);
                            return (
                              <span
                                key={v}
                                className="bg-teal-50 text-teal-800 text-xs px-2 py-0.5 rounded font-medium border border-teal-200"
                              >
                                {opt ? (isHindi ? opt.label_hi : opt.label_en) : v}
                              </span>
                            );
                          })}
                        </div>
                      );
                    } else if (q.type === "radio" || q.type === "select") {
                      const opt = q.options?.find((o) => o.value === ans);
                      displayAns = (
                        <span className="font-semibold text-teal-900 bg-teal-50 px-2 py-1 rounded inline-block">
                          {opt ? (isHindi ? opt.label_hi : opt.label_en) : String(ans)}
                        </span>
                      );
                    } else if (q.type === "number") {
                      displayAns = (
                        <span className="font-bold text-amber-800 bg-amber-50 px-3 py-1 rounded inline-block">
                          ⭐ {ans} / 5
                        </span>
                      );
                    } else {
                      displayAns = (
                        <p className="text-slate-800 bg-slate-50 p-3 rounded-md text-sm whitespace-pre-wrap">
                          {String(ans)}
                        </p>
                      );
                    }
                  }

                  return (
                    <div
                      key={q.id}
                      className="p-3.5 rounded-lg border border-slate-100 bg-white space-y-1.5"
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-teal-700 bg-teal-50 px-1.5 py-0.5 rounded">
                          Q{qIdx + 1}
                        </span>
                        <span className="text-xs font-bold text-navy-900">
                          {isHindi ? q.label_hi : q.label_en}
                        </span>
                      </div>
                      <div className="pl-6 text-xs sm:text-sm text-slate-700">{displayAns}</div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="pt-4 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 border-t border-slate-200">
              <Button
                variant="danger"
                size="sm"
                onClick={async () => {
                  if (selectedResponse) {
                    const toDeleteId = selectedResponse.id;
                    await handleDeleteResponse(toDeleteId);
                    setIsViewingResponse(false);
                    setSelectedResponse(null);
                  }
                }}
                leftIcon={<Trash2 className="w-3.5 h-3.5" />}
              >
                {isHindi ? "डेटा हटाएं (DPDP Act 2023)" : "Delete Respondent Data (DPDP Act 2023)"}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setIsViewingResponse(false);
                  setSelectedResponse(null);
                }}
              >
                {isHindi ? "बंद करें" : "Close"}
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </>
  );
}
