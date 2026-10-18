# 0010. Caching, Data-Fetching, and Navigation Performance Optimization

Date: 2026-10-17

## Status
Accepted

## Context
During user testing of the production build, navigation transitions between pages and button/link clicks experienced perceptible delays, making the interface feel sluggish and frozen.

Profiling and Lighthouse diagnostics across the core application routes (Home, Guidelines, School Directory, Interactive Map, Reports, and Admin) identified several compounding performance bottlenecks:
1. **Render-Blocking External Typography:** Fonts (`Inter` and `Noto Sans Devanagari`) were loaded via synchronous `@import url(...)` in `globals.css` and redundant external `<link>` tags in `layout.tsx`, delaying First Contentful Paint (FCP) by ~5.3s on mobile 4G profiles.
2. **Missing Navigation Feedback:** The App Router lacked a `loading.tsx` boundary. When clicking links, Next.js waited for dynamic route chunks to download without providing visual feedback, creating a perceived "dead click" or UI freeze.
3. **Global Auth Overhead on Public Routes:** `<AuthProvider>` was placed at the root `layout.tsx`, forcing every public visitor to initialize Firebase Auth, execute hidden iframe handshakes (`/__/auth/iframe`), and invoke Identity Toolkit endpoints before page hydration.
4. **Sequential Data Fetch Waterfalls & Unbounded Queries:** Pages like `/schools/[id]` executed sequential `await` calls (config -> school -> audits) rather than parallelizing independent reads. Collection queries lacked explicit query limits (`limit()`), risking unbounded bandwidth and latency growth as data scales.
5. **Asset Weight:** Public assets included an uncompressed 948 KB Canva logo PNG and an uncompressed 2.14 MB hero illustration PNG, loading without native WebP/AVIF conversion or `sharp` image optimization.
6. **Eager Admin & Analytics Hydration:** Heavy admin tabs (Audits, Barriers, Schools, Users) were bundled statically, and Firebase Analytics + GTM was initialized immediately on page boot.

## Decision
We implemented a multi-layered optimization strategy strictly adhering to the "Ponytail" principle (minimal, zero-bloat surgical improvements) while fully preserving PRD features, visual design, Hindi/English bilingual support, and WCAG 2.2 AA accessibility:

1. **Self-Hosted, Display-Swapped Web Fonts (`next/font`):**
   - Replaced external `@import` and `<link>` stylesheets with Next.js built-in `next/font/google` for `Inter` and `Noto_Sans_Devanagari` using `display: 'swap'` and CSS variables (`--font-inter`, `--font-noto-devanagari`). Fonts are downloaded at build time and served from the same origin, eliminating external DNS lookups and render-blocking CSS.

2. **Instant Accessible Navigation Feedback (`loading.tsx` + `prefetch`):**
   - Created `src/app/loading.tsx` rendering an accessible skeleton screen with `role="status"`, `aria-busy="true"`, and `aria-label="Loading content / सामग्री लोड हो रही है"`. Respects `prefers-reduced-motion`.
   - Updated `Header.tsx` links with explicit `prefetch={true}` and active click feedback (`navigatingTo` state + `aria-busy`) to guarantee instant visual response within 100ms.

3. **Route-Level Auth Boundary Isolation:**
   - Moved `<AuthProvider>` out of root `layout.tsx` into `src/app/admin/layout.tsx`. Public pages render with zero Firebase Auth overhead, zero identity iframes, and zero auth token refreshes.

4. **Static Site Generation (SSG) for Dynamic Content:**
   - Converted `src/app/guidelines/[slug]/page.tsx` from dynamic client-side rendering to Server Component with `generateStaticParams()`. All 9 statutory guideline articles are pre-rendered into static HTML (`● SSG`) at build time.

5. **Query Parallelization & Bounded Pagination:**
   - Replaced sequential waterfalls with `Promise.all([fetchConfig(), fetchSchool(), fetchAudits()])`.
   - Added explicit query bounds (`limit(50)`) across all directory, map, and community queries.
   - Declared Firestore composite indexes in `firestore.indexes.json` for verified status, submission dates, and school names.

6. **Asset Pipeline Optimization (`sharp` + WebP):**
   - Installed `sharp` for Next.js production image optimization.
   - Compressed `logo.png` from 948 KB down to 16.9 KB.
   - Converted hero image from 2.14 MB PNG to 204 KB responsive WebP (`public/Hopeful Journey to School.webp`), with responsive `sizes` and `priority` preloading.

7. **Code Splitting & Deferred Analytics:**
   - Split heavy admin tabs using `next/dynamic` with skeleton fallbacks, cutting initial admin bundle size from 332 kB to 268 kB.
   - Deferred Firebase Analytics initialization until after first user interaction (scroll/click/keypress), eliminating ~150 KB of third-party tracking scripts from blocking initial paint.
   - Deferred Home page dynamic Firestore site content query, allowing fallback static content to paint immediately.

## Consequences

### Positive
- **Dramatic FCP Reduction:** First Contentful Paint dropped from ~5.3s to ~2.0s across all public routes.
- **Instant Click Response:** Route transitions now display visual feedback immediately (<100ms), resolving the user-reported button delay.
- **Reduced Bundle Payload:** First Load JS for public routes reduced significantly (Home 121 kB, Guidelines 125 kB, Reports 109 kB).
- **Zero Invariant Regressions:** All 53 security rule tests, all TDD test suites, and WCAG 2.2 AA accessibility checks (0 violations) continue to pass with 100% fidelity.

### Negative / Trade-offs
- Static guidelines require re-deployment or on-demand revalidation if guideline data changes.
- Admin dashboard retains client-side Firestore authentication checks, which is necessary for role-based security.
