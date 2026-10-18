"use client";

import React from "react";
import { useLanguage } from "@/context/LanguageContext";

export function SkipLink() {
  const { t } = useLanguage();

  return (
    <a
      href="#main-content"
      className="skip-link"
    >
      {t("a11y.skipToContent", "Skip to main content")}
    </a>
  );
}
