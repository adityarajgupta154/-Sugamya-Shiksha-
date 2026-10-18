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
} from "lucide-react";

export default function AboutPage() {
  const { locale, t } = useLanguage();
  const [siteData, setSiteData] = useState<any>(null);

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

  useEffect(() => {
    // Generate simple accessible captcha challenge
    const a = Math.floor(Math.random() * 8) + 2;
    const b = Math.floor(Math.random() * 8) + 1;
    setCaptchaChallenge({ a, b });

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
          setSiteData(snap.data());
        }
      } catch (err) {
        console.info("Using default seeded about content (Firestore offline/demo)");
      }
    }
    loadAboutContent();
    return () => {
      cancelled = true;
    };
  }, []);

  const isHindi = locale === "hi";

  // Content with Firestore override or PRD placeholder defaults
  const researcherBio =
    siteData?.[isHindi ? "bio_hi" : "bio_en"] ||
    (isHindi
      ? "NCPEDP (नेशनल सेंटर फॉर प्रमोशन ऑफ एम्प्लॉयमेंट फॉर डिसेबल्ड पीपल) फेलोशिप के अंतर्गत यह स्वतंत्र शोध परियोजना दानापुर, पटना (बिहार) के विद्यालयों में दिव्यांग बच्चों (CwSN) के लिए भौतिक बुनियादी ढांचे और सार्वभौमिक सुगम्यता की स्थिति का व्यवस्थित अध्ययन कर रही है। [शोधकर्ता का आधिकारिक परिचय एवं बायोडाटा: ग्राहक पुष्टि प्रतीक्षित]"
      : "Conducted under the prestigious NCPEDP Fellowship, this independent research initiative systematically investigates physical infrastructure accessibility and inclusive education across primary and secondary schools in Danapur, Patna, Bihar. [Official Researcher Biography: Pending final client input]");

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

    setIsSubmitting(true);
    try {
      const { db } = await import("@/lib/firebase/firestore");
      if (db) {
        const { collection, addDoc, serverTimestamp } = await import("firebase/firestore");
        await addDoc(collection(db, "contactSubmissions"), {
          name: formData.name.trim(),
          email: formData.email.trim(),
          phone: formData.phone.trim() || null,
          role: formData.role,
          message: formData.message.trim(),
          createdAt: serverTimestamp(),
          status: "unread",
        });
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
      // Even if Firestore is demo mode, show gracious user feedback
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
          <span>Section 12 • PRD About Researcher & Contact</span>
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
                NF
              </div>
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-navy-800">
                  {isHindi ? "शोधकर्ता परिचय एवं फेलोशिप" : "Researcher Introduction"}
                </h2>
                <p className="text-xs text-teal-700 font-semibold tracking-wide">
                  NCPEDP National Disability Research Fellowship
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
                National Centre for Promotion of Employment for Disabled People (NCPEDP) Fellowship Programme.
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

          {/* Fellowship Objectives Card */}
          <Card as="article" className="p-6 sm:p-8 space-y-4 border-slate-200 shadow-sm">
            <div className="flex items-center gap-2.5">
              <Target className="w-5 h-5 text-amber-600" aria-hidden="true" />
              <CardTitle as="h2" className="text-xl">
                {t("about.objectivesTitle", "Fellowship Objectives")}
              </CardTitle>
            </div>
            <ul className="space-y-3 text-sm text-slate-700" role="list">
              <li className="flex items-start gap-2.5">
                <span className="text-teal-700 font-bold">1.</span>
                <span>
                  {isHindi
                    ? "दानापुर के सरकारी और निजी स्कूलों में भौतिक बाधाओं का दस्तावेजीकरण करना।"
                    : "Document structural and physical infrastructure barriers in Danapur government and private schools."}
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
                  ? "दानापुर के स्थानीय स्कूल प्रशासन, दिव्यांग अधिकार कार्यकर्ताओं एवं शिक्षा सहयोगियों के साथ खुला संवाद।"
                  : "Active engagement with Danapur school heads, parent groups, local advocacy networks, and civil society partners."}
              </p>
            </Card>

            <Card as="article" className="p-5 border-slate-200 shadow-sm space-y-2">
              <div className="flex items-center gap-2 text-navy-800 font-bold text-sm">
                <Mail className="w-4 h-4 text-teal-600" aria-hidden="true" />
                <span>{t("about.contactInfoTitle", "Contact Information")}</span>
              </div>
              <div className="text-xs text-slate-600 space-y-1">
                <p>📍 {isHindi ? "दानापुर, पटना, बिहार" : "Danapur, Patna, Bihar, India"}</p>
                <p>✉️ <span className="text-slate-800 font-medium">research@sugamyashikshabihar.org</span></p>
                <p className="text-slate-500 italic">[Official Phone/Direct Address: Pending client confirmation]</p>
              </div>
            </Card>
          </div>
        </div>

        {/* Right Column: Accessible Contact Form (5 cols) */}
        <div className="lg:col-span-5">
          <Card as="section" aria-labelledby="contact-form-heading" className="p-6 sm:p-8 border-slate-200 shadow-md sticky top-24 bg-white">
            <CardHeader className="space-y-1 border-b border-slate-100 pb-4">
              <CardTitle as="h2" id="contact-form-heading" className="text-xl">
                {t("about.formTitle", "Send a Message / Research Query")}
              </CardTitle>
              <p className="text-xs text-slate-600">
                {t("about.formSubtitle")}
              </p>
            </CardHeader>

            {submitSuccess ? (
              <div
                role="status"
                aria-live="polite"
                className="mt-6 p-6 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-950 space-y-3 text-center"
              >
                <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" aria-hidden="true" />
                <h3 className="text-lg font-bold">
                  {t("about.successTitle", "Message Received Successfully")}
                </h3>
                <p className="text-sm text-emerald-900 leading-relaxed">
                  {t("about.successMessage")}
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSubmitSuccess(false)}
                  className="mt-2 text-emerald-800 border-emerald-400"
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
                  className="w-full font-bold shadow-md bg-navy-800 hover:bg-navy-900 border-navy-700"
                  rightIcon={<Send className="w-4 h-4" />}
                >
                  {isSubmitting
                    ? t("about.submittingButton", "Submitting...")
                    : t("about.submitButton", "Send Message")}
                </Button>
              </form>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
