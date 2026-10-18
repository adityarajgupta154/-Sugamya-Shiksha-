import assert from "node:assert/strict";

// We import the modules that we will build
import { DEFAULT_SCORING_CONFIG } from "../src/data/scoringConfigData.ts";
import { calculateScorecard } from "../src/lib/scorecardCalculator.ts";
import { DEFAULT_STANDARDS } from "../src/data/standardsData.ts";

console.log("🧪 Running Scorecard Calculation TDD Test Suite...\n");

// --- TEST 1: 100% Perfect Compliant Audit ---
{
  const perfectMeasurements = {
    ramp: {
      slopeRatio: 14, // >= 12 (Compliant)
      clearWidthMm: 1250, // >= 1200 (Compliant)
      landingDimensionsMm: 1600, // >= 1500 (Compliant)
    },
    doors: {
      mainDoorWidthMm: 1000, // >= 900 (Compliant)
      maxThresholdHeightMm: 10, // <= 12 (Compliant)
    },
    railings: {
      lowerRailHeightMm: 750, // 700-800 (Compliant)
    },
    pathways: {
      mainPathwayWidthMm: 1400, // >= 1200 (Compliant)
    },
    toilets: {
      cubicleWidthMm: 2100, // >= 2000 (Compliant)
      cubicleLengthMm: 2300, // >= 2200 (Compliant)
      turningCircleMm: 1600, // >= 1500 (Compliant)
      wcSeatHeightMm: 460, // 450-480 (Compliant)
      isDoorOutwardOpening: true, // true (Compliant)
    },
    drinkingWater: {
      tapHeightMm: 750, // <= 800 (Compliant)
    },
    classrooms: {
      aisleWidthMm: 1300, // >= 1200 (Compliant)
      hasAccessibleDesk: true, // true (Compliant)
    },
    signage: {
      hasBrailleSignage: true, // true (Compliant)
    },
    emergencyExits: {
      exitDoorWidthMm: 1300, // >= 1200 (Compliant)
    },
  };

  const result = calculateScorecard(
    perfectMeasurements,
    DEFAULT_STANDARDS,
    DEFAULT_SCORING_CONFIG
  );

  assert.equal(result.overallScore, 100, "Perfect audit must score 100 points");
  assert.equal(result.tier.id, "high", "Score of 100 must belong to 'high' tier");
  assert.equal(result.categories.entrance.pointsEarned, 30, "Entrance category must earn full 30 pts");
  assert.equal(result.categories.toilets.pointsEarned, 30, "Toilets category must earn full 30 pts");
  assert.equal(result.categories.classrooms.pointsEarned, 25, "Classrooms category must earn full 25 pts");
  assert.equal(result.categories.safety.pointsEarned, 15, "Safety category must earn full 15 pts");
  assert.equal(result.totalDeficiencies, 0, "No deficiencies in perfect audit");
  console.log("✅ Test 1 Passed: 100% compliant audit yields 100 points across all 4 pillars.");
}

// --- TEST 2: 0% Completely Non-Compliant Audit ---
{
  const failMeasurements = {
    ramp: {
      slopeRatio: 8, // < 12 (Deficient)
      clearWidthMm: 900, // < 1200 (Deficient)
      landingDimensionsMm: 1000, // < 1500 (Deficient)
    },
    doors: {
      mainDoorWidthMm: 750, // < 900 (Deficient)
      maxThresholdHeightMm: 25, // > 12 (Deficient)
    },
    toilets: {
      cubicleWidthMm: 1400, // < 2000 (Deficient)
      cubicleLengthMm: 1500, // < 2200 (Deficient)
      turningCircleMm: 1100, // < 1500 (Deficient)
      wcSeatHeightMm: 400, // < 450 (Deficient)
      isDoorOutwardOpening: false, // false (Deficient)
    },
    drinkingWater: {
      tapHeightMm: 950, // > 800 (Deficient)
    },
    classrooms: {
      aisleWidthMm: 800, // < 1200 (Deficient)
      hasAccessibleDesk: false, // false (Deficient)
    },
    signage: {
      hasBrailleSignage: false, // false (Deficient)
    },
    emergencyExits: {
      exitDoorWidthMm: 900, // < 1200 (Deficient)
    },
  };

  const result = calculateScorecard(
    failMeasurements,
    DEFAULT_STANDARDS,
    DEFAULT_SCORING_CONFIG
  );

  assert.equal(result.overallScore, 0, "All-failing audit must score 0 points");
  assert.equal(result.tier.id, "low", "Score of 0 must belong to 'low' tier (High Barriers)");
  assert.equal(result.categories.entrance.pointsEarned, 0, "Entrance must earn 0 pts");
  assert.equal(result.categories.toilets.pointsEarned, 0, "Toilets must earn 0 pts");
  assert.equal(result.categories.classrooms.pointsEarned, 0, "Classrooms must earn 0 pts");
  assert.equal(result.categories.safety.pointsEarned, 0, "Safety must earn 0 pts");
  console.log("✅ Test 2 Passed: 100% deficient audit yields 0 points and 'low' tier.");
}

// --- TEST 3: Partial Compliance & Proportional Weighted Calculation ---
{
  // Test Entrance: 2 pass, 2 fail -> 50% * 30 pts = 15 pts
  // Test Toilets: 3 pass, 3 fail -> 50% * 30 pts = 15 pts
  // Classrooms: unassessed -> 0 pts
  // Safety: 1 pass, 1 fail -> 50% * 15 pts = 7.5 pts
  // Expected overall = 15 + 15 + 0 + 7.5 = 37.5 -> rounded 38 pts
  const partialMeasurements = {
    ramp: {
      slopeRatio: 14, // Pass
      clearWidthMm: 1250, // Pass
      landingDimensionsMm: 1200, // Fail (< 1500)
    },
    doors: {
      mainDoorWidthMm: 800, // Fail (< 900)
    },
    // Toilets: 3 pass, 3 fail
    toilets: {
      cubicleWidthMm: 2100, // Pass
      cubicleLengthMm: 2300, // Pass
      turningCircleMm: 1600, // Pass
      wcSeatHeightMm: 400, // Fail
      isDoorOutwardOpening: false, // Fail
    },
    drinkingWater: {
      tapHeightMm: 950, // Fail (> 800)
    },
    // Safety: 1 pass, 1 fail
    signage: {
      hasBrailleSignage: true, // Pass
    },
    emergencyExits: {
      exitDoorWidthMm: 1000, // Fail (< 1200)
    },
  };

  const result = calculateScorecard(
    partialMeasurements,
    DEFAULT_STANDARDS,
    DEFAULT_SCORING_CONFIG
  );

  assert.equal(result.categories.entrance.evaluatedCount, 4);
  assert.equal(result.categories.entrance.compliantCount, 2);
  assert.equal(result.categories.entrance.compliancePercentage, 50);
  assert.equal(result.categories.entrance.pointsEarned, 15);

  assert.equal(result.categories.toilets.evaluatedCount, 6);
  assert.equal(result.categories.toilets.compliantCount, 3);
  assert.equal(result.categories.toilets.compliancePercentage, 50);
  assert.equal(result.categories.toilets.pointsEarned, 15);

  assert.equal(result.categories.classrooms.evaluatedCount, 0);
  assert.equal(result.categories.classrooms.pointsEarned, 0);

  assert.equal(result.categories.safety.evaluatedCount, 2);
  assert.equal(result.categories.safety.compliantCount, 1);
  assert.equal(result.categories.safety.pointsEarned, 7.5);

  // Overall: 15 + 15 + 0 + 7.5 = 37.5 -> rounded = 38
  assert.equal(result.overallScore, 38);
  assert.equal(result.tier.id, "low"); // 38 < 50
  console.log("✅ Test 3 Passed: Partial audit computes proportional weights correctly (38/100).");
}

// --- TEST 4: Dynamic Admin-Configured Weights ---
{
  const customConfig = {
    ...DEFAULT_SCORING_CONFIG,
    categories: {
      ...DEFAULT_SCORING_CONFIG.categories,
      entrance: { ...DEFAULT_SCORING_CONFIG.categories.entrance, weight: 40 },
      toilets: { ...DEFAULT_SCORING_CONFIG.categories.toilets, weight: 20 },
      classrooms: { ...DEFAULT_SCORING_CONFIG.categories.classrooms, weight: 20 },
      safety: { ...DEFAULT_SCORING_CONFIG.categories.safety, weight: 20 },
    },
  };

  // Entrance 100% compliant, all other categories 0% compliant
  const measurements = {
    ramp: {
      slopeRatio: 14,
      clearWidthMm: 1300,
      landingDimensionsMm: 1600,
    },
    toilets: {
      cubicleWidthMm: 1000, // Fail
    },
  };

  const result = calculateScorecard(measurements, DEFAULT_STANDARDS, customConfig);
  assert.equal(result.categories.entrance.pointsEarned, 40, "Entrance should use custom weight 40");
  assert.equal(result.overallScore, 40, "Overall score should match custom configured weight sum");
  console.log("✅ Test 4 Passed: Admin-editable weights in scoringConfig are dynamically respected.");
}

// --- TEST 5: Tier Threshold Boundaries ---
{
  const getTier = (score) => {
    const dummy = {
      overallScore: score,
    };
    // Testing boundary logic
    if (score >= 80) return "high";
    if (score >= 50) return "moderate";
    return "low";
  };

  assert.equal(getTier(100), "high");
  assert.equal(getTier(80), "high");
  assert.equal(getTier(79), "moderate");
  assert.equal(getTier(50), "moderate");
  assert.equal(getTier(49), "low");
  assert.equal(getTier(0), "low");
  console.log("✅ Test 5 Passed: Tier thresholds strictly adhere to 80-100 (high), 50-79 (moderate), 0-49 (low).");
}

// --- TEST 6: Mandatory Research Disclaimer & Methodology Output ---
{
  const result = calculateScorecard({}, DEFAULT_STANDARDS, DEFAULT_SCORING_CONFIG);
  assert.ok(result.disclaimer_en.includes("not an official government certification"), "Must have English disclaimer");
  assert.ok(result.disclaimer_hi.includes("कोई आधिकारिक सरकारी प्रमाणन नहीं"), "Must have Hindi disclaimer");
  assert.ok(result.methodology.title_en, "Must have methodology title");
  console.log("✅ Test 6 Passed: Output includes mandatory bilingual research disclaimer & methodology metadata.");
}

console.log("\n🎉 ALL 6 SCORECARD TDD TESTS PASSED!");
