"use client";

import React, { createContext, useContext, useState, useEffect, useCallback, useMemo, startTransition } from "react";

export type TextScale = "normal" | "large" | "xlarge";

interface AccessibilityContextType {
  textScale: TextScale;
  setTextScale: (scale: TextScale) => void;
  cycleTextScale: () => void;
  highContrast: boolean;
  toggleHighContrast: () => void;
  announcement: string;
  announce: (message: string) => void;
}

const AccessibilityContext = createContext<AccessibilityContextType | undefined>(undefined);

export function AccessibilityProvider({ children }: { children: React.ReactNode }) {
  const [textScale, setTextScaleState] = useState<TextScale>("normal");
  const [highContrast, setHighContrastState] = useState<boolean>(false);
  const [announcement, setAnnouncement] = useState<string>("");

  useEffect(() => {
    // Read persisted preferences
    const savedScale = localStorage.getItem("ssb_text_scale") as TextScale | null;
    if (savedScale && ["normal", "large", "xlarge"].includes(savedScale)) {
      setTextScaleState(savedScale);
      applyTextScale(savedScale);
    }

    const savedHC = localStorage.getItem("ssb_high_contrast");
    if (savedHC === "true") {
      setHighContrastState(true);
      applyHighContrast(true);
    }
  }, []);

  const applyTextScale = (scale: TextScale) => {
    if (typeof document === "undefined") return;
    const root = document.documentElement;
    root.classList.remove("text-scale-normal", "text-scale-large", "text-scale-xlarge");
    root.classList.add(`text-scale-${scale}`);
  };

  const applyHighContrast = (enabled: boolean) => {
    if (typeof document === "undefined") return;
    const root = document.documentElement;
    if (enabled) {
      root.classList.add("high-contrast");
      root.setAttribute("data-theme", "high-contrast");
    } else {
      root.classList.remove("high-contrast");
      root.removeAttribute("data-theme");
    }
  };

  const announce = useCallback((message: string) => {
    setAnnouncement(message);
    // Auto-clear after 4 seconds
    setTimeout(() => {
      setAnnouncement((curr) => (curr === message ? "" : curr));
    }, 4000);
  }, []);

  const setTextScale = useCallback((scale: TextScale) => {
    startTransition(() => {
      setTextScaleState(scale);
    });
    applyTextScale(scale);
    if (typeof window !== "undefined") {
      localStorage.setItem("ssb_text_scale", scale);
    }
    announce(`Text size set to ${scale}`);
  }, [announce]);

  const cycleTextScale = useCallback(() => {
    const scales: TextScale[] = ["normal", "large", "xlarge"];
    setTextScaleState((curr) => {
      const nextIdx = (scales.indexOf(curr) + 1) % scales.length;
      const nextScale = scales[nextIdx];
      applyTextScale(nextScale);
      if (typeof window !== "undefined") {
        localStorage.setItem("ssb_text_scale", nextScale);
      }
      announce(`Text size set to ${nextScale}`);
      return nextScale;
    });
  }, [announce]);

  const toggleHighContrast = useCallback(() => {
    setHighContrastState((curr) => {
      const nextVal = !curr;
      applyHighContrast(nextVal);
      if (typeof window !== "undefined") {
        localStorage.setItem("ssb_high_contrast", String(nextVal));
      }
      announce(nextVal ? "High contrast mode enabled" : "High contrast mode disabled");
      return nextVal;
    });
  }, [announce]);

  const value = useMemo(
    () => ({
      textScale,
      setTextScale,
      cycleTextScale,
      highContrast,
      toggleHighContrast,
      announcement,
      announce,
    }),
    [
      textScale,
      setTextScale,
      cycleTextScale,
      highContrast,
      toggleHighContrast,
      announcement,
      announce,
    ]
  );

  return (
    <AccessibilityContext.Provider value={value}>
      {children}
    </AccessibilityContext.Provider>
  );
}

export function useAccessibility() {
  const context = useContext(AccessibilityContext);
  if (!context) {
    throw new Error("useAccessibility must be used within an AccessibilityProvider");
  }
  return context;
}
