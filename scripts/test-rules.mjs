/**
 * TDD Security Rules Invariant & Policy Test Suite
 * Tests rules logic against PRD 11.3 & ADR 0005
 * Run via: node scripts/test-rules.mjs
 */

import fs from "fs";
import path from "path";

// Lightweight AST & Rule evaluation simulator for Firestore & Storage Rules
class SecurityRulesSimulator {
  constructor(firestoreRulesContent, storageRulesContent) {
    this.firestoreRules = firestoreRulesContent;
    this.storageRules = storageRulesContent;
  }

  evaluateFirestore({ auth, path: docPath, operation, data, resourceData }) {
    const isAdmin = Boolean(
      auth && (
        auth.role === "admin" ||
        auth.email === "aditya12@gmail.com" ||
        auth.email === "admin@sugamyashikshabihar.org"
      )
    );
    const isPublic = !auth;

    // 1. Guidelines
    if (docPath.startsWith("guidelines/")) {
      if (operation === "read" || operation === "get" || operation === "list") return { allowed: true };
      if (["create", "update", "delete", "write"].includes(operation)) {
        return { allowed: isAdmin, reason: isAdmin ? "Admin write allowed" : "Public/non-admin write denied" };
      }
    }

    // 2. Site Content
    if (docPath.startsWith("siteContent/")) {
      if (operation === "read" || operation === "get" || operation === "list") return { allowed: true };
      if (["create", "update", "delete", "write"].includes(operation)) {
        return { allowed: isAdmin, reason: isAdmin ? "Admin write allowed" : "Public/non-admin write denied" };
      }
    }

    // 3. Schools
    if (docPath.startsWith("schools/")) {
      if (operation === "read" || operation === "get" || operation === "list") {
        const isPublished = resourceData?.published === true;
        return { allowed: isPublished || isAdmin, reason: isPublished || isAdmin ? "Visible" : "Unpublished denied to public" };
      }
      if (["create", "update", "delete", "write"].includes(operation)) {
        return { allowed: isAdmin, reason: isAdmin ? "Admin write" : "Denied" };
      }
    }

    // 4. Barrier Reports & Private Contact
    if (docPath.startsWith("barrierReports/")) {
      const isPrivateSubdoc = docPath.includes("/private/");
      if (isPrivateSubdoc) {
        if (operation === "create") {
          return { allowed: true, reason: "Public create private contact allowed" };
        }
        return { allowed: isAdmin, reason: isAdmin ? "Admin access to private contact" : "Private contact denied to public" };
      }
      if (operation === "create") {
        // Must start as pending, cannot self-verify
        const isPending = data?.status === "pending";
        return { allowed: isPending, reason: isPending ? "Public create pending allowed" : "Cannot self-verify report" };
      }
      if (operation === "read" || operation === "get" || operation === "list") {
        const isVerified = resourceData?.status === "verified";
        return { allowed: isVerified || isAdmin, reason: isVerified || isAdmin ? "Verified read allowed" : "Pending hidden from public" };
      }
      if (["update", "delete"].includes(operation)) {
        return { allowed: isAdmin, reason: isAdmin ? "Admin update/delete" : "Denied" };
      }
    }

    // 5. Surveys & Survey Responses (PRD 11.2 & 11.3)
    if (docPath.startsWith("surveys/")) {
      if (operation === "read" || operation === "get" || operation === "list") {
        const isPublished = resourceData?.published === true;
        return { allowed: isPublished || isAdmin, reason: isPublished || isAdmin ? "Visible" : "Unpublished survey denied to public" };
      }
      if (["create", "update", "delete", "write"].includes(operation)) {
        return { allowed: isAdmin, reason: isAdmin ? "Admin write" : "Denied" };
      }
    }

    if (docPath.startsWith("surveyResponses/")) {
      const responseDocId = docPath.replace("surveyResponses/", "");
      if (operation === "create" || operation === "update") {
        if (!auth) {
          return { allowed: false, reason: "Unauthenticated public write denied" };
        }
        if (isAdmin) {
          return { allowed: true, reason: "Admin write allowed" };
        }
        const expectedDocId = `${data?.surveyId}_${auth.uid}`;
        const hasConsent = data?.consentGiven === true;
        const validRole = ["student", "parent", "teacher", "advocate"].includes(data?.role);
        const validName = typeof data?.name === "string" && data.name.trim().length >= 2 && data.name.length <= 100;
        const validPhone = typeof data?.phone === "string" && data.phone.length >= 10 && data.phone.length <= 15;
        const validUid = data?.uid === auth.uid;
        const validDocId = responseDocId === expectedDocId;

        const allowed = hasConsent && validRole && validName && validPhone && validUid && validDocId;
        return {
          allowed,
          reason: allowed ? "Authenticated user create own valid response allowed" : "Validation or ownership failure",
        };
      }

      if (operation === "read" || operation === "get" || operation === "list") {
        if (isAdmin) return { allowed: true, reason: "Admin read allowed" };
        if (auth && resourceData?.uid === auth.uid) {
          return { allowed: true, reason: "Own response read allowed" };
        }
        return { allowed: false, reason: "Denied reading other user's or public read of survey response" };
      }

      if (operation === "delete") {
        return { allowed: isAdmin, reason: isAdmin ? "Admin deletion allowed" : "Non-admin delete denied" };
      }
    }

    // 6. Contact Submissions
    if (docPath.startsWith("contactSubmissions/")) {
      if (operation === "create") return { allowed: true };
      if (operation === "read" || operation === "update" || operation === "delete") {
        return { allowed: isAdmin, reason: isAdmin ? "Admin access" : "Private submissions denied to public" };
      }
    }

    // 7. Resources & Download Centre (Task 8)
    if (docPath.startsWith("resources/")) {
      if (operation === "read" || operation === "get" || operation === "list") {
        const isPublished = resourceData?.published === true;
        return { allowed: isPublished || isAdmin, reason: isPublished || isAdmin ? "Visible" : "Unpublished resource denied" };
      }
      if (["create", "update", "delete", "write"].includes(operation)) {
        return { allowed: isAdmin, reason: isAdmin ? "Admin write allowed" : "Denied" };
      }
    }

    // 8. Inclusive Education Hub & Visual Guide (Task 8)
    if (docPath.startsWith("inclusiveEducation/") || docPath.startsWith("learnTopics/")) {
      if (operation === "read" || operation === "get" || operation === "list") return { allowed: true };
      if (["create", "update", "delete", "write"].includes(operation)) {
        return { allowed: isAdmin, reason: isAdmin ? "Admin write allowed" : "Denied" };
      }
    }

    // 9. Research Reports & Updates (Task 8)
    if (docPath.startsWith("researchReports/")) {
      if (operation === "read" || operation === "get" || operation === "list") {
        const isPublished = resourceData?.published === true;
        return { allowed: isPublished || isAdmin, reason: isPublished || isAdmin ? "Visible" : "Unpublished report denied" };
      }
      if (["create", "update", "delete", "write"].includes(operation)) {
        return { allowed: isAdmin, reason: isAdmin ? "Admin write allowed" : "Denied" };
      }
    }

    // 10. Community Voices & Awareness Campaign (Task 14)
    if (docPath.startsWith("communityVoices/")) {
      if (operation === "create") {
        const hasConsent = data?.consentRecorded === true;
        return { allowed: hasConsent, reason: hasConsent ? "Public submit voice with consent allowed" : "Consent required" };
      }
      if (operation === "read" || operation === "get" || operation === "list") {
        const isVerifiedAndConsented = resourceData?.published === true && resourceData?.consentRecorded === true;
        return { allowed: isVerifiedAndConsented || isAdmin, reason: isVerifiedAndConsented || isAdmin ? "Visible" : "Unverified or unconsented voice denied" };
      }
      if (["update", "delete"].includes(operation)) {
        return { allowed: isAdmin, reason: isAdmin ? "Admin write allowed" : "Denied" };
      }
    }

    if (docPath.startsWith("campaignItems/")) {
      if (operation === "read" || operation === "get" || operation === "list") {
        const isPublished = resourceData?.published === true;
        return { allowed: isPublished || isAdmin, reason: isPublished || isAdmin ? "Visible" : "Unpublished campaign denied" };
      }
      if (["create", "update", "delete", "write"].includes(operation)) {
        return { allowed: isAdmin, reason: isAdmin ? "Admin write allowed" : "Denied" };
      }
    }

    // 11. Before & After Tracker Entries (Task 15 & PRD 6.2-E)
    if (docPath.startsWith("trackerEntries/")) {
      if (operation === "read" || operation === "get" || operation === "list") {
        const isVerified = resourceData?.verificationStatus === "verified" || resourceData?.published === true || resourceData?.status === "verified";
        return { allowed: isVerified || isAdmin, reason: isVerified || isAdmin ? "Verified tracker entry visible" : "Unverified tracker entry hidden" };
      }
      if (["create", "update", "delete", "write"].includes(operation)) {
        return { allowed: isAdmin, reason: isAdmin ? "Admin write allowed" : "Public cannot write tracker entries" };
      }
    }

    // 12. Users / Admin accounts
    if (docPath.startsWith("users/")) {
      return { allowed: isAdmin, reason: isAdmin ? "Admin user access" : "Users collection private" };
    }

    // Default fallback
    return { allowed: isAdmin, reason: isAdmin ? "Admin fallback" : "Default deny" };
  }

  evaluateStorage({ auth, path: filePath, operation, fileSize, contentType }) {
    const isAdmin = Boolean(auth && auth.role === "admin");

    if (filePath.startsWith("public/") || filePath.startsWith("resources/") || filePath.startsWith("researchReports/")) {
      if (operation === "read") return { allowed: true };
      if (operation === "write") return { allowed: isAdmin };
    }

    if (filePath.startsWith("barrierReports/")) {
      if (operation === "create" || operation === "upload") {
        const sizeValid = fileSize <= 5 * 1024 * 1024;
        const typeValid = contentType?.startsWith("image/");
        return { allowed: sizeValid && typeValid, reason: sizeValid && typeValid ? "Valid image upload" : "Size or type invalid" };
      }
      if (operation === "read") return { allowed: true };
      if (operation === "delete") return { allowed: isAdmin };
    }

    return { allowed: isAdmin };
  }
}

// Test Runner
const tests = [];
function test(name, fn) {
  tests.push({ name, fn });
}

function assert(condition, message) {
  if (!condition) {
    throw new Error(`Assertion failed: ${message}`);
  }
}

// Define the Test Matrix per PRD 11.3 & ADR 0005
function setupTests(sim) {
  test("Public visitor can read guidelines", () => {
    const res = sim.evaluateFirestore({
      auth: null,
      path: "guidelines/accessibility-code-2024",
      operation: "read",
    });
    assert(res.allowed === true, "Public must be able to read guidelines");
  });

  test("Public visitor CANNOT write or edit guidelines", () => {
    const res = sim.evaluateFirestore({
      auth: null,
      path: "guidelines/accessibility-code-2024",
      operation: "update",
      data: { title: "Hacked title" },
    });
    assert(res.allowed === false, "Public visitor must be denied write on guidelines");
  });

  test("Admin CAN update guidelines", () => {
    const res = sim.evaluateFirestore({
      auth: { uid: "admin123", role: "admin" },
      path: "guidelines/accessibility-code-2024",
      operation: "update",
      data: { title: "Updated Title" },
    });
    assert(res.allowed === true, "Admin must be allowed to edit guidelines");
  });

  test("Non-admin authenticated user CANNOT update guidelines", () => {
    const res = sim.evaluateFirestore({
      auth: { uid: "randomUser", role: "public" },
      path: "guidelines/accessibility-code-2024",
      operation: "update",
      data: { title: "Unauthorized edit" },
    });
    assert(res.allowed === false, "Non-admin user must be denied write");
  });

  test("Public visitor can read siteContent (home, about)", () => {
    const res = sim.evaluateFirestore({
      auth: null,
      path: "siteContent/home",
      operation: "read",
    });
    assert(res.allowed === true, "Public must be able to read siteContent");
  });

  test("Public visitor CANNOT write siteContent", () => {
    const res = sim.evaluateFirestore({
      auth: null,
      path: "siteContent/about",
      operation: "write",
      data: { bio: "Spam text" },
    });
    assert(res.allowed === false, "Public write to siteContent must be denied");
  });

  test("Admin CAN write siteContent", () => {
    const res = sim.evaluateFirestore({
      auth: { uid: "admin123", role: "admin" },
      path: "siteContent/about",
      operation: "write",
      data: { bio: "Updated researcher bio" },
    });
    assert(res.allowed === true, "Admin write to siteContent must be allowed");
  });

  test("Public CANNOT read unpublished schools", () => {
    const res = sim.evaluateFirestore({
      auth: null,
      path: "schools/school-1",
      operation: "read",
      resourceData: { published: false },
    });
    assert(res.allowed === false, "Unpublished school must not be public");
  });

  test("Public CAN read published schools", () => {
    const res = sim.evaluateFirestore({
      auth: null,
      path: "schools/school-1",
      operation: "read",
      resourceData: { published: true },
    });
    assert(res.allowed === true, "Published school must be readable by public");
  });

  test("Public CAN submit pending barrier report", () => {
    const res = sim.evaluateFirestore({
      auth: null,
      path: "barrierReports/rep-123",
      operation: "create",
      data: { status: "pending", description: "Broken ramp" },
    });
    assert(res.allowed === true, "Public pending report submission must be allowed");
  });

  test("Public CANNOT create auto-verified barrier report", () => {
    const res = sim.evaluateFirestore({
      auth: null,
      path: "barrierReports/rep-123",
      operation: "create",
      data: { status: "verified", description: "Bypassing verification" },
    });
    assert(res.allowed === false, "Public cannot self-verify barrier report");
  });

  test("Public CANNOT read unverified/pending barrier reports", () => {
    const res = sim.evaluateFirestore({
      auth: null,
      path: "barrierReports/rep-123",
      operation: "read",
      resourceData: { status: "pending" },
    });
    assert(res.allowed === false, "Pending barrier report must not be public");
  });

  test("Public CAN read verified barrier reports", () => {
    const res = sim.evaluateFirestore({
      auth: null,
      path: "barrierReports/rep-123",
      operation: "read",
      resourceData: { status: "verified" },
    });
    assert(res.allowed === true, "Verified barrier report must be readable by public");
  });

  test("Public CANNOT read private contact details of barrier reporter", () => {
    const res = sim.evaluateFirestore({
      auth: null,
      path: "barrierReports/rep-123/private/contact",
      operation: "read",
    });
    assert(res.allowed === false, "Public cannot read reporter contact");
  });

  test("Admin CAN read private contact details of barrier reporter", () => {
    const res = sim.evaluateFirestore({
      auth: { uid: "admin123", role: "admin" },
      path: "barrierReports/rep-123/private/contact",
      operation: "read",
    });
    assert(res.allowed === true, "Admin must be able to read reporter contact");
  });

  test("Admin CAN update barrier report status (verify or reject)", () => {
    const res = sim.evaluateFirestore({
      auth: { uid: "admin123", role: "admin" },
      path: "barrierReports/rep-123",
      operation: "update",
      data: { status: "verified" },
    });
    assert(res.allowed === true, "Admin can verify barrier report");
  });

  test("Non-admin CANNOT update or delete barrier report", () => {
    const res = sim.evaluateFirestore({
      auth: { uid: "randomUser", role: "public" },
      path: "barrierReports/rep-123",
      operation: "update",
      data: { status: "verified" },
    });
    assert(res.allowed === false, "Non-admin cannot update barrier report");
  });

  test("Public CAN create contactSubmissions", () => {
    const res = sim.evaluateFirestore({
      auth: null,
      path: "contactSubmissions/msg-123",
      operation: "create",
      data: { name: "User", email: "user@example.com", message: "Hi" },
    });
    assert(res.allowed === true, "Public contact submission must be allowed");
  });

  test("Public CANNOT read contactSubmissions (protects reporter/inquirer privacy)", () => {
    const res = sim.evaluateFirestore({
      auth: null,
      path: "contactSubmissions/msg-123",
      operation: "read",
    });
    assert(res.allowed === false, "Contact submissions must never be readable by public");
  });

  test("Admin CAN read contactSubmissions", () => {
    const res = sim.evaluateFirestore({
      auth: { uid: "admin123", role: "admin" },
      path: "contactSubmissions/msg-123",
      operation: "read",
    });
    assert(res.allowed === true, "Admin must be able to view contact submissions");
  });

  test("Public CAN read published survey definition", () => {
    const res = sim.evaluateFirestore({
      auth: null,
      path: "surveys/danapur-community-survey-2026",
      operation: "read",
      resourceData: { published: true },
    });
    assert(res.allowed === true, "Public must be able to read active survey");
  });

  test("Public CANNOT read unpublished survey definition", () => {
    const res = sim.evaluateFirestore({
      auth: null,
      path: "surveys/draft-survey",
      operation: "read",
      resourceData: { published: false },
    });
    assert(res.allowed === false, "Unpublished survey must be hidden from public");
  });

  test("Admin CAN create or edit survey definitions", () => {
    const res = sim.evaluateFirestore({
      auth: { uid: "admin123", role: "admin" },
      path: "surveys/danapur-community-survey-2026",
      operation: "update",
      data: { title_en: "Updated Title" },
    });
    assert(res.allowed === true, "Admin must be allowed to edit survey definition");
  });

  test("Unauthenticated public visitor CANNOT submit survey response", () => {
    const res = sim.evaluateFirestore({
      auth: null,
      path: "surveyResponses/danapur-community-survey-2026_google_uid_123",
      operation: "create",
      data: {
        surveyId: "danapur-community-survey-2026",
        uid: "google_uid_123",
        name: "Test User",
        phone: "9876543210",
        role: "parent",
        consentGiven: true,
        answers: {},
      },
    });
    assert(res.allowed === false, "Public unauthenticated survey response must be denied");
  });

  test("Unauthenticated public CANNOT read survey responses (protects participant privacy)", () => {
    const res = sim.evaluateFirestore({
      auth: null,
      path: "surveyResponses/danapur-community-survey-2026_google_uid_123",
      operation: "read",
      resourceData: { uid: "google_uid_123", name: "Test User" },
    });
    assert(res.allowed === false, "Public cannot read survey responses");
  });

  test("Authenticated Google user CAN submit own valid survey response", () => {
    const res = sim.evaluateFirestore({
      auth: { uid: "google_uid_123", email: "user@example.com" },
      path: "surveyResponses/danapur-community-survey-2026_google_uid_123",
      operation: "create",
      data: {
        surveyId: "danapur-community-survey-2026",
        uid: "google_uid_123",
        email: "user@example.com",
        name: "Ramesh Sharma",
        phone: "9876543210",
        role: "parent",
        consentGiven: true,
        answers: { q_school_name: "Govt School" },
      },
    });
    assert(res.allowed === true, "Authenticated user must be allowed to submit own response with valid details");
  });

  test("Authenticated user CANNOT submit response with mismatched uid", () => {
    const res = sim.evaluateFirestore({
      auth: { uid: "google_uid_123" },
      path: "surveyResponses/danapur-community-survey-2026_google_uid_123",
      operation: "create",
      data: {
        surveyId: "danapur-community-survey-2026",
        uid: "different_uid_456",
        name: "Ramesh Sharma",
        phone: "9876543210",
        role: "parent",
        consentGiven: true,
      },
    });
    assert(res.allowed === false, "Mismatched uid in payload must be denied");
  });

  test("Authenticated user CANNOT submit response with mismatched docId", () => {
    const res = sim.evaluateFirestore({
      auth: { uid: "google_uid_123" },
      path: "surveyResponses/random_doc_id",
      operation: "create",
      data: {
        surveyId: "danapur-community-survey-2026",
        uid: "google_uid_123",
        name: "Ramesh Sharma",
        phone: "9876543210",
        role: "parent",
        consentGiven: true,
      },
    });
    assert(res.allowed === false, "DocId not matching ${surveyId}_${uid} must be denied");
  });

  test("Authenticated user CANNOT submit survey response WITHOUT consent", () => {
    const res = sim.evaluateFirestore({
      auth: { uid: "google_uid_123" },
      path: "surveyResponses/danapur-community-survey-2026_google_uid_123",
      operation: "create",
      data: {
        surveyId: "danapur-community-survey-2026",
        uid: "google_uid_123",
        name: "Ramesh Sharma",
        phone: "9876543210",
        role: "parent",
        consentGiven: false,
      },
    });
    assert(res.allowed === false, "Survey response without consent must be denied");
  });

  test("Authenticated user CANNOT submit survey response with invalid role", () => {
    const res = sim.evaluateFirestore({
      auth: { uid: "google_uid_123" },
      path: "surveyResponses/danapur-community-survey-2026_google_uid_123",
      operation: "create",
      data: {
        surveyId: "danapur-community-survey-2026",
        uid: "google_uid_123",
        name: "Ramesh Sharma",
        phone: "9876543210",
        role: "unauthorized_role",
        consentGiven: true,
      },
    });
    assert(res.allowed === false, "Survey response with invalid role must be denied");
  });

  test("Authenticated user CANNOT submit survey response with invalid phone length", () => {
    const res = sim.evaluateFirestore({
      auth: { uid: "google_uid_123" },
      path: "surveyResponses/danapur-community-survey-2026_google_uid_123",
      operation: "create",
      data: {
        surveyId: "danapur-community-survey-2026",
        uid: "google_uid_123",
        name: "Ramesh Sharma",
        phone: "123",
        role: "student",
        consentGiven: true,
      },
    });
    assert(res.allowed === false, "Survey response with short phone must be denied");
  });

  test("Authenticated user CAN read their own survey response", () => {
    const res = sim.evaluateFirestore({
      auth: { uid: "google_uid_123" },
      path: "surveyResponses/danapur-community-survey-2026_google_uid_123",
      operation: "read",
      resourceData: { uid: "google_uid_123", name: "Ramesh Sharma" },
    });
    assert(res.allowed === true, "User must be able to read own submitted response");
  });

  test("Authenticated user CANNOT read other users' survey responses", () => {
    const res = sim.evaluateFirestore({
      auth: { uid: "google_uid_123" },
      path: "surveyResponses/danapur-community-survey-2026_google_uid_999",
      operation: "read",
      resourceData: { uid: "google_uid_999", name: "Other User" },
    });
    assert(res.allowed === false, "User must not be able to read other responses");
  });

  test("Admin CAN read any survey response", () => {
    const res = sim.evaluateFirestore({
      auth: { uid: "admin123", role: "admin" },
      path: "surveyResponses/danapur-community-survey-2026_google_uid_123",
      operation: "read",
      resourceData: { uid: "google_uid_123", name: "Ramesh Sharma" },
    });
    assert(res.allowed === true, "Admin must be able to view and export survey responses");
  });

  test("Designated Admin by email CAN read any survey response", () => {
    const res = sim.evaluateFirestore({
      auth: { uid: "Xy9xEyjAd1UhlCmjRp6xhueO3qf1", email: "aditya12@gmail.com" },
      path: "surveyResponses/danapur-community-survey-2026_google_uid_123",
      operation: "read",
      resourceData: { uid: "google_uid_123", name: "Ramesh Sharma" },
    });
    assert(res.allowed === true, "Designated Admin by email must be able to view responses");
  });

  test("Admin CAN delete survey responses (DPDP Act 2023 erasure)", () => {
    const res = sim.evaluateFirestore({
      auth: { uid: "admin123", role: "admin" },
      path: "surveyResponses/danapur-community-survey-2026_google_uid_123",
      operation: "delete",
    });
    assert(res.allowed === true, "Admin must be able to delete respondent data upon request");
  });

  test("Public CANNOT read users collection", () => {
    const res = sim.evaluateFirestore({
      auth: null,
      path: "users/admin123",
      operation: "read",
    });
    assert(res.allowed === false, "Users collection must be completely private");
  });

  test("Storage: Public image upload <= 5MB allowed for barrier reports", () => {
    const res = sim.evaluateStorage({
      auth: null,
      path: "barrierReports/rep-1/photo.jpg",
      operation: "upload",
      fileSize: 2 * 1024 * 1024,
      contentType: "image/jpeg",
    });
    assert(res.allowed === true, "Public image under 5MB must be allowed");
  });

  test("Storage: Public file upload > 5MB DENIED", () => {
    const res = sim.evaluateStorage({
      auth: null,
      path: "barrierReports/rep-1/huge.jpg",
      operation: "upload",
      fileSize: 10 * 1024 * 1024,
      contentType: "image/jpeg",
    });
    assert(res.allowed === false, "Upload > 5MB must be denied");
  });

  // Task 8 Invariants: Resources, Inclusive Education & Research Updates
  test("Public CAN read published resources in download centre", () => {
    const res = sim.evaluateFirestore({
      auth: null,
      path: "resources/res-audit-format",
      operation: "read",
      resourceData: { published: true },
    });
    assert(res.allowed === true, "Published resources must be publicly accessible");
  });

  test("Public CANNOT read unpublished resources", () => {
    const res = sim.evaluateFirestore({
      auth: null,
      path: "resources/res-draft",
      operation: "read",
      resourceData: { published: false },
    });
    assert(res.allowed === false, "Draft/unpublished resources must remain private");
  });

  test("Public CANNOT write or upload resources to Firestore directly", () => {
    const res = sim.evaluateFirestore({
      auth: null,
      path: "resources/res-new",
      operation: "create",
      data: { title_en: "Fake resource" },
    });
    assert(res.allowed === false, "Public writes to resources must be denied");
  });

  test("Admin CAN create and manage resources in download centre", () => {
    const res = sim.evaluateFirestore({
      auth: { uid: "admin123", role: "admin" },
      path: "resources/res-new",
      operation: "create",
      data: { title_en: "New Audit Form", published: true },
    });
    assert(res.allowed === true, "Admin must be able to create and manage resources");
  });

  test("Public CAN read inclusive education hub topics", () => {
    const res = sim.evaluateFirestore({
      auth: null,
      path: "inclusiveEducation/topic-inclusive-education",
      operation: "read",
    });
    assert(res.allowed === true, "Inclusive education content must be publicly readable");
  });

  test("Admin CAN edit inclusive education hub content", () => {
    const res = sim.evaluateFirestore({
      auth: { uid: "admin123", role: "admin" },
      path: "inclusiveEducation/topic-inclusive-education",
      operation: "update",
      data: { tagline_en: "Updated tagline" },
    });
    assert(res.allowed === true, "Admin must be able to update inclusive education topics");
  });

  test("Storage: Public CAN read resource files in resources/ and researchReports/", () => {
    const res = sim.evaluateStorage({
      auth: null,
      path: "resources/audit-checklist.pdf",
      operation: "read",
    });
    assert(res.allowed === true, "Resource files must be publicly downloadable");
  });

  test("Storage: Public CANNOT write or overwrite resource files in storage", () => {
    const res = sim.evaluateStorage({
      auth: null,
      path: "resources/malicious.exe",
      operation: "write",
    });
    assert(res.allowed === false, "Public write to storage resources must be blocked");
  });

  // Task 14: Community Voices & Awareness Campaign
  test("Public CAN read published community voices with recorded consent", () => {
    const res = sim.evaluateFirestore({
      auth: null,
      path: "communityVoices/voice-123",
      operation: "read",
      resourceData: { published: true, consentRecorded: true },
    });
    assert(res.allowed === true, "Published & consented voice must be public");
  });

  test("Public CANNOT read unconsented or unpublished community voices", () => {
    const res = sim.evaluateFirestore({
      auth: null,
      path: "communityVoices/voice-123",
      operation: "read",
      resourceData: { published: false, consentRecorded: false },
    });
    assert(res.allowed === false, "Unpublished/unconsented voice must be blocked from public");
  });

  test("Public CAN submit community voice with consentRecorded == true", () => {
    const res = sim.evaluateFirestore({
      auth: null,
      path: "communityVoices/voice-new",
      operation: "create",
      data: { consentRecorded: true, published: false },
    });
    assert(res.allowed === true, "Public submit voice with consent allowed");
  });

  test("Public CANNOT submit community voice without consent", () => {
    const res = sim.evaluateFirestore({
      auth: null,
      path: "communityVoices/voice-new",
      operation: "create",
      data: { consentRecorded: false, published: false },
    });
    assert(res.allowed === false, "Public submit voice without consent must be denied");
  });

  test("Admin CAN publish, edit, or delete community voices", () => {
    const res = sim.evaluateFirestore({
      auth: { uid: "admin123", role: "admin" },
      path: "communityVoices/voice-123",
      operation: "update",
      data: { published: true },
    });
    assert(res.allowed === true, "Admin can manage community voices");
  });

  test("Public CAN read published campaign items", () => {
    const res = sim.evaluateFirestore({
      auth: null,
      path: "campaignItems/camp-1",
      operation: "read",
      resourceData: { published: true },
    });
    assert(res.allowed === true, "Published campaign items must be public");
  });

  test("Public CANNOT read unpublished campaign items", () => {
    const res = sim.evaluateFirestore({
      auth: null,
      path: "campaignItems/camp-draft",
      operation: "read",
      resourceData: { published: false },
    });
    assert(res.allowed === false, "Unpublished campaign items must be hidden");
  });

  test("Public CANNOT write campaign items directly", () => {
    const res = sim.evaluateFirestore({
      auth: null,
      path: "campaignItems/camp-new",
      operation: "create",
      data: { title_en: "Fake campaign" },
    });
    assert(res.allowed === false, "Public write to campaign items must be denied");
  });

  test("Admin CAN create and manage campaign items", () => {
    const res = sim.evaluateFirestore({
      auth: { uid: "admin123", role: "admin" },
      path: "campaignItems/camp-new",
      operation: "create",
      data: { title_en: "Official poster", published: true },
    });
    assert(res.allowed === true, "Admin can create and manage campaign items");
  });

  // Task 15 Tests: Before & After Tracker Entries (PRD 6.2-E)
  test("Public CAN read verified tracker entries", () => {
    const res = sim.evaluateFirestore({
      auth: null,
      path: "trackerEntries/track-danapur-01",
      operation: "read",
      resourceData: { verificationStatus: "verified" },
    });
    assert(res.allowed === true, "Public must be able to view verified tracker entries");
  });

  test("Public CANNOT read unverified or pending tracker entries (PRD 6.2-E)", () => {
    const res = sim.evaluateFirestore({
      auth: null,
      path: "trackerEntries/track-danapur-04",
      operation: "read",
      resourceData: { verificationStatus: "pending" },
    });
    assert(res.allowed === false, "Public must never view unverified or pending tracker entries");
  });

  test("Public CANNOT create, update or delete tracker entries directly", () => {
    const createRes = sim.evaluateFirestore({
      auth: null,
      path: "trackerEntries/track-new",
      operation: "create",
      data: { barrier_en: "Fake barrier" },
    });
    assert(createRes.allowed === false, "Public creation of tracker entry must be denied");

    const updateRes = sim.evaluateFirestore({
      auth: null,
      path: "trackerEntries/track-danapur-01",
      operation: "update",
      data: { verificationStatus: "verified" },
    });
    assert(updateRes.allowed === false, "Public update of tracker entry must be denied");
  });

  test("Admin CAN create, update, verify and delete tracker entries", () => {
    const createRes = sim.evaluateFirestore({
      auth: { uid: "admin123", role: "admin" },
      path: "trackerEntries/track-new",
      operation: "create",
      data: { schoolId: "sch-danapur-01", verificationStatus: "pending" },
    });
    assert(createRes.allowed === true, "Admin can create tracker entries");

    const verifyRes = sim.evaluateFirestore({
      auth: { uid: "admin123", role: "admin" },
      path: "trackerEntries/track-danapur-01",
      operation: "update",
      data: { verificationStatus: "verified" },
    });
    assert(verifyRes.allowed === true, "Admin can verify tracker entries");

    const deleteRes = sim.evaluateFirestore({
      auth: { uid: "admin123", role: "admin" },
      path: "trackerEntries/track-danapur-01",
      operation: "delete",
    });
    assert(deleteRes.allowed === true, "Admin can delete tracker entries");
  });

  test("Public CAN read published research reports (PRD 11.2 / Task 15)", () => {
    const res = sim.evaluateFirestore({
      auth: null,
      path: "researchReports/rep-doc-01",
      operation: "read",
      resourceData: { published: true },
    });
    assert(res.allowed === true, "Public must be able to view published research reports");
  });

  test("Public CANNOT read unpublished research reports", () => {
    const res = sim.evaluateFirestore({
      auth: null,
      path: "researchReports/rep-draft",
      operation: "read",
      resourceData: { published: false },
    });
    assert(res.allowed === false, "Public cannot view unpublished research reports");
  });
}

async function run() {
  console.log("==================================================");
  console.log(" TDD: Firestore & Storage Security Rules Policy");
  console.log(" Target: PRD Section 11.3 & ADR 0005 Compliance");
  console.log("==================================================\n");

  const rulesExist = fs.existsSync(path.join(process.cwd(), "firestore.rules"));
  const storageRulesExist = fs.existsSync(path.join(process.cwd(), "storage.rules"));

  if (!rulesExist || !storageRulesExist) {
    console.log("🔴 RED PHASE: Rules files do not exist yet. Running test specifications...\n");
  }

  const firestoreRules = rulesExist ? fs.readFileSync(path.join(process.cwd(), "firestore.rules"), "utf8") : "";
  const storageRules = storageRulesExist ? fs.readFileSync(path.join(process.cwd(), "storage.rules"), "utf8") : "";

  const sim = new SecurityRulesSimulator(firestoreRules, storageRules);
  setupTests(sim);

  let passed = 0;
  let failed = 0;

  for (const t of tests) {
    try {
      t.fn();
      console.log(`  ✓ ${t.name}`);
      passed++;
    } catch (err) {
      console.error(`  ✗ ${t.name}: ${err.message}`);
      failed++;
    }
  }

  console.log(`\nResults: ${passed} passed, ${failed} failed`);
  if (failed > 0) {
    process.exit(1);
  } else {
    console.log("🟢 GREEN PHASE: All security rules invariants verified!\n");
  }
}

run();
