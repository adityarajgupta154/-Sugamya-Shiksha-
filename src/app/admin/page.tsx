"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Tabs } from "@/components/ui/Tabs";
import {
  Lock,
  LogOut,
  FileText,
  Home,
  Building2,
  ClipboardList,
  FolderDown,
  ClipboardCheck,
  ShieldAlert,
  Heart,
  ArrowLeftRight,
} from "lucide-react";
import dynamic from "next/dynamic";

const tabLoading = (name: string) => {
  const TabLoading = () => (
    <div className="p-8 text-center text-slate-500 flex items-center justify-center gap-2" role="status">
      <div className="w-5 h-5 border-2 border-teal-600 border-t-transparent rounded-full animate-spin" />
      <span className="text-sm font-semibold">Loading {name}...</span>
    </div>
  );
  TabLoading.displayName = `TabLoading(${name})`;
  return TabLoading;
};

const GuidelinesAdminTab = dynamic(
  () => import("@/components/admin/GuidelinesAdminTab").then((m) => m.GuidelinesAdminTab),
  { loading: tabLoading("Guidelines") }
);
const SiteContentAdminTab = dynamic(
  () => import("@/components/admin/SiteContentAdminTab").then((m) => m.SiteContentAdminTab),
  { loading: tabLoading("Site Content") }
);
const SchoolsAdminTab = dynamic(
  () => import("@/components/admin/SchoolsAdminTab").then((m) => m.SchoolsAdminTab),
  { loading: tabLoading("Schools") }
);
const SurveysAdminTab = dynamic(
  () => import("@/components/admin/SurveysAdminTab").then((m) => m.SurveysAdminTab),
  { loading: tabLoading("Surveys") }
);
const ResourcesHubTab = dynamic(
  () => import("@/components/admin/ResourcesHubTab").then((m) => m.ResourcesHubTab),
  { loading: tabLoading("Resources & Hub") }
);
const AuditsAdminTab = dynamic(
  () => import("@/components/admin/AuditsAdminTab").then((m) => m.AuditsAdminTab),
  { loading: tabLoading("Audits") }
);
const BarrierReportsAdminTab = dynamic(
  () => import("@/components/admin/BarrierReportsAdminTab").then((m) => m.BarrierReportsAdminTab),
  { loading: tabLoading("Barrier Reports") }
);
const CommunityVoicesAdvocacyTab = dynamic(
  () => import("@/components/admin/CommunityVoicesAdvocacyTab").then((m) => m.CommunityVoicesAdvocacyTab),
  { loading: tabLoading("Voices & Advocacy") }
);
const TrackerAdminTab = dynamic(
  () => import("@/components/admin/TrackerAdminTab").then((m) => m.TrackerAdminTab),
  { loading: tabLoading("Tracker") }
);

export default function AdminDashboardPage() {
  const router = useRouter();
  const { user, isAdmin, loading, signOut } = useAuth();
  const { locale } = useLanguage();

  const isHindi = locale === "hi";

  const handleLogout = async () => {
    await signOut();
    router.push("/admin/login");
  };

  // Auth Protection Check — Render page shell and skeleton immediately
  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
          <div className="space-y-2">
            <div className="h-8 w-64 bg-slate-200 rounded-lg animate-pulse" />
            <div className="h-4 w-96 bg-slate-100 rounded-md animate-pulse" />
          </div>
          <div className="h-10 w-32 bg-slate-200 rounded-lg animate-pulse" />
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="h-28 bg-slate-100 border border-slate-200 rounded-2xl animate-pulse" />
          <div className="h-28 bg-slate-100 border border-slate-200 rounded-2xl animate-pulse" />
          <div className="h-28 bg-slate-100 border border-slate-200 rounded-2xl animate-pulse" />
          <div className="h-28 bg-slate-100 border border-slate-200 rounded-2xl animate-pulse" />
        </div>
        <div className="h-96 bg-slate-100 border border-slate-200 rounded-2xl animate-pulse" />
      </div>
    );
  }

  if (!user || !isAdmin) {
    return (
      <div className="max-w-md mx-auto py-20 px-4 text-center space-y-5">
        <div className="w-16 h-16 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto">
          <Lock className="w-8 h-8" aria-hidden="true" />
        </div>
        <h1 className="text-2xl font-bold text-navy-800">
          {isHindi ? "पहुंच अस्वीकृत (Access Denied)" : "Access Denied"}
        </h1>
        <p className="text-sm text-slate-600">
          {isHindi
            ? "यह क्षेत्र केवल अधिकृत शोधकर्ताओं एवं व्यवस्थापकों के लिए सुरक्षित है।"
            : "This administrative area is restricted to authorized fellowship research staff."}
        </p>
        <Link href="/admin/login">
          <Button variant="primary">
            {isHindi ? "एडमिन लॉगिन पेज पर जाएँ" : "Go to Admin Login"}
          </Button>
        </Link>
      </div>
    );
  }

  // Admin Tabs Structure
  const adminTabs = [
    {
      id: "guidelines",
      label: (
        <span className="flex items-center gap-2">
          <FileText className="w-4 h-4 text-teal-600" aria-hidden="true" />
          <span>{isHindi ? "दिशानिर्देश प्रबंधन (9)" : "Guidelines (9)"}</span>
        </span>
      ),
      content: <GuidelinesAdminTab isHindi={isHindi} />,
    },
    {
      id: "siteContent",
      label: (
        <span className="flex items-center gap-2">
          <Home className="w-4 h-4 text-navy-700" aria-hidden="true" />
          <span>{isHindi ? "साइट सामग्री (Site Content)" : "Site Content"}</span>
        </span>
      ),
      content: <SiteContentAdminTab isHindi={isHindi} />,
    },
    {
      id: "schools",
      label: (
        <span className="flex items-center gap-2">
          <Building2 className="w-4 h-4 text-teal-600" aria-hidden="true" />
          <span>{isHindi ? "विद्यालय प्रबंधन" : "Schools"}</span>
        </span>
      ),
      content: <SchoolsAdminTab isHindi={isHindi} />,
    },
    {
      id: "surveys",
      label: (
        <span className="flex items-center gap-2">
          <ClipboardList className="w-4 h-4 text-teal-600" aria-hidden="true" />
          <span>{isHindi ? "समुदाय सर्वेक्षण डेटा" : "Community Surveys"}</span>
        </span>
      ),
      content: <SurveysAdminTab />,
    },
    {
      id: "resourcesHub",
      label: (
        <span className="flex items-center gap-2">
          <FolderDown className="w-4 h-4 text-teal-600" aria-hidden="true" />
          <span>{isHindi ? "संसाधन व हब (Resources)" : "Resources & Hub"}</span>
        </span>
      ),
      content: <ResourcesHubTab isHindi={isHindi} />,
    },
    {
      id: "auditTool",
      label: (
        <span className="flex items-center gap-2">
          <ClipboardCheck className="w-4 h-4 text-teal-600" aria-hidden="true" />
          <span>{isHindi ? "ऑडिट टूल एवं मानक" : "Audit Tool & Standards"}</span>
        </span>
      ),
      content: <AuditsAdminTab isHindi={isHindi} />,
    },
    {
      id: "barriers",
      label: (
        <span className="flex items-center gap-2">
          <ShieldAlert className="w-4 h-4 text-teal-600" aria-hidden="true" />
          <span>{isHindi ? "बाधा रिपोर्ट समीक्षा" : "Barrier Reports"}</span>
        </span>
      ),
      content: <BarrierReportsAdminTab isHindi={isHindi} />,
    },
    {
      id: "voicesAdvocacy",
      label: (
        <span className="flex items-center gap-2">
          <Heart className="w-4 h-4 text-rose-500" aria-hidden="true" />
          <span>{isHindi ? "आवाज़ें व अभियान" : "Voices & Campaign"}</span>
        </span>
      ),
      content: <CommunityVoicesAdvocacyTab isHindi={isHindi} />,
    },
    {
      id: "tracker",
      label: (
        <span className="flex items-center gap-2">
          <ArrowLeftRight className="w-4 h-4 text-teal-600" aria-hidden="true" />
          <span>{isHindi ? "सुधार ट्रैकर (PRD 6.2-E)" : "Before/After Tracker"}</span>
        </span>
      ),
      content: <TrackerAdminTab isHindi={isHindi} />,
    },
  ];

  return (
    <div className="flex flex-col w-full py-8 px-4 sm:px-8 max-w-7xl mx-auto space-y-8">
      {/* Top Admin Status Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl bg-navy-900 text-white shadow-sm border border-navy-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-teal-600 flex items-center justify-center font-bold text-white shadow-xs">
            एड
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-bold leading-none">
                {isHindi ? "सुगम्य शिक्षा बिहार • व्यवस्थापक पोर्टल" : "Admin Management Portal"}
              </h1>
              <Badge variant="verified" className="text-[10px] bg-emerald-950 text-emerald-300 border-emerald-600">
                Verified Admin
              </Badge>
            </div>
            <p className="text-xs text-teal-300 font-mono mt-1">
              {user?.email || "admin@sugamyashikshabihar.org"}
            </p>
          </div>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={handleLogout}
          leftIcon={<LogOut className="w-4 h-4" />}
          className="text-white border-white/20 hover:bg-white/10"
        >
          {isHindi ? "लॉगआउट" : "Sign Out"}
        </Button>
      </div>

      {/* Main Admin Tab Controls */}
      <Tabs
        tabs={adminTabs}
        defaultTab="guidelines"
        ariaLabel="Admin management areas"
      />
    </div>
  );
}
