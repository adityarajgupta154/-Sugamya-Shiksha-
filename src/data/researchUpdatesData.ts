export interface ResearchUpdate {
  id: string;
  title_hi: string;
  title_en: string;
  slug: string;
  date: string;
  category: "Field Note" | "Interim Report" | "Working Paper" | "Case Study";
  category_hi: "क्षेत्रीय अध्ययन नोट" | "अंतरिम रिपोर्ट" | "कार्यकारी शोध पत्र" | "केस स्टडी";
  summary_hi: string;
  summary_en: string;
  detailedNotes_hi: string;
  detailedNotes_en: string;
  location: string;
  author_hi: string;
  author_en: string;
  keyFindings_hi: string[];
  keyFindings_en: string[];
  fileUrl?: string;
  fileSize?: string;
  published: boolean;
}

export const INITIAL_RESEARCH_UPDATES: ResearchUpdate[] = [
  {
    id: "update-danapur-pilot-2024",
    slug: "danapur-pilot-audit-summary",
    title_hi: "दानापुर प्रखंड के 5 विद्यालयों का प्रारंभिक सुगम्यता सर्वेक्षण — मुख्य निष्कर्ष",
    title_en: "Initial Accessibility Audit of 5 Danapur Schools — Field Observations",
    date: "2024-03-20",
    category: "Field Note",
    category_hi: "क्षेत्रीय अध्ययन नोट",
    summary_hi:
      "दानापुर क्षेत्र में 3 सरकारी एवं 2 निजी विद्यालयों के भौतिक परीक्षण में रैंप ढलान, CwSN शौचालय की उपलब्धता और प्रवेश द्वारों की चौड़ाई का प्राथमिक अध्ययन।",
    summary_en:
      "Field observations and architectural audit findings from 3 government and 2 private schools in Danapur, analyzing ramp gradients, CwSN toilet provisions, and doorway clearances.",
    detailedNotes_hi:
      "अध्ययन के दौरान पाया गया कि 5 में से 4 विद्यालयों में रैंप का निर्माण तो किया गया था, परंतु 3 विद्यालयों में ढलान 1:12 के वैधानिक मानक से अधिक तीव्र (Steep) थी। इसके अतिरिक्त, सीडब्ल्यूएसएन शौचालयों में ग्रैब बार का अभाव अथवा गलत ऊंचाई पर स्थापना एक सामान्य समस्या पाई गई।",
    detailedNotes_en:
      "Field inspection revealed ramps constructed in 4 of 5 schools; however, 3 featured gradients significantly steeper than the statutory 1:12 threshold. Lack of compliant grab rails and missing outward-opening doors in CwSN toilets were the most prevalent infrastructural deficits.",
    location: "दानापुर प्रखंड, पटना, बिहार (Danapur Block, Patna, Bihar)",
    author_hi: "आदित्य कुमार (एनसीपीईडीपी रिसर्च फेलो)",
    author_en: "Aditya Kumar (NCPEDP Research Fellow)",
    keyFindings_hi: [
      "रैंप की उपस्थिति 80% विद्यालयों में, लेकिन केवल 20% में मानक 1:12 ढलान एवं दोहरी रेलिंग।",
      "CwSN शौचालय 40% स्कूलों में चिन्हित, परंतु व्हीलचेयर रोटेशन (1500mm) केवल 1 विद्यालय में उपलब्ध।",
      "दृष्टिबाधित बच्चों के लिए स्पर्श पथ (Tactile Paving) किसी भी विद्यालय में स्थापित नहीं पाया गया।",
      "पीने के पानी के नल सामान्य ऊंचाई पर, व्हीलचेयर उपयोगकर्ताओं के लिए सुगम नहीं।",
    ],
    keyFindings_en: [
      "Ramps present in 80% of audited schools, but only 20% met statutory 1:12 gradient and dual handrails.",
      "Dedicated CwSN toilets designated in 40% of schools, but 1500mm wheelchair turning radius available in only 1 school.",
      "Tactile surface ground indicators (TGSI) absent in all visited schools.",
      "Drinking water taps mounted at standard heights without wheelchair knee clearance.",
    ],
    fileUrl: "#",
    fileSize: "1.4 MB",
    published: true,
  },
  {
    id: "update-ramp-slope-variance",
    slug: "ramp-slope-variance-bihar-schools",
    title_hi: "विद्यालयों में रैंप निर्माण की व्यावहारिक विसंगतियां एवं समाधान",
    title_en: "Practical Variances in School Ramp Construction & Corrective Remedies",
    date: "2024-04-12",
    category: "Working Paper",
    category_hi: "कार्यकारी शोध पत्र",
    summary_hi:
      "विद्यालय भवनों में 'नाममात्र के रैंप' की समस्या का तकनीकी विश्लेषण — क्यों संवेदक 1:12 के बजाय 1:6 या 1:8 ढाल बना देते हैं और इसे कैसे सुधारा जाए।",
    summary_en:
      "Technical analysis of sub-standard ramps in school infrastructure — examining why 1:6 or 1:8 steep slopes occur and practical low-cost retrofitting solutions.",
    detailedNotes_hi:
      "अनेक मामलों में विद्यालय प्रांगण में स्थान की कमी अथवा निर्माण ठेकेदारों को राष्ट्रीय भवन संहिता और हार्मोनाइज्ड गाइडलाइन्स की सही तकनीकी जानकारी न होना तीव्र ढलान का प्रमुख कारण है। एल-आकार या यू-आकार के स्विचबैक रैंप और इंटरमीडिएट लैंडिंग देकर बिना अतिरिक्त ज़मीन के मानक 1:12 प्राप्त किया जा सकता है।",
    detailedNotes_en:
      "Space constraints and lack of accessibility code awareness among civil contractors frequently lead to hazardous ramp slopes. Switchback ramps (L-shaped or U-shaped) with 1500mm resting landings provide an architectural solution that fits within compact school courtyards.",
    location: "पटना एवं दानापुर (Patna & Danapur)",
    author_hi: "रिसर्च टीम, सुगम्य शिक्षा बिहार",
    author_en: "Research Team, Sugamya Shiksha Bihar",
    keyFindings_hi: [
      "रैंप की ढलान की जांच के लिए डिजिटल इनक्लिनोमीटर या वाटर लेवल स्केल का प्रयोग अनिवार्य किया जाना चाहिए।",
      "760 मिमी की निचली रेलिंग प्राथमिक विद्यालय के छोटे बच्चों के लिए जीवनदायिनी सुरक्षा प्रदान करती है।",
      "रैंप के आरंभ एवं अंत में 300 मिमी का स्पर्श चेतावनी टाइल (Blister warning) लगाना आवश्यक है।",
    ],
    keyFindings_en: [
      "Mandatory slope verification using digital inclinometers before civil completion sign-off.",
      "Lower handrail at 760mm height is essential for primary grade students and dwarf stature individuals.",
      "Tactile blister warning strips (300mm wide) must precede ramp entry and landing points.",
    ],
    fileUrl: "#",
    fileSize: "2.1 MB",
    published: true,
  },
  {
    id: "update-cwsn-toilet-retrofitting",
    slug: "cwsn-toilet-retrofitting-guidance",
    title_hi: "सरकारी विद्यालयों में सुगम शौचालय रेट्रोफिटिंग: कम लागत वाला मॉडल",
    title_en: "Low-Cost CwSN Toilet Retrofitting Model for Public Schools",
    date: "2024-05-08",
    category: "Case Study",
    category_hi: "केस स्टडी",
    summary_hi:
      "मौजूदा विद्यालयी शौचालयों को बिना बड़े ढांचागत बदलाव के दिव्यांग सुलभ बनाने के लिए दानापुर के एक प्राथमिक विद्यालय का पायलट अध्ययन।",
    summary_en:
      "Pilot case study from a Danapur primary school demonstrating low-cost retrofitting of existing lavatories into accessible toilets without structural reconstruction.",
    detailedNotes_hi:
      "अंदर की ओर खुलने वाले भारी लकड़ी के दरवाजों को 900 मिमी चौड़े बाहर खुलने वाले स्लाइडिंग/फ्लश दरवाजों में बदलकर, दीवार पर स्टेनलेस स्टील 304 ग्रेड एल-आकार ग्रैब बार लगाकर और वॉशबेसिन को 750 मिमी पर स्थापित करके न्यूनतम बजट में शौचालय सुगम बनाया जा सकता है।",
    detailedNotes_en:
      "By replacing narrow inward-swinging doors with 900mm clear outward-swinging doors, installing SS 304 grade L-shaped grab rails, and lowering washbasins to 750mm with knee recess, existing toilet cubicles can be retrofitted under modest Samagra Shiksha school grants.",
    location: "दानापुर ग्रामीण संकुल (Danapur Rural Cluster)",
    author_hi: "आदित्य कुमार",
    author_en: "Aditya Kumar",
    keyFindings_hi: [
      "दरवाजे को बाहर की ओर खोलना आपातकालीन स्थिति में अंदर फंसे बच्चे को बचाने के लिए जीवन रक्षक है।",
      "कमोड सीट की ऊंचाई 450-480 मिमी रखने से व्हीलचेयर से स्थानांतरण सहज होता है।",
      "एंटी-स्किड फ्लोरिंग गीले शौचालय में गिरने की 90% दुर्घटनाओं को रोकती है।",
    ],
    keyFindings_en: [
      "Outward door swing is life-critical for emergency extraction of a fallen student.",
      "WC seat height of 450-480mm enables seamless lateral transfer from wheelchairs.",
      "Anti-skid matte ceramic flooring eliminates 90% of slips and fall hazards.",
    ],
    fileUrl: "#",
    fileSize: "1.8 MB",
    published: true,
  },
  {
    id: "update-special-educator-ratio",
    slug: "special-educator-ratio-bihar-schools",
    title_hi: "बिहार के विद्यालयों में विशेष शिक्षकों का अनुपात: सर्वोच्च न्यायालय के निर्देशों का अनुपालन",
    title_en: "Special Educator Pupil Ratio in Bihar Schools: SC Mandate Compliance",
    date: "2024-06-18",
    category: "Interim Report",
    category_hi: "अंतरिम रिपोर्ट",
    summary_hi:
      "रजनीश कुमार पांडे बनाम भारत संघ (2021) के ऐतिहासिक फैसले के आलोक में प्राथमिक (1:10) और उच्च प्राथमिक (1:15) स्तर पर विशेष शिक्षकों की तैनाती की वर्तमान स्थिति।",
    summary_en:
      "Interim analysis tracking compliance with the Supreme Court's 2021 judgment prescribing special educator ratios (1:10 primary, 1:15 upper primary) across Bihar schools.",
    detailedNotes_hi:
      "सर्वोच्च न्यायालय के 28 अक्टूबर 2021 के आदेश के अनुसार प्रत्येक विद्यालय में दिव्यांग बच्चों की संख्या के अनुपात में स्थाई विशेष शिक्षकों की भर्ती अनिवार्य है। बिहार में भ्रमणशील शिक्षकों (Itinerant Teachers) की वर्तमान व्यवस्था विद्यार्थियों को सतत व्यक्तिगत सहयोग देने में अपर्याप्त सिद्ध हो रही है।",
    detailedNotes_en:
      "Supreme Court judgment in Rajneesh Kumar Pandey vs Union of India mandated permanent regular cadre special teachers. The existing cluster itinerant model provides only sporadic bi-weekly visits, underscoring the urgent need for dedicated on-site resource educators.",
    location: "पटना जिला (Patna District)",
    author_hi: "सुगम्य शिक्षा बिहार शोध दल",
    author_en: "Sugamya Shiksha Bihar Research Team",
    keyFindings_hi: [
      "भ्रमणशील शिक्षक मॉडल के कारण बच्चों को सप्ताह में मात्र 1-2 घंटे का सहयोग मिल पाता है।",
      "कक्षा अध्यापकों को सुगम शिक्षण सामग्री (Accessible Teaching Learning Materials) के उपयोग का विशेष प्रशिक्षण जरूरी।",
      "प्रत्येक संकुल संसाधन केंद्र (BRC/CRC) पर संदर्भ सामग्री एवं सहायक उपकरण बैंक स्थापित होना चाहिए।",
    ],
    keyFindings_en: [
      "Itinerant teacher visits average only 1-2 hours per child per week under current deployment.",
      "General classroom teachers require structured training on adapting TLM and assistive technologies.",
      "Block Resource Centres (BRCs) need dedicated assistive device repositories and repair support.",
    ],
    fileUrl: "#",
    fileSize: "2.6 MB",
    published: true,
  },
];
