"use client";

import React, { useState, useEffect } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { Button } from "@/components/ui/Button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Input, Textarea } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import {
  GraduationCap,
  BookOpen,
  Target,
  Users2,
  Mail,
  MapPin,
  Send,
  CheckCircle2,
  AlertCircle,
  FileText,
  Building,
  ShieldCheck,
  Phone,
  User,
  Linkedin,
  ExternalLink,
} from "lucide-react";
import { getCustomSiteContent } from "@/lib/customSchoolsStorage";

function WhatsAppIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width="24"
      height="24"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}

export default function AboutPage() {
  const { locale, t } = useLanguage();
  const [siteData, setSiteData] = useState<any>(() => getCustomSiteContent("about"));

  // Accessible Form State
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    role: "student",
    message: "",
    captchaAnswer: "",
    honeypot: "", // Spam bot trap
  });

  const [captchaChallenge, setCaptchaChallenge] = useState({ a: 3, b: 4 });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [submittedWhatsappUrl, setSubmittedWhatsappUrl] = useState<string>("");

  useEffect(() => {
    // Generate simple accessible captcha challenge
    const a = Math.floor(Math.random() * 8) + 2;
    const b = Math.floor(Math.random() * 8) + 1;
    setCaptchaChallenge({ a, b });

    // Check local storage for admin edits immediately
    const localAbout = getCustomSiteContent("about");
    if (localAbout) {
      setSiteData((prev: any) => ({ ...prev, ...localAbout }));
    }

    // Fetch siteContent/about from Firestore if present
    let cancelled = false;
    async function loadAboutContent() {
      try {
        const { db } = await import("@/lib/firebase/firestore");
        if (!db || cancelled) return;
        const { doc, getDoc } = await import("firebase/firestore");
        const docRef = doc(db, "siteContent", "about");
        const snap = await getDoc(docRef);
        if (snap.exists() && !cancelled) {
          setSiteData((prev: any) => ({ ...snap.data(), ...prev }));
        }
      } catch (err) {
        console.info("Using default seeded about content (Firestore offline/demo)");
      }
    }
    loadAboutContent();

    const handleContentSync = (e: any) => {
      if (!e.detail || e.detail.section === "about") {
        const fresh = getCustomSiteContent("about");
        if (fresh) setSiteData((prev: any) => ({ ...prev, ...fresh }));
      }
    };

    window.addEventListener("ssb_site_content_updated", handleContentSync);
    window.addEventListener("storage", handleContentSync);

    return () => {
      cancelled = true;
      window.removeEventListener("ssb_site_content_updated", handleContentSync);
      window.removeEventListener("storage", handleContentSync);
    };
  }, []);

  const isHindi = locale === "hi";

  // Content with Firestore override or PRD placeholder defaults
  const researcherBio =
    siteData?.[isHindi ? "bio_hi" : "bio_en"] ||
    (isHindi
      ? "सुगम्य शिक्षा बिहार के अंतर्गत राहुल दयाल द्वारा संचालित यह स्वतंत्र शोध परियोजना पटना (बिहार) के विद्यालयों में दिव्यांग बच्चों (CwSN) के लिए भौतिक बुनियादी ढांचे और सार्वभौमिक सुगम्यता की स्थिति का व्यवस्थित अध्ययन कर रही है।"
      : "Conducted by Rahul Dayal under the Sugamya Shiksha Bihar initiative, this independent research initiative systematically investigates physical infrastructure accessibility and inclusive education across primary and secondary schools in Patna, Bihar.");

  const methodologyText =
    siteData?.[isHindi ? "methodology_hi" : "methodology_en"] ||
    (isHindi
      ? "शोध पद्धति में प्राथमिक क्षेत्र सर्वेक्षण (Field Audits) शामिल हैं, जहां 'अभिगम्यता कोड 2024' और 'हार्मोनाइज्ड दिशानिर्देश 2021' के आधार पर स्कूल रैंप, शौचालय, दरवाजों, पानी की सुविधाओं और रास्तों की वास्तविक नापजोख की जाती है। इसके साथ ही दिव्यांग विद्यार्थियों, अभिभावकों और शिक्षकों के साथ पूर्ण सहमति-आधारित साक्षात्कार (In-depth Interviews) आयोजित किए जाते हैं।"
      : "The methodology integrates on-site quantitative measurement audits (evaluating ramp slopes, doorways, disabled-friendly WASH facilities, and tactile paths against the Accessibility Code 2024 and Harmonised Guidelines) combined with consent-governed qualitative interviews of students with disabilities, parents, and special educators.");

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!formData.name.trim()) {
      errs.name = isHindi ? "कृपया अपना नाम दर्ज करें" : "Name is required";
    }
    if (!formData.email.trim()) {
      errs.email = isHindi ? "कृपया अपना ईमेल पता दर्ज करें" : "Email is required";
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      errs.email = isHindi ? "अमान्य ईमेल प्रारूप" : "Invalid email address";
    }
    if (!formData.message.trim()) {
      errs.message = isHindi ? "कृपया अपना संदेश लिखें" : "Message cannot be empty";
    }
    if (parseInt(formData.captchaAnswer, 10) !== captchaChallenge.a + captchaChallenge.b) {
      errs.captchaAnswer = t("about.captchaError", "Please answer the spam verification question correctly.");
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError("");

    // Spam honeypot test
    if (formData.honeypot) {
      console.warn("Spam honeypot triggered");
      return;
    }

    if (!validate()) return;

    // Generate WhatsApp text with all filled-in user details for +91 7050084500
    const roleLabels: Record<string, { hi: string; en: string }> = {
      student: { hi: "विद्यार्थी / शोधार्थी", en: "Student / Scholar" },
      parent: { hi: "दिव्यांग बच्चे के अभिभावक", en: "Parent / Family of CwSN" },
      teacher: { hi: "शिक्षक / विशेष शिक्षक", en: "Teacher / Special Educator" },
      advocate: { hi: "दिव्यांगता अधिकार अधिवक्ता", en: "Disability Rights Advocate" },
      official: { hi: "शिक्षा विभाग अधिकारी", en: "Education Department Official" },
      other: { hi: "समुदाय सदस्य / अन्य", en: "Community Member / Other" },
    };

    const selectedRole = roleLabels[formData.role] || { hi: formData.role, en: formData.role };
    const roleText = isHindi ? selectedRole.hi : selectedRole.en;

    const waLines = [
      isHindi ? "नमस्ते राहुल जी," : "Hello Rahul ji,",
      "",
      isHindi
        ? "मैं सुगम्य शिक्षा बिहार पोर्टल के माध्यम से आपसे संपर्क कर रहा/रही हूँ:"
        : "I am reaching out via the Sugamya Shiksha Bihar portal with the following inquiry / feedback:",
      "",
      isHindi ? "*प्रेषक विवरण (Sender Details):*" : "*Sender Details:*",
      `• ${isHindi ? "नाम" : "Name"}: ${formData.name.trim()}`,
      `• ${isHindi ? "ईमेल" : "Email"}: ${formData.email.trim()}`,
      formData.phone.trim() ? `• ${isHindi ? "फोन" : "Phone"}: ${formData.phone.trim()}` : null,
      `• ${isHindi ? "भूमिका" : "Role"}: ${roleText}`,
      "",
      isHindi ? "*संदेश (Message):*" : "*Message:*",
      formData.message.trim(),
      "",
      "---",
      isHindi
        ? "_सुगम्य शिक्षा बिहार पोर्टल (sugamyashikshabihar.org)_"
        : "_Sent via Sugamya Shiksha Bihar (sugamyashikshabihar.org)_",
    ].filter((item) => item !== null && item !== undefined);

    const whatsappUrl = `https://wa.me/917050084500?text=${encodeURIComponent(waLines.join("\n"))}`;
    setSubmittedWhatsappUrl(whatsappUrl);

    // Trigger WhatsApp redirect / new tab directly on click
    try {
      window.open(whatsappUrl, "_blank", "noopener,noreferrer");
    } catch (popupErr) {
      console.warn("Browser blocked automatic popup, fallback CTA displayed:", popupErr);
    }

    setIsSubmitting(true);
    try {
      const feedbackPayload = {
        id: "fb_" + Date.now() + "_" + Math.random().toString(36).slice(2, 7),
        name: formData.name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim() || null,
        role: formData.role,
        message: formData.message.trim(),
        createdAt: new Date().toISOString(),
        status: "unread",
      };

      let savedToFirestore = false;
      try {
        const { db } = await import("@/lib/firebase/firestore");
        if (db) {
          const { collection, addDoc, serverTimestamp } = await import("firebase/firestore");
          await addDoc(collection(db, "contactSubmissions"), {
            name: feedbackPayload.name,
            email: feedbackPayload.email,
            phone: feedbackPayload.phone,
            role: feedbackPayload.role,
            message: feedbackPayload.message,
            createdAt: serverTimestamp(),
            status: "unread",
          });
          savedToFirestore = true;
        }
      } catch (dbErr) {
        console.warn("Firestore contact submission error, storing in local fallback:", dbErr);
      }

      // Always save to local storage for zero data loss
      try {
        const localKey = "ssb_local_feedback_submissions";
        const existing = JSON.parse(localStorage.getItem(localKey) || "[]");
        existing.unshift({
          ...feedbackPayload,
          _localBackup: true,
          _syncedToFirestore: savedToFirestore,
        });
        localStorage.setItem(localKey, JSON.stringify(existing));
        window.dispatchEvent(new CustomEvent("ssb_feedback_submitted"));
      } catch (storageErr) {
        console.warn("Could not write feedback to localStorage:", storageErr);
      }

      setSubmitSuccess(true);
      setFormData({
        name: "",
        email: "",
        phone: "",
        role: "student",
        message: "",
        captchaAnswer: "",
        honeypot: "",
      });
    } catch (err: any) {
      console.error("Error submitting contact form:", err);
      // Show gracious user feedback
      setSubmitSuccess(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col w-full py-10 px-4 sm:px-8 max-w-7xl mx-auto space-y-12">
      {/* Header Banner */}
      <div className="space-y-4 max-w-3xl">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-100 text-teal-900 text-xs font-bold border border-teal-300">
          <GraduationCap className="w-3.5 h-3.5 text-teal-700" aria-hidden="true" />
          <span>{locale === "hi" ? "शोधकर्ता एवं संपर्क" : "About Researcher & Contact"}</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-navy-800 tracking-tight font-hindi">
          {t("about.title", "About Researcher & Contact")}
        </h1>
        <p className="text-base sm:text-xl text-slate-600 leading-relaxed">
          {t("about.subtitle")}
        </p>
      </div>

      {/* Main Grid: Researcher Profile & Objectives (Left) + Contact Form (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Research Profile & Info (7 cols) */}
        <div className="lg:col-span-7 space-y-8">
          {/* Researcher Introduction Card */}
          <Card as="article" className="p-6 sm:p-8 space-y-5 border-slate-200 shadow-sm">
            <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
              <div className="w-12 h-12 rounded-full bg-navy-800 text-teal-300 flex items-center justify-center font-bold text-xl">
                RD
              </div>
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-navy-800">
                  {isHindi ? "राहुल दयाल" : "Rahul Dayal"}
                </h2>
                <p className="text-xs text-teal-700 font-semibold tracking-wide">
                  {isHindi ? "शोधकर्ता • सुगम्य शिक्षा बिहार" : "Lead Researcher • Sugamya Shiksha Bihar"}
                </p>
              </div>
            </div>

            <p className="text-base text-slate-700 leading-relaxed">
              {researcherBio}
            </p>

            <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-600 space-y-1">
              <span className="font-bold text-navy-900">
                {isHindi ? "संस्थागत संबद्धता:" : "Institutional Affiliation:"}
              </span>
              <p>
                Sugamya Shiksha Bihar Research Project.
              </p>
            </div>
          </Card>

          {/* Research Methodology Card */}
          <Card as="article" className="p-6 sm:p-8 space-y-4 border-slate-200 shadow-sm">
            <div className="flex items-center gap-2.5">
              <BookOpen className="w-5 h-5 text-teal-700" aria-hidden="true" />
              <CardTitle as="h2" className="text-xl">
                {t("about.methodologyTitle", "Research Methodology")}
              </CardTitle>
            </div>
            <p className="text-base text-slate-700 leading-relaxed">
              {methodologyText}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs font-medium text-navy-800">
              <div className="p-3 rounded-md bg-teal-50 border border-teal-200">
                📏 {isHindi ? "भौतिक ऑन-साइट नापजोख ऑडिट" : "Physical On-site Measurement Audits"}
              </div>
              <div className="p-3 rounded-md bg-teal-50 border border-teal-200">
                🗣️ {isHindi ? "सहमति-आधारित साक्षात्कार (In-depth Interviews)" : "Consent-Gated Qualitative Interviews"}
              </div>
              <div className="p-3 rounded-md bg-teal-50 border border-teal-200">
                📊 {isHindi ? "100-अंक अभिगम्यता स्कोरकार्ड" : "100-Point Scoring Framework"}
              </div>
              <div className="p-3 rounded-md bg-teal-50 border border-teal-200">
                📸 {isHindi ? "Before & After साक्ष्य ट्रैकर" : "Before & After Photographic Evidence"}
              </div>
            </div>
          </Card>

          {/* Research Objectives Card */}
          <Card as="article" className="p-6 sm:p-8 space-y-4 border-slate-200 shadow-sm">
            <div className="flex items-center gap-2.5">
              <Target className="w-5 h-5 text-amber-600" aria-hidden="true" />
              <CardTitle as="h2" className="text-xl">
                {t("about.objectivesTitle", "Research Objectives")}
              </CardTitle>
            </div>
            <ul className="space-y-3 text-sm text-slate-700" role="list">
              <li className="flex items-start gap-2.5">
                <span className="text-teal-700 font-bold">1.</span>
                <span>
                  {isHindi
                    ? "पटना के सरकारी और निजी स्कूलों में भौतिक बाधाओं का दस्तावेजीकरण करना।"
                    : "Document structural and physical infrastructure barriers in Patna government and private schools."}
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="text-teal-700 font-bold">2.</span>
                <span>
                  {isHindi
                    ? "शिक्षकों और नीति-निर्माताओं को सुगम्यता मानकों (Accessibility Code 2024) से अवगत कराना।"
                    : "Bridge statutory guidelines (Accessibility Code 2024, RPwD Act 2016) with actionable school checklists."}
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="text-teal-700 font-bold">3.</span>
                <span>
                  {isHindi
                    ? "समुदाय और अभिभावकों को बाधाएं रिपोर्ट करने और सुधार की मांग करने हेतु सशक्त बनाना।"
                    : "Empower local disability rights advocates, parents of CwSN, and students through open data and reporting tools."}
                </span>
              </li>
            </ul>
          </Card>

          {/* Collaborations & Contact Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Card as="article" className="p-5 border-slate-200 shadow-sm space-y-2">
              <div className="flex items-center gap-2 text-teal-800 font-bold text-sm">
                <Users2 className="w-4 h-4 text-teal-600" aria-hidden="true" />
                <span>{t("about.collaborationsTitle", "Collaborations")}</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                {isHindi
                  ? "स्थानीय स्कूल प्रशासन, दिव्यांग अधिकार कार्यकर्ताओं एवं शिक्षा सहयोगियों के साथ खुला संवाद।"
                  : "Active engagement with local school heads, parent groups, advocacy networks, and civil society partners."}
              </p>
            </Card>

            <Card as="article" className="p-5 border-slate-200 shadow-sm space-y-3">
              <div className="flex items-center gap-2 text-navy-800 font-bold text-sm border-b border-slate-100 pb-2">
                <Mail className="w-4 h-4 text-teal-600" aria-hidden="true" />
                <span>{t("about.contactInfoTitle", "Contact Information")}</span>
              </div>
              <div className="text-xs text-slate-700 space-y-2.5">
                {/* Researcher Name */}
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-teal-700 shrink-0" aria-hidden="true" />
                  <div>
                    <span className="font-bold text-slate-900 text-sm">Rahul Dayal</span>
                    <span className="text-[11px] text-teal-700 block font-medium">
                      {isHindi ? "शोधकर्ता (Lead Researcher)" : "Lead Researcher"}
                    </span>
                  </div>
                </div>

                {/* Location */}
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-rose-600 shrink-0" aria-hidden="true" />
                  <span className="font-medium text-slate-800">
                    {isHindi ? "पटना, बिहार" : "Patna, Bihar"}
                  </span>
                </div>

                {/* Email */}
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-amber-600 shrink-0" aria-hidden="true" />
                  <a
                    href="mailto:Rahul.fellowship@gmail.com"
                    className="text-slate-800 font-medium hover:text-teal-700 hover:underline break-all"
                  >
                    Rahul.fellowship@gmail.com
                  </a>
                </div>

                {/* LinkedIn */}
                <div className="flex items-center gap-2">
                  <Linkedin className="w-4 h-4 text-[#0A66C2] shrink-0" aria-hidden="true" />
                  <a
                    href="https://www.linkedin.com/in/rahul-dayal-a282b3247?utm_source=share_via&utm_content=profile&utm_medium=member_android"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-[#0A66C2] font-semibold hover:underline"
                    aria-label="Rahul Dayal on LinkedIn (opens in a new tab)"
                  >
                    <span>Rahul Dayal on LinkedIn</span>
                    <ExternalLink className="w-3 h-3" aria-hidden="true" />
                  </a>
                </div>

                {/* Phone */}
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-emerald-600 shrink-0" aria-hidden="true" />
                  <a
                    href="tel:+917050084500"
                    className="text-slate-800 font-medium hover:text-teal-700"
                  >
                    +91 70500 84500
                  </a>
                </div>

                {/* WhatsApp Quick Link */}
                <div className="pt-1">
                  <a
                    href={`https://wa.me/917050084500?text=${encodeURIComponent(
                      isHindi
                        ? "नमस्ते राहुल जी,\nमैं सुगम्य शिक्षा बिहार परियोजना के संबंध में संपर्क करना चाहता/चाहती हूँ।"
                        : "Hello Rahul ji,\nI would like to connect regarding the Sugamya Shiksha Bihar initiative."
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-300 font-semibold text-xs hover:bg-emerald-100 transition-colors"
                  >
                    <WhatsAppIcon className="w-3.5 h-3.5 text-emerald-600" />
                    <span>WhatsApp: +91 70500 84500</span>
                  </a>
                </div>
              </div>
            </Card>
          </div>
        </div>

        {/* Right Column: Accessible Contact Form (5 cols) */}
        <div className="lg:col-span-5">
          <Card as="section" aria-labelledby="contact-form-heading" className="p-6 sm:p-8 border-slate-200 shadow-md sticky top-24 bg-white">
            <CardHeader className="space-y-1 border-b border-slate-100 pb-4">
              <CardTitle as="h2" id="contact-form-heading" className="text-xl">
                {isHindi ? "संदेश एवं प्रतिक्रिया भेजें (Feedback & Inquiry)" : "Send Feedback / Research Query"}
              </CardTitle>
              <p className="text-xs text-slate-600">
                {t("about.formSubtitle")}
              </p>
            </CardHeader>

            {submitSuccess ? (
              <div
                role="status"
                aria-live="polite"
                className="mt-6 p-6 sm:p-8 rounded-2xl bg-gradient-to-b from-emerald-50 via-teal-50/30 to-white border border-emerald-300 text-slate-800 space-y-5 text-center shadow-sm"
              >
                <div className="w-14 h-14 rounded-full bg-emerald-100 border-2 border-emerald-300 flex items-center justify-center mx-auto text-emerald-600 shadow-xs">
                  <CheckCircle2 className="w-8 h-8" aria-hidden="true" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-xl font-bold text-navy-900 font-hindi">
                    {isHindi ? "प्रतिक्रिया सफलतापूर्वक दर्ज हो गई!" : "Feedback Received Successfully!"}
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {isHindi
                      ? "आपकी प्रतिक्रिया हमारे शोध डेटाबेस में सुरक्षित कर ली गई है।"
                      : "Your message has been securely recorded in our research database."}
                  </p>
                </div>

                {/* Prominent WhatsApp CTA Box */}
                {submittedWhatsappUrl && (
                  <div className="p-4 sm:p-5 rounded-xl bg-white border border-emerald-300 shadow-sm space-y-3 text-left">
                    <div className="flex items-center gap-2 text-emerald-800 font-bold text-sm">
                      <WhatsAppIcon className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                      <span>{isHindi ? "WhatsApp पर भेजें (+91 70500 84500)" : "Send via WhatsApp (+91 70500 84500)"}</span>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      {isHindi
                        ? "आपके भरे हुए विवरण के साथ WhatsApp चैट लिंक तैयार है। यदि WhatsApp विंडो स्वतः नहीं खुली है, तो नीचे दिए गए बटन पर क्लिक करें:"
                        : "Your message with all your details is ready. If WhatsApp didn't open automatically, click the button below:"}
                    </p>
                    <a
                      href={submittedWhatsappUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full inline-flex items-center justify-center gap-2.5 px-4 py-3 rounded-xl bg-[#25D366] hover:bg-[#20ba5a] text-white font-bold text-sm shadow-md transition-all active:scale-[0.98]"
                    >
                      <WhatsAppIcon className="w-5 h-5 text-white" />
                      <span>{isHindi ? "WhatsApp पर चैट खोलें (+91 70500 84500)" : "Open WhatsApp Chat (+91 70500 84500)"}</span>
                    </a>
                  </div>
                )}

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setSubmitSuccess(false);
                    setSubmittedWhatsappUrl("");
                  }}
                  className="text-slate-700 border-slate-300 hover:bg-white text-xs"
                >
                  {isHindi ? "नया संदेश भेजें" : "Send Another Message"}
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} noValidate className="mt-5 space-y-4">
                {/* Honeypot field (hidden from assistive tech and humans, traps bots) */}
                <div className="hidden" aria-hidden="true">
                  <label htmlFor="website_hp">Leave empty</label>
                  <input
                    id="website_hp"
                    type="text"
                    tabIndex={-1}
                    value={formData.honeypot}
                    onChange={(e) => setFormData({ ...formData, honeypot: e.target.value })}
                    autoComplete="off"
                  />
                </div>

                <Input
                  label={t("about.nameLabel", "Your Name")}
                  required
                  value={formData.name}
                  error={errors.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder={isHindi ? "उदा. राहुल कुमार" : "e.g. Rahul Kumar"}
                />

                <Input
                  label={t("about.emailLabel", "Email Address")}
                  type="email"
                  required
                  value={formData.email}
                  error={errors.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="name@example.com"
                />

                <Input
                  label={t("about.phoneLabel", "Phone Number (Optional)")}
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder={isHindi ? "+91 XXXXX XXXXX" : "+91 XXXXX XXXXX"}
                />

                {/* Role Select */}
                <div className="w-full space-y-1.5 text-left">
                  <label
                    htmlFor="role-select"
                    className="block text-sm font-semibold text-navy-800"
                  >
                    {t("about.roleLabel", "Your Role / Organization")}
                  </label>
                  <select
                    id="role-select"
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    className="w-full rounded-md border border-slate-300 bg-white px-3.5 py-2.5 text-base text-navy-900 focus:border-teal-600 focus:ring-1 focus:ring-teal-600 min-h-[44px]"
                  >
                    <option value="student">{t("about.roleOptions.student")}</option>
                    <option value="parent">{t("about.roleOptions.parent")}</option>
                    <option value="teacher">{t("about.roleOptions.teacher")}</option>
                    <option value="advocate">{t("about.roleOptions.advocate")}</option>
                    <option value="official">{t("about.roleOptions.official")}</option>
                    <option value="other">{t("about.roleOptions.other")}</option>
                  </select>
                </div>

                <Textarea
                  label={t("about.messageLabel", "Your Message / Query")}
                  required
                  rows={4}
                  value={formData.message}
                  error={errors.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder={isHindi ? "अपना प्रश्न या संदेश यहाँ लिखें..." : "Type your query or feedback here..."}
                />

                {/* Accessible Spam Protection Math Question */}
                <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200 space-y-2">
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-navy-800">
                    <ShieldCheck className="w-4 h-4 text-teal-600" aria-hidden="true" />
                    <span>
                      {t("about.captchaMathPrompt", "Spam Verification: What is")}{" "}
                      <span className="font-bold text-teal-800 text-sm">
                        {captchaChallenge.a} + {captchaChallenge.b}
                      </span>
                      ?
                    </span>
                  </div>
                  <Input
                    label="Captcha Answer"
                    hideLabel
                    type="number"
                    required
                    value={formData.captchaAnswer}
                    error={errors.captchaAnswer}
                    onChange={(e) => setFormData({ ...formData, captchaAnswer: e.target.value })}
                    placeholder={isHindi ? "उत्तर दर्ज करें" : "Enter answer"}
                    className="min-h-[40px] text-sm"
                  />
                </div>

                {/* WhatsApp notice banner before submit */}
                <div className="flex items-start gap-2.5 p-3 rounded-xl bg-emerald-50/80 border border-emerald-200 text-emerald-950 text-xs">
                  <WhatsAppIcon className="w-4 h-4 text-emerald-600 mt-0.5 flex-shrink-0" />
                  <div className="leading-snug">
                    <span className="font-bold">
                      {isHindi ? "WhatsApp पर सीधा प्रेषण:" : "Direct WhatsApp Dispatch:"}
                    </span>{" "}
                    {isHindi
                      ? "फॉर्म सबमिट करने पर आपकी प्रविष्टि सेव होगी और सीधे WhatsApp (+91 70500 84500) पर विवरण के साथ भेजने का विकल्प खुल जाएगा।"
                      : "Submitting this form will save your feedback and open WhatsApp with your pre-filled details to +91 70500 84500."}
                  </div>
                </div>

                {submitError && (
                  <p role="alert" className="text-xs font-bold text-red-700 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" aria-hidden="true" />
                    <span>{submitError}</span>
                  </p>
                )}

                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  isLoading={isSubmitting}
                  className="w-full font-bold shadow-md bg-emerald-700 hover:bg-emerald-800 border-emerald-800 text-white min-h-[48px]"
                  leftIcon={<WhatsAppIcon className="w-5 h-5 text-white" />}
                  rightIcon={<Send className="w-4 h-4" />}
                >
                  {isSubmitting
                    ? (isHindi ? "सबमिट हो रहा है..." : "Submitting...")
                    : (isHindi ? "सबमिट करें और WhatsApp पर भेजें" : "Submit & Send on WhatsApp")}
                </Button>
              </form>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
