import { z } from 'zod';

/**
 * DelQuro Generator — domain contracts (types + Zod schemas).
 * All boundaries (UI, storage, exports) validate against these.
 */

export const NAME_TYPES = [
  'business',
  'product',
  'project',
  'character',
  'place',
  'band',
  'book',
  'other',
] as const;
export type NameType = (typeof NAME_TYPES)[number];

export const SEMANTIC_FIELDS = [
  'technology',
  'biology',
  'finance',
  'nature',
  'mythology',
  'space',
  'food',
  'fashion',
  'gaming',
  'science',
  'law',
  'education',
  'arts',
  'travel',
  'virtue',
] as const;
export type SemanticField = (typeof SEMANTIC_FIELDS)[number];

export const ORIGINS = [
  'classical',
  'nordic',
  'romance',
  'germanic',
  'slavic',
  'japanese',
  'sanskrit',
  'celtic',
  'african',
  'coined',
] as const;
export type Origin = (typeof ORIGINS)[number];

export const STYLES = ['coined', 'compound', 'classical', 'portmanteau', 'evocative'] as const;
export type NameStyle = (typeof STYLES)[number];

export const PHONETIC_HARDNESS = ['soft', 'balanced', 'hard'] as const;
export type PhoneticHardness = (typeof PHONETIC_HARDNESS)[number];

export const SEPARATORS = ['none', '-', '_', '.', ' '] as const;
export type Separator = (typeof SEPARATORS)[number];

export const CASINGS = ['preserve', 'camel', 'pascal', 'lower', 'upper'] as const;
export type Casing = (typeof CASINGS)[number];

export type MorphemePosition = 'prefix' | 'root' | 'suffix';

export interface Morpheme {
  /** The literal text fragment, lowercase, no separators. */
  readonly text: string;
  /** Meaning/gloss shown to the user. */
  readonly meaning: string;
  /** Where this fragment may sit in a name. */
  readonly positions: readonly MorphemePosition[];
  /** Semantic fields this fragment evokes. */
  readonly fields: readonly SemanticField[];
  /** Etymological inspiration. */
  readonly origins: readonly Origin[];
  /** Number of spoken syllables. */
  readonly syllables: number;
  /** Phonetic character of the fragment. */
  readonly hardness: PhoneticHardness;
  /** Optional style affinity. */
  readonly styles?: readonly NameStyle[];
}

const criteriaCore = {
  nameType: z.enum(NAME_TYPES).default('business'),
  fields: z.array(z.enum(SEMANTIC_FIELDS)).default(['technology']),
  matchAllFields: z.boolean().default(false),
  origins: z.array(z.enum(ORIGINS)).default(['classical', 'coined']),
  styles: z.array(z.enum(STYLES)).min(1).default(['coined', 'classical', 'compound']),
  minLength: z.number().int().min(2).max(40).default(4),
  maxLength: z.number().int().min(2).max(40).default(12),
  minSyllables: z.number().int().min(1).max(8).default(2),
  maxSyllables: z.number().int().min(1).max(8).default(4),
  startsWith: z.string().max(6).default(''),
  endsWith: z.string().max(6).default(''),
  hardness: z.enum(PHONETIC_HARDNESS).default('balanced'),
  alliteration: z.boolean().default(false),
  separator: z.enum(SEPARATORS).default('none'),
  casing: z.enum(CASINGS).default('pascal'),
  mustInclude: z.string().max(20).default(''),
  mustNotInclude: z.string().max(20).default(''),
  quantity: z.number().int().min(1).max(50).default(24),
  seed: z.number().int().default(1),
};

export const CriteriaSchema = z.object(criteriaCore).superRefine((val, ctx) => {
  if (val.maxLength < val.minLength) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ['maxLength'],
      message: 'Max length must be ≥ min length',
    });
  }
  if (val.maxSyllables < val.minSyllables) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ['maxSyllables'],
      message: 'Max syllables must be ≥ min syllables',
    });
  }
});

export type Criteria = z.infer<typeof CriteriaSchema>;

export interface NameComponent {
  readonly text: string;
  readonly meaning: string;
  readonly position: MorphemePosition;
}

export interface GeneratedName {
  readonly name: string;
  readonly components: readonly NameComponent[];
  readonly syllableCount: number;
  readonly phonetic: string;
  readonly score: number;
  readonly rationale: readonly string[];
  readonly tags: readonly string[];
  readonly style: NameStyle;
  readonly field: SemanticField;
  readonly origin: Origin;
}

export interface GenerateResult {
  readonly seed: number;
  readonly names: readonly GeneratedName[];
  readonly generatedAt: string;
  readonly criteria: Criteria;
  readonly truncated: boolean;
}

export const GeneratedNameSchema = z.object({
  name: z.string(),
  components: z.array(
    z.object({
      text: z.string(),
      meaning: z.string(),
      position: z.enum(['prefix', 'root', 'suffix']),
    }),
  ),
  syllableCount: z.number().int(),
  phonetic: z.string(),
  score: z.number().min(0).max(100),
  rationale: z.array(z.string()),
  tags: z.array(z.string()),
  style: z.enum(STYLES),
  field: z.enum(SEMANTIC_FIELDS),
  origin: z.enum(ORIGINS),
}) satisfies z.ZodType<GeneratedName>;

export const GenerateResultSchema = z.object({
  seed: z.number().int(),
  names: z.array(GeneratedNameSchema),
  generatedAt: z.string(),
  criteria: CriteriaSchema,
  truncated: z.boolean(),
}) satisfies z.ZodType<GenerateResult>;

export function defaultCriteria(): Criteria {
  return CriteriaSchema.parse({});
}
