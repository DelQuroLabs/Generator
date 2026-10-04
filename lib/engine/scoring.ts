import type { Criteria, GeneratedName, Morpheme, NameStyle, Origin, SemanticField } from './contracts';

const VOWELS = new Set(['a', 'e', 'i', 'o', 'u', 'y']);

export function countSyllables(text: string): number {
  const s = text.toLowerCase().replace(/[^a-z]/g, '');
  if (s.length === 0) return 0;
  let count = 0;
  let prevVowel = false;
  for (const ch of s) {
    const isVowel = VOWELS.has(ch);
    if (isVowel && !prevVowel) count++;
    prevVowel = isVowel;
  }
  // silent trailing e
  if (s.endsWith('e') && count > 1) count--;
  return Math.max(1, count);
}

/** Heuristic pronounceability 0..1: penalize consonant clusters >3 and odd endings. */
export function pronounceability(name: string): number {
  const s = name.toLowerCase();
  let score = 1;
  const run = s.match(/[^aeiouy]{4,}/g);
  if (run) score -= 0.15 * run.length;
  if (/[bcdfghjklmnpqrstvwxyz]{3}$/.test(s)) score -= 0.1;
  if (/(.)\1{2,}/.test(s)) score -= 0.15;
  if (/^[^aeiouy]{3,}/.test(s)) score -= 0.1;
  if (/[0-9]/.test(s)) score -= 0.3;
  return Math.max(0, Math.min(1, score));
}

function closeness(value: number, min: number, max: number): number {
  if (value < min) return Math.max(0, 1 - (min - value) * 0.25);
  if (value > max) return Math.max(0, 1 - (value - max) * 0.2);
  const target = (min + max) / 2;
  const span = (max - min) / 2 || 1;
  return 1 - Math.abs(value - target) / (span + 2);
}

export interface ScoreInput {
  name: string;
  parts: readonly Morpheme[];
  style: NameStyle;
  field: SemanticField;
  origin: Origin;
  criteria: Criteria;
}

export function scoreCandidate(input: ScoreInput): { score: number; rationale: string[]; tags: string[]; syllableCount: number; phonetic: string } {
  const { name, parts, style, field, origin, criteria } = input;
  const rationale: string[] = [];
  const tags: string[] = [];

  const lengthScore = closeness(name.length, criteria.minLength, criteria.maxLength);
  const syllableCount = parts.reduce((a, p) => a + p.syllables, 0) || countSyllables(name);
  const syllableScore = closeness(syllableCount, criteria.minSyllables, criteria.maxSyllables);

  const avgHardness = parts.reduce((a, p) => a + (p.hardness === 'hard' ? 2 : p.hardness === 'balanced' ? 1 : 0), 0) / (parts.length || 1);
  const targetHard = criteria.hardness === 'hard' ? 2 : criteria.hardness === 'balanced' ? 1 : 0;
  const hardnessScore = 1 - Math.abs(avgHardness - targetHard) / 2;

  // field/origin alignment across parts
  let fieldHits = 0;
  let originHits = 0;
  for (const p of parts) {
    if (criteria.fields.length === 0 || p.fields.includes(field)) fieldHits++;
    if (criteria.origins.length === 0 || p.origins.includes(origin)) originHits++;
  }
  const fieldScore = fieldHits / (parts.length || 1);
  const originScore = originHits / (parts.length || 1);

  const pron = pronounceability(name);

  const allitScore = criteria.alliteration && parts.length > 1
    ? (parts[0]!.text[0] === parts[1]!.text[0] ? 1 : 0.4)
    : 0.7;

  const raw =
    lengthScore * 0.18 +
    syllableScore * 0.15 +
    hardnessScore * 0.12 +
    fieldScore * 0.22 +
    originScore * 0.13 +
    pron * 0.12 +
    allitScore * 0.08;

  const score = Math.round(Math.max(0, Math.min(1, raw)) * 100);

  // Rationale
  rationale.push(`Built from ${parts.map((p) => `"${p.text}" (${p.meaning})`).join(' + ')}`);
  if (fieldScore >= 0.6) rationale.push(`Evokes ${field}`);
  if (originScore >= 0.6) rationale.push(`${origin}-inspired shaping`);
  if (hardnessScore >= 0.7) rationale.push(`${criteria.hardness} phonetics`);
  if (syllableScore >= 0.7) rationale.push(`${syllableCount} syllable${syllableCount === 1 ? '' : 's'}`);
  if (pron >= 0.9) rationale.push('easy to pronounce');
  else if (pron < 0.7) rationale.push('unusual consonant cluster');
  if (criteria.alliteration && allitScore === 1) rationale.push('alliterative');

  tags.push(style, field, origin);
  if (name.length <= 6) tags.push('short');
  if (pron >= 0.9) tags.push('pronounceable');

  return {
    score,
    rationale,
    tags,
    syllableCount,
    phonetic: respell(name),
  };
}

/** Light heuristic respelling for a pronunciation hint. */
export function respell(name: string): string {
  return name
    .toLowerCase()
    .replace(/ph/g, 'f')
    .replace(/c(?=[eiy])/g, 's')
    .replace(/x/g, 'ks')
    .replace(/q/g, 'k')
    .replace(/([aeiou])\1/g, '$1')
    .replace(/-/g, '·');
}

export function buildGeneratedName(input: ScoreInput): GeneratedName {
  const { name, parts, style, field, origin } = input;
  const scored = scoreCandidate(input);
  return {
    name,
    components: parts.map((p) => ({ text: p.text, meaning: p.meaning, position: p.positions[0]! })),
    syllableCount: scored.syllableCount,
    phonetic: scored.phonetic,
    score: scored.score,
    rationale: scored.rationale,
    tags: scored.tags,
    style,
    field,
    origin,
  };
}
