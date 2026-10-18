export interface TechnicalSpecification {
  parameter_hi: string;
  parameter_en: string;
  standardValue: string;
  sourceClause: string;
}

export interface ComparisonCard {
  correct_hi: string;
  correct_en: string;
  incorrect_hi: string;
  incorrect_en: string;
  reason_hi: string;
  reason_en: string;
}

export interface VisualGuideTopic {
  id: string;
  slug: string;
  title_hi: string;
  title_en: string;
  subtitle_hi: string;
  subtitle_en: string;
  officialStandard: string;
  officialStandardClause: string;
  easyExplanation_hi: string;
  easyExplanation_en: string;
  diagramType: "ramp" | "toilet" | "tactile" | "classroom";
  altText_hi: string;
  altText_en: string;
  keySpecs: TechnicalSpecification[];
  comparisons: ComparisonCard[];
  auditChecklist_hi: string[];
  auditChecklist_en: string[];
}

export const VISUAL_GUIDE_TOPICS: VisualGuideTopic[] = [
  {
    id: "guide-ramp",
    slug: "accessible-school-ramp",
    title_hi: "मानक विद्यालय रैंप एवं रेलिंग",
    title_en: "Accessible School Ramp & Handrails",
    subtitle_hi: "सटीक ढलान (1:12), दोनों तरफ दोहरी रेलिंग और बाधारहित पहुंच",
    subtitle_en: "Correct gradient (1:12), bilateral continuous dual handrails, and level landings",
    officialStandard: "Accessibility Code for Educational Institutions, 2024",
    officialStandardClause: "Section 3.2 (Ramps and Approaches) & Harmonised Guidelines 2021 Clause 4.5",
    easyExplanation_hi:
      "रैंप केवल सीमेंट की ढाल बना देना नहीं है। यदि ढलान बहुत खड़ी (Steep) हो तो व्हीलचेयर पलट सकती है या बच्चे को चढ़ाने में भारी परेशानी होती है। एक सही रैंप में 1:12 का सुरक्षित ढलान होना चाहिए, दोनों तरफ पकड़ने के लिए 760 मिमी और 900 मिमी की ऊंचाई पर दोहरी रेलिंग होनी चाहिए, और चढ़ने-उतरने के स्थान पर 1500x1500 मिमी का समतल चबूतरा (Landing) होना चाहिए।",
    easyExplanation_en:
      "A ramp is not merely a cement slope. An excessively steep ramp risks tipping wheelchairs and causing injuries. A compliant school ramp must maintain a gentle gradient (1:12 maximum), continuous bilateral handrails at dual heights (760mm and 900mm) for both children and adults, and 1500mm x 1500mm level landings for rest and turning.",
    diagramType: "ramp",
    altText_hi:
      "तकनीकी रेखाचित्र: विद्यालय रैंप जिसमें 1:12 का ढलान, 1200 मिमी चौड़ाई, 760 मिमी और 900 मिमी की दोहरी रेलिंग, और 1500x1500 मिमी का समतल लैंडिंग चबूतरा दर्शाया गया है।",
    altText_en:
      "Architectural technical diagram: School ramp showing 1:12 maximum slope ratio, 1200mm minimum clear width, dual continuous handrails at 760mm and 900mm heights, and 1500mm level landings.",
    keySpecs: [
      {
        parameter_hi: "अधिकतम ढलान अनुपात (Slope Gradient)",
        parameter_en: "Maximum Slope Gradient",
        standardValue: "1:12 (8.33%) अधिकतम (लंबी दूरी हेतु 1:15 या 1:20 अनुशंसित)",
        sourceClause: "Accessibility Code 2024, Cl. 3.2.1",
      },
      {
        parameter_hi: "न्यूनतम आंतरिक चौड़ाई (Clear Width)",
        parameter_en: "Minimum Clear Ramp Width",
        standardValue: "न्यूनतम 1200 मिमी (दोनों तरफ रेलिंग के बीच)",
        sourceClause: "Harmonised Guidelines 2021, Cl. 4.5.2",
      },
      {
        parameter_hi: "दोहरी रेलिंग की ऊंचाई (Handrail Heights)",
        parameter_en: "Dual Handrail Heights",
        standardValue: "निचली रेलिंग: 760 मिमी (बच्चों हेतु); ऊपरी रेलिंग: 900 मिमी",
        sourceClause: "Accessibility Code 2024, Cl. 3.2.4",
      },
      {
        parameter_hi: "रेलिंग का विस्तार (Handrail Extension)",
        parameter_en: "Handrail Extension at Terminations",
        standardValue: "रैंप शुरू और खत्म होने के बाद 300 मिमी समतल विस्तार",
        sourceClause: "Harmonised Guidelines 2021, Cl. 4.5.6",
      },
      {
        parameter_hi: "समतल लैंडिंग चबूतरा (Landing Platform)",
        parameter_en: "Level Landing Dimensions",
        standardValue: "न्यूनतम 1500 मिमी × 1500 मिमी (शीर्ष, तल व प्रत्येक 9 मी. पर)",
        sourceClause: "Accessibility Code 2024, Cl. 3.2.3",
      },
      {
        parameter_hi: "किनारे की सुरक्षा दीवार (Edge Protection / Curb)",
        parameter_en: "Side Edge Curb Protection",
        standardValue: "न्यूनतम 100 मिमी ऊंची सुरक्षा किनारी (ताकि पहिया न फिसले)",
        sourceClause: "Harmonised Guidelines 2021, Cl. 4.5.5",
      },
    ],
    comparisons: [
      {
        correct_hi: "1:12 की हल्की ढलान जिस पर बच्चा स्वयं व्हीलचेयर चला सके।",
        correct_en: "Gentle 1:12 gradient enabling independent wheelchair propulsion.",
        incorrect_hi: "1:5 या 1:6 की अत्यंत खड़ी ढलान जो सीढ़ियों पर सीमेंट पोतकर बनाई जाती है।",
        incorrect_en: "Steep 1:5 slope created merely by pouring mortar over existing steps.",
        reason_hi: "खड़ी ढलान पर व्हीलचेयर पीछे की ओर पलट सकती है और गंभीर चोट का कारण बन सकती है।",
        reason_en: "Excessive incline causes rearward tip-over hazards and requires extreme physical force.",
      },
      {
        correct_hi: "दोनों तरफ गोलाकार 38-45 मिमी व्यास की चिकनी, निरंतर रेलिंग।",
        correct_en: "Continuous 38-45mm circular grab handrails on both sides.",
        incorrect_hi: "बिना रेलिंग का रैंप या केवल एक तरफ दीवार पर लगी टूटी पाइप।",
        incorrect_en: "Ramp without any handrails or with a broken pipe on one side only.",
        reason_hi: "रेलिंग न होने पर बैसाखी (Crutch) या व्हीलचेयर उपयोगकर्ता के नीचे गिरने का जोखिम रहता है।",
        reason_en: "Absence of handrails leaves walking-frame and crutch users with zero fall protection.",
      },
    ],
    auditChecklist_hi: [
      "क्या मुख्य प्रवेश द्वार तक पहुंचने के लिए रैंप उपलब्ध है?",
      "क्या रैंप की ढलान 1:12 के मानक के भीतर है (मापक टेप से जांचें)?",
      "क्या दोनों तरफ 760 मिमी और 900 मिमी की ऊंचाई पर दोहरी रेलिंग लगी है?",
      "क्या रैंप के शीर्ष और तल पर 1500x1500 मिमी का समतल स्थान है?",
      "क्या रैंप की सतह खुरदरी (गैर-फिसलन) है?",
    ],
    auditChecklist_en: [
      "Is a step-free ramp provided to access the main entrance building?",
      "Is the ramp gradient within 1:12 standard (measured via tape & spirit level)?",
      "Are bilateral dual-height handrails (760mm & 900mm) firmly anchored on both sides?",
      "Is a 1500mm x 1500mm level landing present at both the top and bottom?",
      "Is the ramp surface non-slip with edge curbs?",
    ],
  },
  {
    id: "guide-toilet",
    slug: "accessible-school-toilet",
    title_hi: "दिव्यांग-अनुकूल सुलभ शौचालय (Accessible CwSN Toilet)",
    title_en: "Accessible School Toilet (CwSN Unisex Sanitary Facility)",
    subtitle_hi: "पहिएदार कुर्सी का 1500 मिमी घुमाव, ग्रैब बार, चौड़ा बाहरी द्वार एवं सुलभ नल",
    subtitle_en: "1500mm wheelchair turning circle, grab bars, outward-opening 900mm door, accessible basin",
    officialStandard: "Accessibility Code for Educational Institutions, 2024",
    officialStandardClause: "Section 4.3 (Sanitary Facilities) & Harmonised Guidelines 2021 Clause 8.3",
    easyExplanation_hi:
      "स्कूल में सुलभ शौचालय न होना दिव्यांग बच्चों (विशेषकर बालिकाओं) के स्कूल छोड़ने (Drop-out) का सबसे बड़ा कारण है। सुलभ शौचालय सामान्य शौचालय से बड़ा (न्यूनतम 2000x2200 मिमी) होना चाहिए ताकि व्हीलचेयर अंदर घूम सके। कमोड के पास मजबूत L-आकार की रेलिंग (ग्रैब बार), बाहर की ओर खुलने वाला कम से कम 900 मिमी चौड़ा दरवाजा और आपातकालीन अलार्म होना अनिवार्य है। सबसे महत्वपूर्ण: यह शौचालय हमेशा खुला और चालू रहना चाहिए, न कि ताला लगाकर स्टोर रूम बनाया जाए।",
    easyExplanation_en:
      "Inaccessible toilets are the single leading cause of school dropouts among disabled children, particularly girls. An accessible toilet must be spacious (minimum 2000mm x 2200mm) to allow a 1500mm wheelchair turning circle. It requires wall-mounted and foldable grab bars, an outward-opening 900mm door, low-height washbasin, and emergency cord. Crucially, it must remain unlocked and functional, not relegated to storage.",
    diagramType: "toilet",
    altText_hi:
      "तकनीकी लेआउट: सुलभ शौचालय का खाका जिसमें 2000x2200 मिमी का क्षेत्र, 1500 मिमी टर्निंग सर्कल, L-आकार का ग्रैब बार, 450-480 मिमी कमोड ऊंचाई, और 900 मिमी चौड़ा बाहरी दरवाजा दिखाया गया है।",
    altText_en:
      "Technical floor plan layout: Accessible unisex toilet showing 2000mm x 2200mm internal clearance, 1500mm turning diameter, L-shape and flip-up grab bars, 450-480mm WC seat height, and outward door.",
    keySpecs: [
      {
        parameter_hi: "आंतरिक न्यूनतम माप (Internal Dimensions)",
        parameter_en: "Minimum Internal Clearance",
        standardValue: "न्यूनतम 2000 मिमी × 2200 मिमी (1500 मिमी टर्निंग दायरा)",
        sourceClause: "Accessibility Code 2024, Cl. 4.3.2",
      },
      {
        parameter_hi: "दरवाजे की चौड़ाई एवं प्रकार (Door Width & Opening)",
        parameter_en: "Clear Doorway Clearance & Swing",
        standardValue: "न्यूनतम 900 मिमी चौड़ाई; अनिवार्य रूप से बाहर की ओर खुले (Outward Opening)",
        sourceClause: "Harmonised Guidelines 2021, Cl. 8.3.4",
      },
      {
        parameter_hi: "कमोड सीट की ऊंचाई (WC Pan Height)",
        parameter_en: "Water Closet Seat Height",
        standardValue: "फर्श से 450 मिमी से 480 मिमी (पहिया कुर्सी के स्तर पर)",
        sourceClause: "Accessibility Code 2024, Cl. 4.3.3",
      },
      {
        parameter_hi: "ग्रैब बार व्यवस्था (Safety Grab Bars)",
        parameter_en: "Safety Grab Bar Configuration",
        standardValue: "दीवार पर L-आकार (600×600 मिमी) + खुली तरफ फोल्डेबल ग्रैब बार (750 मिमी ऊंचाई)",
        sourceClause: "Harmonised Guidelines 2021, Cl. 8.3.6",
      },
      {
        parameter_hi: "वॉशबेसिन ऊंचाई (Washbasin Height)",
        parameter_en: "Washbasin Rim Height",
        standardValue: "750 मिमी - 800 मिमी; नीचे 650 मिमी घुटने की जगह (Knee Clearance)",
        sourceClause: "Accessibility Code 2024, Cl. 4.3.5",
      },
      {
        parameter_hi: "आपातकालीन घंटी / कॉर्ड (Emergency Alarm)",
        parameter_en: "Emergency Pull-Cord Alarm",
        standardValue: "फर्श से 100 मिमी एवं 900 मिमी पर पहुंचने योग्य लाल आपातकालीन कॉर्ड",
        sourceClause: "Harmonised Guidelines 2021, Cl. 8.3.8",
      },
    ],
    comparisons: [
      {
        correct_hi: "दरवाजा बाहर की ओर खुलता है ताकि अंदर गिरने पर भी दरवाजा आसानी से खुल सके।",
        correct_en: "Door swings outward so it can be opened safely if a student falls inside.",
        incorrect_hi: "दरवाजा अंदर की ओर खुलता है जिससे व्हीलचेयर फंस जाती है।",
        incorrect_en: "Door swings inward, blocking wheelchair maneuvering and trapping occupants.",
        reason_hi: "यदि विद्यार्थी अंदर गिर जाता है, तो अंदर खुलने वाले दरवाजे को बाहर से खोलना असंभव हो जाता है।",
        reason_en: "An inward-opening door is fatally blocked if someone collapses behind it.",
      },
      {
        correct_hi: "कमोड के दोनों तरफ ग्रैब बार लगे हैं जिससे बच्चा बिना मदद के सीट पर स्थानांतरित हो सके।",
        correct_en: "Firm grab bars on both sides supporting independent lateral transfer.",
        incorrect_hi: "केवल भारतीय शैली (Indian squat) का गड्ढा शौचालय जिसमें कोई पकड़ने का सहारा न हो।",
        incorrect_en: "Standard squat toilet with high steps and no support rails.",
        reason_hi: "अस्थि-दिव्यांग या व्हीलचेयर उपयोगकर्ता बिना कमोड और ग्रैब बार के शौचालय का उपयोग नहीं कर सकते।",
        reason_en: "Orthopedic or wheelchair users physically cannot access or balance on squat-type pans.",
      },
    ],
    auditChecklist_hi: [
      "क्या विद्यालय में समर्पित सुलभ शौचालय उपलब्ध और खुला है?",
      "क्या शौचालय का दरवाजा कम से कम 900 मिमी चौड़ा है और बाहर खुलता है?",
      "क्या कमोड सीट 450-480 मिमी की मानक ऊंचाई पर है?",
      "क्या कमोड के पास मजबूत L-आकार और फोल्डिंग ग्रैब बार लगे हैं?",
      "क्या वॉशबेसिन तक व्हीलचेयर आसानी से पहुंच सकती है?",
    ],
    auditChecklist_en: [
      "Is a dedicated CwSN toilet facility present, unlocked, and functional?",
      "Does the door have a clear width of >=900mm and swing outward?",
      "Is the toilet seat at the standard accessible height of 450-480mm?",
      "Are firmly anchored L-shaped and foldable grab bars installed?",
      "Is the washbasin low-height with open knee clearance underneath?",
    ],
  },
  {
    id: "guide-tactile-path",
    slug: "tactile-guiding-pathway",
    title_hi: "स्पर्शनीय मार्गदर्शक पाथवे (Tactile Paving)",
    title_en: "Tactile Guiding & Warning Pathway",
    subtitle_hi: "नेत्रहीन एवं अल्प-दृष्टि विद्यार्थियों के लिए दिशा-सूचक एवं चेतावनी टाइल्स",
    subtitle_en: "Guiding directional bars and warning blister paving for visually impaired students",
    officialStandard: "Harmonised Guidelines and Standards for Universal Accessibility in India, 2021",
    officialStandardClause: "Clause 5.3 (Tactile Ground Surface Indicators - TGSI) & Accessibility Code 2024",
    easyExplanation_hi:
      "नेत्रहीन बच्चे अपनी सफेद छड़ी (White Cane) और पैरों के स्पर्श से रास्ते को पहचानते हैं। स्कूल के मुख्य गेट से कक्षा, शौचालय और पेयजल तक दो तरह की टाइलें लगाई जाती हैं: (1) लंबी उभरी धारियों वाली 'मार्गदर्शक टाइलें' (Guiding Tiles) जो आगे बढ़ने का सीधा रास्ता बताती हैं, और (2) गोल उभरे दानों वाली 'चेतावनी टाइलें' (Warning / Blister Tiles) जो सीढ़ियों, दरवाजों या खतरे से ठीक 300 मिमी पहले सावधान करती हैं। इन टाइलों का रंग फर्श से बिल्कुल अलग (जैसे पीले रंग का) होना चाहिए।",
    easyExplanation_en:
      "Students with visual impairments navigate via white cane tapping and foot tactile feedback. Tactile Ground Surface Indicators (TGSI) comprise two standardized patterns: (1) Directional tiles with parallel raised bars indicating unobstructed forward paths, and (2) Warning blister tiles with raised circular domes installed 300mm before hazards, drop-offs, stairs, or turns. Tiles must feature a minimum 30% luminance contrast (typically safety yellow).",
    diagramType: "tactile",
    altText_hi:
      "तकनीकी आरेख: 300 मिमी चौड़ा स्पर्शनीय पाथवे जिसमें दिशा-सूचक समानांतर धारियां तथा सीढ़ियों से 300 मिमी पहले लगी गोल चेतावनी टाइल्स प्रदर्शित हैं।",
    altText_en:
      "Technical diagram: 300mm wide tactile path displaying parallel directional bars for guiding and raised round blister domes 300mm before stair descent for warning.",
    keySpecs: [
      {
        parameter_hi: "पाथवे की चौड़ाई (Tactile Path Width)",
        parameter_en: "Tactile Path Width",
        standardValue: "न्यूनतम 300 मिमी से 600 मिमी की निरंतर पट्टी",
        sourceClause: "Harmonised Guidelines 2021, Cl. 5.3.2",
      },
      {
        parameter_hi: "दिशा-सूचक टाइल पैटर्न (Directional / Guiding Tiles)",
        parameter_en: "Guiding Tile Profile",
        standardValue: "5 मिमी ऊंची, 25-35 मिमी चौड़ी समानांतर सपाट धारियां (Flat-topped Bars)",
        sourceClause: "Harmonised Guidelines 2021, Cl. 5.3.3",
      },
      {
        parameter_hi: "चेतावनी टाइल पैटर्न (Warning / Hazard Tiles)",
        parameter_en: "Warning Blister Tile Profile",
        standardValue: "5 मिमी ऊंचे, 25 मिमी आधार व्यास के अर्धगोलाकार उभरे दाने (Truncated Domes)",
        sourceClause: "Harmonised Guidelines 2021, Cl. 5.3.4",
      },
      {
        parameter_hi: "खतरे से दूरी (Warning Placement Distance)",
        parameter_en: "Warning Strip Standoff Distance",
        standardValue: "सीढ़ियों, रैंप लैंडिंग व सड़क से ठीक 300 मिमी पहले स्थापित",
        sourceClause: "Accessibility Code 2024, Cl. 3.4.2",
      },
      {
        parameter_hi: "दृश्य कंट्रास्ट (Luminance Contrast)",
        parameter_en: "Visual Luminance Contrast",
        standardValue: "फर्श की तुलना में न्यूनतम 30% कंट्रास्ट (गहरे फर्श पर चमकीला पीला)",
        sourceClause: "Harmonised Guidelines 2021, Cl. 5.3.5",
      },
    ],
    comparisons: [
      {
        correct_hi: "मुख्य प्रवेश द्वार से कक्षा, शौचालय और पेयजल तक निरंतर, बिना रुकावट वाला पाथवे।",
        correct_en: "Continuous, unobstructed tactile pathway connecting gate to classrooms and toilets.",
        incorrect_hi: "बीच-बीच में टूटा हुआ रास्ता या पाथवे के ऊपर गमले, बेंच या पोल रखे होना।",
        incorrect_en: "Fragmented tactile tiles interrupted by flower pots, benches, or signposts.",
        reason_hi: "पाथवे पर कोई वस्तु होने से नेत्रहीन विद्यार्थी टकराकर गिर सकता है।",
        reason_en: "Obstructions placed on tactile paths create acute trip-and-fall collision hazards.",
      },
      {
        correct_hi: "सीढ़ियों के ठीक 300 मिमी पहले गोल दानों वाली चेतावनी टाइल जो कदम रोकने का संकेत दे।",
        correct_en: "Warning blister tiles positioned exactly 300mm before flight of stairs.",
        incorrect_hi: "सीढ़ियों के किनारे तक सीधी जाने वाली दिशा-सूचक धारियां लगा देना।",
        incorrect_en: "Directional lines continuing straight to the drop-off edge without warning.",
        reason_hi: "चेतावनी टाइल न होने पर बच्चा सीधे सीढ़ियों से नीचे गिर सकता है।",
        reason_en: "Lack of blister warning cues causes students to step unknowingly into vertical drops.",
      },
    ],
    auditChecklist_hi: [
      "क्या मुख्य द्वार से प्रमुख स्कूल सुविधाओं तक स्पर्शनीय पाथवे बना है?",
      "क्या सीढ़ियों और ढलानों से 300 मिमी पहले चेतावनी टाइलें लगी हैं?",
      "क्या टाइलों का रंग फर्श से स्पष्ट रूप से अलग और दिखाई देने योग्य है?",
      "क्या पाथवे पर कोई बिजली का खंभा, गमला या कचरा पेटी तो नहीं रखी है?",
    ],
    auditChecklist_en: [
      "Is a continuous tactile guiding path laid from school gate to primary facilities?",
      "Are blister warning tiles positioned 300mm in advance of all staircases and ramps?",
      "Do the tactile tiles provide at least 30% visual contrast against surrounding paving?",
      "Is the guiding corridor entirely free from overhead or floor-level obstructions?",
    ],
  },
  {
    id: "guide-classroom",
    slug: "accessible-classroom-design",
    title_hi: "समावेशी एवं सुलभ कक्षा-कक्ष (Accessible Classroom)",
    title_en: "Accessible & Inclusive Classroom Environment",
    subtitle_hi: "900 मिमी बाधारहित द्वार, समतल प्रवेश, व्हीलचेयर अनुकूल डेस्क व समान प्रकाश",
    subtitle_en: "900mm clear doorways, level threshold, adaptable wheelchair desk spacing, glare-free light",
    officialStandard: "Accessibility Code for Educational Institutions, 2024",
    officialStandardClause: "Section 3.5 (Internal Circulation & Doors) and Section 5.1 (Classrooms)",
    easyExplanation_hi:
      "कक्षा का दरवाजा इतना चौड़ा (न्यूनतम 900 मिमी) होना चाहिए कि व्हीलचेयर आसानी से अंदर जा सके। दरवाजे की चौखट पर कोई ऊंचा पायदान या देहरी (Threshold) नहीं होनी चाहिए। कक्षा के भीतर आगे की पंक्ति में व्हीलचेयर उपयोगकर्ता के लिए खुली जगह और ऐसी डेस्क होनी चाहिए जिसके नीचे पैर और पहिए आसानी से जा सकें। ब्लैकबोर्ड/ग्रीनबोर्ड ऐसी ऊंचाई पर हो कि बैठा हुआ बच्चा भी देख सके और जरूरत पड़ने पर उस पर लिख सके।",
    easyExplanation_en:
      "Classroom entryways must provide a minimum 900mm clear opening with step-free flush thresholds (bevelled <=12mm). Inside, aisles between desks must measure at least 1200mm, with designated wheelchair workstation spaces providing open knee clearance. Writing boards must be mounted with the bottom edge between 800mm-900mm so seated learners have unhindered visibility and reach.",
    diagramType: "classroom",
    altText_hi:
      "तकनीकी लेआउट: सुलभ कक्षा-कक्ष जिसमें 900 मिमी का बाधारहित द्वार, 1200 मिमी चौड़ा डेस्क गलियारा, और व्हीलचेयर के लिए समर्पित डेस्क स्थान दिखाया गया है।",
    altText_en:
      "Technical classroom floor plan: Showing 900mm clear door opening, 1200mm circulation aisles, accessible wheelchair seating station, and glare-free blackboard placement.",
    keySpecs: [
      {
        parameter_hi: "कक्षा द्वार की न्यूनतम चौड़ाई (Clear Door Width)",
        parameter_en: "Clear Doorway Clearance",
        standardValue: "न्यूनतम 900 मिमी (अधिमानतः 1000 मिमी)",
        sourceClause: "Accessibility Code 2024, Cl. 3.5.1",
      },
      {
        parameter_hi: "प्रवेश देहरी / चौखट ऊंचाई (Door Threshold)",
        parameter_en: "Door Threshold Height",
        standardValue: "शून्य स्तर अथवा अधिकतम 12 मिमी ढालू किनारा (Chamfered Threshold)",
        sourceClause: "Harmonised Guidelines 2021, Cl. 6.2.2",
      },
      {
        parameter_hi: "डेस्कों के बीच गलियारा (Aisle Circulation)",
        parameter_en: "Circulation Aisle Width",
        standardValue: "न्यूनतम 1200 मिमी (व्हीलचेयर आवागमन हेतु)",
        sourceClause: "Accessibility Code 2024, Cl. 5.1.2",
      },
      {
        parameter_hi: "सुलभ डेस्क माप (Accessible Desk Knee Space)",
        parameter_en: "Wheelchair Desk Knee Clearance",
        standardValue: "ऊंचाई 750-800 मिमी; नीचे न्यूनतम 700 मिमी ऊंची व 500 मिमी गहरी घुटने की जगह",
        sourceClause: "Accessibility Code 2024, Cl. 5.1.4",
      },
      {
        parameter_hi: "श्यामपट्ट ऊंचाई (Blackboard Bottom Edge)",
        parameter_en: "Blackboard / Smartboard Lower Edge",
        standardValue: "फर्श से 800 मिमी से 900 मिमी (ताकि बैठे विद्यार्थी देख व लिख सकें)",
        sourceClause: "Accessibility Code 2024, Cl. 5.1.6",
      },
      {
        parameter_hi: "प्रकाश व्यवस्था (Illumination Level)",
        parameter_en: "Classroom Lighting / Glare Control",
        standardValue: "न्यूनतम 300 लक्स एकसमान, बिना चकाचौंध (Glare-free) वाला प्रकाश",
        sourceClause: "Harmonised Guidelines 2021, Cl. 6.6",
      },
    ],
    comparisons: [
      {
        correct_hi: "कक्षा प्रवेश पूरी तरह समतल है और व्हीलचेयर बिना किसी धक्के के अंदर चली जाती है।",
        correct_en: "Level step-free threshold allowing smooth wheelchair entry without jolts.",
        incorrect_hi: "दरवाजे पर 2 से 4 इंच ऊंची सीमेंट की देहरी या सीढ़ी बनी होना।",
        incorrect_en: "2 to 4 inch high raised masonry threshold blocking wheelchair casters.",
        reason_hi: "ऊंची देहरी व्हीलचेयर के छोटे अगले पहियों को रोक देती है जिससे बच्चे को उठाकर ले जाना पड़ता है।",
        reason_en: "Raised door lips halt wheelchair front casters, forcing undignified lifting of the student.",
      },
      {
        correct_hi: "आगे की कतार में समायोज्य ऊंचाई वाली डेस्क जहां व्हीलचेयर सीधे लग सके।",
        correct_en: "Front-row accessible desk with open knee clearance and wheelchair docking space.",
        incorrect_hi: "जमीन में गड़े हुए भारी लकड़ी के बेंच जहां व्हीलचेयर के लिए कोई जगह नहीं होती।",
        incorrect_en: "Fixed benches bolted to the floor with zero space for wheelchair seating.",
        reason_hi: "फिक्स्ड बेंचों के कारण दिव्यांग बच्चे को सबसे पीछे या अलग-थलग बैठना पड़ता है।",
        reason_en: "Bolted narrow benches force disabled children to sit segregated in the back or hallway.",
      },
    ],
    auditChecklist_hi: [
      "क्या कक्षा का दरवाजा कम से कम 900 मिमी चौड़ा है?",
      "क्या प्रवेश पर कोई ऊंची देहरी (Threshold) तो नहीं है?",
      "क्या डेस्क पंक्तियों के बीच कम से कम 1200 मिमी का स्पष्ट रास्ता है?",
      "क्या व्हीलचेयर उपयोग करने वाले बच्चे के लिए उपयुक्त डेस्क उपलब्ध है?",
      "क्या कक्षा में ब्लैकबोर्ड पर रोशनी बिना चकाचौंध (Glare) के पड़ती है?",
    ],
    auditChecklist_en: [
      "Does the classroom entrance provide a minimum clear opening of >=900mm?",
      "Is the entryway flush and step-free without raised thresholds?",
      "Are circulation aisles between desks at least 1200mm wide?",
      "Is there an adapted accessible desk with knee clearance for wheelchair users?",
      "Is the writing board glare-free and clearly visible from all student seats?",
    ],
  },
];
