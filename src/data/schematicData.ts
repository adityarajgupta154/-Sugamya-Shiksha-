export interface SchematicPrinciple {
  number: number;
  icon: "slope" | "handrail" | "landing" | "turning" | "grabbar" | "fixtures" | "tactile-guide" | "contrast" | "route" | "aisle" | "desk" | "board";
  title_en: string;
  title_hi: string;
  desc_en: string;
  desc_hi: string;
}

export interface SchematicKeyTip {
  highlight_en: string;
  highlight_hi: string;
  value_en: string;
  value_hi: string;
  subTip_en: string;
  subTip_hi: string;
}

export interface SchematicCallout {
  id: string;
  num: number;
  label_en: string;
  label_hi: string;
  value: string;
  sub_en?: string;
  sub_hi?: string;
  studentFriendly_en?: string;
  studentFriendly_hi?: string;
}

export interface SchematicModuleData {
  id: "ramp" | "toilet" | "tactile" | "classroom";
  title_en: string;
  title_hi: string;
  subtitle_en: string;
  subtitle_hi: string;
  officialStandard: string;
  officialClause: string;
  keyTip: SchematicKeyTip;
  callouts: SchematicCallout[];
  principles: [SchematicPrinciple, SchematicPrinciple, SchematicPrinciple];
  srOnlyDescription_en: string;
  srOnlyDescription_hi: string;
}

export const SCHEMATIC_MODULES_DATA: Record<"ramp" | "toilet" | "tactile" | "classroom", SchematicModuleData> = {
  ramp: {
    id: "ramp",
    title_en: "Accessible School Ramp & Handrails",
    title_hi: "सुलभ विद्यालय रैंप एवं रेलिंग",
    subtitle_en: "A ramp should be gentle, wide, and safe",
    subtitle_hi: "रैंप ढलानदार, चौड़ा और सुरक्षित होना चाहिए",
    officialStandard: "Accessibility Code for Educational Institutions, 2024",
    officialClause: "Section 3.2 & Harmonised Guidelines 2021 Cl. 4.5",
    keyTip: {
      highlight_en: "Ramp Slope",
      highlight_hi: "ढाल",
      value_en: "1:12 maximum",
      value_hi: "1:12 अधिकतम",
      subTip_en: "Gentler slope: 1:15 – 1:20 recommended for long ramps",
      subTip_hi: "आसान ढाल: 1:15 – 1:20 लंबे रैंप के लिए अनुशंसित",
    },
    callouts: [
      {
        id: "slope-ratio",
        num: 1,
        label_en: "Ramp slope",
        label_hi: "रैंप ढाल",
        value: "1:12 maximum (8.33%)",
        sub_en: "1:15 – 1:20 for long spans",
        sub_hi: "लंबे रैंप हेतु 1:15 – 1:20",
        studentFriendly_en: "A gentle slope ensures students in wheelchairs can climb easily without tiring or tipping backward.",
        studentFriendly_hi: "आसान ढलान से व्हीलचेयर सवार विद्यार्थी बिना थके और बिना पलटे आसानी से सुरक्षित चढ़ सकते हैं।",
      },
      {
        id: "clear-width",
        num: 2,
        label_en: "Clear width",
        label_hi: "साफ़ चौड़ाई",
        value: "1200 mm minimum",
        sub_en: "Between inner handrails",
        sub_hi: "दोनों रेलिंग के बीच",
        studentFriendly_en: "1200 mm gives plenty of clear space for a wheelchair, walker, or companion student walking alongside.",
        studentFriendly_hi: "1.2 मीटर खुली जगह ताकि व्हीलचेयर, बैसाखी या सहायक विद्यार्थी आसानी से साथ-साथ चल सकें।",
      },
      {
        id: "lower-rail",
        num: 3,
        label_en: "Lower handrail",
        label_hi: "निचली रेलिंग",
        value: "760 mm",
        sub_en: "(children / primary CwSN)",
        sub_hi: "(बच्चों के लिए)",
        studentFriendly_en: "Placed at 760 mm height so primary school children and seated wheelchair users can grip comfortably.",
        studentFriendly_hi: "प्राथमिक कक्षा के छोटे बच्चों और व्हीलचेयर सवारों के हाथ की सहज पहुंच के लिए 760 मिमी ऊंचाई।",
      },
      {
        id: "upper-rail",
        num: 4,
        label_en: "Upper handrail",
        label_hi: "ऊपरी रेलिंग",
        value: "900 mm",
        sub_en: "(adults / older students)",
        sub_hi: "(वयस्कों के लिए)",
        studentFriendly_en: "Placed at 900 mm height for older students, teachers, and adults with walking difficulties.",
        studentFriendly_hi: "बड़े विद्यार्थियों, शिक्षकों और वयस्कों के मजबूत सहारे के लिए 900 मिमी पर ऊपरी रेलिंग।",
      },
      {
        id: "handrail-ext",
        num: 5,
        label_en: "Handrail extension",
        label_hi: "रेलिंग का बढ़ा हिस्सा",
        value: "300 mm minimum",
        sub_en: "Past start and end",
        sub_hi: "शुरुआत व अंत से आगे",
        studentFriendly_en: "Extends 300 mm past the ramp so students can safely balance before starting to climb or step off.",
        studentFriendly_hi: "रैंप शुरू होने से पहले और खत्म होने के बाद 300 मिमी समतल रेलिंग ताकि चढ़ने-उतरने से पहले संतुलन बन सके।",
      },
      {
        id: "edge-curb",
        num: 6,
        label_en: "Edge curb",
        label_hi: "किनारे की उठी पट्टी",
        value: "100 mm",
        sub_en: "Wheel run-off prevention",
        sub_hi: "पहिया फिसलने से बचाव",
        studentFriendly_en: "A 100 mm raised edge stops wheelchair wheels, crutch tips, and white canes from slipping off the side.",
        studentFriendly_hi: "किनारे पर 100 मिमी ऊंची पट्टी ताकि व्हीलचेयर का पहिया या बैसाखी फिसलकर नीचे न गिरे।",
      },
      {
        id: "landing-size",
        num: 7,
        label_en: "Landing",
        label_hi: "समतल प्लेटफॉर्म",
        value: "1500 × 1500 mm minimum",
        sub_en: "At top and bottom",
        sub_hi: "ऊपर और नीचे",
        studentFriendly_en: "A level 1500 × 1500 mm square area allowing a wheelchair user to turn 360°, rest, and open the classroom door.",
        studentFriendly_hi: "1.5 × 1.5 मीटर का समतल चबूतरा ताकि व्हीलचेयर आसानी से 360° घूम सके और दरवाजा खोला जा सके।",
      },
      {
        id: "landing-interval",
        num: 8,
        label_en: "Intermediate landing",
        label_hi: "विश्राम प्लेटफॉर्म",
        value: "Every 9 m or at a change of direction",
        sub_en: "Every 9 m of ramp run",
        sub_hi: "हर 9 मीटर या दिशा बदलने पर",
        studentFriendly_en: "Long ramps must have a level landing every 9 meters or at every turn so students can rest safely.",
        studentFriendly_hi: "लंबे रैंप में हर 9 मीटर या मोड़ पर समतल विश्राम स्थल होना आवश्यक है ताकि विद्यार्थी थके नहीं।",
      },
    ],
    principles: [
      {
        number: 1,
        icon: "slope",
        title_en: "1. Gentle slope",
        title_hi: "1. ढलानदार रैंप",
        desc_en: "Use 1:12 maximum slope. For long ramps, 1:15 – 1:20 is better.",
        desc_hi: "अधिकतम 1:12 ढाल रखें। लंबे रैंप के लिए 1:15 – 1:20 बेहतर है।",
      },
      {
        number: 2,
        icon: "handrail",
        title_en: "2. Two handrails",
        title_hi: "2. दो रेलिंग",
        desc_en: "Lower rail at 760 mm (children) and upper rail at 900 mm (adults).",
        desc_hi: "निचली रेलिंग 760 mm (बच्चों के लिए) और ऊपरी रेलिंग 900 mm (वयस्कों के लिए)।",
      },
      {
        number: 3,
        icon: "landing",
        title_en: "3. Level resting platforms",
        title_hi: "3. समतल प्लेटफॉर्म",
        desc_en: "Provide 1500 × 1500 mm landing at top and bottom and every 9 m or at a change of direction.",
        desc_hi: "ऊपर, नीचे और हर 9 मीटर या दिशा बदलने पर 1500 × 1500 mm का समतल प्लेटफॉर्म दें।",
      },
    ],
    srOnlyDescription_en:
      "Architectural elevation schematic of an accessible school ramp. Shows maximum 1:12 slope gradient, 1200 mm minimum clear width between continuous bilateral handrails, dual handrails at 760 mm height for children and 900 mm height for adults with 300 mm horizontal extensions at both ends, 100 mm raised edge curb along open sides, and 1500 mm by 1500 mm level resting landings at the top, bottom, and every 9 meters of linear run.",
    srOnlyDescription_hi:
      "सुलभ विद्यालय रैंप का स्थापत्य रेखाचित्र। इसमें अधिकतम 1:12 का सुरक्षित ढलान, दोनों तरफ की रेलिंग के बीच 1200 मिमी की न्यूनतम साफ चौड़ाई, बच्चों हेतु 760 मिमी एवं वयस्कों हेतु 900 मिमी की दोहरी रेलिंग जिसमें दोनों सिरों पर 300 मिमी का समतल विस्तार है, किनारे पर 100 मिमी की सुरक्षा पट्टी और ऊपर, नीचे तथा प्रत्येक 9 मीटर पर 1500x1500 मिमी का समतल विश्राम चबूतरा दर्शाया गया है।",
  },

  toilet: {
    id: "toilet",
    title_en: "Accessible CwSN School Toilet",
    title_hi: "सुलभ दिव्यांग विद्यालय शौचालय",
    subtitle_en: "Spacious turning, dual grab bars, and safe transfers",
    subtitle_hi: "पर्याप्त घुमाव क्षेत्र, दोहरी ग्रैब रेलिंग और सुरक्षित स्थानांतरण",
    officialStandard: "Accessibility Code for Educational Institutions, 2024",
    officialClause: "Section 5.1 & Harmonised Guidelines 2021 Cl. 5.3",
    keyTip: {
      highlight_en: "Clear Turning Space",
      highlight_hi: "घुमाव क्षेत्र",
      value_en: "Ø 1500 mm minimum",
      value_hi: "Ø 1500 मिमी न्यूनतम",
      subTip_en: "Clear door: 900 mm outward-opening with D-handle at 800 mm",
      subTip_hi: "सुलभ द्वार: 900 मिमी बाहर खुलने वाला, 800 मिमी पर डी-हैंडल",
    },
    callouts: [
      {
        id: "room-width",
        num: 1,
        label_en: "Room width",
        label_hi: "कक्ष की चौड़ाई",
        value: "2000 mm",
        sub_en: "Unobstructed wall-to-wall width",
        sub_hi: "दीवार से दीवार तक की खुली चौड़ाई",
        studentFriendly_en: "A spacious 2000 mm room width provides comfortable space for wheelchair maneuvering and transfer beside fixtures.",
        studentFriendly_hi: "2000 मिमी की खुली चौड़ाई व्हीलचेयर सवार को शौचालय व बेसिन के पास सहज आवागमन और मुड़ने की जगह देती है।",
      },
      {
        id: "room-depth",
        num: 2,
        label_en: "Room depth",
        label_hi: "कक्ष की गहराई",
        value: "2200 mm",
        sub_en: "Depth allowing 360° turn & outward door",
        sub_hi: "360° घुमाव व बाहर खुलने वाले द्वार हेतु गहराई",
        studentFriendly_en: "2200 mm depth ensures complete 360° turning without wheelchair footrests hitting the door or walls.",
        studentFriendly_hi: "2200 मिमी की आंतरिक गहराई सुनिश्चित करती है कि व्हीलचेयर के फुटरेस्ट दरवाजे या दीवार से टकराए बिना घूम सकें।",
      },
      {
        id: "turning-circle",
        num: 3,
        label_en: "Clear turning circle",
        label_hi: "व्हीलचेयर घुमाव दायरा",
        value: "Ø 1500 mm",
        sub_en: "Central unobstructed floor area",
        sub_hi: "केंद्रीय बाधारहित फर्श क्षेत्र",
        studentFriendly_en: "A clear Ø 1500 mm diameter circle in the middle allows standard manual and powered wheelchairs to execute a full 360° rotation.",
        studentFriendly_hi: "मध्य में 1500 मिमी (1.5 मीटर) व्यास का बाधा-रहित वृत्ताकार क्षेत्र, जिससे व्हीलचेयर बिना अटके 360° घूम सके।",
      },
      {
        id: "washbasin",
        num: 4,
        label_en: "Wash basin height",
        label_hi: "वॉश बेसिन ऊंचाई",
        value: "750 mm",
        sub_en: "Top rim height with 650 mm knee clearance",
        sub_hi: "ऊपरी किनारा 750 मिमी, 650 मिमी नी-क्लीयरेंस",
        studentFriendly_en: "Mounted at 750 mm rim height with a minimum 650 mm knee clearance underneath and lever tap for seated students.",
        studentFriendly_hi: "फर्श से 750 मिमी की ऊंचाई पर वॉश बेसिन तथा नीचे 650 मिमी की खुली जगह, ताकि व्हीलचेयर सवार आसानी से हाथ धो सकें।",
      },
      {
        id: "wc-seat",
        num: 5,
        label_en: "WC seat height",
        label_hi: "कमोड सीट ऊंचाई",
        value: "450–480 mm",
        sub_en: "Matches wheelchair seat level",
        sub_hi: "व्हीलचेयर सीट के समान स्तर",
        studentFriendly_en: "Set at 450–480 mm height to align with standard wheelchair seats, enabling safe lateral transfer without lifting strain.",
        studentFriendly_hi: "450–480 मिमी ऊंचाई व्हीलचेयर सीट के बराबर होती है, जिससे विद्यार्थी बिना गिरे आसानी से कमोड पर आ-जा सकें।",
      },
      {
        id: "l-grabbar",
        num: 6,
        label_en: "L-shaped grab bar",
        label_hi: "L-आकार ग्रैब बार",
        value: "700 × 600 mm",
        sub_en: "Fixed securely on adjacent wall",
        sub_hi: "निकटवर्ती दीवार पर स्थिर मजबूत सहारा",
        studentFriendly_en: "Heavy-duty 700 × 600 mm stainless steel bar securely anchored on the adjacent wall to provide both vertical pull and horizontal rest support.",
        studentFriendly_hi: "दीवार पर मजबूती से लगी 700 × 600 मिमी L-आकार रेलिंग, जो उठते और बैठते समय सुरक्षित सहारा प्रदान करती है।",
      },
      {
        id: "foldup-grabbar",
        num: 7,
        label_en: "Fold-up grab bar",
        label_hi: "फोल्ड-अप ग्रैब बार",
        value: "800 mm",
        sub_en: "Hinged on open transfer side",
        sub_hi: "खुली ट्रांसफर दिशा में फोल्डेबल",
        studentFriendly_en: "An 800 mm cantilevered grab bar that folds down for two-handed stability and folds upright against the wall for lateral transfers.",
        studentFriendly_hi: "ट्रांसफर साइड पर 800 मिमी की फोल्डेबल रेलिंग; उपयोग के समय नीचे और व्हीलचेयर से आते-जाते समय ऊपर मुड़ जाती है।",
      },
      {
        id: "clear-door",
        num: 8,
        label_en: "Clear door opening",
        label_hi: "साफ़ द्वार निकासी",
        value: "900 mm",
        sub_en: "Outward opening with horizontal D-handle",
        sub_hi: "बाहर की ओर खुलने वाला, 800 मिमी पर डी-हैंडल",
        studentFriendly_en: "A clear 900 mm opening swinging outwards prevents a student from being trapped inside if an assistance emergency occurs.",
        studentFriendly_hi: "कम से कम 900 मिमी चौड़ा बाहर खुलने वाला दरवाजा, ताकि आपात स्थिति में दरवाजा आसानी से खोला जा सके।",
      },
      {
        id: "emergency-cord",
        num: 9,
        label_en: "Emergency alarm",
        label_hi: "आपातकालीन अलार्म",
        value: "100 mm & 900 mm heights",
        sub_en: "Floor pull reach & seated pull reach",
        sub_hi: "फर्श पर व बैठकर दोनों स्तरों पर सुलभ",
        studentFriendly_en: "Dual reach points at 900 mm (seated reach) and 100 mm from the floor (if a student slips or falls) to alert school staff instantly.",
        studentFriendly_hi: "दोहरी ऊंचाई पर लाल अलार्म कॉर्ड: 900 मिमी (बैठकर) और 100 मिमी (फर्श पर गिरने पर) ताकि तुरंत मदद बुलाई जा सके।",
      },
    ],
    principles: [
      {
        number: 1,
        icon: "turning",
        title_en: "1. Spacious turning & door",
        title_hi: "1. पर्याप्त घुमाव व चौड़ा द्वार",
        desc_en: "Minimum 2000 × 2200 mm room with 1500 mm turning circle. Door must be 900 mm clear opening outward.",
        desc_hi: "न्यूनतम 2000 × 2200 mm कक्ष व 1500 mm घुमाव दायरा। 900 mm चौड़ा बाहर की ओर खुलने वाला दरवाजा दें।",
      },
      {
        number: 2,
        icon: "grabbar",
        title_en: "2. Dual support grab rails",
        title_hi: "2. दोहरी सहायक ग्रैब रेलिंग",
        desc_en: "L-shaped 700 × 600 mm bar on wall plus 800 mm fold-up bar on open transfer side.",
        desc_hi: "दीवार पर L-आकार की 700 × 600 mm रेलिंग व खुली तरफ 800 mm की फोल्ड-अप ग्रैब बार लगाएं।",
      },
      {
        number: 3,
        icon: "fixtures",
        title_en: "3. Reachable fixtures & alarm",
        title_hi: "3. सुगम उपकरण व आपात अलार्म",
        desc_en: "WC seat at 450–480 mm, basin with 650 mm knee space, emergency cord at 100 mm and 900 mm.",
        desc_hi: "450–480 mm पर कमोड, 650 mm नी-स्पेस वाला बेसिन और 100 mm व 900 mm पर अलार्म कॉर्ड दें।",
      },
    ],
    srOnlyDescription_en:
      "Architectural top-down plan view of an accessible CwSN school toilet. Shows internal room dimensions of 2000 mm width by 2200 mm depth, 900 mm clear outward-opening door with horizontal D-handle at 800 mm, a central 1500 mm diameter clear turning circle for wheelchairs, European WC pan positioned 450-500 mm from side wall with 450-480 mm seat height, an L-shaped grab bar 700 mm by 600 mm on the wall, an 800 mm hinged fold-up grab bar on the lateral transfer side, accessible wash basin at 750 mm height with 650 mm knee recess and lever tap, and an emergency pull cord with dual reach points at 100 mm and 900 mm from the floor.",
    srOnlyDescription_hi:
      "सुलभ दिव्यांग शौचालय का टॉप-डाउन प्लान रेखाचित्र। इसमें 2000 मिमी चौड़ाई व 2200 मिमी गहराई का आंतरिक कक्ष, 900 मिमी का बाहर खुलने वाला दरवाजा (800 मिमी पर डी-हैंडल सहित), बीच में 1500 मिमी व्यास का व्हीलचेयर 360° घुमाव क्षेत्र, 450-480 मिमी ऊंचाई वाला कमोड, दीवार पर 700x600 मिमी L-ग्रैब बार, ट्रांसफर साइड पर 800 मिमी फोल्ड-अप बार, 750 मिमी ऊंचा वॉश बेसिन (650 मिमी नी-क्लीयरेंस) और 100 मिमी व 900 मिमी पर आपातकालीन अलार्म कॉर्ड दर्शाया गया है।",
  },

  tactile: {
    id: "tactile",
    title_en: "Tactile Paving & Guiding Pathways",
    title_hi: "स्पर्शनीय पेविंग एवं मार्गदर्शन मार्ग",
    subtitle_en: "Tactile Ground Surface Indicators for blind and low-vision students",
    subtitle_hi: "दृष्टिबाधित विद्यार्थियों हेतु स्पर्शनीय पथ संकेतक",
    officialStandard: "Harmonised Guidelines and Standards for Universal Accessibility, 2021",
    officialClause: "Clauses 4.3 & 4.4 and Accessibility Code 2024 Cl. 2.4",
    keyTip: {
      highlight_en: "Visual Contrast",
      highlight_hi: "दृश्य विषमता",
      value_en: "≥ 30% luminance contrast",
      value_hi: "≥ 30% न्यूनतम कंट्रास्ट",
      subTip_en: "Hazard warning: 300 mm blister strip before any drop or obstacle",
      subTip_hi: "खतरे की चेतावनी: सीढ़ी या ढलान से 300 मिमी पूर्व ब्लिस्टर पट्टी",
    },
    callouts: [
      {
        id: "guiding-pattern",
        num: 1,
        label_en: "Directional guiding tile",
        label_hi: "दिशा सूचक टाइल (लकीरदार)",
        value: "300 × 300 mm",
        sub_en: "Raised parallel directional bars",
        sub_hi: "उभरी समानांतर दिशा पट्टियां (5 मिमी)",
        studentFriendly_en: "Standard 300 × 300 mm paver tiles with 4 raised flat-topped parallel bars indicate clear, straight walking direction for students using a white cane or feeling underfoot.",
        studentFriendly_hi: "मानक 300 × 300 मिमी टाइल्स जिन पर 4 उभरी समानांतर पट्टियां होती हैं, जो दृष्टिबाधित विद्यार्थियों को सफेद छड़ी या पैरों के स्पर्श से सीधा सुरक्षित रास्ता बताती हैं।",
      },
      {
        id: "warning-pattern",
        num: 2,
        label_en: "Warning tactile tile",
        label_hi: "चेतावनी टाइल (उभरे गोल दाने)",
        value: "300 × 300 mm",
        sub_en: "Raised truncated dome pattern",
        sub_hi: "उभरे गोल ब्लिस्टर दाने (4×4 ग्रिड)",
        studentFriendly_en: "Standard 300 × 300 mm paver tiles with a 4×4 grid of raised truncated circular dome studs warn students to stop, be alert, or prepare for steps and direction changes.",
        studentFriendly_hi: "300 × 300 मिमी टाइल्स जिन पर उभरे गोल दाने (ब्लिस्टर) होते हैं; यह दृष्टिबाधित छात्रों को रुकने, सावधान होने या दिशा बदलने की स्पष्ट चेतावनी देते हैं।",
      },
      {
        id: "path-width",
        num: 3,
        label_en: "Continuous tactile pathway",
        label_hi: "मार्ग की निरंतर चौड़ाई",
        value: "300–600 mm",
        sub_en: "Unobstructed pathway width",
        sub_hi: "बाधारहित सुरक्षित चलने की चौड़ाई",
        studentFriendly_en: "A continuous 300–600 mm wide tactile track ensures cane tips stay easily within the guiding groove without straying off into obstacles.",
        studentFriendly_hi: "300 से 600 मिमी चौड़ा निरंतर स्पर्शनीय मार्ग यह सुनिश्चित करता है कि सफेद छड़ी की नोक आसानी से मार्ग में रहे और विद्यार्थी किसी बाधा से न टकराएं।",
      },
      {
        id: "hazard-distance",
        num: 4,
        label_en: "Hazard warning setback",
        label_hi: "खतरे से पूर्व चेतावनी दूरी",
        value: "300 mm before stairs / hazards",
        sub_en: "Setback prior to steps or sudden level drop",
        sub_hi: "सीढ़ियों या ढलान से 300 मिमी पहले",
        studentFriendly_en: "Warning tactile paving must be installed exactly 300 mm before the first step of a staircase or level change so students have sufficient reaction distance to stop safely.",
        studentFriendly_hi: "सीढ़ियों के पहले पायदान या ढलान से ठीक 300 मिमी पहले चेतावनी टाइल लगाई जाती है, ताकि बच्चे को कदम रोकने का सुरक्षित समय मिल सके।",
      },
      {
        id: "luminance-contrast",
        num: 5,
        label_en: "Luminance visual contrast",
        label_hi: "दृश्य कंट्रास्ट अनुपात",
        value: "≥ 30% against floor",
        sub_en: "Yellow pavers against dark grey stone",
        sub_hi: "गहरे भूरे पत्थर पर चमकीली पीली टाइल्स",
        studentFriendly_en: "At least 30% visual luminance contrast (bright yellow pavers against dark grey stone flooring) enables low-vision students to navigate visually.",
        studentFriendly_hi: "गहरे भूरे पत्थर के फर्श पर चमकीली पीली टाइल्स कम से कम 30% कंट्रास्ट देती हैं, जिससे कम रोशनी या कमजोर नजर वाले बच्चे देखकर भी चल सकें।",
      },
      {
        id: "network-link",
        num: 6,
        label_en: "Connected campus route",
        label_hi: "जुड़ा हुआ परिसर मार्ग",
        value: "Gate → Classes → Toilet",
        sub_en: "Seamless accessible connection",
        sub_hi: "मुख्य द्वार, कक्षा व शौचालय का जुड़ाव",
        studentFriendly_en: "Tactile paving must form an unbroken continuous network connecting the school entrance gate directly to academic classrooms, accessible toilets, and the library.",
        studentFriendly_hi: "यह मार्ग विद्यालय के मुख्य गेट से लेकर कक्षाओं, सुलभ शौचालय और खेल के मैदान तक बिना टूटे एक निरंतर नेटवर्क में जुड़ा होना चाहिए।",
      },
    ],
    principles: [
      {
        number: 1,
        icon: "tactile-guide",
        title_en: "1. Guiding vs Warning tiles",
        title_hi: "1. दिशा बनाम चेतावनी टाइल्स",
        desc_en: "Lineal ribbed tiles guide straight travel; blister dome tiles warn 300 mm before hazards.",
        desc_hi: "लकीरदार टाइल्स सीधा रास्ता दर्शाती हैं; उभरे गोल दानों वाली टाइल्स 300 mm पहले खतरे की चेतावनी देती हैं।",
      },
      {
        number: 2,
        icon: "contrast",
        title_en: "2. High visual contrast",
        title_hi: "2. उच्च दृश्य विषमता",
        desc_en: "Maintain ≥ 30% luminance contrast (e.g. bright yellow on dark charcoal floor) for low-vision students.",
        desc_hi: "कम दृष्टि वाले बच्चों के लिए फर्श से न्यूनतम 30% चमकीला कंट्रास्ट (जैसे गहरे फर्श पर पीला) रखें।",
      },
      {
        number: 3,
        icon: "route",
        title_en: "3. Continuous unbroken route",
        title_hi: "3. निर्बाध निरंतर मार्ग",
        desc_en: "Continuous 300–600 mm pathway connecting entrance gate directly to classrooms, toilets, and playground.",
        desc_hi: "प्रवेश द्वार से सीधे कक्षाओं, शौचालयों और मैदान को जोड़ने वाला 300–600 mm का निरंतर मार्ग दें।",
      },
    ],
    srOnlyDescription_en:
      "Architectural top-down plan view of tactile paving and guiding pathways for educational campuses. Illustrates 300 mm by 300 mm directional guiding tiles with raised parallel flat-topped bars indicating safe straight-line travel, blister warning tiles with truncated dome studs arranged 300 mm prior to hazards such as stairs, ramps, and elevation drops, continuous pathway width of 300 mm to 600 mm connecting the main school gate, academic corridors, and accessible toilets, and high luminance contrast of at least 30% between bright yellow tactile pavers and the dark surrounding floor.",
    srOnlyDescription_hi:
      "शैक्षणिक परिसरों में स्पर्शनीय पेविंग (टेक्टाइल पाथ) का टॉप-डाउन प्लान रेखाचित्र। इसमें सुरक्षित सीधे आवागमन हेतु उभरी पट्टियों वाली 300x300 मिमी गाइडिंग टाइल्स, सीढ़ियों व रैंप से 300 मिमी पहले लगाई गई चेतावनी ब्लिस्टर टाइल्स, मुख्य प्रवेश द्वार से कक्षा व शौचालय तक 300 से 600 मिमी का निरंतर निर्बाध मार्ग और गहरे फर्श के साथ न्यूनतम 30% का चमकीला पीला कंट्रास्ट दर्शाया गया है।",
  },

  classroom: {
    id: "classroom",
    title_en: "Inclusive Classroom Layout & Circulation",
    title_hi: "समावेशी कक्षा कक्ष एवं बैठक व्यवस्था",
    subtitle_en: "Accessible circulation, integrated wheelchair seating, and blackboard view",
    subtitle_hi: "बाधारहित आवागमन, एकीकृत बैठक व्यवस्था और श्यामपट्ट दृश्यता",
    officialStandard: "Accessibility Code for Educational Institutions, 2024",
    officialClause: "Section 4.2 & Harmonised Guidelines 2021 Cl. 6.2",
    keyTip: {
      highlight_en: "Main Aisle Width",
      highlight_hi: "मुख्य गलियारा",
      value_en: "1200 mm minimum",
      value_hi: "1200 मिमी न्यूनतम",
      subTip_en: "Integrated seating: In main cluster, never isolated at back",
      subTip_hi: "एकीकृत बैठक: साथियों के साथ मुख्य समूह में, पीछे अलग नहीं",
    },
    callouts: [
      {
        id: "main-aisle",
        num: 1,
        label_en: "Main circulation aisle",
        label_hi: "मुख्य आवागमन गलियारा",
        value: "1200 mm wide",
        sub_en: "Unobstructed wheelchair passage",
        sub_hi: "बाधारहित व्हीलचेयर आवागमन",
        studentFriendly_en: "A minimum 1200 mm main circulation corridor allows comfortable, unobstructed wheelchair travel from the classroom entrance to student desks and the teacher's area.",
        studentFriendly_hi: "कक्षा के प्रवेश द्वार से लेकर डेस्कों तक कम से कम 1200 मिमी (1.2 मीटर) चौड़ा मुख्य गलियारा, जिससे व्हीलचेयर सवार बिना किसी रुकावट के आवागमन कर सकें।",
      },
      {
        id: "row-aisle",
        num: 2,
        label_en: "Between desk rows",
        label_hi: "डेस्कों के बीच दूरी",
        value: "900 mm minimum",
        sub_en: "Crutch and walker clearance",
        sub_hi: "बैसाखी व वॉकर निकासी",
        studentFriendly_en: "A 900 mm minimum passageway between student desk rows provides sufficient clearance for students using crutches, walkers, or wheelchairs to navigate between peers.",
        studentFriendly_hi: "डेस्क पंक्तियों के बीच कम से कम 900 मिमी की दूरी, जिससे बैसाखी (क्रच) या वॉकर का उपयोग करने वाले विद्यार्थी आसानी से अपनी सीट तक पहुंच सकें।",
      },
      {
        id: "wheelchair-station",
        num: 3,
        label_en: "Wheelchair student station",
        label_hi: "व्हीलचेयर छात्र स्थान",
        value: "900 × 1400 mm clear",
        sub_en: "Integrated in primary seating",
        sub_hi: "मुख्य बैठक में एकीकृत",
        studentFriendly_en: "A dedicated 900 × 1400 mm clear floor station naturally integrated in the regular student desk arrangement ensures disabled students sit alongside their peers.",
        studentFriendly_hi: "मुख्य बैठक व्यवस्था में एकीकृत 900 × 1400 मिमी का स्पष्ट स्थान, ताकि दिव्यांग विद्यार्थी अलग-थलग बैठने के बजाय साथियों के साथ मिलकर पढ़ सकें।",
      },
      {
        id: "accessible-desk",
        num: 4,
        label_en: "Accessible student desk",
        label_hi: "सुलभ छात्र मेज",
        value: "750 mm top height",
        sub_en: "680 mm knee clear × 500 mm depth",
        sub_hi: "680 मिमी नी-स्पेस × 500 मिमी गहराई",
        studentFriendly_en: "An accessible desk surface mounted at 750 mm height with a 680 mm vertical knee clearance and 500 mm depth comfortably accommodates wheelchair armrests and footrests.",
        studentFriendly_hi: "750 मिमी ऊंची मेज जिसके नीचे 680 मिमी का खुला नी-स्पेस (Knee Clearance) और 500 मिमी गहराई हो, ताकि व्हीलचेयर आसानी से अंदर जा सके।",
      },
      {
        id: "doorway-clear",
        num: 5,
        label_en: "Classroom clear doorway",
        label_hi: "कक्षा द्वार निकासी",
        value: "900 mm clear opening",
        sub_en: "Level flush threshold (< 12 mm)",
        sub_hi: "समतल देहरी (12 मिमी से कम)",
        studentFriendly_en: "A 900 mm clear entrance doorway opening with a flush threshold (under 12 mm) ensures seamless, bump-free roll-in access for manual and electric wheelchairs.",
        studentFriendly_hi: "कम से कम 900 मिमी चौड़ा सुगम द्वार और 12 मिमी से कम समतल देहरी, ताकि व्हीलचेयर बिना किसी झटके या रुकावट के कक्षा में प्रवेश कर सके।",
      },
      {
        id: "blackboard-height",
        num: 6,
        label_en: "Teaching board lower edge",
        label_hi: "श्यामपट्ट निचला सिरा",
        value: "Maximum 800 mm from floor",
        sub_en: "Optimal seated viewing & writing",
        sub_hi: "बैठकर दृश्यता व लिखने योग्य",
        studentFriendly_en: "The lower edge of the green blackboard is positioned at maximum 800 mm from the floor so that seated students in wheelchairs have clear viewing and reach.",
        studentFriendly_hi: "श्यामपट्ट (ब्लैकबोर्ड) का निचला सिरा फर्श से अधिकतम 800 मिमी की ऊंचाई पर, जिससे व्हीलचेयर पर बैठे विद्यार्थी आसानी से देख और लिख सकें।",
      },
    ],
    principles: [
      {
        number: 1,
        icon: "aisle",
        title_en: "1. Wide circulation aisles",
        title_hi: "1. चौड़े आवागमन गलियारे",
        desc_en: "1200 mm main aisle and 900 mm between desks for smooth wheelchair and crutch mobility.",
        desc_hi: "व्हीलचेयर और बैसाखी से चलने हेतु 1200 mm मुख्य गलियारा और डेस्कों के बीच 900 mm रास्ता दें।",
      },
      {
        number: 2,
        icon: "desk",
        title_en: "2. Integrated desk station",
        title_hi: "2. एकीकृत व्हीलचेयर डेस्क",
        desc_en: "750 mm high desk with 680 mm knee clearance and 900 × 1400 mm station integrated among peers.",
        desc_hi: "साथियों के साथ 750 mm ऊंची डेस्क, 680 mm नी-क्लीयरेंस और 900 × 1400 mm का एकीकृत स्थान दें।",
      },
      {
        number: 3,
        icon: "board",
        title_en: "3. Low board & flush entry",
        title_hi: "3. सुगम श्यामपट्ट व समतल देहरी",
        desc_en: "Board lower edge at max 800 mm height; door clear width 900 mm with level threshold under 12 mm.",
        desc_hi: "बोर्ड का निचला सिरा अधिकतम 800 mm; 900 mm चौड़ा द्वार और 12 mm से कम समतल देहरी रखें।",
      },
    ],
    srOnlyDescription_en:
      "Architectural top-down plan view of an inclusive accessible classroom. Shows minimum 1200 mm wide primary circulation aisles connecting the entrance to all zones, 900 mm clear passageways between desk rows, an integrated wheelchair station measuring 900 mm by 1400 mm positioned naturally in the front-middle seating cluster, an accessible student desk 750 mm high with 680 mm vertical knee clearance and 500 mm depth, a 900 mm clear entrance doorway with a flush threshold under 12 mm height, and the blackboard mounted with its lower edge no higher than 800 mm from the floor for seated student visibility.",
    srOnlyDescription_hi:
      "समावेशी कक्षा का टॉप-डाउन प्लान रेखाचित्र। इसमें प्रवेश द्वार से कक्षा के भीतर 1200 मिमी का मुख्य आवागमन गलियारा, डेस्क पंक्तियों के बीच 900 मिमी की निकासी, साथियों के साथ एकीकृत 900x1400 मिमी का व्हीलचेयर छात्र स्थान, 750 मिमी ऊंची व 680 मिमी नी-क्लीयरेंस वाली मेज, 900 मिमी चौड़ा सुगम द्वार (12 मिमी से कम देहरी सहित) और फर्श से अधिकतम 800 मिमी की ऊंचाई पर स्थित श्यामपट्ट का निचला सिरा दर्शाया गया है।",
  },
};
