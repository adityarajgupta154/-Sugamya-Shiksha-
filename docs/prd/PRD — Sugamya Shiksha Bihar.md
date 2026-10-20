# **PRD — Sugamya Shiksha Bihar** 

**Tagline:** Accessible Schools, Inclusive Futures **Project:** Digital Accessibility Research & Resource Platform for Sugamya Shiksha Bihar Research Project _"Understanding Physical Infrastructure Accessibility of Schools in Danapur, Patna & Inclusive Education"_ **Backend:** Firebase | **Status:** Draft v1 (built strictly from client requirements) 

## **0. Instructions for the implementing agent** 

1. Read this entire PRD first and summarise your understanding before writing code. 

2. Build only what is listed here. Do **not** add features, pages or content that are not in this PRD. If something is unclear, list it under "Open Questions" (Section 14) and ask. 

3. Work task by task (Section 12): finish and verify Task N before starting Task N+1. 

4. Items marked **[Impl. choice]** are technical decisions, not client features. They may be changed if a better option fits Firebase. 

5. Never invent legal/standards values (slope ratios, door widths, etc.). They must come from the official documents supplied by the client (see 6.2). 

## **1. Product Overview** 

Sugamya Shiksha Bihar is not a general NGO website. It is a **Digital Accessibility Research & Resource Platform** that brings together in one place: Research, School Accessibility Survey, Government Guidelines, Inclusive Education, Awareness Campaign, School Reports and Community Participation. 

The first research area is **Danapur, Patna** . The platform must be designed so that it can later be useful for schools in other districts of Bihar, and so that the project does not stay limited to a single report. 

**Website name (first preference):** Sugamya Shiksha Bihar. Alternative names (for reference only, not to be built): AccessEd Bihar, School Access Watch, Inclusive Danapur. 

## **2. Goals** 

- Present the research (data, findings, reports) in an easily understandable public form. 

- Provide a school accessibility directory, audit tool, map and scorecard for Danapur schools. 

- Provide a Guidelines Library with easy-Hindi explanations of laws, codes and policies. 

- Enable community participation (barrier reporting, community voices) with consent, privacy and verification. 

- Track real impact through a Before & After Accessibility Tracker. 

- Be itself an accessible website (target: WCAG 2.2 AA, verified through actual testing). 

## **3. Language, Design and Identity** 

- **Languages:** Hindi and English (language toggle on every page; all UI strings translatable). 

- **Colour palette:** Navy, Teal, Amber, Off-white. 

- **UI/UX direction:** clean, calm, high-trust, research-platform feel; large readable type, generous spacing, strong colour contrast, clear icons with text labels, card-based layouts, mobile-first. 

- • All UI must meet the accessibility requirements in Section 8. 

## **4. Users** 

|User|Needs|
|---|---|
|Public visitor (parents, teachers, students,<br>advocates, officials)|Browse research, schools, guidelines, resources;<br>report barriers; read community voices|
|Researcher / Admin (the client)|Enter and manage audits, schools, content,<br>reports; verify submissions before publication|



## **5. Homepage** 

**Hero message (Hindi):** "Har bachche ke liye sugam vidyalaya, har bachche ke liye samaan shiksha." **Subline (English):** _Researching School Accessibility and Advancing Inclusive Education in Danapur, Patna, Bihar._ 

#### **Four primary actions below the hero:** 

1. Explore School Accessibility 

2. Read Guidelines 

3. Participate in Survey 

4. View Research Findings 

Home also shows: project introduction, objectives, important statistics, awareness campaign and latest activities. Any statistic shown before real data exists must be clearly labelled as demo/illustrative. 

## **6. Website Sections (12)** 

### **6.1 Section list** 

|#|Section|Content|
|---|---|---|
|1|Home|Introduction, objectives,<br>statistics, awareness campaign,<br>latest activities|
|2|School Accessibility Directory|List of government and private<br>schools in Danapur, inspection<br>status,available facilities,|



|#|Section|Content|
|---|---|---|
|||verified findings|
|3|School Accessibility Audit|Digital checklist: ramp, doors,<br>toilets, railings, classrooms,<br>pathways, signage, drinking<br>water, emergency exits|
|4|Laws, Policies & Guidelines|Library: RPwD Act 2016, RPwD<br>Rules 2017, RTE Act 2009, NEP<br>2020, Samagra Shiksha,<br>Universal Design, related<br>accessibility standards|
|5|Inclusive Education Hub|Inclusive education, Reasonable<br>Accommodation, Special<br>Educators, Accessible Learning<br>Materials, Assistive Technology|
|6|Research & Data Dashboard|School surveys, accessibility<br>barriers, findings, graphs,<br>research reports|
|7|Interactive School Map|School locations, audit status,<br>verified accessibility facilities|
|8|Community Voices|Experiences of disabled<br>students, parents, teachers and<br>disability advocates, with<br>consent and privacy|
|9|Awareness & Advocacy|Social media campaign, posters,<br>reels, awareness videos,<br>workshops, community<br>mobilisation|
|10|Resource & Download Centre|PDF guidelines, survey forms,<br>school audit formats, RTI<br>templates, checklists,<br>awareness materials|
|11|Report an Accessibility Barrier|Secure submission of school<br>accessibility problems with<br>photo and description;<br>verification before publication|
|12|About Researcher & Contact|Introduction, fellowship project,<br>research methodology,|



|#|Section|Content|
|---|---|---|
|||objectives, collaborations,<br>contact information|



### **6.2 Unique features** 

#### **A. Smart Accessibility Audit Tool** 

- Mobile-friendly form used during school visits to enter ramp slope, door width, railings, toilets, etc. 

- System compares entered values against relevant standards and shows possible deficiencies. 

- • Standard values/thresholds must be taken from the official documents (primarily the Accessibility Code for Educational Institutions) and stored as editable configuration, not hardcoded from memory. **Client must confirm the exact threshold list** (Open Question Q1). 

- Audit entries are created by the Researcher/Admin only. 

#### **B. Danapur School Accessibility Map** 

- Interactive map of government and private schools. 

- Each school shows a status: **Audited** , **Pending** , or **Follow-up Required** . 

- School popup shows verified accessibility facilities and a link to the school's page. 

#### **C. School Accessibility Scorecard** 

- 100-point research score per school, based on categories such as entrance, toilets, classrooms and safety. 

- Scoring methodology must be **transparent** (a visible "How this score is calculated" page/modal). 

- Must clearly state the score is a research score and **not a government certification** . 

- Category weights are to be supplied by the client (Open Question Q2). 

#### **D. Learn Accessibility — Visual Guide** 

   - Images with easy-Hindi explanations of a correct ramp, accessible toilet, tactile path and classroom. 

   - Every topic carries a reference to the official standard. 

- **E. Before & After Accessibility Tracker** (client's most important recommendation) 

   - Per school: a barrier is identified (e.g., ramp problem) → a suggestion is given → an improvement happens later. 

   - Progress is shown with photos, dates and verification status. 

   - Only verified entries are public. 

## **7. Guidelines Library (strongest part of the site)** 

Each guideline gets its own page containing: **easy-Hindi explanation, main provisions, related sections, checklist, official download link.** Not just a PDF upload. 

|Guideline / Policy|What the page explains|
|---|---|
|RPwD Act, 2016|Rights of disabled students and education|
|RPwD Rules, 2017|Rules and accessibility standards|
|Accessibility Code for Educational Institutions,<br>2024|Standards for school buildings and facilities|
|Harmonised Guidelines, 2021|Universal accessibility and building design|
|RTE Act, 2009|Children's right to education|
|NEP 2020|Inclusive and equal education|
|Samagra Shiksha|Facilities and support for CwSN|
|UNICEF School Accessibility Guide|Practical examples of accessible schools|
|WCAG 2.2|Digital accessibility of this website|



- The **Accessibility Code for Educational Institutions** is the main technical reference (notified by the Ministry of Education, Government of India, January 2024) and should be visually prominent. 

- **Important Official Sources** block (with View/Open links): 

   - a. Accessibility Code for Educational Institutions — Ministry of Education, Govt. of India (PDF) 

   - b. Standards & Guidelines Library — Department of Empowerment of Persons with Disabilities 

- c. Making Schools Accessible to Children with Disabilities — UNICEF India 

- • Official links must be verified before launch (Open Question Q3). 

## **8. Accessibility-First Requirements (the website itself)** 

- Hindi and English language support 

- Full keyboard navigation (visible focus, skip-to-content link) 

- Screen reader support (semantic HTML, ARIA only where needed) 

- High contrast mode 

- Text resize controls 

- Alt text for all images 

- Captions for videos 

- Accessible forms (labels, error messages, instructions) 

- Mobile-friendly navigation 

- **Target: WCAG 2.2 AA** , to be verified by actual testing (automated + keyboard + screen reader: NVDA/TalkBack) before launch. Do not claim compliance without testing. 

## **9. Research Dashboard** 

- Displays school survey data, accessibility barriers, findings, graphs and research reports. 

- Category graphs: **Entrance, Ramps, Toilets, Classrooms, Signage** . 

- **Initial demo data (illustrative only):** 05 Schools Surveyed; 03 Government; 02 Private; 60% example accessibility score. 

- Demo data must carry a visible label: _"Illustrative demo data — not actual Danapur survey findings."_ 

- The dashboard must be driven from real Firestore audit data, so demo data is replaced automatically as real surveys are entered. 

## **10. Privacy, Consent and Verification** 

- Photos of schools, children's experiences and survey data are published **only after** permission, privacy handling and verification. 

- **Community Voices:** a consent record is required for each story; support for anonymous/pseudonymous display. 

- **Barrier reports:** submitted content is stored as _Pending_ ; nothing is public until the Admin verifies and approves. 

- Barrier submission must be secure (Section 11 rules) and should protect the reporter's contact details from public view. 

- No images of children's faces unless explicit consent is recorded. 

- **Surveys & Responses (Change Request 2026-10-17):** Participation in the survey requires Google Sign-in via Firebase Auth to prevent spam and duplicate entries (strictly 1 response per survey per Google account, stored with document ID `${surveyId}_${uid}`). Collects Full Name (prefilled from Google, editable), Contact Number (10-digit Indian mobile), Email (from Google, read-only), and Role (student / parent / teacher / advocate). A mandatory bilingual research consent checkbox is recorded with timestamp. Personal details are strictly confidential, never exposed publicly or on charts/dashboards, and admin-deletable per India's Digital Personal Data Protection (DPDP) Act 2023. All other public website sections remain 100% login-free.

## **11. Technical Approach** 

### **11.1 Stack [Impl. choice]** 

|Layer|Choice|Reason|
|---|---|---|
|Frontend|Next.js (React) + Tailwind CSS|SEO, i18n (Hindi/English),<br>accessible components, fast|
|Hosting|Firebase Hosting (or App<br>Hosting for Next.js SSR)|Same ecosystem as database|
|Database|Cloud Firestore|Client's choice: Firebase|
|Auth|Firebase Authentication<br>(email/password for Admin;<br>Google OAuth strictly for<br>Survey respondents)|Public users need no login<br>except when submitting survey|
|File storage|Firebase Storage|Photos, PDFs, resources|
|Server logic|Cloud Functions (score<br>calculation, deficiency<br>comparison,submission|Keeps logic trusted and<br>consistent|



|Layer|Choice|Reason|
|---|---|---|
||handling)||
|Map|Leaflet + OpenStreetMap|No API cost|
|Charts|Chart.js or Recharts (must have<br>accessible text/table<br>alternative)|Dashboard|
|i18n|next-intl or react-i18next|hi / en|



Note: the client's source note suggested WordPress for the early phase; since Firebase has been chosen, this PRD assumes a custom web app with an Admin panel instead. Content such as guidelines pages should be editable by the Admin through Firestore so a CMS is not needed. 

### **11.2 Firestore data model (proposed)** 

- <mark>schools/{schoolId}</mark> — name, type (government/private), address, block/area, geo (lat, lng), udiseCode (optional), auditStatus ( <mark>audited</mark> | <mark>pending</mark> | <mark>follow_up_required</mark> ), score, scoreBreakdown, facilities, lastAuditDate, published (bool) 

- <mark>audits/{auditId}</mark> — schoolId, auditorId, date, measurements (entrance, ramp slope, door width, railings, toilets, classrooms, pathways, signage, drinking water, emergency exits), photos[], deficiencies[], status ( <mark>draft</mark> | <mark>verifed</mark> i ), notes 

- <mark>standards/{standardId}</mark> — parameter, threshold/range, unit, sourceDocument, sourceClause (admin-editable; used by the deficiency comparison) 

- <mark>scoringConfg/{version}</mark> i — categories, weights, methodology text (hi/en) 

- <mark>guidelines/{guidelineId}</mark> — title, slug, summary_hi, summary_en, mainProvisions[], relatedSections[], checklist[], officialUrl, isPrimaryReference 

- <mark>learnTopics/{topicId}</mark> — title, images[], explanation_hi, explanation_en, standardReference 

- <mark>inclusiveEducation/{itemId}</mark> — topic, content_hi, content_en 

- <mark>surveys/{surveyId}</mark> and <mark>surveyResponses/{surveyId_uid}</mark> — form definition and single-submission responses per Google user: surveyId, uid, email, name, phone, role (student/parent/teacher/advocate), answers, consentGiven (bool), consentAt, createdAt 

- <mark>barrierReports/{reportId}</mark> — schoolId or free-text school, description, photos[], reporterContact (private), status ( <mark>pending</mark> | <mark>verifed</mark> i | <mark>rejected</mark> ), createdAt 

- <mark>communityVoices/{voiceId}</mark> — role (student/parent/teacher/advocate), story, consentRecorded (bool), displayName/anonymous, published 

- <mark>trackerEntries/{entryId}</mark> — schoolId, barrier, suggestion, beforePhoto, afterPhoto, dates, verificationStatus 

- <mark>campaignItems/{itemId}</mark> — type (poster/reel/video/workshop), media, captionsUrl, date 

- <mark>resources/{resourceId}</mark> — category (guideline PDF, survey form, audit format, RTI template, checklist, awareness material), file, title (hi/en) 

- <mark>researchReports/{reportId}</mark> — title, summary, fileUrl, date 

- <mark>siteContent/{key}</mark> — home text, about, methodology, collaborations, contact 

- <mark>users/{uid}</mark> — role (admin) 

### **11.3 Security rules [Impl. choice]** 

- Public: read-only on documents where <mark>published == true</mark> / <mark>status == verif</mark> i <mark>ed</mark> . 

- Public create-only: <mark>barrierReports</mark> (with field validation, size limits on uploads, and rate limiting via Cloud Function/App Check). 

- Survey responses: authenticated Google users can create/update only their own document (`docId == surveyId_uid && request.resource.data.uid == request.auth.uid`), and can read only their own response (`resource.data.uid == request.auth.uid`). Public read/write is completely denied. Personal details (name, phone, email) are strictly private. 

- Admin only: full read, CSV export, and deletion of survey responses; all other writes; reporter contact fields never publicly readable. 

- Enable Firebase App Check for public submission endpoints. 

## **12. Task Plan (follow in order)** 

The phases follow the client's own plan. Each task must be completed and verified before the next. 

### **Phase 1 — Basic Website** 

#### **Task 1 — Project setup & design foundation** 

- Initialise the project, Firebase config (Hosting, Firestore, Auth, Storage), environment setup. 

- Design tokens (Navy, Teal, Amber, Off-white), typography, spacing, base components. 

- Hindi/English i18n, language toggle, text resize, high-contrast mode. 

- Global layout: accessible header/navigation (mobile-friendly), footer, skip link. 

- _Done when:_ keyboard-navigable shell works in both languages and passes automated accessibility checks. 

#### **Task 2 — Home page** 

- Hero message, sub-line, four primary action buttons, introduction, objectives, statistics (labelled demo), awareness campaign block, latest activities. 

#### **Task 3 — Guidelines Library** 

- List page and detail template (Hindi explanation, main provisions, related sections, checklist, official link). 

- Content entry for the 9 listed guidelines; prominent Accessibility Code; Important Official Sources block. 

#### **Task 4 — About Researcher & Contact** 

- Introduction, fellowship project, methodology, objectives, collaborations, contact info and accessible contact form. 

#### **Task 5 — Admin authentication & basic admin panel** 

- Admin login; protected admin area to edit guidelines and site content. 

### **Phase 2 — Research Content** 

#### **Task 6 — School Accessibility Directory** 

- School list with filters (government/private, audit status), school detail page, inspection status, facilities, verified findings. 

- Admin CRUD for schools. 

#### **Task 7 — Survey forms ("Participate in Survey")** 

- Accessible survey form builder/renderer; responses saved in Firestore; admin view of responses. 

#### **Task 8 — Research updates, Resource & Download Centre, Inclusive Education Hub, Learn Accessibility** 

- Resource listing by category with downloads; Inclusive Education Hub pages; Visual Guide topics with standard references. 

### **Phase 3 — Interactive Features** 

#### **Task 9 — Smart Accessibility Audit Tool** 

- Mobile-first audit form for all required elements; photo upload; standards comparison via editable <mark>standards</mark> data; deficiency output; draft/verified workflow. 

#### **Task 10 — Scorecard** 

- 100-point score computed from configurable weights; transparent methodology view; "not a government certification" notice on every score display. 

#### **Task 11 — Interactive School Map** 

- Leaflet map, status markers (Audited / Pending / Follow-up Required) with non-colour-only indicators, popups, keyboard-accessible list alternative. 

#### **Task 12 — Research & Data Dashboard** 

- Counts and category graphs from real data; demo-data label; text/table alternatives for every chart; research reports list. 

### **Phase 4 — Community & Impact** 

#### **Task 13 — Report an Accessibility Barrier** 

- Accessible form with photo upload; pending → verified workflow in admin; privacy of reporter details. 

#### **Task 14 — Community Voices + Awareness & Advocacy** 

- Consent-gated community stories; awareness content (posters, reels, videos with captions, workshops). 

#### **Task 15 — Before & After Accessibility Tracker + School Recommendations + Reports** 

- Tracker with photos, dates, verification; school recommendations; downloadable reports. 

#### **Task 16 — QA, accessibility audit and launch** 

- WCAG 2.2 AA testing (automated, keyboard, screen reader), Hindi/English content check, security rules review, performance check, deployment. 

## **13. Acceptance Criteria (summary)** 

- All 12 sections and 5 unique features (A–E) exist and match this PRD; nothing extra added. 

- Every public page works in Hindi and English, with keyboard and screen reader. 

- No unverified or non-consented content is publicly visible. 

- Demo data is always labelled; scores are always labelled as research scores, not certification. 

- Standards used for deficiency checks trace back to a cited official source. 

## **14. Open Questions (client must confirm)** 

- **Q1.** Exact list of audit parameters and threshold values (from the Accessibility Code) to be used by the Audit Tool. 

- **Q2.** Category weights for the 100-point scorecard. 

- **Q3.** Final official links and PDF copies for the three official sources and all guideline documents. 

- **Q4.** Who writes the easy-Hindi explanations and checklists for each guideline (content owner)? 

- **Q5.** List of Danapur schools (names, type, coordinates) to be loaded initially. 

- **Q6.** Consent form wording for Community Voices and photos. 

- **Q7.** Contact details and researcher introduction text for the About page. 

