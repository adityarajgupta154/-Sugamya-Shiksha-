/**
 * TDD: Audit Standards Comparison Engine Tests
 * Tests comparison logic against PRD 6.2-A, 11.2, and confirmed official standards.
 * Run via: node scripts/test-audit-comparison.mjs
 */

import { compareAuditAgainstStandards } from "../src/lib/auditComparison.ts";
import { DEFAULT_STANDARDS } from "../src/data/standardsData.ts";

const tests = [];
function test(name, fn) {
  tests.push({ name, fn });
}

function assert(condition, message) {
  if (!condition) {
    throw new Error(`Assertion failed: ${message}`);
  }
}

// -------------------------------------------------------------------------
// TDD Test Cases: Seam is compareAuditAgainstStandards()
// -------------------------------------------------------------------------

test("Seam exists and is callable with standards and measurements", () => {
  assert(typeof compareAuditAgainstStandards === "function", "compareAuditAgainstStandards must be a function");
  const result = compareAuditAgainstStandards({}, []);
  assert(typeof result === "object", "Result must be an object");
  assert(Array.isArray(result.deficiencies), "Result must have a deficiencies array");
});

test("Ramp: Flags deficiency when ramp slope is steeper than 1:12 (e.g. 1:8)", () => {
  const measurements = {
    ramp: {
      slopeRatio: 8, // 1:8 is steeper than 1:12
      clearWidthMm: 1250,
      landingDimensionsMm: 1500,
      hasDualHandrails: true,
      hasTactileWarning: true,
      surfaceNonSlip: true,
    },
  };

  const result = compareAuditAgainstStandards(measurements, DEFAULT_STANDARDS);
  const rampSlopeDef = result.deficiencies.find((d) => d.standardId === "std-ramp-slope");
  assert(rampSlopeDef, "Must flag std-ramp-slope deficiency");
  assert(rampSlopeDef.sourceDocument === "Accessibility Code for Educational Institutions, 2024", "Must cite Accessibility Code 2024");
  assert(rampSlopeDef.sourceClause.includes("3.2.1"), "Must cite Cl. 3.2.1");
  assert(rampSlopeDef.severity === "critical", "Ramp slope violation must be critical severity");
});

test("Ramp: Passes without deficiency when ramp slope is 1:14 (gentle)", () => {
  const measurements = {
    ramp: {
      slopeRatio: 14, // 1:14 is gentler than 1:12
      clearWidthMm: 1250,
      landingDimensionsMm: 1500,
      hasDualHandrails: true,
      hasTactileWarning: true,
      surfaceNonSlip: true,
    },
  };

  const result = compareAuditAgainstStandards(measurements, DEFAULT_STANDARDS);
  const rampSlopeDef = result.deficiencies.find((d) => d.standardId === "std-ramp-slope");
  assert(!rampSlopeDef, "Gentle slope 1:14 must NOT trigger a slope deficiency");
});

test("Doors: Flags deficiency when doorway width is below 900 mm", () => {
  const measurements = {
    doors: {
      mainDoorWidthMm: 800, // < 900 mm
      maxThresholdHeightMm: 10,
      hasEasyLeverHandles: true,
    },
  };

  const result = compareAuditAgainstStandards(measurements, DEFAULT_STANDARDS);
  const doorDef = result.deficiencies.find((d) => d.standardId === "std-door-main-width");
  assert(doorDef, "Must flag std-door-main-width deficiency");
  assert(doorDef.sourceClause.includes("4.1"), "Must cite doorway clause 4.1");
});

test("Toilets: Flags critical hazard when toilet door opens inward", () => {
  const measurements = {
    toilets: {
      hasDedicatedCwsnToilet: true,
      cubicleWidthMm: 2100,
      cubicleLengthMm: 2300,
      turningCircleMm: 1550,
      wcSeatHeightMm: 460,
      grabBarHeightMm: 780,
      isDoorOutwardOpening: false, // Inward opening is hazardous
      hasEmergencyAlarm: true,
    },
  };

  const result = compareAuditAgainstStandards(measurements, DEFAULT_STANDARDS);
  const doorSwingDef = result.deficiencies.find((d) => d.standardId === "std-toilet-door-swing");
  assert(doorSwingDef, "Must flag inward swinging toilet door as safety deficiency");
  assert(doorSwingDef.severity === "critical", "Inward toilet door must be critical severity");
});

test("Railings: Flags deficiency when dual handrails at 760mm and 900mm are missing", () => {
  const measurements = {
    railings: {
      lowerRailHeightMm: 0, // Missing lower rail
      upperRailHeightMm: 850,
      hasContinuousExtensions: false,
      gripDiameterMm: 40,
    },
  };

  const result = compareAuditAgainstStandards(measurements, DEFAULT_STANDARDS);
  const railDef = result.deficiencies.find((d) => d.standardId === "std-rail-dual-height");
  assert(railDef, "Must flag missing lower rail");
});

test("Drinking Water: Flags deficiency when tap height exceeds 800 mm", () => {
  const measurements = {
    drinkingWater: {
      tapHeightMm: 1050, // > 800 mm
      hasWheelchairKneeRecess: false,
      tapOperationType: "twist_knob",
      hasSlipResistantFloor: true,
    },
  };

  const result = compareAuditAgainstStandards(measurements, DEFAULT_STANDARDS);
  const waterDef = result.deficiencies.find((d) => d.standardId === "std-water-tap-height");
  assert(waterDef, "Must flag high tap height");
});

test("Overall Compliance: Computes correct complianceRate and flagged categories", () => {
  // Fully compliant mock measurements
  const perfectMeasurements = {
    ramp: { slopeRatio: 14, clearWidthMm: 1250, landingDimensionsMm: 1500, hasDualHandrails: true, hasTactileWarning: true, surfaceNonSlip: true },
    doors: { mainDoorWidthMm: 950, maxThresholdHeightMm: 8, hasEasyLeverHandles: true },
    toilets: { hasDedicatedCwsnToilet: true, cubicleWidthMm: 2100, cubicleLengthMm: 2300, turningCircleMm: 1550, wcSeatHeightMm: 460, grabBarHeightMm: 780, isDoorOutwardOpening: true, hasEmergencyAlarm: true },
    railings: { lowerRailHeightMm: 760, upperRailHeightMm: 900, hasContinuousExtensions: true, gripDiameterMm: 40 },
    classrooms: { aisleWidthMm: 1250, hasAccessibleDesk: true, deskKneeClearanceMm: 680, blackboardHeightMm: 850, hasStepFreeAccess: true },
    pathways: { mainPathwayWidthMm: 1500, surfaceCondition: "paved_smooth", hasTactilePath: true, hasObstacles: false },
    signage: { hasBrailleSignage: true, signMountingHeightMm: 1500, hasHighContrast: true, hasAccessibleSymbol: true },
    drinkingWater: { tapHeightMm: 780, hasWheelchairKneeRecess: true, tapOperationType: "lever", hasSlipResistantFloor: true },
    emergencyExits: { exitDoorWidthMm: 1250, isEvacuationRouteStepFree: true, hasDualAlarm: true },
  };

  const perfectResult = compareAuditAgainstStandards(perfectMeasurements, DEFAULT_STANDARDS);
  assert(perfectResult.deficiencies.length === 0, "Perfect measurements should produce 0 deficiencies");
  assert(perfectResult.complianceRate === 100, "Perfect measurements must have 100% compliance rate");
});

async function run() {
  console.log("==================================================");
  console.log(" TDD: Standards Comparison Engine Tests (Task 9)");
  console.log("==================================================\n");

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
  if (failed > 0) process.exit(1);
}

run();
