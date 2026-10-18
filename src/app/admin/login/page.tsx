"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Lock, ShieldAlert, ArrowRight, CheckCircle2, KeyRound } from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();
  const { user, isAdmin, signIn, demoLogin } = useAuth();
  const { locale } = useLanguage();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isHindi = locale === "hi";

  useEffect(() => {
    if (user && isAdmin) {
      router.push("/admin");
    }
  }, [user, isAdmin, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email.trim() || !password.trim()) {
      setError(isHindi ? "कृपया ईमेल और पासवर्ड दोनों दर्ज करें" : "Both email and password are required");
      return;
    }

    setIsSubmitting(true);
    const res = await signIn(email.trim(), password);
    setIsSubmitting(false);

    if (res.success) {
      router.push("/admin");
    } else {
      setError(res.error || (isHindi ? "लॉगिन विफल। केवल अधिकृत शोधकर्ता ही लॉगिन कर सकते हैं।" : "Login failed. Only authorized research admins can log in."));
    }
  };

  const handleDemoSignIn = () => {
    demoLogin();
    router.push("/admin");
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[75vh] py-12 px-4 sm:px-6">
      <div className="w-full max-w-md space-y-6">
        {/* Important notice that public visitors don't need login */}
        <div className="p-4 rounded-xl bg-amber-50 border border-amber-300 text-amber-900 text-xs sm:text-sm flex items-start gap-3">
          <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" aria-hidden="true" />
          <div className="space-y-1">
            <p className="font-bold">
              {isHindi ? "केवल शोधकर्ता / व्यवस्थापक लॉगिन" : "Researcher / Admin Login Only"}
            </p>
            <p className="text-xs text-amber-800">
              {isHindi
                ? "सार्वजनिक उपयोगकर्ताओं को वेबसाइट देखने, दिशानिर्देश पढ़ने या बाधा रिपोर्ट करने के लिए किसी लॉगिन की आवश्यकता नहीं है।"
                : "Public visitors never need to log in to browse research, read guidelines, or report barriers."}
            </p>
          </div>
        </div>

        <Card as="section" aria-labelledby="admin-login-heading" className="p-6 sm:p-8 border-slate-200 shadow-lg bg-white">
          <CardHeader className="text-center space-y-2 border-b border-slate-100 pb-5">
            <div className="w-12 h-12 rounded-full bg-navy-800 text-teal-300 flex items-center justify-center mx-auto shadow-sm">
              <Lock className="w-6 h-6" aria-hidden="true" />
            </div>
            <CardTitle as="h1" id="admin-login-heading" className="text-2xl font-black text-navy-800">
              {isHindi ? "व्यवस्थापक लॉगिन" : "Admin Authentication"}
            </CardTitle>
            <p className="text-xs text-slate-500">
              Sugamya Shiksha Bihar • NCPEDP Research Portal
            </p>
          </CardHeader>

          <form onSubmit={handleSubmit} noValidate className="mt-6 space-y-4">
            <Input
              label={isHindi ? "व्यवस्थापक ईमेल" : "Admin Email"}
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@sugamyashikshabihar.org"
              autoComplete="username"
            />

            <Input
              label={isHindi ? "पासवर्ड" : "Password"}
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••"
              autoComplete="current-password"
            />

            {error && (
              <div role="alert" className="p-3 rounded-md bg-red-50 border border-red-200 text-xs text-red-800 font-semibold flex items-center gap-2">
                <span aria-hidden="true">⚠️</span>
                <span>{error}</span>
              </div>
            )}

            <Button
              type="submit"
              variant="primary"
              size="lg"
              isLoading={isSubmitting}
              className="w-full font-bold shadow-md bg-navy-800 hover:bg-navy-900 border-navy-700"
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              {isSubmitting
                ? (isHindi ? "प्रमाणीकरण हो रहा है..." : "Authenticating...")
                : (isHindi ? "सुरक्षित लॉगिन करें" : "Secure Admin Login")}
            </Button>
          </form>

          {/* Quick Demo Access for reviewers/evaluators */}
          <div className="mt-6 pt-5 border-t border-slate-100 text-center space-y-2">
            <p className="text-xs text-slate-500">
              {isHindi ? "डेमो / समीक्षा पहुंच:" : "Testing / Evaluation Mode:"}
            </p>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleDemoSignIn}
              leftIcon={<KeyRound className="w-4 h-4 text-teal-700" />}
              className="w-full text-xs font-semibold text-teal-800 border-teal-300 hover:bg-teal-50"
            >
              {isHindi ? "1-क्लिक एडमिन डेमो लॉगिन" : "1-Click Admin Demo Login"}
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
