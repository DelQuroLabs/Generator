# Product Specification — DelQuro Generator

## In Scope
- Primary vertical slice: criteria form → deterministic local name generation → scored, explained results → copy/export/favorite → local history.
- Fully offline; no accounts, no network, no remote adapter.
- Name types: Business, Product, Project, Character, Place, Band, Book/Title, Other.
- Semantic fields (multi-select or "all"): Technology, Biology/Medicine, Finance, Nature/Earth, Mythology, Space/Astronomy, Food/Beverage, Fashion/Design, Gaming, Science (general), Law/Government, Education, Arts, Travel/Place, Abstract/Virtue.
- Region/language origin (multi-select or "any"): Classical (Latin/Greek), Nordic, Romance, Germanic, Slavic, Japanese (romaji), Sanskrit, Celtic, African-inspired (general), Global/Coined.
- Styles: Coined (affix composition), Compound (two roots), Classical Affix, Portmanteau (blended roots), Evocative (real word/root).
- Linguistic controls: min/max length, min/max syllables, starts-with, ends-with, phonetic hardness (soft/balanced/hard), alliteration toggle, separator (none/-/_/./space), casing (Preserve/camelCase/PascalCase/lowercase/UPPERCASE), must-include, must-not-include, quantity (1–50), seed.
- Per-name breakdown: components with meanings, syllable count, phonetic respelling, fit score (0–100), rationale list, tags.
- Actions: copy single (toast), copy all, export JSON/CSV/Markdown, favorite/unfavorite, regenerate with new random seed, "lock part" refinement.
- History: saved briefs + results in IndexedDB; search, filter, re-run, delete (with confirmation), clear-all (with confirmation). Favorites persisted separately.
- Samples: 3 one-click presets (Biotech Startup, Indie Game, Café/Bakery), clearly labeled "sample," never inserted into history unless user generates from them.

## Out of Scope
- Trademark/domain/social-handle availability checking (external authorities; honest limitation).
- Remote AI generation (operating mode is fully_offline).
- Multi-language UI (en-US only).
- Competitor comparison pages — original concept with no honest public competitor dataset to compare against; would risk fabrication, so intentionally omitted.

## Primary Vertical Slice Acceptance Criteria
1. Given valid criteria, clicking Generate produces ≥ `quantity` unique names satisfying 100% of hard constraints.
2. Same seed + same criteria → byte-identical result list (determinism).
3. Each result shows score, components, and at least one rationale line.
4. Changing a hard constraint removes violating names from results.
5. Copy, export (all three formats), favorite, and history re-run all work end-to-end.
6. All 8 UI states render correctly.

## 8 Mandatory UI States
1. `idle` — form with default criteria and a sample prompt.
2. `validating` — inline validation as criteria change (debounced where helpful).
3. `loading` — generation is synchronous/local; shown only briefly with `aria-live="polite"` for very large batches (labeled "Generating locally…").
4. `success` — results grid populated.
5. `empty` (no-result) — when constraints yield zero candidates, an actionable message ("Loosen length/field constraints") with a one-click relax action.
6. `degraded_offline` — app is always offline; IndexedDB-unavailable shows "history not saved this session" but generation still works.
7. `recoverable_error` — e.g., no possible candidates after retries; offer adjust/reset with retry.
8. `terminal_error` — global error boundary with reset.

## Data Retention
- Stored locally only (IndexedDB via idb-keyval; theme/prefs in localStorage).
- Exportable as JSON/CSV/Markdown.
- Purgeable per-item and clear-all, each behind an accessible `role="alertdialog"` confirmation.
- Disclosure: "Saved only on this device. Nothing is uploaded."

## Responsive & A11y
- Single-column on mobile (<640px), two-column (form | results) on desktop.
- WCAG 2.2 AA: landmarks, heading order, labels, 44px targets, visible focus, keyboard dialog traps, color not sole signal, reduced-motion, 200% zoom usable, no horizontal scroll at 320px.

## Performance Budget (internal, non-blocking)
- 50-name generation < 50ms on a mid-tier device.
- LCP < 2.5s, INP < 200ms, CLS < 0.1 (internal measurement).

## Honest Limitations
- No availability/trademark checks — disclaimer present.
- Phonetic respelling and "legitimacy" scoring are heuristic.
- Region labels denote etymological inspiration, not certified linguistic origin.
