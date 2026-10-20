"use client";

import React, { useState, useEffect } from "react";
import { db } from "@/lib/firebase/firestore";
import {
  collection,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
  getDoc,
  orderBy,
  query,
} from "firebase/firestore";
import {
  BarrierReportItem,
  DEMO_BARRIER_REPORTS,
  BARRIER_CATEGORIES,
} from "@/data/barrierReportsData";
import { ReporterContact } from "@/lib/barrierReportValidation";
import {
  ShieldAlert,
  ShieldCheck,
  Clock,
  XCircle,
  CheckCircle2,
  Trash2,
  Lock,
  Eye,
  FileText,
  Phone,
  Mail,
  User,
  Filter,
  ExternalLink,
  AlertTriangle,
  X,
  MessageSquare,
} from "lucide-react";

interface BarrierReportsAdminTabProps {
  isHindi: boolean;
}

export function BarrierReportsAdminTab({ isHindi }: BarrierReportsAdminTabProps) {
  const [reports, setReports] = useState<BarrierReportItem[]>(DEMO_BARRIER_REPORTS);
  const [loading, setLoading] = useState<boolean>(true);
  const [statusFilter, setStatusFilter] = useState<"all" | "pending" | "verified" | "rejected">("all");
  const [feedbackMessage, setFeedbackMessage] = useState<string>("");

  // Inspection modal state
  const [selectedReport, setSelectedReport] = useState<BarrierReportItem | null>(null);
  const [privateContact, setPrivateContact] = useState<ReporterContact | null>(null);
  const [loadingContact, setLoadingContact] = useState<boolean>(false);

  // Action modals
  const [isVerifyModalOpen, setIsVerifyModalOpen] = useState<boolean>(false);
  const [adminNotesInput, setAdminNotesInput] = useState<string>("");

  const [isRejectModalOpen, setIsRejectModalOpen] = useState<boolean>(false);
  const [rejectionReasonInput, setRejectionReasonInput] = useState<string>("");

  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [activePhoto, setActivePhoto] = useState<string | null>(null);

  // Load barrier reports
  const loadReports = async () => {
    setLoading(true);
    if (!db) {
      setLoading(false);
      return;
    }
    try {
      const snap = await getDocs(collection(db, "barrierReports"));
      if (!snap.empty) {
        const list: BarrierReportItem[] = [];
        snap.forEach((d) => list.push({ id: d.id, ...d.data() } as BarrierReportItem));
        setReports(list);
      }
    } catch (err) {
      console.warn("Using demo barrier reports in admin:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReports();
  }, []);

  // Fetch private contact for a selected report
  const handleOpenInspect = async (report: BarrierReportItem) => {
    setSelectedReport(report);
    setPrivateContact(null);
    setLoadingContact(true);

    if (db && report.hasContact) {
      try {
        const contactSnap = await getDoc(
          doc(db, "barrierReports", report.id, "private", "contact")
        );
        if (contactSnap.exists()) {
          setPrivateContact(contactSnap.data() as ReporterContact);
        } else {
          // Demo fallback
          setPrivateContact({
            name: "सुनील कुमार (Demo)",
            role: "parent",
            phone: "9876543210",
            email: "sunil.demo@example.com",
          });
        }
      } catch (e) {
        console.warn("Could not fetch private contact:", e);
      }
    } else if (report.hasContact) {
      // Demo fallback contact
      setPrivateContact({
        name: "स्थानीय नागरिक (Demo)",
        role: "parent",
        phone: "9876543210",
        email: "citizen.patna@example.com",
      });
    }

    setLoadingContact(false);
  };

  // Verify Report Action
  const handleConfirmVerify = async () => {
    if (!selectedReport) return;
    const reportId = selectedReport.id;
    const notes = adminNotesInput.trim();

    if (db) {
      try {
        await updateDoc(doc(db, "barrierReports", reportId), {
          status: "verified",
          adminNotes: notes || undefined,
        });
      } catch (err) {
        console.warn("Firestore update error:", err);
      }
    }

    setReports((prev) =>
      prev.map((r) =>
        r.id === reportId ? { ...r, status: "verified", adminNotes: notes } : r
      )
    );

    setFeedbackMessage(
      isHindi
        ? "बाधा रिपोर्ट सत्यापित कर दी गई और अब यह सार्वजनिक रूप से दृश्यमान है!"
        : "Barrier report verified and now visible publicly!"
    );
    setTimeout(() => setFeedbackMessage(""), 4000);
    setIsVerifyModalOpen(false);
    setSelectedReport(null);
    setAdminNotesInput("");
  };

  // Reject Report Action
  const handleConfirmReject = async () => {
    if (!selectedReport) return;
    const reportId = selectedReport.id;
    const reason = rejectionReasonInput.trim();

    if (db) {
      try {
        await updateDoc(doc(db, "barrierReports", reportId), {
          status: "rejected",
          rejectionReason: reason || undefined,
        });
      } catch (err) {
        console.warn("Firestore update error:", err);
      }
    }

    setReports((prev) =>
      prev.map((r) =>
        r.id === reportId ? { ...r, status: "rejected", rejectionReason: reason } : r
      )
    );

    setFeedbackMessage(
      isHindi
        ? "रिपोर्ट को अस्वीकृत (Rejected) के रूप में चिह्नित किया गया।"
        : "Report marked as rejected."
    );
    setTimeout(() => setFeedbackMessage(""), 4000);
    setIsRejectModalOpen(false);
    setSelectedReport(null);
    setRejectionReasonInput("");
  };

  // Delete Report Action
  const handleDeleteReport = async (reportId: string) => {
    if (db) {
      try {
        await deleteDoc(doc(db, "barrierReports", reportId));
      } catch (err) {
        console.warn("Firestore delete error:", err);
      }
    }

    setReports((prev) => prev.filter((r) => r.id !== reportId));
    setDeleteConfirmId(null);
    setFeedbackMessage(isHindi ? "रिपोर्ट हटा दी गई।" : "Report deleted.");
    setTimeout(() => setFeedbackMessage(""), 4000);
  };

  // Filtered reports
  const filteredReports = reports.filter((r) => {
    if (statusFilter !== "all" && r.status !== statusFilter) return false;
    return true;
  });

  const pendingCount = reports.filter((r) => r.status === "pending").length;
  const verifiedCount = reports.filter((r) => r.status === "verified").length;
  const rejectedCount = reports.filter((r) => r.status === "rejected").length;

  return (
    <div className="space-y-6 pt-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-navy-800 flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-teal-600" />
            <span>{isHindi ? "सामुदायिक बाधा रिपोर्ट समीक्षा" : "Community Barrier Reports Moderation"}</span>
          </h2>
          <p className="text-xs text-slate-500">
            {isHindi
              ? "समीक्षा करें, सत्यापन के बाद ही रिपोर्ट सार्वजनिक होगी। रिपोर्टर संपर्क पूर्णतः गोपनीय है।"
              : "Review incoming reports. Only verified reports become public. Reporter contact is private to admins."}
          </p>
        </div>
      </div>

      {/* Feedback banner */}
      {feedbackMessage && (
        <div
          role="status"
          className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-300 text-xs font-semibold text-emerald-900 flex items-center gap-2 animate-fade-in"
        >
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{feedbackMessage}</span>
        </div>
      )}

      {/* Status Filter Buttons */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        <button
          type="button"
          onClick={() => setStatusFilter("all")}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 ${
            statusFilter === "all"
              ? "bg-navy-900 text-white shadow-sm"
              : "bg-slate-100 hover:bg-slate-200 text-slate-700"
          }`}
        >
          {isHindi ? `सभी (${reports.length})` : `All (${reports.length})`}
        </button>

        <button
          type="button"
          onClick={() => setStatusFilter("pending")}
          className={`px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shrink-0 ${
            statusFilter === "pending"
              ? "bg-amber-600 text-white shadow-sm"
              : "bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200"
          }`}
        >
          <Clock className="w-3.5 h-3.5" />
          <span>{isHindi ? "सत्यापन लंबित" : "Pending Review"}</span>
          <span className="px-1.5 py-0.2 bg-white/20 rounded-full text-[10px]">
            {pendingCount}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setStatusFilter("verified")}
          className={`px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shrink-0 ${
            statusFilter === "verified"
              ? "bg-emerald-700 text-white shadow-sm"
              : "bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-200"
          }`}
        >
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>{isHindi ? "सत्यापित (सार्वजनिक)" : "Verified (Public)"}</span>
          <span className="px-1.5 py-0.2 bg-white/20 rounded-full text-[10px]">
            {verifiedCount}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setStatusFilter("rejected")}
          className={`px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shrink-0 ${
            statusFilter === "rejected"
              ? "bg-rose-700 text-white shadow-sm"
              : "bg-rose-50 hover:bg-rose-100 text-rose-900 border border-rose-200"
          }`}
        >
          <XCircle className="w-3.5 h-3.5" />
          <span>{isHindi ? "अस्वीकृत" : "Rejected"}</span>
          <span className="px-1.5 py-0.2 bg-white/20 rounded-full text-[10px]">
            {rejectedCount}
          </span>
        </button>
      </div>

      {/* Reports List */}
      {filteredReports.length === 0 ? (
        <div className="p-8 text-center bg-slate-50 rounded-2xl border border-slate-200 text-slate-500 text-xs">
          {isHindi ? "इस फ़िल्टर में कोई बाधा रिपोर्ट नहीं है।" : "No reports found for this filter."}
        </div>
      ) : (
        <div className="space-y-4">
          {filteredReports.map((report) => {
            const catMeta = BARRIER_CATEGORIES.find((c) => c.id === report.category);

            return (
              <div
                key={report.id}
                className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:border-teal-500 transition-all flex flex-col sm:flex-row justify-between gap-5"
              >
                <div className="space-y-2.5 flex-1">
                  {/* Top Badges */}
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-xs font-bold bg-teal-50 text-teal-800 border border-teal-200">
                      <span>{catMeta?.icon}</span>
                      <span>{isHindi ? catMeta?.label_hi : catMeta?.label_en}</span>
                    </span>

                    {/* Status Badge */}
                    {report.status === "verified" ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                        <ShieldCheck className="w-3.5 h-3.5" />
                        <span>{isHindi ? "सत्यापित (सार्वजनिक)" : "Verified (Public)"}</span>
                      </span>
                    ) : report.status === "pending" ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-900 border border-amber-300">
                        <Clock className="w-3.5 h-3.5" />
                        <span>{isHindi ? "सत्यापन लंबित (Pending)" : "Pending Verification"}</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-100 text-rose-800 border border-rose-300">
                        <XCircle className="w-3.5 h-3.5" />
                        <span>{isHindi ? "अस्वीकृत (Rejected)" : "Rejected"}</span>
                      </span>
                    )}

                    {report.hasContact && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-200">
                        <Lock className="w-3 h-3 text-slate-500" />
                        <span>{isHindi ? "संपर्क संलग्न" : "Contact Attached"}</span>
                      </span>
                    )}

                    <span className="text-[11px] text-slate-400 font-mono ml-auto">
                      {new Date(report.createdAt).toLocaleDateString()}
                    </span>
                  </div>

                  {/* School Name */}
                  <h3 className="text-base font-bold text-navy-900 leading-snug">
                    {report.schoolName}
                  </h3>

                  {/* Description snippet */}
                  <p className="text-xs text-slate-700 leading-relaxed font-hindi bg-slate-50 p-3 rounded-xl border border-slate-100">
                    {report.description}
                  </p>

                  {/* Photos preview strip */}
                  {report.photos && report.photos.length > 0 && (
                    <div className="flex gap-2 pt-1">
                      {report.photos.map((p, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => setActivePhoto(p.url)}
                          className="w-14 h-14 rounded-lg overflow-hidden border border-slate-200 hover:ring-2 hover:ring-teal-600 transition-all cursor-pointer"
                        >
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={p.url} alt={p.name} className="w-full h-full object-cover" />
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Action/Rejection notes if present */}
                  {report.adminNotes && (
                    <p className="text-xs text-emerald-800 bg-emerald-50/70 p-2 rounded-lg border border-emerald-200">
                      <span className="font-bold">कार्यवाही/टिप्पणी: </span>
                      {report.adminNotes}
                    </p>
                  )}
                  {report.rejectionReason && (
                    <p className="text-xs text-rose-800 bg-rose-50/70 p-2 rounded-lg border border-rose-200">
                      <span className="font-bold">अस्वीकृति कारण: </span>
                      {report.rejectionReason}
                    </p>
                  )}
                </div>

                {/* Right Action Buttons */}
                <div className="flex sm:flex-col justify-end gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => handleOpenInspect(report)}
                    className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>{isHindi ? "विवरण व संपर्क" : "Inspect & Contact"}</span>
                  </button>

                  {report.status !== "verified" && (
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedReport(report);
                        setAdminNotesInput(report.adminNotes || "");
                        setIsVerifyModalOpen(true);
                      }}
                      className="px-3 py-1.5 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-xs transition-colors"
                    >
                      <ShieldCheck className="w-3.5 h-3.5" />
                      <span>{isHindi ? "सत्यापित करें" : "Verify & Approve"}</span>
                    </button>
                  )}

                  {report.status !== "rejected" && (
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedReport(report);
                        setRejectionReasonInput(report.rejectionReason || "");
                        setIsRejectModalOpen(true);
                      }}
                      className="px-3 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
                    >
                      <XCircle className="w-3.5 h-3.5" />
                      <span>{isHindi ? "अस्वीकृत करें" : "Reject"}</span>
                    </button>
                  )}

                  {deleteConfirmId === report.id ? (
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => handleDeleteReport(report.id)}
                        className="px-2 py-1 rounded bg-rose-700 text-white text-[10px] font-bold"
                      >
                        {isHindi ? "हाँ हटाएं" : "Confirm"}
                      </button>
                      <button
                        type="button"
                        onClick={() => setDeleteConfirmId(null)}
                        className="px-2 py-1 rounded bg-slate-200 text-slate-700 text-[10px]"
                      >
                        ✕
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setDeleteConfirmId(report.id)}
                      className="px-3 py-1.5 rounded-lg text-rose-700 hover:bg-rose-50 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>{isHindi ? "हटाएं" : "Delete"}</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Inspect & Private Contact Modal */}
      {selectedReport && !isVerifyModalOpen && !isRejectModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in"
        >
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-xl w-full shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="text-base font-bold text-navy-900 flex items-center gap-2">
                <FileText className="w-5 h-5 text-teal-600" />
                <span>{isHindi ? "बाधा रिपोर्ट विवरण" : "Barrier Report Full Details"}</span>
              </h3>
              <button
                type="button"
                onClick={() => setSelectedReport(null)}
                className="p-1 rounded-full text-slate-400 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs text-slate-700">
              <div>
                <span className="font-bold text-slate-500 uppercase tracking-wider block text-[10px]">
                  {isHindi ? "विद्यालय:" : "School:"}
                </span>
                <p className="font-bold text-sm text-navy-900">{selectedReport.schoolName}</p>
              </div>

              <div>
                <span className="font-bold text-slate-500 uppercase tracking-wider block text-[10px]">
                  {isHindi ? "अवलोकन विवरण:" : "Reported Observation:"}
                </span>
                <p className="bg-slate-50 p-3 rounded-xl border border-slate-200 leading-relaxed font-hindi mt-1">
                  {selectedReport.description}
                </p>
              </div>

              {/* Private Contact Details Box (Admin Only) */}
              <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-300 space-y-2.5">
                <div className="flex items-center gap-2 text-amber-950 font-bold text-xs">
                  <Lock className="w-4 h-4 text-amber-800" />
                  <span>
                    {isHindi
                      ? "🔒 रिपोर्टर संपर्क विवरण (केवल एडमिन के लिए)"
                      : "🔒 Reporter Contact (Strictly Confidential - Admin Only)"}
                  </span>
                </div>

                {loadingContact ? (
                  <p className="text-xs text-amber-800">Loading private contact...</p>
                ) : privateContact ? (
                  <div className="space-y-1.5 text-xs text-amber-900 font-mono">
                    {privateContact.name && (
                      <p className="flex items-center gap-2">
                        <User className="w-3.5 h-3.5 text-amber-700" />
                        <span className="font-sans font-bold">{privateContact.name}</span>
                        <span className="text-[10px] bg-amber-200/60 px-1.5 rounded">
                          {privateContact.role}
                        </span>
                      </p>
                    )}
                    {privateContact.phone && (
                      <p className="flex items-center gap-2">
                        <Phone className="w-3.5 h-3.5 text-amber-700" />
                        <a href={`tel:${privateContact.phone}`} className="hover:underline font-bold">
                          {privateContact.phone}
                        </a>
                      </p>
                    )}
                    {privateContact.email && (
                      <p className="flex items-center gap-2">
                        <Mail className="w-3.5 h-3.5 text-amber-700" />
                        <a href={`mailto:${privateContact.email}`} className="hover:underline font-bold">
                          {privateContact.email}
                        </a>
                      </p>
                    )}
                  </div>
                ) : (
                  <p className="text-xs text-amber-800 italic">
                    {isHindi
                      ? "रिपोर्टर ने कोई संपर्क विवरण नहीं दिया (अनाम रिपोर्ट)।"
                      : "Reporter did not provide contact details (Anonymous submission)."}
                  </p>
                )}
              </div>
            </div>

            <div className="pt-3 border-t flex justify-end">
              <button
                type="button"
                onClick={() => setSelectedReport(null)}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold"
              >
                {isHindi ? "बंद करें" : "Close"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Verification Approval Modal */}
      {isVerifyModalOpen && selectedReport && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in"
        >
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl space-y-4">
            <h3 className="text-base font-bold text-navy-900 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-600" />
              <span>{isHindi ? "बाधा रिपोर्ट को सत्यापित करें" : "Verify & Approve Barrier Report"}</span>
            </h3>

            <p className="text-xs text-slate-600 leading-relaxed">
              {isHindi
                ? "सत्यापन के उपरांत यह रिपोर्ट सार्वजनिक रूप से वेबसाइट पर प्रदर्शित होगी। आप चाहें तो नीचे शोधकर्ता अवलोकन या विद्यालय प्रबंधन समिति (SMC) को दी गई सलाह दर्ज कर सकते हैं:"
                : "Upon verification, this report will be displayed publicly on the website. You may add an optional researcher finding or SMC remediation note:"}
            </p>

            <textarea
              rows={3}
              value={adminNotesInput}
              onChange={(e) => setAdminNotesInput(e.target.value)}
              placeholder={
                isHindi
                  ? "उदा. ऑन-साइट नापजोख में ढलान 1:6 पाई गई। SMC को सुधार ज्ञापन प्रेषित।"
                  : "e.g. On-site audit confirmed slope 1:6. Remediation note submitted to SMC."
              }
              className="w-full p-3 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-emerald-600 focus:outline-none"
            />

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => {
                  setIsVerifyModalOpen(false);
                  setSelectedReport(null);
                }}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold"
              >
                {isHindi ? "रद्द करें" : "Cancel"}
              </button>
              <button
                type="button"
                onClick={handleConfirmVerify}
                className="px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold shadow-sm"
              >
                {isHindi ? "सत्यापित एवं प्रकाशित करें" : "Confirm & Publish"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Rejection Modal */}
      {isRejectModalOpen && selectedReport && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in"
        >
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl space-y-4">
            <h3 className="text-base font-bold text-navy-900 flex items-center gap-2">
              <XCircle className="w-5 h-5 text-rose-600" />
              <span>{isHindi ? "रिपोर्ट अस्वीकृत करें" : "Reject Barrier Report"}</span>
            </h3>

            <p className="text-xs text-slate-600 leading-relaxed">
              {isHindi
                ? "अस्वीकृत रिपोर्टें सार्वजनिक नहीं की जाएंगी। आंतरिक संदर्भ हेतु अस्वीकृति का कारण दर्ज करें:"
                : "Rejected reports will not be published. Enter an internal reason for rejection:"}
            </p>

            <textarea
              rows={3}
              value={rejectionReasonInput}
              onChange={(e) => setRejectionReasonInput(e.target.value)}
              placeholder={
                isHindi
                  ? "उदा. दोहराव रिपोर्ट / भौतिक अवसंरचना से संबंधित नहीं।"
                  : "e.g. Duplicate submission or non-architectural query."
              }
              className="w-full p-3 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-rose-600 focus:outline-none"
            />

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => {
                  setIsRejectModalOpen(false);
                  setSelectedReport(null);
                }}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold"
              >
                {isHindi ? "रद्द करें" : "Cancel"}
              </button>
              <button
                type="button"
                onClick={handleConfirmReject}
                className="px-4 py-2 rounded-xl bg-rose-700 hover:bg-rose-800 text-white text-xs font-bold shadow-sm"
              >
                {isHindi ? "अस्वीकृत करें" : "Confirm Reject"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Lightbox for Photos */}
      {activePhoto && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in"
          onClick={() => setActivePhoto(null)}
        >
          <div
            className="relative max-w-3xl max-h-[90vh] bg-black rounded-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setActivePhoto(null)}
              aria-label="Close photo"
              className="absolute top-3 right-3 p-2 rounded-full bg-white/20 hover:bg-white/40 text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={activePhoto} alt="Barrier evidence" className="max-w-full max-h-[85vh] object-contain" />
          </div>
        </div>
      )}
    </div>
  );
}
