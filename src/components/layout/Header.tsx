"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLanguage } from "@/context/LanguageContext";
import { useAccessibility } from "@/context/AccessibilityContext";
import { SugamyaLogo } from "./SugamyaLogo";
import {
  Home,
  School,
  FileText,
  BarChart2,
  Users,
  MapPin,
  Megaphone,
  Image as ImageIcon,
  BookOpen,
  Info,
  ChevronRight,
  Settings,
  ChevronDown,
  Menu,
  X,
  Contrast,
  Languages,
} from "lucide-react";

export function Header() {
  const { locale, setLocale, t } = useLanguage();
  const { textScale, setTextScale, highContrast, toggleHighContrast } =
    useAccessibility();

  const [settingsOpen, setSettingsOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [navigatingTo, setNavigatingTo] = useState<string | null>(null);
  const pathname = usePathname();

  // Reset navigating state when pathname changes and close mobile menu
  useEffect(() => {
    setNavigatingTo(null);
    setMobileMenuOpen(false);
    setSettingsOpen(false);
    setMoreOpen(false);
  }, [pathname]);

  // Lock body scroll without layout shift when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [mobileMenuOpen]);

  const settingsRef = useRef<HTMLDivElement>(null);
  const settingsBtnRef = useRef<HTMLButtonElement>(null);
  const moreRef = useRef<HTMLDivElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);

  // Close menus on click outside or Escape key
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const target = event.target as Node;
      if (settingsRef.current && !settingsRef.current.contains(target)) {
        setSettingsOpen(false);
      }
      if (moreRef.current && !moreRef.current.contains(target)) {
        setMoreOpen(false);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        if (settingsOpen) {
          setSettingsOpen(false);
          settingsBtnRef.current?.focus();
        }
        if (moreOpen) {
          setMoreOpen(false);
        }
        if (mobileMenuOpen) {
          setMobileMenuOpen(false);
        }
      }
    }

    if (settingsOpen || moreOpen || mobileMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [settingsOpen, moreOpen, mobileMenuOpen]);

  // Primary 5 Desktop Nav Tabs
  const primaryNavItems = [
    { href: "/", label: t("nav.home", "Home"), icon: Home },
    { href: "/schools", label: t("nav.directory", "School Directory"), icon: School },
    { href: "/guidelines", label: t("nav.guidelines", "Guidelines"), icon: FileText },
    { href: "/reports", label: t("nav.dashboard", "Research"), icon: BarChart2 },
    { href: "/inclusive-education", label: t("nav.inclusive", "Inclusive Education"), icon: Users },
  ];

  // Secondary 5 Items inside "More" dropdown
  const moreNavItems = [
    { href: "/map", label: t("nav.map", "School Map"), icon: MapPin },
    { href: "/report-barrier", label: t("nav.reportBarrier", "Report a Barrier"), icon: Megaphone },
    { href: "/learn-accessibility", label: t("nav.visualGuide", "Visual Guide"), icon: ImageIcon },
    { href: "/resources", label: t("nav.resources", "Resource Centre"), icon: BookOpen },
    { href: "/about", label: t("nav.about", "About & Contact"), icon: Info },
  ];

  return (
    <header className="w-full bg-white border-b border-slate-100 sticky top-0 z-50 shadow-xs transition-colors">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-14 sm:h-16 lg:h-20 flex items-center justify-between gap-2 sm:gap-4">
        {/* Left Side: Brand Logo (Responsive with min-w-0 for small viewports) */}
        <div className="min-w-0 flex-1 lg:flex-initial shrink mr-1 sm:mr-0">
          <SugamyaLogo />
        </div>

        {/* Center: 5 Primary Desktop Nav Tabs (>= 1024px) */}
        <nav
          className="hidden lg:flex items-center gap-1 xl:gap-2"
          aria-label="Main Navigation"
        >
          {primaryNavItems.map((item) => {
            const isActive =
              item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
            const Icon = item.icon;
            const isTarget = navigatingTo === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                prefetch={true}
                onClick={() => React.startTransition(() => setNavigatingTo(item.href))}
                aria-busy={isTarget}
                className={`flex flex-col items-center justify-center gap-0.5 xl:gap-1 px-2.5 xl:px-3.5 py-1.5 rounded-xl transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-600 ${
                  isActive
                    ? "bg-[#E6F7F2] text-[#078F8A] font-bold"
                    : isTarget
                    ? "bg-teal-50 text-[#078F8A] opacity-80"
                    : "text-slate-700 hover:text-[#0B2D52] hover:bg-slate-50 font-semibold"
                }`}
                aria-current={isActive ? "page" : undefined}
              >
                <Icon
                  className={`w-4 h-4 xl:w-5 xl:h-5 transition-colors ${
                    isActive ? "text-[#078F8A] stroke-[2.3]" : "text-slate-600 stroke-[2]"
                  }`}
                  aria-hidden="true"
                />
                <span className="text-[11px] xl:text-xs leading-none whitespace-nowrap">
                  {item.label}
                </span>
              </Link>
            );
          })}
        </nav>

        {/* Right Side: Language Toggle + Settings + More (or Mobile Hamburger) */}
        <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
          {/* Subtle Vertical Divider on Desktop */}
          <div
            className="hidden lg:block h-6 w-px bg-slate-200 mx-1"
            aria-hidden="true"
          />

          {/* Direct Language Toggle Button (Always visible without opening Settings) */}
          <button
            type="button"
            onClick={() =>
              React.startTransition(() => setLocale(locale === "hi" ? "en" : "hi"))
            }
            aria-label={
              locale === "hi"
                ? "Switch language to English"
                : "वेबसाइट की भाषा हिन्दी में बदलें"
            }
            className="shrink-0 h-9 sm:h-10 px-2 sm:px-2.5 rounded-full border border-slate-200/90 bg-white hover:bg-slate-50 text-[11px] sm:text-xs font-bold text-[#0B2D52] shadow-2xs transition-colors flex items-center justify-center gap-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-600 min-w-[44px] min-h-[44px] cursor-pointer"
          >
            <span
              className={
                locale === "hi" ? "font-black text-[#078F8A]" : "text-slate-400 font-medium"
              }
            >
              हि
            </span>
            <span className="text-slate-300 mx-0.5" aria-hidden="true">
              /
            </span>
            <span
              className={
                locale === "en" ? "font-black text-[#078F8A]" : "text-slate-400 font-medium"
              }
            >
              EN
            </span>
          </button>

          {/* Settings Button (Compact icon-only on mobile <640px; pill on >=640px) */}
          <div className="relative" ref={settingsRef}>
            <button
              ref={settingsBtnRef}
              type="button"
              onClick={() => {
                setSettingsOpen(!settingsOpen);
                setMoreOpen(false);
              }}
              aria-expanded={settingsOpen}
              aria-haspopup="dialog"
              aria-label={t("a11y.accessibilityMenu", "Accessibility and Display Settings")}
              className="flex items-center justify-center gap-1.5 bg-[#0B2D52] hover:bg-[#07213d] text-white p-2 sm:px-3.5 sm:py-2 rounded-full text-xs sm:text-sm font-bold shadow-xs transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-400 focus-visible:ring-offset-2 cursor-pointer active:scale-95 h-9 sm:h-10 min-w-[44px] min-h-[44px] shrink-0"
            >
              <Settings className="w-4 h-4 text-white" aria-hidden="true" />
              <span className="hidden sm:inline">Settings</span>
              <ChevronDown
                className={`hidden sm:inline w-3.5 h-3.5 transition-transform duration-200 ${
                  settingsOpen ? "rotate-180" : ""
                }`}
                aria-hidden="true"
              />
            </button>

            {/* Dropdown Floating Card */}
            {settingsOpen && (
              <div
                role="dialog"
                aria-label="Display & Accessibility Settings"
                className="absolute right-0 top-full mt-2 w-72 sm:w-80 bg-white rounded-2xl shadow-2xl border border-slate-100 p-4 sm:p-5 z-50 animate-in fade-in zoom-in-95 duration-150 space-y-4 text-slate-800"
              >
                {/* 1. Text Size */}
                <div className="space-y-1.5">
                  <span className="text-xs font-bold text-slate-700 block uppercase tracking-wider">
                    {locale === "hi" ? "अक्षर का आकार (Text Size)" : "Text Size"}
                  </span>
                  <div
                    className="grid grid-cols-3 gap-2 bg-slate-100/80 p-1 rounded-xl"
                    role="group"
                    aria-label="Text Size options"
                  >
                    <button
                      type="button"
                      onClick={() => setTextScale("normal")}
                      aria-pressed={textScale === "normal"}
                      className={`min-h-[44px] py-1.5 px-3 rounded-lg text-xs font-bold transition-colors ${
                        textScale === "normal"
                          ? "bg-[#078F8A] text-white shadow-xs"
                          : "text-slate-600 hover:text-navy-900 hover:bg-white/60"
                      }`}
                    >
                      A
                    </button>
                    <button
                      type="button"
                      onClick={() => setTextScale("large")}
                      aria-pressed={textScale === "large"}
                      className={`min-h-[44px] py-1.5 px-3 rounded-lg text-xs font-bold transition-colors ${
                        textScale === "large"
                          ? "bg-[#078F8A] text-white shadow-xs"
                          : "text-slate-600 hover:text-navy-900 hover:bg-white/60"
                      }`}
                    >
                      A+
                    </button>
                    <button
                      type="button"
                      onClick={() => setTextScale("xlarge")}
                      aria-pressed={textScale === "xlarge"}
                      className={`min-h-[44px] py-1.5 px-3 rounded-lg text-xs font-bold transition-colors ${
                        textScale === "xlarge"
                          ? "bg-[#078F8A] text-white shadow-xs"
                          : "text-slate-600 hover:text-navy-900 hover:bg-white/60"
                      }`}
                    >
                      A++
                    </button>
                  </div>
                </div>

                {/* 2. Contrast */}
                <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Contrast className="w-4 h-4 text-slate-600" aria-hidden="true" />
                    <span className="text-xs font-bold text-slate-700">
                      {locale === "hi" ? "हाई कंट्रास्ट (High Contrast)" : "High Contrast"}
                    </span>
                  </div>
                  <button
                    type="button"
                    role="switch"
                    aria-checked={highContrast}
                    onClick={toggleHighContrast}
                    aria-label={
                      highContrast
                        ? "Turn off high contrast mode"
                        : "Turn on high contrast mode"
                    }
                    className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-600 ${
                      highContrast ? "bg-[#078F8A]" : "bg-slate-200"
                    }`}
                  >
                    <span
                      aria-hidden="true"
                      className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                        highContrast ? "translate-x-5" : "translate-x-0"
                      }`}
                    />
                  </button>
                </div>

                {/* 3. Language Selector */}
                <div className="pt-2 border-t border-slate-100 space-y-1.5">
                  <div className="flex items-center gap-2 mb-1">
                    <Languages className="w-4 h-4 text-slate-600" aria-hidden="true" />
                    <span className="text-xs font-bold text-slate-700">
                      {locale === "hi" ? "भाषा (Language)" : "Language"}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 bg-slate-100/80 p-1 rounded-xl">
                    <button
                      type="button"
                      onClick={() => setLocale("hi")}
                      aria-pressed={locale === "hi"}
                      className={`min-h-[44px] py-1.5 px-3 rounded-lg text-xs font-bold transition-colors ${
                        locale === "hi"
                          ? "bg-[#078F8A] text-white shadow-xs"
                          : "text-slate-600 hover:text-navy-900 hover:bg-white/60"
                      }`}
                    >
                      हिन्दी
                    </button>
                    <button
                      type="button"
                      onClick={() => setLocale("en")}
                      aria-pressed={locale === "en"}
                      className={`min-h-[44px] py-1.5 px-3 rounded-lg text-xs font-bold transition-colors ${
                        locale === "en"
                          ? "bg-[#078F8A] text-white shadow-xs"
                          : "text-slate-600 hover:text-navy-900 hover:bg-white/60"
                      }`}
                    >
                      English
                    </button>
                  </div>
                </div>

                {/* 4. Tagline Card */}
                <div className="pt-2 border-t border-slate-100">
                  <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-3 text-center">
                    <span className="text-xs font-black text-[#0B2D52] block tracking-tight">
                      Accessible Schools
                    </span>
                    <span className="text-[11px] font-bold text-teal-700 block tracking-wider">
                      Inclusive Futures
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Desktop "More" Circular Button & Floating Dropdown (>= 1024px) */}
          <div className="hidden lg:block relative" ref={moreRef}>
            <button
              type="button"
              onClick={() => {
                setMoreOpen(!moreOpen);
                setSettingsOpen(false);
              }}
              aria-expanded={moreOpen}
              aria-haspopup="menu"
              aria-label="Open additional navigation items"
              className={`w-9 h-9 xl:w-10 xl:h-10 rounded-full flex flex-col items-center justify-center gap-0.5 transition-colors cursor-pointer shadow-2xs ${
                moreOpen
                  ? "bg-[#0B2D52] text-white"
                  : "bg-slate-100 hover:bg-slate-200 text-[#0B2D52]"
              }`}
            >
              <Menu className="w-4 h-4 stroke-[2.4]" aria-hidden="true" />
              <span className="text-[9px] font-bold leading-none">More</span>
            </button>

            {/* Floating "More" Dropdown Menu */}
            {moreOpen && (
              <div
                role="menu"
                aria-label="More navigation links"
                className="absolute right-0 top-full mt-2 w-64 bg-white rounded-2xl shadow-xl border border-slate-100 py-2 z-50 animate-in fade-in zoom-in-95 duration-150"
              >
                <div className="space-y-0.5">
                  {moreNavItems.map((item) => {
                    const isActive = pathname.startsWith(item.href);
                    const Icon = item.icon;
                    const isTarget = navigatingTo === item.href;

                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        prefetch={true}
                        onClick={() => {
                          setMoreOpen(false);
                          React.startTransition(() => setNavigatingTo(item.href));
                        }}
                        aria-busy={isTarget}
                        className={`flex items-center justify-between px-4 py-2.5 transition-colors duration-150 group ${
                          isActive
                            ? "bg-[#E6F7F2] text-[#078F8A] font-bold"
                            : isTarget
                            ? "bg-teal-50 text-[#078F8A] opacity-80"
                            : "text-[#0B2D52] hover:bg-slate-50 font-semibold"
                        }`}
                        role="menuitem"
                      >
                        <div className="flex items-center gap-3">
                          <Icon
                            className={`w-4 h-4 transition-colors duration-150 ${
                              isActive
                                ? "text-[#078F8A]"
                                : "text-[#0B2D52] group-hover:text-[#078F8A]"
                            }`}
                            aria-hidden="true"
                          />
                          <span
                            className={`text-sm ${
                              isActive
                                ? "text-[#078F8A]"
                                : "text-[#0B2D52] group-hover:text-[#078F8A]"
                            }`}
                          >
                            {item.label}
                          </span>
                        </div>
                        <ChevronRight
                          className="w-4 h-4 text-slate-400 group-hover:text-[#078F8A] group-hover:translate-x-0.5 transition-transform duration-150"
                          aria-hidden="true"
                        />
                      </Link>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Mobile Hamburger Button (Always visible on mobile < 1024px) */}
          <button
            type="button"
            onClick={() => {
              setMobileMenuOpen(!mobileMenuOpen);
              setSettingsOpen(false);
            }}
            aria-expanded={mobileMenuOpen}
            aria-label={mobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
            className="lg:hidden shrink-0 w-9 h-9 sm:w-10 sm:h-10 min-w-[44px] min-h-[44px] rounded-full bg-slate-100 hover:bg-slate-200 text-[#0B2D52] flex items-center justify-center transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-600 active:scale-95"
          >
            {mobileMenuOpen ? (
              <X className="w-5 h-5" aria-hidden="true" />
            ) : (
              <Menu className="w-5 h-5" aria-hidden="true" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Drawer (Full-width, 44x44px tap targets, accessible) */}
      {mobileMenuOpen && (
        <div
          ref={mobileMenuRef}
          role="dialog"
          aria-modal="true"
          aria-label="Mobile Navigation Menu"
          className="lg:hidden fixed inset-0 top-14 sm:top-16 z-40 bg-navy-950/75 flex flex-col justify-start animate-in fade-in duration-150"
        >
          <div className="bg-white border-b border-slate-200 p-4 sm:p-5 shadow-2xl max-h-[calc(100svh-4rem)] overflow-y-auto space-y-1.5">
            <div className="text-xs font-bold text-slate-500 uppercase tracking-wider px-3 py-1">
              {locale === "hi" ? "नेविगेशन मेन्यू" : "Navigation Menu"}
            </div>

            {[...primaryNavItems, ...moreNavItems].map((item) => {
              const isActive =
                item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
              const Icon = item.icon;
              const isTarget = navigatingTo === item.href;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  prefetch={true}
                  onClick={() => {
                    setMobileMenuOpen(false);
                    React.startTransition(() => setNavigatingTo(item.href));
                  }}
                  aria-busy={isTarget}
                  className={`flex items-center justify-between px-3.5 py-3 rounded-xl min-h-[44px] transition-colors duration-150 ${
                    isActive
                      ? "bg-[#E6F7F2] text-[#078F8A] font-bold"
                      : isTarget
                      ? "bg-teal-50 text-[#078F8A] opacity-80"
                      : "text-slate-800 hover:bg-slate-50 font-semibold"
                  }`}
                  aria-current={isActive ? "page" : undefined}
                >
                  <div className="flex items-center gap-3">
                    <Icon
                      className={`w-5 h-5 ${
                        isActive ? "text-[#078F8A]" : "text-slate-500"
                      }`}
                      aria-hidden="true"
                    />
                    <span className="text-sm">{item.label}</span>
                  </div>
                  <ChevronRight
                    className={`w-4 h-4 ${
                      isActive ? "text-[#078F8A]" : "text-slate-400"
                    }`}
                    aria-hidden="true"
                  />
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </header>
  );
}
