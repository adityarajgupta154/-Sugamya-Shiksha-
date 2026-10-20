export interface SurveyQuestionOption {
  label_hi: string;
  label_en: string;
  value: string;
}

export type QuestionType = "text" | "textarea" | "radio" | "checkbox" | "select" | "number";

export interface SurveyQuestion {
  id: string;
  label_hi: string;
  label_en: string;
  helpText_hi?: string;
  helpText_en?: string;
  type: QuestionType;
  required: boolean;
  options?: SurveyQuestionOption[];
  min?: number;
  max?: number;
  placeholder_hi?: string;
  placeholder_en?: string;
}

export interface SurveyDefinition {
  id: string;
  title_hi: string;
  title_en: string;
  description_hi: string;
  description_en: string;
  targetAudience_hi: string;
  targetAudience_en: string;
  published: boolean;
  createdAt: string;
  updatedAt: string;
  questions: SurveyQuestion[];
}

export interface SurveyResponse {
  id: string;
  surveyId: string;
  uid?: string;
  email?: string;
  name?: string;
  phone?: string;
  role?: "student" | "parent" | "teacher" | "advocate";
  // Legacy / fallback compatibility
  respondentRole?: "student" | "parent" | "teacher" | "advocate" | "citizen" | "other";
  respondentName?: string;
  isAnonymous?: boolean;
  contactInfo?: string;
  consentGiven: boolean;
  consentAt?: string;
  createdAt?: any;
  submittedAt: string;
  answers: Record<string, string | string[] | number>;
  demo?: boolean;
}

export const DEFAULT_COMMUNITY_SURVEY: SurveyDefinition = {
  id: "danapur-community-survey-2026",
  title_hi: "पटना विद्यालय अभिगम्यता समुदाय सर्वेक्षण 2026",
  title_en: "Patna School Accessibility Community Survey 2026",
  description_hi:
    "यह सर्वेक्षण सुगम्य शिक्षा बिहार शोध परियोजना के अंतर्गत पटना के प्राथमिक और माध्यमिक विद्यालयों में भौतिक बुनियादी ढांचे और दिव्यांग विद्यार्थियों के लिए सुगम्यता की जमीनी हकीकत का अध्ययन करने हेतु आयोजित किया जा रहा है।",
  description_en:
    "Conducted under the Sugamya Shiksha Bihar Research Initiative, this community survey gathers first-hand experiences regarding physical infrastructure accessibility across government and private schools in Patna.",
  targetAudience_hi: "दिव्यांग विद्यार्थी, अभिभावक, शिक्षक, विशेष शिक्षक एवं स्थानीय नागरिक",
  targetAudience_en: "Students with Disabilities, Parents, Teachers, Special Educators, and Community Members",
  published: true,
  createdAt: "2026-03-01",
  updatedAt: "2026-10-16",
  questions: [
    {
      id: "q_school_name",
      label_hi: "विद्यालय का नाम एवं पटना में स्थान / मोहल्ला",
      label_en: "School Name & Location / Mohalla in Patna",
      helpText_hi: "उदाहरण: राजकीय उच्च माध्यमिक विद्यालय, पटना कैंट",
      helpText_en: "e.g., Government High School, Patna Cantt",
      type: "text",
      required: true,
      placeholder_hi: "विद्यालय का नाम दर्ज करें...",
      placeholder_en: "Enter school name and area...",
    },
    {
      id: "q_school_type",
      label_hi: "विद्यालय का प्रकार",
      label_en: "School Type",
      type: "radio",
      required: true,
      options: [
        { label_hi: "सरकारी विद्यालय (Government School)", label_en: "Government School", value: "government" },
        { label_hi: "निजी विद्यालय (Private School)", label_en: "Private School", value: "private" },
        { label_hi: "निश्चित नहीं / अज्ञात (Unsure)", label_en: "Unsure / Unknown", value: "unsure" },
      ],
    },
    {
      id: "q_ramp_access",
      label_hi: "मुख्य प्रवेश द्वार एवं रैंप की स्थिति",
      label_en: "Main Entrance & Ramp Access",
      helpText_hi: "क्या मुख्य प्रवेश द्वार पर सुरक्षित ढलान (1:12) और दोनों तरफ रेलिंग वाला रैंप है?",
      helpText_en: "Is there a gentle slope ramp with bilateral handrails at the entrance?",
      type: "radio",
      required: true,
      options: [
        {
          label_hi: "हाँ, दोनों तरफ रेलिंग सहित सुगम रैंप उपलब्ध है",
          label_en: "Yes, accessible ramp with bilateral handrails available",
          value: "accessible_ramp",
        },
        {
          label_hi: "रैंप बना है लेकिन बहुत ढालू है अथवा रेलिंग नहीं है",
          label_en: "Ramp exists but too steep or lacks handrails",
          value: "steep_or_damaged",
        },
        {
          label_hi: "केवल सीढ़ियां हैं, कोई रैंप नहीं है",
          label_en: "Steps only, no ramp provided",
          value: "steps_only",
        },
        {
          label_hi: "मुझे जानकारी नहीं है",
          label_en: "Not sure / Did not observe",
          value: "not_sure",
        },
      ],
    },
    {
      id: "q_toilet_facility",
      label_hi: "दिव्यांग विद्यार्थियों के लिए सुलभ शौचालय (CwSN Toilet)",
      label_en: "Accessible Toilet for Children with Special Needs (CwSN)",
      helpText_hi: "शौचालय में चौड़ा दरवाजा, ग्रैब बार और कमोड की सुविधा",
      helpText_en: "Includes wide doorway, grab bars, and accessible water closet",
      type: "radio",
      required: true,
      options: [
        {
          label_hi: "समर्पित सुलभ शौचालय उपलब्ध और खुला रहता है",
          label_en: "Dedicated accessible toilet is functional and unlocked",
          value: "functional_accessible",
        },
        {
          label_hi: "सुलभ शौचालय बना है लेकिन ताला लगा रहता है / स्टोर बना दिया गया है",
          label_en: "Accessible toilet exists but kept locked or used as storage",
          value: "locked_or_storage",
        },
        {
          label_hi: "केवल सामान्य शौचालय हैं (कदम/सीढ़ियां, संकरा द्वार, ग्रैब बार नहीं)",
          label_en: "Standard non-accessible toilets only (narrow doors, steps)",
          value: "standard_only",
        },
        {
          label_hi: "विद्यालय में कोई कार्यात्मक शौचालय उपलब्ध नहीं है",
          label_en: "No functional toilet facility available",
          value: "no_toilet",
        },
      ],
    },
    {
      id: "q_classroom_access",
      label_hi: "कक्षाओं में प्रवेश एवं आंतरिक आवागमन",
      label_en: "Classroom Entry & Internal Circulation",
      type: "radio",
      required: true,
      options: [
        {
          label_hi: "कक्षाएं भूतल पर हैं एवं चौड़े बाधारहित द्वार (>=900 मिमी) हैं",
          label_en: "Classrooms on ground floor with wide step-free doors (>=900mm)",
          value: "ground_accessible",
        },
        {
          label_hi: "ऊपरी मंजिलों पर कक्षाएं हैं जहां लिफ्ट या रैंप की सुविधा नहीं है",
          label_en: "Upper floor classrooms without lift or ramp access",
          value: "upper_no_lift",
        },
        {
          label_hi: "दरवाजे संकरे हैं अथवा प्रवेश पर ऊंची देहरी/कदम हैं",
          label_en: "Narrow doorways or high threshold steps",
          value: "narrow_doors",
        },
      ],
    },
    {
      id: "q_drinking_water",
      label_hi: "सुलभ पेयजल की व्यवस्था",
      label_en: "Accessible Drinking Water Facility",
      type: "radio",
      required: true,
      options: [
        {
          label_hi: "कम ऊंचाई वाला नल उपलब्ध है जिस तक व्हीलचेयर से पहुंचा जा सकता है",
          label_en: "Low-height tap reachable by wheelchair users",
          value: "accessible_tap",
        },
        {
          label_hi: "केवल ऊंचे नल हैं जिन तक छोटे बच्चे या व्हीलचेयर उपयोगकर्ता नहीं पहुंच सकते",
          label_en: "High-level taps only, inaccessible to wheelchair users",
          value: "inaccessible_taps",
        },
        {
          label_hi: "सुरक्षित पेयजल उपलब्ध नहीं है",
          label_en: "No safe drinking water facility",
          value: "no_water",
        },
      ],
    },
    {
      id: "q_barriers_encountered",
      label_hi: "आपके द्वारा अनुभव की गई अन्य भौतिक बाधाएं (सभी लागू चुनें)",
      label_en: "Other Physical Barriers Observed (Select all that apply)",
      type: "checkbox",
      required: false,
      options: [
        { label_hi: "टूटा हुआ या कच्चा उबड़-खाबड़ रास्ता", label_en: "Broken or unpaved rough pathways", value: "broken_paths" },
        { label_hi: "नेत्रहीन विद्यार्थियों के लिए स्पर्शनीय (टैक्टाइल) पाथवे का अभाव", label_en: "Lack of tactile guiding paths for visually impaired", value: "no_tactile" },
        { label_hi: "आपातकालीन निकास बाधारहित नहीं है", label_en: "Emergency exit has steps or is blocked", value: "inaccessible_exit" },
        { label_hi: "सुगम्यता साइनेज (हिंदी/ब्रेल दिशा-संकेत) की कमी", label_en: "Absence of clear signage in Hindi/Braille", value: "no_signage" },
        { label_hi: "स्कूल गेट तक वाहन या ऑटो ड्रॉप-ऑफ की सुविधा नहीं", label_en: "Inaccessible vehicle drop-off / approach road", value: "poor_approach" },
        { label_hi: "कोई अतिरिक्त बाधा नहीं देखी गई", label_en: "None observed", value: "none" },
      ],
    },
    {
      id: "q_overall_rating",
      label_hi: "समग्र विद्यालय भौतिक सुगम्यता रेटिंग (1 से 5 स्टार)",
      label_en: "Overall Physical Accessibility Rating (1 to 5)",
      helpText_hi: "1 = अत्यंत दुर्गम/असुरक्षित, 5 = पूरी तरह सुगम व मानक के अनुरूप",
      helpText_en: "1 = Severely inaccessible, 5 = Fully barrier-free and compliant",
      type: "number",
      required: true,
      min: 1,
      max: 5,
    },
    {
      id: "q_suggestions",
      label_hi: "शोध टीम के लिए कोई विशिष्ट सुझाव, अनुभव या सुधार हेतु टिप्पणी",
      label_en: "Specific Observations, Experiences, or Recommendations for the Research Team",
      type: "textarea",
      required: false,
      placeholder_hi: "अपने अनुभव या सुझाव यहाँ लिखें...",
      placeholder_en: "Share specific barriers, incidents, or positive practices observed...",
    },
  ],
};

export const DEMO_SURVEY_RESPONSES: SurveyResponse[] = [
  {
    id: "resp-demo-001",
    surveyId: "danapur-community-survey-2026",
    respondentRole: "parent",
    respondentName: "Sunita Devi",
    isAnonymous: false,
    contactInfo: "sunita.d@example.com",
    consentGiven: true,
    submittedAt: "2026-10-10T11:20:00Z",
    demo: true,
    answers: {
      q_school_name: "राजकीय कन्या उच्च विद्यालय, पटना बाजार",
      q_school_type: "government",
      q_ramp_access: "steep_or_damaged",
      q_toilet_facility: "locked_or_storage",
      q_classroom_access: "ground_accessible",
      q_drinking_water: "inaccessible_taps",
      q_barriers_encountered: ["broken_paths", "no_signage"],
      q_overall_rating: 2,
      q_suggestions: "रैंप बना हुआ है लेकिन ढलान बहुत खड़ी है। मेरी बच्ची को व्हीलचेयर से ले जाने में दो लोगों की मदद लगती है। शौचालय में हमेशा ताला रहता है।",
    },
  },
  {
    id: "resp-demo-002",
    surveyId: "danapur-community-survey-2026",
    respondentRole: "teacher",
    respondentName: "Alok Kumar (Special Educator)",
    isAnonymous: false,
    contactInfo: "alok.sped@example.org",
    consentGiven: true,
    submittedAt: "2026-10-12T14:45:00Z",
    demo: true,
    answers: {
      q_school_name: "मध्य विद्यालय, सगुना मोड़, पटना",
      q_school_type: "government",
      q_ramp_access: "accessible_ramp",
      q_toilet_facility: "functional_accessible",
      q_classroom_access: "upper_no_lift",
      q_drinking_water: "accessible_tap",
      q_barriers_encountered: ["no_tactile", "poor_approach"],
      q_overall_rating: 4,
      q_suggestions: "प्रवेश द्वार और शौचालय अच्छे बने हैं। लेकिन विज्ञान प्रयोगशाला और पुस्तकालय पहली मंजिल पर हैं, जिसके लिए लिफ्ट या रैंप की तत्काल आवश्यकता है।",
    },
  },
  {
    id: "resp-demo-003",
    surveyId: "danapur-community-survey-2026",
    respondentRole: "student",
    respondentName: "Anonymous Student",
    isAnonymous: true,
    consentGiven: true,
    submittedAt: "2026-10-14T09:15:00Z",
    demo: true,
    answers: {
      q_school_name: "डी.ए.वी. पब्लिक स्कूल, पटना कैंट रोड",
      q_school_type: "private",
      q_ramp_access: "steps_only",
      q_toilet_facility: "standard_only",
      q_classroom_access: "narrow_doors",
      q_drinking_water: "inaccessible_taps",
      q_barriers_encountered: ["broken_paths", "no_tactile", "no_signage"],
      q_overall_rating: 2,
      q_suggestions: "मुख्य गेट पर 4 सीढ़ियां हैं और कोई रैंप नहीं है। हर रोज दोस्तों को सहारा देना पड़ता है।",
    },
  },
];
