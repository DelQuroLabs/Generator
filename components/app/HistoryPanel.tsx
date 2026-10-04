'use client';

import { useState } from 'react';
import { Search, Trash2, RotateCw, Star, X } from 'lucide-react';
import type { HistoryEntry } from '@/lib/storage';
import { timeAgo } from '@/lib/utils';
import { Button } from '@/components/ui/Button';
import { Dialog } from '@/components/ui/Dialog';
import { cn } from '@/lib/utils';

interface HistoryPanelProps {
  history: HistoryEntry[];
  onRerun: (entry: HistoryEntry) => void;
  onDelete: (id: string) => void;
  onClear: () => void;
  onClose?: () => void;
  /** Rendered inside a sheet that already provides the surface + close control */
  embedded?: boolean;
}

export function HistoryPanel({ history, onRerun, onDelete, onClear, onClose, embedded = false }: HistoryPanelProps) {
  const [query, setQuery] = useState('');
  const [favoritesOnly, setFavoritesOnly] = useState(false);
  const [confirmClear, setConfirmClear] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  const filtered = history.filter((e) => {
    if (favoritesOnly && !e.favorite) return false;
    if (!query) return true;
    const q = query.toLowerCase();
    return (
      e.name.toLowerCase().includes(q) ||
      e.result.names.some((n) => n.name.toLowerCase().includes(q)) ||
      e.criteria.fields.join(' ').includes(q)
    );
  });

  return (
    <div className={cn('flex h-full flex-col', !embedded && 'card p-4')}>
      {!embedded && (
        <div className="mb-3 flex items-center justify-between gap-2">
          <h2 className="text-base font-semibold">Saved on this device</h2>
          {onClose && (
            <button onClick={onClose} className="icon-btn" aria-label="Close history">
              <X size={18} />
            </button>
          )}
        </div>
      )}

      <div className="relative mb-2">
        <Search size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-dim" />
        <input
          className="input-base pl-9"
          placeholder="Search history…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          aria-label="Search history"
          type="search"
          autoCapitalize="none"
          autoCorrect="off"
        />
      </div>

      <button
        type="button"
        onClick={() => setFavoritesOnly((f) => !f)}
        data-active={favoritesOnly}
        className="chip mb-3 self-start"
      >
        <Star size={13} fill={favoritesOnly ? 'currentColor' : 'none'} />
        Favorites only
      </button>

      <div className="-mr-1 flex-1 space-y-2 overflow-y-auto pr-1">
        {filtered.length === 0 && (
          <p className="py-10 text-center text-sm text-dim">
            {history.length === 0 ? 'Generated names you save appear here.' : 'No matches.'}
          </p>
        )}
        {filtered.map((entry) => (
          <div key={entry.id} className="rounded-xl border border-border bg-bg-2 p-2.5 sm:rounded-lg sm:p-3">
            <div className="flex items-center justify-between gap-2">
              <button
                type="button"
                onClick={() => onRerun(entry)}
                className="min-h-[44px] min-w-0 flex-1 text-left"
              >
                <div className="flex items-center gap-1.5">
                  {entry.favorite && <Star size={12} className="text-primary" fill="currentColor" />}
                  <span className="truncate text-sm font-semibold text-fg">{entry.name}</span>
                </div>
                <p className="mt-0.5 truncate text-xs text-dim">
                  {entry.result.names.length} names · {entry.criteria.fields.slice(0, 2).join(', ')} ·{' '}
                  {timeAgo(entry.createdAt)}
                </p>
              </button>
              <div className="flex shrink-0 gap-0.5">
                <button
                  type="button"
                  onClick={() => onRerun(entry)}
                  className="icon-btn"
                  aria-label="Re-run this brief"
                  title="Re-run"
                >
                  <RotateCw size={16} />
                </button>
                <button
                  type="button"
                  onClick={() => setConfirmDelete(entry.id)}
                  className="icon-btn hover:bg-danger/15 hover:text-danger"
                  aria-label="Delete entry"
                  title="Delete"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {history.length > 0 && (
        <Button variant="danger" size="sm" className="mt-3 w-full sm:w-auto sm:self-start" onClick={() => setConfirmClear(true)}>
          <Trash2 size={14} />
          Clear all history
        </Button>
      )}

      <Dialog
        open={confirmClear}
        onClose={() => setConfirmClear(false)}
        role="alertdialog"
        title="Clear all saved history?"
        description="This permanently deletes every saved brief and favorite from this device. This cannot be undone."
      >
        <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <Button variant="ghost" onClick={() => setConfirmClear(false)}>
            Cancel
          </Button>
          <Button
            variant="danger"
            onClick={() => {
              onClear();
              setConfirmClear(false);
            }}
          >
            Delete everything
          </Button>
        </div>
      </Dialog>

      <Dialog
        open={confirmDelete !== null}
        onClose={() => setConfirmDelete(null)}
        role="alertdialog"
        title="Delete this entry?"
        description="This saved brief will be removed from this device."
      >
        <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <Button variant="ghost" onClick={() => setConfirmDelete(null)}>
            Cancel
          </Button>
          <Button
            variant="danger"
            onClick={() => {
              if (confirmDelete) onDelete(confirmDelete);
              setConfirmDelete(null);
            }}
          >
            Delete
          </Button>
        </div>
      </Dialog>
    </div>
  );
}
