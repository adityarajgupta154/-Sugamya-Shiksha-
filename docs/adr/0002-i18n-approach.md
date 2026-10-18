# i18n approach — React Context with Locale JSON Bundles

Status: **accepted**

We implemented a **React Context-based internationalization architecture (`LanguageContext`)** backed by typed JSON translation bundles (`src/locales/en.json` and `src/locales/hi.json`).

**Context:**
The PRD requires Hindi and English language support across every public page, accessible language switching via a dedicated header toggle, persistent user preferences, and zero layout shift or hydration flash.

**Decision:**
- Store translation dictionaries as structured JSON files (`en.json` and `hi.json`) covering all 12 platform sections, UI components, accessibility announcements, and legal summaries.
- Provide a typed `useLanguage()` hook with `t(key, fallback)` helper supporting nested keys and automatic fallback to English if a key is missing.
- Persist chosen language in `localStorage` (`ssb_locale`), defaulting to Hindi (`hi`) per platform identity, and dynamically updating `<html lang="...">`.

**Consequences:**
- Eliminates heavy external middleware dependencies and routing friction.
- Enables instant, smooth language switching without full page reloads.
- Translation keys are maintainable and easily extensible by non-technical contributors.
