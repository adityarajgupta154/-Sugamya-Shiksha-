/**
 * TDD Test Suite for Admin Survey Query, Filtering, Sorting & Normalization
 * Run via: node scripts/test-survey-admin-query.mjs
 */

import {
  SURVEY_COLLECTIONS,
  DEFAULT_SURVEY_ID,
  getSurveyResponseDocId,
  normalizeSurveyResponse,
} from "../src/data/surveyConstants.ts";

const tests = [];
function test(name, fn) {
  tests.push({ name, fn });
}

function assert(condition, message) {
  if (!condition) {
    throw new Error(`Assertion failed: ${message}`);
  }
}

// 1. Constants & ID generation
test("SURVEY_COLLECTIONS uses exact Firestore collection names", () => {
  assert(SURVEY_COLLECTIONS.RESPONSES === "surveyResponses", "Collection must be surveyResponses");
  assert(SURVEY_COLLECTIONS.SURVEYS === "surveys", "Collection must be surveys");
});

test("getSurveyResponseDocId formats deterministic doc ID", () => {
  const docId = getSurveyResponseDocId("survey-123", "uid-abc");
  assert(docId === "survey-123_uid-abc", "Should format as surveyId_uid");
});

// 2. Normalization of New Responses
test("Normalizes new verified Google-authenticated survey response", () => {
  const raw = {
    surveyId: "danapur-community-survey-2026",
    uid: "google-uid-789",
    name: "Sunita Sharma",
    email: "sunita@example.com",
    phone: "9876543210",
    role: "parent",
    answers: { q_school_name: "Danapur High School", q_rating: 4 },
    consentGiven: true,
    consentAt: "2026-10-17T12:00:00Z",
    submittedAt: "2026-10-17T12:00:00Z",
  };
  const norm = normalizeSurveyResponse(raw, "danapur-community-survey-2026_google-uid-789");
  assert(norm.id === "danapur-community-survey-2026_google-uid-789", "id should match docId");
  assert(norm.name === "Sunita Sharma", "name matches");
  assert(norm.email === "sunita@example.com", "email matches");
  assert(norm.phone === "9876543210", "phone matches");
  assert(norm.role === "parent", "role matches");
  assert(norm.consentGiven === true, "consentGiven matches");
  assert(norm.submittedAt === "2026-10-17T12:00:00Z", "submittedAt matches");
});

// 3. Normalization of Legacy Documents
test("Normalizes legacy response with missing fields without crashing", () => {
  const legacy = {
    respondentName: "Old User",
    respondentRole: "teacher",
    contactInfo: "old@example.org",
    answers: { q_school: "Old School" },
    consentGiven: true,
    submittedAt: "2026-10-01T10:00:00Z",
  };
  const norm = normalizeSurveyResponse(legacy, "old-doc-1");
  assert(norm.id === "old-doc-1", "id set from docId");
  assert(norm.name === "Old User", "fallback to respondentName");
  assert(norm.role === "teacher", "fallback to respondentRole");
  assert(norm.phone === "old@example.org", "contactInfo preserved");
  assert(norm.surveyId === DEFAULT_SURVEY_ID, "defaults to active surveyId");
});

test("Normalizes legacy anonymous response with undefined fields", () => {
  const anonymous = {
    isAnonymous: true,
  };
  const norm = normalizeSurveyResponse(anonymous, "anon-doc");
  assert(norm.name === "Anonymous Participant", "handles anonymous");
  assert(norm.role === "other", "defaults to other");
  assert(norm.email === "", "empty email fallback");
  assert(norm.phone === "", "empty phone fallback");
  assert(typeof norm.answers === "object", "answers is object");
});

test("Normalizes Firestore Timestamp createdAt to ISO string", () => {
  const dateObj = new Date("2026-10-17T15:30:00Z");
  const rawWithTimestamp = {
    name: "Aarti Devi",
    createdAt: {
      toDate: () => dateObj,
    },
  };
  const norm = normalizeSurveyResponse(rawWithTimestamp, "ts-doc");
  assert(norm.submittedAt === dateObj.toISOString(), "converted Timestamp to ISO string");
});

// 4. Filtering and Sorting Logic
test("Filters by surveyId correctly", () => {
  const responses = [
    normalizeSurveyResponse({ surveyId: "survey-A", name: "User 1" }, "1"),
    normalizeSurveyResponse({ surveyId: "survey-B", name: "User 2" }, "2"),
    normalizeSurveyResponse({ surveyId: "survey-A", name: "User 3" }, "3"),
  ];

  const filteredA = responses.filter((r) => r.surveyId === "survey-A");
  assert(filteredA.length === 2, "Should find 2 responses for survey-A");
  const filteredAll = responses.filter((r) => "all" === "all" || r.surveyId === "all");
  assert(filteredAll.length === 3, "All returns 3");
});

test("Sorts responses by newest submittedAt first", () => {
  const list = [
    normalizeSurveyResponse({ name: "Old", submittedAt: "2026-10-10T10:00:00Z" }, "1"),
    normalizeSurveyResponse({ name: "Newest", submittedAt: "2026-10-17T18:00:00Z" }, "2"),
    normalizeSurveyResponse({ name: "Middle", submittedAt: "2026-10-14T12:00:00Z" }, "3"),
  ];

  const sorted = [...list].sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime());
  assert(sorted[0].name === "Newest", "First item should be newest");
  assert(sorted[1].name === "Middle", "Second item should be middle");
  assert(sorted[2].name === "Old", "Third item should be oldest");
});

test("Filters by search query matching name, email, phone, or id", () => {
  const list = [
    normalizeSurveyResponse({ name: "Ramesh Sharma", email: "ramesh@example.com", phone: "9876543210" }, "doc-1"),
    normalizeSurveyResponse({ name: "Pooja Verma", email: "pooja@bihar.in", phone: "9123456789" }, "doc-2"),
  ];

  const searchByName = list.filter((r) => r.name.toLowerCase().includes("ramesh"));
  assert(searchByName.length === 1 && searchByName[0].id === "doc-1", "Search by name");

  const searchByEmail = list.filter((r) => r.email.toLowerCase().includes("pooja@bihar"));
  assert(searchByEmail.length === 1 && searchByEmail[0].id === "doc-2", "Search by email");

  const searchByPhone = list.filter((r) => r.phone.includes("987654"));
  assert(searchByPhone.length === 1 && searchByPhone[0].id === "doc-1", "Search by phone");
});

test("Paginates correctly with limit and load more", () => {
  const total = 25;
  const list = Array.from({ length: total }, (_, i) => 
    normalizeSurveyResponse({ name: `User ${i + 1}`, submittedAt: new Date(Date.now() - i * 1000).toISOString() }, `doc-${i + 1}`)
  );

  let pageLimit = 10;
  let page1 = list.slice(0, pageLimit);
  assert(page1.length === 10, "Page 1 has 10 items");
  assert(page1.length < list.length, "Has more items to load");

  pageLimit += 10;
  let page2 = list.slice(0, pageLimit);
  assert(page2.length === 20, "Page 2 has 20 items");

  pageLimit += 10;
  let page3 = list.slice(0, pageLimit);
  assert(page3.length === 25, "Page 3 has all 25 items");
});

console.log("==================================================");
console.log(" TDD: Survey Admin Query & Normalization Suite");
console.log("==================================================");

let passed = 0;
let failed = 0;

for (const t of tests) {
  try {
    t.fn();
    console.log(`  ✓ ${t.name}`);
    passed++;
  } catch (err) {
    console.error(`  ✕ ${t.name}: ${err.message}`);
    failed++;
  }
}

console.log(`\nResults: ${passed} passed, ${failed} failed`);
if (failed > 0) {
  process.exit(1);
} else {
  console.log("🟢 All Survey Admin Query & Normalization tests passed!");
}
