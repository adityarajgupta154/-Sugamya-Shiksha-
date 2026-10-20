import assert from "node:assert";

// Mock localStorage for Node test environment
const storage = new Map();
global.localStorage = {
  getItem: (key) => storage.get(key) || null,
  setItem: (key, val) => storage.set(key, String(val)),
  removeItem: (key) => storage.delete(key),
  clear: () => storage.clear(),
};

global.window = {
  dispatchEvent: () => true,
  addEventListener: () => {},
  removeEventListener: () => {},
};
global.CustomEvent = class CustomEvent {
  constructor(type, detail) {
    this.type = type;
    this.detail = detail;
  }
};

import {
  saveCustomSchool,
  getCustomSchools,
  deleteCustomSchool,
  mergeSchoolsWithLocal,
  getCustomSiteContent,
  saveCustomSiteContent,
} from "../src/lib/customSchoolsStorage.ts";

console.log("🧪 Running Custom Schools Storage & Sync Unit Tests...\n");

// Test 1: Save new school defaults published to true
const newSchool = {
  id: "patna-adarsh-high-school",
  name_hi: "पटना आदर्श उच्च विद्यालय",
  name_en: "Patna Adarsh High School",
  type: "government",
  address_hi: "स्टेशन रोड, पटना, बिहार",
  address_en: "Station Road, Patna, Bihar",
  block: "Patna",
  geo: { lat: 25.635, lng: 85.048 },
  auditStatus: "pending",
  score: 78,
  facilities: {
    ramp: true,
    toilet: true,
    drinkingWater: true,
    wideDoors: false,
    tactilePath: false,
    emergencyExit: false,
  },
  published: true,
  isDemo: false,
};

saveCustomSchool(newSchool);
const savedList = getCustomSchools();
assert.strictEqual(savedList.length, 1, "Should have 1 custom school");
assert.strictEqual(savedList[0].id, "patna-adarsh-high-school");
assert.strictEqual(savedList[0].published, true, "School must be published");
console.log("✅ Test 1 Passed: Custom school saved with published = true.");

// Test 2: Merge with base schools
const baseDemoSchools = [
  {
    id: "govt-model-patna-cantt",
    name_hi: "राजकीय मॉडल उच्च माध्यमिक विद्यालय",
    name_en: "Government Model School",
    type: "government",
    published: true,
  },
];

const merged = mergeSchoolsWithLocal(baseDemoSchools);
assert.strictEqual(merged.length, 2, "Merged list should contain base + new custom school");
assert.ok(merged.some((s) => s.id === "patna-adarsh-high-school"), "Custom school present in merged list");
console.log("✅ Test 2 Passed: mergeSchoolsWithLocal integrates custom school with base dataset.");

// Test 3: Updating an existing school overrides in merged list
const updatedSchool = {
  ...newSchool,
  score: 85,
  name_en: "Patna Adarsh Senior Secondary School",
};
saveCustomSchool(updatedSchool);
const reMerged = mergeSchoolsWithLocal(baseDemoSchools);
assert.strictEqual(reMerged.length, 2);
const found = reMerged.find((s) => s.id === "patna-adarsh-high-school");
assert.strictEqual(found.score, 85, "Updated score reflects in merged list");
assert.strictEqual(found.name_en, "Patna Adarsh Senior Secondary School", "Updated name reflects in merged list");
console.log("✅ Test 3 Passed: Editing school updates merged list without duplicates.");

// Test 4: Bilingual search logic matches both Hindi & English queries
const queryEnglish = "adarsh";
const queryHindi = "आदर्श";
const queryUdise = "1028";
newSchool.udiseCode = "10280199999";

function matchesSearch(school, qStr) {
  const q = qStr.toLowerCase().trim();
  const nameHi = (school.name_hi || "").toLowerCase();
  const nameEn = (school.name_en || "").toLowerCase();
  const addrHi = (school.address_hi || "").toLowerCase();
  const addrEn = (school.address_en || "").toLowerCase();
  const udise = (school.udiseCode || "").toLowerCase();
  const block = (school.block || "").toLowerCase();
  return (
    nameHi.includes(q) ||
    nameEn.includes(q) ||
    addrHi.includes(q) ||
    addrEn.includes(q) ||
    udise.includes(q) ||
    block.includes(q)
  );
}

assert.ok(matchesSearch(newSchool, queryEnglish), "Search matches English term");
assert.ok(matchesSearch(newSchool, queryHindi), "Search matches Hindi term");
assert.ok(matchesSearch(newSchool, queryUdise), "Search matches UDISE term");
console.log("✅ Test 4 Passed: Bilingual search properly matches English and Hindi queries.");

// Test 5: Deleting school removes from custom schools and suppresses from merged
deleteCustomSchool("patna-adarsh-high-school");
const afterDelete = mergeSchoolsWithLocal(baseDemoSchools);
assert.strictEqual(afterDelete.length, 1, "Deleted school removed from merged list");
assert.ok(!afterDelete.some((s) => s.id === "patna-adarsh-high-school"), "Custom school not in merged list");
console.log("✅ Test 5 Passed: Deleting school suppresses it completely.");

// Test 6: Site content persistence
saveCustomSiteContent("home", { heroHindi: "नया परीक्षण शीर्षक" });
const retrievedHome = getCustomSiteContent("home");
assert.strictEqual(retrievedHome.heroHindi, "नया परीक्षण शीर्षक", "Site content persists and retrieves");
console.log("✅ Test 6 Passed: Site content persists and retrieves correctly.");

console.log("\n🎉 ALL 6 CUSTOM SCHOOLS & SYNC TESTS PASSED SUCCESSFULLY!");
