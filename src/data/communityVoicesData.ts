// src/data/communityVoicesData.ts
// Structured data models and seed dataset for Community Voices
// Adheres to PRD Section 6.1 item 8, Section 10, Section 11.2 & ADR 0005

export type CommunityRole = "student" | "parent" | "teacher" | "advocate";

export interface ConsentDetails {
  consentDate: string;
  consentType: "written" | "audio" | "guardian_written";
  isMinor: boolean;
  guardianName?: string;
  hasPhotoConsent: boolean; // Must be true for any facial photograph
}

export interface CommunityVoiceItem {
  id: string;
  role: CommunityRole;
  title_hi: string;
  title_en: string;
  story_hi: string;
  story_en: string;
  keyTheme_hi: string;
  keyTheme_en: string;
  schoolId?: string;
  schoolName_hi?: string;
  schoolName_en?: string;
  isAnonymous: boolean;
  authorDisplayName_hi: string;
  authorDisplayName_en: string;
  consentRecorded: boolean; // Gating flag: Must be true before publication
  consentDetails: ConsentDetails;
  photoUrl?: string; // Only populated if hasPhotoConsent is true or illustration
  isIllustration?: boolean; // True if using symbolic barrier illustration instead of child face
  published: boolean;
  createdAt: string;
}

export const DEMO_COMMUNITY_VOICES: CommunityVoiceItem[] = [
  {
    id: "voice-patna-01",
    role: "student",
    title_hi: "तीव्र रैंप और बिना रेलिंग के स्कूल में मेरी रोज़ाना की जद्दोजहद",
    title_en: "My Daily Struggle with Steep Ramps and Missing Railings",
    story_hi: "मैं कक्षा 8 का छात्र हूँ और पोलियो के कारण व्हीलचेयर का उपयोग करता हूँ। मेरे स्कूल के मुख्य द्वार पर बना रैंप इतना खड़ा है कि मैं खुद ऊपर नहीं जा सकता। हर सुबह मुझे किसी सहपाठी या चपरासी भैया के आने का इंतज़ार करना पड़ता है। अगर दोनों तरफ रेलिंग होती तो मैं खुद धीरे-धीरे चढ़ पाता। मैं सिर्फ इतना चाहता हूँ कि मैं किसी पर बोझ बने बिना अपनी क्लास में बैठ सकूँ।",
    story_en: "I am an 8th-grade student using a wheelchair due to polio. The ramp at our school gate is so steep that I cannot ascend independently. Every morning, I have to wait outside for a classmate or school guard to push me. If there were continuous handrails on both sides, I could pull myself up. I just want to enter my classroom with independence and dignity without feeling like a burden.",
    keyTheme_hi: "रैंप ढलान एवं स्वतंत्र आवागमन",
    keyTheme_en: "Ramp Gradient & Independent Mobility",
    schoolId: "sch-patna-01",
    schoolName_hi: "राजकीय मध्य विद्यालय, पटना",
    schoolName_en: "Govt Middle School, Patna",
    isAnonymous: true,
    authorDisplayName_hi: "कक्षा 8 का छात्र (पहचान सुरक्षित)",
    authorDisplayName_en: "Grade 8 Student (Identity Protected)",
    consentRecorded: true,
    consentDetails: {
      consentDate: "2026-10-08",
      consentType: "guardian_written",
      isMinor: true,
      guardianName: "रमेश कुमार (अभिभावक)",
      hasPhotoConsent: false, // Strict child privacy: no child face
    },
    photoUrl: "https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&w=600&q=80",
    isIllustration: true,
    published: true,
    createdAt: "2026-10-09T10:00:00.000Z",
  },
  {
    id: "voice-patna-02",
    role: "parent",
    title_hi: "सुलभ शौचालय के अभाव में मुझे बेटी को दोपहर में घर लाना पड़ता है",
    title_en: "Lack of Accessible Toilet Forces Me to Bring My Daughter Home at Lunch",
    story_hi: "मेरी 10 वर्षीय बेटी सेरेब्रल पाल्सी से ग्रसित है। स्कूल में दिव्यांग बच्चों के लिए कोई विशेष शौचालय नहीं है; सामान्य शौचालय में 3 सीढ़ियाँ हैं और अंदर पकड़ने के लिए कोई ग्रैब बार नहीं है। स्वच्छता और गिरने के डर से वह दिनभर पानी नहीं पीती थी जिससे उसकी तबीयत बिगड़ने लगी। अब मैं रोज़ दोपहर में उसे घर लाकर शौचालय कराती हूँ। स्कूल में एक सुलभ शौचालय होना कोई सुविधा नहीं, बुनियादी अधिकार है।",
    story_en: "My 10-year-old daughter lives with Cerebral Palsy. Her school lacks an accessible toilet; the standard restroom has three concrete steps and no support grab rails. Due to fear of falling, she avoided drinking water during school hours, which affected her health. Now I visit the school every afternoon during recess to bring her home. Having an accessible toilet is not a privilege; it is a fundamental child right under the RPwD Act.",
    keyTheme_hi: "CwSN शौचालय एवं गरिमापूर्ण स्वच्छता",
    keyTheme_en: "CwSN Sanitation & Dignified Hygiene",
    schoolId: "sch-patna-02",
    schoolName_hi: "पटना कन्या उच्च विद्यालय",
    schoolName_en: "Patna Girls High School",
    isAnonymous: true,
    authorDisplayName_hi: "एक अभिभावक (पटना)",
    authorDisplayName_en: "A Concerned Parent (Patna)",
    consentRecorded: true,
    consentDetails: {
      consentDate: "2026-10-11",
      consentType: "written",
      isMinor: false,
      hasPhotoConsent: false,
    },
    photoUrl: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=600&q=80",
    isIllustration: true,
    published: true,
    createdAt: "2026-10-12T14:30:00.000Z",
  },
  {
    id: "voice-patna-03",
    role: "teacher",
    title_hi: "कक्षा के दरवाजों और डेस्क व्यवस्था में छोटे बदलावों से बड़ा फर्क",
    title_en: "Simple Modifications in Doorways and Desk Layouts Make a Huge Difference",
    story_hi: "एक प्राथमिक शिक्षक के रूप में मैंने देखा कि जब हमने कक्षा के सामने की पंक्ति में एक चौड़ा डेस्क लगाया और प्रवेश द्वार के उभरे हुए दहलीज को हटाकर समतल कर दिया, तो हमारी दृष्टिबाधित और ऑर्थोपेडिक दिव्यांग छात्राएं बिना किसी हिचकिचाहट के सबसे आगे बैठने लगीं। समावेशी शिक्षा सिर्फ बड़े बजट की बात नहीं है, यह हमारी संवेदनशीलता और शिक्षक के रूप में वातावरण को सुगम बनाने की इच्छाशक्ति पर निर्भर करती है।",
    story_en: "As an elementary school teacher, I witnessed firsthand how leveling a 2-inch doorway threshold and reserving an accessible front-row desk empowered our visually impaired and mobility-impaired students to participate confidently. Inclusive education is not just about massive capital outlays; it begins with administrative empathy and teacher willingness to adapt classroom spaces.",
    keyTheme_hi: "कक्षा अनुकूलन एवं शिक्षक संवेदनशीलता",
    keyTheme_en: "Classroom Adaptation & Teacher Empathy",
    schoolName_hi: "राजकीय प्राथमिक विद्यालय, खगौल, पटना",
    schoolName_en: "Govt Primary School, Khagaul, Patna",
    isAnonymous: false,
    authorDisplayName_hi: "राजेश रंजन, प्राथमिक शिक्षक",
    authorDisplayName_en: "Rajesh Ranjan, Primary Educator",
    consentRecorded: true,
    consentDetails: {
      consentDate: "2026-10-14",
      consentType: "written",
      isMinor: false,
      hasPhotoConsent: true,
    },
    photoUrl: "https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&w=600&q=80",
    isIllustration: false,
    published: true,
    createdAt: "2026-10-14T16:00:00.000Z",
  },
  {
    id: "voice-patna-04",
    role: "advocate",
    title_hi: "कानून स्पष्ट है — अब स्कूलों में अनुपालन और जवाबदेही की बारी है",
    title_en: "The Law is Clear — Now Schools Must Be Held Accountable for Compliance",
    story_hi: "आरपीडब्ल्यूडी अधिनियम 2016 की धारा 16 और 17 स्पष्ट रूप से प्रत्येक शैक्षणिक संस्थान को बाधारहित भवन प्रदान करने का वैधानिक आदेश देती है। इसके बावजूद पटना के कई विद्यालयों में रैंप तो बना दिए गए हैं लेकिन वे 1:5 या 1:6 की जानलेवा ढलान पर हैं। यह महज औपचारिकता पूरी करना है, वास्तविक सुगम्यता नहीं। हमें स्कूल प्रबंधन समितियों (SMC) और अभिभावकों को सशक्त करना होगा ताकि वे आधिकारिक कोड 2024 के मानकों पर काम करवा सकें।",
    story_en: "Sections 16 and 17 of the RPwD Act 2016 unequivocally mandate barrier-free educational facilities. Yet, during our field observations in Patna, we frequently encounter steep ramps with dangerous 1:5 slopes built purely as token gestures. Real accessibility requires adherence to the National Accessibility Code 2024. We must mobilize SMC members and parents to demand rigorous statutory compliance.",
    keyTheme_hi: "कानूनी अनुपालन एवं सामुदायिक पैरवी",
    keyTheme_en: "Statutory Compliance & Community Advocacy",
    isAnonymous: false,
    authorDisplayName_hi: "अनीता सिन्हा, दिव्यांगता अधिकार अधिवक्ता",
    authorDisplayName_en: "Anita Sinha, Disability Rights Advocate",
    consentRecorded: true,
    consentDetails: {
      consentDate: "2026-10-15",
      consentType: "written",
      isMinor: false,
      hasPhotoConsent: true,
    },
    photoUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=600&q=80",
    isIllustration: false,
    published: true,
    createdAt: "2026-10-15T11:20:00.000Z",
  },
  {
    id: "voice-patna-05",
    role: "student",
    title_hi: "अनवेरिफाइड परीक्षण प्रविष्टि (प्रकाशन लंबित)",
    title_en: "Draft Student Story (Awaiting Verification)",
    story_hi: "यह एक अप्रकाशित प्रविष्टि है जिसे सहमति की पुष्टि और एडमिन समीक्षा के बाद ही प्रकाशित किया जा सकता है।",
    story_en: "This is an unpublished draft story awaiting formal consent verification by the administrator.",
    keyTheme_hi: "मसौदा प्रविष्टि",
    keyTheme_en: "Draft Submission",
    isAnonymous: true,
    authorDisplayName_hi: "छात्र (लंबित)",
    authorDisplayName_en: "Student (Pending)",
    consentRecorded: false, // Consent not recorded -> must NEVER be public
    consentDetails: {
      consentDate: "2026-10-16",
      consentType: "audio",
      isMinor: true,
      hasPhotoConsent: false,
    },
    isIllustration: true,
    published: false,
    createdAt: "2026-10-16T18:00:00.000Z",
  },
];
