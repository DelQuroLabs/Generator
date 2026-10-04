# DelQuro Generator — Decisions & Architecture Locks

**Timestamp (ISO):** 2026-08-09T00:00:00-05:00
**Execution Mode:** EXECUTION_MODE (all capabilities functional)

## Intake Resolution (Express)

- **Target reference:** Concept-only — "DelQuro Generator", a name generator with deep criteria controls across name components and fields/regions.
- `source_mode = PUBLIC_PRODUCT_INSPIRATION` (original concept, no reference site)
- **Display name:** DelQuro Generator
- **Package slug:** `delquro-generator` (matches `^[a-z0-9-]+$`)
- **Product category:** `calculator_viz` (criteria/sliders/inputs → generated names, deterministic output)
- **ICP / User:** Founders, product managers, marketers, writers, worldbuilders, and parents who need a tailored name for a business, product, project, character, place, or other entity.
- **User Problem:** Generic name generators produce random, unqualified output. Users need fine-grained control over every component (prefix/root/suffix, style, origin/field of study, region, length, phonetics, vibe) so names actually fit the use case and "sound legit."
- **Core Input:** A criteria configuration — name type, field/domain, region/language, style, length, syllable count, phonetic traits, required/forbidden substrings, capitalization, separators, quantity, and a deterministic seed.
- **Core Output:** A ranked, scored list of generated names with per-name breakdown (components, phonetic signature, rationale), plus copy/export/favorite.
- **Primary Measurable Metric:** From criteria → a list of names that satisfy 100% of hard constraints (length bounds, required/forbidden terms, style), with a deterministic seed producing identical output across runs.
- **Operating mode:** `fully_offline` — 100% deterministic local engine; no network, no API keys, no remote calls. User data stays on-device.
- **Scope tier:** TIER = FULL (rich criteria UI + history + export; comparison pages are not applicable for an original concept with no competitors to honestly compare — documented in spec).
- **Design vibe:** `premium_dark` — zinc-950 base, high contrast, glass surfaces, violet/cyan neon accent, 12px radius.
- **Auth/paywall:** `auth = ZERO_AUTH_UNLOCKED`, `paywall = UNLOCKED_LOCAL`
- **Gated-feature recon:** `gated_feature_recon = NOT_NEEDED` (no reference product; original concept).

## Original Design (First-Principles)

The fundamental problem: *people don't want random strings — they want names that fit a brief.* DelQuro treats a name as **composable parts** (prefix + root + suffix, or two morphemes blended, or a coined affix pattern) and lets the user constrain each part along **three axes**:

1. **Semantic field** — what the name should evoke (fields of study, industries, nature, mythology, tech, place names).
2. **Linguistic shape** — origin/region, length, syllable count, starting/ending letters, phonetic hardness (plosives vs. liquids), alliteration.
3. **Style register** — invented/coined vs. real-root compounds vs. Latin/Greek classical vs. modern portmanteau vs. evocative dictionary.

Each generated name gets an **explainable score** against the brief (hard-constraint pass/fail + soft-fit 0–100 with component rationale), so results aren't a black box.

## Technical Baseline

Package manager: **npm** (lockfile: package-lock.json).

| Package | Adopted version | Purpose |
|---|---|---|
| next | 16.3.0 | React framework (App Router) |
| react / react-dom | 19.2.8 | UI |
| typescript | 7.0.2 | Type system (strict, noUncheckedIndexedAccess) |
| tailwindcss | 4.3.3 | Styling (CSS-first config via @theme) |
| @tailwindcss/postcss | latest | Tailwind v4 PostCSS bridge |
| zod | 4.4.3 | Boundary validation |
| lucide-react | 1.31.0 | Accessible icons |
| idb-keyval | 6.3.0 | IndexedDB persistence (SSR-safe wrapper) |
| vitest | 4.1.10 | Unit/component tests |
| @testing-library/react | 16.3.2 | Component tests |
| @testing-library/jest-dom | 7.0.0 | DOM assertions |
| jsdom | 30.0.1 | JSDOM test environment |
| @vitejs/plugin-react | 6.0.5 | Vitest React plugin |
| eslint / eslint-config-next | 10.8.1 / 16.3.0 | Linting |

Documented prompt baseline was Next 15/React 19/Tailwind v3-era; adopted newer stable line per execution-time revalidation. Config/API notes adjusted for Next 16 (App Router, async params) and Tailwind v4 (`@import "tailwindcss"` + `@tailwindcss/postcss`, no autoprefixer, CSS `@theme` tokens).

## Local/Remote Boundaries

- **No remote adapter.** Everything is computed in the browser via the deterministic local adapter.
- No SSRF surface (no outbound fetch). No secrets. No AI transmission.
- Persistence: IndexedDB (history + favorites) with in-memory fallback; localStorage for theme/prefs.

## Assumptions & Constraints

- en-US locale default.
- Name "legitimacy" is scored heuristically against the user's brief; the product never claims trademark availability — a clear disclaimer is shown (name availability must be checked with relevant authorities).
- Morph/lexicon data is a curated, original English-transliteration corpus (no copyrighted dictionary dump).

## 2026-08-16 — Mobile-first redesign

**Decision:** Re-baseline the UI at the phone breakpoint and treat `lg` as the enhancement, reversing the previous desktop-sidebar-first layout.

Changes:
- **Primary navigation is thumb-level.** A fixed bottom action bar (`Criteria` / `Generate` / `Shuffle`) replaces reliance on the sidebar. It carries a badge with the count of active refinements and respects `env(safe-area-inset-bottom)`.
- **Criteria live in a bottom sheet** (`components/ui/Sheet.tsx`) below `lg`, and remain an inline sticky sidebar from `lg` up. The form is mounted in both places, so `idPrefix` namespaces every control id (`sheet-*` / `desk-*`) to avoid duplicate ids; the sheet footer submits via the `form` attribute.
- **Criteria are grouped into collapsible sections** with value summaries (e.g. `8–14 · 2–4`) so the phone view is a short scannable list instead of a wall of controls. Name type and quick samples stay always-visible as edge-to-edge horizontal scrollers.
- **Touch targets:** buttons ≥48px, chips ≥40px, icon buttons 44×44 on mobile, tightening at `sm`. Range thumbs are 26px on touch, 18px on pointer-fine.
- **Inputs are 16px on mobile** to stop iOS Safari from zooming on focus; they drop to 0.9rem at `sm`.
- **Dialogs are bottom-anchored sheets on phones**, centered from `sm` up. Nested dialogs (delete confirms inside the history sheet) restore the previous body-overflow value instead of clearing it, so closing a confirm doesn't unlock scroll behind the sheet.
- **Viewport:** `viewportFit: 'cover'`, `maximumScale: 5` with `userScalable: true` (never trap pinch-zoom), per-scheme `themeColor`, `appleWebApp` status bar.
- Results scroll into view after generating from the sheet/sample/history rerun; `svh`/`dvh` units avoid the mobile URL-bar jump.
- The dead "reserved for possible desktop side panel" block was removed; history is now a Sheet at every breakpoint (bottom sheet on phones, centered panel on desktop).

**Verification:** `tsc --noEmit` clean, `eslint .` clean, 29/29 vitest tests pass (4 new: section collapse, id namespacing, sheet open/Escape, sheet closed), `next build` exit 0, home 143 kB First Load JS.
