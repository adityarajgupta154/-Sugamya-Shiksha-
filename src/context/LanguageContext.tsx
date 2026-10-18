"use client";

import React, { createContext, useContext, useState, useEffect, useCallback, useMemo, startTransition } from "react";
import enTranslations from "@/locales/en.json";
import hiTranslations from "@/locales/hi.json";

export type Locale = "hi" | "en";

interface LanguageContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  toggleLocale: () => void;
  t: (key: string, fallback?: string) => string;
}

const translations: Record<Locale, any> = {
  hi: hiTranslations,
  en: enTranslations,
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("hi");

  useEffect(() => {
    const savedLocale = localStorage.getItem("ssb_locale") as Locale | null;
    if (savedLocale === "en" || savedLocale === "hi") {
      setLocaleState(savedLocale);
      document.documentElement.lang = savedLocale;
    } else {
      document.documentElement.lang = "hi";
    }
  }, []);

  const setLocale = useCallback((newLocale: Locale) => {
    startTransition(() => {
      setLocaleState(newLocale);
    });
    if (typeof window !== "undefined") {
      localStorage.setItem("ssb_locale", newLocale);
      document.documentElement.lang = newLocale;
    }
  }, []);

  const toggleLocale = useCallback(() => {
    setLocale(locale === "hi" ? "en" : "hi");
  }, [locale, setLocale]);

  const t = useCallback(
    (key: string, fallback?: string): string => {
      const keys = key.split(".");
      let current: any = translations[locale];

      for (const k of keys) {
        if (current && typeof current === "object" && k in current) {
          current = current[k];
        } else {
          // Fallback to English if missing in Hindi
          let fallbackVal: any = translations.en;
          for (const fbK of keys) {
            if (fallbackVal && typeof fallbackVal === "object" && fbK in fallbackVal) {
              fallbackVal = fallbackVal[fbK];
            } else {
              fallbackVal = null;
              break;
            }
          }
          return typeof fallbackVal === "string" ? fallbackVal : fallback || key;
        }
      }

      return typeof current === "string" ? current : fallback || key;
    },
    [locale]
  );

  const value = useMemo(
    () => ({ locale, setLocale, toggleLocale, t }),
    [locale, setLocale, toggleLocale, t]
  );

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
