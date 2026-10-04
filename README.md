## New: API key generator

Open `/api-keys` for cryptographically random keys for your own apps: three formats, configurable prefix/length, batch generation, reveal, copy and plaintext download. Keys are not saved in name history. See [security and usage notes](docs/api-key-generator.md).

# DelQuro Generator

**Craft names that fit — down to every part.**

A local-first name generator with deep, composable criteria. Pick what you're naming, the field it lives in, the linguistic flavor it should carry, how it should be built, how long it runs, how it sounds — and get names assembled from real morphemes, scored against your brief, and explained part by part. Everything runs on your device: no account, no network call, no tracking.

---

## Name

| | |
|---|---|
| **Product** | DelQuro Generator |
| **Short name** | DelQuro |
| **Package slug** | `delquro-generator` |
| **Type** | Local-first web app (name generator) |
| **Locale** | en-US |
| **Version** | 1.0.0 |

## Tagline

**Primary — Craft names that fit — down to every part.**

Alternates, by emphasis:

| Emphasis | Tagline |
|---|---|
| Precision | *Name anything with precision.* |
| Explainability | *Every name, explained.* |
| Privacy | *A naming studio that never leaves your device.* |
| Range | *From biotech to a corner cafe — one generator.* |
| Craft | *Built from meaning, not random letters.* |

## Description

**One-liner (≤100 chars)**
> Deeply customizable, on-device name generator that explains and scores every suggestion.

**Short (app store / OG, ~50 words)**
> DelQuro Generator builds names from meaningful parts. Choose the name type, field of study, linguistic origin, construction style, length, syllables and sound, then get scored suggestions with a phonetic respelling and a breakdown of what each fragment means. Runs entirely in your browser — nothing is uploaded.

**Long**
> Most name generators shuffle syllables and hope. DelQuro composes: every candidate is assembled from a hand-curated lexicon of 177 tagged morphemes — prefixes, roots and suffixes carrying a meaning, a semantic field and a linguistic origin — then filtered against your hard constraints and ranked by a 0–100 fit score.
>
> You control **8 name types** (business, product, project, character, place, band, book, other), **15 semantic fields** (technology, bio/med, finance, nature, mythology, space, food, fashion, gaming, science, law, education, arts, travel, virtue), **10 origin flavors** (classical, nordic, romance, germanic, slavic, japanese, sanskrit, celtic, african-inspired, coined), **5 construction styles** (coined, compound, classical, portmanteau, evocative), length and syllable ranges, starts-with / ends-with / must-include / must-not-include filters, **3 phonetic hardness** settings, alliteration, **5 separators** and **5 casings**, quantity, and a seed.
>
> Every result opens into a "why this name?" breakdown: the component fragments and their meanings, the rationale behind the score, a phonetic respelling and a syllable count. Because generation is seeded, the same brief always returns the same names — so a result you liked is reproducible, shareable as a seed, and re-runnable from history.
>
> Copy one, copy all, favorite, save the brief to your device, or export JSON, CSV (formula-injection sanitized) or Markdown.

**Honest limits** — DelQuro does **not** check trademark, domain or social-handle availability; verify with the relevant authorities before commercial use. Origin labels are "inspired by" heuristics, not linguistic certification, and the phonetic respelling and fit score are heuristics too.

## Mobile-first design

The phone is the baseline; `lg` (1024px) is the enhancement.

**Layout**
- **Thumb-zone action bar** fixed to the bottom: `Criteria` · `Generate` · `Shuffle`. The Criteria button carries a badge counting active refinements, so the collapsed state is never a black box.
- **Criteria live in a bottom sheet** — grabber, swipe-down-to-dismiss, backdrop tap, Escape, focus trap, scroll lock, and a sticky "Generate N names" footer. From `lg` up the same form becomes an inline sticky sidebar.
- **Collapsible criteria groups** with live value summaries (`Field / domain · 3 selected`, `Length & syllables · 8–14 · 2–4`) keep the phone view a short scannable list instead of a wall of controls.
- **Edge-to-edge horizontal scrollers** for the name-type row, sample presets, result actions and tags — swipe instead of wrap, reflowing to wrapped rows at `sm`.
- Results, history and export are sheets on phones, centered panels on desktop. Generating from a sheet closes it and scrolls results into view.

**Touch & input**
- Buttons ≥48px, chips ≥40px, icon buttons 44×44, slider thumbs 26px on touch — all tightening at `sm` so desktop stays dense.
- Text inputs render at 16px on mobile so iOS Safari never zooms on focus; `inputMode`, `autocapitalize`, `autocorrect` and `spellcheck` set per field.
- Active-state scale feedback, `touch-action: manipulation` (no 300ms delay), tap highlight suppressed.

**Platform**
- `viewportFit: 'cover'` with `env(safe-area-inset-*)` honored by the header, bottom bar, sheets and dialogs — nothing hides under a notch or home indicator.
- `svh` / `dvh` units so a collapsing URL bar doesn't jump the layout; `overscroll-behavior: contain` inside sheets.
- Per-scheme `themeColor`, `appleWebApp` status bar, dark default with a light theme applied pre-hydration (no flash).
- `maximumScale: 5` with `userScalable: true` — pinch-zoom is deliberately never trapped.
- `prefers-reduced-motion` collapses all animation to ~0ms.

## Stack

| Layer | Choice | Version |
|---|---|---|
| Framework | Next.js (App Router, RSC) | 15.5.27 |
| UI | React / React DOM | 19.2.8 |
| Language | TypeScript (strict) | 6.0.3 |
| Styling | Tailwind CSS v4 (CSS-first `@theme`) + PostCSS | 4.3.3 / 8.5.26 |
| Icons | lucide-react | 1.31.0 |
| Validation | Zod (criteria + result schemas) | 4.4.3 |
| Persistence | idb-keyval (IndexedDB) → localStorage → in-memory fallback | 6.3.0 |
| Testing | Vitest + Testing Library + jsdom | 4.1.10 / 16.3.2 / 24.1.3 |
| Linting | ESLint + eslint-config-next | 9.30.1 / 15.5.27 |
| Runtime | Node.js | 20.20.2 |

**Architecture**
- Generation engine is pure TypeScript in `lib/engine/*` — `mulberry32` seeded PRNG, curated lexicon, constraint filter, heuristic scorer/respeller. No AI service, no API, no outbound fetch.
- Only server surface is `GET /api/health`; everything else is static. `robots.ts` and `sitemap.ts` generated at build.
- Security: `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, `Permissions-Policy: camera=(), microphone=(), geolocation=()`, `poweredByHeader: false`, CSV export sanitized against DDE/formula injection, no `dangerouslySetInnerHTML` outside the pre-hydration theme script.
- Server binds `0.0.0.0`; browser code uses relative URLs only.

**Scripts**

```bash
npm run dev          # next dev --hostname 0.0.0.0
npm run build        # production build
npm start            # next start --hostname 0.0.0.0
npm run type-check   # tsc --noEmit
npm run lint         # eslint .
npm test             # vitest run
npm run verify       # all of the above, in order
```

**Current verification** — `tsc --noEmit` clean · `eslint .` clean · 29/29 tests pass · `next build` exit 0 · `/` = 143 kB First Load JS · `/api/health` returns `{"status":"ok","version":"1.0.0"}`.

> Security status: the previous dependency audit recorded 12 vulnerabilities (3 moderate, 9 high), zero critical after upgrading Next to 15.5.27. These findings remain unresolved; this is not a security-clean or release-ready declaration. See artifacts/evidence/sec-advisories.log.
