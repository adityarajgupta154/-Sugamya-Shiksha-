export type StandardCategory =
  | "ramp"
  | "doors"
  | "toilets"
  | "railings"
  | "classrooms"
  | "pathways"
  | "signage"
  | "drinkingWater"
  | "emergencyExits";

export interface AccessibilityStandard {
  id: string;
  category: StandardCategory;
  category_hi: string;
  parameter: string;
  parameter_hi: string;
  unit: string;
  operator: "gte" | "lte" | "eq" | "range" | "bool";
  thresholdValue: number | boolean | [number, number];
  thresholdDisplay: string;
  sourceDocument: string;
  sourceClause: string;
  severity: "critical" | "major" | "minor";
  deficiencyMessage_en: string;
  deficiencyMessage_hi: string;
  isConfirmed: boolean;
}

export const DEFAULT_STANDARDS: AccessibilityStandard[] = [
  // 1. RAMP
  {
    id: "std-ramp-slope",
    category: "ramp",
    category_hi: "रैंप (Ramp)",
    parameter: "Ramp Slope Gradient Ratio (1:X)",
    parameter_hi: "रैंप ढलान अनुपात (1:X)",
    unit: "ratio",
    operator: "gte", // X must be >= 12 (i.e. 1:12, 1:14, 1:15 are gentler and valid; 1:8 is steeper and fails)
    thresholdValue: 12,
    thresholdDisplay: "1:12 Maximum (8.33%)",
    sourceDocument: "Accessibility Code for Educational Institutions, 2024",
    sourceClause: "Clause 3.2.1",
    severity: "critical",
    deficiencyMessage_en: "Ramp slope is excessively steep (exceeds statutory 1:12 maximum threshold), posing high tip-over risk for wheelchair users.",
    deficiencyMessage_hi: "रैंप की ढलान वैधानिक मानक 1:12 से अधिक तीव्र है, जिससे व्हीलचेयर पलटने का गंभीर जोखिम है।",
    isConfirmed: true,
  },
  {
    id: "std-ramp-clear-width",
    category: "ramp",
    category_hi: "रैंप (Ramp)",
    parameter: "Ramp Minimum Clear Width",
    parameter_hi: "रैंप की न्यूनतम आंतरिक चौड़ाई",
    unit: "mm",
    operator: "gte",
    thresholdValue: 1200,
    thresholdDisplay: "1200 mm Minimum",
    sourceDocument: "Harmonised Guidelines and Standards for Universal Accessibility in India, 2021",
    sourceClause: "Clause 4.5.2",
    severity: "major",
    deficiencyMessage_en: "Clear ramp width between inner handrails is less than the mandatory 1200 mm minimum.",
    deficiencyMessage_hi: "रेलिंग के बीच रैंप की आंतरिक चौड़ाई अनिवार्य 1200 मिमी से कम है।",
    isConfirmed: true,
  },
  {
    id: "std-ramp-landing",
    category: "ramp",
    category_hi: "रैंप (Ramp)",
    parameter: "Ramp Landing Dimensions",
    parameter_hi: "रैंप समतल लैंडिंग चबूतरा",
    unit: "mm",
    operator: "gte",
    thresholdValue: 1500,
    thresholdDisplay: "1500 × 1500 mm Minimum",
    sourceDocument: "Accessibility Code for Educational Institutions, 2024",
    sourceClause: "Clause 3.2.2",
    severity: "major",
    deficiencyMessage_en: "Level landing space at ramp start/turn/end is smaller than required 1500 mm × 1500 mm rest zone.",
    deficiencyMessage_hi: "रैंप के आरंभ/मोड़/अंत पर समतल लैंडिंग चबूतरा मानक 1500x1500 मिमी से छोटा है।",
    isConfirmed: true,
  },

  // 2. DOORS
  {
    id: "std-door-main-width",
    category: "doors",
    category_hi: "प्रवेश द्वार एवं दरवाजे (Doors)",
    parameter: "Main Entrance Clear Doorway Width",
    parameter_hi: "मुख्य प्रवेश द्वार की स्पष्ट चौड़ाई",
    unit: "mm",
    operator: "gte",
    thresholdValue: 900,
    thresholdDisplay: "900 mm Minimum",
    sourceDocument: "Accessibility Code for Educational Institutions, 2024",
    sourceClause: "Clause 4.1",
    severity: "major",
    deficiencyMessage_en: "Clear doorway opening is less than 900 mm, preventing unassisted wheelchair passage.",
    deficiencyMessage_hi: "दरवाजे की खुली चौड़ाई 900 मिमी से कम है, जिससे व्हीलचेयर का स्वतंत्र प्रवेश बाधित होता है।",
    isConfirmed: true,
  },
  {
    id: "std-door-threshold",
    category: "doors",
    category_hi: "प्रवेश द्वार एवं दरवाजे (Doors)",
    parameter: "Doorway Threshold Height",
    parameter_hi: "दरवाजे की देहरी की ऊंचाई",
    unit: "mm",
    operator: "lte",
    thresholdValue: 12,
    thresholdDisplay: "12 mm Maximum (Chamfered)",
    sourceDocument: "Harmonised Guidelines and Standards for Universal Accessibility in India, 2021",
    sourceClause: "Clause 4.2.2",
    severity: "minor",
    deficiencyMessage_en: "Door threshold step exceeds 12 mm or lacks chamfered bevel, creating a tripping hazard.",
    deficiencyMessage_hi: "दरवाजे की देहरी 12 मिमी से ऊंची है या ढालदार नहीं है, जिससे ठोकर लगने का खतरा है।",
    isConfirmed: true,
  },

  // 3. TOILETS (CwSN)
  {
    id: "std-toilet-cubicle-width",
    category: "toilets",
    category_hi: "दिव्यांग सुलभ शौचालय (CwSN Toilet)",
    parameter: "CwSN Toilet Internal Width",
    parameter_hi: "सुगम शौचालय आंतरिक चौड़ाई",
    unit: "mm",
    operator: "gte",
    thresholdValue: 2000,
    thresholdDisplay: "2000 mm Minimum",
    sourceDocument: "Accessibility Code for Educational Institutions, 2024",
    sourceClause: "Clause 5.1",
    severity: "critical",
    deficiencyMessage_en: "Accessible toilet internal width is under 2000 mm, restricting unassisted lateral transfers.",
    deficiencyMessage_hi: "सुगम शौचालय की आंतरिक चौड़ाई 2000 मिमी से कम है, जिससे व्हीलचेयर स्थानांतरण बाधित होता है।",
    isConfirmed: true,
  },
  {
    id: "std-toilet-cubicle-length",
    category: "toilets",
    category_hi: "दिव्यांग सुलभ शौचालय (CwSN Toilet)",
    parameter: "CwSN Toilet Internal Length",
    parameter_hi: "सुगम शौचालय आंतरिक लंबाई",
    unit: "mm",
    operator: "gte",
    thresholdValue: 2200,
    thresholdDisplay: "2200 mm Minimum",
    sourceDocument: "Accessibility Code for Educational Institutions, 2024",
    sourceClause: "Clause 5.1",
    severity: "critical",
    deficiencyMessage_en: "Accessible toilet internal length is under 2200 mm, restricting caregiver access.",
    deficiencyMessage_hi: "सुगम शौचालय की आंतरिक लंबाई 2200 मिमी से कम है।",
    isConfirmed: true,
  },
  {
    id: "std-toilet-turning-circle",
    category: "toilets",
    category_hi: "दिव्यांग सुलभ शौचालय (CwSN Toilet)",
    parameter: "Toilet Clear Wheelchair Turning Circle",
    parameter_hi: "शौचालय में व्हीलचेयर घुमाव चक्र",
    unit: "mm",
    operator: "gte",
    thresholdValue: 1500,
    thresholdDisplay: "1500 mm Diameter",
    sourceDocument: "Harmonised Guidelines and Standards for Universal Accessibility in India, 2021",
    sourceClause: "Clause 5.3.1",
    severity: "critical",
    deficiencyMessage_en: "Clear turning space inside toilet is less than 1500 mm diameter required for a 360-degree wheelchair turn.",
    deficiencyMessage_hi: "शौचालय के अंदर 1500 मिमी व्यास का व्हीलचेयर 360° घुमाव क्षेत्र अनुपलब्ध है।",
    isConfirmed: true,
  },
  {
    id: "std-toilet-seat-height",
    category: "toilets",
    category_hi: "दिव्यांग सुलभ शौचालय (CwSN Toilet)",
    parameter: "WC Commode Seat Height",
    parameter_hi: "कमोड सीट की ऊंचाई",
    unit: "mm",
    operator: "range",
    thresholdValue: [450, 480],
    thresholdDisplay: "450–480 mm",
    sourceDocument: "Accessibility Code for Educational Institutions, 2024",
    sourceClause: "Clause 5.1.4",
    severity: "major",
    deficiencyMessage_en: "WC seat height is outside the standard 450–480 mm range required for level wheelchair transfer.",
    deficiencyMessage_hi: "कमोड सीट की ऊंचाई मानक 450-480 मिमी के दायरे में नहीं है।",
    isConfirmed: true,
  },
  {
    id: "std-toilet-door-swing",
    category: "toilets",
    category_hi: "दिव्यांग सुलभ शौचालय (CwSN Toilet)",
    parameter: "Toilet Door Swing Direction",
    parameter_hi: "शौचालय दरवाजे के खुलने की दिशा",
    unit: "bool",
    operator: "bool",
    thresholdValue: true,
    thresholdDisplay: "Outward Opening (or Sliding)",
    sourceDocument: "Accessibility Code for Educational Institutions, 2024",
    sourceClause: "Clause 5.1.2",
    severity: "critical",
    deficiencyMessage_en: "Toilet door swings inwards, creating a severe entrapment hazard if a student falls inside.",
    deficiencyMessage_hi: "शौचालय का दरवाजा अंदर की ओर खुलता है, जो अंदर गिरने पर बच्चे के फंसने का गंभीर खतरा पैदा करता है।",
    isConfirmed: true,
  },

  // 4. RAILINGS & HANDRAILS
  {
    id: "std-rail-dual-height",
    category: "railings",
    category_hi: "रेलिंग एवं हैंडरेल (Handrails)",
    parameter: "Bilateral Dual Handrails Heights",
    parameter_hi: "दोनों तरफ दोहरी रेलिंग की ऊंचाई",
    unit: "mm",
    operator: "gte",
    thresholdValue: 760, // Lower rail must be installed at 760 mm
    thresholdDisplay: "760 mm (Lower) & 900 mm (Upper)",
    sourceDocument: "Accessibility Code for Educational Institutions, 2024",
    sourceClause: "Clause 3.2.4",
    severity: "major",
    deficiencyMessage_en: "Missing lower handrail at 760 mm height necessary for primary students and children of short stature.",
    deficiencyMessage_hi: "प्राथमिक स्तर के बच्चों के लिए 760 मिमी की निचली रेलिंग अनुपस्थित है।",
    isConfirmed: true,
  },

  // 5. CLASSROOMS
  {
    id: "std-classroom-aisle",
    category: "classrooms",
    category_hi: "कक्षा कक्ष (Classrooms)",
    parameter: "Classroom Desk Aisle Width",
    parameter_hi: "कक्षा में डेस्क के बीच गलियारा",
    unit: "mm",
    operator: "gte",
    thresholdValue: 1200,
    thresholdDisplay: "1200 mm Minimum",
    sourceDocument: "Accessibility Code for Educational Institutions, 2024",
    sourceClause: "Clause 6.2",
    severity: "major",
    deficiencyMessage_en: "Passage aisle between classroom desks is narrower than 1200 mm, blocking wheelchair navigation.",
    deficiencyMessage_hi: "कक्षा में डेस्क के बीच का रास्ता 1200 मिमी से संकरा है, जिससे व्हीलचेयर का आवागमन बाधित होता है।",
    isConfirmed: true,
  },
  {
    id: "std-classroom-accessible-desk",
    category: "classrooms",
    category_hi: "कक्षा कक्ष (Classrooms)",
    parameter: "Wheelchair Accessible Student Desk",
    parameter_hi: "व्हीलचेयर सुगम डेस्क की उपलब्धता",
    unit: "bool",
    operator: "bool",
    thresholdValue: true,
    thresholdDisplay: "Present with 650 mm Knee Recess",
    sourceDocument: "Harmonised Guidelines and Standards for Universal Accessibility in India, 2021",
    sourceClause: "Clause 6.1.3",
    severity: "major",
    deficiencyMessage_en: "No wheelchair-accessible student desk with mandatory 650 mm knee clearance available in classroom.",
    deficiencyMessage_hi: "कक्षा में 650 मिमी घुटने की जगह वाला सुगम डेस्क उपलब्ध नहीं है।",
    isConfirmed: true,
  },

  // 6. PATHWAYS
  {
    id: "std-pathway-width",
    category: "pathways",
    category_hi: "परिसर रास्ते (Pathways)",
    parameter: "Primary Campus Pathway Width",
    parameter_hi: "विद्यालय मुख्य मार्ग की चौड़ाई",
    unit: "mm",
    operator: "gte",
    thresholdValue: 1200,
    thresholdDisplay: "1200 mm Minimum",
    sourceDocument: "Accessibility Code for Educational Institutions, 2024",
    sourceClause: "Clause 3.1",
    severity: "major",
    deficiencyMessage_en: "Main campus circulation pathway is narrower than 1200 mm.",
    deficiencyMessage_hi: "विद्यालय परिसर का मुख्य रास्ता 1200 मिमी से संकरा है।",
    isConfirmed: true,
  },

  // 7. DRINKING WATER
  {
    id: "std-water-tap-height",
    category: "drinkingWater",
    category_hi: "पेयजल सुविधा (Drinking Water)",
    parameter: "Accessible Drinking Water Tap Height",
    parameter_hi: "सुगम पेयजल नल की ऊंचाई",
    unit: "mm",
    operator: "lte",
    thresholdValue: 800,
    thresholdDisplay: "800 mm Maximum from Floor",
    sourceDocument: "Accessibility Code for Educational Institutions, 2024",
    sourceClause: "Clause 5.4",
    severity: "major",
    deficiencyMessage_en: "Drinking water taps are mounted above 800 mm, rendering them unreachable for seated wheelchair students.",
    deficiencyMessage_hi: "पीने के पानी का नल 800 मिमी से अधिक ऊंचाई पर लगा है, जहां व्हीलचेयर सवार बच्चे नहीं पहुंच सकते।",
    isConfirmed: true,
  },

  // 8. SIGNAGE
  {
    id: "std-signage-tactile",
    category: "signage",
    category_hi: "संकेतक एवं साइनेज (Signage)",
    parameter: "Braille and Tactile Signage",
    parameter_hi: "ब्रेल एवं उभरे हुए स्पर्श संकेतक",
    unit: "bool",
    operator: "bool",
    thresholdValue: true,
    thresholdDisplay: "Present with 30% Contrast",
    sourceDocument: "Accessibility Code for Educational Institutions, 2024",
    sourceClause: "Clause 7.1",
    severity: "minor",
    deficiencyMessage_en: "Absence of high-contrast tactile and Braille directional and room signage for visually impaired students.",
    deficiencyMessage_hi: "दृष्टिबाधित विद्यार्थियों के लिए ब्रेल एवं उभरे हुए स्पर्श संकेतों का अभाव है।",
    isConfirmed: true,
  },

  // 9. EMERGENCY EXITS
  {
    id: "std-exit-width",
    category: "emergencyExits",
    category_hi: "आपातकालीन निकास (Emergency Exits)",
    parameter: "Emergency Exit Clear Width",
    parameter_hi: "आपातकालीन निकास द्वार की चौड़ाई",
    unit: "mm",
    operator: "gte",
    thresholdValue: 1200,
    thresholdDisplay: "1200 mm Minimum",
    sourceDocument: "Accessibility Code for Educational Institutions, 2024",
    sourceClause: "Clause 8.2",
    severity: "critical",
    deficiencyMessage_en: "Emergency exit route or doorway is less than 1200 mm wide, jeopardizing rapid evacuation.",
    deficiencyMessage_hi: "आपातकालीन निकास द्वार 1200 मिमी से संकरा है, जिससे त्वरित निकासी बाधित हो सकती है।",
    isConfirmed: true,
  },
];
