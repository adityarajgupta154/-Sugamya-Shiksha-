"use client";

import React, { useState, useEffect } from "react";
import {
  AccessibilityStandard,
  DEFAULT_STANDARDS,
  StandardCategory,
} from "@/data/standardsData";
import { db } from "@/lib/firebase/firestore";
import {
  doc,
  setDoc,
  collection,
  getDocs,
} from "firebase/firestore";
import { Button } from "@/components/ui/Button";
import { Input, Textarea } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import { Modal } from "@/components/ui/Modal";
import {
  Edit,
  Save,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Sparkles,
  BookOpen,
  Filter,
} from "lucide-react";

interface StandardsConfigTabProps {
  isHindi: boolean;
}

export function StandardsConfigTab({ isHindi }: StandardsConfigTabProps) {
  const [standards, setStandards] = useState<AccessibilityStandard[]>(DEFAULT_STANDARDS);
  const [selectedStandard, setSelectedStandard] = useState<AccessibilityStandard | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [activeCategoryFilter, setActiveCategoryFilter] = useState<string>("all");
  const [statusMessage, setStatusMessage] = useState<string>("");
  const [isSaving, setIsSaving] = useState(false);

  // Load from Firestore
  useEffect(() => {
    async function loadStandards() {
      if (!db) return;
      try {
        const snap = await getDocs(collection(db, "standards"));
        if (!snap.empty) {
          const list: AccessibilityStandard[] = [];
          snap.forEach((d) => list.push({ id: d.id, ...d.data() } as AccessibilityStandard));
          setStandards(list);
        }
      } catch (e) {
        console.warn("Using default standards fallback:", e);
      }
    }
    loadStandards();
  }, []);

  const showStatus = (msg: string) => {
    setStatusMessage(msg);
    setTimeout(() => setStatusMessage(""), 4000);
  };

  const handleSaveStandard = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStandard) return;

    setIsSaving(true);
    try {
      if (db) {
        await setDoc(doc(db, "standards", selectedStandard.id), selectedStandard);
      }
      setStandards((prev) =>
        prev.map((s) => (s.id === selectedStandard.id ? selectedStandard : s))
      );
      setIsEditing(false);
      setSelectedStandard(null);
      showStatus(
        isHindi
          ? `मानक "${selectedStandard.parameter_hi}" सफलतापूर्वक अद्यतन किया गया!`
          : `Standard "${selectedStandard.parameter}" updated successfully!`
      );
    } catch (err: any) {
      alert("Error saving standard: " + err.message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleResetToDefaults = async () => {
    if (!confirm(isHindi ? "क्या आप सभी मानकों को आधिकारिक डिफ़ॉल्ट पर रीसेट करना चाहते हैं?" : "Reset all standards to confirmed statutory defaults?")) return;

    try {
      if (db) {
        for (const std of DEFAULT_STANDARDS) {
          await setDoc(doc(db, "standards", std.id), std);
        }
      }
      setStandards(DEFAULT_STANDARDS);
      showStatus(isHindi ? "सभी मानक डिफ़ॉल्ट पर रीसेट हो गए।" : "Standards reset to defaults.");
    } catch (err: any) {
      alert("Reset error: " + err.message);
    }
  };

  const filteredStandards = standards.filter(
    (s) => activeCategoryFilter === "all" || s.category === activeCategoryFilter
  );

  return (
    <div className="space-y-6 pt-4">
      {/* Header and Reset Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <h2 className="text-xl font-bold text-navy-800">
            {isHindi ? "सुगम्यता मानक विन्यास (Editable Standards)" : "Accessibility Standards Configuration"}
          </h2>
          <p className="text-xs text-slate-500">
            {isHindi
              ? "ऑडिट टूल द्वारा उपयोग किए जाने वाले थ्रेशोल्ड, संदर्भ दस्तावेज़ एवं वैधानिक धाराएं (PRD 11.2 standards)"
              : "Configurable threshold values, units, and statutory clauses used by the comparison engine"}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleResetToDefaults}
            leftIcon={<RotateCcw className="w-3.5 h-3.5" />}
          >
            {isHindi ? "डिफ़ॉल्ट रीसेट करें" : "Reset to Defaults"}
          </Button>
        </div>
      </div>

      {statusMessage && (
        <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-300 text-xs font-semibold text-emerald-800 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{statusMessage}</span>
        </div>
      )}

      {/* Category Filter Chips */}
      <div className="flex flex-wrap gap-1.5">
        <button
          onClick={() => setActiveCategoryFilter("all")}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
            activeCategoryFilter === "all"
              ? "bg-navy-800 text-white"
              : "bg-slate-100 text-slate-700 hover:bg-slate-200"
          }`}
        >
          {isHindi ? "सभी मानक" : "All Standards"} ({standards.length})
        </button>
        {Array.from(new Set(standards.map((s) => s.category))).map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategoryFilter(cat)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all ${
              activeCategoryFilter === cat
                ? "bg-navy-800 text-white"
                : "bg-slate-100 text-slate-700 hover:bg-slate-200"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Standards Table */}
      <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-xs">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 text-slate-700 font-semibold border-b border-slate-200">
            <tr>
              <th className="p-3">{isHindi ? "पैरामीटर / श्रेणी" : "Parameter"}</th>
              <th className="p-3">{isHindi ? "मानक थ्रेशोल्ड" : "Threshold"}</th>
              <th className="p-3">{isHindi ? "ऑपरेटर / इकाई" : "Operator / Unit"}</th>
              <th className="p-3">{isHindi ? "वैधानिक स्रोत" : "Official Source"}</th>
              <th className="p-3">{isHindi ? "गंभीरता" : "Severity"}</th>
              <th className="p-3 text-right">{isHindi ? "कार्रवाई" : "Edit"}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredStandards.map((std) => (
              <tr key={std.id} className="hover:bg-slate-50 transition-colors">
                <td className="p-3">
                  <div className="font-bold text-navy-900">
                    {isHindi ? std.parameter_hi : std.parameter}
                  </div>
                  <div className="text-[11px] text-slate-500 font-mono mt-0.5">
                    {std.id} • {std.category_hi}
                  </div>
                </td>
                <td className="p-3 font-mono font-bold text-teal-700">
                  {std.thresholdDisplay}
                </td>
                <td className="p-3 font-mono text-slate-600">
                  <span className="px-1.5 py-0.5 rounded bg-slate-100 text-[10px] font-semibold mr-1">
                    {std.operator.toUpperCase()}
                  </span>
                  <span>{std.unit}</span>
                </td>
                <td className="p-3">
                  <div className="font-semibold text-slate-800 line-clamp-1">
                    {std.sourceDocument}
                  </div>
                  <div className="text-[10px] text-slate-500 font-mono">
                    {std.sourceClause}
                  </div>
                </td>
                <td className="p-3">
                  <span
                    className={`inline-flex px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                      std.severity === "critical"
                        ? "bg-rose-100 text-rose-800"
                        : std.severity === "major"
                        ? "bg-amber-100 text-amber-800"
                        : "bg-slate-100 text-slate-800"
                    }`}
                  >
                    {std.severity}
                  </span>
                </td>
                <td className="p-3 text-right">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setSelectedStandard({ ...std });
                      setIsEditing(true);
                    }}
                    leftIcon={<Edit className="w-3.5 h-3.5" />}
                  >
                    {isHindi ? "संपादित करें" : "Edit"}
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Edit Standard Modal */}
      {selectedStandard && isEditing && (
        <Modal
          isOpen={true}
          onClose={() => {
            setIsEditing(false);
            setSelectedStandard(null);
          }}
          title={
            isHindi
              ? `मानक संपादन: ${selectedStandard.parameter_hi}`
              : `Edit Standard: ${selectedStandard.parameter}`
          }
          size="lg"
        >
          <form onSubmit={handleSaveStandard} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label={isHindi ? "पैरामीटर नाम (हिन्दी)" : "Parameter Name (Hindi)"}
                required
                value={selectedStandard.parameter_hi}
                onChange={(e) =>
                  setSelectedStandard({ ...selectedStandard, parameter_hi: e.target.value })
                }
              />
              <Input
                label={isHindi ? "पैरामीटर नाम (अंग्रेज़ी)" : "Parameter Name (English)"}
                required
                value={selectedStandard.parameter}
                onChange={(e) =>
                  setSelectedStandard({ ...selectedStandard, parameter: e.target.value })
                }
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Input
                label={isHindi ? "थ्रेशोल्ड प्रदर्शन पाठ" : "Threshold Display Label"}
                required
                value={selectedStandard.thresholdDisplay}
                onChange={(e) =>
                  setSelectedStandard({ ...selectedStandard, thresholdDisplay: e.target.value })
                }
              />

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {isHindi ? "ऑपरेटर (तुलना नियम)" : "Operator"}
                </label>
                <select
                  value={selectedStandard.operator}
                  onChange={(e) =>
                    setSelectedStandard({ ...selectedStandard, operator: e.target.value as any })
                  }
                  className="w-full text-xs rounded-md border border-slate-300 p-2.5 bg-white min-h-[44px]"
                >
                  <option value="gte">&gt;= (न्यूनतम मान / Greater than equal)</option>
                  <option value="lte">&lt;= (अधिकतम मान / Less than equal)</option>
                  <option value="eq">= (सटीक मान / Equal)</option>
                  <option value="bool">Boolean (उपस्थिति आवश्यक)</option>
                  <option value="range">Range (दायरे में मान)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {isHindi ? "गंभीरता (Severity)" : "Severity Level"}
                </label>
                <select
                  value={selectedStandard.severity}
                  onChange={(e) =>
                    setSelectedStandard({ ...selectedStandard, severity: e.target.value as any })
                  }
                  className="w-full text-xs rounded-md border border-slate-300 p-2.5 bg-white min-h-[44px]"
                >
                  <option value="critical">Critical (अति गंभीर / सुरक्षा खतरा)</option>
                  <option value="major">Major (प्रमुख बाधा)</option>
                  <option value="minor">Minor (मामूली विचलन)</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label={isHindi ? "आधिकारिक दस्तावेज़ स्रोत" : "Source Document"}
                required
                value={selectedStandard.sourceDocument}
                onChange={(e) =>
                  setSelectedStandard({ ...selectedStandard, sourceDocument: e.target.value })
                }
              />

              <Input
                label={isHindi ? "वैधानिक धारा / क्लॉज" : "Source Clause"}
                required
                value={selectedStandard.sourceClause}
                onChange={(e) =>
                  setSelectedStandard({ ...selectedStandard, sourceClause: e.target.value })
                }
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Textarea
                label={isHindi ? "विसंगति संदेश (हिन्दी)" : "Deficiency Message (Hindi)"}
                rows={2}
                value={selectedStandard.deficiencyMessage_hi}
                onChange={(e) =>
                  setSelectedStandard({ ...selectedStandard, deficiencyMessage_hi: e.target.value })
                }
              />

              <Textarea
                label={isHindi ? "विसंगति संदेश (अंग्रेज़ी)" : "Deficiency Message (English)"}
                rows={2}
                value={selectedStandard.deficiencyMessage_en}
                onChange={(e) =>
                  setSelectedStandard({ ...selectedStandard, deficiencyMessage_en: e.target.value })
                }
              />
            </div>

            <div className="pt-4 flex items-center justify-end gap-3 border-t">
              <Button
                variant="outline"
                type="button"
                onClick={() => {
                  setIsEditing(false);
                  setSelectedStandard(null);
                }}
              >
                {isHindi ? "रद्द करें" : "Cancel"}
              </Button>
              <Button type="submit" isLoading={isSaving} leftIcon={<Save className="w-4 h-4" />}>
                {isHindi ? "मानक सहेजें" : "Save Standard"}
              </Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
