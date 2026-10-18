"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";
import dynamic from "next/dynamic";
import { Button } from "@/components/ui/Button";
import { ChevronLeft, ShieldCheck, Lock } from "lucide-react";

const AuditToolForm = dynamic(
  () => import("@/components/admin/AuditToolForm").then((mod) => mod.AuditToolForm),
  {
    loading: () => (
      <div className="flex items-center justify-center p-12 bg-white rounded-xl border border-slate-200">
        <div className="w-8 h-8 border-4 border-teal-600 border-t-transparent rounded-full animate-spin" />
      </div>
    ),
    ssr: false,
  }
);

export default function MobileAuditPage() {
  const router = useRouter();
  const { user, isAdmin, loading } = useAuth();
  const { locale } = useLanguage();
  const isHindi = locale === "hi";

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] py-20">
        <div className="flex flex-col items-center gap-3 text-navy-800">
          <div className="w-8 h-8 border-4 border-teal-600 border-t-transparent rounded-full animate-spin" />
          <span className="font-semibold text-sm">
            {isHindi ? "सत्र सत्यापन जारी है..." : "Verifying session..."}
          </span>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="max-w-md mx-auto my-12 p-6 bg-white rounded-xl border border-slate-200 text-center space-y-4">
        <div className="h-12 w-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto text-xl">
          <Lock className="w-6 h-6" />
        </div>
        <h1 className="text-xl font-bold text-navy-900">
          {isHindi ? "व्यवस्थापक पहुंच आवश्यक" : "Admin Authentication Required"}
        </h1>
        <p className="text-xs text-slate-600">
          {isHindi
            ? "स्मार्ट ऑडिट टूल केवल अधिकृत शोधकर्ताओं एवं व्यवस्थापकों के उपयोग हेतु आरक्षित है।"
            : "The Smart Audit Tool is strictly restricted to authorized researchers."}
        </p>
        <Link href="/admin/login">
          <Button size="sm" className="w-full">
            {isHindi ? "लॉगिन पृष्ठ पर जाएं" : "Go to Login"}
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-4 sm:py-8 px-3 sm:px-6">
      <div className="max-w-4xl mx-auto space-y-4">
        {/* Mobile Top Navigation */}
        <div className="flex items-center justify-between">
          <Link href="/admin">
            <Button variant="ghost" size="sm" leftIcon={<ChevronLeft className="w-4 h-4" />}>
              {isHindi ? "व्यवस्थापक डैशबोर्ड" : "Admin Dashboard"}
            </Button>
          </Link>

          <span className="text-xs text-slate-500 font-mono">
            {user?.email}
          </span>
        </div>

        {/* Audit Form Container */}
        <AuditToolForm isHindi={isHindi} />
      </div>
    </div>
  );
}
