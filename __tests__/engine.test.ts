import { describe, expect, it } from 'vitest';
import { generateNames } from '@/lib/engine/local-adapter';
import { defaultCriteria, CriteriaSchema } from '@/lib/engine/contracts';
import { MORPHEMES } from '@/lib/engine/lexicon';
import { countSyllables, pronounceability } from '@/lib/engine/scoring';
import { mulberry32, hashString32 } from '@/lib/engine/prng';
import { generateSafeCsv, sanitizeCsvCell } from '@/lib/safe-csv';

describe('lexicon integrity', () => {
  it('every morpheme has required fields', () => {
    for (const m of MORPHEMES) {
      expect(m.text.length).toBeGreaterThan(0);
      expect(m.meaning.length).toBeGreaterThan(0);
      expect(m.positions.length).toBeGreaterThan(0);
      expect(m.fields.length).toBeGreaterThan(0);
      expect(m.origins.length).toBeGreaterThan(0);
      expect(m.syllables).toBeGreaterThanOrEqual(1);
      expect(['soft', 'balanced', 'hard']).toContain(m.hardness);
      expect(m.text).toMatch(/^[a-z]+$/);
    }
  });
});

describe('prng determinism', () => {
  it('same seed produces same sequence', () => {
    const a = mulberry32(12345);
    const b = mulberry32(12345);
    for (let i = 0; i < 100; i++) expect(a()).toBe(b());
  });
  it('different seeds differ', () => {
    const a = mulberry32(1)();
    const b = mulberry32(2)();
    expect(a).not.toBe(b);
  });
  it('hashString32 stable', () => {
    expect(hashString32('abc')).toBe(hashString32('abc'));
    expect(hashString32('abc')).not.toBe(hashString32('abd'));
  });
});

describe('scoring helpers', () => {
  it('countSyllables basics', () => {
    expect(countSyllables('nova')).toBeGreaterThanOrEqual(1);
    expect(countSyllables('bio')).toBeGreaterThanOrEqual(1);
    expect(countSyllables('')).toBe(0);
  });
  it('pronounceability penalizes consonant clusters', () => {
    expect(pronounceability('nova')).toBeGreaterThan(pronounceability('strphx'));
  });
});

describe('generateNames', () => {
  it('produces requested quantity satisfying length bounds', () => {
    const c = { ...defaultCriteria(), minLength: 5, maxLength: 8, quantity: 20, seed: 42 };
    const res = generateNames(c, 42);
    expect(res.names.length).toBeGreaterThan(0);
    expect(res.names.length).toBeLessThanOrEqual(20);
    for (const n of res.names) {
      expect(n.name.length).toBeGreaterThanOrEqual(5);
      expect(n.name.length).toBeLessThanOrEqual(8);
    }
  });

  it('is deterministic for same seed + criteria', () => {
    const c = { ...defaultCriteria(), quantity: 15, seed: 99 };
    const a = generateNames(c, 99);
    const b = generateNames(c, 99);
    expect(a.names.map((n) => n.name)).toEqual(b.names.map((n) => n.name));
  });

  it('different seeds can differ', () => {
    const c = defaultCriteria();
    const a = generateNames(c, 1);
    const b = generateNames(c, 2);
    expect(a.names.map((n) => n.name).join(',')).not.toEqual(b.names.map((n) => n.name).join(','));
  });

  it('respects mustInclude', () => {
    const c = { ...defaultCriteria(), mustInclude: 'nova', quantity: 10, minLength: 3, maxLength: 20, seed: 7 };
    const res = generateNames(c, 7);
    for (const n of res.names) {
      expect(n.name.toLowerCase()).toContain('nova');
    }
  });

  it('respects mustNotInclude', () => {
    const c = { ...defaultCriteria(), mustNotInclude: 'bio', quantity: 10, minLength: 3, maxLength: 20, seed: 7 };
    const res = generateNames(c, 7);
    for (const n of res.names) {
      expect(n.name.toLowerCase()).not.toContain('bio');
    }
  });

  it('respects startsWith', () => {
    const c = { ...defaultCriteria(), startsWith: 'a', quantity: 10, seed: 3 };
    const res = generateNames(c, 3);
    for (const n of res.names) {
      expect(n.name.toLowerCase().startsWith('a')).toBe(true);
    }
  });

  it('returns unique names', () => {
    const c = { ...defaultCriteria(), quantity: 30, seed: 5 };
    const res = generateNames(c, 5);
    const set = new Set(res.names.map((n) => n.name.toLowerCase()));
    expect(set.size).toBe(res.names.length);
  });

  it('every name has components, rationale, and score in 0..100', () => {
    const res = generateNames(defaultCriteria(), 11);
    for (const n of res.names) {
      expect(n.components.length).toBeGreaterThan(0);
      expect(n.rationale.length).toBeGreaterThan(0);
      expect(n.score).toBeGreaterThanOrEqual(0);
      expect(n.score).toBeLessThanOrEqual(100);
      expect(n.phonetic.length).toBeGreaterThan(0);
    }
  });

  it('reports truncated when constraints impossible', () => {
    const c = { ...defaultCriteria(), minLength: 38, maxLength: 40, quantity: 50, seed: 1 };
    const res = generateNames(c, 1);
    expect(res.truncated).toBe(true);
  });

  it('quantity capped at 50', () => {
    const parsed = CriteriaSchema.safeParse({ ...defaultCriteria(), quantity: 999 });
    expect(parsed.success).toBe(false);
  });

  it('rejects inverted length bounds', () => {
    const parsed = CriteriaSchema.safeParse({ ...defaultCriteria(), minLength: 10, maxLength: 4 });
    expect(parsed.success).toBe(false);
  });

  it('no raw HTML/script injection in names', () => {
    const res = generateNames({ ...defaultCriteria(), quantity: 20, seed: 123 }, 123);
    for (const n of res.names) {
      expect(n.name).not.toContain('<');
      expect(n.name).not.toContain('>');
    }
  });
});

describe('CSV safety', () => {
  it('neutralizes formula prefixes', () => {
    expect(sanitizeCsvCell('=CMD|calc')).toMatch(/^"'?=/);
    expect(sanitizeCsvCell('+123')).toContain("'");
    expect(sanitizeCsvCell('@SUM(A1)')).toContain("'");
  });
  it('escapes quotes', () => {
    expect(sanitizeCsvCell('he said "hi"')).toBe('"he said ""hi"""');
  });
  it('generates valid rows', () => {
    const csv = generateSafeCsv(['a', 'b'], [['=1', 'x']]);
    expect(csv.split('\r\n')[1]).toContain("'=1");
  });
});
