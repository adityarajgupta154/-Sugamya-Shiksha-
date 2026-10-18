"use client";

import React, { useState, useEffect } from "react";
import { db } from "@/lib/firebase/firestore";
import { doc, getDoc, setDoc } from "firebase/firestore";
import {
  ScoringConfig,
  DEFAULT_SCORING_CONFIG,
  ScoreCategoryKey,
  ScoreCategoryConfig,
} from "@/data/scoringConfigData";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input, Textarea } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import {
  Scale,
  Save,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  Info,
  Award,
  Maximize2,
  Droplets,
  BookOpen,
  ShieldAlert,
} from "lucide-react";

interface ScoringConfigTabProps {
  isHindi: boolean;
}

export function ScoringConfigTab({ isHindi }: ScoringConfigTabProps) {
  const [config, setConfig] = useState<ScoringConfig>(DEFAULT_SCORING_CONFIG);
  const [isSaving, setIsSaving] = useState(false);
  const [statusMsg, setStatusMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Load from Firestore
  useEffect(() => {
    async function loadConfig() {
      if (!db) return;
      try {
        const snap = await getDoc(doc(db, "scoringConfig", "v1"));
        if (snap.exists()) {
          setConfig(snap.data() as ScoringConfig);
        }
      } catch (err) {
        console.warn("Using default scoring config fallback:", err);
      }
    }
    loadConfig();
  }, []);

  // Compute total weight
  const totalWeight = Object.values(config.categories).reduce(
    (sum, cat) => sum + (Number(cat.weight) || 0),
    0
  );

  const isTotal100 = totalWeight === 100;

  // Handle category weight change
  const handleWeightChange = (key: ScoreCategoryKey, val: number) => {
    setConfig((prev) => ({
      ...prev,
      categories: {
        ...prev.categories,
        [key]: {
          ...prev.categories[key],
          weight: val,
        },
      },
    }));
  };

  // Handle category field change
  const handleCategoryFieldChange = (
    key: ScoreCategoryKey,
    field: "name_hi" | "name_en" | "description_hi" | "description_en",
    val: string
  ) => {
    setConfig((prev) => ({
      ...prev,
      categories: {
        ...prev.categories,
        [key]: {
          ...prev.categories[key],
          [field]: val,
        },
      },
    }));
  };

  // Save to Firestore
  const handleSave = async () => {
    if (!isTotal100) {
      setStatusMsg({
        type: "error",
        text: isHindi
          ? `श्रेणी भारों का कुल योग 100 अंक होना चाहिए (वर्तमान: ${totalWeight} अंक)।`
          : `Total category weights must sum to exactly 100 points (current: ${totalWeight}).`,
      });
      return;
    }

    setIsSaving(true);
    try {
      const updatedConfig: ScoringConfig = {
        ...config,
        updatedAt: new Date().toISOString(),
        updatedBy: "Admin",
      };

      if (db) {
        await setDoc(doc(db, "scoringConfig", "v1"), updatedConfig);
      }

      setConfig(updatedConfig);
      setStatusMsg({
        type: "success",
        text: isHindi
          ? "स्कोरिंग विन्यास और भार सफलतापूर्वक सहेजे गए!"
          : "Scoring configuration and pillar weights saved successfully!",
      });
      setTimeout(() => setStatusMsg(null), 4000);
    } catch (err: any) {
      setStatusMsg({
        type: "error",
        text: `Save failed: ${err.message}`,
      });
    } finally {
      setIsSaving(false);
    }
  };

  // Reset to default
  const handleReset = () => {
    if (
      confirm(
        isHindi
          ? "क्या आप स्कोरिंग नियमों को डिफ़ॉल्ट मानों पर रीसेट करना चाहते हैं?"
          : "Reset scoring configuration to default confirmed values?"
      )
    ) {
      setConfig(DEFAULT_SCORING_CONFIG);
      setStatusMsg({
        type: "success",
        text: isHindi ? "डिफ़ॉल्ट मान पुनर्स्थापित।" : "Default values restored.",
      });
      setTimeout(() => setStatusMsg(null), 3000);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header Card */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-xl bg-slate-50 border border-slate-200">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Scale className="w-5 h-5 text-teal-700" aria-hidden="true" />
            <h3 className="font-bold text-navy-900 text-lg">
              {isHindi ? "स्कोरिंग विन्यास एवं स्तंभ भार (100-Point Weights)" : "100-Point Scoring Weights & Rules"}
            </h3>
          </div>
          <p className="text-xs text-slate-500">
            {isHindi
              ? "विद्यालयों के 100-अंकीय स्कोर हेतु 4 स्तंभों का भार एवं मूल्यांकन नियम विन्यास (PRD 6.2-C)"
              : "Administer dynamic pillar weights, tier thresholds, and research methodology copy"}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={handleReset}
            leftIcon={<RotateCcw className="w-3.5 h-3.5 text-slate-500" />}
            className="text-xs"
          >
            {isHindi ? "डिफ़ॉल्ट रीसेट" : "Reset Defaults"}
          </Button>

          <Button
            variant="secondary"
            size="sm"
            onClick={handleSave}
            isLoading={isSaving}
            leftIcon={<Save className="w-3.5 h-3.5" />}
            className="text-xs font-bold"
          >
            {isHindi ? "परिवर्तन सहेजें" : "Save Scoring Config"}
          </Button>
        </div>
      </div>

      {/* Status Alert */}
      {statusMsg && (
        <div
          className={`p-3.5 rounded-lg border text-xs font-semibold flex items-center gap-2 ${
            statusMsg.type === "success"
              ? "bg-emerald-50 text-emerald-800 border-emerald-300"
              : "bg-rose-50 text-rose-800 border-rose-300"
          }`}
        >
          {statusMsg.type === "success" ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          ) : (
            <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
          )}
          <span>{statusMsg.text}</span>
        </div>
      )}

      {/* Weight Summary Indicator Bar */}
      <div className="p-4 rounded-xl border border-slate-200 bg-white shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
            {isHindi ? "कुल भार संतुलन (Total Weights Balance)" : "Total Weights Sum"}
          </span>
          <span
            className={`text-xs font-black px-2.5 py-1 rounded-full border ${
              isTotal100
                ? "bg-emerald-50 text-emerald-800 border-emerald-300"
                : "bg-rose-50 text-rose-800 border-rose-300"
            }`}
          >
            {totalWeight} / 100 {isHindi ? "अंक" : "pts"}{" "}
            {isTotal100 ? "✓ (Balanced)" : "✕ (Must equal 100)"}
          </span>
        </div>

        <div className="w-full h-3 rounded-full bg-slate-100 overflow-hidden flex">
          {(Object.keys(config.categories) as ScoreCategoryKey[]).map((key) => {
            const cat = config.categories[key];
            const color =
              key === "entrance"
                ? "bg-teal-600"
                : key === "toilets"
                ? "bg-sky-600"
                : key === "classrooms"
                ? "bg-amber-600"
                : "bg-emerald-700";
            return (
              <div
                key={key}
                style={{ width: `${(cat.weight / (totalWeight || 1)) * 100}%` }}
                className={`${color} transition-all duration-300`}
                title={`${cat.name_en}: ${cat.weight} pts`}
              />
            );
          })}
        </div>
      </div>

      {/* 4 Category Pillar Weight Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {(Object.keys(config.categories) as ScoreCategoryKey[]).map((catKey) => {
          const cat = config.categories[catKey];
          return (
            <Card key={catKey} className="border-slate-200 p-4 space-y-4 shadow-xs">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  {catKey === "entrance" && <Maximize2 className="w-4 h-4 text-teal-700" />}
                  {catKey === "toilets" && <Droplets className="w-4 h-4 text-teal-700" />}
                  {catKey === "classrooms" && <BookOpen className="w-4 h-4 text-teal-700" />}
                  {catKey === "safety" && <ShieldAlert className="w-4 h-4 text-teal-700" />}
                  <h4 className="font-bold text-sm text-navy-900">
                    {cat.name_en}
                  </h4>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-semibold text-slate-500">
                    {isHindi ? "भार:" : "Weight:"}
                  </span>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={cat.weight}
                    onChange={(e) => handleWeightChange(catKey, Number(e.target.value) || 0)}
                    className="w-16 h-8 text-center font-bold text-sm rounded border border-slate-300 focus:border-teal-600 focus:ring-1 focus:ring-teal-600"
                    aria-label={`${cat.name_en} weight points`}
                  />
                  <span className="text-xs text-slate-400 font-bold">pts</span>
                </div>
              </div>

              <div className="space-y-3">
                <Input
                  label={isHindi ? "श्रेणी नाम (हिंदी)" : "Category Name (Hindi)"}
                  value={cat.name_hi}
                  onChange={(e) => handleCategoryFieldChange(catKey, "name_hi", e.target.value)}
                  className="text-xs"
                />
                <Input
                  label={isHindi ? "श्रेणी नाम (अंग्रेज़ी)" : "Category Name (English)"}
                  value={cat.name_en}
                  onChange={(e) => handleCategoryFieldChange(catKey, "name_en", e.target.value)}
                  className="text-xs"
                />
                <Textarea
                  label={isHindi ? "विवरण (हिंदी)" : "Description (Hindi)"}
                  rows={2}
                  value={cat.description_hi}
                  onChange={(e) => handleCategoryFieldChange(catKey, "description_hi", e.target.value)}
                  className="text-xs"
                />
                <Textarea
                  label={isHindi ? "विवरण (अंग्रेज़ी)" : "Description (English)"}
                  rows={2}
                  value={cat.description_en}
                  onChange={(e) => handleCategoryFieldChange(catKey, "description_en", e.target.value)}
                  className="text-xs"
                />
              </div>

              <div className="pt-2 border-t border-slate-100 text-[11px] text-slate-500">
                <span className="font-semibold">{isHindi ? "मानक श्रेणियां" : "Mapped Standards"}: </span>
                <span>{cat.standardCategories.join(", ")}</span>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Mandatory Disclaimer & Notice Customization */}
      <Card className="border-slate-200 p-5 space-y-4">
        <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
          <AlertTriangle className="w-4 h-4 text-amber-600" />
          <h4 className="font-bold text-sm text-navy-900">
            {isHindi ? "अनिवार्य शोध प्रकटीकरण कॉपी" : "Mandatory Research Disclaimers"}
          </h4>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Textarea
            label={isHindi ? "प्रकटीकरण (हिंदी)" : "Research Notice (Hindi)"}
            rows={2}
            value={config.disclaimer_hi}
            onChange={(e) => setConfig((p) => ({ ...p, disclaimer_hi: e.target.value }))}
            className="text-xs"
          />
          <Textarea
            label={isHindi ? "प्रकटीकरण (अंग्रेज़ी)" : "Research Notice (English)"}
            rows={2}
            value={config.disclaimer_en}
            onChange={(e) => setConfig((p) => ({ ...p, disclaimer_en: e.target.value }))}
            className="text-xs"
          />
        </div>
      </Card>
    </div>
  );
}
