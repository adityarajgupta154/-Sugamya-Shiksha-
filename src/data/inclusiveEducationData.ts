export interface InclusiveEducationTopic {
  id: string;
  slug: string;
  title_hi: string;
  title_en: string;
  tagline_hi: string;
  tagline_en: string;
  summary_hi: string;
  summary_en: string;
  detailedContent_hi: string;
  detailedContent_en: string;
  keyProvisions_hi: string[];
  keyProvisions_en: string[];
  actionSteps_hi: string[];
  actionSteps_en: string[];
  officialReference: string;
  officialReferenceUrl?: string;
}

export const INCLUSIVE_EDUCATION_TOPICS: InclusiveEducationTopic[] = [
  {
    id: "topic-inclusive-education",
    slug: "inclusive-education-foundations",
    title_hi: "समावेशी शिक्षा की अवधारणा एवं अधिकार",
    title_en: "Foundations of Inclusive Education",
    tagline_hi: "हर बच्चे के लिए एक ही छत के नीचे समान सम्मान और गुणवत्तापूर्ण शिक्षा",
    tagline_en: "Equal dignity, shared classrooms, and quality education for every child",
    summary_hi:
      "समावेशी शिक्षा का अर्थ है कि दिव्यांग बच्चों को किसी विशेष अलग विद्यालय में भेजने के बजाय उनके पड़ोस के सामान्य विद्यालय में सभी साथियों के साथ पढ़ने, खेलने और सीखने का पूर्ण अधिकार प्राप्त हो।",
    summary_en:
      "Inclusive education ensures children with disabilities learn alongside their non-disabled peers in mainstream neighbourhood schools, supported by tailored pedagogical and infrastructural adaptations.",
    detailedContent_hi:
      "राष्ट्रीय शिक्षा नीति (NEP 2020) और दिव्यांगजन अधिकार अधिनियम (RPwD Act 2016) की धारा 16 स्पष्ट करती है कि सभी सरकारी और सरकार द्वारा मान्यता प्राप्त शैक्षणिक संस्थान दिव्यांग बच्चों को बिना किसी भेदभाव के प्रवेश देंगे और उन्हें खेल, पाठ्यचर्या एवं परिसर में समान अवसर उपलब्ध कराएंगे। यह केवल एक कल्याणकारी योजना नहीं, बल्कि संविधान प्रदत्त मौलिक अधिकार है।",
    detailedContent_en:
      "National Education Policy 2020 and Section 16 of the RPwD Act 2016 mandate zero-rejection in school admissions. Inclusive education transitions from mere physical presence to active curricular participation, collaborative social development, and institutional dignity.",
    keyProvisions_hi: [
      "शून्य अस्वीकृति नीति (Zero Rejection Policy): कोई भी स्कूल दिव्यांगता के आधार पर दाखिले से मना नहीं कर सकता।",
      "निःशुल्क एवं अनिवार्य शिक्षा: 6 से 18 वर्ष तक के सभी दिव्यांग बच्चों के लिए निःशुल्क शिक्षा का वैधानिक अधिकार।",
      "बाधारहित परिसर: स्कूल भवन, खेल का मैदान, शौचालय और प्रयोगशालाओं का सार्वभौमिक सुगम्यता मानकों के अनुरूप होना।",
      "सहानुभूति नहीं, अधिकार-आधारित दृष्टिकोण: सहभागिता और आत्मसम्मान को प्राथमिकता।",
    ],
    keyProvisions_en: [
      "Zero Rejection Policy: No school can deny admission on grounds of impairment or disability.",
      "Free & Compulsory Education: Statutory right to free education up to age 18 for children with disabilities.",
      "Barrier-free Environment: Obligation to ensure school buildings, playgrounds, toilets, and labs meet universal design codes.",
      "Rights-based Pedagogy: Moving from charity and segregation to equal educational entitlement.",
    ],
    actionSteps_hi: [
      "स्कूल प्रबंधन समिति (SMC) में दिव्यांग विद्यार्थियों के अभिभावकों का प्रतिनिधित्व सुनिश्चित करें।",
      "नामांकन अभियान के दौरान गांव/वार्ड स्तर पर दिव्यांग बच्चों की पहचान कर तुरंत स्कूल से जोड़ें।",
      "सहपाठियों के बीच समावेशिता और संवेदनशीलता बढ़ाने के लिए नियमित सह-शैक्षणिक कार्यशालाएं आयोजित करें।",
    ],
    actionSteps_en: [
      "Ensure mandatory representation of parents of CwSN on School Management Committees (SMCs).",
      "Conduct door-to-door community mapping to enroll out-of-school children with disabilities.",
      "Organize peer-sensitization workshops to foster a culture of empathy, mutual respect, and zero bullying.",
    ],
    officialReference: "RPwD Act 2016 (धारा 16 व 17) एवं NEP 2020 (अध्याय 6)",
    officialReferenceUrl: "https://disabilityaffairs.gov.in/",
  },
  {
    id: "topic-reasonable-accommodation",
    slug: "reasonable-accommodation",
    title_hi: "उचित समायोजन (Reasonable Accommodation)",
    title_en: "Reasonable Accommodation",
    tagline_hi: "समान अवसर सुनिश्चित करने हेतु आवश्यक और उपयुक्त संशोधन",
    tagline_en: "Necessary and appropriate modifications to guarantee equal opportunity",
    summary_hi:
      "उचित समायोजन का अर्थ है विद्यार्थी की विशिष्ट आवश्यकता के अनुसार परीक्षा, बैठने की व्यवस्था, समय सीमा और पठन-पाठन में ऐसे व्यावहारिक बदलाव करना जिससे उस पर कोई अनुचित बोझ न पड़े और वह अपनी पूरी क्षमता दिखा सके।",
    summary_en:
      "Reasonable accommodation refers to necessary, individualized modifications and adjustments in pedagogy, exams, and environment that do not impose a disproportionate burden.",
    detailedContent_hi:
      "RPwD Act 2016 की धारा 2(y) के तहत उचित समायोजन से इनकार करना दिव्यांगता-आधारित भेदभाव माना जाता है। उदाहरण के लिए, परीक्षा में अतिरिक्त समय (20 मिनट प्रति घंटा), लेखक (Scribe) की सुविधा, भूतल पर परीक्षा केंद्र की व्यवस्था, बड़े अक्षरों वाले प्रश्नपत्र, या मौखिक परीक्षा की अनुमति देना उचित समायोजन के दायरे में आते हैं।",
    detailedContent_en:
      "Under Section 2(y) and Section 3 of the RPwD Act 2016, denial of reasonable accommodation constitutes unlawful discrimination. It encompasses exam compensatory time (20 minutes per hour), scribes/readers, ground-floor examination seatings, large-font question papers, and alternative evaluation modalities.",
    keyProvisions_hi: [
      "परीक्षा में प्रति घंटा 20 मिनट का अतिरिक्त समय (Compensatory Time)।",
      "अपनी पसंद का लेखक (Scribe) या रीडर रखने की आधिकारिक अनुमति।",
      "कक्षा अथवा परीक्षा केंद्र का हमेशा भूतल (Ground Floor) पर आवंटन यदि रैंप/लिफ्ट उपलब्ध न हो।",
      "कक्षा में आगे बैठने की सुविधा और आवश्यकतानुसार विश्राम अंतराल (Rest Breaks)।",
    ],
    keyProvisions_en: [
      "Compensatory time of 20 minutes per hour of examination duration.",
      "Right to choose an eligible scribe/reader or use computer-based assistive software.",
      "Mandatory ground-floor classroom/exam seating allocation whenever upper floors lack ramp or elevator access.",
      "Front-row classroom seating and flexible rest intervals during prolonged academic tasks.",
    ],
    actionSteps_hi: [
      "सत्र की शुरुआत में ही बच्चे की व्यक्तिगत मूल्यांकन रिपोर्ट के आधार पर आवश्यक छूटों का निर्धारण करें।",
      "परीक्षा बोर्डों द्वारा जारी दिव्यांगता-संबंधी दिशा-निर्देशों की प्रति स्कूल नोटिस बोर्ड पर चस्पा करें।",
      "शिक्षकों को जागरूक करें कि समायोजन कोई अनुकंपा नहीं बल्कि कानूनी अधिकार है।",
    ],
    actionSteps_en: [
      "Document needed accommodations during student intake in an Individualized Education Plan (IEP).",
      "Display official CBSE / State Board accommodation guidelines clearly in school administrative offices.",
      "Train invigilators and evaluation teams on permissible adaptations before examination cycles.",
    ],
    officialReference: "RPwD Act 2016 धारा 2(y) व सामाजिक न्याय मंत्रालय के परीक्षा दिशा-निर्देश 2018",
    officialReferenceUrl: "https://disabilityaffairs.gov.in/",
  },
  {
    id: "topic-special-educators",
    slug: "special-educators-and-resource-support",
    title_hi: "विशेष शिक्षक एवं रिसोर्स सपोर्ट",
    title_en: "Special Educators & Resource Support",
    tagline_hi: "समावेशी शिक्षण की रीढ़: व्यक्तिगत शिक्षा योजना (IEP) और विशेषज्ञ मार्गदर्शन",
    tagline_en: "The backbone of inclusion: Individualized Education Plans and specialist pedagogy",
    summary_hi:
      "विशेष शिक्षक (Special Educators) सामान्य शिक्षकों के साथ मिलकर दिव्यांग बच्चों के व्यक्तिगत सीखने के स्तर का आकलन करते हैं और उनके लिए अनुकूलित शिक्षण पद्धतियां तैयार करते हैं।",
    summary_en:
      "Special educators partner with general classroom teachers to design Individualized Education Plans (IEPs), adapt learning strategies, and provide cross-disability assistive support.",
    detailedContent_hi:
      "माननीय सर्वोच्च न्यायालय के रजनीश कुमार पांडे बनाम भारत संघ (2021) निर्णय के अनुसार प्राथमिक स्तर पर 10 दिव्यांग बच्चों पर 1 विशेष शिक्षक तथा उच्च प्राथमिक/माध्यमिक स्तर पर 15 बच्चों पर 1 विशेष शिक्षक का अनुपात होना अनिवार्य है। बिहार के स्कूलों में समग्र शिक्षा अभियान के तहत रिसोर्स शिक्षकों की नियुक्ति और रिसोर्स रूम (BRC/CRC) का सुदृढ़ीकरण अत्यंत महत्वपूर्ण कदम है।",
    detailedContent_en:
      "As directed by the Supreme Court of India in Rajneesh Kumar Pandey v. Union of India (2021), a pupil-teacher ratio of 10:1 at primary and 15:1 at secondary levels is legally mandated for special education personnel. Resource teachers bridge diagnostic assessments with daily classroom pedagogy.",
    keyProvisions_hi: [
      "प्रत्येक दिव्यांग विद्यार्थी के लिए व्यक्तिगत शिक्षा योजना (IEP) का निर्माण एवं त्रैमासिक समीक्षा।",
      "सामान्य शिक्षकों को दिव्यांगता-अनुकूल शिक्षण तकनीकों का इन-सर्विस प्रशिक्षण देना।",
      "रिसोर्स रूम में सहायक उपकरणों के उपयोग का अभ्यास और दैनिक जीवन कौशल (ADL) प्रशिक्षण।",
      "अभिभावकों के साथ नियमित परामर्श और घर पर शिक्षण सहायता हेतु मार्गदर्शन।",
    ],
    keyProvisions_en: [
      "Formulation and quarterly review of an Individualized Education Plan (IEP) for each student with CwSN.",
      "Co-teaching and capacity-building for general subject teachers on differentiated instruction.",
      "Operation of Block/School Resource Rooms equipped with sensory aids and daily-living skills tools.",
      "Structured parental counseling and home-based learning continuity strategies.",
    ],
    actionSteps_hi: [
      "पटना जिले के संकुल संसाधन केंद्रों (CRC) में रिसोर्स शिक्षकों की नियमित उपस्थिति सुनिश्चित करें।",
      "सामान्य शिक्षकों और विशेष शिक्षकों के बीच साप्ताहिक समन्वय बैठक आयोजित करें।",
      "IEP लक्ष्यों की प्रगति का दस्तावेजीकरण करें और रिपोर्ट कार्ड में केवल अंकों के बजाय कौशल विकास को स्थान दें।",
    ],
    actionSteps_en: [
      "Establish structured roster visits for itinerant special educators across Patna cluster schools.",
      "Schedule weekly planning time between general classroom teachers and resource personnel.",
      "Track developmental milestones alongside curricular marks in holistic progress cards.",
    ],
    officialReference: "सर्वोच्च न्यायालय निर्णय (2021) एवं समग्र शिक्षा मार्गदर्शिका",
    officialReferenceUrl: "https://samagra.education.gov.in/",
  },
  {
    id: "topic-accessible-learning-materials",
    slug: "accessible-learning-materials",
    title_hi: "सुलभ शिक्षण सामग्री (Accessible Learning Materials)",
    title_en: "Accessible Learning Materials",
    tagline_hi: "ब्रेल, बड़े अक्षर, ऑडियो, सरल भाषा और डिजिटल प्रारूपों में पाठ्य सामग्री",
    tagline_en: "Braille, large print, audiobooks, easy-to-read text, and accessible digital media",
    summary_hi:
      "यदि पाठ्यपुस्तकें और शिक्षण सामग्री केवल सामान्य मुद्रित रूप में हैं, तो दृष्टिबाधित, सीखने की अक्षमता (Dyslexia) या बौद्धिक दिव्यांगता वाले बच्चे पीछे छूट जाते हैं। सुलभ सामग्री सभी को सीखने का समान अवसर देती है।",
    summary_en:
      "Learning content must be available in alternative accessible formats—including Braille, large print, DAISY audiobooks, and easy-to-read Hindi—to ensure universal curricular access.",
    detailedContent_hi:
      "RPwD Act 2016 की धारा 17(f) के अनुसार सरकार का दायित्व है कि वह दृष्टिबाधित बच्चों को ब्रेल व ऑडियो में, और श्रवणबाधित बच्चों को सांकेतिक भाषा (ISL) में पाठ्यपुस्तकें सत्र के पहले दिन उपलब्ध कराए। NCERT की 'प्रज्ञाता' (PRAGYATA) गाइडलाइंस और 'दीक्षा' (DIKSHA) पोर्टल पर उपलब्ध सुलभ ई-सामग्री को कक्षा में अपनाना अनिवार्य है।",
    detailedContent_en:
      "Section 17(f) of the RPwD Act 2016 obligates educational authorities to supply books and materials in alternative formats free of cost before the academic session starts. This includes Indian Sign Language (ISL) video lessons, DAISY audio formats, and tactile graphics.",
    keyProvisions_hi: [
      "दृष्टिबाधित बच्चों के लिए सत्र प्रारंभ होते ही निःशुल्क ब्रेल पाठ्यपुस्तकें।",
      "अल्प-दृष्टि (Low Vision) वाले बच्चों के लिए 18pt+ फॉन्ट वाली बड़े अक्षरों (Large Print) की पुस्तकें।",
      "श्रवणबाधित बच्चों के लिए भारतीय सांकेतिक भाषा (ISL) सबटाइटल वाले वीडियो पाठ।",
      "बौद्धिक दिव्यांगता और ऑटिज्म वाले विद्यार्थियों के लिए सचित्र 'सरल पठन' (Easy-to-Read) सामग्री।",
    ],
    keyProvisions_en: [
      "Timely distribution of embossed Braille textbooks prior to the beginning of the school year.",
      "Large-print high-contrast textbooks (minimum 18pt font) for students with low vision.",
      "Indian Sign Language (ISL) interpreted video lessons and captioned audiovisual resources.",
      "Pictorial easy-to-read summaries and social stories for neurodivergent and autistic learners.",
    ],
    actionSteps_hi: [
      "स्कूल लाइब्रेरी में एक समर्पित 'सुलभ पुस्तक कोना' (Accessible Reading Corner) स्थापित करें।",
      "दीक्षा (DIKSHA) ऐप पर उपलब्ध सुलभ ई-कंटेंट का उपयोग करने हेतु स्कूल टैबलेट/कंप्यूटर का उपयोग करें।",
      "शिक्षकों को खुद से साधारण स्पर्शनीय चार्ट और त्रि-आयामी (3D) शिक्षण मॉडल तैयार करने हेतु प्रेरित करें।",
    ],
    actionSteps_en: [
      "Set up a dedicated accessible reading corner in school libraries equipped with audiobooks and tactile charts.",
      "Utilize PM e-VIDYA and DIKSHA accessible repositories on school smartboards and tablets.",
      "Encourage teachers to craft localized low-cost tactile diagrams using clay, string, and textured paper.",
    ],
    officialReference: "RPwD Act 2016 धारा 17(f) व NCERT प्रज्ञाता डिजिटल शिक्षा दिशानिर्देश",
    officialReferenceUrl: "https://ncert.nic.in/",
  },
  {
    id: "topic-assistive-technology",
    slug: "assistive-technology",
    title_hi: "सहायक प्रौद्योगिकी एवं उपकरण (Assistive Technology)",
    title_en: "Assistive Technology & Devices",
    tagline_hi: "तकनीक के माध्यम से बाधाओं को दूर करना और स्वतंत्र अधिगम को संभव बनाना",
    tagline_en: "Eliminating barriers through assistive hardware, software, and mobility aids",
    summary_hi:
      "सहायक उपकरण जैसे व्हीलचेयर, ट्राईपॉड छड़ी, हियरिंग एड, स्क्रीन रीडर और स्पीच-टू-टेक्स्ट सॉफ्टवेयर दिव्यांग विद्यार्थियों को किसी पर निर्भर हुए बिना अपनी कक्षा में पूरी तरह भाग लेने में सक्षम बनाते हैं।",
    summary_en:
      "Assistive technologies—ranging from screen readers and hearing aids to adapted keyboards and communication apps—foster autonomy and active classroom engagement.",
    detailedContent_hi:
      "समग्र शिक्षा और ADIP योजना (भारत सरकार) के अंतर्गत विद्यालयों में पढ़ने वाले दिव्यांग बच्चों को आवश्यकतानुसार सहायक उपकरणों का निःशुल्क वितरण किया जाता है। महत्वपूर्ण यह है कि स्कूल के कंप्यूटरों में NVDA जैसा निःशुल्क स्क्रीन रीडर, मैग्निफायर और फॉन्ट-साइज कंट्रोल टूल्स पहले से इंस्टॉल हों, ताकि कंप्यूटर लैब भी हर बच्चे के लिए सुगम रहे।",
    detailedContent_en:
      "Government schemes such as ADIP (Assistance to Disabled Persons for Purchase/Fitting of Aids and Appliances) and Samagra Shiksha facilitate device distribution. Schools must ensure ICT labs run open-source screen readers (like NVDA), screen magnification tools, and accessible keyboards.",
    keyProvisions_hi: [
      "ADIP और समग्र शिक्षा शिविरों के माध्यम से वार्षिक आधार पर सहायक उपकरणों का निःशुल्क वितरण व मरम्मत।",
      "स्कूल कंप्यूटर लैब में NVDA स्क्रीन रीडर एवं सुगम फॉन्ट्स की अनिवार्य स्थापना।",
      "बोलने में असमर्थ बच्चों के लिए चित्र-आधारित वैकल्पिक संवाद बोर्ड (AAC Boards)।",
      "मोटर अक्षमता वाले विद्यार्थियों के लिए ग्रिप-अनुकूलित पेन, स्लांटेड डेस्क और माउस विकल्प।",
    ],
    keyProvisions_en: [
      "Annual assessment and distribution of personalized assistive devices under ADIP / Samagra Shiksha.",
      "Installation of open-source screen readers (e.g., NVDA in Hindi/English) on all ICT lab workstations.",
      "Low-tech and high-tech Augmentative and Alternative Communication (AAC) boards for non-verbal students.",
      "Ergonomic pen grips, weighted pencil holders, and angled desktop easels for motor impairment.",
    ],
    actionSteps_hi: [
      "प्रखंड संसाधन केंद्र (BRC) के सहयोग से स्कूल में अध्ययनरत बच्चों के सहायक उपकरणों की कार्यशीलता की जांच करवाएं।",
      "कंप्यूटर शिक्षक को स्क्रीन रीडर और शॉर्टकट कीज का बुनियादी प्रशिक्षण दें।",
      "उपकरण टूटने या खराब होने पर मरम्मत हेतु समग्र शिक्षा सहायता फंड के लिए तुरंत आवेदन करें।",
    ],
    actionSteps_en: [
      "Conduct bi-annual maintenance audits of hearing aid batteries, wheelchair brakes, and orthotic calipers.",
      "Equip computer science instructors with basic proficiency in screen reader accessibility shortcuts.",
      "Leverage Samagra Shiksha device replacement grants whenever a growing child outgrows an appliance.",
    ],
    officialReference: "ADIP योजना दिशानिर्देश एवं RPwD Act 2016 धारा 17(g)",
    officialReferenceUrl: "https://alimco.in/",
  },
];
