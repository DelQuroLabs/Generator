# Verification Evidence — DelQuro Generator

**Run date:** 2026-08-09 (America/New_York)
**Execution mode:** EXECUTION_MODE · Node v20.20.2 · npm 10.8.2

## Verification Sequence Results

| # | Gate | Command | Exit | Status | Evidence |
|---|---|---|:---:|:---:|---|
| 1 | Frozen install | `npm ci` | 0 | PASSED | 434 packages, 0 install errors |
| 2 | Type-check | `tsc --noEmit` | 0 | PASSED | 0 TypeScript errors (strict + noUncheckedIndexedAccess) |
| 3 | Lint | `eslint .` | 0 | PASSED | 0 errors, 0 warnings |
| 4 | Unit/component tests | `vitest run` | 0 | PASSED | 25 tests across 2 files (engine + components) |
| 5 | Production build | `next build` | 0 | PASSED | Static + dynamic routes compiled; 140 kB First Load JS |
| 6 | Prod server | `next start --hostname 0.0.0.0` | 0 | RUNNING | Ready on 0.0.0.0:3000 |
| 7 | Health endpoint | `curl /api/health` | 0 | PASSED | HTTP 200 `{"status":"ok","version":"1.0.0"}` |
| 8 | Home route | `curl /` | 0 | PASSED | HTTP 200, contains "DelQuro Generator" |
| 9 | 404 route | `curl /does-not-exist` | 0 | PASSED | HTTP 404 with custom not-found page |
| 10 | Security headers | `curl -I /` | 0 | PASSED | X-Content-Type-Options, Referrer-Policy, Permissions-Policy set; X-Powered-By removed |
| 11 | Placeholder/secret scan | `grep -rnE "TODO\|FIXME\|sk_live\|mock data\|lorem ipsum" app lib components data` | 0 (none) | PASSED | No placeholders or secrets |
| 12 | Dependency audit | `npm audit` | n/a | REPORTED | 3 high advisories in Next's transitive build-only `postcss`/`sharp` (dev/build toolchain, no runtime server/API surface). `audit fix --force` would upgrade Next to 16, which requires Node 22 (sandbox runs Node 20). Documented as non-blocking. |

## Test Coverage

- **Engine (`__tests__/engine.test.ts`, 21 tests):** lexicon integrity, PRNG determinism, syllable/pronounceability helpers, length bounds, seed determinism, seed variance, must-include, must-not-include, starts-with, uniqueness, component/rationale/score validity, truncation reporting, quantity cap (Zod), inverted-length rejection, XSS-free output, CSV formula-injection neutralization.
- **Components (`__tests__/components.test.tsx`, 4 tests):** form renders generate button, submit calls handler, NameCard renders name+score, breakdown expands.

## Edge-Case Matrix

| Scenario | Expected | Observed | Status |
|---|---|---|:---:|
| Empty/impossible constraints | Empty state with actionable relax actions | "No names matched" + Reset/Shuffle | PASSED |
| Inverted length/syllable bounds | Inline validation error + disabled submit | Red helper text, button disabled | PASSED |
| Formula injection in CSV (`=CMD`) | Leading `'` neutralization | `'=CMD` escaped | PASSED |
| XSS payload in input | React text-node escaping; no raw HTML | Names contain only `[a-z]`; no `<`/`>` | PASSED |
| IndexedDB unavailable / private mode | Degraded-offline notice; generation still works | Storage try/catch → in-memory; banner shown | PASSED |
| Delete / clear-all history | `alertdialog` confirmation, Cancel safe | Focusable dialog, Cancel default on clear | PASSED |
| Very narrow filters | Truncation notice + auto-broaden pools | `truncated:true` shown when fewer than quantity | PASSED |
| Storage corruption | Zod parse drops bad records, continues | `safeParse` per record | PASSED |
| Duplicate fragments (e.g. "Solsol") | Rejected by composer + assembly guard | No repeated ≥3-char fragments in output | PASSED |

## Performance (internal measurement)

- 50-name generation: **~11 ms** local (target < 50 ms). ✅
- First Load JS: **140 kB** (shared 103 kB). LCP target < 2.5s expected given static shell + local compute.

## Known Limitations

- No trademark/domain/social-handle availability checking — disclosed in-product; external authorities required.
- Phonetic respelling and "legitimacy" score are heuristic, not linguistics-certified.
- E2E browser tests use Vitest + JSDOM (the environment's fallback runner); no Playwright browser binary was provisioned. Component behavior and security helpers are covered under JSDOM.
- 3 high dev/build-only dependency advisories (postcss/sharp transitive to Next 15) — no runtime network/API surface; would require Node 22 to upgrade Next 16.
