/**
 * Survey Validation & Respondent Details Sanitizer
 * Implements validation for Google-authenticated survey responses
 * Target: Change Request 2026-10-17 & India's DPDP Act 2023
 */

export type RespondentRole = "student" | "parent" | "teacher" | "advocate";

export interface ValidationResult<T = string> {
  isValid: boolean;
  error?: string;
  sanitized?: T;
}

/**
 * Validates and normalizes Indian mobile numbers
 * Accepts:
 * - 10-digit mobile starting with 6, 7, 8, 9 (e.g., 9876543210)
 * - Country code +91 / 91 with optional spaces/hyphens (e.g., +91 9876543210, +91-98765-43210)
 * - Leading 0 (e.g., 09876543210)
 * Returns normalized 10-digit mobile number or error message.
 */
export function validateIndianPhoneNumber(phone: string): ValidationResult<string> {
  if (!phone || typeof phone !== "string") {
    return {
      isValid: false,
      error: "Contact number is required / संपर्क नंबर आवश्यक है।",
    };
  }

  // Strip spaces, dashes, parentheses
  const cleaned = phone.replace(/[\s\-\(\)]/g, "").trim();

  // Pattern matching:
  // Optional +91 or 91 or 0 prefix, followed by 10 digits starting with 6-9
  const indianMobileRegex = /^(?:\+91|91|0)?([6-9]\d{9})$/;
  const match = cleaned.match(indianMobileRegex);

  if (!match) {
    return {
      isValid: false,
      error: "Please enter a valid 10-digit Indian mobile number (e.g. 9876543210) / कृपया एक मान्य 10-अंकीय भारतीय मोबाइल नंबर दर्ज करें।",
    };
  }

  const tenDigit = match[1];
  return {
    isValid: true,
    sanitized: tenDigit,
  };
}

/**
 * Validates respondent full name
 * Length must be between 2 and 100 characters after trimming
 */
export function validateRespondentName(name: string): ValidationResult<string> {
  if (!name || typeof name !== "string") {
    return {
      isValid: false,
      error: "Full name is required / पूरा नाम आवश्यक है।",
    };
  }

  const trimmed = name.trim();
  if (trimmed.length < 2) {
    return {
      isValid: false,
      error: "Name must be at least 2 characters / नाम कम से कम 2 अक्षरों का होना चाहिए।",
    };
  }

  if (trimmed.length > 100) {
    return {
      isValid: false,
      error: "Name cannot exceed 100 characters / नाम 100 अक्षरों से अधिक नहीं हो सकता।",
    };
  }

  return {
    isValid: true,
    sanitized: trimmed,
  };
}

/**
 * Validates confirmed respondent role
 * Strictly one of: student, parent, teacher, advocate
 */
export function validateRespondentRole(role: string): ValidationResult<RespondentRole> {
  const allowedRoles: RespondentRole[] = ["student", "parent", "teacher", "advocate"];
  if (!role || !allowedRoles.includes(role as RespondentRole)) {
    return {
      isValid: false,
      error: "Please select your role (Student, Parent, Teacher, or Advocate) / कृपया अपनी भूमिका चुनें।",
    };
  }

  return {
    isValid: true,
    sanitized: role as RespondentRole,
  };
}

/**
 * Validates research consent checkbox
 */
export function validateSurveyConsent(consentGiven: boolean): ValidationResult<boolean> {
  if (consentGiven !== true) {
    return {
      isValid: false,
      error: "You must agree to the research privacy and data storage terms / आपको शोध गोपनीयता एवं डेटा भंडारण शर्तों से सहमत होना आवश्यक है।",
    };
  }

  return {
    isValid: true,
    sanitized: true,
  };
}

export interface SurveyPayloadInput {
  surveyId: string;
  uid: string;
  email: string;
  name: string;
  phone: string;
  role: string;
  answers: Record<string, any>;
  consentGiven: boolean;
}

export interface SanitizedSurveyPayload {
  surveyId: string;
  uid: string;
  email: string;
  name: string;
  phone: string;
  role: RespondentRole;
  answers: Record<string, any>;
  consentGiven: true;
  consentAt: string;
  docId: string;
}

/**
 * Validates and sanitizes complete survey response payload
 */
export function validateSurveyResponsePayload(input: SurveyPayloadInput): {
  isValid: boolean;
  errors: Record<string, string>;
  sanitized?: SanitizedSurveyPayload;
} {
  const errors: Record<string, string> = {};

  if (!input.surveyId || typeof input.surveyId !== "string") {
    errors.surveyId = "Survey ID is missing.";
  }

  if (!input.uid || typeof input.uid !== "string") {
    errors.uid = "Authentication required: please sign in with Google / कृपया गूगल से साइन इन करें।";
  }

  if (!input.email || !input.email.includes("@")) {
    errors.email = "Valid Google account email is required.";
  }

  const nameVal = validateRespondentName(input.name);
  if (!nameVal.isValid) {
    errors.name = nameVal.error!;
  }

  const phoneVal = validateIndianPhoneNumber(input.phone);
  if (!phoneVal.isValid) {
    errors.phone = phoneVal.error!;
  }

  const roleVal = validateRespondentRole(input.role);
  if (!roleVal.isValid) {
    errors.role = roleVal.error!;
  }

  const consentVal = validateSurveyConsent(input.consentGiven);
  if (!consentVal.isValid) {
    errors.consent = consentVal.error!;
  }

  if (Object.keys(errors).length > 0) {
    return {
      isValid: false,
      errors,
    };
  }

  const docId = `${input.surveyId}_${input.uid}`;

  return {
    isValid: true,
    errors: {},
    sanitized: {
      surveyId: input.surveyId,
      uid: input.uid,
      email: input.email.toLowerCase().trim(),
      name: nameVal.sanitized!,
      phone: phoneVal.sanitized!,
      role: roleVal.sanitized!,
      answers: input.answers || {},
      consentGiven: true,
      consentAt: new Date().toISOString(),
      docId,
    },
  };
}
