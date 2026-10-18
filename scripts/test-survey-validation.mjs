/**
 * TDD Test Suite: Survey Respondent Details & Validation
 * Target: Change Request 2026-10-17 (Google Auth Survey Flow)
 * Run via: node scripts/test-survey-validation.mjs
 */

import {
  validateIndianPhoneNumber,
  validateRespondentName,
  validateRespondentRole,
  validateSurveyConsent,
  validateSurveyResponsePayload,
} from "../src/lib/surveyValidation.ts";

let passed = 0;
let failed = 0;

function assert(condition, message) {
  if (condition) {
    console.log(`  ✓ ${message}`);
    passed++;
  } else {
    console.error(`  ✗ FAIL: ${message}`);
    failed++;
  }
}

console.log("==================================================");
console.log(" TDD: Survey Validation & Respondent Details");
console.log("==================================================\n");

// 1. Phone number validation (Indian mobile)
console.log("Testing Indian Mobile Phone Validation:");
assert(validateIndianPhoneNumber("9876543210").isValid, "Accepts standard 10-digit mobile starting with 9");
assert(validateIndianPhoneNumber("8123456789").isValid, "Accepts standard 10-digit mobile starting with 8");
assert(validateIndianPhoneNumber("7000000000").isValid, "Accepts standard 10-digit mobile starting with 7");
assert(validateIndianPhoneNumber("6999999999").isValid, "Accepts standard 10-digit mobile starting with 6");
assert(validateIndianPhoneNumber("+91 9876543210").isValid, "Accepts mobile with +91 country code and space");
assert(validateIndianPhoneNumber("+91-98765-43210").isValid, "Accepts mobile with +91 country code and dashes");
assert(validateIndianPhoneNumber("09876543210").isValid, "Accepts mobile with leading 0");

assert(!validateIndianPhoneNumber("").isValid, "Rejects empty phone number");
assert(!validateIndianPhoneNumber("1234567890").isValid, "Rejects phone number not starting with 6, 7, 8, or 9");
assert(!validateIndianPhoneNumber("5999999999").isValid, "Rejects phone number starting with 5");
assert(!validateIndianPhoneNumber("98765").isValid, "Rejects phone number with fewer than 10 digits");
assert(!validateIndianPhoneNumber("98765432109876").isValid, "Rejects phone number with more than 10 digits without code");
assert(!validateIndianPhoneNumber("abcdefghij").isValid, "Rejects alphabetic phone number");

// 2. Full Name validation
console.log("\nTesting Respondent Name Validation:");
assert(validateRespondentName("Aditya Kumar").isValid, "Accepts valid full name");
assert(validateRespondentName("Amit Sen").isValid, "Accepts short two-word name");
assert(!validateRespondentName("").isValid, "Rejects empty name");
assert(!validateRespondentName("   ").isValid, "Rejects whitespace-only name");
assert(!validateRespondentName("A").isValid, "Rejects single character name (< 2 chars)");
assert(!validateRespondentName("a".repeat(101)).isValid, "Rejects name exceeding 100 characters");

// 3. Role validation
console.log("\nTesting Respondent Role Validation:");
assert(validateRespondentRole("student").isValid, "Accepts 'student' role");
assert(validateRespondentRole("parent").isValid, "Accepts 'parent' role");
assert(validateRespondentRole("teacher").isValid, "Accepts 'teacher' role");
assert(validateRespondentRole("advocate").isValid, "Accepts 'advocate' role");
assert(!validateRespondentRole("other").isValid, "Rejects unconfirmed 'other' role");
assert(!validateRespondentRole("admin").isValid, "Rejects unconfirmed 'admin' role");
assert(!validateRespondentRole("").isValid, "Rejects blank role");

// 4. Research Consent validation
console.log("\nTesting Mandatory Research Consent Validation:");
assert(validateSurveyConsent(true).isValid, "Accepts consentGiven == true");
assert(!validateSurveyConsent(false).isValid, "Rejects consentGiven == false");
assert(!validateSurveyConsent(null).isValid, "Rejects missing consent");

// 5. Full Payload Validation
console.log("\nTesting Full Survey Response Payload Validation:");
const validPayload = {
  surveyId: "danapur-community-survey-2026",
  uid: "google_uid_12345",
  email: "respondent@example.com",
  name: "Dr. Sunita Sharma",
  phone: "+91 98765 43210",
  role: "teacher",
  answers: {
    q_school_name: "Govt Middle School Danapur",
    q_school_type: "government",
  },
  consentGiven: true,
};

const resValid = validateSurveyResponsePayload(validPayload);
assert(resValid.isValid, "Accepts complete valid payload");
assert(resValid.sanitized?.phone === "9876543210", "Sanitizes phone number to standard 10 digits");
assert(resValid.sanitized?.docId === "danapur-community-survey-2026_google_uid_12345", "Derives deterministic docId (${surveyId}_${uid})");

const resMissingPhone = validateSurveyResponsePayload({ ...validPayload, phone: "" });
assert(!resMissingPhone.isValid && resMissingPhone.errors.phone, "Flags missing phone error");

const resMissingConsent = validateSurveyResponsePayload({ ...validPayload, consentGiven: false });
assert(!resMissingConsent.isValid && resMissingConsent.errors.consent, "Flags missing consent error");

const resMissingUid = validateSurveyResponsePayload({ ...validPayload, uid: "" });
assert(!resMissingUid.isValid && resMissingUid.errors.uid, "Flags missing Google auth uid error");

console.log(`\nResults: ${passed} passed, ${failed} failed`);
if (failed > 0) {
  process.exit(1);
} else {
  console.log("🟢 All Survey Validation tests passed!");
}
