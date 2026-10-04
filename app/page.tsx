'use client';

import Link from 'next/link';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  Sparkles,
  Download,
  Copy,
  Check,
  History as HistoryIcon,
  Sun,
  Moon,
  ShieldCheck,
  Cpu,
  AlertTriangle,
  FileJson,
  FileText,
  FileSpreadsheet,
  SlidersHorizontal,
  Shuffle,
  Bookmark,
  RotateCcw,
} from 'lucide-react';
import { CriteriaForm } from '@/components/app/CriteriaForm';
import { NameCard } from '@/components/app/NameCard';
import { HistoryPanel } from '@/components/app/HistoryPanel';
import { Toast } from '@/components/ui/Toast';
import { Dialog } from '@/components/ui/Dialog';
import { Sheet } from '@/components/ui/Sheet';
import { Button } from '@/components/ui/Button';
import {
  type Criteria,
  type GenerateResult,
  CriteriaSchema,
  GenerateResultSchema,
  defaultCriteria,
} from '@/lib/engine/contracts';
import { generateNames } from '@/lib/engine/local-adapter';
import { addHistory, clearHistory, deleteHistory, loadHistory, loadPrefs, savePrefs, type HistoryEntry } from '@/lib/storage';
import { downloadText, safeFilename, toCsv, toJson, toMarkdown } from '@/lib/exports';
import { timeAgo } from '@/lib/utils';

type GenState = 'idle' | 'validating' | 'loading' | 'success' | 'empty' | 'degraded_offline' | 'recoverable_error' | 'terminal_error';

export default function Home() {
  const [criteria, setCriteria] = useState<Criteria>(() => defaultCriteria());
  const [result, setResult] = useState<GenerateResult | null>(null);
  const [state, setState] = useState<GenState>('idle');
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [showHistory, setShowHistory] = useState(false);
  const [showCriteria, setShowCriteria] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '' });
  const [exportOpen, setExportOpen] = useState(false);
  const [storageUp, setStorageUp] = useState(true);
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [saveConsentOpen, setSaveConsentOpen] = useState(false);
  const pendingEntry = useRef<HistoryEntry | null>(null);
  const resultsRef = useRef<HTMLDivElement>(null);
  const scrollAfterGenerate = useRef(false);

  // Load prefs + history
  useEffect(() => {
    let mounted = true;
    (async () => {
      const prefs = await loadPrefs();
      if (!mounted) return;
      setTheme(prefs.theme);
      document.documentElement.classList.toggle('dark', prefs.theme === 'dark');
      document.documentElement.classList.toggle('light', prefs.theme === 'light');
      if (prefs.lastCriteria) setCriteria(prefs.lastCriteria);
      try {
        const h = await loadHistory();
        if (mounted) {
          setHistory(h);
          setFavorites(new Set(h.filter((e) => e.favorite).flatMap((e) => e.result.names.map((n) => n.name))));
        }
      } catch {
        if (mounted) {
          setStorageUp(false);
          setState('degraded_offline');
        }
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  // Persist prefs (theme + last criteria)
  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
    document.documentElement.classList.toggle('light', theme === 'light');
    try {
      localStorage.setItem('delquro-theme', theme);
    } catch {
      /* ignore */
    }
    savePrefs({ theme, lastCriteria: criteria });
  }, [theme, criteria]);

  const showToast = useCallback((message: string) => {
    setToast({ show: true, message });
  }, []);

  const updateCriteria = useCallback((patch: Partial<Criteria>) => {
    setCriteria((prev) => {
      const next = { ...prev, ...patch };
      const parsed = CriteriaSchema.safeParse(next);
      return parsed.success ? parsed.data : next;
    });
  }, []);

  const performGenerate = useCallback(
    (c: Criteria, seed: number) => {
      setState('validating');
      const parsed = CriteriaSchema.safeParse(c);
      if (!parsed.success) {
        setState('recoverable_error');
        return;
      }
      setState('loading');
      // generation is synchronous & fast; allow paint
      setTimeout(() => {
        try {
          const res = generateNames(parsed.data, seed);
          const validated = GenerateResultSchema.parse(res);
          setResult(validated);
          if (validated.names.length === 0) {
            setState('empty');
          } else {
            setState('success');
          }
          if (scrollAfterGenerate.current) {
            scrollAfterGenerate.current = false;
            requestAnimationFrame(() => {
              resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
            });
          }
        } catch (err) {
          console.error(err);
          setState('recoverable_error');
        }
      }, 30);
    },
    [],
  );

  const handleGenerate = useCallback(() => {
    performGenerate(criteria, criteria.seed);
  }, [criteria, performGenerate]);

  /** Generate from the mobile sheet: close it, then scroll results into view. */
  const handleGenerateFromSheet = useCallback(() => {
    setShowCriteria(false);
    scrollAfterGenerate.current = true;
    performGenerate(criteria, criteria.seed);
  }, [criteria, performGenerate]);

  const handleShuffle = useCallback(() => {
    const newSeed = Math.floor(Math.random() * 1_000_000) + 1;
    updateCriteria({ seed: newSeed });
    performGenerate({ ...criteria, seed: newSeed }, newSeed);
  }, [criteria, performGenerate, updateCriteria]);

  const handleReset = useCallback(() => {
    setCriteria(defaultCriteria());
    setResult(null);
    setState('idle');
  }, []);

  const handleLoadSample = useCallback(
    (c: Criteria) => {
      setCriteria(c);
      setShowCriteria(false);
      scrollAfterGenerate.current = true;
      performGenerate(c, c.seed);
    },
    [performGenerate],
  );

  // Save to history with explicit consent (destructive-free: write is additive,
  // but we still confirm storage of the brief locally)
  const saveToHistory = useCallback(
    async (entry: HistoryEntry) => {
      if (!storageUp) {
        showToast('Storage unavailable this session');
        return;
      }
      const updated = await addHistory(entry);
      setHistory(updated);
      showToast('Saved to this device');
    },
    [storageUp, showToast],
  );

  const handleSaveResult = useCallback(() => {
    if (!result) return;
    const entry: HistoryEntry = {
      id: `h-${result.seed}-${Date.now()}`,
      name: `${result.criteria.nameType} · ${result.criteria.fields[0] ?? 'mixed'}`,
      criteria: result.criteria,
      result,
      favorite: false,
      createdAt: new Date().toISOString(),
    };
    pendingEntry.current = entry;
    setSaveConsentOpen(true);
  }, [result]);

  const confirmSave = useCallback(() => {
    if (pendingEntry.current) {
      void saveToHistory(pendingEntry.current);
      pendingEntry.current = null;
    }
    setSaveConsentOpen(false);
  }, [saveToHistory]);

  const handleRerun = useCallback(
    (entry: HistoryEntry) => {
      setCriteria(entry.criteria);
      setShowHistory(false);
      scrollAfterGenerate.current = true;
      performGenerate(entry.criteria, entry.result.seed);
    },
    [performGenerate],
  );

  const handleDelete = useCallback(async (id: string) => {
    const next = await deleteHistory(id);
    setHistory(next);
  }, []);

  const handleClear = useCallback(async () => {
    await clearHistory();
    setHistory([]);
    setFavorites(new Set());
    showToast('History cleared');
  }, [showToast]);

  const toggleFavorite = useCallback((name: string) => {
    setFavorites((prev) => {
      const next = new Set(prev);
      if (next.has(name)) next.delete(name);
      else next.add(name);
      return next;
    });
  }, []);

  const copyAll = useCallback(async () => {
    if (!result) return;
    const text = result.names.map((n) => n.name).join('\n');
    try {
      await navigator.clipboard.writeText(text);
      showToast(`Copied ${result.names.length} names`);
    } catch {
      showToast('Clipboard unavailable');
    }
  }, [result, showToast]);

  const copyOne = useCallback(
    async (name: string) => {
      try {
        await navigator.clipboard.writeText(name);
        showToast(`Copied "${name}"`);
      } catch {
        showToast('Clipboard unavailable');
      }
    },
    [showToast],
  );

  const exportFile = useCallback(
    (format: 'json' | 'csv' | 'md') => {
      if (!result) return;
      const stamp = safeFilename(`delquro-${criteria.nameType}`, format);
      if (format === 'json') downloadText(stamp, toJson(result), 'application/json');
      if (format === 'csv') downloadText(stamp, toCsv(result), 'text/csv');
      if (format === 'md') downloadText(stamp, toMarkdown(result), 'text/markdown');
      setExportOpen(false);
      showToast(`Exported .${format}`);
    },
    [result, criteria.nameType, showToast],
  );

  const favoriteCount = useMemo(
    () => (result ? result.names.filter((n) => favorites.has(n.name)).length : 0),
    [result, favorites],
  );

  // Badge on the mobile "Criteria" button: how many refinements are active
  const activeCriteriaCount = useMemo(() => {
    let n = criteria.fields.length + criteria.origins.length;
    n += [criteria.startsWith, criteria.endsWith, criteria.mustInclude, criteria.mustNotInclude].filter(Boolean).length;
    if (criteria.alliteration) n += 1;
    if (criteria.hardness !== 'balanced') n += 1;
    return n;
  }, [criteria]);

  const lengthInvalid = criteria.maxLength < criteria.minLength;
  const syllInvalid = criteria.maxSyllables < criteria.minSyllables;
  const generateDisabled = state === 'loading' || lengthInvalid || syllInvalid;

  return (
    <div className="min-h-svh">
      {/* Header — compact single row on phones */}
      <header
        className="sticky top-0 z-30 border-b border-border/80 bg-bg/85 backdrop-blur-xl"
        style={{ paddingTop: 'env(safe-area-inset-top, 0px)' }}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-2 px-3 py-2.5 sm:px-6 sm:py-3">
          <div className="flex min-w-0 items-center gap-2.5">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-primary-2 shadow-glow">
              <Sparkles size={18} className="text-white" />
            </div>
            <div className="min-w-0">
              <h1 className="truncate text-[0.95rem] font-bold leading-tight tracking-tight sm:text-base">
                DelQuro Generator
              </h1>
              <p className="hidden text-[0.7rem] text-dim sm:block">Craft names that fit — down to every part</p>
            </div>
          </div>
          <div className="flex shrink-0 items-center gap-0.5 sm:gap-2">
            <span className="hidden items-center gap-1.5 rounded-full border border-border bg-elevated px-2.5 py-1 text-[0.7rem] text-success md:inline-flex">
              <ShieldCheck size={12} /> 100% on-device
            </span>
            <button
              type="button"
              className="icon-btn"
              onClick={() => setTheme((t) => (t === 'dark' ? 'light' : 'dark'))}
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? <Sun size={19} /> : <Moon size={19} />}
            </button>
            <button
              type="button"
              className="icon-btn relative"
              onClick={() => setShowHistory(true)}
              aria-label={`Saved briefs${history.length ? ` (${history.length})` : ''}`}
            >
              <HistoryIcon size={19} />
              {history.length > 0 && (
                <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-primary" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
        <nav aria-label="Generator tools" className="mx-auto max-w-7xl px-4 pb-3"><Link href="/api-keys" className="text-sm text-accent inline-flex min-h-11 items-center">API key generator →</Link></nav>
      </header>

      <main
        className="mx-auto max-w-7xl px-4 pt-5 sm:px-6 sm:pt-6 lg:py-10"
        style={{ paddingBottom: 'calc(env(safe-area-inset-bottom, 0px) + 6.5rem)' }}
      >
        {/* Hero — tight on phones */}
        <section className="mb-5 max-w-3xl sm:mb-8">
          <h2 className="text-[1.65rem] font-bold leading-[1.15] tracking-tight sm:text-4xl">
            Name anything with{' '}
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">precision</span>.
          </h2>
          <p className="mt-2.5 text-sm text-muted sm:mt-3 sm:text-base">
            <span className="sm:hidden">
              Tune field, origin, style, length, sound and more — every name is built from meaningful parts, scored and
              explained, right on your phone.
            </span>
            <span className="hidden sm:inline">
              Choose the field of study, linguistic origin, construction style, length, syllables, phonetic hardness,
              starting letters and more. Every name is composed from meaningful parts, scored against your brief, and
              explained — generated instantly on your device.
            </span>
          </p>
        </section>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,420px)_minmax(0,1fr)]">
          {/* Criteria: inline sidebar from lg up, bottom sheet below that */}
          <div className="hidden lg:sticky lg:top-20 lg:block lg:max-h-[calc(100vh-6rem)] lg:overflow-y-auto lg:pr-1">
            <CriteriaForm
              idPrefix="desk"
              criteria={criteria}
              onChange={updateCriteria}
              onGenerate={handleGenerate}
              onReset={handleReset}
              onLoadSample={handleLoadSample}
              loading={state === 'loading'}
              resultCount={result?.names.length ?? 0}
              truncated={result?.truncated ?? false}
            />
          </div>

          {/* Results */}
          <section aria-live="polite" className="min-w-0" ref={resultsRef}>
            {/* Results toolbar */}
            {state === 'success' && result && (
              <div className="mb-3 sm:mb-4">
                <div className="flex items-baseline justify-between gap-3">
                  <p className="text-sm font-semibold">
                    {result.names.length} name{result.names.length === 1 ? '' : 's'}
                    {result.truncated ? ' (fewer than requested)' : ''}
                  </p>
                  <p className="font-mono text-[0.7rem] text-dim sm:text-xs">
                    seed {result.seed} · {favoriteCount} ★
                  </p>
                </div>
                <p className="mt-0.5 hidden font-mono text-xs text-dim sm:block">
                  generated {timeAgo(result.generatedAt)}
                </p>
                <div className="hscroll bleed mt-2.5">
                  <Button size="sm" variant="ghost" onClick={copyAll}>
                    <Copy size={15} /> Copy all
                  </Button>
                  <Button size="sm" variant="ghost" onClick={handleSaveResult}>
                    <Bookmark size={15} /> Save
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => setExportOpen(true)}>
                    <Download size={15} /> Export
                  </Button>
                  <Button size="sm" variant="ghost" onClick={handleReset} className="lg:hidden">
                    <RotateCcw size={15} /> Reset
                  </Button>
                </div>
              </div>
            )}

            {/* States */}
            {state === 'idle' && (
              <div className="card flex flex-col items-center justify-center gap-3 p-7 text-center sm:p-12">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-elevated">
                  <Cpu size={26} className="text-primary" />
                </div>
                <h3 className="text-lg font-semibold">Ready when you are</h3>
                <p className="max-w-sm text-sm text-muted">
                  <span className="lg:hidden">
                    Tap <strong>Criteria</strong> below to refine, or hit <strong>Generate</strong> to start.
                  </span>
                  <span className="hidden lg:inline">
                    Tune the criteria on the left, or try a quick sample, then hit <strong>Generate names</strong>.
                  </span>
                </p>
                <Button variant="primary" className="mt-1 w-full sm:w-auto lg:hidden" onClick={handleGenerate}>
                  <Sparkles size={16} /> Generate names
                </Button>
              </div>
            )}

            {state === 'loading' && (
              <div className="card flex items-center justify-center gap-3 p-10 text-muted sm:p-12">
                <span className="h-5 w-5 animate-spin rounded-full border-2 border-border border-t-primary" />
                Generating locally…
              </div>
            )}

            {state === 'empty' && (
              <div className="card flex flex-col items-center gap-3 p-7 text-center sm:p-12">
                <AlertTriangle size={28} className="text-warning" />
                <h3 className="text-lg font-semibold">No names matched</h3>
                <p className="max-w-sm text-sm text-muted">
                  Your constraints are too tight. Try widening the length range, adding fields or origins, or clearing
                  &quot;must include&quot;.
                </p>
                <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row">
                  <Button variant="ghost" onClick={handleReset}>
                    Reset filters
                  </Button>
                  <Button variant="primary" onClick={handleShuffle}>
                    Shuffle seed
                  </Button>
                </div>
              </div>
            )}

            {state === 'recoverable_error' && (
              <div className="card flex flex-col items-center gap-3 p-7 text-center sm:p-12">
                <AlertTriangle size={28} className="text-danger" />
                <h3 className="text-lg font-semibold">Something went wrong</h3>
                <p className="text-sm text-muted">Please adjust your criteria and try again.</p>
                <Button variant="primary" onClick={handleGenerate}>
                  Retry
                </Button>
              </div>
            )}

            {state === 'degraded_offline' && (
              <div className="mb-4 flex items-start gap-2 rounded-lg border border-warning/40 bg-warning/10 px-3 py-2 text-sm text-warning">
                <AlertTriangle size={15} className="mt-0.5 shrink-0" />
                <span>Browser storage is unavailable — history won&apos;t be saved this session, but generation works.</span>
              </div>
            )}

            {state === 'success' && result && (
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
                {result.names.map((item, i) => (
                  <NameCard
                    key={item.name}
                    item={item}
                    index={i}
                    favorite={favorites.has(item.name)}
                    onToggleFavorite={toggleFavorite}
                    onCopy={copyOne}
                  />
                ))}
              </div>
            )}

            {state === 'success' && result && (
              <div className="mt-5 rounded-xl border border-border bg-elevated/50 p-4 text-xs text-dim sm:mt-6">
                <p className="font-semibold text-muted">Important</p>
                <p className="mt-1">
                  DelQuro suggests names based on etymologically-inspired morphemes. It does not check trademark, domain,
                  or social-handle availability. Verify availability with the relevant authorities before using a name
                  commercially.
                </p>
              </div>
            )}
          </section>
        </div>

        {/* How it works */}
        <section className="mt-10 grid grid-cols-1 gap-3 sm:mt-16 sm:grid-cols-3 sm:gap-4">
          {[
            { n: '1', t: 'Compose from parts', d: 'Names are built from tagged prefixes, roots and suffixes — not random letters.' },
            { n: '2', t: 'Filter & score', d: 'Hard constraints filter; soft preferences produce a 0–100 fit score with rationale.' },
            { n: '3', t: 'Export & save', d: 'Copy, save to your device, or export JSON, CSV or Markdown — nothing leaves your browser.' },
          ].map((s) => (
            <div key={s.n} className="card p-4 sm:p-5">
              <div className="mb-2 flex h-8 w-8 items-center justify-center rounded-lg bg-primary/15 font-mono text-sm font-bold text-primary">
                {s.n}
              </div>
              <h3 className="font-semibold">{s.t}</h3>
              <p className="mt-1 text-sm text-muted">{s.d}</p>
            </div>
          ))}
        </section>

        <footer className="mt-8 border-t border-border py-5 text-center text-xs text-dim sm:mt-10 sm:py-6">
          DelQuro Generator · 100% local · No accounts · No tracking
        </footer>
      </main>

      {/* Mobile action bar — primary controls stay under the thumb */}
      <div className="bottom-bar fixed inset-x-0 bottom-0 z-40 pt-2 lg:hidden">
        <div className="mx-auto flex max-w-3xl items-center gap-2">
          <button
            type="button"
            onClick={() => setShowCriteria(true)}
            className="btn btn-ghost flex-1"
            aria-haspopup="dialog"
          >
            <SlidersHorizontal size={17} />
            Criteria
            {activeCriteriaCount > 0 && <span className="pill-count">{activeCriteriaCount}</span>}
          </button>
          <button
            type="button"
            onClick={handleGenerate}
            disabled={generateDisabled}
            className="btn btn-primary flex-[1.35]"
          >
            <Sparkles size={17} />
            {state === 'loading' ? 'Generating…' : 'Generate'}
          </button>
          <button
            type="button"
            onClick={handleShuffle}
            disabled={generateDisabled}
            className="btn btn-ghost w-[52px] px-0"
            aria-label="Shuffle seed and regenerate"
            title="Shuffle"
          >
            <Shuffle size={17} />
          </button>
        </div>
      </div>

      {/* Criteria sheet (mobile / tablet) */}
      <Sheet
        open={showCriteria}
        onClose={() => setShowCriteria(false)}
        title="Refine your name"
        description="Every control is optional — tighten only what matters."
        labelId="criteria-sheet-title"
        headerAction={
          <button type="button" onClick={handleReset} className="icon-btn" aria-label="Reset criteria to defaults" title="Reset">
            <RotateCcw size={18} />
          </button>
        }
        footer={
          <button
            type="submit"
            form="sheet-form"
            disabled={generateDisabled}
            className="btn btn-primary w-full"
          >
            <Sparkles size={17} />
            Generate {criteria.quantity} name{criteria.quantity === 1 ? '' : 's'}
          </button>
        }
      >
        <CriteriaForm
          idPrefix="sheet"
          criteria={criteria}
          onChange={updateCriteria}
          onGenerate={handleGenerateFromSheet}
          onReset={handleReset}
          onLoadSample={handleLoadSample}
          loading={state === 'loading'}
          resultCount={result?.names.length ?? 0}
          truncated={result?.truncated ?? false}
          showSubmit={false}
          surface={false}
        />
      </Sheet>

      {/* History sheet */}
      <Sheet
        open={showHistory}
        onClose={() => setShowHistory(false)}
        title="Saved on this device"
        description="Briefs you saved locally. Nothing is uploaded."
        labelId="history-sheet-title"
      >
        <HistoryPanel
          history={history}
          onRerun={handleRerun}
          onDelete={handleDelete}
          onClear={handleClear}
          embedded
        />
      </Sheet>

      {/* Export sheet */}
      <Sheet
        open={exportOpen}
        onClose={() => setExportOpen(false)}
        title="Export names"
        description="Download the current result set. CSV is formula-injection protected."
        labelId="export-sheet-title"
      >
        <div className="grid grid-cols-3 gap-2 pb-2">
          {[
            { fmt: 'json' as const, icon: <FileJson size={24} className="text-accent" />, label: 'JSON' },
            { fmt: 'csv' as const, icon: <FileSpreadsheet size={24} className="text-success" />, label: 'CSV' },
            { fmt: 'md' as const, icon: <FileText size={24} className="text-primary" />, label: 'Markdown' },
          ].map((o) => (
            <button
              key={o.fmt}
              type="button"
              onClick={() => exportFile(o.fmt)}
              className="flex min-h-[96px] flex-col items-center justify-center gap-2 rounded-xl border border-border bg-elevated p-3 text-sm active:scale-[0.98] hover:border-border-strong"
            >
              {o.icon}
              {o.label}
            </button>
          ))}
        </div>
      </Sheet>

      {/* Save consent */}
      <Dialog
        open={saveConsentOpen}
        onClose={() => setSaveConsentOpen(false)}
        role="alertdialog"
        title="Save this brief to your device?"
        description="The criteria and generated names will be stored locally in your browser only. Nothing is uploaded."
      >
        <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <Button variant="ghost" onClick={() => setSaveConsentOpen(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={confirmSave}>
            <Check size={15} /> Save locally
          </Button>
        </div>
      </Dialog>

      <Toast show={toast.show} message={toast.message} onDone={() => setToast((t) => ({ ...t, show: false }))} />
    </div>
  );
}
