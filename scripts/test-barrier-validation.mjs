// scripts/test-barrier-validation.mjs
// TDD Test Suite for Barrier Report Submission Validation
// Target: Task 13, PRD 6.1 item 11, Section 10 & 11.2

import assert from "node:assert";
import { validateBarrierReport } from "../src/lib/barrierReportValidation.ts";

console.log("==================================================");
console.log(" TDD: Barrier Report Submission Validation (Task 13)");
console.log("==================================================");

let passed = 0;
let failed = 0;

function test(name, fn) {
  try {
    fn();
    console.log(`  ✓ ${name}`);
    passed++;
  } catch (err) {
    console.error(`  ✕ ${name}`);
    console.error(`    ${err.message}`);
    failed++;
  }
}

const validBaseInput = {
  schoolId: "sch-danapur-01",
  schoolName: "राजकीय प्राथमिक विद्यालय, दानापुर",
  category: "ramp",
  description: "मुख्य भवन के प्रवेश द्वार पर रैंप की ढलान अत्यधिक तीव्र (लगभग 1:6) है और दोनों तरफ कोई रेलिंग नहीं है।",
  consentResearch: true,
  consentNoFaces: true,
  consentModeration: true,
  honeypot: "",
  submissionTimestamp: Date.now() - 5000, // 5 seconds ago
  photos: [
    { name: "ramp.jpg", url: "https://storage.googleapis.com/test/ramp.jpg", sizeBytes: 1024 * 1024, type: "image/jpeg" }
  ],
  reporterContact: {
    name: "सुनील कुमार",
    role: "parent",
    phone: "9876543210",
    email: "sunil@example.com"
  }
};

test("Valid barrier report with 3-clause consent passes and sanitizes data", () => {
  const res = validateBarrierReport(validBaseInput);
  assert.strictEqual(res.isValid, true, "Valid input must pass");
  assert.strictEqual(res.sanitizedReport.status, "pending", "Status must be pending");
  assert.strictEqual(res.sanitizedReport.hasContact, true, "hasContact must be true");
  assert.strictEqual(res.sanitizedReport.category, "ramp");
  assert.strictEqual(res.sanitizedContact.name, "सुनील कुमार");
});

test("Rejects submission when school name is missing or blank", () => {
  const invalid = { ...validBaseInput, schoolName: "   " };
  const res = validateBarrierReport(invalid);
  assert.strictEqual(res.isValid, false);
  assert.ok(res.errors.schoolName, "Should have schoolName error");
});

test("Rejects submission when description is less than 15 characters", () => {
  const invalid = { ...validBaseInput, description: "Ramp broken" };
  const res = validateBarrierReport(invalid);
  assert.strictEqual(res.isValid, false);
  assert.ok(res.errors.description, "Should flag short description");
});

test("Rejects submission when any of the 3 required consents is false", () => {
  const missingResearch = { ...validBaseInput, consentResearch: false };
  assert.strictEqual(validateBarrierReport(missingResearch).isValid, false);

  const missingNoFaces = { ...validBaseInput, consentNoFaces: false };
  assert.strictEqual(validateBarrierReport(missingNoFaces).isValid, false);

  const missingModeration = { ...validBaseInput, consentModeration: false };
  assert.strictEqual(validateBarrierReport(missingModeration).isValid, false);
});

test("Allows anonymous report with empty optional reporter contact", () => {
  const anonymousInput = {
    ...validBaseInput,
    reporterContact: { name: "", phone: "", email: "", role: "resident" }
  };
  const res = validateBarrierReport(anonymousInput);
  assert.strictEqual(res.isValid, true);
  assert.strictEqual(res.sanitizedReport.hasContact, false);
  assert.strictEqual(res.sanitizedContact, undefined);
});

test("Validates email format when optional email is provided", () => {
  const invalidEmail = {
    ...validBaseInput,
    reporterContact: { ...validBaseInput.reporterContact, email: "invalid-email-string" }
  };
  const res = validateBarrierReport(invalidEmail);
  assert.strictEqual(res.isValid, false);
  assert.ok(res.errors.email, "Should flag invalid email format");
});

test("Validates phone format (10-digit) when optional phone is provided", () => {
  const invalidPhone = {
    ...validBaseInput,
    reporterContact: { ...validBaseInput.reporterContact, phone: "12345" }
  };
  const res = validateBarrierReport(invalidPhone);
  assert.strictEqual(res.isValid, false);
  assert.ok(res.errors.phone, "Should flag invalid phone format");
});

test("Rejects bot submission when honeypot is filled", () => {
  const botInput = { ...validBaseInput, honeypot: "I am a spam bot" };
  const res = validateBarrierReport(botInput);
  assert.strictEqual(res.isValid, false);
  assert.ok(res.errors.honeypot);
});

test("Rejects rapid automated submission (< 2000ms duration)", () => {
  const rapidInput = { ...validBaseInput, submissionTimestamp: Date.now() - 500 };
  const res = validateBarrierReport(rapidInput);
  assert.strictEqual(res.isValid, false);
  assert.ok(res.errors.timing);
});

test("Rejects photo upload exceeding 5MB size limit", () => {
  const largePhotoInput = {
    ...validBaseInput,
    photos: [
      { name: "huge.jpg", url: "https://test.com/huge.jpg", sizeBytes: 6 * 1024 * 1024, type: "image/jpeg" }
    ]
  };
  const res = validateBarrierReport(largePhotoInput);
  assert.strictEqual(res.isValid, false);
  assert.ok(res.errors.photos);
});

test("Rejects photo upload with disallowed non-image MIME type", () => {
  const pdfInput = {
    ...validBaseInput,
    photos: [
      { name: "doc.pdf", url: "https://test.com/doc.pdf", sizeBytes: 50000, type: "application/pdf" }
    ]
  };
  const res = validateBarrierReport(pdfInput);
  assert.strictEqual(res.isValid, false);
  assert.ok(res.errors.photos);
});

test("Strict privacy: sanitizedReport never leaks reporter contact data", () => {
  const res = validateBarrierReport(validBaseInput);
  assert.strictEqual(res.isValid, true);
  assert.strictEqual(res.sanitizedReport.reporterContact, undefined, "reporterContact must not exist on public report object");
});

console.log(`\nResults: ${passed} passed, ${failed} failed`);
if (failed > 0) {
  process.exit(1);
}
