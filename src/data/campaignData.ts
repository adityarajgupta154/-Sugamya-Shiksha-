// src/data/campaignData.ts
// Structured data models and seed dataset for Awareness & Advocacy Campaign
// Adheres to PRD Section 6.1 item 9, Section 11.2 & ADR 0005

export type CampaignType = "poster" | "reel" | "video" | "workshop" | "mobilisation";

export interface ImageFrameSettings {
  objectFit?: "cover" | "contain";
  objectPosition?: string; // e.g. "center center", "50% 20%"
  scale?: number; // Zoom multiplier: 1 to 2
  posX?: number; // 0 to 100 percentage
  posY?: number; // 0 to 100 percentage
}

export interface CampaignItem {
  id: string;
  type: CampaignType;
  title_hi: string;
  title_en: string;
  description_hi: string;
  description_en: string;
  mediaUrl: string; // Video URL, poster image, or slide URL
  thumbnailUrl: string;
  captionsUrl?: string; // WebVTT format captions
  transcript_hi?: string; // Text alternative for screen reader & deaf users
  transcript_en?: string;
  downloadUrl?: string; // High-resolution download
  date: string;
  location?: string;
  tags: string[];
  published: boolean;
  frameSettings?: ImageFrameSettings; // Frame crop/fit settings for images only
}

export const CAMPAIGN_TYPE_META: Record<
  CampaignType,
  { label_hi: string; label_en: string; icon: string; badgeClass: string }
> = {
  poster: {
    label_hi: "जागरूकता पोस्टर",
    label_en: "Advocacy Poster",
    icon: "🖼️",
    badgeClass: "bg-blue-100 text-blue-900 border-blue-300",
  },
  reel: {
    label_hi: "रील्स व शॉर्ट्स",
    label_en: "Reels & Shorts",
    icon: "📱",
    badgeClass: "bg-purple-100 text-purple-900 border-purple-300",
  },
  video: {
    label_hi: "व्याख्यान वीडियो (कैप्शन सहित)",
    label_en: "Video Explainer (Captioned)",
    icon: "🎬",
    badgeClass: "bg-teal-100 text-teal-900 border-teal-300",
  },
  workshop: {
    label_hi: "शिक्षक व SMC कार्यशाला",
    label_en: "Educators Workshop",
    icon: "👥",
    badgeClass: "bg-amber-100 text-amber-900 border-amber-300",
  },
  mobilisation: {
    label_hi: "सामुदायिक लामबंदी",
    label_en: "Community Mobilisation",
    icon: "📢",
    badgeClass: "bg-rose-100 text-rose-900 border-rose-300",
  },
};

export const DEMO_CAMPAIGN_ITEMS: CampaignItem[] = [
  {
    id: "camp-01",
    type: "poster",
    title_hi: "सही रैंप बनाम खतरनाक ढलान — मानक 1:12 की पहचान",
    title_en: "Safe Ramp vs Steep Hazard — Recognizing the 1:12 Universal Standard",
    description_hi: "स्कूलों में 1:12 की सौम्य ढलान, 760mm और 900mm की दोहरी रेलिंग तथा 1500mm के लैंडिंग चबूतरे के महत्व को दर्शाता दृश्य पोस्टर।",
    description_en: "A visual educational infographic contrasting a safe 1:12 universal design ramp with dangerous steep token ramps, citing Accessibility Code 2024.",
    mediaUrl: "https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&w=1000&q=80",
    thumbnailUrl: "https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&w=600&q=80",
    downloadUrl: "https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&w=1200&q=90",
    date: "2026-10-05",
    tags: ["Ramp Standards", "Accessibility Code 2024", "Universal Design"],
    published: true,
  },
  {
    id: "camp-02",
    type: "video",
    title_hi: "स्कूलों के लिए RPwD Act 2016 की धारा 16 और 17 का महत्व",
    title_en: "Understanding Mandatory School Accessibility Mandates under RPwD Act 2016",
    description_hi: "दिव्यांग बच्चों के बाधारहित शिक्षा के अधिकार, उचित समायोजन (Reasonable Accommodation) तथा विद्यालय भवनों की वैधानिक जवाबदेही पर 4-मिनट का व्याख्यान वीडियो।",
    description_en: "A concise 4-minute explainer with bilingual subtitles and transcript detailing statutory duties of educational institutions to provide barrier-free campuses.",
    mediaUrl: "https://www.w3schools.com/html/mov_bbb.mp4", // Accessible demo video
    thumbnailUrl: "https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&w=600&q=80",
    captionsUrl: "/captions/rpwd_schools_hi_en.vtt",
    transcript_hi: "नमस्ते। आरपीडब्ल्यूडी अधिनियम 2016 की धारा 16 स्पष्ट करती है कि सरकार द्वारा मान्यता प्राप्त सभी शैक्षणिक संस्थान दिव्यांग बच्चों को बिना भेदभाव के प्रवेश देंगे और परिसर को सुगम बनाएंगे। धारा 17 उचित समायोजन और शिक्षण सामग्री की सुलभता अनिवार्य करती है। यदि विद्यालय में रैंप या सुलभ शौचालय नहीं है, तो यह कानून का उल्लंघन है।",
    transcript_en: "Hello. Section 16 of the RPwD Act 2016 mandates that all recognized educational institutions provide inclusive education and ensure campus accessibility without discrimination. Section 17 obligates reasonable accommodation and accessible learning materials. Lacking an accessible ramp or toilet constitutes a statutory non-compliance.",
    date: "2026-10-08",
    tags: ["RPwD Act 2016", "Section 16", "Legal Rights"],
    published: true,
  },
  {
    id: "camp-03",
    type: "reel",
    title_hi: "CwSN शौचालय में 3 सबसे बड़ी गलतियां जो बच्चे को रोकती हैं",
    title_en: "3 Critical Design Mistakes in Accessible Toilets That Prevent Independence",
    description_hi: "अंदर की ओर खुलता दरवाज़ा, 800mm से कम चौखट और ग्रैब रेल का गलत स्थान। 45 सेकंड की रील जो सही डिजाइन बताती है।",
    description_en: "A 45-second micro-reel illustrating why inward-swinging doors, narrow 700mm frames, and missing grab rails trap wheelchair users, showing the correct 2024 code layout.",
    mediaUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
    thumbnailUrl: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=600&q=80",
    transcript_hi: "गलती 1: दरवाज़ा अंदर की ओर खुलना, जिससे आपात स्थिति में बच्चा बंद हो सकता है। गलती 2: चौड़ाई कम होना। सही समाधान: 900mm चौड़ा बाहर खुलने वाला स्लाइडिंग दरवाज़ा और एल-आकार का ग्रैब बार।",
    transcript_en: "Mistake 1: Inward door swing trapping students in emergencies. Mistake 2: Narrow frame. The solution: 900mm clear width outward-swinging door and sturdy L-shaped grab rail.",
    date: "2026-10-10",
    tags: ["Reels", "Toilet Design", "Harmonised Guidelines 2021"],
    published: true,
  },
  {
    id: "camp-04",
    type: "workshop",
    title_hi: "पटना शिक्षक एवं SMC संवाद: कम लागत में सुगम्यता सुधार",
    title_en: "Patna Educators & SMC Dialogue: Low-Cost Barrier Rectification",
    description_hi: "पटना के 12 सरकारी विद्यालयों के प्रधानाध्यापकों, शिक्षकों और SMC सदस्यों के साथ आयोजित व्यावहारिक कार्यशाला। दहलीज समतलीकरण, कम लागत वाले टेक्टाइल स्टिकर और प्राथमिक सुगम्यता चेकलिस्ट पर प्रशिक्षण।",
    description_en: "Hands-on workshop bringing together 12 Patna school principals, SMC members, and local masons to explore cost-effective ramp leveling, grab-rail retrofitting, and barrier audits.",
    mediaUrl: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=1000&q=80",
    thumbnailUrl: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=600&q=80",
    downloadUrl: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=1200&q=90",
    location: "बीआरसी भवन, पटना",
    date: "2026-10-12",
    tags: ["Workshop", "SMC Capacity Building", "Low-Cost Solutions"],
    published: true,
  },
  {
    id: "camp-05",
    type: "mobilisation",
    title_hi: "समान शिक्षा अधिकार — पटना नागरिक लामबंदी व हस्ताक्षर अभियान",
    title_en: "Equal Education Rights — Patna Citizen Mobilisation & Petition",
    description_hi: "दिव्यांग बच्चों के माता-पिता, स्थानीय युवाओं और सामाजिक कार्यकर्ताओं द्वारा पटना जिले में बाधारहित प्राथमिक विद्यालयों के लिए हस्ताक्षर अभियान और जागरूकता रैली।",
    description_en: "Community mobilization initiative rallying 150+ parents, CwSN youth, and advocates petitioning local education authorities to prioritize physical barrier removal grants under Samagra Shiksha.",
    mediaUrl: "https://images.unsplash.com/photo-1531206715517-5c0ba140b2b8?auto=format&fit=crop&w=1000&q=80",
    thumbnailUrl: "https://images.unsplash.com/photo-1531206715517-5c0ba140b2b8?auto=format&fit=crop&w=600&q=80",
    location: "पटना कैंट चौराहा",
    date: "2026-10-14",
    tags: ["Citizen Advocacy", "Community Mobilisation", "Samagra Shiksha"],
    published: true,
  },
];
