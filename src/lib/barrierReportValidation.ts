// src/lib/barrierReportValidation.ts
// Pure functional seam for Barrier Report submission validation
// Follows PRD Section 6.1 item 11, Section 10, Section 11.2 & ADR 0005

export type BarrierCategory =
  | "ramp"
  | "entrance"
  | "toilet"
  | "classroom"
  | "pathway"
  | "drinkingWater"
  | "signage"
  | "emergencyExit"
  | "other";

export interface BarrierPhoto {
  name: string;
  url: string;
  sizeBytes?: number;
  type?: string;
}

export interface ReporterContact {
  name?: string;
  phone?: string;
  email?: string;
  role?: "student" | "parent" | "teacher" | "resident" | "advocate" | "other";
}

export interface BarrierReportInput {
  schoolId?: string;
  schoolName: string;
  category: BarrierCategory;
  description: string;
  photos?: BarrierPhoto[];
  reporterContact?: ReporterContact;
  consentResearch: boolean;
  consentNoFaces: boolean;
  consentModeration: boolean;
  honeypot?: string;
  submissionTimestamp?: number;
}

export interface SanitizedBarrierReport {
  schoolId?: string;
  schoolName: string;
  category: BarrierCategory;
  description: string;
  photos: Array<{ name: string; url: string }>;
  hasContact: boolean;
  status: "pending";
  createdAt: string;
  reporterContact?: never; // Type-level guarantee that reporter contact is never in public report
}

export interface BarrierValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
  sanitizedReport?: SanitizedBarrierReport;
  sanitizedContact?: ReporterContact;
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_REGEX = /^[6-9]\d{9}$/;
const MAX_PHOTO_SIZE = 5 * 1024 * 1024; // 5 MB per photo
const ALLOWED_MIME_TYPES = ["image/jpeg", "image/png", "image/webp", "image/jpg"];

/**
 * Validates a barrier report submission against research ethics, privacy constraints,
 * and security policies. Returns sanitized models separating public data from private contact.
 */
export function validateBarrierReport(
  input: BarrierReportInput,
  now = Date.now()
): BarrierValidationResult {
  const errors: Record<string, string> = {};

  // 1. Anti-spam bot honeypot
  if (input.honeypot && input.honeypot.trim().length > 0) {
    errors.honeypot = "Automated bot submission detected.";
  }

  // 2. Submission timing check (must take >= 2000ms from form mount)
  if (input.submissionTimestamp && now - input.submissionTimestamp < 2000) {
    errors.timing = "Submission completed suspiciously fast. Please take time to review your report.";
  }

  // 3. School Name (Select or free-text)
  const trimmedSchool = (input.schoolName || "").trim();
  if (trimmedSchool.length < 3) {
    errors.schoolName = "कृपया विद्यालय का नाम दर्ज करें / Please provide a valid school name (at least 3 characters).";
  }

  // 4. Category
  const validCategories: BarrierCategory[] = [
    "ramp",
    "entrance",
    "toilet",
    "classroom",
    "pathway",
    "drinkingWater",
    "signage",
    "emergencyExit",
    "other",
  ];
  if (!input.category || !validCategories.includes(input.category)) {
    errors.category = "कृपया बाधा की श्रेणी चुनें / Please select a valid barrier category.";
  }

  // 5. Description (detailed observation >= 15 characters)
  const trimmedDesc = (input.description || "").trim();
  if (trimmedDesc.length < 15) {
    errors.description = "कृपया समस्या का विस्तृत विवरण दें (कम से कम 15 अक्षर) / Please describe the barrier in detail (minimum 15 characters).";
  }

  // 6. Mandatory 3-Clause Consent
  if (!input.consentResearch) {
    errors.consentResearch = "शोध उपयोग सहमति अनिवार्य है / Research consent is required.";
  }
  if (!input.consentNoFaces) {
    errors.consentNoFaces = "बच्चों की गोपनीयता सहमति अनिवार्य है / Child privacy confirmation is required.";
  }
  if (!input.consentModeration) {
    errors.consentModeration = "सत्यापन एवं मॉडरेशन की सहमति अनिवार्य है / Moderation agreement is required.";
  }

  // 7. Photo limits and MIME validation
  const cleanPhotos: Array<{ name: string; url: string }> = [];
  if (input.photos && input.photos.length > 0) {
    if (input.photos.length > 3) {
      errors.photos = "अधिकतम 3 तस्वीरें ही अपलोड की जा सकती हैं / Maximum 3 photos allowed.";
    }

    for (const photo of input.photos) {
      if (photo.sizeBytes && photo.sizeBytes > MAX_PHOTO_SIZE) {
        errors.photos = `तस्वीर का आकार 5MB से कम होना चाहिए (${photo.name}) / Photo exceeds 5MB limit.`;
        break;
      }
      if (photo.type && !ALLOWED_MIME_TYPES.includes(photo.type.toLowerCase())) {
        errors.photos = `अमान्य प्रारूप। केवल JPG, PNG, WEBP मान्य हैं (${photo.name}) / Invalid image type.`;
        break;
      }
      cleanPhotos.push({
        name: photo.name,
        url: photo.url,
      });
    }
  }

  // 8. Optional Reporter Contact details
  let sanitizedContact: ReporterContact | undefined = undefined;
  let hasContact = false;

  if (input.reporterContact) {
    const { name, phone, email, role } = input.reporterContact;
    const cleanName = (name || "").trim();
    const cleanPhone = (phone || "").trim().replace(/[\s-]/g, "");
    const cleanEmail = (email || "").trim();

    if (cleanEmail.length > 0) {
      if (!EMAIL_REGEX.test(cleanEmail)) {
        errors.email = "अमान्य ईमेल पता / Please enter a valid email address.";
      }
    }

    if (cleanPhone.length > 0) {
      if (!PHONE_REGEX.test(cleanPhone)) {
        errors.phone = "कृपया 10 अंकों का वैध मोबाइल नंबर दर्ज करें / Please enter a valid 10-digit mobile number.";
      }
    }

    if (cleanName.length > 0 || cleanPhone.length > 0 || cleanEmail.length > 0) {
      hasContact = true;
      sanitizedContact = {
        name: cleanName || undefined,
        phone: cleanPhone || undefined,
        email: cleanEmail || undefined,
        role: role || "other",
      };
    }
  }

  const isValid = Object.keys(errors).length === 0;

  if (!isValid) {
    return {
      isValid: false,
      errors,
    };
  }

  const sanitizedReport: SanitizedBarrierReport = {
    schoolId: input.schoolId || undefined,
    schoolName: trimmedSchool,
    category: input.category,
    description: trimmedDesc,
    photos: cleanPhotos,
    hasContact,
    status: "pending",
    createdAt: new Date().toISOString(),
  };

  return {
    isValid: true,
    errors: {},
    sanitizedReport,
    sanitizedContact,
  };
}
