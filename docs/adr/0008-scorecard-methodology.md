# 0008. School Accessibility Scorecard & 100-Point Weighted Scoring Methodology

Date: 2026-10-16
Status: Accepted

## Context

The PRD mandates a 100-point school accessibility score computed from verified audit data (Section 6.2-C, Task 10). The score must reflect empirical on-site measurements across universal design indicators rather than subjective impressions.

Open Question Q2 and Assumption A2 required confirming category weights and scoring rules with the client ("Grill with Docs"). Key challenges included:
1. Translating diverse multi-dimensional physical indicators (slopes, widths, toilet dimensions, alarms) into a rigorous, explainable 100-point scale.
2. Complying with WCAG 2.2 AA (specifically Guideline 1.4.1 Use of Color: scores, tiers, and breakdown bars must never rely on color alone).
3. Maintaining public transparency through an explicit "How this score is calculated" methodology view.
4. Ensuring researchers and the public clearly understand that this is an independent academic research score, NOT an official government certification or building NOC.

## Decision

1. **4 Architectural Pillar Weights (100 Points Total)**:
   - **Entrance & Ramps (`entrance`)**: **30 points** (Ramps, doors, pathways, railings).
   - **Toilets & Water (`toilets`)**: **30 points** (CwSN accessible toilet cubicle, turning circle, grab rails, WC height, drinking water tap height).
   - **Classrooms & Desks (`classrooms`)**: **25 points** (Aisle clear width, step-free access, wheelchair-accessible desks).
   - **Signage & Emergency Safety (`safety`)**: **15 points** (Braille/tactile signage, high contrast, emergency exit door clear width).

2. **Mathematical Formula**:
   $$\text{Category Score} = \left(\frac{\text{Compliant Parameters in Category}}{\text{Evaluated Parameters in Category}}\right) \times \text{Category Weight (pts)}$$
   $$\text{Overall Score} = \sum_{c=1}^{4} \text{Category Score}_c \quad (0\text{--}100\text{ Points, Rounded Integer})$$
   - If an entire pillar has not yet been audited, its evaluated parameters count as zero and points earned are zero.

3. **3-Tier Classification (Accessible & Non-Colour-Only)**:
   - **80–100 Points**: *High Accessibility* / *उच्च सुगम्यता* (Symbol: `✓`, emerald badge).
   - **50–79 Points**: *Moderate Accessibility* / *मध्यम सुगम्यता* (Symbol: `▲`, amber badge).
   - **0–49 Points**: *High Barriers* / *गंभीर बाधाएं* (Symbol: `✕`, rose badge).
   - Every status and tier is rendered with an explicit text label, geometric icon/symbol, fraction, and percentage (WCAG 1.4.1 compliant).

4. **Configurable Schema in Firestore (`scoringConfig/v1`)**:
   - Stored in Firestore collection `scoringConfig` with versioning (`v1`).
   - Admins can customize pillar weights, tier thresholds, and bilingual copy directly from the Admin Portal without code redeployment.
   - Offline fallback seeded in `src/data/scoringConfigData.ts`.

5. **Mandatory Research Disclaimer**:
   - Displayed wherever a score appears (School Detail page scorecard, School Directory cards, and Methodology modal):
     - *Hindi*: "यह शोध मूल्यांकन है, कोई आधिकारिक सरकारी प्रमाणन नहीं।"
     - *English*: "Academic research score based on standard indicators — not an official government certification."

6. **Interactive Methodology View (`ScorecardMethodologyModal.tsx`)**:
   - Accessible keyboard-navigable modal with focus trap explaining the exact formula, pillar weights, tier benchmarks, and citing official statutory documents (*Accessibility Code for Educational Institutions 2024*, *Harmonised Guidelines 2021*, *RPwD Act 2016*).

## Consequences

- Direct, predictable correlation between verified physical audit measurements and the resulting school score.
- Full compliance with WCAG 2.2 AA non-colour-only accessibility.
- Zero legal ambiguity regarding academic research nature vs government certification.
- Verified with Matt Pocock's TDD methodology: pure calculation engine `calculateScorecard` passes all 6 comprehensive test suites.
