"use client";

import React, { useState, useEffect, useRef } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { DEMO_SCHOOLS, SchoolItem } from "@/data/schoolsData";
import { mergeSchoolsWithLocal } from "@/lib/customSchoolsStorage";
import { BARRIER_CATEGORIES } from "@/data/barrierReportsData";
import {
  BarrierCategory,
  BarrierPhoto,
  ReporterContact,
  validateBarrierReport,
} from "@/lib/barrierReportValidation";
import { db } from "@/lib/firebase/firestore";
import { storage } from "@/lib/firebase/storage";
import { collection, doc, setDoc, getDocs, query, where, serverTimestamp } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import {
  AlertTriangle,
  Upload,
  CheckCircle2,
  XCircle,
  Shield,
  Lock,
  Camera,
  Trash2,
  Info,
  Clock,
  Sparkles,
  School,
  User,
  Phone,
  Mail,
  Send,
  HelpCircle,
} from "lucide-react";

interface ReportBarrierFormProps {
  onSuccess?: (reportId: string) => void;
}

export function ReportBarrierForm({ onSuccess }: ReportBarrierFormProps) {
  const { locale } = useLanguage();
  const isHindi = locale === "hi";

  // Schools list state
  const [schools, setSchools] = useState<SchoolItem[]>(DEMO_SCHOOLS);
  const [selectedSchoolId, setSelectedSchoolId] = useState<string>("");
  const [customSchoolName, setCustomSchoolName] = useState<string>("");
  const [isOtherSchool, setIsOtherSchool] = useState<boolean>(false);

  // Barrier fields
  const [category, setCategory] = useState<BarrierCategory>("ramp");
  const [description, setDescription] = useState<string>("");

  // Photos state
  const [photos, setPhotos] = useState<BarrierPhoto[]>([]);
  const [uploadingPhotos, setUploadingPhotos] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Optional Contact fields
  const [reporterName, setReporterName] = useState<string>("");
  const [reporterPhone, setReporterPhone] = useState<string>("");
  const [reporterEmail, setReporterEmail] = useState<string>("");
  const [reporterRole, setReporterRole] = useState<
    "student" | "parent" | "teacher" | "resident" | "advocate" | "other"
  >("parent");
  const [showContactDetails, setShowContactDetails] = useState<boolean>(false);

  // 3-clause mandatory consent
  const [consentResearch, setConsentResearch] = useState<boolean>(false);
  const [consentNoFaces, setConsentNoFaces] = useState<boolean>(false);
  const [consentModeration, setConsentModeration] = useState<boolean>(false);

  // Anti-spam & timing
  const [honeypot, setHoneypot] = useState<string>("");
  const [mountTime] = useState<number>(Date.now());

  // UI status
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [submittedId, setSubmittedId] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [rateLimitError, setRateLimitError] = useState<string | null>(null);

  // Load published schools for dropdown (merging cloud & custom locally saved schools)
  useEffect(() => {
    async function loadSchools() {
      let baseList = DEMO_SCHOOLS;
      if (db) {
        try {
          const q = query(collection(db, "schools"), where("published", "==", true));
          const snap = await getDocs(q);
          if (!snap.empty) {
            baseList = snap.docs.map((d) => ({ id: d.id, ...d.data() } as SchoolItem));
          }
        } catch (e) {
          // Fallback to DEMO_SCHOOLS
        }
      }
      setSchools(mergeSchoolsWithLocal(baseList).filter((s) => s.published));
    }
    loadSchools();
  }, []);

  // Handle School Dropdown Change
  const handleSchoolChange = (val: string) => {
    setSelectedSchoolId(val);
    if (val === "other") {
      setIsOtherSchool(true);
    } else {
      setIsOtherSchool(false);
      const matched = schools.find((s) => s.id === val);
      if (matched) {
        setCustomSchoolName(isHindi ? matched.name_hi : matched.name_en);
      }
    }
    if (errors.schoolName) {
      setErrors((prev) => {
        const copy = { ...prev };
        delete copy.schoolName;
        return copy;
      });
    }
  };

  // Handle Photo selection and local upload/staging
  const handlePhotoSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    if (photos.length + files.length > 3) {
      alert(
        isHindi
          ? "आप अधिकतम 3 तस्वीरें ही अपलोड कर सकते हैं।"
          : "You can upload a maximum of 3 photos."
      );
      return;
    }

    setUploadingPhotos(true);
    const newPhotos: BarrierPhoto[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];

      // Validate size <= 5MB
      if (file.size > 5 * 1024 * 1024) {
        alert(
          isHindi
            ? `फ़ाइल ${file.name} 5MB से बड़ी है। कृपया छोटी तस्वीर चुनें।`
            : `File ${file.name} exceeds 5MB. Please choose a smaller photo.`
        );
        continue;
      }

      // Read local preview / data URL
      const dataUrl = await new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onload = (ev) => resolve(ev.target?.result as string);
        reader.readAsDataURL(file);
      });

      newPhotos.push({
        name: file.name,
        url: dataUrl,
        sizeBytes: file.size,
        type: file.type,
      });
    }

    setPhotos((prev) => [...prev, ...newPhotos]);
    setUploadingPhotos(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleRemovePhoto = (idx: number) => {
    setPhotos((prev) => prev.filter((_, i) => i !== idx));
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setRateLimitError(null);

    // 1. Check client-side rate limiting (5 minutes cooldown)
    const LAST_SUBMIT_KEY = "ssb_barrier_last_submit";
    const lastSubmit = localStorage.getItem(LAST_SUBMIT_KEY);
    if (lastSubmit) {
      const elapsed = Date.now() - parseInt(lastSubmit, 10);
      const COOLDOWN = 3 * 60 * 1000; // 3 minutes
      if (elapsed < COOLDOWN) {
        const remainingSec = Math.ceil((COOLDOWN - elapsed) / 1000);
        setRateLimitError(
          isHindi
            ? `कृपया प्रतीक्षा करें। आप ${remainingSec} सेकंड बाद अगली रिपोर्ट जमा कर सकते हैं।`
            : `Rate limit: Please wait ${remainingSec} seconds before submitting another report.`
        );
        return;
      }
    }

    // Determine school name
    let finalSchoolName = customSchoolName;
    if (!isOtherSchool && selectedSchoolId) {
      const matched = schools.find((s) => s.id === selectedSchoolId);
      if (matched) {
        finalSchoolName = isHindi ? matched.name_hi : matched.name_en;
      }
    }

    // Construct validation input
    const input = {
      schoolId: isOtherSchool ? undefined : selectedSchoolId || undefined,
      schoolName: finalSchoolName,
      category,
      description,
      photos,
      reporterContact: {
        name: reporterName,
        phone: reporterPhone,
        email: reporterEmail,
        role: reporterRole,
      },
      consentResearch,
      consentNoFaces,
      consentModeration,
      honeypot,
      submissionTimestamp: mountTime,
    };

    // 2. Pure TDD validation seam
    const validation = validateBarrierReport(input);
    if (!validation.isValid) {
      setErrors(validation.errors);
      const firstKey = Object.keys(validation.errors)[0];
      const el = document.getElementById(`field-${firstKey}`);
      if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }

    setErrors({});
    setSubmitting(true);

    try {
      const reportId = `rep-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
      const uploadedPhotoUrls: Array<{ name: string; url: string }> = [];

      // Upload photos to Firebase Storage if available
      if (storage && photos.length > 0) {
        for (let i = 0; i < photos.length; i++) {
          const p = photos[i];
          if (p.url.startsWith("data:")) {
            try {
              const res = await fetch(p.url);
              const blob = await res.blob();
              const photoStorageRef = ref(
                storage,
                `barrierReports/${reportId}/${i}_${p.name.replace(/[^a-zA-Z0-9._-]/g, "_")}`
              );
              await uploadBytes(photoStorageRef, blob);
              const downloadUrl = await getDownloadURL(photoStorageRef);
              uploadedPhotoUrls.push({ name: p.name, url: downloadUrl });
            } catch (storageErr) {
              console.warn("Storage upload failed, keeping staging URL:", storageErr);
              uploadedPhotoUrls.push({ name: p.name, url: p.url });
            }
          } else {
            uploadedPhotoUrls.push({ name: p.name, url: p.url });
          }
        }
      } else {
        photos.forEach((p) => uploadedPhotoUrls.push({ name: p.name, url: p.url }));
      }

      // Public Document in Firestore (Pending status, NO reporter contact)
      const sanitizedDoc = {
        ...validation.sanitizedReport,
        id: reportId,
        photos: uploadedPhotoUrls,
        createdAt: new Date().toISOString(),
      };

      if (db) {
        // Write main public report (status: "pending")
        await setDoc(doc(db, "barrierReports", reportId), {
          ...sanitizedDoc,
          serverTimestamp: serverTimestamp(),
        });

        // Write private contact subdoc if contact provided (PRD Section 10 & 11.3)
        if (validation.sanitizedContact) {
          await setDoc(
            doc(db, "barrierReports", reportId, "private", "contact"),
            {
              ...validation.sanitizedContact,
              reportId,
              createdAt: new Date().toISOString(),
              serverTimestamp: serverTimestamp(),
            }
          );
        }
      }

      // Set rate limit cooldown in localStorage
      localStorage.setItem(LAST_SUBMIT_KEY, Date.now().toString());

      setSubmittedId(reportId);
      if (onSuccess) onSuccess(reportId);
    } catch (err: any) {
      console.error("Failed to submit barrier report:", err);
      setErrors({
        submit:
          isHindi
            ? "रिपोर्ट सबमिट करने में समस्या आई। कृपया पुनः प्रयास करें।"
            : "Failed to submit report. Please check your internet connection and try again.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  // Reset form to submit another report
  const handleResetForm = () => {
    setSelectedSchoolId("");
    setCustomSchoolName("");
    setIsOtherSchool(false);
    setCategory("ramp");
    setDescription("");
    setPhotos([]);
    setReporterName("");
    setReporterPhone("");
    setReporterEmail("");
    setConsentResearch(false);
    setConsentNoFaces(false);
    setConsentModeration(false);
    setSubmittedId(null);
    setErrors({});
  };

  // Success view
  if (submittedId) {
    return (
      <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-xl max-w-2xl mx-auto text-center space-y-6 animate-fade-in">
        <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center mx-auto text-3xl shadow-inner">
          ✓
        </div>

        <div className="space-y-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-amber-100 text-amber-900 border border-amber-300">
            <Clock className="w-3.5 h-3.5" />
            <span>{isHindi ? "सत्यापन लंबित (Pending Review)" : "Pending Admin Verification"}</span>
          </span>
          <h2 className="text-2xl font-black text-navy-900">
            {isHindi ? "बाधा रिपोर्ट सफलतापूर्वक दर्ज कर ली गई!" : "Barrier Report Submitted Successfully!"}
          </h2>
          <p className="text-sm text-slate-600 leading-relaxed max-w-lg mx-auto">
            {isHindi
              ? "आपकी रिपोर्ट सुरक्षित रूप से सहेज ली गई है। शोध नैतिकता और गोपनीयता के अनुरूप, यह रिपोर्ट एडमिन द्वारा सत्यापन के बाद ही सार्वजनिक रूप से प्रकाशित की जाएगी।"
              : "Your report has been securely saved. In adherence to research ethics and privacy standards, this report will remain in pending status until reviewed and verified by the research administrator."}
          </p>
        </div>

        <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-left text-xs space-y-2 font-mono">
          <div className="flex justify-between text-slate-600">
            <span className="font-semibold">{isHindi ? "रिपोर्ट संदर्भ संख्या:" : "Reference ID:"}</span>
            <span className="font-bold text-navy-900">{submittedId}</span>
          </div>
          <div className="flex justify-between text-slate-600">
            <span className="font-semibold">{isHindi ? "स्थिति (Status):" : "Status:"}</span>
            <span className="font-bold text-amber-800">⏳ pending (सत्यापन लंबित)</span>
          </div>
        </div>

        <div className="pt-4 flex flex-col sm:flex-row gap-3 justify-center">
          <button
            type="button"
            onClick={handleResetForm}
            className="px-6 py-3 rounded-xl bg-teal-700 hover:bg-teal-800 text-white font-bold text-sm shadow-md transition-colors"
          >
            {isHindi ? "एक और रिपोर्ट दर्ज करें" : "Submit Another Report"}
          </button>
        </div>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-xl max-w-3xl mx-auto space-y-8"
      aria-label={isHindi ? "अभिगम्यता बाधा रिपोर्ट फॉर्म" : "Accessibility Barrier Report Form"}
    >
      {/* Rate limit warning */}
      {rateLimitError && (
        <div
          role="alert"
          className="p-4 rounded-2xl bg-amber-50 border border-amber-300 text-amber-900 text-sm flex items-start gap-3"
        >
          <Clock className="w-5 h-5 shrink-0 text-amber-700 mt-0.5" />
          <p>{rateLimitError}</p>
        </div>
      )}

      {/* General error summary */}
      {Object.keys(errors).length > 0 && (
        <div
          role="alert"
          tabIndex={-1}
          className="p-4 rounded-2xl bg-rose-50 border border-rose-300 text-rose-900 text-sm space-y-2"
        >
          <div className="flex items-center gap-2 font-bold text-rose-950">
            <AlertTriangle className="w-5 h-5 text-rose-700" />
            <span>
              {isHindi
                ? "कृपया फॉर्म में निम्नलिखित त्रुटियों को ठीक करें:"
                : "Please correct the following errors before submitting:"}
            </span>
          </div>
          <ul className="list-disc pl-5 space-y-1 text-xs text-rose-800">
            {Object.values(errors).map((err, i) => (
              <li key={i}>{err}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Hidden honeypot anti-spam trap */}
      <div className="hidden" aria-hidden="true">
        <label htmlFor="website-trap">Leave this blank</label>
        <input
          id="website-trap"
          type="text"
          value={honeypot}
          onChange={(e) => setHoneypot(e.target.value)}
          tabIndex={-1}
          autoComplete="off"
        />
      </div>

      {/* Section 1: School Selection */}
      <div className="space-y-4" id="field-schoolName">
        <div className="flex items-center gap-2 border-b border-slate-100 pb-2">
          <div className="w-7 h-7 rounded-lg bg-teal-100 text-teal-800 flex items-center justify-center font-bold text-sm">
            1
          </div>
          <h2 className="text-base font-black text-navy-900">
            {isHindi ? "विद्यालय का चयन करें" : "Select or Enter School"}
          </h2>
          <span className="text-xs text-rose-600 font-bold">*</span>
        </div>

        <div className="space-y-3">
          <div>
            <label htmlFor="school-select" className="block text-xs font-bold text-slate-700 mb-1.5">
              {isHindi ? "दानापुर के विद्यालयों की सूची:" : "Danapur Schools Directory:"}
            </label>
            <select
              id="school-select"
              value={selectedSchoolId}
              onChange={(e) => handleSchoolChange(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-600 bg-white text-sm text-slate-800 font-medium"
            >
              <option value="">{isHindi ? "-- सूची में से विद्यालय चुनें --" : "-- Choose a school from list --"}</option>
              {schools.map((s) => (
                <option key={s.id} value={s.id}>
                  {isHindi ? s.name_hi : s.name_en} ({s.type === "government" ? "सरकारी" : "निजी"})
                </option>
              ))}
              <option value="other">
                {isHindi ? "✏️ अन्य विद्यालय (जो सूची में नहीं है)" : "✏️ Other School (Not in list)"}
              </option>
            </select>
          </div>

          {(isOtherSchool || selectedSchoolId === "other") && (
            <div className="pt-2 animate-fade-in">
              <label htmlFor="custom-school-input" className="block text-xs font-bold text-slate-700 mb-1.5">
                {isHindi ? "विद्यालय का पूरा नाम व पता दर्ज करें:" : "Enter Full School Name & Area:"}
                <span className="text-rose-600 ml-1">*</span>
              </label>
              <input
                id="custom-school-input"
                type="text"
                value={customSchoolName}
                onChange={(e) => setCustomSchoolName(e.target.value)}
                placeholder={isHindi ? "उदा. प्राथमिक विद्यालय, दानापुर दियारा" : "e.g. Primary School, Danapur Diyara"}
                className={`w-full px-4 py-3 rounded-xl border ${
                  errors.schoolName ? "border-rose-500 bg-rose-50/50" : "border-slate-300"
                } focus:outline-none focus:ring-2 focus:ring-teal-600 text-sm`}
              />
            </div>
          )}

          {errors.schoolName && (
            <p className="text-xs text-rose-600 font-medium flex items-center gap-1">
              <XCircle className="w-3.5 h-3.5" />
              <span>{errors.schoolName}</span>
            </p>
          )}
        </div>
      </div>

      {/* Section 2: Barrier Details */}
      <div className="space-y-4" id="field-category">
        <div className="flex items-center gap-2 border-b border-slate-100 pb-2">
          <div className="w-7 h-7 rounded-lg bg-teal-100 text-teal-800 flex items-center justify-center font-bold text-sm">
            2
          </div>
          <h2 className="text-base font-black text-navy-900">
            {isHindi ? "बाधा की श्रेणी व विवरण" : "Barrier Category & Description"}
          </h2>
          <span className="text-xs text-rose-600 font-bold">*</span>
        </div>

        {/* Category Pills */}
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-2">
            {isHindi ? "बाधा किस भाग से संबंधित है?" : "Which architectural feature has the barrier?"}
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {BARRIER_CATEGORIES.map((cat) => {
              const isSelected = category === cat.id;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setCategory(cat.id)}
                  className={`p-3 rounded-xl border text-left flex items-start gap-2.5 transition-all ${
                    isSelected
                      ? "bg-teal-50 border-teal-600 ring-2 ring-teal-600/20 text-teal-950 font-bold shadow-xs"
                      : "bg-white border-slate-200 hover:border-slate-300 text-slate-700 hover:bg-slate-50"
                  }`}
                >
                  <span className="text-xl shrink-0">{cat.icon}</span>
                  <div className="truncate">
                    <p className="text-xs leading-snug truncate">
                      {isHindi ? cat.label_hi : cat.label_en}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Description textarea */}
        <div id="field-description" className="space-y-1.5 pt-2">
          <div className="flex justify-between items-baseline">
            <label htmlFor="barrier-description" className="block text-xs font-bold text-slate-700">
              {isHindi ? "बाधा का विस्तृत अवलोकन दर्ज करें:" : "Describe the accessibility problem observed:"}
              <span className="text-rose-600 ml-1">*</span>
            </label>
            <span
              className={`text-[11px] font-mono ${
                description.trim().length >= 15 ? "text-emerald-700 font-bold" : "text-slate-400"
              }`}
            >
              {description.trim().length} / 15 {isHindi ? "न्यूनतम अक्षर" : "min chars"}
            </span>
          </div>

          <textarea
            id="barrier-description"
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder={
              isHindi
                ? "उदा. मुख्य प्रवेश द्वार पर रैंप मानक 1:12 के विपरीत अत्यधिक खड़ा है, दोनों ओर रेलिंग नहीं है और व्हीलचेयर सवार छात्र अकेले नहीं चढ़ सकते..."
                : "e.g. Ramp slope is excessively steep (~1:6), no dual handrails at 760mm/900mm, wheel slip hazard observed during rains..."
            }
            className={`w-full p-4 rounded-2xl border ${
              errors.description ? "border-rose-500 bg-rose-50/50" : "border-slate-300"
            } focus:outline-none focus:ring-2 focus:ring-teal-600 text-sm text-slate-900 leading-relaxed`}
          />

          {errors.description && (
            <p className="text-xs text-rose-600 font-medium flex items-center gap-1">
              <XCircle className="w-3.5 h-3.5" />
              <span>{errors.description}</span>
            </p>
          )}
        </div>
      </div>

      {/* Section 3: Photo Upload with Strict Privacy Guidance */}
      <div className="space-y-4" id="field-photos">
        <div className="flex items-center gap-2 border-b border-slate-100 pb-2">
          <div className="w-7 h-7 rounded-lg bg-teal-100 text-teal-800 flex items-center justify-center font-bold text-sm">
            3
          </div>
          <h2 className="text-base font-black text-navy-900">
            {isHindi ? "तस्वीर अपलोड (अधिकतम 3, 5MB प्रति फ़ाइल)" : "Upload Evidence Photos (Max 3, up to 5MB each)"}
          </h2>
        </div>

        {/* Child Face Caution Alert */}
        <div className="p-4 rounded-2xl bg-amber-50 border border-amber-300 text-amber-950 text-xs space-y-1.5 flex items-start gap-3">
          <Shield className="w-5 h-5 shrink-0 text-amber-700 mt-0.5" />
          <div className="space-y-1">
            <p className="font-bold">
              {isHindi ? "बाल संरक्षण एवं गोपनीयता दिशानिर्देश:" : "Child Protection & Privacy Mandate (PRD Section 10):"}
            </p>
            <p className="text-amber-900 leading-relaxed">
              {isHindi
                ? "कृपया ध्यान दें: केवल भौतिक संरचना (रैंप, दरवाजा, शौचालय, आदि) की तस्वीरें ही अपलोड करें। किसी भी बच्चे का पहचान योग्य चेहरा दिखने वाली तस्वीर बिना अभिभावक की स्पष्ट सहमति के अपलोड न करें।"
                : "Important: Upload photos of physical infrastructure only (ramps, steps, doorways, toilets). Do NOT upload photos showing identifiable faces of children unless explicit written consent is held."}
            </p>
          </div>
        </div>

        {/* Upload Trigger Box */}
        <div className="space-y-3">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            multiple
            onChange={handlePhotoSelect}
            className="hidden"
            id="barrier-file-input"
          />

          {photos.length < 3 && (
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploadingPhotos}
              className="w-full border-2 border-dashed border-slate-300 hover:border-teal-600 rounded-2xl p-6 flex flex-col items-center justify-center gap-2 text-slate-600 hover:text-teal-800 hover:bg-teal-50/50 transition-colors cursor-pointer"
            >
              <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-600">
                <Camera className="w-5 h-5" />
              </div>
              <span className="text-xs font-bold">
                {uploadingPhotos
                  ? isHindi
                    ? "तस्वीरें लोड हो रही हैं..."
                    : "Processing photos..."
                  : isHindi
                  ? "+ तस्वीर चुनें या कैमरा से खींचें"
                  : "+ Select Photo or Capture with Camera"}
              </span>
              <span className="text-[11px] text-slate-400">JPG, PNG, WEBP (Max 5MB)</span>
            </button>
          )}

          {/* Staged Photo Previews */}
          {photos.length > 0 && (
            <div className="grid grid-cols-3 gap-3 pt-2">
              {photos.map((p, idx) => (
                <div
                  key={idx}
                  className="relative rounded-xl overflow-hidden border border-slate-200 bg-slate-100 aspect-video group"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={p.url} alt={p.name} className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => handleRemovePhoto(idx)}
                    aria-label={`Remove ${p.name}`}
                    className="absolute top-1.5 right-1.5 p-1 rounded-full bg-rose-700 text-white shadow-md hover:bg-rose-800 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                  <div className="absolute bottom-0 inset-x-0 bg-black/60 px-2 py-0.5 text-[9px] text-white truncate">
                    {p.name}
                  </div>
                </div>
              ))}
            </div>
          )}

          {errors.photos && (
            <p className="text-xs text-rose-600 font-medium flex items-center gap-1">
              <XCircle className="w-3.5 h-3.5" />
              <span>{errors.photos}</span>
            </p>
          )}
        </div>
      </div>

      {/* Section 4: Optional Reporter Contact (Strictly Private) */}
      <div className="space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-2">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-teal-100 text-teal-800 flex items-center justify-center font-bold text-sm">
              4
            </div>
            <div>
              <h2 className="text-base font-black text-navy-900">
                {isHindi ? "संपर्क विवरण (वैकल्पिक एवं पूर्णतः गोपनीय)" : "Reporter Contact (Optional & Strictly Private)"}
              </h2>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setShowContactDetails(!showContactDetails)}
            className="text-xs font-bold text-teal-800 hover:underline flex items-center gap-1"
          >
            <Lock className="w-3.5 h-3.5" />
            <span>{showContactDetails ? (isHindi ? "छुपाएं" : "Hide") : (isHindi ? "+ संपर्क जोड़ें" : "+ Add Details")}</span>
          </button>
        </div>

        <p className="text-xs text-slate-500 leading-relaxed">
          {isHindi
            ? "🔒 आपकी पहचान कभी सार्वजनिक नहीं होगी। यह जानकारी केवल एडमिन द्वारा ज़रूरत पड़ने पर जांच के लिए उपयोग की जाएगी।"
            : "🔒 Your identity will never be made public. Contact details are stored separately and accessible only to the research administrator for follow-up verification."}
        </p>

        {showContactDetails && (
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-4 animate-fade-in">
            {/* Role */}
            <div>
              <label htmlFor="reporter-role" className="block text-xs font-bold text-slate-700 mb-1">
                {isHindi ? "आपकी भूमिका:" : "Your Role in School Community:"}
              </label>
              <select
                id="reporter-role"
                value={reporterRole}
                onChange={(e) => setReporterRole(e.target.value as any)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs bg-white"
              >
                <option value="parent">{isHindi ? "अभिभावक (Parent)" : "Parent / Guardian"}</option>
                <option value="student">{isHindi ? "छात्र/छात्रा (Student)" : "Student"}</option>
                <option value="teacher">{isHindi ? "शिक्षक/शिक्षिका (Teacher)" : "Teacher / School Staff"}</option>
                <option value="resident">{isHindi ? "स्थानीय नागरिक (Local Resident)" : "Local Community Resident"}</option>
                <option value="advocate">{isHindi ? "अधिकार कार्यकर्ता (Disability Advocate)" : "Disability Rights Advocate"}</option>
                <option value="other">{isHindi ? "अन्य (Other)" : "Other"}</option>
              </select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label htmlFor="reporter-name" className="block text-xs font-bold text-slate-700 mb-1">
                  {isHindi ? "नाम (वैकल्पिक):" : "Name (Optional):"}
                </label>
                <input
                  id="reporter-name"
                  type="text"
                  value={reporterName}
                  onChange={(e) => setReporterName(e.target.value)}
                  placeholder={isHindi ? "आपका नाम" : "Your name"}
                  autoComplete="name"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs"
                />
              </div>

              <div id="field-phone">
                <label htmlFor="reporter-phone" className="block text-xs font-bold text-slate-700 mb-1">
                  {isHindi ? "मोबाइल नंबर (वैकल्पिक):" : "Mobile Phone (Optional):"}
                </label>
                <input
                  id="reporter-phone"
                  type="tel"
                  value={reporterPhone}
                  onChange={(e) => setReporterPhone(e.target.value)}
                  placeholder="9876543210"
                  autoComplete="tel"
                  className={`w-full px-3 py-2 rounded-xl border ${
                    errors.phone ? "border-rose-500 bg-rose-50/50" : "border-slate-300"
                  } text-xs`}
                />
                {errors.phone && <p className="text-[10px] text-rose-600 mt-1">{errors.phone}</p>}
              </div>

              <div id="field-email">
                <label htmlFor="reporter-email" className="block text-xs font-bold text-slate-700 mb-1">
                  {isHindi ? "ईमेल (वैकल्पिक):" : "Email (Optional):"}
                </label>
                <input
                  id="reporter-email"
                  type="email"
                  value={reporterEmail}
                  onChange={(e) => setReporterEmail(e.target.value)}
                  placeholder="name@example.com"
                  autoComplete="email"
                  className={`w-full px-3 py-2 rounded-xl border ${
                    errors.email ? "border-rose-500 bg-rose-50/50" : "border-slate-300"
                  } text-xs`}
                />
                {errors.email && <p className="text-[10px] text-rose-600 mt-1">{errors.email}</p>}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Section 5: Mandatory 3-Clause Research & Privacy Consent */}
      <div className="space-y-4 pt-2">
        <div className="flex items-center gap-2 border-b border-slate-100 pb-2">
          <div className="w-7 h-7 rounded-lg bg-teal-100 text-teal-800 flex items-center justify-center font-bold text-sm">
            5
          </div>
          <h2 className="text-base font-black text-navy-900">
            {isHindi ? "शोध एवं मॉडरेशन सहमति (अनिवार्य)" : "Research & Moderation Consent (Mandatory)"}
          </h2>
          <span className="text-xs text-rose-600 font-bold">*</span>
        </div>

        <div className="space-y-3 bg-slate-50 p-4 rounded-2xl border border-slate-200">
          {/* Clause 1: Research Usage */}
          <label className="flex items-start gap-3 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={consentResearch}
              onChange={(e) => setConsentResearch(e.target.checked)}
              className="mt-1 w-4 h-4 rounded text-teal-600 focus:ring-teal-500 border-slate-300"
            />
            <span className="text-xs text-slate-700 leading-relaxed font-medium">
              {isHindi
                ? "1. मैं पुष्टि करता/करती हूँ कि यह जानकारी एनसीपीईडीपी फेलोशिप के अंतर्गत अकादमिक शोध एवं विद्यालय सुगम्यता सुधार हेतु साझा की जा रही है।"
                : "1. I confirm that this information is submitted for academic research and school accessibility advocacy under the NCPEDP Fellowship."}
            </span>
          </label>
          {errors.consentResearch && (
            <p className="text-xs text-rose-600 font-medium pl-7">{errors.consentResearch}</p>
          )}

          {/* Clause 2: Child Privacy / No faces */}
          <label className="flex items-start gap-3 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={consentNoFaces}
              onChange={(e) => setConsentNoFaces(e.target.checked)}
              className="mt-1 w-4 h-4 rounded text-teal-600 focus:ring-teal-500 border-slate-300"
            />
            <span className="text-xs text-slate-700 leading-relaxed font-medium">
              {isHindi
                ? "2. मैं पुष्टि करता/करती हूँ कि संलग्न तस्वीरों में किसी भी बच्चे का पहचान योग्य चेहरा बिना स्पष्ट सहमति के शामिल नहीं है।"
                : "2. I confirm that uploaded photos do not contain identifiable faces of children without written guardian consent."}
            </span>
          </label>
          {errors.consentNoFaces && (
            <p className="text-xs text-rose-600 font-medium pl-7">{errors.consentNoFaces}</p>
          )}

          {/* Clause 3: Moderation / Pending verification */}
          <label className="flex items-start gap-3 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={consentModeration}
              onChange={(e) => setConsentModeration(e.target.checked)}
              className="mt-1 w-4 h-4 rounded text-teal-600 focus:ring-teal-500 border-slate-300"
            />
            <span className="text-xs text-slate-700 leading-relaxed font-medium">
              {isHindi
                ? "3. मैं समझता/समझती हूँ कि यह रिपोर्ट 'सत्यापन लंबित (Pending)' स्थिति में दर्ज होगी और शोधकर्ता द्वारा सत्यापन के उपरांत ही सार्वजनिक की जाएगी।"
                : "3. I understand that submitted reports are stored in 'Pending' status and will only become public after administrator verification."}
            </span>
          </label>
          {errors.consentModeration && (
            <p className="text-xs text-rose-600 font-medium pl-7">{errors.consentModeration}</p>
          )}
        </div>
      </div>

      {/* Submit Action */}
      <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-xs text-slate-500 text-center sm:text-left">
          {isHindi
            ? "सभी रिपोर्ट सुरक्षित रूप से क्लाउड पर एन्क्रिप्ट की जाती हैं।"
            : "All submissions are secured with rate-limiting & encryption."}
        </p>

        <button
          type="submit"
          disabled={submitting}
          className="w-full sm:w-auto px-8 py-4 rounded-xl bg-teal-700 hover:bg-teal-800 active:scale-[0.98] text-white font-bold text-sm shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
        >
          {submitting ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span>{isHindi ? "जमा किया जा रहा है..." : "Submitting securely..."}</span>
            </>
          ) : (
            <>
              <Send className="w-4 h-4" />
              <span>{isHindi ? "सुरक्षित रूप से रिपोर्ट दर्ज करें" : "Submit Barrier Report"}</span>
            </>
          )}
        </button>
      </div>
    </form>
  );
}
