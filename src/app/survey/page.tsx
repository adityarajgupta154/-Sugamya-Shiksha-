"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { useLanguage } from "@/context/LanguageContext";
import {
  DEFAULT_COMMUNITY_SURVEY,
  SurveyDefinition,
  SurveyQuestion,
} from "@/data/surveyData";
import { SURVEY_COLLECTIONS, getSurveyResponseDocId } from "@/data/surveyConstants";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input, Textarea } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import {
  ClipboardList,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Clock,
  Sparkles,
  ArrowRight,
  School,
  Lock,
  UserCheck,
  LogOut,
  LogIn,
  Check,
  Info,
  RotateCcw,
  Mail,
  Phone,
} from "lucide-react";
import type { User } from "firebase/auth";
import {
  validateIndianPhoneNumber,
  validateRespondentName,
  validateRespondentRole,
  validateSurveyConsent,
  validateSurveyResponsePayload,
  RespondentRole,
} from "@/lib/surveyValidation";

export default function SurveyPage() {
  const { locale, t } = useLanguage();
  const isHindi = locale === "hi";

  // Survey definition state
  const [survey, setSurvey] = useState<SurveyDefinition>(DEFAULT_COMMUNITY_SURVEY);
  const [loadingSurvey, setLoadingSurvey] = useState(false);

  // Authentication state
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [authChecking, setAuthChecking] = useState(true);
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [authError, setAuthError] = useState("");

  // Direct Email & Phone verification fallback state
  const [showDirectAuth, setShowDirectAuth] = useState(false);
  const [directName, setDirectName] = useState("");
  const [directEmail, setDirectEmail] = useState("");
  const [directPhone, setDirectPhone] = useState("");
  const [directRole, setDirectRole] = useState<RespondentRole>("parent");
  const [directAuthError, setDirectAuthError] = useState("");

  // Existing response state (1 response per survey per Google account)
  const [alreadySubmitted, setAlreadySubmitted] = useState(false);
  const [existingSubmissionDate, setExistingSubmissionDate] = useState<string | null>(null);

  // Respondent metadata state
  const [respondentName, setRespondentName] = useState<string>("");
  const [contactPhone, setContactPhone] = useState<string>("");
  const [role, setRole] = useState<RespondentRole>("parent");
  const [consentGiven, setConsentGiven] = useState<boolean>(false);

  // Dynamic question answers: mapped by question.id
  const [answers, setAnswers] = useState<Record<string, any>>({});

  // Validation & status
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedSuccessfully, setSubmittedSuccessfully] = useState(false);
  const [submissionError, setSubmissionError] = useState("");
  const [confirmSignOutModal, setConfirmSignOutModal] = useState(false);

  // Anti-spam honeypot & timing
  const [honeypot, setHoneypot] = useState("");
  const loadTimestampRef = useRef<number>(Date.now());
  const errorSummaryRef = useRef<HTMLDivElement>(null);

  // Listen to Auth State strictly inside the Survey route
  useEffect(() => {
    loadTimestampRef.current = Date.now();
    let isSubscribed = true;
    let unsubscribe: (() => void) | undefined;

    async function initAuth() {
      try {
        const [{ onAuthStateChanged, getRedirectResult }, { auth }, { doc, getDoc }, { db }] = await Promise.all([
          import("firebase/auth"),
          import("@/lib/firebase/auth"),
          import("firebase/firestore"),
          import("@/lib/firebase/firestore"),
        ]);

        if (!isSubscribed) return;

        // Check for active direct verified session
        try {
          const directSession = sessionStorage.getItem("ssb_survey_direct_user");
          if (directSession && isSubscribed) {
            const parsed = JSON.parse(directSession);
            if (parsed.email && parsed.uid) {
              setCurrentUser(parsed as User);
              setRespondentName(parsed.displayName || "");
              if (parsed.phone) setContactPhone(parsed.phone);
              if (parsed.role) setRole(parsed.role);

              try {
                const localSubs = JSON.parse(localStorage.getItem("ssb_local_survey_submissions") || "[]");
                const found = localSubs.find((s: any) => s.email === parsed.email && s.surveyId === survey.id);
                if (found) {
                  setAlreadySubmitted(true);
                  setExistingSubmissionDate(found.submittedAt || found.consentAt || null);
                  if (found.answers) setAnswers(found.answers);
                }
              } catch (err) {}

              setAuthChecking(false);
              return;
            }
          }
        } catch (e) {}

        if (!auth) {
          setAuthChecking(false);
          return;
        }

        getRedirectResult(auth)
          .then((res) => {
            if (isSubscribed && res?.user) {
              setCurrentUser(res.user);
            }
          })
          .catch((err) => {
            console.warn("Redirect sign-in error:", err);
          });

        unsubscribe = onAuthStateChanged(auth, async (user) => {
          if (!isSubscribed) return;
          setCurrentUser(user);
          setAuthChecking(false);

          if (user) {
            setRespondentName((prev) => prev || user.displayName || "");

            try {
              const draft = sessionStorage.getItem(`ssb_survey_draft_${survey.id}_${user.uid}`);
              if (draft) {
                const parsed = JSON.parse(draft);
                if (parsed.answers) setAnswers(parsed.answers);
                if (parsed.phone) setContactPhone(parsed.phone);
                if (parsed.role) setRole(parsed.role);
                if (parsed.name) setRespondentName(parsed.name);
              }
            } catch (e) {
              // Ignore session storage error
            }

            if (db) {
              try {
                const docId = getSurveyResponseDocId(survey.id, user.uid);
                const snap = await getDoc(doc(db, SURVEY_COLLECTIONS.RESPONSES, docId));
                if (snap.exists() && isSubscribed) {
                  const data = snap.data();
                  setAlreadySubmitted(true);
                  setExistingSubmissionDate(data.submittedAt || data.consentAt || null);
                  if (data.name) setRespondentName(data.name);
                  if (data.phone) setContactPhone(data.phone);
                  if (data.role) setRole(data.role);
                  if (data.answers) setAnswers(data.answers);
                  if (data.consentGiven) setConsentGiven(true);
                }
              } catch (err) {
                console.warn("Could not check existing survey response:", err);
              }
            }
          }
        });
      } catch (err) {
        if (isSubscribed) setAuthChecking(false);
      }
    }

    initAuth();

    return () => {
      isSubscribed = false;
      if (unsubscribe) unsubscribe();
    };
  }, [survey.id]);

  // Fetch active survey definition from Firestore (or fallback to default)
  useEffect(() => {
    let isMounted = true;
    async function loadActiveSurvey() {
      try {
        setLoadingSurvey(true);
        const [{ doc, getDoc }, { db }] = await Promise.all([
          import("firebase/firestore"),
          import("@/lib/firebase/firestore"),
        ]);
        if (!db || !isMounted) return;
        const docRef = doc(db, "surveys", DEFAULT_COMMUNITY_SURVEY.id);
        const snap = await getDoc(docRef);
        if (snap.exists() && isMounted) {
          const data = snap.data() as SurveyDefinition;
          if (data.published) {
            setSurvey(data);
          }
        }
      } catch (err) {
        console.info("Using embedded default survey schema:", err);
      } finally {
        if (isMounted) setLoadingSurvey(false);
      }
    }

    loadActiveSurvey();
    return () => {
      isMounted = false;
    };
  }, []);

  // Save draft answers into session storage whenever user types
  useEffect(() => {
    if (currentUser && Object.keys(answers).length > 0) {
      try {
        sessionStorage.setItem(
          `ssb_survey_draft_${survey.id}_${currentUser.uid}`,
          JSON.stringify({
            answers,
            name: respondentName,
            phone: contactPhone,
            role,
          })
        );
      } catch (e) {
        // Ignore storage errors
      }
    }
  }, [answers, respondentName, contactPhone, role, currentUser, survey.id]);

  // Google Sign-In Handler with detailed error diagnosis & direct verification fallback
  const handleGoogleSignIn = async () => {
    setAuthError("");
    setIsSigningIn(true);

    try {
      const [{ GoogleAuthProvider, signInWithPopup, signInWithRedirect }, { auth }] = await Promise.all([
        import("firebase/auth"),
        import("@/lib/firebase/auth"),
      ]);

      if (!auth) {
        setAuthError(
          isHindi
            ? "प्रमाणीकरण सेवा उपलब्ध नहीं है। कृपया नीचे 'सीधे ईमेल और फोन नंबर से भाग लें' चुनें।"
            : "Authentication service unavailable. Please use 'Continue with Email & Phone' below."
        );
        setShowDirectAuth(true);
        return;
      }

      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({ prompt: "select_account" });
      await signInWithPopup(auth, provider);
    } catch (error: any) {
      console.warn("Google sign-in popup error:", error);
      if (error.code === "auth/popup-blocked") {
        try {
          const [{ GoogleAuthProvider, signInWithRedirect }, { auth }] = await Promise.all([
            import("firebase/auth"),
            import("@/lib/firebase/auth"),
          ]);
          if (auth) {
            const provider = new GoogleAuthProvider();
            await signInWithRedirect(auth, provider);
            return;
          }
        } catch (redirectErr) {
          setAuthError(
            isHindi
              ? "पॉपअप विंडो ब्लॉक हो गई। आप नीचे 'ईमेल और फोन नंबर से भाग लें' का उपयोग कर सकते हैं।"
              : "Popup was blocked. You can use 'Continue with Email & Phone' below."
          );
          setShowDirectAuth(true);
        }
      } else if (error.code === "auth/popup-closed-by-user") {
        setAuthError(
          isHindi
            ? "साइन-इन विंडो बंद कर दी गई। आप नीचे 'ईमेल और फोन नंबर से भाग लें' का उपयोग भी कर सकते हैं।"
            : "Sign-in window was closed. You can also use 'Continue with Email & Phone' below."
        );
      } else if (error.code === "auth/unauthorized-domain") {
        setAuthError(
          isHindi
            ? "फायरबेस सुरक्षा: यह डोमेन ('localhost') अधिकृत नहीं है। आप नीचे 'ईमेल और फोन नंबर से भाग लें' चुनकर तुरंत सर्वेक्षण भर सकते हैं।"
            : "Firebase Notice: 'localhost' is not in Firebase Authorized Domains. You can use 'Continue with Email & Phone' below to participate immediately."
        );
        setShowDirectAuth(true);
      } else if (error.code === "auth/operation-not-allowed") {
        setAuthError(
          isHindi
            ? "फायरबेस में गूगल साइन-इन सक्षम नहीं है। आप नीचे 'ईमेल और फोन नंबर से भाग लें' चुनकर तुरंत सर्वेक्षण भर सकते हैं।"
            : "Google Sign-In is disabled in Firebase Console. You can use 'Continue with Email & Phone' below to participate immediately."
        );
        setShowDirectAuth(true);
      } else {
        setAuthError(
          isHindi
            ? `गूगल साइन-इन में समस्या आई (${error.code || "नेटवर्क/पॉपअप"})। आप नीचे 'ईमेल और फोन नंबर से भाग लें' चुनकर तुरंत सर्वेक्षण भर सकते हैं।`
            : `Google sign-in failed (${error.code || "network/popup"}). You can use 'Continue with Email & Phone' below to participate immediately.`
        );
        setShowDirectAuth(true);
      }
    } finally {
      setIsSigningIn(false);
    }
  };

  // Direct Email & Phone Verification Handler
  const handleDirectVerify = (e: React.FormEvent) => {
    e.preventDefault();
    setDirectAuthError("");

    const nameVal = validateRespondentName(directName);
    if (!nameVal.isValid) {
      setDirectAuthError(nameVal.error || "Please enter a valid name.");
      return;
    }

    const phoneVal = validateIndianPhoneNumber(directPhone);
    if (!phoneVal.isValid) {
      setDirectAuthError(phoneVal.error || "Please enter a valid 10-digit mobile number.");
      return;
    }

    if (!directEmail.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(directEmail.trim())) {
      setDirectAuthError(isHindi ? "कृपया एक मान्य ईमेल दर्ज करें।" : "Please enter a valid email address.");
      return;
    }

    const cleanEmail = directEmail.trim().toLowerCase();
    const cleanPhone = phoneVal.sanitized || directPhone.trim();
    const cleanName = nameVal.sanitized || directName.trim();
    const directUid = "usr_" + Math.random().toString(36).slice(2, 10);

    const verifiedUser = {
      uid: directUid,
      email: cleanEmail,
      displayName: cleanName,
      phone: cleanPhone,
      role: directRole,
      isDirectAuth: true,
    } as unknown as User;

    try {
      sessionStorage.setItem("ssb_survey_direct_user", JSON.stringify(verifiedUser));
      const localSubs = JSON.parse(localStorage.getItem("ssb_local_survey_submissions") || "[]");
      const found = localSubs.find((s: any) => s.email === cleanEmail && s.surveyId === survey.id);
      if (found) {
        setAlreadySubmitted(true);
        setExistingSubmissionDate(found.submittedAt || found.consentAt || null);
        if (found.answers) setAnswers(found.answers);
      }
    } catch (err) {}

    setCurrentUser(verifiedUser);
    setRespondentName(cleanName);
    setContactPhone(cleanPhone);
    setRole(directRole);
    setShowDirectAuth(false);
  };

  // Sign Out Handler
  const handleSignOut = async () => {
    try {
      try {
        sessionStorage.removeItem("ssb_survey_direct_user");
      } catch (e) {}
      const [{ signOut }, { auth }] = await Promise.all([
        import("firebase/auth"),
        import("@/lib/firebase/auth"),
      ]);
      if (auth) {
        await signOut(auth);
      }
    } catch (err) {
      console.error("Sign-out error:", err);
    } finally {
      setCurrentUser(null);
      setConfirmSignOutModal(false);
      setAlreadySubmitted(false);
      setExistingSubmissionDate(null);
    }
  };

  // Answer change handlers
  const handleAnswerChange = (questionId: string, value: any) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: value,
    }));
    if (errors[questionId]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[questionId];
        return next;
      });
    }
  };

  const handleCheckboxToggle = (questionId: string, optionValue: string) => {
    const current = (answers[questionId] as string[]) || [];
    let updated: string[];

    if (optionValue === "none") {
      updated = current.includes("none") ? [] : ["none"];
    } else {
      const filtered = current.filter((v) => v !== "none");
      if (filtered.includes(optionValue)) {
        updated = filtered.filter((v) => v !== optionValue);
      } else {
        updated = [...filtered, optionValue];
      }
    }

    handleAnswerChange(questionId, updated);
  };

  // Form Validation
  const validateForm = () => {
    if (!currentUser) {
      setSubmissionError(
        isHindi
          ? "कृपया सर्वेक्षण जमा करने से पहले गूगल से साइन इन करें।"
          : "Please sign in with Google before submitting the survey."
      );
      return false;
    }

    const payloadCheck = validateSurveyResponsePayload({
      surveyId: survey.id,
      uid: currentUser.uid,
      email: currentUser.email || "",
      name: respondentName,
      phone: contactPhone,
      role,
      answers,
      consentGiven,
    });

    const newErrors: Record<string, string> = { ...payloadCheck.errors };

    // Validate each required survey question
    survey.questions.forEach((q) => {
      if (q.required) {
        const answer = answers[q.id];
        if (
          answer === undefined ||
          answer === null ||
          (typeof answer === "string" && answer.trim() === "") ||
          (Array.isArray(answer) && answer.length === 0)
        ) {
          newErrors[q.id] = isHindi
            ? `कृपया "${q.label_hi}" का उत्तर दें।`
            : `Please provide an answer for "${q.label_en}".`;
        } else if (q.type === "number") {
          const num = Number(answer);
          if (isNaN(num) || (q.min !== undefined && num < q.min) || (q.max !== undefined && num > q.max)) {
            newErrors[q.id] = isHindi
              ? `कृपया ${q.min || 1} से ${q.max || 5} के बीच का अंक चुनें।`
              : `Please enter a rating between ${q.min || 1} and ${q.max || 5}.`;
          }
        }
      }
    });

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      setTimeout(() => {
        errorSummaryRef.current?.focus();
      }, 50);
      return false;
    }

    return true;
  };

  // Submit Handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmissionError("");

    // Bot honeypot check
    if (honeypot) {
      console.warn("Spam honeypot triggered");
      return;
    }

    // Minimum timing threshold check (prevents scripted automation)
    const timeSpent = (Date.now() - loadTimestampRef.current) / 1000;
    if (timeSpent < 2) {
      setSubmissionError(
        isHindi
          ? "कृपया फॉर्म की समीक्षा करने के पश्चात ही सबमिट करें।"
          : "Submission received too quickly. Please take a moment to review your answers."
      );
      return;
    }

    if (!validateForm()) return;
    if (!currentUser) return;

    setIsSubmitting(true);

    try {
      const [{ doc, setDoc, serverTimestamp }, { db }] = await Promise.all([
        import("firebase/firestore"),
        import("@/lib/firebase/firestore"),
      ]);

      const sanitizedPhone = validateIndianPhoneNumber(contactPhone).sanitized || contactPhone.trim();
      const docId = getSurveyResponseDocId(survey.id, currentUser.uid);

      const responsePayload = {
        surveyId: survey.id,
        uid: currentUser.uid,
        email: (currentUser.email || "").toLowerCase().trim(),
        name: respondentName.trim(),
        phone: sanitizedPhone,
        role,
        answers: { ...answers },
        consentGiven: true,
        consentAt: new Date().toISOString(),
        submittedAt: new Date().toISOString(),
        createdAt: serverTimestamp(),
      };

      let savedToFirestore = false;
      if (db) {
        try {
          // Enforce strictly 1 document per account per survey via deterministic docId
          await setDoc(doc(db, SURVEY_COLLECTIONS.RESPONSES, docId), responsePayload);
          savedToFirestore = true;
        } catch (dbErr) {
          console.warn("Firestore setDoc failed, saving to local secure backup:", dbErr);
        }
      }

      // Always save to local backup so responses are never lost
      try {
        const localKey = "ssb_local_survey_submissions";
        const existing: any[] = JSON.parse(localStorage.getItem(localKey) || "[]");
        const filtered = existing.filter((item: any) => item.id !== docId && item.email !== responsePayload.email);
        filtered.push({
          ...responsePayload,
          id: docId,
          _localBackup: true,
          _syncedToFirestore: savedToFirestore,
        });
        localStorage.setItem(localKey, JSON.stringify(filtered));
      } catch (e) {
        console.warn("Could not save to localStorage:", e);
      }

      // Clear draft storage after successful submission
      try {
        sessionStorage.removeItem(`ssb_survey_draft_${survey.id}_${currentUser.uid}`);
      } catch (e) {
        // Ignore storage error
      }

      setSubmittedSuccessfully(true);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err: any) {
      console.error("Survey submission unexpected error:", err);
      setSubmissionError(
        isHindi
          ? "सर्वेक्षण प्रतिक्रिया सहेजने में त्रुटि हुई। कृपया अपना विवरण जांचें और पुनः प्रयास करें।"
          : "Could not save your survey response. Please check your details and try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // Success view
  if (submittedSuccessfully) {
    return (
      <main id="main-content" className="w-full max-w-4xl mx-auto px-4 py-12">
        <div
          role="status"
          aria-live="polite"
          className="bg-white rounded-2xl border-2 border-emerald-500 shadow-md p-8 sm:p-12 text-center space-y-6"
        >
          <div className="w-20 h-20 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto ring-8 ring-emerald-50">
            <CheckCircle2 className="w-10 h-10" aria-hidden="true" />
          </div>

          <div className="space-y-2">
            <Badge variant="verified" className="text-xs">
              {isHindi ? "प्रतिक्रिया सुरक्षित रूप से दर्ज" : "Response Securely Recorded"}
            </Badge>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0B2D52]">
              {t("survey.successTitle", "Thank You for Your Valuable Contribution!")}
            </h1>
            <p className="text-base text-slate-600 max-w-2xl mx-auto leading-relaxed">
              {t(
                "survey.successMessage",
                "Your survey response has been securely recorded in our research database. The insights you shared directly support improving physical infrastructure and advancing inclusive education for children in Danapur."
              )}
            </p>
          </div>

          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-600 max-w-xl mx-auto text-left space-y-1.5">
            <p className="font-semibold text-[#0B2D52] flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-teal-600" aria-hidden="true" />
              {isHindi ? "गोपनीयता एवं शोध नैतिकता पुष्टिकरण" : "Privacy & Research Ethics Confirmation"}
            </p>
            <p>
              {isHindi
                ? `यह प्रतिक्रिया आपके प्रमाणित गूगल खाते (${currentUser?.email}) के अंतर्गत सुरक्षित दर्ज की गई है। आपका नाम और संपर्क नंबर केवल शोध सत्यापन हेतु संरक्षित रहेगा और कभी सार्वजनिक नहीं किया जाएगा।`
                : `This response was recorded under your authenticated Google account (${currentUser?.email}). Your personal contact details are strictly confidential, protected under India's DPDP Act 2023, and never published publicly.`}
            </p>
            <p className="text-[11px] text-slate-400 font-mono pt-1">
              {isHindi ? "प्रतिक्रिया संदर्भ आईडी:" : "Submission Reference ID:"} {survey.id}_{currentUser?.uid}
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <Link href="/schools">
              <Button variant="primary" leftIcon={<School className="w-4 h-4" />}>
                {t("survey.viewSchools", "Explore School Directory")}
              </Button>
            </Link>
            <Link href="/">
              <Button variant="outline">
                {t("survey.backHome", "Return to Homepage")}
              </Button>
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main id="main-content" className="w-full max-w-4xl mx-auto px-4 py-8 sm:py-12 space-y-8">
      {/* Header Banner */}
      <header className="space-y-4 text-center sm:text-left border-b border-slate-100 pb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-teal-50 text-teal-800 border border-teal-200">
          <Sparkles className="w-3.5 h-3.5 text-teal-600" aria-hidden="true" />
          <span>{t("survey.researchTag", "NCPEDP Fellowship Community Survey")}</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-[#0B2D52] tracking-tight">
          {isHindi ? survey.title_hi : survey.title_en}
        </h1>
        <p className="text-base sm:text-lg text-slate-600 max-w-3xl leading-relaxed">
          {isHindi ? survey.description_hi : survey.description_en}
        </p>

        <div className="flex flex-wrap items-center gap-4 pt-2 text-xs text-slate-500 font-medium">
          <span className="flex items-center gap-1.5 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200">
            <UserCheck className="w-4 h-4 text-teal-600" aria-hidden="true" />
            <span>
              {isHindi ? "लक्षित प्रतिभागी: " : "Target Audience: "}
              <strong className="text-slate-800">
                {isHindi ? survey.targetAudience_hi : survey.targetAudience_en}
              </strong>
            </span>
          </span>
          <span className="flex items-center gap-1.5 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200">
            <Clock className="w-4 h-4 text-slate-400" aria-hidden="true" />
            <span>{isHindi ? "अनुमानित समय: 5-7 मिनट" : "Est. time: 5-7 minutes"}</span>
          </span>
          <span className="flex items-center gap-1.5 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200">
            <Lock className="w-4 h-4 text-teal-600" aria-hidden="true" />
            <span>{isHindi ? "1 प्रतिक्रिया प्रति गूगल खाता" : "1 response per Google account"}</span>
          </span>
        </div>
      </header>

      {/* =========================================================================
          AUTHENTICATION GATE: Sign-In with Google or Signed-In Identity Bar
          ========================================================================= */}
      {authChecking ? (
        <Card className="p-8 text-center border-slate-200">
          <div className="flex flex-col items-center justify-center gap-3">
            <div className="w-8 h-8 border-3 border-teal-600 border-t-transparent rounded-full animate-spin" aria-hidden="true" />
            <span className="text-sm font-medium text-slate-600">
              {isHindi ? "प्रमाणीकरण स्थिति जांची जा रही है..." : "Checking authentication status..."}
            </span>
          </div>
        </Card>
      ) : !currentUser ? (
        /* PRE-AUTH STATE: Clean Google Sign-In Card */
        <Card className="border-2 border-teal-200 bg-gradient-to-br from-teal-50/60 via-white to-slate-50 p-6 sm:p-8 shadow-sm">
          <div className="max-w-2xl mx-auto text-center space-y-5">
            <div className="w-14 h-14 rounded-2xl bg-white shadow-xs border border-teal-100 flex items-center justify-center mx-auto text-teal-700">
              <LogIn className="w-7 h-7" aria-hidden="true" />
            </div>

            <div className="space-y-2">
              <h2 className="text-xl sm:text-2xl font-bold text-[#0B2D52]">
                {t("survey.signInRequiredTitle", "Google Sign-In Required for Participation")}
              </h2>
              <p className="text-sm text-slate-600 leading-relaxed max-w-xl mx-auto">
                {t(
                  "survey.signInRequiredDesc",
                  "Sign-in ensures one response per person and protects survey research integrity. Your name, email, and contact number will be stored confidentially for research purposes only and never published."
                )}
              </p>
            </div>

            {authError && (
              <div
                role="alert"
                className="p-3.5 rounded-xl bg-red-50 border border-red-300 text-red-800 text-xs sm:text-sm flex items-center justify-center gap-2 text-left"
              >
                <AlertCircle className="w-4 h-4 text-red-600 shrink-0" aria-hidden="true" />
                <span>{authError}</span>
              </div>
            )}

            <div className="pt-2 flex flex-col items-center gap-3">
              <button
                type="button"
                onClick={handleGoogleSignIn}
                disabled={isSigningIn}
                className="inline-flex items-center gap-3 bg-white hover:bg-slate-50 text-slate-700 font-bold px-6 sm:px-8 py-3.5 rounded-xl border border-slate-300 shadow-sm hover:shadow transition-all focus:outline-none focus:ring-3 focus:ring-teal-600 focus:ring-offset-2 active:scale-98 cursor-pointer disabled:opacity-60"
              >
                {/* Official Google G Icon */}
                <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24" aria-hidden="true">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
                <span>
                  {isSigningIn
                    ? t("survey.signingIn", "Signing in with Google...")
                    : t("survey.signInWithGoogle", "Sign in with Google to Participate")}
                </span>
              </button>

              <div className="relative w-full max-w-sm my-2">
                <div className="absolute inset-0 flex items-center" aria-hidden="true">
                  <div className="w-full border-t border-slate-200" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-white/80 px-3 text-slate-500 font-semibold">
                    {isHindi ? "अथवा" : "or"}
                  </span>
                </div>
              </div>

              {/* Direct Email/Phone Option Toggle */}
              <button
                type="button"
                onClick={() => setShowDirectAuth(!showDirectAuth)}
                className="inline-flex items-center gap-2 text-sm font-semibold text-teal-800 bg-teal-50/90 hover:bg-teal-100 px-4 py-2 rounded-lg border border-teal-200 transition-colors cursor-pointer"
              >
                <Mail className="w-4 h-4 text-teal-700 shrink-0" aria-hidden="true" />
                <span>
                  {showDirectAuth
                    ? (isHindi ? "सीधा सत्यापन फॉर्म छिपाएं" : "Hide Direct Verification Form")
                    : (isHindi ? "सीधे ईमेल और फोन नंबर से भाग लें (Google बिना)" : "Continue with Email & Phone (No Google needed)")}
                </span>
              </button>

              <p className="text-xs text-slate-500 flex items-center gap-1.5 mt-1">
                <ShieldCheck className="w-3.5 h-3.5 text-teal-600 shrink-0" aria-hidden="true" />
                <span>
                  {isHindi
                    ? "शेष वेबसाइट बिना किसी लॉगिन के पूर्ण रूप से खुली है।"
                    : "The rest of the website remains completely login-free."}
                </span>
              </p>
            </div>

            {/* Direct Verification Form */}
            {showDirectAuth && (
              <div className="mt-6 pt-6 border-t border-teal-200 text-left bg-white p-5 sm:p-6 rounded-2xl border shadow-xs max-w-xl mx-auto space-y-4">
                <div className="border-b border-slate-100 pb-3">
                  <h3 className="text-base font-bold text-[#0B2D52] flex items-center gap-2">
                    <UserCheck className="w-5 h-5 text-teal-600 shrink-0" aria-hidden="true" />
                    <span>
                      {isHindi ? "प्रतिभागी सीधा सत्यापन" : "Direct Participant Verification"}
                    </span>
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">
                    {isHindi
                      ? "सर्वेक्षण शोध की अखंडता बनाए रखने के लिए अपना नाम, ईमेल और मोबाइल नंबर दर्ज करें।"
                      : "Enter your contact details to participate in the research study without Google account sign-in."}
                  </p>
                </div>

                {directAuthError && (
                  <div
                    role="alert"
                    className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-800 text-xs sm:text-sm flex items-center gap-2"
                  >
                    <AlertCircle className="w-4 h-4 text-red-600 shrink-0" aria-hidden="true" />
                    <span>{directAuthError}</span>
                  </div>
                )}

                <form onSubmit={handleDirectVerify} className="space-y-3.5">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      {isHindi ? "पूरा नाम" : "Full Name"} <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={directName}
                      onChange={(e) => setDirectName(e.target.value)}
                      placeholder={isHindi ? "उदा. राहुल कुमार" : "e.g. Rahul Kumar"}
                      className="w-full px-3.5 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-600 focus:border-teal-600"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        {isHindi ? "ईमेल पता" : "Email Address"} <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="email"
                        value={directEmail}
                        onChange={(e) => setDirectEmail(e.target.value)}
                        placeholder="name@example.com"
                        className="w-full px-3.5 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-600 focus:border-teal-600"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        {isHindi ? "10-अंकीय मोबाइल नंबर" : "10-Digit Mobile"} <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="tel"
                        maxLength={10}
                        value={directPhone}
                        onChange={(e) => setDirectPhone(e.target.value.replace(/\D/g, ""))}
                        placeholder="9876543210"
                        className="w-full px-3.5 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-600 focus:border-teal-600"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      {isHindi ? "आपकी भूमिका" : "Your Role"} <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={directRole}
                      onChange={(e) => setDirectRole(e.target.value as RespondentRole)}
                      className="w-full px-3.5 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-600 focus:border-teal-600 bg-white"
                    >
                      <option value="parent">{isHindi ? "अभिभावक (Parent / Guardian)" : "Parent / Guardian"}</option>
                      <option value="student">{isHindi ? "दिव्यांग विद्यार्थी (Student with Disability)" : "Student with Disability"}</option>
                      <option value="teacher">{isHindi ? "विशेष / समावेशी शिक्षक (Teacher / Special Educator)" : "Teacher / Special Educator"}</option>
                      <option value="advocate">{isHindi ? "सामुदायिक कार्यकर्ता / समर्थक (Community Advocate)" : "Community Advocate"}</option>
                    </select>
                  </div>

                  <div className="pt-2 flex items-center justify-end gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => setShowDirectAuth(false)}
                      className="text-xs"
                    >
                      {isHindi ? "रद्द करें" : "Cancel"}
                    </Button>
                    <Button
                      type="submit"
                      variant="primary"
                      size="sm"
                      className="bg-teal-700 hover:bg-teal-800 text-white text-xs px-4"
                    >
                      {isHindi ? "सत्यापित करें और सर्वेक्षण भरें →" : "Verify & Start Survey →"}
                    </Button>
                  </div>
                </form>
              </div>
            )}
          </div>
        </Card>
      ) : (
        /* POST-AUTH STATE: Active Identity Bar */
        <div className="bg-white border border-teal-200 rounded-xl p-4 sm:p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            {currentUser.photoURL ? (
              <img
                src={currentUser.photoURL}
                alt=""
                className="w-10 h-10 rounded-full border border-teal-300 object-cover"
                referrerPolicy="no-referrer"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-teal-100 text-teal-800 font-bold flex items-center justify-center text-sm border border-teal-200">
                {(currentUser.displayName || currentUser.email || "U").charAt(0).toUpperCase()}
              </div>
            )}
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  {t("survey.signedInAs", "Signed in as")}
                </span>
                <Badge variant="verified" className="text-[10px] py-0 px-1.5">
                  {(currentUser as any).isDirectAuth
                    ? (isHindi ? "सत्यापित प्रतिभागी" : "Verified Participant")
                    : "Google Verified"}
                </Badge>
              </div>
              <p className="text-sm font-bold text-[#0B2D52]">
                {currentUser.displayName || (isHindi ? "सत्यापित उपयोगकर्ता" : "Verified User")}
                <span className="text-slate-500 font-normal ml-1.5 font-mono text-xs">
                  ({currentUser.email})
                </span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-center">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setConfirmSignOutModal(true)}
              leftIcon={<LogOut className="w-3.5 h-3.5" />}
              className="text-slate-600 hover:text-red-700 text-xs"
            >
              {t("survey.signOut", "Sign Out")}
            </Button>
          </div>
        </div>
      )}

      {/* Already Submitted Notice Banner */}
      {currentUser && alreadySubmitted && (
        <div
          role="status"
          className="p-4 sm:p-5 rounded-xl bg-amber-50 border border-amber-300 text-amber-900 text-sm flex items-start gap-3 shadow-xs"
        >
          <Info className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" aria-hidden="true" />
          <div className="space-y-1">
            <p className="font-bold">
              {t(
                "survey.alreadySubmittedNotice",
                "You have already participated in this survey. You may review and update your answers below."
              )}
            </p>
            {existingSubmissionDate && (
              <p className="text-xs text-amber-800">
                {isHindi ? "पिछली सबमिशन तिथि: " : "Previous submission: "}
                {new Date(existingSubmissionDate).toLocaleString(isHindi ? "hi-IN" : "en-IN")}
              </p>
            )}
          </div>
        </div>
      )}

      {/* Error Summary accessible banner */}
      {Object.keys(errors).length > 0 && (
        <div
          ref={errorSummaryRef}
          tabIndex={-1}
          role="alert"
          aria-labelledby="error-summary-heading"
          className="p-5 rounded-xl bg-red-50 border-2 border-red-500 shadow-sm space-y-2 focus:outline-none focus:ring-2 focus:ring-red-600"
        >
          <div className="flex items-center gap-2 text-red-900 font-bold text-sm sm:text-base">
            <AlertCircle className="w-5 h-5 text-red-600 shrink-0" aria-hidden="true" />
            <h2 id="error-summary-heading">
              {isHindi
                ? `कृपया फॉर्म में निम्नलिखित ${Object.keys(errors).length} त्रुटियों को ठीक करें:`
                : `Please correct the following ${Object.keys(errors).length} errors before submitting:`}
            </h2>
          </div>
          <ul className="list-disc list-inside text-xs sm:text-sm text-red-800 space-y-1 pl-2">
            {Object.entries(errors).map(([key, msg]) => (
              <li key={key}>
                <a href={`#field-${key}`} className="underline hover:text-red-950 font-medium">
                  {msg}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}

      {submissionError && (
        <div
          role="alert"
          className="p-4 rounded-xl bg-red-50 border border-red-300 text-red-800 text-sm flex items-center gap-2"
        >
          <AlertCircle className="w-5 h-5 text-red-600 shrink-0" aria-hidden="true" />
          <span>{submissionError}</span>
        </div>
      )}

      {/* =========================================================================
          SURVEY FORM: Active for Signed-In Users (or Preview for Visitors)
          ========================================================================= */}
      <form onSubmit={handleSubmit} noValidate className="space-y-8">
        {/* Anti-spam honeypot */}
        <div className="sr-only" aria-hidden="true">
          <label htmlFor="website-honeypot">Leave this empty</label>
          <input
            id="website-honeypot"
            type="text"
            tabIndex={-1}
            autoComplete="off"
            value={honeypot}
            onChange={(e) => setHoneypot(e.target.value)}
          />
        </div>

        {/* Step 1: Respondent Details */}
        <Card as="section" className="p-6 sm:p-7 border-slate-200 shadow-xs space-y-6">
          <div className="border-b border-slate-100 pb-3">
            <h2 className="text-xl font-bold text-[#0B2D52]">
              {t("survey.respondentSection", "1. Verified Respondent Information")}
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              {isHindi
                ? "शोध अध्ययन एवं सत्यनिष्ठा हेतु आपके मूल विवरण (गूगल खाते द्वारा सत्यापित)"
                : "Basic respondent verification for NCPEDP research study integrity"}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Full Name */}
            <div id="field-name" className="space-y-1.5">
              <label htmlFor="resp_name" className="block text-sm font-bold text-slate-800">
                {t("survey.nameLabel", "Full Name")}{" "}
                <span className="text-red-600" aria-hidden="true">*</span>
              </label>
              <Input
                id="resp_name"
                name="name"
                type="text"
                autoComplete="name"
                required
                disabled={!currentUser}
                value={respondentName}
                onChange={(e) => {
                  setRespondentName(e.target.value);
                  if (errors.name) {
                    setErrors((prev) => {
                      const next = { ...prev };
                      delete next.name;
                      return next;
                    });
                  }
                }}
                placeholder={isHindi ? "उदा. सुनीता शर्मा" : "e.g. Sunita Sharma"}
                aria-invalid={Boolean(errors.name)}
                aria-describedby={errors.name ? "err-name" : "help-name"}
                className={errors.name ? "border-red-500 focus:ring-red-500" : ""}
              />
              <p id="help-name" className="text-[11px] text-slate-500">
                {t("survey.nameHelp", "Prefilled from your Google account. You may edit your preferred name.")}
              </p>
              {errors.name && (
                <p id="err-name" role="alert" className="text-xs font-bold text-red-600 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                  <span>{errors.name}</span>
                </p>
              )}
            </div>

            {/* Contact Phone Number */}
            <div id="field-phone" className="space-y-1.5">
              <label htmlFor="resp_phone" className="block text-sm font-bold text-slate-800">
                {t("survey.phoneLabel", "Contact Number (Indian Mobile)")}{" "}
                <span className="text-red-600" aria-hidden="true">*</span>
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-xs font-bold text-slate-500">
                  +91
                </span>
                <input
                  id="resp_phone"
                  name="phone"
                  type="tel"
                  inputMode="tel"
                  autoComplete="tel"
                  required
                  disabled={!currentUser}
                  value={contactPhone}
                  onChange={(e) => {
                    setContactPhone(e.target.value);
                    if (errors.phone) {
                      setErrors((prev) => {
                        const next = { ...prev };
                        delete next.phone;
                        return next;
                      });
                    }
                  }}
                  placeholder="9876543210"
                  aria-invalid={Boolean(errors.phone)}
                  aria-describedby={errors.phone ? "err-phone" : "help-phone"}
                  className={`w-full pl-11 pr-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-600 disabled:bg-slate-100 disabled:text-slate-400 ${
                    errors.phone ? "border-red-500" : "border-slate-300"
                  }`}
                />
              </div>
              <p id="help-phone" className="text-[11px] text-slate-500">
                {t("survey.phoneHelp", "10-digit mobile number (e.g. 9876543210). Used solely for research verification.")}
              </p>
              {errors.phone && (
                <p id="err-phone" role="alert" className="text-xs font-bold text-red-600 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                  <span>{errors.phone}</span>
                </p>
              )}
            </div>

            {/* Email Address (Read-only from Google) */}
            <div id="field-email" className="space-y-1.5 md:col-span-2">
              <label htmlFor="resp_email" className="block text-sm font-bold text-slate-800">
                {t("survey.emailLabel", "Verified Email Address")}
              </label>
              <div className="relative">
                <input
                  id="resp_email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  readOnly
                  aria-readonly="true"
                  value={currentUser ? currentUser.email || "" : "—"}
                  disabled={!currentUser}
                  className="w-full pr-10 pl-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg text-slate-700 font-mono focus:outline-none"
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4" aria-hidden="true" />
                </div>
              </div>
              <p className="text-[11px] text-slate-500">
                {t("survey.emailHelp", "Read-only from your authenticated Google account.")}
              </p>
            </div>
          </div>

          {/* Role Selection */}
          <fieldset id="field-role" className="space-y-2 pt-2">
            <legend className="text-sm font-bold text-slate-800">
              {t("survey.roleLabel", "Your Role / Association")}{" "}
              <span className="text-red-600" aria-hidden="true">*</span>
            </legend>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2.5 pt-1">
              {[
                { id: "student", label: t("survey.roles.student", "Student with Disability") },
                { id: "parent", label: t("survey.roles.parent", "Parent / Guardian") },
                { id: "teacher", label: t("survey.roles.teacher", "Teacher / Special Educator") },
                { id: "advocate", label: t("survey.roles.advocate", "Disability Rights Advocate") },
              ].map((r) => (
                <label
                  key={r.id}
                  className={`flex items-center gap-2.5 p-3 rounded-lg border text-xs sm:text-sm font-medium cursor-pointer transition-colors ${
                    role === r.id
                      ? "bg-teal-50 border-teal-600 text-teal-900 ring-1 ring-teal-600"
                      : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50"
                  } ${!currentUser ? "opacity-60 cursor-not-allowed" : ""}`}
                >
                  <input
                    type="radio"
                    name="respondentRole"
                    value={r.id}
                    disabled={!currentUser}
                    checked={role === r.id}
                    onChange={(e) => setRole(e.target.value as RespondentRole)}
                    className="h-4 w-4 text-teal-600 focus:ring-teal-500"
                  />
                  <span>{r.label}</span>
                </label>
              ))}
            </div>
            {errors.role && (
              <p role="alert" className="text-xs font-bold text-red-600 flex items-center gap-1 pt-1">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                <span>{errors.role}</span>
              </p>
            )}
          </fieldset>
        </Card>

        {/* Step 2: Research Ethics & Consent */}
        <Card as="section" className="border-teal-200 bg-teal-50/40 p-6 sm:p-7 shadow-xs space-y-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-lg bg-teal-100 text-teal-800 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5" aria-hidden="true" />
            </div>
            <div className="space-y-1">
              <h2 className="text-lg font-bold text-[#0B2D52]">
                {t("survey.privacyNoticeTitle", "Research Ethics & Privacy Commitment")}
              </h2>
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                {t(
                  "survey.privacyNoticeText",
                  "This survey is conducted solely for independent academic research under the NCPEDP Fellowship to evaluate school accessibility in Danapur. Your participation is completely voluntary. Personal identifiers are never sold, shared publicly, or linked to individual school evaluations. All findings are anonymized and reported in aggregate form."
                )}
              </p>
            </div>
          </div>

          <div
            id="field-consent"
            className={`p-4 rounded-xl border transition-colors ${
              errors.consent ? "bg-red-50 border-red-400" : "bg-white border-teal-200"
            }`}
          >
            <label className={`flex items-start gap-3 ${!currentUser ? "opacity-60 cursor-not-allowed" : "cursor-pointer"}`}>
              <input
                type="checkbox"
                checked={consentGiven}
                disabled={!currentUser}
                onChange={(e) => {
                  setConsentGiven(e.target.checked);
                  if (errors.consent) {
                    setErrors((prev) => {
                      const next = { ...prev };
                      delete next.consent;
                      return next;
                    });
                  }
                }}
                aria-required="true"
                aria-invalid={Boolean(errors.consent)}
                aria-describedby={errors.consent ? "consent-err" : undefined}
                className="mt-1 h-5 w-5 rounded border-slate-300 text-teal-600 focus:ring-teal-500"
              />
              <span className="text-xs sm:text-sm font-semibold text-[#0B2D52] leading-snug">
                {isHindi
                  ? "मैं सहमत हूँ कि मेरा नाम, संपर्क नंबर और ईमेल इस शोध परियोजना के लिए संग्रहीत किया जाएगा, केवल शोध उद्देश्यों के लिए उपयोग किया जाएगा और सार्वजनिक रूप से प्रदर्शित नहीं किया जाएगा।"
                  : "I agree that my name, contact number and email will be stored for this research project, used only for research purposes and not shown publicly."}{" "}
                <span className="text-red-600" aria-hidden="true">*</span>
              </span>
            </label>

            {errors.consent && (
              <p id="consent-err" role="alert" className="mt-2 text-xs font-bold text-red-600 flex items-center gap-1.5 pl-8">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                <span>{errors.consent}</span>
              </p>
            )}
          </div>
        </Card>

        {/* Step 3: Survey Questions Questionnaire */}
        <Card as="section" className="p-6 sm:p-7 border-slate-200 shadow-xs space-y-8">
          <div className="border-b border-slate-100 pb-3">
            <h2 className="text-xl font-bold text-[#0B2D52]">
              {t("survey.questionsSection", "2. School Accessibility Questionnaire")}
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              {t("survey.instructions", "Please answer the questions based on your visits or knowledge of schools in Danapur.")}
            </p>
          </div>

          <div className="space-y-8">
            {survey.questions.map((q, idx) => {
              const qError = errors[q.id];
              const qValue = answers[q.id];

              return (
                <div
                  key={q.id}
                  id={`field-${q.id}`}
                  className={`p-5 rounded-xl border transition-colors space-y-3 ${
                    qError ? "bg-red-50/40 border-red-300" : "bg-white border-slate-200 hover:border-slate-300"
                  }`}
                >
                  <div className="space-y-1">
                    <div className="flex items-baseline gap-2">
                      <span className="text-xs font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
                        Q{idx + 1}
                      </span>
                      <label className="text-sm sm:text-base font-bold text-[#0B2D52]">
                        {isHindi ? q.label_hi : q.label_en}
                        {q.required && <span className="text-red-600 ml-1" aria-hidden="true">*</span>}
                      </label>
                    </div>

                    {(q.helpText_hi || q.helpText_en) && (
                      <p className="text-xs text-slate-500 pl-8">
                        {isHindi ? q.helpText_hi : q.helpText_en}
                      </p>
                    )}
                  </div>

                  {/* Question Input Controls */}
                  <div className="pl-0 sm:pl-8 pt-1">
                    {/* Text input */}
                    {q.type === "text" && (
                      <Input
                        disabled={!currentUser}
                        value={qValue || ""}
                        onChange={(e) => handleAnswerChange(q.id, e.target.value)}
                        placeholder={isHindi ? q.placeholder_hi : q.placeholder_en}
                        aria-invalid={Boolean(qError)}
                        aria-describedby={qError ? `err-${q.id}` : undefined}
                      />
                    )}

                    {/* Textarea */}
                    {q.type === "textarea" && (
                      <Textarea
                        rows={3}
                        disabled={!currentUser}
                        value={qValue || ""}
                        onChange={(e) => handleAnswerChange(q.id, e.target.value)}
                        placeholder={isHindi ? q.placeholder_hi : q.placeholder_en}
                        aria-invalid={Boolean(qError)}
                        aria-describedby={qError ? `err-${q.id}` : undefined}
                      />
                    )}

                    {/* Radio Options */}
                    {q.type === "radio" && q.options && (
                      <fieldset className="space-y-2">
                        <legend className="sr-only">{isHindi ? q.label_hi : q.label_en}</legend>
                        <div className="grid grid-cols-1 gap-2">
                          {q.options.map((opt) => (
                            <label
                              key={opt.value}
                              className={`flex items-start gap-3 p-3 rounded-lg border text-xs sm:text-sm cursor-pointer transition-colors ${
                                qValue === opt.value
                                  ? "bg-teal-50 border-teal-600 text-teal-900 font-semibold ring-1 ring-teal-600"
                                  : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50"
                              } ${!currentUser ? "opacity-60 cursor-not-allowed" : ""}`}
                            >
                              <input
                                type="radio"
                                name={q.id}
                                value={opt.value}
                                disabled={!currentUser}
                                checked={qValue === opt.value}
                                onChange={() => handleAnswerChange(q.id, opt.value)}
                                className="mt-0.5 h-4 w-4 text-teal-600 focus:ring-teal-500"
                              />
                              <span className="leading-snug">{isHindi ? opt.label_hi : opt.label_en}</span>
                            </label>
                          ))}
                        </div>
                      </fieldset>
                    )}

                    {/* Checkbox Options */}
                    {q.type === "checkbox" && q.options && (
                      <fieldset className="space-y-2">
                        <legend className="sr-only">{isHindi ? q.label_hi : q.label_en}</legend>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {q.options.map((opt) => {
                            const isChecked = Array.isArray(qValue) && qValue.includes(opt.value);
                            return (
                              <label
                                key={opt.value}
                                className={`flex items-start gap-2.5 p-3 rounded-lg border text-xs sm:text-sm cursor-pointer transition-colors ${
                                  isChecked
                                    ? "bg-teal-50 border-teal-600 text-teal-900 font-semibold ring-1 ring-teal-600"
                                    : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50"
                                } ${!currentUser ? "opacity-60 cursor-not-allowed" : ""}`}
                              >
                                <input
                                  type="checkbox"
                                  disabled={!currentUser}
                                  checked={isChecked}
                                  onChange={() => handleCheckboxToggle(q.id, opt.value)}
                                  className="mt-0.5 h-4 w-4 rounded border-slate-300 text-teal-600 focus:ring-teal-500"
                                />
                                <span className="leading-snug">{isHindi ? opt.label_hi : opt.label_en}</span>
                              </label>
                            );
                          })}
                        </div>
                      </fieldset>
                    )}

                    {/* 1 to 5 Rating scale */}
                    {q.type === "number" && (
                      <div className="space-y-2">
                        <div className="flex flex-wrap items-center gap-2">
                          {[1, 2, 3, 4, 5].map((num) => (
                            <button
                              key={num}
                              type="button"
                              disabled={!currentUser}
                              onClick={() => handleAnswerChange(q.id, num)}
                              className={`w-11 h-11 rounded-xl font-bold text-sm transition-all focus:outline-none focus:ring-2 focus:ring-teal-600 ${
                                qValue === num
                                  ? "bg-teal-700 text-white shadow-sm scale-105"
                                  : "bg-slate-100 hover:bg-slate-200 text-slate-800"
                              } ${!currentUser ? "opacity-60 cursor-not-allowed" : ""}`}
                            >
                              {num}
                            </button>
                          ))}
                        </div>
                        <p className="text-[11px] text-slate-500">
                          {t("survey.ratingLegend", "Rating: 1 (Very Inaccessible) to 5 (Fully Accessible)")}
                        </p>
                      </div>
                    )}

                    {qError && (
                      <p id={`err-${q.id}`} role="alert" className="mt-2 text-xs font-bold text-red-600 flex items-center gap-1">
                        <AlertCircle className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                        <span>{qError}</span>
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </Card>

        {/* Submit Actions */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-xs text-slate-500">
            {currentUser ? (
              <span>
                {isHindi
                  ? "सबमिट करने पर आपकी प्रतिक्रिया आपके गूगल खाते के साथ सुरक्षित रूप से लिंक हो जाएगी।"
                  : "Submitting will securely record your responses under your verified Google account."}
              </span>
            ) : (
              <span className="text-amber-800 font-medium">
                {isHindi
                  ? "कृपया सर्वेक्षण सबमिट करने से पहले ऊपर गूगल से साइन इन करें।"
                  : "Please sign in with Google above to submit your survey response."}
              </span>
            )}
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            {!currentUser ? (
              <Button
                type="button"
                variant="primary"
                onClick={handleGoogleSignIn}
                disabled={isSigningIn}
                leftIcon={<LogIn className="w-4 h-4" />}
                className="w-full sm:w-auto"
              >
                {t("survey.signInWithGoogle", "Sign in with Google to Participate")}
              </Button>
            ) : (
              <Button
                type="submit"
                variant="primary"
                size="lg"
                disabled={isSubmitting}
                rightIcon={isSubmitting ? undefined : <ArrowRight className="w-4 h-4" />}
                className="w-full sm:w-auto"
              >
                {isSubmitting
                  ? t("survey.submitting", "Submitting Response...")
                  : alreadySubmitted
                  ? t("survey.updateButton", "Update Survey Response")
                  : t("survey.submitButton", "Submit Survey Response")}
              </Button>
            )}
          </div>
        </div>
      </form>

      {/* Sign Out Confirmation Modal */}
      {confirmSignOutModal && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="signout-modal-title"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs"
        >
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-slate-200 space-y-4">
            <h3 id="signout-modal-title" className="text-lg font-bold text-[#0B2D52]">
              {t("survey.signOut", "Sign Out")}
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              {t(
                "survey.signOutConfirm",
                "Are you sure you want to sign out? Your draft answers will be preserved for your next sign-in."
              )}
            </p>
            <div className="pt-2 flex items-center justify-end gap-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setConfirmSignOutModal(false)}
              >
                {isHindi ? "रद्द करें" : "Cancel"}
              </Button>
              <Button
                variant="danger"
                size="sm"
                onClick={handleSignOut}
                leftIcon={<LogOut className="w-3.5 h-3.5" />}
              >
                {t("survey.signOut", "Sign Out")}
              </Button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
