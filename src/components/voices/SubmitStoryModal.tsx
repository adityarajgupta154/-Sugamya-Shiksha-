"use client";

import React, { useState } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { CommunityRole } from "@/data/communityVoicesData";
import { db } from "@/lib/firebase/firestore";
import { collection, doc, setDoc, serverTimestamp } from "firebase/firestore";
import {
  X,
  Send,
  Lock,
  Shield,
  CheckCircle2,
  AlertTriangle,
  User,
  Heart,
} from "lucide-react";

interface SubmitStoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function SubmitStoryModal({ isOpen, onClose, onSuccess }: SubmitStoryModalProps) {
  const { locale } = useLanguage();
  const isHindi = locale === "hi";

  const [role, setRole] = useState<CommunityRole>("student");
  const [authorName, setAuthorName] = useState<string>("");
  const [isAnonymous, setIsAnonymous] = useState<boolean>(true);
  const [schoolName, setSchoolName] = useState<string>("");
  const [title, setTitle] = useState<string>("");
  const [story, setStory] = useState<string>("");
  const [keyTheme, setKeyTheme] = useState<string>("");

  // Consent flags
  const [consentResearch, setConsentResearch] = useState<boolean>(false);
  const [consentPrivacy, setConsentPrivacy] = useState<boolean>(false);
  const [isMinor, setIsMinor] = useState<boolean>(false);
  const [guardianName, setGuardianName] = useState<string>("");

  const [submitting, setSubmitting] = useState<boolean>(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [success, setSuccess] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    if (!title.trim() || title.trim().length < 5) {
      newErrors.title = isHindi
        ? "कृपया कहानी का एक उपयुक्त शीर्षक दें (कम से कम 5 अक्षर)।"
        : "Please provide a valid title (minimum 5 characters).";
    }

    if (!story.trim() || story.trim().length < 25) {
      newErrors.story = isHindi
        ? "कृपया अपना अनुभव विस्तार से लिखें (कम से कम 25 अक्षर)।"
        : "Please share your experience in detail (minimum 25 characters).";
    }

    if (!consentResearch) {
      newErrors.consentResearch = isHindi
        ? "शोध उपयोग सहमति अनिवार्य है।"
        : "Research usage consent is required.";
    }

    if (!consentPrivacy) {
      newErrors.consentPrivacy = isHindi
        ? "गोपनीयता एवं बाल संरक्षण सहमति अनिवार्य है।"
        : "Privacy & child protection consent is required.";
    }

    if (isMinor && !guardianName.trim()) {
      newErrors.guardianName = isHindi
        ? "नाबालिग छात्र हेतु अभिभावक का नाम अनिवार्य है।"
        : "Guardian name is required for minor students.";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    setSubmitting(true);

    try {
      const voiceId = `voice-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;

      let displayName_hi = authorName.trim();
      let displayName_en = authorName.trim();

      if (isAnonymous || !displayName_hi) {
        if (role === "student") {
          displayName_hi = "एक दिव्यांग छात्र (पहचान सुरक्षित)";
          displayName_en = "Student with Disability (Anonymous)";
        } else if (role === "parent") {
          displayName_hi = "एक अभिभावक (पटना)";
          displayName_en = "Parent of CwSN (Patna)";
        } else if (role === "teacher") {
          displayName_hi = "एक शिक्षक (पहचान सुरक्षित)";
          displayName_en = "Educator (Anonymous)";
        } else {
          displayName_hi = "नागरिक/अधिवक्ता (पहचान सुरक्षित)";
          displayName_en = "Advocate (Anonymous)";
        }
      }

      const voiceDoc = {
        id: voiceId,
        role,
        title_hi: title.trim(),
        title_en: title.trim(),
        story_hi: story.trim(),
        story_en: story.trim(),
        keyTheme_hi: keyTheme.trim() || (isHindi ? "व्यक्तिगत अनुभव" : "Lived Experience"),
        keyTheme_en: keyTheme.trim() || "Lived Experience",
        schoolName_hi: schoolName.trim() || undefined,
        schoolName_en: schoolName.trim() || undefined,
        isAnonymous,
        authorDisplayName_hi: displayName_hi,
        authorDisplayName_en: displayName_en,
        consentRecorded: true,
        consentDetails: {
          consentDate: new Date().toISOString().split("T")[0],
          consentType: isMinor ? "guardian_written" : "written",
          isMinor,
          guardianName: isMinor ? guardianName.trim() : undefined,
          hasPhotoConsent: false, // Strict child privacy
        },
        isIllustration: true,
        published: false, // Requires admin approval before becoming public
        createdAt: new Date().toISOString(),
      };

      if (db) {
        await setDoc(doc(db, "communityVoices", voiceId), {
          ...voiceDoc,
          serverTimestamp: serverTimestamp(),
        });
      }

      setSuccess(true);
      setTimeout(() => {
        onSuccess();
        onClose();
      }, 2500);
    } catch (err) {
      console.error("Failed to submit community voice:", err);
      setErrors({
        submit: isHindi
          ? "कहानी सबमिट करने में समस्या आई। कृपया पुनः प्रयास करें।"
          : "Could not submit story. Please try again.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-voice-title"
      className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in"
    >
      <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-2xl w-full shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto border border-slate-200">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <Heart className="w-5 h-5 text-rose-600" />
            <h2 id="modal-voice-title" className="text-lg font-black text-navy-900 font-hindi">
              {isHindi ? "अपना अनुभव साझा करें" : "Share Your Lived Experience"}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-full text-slate-400 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {success ? (
          <div className="py-8 text-center space-y-3 animate-fade-in">
            <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center mx-auto text-2xl font-bold">
              ✓
            </div>
            <h3 className="text-xl font-bold text-navy-900">
              {isHindi ? "धन्यवाद! आपकी कहानी दर्ज हो गई है।" : "Thank You! Your Story Has Been Recorded."}
            </h3>
            <p className="text-xs text-slate-600 max-w-md mx-auto leading-relaxed">
              {isHindi
                ? "आपकी सहमति दर्ज कर ली गई है। शोध नैतिकता और गोपनीयता के अनुरूप, एडमिन द्वारा समीक्षा के उपरांत ही इसे प्रकाशित किया जाएगा।"
                : "Your consent has been recorded. Per research ethics, the story will appear publicly once approved by the administrator."}
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {errors.submit && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-300 text-rose-900 text-xs">
                {errors.submit}
              </div>
            )}

            {/* Role selector */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                {isHindi ? "आपकी भूमिका:" : "Your Role:"}
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-bold">
                {[
                  { id: "student", label_hi: "छात्र/छात्रा", label_en: "Student" },
                  { id: "parent", label_hi: "अभिभावक", label_en: "Parent" },
                  { id: "teacher", label_hi: "शिक्षक", label_en: "Teacher" },
                  { id: "advocate", label_hi: "अधिवक्ता/नागरिक", label_en: "Advocate" },
                ].map((r) => (
                  <button
                    key={r.id}
                    type="button"
                    onClick={() => setRole(r.id as CommunityRole)}
                    className={`py-2 px-3 rounded-xl border text-center transition-all ${
                      role === r.id
                        ? "bg-teal-700 text-white border-teal-700 shadow-xs"
                        : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                    }`}
                  >
                    {isHindi ? r.label_hi : r.label_en}
                  </button>
                ))}
              </div>
            </div>

            {/* Anonymity Toggle */}
            <div className="p-3.5 rounded-2xl bg-teal-50/60 border border-teal-200 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <Lock className="w-4 h-4 text-teal-700" />
                <div>
                  <span className="text-xs font-bold text-teal-950 block">
                    {isHindi ? "पहचान गोपनीय रखें (Anonymous)" : "Keep Identity Anonymous"}
                  </span>
                  <span className="text-[11px] text-teal-800">
                    {isHindi
                      ? "सार्वजनिक पटल पर आपका वास्तविक नाम नहीं दिखेगा"
                      : "Your real name will not be publicly displayed"}
                  </span>
                </div>
              </div>
              <input
                type="checkbox"
                checked={isAnonymous}
                onChange={(e) => setIsAnonymous(e.target.checked)}
                className="w-5 h-5 rounded text-teal-600 focus:ring-teal-500 border-slate-300"
              />
            </div>

            {!isAnonymous && (
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {isHindi ? "आपका पूरा नाम:" : "Your Full Name:"}
                </label>
                <input
                  type="text"
                  value={authorName}
                  onChange={(e) => setAuthorName(e.target.value)}
                  placeholder={isHindi ? "उदा. राजेश कुमार" : "e.g. Rajesh Kumar"}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs"
                />
              </div>
            )}

            {/* School Name */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {isHindi ? "संबंधित विद्यालय (वैकल्पिक):" : "Relevant School (Optional):"}
              </label>
              <input
                type="text"
                value={schoolName}
                onChange={(e) => setSchoolName(e.target.value)}
                placeholder={isHindi ? "उदा. राजकीय मध्य विद्यालय, पटना" : "e.g. Govt Middle School, Patna"}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs"
              />
            </div>

            {/* Title */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {isHindi ? "शीर्षक / मुख्य बात:" : "Story Title:"} <span className="text-rose-600">*</span>
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder={isHindi ? "उदा. तीव्र रैंप और मेरी रोज़ाना की परेशानी" : "e.g. Daily challenge with steep ramps"}
                className={`w-full px-3 py-2 rounded-xl border ${
                  errors.title ? "border-rose-500" : "border-slate-300"
                } text-xs`}
              />
              {errors.title && <p className="text-[10px] text-rose-600 mt-1">{errors.title}</p>}
            </div>

            {/* Story Description */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {isHindi ? "आपका अनुभव / कहानी:" : "Your Lived Experience:"} <span className="text-rose-600">*</span>
              </label>
              <textarea
                rows={4}
                value={story}
                onChange={(e) => setStory(e.target.value)}
                placeholder={
                  isHindi
                    ? "कृपया विस्तार से बताएं कि स्कूल में भौतिक सुगम्यता (रैंप, शौचालय, कक्षा, आदि) के कारण आपने क्या अनुभव किया..."
                    : "Please describe what barriers you faced in school physical infrastructure and how it affected daily education..."
                }
                className={`w-full p-3 rounded-xl border ${
                  errors.story ? "border-rose-500" : "border-slate-300"
                } text-xs leading-relaxed`}
              />
              {errors.story && <p className="text-[10px] text-rose-600 mt-1">{errors.story}</p>}
            </div>

            {/* Minor Check */}
            <div className="space-y-2 pt-1 border-t border-slate-100">
              <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-slate-700">
                <input
                  type="checkbox"
                  checked={isMinor}
                  onChange={(e) => setIsMinor(e.target.checked)}
                  className="rounded text-teal-600 focus:ring-teal-500"
                />
                <span>{isHindi ? "यह कहानी 18 वर्ष से कम आयु के छात्र/छात्रा की है" : "This story is for a student under 18"}</span>
              </label>

              {isMinor && (
                <div className="pl-6 animate-fade-in">
                  <input
                    type="text"
                    value={guardianName}
                    onChange={(e) => setGuardianName(e.target.value)}
                    placeholder={isHindi ? "माता/पिता/अभिभावक का नाम *" : "Parent / Guardian Name *"}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs"
                  />
                  {errors.guardianName && (
                    <p className="text-[10px] text-rose-600 mt-1">{errors.guardianName}</p>
                  )}
                </div>
              )}
            </div>

            {/* Mandatory Consents */}
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
              <label className="flex items-start gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={consentResearch}
                  onChange={(e) => setConsentResearch(e.target.checked)}
                  className="mt-0.5 rounded text-teal-600 focus:ring-teal-500"
                />
                <span className="text-slate-700 font-medium">
                  {isHindi
                    ? "1. मैं सुगम्य शिक्षा बिहार शोध एवं सुगम्यता सुधार हेतु यह अनुभव साझा करने की स्पष्ट सहमति देता/देती हूँ।"
                    : "1. I give explicit consent for this story to be used in Sugamya Shiksha Bihar research and advocacy."}
                </span>
              </label>
              {errors.consentResearch && (
                <p className="text-[10px] text-rose-600 pl-6">{errors.consentResearch}</p>
              )}

              <label className="flex items-start gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={consentPrivacy}
                  onChange={(e) => setConsentPrivacy(e.target.checked)}
                  className="mt-0.5 rounded text-teal-600 focus:ring-teal-500"
                />
                <span className="text-slate-700 font-medium">
                  {isHindi
                    ? "2. मैं समझता/समझती हूँ कि बाल संरक्षण नीति के तहत बच्चों की चेहरे वाली तस्वीरें बिना सहमति प्रकाशित नहीं की जाती हैं, और यह कहानी एडमिन सत्यापन के बाद ही दिखेगी।"
                    : "2. I understand that child protection prohibits facial photos without guardian consent, and stories require admin review before publication."}
                </span>
              </label>
              {errors.consentPrivacy && (
                <p className="text-[10px] text-rose-600 pl-6">{errors.consentPrivacy}</p>
              )}
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold"
              >
                {isHindi ? "रद्द करें" : "Cancel"}
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="px-6 py-2.5 rounded-xl bg-teal-700 hover:bg-teal-800 text-white text-xs font-bold flex items-center gap-2 shadow-md transition-all cursor-pointer disabled:opacity-50"
              >
                {submitting ? (
                  <span>{isHindi ? "सबमिट हो रहा है..." : "Submitting..."}</span>
                ) : (
                  <>
                    <Send className="w-3.5 h-3.5" />
                    <span>{isHindi ? "सहमति के साथ सबमिट करें" : "Submit with Consent"}</span>
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
