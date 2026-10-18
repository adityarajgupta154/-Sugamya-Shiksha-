"use client";

import React, { useState } from "react";
import { GUIDELINES_DATA, GuidelineItem } from "@/data/guidelinesData";
import { Button } from "@/components/ui/Button";
import { Input, Textarea } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import { Modal } from "@/components/ui/Modal";
import { Edit, Save, CheckCircle2 } from "lucide-react";
import { doc, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase/firestore";

interface GuidelinesAdminTabProps {
  isHindi: boolean;
}

export function GuidelinesAdminTab({ isHindi }: GuidelinesAdminTabProps) {
  const [guidelinesList, setGuidelinesList] = useState<GuidelineItem[]>(GUIDELINES_DATA);
  const [selectedGuideline, setSelectedGuideline] = useState<GuidelineItem | null>(null);
  const [isEditingGuideline, setIsEditingGuideline] = useState(false);
  const [guidelineSuccess, setGuidelineSuccess] = useState("");

  const handleSaveGuideline = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedGuideline) return;

    if (db) {
      try {
        await setDoc(doc(db, "guidelines", selectedGuideline.id), selectedGuideline, { merge: true });
      } catch (err) {
        console.warn("Could not save to Firestore, updated local state only:", err);
      }
    }

    setGuidelinesList((curr) =>
      curr.map((g) => (g.id === selectedGuideline.id ? selectedGuideline : g))
    );

    setGuidelineSuccess(isHindi ? "दिशानिर्देश सफलतापूर्वक अपडेट हो गया!" : "Guideline updated successfully!");
    setIsEditingGuideline(false);
    setTimeout(() => setGuidelineSuccess(""), 4000);
  };

  return (
    <div className="space-y-6 pt-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-navy-800">
            {isHindi ? "कानून एवं दिशानिर्देश सूची" : "Statutory Guidelines Directory"}
          </h2>
          <p className="text-xs text-slate-500">
            {isHindi ? "व्याख्या, प्रावधान और चेकलिस्ट संपादित करें" : "Edit easy explanations, main provisions, and checklists"}
          </p>
        </div>
      </div>

      {guidelineSuccess && (
        <div role="status" className="p-3 rounded-lg bg-emerald-50 border border-emerald-300 text-xs font-semibold text-emerald-800 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" aria-hidden="true" />
          <span>{guidelineSuccess}</span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {guidelinesList.map((g) => (
          <div
            key={g.id}
            className="bg-white p-5 rounded-lg border border-slate-200 shadow-xs flex flex-col justify-between space-y-3 hover:border-teal-600 transition-colors"
          >
            <div className="space-y-1.5">
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-semibold text-teal-700 bg-teal-50 px-2 py-0.5 rounded">
                  {g.year}
                </span>
                {g.isPrimaryReference && (
                  <Badge variant="primary_reference" className="text-[10px]">
                    Primary Reference
                  </Badge>
                )}
              </div>
              <h3 className="text-base font-bold text-navy-900">
                {isHindi ? g.title_hi : g.title_en}
              </h3>
              <p className="text-xs text-slate-600 line-clamp-2">
                {isHindi ? g.shortSummary_hi : g.shortSummary_en}
              </p>
            </div>

            <div className="pt-2 flex items-center justify-end">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setSelectedGuideline({ ...g });
                  setIsEditingGuideline(true);
                }}
                leftIcon={<Edit className="w-3.5 h-3.5" />}
              >
                {isHindi ? "संपादित करें (Edit)" : "Edit"}
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal for Editing Guideline */}
      {selectedGuideline && (
        <Modal
          isOpen={isEditingGuideline}
          onClose={() => setIsEditingGuideline(false)}
          title={isHindi ? `दिशानिर्देश संपादन: ${selectedGuideline.title_hi}` : `Edit Guideline: ${selectedGuideline.title_en}`}
          size="lg"
        >
          <form onSubmit={handleSaveGuideline} className="space-y-4">
            <Input
              label={isHindi ? "शीर्षक (हिन्दी)" : "Title (Hindi)"}
              required
              value={selectedGuideline.title_hi}
              onChange={(e) =>
                setSelectedGuideline({ ...selectedGuideline, title_hi: e.target.value })
              }
            />

            <Input
              label={isHindi ? "शीर्षक (अंग्रेज़ी)" : "Title (English)"}
              required
              value={selectedGuideline.title_en}
              onChange={(e) =>
                setSelectedGuideline({ ...selectedGuideline, title_en: e.target.value })
              }
            />

            <Textarea
              label={isHindi ? "संक्षिप्त सारांश (हिन्दी)" : "Short Summary (Hindi)"}
              required
              rows={3}
              value={selectedGuideline.shortSummary_hi}
              onChange={(e) =>
                setSelectedGuideline({ ...selectedGuideline, shortSummary_hi: e.target.value })
              }
            />

            <Textarea
              label={isHindi ? "संक्षिप्त सारांश (अंग्रेज़ी)" : "Short Summary (English)"}
              required
              rows={3}
              value={selectedGuideline.shortSummary_en}
              onChange={(e) =>
                setSelectedGuideline({ ...selectedGuideline, shortSummary_en: e.target.value })
              }
            />

            <Textarea
              label={isHindi ? "सरल व्याख्या (हिन्दी)" : "Easy Explanation (Hindi)"}
              required
              rows={4}
              value={selectedGuideline.easyExplanation_hi}
              onChange={(e) =>
                setSelectedGuideline({ ...selectedGuideline, easyExplanation_hi: e.target.value })
              }
            />

            <Textarea
              label={isHindi ? "सरल व्याख्या (अंग्रेज़ी)" : "Easy Explanation (English)"}
              required
              rows={4}
              value={selectedGuideline.easyExplanation_en}
              onChange={(e) =>
                setSelectedGuideline({ ...selectedGuideline, easyExplanation_en: e.target.value })
              }
            />

            <div className="pt-4 flex items-center justify-end gap-3 border-t">
              <Button
                type="button"
                variant="ghost"
                onClick={() => setIsEditingGuideline(false)}
              >
                {isHindi ? "रद्द करें" : "Cancel"}
              </Button>
              <Button type="submit" variant="primary" leftIcon={<Save className="w-4 h-4" />}>
                {isHindi ? "परिवर्तन सहेजें" : "Save Changes"}
              </Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
