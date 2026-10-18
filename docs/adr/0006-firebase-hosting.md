# Firebase App Hosting for Next.js SSR

We chose **Firebase App Hosting** (not plain Firebase Hosting) to serve the Next.js application.

**Context:** Plain Firebase Hosting only serves static files. Our Next.js app needs server-side rendering for SEO on public pages (guidelines, school profiles, research reports) and for API routes (Cloud Functions integration). Firebase App Hosting supports Next.js SSR natively.

**Alternatives considered:**
- *Firebase Hosting + Cloud Functions for SSR:* Manual setup, more fragile, requires custom rewrites.
- *Vercel:* Excellent Next.js support but splits the stack away from Firebase ecosystem.

**Consequences:** Requires Firebase App Hosting setup (currently in preview/GA depending on region). Build and deploy pipeline configured through `firebase.json` and `apphosting.yaml`.
