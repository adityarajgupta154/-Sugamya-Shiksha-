import type { StandardCategory } from "./standardsData";

export type ScoreCategoryKey = "entrance" | "toilets" | "classrooms" | "safety";

export interface ScoreCategoryConfig {
  key: ScoreCategoryKey;
  name_en: string;
  name_hi: string;
  weight: number; // e.g. 30, 30, 25, 15
  standardCategories: StandardCategory[];
  description_en: string;
  description_hi: string;
  iconName: string;
}

export type ScoreTierId = "high" | "moderate" | "low";

export interface ScoreTier {
  id: ScoreTierId;
  minScore: number;
  maxScore: number;
  label_en: string;
  label_hi: string;
  badgeText_en: string;
  badgeText_hi: string;
  symbol: string;
  colorHex: string;
  bgClass: string;
  borderClass: string;
  textClass: string;
  description_en: string;
  description_hi: string;
}

export interface ScoringMethodology {
  title_en: string;
  title_hi: string;
  formula_en: string;
  formula_hi: string;
  description_en: string;
  description_hi: string;
  statutorySources: {
    title: string;
    authority: string;
    year: string;
    relevance: string;
  }[];
}

export interface ScoringConfig {
  version: string;
  totalMaxScore: number;
  categories: Record<ScoreCategoryKey, ScoreCategoryConfig>;
  tiers: ScoreTier[];
  methodology: ScoringMethodology;
  disclaimer_en: string;
  disclaimer_hi: string;
  updatedAt: string;
  updatedBy: string;
}

/**
 * DEFAULT SCORING CONFIGURATION
 * Confirmed via Grill with Docs against PRD 6.2-C and Open Question Q2.
 * Category Weight Distribution (100 Points Total):
 *  1. Entrance & Ramps: 30 pts (ramp, doors, pathways, railings)
 *  2. Toilets & Water: 30 pts (toilets, drinkingWater)
 *  3. Classrooms & Desks: 25 pts (classrooms)
 *  4. Signage & Emergency Safety: 15 pts (signage, emergencyExits)
 */
export const DEFAULT_SCORING_CONFIG: ScoringConfig = {
  version: "v1",
  totalMaxScore: 100,
  categories: {
    entrance: {
      key: "entrance",
      name_en: "Entrance & Ramps",
      name_hi: "पहुंच, प्रवेश एवं रैंप",
      weight: 30,
      standardCategories: ["ramp", "doors", "pathways", "railings"],
      description_en:
        "Barrier-free approach from school gate, step-free access, 1:12 slope ramp with landing, unobstructed door widths (min 900mm), and dual-height handrails.",
      description_hi:
        "विद्यालय मुख्य द्वार से बाधा-रहित पहुंच, सीढ़ी-मुक्त प्रवेश, 1:12 ढालू रैंप व लैंडिंग, 900 मिमी चौड़े दरवाजे और दोहरी ऊंचाई वाले हैंडरेल।",
      iconName: "Maximize2",
    },
    toilets: {
      key: "toilets",
      name_en: "Toilets & Water",
      name_hi: "सुगम शौचालय एवं पेयजल",
      weight: 30,
      standardCategories: ["toilets", "drinkingWater"],
      description_en:
        "Dedicated CwSN toilet cubicle (min 2000×2200mm), 1500mm turning radius, 450-480mm WC height, sturdy grab rails, outward door swing, and wheelchair-accessible water tap height (max 800mm).",
      description_hi:
        "दिव्यांग विद्यार्थियों हेतु समर्पित सुलभ शौचालय (2000×2200 मिमी), 1500 मिमी व्हीलचेयर टर्निंग परिधि, ग्रैब बार, बाहर खुलने वाला किवाड़ और अधिकतम 800 मिमी ऊंचाई पर पेयजल नल।",
      iconName: "Droplets",
    },
    classrooms: {
      key: "classrooms",
      name_en: "Classrooms & Desks",
      name_hi: "कक्षा कक्ष एवं बैठक व्यवस्था",
      weight: 25,
      standardCategories: ["classrooms"],
      description_en:
        "Wide accessible aisles between desks (min 1200mm), step-free threshold into classrooms, adjustable/wheelchair-accommodating front-row desks with clear knee recess.",
      description_hi:
        "डेस्क के बीच कम से कम 1200 मिमी चौड़ा गलियारा, कक्षा में सीढ़ी-मुक्त प्रवेश और व्हीलचेयर अनुकूलित सुगम डेस्क की उपलब्धता।",
      iconName: "BookOpen",
    },
    safety: {
      key: "safety",
      name_en: "Signage & Emergency Safety",
      name_hi: "संकेतक, ब्रेल एवं आपातकालीन निकास",
      weight: 15,
      standardCategories: ["signage", "emergencyExits"],
      description_en:
        "Tactile/Braille directional signage at 1400-1600mm height, high color-contrast lettering, step-free emergency evacuation routes with 1200mm clear exit doorways.",
      description_hi:
        "1400-1600 मिमी ऊंचाई पर ब्रेल व स्पर्शनीय संकेतक, उच्च कंट्रास्ट साइनेज, और 1200 मिमी चौड़े आपातकालीन निकास द्वार।",
      iconName: "ShieldAlert",
    },
  },
  tiers: [
    {
      id: "high",
      minScore: 80,
      maxScore: 100,
      label_en: "High Accessibility",
      label_hi: "उच्च सुगम्यता",
      badgeText_en: "✓ High Accessibility",
      badgeText_hi: "✓ उच्च सुगम्यता",
      symbol: "✓",
      colorHex: "#0D7A75",
      bgClass: "bg-emerald-50 text-emerald-900 border-emerald-300",
      borderClass: "border-emerald-500",
      textClass: "text-emerald-700",
      description_en:
        "Meets critical universal accessibility benchmarks with minimal physical obstacles for wheelchair and sensory-impaired students.",
      description_hi:
        "अधिकांश वैधानिक मानकों का अनुपालन; व्हीलचेयर एवं दृष्टिबाधित विद्यार्थियों के लिए स्वतंत्र आवागमन सुलभ।",
    },
    {
      id: "moderate",
      minScore: 50,
      maxScore: 79,
      label_en: "Moderate Accessibility",
      label_hi: "मध्यम सुगम्यता",
      badgeText_en: "▲ Moderate Accessibility",
      badgeText_hi: "▲ मध्यम सुगम्यता",
      symbol: "▲",
      colorHex: "#B45309",
      bgClass: "bg-amber-50 text-amber-900 border-amber-300",
      borderClass: "border-amber-500",
      textClass: "text-amber-700",
      description_en:
        "Partial accessibility present (e.g. entrance ramp exists) but critical gaps remain in toilets, circulation, or safety features.",
      description_hi:
        "आंशिक सुविधाएं उपलब्ध (जैसे रैंप), किंतु शौचालय, कक्षा या आपातकालीन सुरक्षा में महत्वपूर्ण बाधाएं विद्यमान।",
    },
    {
      id: "low",
      minScore: 0,
      maxScore: 49,
      label_en: "High Barriers",
      label_hi: "गंभीर बाधाएं",
      badgeText_en: "✕ High Barriers",
      badgeText_hi: "✕ गंभीर बाधाएं",
      symbol: "✕",
      colorHex: "#DC2626",
      bgClass: "bg-rose-50 text-rose-900 border-rose-300",
      borderClass: "border-rose-500",
      textClass: "text-rose-700",
      description_en:
        "Substantial architectural and physical barriers prevent independent access for students with disabilities; urgent remediation needed.",
      description_hi:
        "गंभीर भौतिक और संरचनात्मक बाधाएं; दिव्यांग विद्यार्थियों के स्वतंत्र प्रवेश में भारी रुकावट, तत्काल सुधार अपेक्षित।",
    },
  ],
  methodology: {
    title_en: "Accessibility Score Calculation Methodology",
    title_hi: "सुगम्यता मूल्यांकन स्कोर गणना पद्धति",
    formula_en:
      "Category Score = (Compliant Parameters in Category ÷ Evaluated Parameters in Category) × Category Weight (pts)\nTotal Score = Sum of 4 Category Scores (0–100 Points, Rounded)",
    formula_hi:
      "श्रेणी स्कोर = (श्रेणी में मानक-अनुरूप संकेतक ÷ श्रेणी में कुल जाँचे गए संकेतक) × श्रेणी का अधिकतम भार (अंक)\nकुल स्कोर = चारों श्रेणियों के अंकों का योग (0–100 अंक, पूर्णांक)",
    description_en:
      "The 100-point school accessibility score evaluates empirical on-site physical audit data against national statutory standards. Measurements are classified across four weighted architectural pillars. If an entire pillar has not yet been audited, its evaluated parameters count as zero.",
    description_hi:
      "यह 100-अंकीय स्कोर विद्यालय के भौतिक स्थल निरीक्षण डेटा की तुलना राष्ट्रीय वैधानिक मानकों से करके निकाला जाता है। नापजोख को 4 भारित श्रेणियों में बांटा गया है। यदि किसी श्रेणी का परीक्षण नहीं हुआ है तो उसके जाँचे गए संकेतक शून्य गिने जाते हैं।",
    statutorySources: [
      {
        title: "Accessibility Code for Educational Institutions, 2024",
        authority: "Ministry of Education & Department of Persons with Disabilities, GoI",
        year: "2024",
        relevance: "Primary statutory code specifying dimensional thresholds for schools in India.",
      },
      {
        title: "Harmonised Guidelines and Standards for Universal Accessibility in India, 2021",
        authority: "Ministry of Housing and Urban Affairs (MoHUA), GoI",
        year: "2021",
        relevance: "National universal design norms for ramps, sanitary blocks, TGSI, and signage.",
      },
      {
        title: "Rights of Persons with Disabilities Act (RPwD Act), 2016",
        authority: "Parliament of India (Sections 16 & 45)",
        year: "2016",
        relevance: "Statutory mandate requiring all educational institutions to provide barrier-free access.",
      },
    ],
  },
  disclaimer_en:
    "Academic research score based on standard indicators — not an official government certification.",
  disclaimer_hi:
    "यह शोध मूल्यांकन है, कोई आधिकारिक सरकारी प्रमाणन नहीं।",
  updatedAt: "2026-10-16T23:30:00Z",
  updatedBy: "NCPEDP Fellow & Lead Researcher",
};
