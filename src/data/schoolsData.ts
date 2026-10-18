export interface SchoolItem {
  id: string;
  name_hi: string;
  name_en: string;
  type: "government" | "private";
  address_hi: string;
  address_en: string;
  block: string;
  geo: {
    lat: number;
    lng: number;
  };
  udiseCode?: string;
  auditStatus: "audited" | "pending" | "follow_up_required";
  score: number;
  scoreBreakdown?: {
    entrance: number;
    toilets: number;
    classrooms: number;
    safety: number;
  };
  facilities: {
    ramp: boolean;
    toilet: boolean;
    drinkingWater: boolean;
    wideDoors: boolean;
    tactilePath: boolean;
    emergencyExit: boolean;
  };
  lastAuditDate?: string;
  published: boolean;
  isDemo: boolean;
  findings_hi?: string[];
  findings_en?: string[];
}

export const DEMO_SCHOOLS: SchoolItem[] = [
  {
    id: "govt-model-danapur-cantt",
    name_hi: "राजकीय मॉडल उच्च माध्यमिक विद्यालय, दानापुर छावनी",
    name_en: "Government Model Senior Secondary School, Danapur Cantt",
    type: "government",
    address_hi: "दानापुर छावनी, दानापुर, पटना, बिहार - 801503",
    address_en: "Danapur Cantonment, Danapur, Patna, Bihar - 801503",
    block: "Danapur",
    geo: { lat: 25.6324, lng: 85.0441 },
    udiseCode: "10280100102",
    auditStatus: "audited",
    score: 68,
    scoreBreakdown: {
      entrance: 20,
      toilets: 15,
      classrooms: 18,
      safety: 15,
    },
    facilities: {
      ramp: true,
      toilet: true,
      drinkingWater: true,
      wideDoors: true,
      tactilePath: false,
      emergencyExit: true,
    },
    lastAuditDate: "2026-10-10",
    published: true,
    isDemo: true,
    findings_hi: [
      "मुख्य प्रशासनिक भवन के प्रवेश द्वार पर 1:12 अनुपात का ढालू रैंप और डबल हैंडरेल उपलब्ध है।",
      "भूतल पर एक क्रियाशील सुलभ शौचालय मौजूद है जिसमें ग्रैब बार लगे हैं।",
      "प्रथम तल की विज्ञान प्रयोगशालाओं तक केवल सीढ़ियों से पहुँचा जा सकता है; कोई रैंप या लिफ्ट उपलब्ध नहीं है।",
      "दृष्टिबाधित विद्यार्थियों हेतु परिसर में स्पर्शनीय (टैक्टाइल) पाथवे अनुपस्थित है।"
    ],
    findings_en: [
      "Continuous gentle 1:12 ramp with continuous double handrails installed at main administrative entrance.",
      "Ground floor unisex accessible toilet is operational with sturdy grab rails and outward-opening door.",
      "First-floor laboratory zones remain accessible only via stairs; vertical circulation assistance needed.",
      "Tactile surface guiding indicators (TGSI) currently absent across courtyard and entrance routes."
    ],
  },
  {
    id: "danapur-girls-khagaul",
    name_hi: "राजकीय कन्या उच्च विद्यालय, खगौल रोड, दानापुर",
    name_en: "Government Girls High School, Khagaul Road, Danapur",
    type: "government",
    address_hi: "निकट रेलवे क्रॉसिंग, खगौल रोड, दानापुर, पटना - 801105",
    address_en: "Near Railway Crossing, Khagaul Road, Danapur, Patna - 801105",
    block: "Danapur",
    geo: { lat: 25.6158, lng: 85.0492 },
    udiseCode: "10280100415",
    auditStatus: "follow_up_required",
    score: 42,
    scoreBreakdown: {
      entrance: 12,
      toilets: 8,
      classrooms: 14,
      safety: 8,
    },
    facilities: {
      ramp: true,
      toilet: false,
      drinkingWater: true,
      wideDoors: false,
      tactilePath: false,
      emergencyExit: false,
    },
    lastAuditDate: "2026-09-28",
    published: true,
    isDemo: true,
    findings_hi: [
      "प्रवेश द्वार पर बना रैंप अत्यधिक तीव्र ढलान (लगभग 1:6) पर है, जिससे व्हीलचेयर उपयोगकर्ता के गिरने का जोखिम है।",
      "शौचालयों में कोई ग्रैब बार या व्हीलचेयर टर्निंग स्पेस नहीं है; तत्काल संशोधन आवश्यक है।",
      "पेयजल स्टैंड की ऊंचाई प्राथमिक बालिकाओं के लिए अनुकूल है किंतु व्हीलचेयर उपयोगकर्ता हेतु पहुंच योग्य नहीं है।",
      "पुनः निरीक्षण एवं रैंप सुधार हेतु स्कूल प्रबंधन को तकनीकी सुझाव पत्र भेजा गया है।"
    ],
    findings_en: [
      "Existing entrance ramp is dangerously steep (~1:6 gradient) without intermediate landings or safety curbs.",
      "Toilet cubicles lack wheelchair turning clearance and horizontal grab rails; immediate retrofitting required.",
      "Drinking water platform requires lowered spigot access for seated mobility device users.",
      "Technical advisory sent to school administration; follow-up verification visit scheduled."
    ],
  },
  {
    id: "st-josephs-danapur",
    name_hi: "सेंट जोसेफ्स कॉन्वेंट हाई स्कूल, दानापुर",
    name_en: "St. Joseph's Convent High School, Danapur",
    type: "private",
    address_hi: "दानापुर मेन रोड, पटना, बिहार - 801503",
    address_en: "Danapur Main Road, Patna, Bihar - 801503",
    block: "Danapur",
    geo: { lat: 25.6382, lng: 85.0515 },
    udiseCode: "10280100820",
    auditStatus: "audited",
    score: 78,
    scoreBreakdown: {
      entrance: 24,
      toilets: 22,
      classrooms: 20,
      safety: 12,
    },
    facilities: {
      ramp: true,
      toilet: true,
      drinkingWater: true,
      wideDoors: true,
      tactilePath: true,
      emergencyExit: true,
    },
    lastAuditDate: "2026-10-04",
    published: true,
    isDemo: true,
    findings_hi: [
      "परिसर में भूतल पर सभी कक्षाओं के दरवाजों की चौड़ाई 920 मिमी से अधिक है।",
      "प्रवेश द्वार और मुख्य गलियारे में स्पर्शनीय चेतावनी टाइलें (Tactile Tiles) स्थापित हैं।",
      "सुलभ शौचालय में आपातकालीन अलार्म कॉर्ड और गैर-फिसलन फर्श मौजूद है।",
      "खेल परिसर और असेंबली ग्राउंड में व्हीलचेयर हेतु समतल कनेक्टिंग पाथवे सुव्यवस्थित है।"
    ],
    findings_en: [
      "All ground-level classroom doorways provide generous clear opening widths exceeding 920mm.",
      "Tactile paving strips installed along main lobby corridor and library approach.",
      "Unisex accessible sanitary cubicle equipped with emergency pull cord and slip-resistant floor.",
      "Level asphalt pathway connects main academic block to playground and assembly courtyard."
    ],
  },
  {
    id: "bright-horizons-saguna",
    name_hi: "ब्राइट होराइजन्स पब्लिक स्कूल, सगुना मोड़, दानापुर",
    name_en: "Bright Horizons Public School, Saguna More, Danapur",
    type: "private",
    address_hi: "सगुना मोड़, बेली रोड एक्सटेंशन, दानापुर, पटना - 801503",
    address_en: "Saguna More, Bailey Road Extension, Danapur, Patna - 801503",
    block: "Danapur",
    geo: { lat: 25.6190, lng: 85.0298 },
    udiseCode: "10280101140",
    auditStatus: "pending",
    score: 0,
    facilities: {
      ramp: false,
      toilet: false,
      drinkingWater: true,
      wideDoors: false,
      tactilePath: false,
      emergencyExit: false,
    },
    lastAuditDate: undefined,
    published: true,
    isDemo: true,
    findings_hi: [
      "विद्यालय का प्रारंभिक पंजीकरण पूर्ण हो चुका है। भौतिक ऑन-साइट ऑडिट वर्तमान में प्रक्रियाधीन है।",
      "स्कूल प्रबंधन ने स्व-समीक्षा फॉर्म जमा किया है; शोध दल द्वारा सत्यापन प्रतीक्षित है।"
    ],
    findings_en: [
      "Initial registration recorded. Comprehensive on-site physical measurement audit pending field team visit.",
      "Self-assessment checklist submitted by administration; in-person verification pending."
    ],
  },
  {
    id: "primary-vidyalaya-usri",
    name_hi: "प्राथमिक विद्यालय, उसरी, दानापुर",
    name_en: "Primary Vidyalaya, Usri, Danapur",
    type: "government",
    address_hi: "उसरी टोला, दानापुर प्रखंड, पटना - 801503",
    address_en: "Usri Tola, Danapur Block, Patna - 801503",
    block: "Danapur",
    geo: { lat: 25.6025, lng: 85.0612 },
    udiseCode: "10280100088",
    auditStatus: "pending",
    score: 0,
    facilities: {
      ramp: false,
      toilet: false,
      drinkingWater: true,
      wideDoors: false,
      tactilePath: false,
      emergencyExit: false,
    },
    published: false, // Unpublished: strictly hidden from public directory per PRD 11.3 & ADR 0005
    isDemo: true,
    findings_hi: [
      "अप्रकाशित ड्राफ्ट रिकॉर्ड: ऑडिट शेड्यूलिंग प्रक्रिया में।"
    ],
    findings_en: [
      "Unpublished draft record: Audit scheduling in progress."
    ],
  },
];
