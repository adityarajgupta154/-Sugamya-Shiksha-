# 0007. Smart Accessibility Audit Tool & Configurable Standards Engine

Date: 2026-10-16
Status: Accepted

## Context

The PRD mandates a mobile-first Smart Accessibility Audit Tool (Section 6.2-A, Task 9) used by researchers during physical on-site school visits in Danapur, Patna. The tool must evaluate physical measurements (ramp slope, door width, railings, toilets, classrooms, pathways, signage, drinking water, emergency exits) against statutory standards, automatically flagging deficiencies and citing official sources.

Open Question Q1 highlighted that standard thresholds must NOT be hardcoded from memory, but rather derived from the official *Accessibility Code for Educational Institutions 2024* and *Harmonised Guidelines 2021*, stored as editable configuration.

## Decision

1. **Configurable Data Model (`standards` collection)**:
   - Standards are represented as structured configuration objects in Firestore `standards/{standardId}`, containing `parameter`, `unit`, `operator`, `thresholdValue`, `thresholdDisplay`, `sourceDocument`, `sourceClause`, `severity`, and bilingual deficiency messages.
   - Admin users can edit threshold values, operator rules, and clauses from the Admin Portal without requiring code re-deployments.

2. **Decoupled Comparison Engine (`src/lib/auditComparison.ts`)**:
   - Implemented as a pure functional module with comprehensive unit & integration tests (`scripts/test-audit-comparison.mjs`).
   - Compares an `AuditMeasurements` payload against active `AccessibilityStandard[]` instances.
   - Flags granular `DeficiencyFlag` objects with severity (`critical`, `major`, `minor`) and explicit statutory citations.
   - Computes overall `complianceRate` (0–100%) and categorizes deficiencies.

3. **Draft -> Verified Audit Workflow**:
   - Audits are persisted to Firestore `audits/{auditId}` with status `draft` or `verified`.
   - Security rules and public directory queries strictly filter for `status === "verified" || published === true`.
   - When an audit is marked `verified`, it automatically syncs with the school's profile in `schools/{schoolId}` (updating `score`, `auditStatus`, and verified `facilities`).

4. **Mobile-First Field Inspection UX**:
   - Single-column responsive layout with large touch targets ($\ge 48\text{ px}$) tailored for one-handed operation while standing in schoolyards with measuring tapes and digital inclinometers.
   - 9-section stepper with real-time live deficiency feedback and per-section camera/photo upload to Firebase Storage `audits/{auditId}/*`.

## Consequences

- Zero hardcoded memory values; full transparency with legal standards.
- Safe workflow preventing provisional field notes from prematurely altering public research data.
- Instant, automated testing coverage via TDD suite.
