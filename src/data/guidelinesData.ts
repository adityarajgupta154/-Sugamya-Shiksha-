export interface GuidelineItem {
  id: string;
  slug: string;
  title_hi: string;
  title_en: string;
  shortSummary_hi: string;
  shortSummary_en: string;
  isPrimaryReference?: boolean;
  officialOrg: string;
  year: string;
  officialUrl: string;
  easyExplanation_hi: string;
  easyExplanation_en: string;
  mainProvisions_hi: string[];
  mainProvisions_en: string[];
  relatedSections_hi: string[];
  relatedSections_en: string[];
  checklist_hi: string[];
  checklist_en: string[];
}

export const GUIDELINES_DATA: GuidelineItem[] = [
  {
    id: "accessibility-code-2024",
    slug: "accessibility-code-for-educational-institutions-2024",
    title_hi: "शैक्षणिक संस्थानों के लिए अभिगम्यता कोड, 2024 (Accessibility Code)",
    title_en: "Accessibility Code for Educational Institutions, 2024",
    shortSummary_hi: "विद्यालय भवनों, कक्षाओं, शौचालयों और खेल के मैदानों के लिए सर्वप्रमुख राष्ट्रीय तकनीकी मानक।",
    shortSummary_en: "The primary national technical standard for building and facility accessibility in all schools across India.",
    isPrimaryReference: true,
    officialOrg: "Ministry of Education, Government of India",
    year: "January 2024",
    officialUrl: "https://www.education.gov.in",
    easyExplanation_hi:
      "यह कोड जनवरी 2024 में भारत सरकार के शिक्षा मंत्रालय द्वारा अधिसूचित किया गया है। यह स्पष्ट करता है कि भारत के प्रत्येक स्कूल में रैंप का ढलान, दरवाजों की चौड़ाई, स्पर्शनीय रास्ते (टैक्टाइल पाथ), सुगम पेयजल और व्हीलचेयर सुलभ शौचालय किस मानक के अनुसार होने चाहिए। यह इस शोध मंच का मुख्य तकनीकी संदर्भ है।",
    easyExplanation_en:
      "Notified by the Ministry of Education, Government of India in January 2024, this code serves as the primary technical benchmark specifying precise architectural and infrastructural standards (ramps, doors, accessible sanitation, tactile paving, emergency exits) for educational institutions.",
    mainProvisions_hi: [
      "सभी शैक्षणिक भवनों के प्रवेश द्वार पर बाधारहित समतल पहुँच अथवा मानक रैंप की अनिवार्यता।",
      "पहियाकुर्सी (व्हीलचेयर) के सुगम संचालन हेतु कक्षाओं और सुविधाओं के दरवाजों की न्यूनतम स्पष्ट चौड़ाई। [विस्तृत खंड संख्या: ग्राहक पुष्टि प्रतीक्षित]",
      "दिव्यांग विद्यार्थियों एवं शिक्षकों हेतु प्रत्येक मंजिल पर सुलभ यूनिसेक्स शौचालय सुविधा।",
      "दृष्टिबाधित विद्यार्थियों के लिए परिसर में चेतावनि एवं दिशासूचक टैक्टाइल पाथवे।",
      "आपातकालीन निकास और श्रवण-दृश्य दोनों माध्यमों में संकेतक प्रणाली।"
    ],
    mainProvisions_en: [
      "Mandatory barrier-free ground-level access or standardized ramps at all educational building entrances.",
      "Clear minimum doorway opening widths for all classrooms and educational facilities to allow wheelchair transit. [Specific clause numbers: pending official client confirmation]",
      "Accessible unisex toilet facilities on accessible levels with grab bars and emergency pull cords.",
      "Tactile guiding and warning pathways for students and visitors with visual impairments.",
      "Visual and audible emergency egress signaling systems across all campus zones."
    ],
    relatedSections_hi: [
      "अध्याय 3: विद्यालय भवन परिसर एवं बाहरी आवागमन मानक",
      "अध्याय 4: रैंप, सीढ़ियाँ एवं रेलिंग विनिर्देश",
      "अध्याय 5: सुगम स्वच्छता सुविधाएं (शौचालय व पेयजल)",
      "अध्याय 7: साइनेज, प्रकाश व्यवस्था एवं आपातकालीन निकास"
    ],
    relatedSections_en: [
      "Chapter 3: School Campus Exterior Transit & Entrances",
      "Chapter 4: Ramps, Handrails, and Vertical Circulation Specifications",
      "Chapter 5: Accessible Sanitation & Drinking Water Facilities",
      "Chapter 7: Signage, Lighting, and Emergency Egress Protocols"
    ],
    checklist_hi: [
      "क्या मुख्य स्कूल प्रवेश द्वार पर 1:12 अनुपात का ढालू रैंप और दोनों तरफ दोहरी रेलिंग मौजूद है?",
      "क्या क्लासरूम और लैब के दरवाजों की खुली चौड़ाई कम से कम 900 मिमी है?",
      "क्या व्हीलचेयर उपयोगकर्ता के लिए उपयुक्त पकड़ रेल (Grab Bars) युक्त सुलभ शौचालय क्रियाशील है?",
      "क्या पीने के पानी के नल की ऊंचाई प्राथमिक और माध्यमिक स्तर के बच्चों के लिए सुगम है?",
      "क्या सीढ़ियों और रैंप के शुरू व अंत में स्पर्शनीय चेतावनी टाइलें (Tactile Warning Strips) लगी हैं?"
    ],
    checklist_en: [
      "Is there a continuous barrier-free entrance or gentle 1:12 ramp with continuous double handrails?",
      "Do classroom and laboratory doors have a clear opening width of at least 900mm?",
      "Is an accessible toilet stall with appropriate grab rails and outward-opening door operational?",
      "Is accessible drinking water available at an ergonomic height for children using mobility devices?",
      "Are tactile warning floor indicators installed at the approach to stairs, ramps, and level changes?"
    ],
  },
  {
    id: "rpwd-act-2016",
    slug: "rpwd-act-2016",
    title_hi: "दिव्यांगजन अधिकार अधिनियम, 2016 (RPwD Act, 2016)",
    title_en: "Rights of Persons with Disabilities Act, 2016 (RPwD Act, 2016)",
    shortSummary_hi: "दिव्यांग विद्यार्थियों के अधिकार, गैर-भेदभाव और समावेशी शिक्षा की वैधानिक गारंटी।",
    shortSummary_en: "Statutory rights of students with disabilities, non-discrimination, and legal mandate for inclusive education.",
    officialOrg: "Ministry of Social Justice and Empowerment, Govt. of India",
    year: "2016",
    officialUrl: "https://disabilityaffairs.gov.in",
    easyExplanation_hi:
      "RPwD अधिनियम 2016 भारत में दिव्यांग व्यक्तियों के अधिकारों की सुरक्षा करने वाला केंद्रीय कानून है। धारा 16 और 17 स्पष्ट रूप से सभी सरकारी और सरकार द्वारा मान्यता प्राप्त शैक्षणिक संस्थानों को निर्देश देती हैं कि वे दिव्यांग बच्चों को बिना भेदभाव के प्रवेश दें और समावेशी शिक्षा प्रदान करें।",
    easyExplanation_en:
      "The Rights of Persons with Disabilities Act, 2016 is India's principal disability rights statute. Sections 16 and 17 mandate all government-funded and recognized educational institutions to admit children with disabilities without discrimination and provide education in inclusive environments.",
    mainProvisions_hi: [
      "धारा 16: उपयुक्त सरकार एवं स्थानीय प्राधिकरण सभी शिक्षण संस्थानों में समावेशी शिक्षा सुनिश्चित करेंगे।",
      "धारा 16(i): बिना किसी भेदभाव के प्रवेश और समान अवसर उपलब्ध कराना।",
      "धारा 16(ii): परिसर को बाधारहित एवं पूर्णतः सुगम (accessible) बनाना।",
      "धारा 16(iii): विद्यार्थी की व्यक्तिगत आवश्यकतानुसार उचित समायोजन (Reasonable Accommodation) प्रदान करना।",
      "धारा 17: समावेशी शिक्षा को बढ़ावा देने हेतु विशिष्ट सर्वेक्षण और शिक्षक प्रशिक्षण।"
    ],
    mainProvisions_en: [
      "Section 16: Duties of educational institutions to provide inclusive education without discrimination.",
      "Section 16(ii): Mandate to make school buildings, campus, and facilities accessible to students with disabilities.",
      "Section 16(iii): Obligation to provide reasonable accommodation tailored to individual student needs.",
      "Section 17: Measures to promote inclusive education, teacher training, and assistive equipment provision.",
      "Section 45: Time limits for making existing public infrastructure accessible."
    ],
    relatedSections_hi: [
      "धारा 16 — शैक्षणिक संस्थानों के कर्तव्य",
      "धारा 17 — समावेशी शिक्षा को बढ़ावा देने के विशिष्ट उपाय",
      "धारा 45 — मौजूदा बुनियादी ढांचे को सुगम बनाने की समय-सीमा"
    ],
    relatedSections_en: [
      "Section 16 — Duties of educational institutions",
      "Section 17 — Specific measures to promote and facilitate inclusive education",
      "Section 45 — Rules for accessibility of existing infrastructure"
    ],
    checklist_hi: [
      "क्या स्कूल किसी भी दिव्यांग बच्चे को प्रवेश देने से मना तो नहीं करता?",
      "क्या स्कूल में बच्चे की आवश्यकतानुसार सहायक उपकरण और विशेष शिक्षण सामग्री उपलब्ध है?",
      "क्या परीक्षा में श्रुतलेखक (scribe) अथवा अतिरिक्त समय का प्रावधान लागू है?",
      "क्या विद्यालय प्रशासन परिसर को सुगम बनाने हेतु निर्धारित समयसीमा का पालन कर रहा है?"
    ],
    checklist_en: [
      "Does the school guarantee zero-rejection admissions for children with disabilities?",
      "Are necessary reasonable accommodations and assistive learning resources provided?",
      "Are compensatory time and scribe accommodations honored during institutional examinations?",
      "Has the school conducted an accessibility self-assessment under Section 45 timeline commitments?"
    ],
  },
  {
    id: "rpwd-rules-2017",
    slug: "rpwd-rules-2017",
    title_hi: "दिव्यांगजन अधिकार नियम, 2017 (RPwD Rules, 2017)",
    title_en: "Rights of Persons with Disabilities Rules, 2017",
    shortSummary_hi: "भौतिक पर्यावरण, परिवहन और सूचना एवं संचार प्रौद्योगिकी हेतु आधिकारिक मानक।",
    shortSummary_en: "Notified accessibility standards for physical environment, transport, and ICT.",
    officialOrg: "Ministry of Social Justice and Empowerment, Govt. of India",
    year: "2017",
    officialUrl: "https://disabilityaffairs.gov.in",
    easyExplanation_hi:
      "RPwD नियम 2017 का नियम 15 यह निर्धारित करता है कि प्रत्येक सार्वजनिक भवन (जिसमें स्कूल शामिल हैं) को निर्धारित सार्वभौमिक मानकों के अनुरूप निर्मित व अनुकूलित किया जाना चाहिए।",
    easyExplanation_en:
      "Rule 15 of the RPwD Rules 2017 specifies statutory accessibility standards for public buildings, built environment, and digital systems, mandating compliance across educational facilities.",
    mainProvisions_hi: [
      "नियम 15: सार्वजनिक भवनों के लिए सार्वभौमिक अभिगम्यता मानकों का अनिवार्य अनुपालन।",
      "हार्मोनाइज्ड दिशानिर्देशों के तकनीकी अनुभागों को आधिकारिक कानूनी दर्जा देना।",
      "नई इमारतों को पूर्णता प्रमाणपत्र (Completion Certificate) तभी मिलेगा जब वे मानकों पर खरी उतरेंगी।"
    ],
    mainProvisions_en: [
      "Rule 15: Compulsory compliance with Harmonised Guidelines for all public buildings.",
      "Legal adoption of national universal accessibility codes for physical infrastructure.",
      "Occupancy / completion certificate contingent on verified accessibility audit compliance."
    ],
    relatedSections_hi: [
      "नियम 15: भौतिक पर्यावरण, परिवहन और सूचना प्रौद्योगिकी में सुगम्यता के मानक",
      "नियम 15(1)(क): भवनों में सुगम्यता हेतु तकनीकी विनिर्देश"
    ],
    relatedSections_en: [
      "Rule 15: Standards for accessibility of physical environment and information systems",
      "Rule 15(1)(a): Technical specifications for public and educational buildings"
    ],
    checklist_hi: [
      "क्या स्कूल भवन के नक्शे में सार्वभौमिक सुगम्यता प्रावधान स्वीकृत हैं?",
      "क्या स्कूल की वेबसाइट और डिजिटल नोटिस बोर्ड सुगम्यता मानकों (GIGW / WCAG) का पालन करते हैं?"
    ],
    checklist_en: [
      "Were school facility modifications reviewed against Rule 15 physical accessibility standards?",
      "Are digital school communications accessible to screen reading assistive technologies?"
    ],
  },
  {
    id: "harmonised-guidelines-2021",
    slug: "harmonised-guidelines-2021",
    title_hi: "सार्वभौमिक अभिगम्यता हेतु हार्मोनाइज्ड दिशानिर्देश, 2021",
    title_en: "Harmonised Guidelines and Standards for Universal Accessibility in India, 2021",
    shortSummary_hi: "भारत में सार्वजनिक भवनों एवं भौतिक परिवेश हेतु व्यापक वास्तुकला मानक।",
    shortSummary_en: "Comprehensive national architectural guidelines for universal accessibility in the built environment.",
    officialOrg: "Ministry of Housing and Urban Affairs (MoHUA), Government of India",
    year: "2021",
    officialUrl: "https://mohua.gov.in",
    easyExplanation_hi:
      "यह दस्तावेज़ भारत सरकार के आवासन और शहरी कार्य मंत्रालय द्वारा तैयार किया गया है। इसमें सीढ़ी, लिफ्ट, गलियारे, दरवाजे, रैंप, पार्किंग और आपातकालीन निकासी के सटीक माप और वास्तुकला चित्र दिए गए हैं।",
    easyExplanation_en:
      "Published by MoHUA, these comprehensive guidelines define dimensional parameters, clearances, gradient limits, tactile floor patterns, and anthropometric criteria for universal barrier-free access in India.",
    mainProvisions_hi: [
      "रैंप का अधिकतम ढलान अनुपात: 1:12 (अत्यधिक वांछनीय 1:15 से 1:20)।",
      "दोनों ओर 760 मिमी और 900 मिमी की ऊंचाई पर दोहरी निरंतर हैंडरेलिंग।",
      "गलियारों की न्यूनतम स्पष्ट चौड़ाई: 1800 मिमी ताकि दो व्हीलचेयर एक साथ गुजर सकें।",
      "उभरे हुए ब्रेल अक्षरों और उच्च कंट्रास्ट वाले साइनेज।"
    ],
    mainProvisions_en: [
      "Maximum ramp gradient slope of 1:12 (with preferred gentler slopes of 1:15 to 1:20 for long spans).",
      "Continuous double handrails mounted at 760mm and 900mm heights with smooth rounded profile.",
      "Clear corridor transit widths enabling two wheelchair users to pass safely.",
      "High-contrast tactile ground surface indicators (TGSI) and tactile braille signage."
    ],
    relatedSections_hi: [
      "अनुभाग 4: भवन प्रवेश, रास्ते एवं पार्किंग",
      "अनुभाग 5: ऊर्ध्वाधर आवागमन (रैंप, सीढ़ियाँ, लिफ्ट)",
      "अनुभाग 6: सैनिटरी सुविधाएं",
      "अनुभाग 8: साइनेज और मार्गदर्शन"
    ],
    relatedSections_en: [
      "Section 4: Building Entrances, Access Routes & Parking",
      "Section 5: Vertical Circulation (Ramps, Stairs, Elevators)",
      "Section 6: Sanitary Facilities & Ergonomics",
      "Section 8: Signage, Lighting, and Wayfinding"
    ],
    checklist_hi: [
      "क्या रैंप के दोनों सिरों पर कम से कम 1500x1500 मिमी का समतल लैंडिंग स्थान है?",
      "क्या फर्श की सतह गैर-फिसलन (non-slip) और दृढ़ है?",
      "क्या साइनेज में अक्षरों का कंट्रास्ट पृष्ठभूमि से 70% या अधिक है?"
    ],
    checklist_en: [
      "Are level landing platforms (min 1500x1500mm) provided at ramp heads, foot, and turn points?",
      "Is the flooring surface slip-resistant in both dry and wet conditions?",
      "Does room signage feature tactile raised typography and high visual contrast?"
    ],
  },
  {
    id: "rte-act-2009",
    slug: "rte-act-2009",
    title_hi: "निःशुल्क और अनिवार्य बाल शिक्षा का अधिकार अधिनियम, 2009 (RTE Act, 2009)",
    title_en: "Right of Children to Free and Compulsory Education Act, 2009 (RTE Act)",
    shortSummary_hi: "6 से 14 वर्ष के सभी बच्चों के लिए निःशुल्क और अनिवार्य शिक्षा का मौलिक अधिकार।",
    shortSummary_en: "Fundamental right to free and compulsory elementary education for all children aged 6 to 14.",
    officialOrg: "Ministry of Education, Government of India",
    year: "2009",
    officialUrl: "https://www.education.gov.in",
    easyExplanation_hi:
      "RTE कानून यह सुनिश्चित करता है कि 6 से 14 वर्ष की आयु का कोई भी बच्चा शिक्षा से वंचित न रहे। दिव्यांग बच्चों को भी बिना किसी शुल्क और बाधा के अपनी पसंद के पड़ोस के स्कूल में पढ़ने का कानूनी अधिकार है। अनुसूची (Schedule) में बाधारहित स्कूल भवन और अलग शौचालयों की अनिवार्यता दी गई है।",
    easyExplanation_en:
      "The RTE Act 2009 enshrines the constitutional guarantee to free and compulsory elementary education. Its Schedule mandates all schools to provide barrier-free access and separate functional toilet facilities for boys and girls.",
    mainProvisions_hi: [
      "धारा 3: सभी बच्चों को निःशुल्क एवं अनिवार्य प्रारंभिक शिक्षा का अधिकार।",
      "अनुसूची मानदंड: विद्यालय भवन में बाधारहित पहुँच (Barrier-free access) का होना अनिवार्य है।",
      "अनुसूची मानदंड: बालिकाओं एवं बालकों के लिए अलग क्रियाशील शौचालय और सुरक्षित पेयजल।"
    ],
    mainProvisions_en: [
      "Section 3: Right of every child to free and compulsory elementary education in a neighborhood school.",
      "Schedule norms: Mandatory provision of barrier-free access in school infrastructure.",
      "Schedule norms: Clean, separate, functional sanitation facilities for boys and girls."
    ],
    relatedSections_hi: [
      "धारा 3 — निःशुल्क और अनिवार्य शिक्षा का अधिकार",
      "धारा 8 व 9 — सरकार और स्थानीय प्राधिकरण के कर्तव्य",
      "अधिनियम की अनुसूची — स्कूल के लिए न्यूनतम मानक व मानदंड"
    ],
    relatedSections_en: [
      "Section 3 — Right of child to free and compulsory education",
      "Section 8 & 9 — Duties of appropriate Government and local authority",
      "The Schedule — Norms and standards for a school"
    ],
    checklist_hi: [
      "क्या स्कूल में दिव्यांग बच्चों के लिए कोई प्रवेश शुल्क या गुप्त शुल्क नहीं लिया जा रहा?",
      "क्या स्कूल भवन अनुसूची के बाधारहित मानकों को पूरा करता है?",
      "क्या स्कूल में पीने का स्वच्छ पानी और क्रियाशील शौचालय उपलब्ध हैं?"
    ],
    checklist_en: [
      "Is zero-fee elementary schooling strictly ensured for all enrolled children?",
      "Does the school infrastructure comply with Schedule requirements for barrier-free access?",
      "Are clean drinking water and maintained sanitary facilities accessible on site?"
    ],
  },
  {
    id: "nep-2020",
    slug: "nep-2020",
    title_hi: "राष्ट्रीय शिक्षा नीति 2020 (NEP 2020)",
    title_en: "National Education Policy 2020 (NEP 2020)",
    shortSummary_hi: "समावेशी और समतामूलक शिक्षा: SEDG और दिव्यांग बच्चों पर विशेष फोकस।",
    shortSummary_en: "Equitable and inclusive education framework with dedicated focus on SEDG and children with disabilities.",
    officialOrg: "Ministry of Education, Government of India",
    year: "2020",
    officialUrl: "https://www.education.gov.in",
    easyExplanation_hi:
      "NEP 2020 का अध्याय 6 समावेशी शिक्षा पर केंद्रित है। इसमें यह संकल्प दोहराया गया है कि दिव्यांग बच्चों (CwSN) को सामान्य बच्चों के साथ एक ही कक्षा में पढ़ने का पूरा अवसर मिले, इसके लिए स्कूलों में संसाधन कक्ष (Resource Rooms), सहायक तकनीक और सुलभ पाठ्यपुस्तकें उपलब्ध कराई जाएँगी।",
    easyExplanation_en:
      "Chapter 6 of NEP 2020 focuses on equitable education for Socio-Economically Disadvantaged Groups (SEDGs). It emphasizes barrier-free school infrastructure, assistive technologies, resource centers, and pedagogical accommodations for learners with disabilities.",
    mainProvisions_hi: [
      "अध्याय 6: सामाजिक और आर्थिक रूप से वंचित समूहों (SEDGs) के लिए समतामूलक एवं समावेशी शिक्षा।",
      "दिव्यांग बच्चों के लिए सक्षम वातावरण और सहायक उपकरण उपलब्ध कराना।",
      "विशेष शिक्षकों की नियुक्ति एवं सामान्य शिक्षकों का समावेशी शिक्षा में संवेदीकरण।",
      "भारतीय सांकेतिक भाषा (ISL) और सुलभ डिजिटल शिक्षण सामग्री का विकास।"
    ],
    mainProvisions_en: [
      "Chapter 6: Equitable and inclusive education across all school stages.",
      "Systematic provision of assistive technologies, barrier-free infrastructure, and resource support.",
      "Recruitment and integration of special educators alongside universal capacity building for teachers.",
      "Standardization of Indian Sign Language (ISL) and accessible digital curriculum materials."
    ],
    relatedSections_hi: [
      "अध्याय 6 — समतामूलक और समावेशी शिक्षा: सभी के लिए सीखना",
      "खंड 6.10 से 6.14 — दिव्यांग बच्चों की शिक्षा हेतु विशिष्ट प्रावधान"
    ],
    relatedSections_en: [
      "Chapter 6 — Equitable and Inclusive Education: Learning for All",
      "Clauses 6.10 to 6.14 — Provisions for Children with Disabilities (CwSN)"
    ],
    checklist_hi: [
      "क्या स्कूल में दिव्यांग बच्चों के लिए सहायक तकनीक (कंप्यूटर स्क्रीन रीडर, ब्रेल सामग्री आदि) उपलब्ध हैं?",
      "क्या नियमित शिक्षकों को CwSN बच्चों को पढ़ाने का बुनियादी प्रशिक्षण दिया गया है?",
      "क्या स्कूल में विशेष शिक्षक (Special Educator) का सहयोग प्राप्त है?"
    ],
    checklist_en: [
      "Are assistive learning tools and accessible formats integrated into classroom instruction?",
      "Have mainstream educators participated in inclusive pedagogy sensitization programs?",
      "Does the school receive designated visits or support from trained special educators?"
    ],
  },
  {
    id: "samagra-shiksha",
    slug: "samagra-shiksha",
    title_hi: "समग्र शिक्षा अभियान (Samagra Shiksha)",
    title_en: "Samagra Shiksha Integrated Scheme for School Education",
    shortSummary_hi: "CwSN विद्यार्थियों के लिए सहायता अनुदान, उपकरण एवं सुगम्यता फंड।",
    shortSummary_en: "Integrated school support scheme providing aids, appliance grants, and barrier-removal funding for CwSN.",
    officialOrg: "Department of School Education & Literacy, Ministry of Education",
    year: "Ongoing",
    officialUrl: "https://samagra.education.gov.in",
    easyExplanation_hi:
      "समग्र शिक्षा भारत सरकार की प्रमुख एकीकृत स्कूली शिक्षा योजना है। इसमें 'समावेशी शिक्षा घटक' के तहत स्कूलों में रैंप निर्माण, सुलभ शौचालय और CwSN बच्चों के लिए आवश्यक सहायक उपकरण (जैसे व्हीलचेयर, श्रवण यंत्र आदि) खरीदने के लिए अलग से वित्तीय सहायता दी जाती है।",
    easyExplanation_en:
      "Samagra Shiksha is the overarching flagship scheme for school education in India. Under its Inclusive Education component, dedicated grants are allocated for structural barrier removal, disabled-friendly toilets, aids and appliances, and student transport stipends.",
    mainProvisions_hi: [
      "CwSN बच्चों के लिए प्रति वर्ष निर्धारित वित्तीय सहायता एवं स्टाइपेंड।",
      "स्कूलों में रैंप और सीडब्ल्यूएसएन अनुकूल शौचालयों के निर्माण हेतु ढांचागत अनुदान।",
      "ब्लॉक स्तर पर संसाधन केंद्रों (BRC / CRC) का संचालन और सहायक उपकरण वितरण शिविर।",
      "दिव्यांग बालिकाओं के लिए विशेष परिवहन एवं एस्कॉर्ट भत्ता।"
    ],
    mainProvisions_en: [
      "Dedicated per-child allocation for student assessment, aids, appliances, and escort allowances.",
      "Targeted civil works grants to retrofit ramps and accessible toilets in elementary and secondary schools.",
      "Block-level resource centers coordinating assistive device distribution and therapist visits.",
      "Special transport allowances for girl students with disabilities to reduce dropouts."
    ],
    relatedSections_hi: [
      "समावेशी शिक्षा कार्यान्वयन रूपरेखा (Inclusive Education Framework)",
      "अवसंरचना एवं सिविल कार्य अनुदान दिशानिर्देश"
    ],
    relatedSections_en: [
      "Samagra Shiksha Inclusive Education Component Implementation Guidelines",
      "Civil Works & Institutional Infrastructure Improvement Norms"
    ],
    checklist_hi: [
      "क्या स्कूल को समग्र शिक्षा का CwSN अवसंरचना अनुदान प्राप्त हुआ है?",
      "क्या नामांकित दिव्यांग बच्चों को योजना के तहत व्हीलचेयर या हियरिंग ऐड जैसे आवश्यक उपकरण मिले हैं?",
      "क्या स्कूल में सीडब्ल्यूएसएन शौचालय चालू हालत में है?"
    ],
    checklist_en: [
      "Has the school utilized available Samagra Shiksha grants for ramp or toilet retrofits?",
      "Have enrolled CwSN students received required aids and appliances under block distribution camps?",
      "Is the designated accessible toilet maintained in an open, sanitized, and functional state?"
    ],
  },
  {
    id: "unicef-school-guide",
    slug: "unicef-school-guide",
    title_hi: "यूनिसेफ स्कूल अभिगम्यता गाइड (UNICEF Guide)",
    title_en: "Making Schools Accessible to Children with Disabilities — UNICEF India",
    shortSummary_hi: "सुलभ स्कूलों के व्यावहारिक उदाहरण, न्यूनतम लागत सुधार और केस स्टडी।",
    shortSummary_en: "Practical guidelines, low-cost modifications, and field case studies for inclusive school facilities.",
    officialOrg: "UNICEF India",
    year: "Practical Reference",
    officialUrl: "https://www.unicef.org/india",
    easyExplanation_hi:
      "यह गाइड यूनिसेफ द्वारा भारतीय स्कूलों की वास्तविक परिस्थितियों को ध्यान में रखकर बनाई गई है। इसमें दिखाया गया है कि बिना भारी बजट के भी साधारण बदलावों (जैसे रैंप की सही ढलान, साधारण रेलिंग, चौड़े दरवाजे, उचित ऊंचाई पर ब्लैकबोर्ड और नल) से स्कूल को बच्चों के लिए सुगम कैसे बनाया जा सकता है।",
    easyExplanation_en:
      "Developed specifically for Indian school realities, this guide provides low-cost practical architectural solutions, space management diagrams, and actionable barrier-elimination checklists for principals and local builders.",
    mainProvisions_hi: [
      "कम लागत में स्थानीय सामग्री से सुगम रैंप एवं रेलिंग का निर्माण।",
      "कक्षा के अंदर फर्नीचर, ब्लैकबोर्ड और बैठने की सुलभ व्यवस्था।",
      "सुलभ हाथ धोने की जगह (Handwashing Station) और खेल परिसर का अनुकूलन।",
      "सुरक्षा, प्रकाश और दृश्य स्पष्टता के व्यावहारिक उपाय।"
    ],
    mainProvisions_en: [
      "Low-cost, community-sourced materials for safe ramp gradients and non-slip surfaces.",
      "Ergonomic classroom layouts ensuring wheelchair turning radii and accessible blackboards.",
      "Inclusive design for handwashing points, school courtyards, and recreational spaces.",
      "High-contrast color demarcations for stair edges and floor hazards."
    ],
    relatedSections_hi: [
      "भाग 1: स्कूल में पहुँच (अप्रोच और प्रवेश द्वार)",
      "भाग 2: कक्षा में समावेशी वातावरण",
      "भाग 3: पानी और स्वच्छता (WASH) सुविधाएं"
    ],
    relatedSections_en: [
      "Part 1: Getting to School (Approach routes, gates, and entrances)",
      "Part 2: The Accessible Classroom Environment",
      "Part 3: Water, Sanitation, and Hygiene (WASH) for Every Child"
    ],
    checklist_hi: [
      "क्या स्कूल के हाथ धोने की जगह पर नल इतनी ऊंचाई पर है कि व्हीलचेयर पर बैठा बच्चा आराम से पहुँच सके?",
      "क्या सीढ़ियों के कोनों पर गहरे रंग की पट्टी लगी है जिससे कम दृष्टि वाले बच्चे सुरक्षित चल सकें?",
      "क्या क्लासरूम में व्हीलचेयर को मोड़ने की जगह खुली रखी गई है?"
    ],
    checklist_en: [
      "Is at least one handwashing station accessible at an ergonomic height for seated students?",
      "Are stair tread nosings highlighted with durable high-contrast paint bands?",
      "Is adequate maneuvering clearance maintained inside classrooms for mobility aids?"
    ],
  },
  {
    id: "wcag-2-2",
    slug: "wcag-2-2",
    title_hi: "वेब सामग्री अभिगम्यता दिशानिर्देश (WCAG 2.2 AA)",
    title_en: "Web Content Accessibility Guidelines (WCAG) 2.2 Level AA",
    shortSummary_hi: "इस वेबसाइट की डिजिटल सुगम्यता: कीबोर्ड, स्क्रीन रीडर और कंट्रास्ट मानक।",
    shortSummary_en: "Digital accessibility standard governing this platform: keyboard navigation, screen readers, and contrast.",
    officialOrg: "World Wide Web Consortium (W3C) / Web Accessibility Initiative (WAI)",
    year: "October 2023",
    officialUrl: "https://www.w3.org/WAI/standards-guidelines/wcag/",
    easyExplanation_hi:
      "WCAG 2.2 दुनिया भर में वेबसाइटों और मोबाइल ऐप्स को सभी के लिए (विशेषकर दृष्टिबाधित, श्रवणबाधित या शारीरिक रूप से अक्षम लोगों के लिए) सुलभ बनाने का अंतरराष्ट्रीय मानक है। सुगम्य शिक्षा बिहार वेबसाइट को इसी मानक के 'स्तर AA' (Level AA) के अनुरूप बनाया गया है।",
    easyExplanation_en:
      "The Web Content Accessibility Guidelines (WCAG) 2.2 Level AA represent the global technical standard ensuring digital applications are Perceivable, Operable, Understandable, and Robust for individuals with disabilities. This platform is engineered to comply with these criteria.",
    mainProvisions_hi: [
      "बिना माउस के केवल कीबोर्ड से पूरी वेबसाइट संचालित की जा सकती है।",
      "स्क्रीन रीडर उपयोगकर्ताओं के लिए स्पष्ट सिमेंटिक HTML और ARIA लेबल्स।",
      "पाठ और पृष्ठभूमि के बीच कम से कम 4.5:1 का रंग कंट्रास्ट (उच्च कंट्रास्ट मोड में 7:1+)।",
      "आकार बढ़ाने (200% ज़ूम) पर सामग्री का बिना कटे सहज दिखना।",
      "छवियों के लिए सार्थक विवरण (Alt Text) और वीडियो के लिए सबटाइटल।"
    ],
    mainProvisions_en: [
      "Complete keyboard operability with clearly visible focus rings and skip-to-content links.",
      "Accurate semantic HTML hierarchy, landmark roles, and ARIA descriptors for screen readers.",
      "Strict color contrast ratio of at least 4.5:1 for normal text (exceeding 7:1 in high-contrast mode).",
      "Responsive text scaling up to 200% without loss of content or function.",
      "Descriptive alternative text for all informative imagery and captions for audio-visual media."
    ],
    relatedSections_hi: [
      "सिद्धांत 1: बोधगम्य (Perceivable) — पाठ विकल्प, कंट्रास्ट",
      "सिद्धांत 2: संचालन योग्य (Operable) — कीबोर्ड सुलभता, समय-सीमा, नेविगेशन",
      "सिद्धांत 3: समझने योग्य (Understandable) — पठनीयता, पूर्वानुमान",
      "सिद्धांत 4: सुदृढ़ (Robust) — विभिन्न सहायक तकनीकों के साथ संगतता"
    ],
    relatedSections_en: [
      "Principle 1: Perceivable — Text alternatives, adaptable layouts, distinct contrast",
      "Principle 2: Operable — Keyboard accessibility, sufficient time, navigable structures",
      "Principle 3: Understandable — Readable Hindi/English prose, predictable behavior",
      "Principle 4: Robust — Interoperable with modern assistive technologies and browsers"
    ],
    checklist_hi: [
      "क्या Tab कुंजी दबाने पर प्रत्येक बटन और लिंक पर स्पष्ट आउटलाइन दिखाई देती है?",
      "क्या उच्च कंट्रास्ट बटन दबाने पर पूरा पृष्ठ ब्लैक & येलो थीम में बदल जाता है?",
      "क्या 'मुख्य सामग्री पर सीधे जाएँ' (Skip link) काम कर रहा है?"
    ],
    checklist_en: [
      "Can every interactive element be reached and triggered using only the Tab and Enter/Space keys?",
      "Does the high contrast toggle transform all views into an ultra-high-contrast palette?",
      "Does the visible skip link allow users to bypass top headers directly to main content?"
    ],
  },
];
