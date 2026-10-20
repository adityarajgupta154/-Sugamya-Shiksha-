/**
 * Shared Survey Constants & Normalization Utility
 * PRD Section 11.2, 11.3 & ADR 0011
 * 
 * Ensures the Survey Form write path and the Admin Panel read path
 * use identical collection names, document keys, and field types.
 */

export const SURVEY_COLLECTIONS = {
  SURVEYS: "surveys",
  RESPONSES: "surveyResponses",
  USERS: "users",
} as const;

export const DEFAULT_SURVEY_ID = "danapur-community-survey-2026";

/**
 * Deterministic Document ID for enforcing exactly 1 response per survey per Google account
 */
export function getSurveyResponseDocId(surveyId: string, uid: string): string {
  const safeSurveyId = (surveyId || DEFAULT_SURVEY_ID).trim();
  const safeUid = (uid || "").trim();
  return `${safeSurveyId}_${safeUid}`;
}

export type RespondentRole = "student" | "parent" | "teacher" | "advocate" | "other";

export interface SurveyResponseDoc {
  id: string;
  surveyId: string;
  surveyTitle?: string;
  uid?: string;
  name: string;
  email: string;
  phone: string;
  role: RespondentRole;
  answers: Record<string, string | string[] | number>;
  consentGiven: boolean;
  consentAt?: string;
  submittedAt: string;
  createdAt?: any;
  demo?: boolean;
  isAnonymous?: boolean;
}

/**
 * Normalizes any survey response document (both legacy pre-Google-auth docs and new verified docs)
 * preventing crashes on missing or polymorphic fields.
 */
export function normalizeSurveyResponse(data: any, docId: string, surveyTitleMap?: Record<string, string>): SurveyResponseDoc {
  const safeData = data || {};

  // Normalize Name
  const name = (
    safeData.name ||
    safeData.respondentName ||
    (safeData.isAnonymous ? "Anonymous Participant" : "") ||
    "Participant"
  ).trim();

  // Normalize Email
  const email = (safeData.email || "").trim();

  // Normalize Phone / Contact
  const phone = (safeData.phone || safeData.contactInfo || "").trim();

  // Normalize Role
  let role: RespondentRole = "other";
  const rawRole = (safeData.role || safeData.respondentRole || "").toLowerCase().trim();
  if (rawRole === "student" || rawRole === "parent" || rawRole === "teacher" || rawRole === "advocate") {
    role = rawRole as RespondentRole;
  }

  // Normalize Timestamp: handles Firestore Timestamp, ISO string, milliseconds number, or Date
  let submittedAt = "";
  if (safeData.submittedAt && typeof safeData.submittedAt === "string") {
    submittedAt = safeData.submittedAt;
  } else if (safeData.createdAt?.toDate && typeof safeData.createdAt.toDate === "function") {
    submittedAt = safeData.createdAt.toDate().toISOString();
  } else if (safeData.createdAt?.seconds) {
    submittedAt = new Date(safeData.createdAt.seconds * 1000).toISOString();
  } else if (safeData.consentAt && typeof safeData.consentAt === "string") {
    submittedAt = safeData.consentAt;
  } else {
    submittedAt = new Date().toISOString();
  }

  const surveyId = safeData.surveyId || DEFAULT_SURVEY_ID;
  const surveyTitle = surveyTitleMap?.[surveyId] || (
    surveyId === DEFAULT_SURVEY_ID
      ? "Patna School Accessibility Community Survey 2026"
      : surveyId
  );

  return {
    id: docId || safeData.id || `resp-${Date.now()}`,
    surveyId,
    surveyTitle,
    uid: safeData.uid || "",
    name,
    email,
    phone,
    role,
    answers: safeData.answers && typeof safeData.answers === "object" ? safeData.answers : {},
    consentGiven: safeData.consentGiven === true,
    consentAt: safeData.consentAt || submittedAt,
    submittedAt,
    createdAt: safeData.createdAt,
    demo: Boolean(safeData.demo),
    isAnonymous: Boolean(safeData.isAnonymous),
  };
}
