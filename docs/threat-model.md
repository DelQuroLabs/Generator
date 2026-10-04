# Threat Model — DelQuro Generator

## Assets
- User criteria/history/favorites (local, on-device).
- Generated names (non-sensitive, local).

## Trust Boundaries
- All processing is client-side. There is **no server fetch, no API, no SSRF surface**.
- React renders user input as text nodes only (no `dangerouslySetInnerHTML` for untrusted content).

## Abuse Cases & Mitigations

| Threat | Mitigation | Verification |
|---|---|---|
| XSS via user input (must-include, custom fields) rendered in results/exports | React text-node escaping; no raw HTML; JSON-LD not used; CSV formula-safe escaping | Unit test with `</script><script>alert(1)</script>` payload; grep for dangerouslySetInnerHTML |
| CSV/DDE formula injection on export | `lib/safe-csv.ts` prepends `'` to dangerous prefixes (`= + - @ \t \r % | ' "`) | Unit tests for all prefixes |
| Client-side secret exposure | No secrets/API keys exist; no remote adapter; no `.env` secrets | grep for keys; client bundle audit |
| Prompt injection in untrusted content | No untrusted remote content is ingested; user input is treated strictly as data (Rule 2). Any pasted text is escaped and never executed. | Code review; no eval/Function |
| Storage corruption / quota | SSR-safe idb wrapper; try/catch; schema validation; in-memory fallback; corruption drops bad record | Unit tests for parse failure |
| Destructive action (delete/clear history) | Accessible `alertdialog`, Cancel focused by default, explicit confirmation | Component/E2E test |
| Prototype pollution / malformed criteria from storage | Zod parse on all boundaries; strict schemas | Unit tests |
| Clickjacking in preview | Framing policy permits `*.e2b.app` preview; anti-clickjacking otherwise | Headers config |
| Denial of service via huge quantity | Quantity capped at 50; generation bounded; no recursion bombs | Boundary tests |

## Residual Risks
- Local storage is accessible to the user's own browser/device (by design; no server to secure).
- No authentication layer (product has no accounts).

## Status
All mitigations implemented and verified in Phase 8. No remote attack surface (no outbound fetch exists in the codebase).
