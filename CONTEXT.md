# CONTEXT.md — Sugamya Shiksha Bihar

> **Last updated:** 2026-10-18 (Task 26 — Codebase Cleanup, Asset Optimization & Restructure — ALL TASKS COMPLETE)

## 1. Product Summary

**Sugamya Shiksha Bihar** ("Accessible Education Bihar") is a **Digital Accessibility Research & Resource Platform** for an NCPEDP Fellowship project studying physical infrastructure accessibility of schools in Danapur, Patna, Bihar. It is **not** a general NGO site; it is a research-driven platform with school audits, guidelines, community voices, and impact tracking.

The platform has **12 website sections** and **5 unique features (A–E)**.

### 12 Sections

| # | Section | Purpose |
|---|---------|---------|
| 1 | Home | Hero, CTA buttons, intro, objectives, stats (demo-labelled), awareness, latest activities |
| 2 | School Accessibility Directory | List of govt & private Danapur schools, audit status, facilities, findings |
| 3 | School Accessibility Audit | Digital checklist for ramp, doors, toilets, railings, classrooms, pathways, signage, water, exits |
| 4 | Laws, Policies & Guidelines | Library of RPwD Act, RTE Act, NEP 2020, Samagra Shiksha, Accessibility Code, etc. |
| 5 | Inclusive Education Hub | Reasonable accommodation, special educators, accessible learning, assistive tech |
| 6 | Research & Data Dashboard | Surveys, barriers, findings, graphs, reports |
| 7 | Interactive School Map | Leaflet map with audit-status markers and popups |
| 8 | Community Voices | Consent-gated stories from students, parents, teachers, advocates |
| 9 | Awareness & Advocacy | Social media campaign, posters, reels, videos, workshops |
| 10 | Resource & Download Centre | PDFs, survey forms, audit formats, RTI templates, checklists |
| 11 | Report an Accessibility Barrier | Public submission form → pending → admin-verified before public |
| 12 | About Researcher & Contact | Introduction, fellowship, methodology, objectives, collaborations, contact |

### 5 Unique Features

| ID | Feature | Key Points |
|----|---------|------------|
| A | Smart Accessibility Audit Tool | Mobile-first form; compares measurements against official standards; admin-only entry; standards are editable config, not hardcoded |
| B | Danapur School Accessibility Map | Interactive map; status: Audited / Pending / Follow-up Required; popup with facilities & school link |
| C | School Accessibility Scorecard | 100-point research score; transparent methodology; "not a government certification" notice; configurable category weights |
| D | Learn Accessibility — Visual Guide | Images + easy-Hindi explanations of correct ramp, toilet, tactile path, classroom; references to official standard |
| E | Before & After Accessibility Tracker | Per-school barrier → suggestion → improvement; photos, dates, verification status; only verified entries public |

### Firebase Services

| Service | Usage |
|---------|-------|
| Cloud Firestore | All data (schools, audits, standards, guidelines, community voices, barrier reports, etc.) |
| Firebase Auth | Email/password for Admin; Google OAuth strictly for Survey respondents |
| Firebase Storage | Photos, PDFs, resource files |
| Cloud Functions | Score calculation, deficiency comparison, submission handling, rate limiting |
| Firebase Hosting / App Hosting | Serves the Next.js app |
| Firebase App Check | Protects public submission endpoints |

### Data Model (Firestore collections)

- `schools/{schoolId}` — name, type, address, geo, udiseCode, auditStatus, score, scoreBreakdown, facilities, lastAuditDate, published
- `audits/{auditId}` — schoolId, auditorId, date, measurements, photos, deficiencies, status (draft|verified), notes
- `standards/{standardId}` — parameter, threshold/range, unit, sourceDocument, sourceClause
- `scoringConfig/{version}` — categories, weights, methodology text (hi/en)
- `guidelines/{guidelineId}` — title, slug, summaries (hi/en), provisions, relatedSections, checklist, officialUrl
- `learnTopics/{topicId}` — title, images, explanation (hi/en), standardReference
- `inclusiveEducation/{itemId}` — topic, content (hi/en)
- `surveys/{surveyId}` + `surveyResponses/{surveyId_uid}` — form definition & single-submission responses per Google user: surveyId, uid, email, name, phone, role, answers, consentGiven, consentAt, createdAt
- `barrierReports/{reportId}` — schoolId, description, photos, reporterContact (private), status (pending|verified|rejected)
- `communityVoices/{voiceId}` — role, story, consentRecorded, displayName/anonymous, published
- `trackerEntries/{entryId}` — schoolId, barrier, suggestion, beforePhoto, afterPhoto, dates, verificationStatus
- `campaignItems/{itemId}` — type, media, captionsUrl, date
- `resources/{resourceId}` — category, file, title (hi/en)
- `researchReports/{reportId}` — title, summary, fileUrl, date
- `siteContent/{key}` — home text, about, methodology, collaborations, contact
- `users/{uid}` — role (admin)

---

## 2. Decisions Log

| Decision | Value | ADR |
|----------|-------|-----|
| Frontend framework | Next.js (React) + Tailwind CSS | `docs/adr/0001-nextjs-tailwind-stack.md` |
| i18n approach | React Context with JSON message bundles (`en.json`, `hi.json`) & localStorage | `docs/adr/0002-i18n-approach.md` |
| Map library | Leaflet + OpenStreetMap (no API cost) | `docs/adr/0003-map-library.md` |
| Chart library | TBD (Recharts vs Chart.js) | `docs/adr/0004-chart-library.md` |
| Database | Cloud Firestore | PRD-mandated |
| Auth | Firebase Auth (email/password, admin only; Google OAuth for survey) | PRD-mandated |
| Security rules approach | Public read (published==true), public create (barrier reports), Google-authenticated survey responses, admin-only writes | `docs/adr/0005-security-rules.md` |
| Hosting | Firebase Hosting / App Hosting (SSR) | `docs/adr/0006-firebase-hosting.md` |
| Standards comparison & audit tool | Configurable Firestore standards, pure functional comparison module, draft/verified flow | `docs/adr/0007-standards-comparison-engine.md` |
| Scorecard methodology & 100-point scoring | 4 weighted pillars (30/30/25/15), 3 non-colour tiers, accessible scorecard, mandatory research notice | `docs/adr/0008-scorecard-methodology.md` |
| Barrier reporting & moderation | Privacy-isolated contact subcollection, 3-clause consent, pending->verified moderation | `docs/adr/0009-barrier-reporting-and-moderation.md` |
| Performance, caching & data-fetching | Next.js fonts, SSG guidelines, loading.tsx feedback, scoped AuthProvider, Promise.all & limits, sharp WebP | `docs/adr/0010-caching-and-performance-optimization.md` |
| Survey Google sign-in & respondent details | Scoped Google Auth, 1 response per survey (`surveyId_uid`), Indian mobile validation, DPDP Act 2023 compliance | `docs/adr/0011-survey-google-signin.md` |
| Modular Firebase split, deferred analytics, self-hosted fonts | Subpath modular Firebase imports, lazy Proxy Auth, deferred idle Analytics, zero-network next/font, optimized WebP/PNG assets | `docs/adr/0012-firebase-split-deferred-analytics-self-hosted-fonts.md` |
| Feature D Architectural Schematics & Reusable Shell | Extracted `SchematicShell.tsx`, Image 2 approved style across all 4 modules (Ramp, Toilet, Tactile, Classroom), legend fallback mode | `docs/adr/0013-feature-d-architectural-schematics-and-reusable-shell.md` |

---

## 3. Glossary

| Term | Meaning |
|------|---------|
| CwSN | Children with Special Needs |
| NCPEDP | National Centre for Promotion of Employment for Disabled People |
| RPwD Act | Rights of Persons with Disabilities Act, 2016 |
| RTE Act | Right of Children to Free and Compulsory Education Act, 2009 |
| NEP 2020 | National Education Policy 2020 |
| Samagra Shiksha | Government of India integrated school education scheme |
| UDISE Code | Unified District Information System for Education — unique school identifier |
| Audit Status | One of: `audited`, `pending`, `follow_up_required` |
| Research Score | 100-point score per school (NOT a government certification) |
| Verification Status | Content goes from `pending` → `verified` / `rejected` before becoming public |
| Accessibility Code | Accessibility Code for Educational Institutions, 2024 (Ministry of Education, GoI) |
| Harmonised Guidelines | Harmonised Guidelines and Standards for Universal Accessibility in India, 2021 |
| Danapur | Block/area in Patna district, Bihar — the first research area |
| Sugamya | Hindi: accessible / barrier-free |

---

## 4. Constraints

1. **Build ONLY what is in the PRD** — no extra features, pages, or content.
2. **Never invent legal/standards values** — all thresholds from official documents supplied by client.
3. **WCAG 2.2 AA target** for every page.
4. **Hindi and English everywhere** — language toggle on every page.
5. **Demo data always labelled** — "Illustrative demo data — not actual Danapur survey findings."
6. **Scores always labelled** as research scores, not government certification.
7. **Nothing unverified or non-consented is public.**
8. **No images of children's faces** unless explicit consent is recorded.
9. **Reporter contact details** never publicly readable.
10. **Standards as editable config** — not hardcoded.

---

## 5. Assumptions (pending client confirmation)

| # | Assumption | Status |
|---|-----------|--------|
| A1 | Audit parameters & thresholds (Q1) — confirmed from Accessibility Code 2024 & Harmonised Guidelines 2021 | ✅ Confirmed |
| A2 | Scorecard category weights (Q2) — confirmed via Grill with Docs: Entrance 30, Toilets 30, Classrooms 25, Safety 15 | ✅ Confirmed |
| A3 | Official links & PDFs (Q3) — will be verified before launch | ⏳ Pending |
| A4 | Easy-Hindi content author (Q4) — TBD | ⏳ Pending |
| A5 | Danapur school list with coordinates (Q5) — will be supplied | ⏳ Pending |
| A6 | Consent form wording (Q6) — will be supplied | ⏳ Pending |
| A7 | About page researcher text & contact details (Q7) — will be supplied | ⏳ Pending |

---

## 6. Pending Client Inputs

All items from Section 14 (Q1–Q7) of the PRD — see Assumptions table above.

---

## 7. Implementation Progress Log

- **Task 1 — Project Setup & Design Foundation**: ✅ **Completed**
  - Next.js 14 + Tailwind CSS initialized with TypeScript.
  - Palette design tokens defined (Navy `#0F2137`, Teal `#0D7A75`, Amber `#B45309`, Off-white `#F8F9FA`).
  - High contrast theme (black & yellow, 7:1+ contrast) & 3-step text scaling (A, A+, A++) with `localStorage` persistence.
  - Accessible base components created: `Button`, `Card`, `Input`/`Textarea`, `Badge`, `Modal`, `Tabs`.
  - Global accessible shell: `Header` with accessible toolbar, `Footer` with mandatory disclaimers and standards, `SkipLink`, and polite `LiveAnnouncer`.
  - Firebase client initialized with graceful fallback (`src/lib/firebase.ts`) and `.env.example`.
  - Automated WCAG 2.2 Level AA audit with `axe-core` & JSDOM passing with 0 violations (`npm run test:a11y`).

- **Task 2 — Home Page**: ✅ **Completed**
  - Memorable hero with exact Hindi headline: *"हर बच्चे के लिए सुगम विद्यालय, हर बच्चे के लिए समान शिक्षा।"* and English sub-line.
  - Four primary action buttons: *Explore School Accessibility*, *Read Guidelines*, *Participate in Survey*, *View Research Findings*.
  - Project introduction and 4 key research objectives.
  - Danapur Survey Snapshot stats (05 Surveyed, 03 Govt, 02 Private, 60% sample score) with prominent `"Illustrative demo data — not actual Danapur survey findings."` label.
  - Awareness Campaign block (posters & reels, workshop, video explainer) and latest activities list.
  - Firestore `siteContent/home` integration with fallback.

- **Task 3 — Guidelines Library**: ✅ **Completed**
  - Prominent visual treatment of the **Accessibility Code for Educational Institutions, 2024** as primary technical reference.
  - Guidelines directory listing all 9 PRD guidelines with search/filter.
  - Important Official Sources block citing MoE, DEPwD, and UNICEF India documents with external links.
  - Dynamic guideline detail page template (`/guidelines/[slug]`) featuring easy-Hindi explanation, main provisions tabs, interactive school compliance checklist, related sections, and official portal links.
  - Firestore seed script (`scripts/seed-firestore.mjs`) and structured guideline dataset (`src/data/guidelinesData.ts`) without invented clause numbers.

- **Task 4 — About Researcher & Contact**: ✅ **Completed**
  - About Researcher page (`/about`) built reusing Task 1 accessible UI components (`Card`, `Input`, `Textarea`, `Button`, `Badge`).
  - Researcher introduction, NCPEDP fellowship details, research methodology, objectives, and collaborations read from Firestore `siteContent/about` with placeholder seed fallbacks.
  - Accessible contact form with strict validation, error alerts, live polite announcements, accessible spam verification (dynamic math question + bot honeypot), saving submissions to Firestore `contactSubmissions`.
  - Zero new dependencies added; full keyboard and screen reader accessibility verified.

- **Task 5 — Admin Authentication & Admin Panel**: ✅ **Completed (Phase 1 Complete!)**
  - Firebase Auth email/password login restricted to admin at `/admin/login`. Public visitors never log in.
  - Role-protected administrative dashboard at `/admin` (checks `users/{uid}` role == "admin" and provides session management).
  - Admin CRUD screens for Guidelines (editing titles, summaries, easy explanations) and Site Content (`siteContent/home` and `siteContent/about`) with instant save to Firestore.
  - Received inquiries viewer (`contactSubmissions`) with private data access for admins only.
  - Layered Firestore and Storage Security Rules (`firestore.rules`, `storage.rules`) matching PRD 11.3 & ADR 0005.
  - Automated TDD security rules test harness (`scripts/test-rules.mjs`): 18/18 invariant tests passing.
  - Full keyboard accessibility, modal focus trapping, and ARIA landmarks verified.

- **Task 6 — School Accessibility Directory & Detail Pages**: ✅ **Completed**
  - **Public School Directory** (`/schools`): Filterable (government/private, audit status), searchable (name, address, UDISE), responsive grid of school cards with non-colour-only status badges (icon + text + shape), score display, and facilities checklist strip.
  - **School Detail Page** (`/schools/[id]`): Dynamic route showing school header (name, address, type/status badges, UDISE, block, coordinates, last audit date), accessibility scorecard with SVG donut chart and 4-category progress bars, full 6-item facilities checklist with ✓/✕ text indicators, and verified field audit findings as a numbered list with research disclaimer.
  - **Admin CRUD for Schools** (new "Schools" tab in `/admin`): Add, edit, and delete schools with full form including names (hi/en), addresses (hi/en), latitude/longitude, block, UDISE, type, audit status, score, last audit date, 6 facilities checkboxes, published toggle, demo flag, and findings text (hi/en). Saves to Firestore `schools` collection. Delete confirmation prompt.
  - **Security**: Public directory only shows `published === true` schools. Admin can see all (including unpublished). Existing Firestore rules already enforce `isVerified(resource) || isAdmin()` for reads and `isAdmin()` for writes.
  - **Demo Seed Data**: 5 clearly labelled Danapur schools (3 govt + 2 private; audited/pending/follow-up; 1 unpublished), with detailed Hindi and English findings.
  - **WCAG 2.2 AA**: Status badges use icon + text + shape (not colour alone per 1.4.1). Score bars use `role="progressbar"` with `aria-valuenow/min/max/label`. All interactive elements have visible focus indicators. All facilities have explicit "Available" / "Not Available" text labels.
  - Zero new dependencies. Build passes (`next build` — 0 errors, 0 type errors).

- **Task 7 — Survey Forms ("Participate in Survey")**: ✅ **Completed**
  - **Survey Data Model & Seed Schema (`src/data/surveyData.ts`)**: Defined `SurveyDefinition`, `SurveyQuestion`, `SurveyResponse`, and `DEFAULT_COMMUNITY_SURVEY` with 8 core accessibility questions (school name/type, ramp slope/handrails, CwSN toilet, classroom floor/doorways, drinking water tap height, observed barriers checklist, 1-5 rating, and qualitative suggestions) plus demo responses.
  - **Public Survey Page (`/survey`)**: Bilingual (Hindi/English) accessible form renderer adhering to WCAG 2.2 AA (fieldsets/legends for radio & checkboxes, `aria-describedby` linking helper/error text, error summary with anchor focus, visible keyboard focus indicators).
  - **Privacy & Research Ethics (PRD Section 10)**: Prominent privacy disclosure stating data is for fellowship research, personal identifiers are optional, default "Submit Anonymously" toggle enabled, and mandatory explicit consent checkbox required before submission.
  - **Validation & Rate Limiting**: Required field validation, number bounds checks, bot honeypot trap, sub-2s automated submission rejection, and 10-minute client-side submission rate limiting stored in `localStorage`. Responses saved to Firestore `surveyResponses` collection.
  - **Admin Survey Builder & Response Manager (`/admin` Surveys tab)**:
    - Survey schema controls: edit title/description/published status, add new question, edit question, delete question, and move questions up/down. Supports `radio`, `checkbox`, `text`, `textarea`, `number`, and `select` question types.
    - Responses viewer: analytics counters by respondent role (Student, Parent, Teacher, Advocate), responses list with answer previews, and full answer inspection modal.
    - Export tools: One-click export to **CSV** (RFC 4180 compliant with UTF-8 BOM for seamless Microsoft Excel & Google Sheets rendering of Hindi characters) and **JSON** format.
  - **Security Rules (`firestore.rules` & `scripts/test-rules.mjs`)**: Enforced published-only read on `surveys`, public create with `consentGiven == true` on `surveyResponses`, and strictly private admin read/write on responses. 25/25 automated rules tests passing.
  - **Verification**: `next build` passes with 0 errors (10 static/dynamic routes), `npm run test:a11y` passes with 0 violations, and zero new dependencies added.

- **Task 8 — Research Updates, Resource & Download Centre, Inclusive Education Hub, Learn Accessibility**: ✅ **Completed**
  - **Learn Accessibility — Visual Guide (`/learn-accessibility`)**:
    - Built using **Impeccable** design principles: image-led, high-contrast, easy-to-read bilingual typography, and clean spatial layout.
    - 4 core architectural features: **Ramp**, **Accessible Toilet**, **Tactile Path (TGSI)**, and **Classroom**.
    - For each feature:
      - Crisp SVG architectural schematics (`src/components/visual-guide/ArchitecturalDiagrams.tsx`) with accessible alt-text and labels (`RampDiagram`, `ToiletDiagram`, `TactileDiagram`, `ClassroomDiagram`).
      - Mandatory statutory standard references strictly cited from the **Accessibility Code for Educational Institutions 2024** and **Harmonised Guidelines 2021** (zero invented values).
      - Easy-Hindi explanations paired with English context.
      - Key technical specification tables with exact thresholds and reference clauses.
      - Side-by-side Do's vs Don'ts visual comparison cards (Compliant practice vs common hazard & accessibility rationale).
      - School inspection checklist simulator.
  - **Inclusive Education Hub (`/inclusive-education`)**:
    - Deep dives for all 5 core pillars: *Inclusive Education Foundations*, *Reasonable Accommodation*, *Special Educators*, *Accessible Learning Materials (TLM)*, and *Assistive Technology*.
    - Mapped to Section 16 & 17 of RPwD Act 2016, NEP 2020 Chapter 6, and Supreme Court 2021 guidelines (*Rajneesh Kumar Pandey vs Union of India*).
    - Practical school and SMC action steps with official portal links.
    - Synchronized with Firestore `inclusiveEducation` collection with offline seed fallback.
  - **Resource & Download Centre (`/resources`)**:
    - Complete support for all 6 PRD categories: *PDF guidelines*, *survey forms*, *school audit formats*, *RTI templates*, *checklists*, and *awareness materials*.
    - Searchable by title, description, or issuing organization with instant category filter chips.
    - Resource item cards displaying file type (PDF/DOCX/XLSX/ZIP), file size, download counter, and direct file download trigger.
    - Synchronized with Firestore `resources` collection with initial dataset of 12 verified resources.
  - **Danapur Fellowship Research Updates List**:
    - Integrated tab/section in `/resources` highlighting interim field research notes, working papers, and case studies from Danapur school visits.
    - Structured dataset (`src/data/researchUpdatesData.ts`) and Firestore `researchReports` collection.
  - **Admin Panel Management (`/admin` "Resources & Hub" tab)**:
    - Dedicated management interface (`src/components/admin/ResourcesHubTab.tsx`) with 3 sub-tabs:
      - *Resources*: CRUD interface, direct file upload to Firebase Storage (`resources/*`) or external URL, metadata form, and published toggle.
      - *Inclusive Hub*: Editor for all 5 pillars (taglines, summaries, detailed content, statutory citations).
      - *Research Updates*: Add/edit/delete working papers and field notes.
  - **Security Rules & Automated TDD**:
    - Updated `firestore.rules` and `storage.rules` to enforce public-read on published resources and research reports, public-read on inclusive hub topics, and strictly admin-only writes.
    - Automated rules test suite (`scripts/test-rules.mjs`): 33/33 tests passing.
  - **Verification**:
    - `next build`: 0 errors across all 13 routes (10 static + 3 dynamic).
    - `npm run test:a11y`: 0 violations (WCAG 2.2 AA compliant).
    - Zero new dependencies added.

- **Task 9 — Smart Accessibility Audit Tool & Standards Comparison**: ✅ **Completed**
  - **Grill with Docs Confirmation**:
    - Confirmed parameters, units, and statutory thresholds across all 9 architectural categories in 2 batches against the *Accessibility Code for Educational Institutions 2024* and *Harmonised Guidelines 2021*. Resolved Open Question Q1 and updated Assumption A1.
  - **TDD Comparison Logic (`src/lib/auditComparison.ts` & `scripts/test-audit-comparison.mjs`)**:
    - Followed strict Red-Green TDD methodology.
    - Built pure functional seam `compareAuditAgainstStandards(measurements, standards)` evaluating numeric measurements, presence booleans, and door swing safety.
    - Generates granular deficiency flags (`DeficiencyFlag`) complete with severity level, exact statutory document, and clause citations.
    - Automated TDD test suite: **8/8 tests passing**.
  - **Admin-Editable Standards Configuration (`standards` collection)**:
    - Structured schema ([standardsData.ts](file:///c:/Users/adity/OneDrive/Desktop/Sugamya%20Shiksha%20Bihar/src/data/standardsData.ts)) and dedicated management UI ([StandardsConfigTab.tsx](file:///c:/Users/adity/OneDrive/Desktop/Sugamya%20Shiksha%20Bihar/src/components/admin/StandardsConfigTab.tsx)).
    - Allows admins to edit thresholds, units, operators, and reference clauses directly in Firestore without hardcoded memory assumptions or code rebuilds.
  - **Mobile-First Smart Audit Tool UI ([AuditToolForm.tsx](file:///c:/Users/adity/OneDrive/Desktop/Sugamya%20Shiksha%20Bihar/src/components/admin/AuditToolForm.tsx))**:
    - Built using **Impeccable** design principles: large touch targets ($\ge 48\text{ px}$) tailored for standing in schoolyards, single-column responsive layout, and quick 9-section stepper jump bar.
    - Real-time live deficiency feedback badge displayed instantly as measurements are entered.
    - Integrated camera capture / photo upload per section (saved to Firebase Storage `audits/{auditId}/*`).
  - **Draft -> Verified Workflow**:
    - Audits start as `draft` (strictly private to admin) and can be toggled to `verified`.
    - Only `verified` audits update public school profiles (auto-updating `auditStatus`, `score`, and verified `facilities`).
  - **Dedicated Mobile Route & Admin Integration**:
    - Created `/admin/audit` for direct mobile field access.
    - Integrated "Audit Tool & Standards" tab in main `/admin` portal ([AuditsAdminTab.tsx](file:///c:/Users/adity/OneDrive/Desktop/Sugamya%20Shiksha%20Bihar/src/components/admin/AuditsAdminTab.tsx)) with audits history and view modal.
  - **Architecture Decision Record**:
    - Recorded `docs/adr/0007-standards-comparison-engine.md`.

- **Task 10 — School Accessibility Scorecard & 100-Point Weighted Scoring Engine**: ✅ **Completed**
  - **Grill with Docs Confirmation**:
    - Confirmed category weights across 4 core architectural pillars: Entrance & Ramps (30 pts), Toilets & Water (30 pts), Classrooms & Desks (25 pts), and Signage & Emergency Safety (15 pts) for a 100-point total scale.
    - Confirmed mathematical scoring formula: $\text{Category Score} = (\text{Compliant} / \text{Evaluated}) \times \text{Weight}$, $\text{Overall Score} = \sum \text{Category Scores}$.
    - Confirmed 3-tier benchmarks: 80–100 High Accessibility (`✓`), 50–79 Moderate Accessibility (`▲`), 0–49 High Barriers (`✕`).
    - Resolved Open Question Q2 and updated Assumption A2 to ✅ Confirmed.
  - **Matt Pocock TDD Test Suite (`scripts/test-scorecard.mjs` & `src/lib/scorecardCalculator.ts`)**:
    - Built pure functional seam `calculateScorecard(measurements, standards, scoringConfig)`.
    - Automated unit test suite: **6/6 tests passing** covering 100% compliant audits, all-failing audits, partial proportional scoring, dynamic admin-configured weights, boundary tier thresholds, and bilingual disclaimers.
  - **Impeccable Accessible Scorecard UI (`src/components/schools/SchoolScorecard.tsx`)**:
    - WCAG 1.4.1 non-colour-only compliant: scores combine numeric fractions, percentages, geometric status symbols (`✓`, `▲`, `✕`), and semantic tier badges.
    - Responsive SVG donut chart visual meter.
    - 4 architectural category progress bars with `role="progressbar"`, aria bounds, and live compliant/evaluated indicator counts.
    - Prominent academic research disclaimer rendered on the school page, school directory cards, and methodology view.
  - **Visible Methodology View (`src/components/schools/ScorecardMethodologyModal.tsx`)**:
    - Keyboard-navigable accessible modal with focus trap explaining calculation mathematics, pillar weights, tier thresholds, and statutory citations (*Accessibility Code 2024*, *Harmonised Guidelines 2021*, *RPwD Act 2016*).
  - **Admin Scoring Config Manager (`src/components/admin/ScoringConfigTab.tsx`)**:
    - Integrated into `/admin` ("Smart Audit Tool & Standards" -> "Scoring Config" sub-tab).
    - Admins can modify category weights with real-time balance validation (enforcing 100-pt sum), edit bilingual names/descriptions, and customize research disclaimers in Firestore `scoringConfig/v1`.
  - **Architecture Decision Record**:
    - Recorded `docs/adr/0008-scorecard-methodology.md`.
  - **Verification**:
    - `next build`: 0 errors across all 14 routes.
    - `npm run test:a11y`: 0 violations (WCAG 2.2 AA compliant).
    - `test-rules.mjs`: 33/33 tests passing.
    - Zero new dependencies added.

- **Task 11 — Interactive Map of Danapur Schools**: ✅ **Completed**
  - **Leaflet + OpenStreetMap Engine (`src/components/map/DanapurSchoolsMap.tsx`)**:
    - Built using **Impeccable** design principles: interactive OpenStreetMap layer centered on Danapur, Patna cluster (`lat: 25.626, lng: 85.044`, zoom 13).
    - Client-side dynamic loading with SSR safety via `next/dynamic` (`ssr: false`) and Leaflet CSS integration in `src/app/globals.css`.
  - **WCAG 1.4.1 Non-Colour-Only Markers**:
    - Markers distinguish status by geometric shape + distinct symbol + label, not color alone:
      - *Audited*: Teal/Emerald circle with checkmark (`✓`) icon.
      - *Follow-up Required*: Amber diamond (`rotate-45`) with warning triangle (`▲`) icon.
      - *Pending*: Slate rounded square with hourglass (`⏳`) icon.
    - Custom styled CSS pin wrappers with subtle hover elevation and pulse indicators.
  - **Rich Accessible Popups**:
    - School name (bilingual hi/en) and UDISE code.
    - Status badge and 100-point research scorecard preview.
    - 6-item verified facilities checklist with explicit text labels ("उपलब्ध" / "नहीं है").
    - Direct keyboard-accessible CTA link to the school detail page (`/schools/[id]`).
  - **Interactive Map Controls & Search/Filter Toolbar**:
    - Dynamic text search (school name, address, UDISE).
    - School type filter (All, Government, Private).
    - Audit status filter (All, Audited, Pending, Follow-up Required).
    - Facility checklist filter (filter schools offering Ramp, CwSN Toilet, Tactile Path, etc.).
    - Quick actions: "Reset to Danapur Center", Zoom In/Out, results counter, and collapsible accessible map legend.
  - **Keyboard-Accessible List Alternative (`src/components/map/SchoolMapListAlternative.tsx`)**:
    - WCAG 2.2 AA compliant HTML `<article>` list cards specifically engineered for screen reader and keyboard-only navigation.
    - Exposes complete school profile data, GPS coordinates, facilities status list, and "Show on Map" focus trigger without requiring canvas pointer interaction.
  - **Dedicated Map Page & View Modes (`src/app/map/page.tsx`)**:
    - Responsive view switcher: *Map View*, *Accessible List*, and desktop side-by-side *Split View*.
    - Prominent academic research disclaimer and demo notice ("Illustrative demo data — not actual Danapur survey findings").
    - Main navigation link added to Header (`/map`) and directory page toggle (`/schools`).
  - **Verification**:
    - `next build`: 0 errors across all 15 routes (including static prerendering of `/map`).
    - `npm run test:a11y`: 0 violations (WCAG 2.2 AA compliant).
    - `test-scorecard.mjs`: 6/6 tests passing.
    - `test-audit-comparison.mjs`: 8/8 tests passing.
    - `test-rules.mjs`: 33/33 tests passing.

- **Task 13 — Report an Accessibility Barrier**: ✅ **Completed**
  - **Grill with Docs Confirmation**:
    - Confirmed strict 3-clause consent: (1) NCPEDP fellowship academic research usage, (2) Child protection / no unconsented identifiable faces, (3) Moderation & pending verification before publication.
    - Confirmed reporter contact handling: strictly optional, stored in isolated private sub-document, accessible only to admin for verification, and never published.
    - Confirmed 3-state moderation workflow: `pending` (initial on submit) -> Admin reviews and verifies to `verified` (publicly displayed) or `rejected` (internal reason note).
  - **Matt Pocock TDD Validation Seam (`src/lib/barrierReportValidation.ts` & `scripts/test-barrier-validation.mjs`)**:
    - Built pure functional validation seam `validateBarrierReport(input)`.
    - Automated unit test suite: **12/12 tests passing** covering 3-clause consent, school name presence, description length ($\ge 15$ chars), optional phone/email formatting, honeypot spam detection, sub-2s timing rejection, 5MB photo limit, and strict type-level isolation of reporter contact.
  - **Security Rules & Automated Invariants (`firestore.rules` & `scripts/test-rules.mjs`)**:
    - Enforced public create with `status == "pending"`.
    - Protected reporter contact details by housing them in `barrierReports/{reportId}/private/contact` where only admins have read access.
    - Restricted update and delete operations strictly to authenticated administrators.
    - Automated security rules test suite: **38/38 tests passing**.
  - **Impeccable Public Submission Form (`src/components/barriers/ReportBarrierForm.tsx` & `/report-barrier`)**:
    - School selector with dropdown of published Danapur schools + free-text option for unlisted schools.
    - 9 barrier categories with accessible icons.
    - Description field with live character count indicator.
    - Evidence photo uploader with client-side staging, image previews, 5MB size limit check, and prominent Child Privacy caution banner.
    - Optional & strictly private reporter contact section with role selector and confidentiality guarantees.
    - Client-side 3-minute submission rate limiting and anti-spam honeypot.
    - Accessible success state displaying unique reference ID and pending verification notice.
  - **Verified Community Reports Display (`src/components/barriers/VerifiedBarriersList.tsx`)**:
    - Public tab displaying verified reports filtered by category.
    - Includes photo lightbox, researcher inspection notes, and zero reporter contact leakage.
  - **Admin Moderation Interface (`src/components/admin/BarrierReportsAdminTab.tsx`)**:
    - Integrated into `/admin` ("Barrier Reports" tab).
    - Status filtering: All, Pending, Verified, Rejected with live counter badges.
    - Detail inspection modal displaying private reporter contact information (admin-only).
    - Verification modal allowing admins to approve reports with optional public observation notes.
    - Rejection modal prompting for internal rejection reasons.
  - **Architecture Decision Record**:
    - Recorded `docs/adr/0009-barrier-reporting-and-moderation.md`.
  - **Verification**:
    - `next build`: 0 errors across all 16 routes (including `/report-barrier`).
    - `npm run test:a11y`: 0 violations (WCAG 2.2 AA compliant).
    - `test-barrier-validation.mjs`: 12/12 tests passing.
    - `test-rules.mjs`: 38/38 tests passing.

- **Task 14 — Community Voices + Awareness & Advocacy**: ✅ **Completed**
  - **Grill with Docs Confirmation**:
    - Confirmed dual entry model: public submission with consent gating + admin direct logging of field interviews with recorded consent metadata (type, date, guardian info).
    - Confirmed anonymity & child visual rules: role badge (`कक्षा 8 का छात्र`, `अभिभावक`) with avatar icon; real names redacted; no child facial photos without explicit guardian consent (symbolic/architectural representation used).
    - Confirmed advocacy formats: full multi-format support (posters, reels, captioned videos with transcripts, and SMC workshop/mobilisation recaps).
  - **Community Voices Public Hub (`/community-voices` & `src/components/voices/SubmitStoryModal.tsx`)**:
    - Impeccable design: role filter chips (Students, Parents, Teachers, Advocates) with live counts.
    - Story cards with pull quotes, theme badges, school attribution, anonymity indicators, and consent verified stamps.
    - Accessible public submission modal with role picker, anonymity toggle, minor guardian verification, and mandatory consent checkboxes. Submissions held in pending unapproved state until admin verification.
    - Strict child protection guarantee: zero unconsented facial photographs of minors.
  - **Awareness & Advocacy Hub (`/awareness-advocacy`)**:
    - Multi-channel campaign gallery covering 5 formats: Posters, Reels/Shorts, Video Explainers, Workshops, and Community Mobilisation.
    - Accessible video player with bilingual WebVTT caption tracks (`<track kind="subtitles">`) and interactive collapsible transcript accordion.
    - High-resolution poster gallery with direct download links.
    - Detailed event recaps for Danapur SMC workshops and citizen mobilisation rallies.
  - **Ponytail Admin Management (`src/components/admin/CommunityVoicesAdvocacyTab.tsx`)**:
    - Minimal, concise administrative interface integrated into `/admin` ("Voices & Campaign" tab).
    - Dual sub-tab switcher: Community Voices manager and Awareness Campaign manager.
    - One-click publish/unpublish toggles with statutory consent guardrails (strictly blocking publication if `consentRecorded !== true`).
    - Quick add/edit modals and delete actions for stories and campaign assets.
  - **Security Rules & Policy Testing (`firestore.rules` & `scripts/test-rules.mjs`)**:
    - Enforced public read-only on verified & consented community voices (`published == true && consentRecorded == true`).
    - Allowed public submission only when `consentRecorded == true` and `published == false`.
    - Protected campaign items with public read-only on published items and strictly admin writes.
    - Automated rules test suite: **47/47 tests passing**.
  - **Verification**:
    - `next build`: 0 errors across all 18 routes (including static prerendering of `/community-voices` and `/awareness-advocacy`).
    - `npm run test:a11y`: 0 violations (WCAG 2.2 AA compliant).
    - `test-rules.mjs`: 47/47 tests passing.
    - `test-barrier-validation.mjs`: 12/12 tests passing.

- **Task 15 — Before & After Accessibility Tracker + School Recommendations + Reports**: ✅ **Completed**
  - **Feature E: Before & After Accessibility Tracker (PRD 6.2-E & `src/data/trackerData.ts`)**:
    - Data models & types: `TrackerEntry`, `TrackerPhoto`, `TrackerStage` (`barrier_identified` | `suggestion_given` | `improvement_verified`), `SchoolRecommendation`, `DownloadableReport`.
    - Verification state invariant: Only verified entries (`verificationStatus === "verified"`) are public per PRD 6.2-E. Draft and pending entries are strictly admin-only.
  - **Impeccable Visual Tracker Component (`src/components/tracker/BeforeAfterTracker.tsx` & `/tracker`)**:
    - 3-stage journey stepper: Barrier Identified (date, description, field audit tag) $\rightarrow$ Technical Suggestion (date, engineering remedy, statutory standard reference citation) $\rightarrow$ Verified Improvement (date, remediation narrative, official fellowship verification seal).
    - High-contrast photo evidence comparator: side-by-side split view, before-only view, after-only view, and photo lightbox modal.
    - Category filtering: Ramp, Accessible Toilet, Main Entrance, Drinking Water, Classroom Threshold, Pedestrian Pathway.
    - School selector dropdown and direct links to school scorecards.
  - **School Recommendations Linked to Audit Findings (`src/components/schools/SchoolRecommendations.tsx`)**:
    - Integrated on `/schools/[id]`: dynamic recommendations mapped directly to on-site audit findings.
    - 3-tier priority categorization: Critical (🔴), High (🟠), Medium (🟡) with non-colour icons and text.
    - Cost tier classifications: Low-Cost (₹0–₹2,000 SMC level), Medium-Cost (₹2,000–₹10,000), Structural (Civil works).
    - Responsible action parties: SMC, Headmaster, Education Department / BEO Danapur.
    - Strict statutory clause citations: *Accessibility Code for Educational Institutions 2024 (Clause 4.2)* and *Harmonised Guidelines 2021 (Clause 7.2)*.
  - **Downloadable Research & School Audit Reports (`src/app/reports/page.tsx`)**:
    - Comprehensive listing covering school audit PDF reports, Danapur interim fellowship study, SMC low-cost rectification guide, and the 2024 Accessibility Code quick matrix.
    - Search by keyword and category filtering.
    - Format and file size badges (PDF, 2.4 MB), live download counters, and citation guide.
  - **Admin Create/Edit/Verify Flow (`src/components/admin/TrackerAdminTab.tsx`)**:
    - Integrated into `/admin` ("Before/After Tracker" tab).
    - Status filtering: All, Verified (Public), Pending (Draft).
    - One-click verify/unverify toggle (`pending` $\leftrightarrow$ `verified`).
    - Full entry creation and editing modal with school picker, dual-language barrier/suggestion/improvement fields, before/after photos, dates, stage selector, and delete confirmation.
  - **Security Rules Invariants (`firestore.rules` & `scripts/test-rules.mjs`)**:
    - Enforced `isVerified` helper to support `res.data.verificationStatus == "verified"` or `published == true`.
    - Denied public read on unverified or pending tracker entries.
    - Restricted all create/update/delete operations to authenticated admins.
    - Rules test suite expanded: **53/53 tests passing**.
  - **Verification**:
    - `next build`: 0 errors across all 20 routes (including static prerendering of `/tracker` and `/reports`).
    - `npm run test:a11y`: 0 violations (WCAG 2.2 AA compliant).
    - `test-rules.mjs`: 53/53 tests passing.
    - `test-scorecard.mjs`: 6/6 tests passing.
    - `test-audit-comparison.mjs`: 8/8 tests passing.
    - `test-barrier-validation.mjs`: 12/12 tests passing.

- **Task 16 — Polish, Final Review, Accessibility Testing & Acceptance Verification**: ✅ **Completed**
  - **Impeccable Design & Consistency Audit**:
    - Complete visual and interaction review across all 12 platform sections.
    - Verified strict adherence to palette tokens (Navy `#0F2137`, Teal `#0D7A75`, Amber `#B45309`, Off-white `#F8F9FA`).
    - High contrast black & yellow toggle (7:1+ contrast) and 3-step text-scaling toolbar (A, A+, A++) working globally.
    - Fixed dead `/dashboard` navigation links on homepage and footer by routing them to the comprehensive `/reports` hub.
    - Polished card spacing, responsive padding, and subtle micro-interactions across mobile and desktop breakpoints.
  - **WCAG 2.2 AA Compliance Audit**:
    - Automated axe-core + JSDOM testing: **0 violations** across all core component patterns (`npm run test:a11y`).
    - Keyboard-only navigation verified: full tab-order sequence, visible contrast-compliant focus indicators (`focus-visible:ring-2 focus-visible:ring-teal-600`), focus-trapping modals with `Escape` dismiss.
    - Screen reader compatibility: SkipLink (`#main-content`), ARIA landmarks (`<header>`, `<main>`, `<nav>`, `<footer>`), polite `LiveAnnouncer` for dynamic feedback, non-colour status indicators (WCAG 1.4.1).
  - **Bilingual & i18n Verification**:
    - Full coverage across Hindi and English on every page with active language toggle in global header.
    - Fixed hardcoded English strings in Footer (standards list and WCAG badge bilingualised).
    - Verified no untranslated text across all public routes.
  - **Security Rules Audit (PRD 11.3 & ADR 0005)**:
    - 53/53 automated invariant tests passing in `scripts/test-rules.mjs`.
    - Confirmed public read denied on unverified schools, draft audits, pending barrier reports, private contact details, survey responses, unconsented community voices, and pending tracker improvements.
  - **Demo Data & Research Score Disclaimers**:
    - Confirmed `"Illustrative demo data — not actual Danapur survey findings."` banner present across all pages rendering sample datasets (Homepage, School Directory, School Detail, Map, Tracker, Reports, Community Voices, Barrier Reports).
    - Confirmed mandatory research score notice (`"not a government certification"` / `"शोध मूल्यांकन, सरकारी प्रमाणन नहीं"`) carried on every score instance.
  - **Production Build & Firebase Deployment Configuration**:
    - Configured `firebase.json` with SPA routing rewrites, cache control headers for immutable assets, and Firestore/Storage rule targets.
    - Configured `.firebaserc` pointing to `sugamya-shiksha-bihar`.
    - Verified Next.js SSR build: **0 errors across all 20 routes** (`18 static + 2 dynamic`).
    - All test suites passing: `test-a11y.mjs` (0 violations), `test-rules.mjs` (53/53), `test-audit-comparison.mjs` (8/8), `test-scorecard.mjs` (6/6), `test-barrier-validation.mjs` (12/12).

- **Task 17 — Navigation & Data-Fetching Performance Optimization**: ✅ **Completed**
  - **Phase A — Diagnosis & Baseline Measurements (Production Build)**:
    - Diagnosed severe navigation freeze and slow click-to-content responsiveness.
    - Measured baseline BEFORE metrics on production server across 6 core routes (Scores: 60-62, FCP: 4.9s-5.4s, LCP: 8.0s-10.2s, TBT: 100ms-160ms).
    - Pinpointed key root causes:
      1. Render-blocking Google Fonts stylesheets (`@import` in `globals.css` + duplicate `<link>` in `layout.tsx`).
      2. Missing Next.js `loading.tsx` boundary & instant visual click feedback, causing perceived freeze while route chunks download.
      3. Global `<AuthProvider>` at RootLayout executing Firebase Auth iframe handshakes and Identity Toolkit network calls on all public pages.
      4. Client-side sequential waterfalls (e.g., `schools/[id]`) and unbounded collection queries lacking `limit()`.
      5. Uncompressed assets: 948 KB logo and 2.14 MB hero banner loading without native Next.js `sharp` optimization.
      6. Heavy admin tabs statically bundled on `/admin` and eager Analytics initialization.
  - **Phase B — Surgical Ponytail Fixes**:
    - Replaced external font stylesheets with self-hosted `next/font/google` (`Inter` and `Noto_Sans_Devanagari`) using `display: 'swap'` and CSS variables.
    - Implemented global accessible `loading.tsx` skeleton with `role="status"`, `aria-busy="true"`, and Navy/Teal palette, respecting `prefers-reduced-motion`.
    - Added instant click feedback and `prefetch={true}` in `Header.tsx` links (`navigatingTo` state + `aria-busy`).
    - Scoped `<AuthProvider>` strictly to `/admin` via `src/app/admin/layout.tsx`.
    - Converted `src/app/guidelines/[slug]/page.tsx` to Server Component with `generateStaticParams()` (all 9 guidelines pre-rendered via SSG).
    - Eliminated sequential waterfalls using `Promise.all()` in `schools/[id]` and added `limit(50)` bounds to all directory/map/community queries.
    - Created `firestore.indexes.json` with composite indexes and updated `firebase.json`.
    - Installed `sharp`, compressed logo from 948 KB to 16.9 KB, and converted hero banner to 204 KB WebP with responsive sizes.
    - Dynamically imported 5 heavy admin sub-tabs with `next/dynamic` (First Load JS dropped from 332 kB to 268 kB).
    - Deferred Firebase Analytics until first user interaction (scroll/click) and deferred Home dynamic Firestore query.
  - **Phase C — Verification & Standards Protection**:
    - Ran automated accessibility suite: **0 violations** (`npm run test:a11y`, WCAG 2.2 AA fully preserved).
    - Security rules integrity: **53/53 tests passing** (`scripts/test-rules.mjs`).
    - Core domain TDD suites: all tests passing (scorecard, audit comparison, barrier validation).
- **Task 18 — Survey Google Sign-In & Verified Respondent Details (Change Request)**: ✅ **Completed**
  - **Data Privacy & Statutory Compliance Notice (India's DPDP Act 2023)**:
    - Respondent details collected (Full Name, Contact Number, Email, Role) constitute Personal Data under the Digital Personal Data Protection Act, 2023 (DPDP).
    - An administrative "Delete Respondent Data" action is integrated into the admin dashboard to honor data erasure requests under DPDP Act 2023.
    - Research dashboards, charts, and public pages strictly consume aggregated, anonymized statistics.
  - **Scoped Authentication Architecture**:
    - Google Sign-In via Firebase Auth (`GoogleAuthProvider`) is restricted strictly to the survey submission pathway (`/survey`).
    - All other public website sections (Home, Guidelines, School Directory, Map, Reports, Resources) remain 100% login-free.
  - **One Response Per Account & Security Rules**:
    - Enforced document ID format: `surveyResponses/${surveyId}_${uid}`.
    - Users can read/edit only their own submission; public reads are completely blocked; only authorized admins can inspect identified responses and perform data erasure.
  - **Validation & ADR**:
    - Recorded in `docs/adr/0011-survey-google-signin.md`.
    - Unit tests in `scripts/test-survey-validation.mjs` (35/35 passing).

- **Task 19 — Bug Fix: Survey Responses Admin Panel Visibility**: ✅ **Completed**
  - **Phase A — Reproduction & Root Cause Diagnosis**:
    - Executed live diagnosis via `scripts/reproduce-survey-bug.mjs` connecting to Firebase project `sugamya-shiksha-bihar`.
    - Identified three compound root causes:
      1. *Security Rules Deadlock*: `isAdmin()` helper relied on `get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == "admin"`. When the admin document `users/{adminUid}` did not exist yet, accessing `.data.role` threw an evaluation error that defaulted to `permission-denied`. Additionally, `/users/{userId}` was not self-readable.
      2. *Silent Sequential Error Swallowing in Admin UI*: In `src/app/admin/page.tsx`, `fetchFirestoreData()` wrapped 6 queries (`siteContent`, `contactSubmissions`, `schools`, `surveys`, and `surveyResponses`) in a single `try...catch`. Any failure in an earlier query jumped to the catch block, aborting the rest and leaving `surveyResponses` as `DEMO_SURVEY_RESPONSES`.
      3. *Lack of Shared Constants & Schema Normalization*: Write path in `/survey` and read path in `/admin` used independent string literals, and legacy responses lacked Google-authenticated fields (`name`, `phone`, `email`, `role`), which caused inconsistent rendering.
  - **Phase B — Architectural & Surgical Fixes**:
    - *Shared Constants & Contract*: Created `src/data/surveyConstants.ts` exporting `SURVEY_COLLECTIONS`, `getSurveyResponseDocId()`, `SurveyResponseDoc`, and `normalizeSurveyResponse()` for unified normalization across both modern and legacy documents.
    - *Decoupled Admin Data Fetching*: Unbundled queries in `src/app/admin/page.tsx`. Added dedicated real-time `onSnapshot` listener for `surveyResponses` with automatic unsubscription on unmount, explicit error callback, accessible `role="alert"` with Retry button, and proper empty/loading states.
    - *Admin Query & Search Features*: Added search (name, email, phone, response ID), survey filter, role filter, sort by newest first in memory (protecting against missing field exclusions), pagination (limit 10 + Load More), and CSV/JSON export.
    - *Security Rules & Index Fixes*: Updated `firestore.rules` to include fallback admin emails (`aditya12@gmail.com`), `exists()` guard before checking role, and self-read permission on `/users/{userId}`. Deployed updated rules to Firebase and added composite index to `firestore.indexes.json`.
    - *Data Migration*: Created safe, non-destructive migration script `scripts/migrate-survey-responses.mjs` to normalize legacy responses without data loss.
  - **Phase C — Comprehensive Verification**:
    - TDD Query & Normalization test: 10/10 passing (`scripts/test-survey-admin-query.mjs`).
    - Security rules invariants: 62/62 passing (`scripts/test-rules.mjs`).
    - Automated WCAG 2.2 AA accessibility audit: 0 violations (`scripts/test-a11y.mjs`).
    - Full Next.js production build: 0 errors (`npm run build`, all 29 routes generated).

- **Task 20 — Hero Image Slider Integration**: ✅ **Completed**
  - **Asset Integration**:
    - Incorporated 3 panoramic assets without duplicating or regenerating images:
      1. `Hopeful Journey to School.webp` (Existing slide: school corridor with student navigating wheelchair ramp).
      2. `Accessible Campus Journey.png` (Slide 2: student in wheelchair on accessible ramp with tactile paving & stainless handrails).
      3. `Inclusive Riverside School at Sunrise.png` (Slide 3: wheelchair student and teacher overlooking Danapur riverside and Patna sunrise).
  - **Design & Motion Standards**:
    - Smooth 1000ms crossfade transition with subtle 6000ms cinematic Ken Burns drift (`scale-[1.025]` to `scale-100`).
    - Auto-rotation every 5.5s, automatically paused on user hover (`onMouseEnter`/`onMouseLeave`) and keyboard focus (`onFocus`/`onBlur`).
    - Added accessible pagination dots capsule with active expansion indicator (`w-6 sm:w-7 bg-[#078F8A]`) and `role="tablist"`.
    - Maintained soft sky-blue airy aesthetic with left atmospheric gradient ensuring WCAG AA contrast for headline and subtext.
    - Zero layout shifts (CLS = 0) with absolute fill positioning.
    - Full `prefers-reduced-motion` compliance via Tailwind's `motion-reduce:transition-none motion-reduce:transform-none`.
  - **Verification**:
    - Clean production build (`npm run build`: 29/29 routes generated).
    - Automated accessibility audit: 0 violations (`test-a11y.mjs`, WCAG 2.2 AA).

- **Task 21 — Lighthouse Mobile Performance Fixes & Panoramic Hero Carousel Expansion**: ✅ **Completed**
  - **Lighthouse Performance Optimizations (Mobile, Slow-4G Simulated)**:
    - *Modular Firebase Split*: Split Firebase imports into discrete subpaths (`@/lib/firebase/app`, `firestore`, `auth`, `storage`). Implemented lazy Proxy initialization for `auth` so importing or prefetching does not trigger Firebase Auth iframe or network queries.
    - *Deferred Client-Side Analytics*: Created `AnalyticsTracker` with dynamic imports, `isSupported()` check, and `requestIdleCallback` (3500ms timeout). Completely blocked on `/admin*` routes.
    - *Zero-Network Self-Hosted Fonts*: Migrated font loading to `next/font/google` for `Inter` and `Noto_Sans_Devanagari` with `display: "swap"`, eliminating all render-blocking network requests to `fonts.googleapis.com` and `fonts.gstatic.com`.
    - *Favicon & Asset Resolution*: Added `public/favicon.ico`, `src/app/favicon.ico`, `src/app/icon.png`, and `src/app/apple-icon.png` (resolving 404s to HTTP 200). Optimized header logo source and added `sizes="104px"`.
    - *Route Prefetch Guard*: Disabled prefetching on `/admin` and `/survey` links on public pages (`prefetch={false}`) to prevent premature execution of authentication bundles.
  - **Panoramic Hero Slider 3-Image Carousel**:
    - Incorporated `Hopeful Journey to School-opt.png` as a 3rd panoramic slide alongside `Campus Sunset Learning by the River.png` and `Inclusive School Pathway at Sunrise.png`.
    - Implemented a 4-item continuous track (`[Slide 1, Slide 2, Slide 3, Slide 1 clone]`) with hardware-accelerated CSS `translate3d`, `w-[400%]` track, and seamless snap-back on `transitionend`.
  - **Verification Results**:
    - Guidelines: Score 87 (was 88)
    - Schools: Score 80 (was 78)
    - Map: Score 81 (was 75)
    - Survey: Score 81 (was 58, +23 points!)
    - Home: Score 72 (was 47, +25 points!), TBT 120 ms (was 1520 ms)
    - Admin: TBT 10 ms (was 440 ms), JS First Load 262 KB (was 525 KB)
    - Automated accessibility audit: 0 violations (`scripts/test-a11y.mjs`, WCAG 2.2 AA).
    - Security rules invariants: 62/62 passing (`scripts/test-rules.mjs`).
    - Recorded in `docs/adr/0012-firebase-split-deferred-analytics-self-hosted-fonts.md`.
- **Task 22 — Feature D Architectural Schematics & Reusable SchematicShell**: ✅ **Completed**
  - **Reference-Image Section 1 Redesign (`RampDiagram` & `SchematicShell.tsx`)**:
    - Section title preserved as **1. Architectural Diagram & Key Dimensions** with accessible bilingual subtext.
    - Clean, professional, government/NGO-style educational design with a light-blue and white theme (zero dark blueprint clutter).
    - Focused **3D Campus Model View** (`/images/visual-guide/ramp-3d-model.jpg`) with direct interactive hotspots (redundant "Educational Infographic" and "Technical Schematic" tabs removed per design request).
    - All 8 key specifications prominently integrated: (1) Ramp slope: 1:12 maximum, (2) Clear width: 1200 mm minimum, (3) Lower handrail: 760 mm, (4) Upper handrail: 900 mm, (5) Handrail extension: 300 mm minimum, (6) Edge curb: 100 mm, (7) Landing: 1500 × 1500 mm minimum, and (8) Intermediate landing: every 9 m of ramp run or at a change of direction.
    - Interactive Hotspots (`①`–`⑧`) with simple, student-friendly English and Hindi explanations and official statutory clause citations.
    - Below the diagram: 3 clear explanatory cards (**Gentle Slope**, **Two Handrails**, **Level Resting Platforms**) with circular icons and student-friendly bilingual explanations.
    - Fullscreen enlargement modal for high-detail inspection by teachers, school heads, and auditors.
  - **Plan Views for Other Three Modules**:
    - *Module 2: CwSN Accessible School Toilet* (Top-down Plan View): 2000 × 2200 mm room, Ø 1500 mm turning circle, 900 mm outward door with D-handle at 800 mm, 450–480 mm WC seat, 700 × 600 mm L-shaped grab bar, 800 mm fold-up bar, 750 mm wash basin with 650 mm knee clearance, and dual emergency cords at 100 mm & 900 mm.
    - *Module 3: Tactile Paving & Guiding Pathways* (Top-down Plan View): Lineal bar guiding tiles (5 mm ht), blister dome warning tiles placed 300 mm before hazards, 30% minimum luminance contrast (bright yellow on charcoal), and continuous 300–600 mm path connecting gate to classrooms and toilets.
    - *Module 4: Inclusive Classroom Layout* (Top-down Plan View): 1200 mm main circulation aisle, 900 mm between desk rows, 750 mm high accessible desk with 680 mm knee clearance, 900 × 1400 mm wheelchair station integrated in front/middle seating cluster, 900 mm clear door with flush threshold (< 12 mm), and blackboard lower edge max 800 mm.
  - **Verification**:
    - `npx.cmd tsc --noEmit`: 0 errors.
    - `npm.cmd run test:a11y`: 0 violations (WCAG 2.2 AA compliant).
    - `node scripts/test-rules.mjs`: 62/62 security rules passing.
    - `npm.cmd run build`: 32/32 routes compiled successfully.
    - Documented in `docs/adr/0013-feature-d-architectural-schematics-and-reusable-shell.md`.

- **Task 23 — Redesign Accessible CwSN School Toilet Diagram (Reference Image Aligned)**: ✅ **Completed**
  - **Reference Image Architectural Alignment (`public/Accessible School Toilet Layout Diagram.png`)**:
    - Top-down architectural floor plan SVG built directly as sharp vector web elements (no flat background screenshots used).
    - Light blue/white website theme (`#F4FAFD`), thick dark slate structural masonry walls (`#1E293B`), and light grey tiled floor grid (`#F8FAFC` tiles with `#E2E8F0` grout).
    - Centered wheelchair turning circle (Ø 1500 mm) with dashed blue perimeter (`#0066FF`), soothing sky-blue translucent wash (`fillOpacity="0.08"`), and central blue ♿ accessibility icon badge.
    - Wash basin with knee recess at top wall (750 mm rim height, 650 mm knee recess, chrome mixer tap and drain).
    - Water closet (WC) toilet on upper-right with cistern tank, dual flush buttons, elongated ceramic bowl, seat (450–480 mm height), and water trap.
    - Dual grab bars: 700 × 600 mm L-shaped grab bar securely anchored on adjacent side wall, and 800 mm fold-up cantilever grab bar on open transfer side with 3D metallic amber gradient tubes.
    - High-visibility red emergency alarm on right wall with dual reach points at 900 mm (seated reach) and 100 mm (floor reach if a student slips).
    - Outward-opening door at bottom-left with clear 900 mm doorway opening, 90° outward swing trajectory arc in dashed sky blue, and horizontal D-handle at 800 mm.
    - Decorative indoor potted plants in top-left and bottom-right corners matching the reference illustration.
  - **All 9 Required Measurements Displayed with Crisp Blue Dimension Lines & White Pill Labels**:
    1. Room width: `2000 mm` (top horizontal arrow)
    2. Room depth: `2200 mm` (left vertical arrow)
    3. Clear turning circle: `Ø 1500 mm` (center horizontal arrow)
    4. Wash basin height: `750 mm` (vertical arrow at basin)
    5. WC seat height: `450–480 mm` (horizontal arrow across seat)
    6. L-shaped grab bar: `700 × 600 mm` (right wall leader line)
    7. Fold-up grab bar: `800 mm` (right wall leader line)
    8. Clear door opening: `900 mm` (bottom doorway opening arrow)
    9. Emergency alarm: `100 & 900 mm` (right wall dual-height bracket)
  - **Interactivity & Educational Features**:
    - *Active Specification Spotlight Card*: Displays the selected measurement with official statutory citations (Accessibility Code 2024 Cl. 5.1 & Harmonised Guidelines 2021 Cl. 5.3) and student-friendly bilingual English and Hindi explanations ("Why it matters" / "सरल हिंदी व्याख्या").
    - *All 9 Mandatory Technical Specifications Quick-Selector Grid*: Interactive buttons allowing users to click/inspect any of the 9 dimensions, instantly updating the spotlight card.
    - *Direct SVG Hotspot Interactivity*: Clicking any pill label or fixture inside the SVG selects that specification.
    - *Fullscreen Zoom Modal*: "Enlarge / ज़ूम देखें" trigger opens an expansive high-resolution modal with vector crispness and accessible close controls.
    - *Deep Linking*: Supported via `?topic=toilet`, `?tab=toilet`, or `#toilet`.
- **Task 25 — Redesign Inclusive Classroom Layout Diagram (Reference Image Aligned & Strict Text Rules)**: ✅ **Completed**
  - **Reference Image Alignment (`public/Accessible Classroom Floor Plan with Dimensions.png`)**:
    - Replaced the classroom diagram in `src/components/visual-guide/ArchitecturalDiagrams.tsx` (`ClassroomDiagram`) with a photorealistic 3D top-down architectural floor plan matching the supplied reference image.
    - Used the project's visual theme: light sky-blue background canvas (`#EBF3FC`), light grey tiled ceramic floor grid (`#F8FAFC`), thick 3D dark slate/navy wall caps (`#1E293B` / `#334155`), warm golden oak furniture (`#EEBC76`), and royal-blue dimension annotations (`#0066FF`).
    - Faithfully modeled all classroom elements:
      1. Rectangular 9000 mm × 7000 mm classroom with 3D walls and tiled flooring.
      2. Green teaching board (`#15803D`) mounted on the top teaching wall with warm oak wooden trim and chalk tray.
      3. Teacher's desk in front with laptop, pencil holder, potted plant, and ergonomic office chair.
      4. Six student seating stations in two rows: 5 double desks with contoured slate-blue chairs (`#475569`).
      5. One wheelchair-accessible station integrated in the front row: highlighted with a dashed royal-blue boundary (`stroke="#0066FF" strokeDasharray="9 7"`) and translucent blue fill (`#3B82F6` 16% opacity), containing a 3D top-down wheelchair with large side wheels, hand push rims, padded seat, and armrests.
      6. Ample 900 mm circulation space between desk rows.
      7. Outward-opening wooden door at bottom-left with visible 90° door-swing trajectory arc in dashed royal blue (`#0066FF`).
      8. Three-pane architectural window on right wall with natural sunlight cast across the floor, two wooden storage cabinets with potted plants, and an indoor plant by the entrance.
  - **Exact 7 Numerical Dimension Annotations (Royal-Blue Double-Headed Arrows & Clean White Pill Labels)**:
    1. Classroom length: `9000 mm` (top exterior horizontal line across walls)
    2. Classroom width: `7000 mm` (left exterior vertical line across walls)
    3. Wheelchair-accessible desk zone: `1400 mm` (top arrow spanning wheelchair zone)
    4. Wheelchair-accessible desk zone depth: `900 mm` (left arrow spanning wheelchair zone)
    5. Blackboard lower-edge height: `800 mm` (vertical arrow on right of board with leader line)
    6. Clear circulation width: `900 mm` (vertical arrow between desk rows with leader line)
    7. Door clear opening: `900 mm` (bottom arrow across doorway opening)
  - **Strict Text Restrictions Fully Respected**:
    - Strictly **zero** headings, titles, descriptions, legends, cards, or explanatory text inside or around the diagram graphic.
    - Strictly omitted text such as "Inclusive Classroom Layout & Circulation", "Accessible School Classroom", "Educational Infographic", "Teaching Wall", "Student Desk", "Teacher Desk", and all English/Hindi text descriptions.
    - Only the 7 numerical dimension labels are rendered visually.
    - Screen-reader accessibility preserved via hidden `<title>`, `<desc>`, and `aria-label` tags.
  - **Interactivity & Quality**:
    - Embedded inside a responsive card with subtle border and shadow.
    - Unobtrusive corner maximize button (`Maximize2` icon) opening a fullscreen zoom modal for high-resolution inspection.
  - **Verification & Compliance**:
    - `cmd /c npx tsc --noEmit`: 0 errors.
    - `cmd /c npm run test:a11y`: 0 violations (WCAG 2.2 Level AA).
    - `cmd /c node scripts/test-rules.mjs`: 62/62 security rules passing.
    - `cmd /c npm run build`: 32/32 routes compiled successfully.
    - Tested live on `http://localhost:3000/learn-accessibility?topic=classroom` with HTTP 200 OK.

- **Task 26 — Codebase Cleanup, Asset Optimization & Modular Restructure**: ✅ **Completed**
  - **Branch & Safety**: Executed systematically on branch `chore/cleanup` with full pre-cleanup backup at `..\Sugamya-Shiksha-Bihar-BACKUP`. Every step committed individually.
  - **Root Directory Sanitization**: Removed 14 stray Lighthouse `.report.html`/`.json` files, temporary benchmark metric files, and moved all PRD specifications into `docs/prd/`. Updated `.gitignore` to keep root clean.
  - **Media Deduplication & Next-Gen Compression**: Removed duplicate PNG diagrams in root `public/` (saving 11 MB; canonical versions in `public/images/visual-guide/`). Compressed hero images with Sharp to WebP (~230 KB) and optimized PNG fallbacks (~650 KB), saving ~3.9 MB in transfer payload.
  - **Diagram Decomposition**: Modularized monolithic `ArchitecturalDiagrams.tsx` (1,234 lines) into 4 dedicated components (`RampDiagram.tsx`, `ToiletDiagram.tsx`, `TactileDiagram.tsx`, `ClassroomDiagram.tsx`) and a 35-line dispatcher.
  - **Admin Dashboard Modularization**: Decomposed monolithic `src/app/admin/page.tsx` (2,559 lines) into 4 modular components (`SurveysAdminTab.tsx`, `GuidelinesAdminTab.tsx`, `SiteContentAdminTab.tsx`, `SchoolsAdminTab.tsx`), reducing `admin/page.tsx` to a clean 220-line orchestration shell with 100% on-demand dynamic loading. Reduced `/admin` route HTML by 42% (13.8 kB to 7.97 kB) and First Load JS by 23 kB (249 kB to 226 kB).
  - **Dependencies & Normalization**: Removed unused `tailwind-merge`, moved `@types/leaflet` to devDependencies, configured root `.eslintrc.json`, standardized Firebase exports on clean named exports, and added unified `npm test` and `npm run type-check` scripts to `package.json`.
  - **Verification & Invariants**:
    - `cmd /c npx tsc --noEmit`: 0 errors.
    - `cmd /c npm run lint`: 0 errors.
    - `cmd /c npm test`: All 133 tests passed across 7 test suites (A11y, Security Rules 62/62, Scorecard 6/6, Survey Validation 35/35, Survey Admin Query 10/10, Barrier Reports 12/12, Standards Comparison 8/8).
    - `cmd /c npm run build`: 32/32 static routes prerendered cleanly.
  - **Documented**:
    - Architectural Decision Record: [`docs/adr/0014-project-cleanup-and-restructure.md`](file:///c:/Users/adity/OneDrive/Desktop/Sugamya%20Shiksha%20Bihar/docs/adr/0014-project-cleanup-and-restructure.md)
    - Full Audit Report: [`docs/cleanup-report.md`](file:///c:/Users/adity/OneDrive/Desktop/Sugamya%20Shiksha%20Bihar/docs/cleanup-report.md)
    - Incremental Step Log: [`CLEANUP_CHANGELOG.md`](file:///c:/Users/adity/OneDrive/Desktop/Sugamya%20Shiksha%20Bihar/CLEANUP_CHANGELOG.md)


