# ADR 0014: Codebase Cleanup, Asset Optimization, and Component Restructuring

- **Status:** Accepted
- **Date:** 2026-10-18
- **Author:** Antigravity (Ponytail & Impeccable Mode)
- **Deciders:** Product, Engineering & Accessibility Team

---

## Context

Following rapid iterative development of core research modules (Directory, Map, GIS Audit Tool, Barrier Reporting, Community Voices, Visual Guide, and Admin Dashboard), the repository accumulated technical debt across multiple dimensions:
1. **Root Directory Clutter:** 14 stray Lighthouse `.report.html` and `.json` artifacts, temporary benchmark metrics files (`before-metrics.json`, `after-metrics.json`), and unorganized PRD specification documents in the workspace root.
2. **Duplicate & Heavy Media:** Exact duplicate PNGs in the `public/` root that were already canonically housed under `public/images/visual-guide/`, alongside uncompressed original hero images totaling over 15 MB.
3. **Monolithic Files:** Two oversized single files exceeded maintainability thresholds:
   - `src/components/visual-guide/ArchitecturalDiagrams.tsx` (1,234 lines containing 4 distinct architectural diagrams).
   - `src/app/admin/page.tsx` (2,559 lines containing 9 management areas, CRUD forms, and dialogs).
4. **Dependency & Configuration Inefficiencies:** An unused runtime dependency (`tailwind-merge`), development types (`@types/leaflet`) installed as runtime dependencies, missing root `.eslintrc.json`, and redundant barrel re-exports (`src/lib/firebase.ts`).
5. **Preservation Invariants:** Under no circumstances could cleanup alter runtime behavior, visual UI design, copy, Firestore data structure, security rules, or accessibility compliance.

---

## Decision

We executed a phased, incremental cleanup process on a dedicated git branch (`chore/cleanup`) with an external verified backup copy at `..\Sugamya-Shiksha-Bihar-BACKUP`. Every step was committed individually with strict multi-layer verification (TypeScript, ESLint, security rules invariants, accessibility audits, and Next.js production builds).

### 1. Stray Artifact Removal and Documentation Organization
- Removed 14 root Lighthouse report files and temporary metric files (canonical reports preserved under `reports/lighthouse/`).
- Moved root PRD files to [`docs/prd/`](file:///c:/Users/adity/OneDrive/Desktop/Sugamya%20Shiksha%20Bihar/docs/prd/).
- Removed dead barrel re-export `src/lib/firebase.ts` (replaced by modular `src/lib/firebase/` subpaths).
- Updated `.gitignore` to prevent future reports from polluting version control.

### 2. Media Optimization & Deduplication
- Removed redundant root copies: `Accessible Classroom Floor Plan with Dimensions.png`, `Accessible School Toilet Layout Diagram.png`, `Accessible Tactile Pathway Dimensions.png`, `Hopeful Journey to School-orig.png`, `Hopeful Journey to School.png`, `logo-optimized.png`, and `logo-orig.png` (saving 11 MB).
- Compressed hero carousel images with Sharp to produce next-gen WebP variants (~230 KB each) alongside optimized PNG fallbacks (~650 KB each), saving ~3.9 MB in transfer payload without visual degradation.
- Updated `src/app/page.tsx` carousel to use optimized WebP and PNG assets.

### 3. Modularization of Architectural Diagrams
Decomposed `src/components/visual-guide/ArchitecturalDiagrams.tsx` (1,234 lines) into 4 focused modules sharing `SchematicShell`:
- [`RampDiagram.tsx`](file:///c:/Users/adity/OneDrive/Desktop/Sugamya%20Shiksha%20Bihar/src/components/visual-guide/RampDiagram.tsx) (~340 lines)
- [`ToiletDiagram.tsx`](file:///c:/Users/adity/OneDrive/Desktop/Sugamya%20Shiksha%20Bihar/src/components/visual-guide/ToiletDiagram.tsx) (~280 lines)
- [`TactileDiagram.tsx`](file:///c:/Users/adity/OneDrive/Desktop/Sugamya%20Shiksha%20Bihar/src/components/visual-guide/TactileDiagram.tsx) (~340 lines)
- [`ClassroomDiagram.tsx`](file:///c:/Users/adity/OneDrive/Desktop/Sugamya%20Shiksha%20Bihar/src/components/visual-guide/ClassroomDiagram.tsx) (~280 lines)
- [`ArchitecturalDiagrams.tsx`](file:///c:/Users/adity/OneDrive/Desktop/Sugamya%20Shiksha%20Bihar/src/components/visual-guide/ArchitecturalDiagrams.tsx) retained as a lightweight dispatcher (~35 lines) exporting `VisualDiagramRenderer`.

### 4. Modularization of the Admin Dashboard
Decomposed `src/app/admin/page.tsx` (2,559 lines) into modular tab components in `src/components/admin/`:
- [`SurveysAdminTab.tsx`](file:///c:/Users/adity/OneDrive/Desktop/Sugamya%20Shiksha%20Bihar/src/components/admin/SurveysAdminTab.tsx) (~620 lines): Survey questions editor, response reviewer, export tools.
- [`GuidelinesAdminTab.tsx`](file:///c:/Users/adity/OneDrive/Desktop/Sugamya%20Shiksha%20Bihar/src/components/admin/GuidelinesAdminTab.tsx) (~170 lines): Statutory guidelines directory and edit modal.
- [`SiteContentAdminTab.tsx`](file:///c:/Users/adity/OneDrive/Desktop/Sugamya%20Shiksha%20Bihar/src/components/admin/SiteContentAdminTab.tsx) (~215 lines): Home and about content editors, contact inquiries viewer.
- [`SchoolsAdminTab.tsx`](file:///c:/Users/adity/OneDrive/Desktop/Sugamya%20Shiksha%20Bihar/src/components/admin/SchoolsAdminTab.tsx) (~410 lines): Schools directory, filter tags, delete confirmation, and school add/edit modal.
- Refactored `src/app/admin/page.tsx` into a lean 220-line orchestration shell with 100% on-demand dynamic loading (`next/dynamic`) for all 9 tabs.

### 5. Dependency, Linter, and Export Normalization
- Removed unused `tailwind-merge` dependency.
- Moved `@types/leaflet` from runtime `dependencies` to `devDependencies`.
- Added standard `.eslintrc.json` extending `next/core-web-vitals`.
- Standardized Firebase exports on clean named exports; maintained `DEFAULT_SURVEY_ID` export for test suites.
- Added `npm test` and `npm run type-check` convenience scripts to `package.json`.
- Created comprehensive [`README.md`](file:///c:/Users/adity/OneDrive/Desktop/Sugamya%20Shiksha%20Bihar/README.md) and detailed [`CLEANUP_CHANGELOG.md`](file:///c:/Users/adity/OneDrive/Desktop/Sugamya%20Shiksha%20Bihar/CLEANUP_CHANGELOG.md).

---

## Invariants & Verification Results

All 7 automated test suites and production build checks passed with zero errors or regressions:

| Suite | Status | Metrics / Invariants Verified |
|-------|--------|-------------------------------|
| **Security Rules Invariants** | ✅ Passed | 62/62 tests passing (`node scripts/test-rules.mjs`) |
| **WCAG 2.2 AA Accessibility** | ✅ Passed | 0 violations (`node scripts/test-a11y.mjs`) |
| **Scorecard Calculation TDD** | ✅ Passed | 6/6 tests passing (`node scripts/test-scorecard.mjs`) |
| **Survey Validation TDD** | ✅ Passed | 35/35 tests passing (`node scripts/test-survey-validation.mjs`) |
| **Survey Admin Query TDD** | ✅ Passed | 10/10 tests passing (`node scripts/test-survey-admin-query.mjs`) |
| **Barrier Report Validation** | ✅ Passed | 12/12 tests passing (`node scripts/test-barrier-validation.mjs`) |
| **Standards Comparison Engine** | ✅ Passed | 8/8 tests passing (`node scripts/test-audit-comparison.mjs`) |
| **TypeScript Typecheck** | ✅ Passed | 0 type errors (`npm run type-check`) |
| **ESLint** | ✅ Passed | 0 lint errors (`npm run lint`) |
| **Next.js Production Build** | ✅ Passed | 32/32 static routes prerendered cleanly |

---

## Consequences

- **Disk Space Savings:** Permanently freed **~18.3 MB** of redundant files and oversized uncompressed media.
- **Admin Bundle Improvement:** Reduced `/admin` initial route HTML from 13.8 kB to 7.97 kB (-42%) and First Load JS from 249 kB to 226 kB (-23 kB), improving interactive responsiveness.
- **Maintainability:** Replaced 2 massive monolithic files (totaling 3,793 lines) with 8 clean, single-responsibility modules.
- **Workflow Efficiency:** Added unified `npm test` and `npm run type-check` scripts for rapid development validation.
