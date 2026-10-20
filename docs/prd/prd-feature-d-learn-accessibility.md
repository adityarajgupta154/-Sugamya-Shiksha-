# Product Requirements Document (PRD)
# Feature D: Learn Accessibility — Visual Guide (सुगम्यता सीखें — विजुअल गाइड)

- **Document Version:** 1.0.0
- **Project:** Sugamya Shiksha Bihar (सुगम्य शिक्षा बिहार)
- **Research:** Sugamya Shiksha Bihar School Accessibility Research (Danapur, Patna, Bihar)
- **Status:** Approved / Production Specification
- **Author:** Product & Accessibility Engineering Team
- **Target Audience:** School Principals, PWD/SSA Civil Contractors, SMC Members, Field Auditors, Disabled Student Advocates

---

## 1. Executive Summary & Problem Statement

### 1.1 The Ground Reality in Bihar
Field audits and community surveys across Danapur and Patna reveal a severe gap between statutory accessibility guidelines and physical school construction:
- **Steep "Death-Trap" Ramps:** Over 80% of existing school ramps are built at dangerous 1:4 or 1:6 slopes (simply cementing over existing brick stairs), making them impossible or hazardous for a child in a wheelchair to climb without risking tipping backward.
- **Defective "CwSN Toilets":** Many toilets labeled "Divyang-friendly" lack standard grab bars, have standard 600mm narrow doors that cannot fit a wheelchair, or mount water faucets and latches out of reach.
- **Discontinuous Tactile Paths:** Tactile guiding tiles often lead into open drains, trees, or abruptly terminate before doorways.
- **Dense Technical Jargon:** Official documents like the *Accessibility Code for Educational Institutions 2024* (180+ pages) and *Harmonised Guidelines 2021* (400+ pages) are written in technical civil engineering English that school headmasters, teachers, and local village contractors cannot readily comprehend or apply.

### 1.2 The Solution
**Feature D: Learn Accessibility — Visual Guide** is an interactive, visual-first digital reference module that translates statutory architectural codes into clear, illustrated schematics, simple bilingual Hindi/English explanations, real-world "Correct vs. Incorrect" (सही बनाम गलत) comparative matrices, and practical on-site audit checklists.

---

## 2. Objectives & Success Metrics

### 2.1 Goals
1. **Demystify Building Codes:** Present complex CPWD and Ministry of Education standards in intuitive visual schematics with clear millimeter and ratio callouts.
2. **Eliminate "Paper Compliance":** Show why common shortcut constructions fail and how they violate the law, replacing them with compliant execution drawings.
3. **Empower Grassroots Stakeholders:** Give School Management Committees (SMC), headmasters, and local contractors practical guidance they can take onto the construction site.
4. **Standardize Field Audits:** Provide an authoritative visual benchmark for auditors conducting Smart Audits under Feature A.

### 2.2 Success Metrics (KPIs)
| Metric | Baseline | 6-Month Target | Measurement Method |
|---|---|---|---|
| **Guide Page Views** | — | > 10,000 unique visits | Privacy-first Firebase Analytics |
| **Average Time on Page** | — | > 3.5 minutes | Analytics session duration |
| **Checklist / Schematic Downloads** | — | > 500 PDF downloads | Event tracking on download button |
| **Field Audit Accuracy** | 60% | > 95% metric consistency | Cross-validation with Feature A audits |
| **Contractor / SMC Adoption** | Low | > 25 Danapur schools referenced | Field survey & verified tracker entries |

---

## 3. User Personas & Use Cases

### Persona 1: Rajesh Kumar — Headmaster, Government Middle School, Danapur
- **Need:** Received Samagra Shiksha funds to build a ramp and disabled-friendly toilet, but has no engineering background.
- **Use Case:** Opens the Visual Guide on his mobile phone to verify whether the contractor's slope (1:12) and dual handrail heights (760mm and 900mm) comply before signing off on disbursement.

### Persona 2: Rameshwar Singh — Local Civil Works Contractor
- **Need:** Needs exact technical measurements (dimensions, turning radius, door clearances) in simple Hindi to instruct masons.
- **Use Case:** Uses the "Key Specs" table and "Do's & Don'ts" comparison on site to build proper 1500x1500mm landings and 100mm wheel edge protection curbs.

### Persona 3: Anjali Verma — Research Fellow & Field Auditor
- **Need:** Needs immediate statutory clause citations when scoring a school's infrastructure under Feature A and C.
- **Use Case:** References the official standard clauses (e.g. *Accessibility Code 2024, Cl. 3.2.1*) to substantiate deficiency reports in the School Accessibility Scorecard.

### Persona 4: Sunita Devi — Parent of a 9-Year-Old Child with Cerebral Palsy
- **Need:** Wants to know what her child is legally entitled to in the classroom and school campus under the RPwD Act 2016.
- **Use Case:** Reads the easy Hindi explanations to advocate for wide desk spacing and level entry at the next SMC meeting.

---

## 4. Statutory & Regulatory Standards

All parameters in the Visual Guide are anchored directly in statutory Indian accessibility mandates:
1. **Accessibility Code for Educational Institutions, 2024** (Ministry of Education, GoI / CPWD)
2. **Harmonised Guidelines and Standards for Universal Accessibility in India, 2021** (MoHUA, GoI)
3. **Rights of Persons with Disabilities (RPwD) Act, 2016** (Sections 16, 17, 40, 44 & 45)
4. **RPwD Rules, 2017** (Mandatory standard enforcement)
5. **Right of Children to Free and Compulsory Education (RTE) Act, 2009** (Schedule norms for all-weather barrier-free school buildings)
6. **National Education Policy (NEP) 2020** (Section 6: Inclusion and Equity for CwSN)

---

## 5. Functional Requirements (FRs)

### FR 1: Core Architectural Topic Modules
The guide must feature four primary architectural modules essential for school accessibility:

```
┌────────────────────────────────────────────────────────────────────────┐
│                   FEATURE D: ARCHITECTURAL TOPICS                      │
├────────────────────┬────────────────────┬──────────────────────────────┤
│ 1. School Ramp &   │ 2. CwSN Accessible │ 3. Tactile Paving &  │ 4. Accessible │
│    Handrails       │    School Toilet   │    Guiding Pathways  │    Classrooms │
└────────────────────┴────────────────────┴──────────────────────────────┘
```

#### Module 1: Accessible School Ramp & Handrails (मानक विद्यालय रैंप एवं रेलिंग)
- **Statutory Standard:** *Accessibility Code 2024, Section 3.2* & *Harmonised Guidelines 2021, Clause 4.5*.
- **Mandatory Specifications:**
  - Gradient: 1:12 maximum slope ratio (8.33%). 1:15 or 1:20 recommended for long runs.
  - Clear Width: Minimum 1200 mm between inner handrail faces.
  - Dual Handrails: Continuous handrails on **both sides** mounted at 760 mm (children) and 900 mm (adults/older students).
  - Handrail Extensions: Minimum 300 mm parallel horizontal extension at top and bottom landings.
  - Landings: Level resting platforms of 1500 mm × 1500 mm minimum at top, bottom, and every 9 meters of linear run or change in direction.
  - Edge Protection: 100 mm raised curb along open sides to prevent wheelchair casters from slipping off.

#### Module 2: CwSN Accessible School Toilet (दिव्यांग सुलभ शौचालय)
- **Statutory Standard:** *Accessibility Code 2024, Section 5.1* & *Harmonised Guidelines 2021, Clause 5.3*.
- **Mandatory Specifications:**
  - Internal Dimensions: Minimum 2000 mm × 2200 mm (or 1750 mm × 2000 mm minimum clear turn area).
  - Door Opening: Minimum 900 mm clear outward-opening or sliding door with horizontal D-handle at 800 mm.
  - WC Seat Height: 450 mm to 480 mm from finished floor level.
  - Grab Bars: L-shaped wall grab bar (700 mm × 600 mm) on one side; fold-up hinged grab bar (800 mm) on transfer side.
  - Wash Basin: Mounted at 750 mm height with knee clearance of 650 mm depth; lever or sensor-operated faucet.
  - Emergency Alarm: Call cord or push-button placed at 100 mm above floor level and 900 mm for dual reachability.

#### Module 3: Tactile Paving & Guiding Pathways (स्पर्शनीय पेविंग एवं मार्गदर्शन मार्ग)
- **Statutory Standard:** *Harmonised Guidelines 2021, Clause 4.3 & 4.4* & *Accessibility Code 2024, Cl. 2.4*.
- **Mandatory Specifications:**
  - Guiding Tiles (Lineal Bars): Directional ribbed tiles indicating a clear, safe walking path.
  - Warning Tiles (Blister Domes): Truncated dome studs placed 300 mm before hazards (steps, ramps, road crossings, level drops).
  - Luminance Contrast: Minimum 30% visual contrast against surrounding flooring (bright yellow/deep charcoal).
  - Width: Minimum 300 mm to 600 mm continuous width along principal circulation paths connecting gate, classrooms, and toilets.

#### Module 4: Inclusive Classroom Layout & Circulation (समावेशी कक्षा एवं बैठक व्यवस्था)
- **Statutory Standard:** *Accessibility Code 2024, Section 4.2* & *Harmonised Guidelines 2021, Cl. 6.2*.
- **Mandatory Specifications:**
  - Aisle Width: Minimum 900 mm clear passage between desks; 1200 mm for main circulation routes.
  - Accessible Desk: Table height 750 mm with 680 mm minimum knee clearance height and 500 mm depth.
  - Wheelchair Station: 900 mm × 1400 mm clear floor area integrated in the main classroom seating (not isolated at back).
  - Black/White Board: Lower edge positioned at maximum 800 mm height from floor for seated viewing/writing.

---

### FR 2: Architectural Schematic Diagram Engine
- **Visual Rendering:** High-contrast, hardware-accelerated 2D vector schematics showing plan and elevation views.
- **Annotated Callouts:** Explicit dimension markers indicating standard heights, widths, and turning radiuses.
- **Color System:** Professional architectural palette (Navy, Slate, Teal, Goldenrod, Coral) adhering to WCAG 2.2 AA.
- **Semantic DOM & Accessibility:** Each schematic must contain:
  - `role="img"`
  - Exhaustive bilingual `aria-label` describing the drawing, its components, and exact numerical measurements.
  - Screen reader text block (`sr-only`) detailing the spatial layout for non-visual users.

---

### FR 3: "Sahi vs Galat" (Correct vs. Incorrect) Comparative Matrix
Each topic module must present side-by-side comparison cards illustrating common local shortcuts versus the correct standard:
- **Card Format:**
  - 🟢 **Correct Standard (सही मानक):** Illustrated compliant practice + statutory benefit.
  - 🔴 **Common Mistake (प्रचलित गलत निर्माण):** Specific faulty construction seen in Danapur schools.
  - ⚠️ **Impact & Safety Hazard (दुष्परिणाम व जोखिम):** Why the mistake harms children with disabilities.

---

### FR 4: Interactive Dimension & Slope Calculator (Ramp Tool)
- **Functionality:** Input the total rise (height of school verandah/plinth in inches or centimeters).
- **Output:**
  1. Minimum required ramp run length at 1:12 slope.
  2. Recommended ramp run length at 1:15 gentle slope.
  3. Minimum number of 1500x1500mm intermediate landings required (for every 9m run).
  4. Instant compliance alert: "Too steep" if gradient is less than 1:12.

---

### FR 5: Field Inspection Checklists & PDF Printable Export
- **Checklist:** Interactive checklist items with pass/fail toggles for on-site inspection.
- **Export Engine:** One-click generation of a print-ready, clean PDF formatted for field clipboards, containing:
  - School name, UDISE code, date, auditor name.
  - Technical tolerance thresholds (e.g. Slope: Pass ≤ 1:12, Fail > 1:12).
  - Sign-off block for School Headmaster and SMC Chair.

---

### FR 6: Bilingual Engine (Hindi + English)
- **Instant Toggle:** Header toggle changes language across the entire page without reloading or losing state.
- **Language Philosophy:**
  - Technical terms presented in colloquial Hindi followed by formal English terminology in parentheses (e.g., "समतल चबूतरा (Level Landing)").
  - No machine-translated robotic phrasing; natural, accessible terminology vetted by disability rights educators.

---

## 6. Technical Architecture & Data Model

### 6.1 Data Model (`learnTopics/{topicId}`)

```typescript
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
  id: string;                          // e.g. "guide-ramp"
  slug: string;                        // e.g. "accessible-school-ramp"
  title_hi: string;
  title_en: string;
  subtitle_hi: string;
  subtitle_en: string;
  officialStandard: string;            // e.g. "Accessibility Code for Educational Institutions, 2024"
  officialStandardClause: string;      // e.g. "Section 3.2 & Harmonised Guidelines Cl. 4.5"
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
```

### 6.2 Component Hierarchy

```
src/app/learn-accessibility/page.tsx (Page Shell & State Manager)
├── Header (Breadcrumbs, Title, Download CTA)
├── TopicSelectorTabs (Ramp, Toilet, Tactile, Classroom)
└── TopicDetailContainer
    ├── TopicHeader (Title, Subtitle, Official Standard Badge)
    ├── EasyExplanationCard (Callout summary in selected language)
    ├── ArchitecturalDiagramRenderer (SVG Schematics with Dimension Overlays)
    ├── KeySpecificationsTable (Parameter, Standard Value, Source Clause)
    ├── ComparisonMatrix ("Sahi vs Galat" Do's & Don'ts Cards)
    ├── InteractiveSlopeCalculator (For Ramp module)
    └── OnSiteAuditChecklist (Interactive checklist + Print CTA)
```

---

## 7. Digital Accessibility & WCAG 2.2 AA Compliance

1. **Contrast Ratio:** All text and critical diagram elements exceed a 4.5:1 contrast ratio against backgrounds; large headlines exceed 3:1. High contrast toggle enforces 7:1+.
2. **Color Independence:** Comparison cards use both icons (`CheckCircle2` vs `AlertTriangle`) and distinct badges, never color alone, to indicate compliance vs deficiency.
3. **Keyboard Operability:** All tab buttons, calculator inputs, and checklist toggles are fully navigable using `Tab`, `Space`, `Enter`, and arrow keys with visible focus rings.
4. **Text Scaling:** Supports dynamic text resizing (A / A+ / A++) without breaking diagram layout or truncating measurement callouts.
5. **Reduced Motion:** Respects `prefers-reduced-motion` media query by disabling animated transitions.

---

## 8. Rollout Plan & Milestones

| Milestone | Deliverables | Timeline |
|---|---|---|
| **Phase 1: Core Content & Schematics** | Ramp and Toilet modules live with 2D schematics, bilingual copy, and comparison cards | Week 1 |
| **Phase 2: Tactile & Classroom Modules** | Tactile pathway and inclusive classroom modules added with full standard clause citations | Week 2 |
| **Phase 3: Interactive Ramp Calculator** | Client-side rise/run gradient calculator and on-site checklist component | Week 3 |
| **Phase 4: Field Testing & PDF Export** | Field evaluation with Danapur SMC members; printable PDF generation | Week 4 |

---

## 9. Appendix: Official Source Clauses

- **Ramps:** *Accessibility Code for Educational Institutions, 2024*, Cl. 3.2; *Harmonised Guidelines 2021*, Cl. 4.5.
- **Toilets:** *Accessibility Code 2024*, Cl. 5.1; *Harmonised Guidelines 2021*, Cl. 5.3; *NBC 2016*, Vol 1, Part 3, Cl. 13.
- **Tactile Pathways:** *Harmonised Guidelines 2021*, Cl. 4.3, 4.4; *Accessibility Code 2024*, Cl. 2.4.
- **Classrooms:** *Accessibility Code 2024*, Cl. 4.2; *Harmonised Guidelines 2021*, Cl. 6.2; *RPwD Act 2016*, Section 16(i).
