"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { AuditToolForm, AuditRecord } from "@/components/admin/AuditToolForm";
import { StandardsConfigTab } from "@/components/admin/StandardsConfigTab";
import { ScoringConfigTab } from "@/components/admin/ScoringConfigTab";
import { db } from "@/lib/firebase/firestore";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Modal } from "@/components/ui/Modal";
import {
  ClipboardCheck,
  Sliders,
  FileSpreadsheet,
  ExternalLink,
  Plus,
  Trash2,
  Eye,
  CheckCircle2,
  AlertTriangle,
  Building2,
  Calendar,
  Scale,
} from "lucide-react";

interface AuditsAdminTabProps {
  isHindi: boolean;
}

export function AuditsAdminTab({ isHindi }: AuditsAdminTabProps) {
  const [subTab, setSubTab] = useState<"form" | "records" | "standards" | "scoring">("form");
  const [auditsList, setAuditsList] = useState<AuditRecord[]>([]);
  const [selectedAuditForView, setSelectedAuditForView] = useState<AuditRecord | null>(null);
  const [deleteAuditId, setDeleteAuditId] = useState<string | null>(null);
  const [statusMsg, setStatusMsg] = useState<string>("");

  useEffect(() => {
    async function loadAudits() {
      if (!db) return;
      try {
        const snap = await getDocs(collection(db, "audits"));
        if (!snap.empty) {
          const list: AuditRecord[] = [];
          snap.forEach((d) => list.push({ id: d.id, ...d.data() } as AuditRecord));
          setAuditsList(list);
        }
      } catch (e) {
        console.warn("Using local audits fallback:", e);
      }
    }
    loadAudits();
  }, []);

  const handleDeleteAudit = async (id: string) => {
    try {
      if (db) {
        await deleteDoc(doc(db, "audits", id));
      }
      setAuditsList((prev) => prev.filter((a) => a.id !== id));
      setDeleteAuditId(null);
      setStatusMsg(isHindi ? "ऑडिट रिकॉर्ड हटा दिया गया।" : "Audit record deleted.");
      setTimeout(() => setStatusMsg(""), 3500);
    } catch (err: any) {
      alert("Delete failed: " + err.message);
    }
  };

  return (
    <div className="space-y-6 pt-4">
      {/* Top Header & Sub-Tabs Navigator */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <h2 className="text-xl font-bold text-navy-800">
            {isHindi ? "स्मार्ट ऑडिट एवं मानक प्रबंधन" : "Smart Audit Tool & Standards"}
          </h2>
          <p className="text-xs text-slate-500">
            {isHindi
              ? "विद्यालय स्थल निरीक्षण, स्वचालित विसंगति तुलना, और वैधानिक मानक विन्यास"
              : "School physical inspections, live deficiency comparison, and statutory standards"}
          </p>
        </div>

        {/* Sub-tab Switches & Direct Mobile Link */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center p-1 bg-slate-100 rounded-lg border border-slate-200">
            <button
              onClick={() => setSubTab("form")}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
                subTab === "form"
                  ? "bg-white text-navy-900 shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              {isHindi ? "ऑडिट फॉर्म" : "Audit Form"}
            </button>
            <button
              onClick={() => setSubTab("records")}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
                subTab === "records"
                  ? "bg-white text-navy-900 shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              {isHindi ? "ऑडिट रिकॉर्ड्स" : "Audits"} ({auditsList.length})
            </button>
            <button
              onClick={() => setSubTab("standards")}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
                subTab === "standards"
                  ? "bg-white text-navy-900 shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              {isHindi ? "मानक विन्यास" : "Standards Config"}
            </button>
            <button
              onClick={() => setSubTab("scoring")}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
                subTab === "scoring"
                  ? "bg-white text-navy-900 shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              {isHindi ? "स्कोरिंग विन्यास (100-अंक)" : "Scoring Config (100-pts)"}
            </button>
          </div>

          <Link href="/admin/audit" target="_blank">
            <Button
              variant="outline"
              size="sm"
              rightIcon={<ExternalLink className="w-3.5 h-3.5" />}
              className="text-xs"
            >
              {isHindi ? "मोबाइल व्यू" : "Mobile Screen"}
            </Button>
          </Link>
        </div>
      </div>

      {statusMsg && (
        <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-300 text-xs font-semibold text-emerald-800 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>{statusMsg}</span>
        </div>
      )}

      {/* SUB-TAB 1: AUDIT FORM */}
      {subTab === "form" && (
        <AuditToolForm
          isHindi={isHindi}
          onAuditSaved={(newAudit) => {
            setAuditsList((prev) => [newAudit, ...prev.filter((a) => a.id !== newAudit.id)]);
          }}
        />
      )}

      {/* SUB-TAB 2: RECORDED AUDITS LIST */}
      {subTab === "records" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-xs text-slate-500">
              {isHindi
                ? "दानापुर के विद्यालयों के दर्ज किए गए सभी ऑडिट (सत्यापित एवं ड्राफ्ट)।"
                : "All logged school accessibility audits (both verified and drafts)."}
            </p>
            <Button
              size="sm"
              onClick={() => setSubTab("form")}
              leftIcon={<Plus className="w-4 h-4" />}
            >
              {isHindi ? "नया ऑडिट प्रारंभ करें" : "Start New Audit"}
            </Button>
          </div>

          {auditsList.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-xl border border-slate-200 space-y-3">
              <ClipboardCheck className="w-10 h-10 text-slate-400 mx-auto" />
              <p className="text-sm text-slate-600">
                {isHindi ? "अभी तक कोई ऑडिट रिकॉर्ड नहीं सहेजा गया है।" : "No audits recorded yet."}
              </p>
              <Button size="sm" onClick={() => setSubTab("form")}>
                {isHindi ? "पहला स्कूल ऑडिट करें" : "Record First Audit"}
              </Button>
            </div>
          ) : (
            <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-xs">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-700 font-semibold border-b border-slate-200">
                  <tr>
                    <th className="p-3">{isHindi ? "विद्यालय का नाम" : "School"}</th>
                    <th className="p-3">{isHindi ? "निरीक्षण तिथि" : "Date"}</th>
                    <th className="p-3">{isHindi ? "अनुपालन स्कोर" : "Score"}</th>
                    <th className="p-3">{isHindi ? "विसंगतियां" : "Deficiencies"}</th>
                    <th className="p-3">{isHindi ? "स्थिति" : "Status"}</th>
                    <th className="p-3 text-right">{isHindi ? "कार्रवाई" : "Actions"}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {auditsList.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50">
                      <td className="p-3 font-bold text-navy-900">
                        {item.schoolName}
                        <div className="text-[10px] text-slate-500 font-mono mt-0.5 font-normal">
                          {item.id} • Auditor: {item.auditorName}
                        </div>
                      </td>
                      <td className="p-3 font-mono text-slate-600">{item.date}</td>
                      <td className="p-3">
                        <span
                          className={`font-mono font-bold text-sm ${
                            item.complianceRate >= 80
                              ? "text-emerald-700"
                              : item.complianceRate >= 50
                              ? "text-amber-700"
                              : "text-rose-700"
                          }`}
                        >
                          {item.complianceRate}%
                        </span>
                      </td>
                      <td className="p-3 font-mono">
                        {item.deficiencies?.length || 0}
                      </td>
                      <td className="p-3">
                        <span
                          className={`inline-flex px-2 py-0.5 rounded text-[10px] font-bold ${
                            item.status === "verified"
                              ? "bg-emerald-100 text-emerald-800"
                              : "bg-amber-100 text-amber-800"
                          }`}
                        >
                          {item.status === "verified" ? "VERIFIED" : "DRAFT"}
                        </span>
                      </td>
                      <td className="p-3 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setSelectedAuditForView(item)}
                            aria-label={isHindi ? "विवरण देखें" : "View audit"}
                          >
                            <Eye className="w-3.5 h-3.5 text-slate-600" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setDeleteAuditId(item.id)}
                            aria-label={isHindi ? "हटाएं" : "Delete audit"}
                          >
                            <Trash2 className="w-3.5 h-3.5 text-rose-600" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* SUB-TAB 3: STANDARDS CONFIG */}
      {subTab === "standards" && <StandardsConfigTab isHindi={isHindi} />}

      {/* SUB-TAB 4: SCORING RULES & WEIGHTS CONFIG */}
      {subTab === "scoring" && <ScoringConfigTab isHindi={isHindi} />}

      {/* Modal: View Audit Details */}
      {selectedAuditForView && (
        <Modal
          isOpen={true}
          onClose={() => setSelectedAuditForView(null)}
          title={
            isHindi
              ? `ऑडिट विवरण: ${selectedAuditForView.schoolName}`
              : `Audit Inspection: ${selectedAuditForView.schoolName}`
          }
          size="lg"
        >
          <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-1">
            <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50 border border-slate-200 text-xs">
              <div>
                <span className="text-slate-500">Date:</span> <strong>{selectedAuditForView.date}</strong>
                <span className="mx-2">•</span>
                <span className="text-slate-500">Auditor:</span> <strong>{selectedAuditForView.auditorName}</strong>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-teal-700">
                  Compliance: {selectedAuditForView.complianceRate}%
                </span>
                <Badge
                  variant={selectedAuditForView.status === "verified" ? "verified" : "pending"}
                >
                  {selectedAuditForView.status.toUpperCase()}
                </Badge>
              </div>
            </div>

            {selectedAuditForView.deficiencies?.length > 0 ? (
              <div className="space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-rose-800">
                  {isHindi ? "पहचानी गई विसंगतियां:" : "Flagged Deficiencies:"}
                </h4>
                <div className="space-y-2">
                  {selectedAuditForView.deficiencies.map((d: any, idx: number) => (
                    <div key={idx} className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-xs text-rose-900 space-y-1">
                      <div className="flex items-center justify-between font-bold">
                        <span>{isHindi ? d.parameter_hi : d.parameter}</span>
                        <span className="font-mono text-[10px] text-rose-700">
                          {d.severity}
                        </span>
                      </div>
                      <p>{isHindi ? d.message_hi : d.message_en}</p>
                      <div className="text-[10px] text-slate-500 font-mono">
                        Standard: {d.standardThreshold} | Source: {d.sourceDocument} ({d.sourceClause})
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="p-4 rounded-lg bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Zero deficiencies detected across all standards!</span>
              </div>
            )}

            {selectedAuditForView.generalNotes && (
              <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 text-xs space-y-1">
                <strong className="text-navy-900">Notes:</strong>
                <p className="text-slate-700 whitespace-pre-wrap">{selectedAuditForView.generalNotes}</p>
              </div>
            )}

            <div className="pt-3 flex justify-end border-t">
              <Button size="sm" variant="outline" onClick={() => setSelectedAuditForView(null)}>
                {isHindi ? "बंद करें" : "Close"}
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {/* Delete Audit Confirmation Modal */}
      {deleteAuditId && (
        <Modal
          isOpen={true}
          onClose={() => setDeleteAuditId(null)}
          title={isHindi ? "ऑडिट रिकॉर्ड हटाएं?" : "Delete Audit Record?"}
        >
          <div className="space-y-4">
            <p className="text-sm text-slate-600">
              {isHindi
                ? "क्या आप निश्चित रूप से इस विद्यालय ऑडिट रिकॉर्ड को हटाना चाहते हैं?"
                : "Are you sure you want to delete this school audit record?"}
            </p>
            <div className="flex items-center justify-end gap-3 pt-3 border-t">
              <Button variant="outline" size="sm" onClick={() => setDeleteAuditId(null)}>
                {isHindi ? "रद्द करें" : "Cancel"}
              </Button>
              <Button
                variant="danger"
                size="sm"
                onClick={() => handleDeleteAudit(deleteAuditId)}
              >
                {isHindi ? "हटाएं" : "Confirm Delete"}
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
