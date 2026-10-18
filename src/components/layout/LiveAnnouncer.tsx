"use client";

import React from "react";
import { useAccessibility } from "@/context/AccessibilityContext";

export function LiveAnnouncer() {
  const { announcement } = useAccessibility();

  return (
    <div
      aria-live="polite"
      aria-atomic="true"
      className="sr-only"
      id="a11y-live-region"
    >
      {announcement}
    </div>
  );
}
