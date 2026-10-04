# First-Principles Teardown — DelQuro Generator

**Observation date:** 2026-08-09
**Source mode:** ORIGINAL CONCEPT (no reference URL/site inspected). `gated_feature_recon = NOT_NEEDED`.

> This is an original product concept. There is no competitor site to reverse-engineer. The teardown below is a first-principles analysis of the user problem and the workflow DelQuro must own.

## 1. Fundamental User Problem

People need names — for businesses, products, projects, characters, places, bands, books, pets — but generic generators hand back undifferentiated random strings. The real job is: *"Give me names that fit a brief I can actually control, and tell me why each one fits."*

Beneath "generate a name" sit distinct needs:
- **Fit** — semantic alignment to a field/domain (a biotech startup should evoke bioscience; a café should evoke warmth/place).
- **Legitimacy** — the name should "sound legit": pronounceable, well-shaped, not accidentally awkward or offensive-looking.
- **Distinctiveness** — coined/invented enough to be ownable, but not gibberish.
- **Control** — tune length, syllables, origin/region, starting/ending letters, hard vs. soft sounds, separators, capitalization.
- **Decision support** — compare many candidates, favorite, export, and understand what each name is made of.

## 2. Real Constraints vs. Assumed Convention

- Real constraints: pronounceability, length, hard filters (must contain / must not contain), deterministic repeatability, on-device privacy.
- Assumed conventions to reject: forced signup, paywalled results, "AI magic" black box with no explanation, a single "industry" dropdown with no linguistic control, lorem-ipsum placeholder results.

## 3. Rebuilt From Raw Need (Zero Reference)

A name = a small composition of **morphemes** (meaningful word-parts). The engine composes names from a curated lexicon of prefixes, roots, and suffixes — each tagged with semantic fields, linguistic origin, phonetic traits, and part-of-name position. The user's brief becomes a set of **hard constraints** (filter) and **soft preferences** (weighted scoring). The engine enumerates/assembles candidates, filters, scores, ranks, and explains.

This makes output both **controllable** and **explainable** — the two things generic generators lack.

## 4. Simplest Version That Solves It

- One screen: criteria panel + results.
- A deterministic seeded generator so "same brief + same seed = same list" (reproducible, testable).
- Per-name component breakdown + fit score.
- Copy one / copy all / export JSON/CSV/Markdown / favorite.
- Local history of briefs and favorites.

## 5. Core Workflow (IA)

1. **Choose name type** — Business / Product / Project / Character / Place / Other.
2. **Set semantic field** — one or more fields of study/industries/themes (Tech, Bio/Med, Finance, Nature, Mythology, Space, Food, Fashion, etc.), plus an "all fields" mode.
3. **Set region/language origin** — Latin/Greek classical, Nordic, Romance, Germanic, Slavic, Japanese (romaji), Sanskrit, Global/coined, etc.
4. **Linguistic controls** — style (coined, compound, classical affix, portmanteau, evocative), length range, syllable range, starts-with, ends-with, phonetic hardness, alliteration, separator/case.
5. **Constraints** — must-include substring, must-not-include substring, quantity (1–50), seed.
6. **Generate** → results with score, components, phonetic respelling, rationale, tags.
7. **Act** — copy, favorite, regenerate, lock a prefix/root/suffix, export.

## 6. Input/Output Contract (abstract)

- **Input:** criteria object (see `lib/engine/contracts.ts`).
- **Output:** `{ seed, names: GeneratedName[], generatedAt, criteria }` where each `GeneratedName` = `{ name, components[], syllableCount, phonetic, score, rationale[], tags[], style }`.

## 7. Visual Hierarchy Principles (not copied values)

- Premium dark, high contrast, one violet→cyan accent.
- Criteria as a structured form (left/top) and results as a scannable card grid (right/bottom).
- Score shown as a quiet ring/bar; hard-constraint failures never appear.
- Explanation is one tap away, not hidden behind a paywall.

## 8. Friction Audit (self-imposed targets)

- No signup. No paywall. Everything works offline.
- Results appear instantly (deterministic, local).
- One-click samples. No fake loaders.

## 9. Original Improvements (derived above)

- Component-level morpheme composition (not random syllable bashing).
- Explainable fit score with per-component rationale.
- Deterministic seeded reproducibility.
- "Lock a part" refinement (lock prefix, regenerate the rest).
- Phonetic hardness + alliteration + syllable controls most generators omit.
- Universal "generated locally / on-device" freshness indicator.

## 10. Unknowns / NOT VERIFIED

- Trademark/domain availability is **not** checked (honest limitation; requires external authorities).
- Pronounceability respelling is heuristic, not phonetics-certified.
- Region tags reflect etymological inspiration, not linguistic certification.

## Clean-Room Boundary Statement

No third-party source code, assets, branding, or copyrighted lexicon was used. The morpheme corpus is an original, hand-curated, English-transliteration set built for this product.
