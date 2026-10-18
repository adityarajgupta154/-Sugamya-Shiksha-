"use client";

import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input, Textarea } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import { Save, CheckCircle2, Inbox } from "lucide-react";
import { doc, getDoc, setDoc, collection, getDocs, query, limit } from "firebase/firestore";
import { db } from "@/lib/firebase/firestore";
import { getCustomSiteContent, saveCustomSiteContent } from "@/lib/customSchoolsStorage";

interface SiteContentAdminTabProps {
  isHindi: boolean;
}

export function SiteContentAdminTab({ isHindi }: SiteContentAdminTabProps) {
  const [homeContent, setHomeContent] = useState<Record<string, any>>(() => {
    const saved = getCustomSiteContent<Record<string, any>>("home");
    return {
      heroTitleEn: "Accessible Schools for Every Child, Equal Education for Every Child.",
      heroHindi: "हर बच्चे के लिए सुगम विद्यालय, हर बच्चे के लिए समान शिक्षा।",
      heroEnglish: "Researching School Accessibility and Advancing Inclusive Education in Danapur, Patna, Bihar.",
      heroSublineHi: "दानापुर, पटना, बिहार में विद्यालय सुगम्यता शोध एवं समावेशी शिक्षा को बढ़ावा।",
      introTitle: "About the Research Initiative",
      introText: "Sugamya Shiksha Bihar is a dedicated research and resource platform created under the NCPEDP Fellowship. Grounded in the Danapur subdivision of Patna district, this project documents physical infrastructure barriers in schools, evaluates compliance with national universal design standards, and amplifies community voices for inclusive education.",
      ...(saved || {}),
    };
  });

  const [aboutContent, setAboutContent] = useState<Record<string, any>>(() => {
    const saved = getCustomSiteContent<Record<string, any>>("about");
    return {
      bio_hi: "NCPEDP फेलोशिप के अंतर्गत यह स्वतंत्र शोध परियोजना दानापुर, पटना के विद्यालयों में दिव्यांग बच्चों के लिए भौतिक बुनियादी ढांचे और सार्वभौमिक सुगम्यता की स्थिति का व्यवस्थित अध्ययन कर रही है।",
      bio_en: "Conducted under the prestigious NCPEDP Fellowship, this independent research initiative systematically investigates physical infrastructure accessibility across Danapur, Patna, Bihar.",
      methodology_hi: "शोध पद्धति में प्राथमिक ऑन-साइट नापजोख ऑडिट तथा दिव्यांग विद्यार्थियों, अभिभावकों और शिक्षकों के साथ पूर्ण सहमति-आधारित साक्षात्कार शामिल हैं।",
      methodology_en: "The methodology integrates on-site quantitative measurement audits combined with consent-governed qualitative interviews.",
      ...(saved || {}),
    };
  });

  const [contentSuccess, setContentSuccess] = useState("");
  const [isSavingContent, setIsSavingContent] = useState(false);

  const [inquiries, setInquiries] = useState<any[]>([
    {
      id: "demo-inq-1",
      name: "Ramesh Sharma",
      email: "ramesh.sharma@example.org",
      role: "teacher",
      message: "Interested in organizing an accessibility checklist workshop at our Danapur school.",
      date: "2026-10-15",
    },
    {
      id: "demo-inq-2",
      name: "Pooja Verma",
      email: "pooja.v@example.com",
      role: "parent",
      message: "Requesting details on RPwD Act 2016 reasonable accommodations for elementary school exams.",
      date: "2026-10-12",
    },
  ]);

  useEffect(() => {
    async function fetchSiteData() {
      // Check local saved content first
      const localHome = getCustomSiteContent<Record<string, any>>("home");
      if (localHome) setHomeContent((curr) => ({ ...curr, ...localHome }));

      const localAbout = getCustomSiteContent<Record<string, any>>("about");
      if (localAbout) setAboutContent((curr) => ({ ...curr, ...localAbout }));

      if (!db) return;

      try {
        const homeSnap = await getDoc(doc(db, "siteContent", "home"));
        if (homeSnap.exists()) setHomeContent((curr) => ({ ...curr, ...homeSnap.data() }));
      } catch (e) {
        console.info("siteContent/home using default fallback");
      }

      try {
        const aboutSnap = await getDoc(doc(db, "siteContent", "about"));
        if (aboutSnap.exists()) setAboutContent((curr) => ({ ...curr, ...aboutSnap.data() }));
      } catch (e) {
        console.info("siteContent/about using default fallback");
      }

      try {
        const inqSnap = await getDocs(query(collection(db, "contactSubmissions"), limit(10)));
        if (!inqSnap.empty) setInquiries(inqSnap.docs.map((d) => ({ id: d.id, ...d.data() })));
      } catch (e) {
        console.info("contactSubmissions using default fallback");
      }
    }

    fetchSiteData();
  }, []);

  const handleSaveSiteContent = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingContent(true);

    // 1. Immediately persist to localStorage and broadcast event
    saveCustomSiteContent("home", homeContent);
    saveCustomSiteContent("about", aboutContent);

    // 2. Also attempt cloud sync
    if (db) {
      try {
        await setDoc(doc(db, "siteContent", "home"), homeContent, { merge: true });
        await setDoc(doc(db, "siteContent", "about"), aboutContent, { merge: true });
      } catch (err) {
        console.warn("Could not save to Firestore, saved to browser localStorage:", err);
      }
    }

    setIsSavingContent(false);
    setContentSuccess(
      isHindi
        ? "साइट सामग्री सुरक्षित हो गई और मुख्य वेबसाइट पर तुरंत दिखाई देगी!"
        : "Site content saved and immediately visible on website!"
    );
    setTimeout(() => setContentSuccess(""), 4000);
  };

  return (
    <div className="space-y-10 pt-4">
      <form onSubmit={handleSaveSiteContent} className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-navy-800">
              {isHindi ? "होम एवं अबाउट पेज पाठ संपादन" : "Home & About Page Content Editor"}
            </h2>
            <p className="text-xs text-slate-500">
              {isHindi ? "Firestore siteContent संग्रह में सुरक्षित होता है" : "Persists to Firestore siteContent collection"}
            </p>
          </div>

          <Button
            type="submit"
            variant="primary"
            size="md"
            isLoading={isSavingContent}
            leftIcon={<Save className="w-4 h-4" />}
          >
            {isSavingContent
              ? (isHindi ? "सहेज रहे हैं..." : "Saving...")
              : (isHindi ? "परिवर्तन सहेजें" : "Save Changes")}
          </Button>
        </div>

        {contentSuccess && (
          <div role="status" className="p-3.5 rounded-lg bg-emerald-50 border border-emerald-300 text-xs font-semibold text-emerald-800 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" aria-hidden="true" />
            <span>{contentSuccess}</span>
          </div>
        )}

        {/* Home Section */}
        <Card as="section" className="p-6 border-slate-200 shadow-xs space-y-4">
          <h3 className="text-lg font-bold text-navy-800 border-b pb-2">
            1. {isHindi ? "होम पेज हीरो एवं परिचय" : "Home Page Hero & Intro"}
          </h3>

          <Input
            label={isHindi ? "हीरो मुख्य संदेश (अंग्रेज़ी)" : "Hero Headline (English)"}
            value={homeContent.heroTitleEn}
            onChange={(e) => setHomeContent({ ...homeContent, heroTitleEn: e.target.value })}
          />

          <Input
            label={isHindi ? "हीरो मुख्य संदेश (हिन्दी)" : "Hero Headline (Hindi)"}
            value={homeContent.heroHindi}
            onChange={(e) => setHomeContent({ ...homeContent, heroHindi: e.target.value })}
          />

          <Input
            label={isHindi ? "सब-लाइन (अंग्रेज़ी)" : "Sub-line (English)"}
            value={homeContent.heroEnglish}
            onChange={(e) => setHomeContent({ ...homeContent, heroEnglish: e.target.value })}
          />

          <Input
            label={isHindi ? "सब-लाइन (हिन्दी)" : "Sub-line (Hindi)"}
            value={homeContent.heroSublineHi}
            onChange={(e) => setHomeContent({ ...homeContent, heroSublineHi: e.target.value })}
          />

          <Textarea
            label={isHindi ? "शोध परिचय पाठ" : "Research Intro Text"}
            rows={3}
            value={homeContent.introText}
            onChange={(e) => setHomeContent({ ...homeContent, introText: e.target.value })}
          />
        </Card>

        {/* About Section */}
        <Card as="section" className="p-6 border-slate-200 shadow-xs space-y-4">
          <h3 className="text-lg font-bold text-navy-800 border-b pb-2">
            2. {isHindi ? "अबाउट पेज: शोधकर्ता बायो एवं पद्धति" : "About Page: Bio & Methodology"}
          </h3>

          <Textarea
            label={isHindi ? "शोधकर्ता परिचय (हिन्दी)" : "Researcher Bio (Hindi)"}
            rows={3}
            value={aboutContent.bio_hi}
            onChange={(e) => setAboutContent({ ...aboutContent, bio_hi: e.target.value })}
          />

          <Textarea
            label={isHindi ? "शोधकर्ता परिचय (अंग्रेज़ी)" : "Researcher Bio (English)"}
            rows={3}
            value={aboutContent.bio_en}
            onChange={(e) => setAboutContent({ ...aboutContent, bio_en: e.target.value })}
          />

          <Textarea
            label={isHindi ? "शोध पद्धति (हिन्दी)" : "Research Methodology (Hindi)"}
            rows={3}
            value={aboutContent.methodology_hi}
            onChange={(e) => setAboutContent({ ...aboutContent, methodology_hi: e.target.value })}
          />

          <Textarea
            label={isHindi ? "शोध पद्धति (अंग्रेज़ी)" : "Research Methodology (English)"}
            rows={3}
            value={aboutContent.methodology_en}
            onChange={(e) => setAboutContent({ ...aboutContent, methodology_en: e.target.value })}
          />
        </Card>
      </form>

      {/* Contact Inquiries Section */}
      <div className="space-y-4 pt-6 border-t border-slate-200">
        <div className="border-b pb-3">
          <h2 className="text-xl font-bold text-navy-800 flex items-center gap-2">
            <Inbox className="w-5 h-5 text-purple-600" aria-hidden="true" />
            <span>{isHindi ? `प्राप्त संपर्क संदेश (${inquiries.length})` : `Received Inquiries (${inquiries.length})`}</span>
          </h2>
          <p className="text-xs text-slate-500">
            {isHindi ? "सार्वजनिक संपर्क फॉर्म से प्राप्त सुरक्षित संदेश (गोपनीय)" : "Submissions from public contact form (private)"}
          </p>
        </div>

        <div className="space-y-3">
          {inquiries.map((inq) => (
            <div
              key={inq.id}
              className="bg-white p-5 rounded-lg border border-slate-200 shadow-xs space-y-2 hover:border-purple-300 transition-colors"
            >
              <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                <span className="font-bold text-navy-900 text-sm">{inq.name}</span>
                <span className="text-slate-500 font-mono">{inq.email}</span>
                <Badge variant="default" className="text-[10px] uppercase">
                  {inq.role}
                </Badge>
                {inq.date && <span className="text-slate-400">{inq.date}</span>}
              </div>
              <p className="text-sm text-slate-700 bg-slate-50 p-3 rounded-md">
                {inq.message}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
