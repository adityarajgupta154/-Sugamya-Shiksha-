import type { AccessibilityStandard } from "../data/standardsData";

export interface AuditMeasurements {
  ramp?: {
    slopeRatio?: number; // 1:X (e.g. 12 means 1:12; 8 means 1:8)
    clearWidthMm?: number;
    landingDimensionsMm?: number;
    hasDualHandrails?: boolean;
    hasTactileWarning?: boolean;
    surfaceNonSlip?: boolean;
    notes?: string;
  };
  doors?: {
    mainDoorWidthMm?: number;
    classroomDoorWidthMm?: number;
    toiletDoorWidthMm?: number;
    maxThresholdHeightMm?: number;
    hasEasyLeverHandles?: boolean;
    notes?: string;
  };
  toilets?: {
    hasDedicatedCwsnToilet?: boolean;
    cubicleWidthMm?: number;
    cubicleLengthMm?: number;
    turningCircleMm?: number;
    wcSeatHeightMm?: number;
    grabBarHeightMm?: number;
    isDoorOutwardOpening?: boolean;
    hasEmergencyAlarm?: boolean;
    notes?: string;
  };
  railings?: {
    lowerRailHeightMm?: number;
    upperRailHeightMm?: number;
    hasContinuousExtensions?: boolean;
    gripDiameterMm?: number;
    notes?: string;
  };
  classrooms?: {
    aisleWidthMm?: number;
    hasAccessibleDesk?: boolean;
    deskKneeClearanceMm?: number;
    blackboardHeightMm?: number;
    hasStepFreeAccess?: boolean;
    notes?: string;
  };
  pathways?: {
    mainPathwayWidthMm?: number;
    surfaceCondition?: "paved_smooth" | "uneven" | "unpaved_dirt";
    hasTactilePath?: boolean;
    hasObstacles?: boolean;
    notes?: string;
  };
  signage?: {
    hasBrailleSignage?: boolean;
    signMountingHeightMm?: number;
    hasHighContrast?: boolean;
    hasAccessibleSymbol?: boolean;
    notes?: string;
  };
  drinkingWater?: {
    tapHeightMm?: number;
    hasWheelchairKneeRecess?: boolean;
    tapOperationType?: "lever" | "push" | "twist_knob";
    hasSlipResistantFloor?: boolean;
    notes?: string;
  };
  emergencyExits?: {
    exitDoorWidthMm?: number;
    isEvacuationRouteStepFree?: boolean;
    hasDualAlarm?: boolean;
    notes?: string;
  };
}

export interface DeficiencyFlag {
  standardId: string;
  category: string;
  parameter: string;
  parameter_hi: string;
  enteredValue: any;
  standardThreshold: string;
  unit: string;
  severity: "critical" | "major" | "minor";
  sourceDocument: string;
  sourceClause: string;
  message_en: string;
  message_hi: string;
}

export interface AuditComparisonResult {
  deficiencies: DeficiencyFlag[];
  totalDeficiencies: number;
  totalEvaluated: number;
  complianceRate: number; // 0 to 100
  flaggedCategories: string[];
  compliantParameters: string[];
}

export function compareAuditAgainstStandards(
  measurements: AuditMeasurements,
  standards: AccessibilityStandard[]
): AuditComparisonResult {
  const deficiencies: DeficiencyFlag[] = [];
  const compliantParameters: string[] = [];
  const flaggedCategorySet = new Set<string>();
  let totalEvaluated = 0;

  if (!standards || standards.length === 0) {
    return {
      deficiencies: [],
      totalDeficiencies: 0,
      totalEvaluated: 0,
      complianceRate: 100,
      flaggedCategories: [],
      compliantParameters: [],
    };
  }

  for (const std of standards) {
    let enteredValue: any = undefined;
    let isEvaluated = false;
    let isDeficient = false;

    // 1. Ramp mappings
    if (std.id === "std-ramp-slope" && measurements.ramp?.slopeRatio !== undefined) {
      enteredValue = measurements.ramp.slopeRatio;
      isEvaluated = true;
      // In slope ratio 1:X, a smaller X means steeper (1:8 is steeper than 1:12).
      // So valid slope must have X >= 12
      if (enteredValue < 12) isDeficient = true;
    } else if (std.id === "std-ramp-clear-width" && measurements.ramp?.clearWidthMm !== undefined) {
      enteredValue = measurements.ramp.clearWidthMm;
      isEvaluated = true;
      if (enteredValue < 1200) isDeficient = true;
    } else if (std.id === "std-ramp-landing" && measurements.ramp?.landingDimensionsMm !== undefined) {
      enteredValue = measurements.ramp.landingDimensionsMm;
      isEvaluated = true;
      if (enteredValue < 1500) isDeficient = true;
    }

    // 2. Door mappings
    else if (std.id === "std-door-main-width" && measurements.doors?.mainDoorWidthMm !== undefined) {
      enteredValue = measurements.doors.mainDoorWidthMm;
      isEvaluated = true;
      if (enteredValue < 900) isDeficient = true;
    } else if (std.id === "std-door-threshold" && measurements.doors?.maxThresholdHeightMm !== undefined) {
      enteredValue = measurements.doors.maxThresholdHeightMm;
      isEvaluated = true;
      if (enteredValue > 12) isDeficient = true;
    }

    // 3. Toilet mappings
    else if (std.id === "std-toilet-cubicle-width" && measurements.toilets?.cubicleWidthMm !== undefined) {
      enteredValue = measurements.toilets.cubicleWidthMm;
      isEvaluated = true;
      if (enteredValue < 2000) isDeficient = true;
    } else if (std.id === "std-toilet-cubicle-length" && measurements.toilets?.cubicleLengthMm !== undefined) {
      enteredValue = measurements.toilets.cubicleLengthMm;
      isEvaluated = true;
      if (enteredValue < 2200) isDeficient = true;
    } else if (std.id === "std-toilet-turning-circle" && measurements.toilets?.turningCircleMm !== undefined) {
      enteredValue = measurements.toilets.turningCircleMm;
      isEvaluated = true;
      if (enteredValue < 1500) isDeficient = true;
    } else if (std.id === "std-toilet-seat-height" && measurements.toilets?.wcSeatHeightMm !== undefined) {
      enteredValue = measurements.toilets.wcSeatHeightMm;
      isEvaluated = true;
      if (enteredValue < 450 || enteredValue > 480) isDeficient = true;
    } else if (std.id === "std-toilet-door-swing" && measurements.toilets?.isDoorOutwardOpening !== undefined) {
      enteredValue = measurements.toilets.isDoorOutwardOpening;
      isEvaluated = true;
      // Must open outward (true)
      if (enteredValue !== true) isDeficient = true;
    }

    // 4. Railing mappings
    else if (std.id === "std-rail-dual-height" && measurements.railings?.lowerRailHeightMm !== undefined) {
      enteredValue = measurements.railings.lowerRailHeightMm;
      isEvaluated = true;
      // Lower rail must be around 760 mm (>= 700 and <= 800)
      if (enteredValue < 700 || enteredValue > 800) isDeficient = true;
    }

    // 5. Classroom mappings
    else if (std.id === "std-classroom-aisle" && measurements.classrooms?.aisleWidthMm !== undefined) {
      enteredValue = measurements.classrooms.aisleWidthMm;
      isEvaluated = true;
      if (enteredValue < 1200) isDeficient = true;
    } else if (std.id === "std-classroom-accessible-desk" && measurements.classrooms?.hasAccessibleDesk !== undefined) {
      enteredValue = measurements.classrooms.hasAccessibleDesk;
      isEvaluated = true;
      if (enteredValue !== true) isDeficient = true;
    }

    // 6. Pathway mappings
    else if (std.id === "std-pathway-width" && measurements.pathways?.mainPathwayWidthMm !== undefined) {
      enteredValue = measurements.pathways.mainPathwayWidthMm;
      isEvaluated = true;
      if (enteredValue < 1200) isDeficient = true;
    }

    // 7. Drinking water mappings
    else if (std.id === "std-water-tap-height" && measurements.drinkingWater?.tapHeightMm !== undefined) {
      enteredValue = measurements.drinkingWater.tapHeightMm;
      isEvaluated = true;
      if (enteredValue > 800) isDeficient = true;
    }

    // 8. Signage mappings
    else if (std.id === "std-signage-tactile" && measurements.signage?.hasBrailleSignage !== undefined) {
      enteredValue = measurements.signage.hasBrailleSignage;
      isEvaluated = true;
      if (enteredValue !== true) isDeficient = true;
    }

    // 9. Emergency exits mappings
    else if (std.id === "std-exit-width" && measurements.emergencyExits?.exitDoorWidthMm !== undefined) {
      enteredValue = measurements.emergencyExits.exitDoorWidthMm;
      isEvaluated = true;
      if (enteredValue < 1200) isDeficient = true;
    }

    // If evaluated, track result
    if (isEvaluated) {
      totalEvaluated++;
      if (isDeficient) {
        flaggedCategorySet.add(std.category);
        deficiencies.push({
          standardId: std.id,
          category: std.category,
          parameter: std.parameter,
          parameter_hi: std.parameter_hi,
          enteredValue,
          standardThreshold: std.thresholdDisplay,
          unit: std.unit,
          severity: std.severity,
          sourceDocument: std.sourceDocument,
          sourceClause: std.sourceClause,
          message_en: std.deficiencyMessage_en,
          message_hi: std.deficiencyMessage_hi,
        });
      } else {
        compliantParameters.push(std.parameter);
      }
    }
  }

  const complianceRate =
    totalEvaluated > 0
      ? Math.round(((totalEvaluated - deficiencies.length) / totalEvaluated) * 100)
      : 100;

  return {
    deficiencies,
    totalDeficiencies: deficiencies.length,
    totalEvaluated,
    complianceRate,
    flaggedCategories: Array.from(flaggedCategorySet),
    compliantParameters,
  };
}
