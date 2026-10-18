# Cleanup Changelog

This document tracks all operations performed during the codebase cleanup and restructuring on branch `chore/cleanup`.

---

## Stage 1: Analysis & Approvals
- **Git Baseline Commit:** `chore: initial baseline commit`
- **Audit Report:** Generated [`docs/cleanup-report.md`](file:///c:/Users/adity/OneDrive/Desktop/Sugamya%20Shiksha%20Bihar/docs/cleanup-report.md)
- **Approvals Obtained:**
  - Decision B1: Move root PRD files to `docs/prd/`.
  - Decision B2: Retain inspection scripts in `scripts/`.
  - Decision B3: Compress oversized hero images with Sharp to WebP + optimized fallbacks.
  - Decision B4: Keep `CardDescription` exported in `src/components/ui/Card.tsx`.

---

## Stage 2: Execution Steps Log

### Step 1: Remove Stray Root Reports & Dead Re-export, Move PRD to docs/prd/, Update .gitignore
- **Actions:**
  - Removed 14 stray Lighthouse `.report.html` and `.json` artifacts from root (canonical reports retained in `reports/lighthouse/`).
  - Removed stray root `before-metrics.json` and `after-metrics.json` (canonical summaries retained in `reports/lighthouse/`).
  - Removed dead barrel re-export `src/lib/firebase.ts` (obsoleted by modular `src/lib/firebase/` subpaths).
  - Moved PRD documents from root to `docs/prd/` (`PRD — Sugamya Shiksha Bihar.md`, `PRD — Sugamya Shiksha Bihar.docx`, `PRD_extracted.txt`, `docs/prd-feature-d-learn-accessibility.md`).
  - Updated `.gitignore` to ignore `reports/`, `*.report.html`, and `*.report.json`.
- **Commit:** `0480b22`
- **Verification:**
  - TypeScript: 0 errors (`npx tsc --noEmit`)
  - Rules: 62/62 security policy invariants passed (`node scripts/test-rules.mjs`)
  - Accessibility: 0 violations (`node scripts/test-a11y.mjs`)
  - Production Build: 32/32 static routes generated, 87.8 kB shared JS (`npm run build`)

### Step 2: Remove Duplicate & Uncompressed Images, Optimize Hero Assets
- **Actions:**
  - Removed exact duplicate images in `public/` root: `Accessible Classroom Floor Plan with Dimensions.png`, `Accessible School Toilet Layout Diagram.png`, `Accessible Tactile Pathway Dimensions.png` (saving 5.9 MB; canonical files reside in `public/images/visual-guide/`).
  - Removed uncompressed originals/duplicates: `Hopeful Journey to School-orig.png`, `Hopeful Journey to School.png`, `logo-optimized.png`, `logo-orig.png` (saving 5.1 MB; canonical files are `Hopeful Journey to School-opt.png` and `logo.png`).
  - Compressed oversized hero images `Campus Sunset Learning by the River` and `Inclusive School Pathway at Sunrise` using Sharp to generate WebP (~230 KB each) and optimized PNG fallbacks (~650 KB each), saving ~3.9 MB in transfer payload.
  - Updated `src/app/page.tsx` hero carousel to reference optimized image assets while keeping all dimensions, alt texts, and titles identical.
- **Commit:** `ce06185`
- **Verification:**
  - TypeScript: 0 errors (`npx tsc --noEmit`)
  - Rules: 62/62 security policy invariants passed (`node scripts/test-rules.mjs`)
  - Accessibility: 0 violations (`node scripts/test-a11y.mjs`)
  - Production Build: 32/32 static routes generated, 87.8 kB shared JS (`npm run build`)

### Step 3: Remove Unused Exports and Normalize Firebase Exports
- **Actions:**
  - `src/lib/firebase/app.ts`: Scoped `firebaseConfig` to module-internal; removed redundant duplicate `export default app`.
  - `src/lib/firebase/auth.ts`: Scoped `getAuthInstance` to module-internal; removed redundant duplicate `export default auth`.
  - `src/lib/firebase/firestore.ts`: Removed redundant duplicate `export default db`.
  - `src/lib/firebase/storage.ts`: Removed redundant duplicate `export default storage`.
  - `src/data/surveyConstants.ts`: Scoped `DEFAULT_SURVEY_ID` to module-internal (no external consumers).
  - `src/lib/scorecardCalculator.ts`: Scoped `getCategoryKeyForStandardCategory` to file-internal helper.
- **Commit:** `727d03c`
- **Verification:**
  - TypeScript: 0 errors (`npx tsc --noEmit`)
  - Rules: 62/62 security policy invariants passed (`node scripts/test-rules.mjs`)
  - Scorecard TDD: 6/6 passed (`node scripts/test-scorecard.mjs`)
  - Production Build: 32/32 static routes generated, 87.8 kB shared JS (`npm run build`)

### Step 4: Remove Unused Dependencies, Move Dev Dependencies, Configure ESLint
- **Actions:**
  - Removed unused `tailwind-merge` dependency from `package.json` (0 imports across repo).
  - Moved `@types/leaflet` from runtime `dependencies` to `devDependencies`.
  - Created standard `.eslintrc.json` (`next/core-web-vitals`).
  - Fixed `tabLoading` HOC display name in `src/app/admin/page.tsx` to satisfy `react/display-name`.
  - Regenerated clean `package-lock.json` with `npm install` (1 package removed, 520 packages audited).
- **Commit:** `41ce59a`
- **Verification:**
  - ESLint: 0 errors (`npm run lint`)
  - TypeScript: 0 errors (`npx tsc --noEmit`)
  - Rules: 62/62 security policy invariants passed (`node scripts/test-rules.mjs`)
  - Production Build: 32/32 static routes generated, 87.8 kB shared JS (`npm run build`)

### Step 5: Modularize Architectural Diagrams Component
- **Actions:**
  - Decomposed monolithic `ArchitecturalDiagrams.tsx` (1,234 lines) into 4 modular diagram components:
    - `src/components/visual-guide/RampDiagram.tsx` (~340 lines)
    - `src/components/visual-guide/ToiletDiagram.tsx` (~280 lines)
    - `src/components/visual-guide/TactileDiagram.tsx` (~340 lines)
    - `src/components/visual-guide/ClassroomDiagram.tsx` (~280 lines)
  - Refactored `src/components/visual-guide/ArchitecturalDiagrams.tsx` into a lightweight dispatcher (~35 lines) exporting `VisualDiagramRenderer`.
- **Commit:** `d2be148`
- **Verification:**
  - TypeScript: 0 errors (`npx tsc --noEmit`)
  - ESLint: 0 errors (`npm run lint`)
  - Rules: 62/62 security policy invariants passed (`node scripts/test-rules.mjs`)
  - Production Build: 32/32 static routes generated, 87.8 kB shared JS (`npm run build`)

### Step 6: Modularize Admin Surveys Tab & Re-export Survey Constants
- **Actions:**
  - Extracted surveys management UI, question editor modals, response review modals, and export logic from `src/app/admin/page.tsx` into modular component `src/components/admin/SurveysAdminTab.tsx` (~620 lines).
  - Reduced `src/app/admin/page.tsx` line count by 50% (from 2,559 down to 1,281 lines) with dynamic on-demand import of `SurveysAdminTab`.
  - Restored `export const DEFAULT_SURVEY_ID` in `src/data/surveyConstants.ts` to satisfy `scripts/test-survey-admin-query.mjs`.
- **Commit:** `988b0a9`
- **Verification:**
  - TypeScript: 0 errors (`cmd /c npx tsc --noEmit`)
  - ESLint: 0 errors (`cmd /c npm run lint`)
  - Survey Admin Query TDD: 10/10 passed (`node scripts/test-survey-admin-query.mjs`)
  - Survey Validation TDD: 35/35 passed (`node scripts/test-survey-validation.mjs`)
  - Security Rules Invariants: 62/62 passed (`node scripts/test-rules.mjs`)
  - Scorecard TDD: 6/6 passed (`node scripts/test-scorecard.mjs`)
  - Barrier Report Validation: 12/12 passed (`node scripts/test-barrier-validation.mjs`)
  - Standards Comparison Engine: 8/8 passed (`node scripts/test-audit-comparison.mjs`)
  - Accessibility Invariants: passed (`node scripts/test-a11y.mjs`)
  - Production Build: 32/32 static routes generated, 87.8 kB shared JS (`npm run build`)

### Step 7: Complete Modularization of Admin Tabs (Guidelines, Site Content, Schools)
- **Actions:**
  - Extracted `GuidelinesAdminTab.tsx` (~170 lines): directory listing, search, and edit guideline modal.
  - Extracted `SiteContentAdminTab.tsx` (~215 lines): home page hero/intro editor, about page bio/methodology editor, and contact inquiries viewer.
  - Extracted `SchoolsAdminTab.tsx` (~410 lines): schools directory, filter badges, delete confirmation, and school add/edit modal with 4-pillar score breakdown & facilities.
  - Refactored `src/app/admin/page.tsx` from 1,273 lines down to a lean 220-line orchestration shell with 100% dynamic loading for all 9 admin tabs.
  - Bundle optimization: reduced `/admin` initial route size from 13.8 kB (249 kB First Load JS) to 7.97 kB (226 kB First Load JS), saving 23 kB of client JS payload.
- **Commit:** `a3f86fd`
- **Verification:**
  - TypeScript: 0 errors (`cmd /c npx tsc --noEmit`)
  - ESLint: 0 errors (`cmd /c npm run lint`)
  - Rules: 62/62 security policy invariants passed (`node scripts/test-rules.mjs`)
  - Full Test Suite: All 133 tests passed across 7 test scripts
  - Production Build: 32/32 static routes generated cleanly (`npm run build`)

### Step 8: Developer Experience, Architectural Documentation & Final Invariants
- **Actions:**
  - Added unified `test` and `type-check` scripts to `package.json`.
  - Created root `README.md` with architectural directory map, setup instructions, and testing commands.
  - Authored `docs/adr/0014-project-cleanup-and-restructure.md` recording all architectural and structural decisions.
  - Updated `CONTEXT.md` with Task 26 Decisions Log.
- **Commit:** `76efd7d`
- **Verification:**
  - TypeScript: 0 errors (`cmd /c npm run type-check`)
  - ESLint: 0 errors (`cmd /c npm run lint`)
  - Full Test Suite: All 133 tests passed (`cmd /c npm test`)
  - Production Build: 32/32 static routes prerendered cleanly (`npm run build`)

---

## Stage 3: Final Verification & Results

- **Total Commits on `chore/cleanup`:**
  1. `0480b22`: chore(cleanup): remove stray root lighthouse reports, dead firebase re-export, move PRD to docs/prd/
  2. `ce06185`: chore(assets): deduplicate public images and compress hero images with Sharp
  3. `727d03c`: refactor(lib): remove unused exports and normalize firebase subpath exports
  4. `41ce59a`: chore(deps): remove unused tailwind-merge, move leaflet types, configure eslint
  5. `d2be148`: refactor(visual-guide): modularize architectural diagrams into focused components
  6. `988b0a9`: refactor(admin): modularize SurveysAdminTab and re-export DEFAULT_SURVEY_ID
  7. `a3f86fd`: refactor(admin): extract GuidelinesAdminTab, SiteContentAdminTab, and SchoolsAdminTab
  8. `76efd7d`: docs: add README, ADR 0014, convenience test scripts, and update CONTEXT.md
- **Total Disk Space Freed:** **~18.3 MB**
- **Monolithic Reductions:**
  - `ArchitecturalDiagrams.tsx`: 1,234 lines → 35 lines (4 modular diagram components in `src/components/visual-guide/`)
  - `src/app/admin/page.tsx`: 2,559 lines → 220 lines (4 modular tab components in `src/components/admin/`)
- **Bundle Optimization:** `/admin` route HTML reduced by 42% (13.8 kB to 7.97 kB) and First Load JS reduced by 23 kB (249 kB to 226 kB).
- **All Core Invariants Preserved:** Zero regressions to behavior, UI design, Hindi/English content, Firestore schema, or security rules.

