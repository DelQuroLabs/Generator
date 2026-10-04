import {
  type Criteria,
  type GeneratedName,
  type GenerateResult,
  type Morpheme,
  type NameStyle,
  type Origin,
  type SemanticField,
} from './contracts';
import { MORPHEMES } from './lexicon';
import { mulberry32, pick, pickWeighted, shuffle, type Rng } from './prng';
import { buildGeneratedName } from './scoring';

function byPosition(m: Morpheme, pos: Morpheme['positions'][number]): boolean {
  return m.positions.includes(pos);
}

function filterPool(
  pool: readonly Morpheme[],
  fields: readonly SemanticField[],
  origins: readonly Origin[],
  styles: readonly NameStyle[],
): Morpheme[] {
  return pool.filter((m) => {
    const fieldOk = fields.length === 0 || m.fields.some((f) => fields.includes(f));
    const originOk = origins.length === 0 || m.origins.some((o) => origins.includes(o));
    const styleOk = !m.styles || m.styles.length === 0 || m.styles.some((s) => styles.includes(s));
    return fieldOk && originOk && styleOk;
  });
}

/** Apply casing + separator to raw component parts. */
export function assemble(
  parts: readonly string[],
  separator: Criteria['separator'],
  casing: Criteria['casing'],
): string {
  const sep = separator === 'none' ? '' : separator;
  let joined: string;
  if (sep === '') {
    // pascal-ish by default; casing overrides
    joined = parts.map((p) => p.charAt(0).toUpperCase() + p.slice(1)).join('');
  } else {
    joined = parts.join(sep);
  }

  switch (casing) {
    case 'lower':
      return joined.toLowerCase();
    case 'upper':
      return joined.toUpperCase();
    case 'pascal':
      return joined
        .split(sep)
        .map((p) => p.charAt(0).toUpperCase() + p.slice(1).toLowerCase())
        .join(sep);
    case 'camel': {
      const pascal = joined
        .split(sep)
        .map((p) => p.charAt(0).toUpperCase() + p.slice(1).toLowerCase())
        .join(sep);
      return pascal.charAt(0).toLowerCase() + pascal.slice(1);
    }
    case 'preserve':
    default:
      return joined;
  }
}

function passesHardConstraints(name: string, criteria: Criteria): boolean {
  if (name.length < criteria.minLength || name.length > criteria.maxLength) return false;
  if (criteria.startsWith && !name.toLowerCase().startsWith(criteria.startsWith.toLowerCase())) return false;
  if (criteria.endsWith && !name.toLowerCase().endsWith(criteria.endsWith.toLowerCase())) return false;
  if (criteria.mustInclude && !name.toLowerCase().includes(criteria.mustInclude.toLowerCase())) return false;
  if (criteria.mustNotInclude && name.toLowerCase().includes(criteria.mustNotInclude.toLowerCase())) return false;
  // no repeated separators / leading/trailing separator
  if (/[\s._-]{2,}/.test(name)) return false;
  if (/^[\s._-]|[\s._-]$/.test(name)) return false;
  return true;
}

function chooseField(criteria: Criteria, rng: Rng): SemanticField {
  if (criteria.fields.length === 0) return pick(MORPHEMES, rng).fields[0]!;
  return pick(criteria.fields, rng);
}

function chooseOrigin(criteria: Criteria, rng: Rng): Origin {
  if (criteria.origins.length === 0) return pick(MORPHEMES, rng).origins[0]!;
  return pick(criteria.origins, rng);
}

function weightForStyle(style: NameStyle, field: SemanticField, pool: readonly Morpheme[]): number {
  const matching = pool.filter((m) => m.fields.includes(field)).length;
  const base = style === 'coined' ? 3 : style === 'compound' ? 2 : 1.5;
  return base + Math.min(2, matching / 10);
}

/** Pick a morpheme from pool whose text isn't already in `taken`. */
function pickDistinct(pool: Morpheme[], taken: readonly string[], rng: Rng): Morpheme | null {
  const available = pool.filter((m) => !taken.includes(m.text));
  if (available.length === 0) return pool.length ? pick(pool, rng) : null;
  return pick(available, rng);
}

function buildCoined(prefixes: Morpheme[], roots: Morpheme[], suffixes: Morpheme[], rng: Rng, criteria: Criteria): { parts: Morpheme[]; text: string } {
  const usePrefix = prefixes.length > 0 && rng() > 0.25;
  const useSuffix = suffixes.length > 0 && rng() > 0.2;
  const rootPool = roots.length ? roots : MORPHEMES.filter((m) => byPosition(m, 'root'));
  const parts: Morpheme[] = [];
  const taken: string[] = [];
  const root = pickDistinct(rootPool, taken, rng);
  if (root) {
    parts.push(root);
    taken.push(root.text);
  }
  if (usePrefix) {
    const p = pickDistinct(prefixes, taken, rng);
    if (p) {
      parts.unshift(p);
      taken.push(p.text);
    }
  }
  if (useSuffix) {
    const s = pickDistinct(suffixes, taken, rng);
    if (s) {
      parts.push(s);
      taken.push(s.text);
    }
  }
  return { parts, text: assemble(parts.map((p) => p.text), criteria.separator, criteria.casing) };
}

function buildCompound(roots: Morpheme[], rng: Rng, criteria: Criteria): { parts: Morpheme[]; text: string } {
  const r = roots.length >= 2 ? roots : MORPHEMES.filter((m) => byPosition(m, 'root'));
  const a = pick(r, rng);
  const b = pickDistinct(r, [a.text], rng) ?? a;
  const parts = [a, b];
  return { parts, text: assemble(parts.map((p) => p.text), criteria.separator, criteria.casing) };
}

function buildClassical(prefixes: Morpheme[], roots: Morpheme[], suffixes: Morpheme[], rng: Rng, criteria: Criteria): { parts: Morpheme[]; text: string } {
  const rootPool = roots.length ? roots : MORPHEMES.filter((m) => byPosition(m, 'root'));
  const parts: Morpheme[] = [];
  const taken: string[] = [];
  const root = pickDistinct(rootPool, taken, rng);
  if (root) {
    parts.push(root);
    taken.push(root.text);
  }
  if (prefixes.length && rng() > 0.4) {
    const p = pickDistinct(prefixes, taken, rng);
    if (p) {
      parts.unshift(p);
      taken.push(p.text);
    }
  }
  if (suffixes.length) {
    const s = pickDistinct(suffixes, taken, rng);
    if (s) {
      parts.push(s);
      taken.push(s.text);
    }
  }
  return { parts, text: assemble(parts.map((p) => p.text), criteria.separator, criteria.casing) };
}

function buildPortmanteau(roots: Morpheme[], rng: Rng, criteria: Criteria): { parts: Morpheme[]; text: string } {
  const r = roots.length >= 2 ? roots : MORPHEMES.filter((m) => byPosition(m, 'root'));
  const a = pick(r, rng);
  const b = pickDistinct(r, [a.text], rng) ?? a;
  const aCut = a.text.slice(0, Math.max(2, Math.ceil(a.text.length / 2) + 1));
  const bCut = b.text.slice(Math.max(1, Math.floor(b.text.length / 2) - 1));
  const blended = aCut + bCut;
  return { parts: [a, b], text: assemble([blended], criteria.separator, criteria.casing) };
}

function buildEvocative(roots: Morpheme[], rng: Rng, criteria: Criteria): { parts: Morpheme[]; text: string } {
  const r = roots.length ? roots : MORPHEMES.filter((m) => byPosition(m, 'root'));
  const root = pick(r, rng);
  const parts = [root];
  return { parts, text: assemble([root.text], criteria.separator, criteria.casing) };
}

/**
 * Deterministic name generation. Pure function of (criteria, seed).
 */
export function generateNames(inputCriteria: Criteria, seed: number): GenerateResult {
  const criteria = { ...inputCriteria };
  const rng = mulberry32(seed >>> 0);

  const prefixes = filterPool(MORPHEMES.filter((m) => byPosition(m, 'prefix')), criteria.fields, criteria.origins, criteria.styles);
  const roots = filterPool(MORPHEMES.filter((m) => byPosition(m, 'root')), criteria.fields, criteria.origins, criteria.styles);
  const suffixes = filterPool(MORPHEMES.filter((m) => byPosition(m, 'suffix')), criteria.fields, criteria.origins, criteria.styles);

  // Fallback: if filters are too narrow, broaden origins/fields progressively.
  const pools = broaden(prefixes, roots, suffixes);

  const results: GeneratedName[] = [];
  const seen = new Set<string>();
  const target = criteria.quantity;
  let attempts = 0;
  const maxAttempts = target * 60;
  let truncated = false;

  while (results.length < target && attempts < maxAttempts) {
    attempts++;
    const field = chooseField(criteria, rng);
    const origin = chooseOrigin(criteria, rng);

    // pick a style weighted by pool viability
    const styleWeights = criteria.styles.map((s) => weightForStyle(s, field, roots));
    const style = pickWeighted(criteria.styles, styleWeights, rng);

    let built: { parts: Morpheme[]; text: string };
    switch (style) {
      case 'compound':
        built = buildCompound(pools.roots, rng, criteria);
        break;
      case 'classical':
        built = buildClassical(pools.prefixes, pools.roots, pools.suffixes, rng, criteria);
        break;
      case 'portmanteau':
        built = buildPortmanteau(pools.roots, rng, criteria);
        break;
      case 'evocative':
        built = buildEvocative(pools.roots, rng, criteria);
        break;
      case 'coined':
      default:
        built = buildCoined(pools.prefixes, pools.roots, pools.suffixes, rng, criteria);
        break;
    }

    if (!passesHardConstraints(built.text, criteria)) continue;
    // Reject names where a fragment repeats inside the assembled text (e.g. "Solsol").
    const lowerText = built.text.toLowerCase();
    const hasRepeatedFragment = built.parts
      .filter((p) => p.text.length >= 3)
      .some((p) => {
        const occ = lowerText.split(p.text).length - 1;
        return occ > 1;
      });
    if (hasRepeatedFragment) continue;
    const key = lowerText;
    if (seen.has(key)) continue;

    // Enforce selected field/origin must be represented by at least one part
    const fieldMatch = criteria.fields.length === 0 || built.parts.some((p) => p.fields.includes(field));
    const originMatch = criteria.origins.length === 0 || built.parts.some((p) => p.origins.includes(origin));
    if (!fieldMatch || !originMatch) continue;

    // Alliteration
    if (criteria.alliteration && built.parts.length > 1) {
      if (built.parts[0]!.text[0] !== built.parts[1]!.text[0]) continue;
    }

    seen.add(key);
    results.push(
      buildGeneratedName({
        name: built.text,
        parts: built.parts,
        style,
        field,
        origin,
        criteria,
      }),
    );
  }

  if (results.length < target) truncated = true;

  // Sort by score desc, then name for stable ordering
  results.sort((a, b) => b.score - a.score || a.name.localeCompare(b.name));

  return {
    seed: seed >>> 0,
    names: results,
    generatedAt: new Date().toISOString(),
    criteria,
    truncated,
  };
}

function broaden(
  prefixes: Morpheme[],
  roots: Morpheme[],
  suffixes: Morpheme[],
): { prefixes: Morpheme[]; roots: Morpheme[]; suffixes: Morpheme[] } {
  if (roots.length >= 2) return { prefixes, roots, suffixes };
  // Widen by dropping style then origin then field filters until viable.
  const allRoots = MORPHEMES.filter((m) => byPosition(m, 'root'));
  const allPrefixes = MORPHEMES.filter((m) => byPosition(m, 'prefix'));
  const allSuffixes = MORPHEMES.filter((m) => byPosition(m, 'suffix'));
  return {
    prefixes: prefixes.length ? prefixes : allPrefixes,
    roots: allRoots,
    suffixes: suffixes.length ? suffixes : allSuffixes,
  };
}

/** Convenience: stable seed derived from a brief + a shuffle nonce. */
export function deriveSeed(criteria: Criteria, nonce: number): number {
  const json = JSON.stringify({
    f: [...criteria.fields].sort(),
    o: [...criteria.origins].sort(),
    s: [...criteria.styles].sort(),
    t: criteria.nameType,
    n: nonce,
  });
  let h = 0x811c9dc5;
  for (let i = 0; i < json.length; i++) {
    h ^= json.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return h >>> 0;
}

export { shuffle };
