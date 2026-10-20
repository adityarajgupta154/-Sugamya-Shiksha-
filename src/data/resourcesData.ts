export type ResourceCategory =
  | "guidelines"
  | "survey_forms"
  | "audit_formats"
  | "rti_templates"
  | "checklists"
  | "awareness";

export interface ResourceItem {
  id: string;
  title_hi: string;
  title_en: string;
  category: ResourceCategory;
  description_hi: string;
  description_en: string;
  fileUrl: string;
  fileType: "PDF" | "DOCX" | "XLSX" | "ZIP";
  fileSize: string;
  downloadCount: number;
  sourceOrg_hi: string;
  sourceOrg_en: string;
  published: boolean;
  updatedAt: string;
}

export const RESOURCE_CATEGORIES: { id: ResourceCategory; label_hi: string; label_en: string; icon: string }[] = [
  { id: "guidelines", label_hi: "दिशानिर्देश एवं नीतियां (PDF)", label_en: "Statutory Guidelines (PDF)", icon: "BookOpen" },
  { id: "survey_forms", label_hi: "सर्वेक्षण प्रपत्र (Forms)", label_en: "Survey Forms", icon: "ClipboardList" },
  { id: "audit_formats", label_hi: "स्कूल ऑडिट प्रारूप (Formats)", label_en: "Audit Formats", icon: "FileSpreadsheet" },
  { id: "rti_templates", label_hi: "आरटीआई आवेदन प्रारूप (RTI)", label_en: "RTI Templates", icon: "FileText" },
  { id: "checklists", label_hi: "सुगम्यता चेकलिस्ट", label_en: "Accessibility Checklists", icon: "CheckSquare" },
  { id: "awareness", label_hi: "जागरूकता सामग्री व पोस्टर", label_en: "Awareness & Posters", icon: "Megaphone" },
];

export const INITIAL_RESOURCES: ResourceItem[] = [
  // 1. Guidelines
  {
    id: "res-accessibility-code-2024",
    title_hi: "शैक्षणिक संस्थानों के लिए अभिगम्यता कोड, 2024 (आधिकारिक गजट)",
    title_en: "Accessibility Code for Educational Institutions, 2024 (Official MoE Gazette)",
    category: "guidelines",
    description_hi: "शिक्षा मंत्रालय, भारत सरकार द्वारा अधिसूचित विद्यालय भवनों, रैंप, शौचालयों और कक्षाओं के लिए अनिवार्य तकनीकी मानक।",
    description_en: "Mandatory technical architectural standards for educational buildings notified by the Ministry of Education, Govt. of India.",
    fileUrl: "https://www.education.gov.in/",
    fileType: "PDF",
    fileSize: "4.8 MB",
    downloadCount: 142,
    sourceOrg_hi: "शिक्षा मंत्रालय, भारत सरकार",
    sourceOrg_en: "Ministry of Education, GoI",
    published: true,
    updatedAt: "2024-01-15",
  },
  {
    id: "res-harmonised-guidelines-2021",
    title_hi: "भारत में सार्वभौमिक सुगम्यता हेतु हार्मोनाइज्ड दिशानिर्देश, 2021",
    title_en: "Harmonised Guidelines and Standards for Universal Accessibility in India, 2021",
    category: "guidelines",
    description_hi: "आवासन और शहरी कार्य मंत्रालय (MoHUA) द्वारा निर्मित दिव्यांगजनों के लिए बाधारहित भौतिक वातावरण के व्यापक राष्ट्रीय मानक।",
    description_en: "Comprehensive national guidelines by MoHUA for barrier-free physical infrastructure and universal design.",
    fileUrl: "https://mohua.gov.in/",
    fileType: "PDF",
    fileSize: "18.2 MB",
    downloadCount: 98,
    sourceOrg_hi: "आवासन एवं शहरी कार्य मंत्रालय",
    sourceOrg_en: "MoHUA, GoI",
    published: true,
    updatedAt: "2021-12-20",
  },
  {
    id: "res-rpwd-act-2016",
    title_hi: "दिव्यांगजन अधिकार अधिनियम (RPwD Act), 2016 - मूल अधिनियम पाठ",
    title_en: "The Rights of Persons with Disabilities Act, 2016 - Official Statute",
    category: "guidelines",
    description_hi: "दिव्यांग विद्यार्थियों के लिए समावेशी शिक्षा (धारा 16 व 17) तथा सार्वजनिक भवनों की सुगम्यता (धारा 45) से संबंधित कानूनी प्रावधान।",
    description_en: "Statutory provisions governing inclusive education (Sec 16-17) and built environment accessibility (Sec 45).",
    fileUrl: "https://disabilityaffairs.gov.in/",
    fileType: "PDF",
    fileSize: "1.2 MB",
    downloadCount: 215,
    sourceOrg_hi: "दिव्यांगजन सशक्तिकरण विभाग (DEPwD)",
    sourceOrg_en: "DEPwD, Ministry of Social Justice",
    published: true,
    updatedAt: "2016-12-28",
  },

  // 2. Survey Forms
  {
    id: "res-survey-form-print",
    title_hi: "पटना विद्यालय अभिगम्यता समुदाय सर्वेक्षण प्रपत्र (मुद्रण योग्य)",
    title_en: "Patna School Accessibility Community Survey Form (Printable Questionnaire)",
    category: "survey_forms",
    description_hi: "दिव्यांग विद्यार्थियों, अभिभावकों एवं समुदाय कार्यकर्ताओं द्वारा स्कूल भ्रमण के दौरान भौतिक सुविधाओं के मूल्यांकन हेतु ऑफलाइन फॉर्म।",
    description_en: "Printable paper questionnaire for field-based physical infrastructure documentation by parents, students, and community auditors.",
    fileUrl: "/survey",
    fileType: "PDF",
    fileSize: "380 KB",
    downloadCount: 76,
    sourceOrg_hi: "सुगम्य शिक्षा बिहार शोध पहल",
    sourceOrg_en: "Sugamya Shiksha Bihar Research Initiative",
    published: true,
    updatedAt: "2026-03-01",
  },
  {
    id: "res-headmaster-assessment-form",
    title_hi: "प्रधानाध्यापक सुगम्यता स्व-मूल्यांकन प्रपत्र",
    title_en: "School Headmaster Accessibility Self-Assessment Questionnaire",
    category: "survey_forms",
    description_hi: "विद्यालय स्तर पर उपलब्ध दिव्यांग-अनुकूल सुविधाओं और तात्कालिक सुधार आवश्यकताओं का संकलन करने हेतु प्रारूप।",
    description_en: "Structured format for school headmasters to self-assess institutional accessibility compliance and infrastructure gaps.",
    fileUrl: "/survey",
    fileType: "DOCX",
    fileSize: "210 KB",
    downloadCount: 45,
    sourceOrg_hi: "सुगम्य शिक्षा बिहार शोध दल",
    sourceOrg_en: "Sugamya Shiksha Bihar Research",
    published: true,
    updatedAt: "2026-02-15",
  },

  // 3. School Audit Formats
  {
    id: "res-patna-audit-format",
    title_hi: "विद्यालय भौतिक अवसंरचना ऑन-साइट ऑडिट फॉर्मेट (पटना रिसर्च प्रारूप)",
    title_en: "School Physical Infrastructure On-Site Audit Format (Patna Research Standard)",
    category: "audit_formats",
    description_hi: "रैंप ढलान, दरवाजे की चौड़ाई, शौचालय ग्रैब बार, पेयजल ऊंचाई तथा टैक्टाइल पाथ की सटीक नापजोख दर्ज करने वाली ऑडिट शीट।",
    description_en: "Standard measurement recording sheet for ramp slopes, door clearances, accessible toilets, tactile paving, and emergency exits.",
    fileUrl: "/schools",
    fileType: "XLSX",
    fileSize: "145 KB",
    downloadCount: 88,
    sourceOrg_hi: "सुगम्य शिक्षा बिहार शोध दल",
    sourceOrg_en: "Sugamya Shiksha Bihar Research",
    published: true,
    updatedAt: "2026-02-28",
  },

  // 4. RTI Templates
  {
    id: "res-rti-school-accessibility",
    title_hi: "आरटीआई आवेदन प्रारूप: विद्यालय सुगम्यता बजट एवं अनुपालन स्थिति",
    title_en: "RTI Application Template: School Accessibility Grants & Compliance Verification",
    category: "rti_templates",
    description_hi: "प्रखंड शिक्षा पदाधिकारी (BEO) अथवा जिला शिक्षा कार्यालय (DEO) से विद्यालय में रैंप और सुलभ शौचालय निर्माण बजट की जानकारी मांगने हेतु कानूनी प्रारूप।",
    description_en: "Standard RTI template under Section 6(1) to seek information on barrier-free building compliance and grant utilization.",
    fileUrl: "#",
    fileType: "DOCX",
    fileSize: "95 KB",
    downloadCount: 160,
    sourceOrg_hi: "विधि एवं नागरिक सहायता प्रारूप",
    sourceOrg_en: "Citizen Legal Advocacy Draft",
    published: true,
    updatedAt: "2026-01-10",
  },
  {
    id: "res-rti-first-appeal",
    title_hi: "आरटीआई प्रथम अपील प्रारूप: समयसीमा में सूचना न मिलने पर",
    title_en: "RTI First Appeal Template: Non-furnishing of School Infrastructure Records",
    category: "rti_templates",
    description_hi: "30 दिनों के भीतर सूचना न मिलने अथवा अधूरी जानकारी दिए जाने पर प्रथम अपीलीय प्राधिकारी (FAA) के समक्ष दायर की जाने वाली अपील।",
    description_en: "First Appeal format under Section 19(1) of the RTI Act 2005 for pending or unsatisfactory public accessibility disclosures.",
    fileUrl: "#",
    fileType: "DOCX",
    fileSize: "85 KB",
    downloadCount: 92,
    sourceOrg_hi: "विधि एवं नागरिक सहायता प्रारूप",
    sourceOrg_en: "Citizen Legal Advocacy Draft",
    published: true,
    updatedAt: "2026-01-12",
  },

  // 5. Checklists
  {
    id: "res-principal-compliance-checklist",
    title_hi: "विद्यालय प्रधानाध्यापक 15-सूत्रीय त्वरित सुगम्यता चेकलिस्ट",
    title_en: "School Principal 15-Point Quick Accessibility Compliance Checklist",
    category: "checklists",
    description_hi: "प्रवेश द्वार से कक्षा तक 15 प्रमुख मापदंडों की आसान हाँ/नहीं चेकलिस्ट जो विद्यालय प्रशासन को कमियों की पहचान में मदद करती है।",
    description_en: "Actionable 15-point checklist covering entrance, ramps, disabled toilets, handrails, tactile signage, and classrooms.",
    fileUrl: "#",
    fileType: "PDF",
    fileSize: "420 KB",
    downloadCount: 230,
    sourceOrg_hi: "सुगम्य शिक्षा बिहार",
    sourceOrg_en: "Sugamya Shiksha Bihar",
    published: true,
    updatedAt: "2026-03-05",
  },
  {
    id: "res-classroom-inclusion-checklist",
    title_hi: "शिक्षकों के लिए समावेशी कक्षा-कक्ष तैयारी चेकलिस्ट",
    title_en: "Inclusive Classroom Physical Readiness Checklist for Teachers",
    category: "checklists",
    description_hi: "कक्षा के भीतर व्हीलचेयर रोटेशन, प्राकृतिक प्रकाश, सुलभ डेस्क व्यवस्था और स्पष्ट आवागमन मार्ग सुनिश्चित करने हेतु मार्गदर्शिका।",
    description_en: "Educator checklist for ensuring clear desk aisles, glare-free board visibility, wheelchair seating, and accessible teaching aids.",
    fileUrl: "#",
    fileType: "PDF",
    fileSize: "310 KB",
    downloadCount: 112,
    sourceOrg_hi: "सुगम्य शिक्षा बिहार",
    sourceOrg_en: "Sugamya Shiksha Bihar",
    published: true,
    updatedAt: "2026-02-20",
  },

  // 6. Awareness Materials
  {
    id: "res-awareness-poster-pack",
    title_hi: "सुगम विद्यालय, समान शिक्षा — जन-जागरूकता पोस्टर किट (हिन्दी A3)",
    title_en: "Sugamya Shiksha Bihar Advocacy Poster Kit (Hindi - Printable A3 Series)",
    category: "awareness",
    description_hi: "विद्यालयों, ग्राम पंचायतों और सार्वजनिक सूचना पट्टों के लिए उच्च गुणवत्ता वाले मुद्रण-योग्य सुगम्यता अधिकार पोस्टर।",
    description_en: "High-resolution printable advocacy posters emphasizing children with disabilities' rights to barrier-free neighbourhood schools.",
    fileUrl: "#",
    fileType: "ZIP",
    fileSize: "12.4 MB",
    downloadCount: 185,
    sourceOrg_hi: "सुगम्य शिक्षा बिहार वकालत अभियान",
    sourceOrg_en: "Sugamya Shiksha Bihar Advocacy Campaign",
    published: true,
    updatedAt: "2026-03-10",
  },
  {
    id: "res-smc-guide-handbook",
    title_hi: "विद्यालय प्रबंधन समिति (SMC) सुगम्यता मार्गदर्शिका पुस्तिका",
    title_en: "School Management Committee (SMC) Accessibility Action Handbook",
    category: "awareness",
    description_hi: "एसएमसी सदस्यों, अभिभावकों और स्थानीय प्रतिनिधियों के लिए सरल भाषा में विद्यालय को बाधारहित बनाने की मार्गदर्शिका।",
    description_en: "Easy-to-read manual for SMC members detailing legal mandates, budget monitoring, and barrier rectification procedures.",
    fileUrl: "#",
    fileType: "PDF",
    fileSize: "2.1 MB",
    downloadCount: 140,
    sourceOrg_hi: "सुगम्य शिक्षा बिहार",
    sourceOrg_en: "Sugamya Shiksha Bihar",
    published: true,
    updatedAt: "2026-02-10",
  },
];
