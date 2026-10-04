'use client';

import { useState } from 'react';
import { Copy, Check, Star, ChevronDown, ChevronUp } from 'lucide-react';
import type { GeneratedName } from '@/lib/engine/contracts';
import { ScoreRing } from './ScoreRing';
import { cn } from '@/lib/utils';

interface NameCardProps {
  item: GeneratedName;
  index: number;
  favorite: boolean;
  onToggleFavorite: (name: string) => void;
  onCopy: (name: string) => void;
}

export function NameCard({ item, index, favorite, onToggleFavorite, onCopy }: NameCardProps) {
  const [copied, setCopied] = useState(false);
  const [open, setOpen] = useState(false);

  const handleCopy = () => {
    onCopy(item.name);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="card group flex flex-col gap-3 p-3.5 transition-all hover:border-border-strong sm:p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="flex items-baseline gap-2">
            <span className="font-mono text-xs text-dim">{String(index + 1).padStart(2, '0')}</span>
            <h3 className="truncate text-[1.35rem] font-bold leading-tight tracking-tight text-fg sm:text-xl" title={item.name}>
              {item.name}
            </h3>
          </div>
          <p className="mt-1 font-mono text-xs text-dim">
            /{item.phonetic}/ · {item.syllableCount} syll.
          </p>
        </div>
        <ScoreRing score={item.score} />
      </div>

      <div className="hscroll bleed sm:gap-1.5">
        {item.tags.slice(0, 4).map((t) => (
          <span
            key={t}
            className="rounded-full border border-border bg-bg-2 px-2.5 py-1 text-[0.72rem] text-muted sm:px-2 sm:py-0.5 sm:text-[0.7rem]"
          >
            {t}
          </span>
        ))}
      </div>

      <div className="mt-auto flex gap-2">
        <button
          type="button"
          onClick={handleCopy}
          className="flex min-h-[46px] flex-1 items-center justify-center gap-1.5 rounded-xl border border-border bg-elevated px-3 text-sm font-medium text-fg transition hover:border-border-strong hover:bg-elevated-2 active:scale-[0.98] sm:min-h-[42px] sm:rounded-lg"
          aria-label={`Copy ${item.name}`}
        >
          {copied ? <Check size={16} className="text-success" /> : <Copy size={16} />}
          {copied ? 'Copied' : 'Copy'}
        </button>
        <button
          type="button"
          onClick={() => onToggleFavorite(item.name)}
          className={cn(
            'flex min-h-[46px] min-w-[52px] items-center justify-center rounded-xl border transition active:scale-[0.96] sm:min-h-[42px] sm:min-w-[46px] sm:rounded-lg',
            favorite
              ? 'border-primary/50 bg-primary/15 text-primary'
              : 'border-border bg-elevated text-muted hover:text-fg',
          )}
          aria-pressed={favorite}
          aria-label={favorite ? 'Remove from favorites' : 'Add to favorites'}
        >
          <Star size={17} fill={favorite ? 'currentColor' : 'none'} />
        </button>
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          className="flex min-h-[46px] min-w-[52px] items-center justify-center rounded-xl border border-border bg-elevated text-muted transition hover:text-fg active:scale-[0.96] sm:min-h-[42px] sm:min-w-[46px] sm:rounded-lg"
          aria-expanded={open}
          aria-label={open ? 'Hide breakdown' : 'Why this name?'}
          title={open ? 'Hide breakdown' : 'Why this name?'}
        >
          {open ? <ChevronUp size={17} /> : <ChevronDown size={17} />}
        </button>
      </div>

      {open && (
        <div className="space-y-2 rounded-lg border border-border bg-bg-2 p-3 text-sm">
          <div>
            <p className="label mb-1">Components</p>
            <ul className="space-y-1">
              {item.components.map((c, i) => (
                <li key={i} className="flex flex-wrap gap-x-2 text-muted">
                  <span className="font-mono text-fg">/{c.text}/</span>
                  <span>— {c.meaning}</span>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="label mb-1">Rationale</p>
            <ul className="list-inside list-disc space-y-0.5 text-muted">
              {item.rationale.map((r, i) => (
                <li key={i}>{r}</li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
