"use client";

import React, { useState, useEffect } from "react";
import { DEMO_SCHOOLS, SchoolItem } from "@/data/schoolsData";
import { Button } from "@/components/ui/Button";
import { Input, Textarea } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import { Modal } from "@/components/ui/Modal";
import { Plus, Edit, Trash2, Save, MapPin, CheckCircle2 } from "lucide-react";
import { doc, getDocs, setDoc, deleteDoc, collection } from "firebase/firestore";
import { db } from "@/lib/firebase/firestore";
import {
  saveCustomSchool,
  deleteCustomSchool,
  mergeSchoolsWithLocal,
} from "@/lib/customSchoolsStorage";

interface SchoolsAdminTabProps {
  isHindi: boolean;
}

const BLANK_SCHOOL: SchoolItem = {
  id: "",
  name_hi: "",
  name_en: "",
  type: "government",
  address_hi: "",
  address_en: "",
  block: "Danapur",
  geo: { lat: 25.62, lng: 85.05 },
  udiseCode: "",
  auditStatus: "pending",
  score: 0,
  scoreBreakdown: {
    entrance: 0,
    toilets: 0,
    classrooms: 0,
    safety: 0,
  },
  facilities: {
    ramp: false,
    toilet: false,
    drinkingWater: false,
    wideDoors: false,
    tactilePath: false,
    emergencyExit: false,
  },
  published: true, // Published by default so newly added schools are immediately public
  isDemo: false,
};

export function SchoolsAdminTab({ isHindi }: SchoolsAdminTabProps) {
  const [schoolsList, setSchoolsList] = useState<SchoolItem[]>(() =>
    mergeSchoolsWithLocal(DEMO_SCHOOLS)
  );
  const [selectedSchool, setSelectedSchool] = useState<SchoolItem | null>(null);
  const [isEditingSchool, setIsEditingSchool] = useState(false);
  const [isAddingSchool, setIsAddingSchool] = useState(false);
  const [schoolSuccess, setSchoolSuccess] = useState("");
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  useEffect(() => {
    async function fetchSchools() {
      let baseSchools = DEMO_SCHOOLS;
      if (db) {
        try {
          const schoolsSnap = await getDocs(collection(db, "schools"));
          if (!schoolsSnap.empty) {
            baseSchools = schoolsSnap.docs.map(
              (d) => ({ id: d.id, ...d.data() } as SchoolItem)
            );
          }
        } catch (e) {
          console.info("schools using local fallback");
        }
      }
      setSchoolsList(mergeSchoolsWithLocal(baseSchools));
    }
    fetchSchools();
  }, []);

  const handleSaveSchool = async (e: React.FormEvent) => {
    e.preventDefault();
    const schoolToSave = selectedSchool;
    if (!schoolToSave) return;

    // Ensure bilingual fallbacks so blank fields don't disappear in other language
    const nameHi = (schoolToSave.name_hi || schoolToSave.name_en || "").trim();
    const nameEn = (schoolToSave.name_en || schoolToSave.name_hi || "").trim();
    const addrHi = (schoolToSave.address_hi || schoolToSave.address_en || "").trim();
    const addrEn = (schoolToSave.address_en || schoolToSave.address_hi || "").trim();

    let id = schoolToSave.id;
    if (!id) {
      id =
        nameEn
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/(^-|-$)/g, "")
          .slice(0, 50) || `school-${Date.now()}`;
    }

    const finalSchool: SchoolItem = {
      ...schoolToSave,
      id,
      name_hi: nameHi,
      name_en: nameEn,
      address_hi: addrHi,
      address_en: addrEn,
      published: schoolToSave.published !== false, // default true
    };

    // 1. Immediately save to browser localStorage & broadcast to public pages
    saveCustomSchool(finalSchool);

    // 2. Also attempt to sync to cloud Firestore
    if (db) {
      try {
        await setDoc(doc(db, "schools", id), finalSchool, { merge: true });
      } catch (err) {
        console.warn("Could not save school to Firestore, saved to browser localStorage:", err);
      }
    }

    // Update local state
    setSchoolsList((curr) => {
      const filtered = curr.filter((s) => s.id !== finalSchool.id);
      return [finalSchool, ...filtered];
    });

    setSchoolSuccess(
      isHindi
        ? `विद्यालय "${finalSchool.name_hi}" सुरक्षित हो गया और मुख्य वेबसाइट पर तुरंत दिखाई देगा!`
        : `School "${finalSchool.name_en}" saved and immediately visible on website!`
    );
    setIsEditingSchool(false);
    setIsAddingSchool(false);
    setSelectedSchool(null);
    setTimeout(() => setSchoolSuccess(""), 5000);
  };

  const handleDeleteSchool = async (schoolId: string) => {
    // 1. Delete from local storage
    deleteCustomSchool(schoolId);

    // 2. Also attempt cloud delete
    if (db) {
      try {
        await deleteDoc(doc(db, "schools", schoolId));
      } catch (err) {
        console.warn("Could not delete from Firestore:", err);
      }
    }

    setSchoolsList((curr) => curr.filter((s) => s.id !== schoolId));
    setDeleteConfirmId(null);
    setSchoolSuccess(
      isHindi
        ? "विद्यालय रिकॉर्ड हटा दिया गया और वेबसाइट से हटा दिया गया।"
        : "School record deleted and removed from website."
    );
    setTimeout(() => setSchoolSuccess(""), 4000);
  };

  return (
    <div className="space-y-6 pt-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-navy-800">
            {isHindi ? "विद्यालय अभिगम्यता निर्देशिका प्रबंधन" : "School Accessibility Directory Management"}
          </h2>
          <p className="text-xs text-slate-500">
            {isHindi ? "विद्यालय जोड़ें, संपादित करें या हटाएं — अक्षांश/देशांतर सहित" : "Add, edit, or remove schools — including latitude/longitude"}
          </p>
        </div>

        <Button
          variant="secondary"
          size="sm"
          leftIcon={<Plus className="w-4 h-4" />}
          onClick={() => {
            setSelectedSchool({ ...BLANK_SCHOOL });
            setIsAddingSchool(true);
            setIsEditingSchool(true);
          }}
        >
          {isHindi ? "नया विद्यालय जोड़ें" : "Add New School"}
        </Button>
      </div>

      {schoolSuccess && (
        <div role="status" className="p-3 rounded-lg bg-emerald-50 border border-emerald-300 text-xs font-semibold text-emerald-800 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" aria-hidden="true" />
          <span>{schoolSuccess}</span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {schoolsList.map((school) => (
          <div
            key={school.id}
            className="bg-white p-5 rounded-lg border border-slate-200 shadow-xs flex flex-col justify-between space-y-3 hover:border-teal-600 transition-colors"
          >
            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant={school.type === "government" ? "government" : "private"} className="text-[10px]">
                  {school.type === "government" ? "Govt" : "Private"}
                </Badge>
                <Badge variant={school.auditStatus} className="text-[10px]">
                  {school.auditStatus === "audited" ? "Audited" : school.auditStatus === "follow_up_required" ? "Follow-up" : "Pending"}
                </Badge>
                {!school.published && (
                  <Badge variant="rejected" className="text-[10px]">
                    Unpublished
                  </Badge>
                )}
                {school.isDemo && (
                  <Badge variant="default" className="text-[10px]">
                    Demo
                  </Badge>
                )}
              </div>

              <h3 className="text-base font-bold text-navy-900">
                {isHindi ? school.name_hi : school.name_en}
              </h3>
              <p className="text-xs text-slate-500 flex items-start gap-1">
                <MapPin className="w-3 h-3 mt-0.5 shrink-0" aria-hidden="true" />
                {isHindi ? school.address_hi : school.address_en}
              </p>
              <p className="text-[11px] text-slate-400 font-mono">
                {school.geo.lat.toFixed(4)}, {school.geo.lng.toFixed(4)}
                {school.udiseCode && ` • UDISE: ${school.udiseCode}`}
              </p>
            </div>

            <div className="pt-2 flex items-center justify-between gap-2 border-t border-slate-100">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setSelectedSchool({ ...school });
                  setIsAddingSchool(false);
                  setIsEditingSchool(true);
                }}
                leftIcon={<Edit className="w-3.5 h-3.5" />}
              >
                {isHindi ? "संपादित करें" : "Edit"}
              </Button>

              {deleteConfirmId === school.id ? (
                <div className="flex items-center gap-2">
                  <span className="text-xs text-red-700 font-semibold">
                    {isHindi ? "पक्का हटाएं?" : "Confirm?"}
                  </span>
                  <Button variant="danger" size="sm" onClick={() => handleDeleteSchool(school.id)}>
                    {isHindi ? "हाँ" : "Yes"}
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => setDeleteConfirmId(null)}>
                    {isHindi ? "नहीं" : "No"}
                  </Button>
                </div>
              ) : (
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-red-600 hover:bg-red-50"
                  onClick={() => setDeleteConfirmId(school.id)}
                  leftIcon={<Trash2 className="w-3.5 h-3.5" />}
                >
                  {isHindi ? "हटाएं" : "Delete"}
                </Button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Modal for Adding/Editing School */}
      {selectedSchool && (
        <Modal
          isOpen={isEditingSchool}
          onClose={() => {
            setIsEditingSchool(false);
            setIsAddingSchool(false);
            setSelectedSchool(null);
          }}
          title={
            isAddingSchool
              ? isHindi
                ? "नया विद्यालय जोड़ें"
                : "Add New School"
              : isHindi
                ? `विद्यालय संपादन: ${selectedSchool.name_hi}`
                : `Edit School: ${selectedSchool.name_en}`
          }
          size="xl"
        >
          <form onSubmit={handleSaveSchool} className="space-y-5">
            {/* Bilingual Names */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label={isHindi ? "विद्यालय का नाम (हिन्दी)" : "School Name (Hindi)"}
                required
                value={selectedSchool.name_hi}
                onChange={(e) =>
                  setSelectedSchool({ ...selectedSchool, name_hi: e.target.value })
                }
              />
              <Input
                label={isHindi ? "विद्यालय का नाम (अंग्रेज़ी)" : "School Name (English)"}
                required
                value={selectedSchool.name_en}
                onChange={(e) =>
                  setSelectedSchool({ ...selectedSchool, name_en: e.target.value })
                }
              />
            </div>

            {/* Bilingual Addresses */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label={isHindi ? "पता (हिन्दी)" : "Address (Hindi)"}
                required
                value={selectedSchool.address_hi}
                onChange={(e) =>
                  setSelectedSchool({ ...selectedSchool, address_hi: e.target.value })
                }
              />
              <Input
                label={isHindi ? "पता (अंग्रेज़ी)" : "Address (English)"}
                required
                value={selectedSchool.address_en}
                onChange={(e) =>
                  setSelectedSchool({ ...selectedSchool, address_en: e.target.value })
                }
              />
            </div>

            {/* Type, Audit Status, Block, UDISE */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              <div className="space-y-1.5">
                <label htmlFor="admin-school-type" className="block text-sm font-semibold text-navy-800">
                  {isHindi ? "प्रकार" : "Type"}
                </label>
                <select
                  id="admin-school-type"
                  value={selectedSchool.type}
                  onChange={(e: any) =>
                    setSelectedSchool({ ...selectedSchool, type: e.target.value })
                  }
                  className="w-full h-11 rounded-md border border-slate-300 bg-white px-3 text-sm text-navy-900 focus:border-teal-600 focus:ring-1 focus:ring-teal-600"
                >
                  <option value="government">{isHindi ? "सरकारी" : "Government"}</option>
                  <option value="private">{isHindi ? "निजी" : "Private"}</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label htmlFor="admin-school-status" className="block text-sm font-semibold text-navy-800">
                  {isHindi ? "ऑडिट स्थिति" : "Audit Status"}
                </label>
                <select
                  id="admin-school-status"
                  value={selectedSchool.auditStatus}
                  onChange={(e: any) =>
                    setSelectedSchool({ ...selectedSchool, auditStatus: e.target.value })
                  }
                  className="w-full h-11 rounded-md border border-slate-300 bg-white px-3 text-sm text-navy-900 focus:border-teal-600 focus:ring-1 focus:ring-teal-600"
                >
                  <option value="pending">{isHindi ? "प्रक्रियाधीन" : "Pending"}</option>
                  <option value="audited">{isHindi ? "ऑडिट पूर्ण" : "Audited"}</option>
                  <option value="follow_up_required">{isHindi ? "पुनः निरीक्षण" : "Follow-up Required"}</option>
                </select>
              </div>

              <Input
                label={isHindi ? "प्रखंड" : "Block"}
                value={selectedSchool.block}
                onChange={(e) =>
                  setSelectedSchool({ ...selectedSchool, block: e.target.value })
                }
              />

              <Input
                label="UDISE Code"
                value={selectedSchool.udiseCode || ""}
                onChange={(e) =>
                  setSelectedSchool({ ...selectedSchool, udiseCode: e.target.value })
                }
              />
            </div>

            {/* Latitude, Longitude, Score, Last Audit Date */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <Input
                label={isHindi ? "अक्षांश (Latitude)" : "Latitude"}
                type="number"
                required
                value={String(selectedSchool.geo.lat)}
                onChange={(e) =>
                  setSelectedSchool({
                    ...selectedSchool,
                    geo: { ...selectedSchool.geo, lat: parseFloat(e.target.value) || 0 },
                  })
                }
              />
              <Input
                label={isHindi ? "देशांतर (Longitude)" : "Longitude"}
                type="number"
                required
                value={String(selectedSchool.geo.lng)}
                onChange={(e) =>
                  setSelectedSchool({
                    ...selectedSchool,
                    geo: { ...selectedSchool.geo, lng: parseFloat(e.target.value) || 0 },
                  })
                }
              />
              <Input
                label={isHindi ? "स्कोर (0-100)" : "Score (0-100)"}
                type="number"
                value={String(selectedSchool.score)}
                onChange={(e) =>
                  setSelectedSchool({ ...selectedSchool, score: parseInt(e.target.value) || 0 })
                }
              />
              <Input
                label={isHindi ? "अंतिम ऑडिट तिथि" : "Last Audit Date"}
                type="date"
                value={selectedSchool.lastAuditDate || ""}
                onChange={(e) =>
                  setSelectedSchool({ ...selectedSchool, lastAuditDate: e.target.value })
                }
              />
            </div>

            {/* Category Breakdown (PRD 6.2-C & Task 10) */}
            <fieldset className="space-y-3 p-4 rounded-lg border border-slate-200 bg-slate-50">
              <legend className="text-sm font-bold text-navy-800 px-2">
                {isHindi ? "स्तंभवार स्कोर विवरण (100 अंक भार)" : "Pillar Breakdown Scores (100 Pts Weight)"}
              </legend>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <Input
                  label={isHindi ? "प्रवेश व रैंप (अधिकतम 30)" : "Entrance & Ramps (Max 30)"}
                  type="number"
                  min="0"
                  max="30"
                  value={String(selectedSchool.scoreBreakdown?.entrance ?? 0)}
                  onChange={(e) => {
                    const ent = parseInt(e.target.value) || 0;
                    const prevBd = selectedSchool.scoreBreakdown || { entrance: 0, toilets: 0, classrooms: 0, safety: 0 };
                    const newBd = { ...prevBd, entrance: ent };
                    const newScore = newBd.entrance + newBd.toilets + newBd.classrooms + newBd.safety;
                    setSelectedSchool({
                      ...selectedSchool,
                      score: newScore,
                      scoreBreakdown: newBd,
                    });
                  }}
                />
                <Input
                  label={isHindi ? "शौचालय व पेयजल (अधिकतम 30)" : "Toilets & Water (Max 30)"}
                  type="number"
                  min="0"
                  max="30"
                  value={String(selectedSchool.scoreBreakdown?.toilets ?? 0)}
                  onChange={(e) => {
                    const toi = parseInt(e.target.value) || 0;
                    const prevBd = selectedSchool.scoreBreakdown || { entrance: 0, toilets: 0, classrooms: 0, safety: 0 };
                    const newBd = { ...prevBd, toilets: toi };
                    const newScore = newBd.entrance + newBd.toilets + newBd.classrooms + newBd.safety;
                    setSelectedSchool({
                      ...selectedSchool,
                      score: newScore,
                      scoreBreakdown: newBd,
                    });
                  }}
                />
                <Input
                  label={isHindi ? "कक्षा कक्ष (अधिकतम 25)" : "Classrooms (Max 25)"}
                  type="number"
                  min="0"
                  max="25"
                  value={String(selectedSchool.scoreBreakdown?.classrooms ?? 0)}
                  onChange={(e) => {
                    const cls = parseInt(e.target.value) || 0;
                    const prevBd = selectedSchool.scoreBreakdown || { entrance: 0, toilets: 0, classrooms: 0, safety: 0 };
                    const newBd = { ...prevBd, classrooms: cls };
                    const newScore = newBd.entrance + newBd.toilets + newBd.classrooms + newBd.safety;
                    setSelectedSchool({
                      ...selectedSchool,
                      score: newScore,
                      scoreBreakdown: newBd,
                    });
                  }}
                />
                <Input
                  label={isHindi ? "संकेतक व सुरक्षा (अधिकतम 15)" : "Safety & Signage (Max 15)"}
                  type="number"
                  min="0"
                  max="15"
                  value={String(selectedSchool.scoreBreakdown?.safety ?? 0)}
                  onChange={(e) => {
                    const saf = parseInt(e.target.value) || 0;
                    const prevBd = selectedSchool.scoreBreakdown || { entrance: 0, toilets: 0, classrooms: 0, safety: 0 };
                    const newBd = { ...prevBd, safety: saf };
                    const newScore = newBd.entrance + newBd.toilets + newBd.classrooms + newBd.safety;
                    setSelectedSchool({
                      ...selectedSchool,
                      score: newScore,
                      scoreBreakdown: newBd,
                    });
                  }}
                />
              </div>
            </fieldset>

            {/* Facilities Checkboxes */}
            <fieldset className="space-y-3 p-4 rounded-lg border border-slate-200 bg-slate-50">
              <legend className="text-sm font-bold text-navy-800 px-2">
                {isHindi ? "सुलभ सुविधाएं" : "Accessibility Facilities"}
              </legend>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {([
                  ["ramp", isHindi ? "रैंप" : "Ramp with Handrails"],
                  ["toilet", isHindi ? "सुलभ शौचालय" : "Accessible Toilet"],
                  ["drinkingWater", isHindi ? "पेयजल" : "Accessible Drinking Water"],
                  ["wideDoors", isHindi ? "चौड़े द्वार" : "Wide Doors (≥900mm)"],
                  ["tactilePath", isHindi ? "स्पर्शनीय पाथवे" : "Tactile Pathway"],
                  ["emergencyExit", isHindi ? "आपातकालीन निकास" : "Emergency Exit"],
                ] as [keyof SchoolItem["facilities"], string][]).map(([key, label]) => (
                  <label key={key} className="flex items-center gap-2 text-sm cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedSchool.facilities[key]}
                      onChange={(e) =>
                        setSelectedSchool({
                          ...selectedSchool,
                          facilities: { ...selectedSchool.facilities, [key]: e.target.checked },
                        })
                      }
                      className="w-4 h-4 rounded border-slate-300 text-teal-600 focus:ring-teal-600"
                    />
                    <span className="text-slate-700">{label}</span>
                  </label>
                ))}
              </div>
            </fieldset>

            {/* Published + Demo toggles */}
            <div className="flex flex-wrap items-center gap-6">
              <label className="flex items-center gap-2 text-sm font-semibold cursor-pointer">
                <input
                  type="checkbox"
                  checked={selectedSchool.published}
                  onChange={(e) =>
                    setSelectedSchool({ ...selectedSchool, published: e.target.checked })
                  }
                  className="w-4 h-4 rounded border-slate-300 text-teal-600 focus:ring-teal-600"
                />
                <span className="text-navy-800">
                  {isHindi ? "प्रकाशित (सार्वजनिक दृश्यमान)" : "Published (publicly visible)"}
                </span>
              </label>
              <label className="flex items-center gap-2 text-sm font-semibold cursor-pointer">
                <input
                  type="checkbox"
                  checked={selectedSchool.isDemo}
                  onChange={(e) =>
                    setSelectedSchool({ ...selectedSchool, isDemo: e.target.checked })
                  }
                  className="w-4 h-4 rounded border-slate-300 text-amber-600 focus:ring-amber-600"
                />
                <span className="text-navy-800">
                  {isHindi ? "डेमो रिकॉर्ड" : "Demo record"}
                </span>
              </label>
            </div>

            {/* Findings */}
            <Textarea
              label={isHindi ? "ऑडिट निष्कर्ष (हिन्दी) — एक प्रति पंक्ति" : "Audit Findings (Hindi) — one per line"}
              rows={4}
              value={(selectedSchool.findings_hi || []).join("\n")}
              onChange={(e) =>
                setSelectedSchool({
                  ...selectedSchool,
                  findings_hi: e.target.value.split("\n").filter(Boolean),
                })
              }
            />

            <Textarea
              label={isHindi ? "ऑडिट निष्कर्ष (अंग्रेज़ी) — एक प्रति पंक्ति" : "Audit Findings (English) — one per line"}
              rows={4}
              value={(selectedSchool.findings_en || []).join("\n")}
              onChange={(e) =>
                setSelectedSchool({
                  ...selectedSchool,
                  findings_en: e.target.value.split("\n").filter(Boolean),
                })
              }
            />

            {/* Submit / Cancel */}
            <div className="pt-4 flex items-center justify-end gap-3 border-t">
              <Button
                type="button"
                variant="ghost"
                onClick={() => {
                  setIsEditingSchool(false);
                  setIsAddingSchool(false);
                  setSelectedSchool(null);
                }}
              >
                {isHindi ? "रद्द करें" : "Cancel"}
              </Button>
              <Button type="submit" variant="primary" leftIcon={<Save className="w-4 h-4" />}>
                {isAddingSchool
                  ? isHindi
                    ? "विद्यालय जोड़ें"
                    : "Add School"
                  : isHindi
                    ? "परिवर्तन सहेजें"
                    : "Save Changes"}
              </Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
