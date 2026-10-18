# Next.js + Tailwind CSS as frontend stack

We chose **Next.js (React)** with **Tailwind CSS** for the frontend.

**Context:** The PRD specifies this as an `[Impl. choice]` and lists Next.js + Tailwind CSS. The platform needs SEO for public pages (research reports, guidelines), built-in i18n routing (Hindi/English), React's accessible component ecosystem, and server-side rendering for the data dashboard. Tailwind CSS is explicitly requested in the PRD.

**Alternatives considered:**
- *Vite + React SPA:* Faster dev build, but no SSR/SSG out of the box — poor for SEO on public research pages.
- *Plain HTML/CSS:* No component reuse, no routing, no i18n framework.

**Consequences:** Firebase App Hosting (with SSR support) is needed instead of plain Firebase Hosting (static only). Tailwind is used per PRD specification; we will confirm the version with the user.
