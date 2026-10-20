// src/data/trackerData.ts
// Data models and seed datasets for Before & After Accessibility Tracker, School Recommendations & Reports
// Adheres to PRD Section 6.2-E (Feature E), PRD 11.2 & CONTEXT.md

export type TrackerStage = "barrier_identified" | "suggestion_given" | "improvement_verified";
export type RecommendationPriority = "critical" | "high" | "medium";
export type CostTier = "low_cost" | "medium_cost" | "structural";

export interface TrackerPhoto {
  url: string;
  caption_hi: string;
  caption_en: string;
  date: string;
}

export interface TrackerEntry {
  id: string;
  schoolId: string;
  schoolName_hi: string;
  schoolName_en: string;
  category: "ramp" | "toilet" | "entrance" | "drinkingWater" | "classroom" | "pathway";
  barrier_hi: string;
  barrier_en: string;
  suggestion_hi: string;
  suggestion_en: string;
  improvement_hi?: string;
  improvement_en?: string;
  beforePhoto: TrackerPhoto;
  afterPhoto?: TrackerPhoto;
  dates: {
    identifiedDate: string; // YYYY-MM-DD
    suggestedDate: string;
    improvedDate?: string;
  };
  stage: TrackerStage;
  verificationStatus: "pending" | "verified"; // Only verified entries are public per PRD 6.2-E
  verifiedBy?: string;
  statutoryReference?: string;
  createdAt: string;
}

export interface SchoolRecommendation {
  id: string;
  schoolId: string;
  parameter: string;
  finding_hi: string;
  finding_en: string;
  recommendation_hi: string;
  recommendation_en: string;
  priority: RecommendationPriority;
  costTier: CostTier;
  standardReference: string; // Document & clause
  actionParty: "SMC" | "Headmaster" | "Education_Dept" | "Local_Mason";
}

export interface DownloadableReport {
  id: string;
  title_hi: string;
  title_en: string;
  description_hi: string;
  description_en: string;
  reportType: "school_audit" | "research_interim" | "standards_summary" | "smc_guide";
  schoolId?: string;
  fileFormat: "PDF" | "JSON" | "DOCX";
  fileSize: string;
  publishedDate: string;
  downloadUrl: string;
  downloadCount: number;
}

export const DEMO_TRACKER_ENTRIES: TrackerEntry[] = [
  {
    id: "track-patna-01",
    schoolId: "sch-patna-01",
    schoolName_hi: "राजकीय मध्य विद्यालय, पटना कैंट",
    schoolName_en: "Govt Middle School, Patna Cantt",
    category: "ramp",
    barrier_hi: "मुख्य प्रवेश द्वार पर रैंप अत्यधिक खड़ा (ढलान 1:6) था और सुरक्षा रेलिंग का सर्वथा अभाव था। व्हीलचेयर सवार विद्यार्थियों के फिसलकर गिरने की दुर्घटनाएं हो चुकी थीं।",
    barrier_en: "Main entrance ramp was dangerously steep (gradient ~1:6) without dual-height safety handrails. Wheelchair users suffered slips during wet conditions.",
    suggestion_hi: "रैंप को 1:12 के सौम्य मानक ढलान पर पुनर्निर्मित करें। दोनों किनारों पर 760mm और 900mm की दोहरी सुरक्षा रेलिंग एवं 1500mm का समतल लैंडिंग चबूतरा स्थापित करें (Accessibility Code 2024, Cl 4.2)।",
    suggestion_en: "Reconstruct ramp to 1:12 gentle gradient with continuous dual handrails at 760mm and 900mm heights and a 1500mm level landing platform per Accessibility Code 2024.",
    improvement_hi: "विद्यालय प्रबंधन समिति (SMC) और स्थानीय निकाय की मदद से रैंप की ढलान को 1:12 पर ठीक कर दिया गया और पीली हाई-कंट्रास्ट पेंट वाली मजबूत दोहरी रेलिंग लगा दी गई। अब व्हीलचेयर छात्र स्वतंत्र रूप से प्रवेश कर रहे हैं।",
    improvement_en: "With SMC mobilization, the ramp was rebuilt to 1:12 slope and fitted with continuous high-contrast yellow handrails. Students with mobility disabilities now enter the campus independently.",
    beforePhoto: {
      url: "https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&w=600&q=80",
      caption_hi: "पहले: 1:6 की तीव्र ढलान वाला असुरक्षित रैंप (सितंबर 2026)",
      caption_en: "Before: Hazardous steep 1:6 ramp without handrails (Sept 2026)",
      date: "2026-09-15",
    },
    afterPhoto: {
      url: "https://images.unsplash.com/photo-1541829070764-84a7d30dd3f3?auto=format&fit=crop&w=600&q=80",
      caption_hi: "अब: 1:12 का सुगम्य रैंप और दोहरी सुरक्षा रेलिंग (अक्टूबर 2026)",
      caption_en: "After: Standard 1:12 gentle ramp with continuous dual handrails (Oct 2026)",
      date: "2026-10-12",
    },
    dates: {
      identifiedDate: "2026-09-15",
      suggestedDate: "2026-09-22",
      improvedDate: "2026-10-12",
    },
    stage: "improvement_verified",
    verificationStatus: "verified",
    verifiedBy: "शोधकर्ता, एनसीपीईडीपी फेलोशिप",
    statutoryReference: "Accessibility Code 2024, Clause 4.2; Harmonised Guidelines 2021, Clause 5.2.2",
    createdAt: "2026-09-15T09:00:00.000Z",
  },
  {
    id: "track-patna-02",
    schoolId: "sch-patna-02",
    schoolName_hi: "पटना कन्या उच्चतर माध्यमिक विद्यालय",
    schoolName_en: "Patna Girls High School",
    category: "toilet",
    barrier_hi: "दिव्यांग छात्रा शौचालय का दरवाज़ा अंदर की ओर खुलता था, जिससे व्हीलचेयर अंदर ले जाने के बाद दरवाज़ा बंद करना असंभव था। ग्रैब बार भी नहीं लगे थे।",
    barrier_en: "The CwSN toilet door swung inward, making it impossible to close once a wheelchair entered. No assistive grab rails were provided.",
    suggestion_hi: "दरवाजे का रुख बदलकर बाहर की ओर खुलने वाला 900mm चौड़ा पल्ला लगाएं। 450mm ऊंचाई वाले कमोड के दोनों तरफ L-आकार के ग्रैब बार स्थापित करें (Accessibility Code 2024, Cl 7.3)।",
    suggestion_en: "Reverse door hinges to swing outward with 900mm clear width. Install standard L-shaped grab rail adjacent to 450mm height commode per Accessibility Code 2024.",
    improvement_hi: "विद्यालय प्रधानाध्यापिका द्वारा स्थानीय मिस्त्री को बुलाकर दरवाजे का हिंज बाहर की ओर कर दिया गया और 2 स्टेनलेस स्टील ग्रैब बार स्थापित किए गए।",
    improvement_en: "The headmistress engaged a local technician to reverse the door swing outward and mounted two stainless steel support grab rails.",
    beforePhoto: {
      url: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=600&q=80",
      caption_hi: "पहले: अंदर की ओर खुलता संकरा शौचालय द्वार (अगस्त 2026)",
      caption_en: "Before: Inward-swinging narrow toilet door (August 2026)",
      date: "2026-08-20",
    },
    afterPhoto: {
      url: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=600&q=80",
      caption_hi: "अब: बाहर खुलने वाला दरवाज़ा व सहायक ग्रैब बार (अक्टूबर 2026)",
      caption_en: "After: Outward-opening door with secure support rails (October 2026)",
      date: "2026-10-05",
    },
    dates: {
      identifiedDate: "2026-08-20",
      suggestedDate: "2026-08-28",
      improvedDate: "2026-10-05",
    },
    stage: "improvement_verified",
    verificationStatus: "verified",
    verifiedBy: "शोधकर्ता, एनसीपीईडीपी फेलोशिप",
    statutoryReference: "Harmonised Guidelines 2021, Clause 7.2; Accessibility Code 2024, Clause 7.3",
    createdAt: "2026-08-20T11:00:00.000Z",
  },
  {
    id: "track-patna-03",
    schoolId: "sch-patna-03",
    schoolName_hi: "उत्क्रमित मध्य विद्यालय, तकिया पर, पटना",
    schoolName_en: "Upgraded Middle School, Takiya Par, Patna",
    category: "drinkingWater",
    barrier_hi: "पेयजल नल का चबूतरा 2.5 फीट ऊंचे कंक्रीट बेस पर है और नल की टोंटी 1150mm ऊंचाई पर है। व्हीलचेयर सवार और छोटे बच्चे पानी तक नहीं पहुंच पाते।",
    barrier_en: "Drinking water platform was elevated by 2.5 ft concrete curb with tap at 1150mm height, rendering it inaccessible to wheelchair users and primary children.",
    suggestion_hi: "चबूतरे तक 1:10 का छोटा समतल रैंप बनाएं तथा एक नल की ऊंचाई 750mm-800mm पर नीचे करें जिसमें लीवर हैंडल लगा हो।",
    suggestion_en: "Construct a short ramped apron to the platform and install at least one lever-action tap lowered to 750mm-800mm height.",
    dates: {
      identifiedDate: "2026-10-02",
      suggestedDate: "2026-10-09",
    },
    beforePhoto: {
      url: "https://images.unsplash.com/photo-1541829070764-84a7d30dd3f3?auto=format&fit=crop&w=600&q=80",
      caption_hi: "वर्तमान स्थिति: 1150mm पर ऊंचा पेयजल नल (अक्टूबर 2026)",
      caption_en: "Current State: Inaccessible 1150mm high water tap without ramp (Oct 2026)",
      date: "2026-10-02",
    },
    stage: "suggestion_given",
    verificationStatus: "verified",
    verifiedBy: "शोधकर्ता, एनसीपीईडीपी फेलोशिप",
    statutoryReference: "Accessibility Code 2024, Clause 8.1; Harmonised Guidelines 2021, Clause 8.3",
    createdAt: "2026-10-02T14:00:00.000Z",
  },
  {
    id: "track-patna-04",
    schoolId: "sch-patna-04",
    schoolName_hi: "प्राथमिक विद्यालय, शाहपुर पटना",
    schoolName_en: "Primary School, Shahpur Patna",
    category: "classroom",
    barrier_hi: "कक्षा के प्रवेश द्वार पर 75mm का ऊंचा कंक्रीट दहलीज (Threshold) था जिससे व्हीलचेयर फंस जाती थी।",
    barrier_en: "75mm raised concrete doorway threshold prevented smooth wheelchair passage into classrooms.",
    suggestion_hi: "दहलीज को तोड़कर फर्श के समतल करें अथवा 1:12 का छोटा रबर/सीमेंट बेवेल्ड वेज लगाएं।",
    suggestion_en: "Level doorway threshold flush with finished floor or install 1:12 beveled threshold transition.",
    dates: {
      identifiedDate: "2026-10-15",
      suggestedDate: "2026-10-16",
    },
    beforePhoto: {
      url: "https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&w=600&q=80",
      caption_hi: "कक्षा दहलीज अवरोध",
      caption_en: "Raised doorway threshold barrier",
      date: "2026-10-15",
    },
    stage: "barrier_identified",
    verificationStatus: "pending", // Pending admin review -> Must not show to public
    createdAt: "2026-10-15T16:00:00.000Z",
  },
];

export const DEMO_RECOMMENDATIONS: SchoolRecommendation[] = [
  {
    id: "rec-01",
    schoolId: "sch-patna-01",
    parameter: "ramp_slope",
    finding_hi: "प्रवेश द्वार पर रैंप ढलान 1:6.8 मापी गई जो अत्यधिक तीव्र है।",
    finding_en: "Entrance ramp gradient measured at steep 1:6.8 exceeding safe limits.",
    recommendation_hi: "रैंप को तोड़कर मानक 1:12 सौम्य ढलान पर पुनर्निर्मित करें एवं 760mm/900mm पर दोहरी सुरक्षा रेलिंग लगाएं।",
    recommendation_en: "Reconstruct ramp to 1:12 gentle gradient and install dual continuous handrails at 760mm and 900mm heights.",
    priority: "critical",
    costTier: "structural",
    standardReference: "Accessibility Code 2024, Clause 4.2",
    actionParty: "SMC",
  },
  {
    id: "rec-02",
    schoolId: "sch-patna-01",
    parameter: "toilet_door",
    finding_hi: "CwSN शौचालय में दरवाजा अंदर की ओर खुलता है और क्लियर चौड़ाई केवल 720mm है।",
    finding_en: "CwSN toilet door opens inward with narrow 720mm clear width.",
    recommendation_hi: "दरवाजे को बाहर की ओर खुलने वाला बनाएं (न्यूनतम 900mm क्लियर चौड़ाई) और 450mm ऊंचाई पर ग्रैब रेल स्थापित करें।",
    recommendation_en: "Reverse door swing to open outward with minimum 900mm clear width and mount support grab rails.",
    priority: "critical",
    costTier: "low_cost",
    standardReference: "Harmonised Guidelines 2021, Clause 7.2",
    actionParty: "Headmaster",
  },
  {
    id: "rec-03",
    schoolId: "sch-patna-01",
    parameter: "drinking_water_height",
    finding_hi: "पेयजल नल की टोंटी 1050mm ऊंचाई पर है, जो छोटे बच्चों और व्हीलचेयर सवारों की पहुंच से बाहर है।",
    finding_en: "Water tap spout is 1050mm above finished floor, exceeding 800mm reach limit.",
    recommendation_hi: "कम से कम एक नल की ऊंचाई 750mm-800mm पर नीचे लाएं और लीवर-एक्शन हैंडल लगाएं।",
    recommendation_en: "Lower at least one tap spout to 750mm-800mm and replace twist knob with accessible lever handle.",
    priority: "high",
    costTier: "low_cost",
    standardReference: "Accessibility Code 2024, Clause 8.1",
    actionParty: "Headmaster",
  },
  {
    id: "rec-04",
    schoolId: "sch-patna-01",
    parameter: "tactile_path",
    finding_hi: "विद्यालय के मुख्य द्वार से प्रधानाध्यापक कक्ष व शौचालय तक कोई स्पर्शनीय चेतावनी/दिशा सूचक टाइल्स (TGSI) नहीं हैं।",
    finding_en: "No tactile ground surface indicators (TGSI) connecting gate to classrooms and toilets.",
    recommendation_hi: "मुख्य पहुंच मार्ग पर 300mm चौड़े पीले रंग के दिशा सूचक और चेतावनी टेक्टाइल टाइल्स लगाएं।",
    recommendation_en: "Install 300mm wide contrasting directional and warning tactile indicators along primary transit paths.",
    priority: "medium",
    costTier: "medium_cost",
    standardReference: "Accessibility Code 2024, Clause 6.1",
    actionParty: "Education_Dept",
  },
  {
    id: "rec-05",
    schoolId: "sch-patna-02",
    parameter: "toilet_grab_bars",
    finding_hi: "CwSN शौचालय में कोई ग्रैब बार नहीं है।",
    finding_en: "No grab rails installed in CwSN toilet stall.",
    recommendation_hi: "कमोड के पास L-आकार का ग्रैब बार और दीवार पर फोल्डिंग सपोर्ट रेल स्थापित करें।",
    recommendation_en: "Mount wall-anchored L-shaped grab rail and hinged fold-down support bar beside commode.",
    priority: "critical",
    costTier: "low_cost",
    standardReference: "Harmonised Guidelines 2021, Clause 7.3.2",
    actionParty: "SMC",
  },
  {
    id: "rec-06",
    schoolId: "sch-patna-02",
    parameter: "signage_braille",
    finding_hi: "कक्षाओं और शौचालयों पर कोई ब्रेल या उभरे हुए अक्षरों वाले सांकेतिक बोर्ड नहीं हैं।",
    finding_en: "No tactile or Braille room identification signage outside classrooms and toilets.",
    recommendation_hi: "1400mm-1500mm की ऊंचाई पर दरवाजे के कुंडी वाले किनारे पर उभरे हुए हिन्दी व ब्रेल साइनेज लगाएं।",
    recommendation_en: "Mount raised character and Braille signage at 1400mm-1500mm height on the latch side of doors.",
    priority: "medium",
    costTier: "low_cost",
    standardReference: "Accessibility Code 2024, Clause 9.2",
    actionParty: "Headmaster",
  },
];

export const DEMO_DOWNLOADABLE_REPORTS: DownloadableReport[] = [
  {
    id: "rep-doc-01",
    title_hi: "राजकीय मध्य विद्यालय पटना कैंट — विस्तृत सुगम्यता ऑडिट रिपोर्ट (अक्टूबर 2026)",
    title_en: "Govt Middle School Patna Cantt — Comprehensive Accessibility Audit Report (Oct 2026)",
    description_hi: "प्रवेश द्वार, रैंप ढलान, शौचालय, कक्षा एवं आपातकालीन निकास के भौतिक नापजोख, 100-बिंदु स्कोरकार्ड और SMC सुधारात्मक सिफारिशें।",
    description_en: "Full quantitative field measurements, 100-point scorecard breakdown, statutory clause violations, and prioritized SMC action recommendations.",
    reportType: "school_audit",
    schoolId: "sch-patna-01",
    fileFormat: "PDF",
    fileSize: "2.4 MB",
    publishedDate: "2026-10-15",
    downloadUrl: "/reports/audit_report_patna_cantt_2026.pdf",
    downloadCount: 42,
  },
  {
    id: "rep-doc-02",
    title_hi: "पटना जिला स्कूल सुगम्यता अंतरिम शोध रिपोर्ट (सुगम्य शिक्षा बिहार 2026)",
    title_en: "Patna District School Accessibility Interim Research Report (Sugamya Shiksha Bihar 2026)",
    description_hi: "पटना के 5 प्राथमिक व माध्यमिक विद्यालयों में किए गए व्यापक ऑन-साइट भौतिक निरीक्षण, सामान्य कमियां और नीतिगत अनुशंसाएं।",
    description_en: "Comprehensive baseline study analyzing physical infrastructure compliance across 5 sample schools in Patna under Accessibility Code 2024.",
    reportType: "research_interim",
    fileFormat: "PDF",
    fileSize: "5.1 MB",
    publishedDate: "2026-10-10",
    downloadUrl: "/reports/patna_school_accessibility_interim_2026.pdf",
    downloadCount: 118,
  },
  {
    id: "rep-doc-03",
    title_hi: "स्कूल प्रबंधन समितियों (SMC) के लिए कम लागत वाले सुगम्यता सुधार दिशानिर्देश",
    title_en: "Low-Cost Barrier Rectification Guide for School Management Committees (SMC)",
    description_hi: "दहलीज समतलीकरण, दरवाजे के रुख का उलटाव, नल की ऊंचाई और रैंप सुधार पर व्यावहारिक, कम लागत वाले कदमों की सचित्र मार्गदर्शिका।",
    description_en: "Practical illustrated manual providing step-by-step low-cost architectural interventions for principals, SMC members, and local masons.",
    reportType: "smc_guide",
    fileFormat: "PDF",
    fileSize: "3.8 MB",
    publishedDate: "2026-09-28",
    downloadUrl: "/reports/smc_low_cost_barrier_removal_guide.pdf",
    downloadCount: 89,
  },
  {
    id: "rep-doc-04",
    title_hi: "एक्सेसिबिलिटी कोड फॉर एजुकेशनल इंस्टीट्यूशंस 2024 — त्वरित संदर्भ तालिका",
    title_en: "Accessibility Code for Educational Institutions 2024 — Quick Compliance Matrix",
    description_hi: "रैंप, शौचालय, चौखट, टेक्टाइल पाथ और साइनेज के लिए अनिवार्य आधिकारिक आयामों और परीक्षण विधियों का द्विभाषी सारांश।",
    description_en: "Bilingual dimensional matrix detailing statutory tolerances, slopes, widths, and testing protocols from the Ministry of Education 2024 code.",
    reportType: "standards_summary",
    fileFormat: "PDF",
    fileSize: "1.9 MB",
    publishedDate: "2026-09-15",
    downloadUrl: "/reports/accessibility_code_2024_compliance_matrix.pdf",
    downloadCount: 156,
  },
];
