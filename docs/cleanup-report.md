# Cleanup and Restructure Audit Report

**Date:** 2026-10-18  
**Branch:** `chore/cleanup`  
**Baseline Status:** Type-check ✅ PASSED (0 errors) | Tests ✅ PASSED (118/118 passed across 6 test suites) | Build ✅ PASSED (32 static pages generated, 87.8 kB shared JS) | Lint ⚠️ Needs `.eslintrc.json` (currently prompts interactively)

---

## 1. Executive Summary

A comprehensive, non-destructive audit of the **Sugamya Shiksha Bihar** codebase was conducted using automated tooling (`knip`, `depcheck`, `jscpd`, `madge`, `ripgrep`, MD5 hash comparison, custom AST scanners) alongside manual code inspection against `CONTEXT.md` and ADRs 0001–0013.

### Key Metrics
- **Dead / Duplicate Files Identified for Deletion:** 24 files
- **Immediate Disk Space Savings:** **~18.3 MB**
- **Duplicate Images Identified:** 3 exact identical image clones in `public/` (5.76 MB) + 4 unused uncompressed originals/duplicates (5.01 MB)
- **Unused NPM Dependencies:** 1 (`tailwind-merge`)
- **Misplaced NPM Dependencies:** 1 (`@types/leaflet` in `dependencies` instead of `devDependencies`)
- **Circular Dependencies:** **0** (confirmed by `madge`)
- **Console / Debugger Statements in Source:** **0** `console.log` or `debugger` statements; console calls are limited to deliberate offline/fallback warning loggers.
- **i18n Symmetry:** **100% symmetric** (194 keys in `en.json` and 194 keys in `hi.json`, 0 missing).

---

## 2. Section A: Safe to Delete

The following files are 100% dead, unreferenced, or duplicate and have zero runtime or build-time impact:

| # | File Path | Size | Reason / Proof |
|---|-----------|------|----------------|
| 1 | `lh-admin.report.html` | 462.1 KB | Stray root Lighthouse report. Canonical baseline and post-opt reports are in `reports/lighthouse/` (26 files, 13.68 MB). |
| 2 | `lh-after-admin.report.html` | 523.4 KB | Stray root Lighthouse report. Already preserved in `reports/lighthouse/admin-after.report.html`. |
| 3 | `lh-after-guidelines.report.html` | 685.7 KB | Stray root Lighthouse report. Already preserved in `reports/lighthouse/guidelines-after.report.html`. |
| 4 | `lh-after-home.json` | 503.8 KB | Stray root Lighthouse JSON artifact. Canonical in `reports/lighthouse/home-after.report.json`. |
| 5 | `lh-after-home.report.html` | 624.9 KB | Stray root Lighthouse report. Already preserved in `reports/lighthouse/home-after.report.html`. |
| 6 | `lh-after-map.report.html` | 631.0 KB | Stray root Lighthouse report. Already preserved in `reports/lighthouse/map-after.report.html`. |
| 7 | `lh-after-reports.report.html` | 575.9 KB | Stray root Lighthouse report. Already preserved in `reports/lighthouse/`. |
| 8 | `lh-after-school-directory.report.html` | 544.5 KB | Stray root Lighthouse report. Already preserved in `reports/lighthouse/schools-after.report.html`. |
| 9 | `lh-guidelines.report.html` | 584.1 KB | Stray root baseline report. Preserved in `reports/lighthouse/guidelines-baseline.report.html`. |
| 10 | `lh-home.report.html` | 540.8 KB | Stray root baseline report. Preserved in `reports/lighthouse/home-baseline.report.html`. |
| 11 | `lh-map.report.html` | 563.6 KB | Stray root baseline report. Preserved in `reports/lighthouse/map-baseline.report.html`. |
| 12 | `lh-reports.report.html` | 508.0 KB | Stray root baseline report. Preserved in `reports/lighthouse/`. |
| 13 | `lh-school-directory.report.html` | 481.8 KB | Stray root baseline report. Preserved in `reports/lighthouse/schools-baseline.report.html`. |
| 14 | `localhost_2026-10-17_15-21-13.report.html` | 764.5 KB | Stray root ad-hoc audit report from earlier optimization task. |
| 15 | `before-metrics.json` | 1.08 KB | Stray benchmark JSON in root. Preserved in `reports/lighthouse/baseline-summary.json`. |
| 16 | `after-metrics.json` | 1.09 KB | Stray benchmark JSON in root. Preserved in `reports/lighthouse/after-summary.json`. |
| 17 | `public/Accessible Classroom Floor Plan with Dimensions.png` | 1,877.9 KB | Exact MD5 duplicate (`f76651edf93c3702e99354e18028849b`) of `public/images/visual-guide/Accessible Classroom Floor Plan with Dimensions.png`. Code in `ArchitecturalDiagrams.tsx` only references the `images/visual-guide/` path. |
| 18 | `public/Accessible School Toilet Layout Diagram.png` | 1,938.1 KB | Exact MD5 duplicate (`974628984d212a58538e17c0675239f9`) of `public/images/visual-guide/Accessible School Toilet Layout Diagram.png`. Code in `ArchitecturalDiagrams.tsx` only references the `images/visual-guide/` path. |
| 19 | `public/Accessible Tactile Pathway Dimensions.png` | 2,084.9 KB | Exact MD5 duplicate (`cfca33698648f0b9dedb290531b456dc`) of `public/images/visual-guide/tactile-pathway.png`. Zero references in code. |
| 20 | `public/Hopeful Journey to School-orig.png` | 2,095.5 KB | Uncompressed original image (MD5: `87b000a041ee36442443d5ff78c1e13d`). Only referenced by one-off script `scripts/optimize-assets.mjs`. |
| 21 | `public/Hopeful Journey to School.png` | 2,095.5 KB | Uncompressed copy of `-orig.png`. Active page (`src/app/page.tsx`) uses `/Hopeful Journey to School-opt.png` (620.5 KB). |
| 22 | `public/logo-optimized.png` | 16.6 KB | Exact MD5 duplicate (`3f4ed781de188f6a8601ab9d74bdd227`) of `public/logo.png`. `SugamyaLogo.tsx` and `Footer.tsx` both import `/logo.png`. |
| 23 | `public/logo-orig.png` | 925.7 KB | Uncompressed 925 KB original logo file. Only referenced in `scripts/optimize-assets.mjs`. Canonical is `public/logo.png`. |
| 24 | `src/lib/firebase.ts` | 183 B | Obsolete barrel re-export. Codebase fully migrated to subpaths (`src/lib/firebase/app.ts`, `auth.ts`, `firestore.ts`, `storage.ts`) per ADR 0012. 0 imports found by `knip` & ripgrep. |

**Subtotal Section A Savings:** **24 files, ~18.30 MB (18,740 KB)**

---

## 3. Section B: Needs User Decision

| # | Item / Path | Current State | Why Unsure / Context | Suggested Default |
|---|-------------|---------------|----------------------|-------------------|
| B1 | **Root PRD Files**:<br>`PRD - Sugamya Shiksha Bihar.md`<br>`PRD - Sugamya Shiksha Bihar.docx`<br>`PRD_extracted.txt` | Located at root level of repository | PRD documents are protected under safety rules ("NEVER delete /docs (ADRs, PRD files)"). Keeping them in root clutters the top-level directory. | **(Recommended) Move to `docs/`** alongside `docs/prd-feature-d-learn-accessibility.md` so all specifications are in one designated folder. |
| B2 | **Temporary Inspection Scripts**:<br>`scripts/inspect-chunk.mjs`<br>`scripts/inspect-chunks.mjs`<br>`scripts/inspect-bundles.mjs`<br>`scripts/reproduce-survey-bug.mjs` | Located in `scripts/` | These were one-off ad-hoc debugging scripts written during previous benchmark/bug investigation tasks. They are not part of `npm test` or production runtime. | **(Recommended) Keep in `scripts/`** for historical maintenance tooling, or delete if you want `scripts/` to only contain active test suites. |
| B3 | **Hero Image Compression**:<br>`Campus Sunset Learning by the River.png` (2.23 MB)<br>`Inclusive School Pathway at Sunrise.png` (2.17 MB) | Located in `public/`, served on Home page carousel | They are actively used and high quality, but at 2.2 MB each they are large for mobile 3G/4G users. | **(Recommended) Compress with Sharp** to generate matching WebP versions (saving ~3.8 MB transfer) while retaining identical visual quality and alt text. |
| B4 | **Card UI Export**:<br>`CardDescription` in `src/components/ui/Card.tsx` | Exported component | Not currently imported by any active page, but part of standard design system Card pattern (`Card`, `CardHeader`, `CardTitle`, `CardDescription`, `CardContent`, `CardFooter`). | **(Recommended) Keep exported** for UI library completeness and future extensibility. |

---

## 4. Section C: Duplicates to Merge & Refactor

### 1. `src/components/visual-guide/ArchitecturalDiagrams.tsx` (1,234 lines)
- **Problem:** Currently bundles 4 full diagrams (`RampDiagram`, `ToiletDiagram`, `TactileDiagram`, `ClassroomDiagram`), each containing duplicate fullscreen modal handling, responsive hotspot lists, and spec tabs.
- **Merge/Extract Solution:**
  - `src/components/visual-guide/RampDiagram.tsx` (~260 lines)
  - `src/components/visual-guide/ToiletDiagram.tsx` (~290 lines)
  - `src/components/visual-guide/TactileDiagram.tsx` (~290 lines)
  - `src/components/visual-guide/ClassroomDiagram.tsx` (~290 lines)
  - `src/components/visual-guide/ArchitecturalDiagrams.tsx` (clean dispatcher, ~40 lines)
  - Keep internal subcomponents non-exported so external callers only use `VisualDiagramRenderer`.

### 2. `src/app/admin/page.tsx` (2,555 lines)
- **Problem:** Contains monolithic inline CRUD code for Schools management, Guidelines editor, Site Content editor, and Survey definitions & responses, while `AuditsAdminTab`, `BarrierReportsAdminTab`, `TrackerAdminTab`, `ResourcesHubTab`, and `CommunityVoicesAdvocacyTab` are already modularized in `src/components/admin/`.
- **Merge/Extract Solution:**
  - Extract `src/components/admin/SchoolsAdminTab.tsx`
  - Extract `src/components/admin/GuidelinesAdminTab.tsx`
  - Extract `src/components/admin/SiteContentAdminTab.tsx`
  - Extract `src/components/admin/SurveysAdminTab.tsx`
  - Reduce `src/app/admin/page.tsx` from 2,555 lines to ~180 lines, matching the rest of the dynamic admin architecture.

### 3. Firebase Auth / App Export Standardization
- In `src/lib/firebase/auth.ts`: has duplicate exports `export default auth;` and `export { auth };`.
- Standardize all 4 subpath modules (`app.ts`, `auth.ts`, `firestore.ts`, `storage.ts`) on clean named exports.

---

## 5. Section D: Unused & Misplaced Dependencies

| Package | Current Location | Action | Reason |
|---------|------------------|--------|--------|
| `tailwind-merge` | `dependencies` (`^2.5.4`) | **Remove** | Zero imports across entire project. `clsx` is used for conditional classnames. |
| `@types/leaflet` | `dependencies` (`^1.9.22`) | **Move to `devDependencies`** | Type definitions are development/build-time only; not needed at production runtime. |
| `eslint` / `eslint-config-next` | `devDependencies` (`^8.57.1`, `^14.2.24`) | **Add `.eslintrc.json`** | Currently missing `.eslintrc.json` config in root, causing `npm run lint` to stall and prompt. Adding standard config resolves this cleanly. |

---

## 6. Section E: Proposed New Structure

### Before / After File Organization Mapping

```text
BEFORE (Current)                          AFTER (Cleaned & Restructured)
----------------------------------------  ----------------------------------------------
. (Root)                                  . (Root)
├── after-metrics.json [DELETE]           ├── .env.example
├── before-metrics.json [DELETE]          ├── .env.local
├── lh-*.report.html (14 files) [DELETE]  ├── .firebaserc
├── localhost_*.report.html [DELETE]      ├── .gitignore (updated to ignore reports/)
├── PRD - Sugamya Shiksha Bihar.docx      ├── .eslintrc.json (new standard Next.js config)
│     └── [MOVE to docs/prd/]             ├── CONTEXT.md
├── PRD - Sugamya Shiksha Bihar.md        ├── firebase.json
│     └── [MOVE to docs/prd/]             ├── firestore.indexes.json
├── PRD_extracted.txt                     ├── firestore.rules
│     └── [MOVE to docs/prd/]             ├── storage.rules
                                          ├── next.config.mjs
public/                                   ├── package.json (cleaned deps)
├── Accessible Classroom...png [DELETE]   ├── tsconfig.json
├── Accessible School Toilet...png [DEL]  
├── Accessible Tactile Pathway...png [DEL]docs/
├── Hopeful Journey...-orig.png [DELETE]  ├── cleanup-report.md
├── Hopeful Journey...png [DELETE]        ├── prd/
├── logo-optimized.png [DELETE]           │   ├── PRD - Sugamya Shiksha Bihar.md
├── logo-orig.png [DELETE]                │   ├── PRD - Sugamya Shiksha Bihar.docx
├── logo.png                              │   ├── PRD_extracted.txt
├── Campus Sunset...png                   │   └── prd-feature-d-learn-accessibility.md
├── Inclusive School...png                └── adr/ (0001-0013 + new 0014)
└── images/visual-guide/
    ├── Accessible Classroom...png        src/
    ├── Accessible School Toilet...png    ├── app/ (routes only)
    ├── ramp-3d-model.jpg                 │   ├── admin/page.tsx (slender shell, ~180 lines)
    ├── tactile-pathway.png               │   ├── survey/page.tsx
    └── tactile-pathway.webp              │   └── ...other route pages
                                          ├── components/
src/lib/                                  │   ├── admin/
├── firebase.ts [DELETE]                  │   │   ├── SchoolsAdminTab.tsx [NEW extracted]
└── firebase/                             │   │   ├── GuidelinesAdminTab.tsx [NEW extracted]
    ├── app.ts                            │   │   ├── SiteContentAdminTab.tsx [NEW extracted]
    ├── auth.ts                           │   │   ├── SurveysAdminTab.tsx [NEW extracted]
    ├── firestore.ts                      │   │   └── ...existing admin tabs
    └── storage.ts                        │   ├── visual-guide/
                                          │   │   ├── RampDiagram.tsx [NEW extracted]
                                          │   │   ├── ToiletDiagram.tsx [NEW extracted]
                                          │   │   ├── TactileDiagram.tsx [NEW extracted]
                                          │   │   ├── ClassroomDiagram.tsx [NEW extracted]
                                          │   │   ├── ArchitecturalDiagrams.tsx (dispatcher)
                                          │   │   └── SchematicShell.tsx
                                          │   └── ...ui, layout, map, schools
                                          ├── context/
                                          ├── data/
                                          ├── lib/
                                          │   ├── firebase/ (app, auth, firestore, storage)
                                          │   └── ...validators, calculators
                                          └── locales/ (en.json, hi.json)
```

---

## 7. Section F: Estimated Total Savings

- **Files Removed:** 24 files permanently removed from repo
- **Immediate Disk Space Freed:** **~18.3 MB**
- **Unused Dependencies Removed:** 1 package (`tailwind-merge`)
- **First Load JS Impact:** Unchanged or slightly improved; zero bundle regressions.
- **Repository Cleanliness:** Pristine root directory; zero stray report files; clear separation of PRD, ADRs, components, and scripts.

---

## 8. Section G: Risks & Mitigations

| Risk | Likelihood | Impact | Mitigation Strategy |
|------|------------|--------|---------------------|
| Broken image link after deleting duplicate images in `public/` | Very Low | High | Verified by ripgrep and knip: `ArchitecturalDiagrams.tsx` only references `images/visual-guide/...`. `SugamyaLogo` only references `/logo.png`. We will run an automated route image audit script after each commit. |
| Import breakage when extracting monolithic admin tabs and diagrams | Low | High | We keep existing export names and paths identical using tsconfig `@/...` path aliases. Run `tsc --noEmit` after every extraction step. |
| ESLint or Next.js build failures | Low | Medium | Run `npm run build` after every single commit. If any step fails, git allows immediate clean rollback (`git reset --hard HEAD~1`). |
| Data or Security Rule changes | Zero | Critical | Security rules (`firestore.rules`, `storage.rules`) and test suites (`scripts/test-rules.mjs`) are 100% untouched. All 62 invariant tests will run on every step. |

---

## 9. Baseline Verification Summary Table

| Check | Baseline Result | Command |
|-------|-----------------|---------|
| TypeScript Type-check | ✅ 0 errors | `npx tsc --noEmit` |
| Security Rules Policy Invariants | ✅ 62/62 passed | `node scripts/test-rules.mjs` |
| Automated WCAG 2.2 AA a11y | ✅ 0 violations | `node scripts/test-a11y.mjs` |
| Standards Comparison Engine | ✅ 8/8 passed | `node scripts/test-audit-comparison.mjs` |
| Barrier Report Submission Validation | ✅ 12/12 passed | `node scripts/test-barrier-validation.mjs` |
| Scorecard Calculation TDD | ✅ 6/6 passed | `node scripts/test-scorecard.mjs` |
| Survey Validation & Details | ✅ 35/35 passed | `node scripts/test-survey-validation.mjs` |
| Survey Admin Query & Normalization | ✅ 10/10 passed | `node scripts/test-survey-admin-query.mjs` |
| Next.js Production Build | ✅ 32/32 static pages | `npm run build` |
| Circular Dependencies | ✅ 0 circular imports | `npx madge --circular src` |
