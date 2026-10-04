import type { Criteria } from '@/lib/engine/contracts';
import { defaultCriteria } from '@/lib/engine/contracts';

export interface SamplePreset {
  id: string;
  label: string;
  description: string;
  criteria: Criteria;
}

export const SAMPLES: SamplePreset[] = [
  {
    id: 'biotech',
    label: 'Biotech startup',
    description: 'Soft, life-science coined names',
    criteria: {
      ...defaultCriteria(),
      nameType: 'business',
      fields: ['biology', 'science'],
      origins: ['classical', 'coined'],
      styles: ['coined', 'classical', 'portmanteau'],
      minLength: 5,
      maxLength: 10,
      minSyllables: 2,
      maxSyllables: 4,
      hardness: 'soft',
      casing: 'pascal',
      quantity: 24,
      seed: 424242,
    },
  },
  {
    id: 'indie-game',
    label: 'Indie game',
    description: 'Norse-mythic, harder-edged names',
    criteria: {
      ...defaultCriteria(),
      nameType: 'product',
      fields: ['gaming', 'mythology'],
      origins: ['nordic', 'germanic', 'coined'],
      styles: ['compound', 'evocative', 'coined'],
      minLength: 4,
      maxLength: 12,
      minSyllables: 2,
      maxSyllables: 3,
      hardness: 'hard',
      casing: 'pascal',
      quantity: 24,
      seed: 7777,
    },
  },
  {
    id: 'cafe',
    label: 'Café & bakery',
    description: 'Warm Romance-language place names',
    criteria: {
      ...defaultCriteria(),
      nameType: 'business',
      fields: ['food', 'nature', 'travel'],
      origins: ['romance', 'germanic'],
      styles: ['compound', 'evocative', 'classical'],
      minLength: 5,
      maxLength: 12,
      minSyllables: 2,
      maxSyllables: 4,
      hardness: 'soft',
      separator: ' ',
      casing: 'pascal',
      quantity: 24,
      seed: 31415,
    },
  },
];
