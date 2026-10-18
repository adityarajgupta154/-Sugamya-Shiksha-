"use client";

import React from "react";
import { RampDiagram } from "./RampDiagram";
import { ToiletDiagram } from "./ToiletDiagram";
import { TactileDiagram } from "./TactileDiagram";
import { ClassroomDiagram } from "./ClassroomDiagram";

export { RampDiagram, ToiletDiagram, TactileDiagram, ClassroomDiagram };

// ============================================================================
// MAIN VISUAL DIAGRAM RENDERER DISPATCHER
// ============================================================================
export const VisualDiagramRenderer = React.memo(function VisualDiagramRenderer({
  type,
  altText,
}: {
  type: "ramp" | "toilet" | "tactile" | "classroom";
  altText?: string;
}) {
  switch (type) {
    case "ramp":
      return <RampDiagram altText={altText} />;
    case "toilet":
      return <ToiletDiagram altText={altText} />;
    case "tactile":
      return <TactileDiagram altText={altText} />;
    case "classroom":
      return <ClassroomDiagram altText={altText} />;
    default:
      return null;
  }
});
