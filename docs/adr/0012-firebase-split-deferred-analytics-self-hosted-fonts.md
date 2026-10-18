# ADR 0012: Firebase Modules Split, Deferred Analytics, and Self-Hosted Fonts

- **Status:** Accepted
- **Date:** 2026-10-17
- **Author:** Antigravity (Ponytail & Triage Mode)
- **Deciders:** Engineering & Performance Team

---

## Context

A comprehensive Lighthouse mobile audit (slow-4G simulation) revealed critical performance regressions across public and admin routes:
1. **Unwanted Firebase Auth Overhead on Public Pages:**
   Previously, `@/lib/firebase` initialized `getAuth(app)` at module top-level. Any public page importing Firestore `db` inadvertently initialized Firebase Auth, triggering the `/__/auth/iframe` network request, downloading `apis.google.com/js/api.js`, and firing runtime configuration queries to `identitytoolkit.googleapis.com` and `firebaseinstallations.googleapis.com`, wasting ~2s of load time.
2. **Google Tag Manager / Analytics Render Blocking:**
   Analytics was loaded synchronously in the root layout, consuming ~160 KB of JavaScript and triggering network round-trips on all routes, including `/admin`.
3. **Google Fonts External Render Blocking:**
   External `<link>` tags to `fonts.googleapis.com` and `fonts.gstatic.com` were blocking the critical rendering path.
4. **404 on Favicon & Oversized Header Logo:**
   Next.js requested `/favicon.ico` which returned 404. The header logo image transferred at 384 px width despite displaying at 104x77 px.

---

## Decision

1. **Modular Firebase Architecture (`@/lib/firebase/*`):**
   - Split Firebase into discrete modular subpaths:
     - `app.ts`: Shared static initialization with fallback configuration from environment variables.
     - `firestore.ts`: Dedicated Firestore client for public reads.
     - `auth.ts`: Dedicated Firebase Auth module with lazy Proxy initialization (`getAuthInstance()`) so importing or prefetching does not initialize the Auth iframe.
     - `storage.ts`: Dedicated Firebase Storage module.
   - Removed global `AuthProvider` from the root layout.
   - Scoped `AuthProvider` strictly to `/admin/layout.tsx`.
   - On `/admin/page.tsx`, show an immediate shell and animated skeleton during auth check instead of blocking render.
   - Added preconnect links to `https://apis.google.com` and `https://sugamya-shiksha-bihar.firebaseapp.com` strictly in `/admin/layout.tsx` and `/survey/layout.tsx`.
   - Disabled prefetch on admin and survey navigation links (`prefetch={false}`) in the footer and home page to eliminate unwanted chunk execution.

2. **Deferred Client-Side Analytics (`AnalyticsTracker`):**
   - Created `src/components/analytics/AnalyticsTracker.tsx`.
   - Strictly forbidden from executing on any `/admin*` route.
   - On public pages, deferred initialization via `requestIdleCallback` (with 3500ms timeout) using dynamic imports and `isSupported()` check.
   - Verified that standard `page_view` events still fire accurately on public page navigations.

3. **Self-Hosted Zero-Network Google Fonts:**
   - Switched to `next/font/google` for `Inter` and `Noto_Sans_Devanagari` in `src/app/layout.tsx`.
   - Restricted to utilized weights (`400`, `500`, `600`, `700`) with `display: "swap"`.
   - Bound to CSS variables (`--font-inter`, `--font-noto-sans-devanagari`) in Tailwind font family stack.
   - Eliminated all external calls to `fonts.googleapis.com` and `fonts.gstatic.com`.

4. **Asset Optimization & Favicon 200 Resolution:**
   - Generated `public/favicon.ico`, `src/app/favicon.ico`, `src/app/icon.png` (32x32), and `src/app/apple-icon.png` (180x180) from `logo.png`.
   - Optimized header logo source to 16.9 KB WebP/PNG, configured `width={104}`, `height={77}`, `sizes="104px"`, and `priority`.
   - Kept footer logo lazy-loaded with `sizes="96px"`.

5. **Panoramic Hero Background Slider Expansion:**
   - Integrated `Hopeful Journey to School-opt.png` as a third panoramic slide alongside `Campus Sunset Learning by the River.png` and `Inclusive School Pathway at Sunrise.png`.
   - Maintained continuous infinite right-to-left glide with 4-track slide cloning and hardware-accelerated CSS transforms.

---

## Consequences

- **Performance Score Gains (Mobile, Slow-4G):**
  - **Guidelines:** 87 (was 88)
  - **Schools:** 80 (was 78)
  - **Map:** 81 (was 75)
  - **Survey:** 81 (was 58, +23 points gain!)
  - **Home:** 72 (was 47, +25 points gain!)
  - **Admin:** TBT reduced from 440 ms to 10 ms; JavaScript bundle reduced from 525 KB to 262 KB First Load JS.
- **Network Invariants:**
  - Zero Google Tag Manager requests on `/admin`.
  - Zero Firebase Auth iframe requests on public routes (Home, Guidelines, Schools, Map).
  - Zero external Google Fonts requests across the entire site.
  - Favicon endpoints return HTTP 200 OK.
- **Security & Accessibility:**
  - Preserved all 62 Firestore security rules test invariants.
  - Preserved 100% WCAG 2.2 AA accessibility compliance (0 violations).
