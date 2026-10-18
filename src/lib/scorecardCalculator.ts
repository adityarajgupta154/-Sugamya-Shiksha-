import type { AccessibilityStandard, StandardCategory } from "../data/standardsData";
import type { AuditMeasurements, DeficiencyFlag } from "./auditComparison";
import { compareAuditAgainstStandards } from "./auditComparison.ts";
import type {
  ScoringConfig,
  ScoreCategoryKey,
  ScoreCategoryConfig,
  ScoreTier,
} from "../data/scoringConfigData";
import { DEFAULT_SCORING_CONFIG } from "../data/scoringConfigData.ts";

export interface CategoryScoreResult {
  key: ScoreCategoryKey;
  name_en: string;
  name_hi: string;
  maxWeight: number;
  evaluatedCount: number;
  compliantCount: number;
  deficientCount: number;
  compliancePercentage: number; // 0 to 100
  pointsEarned: number; // proportional points up to maxWeight
  isAssessed: boolean;
  deficiencies: DeficiencyFlag[];
  iconName: string;
}

export interface ScorecardResult {
  overallScore: number; // 0 to 100 (integer)
  exactScore: number; // Unrounded float
  tier: ScoreTier;
  categories: Record<ScoreCategoryKey, CategoryScoreResult>;
  totalEvaluated: number;
  totalCompliant: number;
  totalDeficiencies: number;
  overallComplianceRate: number; // 0 to 100
  disclaimer_en: string;
  disclaimer_hi: string;
  methodology: ScoringConfig["methodology"];
  calculatedAt: string;
  configVersion: string;
}

/**
 * Helper to determine which pillar key a standard category belongs to.
 */
function getCategoryKeyForStandardCategory(
  cat: StandardCategory,
  config: ScoringConfig = DEFAULT_SCORING_CONFIG
): ScoreCategoryKey {
  for (const [key, categoryConfig] of Object.entries(config.categories) as [
    ScoreCategoryKey,
    ScoreCategoryConfig
  ][]) {
    if (categoryConfig.standardCategories.includes(cat)) {
      return key;
    }
  }
  // Default fallback if unmapped
  return "entrance";
}

/**
 * Pure function: Computes 100-point school accessibility score from audit measurements
 * using standards definitions and admin-configured category weights.
 */
export function calculateScorecard(
  measurements: AuditMeasurements = {},
  standards: AccessibilityStandard[] = [],
  config: ScoringConfig = DEFAULT_SCORING_CONFIG
): ScorecardResult {
  // 1. Run comparison engine against all standards
  const comparison = compareAuditAgainstStandards(measurements, standards);
  const deficienciesByStandardId = new Map<string, DeficiencyFlag>();
  for (const def of comparison.deficiencies) {
    deficienciesByStandardId.set(def.standardId, def);
  }

  // 2. Initialize category buckets
  const categoryResults: Record<ScoreCategoryKey, CategoryScoreResult> = {
    entrance: {
      key: "entrance",
      name_en: config.categories.entrance?.name_en || "Entrance & Ramps",
      name_hi: config.categories.entrance?.name_hi || "पहुंच, प्रवेश एवं रैंप",
      maxWeight: config.categories.entrance?.weight ?? 30,
      evaluatedCount: 0,
      compliantCount: 0,
      deficientCount: 0,
      compliancePercentage: 0,
      pointsEarned: 0,
      isAssessed: false,
      deficiencies: [],
      iconName: config.categories.entrance?.iconName || "Maximize2",
    },
    toilets: {
      key: "toilets",
      name_en: config.categories.toilets?.name_en || "Toilets & Water",
      name_hi: config.categories.toilets?.name_hi || "सुगम शौचालय एवं पेयजल",
      maxWeight: config.categories.toilets?.weight ?? 30,
      evaluatedCount: 0,
      compliantCount: 0,
      deficientCount: 0,
      compliancePercentage: 0,
      pointsEarned: 0,
      isAssessed: false,
      deficiencies: [],
      iconName: config.categories.toilets?.iconName || "Droplets",
    },
    classrooms: {
      key: "classrooms",
      name_en: config.categories.classrooms?.name_en || "Classrooms & Desks",
      name_hi: config.categories.classrooms?.name_hi || "कक्षा कक्ष एवं बैठक व्यवस्था",
      maxWeight: config.categories.classrooms?.weight ?? 25,
      evaluatedCount: 0,
      compliantCount: 0,
      deficientCount: 0,
      compliancePercentage: 0,
      pointsEarned: 0,
      isAssessed: false,
      deficiencies: [],
      iconName: config.categories.classrooms?.iconName || "BookOpen",
    },
    safety: {
      key: "safety",
      name_en: config.categories.safety?.name_en || "Signage & Emergency Safety",
      name_hi: config.categories.safety?.name_hi || "संकेतक, ब्रेल एवं आपातकालीन निकास",
      maxWeight: config.categories.safety?.weight ?? 15,
      evaluatedCount: 0,
      compliantCount: 0,
      deficientCount: 0,
      compliancePercentage: 0,
      pointsEarned: 0,
      isAssessed: false,
      deficiencies: [],
      iconName: config.categories.safety?.iconName || "ShieldAlert",
    },
  };

  // 3. For each standard, check if it was evaluated in this audit
  for (const std of standards) {
    let wasEvaluated = false;

    // Check ramp
    if (std.id === "std-ramp-slope" && measurements.ramp?.slopeRatio !== undefined) wasEvaluated = true;
    else if (std.id === "std-ramp-clear-width" && measurements.ramp?.clearWidthMm !== undefined) wasEvaluated = true;
    else if (std.id === "std-ramp-landing" && measurements.ramp?.landingDimensionsMm !== undefined) wasEvaluated = true;
    // Check doors
    else if (std.id === "std-door-main-width" && measurements.doors?.mainDoorWidthMm !== undefined) wasEvaluated = true;
    else if (std.id === "std-door-threshold" && measurements.doors?.maxThresholdHeightMm !== undefined) wasEvaluated = true;
    // Check toilets
    else if (std.id === "std-toilet-cubicle-width" && measurements.toilets?.cubicleWidthMm !== undefined) wasEvaluated = true;
    else if (std.id === "std-toilet-cubicle-length" && measurements.toilets?.cubicleLengthMm !== undefined) wasEvaluated = true;
    else if (std.id === "std-toilet-turning-circle" && measurements.toilets?.turningCircleMm !== undefined) wasEvaluated = true;
    else if (std.id === "std-toilet-seat-height" && measurements.toilets?.wcSeatHeightMm !== undefined) wasEvaluated = true;
    else if (std.id === "std-toilet-door-swing" && measurements.toilets?.isDoorOutwardOpening !== undefined) wasEvaluated = true;
    // Check railings
    else if (std.id === "std-rail-dual-height" && measurements.railings?.lowerRailHeightMm !== undefined) wasEvaluated = true;
    // Check classrooms
    else if (std.id === "std-classroom-aisle" && measurements.classrooms?.aisleWidthMm !== undefined) wasEvaluated = true;
    else if (std.id === "std-classroom-accessible-desk" && measurements.classrooms?.hasAccessibleDesk !== undefined) wasEvaluated = true;
    // Check pathways
    else if (std.id === "std-pathway-width" && measurements.pathways?.mainPathwayWidthMm !== undefined) wasEvaluated = true;
    // Check water
    else if (std.id === "std-water-tap-height" && measurements.drinkingWater?.tapHeightMm !== undefined) wasEvaluated = true;
    // Check signage
    else if (std.id === "std-signage-tactile" && measurements.signage?.hasBrailleSignage !== undefined) wasEvaluated = true;
    // Check emergency exits
    else if (std.id === "std-exit-width" && measurements.emergencyExits?.exitDoorWidthMm !== undefined) wasEvaluated = true;

    if (wasEvaluated) {
      const pillarKey = getCategoryKeyForStandardCategory(std.category, config);
      const catBucket = categoryResults[pillarKey];
      catBucket.evaluatedCount++;
      catBucket.isAssessed = true;

      const deficiency = deficienciesByStandardId.get(std.id);
      if (deficiency) {
        catBucket.deficientCount++;
        catBucket.deficiencies.push(deficiency);
      } else {
        catBucket.compliantCount++;
      }
    }
  }

  // 4. Calculate points for each category
  let exactTotal = 0;
  let totalEvaluatedCount = 0;
  let totalCompliantCount = 0;

  for (const catKey of Object.keys(categoryResults) as ScoreCategoryKey[]) {
    const cat = categoryResults[catKey];
    totalEvaluatedCount += cat.evaluatedCount;
    totalCompliantCount += cat.compliantCount;

    if (cat.evaluatedCount > 0) {
      const ratio = cat.compliantCount / cat.evaluatedCount;
      cat.compliancePercentage = Math.round(ratio * 100);
      // Raw points: ratio * maxWeight
      const pts = ratio * cat.maxWeight;
      // Round to 1 decimal place cleanly (e.g. 7.5 or 15)
      cat.pointsEarned = Math.round(pts * 10) / 10;
      exactTotal += pts;
    } else {
      cat.compliancePercentage = 0;
      cat.pointsEarned = 0;
    }
  }

  // 5. Overall 100-point integer score
  const roundedOverall = Math.min(100, Math.max(0, Math.round(exactTotal)));

  // 6. Tier lookup
  const tier =
    config.tiers.find(
      (t) => roundedOverall >= t.minScore && roundedOverall <= t.maxScore
    ) || config.tiers[config.tiers.length - 1];

  const overallComplianceRate =
    totalEvaluatedCount > 0
      ? Math.round((totalCompliantCount / totalEvaluatedCount) * 100)
      : 0;

  return {
    overallScore: roundedOverall,
    exactScore: Math.round(exactTotal * 10) / 10,
    tier,
    categories: categoryResults,
    totalEvaluated: totalEvaluatedCount,
    totalCompliant: totalCompliantCount,
    totalDeficiencies: comparison.totalDeficiencies,
    overallComplianceRate,
    disclaimer_en: config.disclaimer_en,
    disclaimer_hi: config.disclaimer_hi,
    methodology: config.methodology,
    calculatedAt: new Date().toISOString(),
    configVersion: config.version,
  };
}
