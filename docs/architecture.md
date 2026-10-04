# Architecture — DelQuro Generator

## Pattern: Ports & Adapters (local-only)

```
[React UI Components]
        │  criteria (Zod-validated)
        ▼
[Domain Engine Port: generateNames(criteria, seed)]
        │
        ▼
[Deterministic Local Adapter]
  - Morpheme lexicon (prefixes/roots/suffixes, tagged)
  - Constraint filter (hard)
  - Weighted scorer (soft)
  - Seeded PRNG (mulberry32)
  - Composers per style (coined/compound/classical/portmanteau/evocative)
        │
        ▼
[Result schema (Zod)] → [Exports: JSON/CSV/MD] → [Storage: IndexedDB]
```

There is **no remote adapter** (fully_offline). The port is still defined so a remote adapter could be added later without changing the UI contract.

## Key Modules

- `lib/engine/contracts.ts` — TypeScript types + Zod schemas for `Criteria`, `Morpheme`, `GeneratedName`, `GenerateResult`.
- `lib/engine/lexicon.ts` — original curated morpheme corpus with tags (field, origin, position, phonetics, meaning).
- `lib/engine/prng.ts` — deterministic seeded PRNG (mulberry32) + stable hash of criteria.
- `lib/engine/local-adapter.ts` — composition, filtering, scoring, ranking; pure functions for testability.
- `lib/engine/scoring.ts` — soft-fit scoring with rationale generation.
- `lib/schemas.ts` — shared schemas (storage, export).
- `lib/storage.ts` — SSR-safe IndexedDB wrapper with in-memory fallback + corruption recovery.
- `lib/exports.ts` — JSON/CSV/Markdown + clipboard; safe filenames.
- `lib/safe-csv.ts` — DDE/formula-injection-safe CSV.
- `lib/utils.ts` — cn() class helper + formatting.

## Determinism Contract

`generateNames(criteria, seed)` is a pure function: identical `criteria` + `seed` yields identical ordered output. The default seed is derived from a stable hash of criteria plus a user-visible "shuffle" nonce when they explicitly request new variants. This makes results reproducible and unit-testable.

## Scoring

- Hard constraints filter first (length range, starts/ends, include/exclude, selected fields/origins). If a candidate fails any, it is rejected.
- Soft score (0–100) weights: semantic field match, origin match, style fit, syllable target, phonetic hardness target, alliteration preference, brevity balance, pronounceability heuristic.
- Each component contributes a rationale string (e.g., `"Veyra" — evokes flow/biology; soft phonetics`).

## Pipeline

Input (React state) → Zod parse → `generateNames` → Zod-validated result → render + persist (opt-in via Save) → export.

## Persistence

- `history` store: `{ id, criteria, result, createdAt, favorite }`.
- `prefs` store: `{ theme, lastCriteria }`.
- Versioned schema; on parse failure, drop corrupt record and continue (quota-safe).
