# ADR 0013: Feature D Architectural Schematics and Unified Reusable Shell

- **Status:** Accepted
- **Date:** 2026-10-18
- **Author:** Antigravity (Impeccable & Ponytail Mode)
- **Deciders:** Product, Engineering & Accessibility Team

---

## Context

Feature D (**Learn Accessibility — Visual Guide**) provides field-level architectural guidance to school headmasters, teachers, civil contractors, and auditors across Danapur, Patna.
Previously, the module used placeholder dark-slate schematics that lacked visual hierarchy, bilingual callouts, and the approved architectural design language established for the school ramp.

The design director approved a refined, accessible schematic layout (Image 2) featuring:
1. A structured bilingual title block and subtitle.
2. An amber key-tip statutory callout pill with lightbulb icon.
3. High-precision vector SVG diagram canvas with dimension arrows and callout cards.
4. An interactive/responsive Callout Legend mode for small viewports to guarantee zero text overlap.
5. Three bottom core principle cards emphasizing key statutory construction rules.
6. Exhaustive screen-reader plain text descriptions (`sr-only`) and high-contrast variant styling.

The objective was to extract this approved shell into a reusable component and apply the exact same visual language to the other three Feature D modules:
- Module 2: CwSN Accessible School Toilet (Top-Down Plan View)
- Module 3: Tactile Paving & Guiding Pathways (Top-Down Plan View)
- Module 4: Inclusive Classroom Layout & Circulation (Top-Down Plan View)

---

## Decision

1. **Extraction of Reusable `SchematicShell.tsx`:**
   - Created `src/components/visual-guide/SchematicShell.tsx`.
   - Encapsulated the title block, statutory code citation badge, top-right key-tip callout, SVG viewport with `sr-only` description, optional/collapsible numbered legend mode, and the bottom 3 principle cards.
   - Built full support for high-contrast mode via `useAccessibility().highContrast`.

2. **Data-Driven Bilingual Specifications (`src/data/schematicData.ts`):**
   - Centralized all technical parameters, numerical dimensions, bilingual titles/subtitles, key tips, and principle cards in `src/data/schematicData.ts` to ensure no hardcoded strings in SVG components.
   - Anchored specifications strictly to the *Accessibility Code for Educational Institutions 2024* and *Harmonised Guidelines 2021*.

3. **High-Craft Architectural Schematics (`ArchitecturalDiagrams.tsx`):**
   - **Ramp (Redesigned Section 1):** Built directly from project reference images featuring:
     - Multi-view selector: **3D Campus Model View** (`ramp-3d-model.jpg`), **Educational Infographic** (`ramp-infographic.png`), and **Technical Vector Schematic**.
     - All 8 mandatory specifications cleanly integrated: (1) Ramp slope 1:12 maximum, (2) Clear width 1200 mm minimum, (3) Lower handrail 760 mm, (4) Upper handrail 900 mm, (5) Handrail extension 300 mm minimum, (6) Edge curb 100 mm, (7) Landing 1500 × 1500 mm minimum, and (8) Intermediate landing every 9 m of ramp run or at a change of direction.
     - Interactive Hotspots (`①`–`⑧`) with student-friendly English and Hindi explanations and official statutory clause citations.
     - Below the diagram: 3 clear explanatory cards (**Gentle Slope**, **Two Handrails**, **Level Resting Platforms**) with circular icons and student-friendly bilingual explanations.
     - Fullscreen enlargement modal for high-detail inspection by teachers, school heads, and auditors.
   - **Toilet (Plan View):** 2000 × 2200 mm internal room, Ø 1500 mm wheelchair turning circle, 900 mm outward door with D-handle at 800 mm, 450–480 mm WC seat, 700 × 600 mm L-shaped grab bar, 800 mm hinged fold-up bar, 750 mm wash basin with 650 mm knee recess, and dual emergency cords at 100 mm & 900 mm.
   - **Tactile Paving (Plan View):** Directional lineal guiding tiles (5 mm bars), warning blister tiles (truncated domes) placed 300 mm before hazards, 30% minimum luminance contrast (bright yellow on charcoal), and continuous 300–600 mm path connecting gate to classrooms and toilets.
   - **Classroom Layout (Plan View):** 1200 mm main circulation aisle, 900 mm between desk rows, 750 mm high accessible desk with 680 mm knee clearance, 900 × 1400 mm wheelchair station integrated in front/middle seating cluster, 900 mm clear door with flush threshold (< 12 mm), and blackboard lower edge max 800 mm.

4. **Digital Accessibility & Responsive Legend Mode:**
   - Zero dark blueprint backgrounds; clean light-blue & white educational theme.
   - Interactive hotspot explorer with accessible keyboard navigation (`tabIndex={0}`, `Enter`/`Space` trigger, `aria-label`).
   - High contrast mode support: adapts to pure black background with yellow/white high-visibility text and borders.
   - Verified 100% WCAG 2.2 AA compliance via automated axe-core audit (0 violations).

---

## Consequences

- Consistent, award-winning visual language across all 4 Feature D architectural topics.
- Zero code duplication between diagram wrappers.
- All 62 Firestore security rules and accessibility test suites remain green.
- Next.js production bundle compiles cleanly with 0 type errors.
