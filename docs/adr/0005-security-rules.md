# Firestore & Storage Security Rules — Layered Public/Admin Model

Status: **accepted**

We use a **layered security model** in Firestore Security Rules (`firestore.rules`) and Storage Security Rules (`storage.rules`), verified via automated TDD policy tests (`scripts/test-rules.mjs`):

1. **Public read-only** — Collections/documents where `published == true` or `status == "verified"` are readable by anyone. Guidelines (`/guidelines/*`) and public site content (`/siteContent/*`) are readable by all visitors. Unpublished schools and pending audits remain strictly hidden from unauthenticated visitors.
2. **Public create-only** — `barrierReports`, `surveyResponses`, and `contactSubmissions` allow public creation with status enforced as `"pending"`. Public users cannot self-verify reports. Contact submissions and reporter contact details are never publicly readable.
3. **Admin-only writes** — All collection writes (`guidelines`, `siteContent`, `schools`, `audits`, `standards`) require Firebase Auth with role validation via `users/{uid}` (`role == "admin"`).
4. **Storage Rules** — Public can upload barrier report images up to 5MB (`image/*`); admin has full read/write/delete access.
5. **Automated Verification** — Evaluated via a test harness in `scripts/test-rules.mjs` verifying 18 critical security invariants across public, authenticated non-admin, and admin actors.

**Context:** The platform serves two user types: anonymous public visitors (browse research, read guidelines, report barriers) and the researcher/admin (full content and audit management). Public users never log in.
