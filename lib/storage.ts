import { get, set, del, keys } from 'idb-keyval';
import { CriteriaSchema, GenerateResultSchema, type Criteria, type GenerateResult } from './engine/contracts';

const HISTORY_KEY = 'delquro:history:v1';
const PREFS_KEY = 'delquro:prefs:v1';

export interface HistoryEntry {
  id: string;
  name: string;
  criteria: Criteria;
  result: GenerateResult;
  favorite: boolean;
  createdAt: string;
}

interface Prefs {
  theme: 'dark' | 'light';
  lastCriteria: Criteria | null;
}

const isBrowser = typeof window !== 'undefined';
const memoryStore = new Map<string, unknown>();

async function safeGet<T>(key: string): Promise<T | undefined> {
  if (!isBrowser) return undefined;
  try {
    return (await get<T>(key)) ?? undefined;
  } catch {
    return memoryStore.get(key) as T | undefined;
  }
}

async function safeSet(key: string, value: unknown): Promise<void> {
  if (!isBrowser) return;
  memoryStore.set(key, value);
  try {
    await set(key, value);
  } catch {
    // quota / private mode — keep in-memory copy
  }
}

export async function loadHistory(): Promise<HistoryEntry[]> {
  const raw = await safeGet<HistoryEntry[]>(HISTORY_KEY);
  if (!Array.isArray(raw)) return [];
  const valid: HistoryEntry[] = [];
  for (const item of raw) {
    const crit = CriteriaSchema.safeParse(item?.criteria);
    const res = GenerateResultSchema.safeParse(item?.result);
    if (crit.success && res.success && typeof item?.id === 'string') {
      valid.push({ ...item, criteria: crit.data, result: res.data });
    }
  }
  return valid.sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
}

export async function saveHistory(entries: readonly HistoryEntry[]): Promise<void> {
  await safeSet(HISTORY_KEY, entries.slice(0, 100));
}

export async function addHistory(entry: HistoryEntry): Promise<HistoryEntry[]> {
  const all = await loadHistory();
  const next = [entry, ...all.filter((e) => e.id !== entry.id)].slice(0, 100);
  await saveHistory(next);
  return next;
}

export async function deleteHistory(id: string): Promise<HistoryEntry[]> {
  const all = await loadHistory();
  const next = all.filter((e) => e.id !== id);
  await saveHistory(next);
  return next;
}

export async function clearHistory(): Promise<void> {
  if (!isBrowser) return;
  try {
    await del(HISTORY_KEY);
  } catch {
    /* ignore */
  }
  memoryStore.delete(HISTORY_KEY);
}

export async function loadPrefs(): Promise<Prefs> {
  const raw = await safeGet<Prefs>(PREFS_KEY);
  const defaults: Prefs = { theme: 'dark', lastCriteria: null };
  if (!raw) return defaults;
  const crit = raw.lastCriteria ? CriteriaSchema.safeParse(raw.lastCriteria) : null;
  return {
    theme: raw.theme === 'light' ? 'light' : 'dark',
    lastCriteria: crit && crit.success ? crit.data : null,
  };
}

export async function savePrefs(prefs: Prefs): Promise<void> {
  await safeSet(PREFS_KEY, prefs);
}

export function storageAvailable(): boolean {
  return isBrowser;
}

export async function countStoredKeys(): Promise<number> {
  if (!isBrowser) return 0;
  try {
    return (await keys()).length;
  } catch {
    return memoryStore.size;
  }
}
