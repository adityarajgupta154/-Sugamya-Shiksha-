# 0011. Survey Requires Google Sign-In and Basic Respondent Verification

Date: 2026-10-17

## Status
Accepted (Change Request to PRD Section 6.1, 10, 11.1, 11.3)

## Context
Originally, the platform allowed anonymous survey submissions with client-side rate limiting. However, to preserve research integrity under Sugamya Shiksha Bihar, prevent duplicate responses (ballot-stuffing), and verify respondent demographic distribution (student vs. parent vs. teacher vs. advocate), a verified authentication mechanism was required for survey participation.

The platform must balance data integrity with user privacy and public access:
1. Public visitors must still be able to discover and read the survey title, research objectives, and target audience without signing in.
2. The rest of the platform (Home, Guidelines, School Directory, Interactive Map, Reports, Resources) must remain 100% login-free.
3. Every survey response must be tied to a verified Google account, limiting participation to strictly one submission per survey per account (with editing allowed before final submission).
4. Respondent personal data (Name, Contact Number, Email, Role) is subject to India's Digital Personal Data Protection (DPDP) Act 2023 and must never be exposed publicly.

## Alternatives Considered

1. **Anonymous Submissions with IP / Device Fingerprinting:**
   - *Pros:* Zero user friction.
   - *Cons:* Trivially bypassed via VPNs, incognito windows, or multiple browser tabs; cannot correlate demographic veracity; high spam vulnerability.

2. **Decoupled `respondents/{uid}` Subcollection + Anonymized `surveyResponses/{id}`:**
   - *Pros:* Separates personal identity from answers physically.
   - *Cons:* Requires multi-document transactions/batched writes on client submit, complicates admin CSV export, and creates orphaned records if one write fails.

3. **Deterministic Single Document `surveyResponses/{surveyId}_{uid}` with Field-Level Security Rules (Chosen):**
   - *Pros:*
     - Enforces "strictly 1 response per survey per Google account" at the storage layer via document ID uniqueness.
     - Single atomic write (`setDoc`).
     - Supports pre-filling and draft re-read (`resource.data.uid == request.auth.uid`) so respondents can see their existing submission and update answers if desired.
     - Completely prohibits public read access; only the author and authenticated admins can view identified responses.
     - Public dashboards and charts consume only anonymized, aggregated statistics computed by administrative Cloud Functions or aggregated reporting pipelines.

## Decision

1. **Scoped Google Authentication:**
   - Integrate Firebase Authentication with Google Auth Provider (`GoogleAuthProvider`) strictly inside the `/survey` route.
   - Provide popup sign-in with redirect fallback for mobile devices.
   - Maintain the rest of the site (Home, Guidelines, Directory, Map, Tracker) completely login-free.

2. **Deterministic Document ID & Submission Limits:**
   - Store responses under `surveyResponses/${surveyId}_${request.auth.uid}`.
   - Enforce via Firestore Security Rules that `request.resource.data.uid == request.auth.uid` and `request.resource.data.surveyId == surveyId`.

3. **Mandatory Respondent Verification & DPDP 2023 Compliance:**
   - Collect only:
     - Full Name (required; prefilled from Google `displayName`, editable, 2–100 chars).
     - Contact Number (required; validated 10-digit Indian mobile number).
     - Email (read-only; verified Google account email).
     - Role (required; strictly `'student' | 'parent' | 'teacher' | 'advocate'`).
     - Consent: Mandatory bilingual research privacy agreement timestamped upon submission.
   - Personal data is never displayed publicly or on research charts.
   - Admin panel provides search, filter, CSV export of consented data, and a dedicated **"Delete Respondent Data"** action honoring data erasure rights under India's DPDP Act 2023.

4. **Shared Data Contract & Legacy Backward Compatibility:**
   - Shared constants file `src/data/surveyConstants.ts` unifies collection naming (`SURVEY_COLLECTIONS.RESPONSES`), ID generation (`getSurveyResponseDocId`), and response normalization (`normalizeSurveyResponse`).
   - Legacy responses submitted prior to the Google sign-in requirement (lacking `uid`, `email`, or with alternate field names) are safely normalized without deleting historical survey findings.

## Consequences

### Positive
- Guarantees survey data integrity and prevents duplicate submissions.
- Verifiable demographic insights for Sugamya Shiksha Bihar research findings.
- Public pages maintain zero auth performance overhead.
- Full compliance with Indian data privacy regulations.

### Negative / Operational Requirements
- Firebase Console must have Google Sign-in enabled under Authentication > Sign-in method.
- Authorized domains must include `sugamya-shiksha-bihar.firebaseapp.com`, `sugamya-shiksha-bihar.web.app`, `localhost`, and any custom production domain.
- OAuth consent screen must have a valid support email configured in Google Cloud Console.
