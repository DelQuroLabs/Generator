# API key generator

Open `/api-keys`, or follow **API key generator →** in the home header.

- Web Crypto `getRandomValues`, independent of the deterministic name engine.
- Hexadecimal, URL-safe, and alphanumeric formats; unbiased rejection sampling.
- 32–128 random characters, optional 0–24 character prefix, 1–20 keys per batch.
- Hidden by default, reveal/hide, copy individual/all, explicit plaintext download, clear.
- In-memory React state only: no history, persistence, telemetry, or network submission of keys.
- Prefix adds no entropy. Minimum random entropy is 128 bits (32 hex characters).
- No fallback to insecure randomness; unavailable Web Crypto fails with an error.

These are credentials to provision in your own system, not third-party-issued API keys. Backend authentication, scopes, hashing, expiry, rate limits and revocation are outside this local generator. Clipboard history and downloaded plaintext files can expose keys. Clearing the view does not wipe clipboard/files, revoke keys, or guarantee JavaScript memory erasure.

## Verification — 2026-10-03

`npm run verify` passed: TypeScript, ESLint, 38 tests across 3 files, Next production build. Evidence: `artifacts/evidence/api-keys-verify.log`. HTTP `/api-keys` and `/api/health` returned success after restarting production server. Real-browser interaction, accessibility, visual and performance checks remain unverified. Earlier security evidence predates this feature; no fresh full dependency/security audit was performed this turn. This is not a release-ready declaration.

## ZIP

The source ZIP includes source, tests, configuration, package lockfile, docs and evidence. It excludes dependencies/build caches, VCS internals, uploaded prompts, local environment files (except `.env.example`), and generated credentials. Extract, run `npm ci`, `npm run build`, then `npm start`. Use HTTPS for a remote deployment. No paid API or API key is required to run it.
