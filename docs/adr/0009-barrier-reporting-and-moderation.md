# ADR 0009: Barrier Reporting, Privacy-Gated Contact Storage, and 3-State Moderation

Status: **accepted**

## Context

Under **PRD Section 6.1 item 11**, **Section 10**, and **Section 11.2 & 11.3**, the platform enables community members (students, parents, teachers, and advocates) to report physical infrastructure barriers in Danapur schools with photos and descriptions.

Key ethical and architectural constraints:
1. **Child Protection & Privacy**: Photos must not disclose identifiable faces of children unless explicit parental consent is recorded.
2. **Reporter Confidentiality**: Contact details (name, phone, email) must never be publicly readable or exposed in client query payloads.
3. **Pre-Publication Moderation**: Submissions must default to `pending` status and only become public once verified by the research administrator.
4. **Anti-Spam & Rate Limiting**: Public endpoints must reject bots, automated rapid firing, and oversized uploads.

## Decision

We designed a decoupled, privacy-first reporting architecture:

1. **Pure Validation Seam (`src/lib/barrierReportValidation.ts`)**:
   - Enforces a mandatory **3-Clause Consent**:
     - Clause 1: Research usage under NCPEDP Fellowship.
     - Clause 2: Child privacy / confirmation of no unconsented faces.
     - Clause 3: Acknowledgment of moderation & pending review before publication.
   - Requires valid school name, category, and minimum 15-character detailed description.
   - Enforces upload limits: maximum 3 photos, each $\le 5\text{MB}$, restricted to `image/jpeg`, `image/png`, and `image/webp`.
   - Incorporates automated bot honeypots and client-side submission timing checks ($\ge 2000\text{ms}$).

2. **Isolated Private Contact Architecture (`/private/contact`)**:
   - The public document `barrierReports/{reportId}` stores only `schoolId`, `schoolName`, `category`, `description`, `photos`, `hasContact: boolean`, `status`, and `createdAt`.
   - Optional reporter contact details are stored in an isolated sub-collection document `barrierReports/{reportId}/private/contact`.
   - In `firestore.rules`, the sub-collection rule `match /private/{subdoc} { allow read, write: if isAdmin(); }` ensures that public clients cannot read contact details even if querying the report.

3. **3-State Verification Workflow**:
   - Reports enter as `pending`.
   - The Admin Moderation Dashboard (`src/components/admin/BarrierReportsAdminTab.tsx`) enables the researcher to inspect full report details, securely load private contact details for verification follow-ups, and transition reports to:
     - `verified`: Published publicly to `/report-barrier` and linked to school profiles, with optional researcher observation notes.
     - `rejected`: Kept private with internal administrative rejection reasons.
     - `delete`: Removed permanently if identified as spam.

4. **Automated TDD Test Suites**:
   - `scripts/test-barrier-validation.mjs`: 12 automated unit tests verifying validation boundaries, privacy sanitization, and error handling.
   - `scripts/test-rules.mjs`: 38 automated policy tests enforcing Firestore & Storage security rules invariants.

## Consequences

- Public visitors can safely report barriers without risk of doxxing or data scraping.
- Full compliance with research ethics and child protection guidelines.
- School Management Committees (SMC) and community members receive transparent, verified barrier documentation.
