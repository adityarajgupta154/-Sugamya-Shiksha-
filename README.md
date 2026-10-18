# Sugamya Shiksha Bihar (सुगम्य शिक्षा बिहार)

An open-access research, audit, and community advocacy platform investigating physical infrastructure accessibility in elementary and secondary schools across the Danapur subdivision of Patna district, Bihar. Developed under the NCPEDP Fellowship.

---

## 🌟 Key Features

- **School Accessibility Directory & Interactive Map**: Geo-referenced catalog of schools with compliance ratings, infrastructure breakdown, and facility tags.
- **On-Site Measurement Audit Tool**: Interactive audit interface matching the National Building Code (NBC 2016), RPwD Act 2016, and Harmonised Guidelines 2021.
- **Community Voices & Barrier Reporting**: Fully consent-governed reporting system (DPDP Act 2023 compliant) with honeypot security and multi-clause opt-ins.
- **Statutory Guidelines Hub & Visual Guide**: 9 national standards decoded into plain Hindi and English, paired with interactive 2D architectural schematics.
- **Administrative Portal**: Secure dashboard for fellowship researchers featuring modular tab managers for guidelines, site content, schools, surveys, audits, barrier reviews, and improvement tracking.

---

## 🏗️ Clean Project Architecture

```text
Sugamya Shiksha Bihar/
├── docs/                      # Architectural Decision Records (ADRs) & PRDs
│   ├── adr/                   # ADRs 0001 through 0014
│   ├── prd/                   # Fellowship PRD specifications & requirements
│   └── cleanup-report.md      # Comprehensive audit & restructure report
├── public/                    # Optimized public static assets & icons
│   ├── images/visual-guide/   # High-resolution architectural diagram assets
│   ├── hero/                  # Compressed WebP and fallback hero slides
│   └── icons/                 # Accessibility & category icons
├── reports/                   # Performance & Lighthouse audit benchmarks
├── scripts/                   # Verification test suites & maintenance tools
│   ├── test-a11y.mjs          # Automated axe-core WCAG 2.2 AA scanner
│   ├── test-rules.mjs         # 62 Firestore & Storage security invariant tests
│   ├── test-scorecard.mjs     # 4-pillar scorecard calculation unit tests
│   ├── test-survey-validation.mjs
│   ├── test-survey-admin-query.mjs
│   ├── test-barrier-validation.mjs
│   └── test-audit-comparison.mjs
├── src/
│   ├── app/                   # Next.js App Router pages (slender page routes)
│   ├── components/            # Modular UI and domain components
│   │   ├── admin/             # Modular admin tabs (Schools, Guidelines, Surveys...)
│   │   ├── visual-guide/      # Architectural diagram modules (Ramp, Toilet...)
│   │   ├── ui/                # Accessible design system primitives (Button, Modal...)
│   │   ├── map/               # Leaflet GIS map components
│   │   └── ...
│   ├── context/               # React contexts (AuthContext, LanguageContext)
│   ├── data/                  # Static data models and fallback definitions
│   ├── lib/                   # Utility libraries, validators, and calculators
│   │   ├── firebase/          # Modular Firebase clients (app, auth, firestore, storage)
│   │   └── ...
│   └── locales/               # Bilingual dictionaries (en.json, hi.json)
├── CLEANUP_CHANGELOG.md       # Incremental restructuring changelog
├── firestore.rules            # Firestore security rules
└── storage.rules              # Cloud Storage security rules
```

---

## 🚀 Getting Started

### 1. Prerequisites
- Node.js (v18.17.0+ or v20+)
- npm (v9+)

### 2. Environment Configuration
Copy the provided environment template:
```bash
cp .env.example .env.local
```

Populate `.env.local` with your Firebase project credentials.

### 3. Installation
```bash
npm install
```

### 4. Running the Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to view the application.

---

## 🧪 Testing & Verification

The project includes automated invariant suites ensuring security, accessibility, and calculation integrity:

```bash
# Run all automated test suites (A11y, Security Rules, Scorecard, Surveys, Barriers)
npm test

# Run TypeScript typecheck
npm run type-check

# Run Next.js ESLint
npm run lint

# Run production build
npm run build
```

---

## ♿ Accessibility & Localization Standards

- **WCAG 2.2 AA Compliant**: High-contrast color tokens, full keyboard navigation, screen-reader landmarks, and automated zero-violation enforcement via `axe-core`.
- **Bilingual By Design**: Instant toggle between Hindi (हिन्दी) and English across all static content, forms, and dynamic data fallbacks.
- **DPDP Act 2023 Compliant**: Explicit multi-clause consent required before submission of any community voice or barrier report; zero public leakage of reporter contact information.
