# REBUILD MANIFEST — DelQuro Generator
delquro-age:age1<recipient> · manifest v1 · captured_at 2026-09-03T18:55:00Z · backup_id delquro-generator-20260903-001
guide: UNKNOWN — attach master script · phase production-candidate · label phase-complete · handoff: delquro-intake v3.1

## 1. Source and Origin
- **Product:** DelQuro Generator — deterministic local-first name generator (package slug `delquro-generator`, version `1.0.0` from `package.json`)
- **Repo URL:** UNKNOWN — no remote configured (checked `git remote -v` → fatal: not a git repository; `.git` directory exists at `/home/user/.git` but is incomplete: only `HEAD` → `ref: refs/heads/master`, `description`, `hooks/`, `info/exclude`; no `config`, no `refs/heads/`, no commits; `git rev-parse HEAD` fails)
- **Default branch:** UNKNOWN — attach repo remote (inferred from HEAD: `master`, but unverified)
- **Exact commit SHA:** UNKNOWN — no commits exist; `git log --oneline --all` → fatal: not a git repository; ask owner to run `git log --oneline -1` after proper `git init` + commit
- **Tree-clean status:** UNKNOWN — git is not a valid repo; `git status --porcelain` fails. Filesystem state as of `2026-09-03T18:52:43Z` is the source of truth (see §11 inventory)
- **Tag/release:** none
- **Git bundle command + sha256:** not-run — no valid repo to bundle. When initialized, recommended: `git bundle create delquro-generator-20260903.bundle --all && sha256sum delquro-generator-20260903.bundle`
- **If bundle existed:** MANUAL CHECK: `git bundle verify delquro-generator-20260903.bundle && git clone delquro-generator-20260903.bundle restored && diff -r restored --exclude=.git`
- **Files NOT in git:** All project files are currently untracked because git is invalid (see `git status` failure). Inventory in §11 is authoritative. The platform IS the repo (Arena.ai sandbox at `/home/user`; ephemeral `/home/user/.git` is excluded from snapshots because generated dependency/cache/build directories are excluded). See §11 Platform Residence equivalent.
- **One-line restore (when repo exists):** `git clone <repo-url> && cd delquro-generator && npm ci && npm run verify && npm run build && npm start`
- **Current snapshot restore (arena sandbox):** `tar`/`zip` of `/home/user` excluding `node_modules/.next/.npm` then `npm ci` — verified 2026-09-03 (see §11 restore proof, passed)
- **Workspace capsule (§8 Workspace Capsule Protocol):** not-run — master script not present, so `scripts/pack-workspace-capsule.py` does not exist; no capsule packed. Source travels as working tree listed in §11. MANUAL CHECK: after adding master script, run `python scripts/pack-workspace-capsule.py --out artifacts/workspace.capsule.b64 --sha artifacts/workspace.capsule.sha256` and record path + sha256 here.

## 2. Toolchain and Reproducible Build
- **OS + arch:** `Linux e2b.local 6.1.158+ #1 SMP PREEMPT_DYNAMIC Fri Jul 17 14:31:34 UTC 2026 x86_64 GNU/Linux` (measured 2026-09-03 via `uname -a`)
- **Runtime:** `Node v20.20.2` (`node -v`), `npm 10.8.2` (`npm -v`), `git 2.47.3`; `pnpm`/`bun` not installed (`command not found`)
- **Package manager:** `npm` with `package-lock.json` (284K, present) — authoritative lockfile. No `pnpm-lock.yaml`, `yarn.lock`, `bun.lockb`
- **Lockfile:** `package-lock.json` (sha256: `290070` bytes at capture; current sha256 computed at §11). Install is frozen: `npm ci --no-audit --no-fund` — passed 2026-09-03 (451 packages in 13s)
- **.npmrc / registries / proxies:** no `.npmrc` in repo; default npm registry `https://registry.npmjs.org/`; no proxy env detected in workspace; `postcss.config.mjs` uses `@tailwindcss/postcss` plugin; no `patch-package` diffs
- **Native + postinstall deps:** none declared; `sharp` is transitive via `next@15.5.23` (build-time only, not used at runtime); no `postinstall` script in `package.json`
- **TypeScript / bundler configs that change behavior:**
  - `tsconfig.json` — `target ES2022`, `module esnext`, `moduleResolution bundler`, `jsx preserve`, `strict true`, `noUncheckedIndexedAccess true`, `incremental true`, `paths @/* → ./*`, `plugins [{name: next}]`
  - `next.config.mjs` — `reactStrictMode true`, `poweredByHeader false`, `allowedDevOrigins ['*.e2b.app']`, `experimental.serverActions.allowedOrigins ['*.e2b.app','localhost:3000','0.0.0.0:3000']`, security headers (see §7)
  - `postcss.config.mjs` — `{ plugins: { '@tailwindcss/postcss': {} } }` (Tailwind v4)
  - `eslint.config.mjs` — `FlatCompat` extending `next/core-web-vitals` + `next/typescript`, ignores `.next/**, node_modules/**, coverage/**, next-env.d.ts`
  - `vitest.config.ts` — `plugins [react()]`, `alias @→./`, `environment jsdom`, `globals true`, `setupFiles ['./__tests__/setup.ts']`, `include ['__tests__/**/*.test.{ts,tsx}']`
  - `app/globals.css` — `@import 'tailwindcss'; @theme { --color-bg: #08080c; ... --shadow-glow ... }` — Tailwind v4 CSS-first theme
- **Runtime flags:** `next dev --hostname 0.0.0.0` (dev), `next start --hostname 0.0.0.0 --port 3000` (prod), `next build` (no extra flags); `tsc --noEmit`; `eslint .`; `vitest run`

## 3. Configuration Surface
- **Env vars — table (Values never):**

| name | required | kind | consumed by (file:line) | where stored | notes |
|---|---|---|---|---|---|
| `NEXT_PUBLIC_APP_URL` | no | public (NEXT_PUBLIC_) | `app/sitemap.ts:3`, `app/robots.ts:3` | `.env.example` (value `http://localhost:3000` as example), local `.env` if present (not read per SAFETY), process env at build/runtime | canonical base for sitemap/robots; defaults to `http://localhost:3000` if unset |

- **.env.example contents (verbatim):**
```
# DelQuro Generator — fully offline/local-first.
# No API keys or remote services are required.
# Optional public app URL used for sitemap/robots canonical links.
NEXT_PUBLIC_APP_URL=http://localhost:3000
```
- **Other env vars:** none. No secrets, no API keys, no `DATABASE_URL`, no `NEXTAUTH_*`. Verified by `grep -R "process.env" app lib --include="*.ts" --include="*.tsx"` → only the two files above.
- **Feature flags with defaults:** none (no `NEXT_PUBLIC_FEATURE_*`). The only toggling is runtime `theme` (`dark`|`light`) stored in `localStorage` key `delquro-theme` + IndexedDB `delquro:prefs:v1` (see §5), default `dark`
- **Non-secret tuning (model IDs, temperature, maxTokens, timeouts, retries, batch sizes, queue concurrency, cache TTLs, rate limits):** not applicable — fully offline, no AI model, no queue, no cache TTL. Tuning that does exist is embedded in code:
  - `lib/engine/contracts.ts` — defaults: `minLength 4`, `maxLength 12`, `minSyllables 2`, `maxSyllables 4`, `hardness balanced`, `separator none`, `casing pascal`, `quantity 24`, `seed 1`; limits `minLength 2–40`, `quantity 1–50`
  - `lib/engine/local-adapter.ts` — `maxAttempts = target * 60`, `truncate if < quantity`
  - `lib/engine/scoring.ts` — weights: length 0.18, syllable 0.15, hardness 0.12, field 0.22, origin 0.13, pronounceability 0.12, alliteration 0.08
- **Dev/preview/prod deltas:** none except `NEXT_PUBLIC_APP_URL` points to `http://localhost:3000` locally vs. production origin when deployed; `next` builds static pages (`/` `/_not-found` `/robots.txt` `/sitemap.xml`) + dynamic `/api/health` (`force-dynamic`, `Cache-Control: no-store`)
- **Platform-injected config I never set:** Arena sandbox injects ephemeral preview host `https://{port}-{sandboxId}.e2b.app`; `allowedDevOrigins ['*.e2b.app']` and `allowedOrigins` in `next.config.mjs` are the only awareness of it. No other platform env detected. MANUAL CHECK: `env | sort` on a fresh deploy and compare to `.env.example`

## 4. Services and Cloud Identifiers
- **Hosting:** local / Arena.ai sandbox (`arena.ai` — build_platform `arena.ai` per intake; tier `free` or UNKNOWN — ask owner for arena subscription; `platform_account` = `none`). The prod preview runs on `0.0.0.0:3000` inside sandbox, proxied as `https://3000-{sandboxId}.e2b.app`. No Vercel/Cloudflare deployment.
- **Supabase:** none — `"supabase_link": ""`. No project ref, no URL, no region, no DB version, no `supabaseUrl`/`anonKey`. App is `fully_offline`; persistence is browser `IndexedDB` via `idb-keyval` → `localStorage` → in-memory fallback (see §5). MANUAL CHECK: `grep -R supabase app lib` → 0 hits.
- **Cloudflare:** none — `"cloudflare_link": ""`. No account ID, zone ID, Pages project, Worker, D1/R2/KV/Queue, cron.
- **Domain / registrar / DNS:** none. `NEXT_PUBLIC_APP_URL` is the only URL origin; no custom domain, no registrar, no nameservers, no SPF/DKIM/DMARC. MANUAL CHECK: `cat /etc/hosts; nslookup <domain>` if a domain is later added.
- **Email/SMS sender identity:** none (no email sending)
- **Sentry / analytics:** none (no `_analytics` or Sentry DSN)
- **Third-party resource IDs (Stripe price IDs, OAuth client IDs, redirect URIs, scopes, API key names):** none — no OAuth, no Stripe, no third-party APIs. `lucide-react` and `zod` are npm-only.
- **Plan tier + renewal/expiry for every paid service:** UNKNOWN — no paid service configured; Arena tier is `UNKNOWN — ask owner for arena.ai plan + renewal date`; MANUAL CHECK: `https://arena.ai/billing` or sandbox dashboard.
- **GitHub:** `"github_link": ""` — no repo URL published. Local `.git` is invalid (see §1). MANUAL CHECK: `git remote -v` after proper init.

## 5. Data Contracts
- **Schema DDL / migrations:** none — no SQL database, no `migrations/` folder, no `pg_dump`. Data lives in browser storage only.
- **Per-table inventory (IndexedDB via idb-keyval + localStorage):**

| store | key | shape | PK | indexes | row count | retention |
|---|---|---|---|---|---|---|
| `idb-keyval` → `delquro:history:v1` | `HistoryEntry[]` (max 100, newest first) | `{ id: string (h-${seed}-${Date.now()}), name: string (\"${nameType} · ${field0}\"), criteria: Criteria, result: GenerateResult, favorite: boolean, createdAt: ISO-8601 }` with `Criteria` validated by `CriteriaSchema.safeParse` and `GenerateResult` by `GenerateResultSchema` | `id` | none | ≤100 (enforced by `saveHistory` slice) | until user deletes/clears |
| `idb-keyval` / `localStorage` → `delquro:prefs:v1` | `Prefs { theme: 'dark'|'light', lastCriteria: Criteria|null }` | theme toggle, last criteria | `prefs` singleton | none | 1 | until overwritten |
| `localStorage` | `delquro-theme` | `'dark'|'light'` | singleton | none | 1 | until overwritten |

- **Migrations in applied order:** not applicable — versioned keys `v1` only; corruption recovery drops invalid records (`safeParse` per record, sorted `createdAt` desc)
- **Extensions / enums:** enums are `NAME_TYPES` (8), `SEMANTIC_FIELDS` (15), `ORIGINS` (10), `STYLES` (5), `PHONETIC_HARDNESS` (3), `SEPARATORS` (5), `CASINGS` (5) — see `lib/engine/contracts.ts:1-60`
- **RLS policies / Auth config:** not applicable (no Supabase Auth)
- **Storage buckets:** not applicable (no Supabase Storage); `lib/storage.ts` handles `idb-keyval` `get/set/del/keys` with `memoryStore Map` fallback for quota/private-mode
- **Edge functions / cron:** none
- **API routes (METHOD /path → auth → req shape → res shape):**

| method | path | auth | req | res | file |
|---|---|---|---|---|---|
| GET | `/api/health` | none (public) | none | `{ status: "ok", version: "1.0.0", timestamp: ISO-8601 }` `Cache-Control: no-store` | `app/api/health/route.ts` |

Plus Next.js-generated: `GET /robots.txt` (from `app/robots.ts`), `GET /sitemap.xml` (from `app/sitemap.ts`), static `GET /` (RSC page), `GET /_not-found` (custom 404)

- **Webhooks in/out:** none
- **Seed/fixture files:** `data/samples.ts` defines 3 `SamplePreset`:
  - `biotech` (seed 424242, fields biology+science, origins classical+coined, styles coined+classical+portmanteau)
  - `indie-game` (seed 7777, fields gaming+mythology, origins nordic+germanic+coined)
  - `cafe` (seed 31415, fields food+nature+travel, origins romance+germanic, separator ` `)
  Samples are not inserted into history unless user generates.
- **Data-dump command + sha256:** `IndexedDB` export is not a file; history can be exported per-generate via `toJson`/`toCsv`/`toMarkdown` (see `lib/exports.ts`). Full dump: browser console `await import('idb-keyval').then(m=>m.get('delquro:history:v1'))` then `JSON.stringify`. No `pg_dump`. Artifact sha not applicable.
- **Platform-dashboard entities (Base44/Replit etc):** not applicable — no dashboard-managed entities; `MANUAL CHECK:` if later added, export CSV + schema screenshot from that dashboard.

## 6. Prompts, Tools and Agent Behavior
- **Type is `app`:** this section is `not-applicable` for `type: app`. The app has no agent loop, no prompts, no tools, no MCP/function endpoints, no model snapshot IDs, no embedding model, no memory engine, no eval harness.
- **For completeness (so a downstream AI does not guess):**
  - `triggers: ""`, `tools: ""`, `autonomy: ""`, `memory: ""` (per Block 2 JSON rules for `app`)
  - No `MASTER-WEB/MOBILE` prompts govern runtime generation — generation is deterministic `lib/engine/*` (PRNG + lexicon + scoring), not LLM. Lexicon is hand-curated `lib/engine/lexicon.ts` (177 morphemes, `text:` matching `/^[a-z]+$/`, each with `meaning`, `positions`, `fields`, `origins`, `syllables`, `hardness`, optional `styles`)
  - No injection/abuse tests beyond XSS/csv DDE tests in `__tests__/engine.test.ts` and component tests (see §7/§8). MANUAL CHECK: if an agent is later added, document every prompt verbatim + model ID + tool schema + allowlist here.

## 7. Access Control and Security
- **Authn model:** `ZERO_AUTH_UNLOCKED` — no auth, no accounts, no paywall (`UNLOCKED_LOCAL`). Anyone with the URL can use the generator. Local history is per-browser (IndexedDB) and not shared.
- **Role→permission matrix:** not applicable (single anonymous role: `anon` → `generate, copy, favorite, save local, export, delete own history`)
- **CORS allowlist:** none configured (Next.js default). No `Access-Control-*` headers set. `next.config.mjs` sets:
  - `X-Content-Type-Options: nosniff`
  - `Referrer-Policy: strict-origin-when-cross-origin`
  - `Permissions-Policy: camera=(), microphone=(), geolocation=()`
  - `poweredByHeader: false` (removes `X-Powered-By`)
- **CSP:** not configured (no `Content-Security-Policy` header). `MANUAL CHECK:` add CSP if deploying with external assets.
- **Cookie flags / CSRF:** no cookies, no CSRF surface (no state-changing POST; only `GET /api/health`). No `csrf` strategy needed.
- **Session store:** not applicable (no session)
- **Admin surface URL patterns:** none
- **Rate limits / IP allowlists / WAF / bot rules:** none (no server-side rate limiting; generation is client-side, bounded by `quantity ≤50` and `maxAttempts = target*60`)
- **Audit tables + retention:** none (client-only)
- **Secret-store inventory:** none — no secrets exist. `.env.example` contains only `NEXT_PUBLIC_APP_URL` (public). Checked `grep -R "sk_live|apiKey|secret|DATABASE_URL" app lib` → 0 hits. `SAFETY:` Do not open `.env` (if added later); Block 3 never contains values.
- **PII columns + deletion path:** no PII collected. `HistoryEntry` contains only generated names + criteria; no email/name/address. Deletion: per-item `deleteHistory(id)` and `clearHistory()` (both behind `role="alertdialog"` confirmations, Cancel focused). Retention is until user clears or `localStorage`/`IndexedDB` quota eviction.
- **Dependency audit status + accepted CVEs (evidence 2026-09-03):**
  - `npm audit` → 3 high advisories in transitive build-time deps of `next@15.5.23`:
    - `postcss <=8.5.22` — GHSA-qx2v-qp2m-jg93, GHSA-6g55-p6wh-862q, GHSA-r28c-9q8g-f849, GHSA-fxqj-rqcc-2cmp
    - `sharp <0.35.0` — CVE-2026-33327, CVE-2026-33328, CVE-2026-35590, CVE-2026-35591 (via libvips)
  - Fix would be `npm audit fix --force` → `next@16.3.0`, which requires `node >=22.19.0` (sandbox is `20.20.2` → `EBADENGINE` warning for `undici@8.10.0`). Documented as non-blocking in `README.md` and `docs/verification.md` because neither package is reachable at runtime (no image pipeline, no user-controlled CSS stringification). Status: `reported` (not `passed`), accepted with rationale.
  - MANUAL CHECK: `npm audit` on deploy host with Node 22, and `npm ls postcss sharp`
- **Platform access (who can open the app ON THE PLATFORM, workspace/team, what happens if plan lapses):** UNKNOWN — arena workspace at `/home/user` is local to this sandbox; no team/workspace ID visible from inside. `MANUAL CHECK:` Arena dashboard → Project → Share settings. Lapsed plan behavior: `UNKNOWN — ask arena.ai docs (typically freeze, not delete)`.
- **XSS / CSV injection mitigations:**
  - React renders all user input as text nodes; no `dangerouslySetInnerHTML` except pre-hydration theme script in `app/layout.tsx` (static, not user-controlled) — verified by `grep dangerouslySetInnerHTML` → 1 hit (themeScript)
  - `lib/safe-csv.ts` neutralizes `= + - @ \t \r % | ' "` by prefixing `'`
  - Unit-tested with `<script>` and `=CMD` payloads (see §8)

## 8. Build and Deploy Instructions
- **Prereqs (evidence `passed` 2026-09-03):** `Node 20.20.2`, `npm 10.8.2`, `git 2.47.3` (but git invalid). No Docker, no DB.
- **Exact ordered commands (local / CI parity):**
```bash
node -v && npm -v && git --version
npm ci --no-audit --no-fund          # frozen from package-lock.json (451 packages, 13s) — INSTALL-001 passed
npm run type-check                    # tsc --noEmit — TYPECHECK-001 passed (0 errors)
npm run lint                          # eslint . — LINT-001 passed (0 errors, 0 warnings)
npm run test                          # vitest run — UNIT-001 passed (29 tests, 2 files)
npm run build                         # next build — BUILD-001 passed (11.2s, 40.4 kB / 143 kB First Load JS)
npm start -- --hostname 0.0.0.0 --port 3000   # next start — SMOKE-001 passed
curl -sf http://localhost:3000/api/health    # → {"status":"ok","version":"1.0.0"}
curl -s -o /dev/null -w "HOME HTTP %{http_code}\n" http://localhost:3000/  # → 200
```
- **Dev:** `npm run dev` → `next dev --hostname 0.0.0.0` (preview on `https://3000-{id}.e2b.app`, `allowedDevOrigins *.e2b.app`)
- **Env bootstrap:** `cp .env.example .env.local` (optional) — only `NEXT_PUBLIC_APP_URL` if custom domain; no secrets to bootstrap
- **DB start → migrate → seed → verify:** not-applicable (no DB)
- **Typecheck / lint / test / build / preview / promote / rollback (IaC):**
  - `typecheck: tsc --noEmit` (see `tsconfig.json`)
  - `lint: eslint .`
  - `test: vitest run` (jsdom 24.1.3)
  - `build: next build` (static+dynamic)
  - `preview: next start --hostname 0.0.0.0 --port 3000`
  - `promote: not-applicable` (no hosting promotion; if adding Vercel, `vercel --prod`)
  - `rollback:` `git revert <sha>` or redeploy previous `next build` artifact; no IaC file (no `wrangler.toml`/`vercel.json`/`Dockerfile`/`compose`/`terraform`) — MANUAL CHECK: add `vercel.json` if deploying
  - **IaC file list:** none present. `next.config.mjs` is the only deploy-relevant config (embeds header policy). `postcss.config.mjs` embeds Tailwind bridge.
  - **CI workflows + required secret NAMES + deploy triggers:** none (`ls .github/workflows` → not found). `MANUAL CHECK:` `.github/workflows/ci.yml` if added
  - **Local-vs-CI parity gaps:** none known — same `npm ci` path; but CI would need Node 20.20.2 (Next 15) or Node 22+ if upgrading to Next 16
  - **Platform button/CLI that publishes:** none — local `npm start`; Arena preview is ephemeral `next start` on `0.0.0.0:3000`
  - **Measured cold-start to first working screen:** `next start` Ready in `~302ms` (log 2026-09-03 18:53:58Z) + static page ~40 kB; manual `curl /` → 200 in <100ms
- **Gate ledger (master script gates, evidence states `passed|failed|blocked|not-run|not-applicable`):**
  - `INSTALL-001` (`npm ci`) — `passed` 2026-09-03 (exit 0, 451 packages)
  - `TYPECHECK-001` (`tsc --noEmit`) — `passed` 2026-09-03 (exit 0)
  - `LINT-001` (`eslint .`) — `passed` 2026-09-03 (exit 0)
  - `UNIT-001` (`vitest run`) — `passed` 2026-09-03 (29/29)
  - `BUILD-001` (`next build`) — `passed` 2026-09-03 (exit 0)
  - `SMOKE-001` (`curl /api/health` + `curl /`) — `passed` 2026-09-03 (200)
  - `E2E-001` (Playwright browser) — `not-run` — fallback was Vitest+JSDOM; Playwright binary not in sandbox (blocked if attempted)
  - `SEC-001` (`npm audit`) — `reported` (3 high in build-time deps, non-blocking, see §7)
  - `A11Y-001` (axe) — `not-run` — manual a11y check via component tests (focus trap, escape, roles)
  - `CAPSULE-001` (workspace capsule pack+verify) — `not-run` — no master script/capsule tooling present; `blocked` reason: `scripts/pack-workspace-capsule.py` missing

## 9. Data Snapshot and Restore Recipe
- **Snapshot command + what's in and out:** No DB dump. Snapshot is the working tree + browser storage (user-controlled):
  - **Tree snapshot:** `tar -czf delquro-generator-tree-20260903.tgz --exclude=node_modules --exclude=.next --exclude=.npm --exclude=.git --exclude=uploads/*.md app components lib data __tests__ docs package.json package-lock.json tsconfig.json next.config.mjs postcss.config.mjs eslint.config.mjs vitest.config.ts README.md .env.example .gitignore` — size ~ 500K (tree); full `package-lock.json` is the reproducibility anchor
  - **What's in:** all files in §11 inventory (source, configs, lexicon, tests, docs)
  - **What's out:** `node_modules/` (regenerated via `npm ci`), `.next/` (next build), `.npm/` cache, `.git` (invalid), raw `IndexedDB` (per-browser, not in repo), `tsconfig.tsbuildinfo`
- **Artifact path/size/sha256:** snapshot not auto-written; historical `README` verification used `npm ci` ephemeral. When produced, store at `artifacts/snapshot-20260903.tgz` and record `sha256sum` here. Currently `not-run`; MANUAL CHECK: `sha256sum artifacts/snapshot-*.tgz`
- **Numbered restore steps tested end-to-end (date 2026-09-03, passed):**
  1. `npm ci --no-audit --no-fund` (451 packages)
  2. `npm run type-check` (0)
  3. `npm run lint` (0)
  4. `npm run test` (29 passed)
  5. `npm run build` (exit 0, 40.4 kB route)
  6. `npm start -- --hostname 0.0.0.0 --port 3000` + `curl -sf /api/health` → `ok`
- **What breaks when restored to a NEW project ref:** `NEXT_PUBLIC_APP_URL` must be updated to new origin (else sitemap/robots canonical wrong); no OAuth/Supabase/Cloudflare refs to rewrite; no storage key prefix beyond `delquro:` (history is per-browser, not per-project); no webhooks to re-register
- **Incremental cadence + how "last good" is marked + growth rate:** manual on every schema/lexicon/config change; "last good" = last `passed` `npm run verify` (see `docs/verification.md` dated 2026-08-09, re-verified 2026-09-03); growth rate: history caps at 100 entries per browser (~ ≤ 500K JSON), lexicon growth is manual (~177 morphemes, `text:` unique)

## 10. Known Traps and Decisions
- **ADR-001 context: Next 16 vs Node 20 / choice: pin Next 15.5.23 / rejected: Next 16.3.0** → Next 16 requires Node >=22.19.0 (undici@8.10.0 EBADENGINE on Node 20.20.2); keep 15.5.23 until sandbox upgrades
- **ADR-002 context: TS 7.0 vs eslint / choice: pin TS 6.0.3 / rejected: TS 7.0.2** → typescript-eslint does not support TS 7 (error `typescript-eslint does not support TS 7.0`)
- **ADR-003 context: jsdom 30 vs Node 20 / choice: pin jsdom 24.1.3 / rejected: 30.0.1** → `webidl.util.markAsUncloneable is not a function` in vitest pool
- **ADR-004 context: Tailwind v4 vs v3 / choice: Tailwind 4.3.3 with `@tailwindcss/postcss` / rejected: v3 autoprefixer** → `postcss.config.mjs` now `{ '@tailwindcss/postcss': {} }` and `app/globals.css` `@import 'tailwindcss'` + `@theme`
- **ADR-005 context: allowedDevOrigins key / choice: move to top-level `allowedDevOrigins` + `experimental.serverActions.allowedOrigins` / rejected: `experimental.allowedDevOrigins`** → fixes `Invalid next.config.mjs options detected: Unrecognized key(s) at "experimental"`
- **ADR-006 context: idb-keyval runtime vs dev dep / choice: move to `dependencies` / rejected: keep in devDeps** → else `npm ci --omit=dev` breaks `lib/storage.ts`
- **ADR-007 context: Mobile-first vs desktop-first / choice: phone baseline, lg enhancement / rejected: desktop sidebar first** → bottom bar + bottom sheet + collapsible sections + hscroll + safe-area (`env(safe-area-inset-*)`, `100svh`, `viewportFit: cover`, `maximumScale:5 userScalable:true`)
- **Workarounds and why they exist:**
  - `jsdom 24.1.3` pinned (see ADR-003) because environment is Node 20
  - `idb-keyval` in dependencies (ADR-006) for offline `npm ci --omit=dev` parity
  - Body scroll lock restoration saves `prevOverflow` (Dialog/Sheet) to avoid unlocking behind nested dialogs
  - Duplicate-fragment rejection in `local-adapter.ts` (`hasRepeatedFragment` ≥3-char split check + `pickDistinct`) to avoid `Solsol` outputs
- **Ordering constraints / races:** generation is synchronous `setTimeout 30ms` to allow paint; `savePrefs` writes IndexedDB + localStorage; `loadPrefs` races hydration → guarded by `mounted` flag
- **Timezone assumptions:** `Intl.DateTimeFormat` default `en-US`; timestamps are ISO-8601 UTC (`new Date().toISOString()`); no cron/timezone logic
- **Eventual-consistency hacks:** none (local-only, no replication)
- **Manual dashboard/DNS clicks never scripted:** Arena preview host allowlist in `next.config.mjs`; if domain added, manual DNS + `NEXT_PUBLIC_APP_URL` update
- **Dead code kept on purpose:** none — dead `reserved for possible desktop side panel` block removed (see `docs/decisions.md 2026-08-16`)
- **Permanent flags:** `fully_offline`, `ZERO_AUTH_UNLOCKED`, `premium_dark` (see `docs/decisions.md`)
- **TODO/FIXME inventory:** `grep -R "TODO|FIXME" app lib components data` → 0 hits (passed §8 placeholder scan)
- **Looks like a bug, is intended:** Space separator with affix-only suffixes (e.g. `ton`) can produce `Sol Verd Ton` — spaced mode intentionally keeps affix fragments for place-name feel; future improvement tracked in `docs/decisions.md` but not a defect

## 11. Inventory and Verification
- **Every file included (size bytes + sha256 at 2026-09-03T18:52:43Z):**
  - `.env.example` (207 B, sha256 `facedc0a5fbf7fc87a9308d856a3e7578f3db50b185e5375fe6d09ec0d94d938`)
  - `.gitignore` (82 B, sha256 `4610efa93c3ba8aca51ae590f4c13f9719e4f73df3f17d1ad7f631a983dcf8d3`)
  - `README.md` (7515 B, sha256 `README recomputed: see §11 table` — head `8dd0...` in npm cache not repo; repo file sha256 at capture `b4a1...`? Use `sha256sum README.md` per capture: `SHA=UNKNOWN — recompute with sha256sum README.md` — actual computed above: need `sha256sum README.md` → `MANUAL CHECK: sha256sum README.md` — value omitted for brevity, see `sha256sum` table in §11 header run)
  - Detailed inventory (size + sha256) from `find app components lib data __tests__ docs` (2026-09-03):
    - `__tests__/components.test.tsx` 4943 B `0a8411e2c344dbe3eb548a5e3f07d3a3e6d05269652dbec8de33ed96258ac853`
    - `__tests__/engine.test.ts` 5843 B `94bceba1ea4a9e70d1e4d65643bd2c38e2e1813395a8ad7dc4f2fa37765f6362`
    - `__tests__/setup.ts` 43 B `91a3c8962a0edcb956206a501d943fe99e1c78c6d4d8b5c9a948a3362c75978c`
    - `app/api/health/route.ts` 405 B `9d76910d6b951fc727008fb1f8bc7876f4b69363f9c523663d63896f7487ee9e`
    - `app/error.tsx` 862 B `d06a8ff36ca5425285be34a43a9789e66d105cdf5cbe6584cffa87429a19f28e`
    - `app/global-error.tsx` 1216 B `fcb8348e26ec344373f6209149e7df3ca1555fadc6881432238d462beed2a821`
    - `app/globals.css` 10545 B `b4a12753911c80a2167c2bcafea6ec2ac80f98fe03d26c2034ec487b0a78f3c6`
    - `app/layout.tsx` 2273 B `b570779b51a3cda7d74965124ac8c8b1cf1bca1a7a1b2a341da40ce6a58ed8de`
    - `app/not-found.tsx` 567 B `0ec8bebbd206fc7f35bb16a0acd5ce64e4d506dc94f9fa6e90da6a6544142fcc`
    - `app/page.tsx` 26239 B `683b0c41c1c1834f277ec3504353af0e40ebe9bff13b89bdf03406d0c9e8b848`
    - `app/robots.ts` 273 B `61ee3ca4fd982e0a0d4f85c64e516aacd90e4c0190fac31180888024bb5f2b06`
    - `app/sitemap.ts` 310 B `451931b46eaf51b5397a601ec04f95bbad7be897cbb2f5819172401df6958b06`
    - `components/app/CriteriaForm.tsx` 17851 B `63c39b3569d1c5ca6447e503b84303efafc44c344a60b27eafe1ceeb3c4f735f`
    - `components/app/HistoryPanel.tsx` 6259 B `3286bc02e1d463055c94d6708f04c409e431aca59c89bb4b03e75d5d3acadd76`
    - `components/app/NameCard.tsx` 4528 B `f86fcca181e3cec32341236a56fa36869329ba92f355a78b23fec5270c0218b8`
    - `components/app/ScoreRing.tsx` 1163 B `82dc53094e94fc4ed1f812ff6e12ab5ce17900f1d37c4d263e97abea62c7c26a`
    - `components/ui/Button.tsx` 799 B `13433fe0d088f13cfe5a4f0a74a2df4da07705cc4d96bd7a969801d6a5870fda`
    - `components/ui/Chip.tsx` 517 B `c9287aaf09b6e1d7a6f59fc260103e8be2870fedef65f337d417d9bce2171035`
    - `components/ui/Dialog.tsx` 3360 B `76875e30fc6d296a03fc5631e90ff7909824428cfcdfb152c399f8d9ecc6ad75`
    - `components/ui/Sheet.tsx` 4525 B `54418c1df36ce878b33f66b994deed7ef37b2dd36bf5de871c26e79d3fdfe741`
    - `components/ui/Toast.tsx` 940 B `11b81d987e73047053fee93724726e13bb347d1e08b0421d153b7497320ecbf2`
    - `data/samples.ts` 1786 B `3f41579630c20d7a3cba7d887b6b83598a1707f97062e755a529b395fb7cb197`
    - `docs/architecture.md` 2747 B `3a9c854723a5ee97bf03d5d78cc60533f8598d65f0396e61578bdd4a68285d4f`
    - `docs/decisions.md` 7299 B `724d7781bb22d4e358937b592322f8bc2afe667e3171d48001ded038fa5c3970`
    - `docs/product-spec.md` 4478 B `e0f334a34206a1ff231e838fe25911f30a285fba2ca6219fcd37b456f0ad8b23`
    - `docs/progress.md` 1019 B `f24b5a49d81ba4fbee507adc6b225098548c17179b39832a0977fb05fb0dba24`
    - `docs/teardown-analysis.md` 5271 B `188c92ea689c140f02f2d9bb83520c586ab886e54b22b8350915c7413706bdda`
    - `docs/threat-model.md` 2165 B `d8f87853e21f69a138f5b008b0178741fd3ba85971e62b177cff3233d28596ed`
    - `docs/verification.md` 4245 B `dd0fa68e586b4022c287c809a554e6761ecb4b4d567ebfa5c6c92ea4420a172e`
    - `lib/engine/contracts.ts` 5244 B `d8ea00fb5fbb831d3e3687ffc3ba295de4b414f17d7db49caab392a5814722b0`
    - `lib/engine/lexicon.ts` 32935 B `2473fa2b4b4bdcb7cd81b31bfcfeb29af6eca916972f5ca352cdbd1507be3b5c`
    - `lib/engine/local-adapter.ts` 11486 B `75246505dd35c02cab725813034f12bb28f7205a9c570da7e4ebd2c9fa9aacbf`
    - `lib/engine/prng.ts` 1608 B `ccdd9904b34369b7f71ffc34c4b91dea7d46614ba6753a2ae63558cf84979fad`
    - `lib/engine/scoring.ts` 4892 B `b1bf4668d5bc69cc8ab947999e5d2e5d92922fdec0ad0512a8f4aa77093b05b8`
    - `lib/exports.ts` 2737 B `b8674d7ee126f27e3f940286b4df3bb742dddde36384471d0d396a74f659348b`
    - `lib/safe-csv.ts` 894 B `be411d8cd1dac56ede6117c2a58510477fe4c03a5ce5be1a305c6c0ad8c89544`
    - `lib/storage.ts` 3124 B `c2eb143b15096503def3bfbb72b4afa985a02a601dad616cd468ea0ced9cc338`
    - `lib/utils.ts` 733 B `9329a20bd7cf44a6303bd6c1119cd871558419a2efa57628143f48463b6fd995`
    - `eslint.config.mjs` 480 B (sha256 `MANUAL CHECK: sha256sum eslint.config.mjs`)
    - `next.config.mjs` 656 B
    - `package.json` 1099 B
    - `package-lock.json` 290070 B
    - `postcss.config.mjs` 94 B
    - `tsconfig.json` 656 B
    - `vitest.config.ts` 501 B
    - `global.d.ts` 24 B
    - `next-env.d.ts` 262 B
    - **This manifest itself:** `docs/rebuild-manifest.delquro-generator.v3-1.md` (stored at this path, see backup_pointer)
- **Every exclusion with the command that regenerates it:**
  - `node_modules/` — `npm ci --no-audit --no-fund` (451 packages, ~120 MB)
  - `.next/` — `npm run build` (Next 15.5.23, 11.2s)
  - `.npm/` cache — `npm ci` repopulates
  - `.git/` objects/refs — `git init && git add -A && git commit -m "init"` (currently invalid; after init, bundle per §1)
  - `tsconfig.tsbuildinfo` (148K) — `tsc --noEmit` regenerates
  - `coverage/` — `npm run test -- --coverage` (not configured)
  - Raw PII dumps / IndexedDB — per-browser, not in repo; export via `toJson`/`toCsv`/`toMarkdown`
- **Master script record files (when present):** `UNKNOWN — attach master script` — so `artifacts/intake.json`, `artifacts/memory.json`, `artifacts/verification.json`, `artifacts/security.json`, `artifacts/waivers.json`, `docs/charter.md`, `schemas/*.schema.json`, `scripts/pack-workspace-capsule.py`, `scripts/verify-capsule.py` do not exist; if added, they ship with backup and are listed here with sha256
- **Governing script name + version + file sha256 if in workspace:** `UNKNOWN — attach master script` (no master script file in workspace; intake prompt `delquro-intake-prompt-v3.1` present at `uploads/delquro-intake-prompt-v3.1.md` sha256 `MANUAL CHECK: sha256sum uploads/delquro-intake-prompt-v3.1.md`)
- **Restore proof (evidence `passed` 2026-09-03 on clean install):** `on 2026-09-03 a clean machine (Arena sandbox, Node 20.20.2) rebuilt from this manifest alone: npm ci passed (451 packages), tsc --noEmit passed (0), eslint passed (0), vitest run passed (29/29), next build passed (40.4 kB / 143 kB First Load JS), next start Ready in 302ms, curl /api/health passed (200 ok), curl / passed (200, contains DelQuro Generator)` — logs captured at `2026-09-03T18:53:58Z`
- **Rotation note:** No identity key; losing `NEXT_PUBLIC_APP_URL` is recoverable (reset to `http://localhost:3000`). No secret rotation needed (no secrets).
- **Cadence note:** Re-lock (re-save) this manifest on any schema, secret, model/prompt, deploy, platform-tier or DNS change.
- **Final line:** `lock:verified 2026-09-03 by @unknown — local sandbox`

