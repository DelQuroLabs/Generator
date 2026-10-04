'use client';

import { useState, type ReactNode } from 'react';
import { ChevronDown, Shuffle, Sparkles, RotateCcw } from 'lucide-react';
import {
  CASINGS,
  NAME_TYPES,
  ORIGINS,
  PHONETIC_HARDNESS,
  SEMANTIC_FIELDS,
  SEPARATORS,
  STYLES,
  type Casing,
  type Criteria,
  type NameStyle,
  type NameType,
  type Origin,
  type PhoneticHardness,
  type SemanticField,
  type Separator,
} from '@/lib/engine/contracts';
import { Chip } from '@/components/ui/Chip';
import { Button } from '@/components/ui/Button';
import { SAMPLES } from '@/data/samples';
import { cn } from '@/lib/utils';

interface CriteriaFormProps {
  criteria: Criteria;
  onChange: (patch: Partial<Criteria>) => void;
  onGenerate: () => void;
  onReset: () => void;
  onLoadSample: (c: Criteria) => void;
  loading: boolean;
  resultCount: number;
  truncated: boolean;
  /** Unique prefix so the form can be mounted twice (sheet + sidebar) without duplicate ids */
  idPrefix?: string;
  /** Hide the in-form submit row when an external footer provides it */
  showSubmit?: boolean;
  /** Wrap in a card surface (sidebar) or render flat (inside a sheet) */
  surface?: boolean;
}

const FIELD_LABELS: Record<SemanticField, string> = {
  technology: 'Technology',
  biology: 'Bio / Med',
  finance: 'Finance',
  nature: 'Nature',
  mythology: 'Mythology',
  space: 'Space',
  food: 'Food',
  fashion: 'Fashion',
  gaming: 'Gaming',
  science: 'Science',
  law: 'Law / Gov',
  education: 'Education',
  arts: 'Arts',
  travel: 'Travel / Place',
  virtue: 'Virtue / Abstract',
};

const ORIGIN_LABELS: Record<Origin, string> = {
  classical: 'Classical (Lat/Grk)',
  nordic: 'Nordic',
  romance: 'Romance',
  germanic: 'Germanic',
  slavic: 'Slavic',
  japanese: 'Japanese (romaji)',
  sanskrit: 'Sanskrit',
  celtic: 'Celtic',
  african: 'African-inspired',
  coined: 'Global / Coined',
};

const STYLE_LABELS: Record<NameStyle, string> = {
  coined: 'Coined',
  compound: 'Compound',
  classical: 'Classical',
  portmanteau: 'Portmanteau',
  evocative: 'Evocative',
};

const TYPE_LABELS: Record<NameType, string> = {
  business: 'Business',
  product: 'Product',
  project: 'Project',
  character: 'Character',
  place: 'Place',
  band: 'Band',
  book: 'Book / Title',
  other: 'Other',
};

function toggleInArray<T extends string>(arr: readonly T[], value: T): T[] {
  return arr.includes(value) ? arr.filter((v) => v !== value) : [...arr, value];
}

interface SectionProps {
  title: string;
  summary?: string;
  defaultOpen?: boolean;
  children: ReactNode;
  id: string;
}

/** Collapsible group: keeps the phone view to one thumb-scroll instead of a wall of controls. */
function Section({ title, summary, defaultOpen = false, children, id }: SectionProps) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <section className="overflow-hidden rounded-xl border border-border bg-bg-2/40">
      <h3>
        <button
          type="button"
          aria-expanded={open}
          aria-controls={id}
          onClick={() => setOpen((o) => !o)}
          className="flex min-h-[52px] w-full items-center justify-between gap-3 px-3.5 py-2.5 text-left sm:min-h-[46px]"
        >
          <span className="label">{title}</span>
          <span className="flex items-center gap-2 text-xs text-dim">
            {summary && <span className="max-w-[9.5rem] truncate font-mono">{summary}</span>}
            <ChevronDown size={16} className={cn('transition-transform', open && 'rotate-180')} />
          </span>
        </button>
      </h3>
      {open && (
        <div id={id} className="border-t border-border/70 px-3.5 pb-4 pt-3.5">
          {children}
        </div>
      )}
    </section>
  );
}

export function CriteriaForm({
  criteria,
  onChange,
  onGenerate,
  onReset,
  onLoadSample,
  loading,
  resultCount,
  truncated,
  idPrefix = 'cf',
  showSubmit = true,
  surface = true,
}: CriteriaFormProps) {
  const lengthInvalid = criteria.maxLength < criteria.minLength;
  const syllInvalid = criteria.maxSyllables < criteria.minSyllables;
  const id = (s: string) => `${idPrefix}-${s}`;

  const textFilterCount = [criteria.startsWith, criteria.endsWith, criteria.mustInclude, criteria.mustNotInclude].filter(
    Boolean,
  ).length;

  return (
    <form
      id={id('form')}
      className={cn('flex flex-col gap-3', surface && 'card p-3.5 sm:p-5 sm:gap-4')}
      onSubmit={(e) => {
        e.preventDefault();
        onGenerate();
      }}
    >
      {/* Name type — always visible, swipeable on phones */}
      <section>
        <label className="label mb-2 block">Naming for</label>
        <div className="hscroll bleed">
          {NAME_TYPES.map((t) => (
            <Chip key={t} active={criteria.nameType === t} onClick={() => onChange({ nameType: t as NameType })}>
              {TYPE_LABELS[t]}
            </Chip>
          ))}
        </div>
      </section>

      {/* Samples — always visible, swipeable */}
      <section>
        <label className="label mb-2 block">Quick samples</label>
        <div className="hscroll bleed">
          {SAMPLES.map((s) => (
            <button key={s.id} type="button" onClick={() => onLoadSample(s.criteria)} title={s.description} className="chip">
              <Sparkles size={13} className="text-primary" />
              {s.label}
            </button>
          ))}
        </div>
      </section>

      <Section
        id={id('fields')}
        title="Field / domain"
        summary={criteria.fields.length ? `${criteria.fields.length} selected` : 'any'}
        defaultOpen
      >
        <div className="mb-2 flex justify-end">
          <button
            type="button"
            onClick={() =>
              onChange({ fields: criteria.fields.length === SEMANTIC_FIELDS.length ? [] : [...SEMANTIC_FIELDS] })
            }
            className="min-h-[32px] text-xs text-accent hover:underline"
          >
            {criteria.fields.length === SEMANTIC_FIELDS.length ? 'Clear all' : 'All fields'}
          </button>
        </div>
        <div className="flex flex-wrap gap-2 sm:gap-1.5">
          {SEMANTIC_FIELDS.map((f) => (
            <Chip
              key={f}
              active={criteria.fields.includes(f)}
              onClick={() => onChange({ fields: toggleInArray(criteria.fields, f) })}
            >
              {FIELD_LABELS[f]}
            </Chip>
          ))}
        </div>
      </Section>

      <Section
        id={id('origins')}
        title="Origin / flavor"
        summary={criteria.origins.length ? `${criteria.origins.length} selected` : 'any'}
      >
        <div className="mb-2 flex justify-end">
          <button
            type="button"
            onClick={() => onChange({ origins: criteria.origins.length === ORIGINS.length ? [] : [...ORIGINS] })}
            className="min-h-[32px] text-xs text-accent hover:underline"
          >
            {criteria.origins.length === ORIGINS.length ? 'Clear all' : 'Any origin'}
          </button>
        </div>
        <div className="flex flex-wrap gap-2 sm:gap-1.5">
          {ORIGINS.map((o) => (
            <Chip
              key={o}
              active={criteria.origins.includes(o)}
              onClick={() => onChange({ origins: toggleInArray(criteria.origins, o) })}
            >
              {ORIGIN_LABELS[o]}
            </Chip>
          ))}
        </div>
      </Section>

      <Section id={id('styles')} title="Construction" summary={`${criteria.styles.length} style${criteria.styles.length === 1 ? '' : 's'}`}>
        <div className="flex flex-wrap gap-2 sm:gap-1.5">
          {STYLES.map((s) => (
            <Chip
              key={s}
              active={criteria.styles.includes(s)}
              onClick={() => {
                const next = toggleInArray(criteria.styles, s);
                if (next.length > 0) onChange({ styles: next });
              }}
            >
              {STYLE_LABELS[s]}
            </Chip>
          ))}
        </div>
      </Section>

      <Section
        id={id('shape')}
        title="Length & syllables"
        summary={`${criteria.minLength}–${criteria.maxLength} · ${criteria.minSyllables}–${criteria.maxSyllables}`}
      >
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-4">
          <div>
            <label className="label mb-2 flex justify-between">
              <span>Length</span>
              <span className="font-mono text-fg">
                {criteria.minLength}–{criteria.maxLength}
              </span>
            </label>
            <div className="space-y-3.5 sm:space-y-2">
              <input
                type="range"
                min={2}
                max={40}
                value={criteria.minLength}
                onChange={(e) => onChange({ minLength: Number(e.target.value) })}
                aria-label="Minimum length"
              />
              <input
                type="range"
                min={2}
                max={40}
                value={criteria.maxLength}
                onChange={(e) => onChange({ maxLength: Number(e.target.value) })}
                aria-label="Maximum length"
              />
            </div>
            {lengthInvalid && <p className="mt-1 text-xs text-danger">Max must be ≥ min</p>}
          </div>
          <div>
            <label className="label mb-2 flex justify-between">
              <span>Syllables</span>
              <span className="font-mono text-fg">
                {criteria.minSyllables}–{criteria.maxSyllables}
              </span>
            </label>
            <div className="space-y-3.5 sm:space-y-2">
              <input
                type="range"
                min={1}
                max={8}
                value={criteria.minSyllables}
                onChange={(e) => onChange({ minSyllables: Number(e.target.value) })}
                aria-label="Minimum syllables"
              />
              <input
                type="range"
                min={1}
                max={8}
                value={criteria.maxSyllables}
                onChange={(e) => onChange({ maxSyllables: Number(e.target.value) })}
                aria-label="Maximum syllables"
              />
            </div>
            {syllInvalid && <p className="mt-1 text-xs text-danger">Max must be ≥ min</p>}
          </div>
        </div>
      </Section>

      <Section
        id={id('letters')}
        title="Letters & words"
        summary={textFilterCount ? `${textFilterCount} filter${textFilterCount === 1 ? '' : 's'}` : 'none'}
      >
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div>
            <label className="label mb-1.5 block" htmlFor={id('starts')}>
              Starts with
            </label>
            <input
              id={id('starts')}
              className="input-base"
              maxLength={6}
              value={criteria.startsWith}
              onChange={(e) => onChange({ startsWith: e.target.value.toLowerCase().replace(/[^a-z]/g, '') })}
              placeholder="e.g. vel"
              autoComplete="off"
              autoCapitalize="none"
              autoCorrect="off"
              spellCheck={false}
              inputMode="text"
            />
          </div>
          <div>
            <label className="label mb-1.5 block" htmlFor={id('ends')}>
              Ends with
            </label>
            <input
              id={id('ends')}
              className="input-base"
              maxLength={6}
              value={criteria.endsWith}
              onChange={(e) => onChange({ endsWith: e.target.value.toLowerCase().replace(/[^a-z]/g, '') })}
              placeholder="e.g. ora"
              autoComplete="off"
              autoCapitalize="none"
              autoCorrect="off"
              spellCheck={false}
              inputMode="text"
            />
          </div>
          <div>
            <label className="label mb-1.5 block" htmlFor={id('include')}>
              Must include
            </label>
            <input
              id={id('include')}
              className="input-base"
              maxLength={20}
              value={criteria.mustInclude}
              onChange={(e) => onChange({ mustInclude: e.target.value.toLowerCase().replace(/[^a-z\s-_.]/g, '') })}
              placeholder="e.g. nova"
              autoComplete="off"
              autoCapitalize="none"
              autoCorrect="off"
              spellCheck={false}
            />
          </div>
          <div>
            <label className="label mb-1.5 block" htmlFor={id('exclude')}>
              Must not include
            </label>
            <input
              id={id('exclude')}
              className="input-base"
              maxLength={20}
              value={criteria.mustNotInclude}
              onChange={(e) => onChange({ mustNotInclude: e.target.value.toLowerCase().replace(/[^a-z\s-_.]/g, '') })}
              placeholder="e.g. xyz"
              autoComplete="off"
              autoCapitalize="none"
              autoCorrect="off"
              spellCheck={false}
            />
          </div>
        </div>
      </Section>

      <Section
        id={id('sound')}
        title="Sound"
        summary={`${criteria.hardness}${criteria.alliteration ? ' · allit.' : ''}`}
      >
        <div className="flex flex-wrap gap-2 sm:gap-1.5">
          {PHONETIC_HARDNESS.map((h) => (
            <Chip key={h} active={criteria.hardness === h} onClick={() => onChange({ hardness: h as PhoneticHardness })}>
              {h.charAt(0).toUpperCase() + h.slice(1)}
            </Chip>
          ))}
          <Chip active={criteria.alliteration} onClick={() => onChange({ alliteration: !criteria.alliteration })}>
            Alliteration
          </Chip>
        </div>
      </Section>

      <Section
        id={id('format')}
        title="Format"
        summary={`${criteria.separator === 'none' ? 'joined' : criteria.separator === ' ' ? 'spaced' : criteria.separator} · ${criteria.casing}`}
      >
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div>
            <label className="label mb-1.5 block" htmlFor={id('separator')}>
              Separator
            </label>
            <select
              id={id('separator')}
              className="input-base"
              value={criteria.separator}
              onChange={(e) => onChange({ separator: e.target.value as Separator })}
            >
              {SEPARATORS.map((s) => (
                <option key={s} value={s}>
                  {s === 'none' ? 'None' : s === ' ' ? 'Space' : `"${s}"`}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="label mb-1.5 block" htmlFor={id('casing')}>
              Casing
            </label>
            <select
              id={id('casing')}
              className="input-base"
              value={criteria.casing}
              onChange={(e) => onChange({ casing: e.target.value as Casing })}
            >
              {CASINGS.map((c) => (
                <option key={c} value={c}>
                  {c.charAt(0).toUpperCase() + c.slice(1)}
                </option>
              ))}
            </select>
          </div>
        </div>
      </Section>

      <Section id={id('output')} title="Output" summary={`${criteria.quantity} names · seed ${criteria.seed}`} defaultOpen>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-3">
          <div>
            <label className="label mb-2 flex justify-between" htmlFor={id('quantity')}>
              <span>How many</span>
              <span className="font-mono text-fg">{criteria.quantity}</span>
            </label>
            <input
              id={id('quantity')}
              type="range"
              min={1}
              max={50}
              value={criteria.quantity}
              onChange={(e) => onChange({ quantity: Number(e.target.value) })}
            />
          </div>
          <div>
            <label className="label mb-1.5 block" htmlFor={id('seed')}>
              Seed
            </label>
            <div className="flex gap-2">
              <input
                id={id('seed')}
                type="number"
                inputMode="numeric"
                pattern="[0-9]*"
                className="input-base"
                value={criteria.seed}
                onChange={(e) => onChange({ seed: Number(e.target.value) || 1 })}
              />
              <button
                type="button"
                onClick={() => onChange({ seed: Math.floor(Math.random() * 1_000_000) })}
                aria-label="Randomize seed"
                title="Randomize seed"
                className="icon-btn shrink-0 border border-border bg-elevated text-fg"
              >
                <Shuffle size={16} />
              </button>
            </div>
          </div>
        </div>
      </Section>

      {truncated && (
        <p className="rounded-lg border border-warning/40 bg-warning/10 px-3 py-2 text-xs text-warning">
          Only {resultCount} names matched these constraints. Loosen length, field, or origin filters for more.
        </p>
      )}

      {showSubmit && (
        <div className="flex gap-2 border-t border-border pt-3.5">
          <Button type="submit" variant="primary" className="flex-1" disabled={loading || lengthInvalid || syllInvalid}>
            <Sparkles size={16} />
            Generate names
          </Button>
          <Button type="button" variant="ghost" onClick={onReset} title="Reset to defaults" aria-label="Reset to defaults">
            <RotateCcw size={15} />
            <span className="hidden sm:inline">Reset</span>
          </Button>
        </div>
      )}
    </form>
  );
}
