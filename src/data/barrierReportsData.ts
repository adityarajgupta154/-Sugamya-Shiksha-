// src/data/barrierReportsData.ts
// Data models and initial seed data for Barrier Reports
// Follows PRD Section 6.1 item 11, Section 10, Section 11.2 & ADR 0005

import { BarrierCategory, BarrierPhoto } from "@/lib/barrierReportValidation";

export interface BarrierReportItem {
  id: string;
  schoolId?: string;
  schoolName: string;
  category: BarrierCategory;
  description: string;
  photos: BarrierPhoto[];
  hasContact: boolean;
  status: "pending" | "verified" | "rejected";
  createdAt: string;
  rejectionReason?: string;
  adminNotes?: string;
}

export const BARRIER_CATEGORIES: Array<{
  id: BarrierCategory;
  label_hi: string;
  label_en: string;
  icon: string;
}> = [
  { id: "ramp", label_hi: "प्रवेश रैंप (Ramp)", label_en: "Entrance Ramp", icon: "📐" },
  { id: "entrance", label_hi: "मुख्य द्वार व चौखट (Doors)", label_en: "Main Doors & Entrances", icon: "🚪" },
  { id: "toilet", label_hi: "दिव्यांग-सुलभ शौचालय (Toilet)", label_en: "CwSN Accessible Toilet", icon: "🚻" },
  { id: "classroom", label_hi: "कक्षा व डेस्क व्यवस्था (Classroom)", label_en: "Classroom & Desks", icon: "🏫" },
  { id: "pathway", label_hi: "आंतरिक मार्ग व स्पर्शनीय पाथ (Pathways)", label_en: "Pathways & Tactile Paths", icon: "🦯" },
  { id: "drinkingWater", label_hi: "पेयजल सुविधा (Drinking Water)", label_en: "Drinking Water Tap", icon: "🚰" },
  { id: "signage", label_hi: "सांकेतिक बोर्ड व ब्रेल साइनेज (Signage)", label_en: "Signage & Wayfinding", icon: "🪧" },
  { id: "emergencyExit", label_hi: "आपातकालीन निकास (Emergency Exit)", label_en: "Emergency Evacuation", icon: "🚨" },
  { id: "other", label_hi: "अन्य भौतिक बाधा (Other Barrier)", label_en: "Other Physical Barrier", icon: "⚠️" },
];

export const DEMO_BARRIER_REPORTS: BarrierReportItem[] = [
  {
    id: "rep-patna-001",
    schoolId: "sch-patna-01",
    schoolName: "राजकीय मध्य विद्यालय, पटना कैंट (Govt Middle School, Patna Cantt)",
    category: "ramp",
    description: "मुख्य प्रवेश द्वार का रैंप मानक 1:12 के विपरीत लगभग 1:7 तीव्र ढलान पर बना है। किनारे पर कोई 760mm/900mm की दोहरी सुरक्षा रेलिंग नहीं है, जिससे व्हीलचेयर गिरने का गंभीर जोखिम बना रहता है।",
    photos: [
      {
        name: "patna_cantt_steep_ramp.jpg",
        url: "https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&w=600&q=80",
      },
    ],
    hasContact: true,
    status: "verified",
    createdAt: "2026-10-10T11:30:00.000Z",
    adminNotes: "मौके पर नापजोख में ढलान 1:6.8 पाया गया। विद्यालय प्रबंधन समिति (SMC) को सुधार ज्ञापन सौंपा गया।",
  },
  {
    id: "rep-patna-002",
    schoolId: "sch-patna-02",
    schoolName: "पटना कन्या उच्चतर माध्यमिक विद्यालय (Patna Girls High School)",
    category: "toilet",
    description: "बालिका CwSN शौचालय का दरवाज़ा बाहर की बजाय अंदर की ओर खुलता है और चौड़ाई मात्र 720mm है। अंदर व्हीलचेयर मोड़ने हेतु 1500mm का घुमावदार स्थान उपलब्ध नहीं है।",
    photos: [
      {
        name: "girls_school_toilet_door.jpg",
        url: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=600&q=80",
      },
    ],
    hasContact: true,
    status: "verified",
    createdAt: "2026-10-12T14:15:00.000Z",
    adminNotes: "हार्मनाइज्ड गाइडलाइंस 2021 क्लॉज 7.2 का उल्लंघन। दरवाज़े का रुख उलटने का अनुरोध दर्ज।",
  },
  {
    id: "rep-patna-003",
    schoolId: "sch-patna-03",
    schoolName: "उत्क्रमित मध्य विद्यालय, तकिया पर, पटना",
    category: "drinkingWater",
    description: "पेयजल नल का चबूतरा 2.5 फीट ऊंचे कंक्रीट बेस पर स्थित है। कोई रैंप नहीं है और नल की टोंटी 1150mm की ऊंचाई पर है, जो छोटे व व्हीलचेयर सवार बच्चों की पहुंच से बाहर है।",
    photos: [
      {
        name: "high_water_tap.jpg",
        url: "https://images.unsplash.com/photo-1541829070764-84a7d30dd3f3?auto=format&fit=crop&w=600&q=80",
      },
    ],
    hasContact: false,
    status: "pending",
    createdAt: "2026-10-16T09:40:00.000Z",
  },
  {
    id: "rep-patna-004",
    schoolId: "sch-patna-04",
    schoolName: "सेंट जोसेफ कॉन्वेंट हाई स्कूल, पटना",
    category: "other",
    description: "गैर-प्रासंगिक परीक्षण रिपोर्ट — कोई भौतिक अवरोध का विवरण नहीं है।",
    photos: [],
    hasContact: false,
    status: "rejected",
    createdAt: "2026-10-15T16:00:00.000Z",
    rejectionReason: "भौतिक अवसंरचना संबंधी जानकारी अधूरी थी और परीक्षण प्रविष्टि प्रतीत होती है।",
  },
];
