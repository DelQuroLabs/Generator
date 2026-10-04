'use client';

import Link from 'next/link';
import { useState } from 'react';
import { ArrowLeft, KeyRound, ShieldCheck, Copy, Download, Eye, EyeOff, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { generateApiKeys, keyEntropy, type KeyFormat } from '@/lib/api-keys';
import { downloadText } from '@/lib/exports';

export default function ApiKeysPage() {
  const [format, setFormat] = useState<KeyFormat>('base64url');
  const [length, setLength] = useState(48);
  const [prefix, setPrefix] = useState('dq_');
  const [count, setCount] = useState(1);
  const [keys, setKeys] = useState<string[]>([]);
  const [revealed, setRevealed] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  function generate() {
    try {
      const next = generateApiKeys({ format, length, prefix, count });
      setKeys(next); setRevealed(false); setError('');
      setMessage(`${next.length} new ${next.length === 1 ? 'key' : 'keys'} generated. Previous keys replaced in this view.`);
    } catch (err) { setError(err instanceof Error ? err.message : 'Generation failed.'); }
  }
  async function copy(text: string) {
    try { await navigator.clipboard.writeText(text); setMessage('Copied. Your clipboard now contains secret key material.'); }
    catch { setError('Clipboard unavailable. Reveal and select the key to copy it manually.'); }
  }
  return (
    <main className="mx-auto max-w-3xl px-4 py-8 sm:px-6 sm:py-12">
      <Link href="/" className="inline-flex min-h-11 items-center gap-2 text-muted hover:text-fg"><ArrowLeft size={18} /> Name generator</Link>
      <div className="mt-8 mb-8">
        <span className="inline-flex items-center gap-2 text-accent text-sm"><ShieldCheck size={18} /> LOCAL · CRYPTOGRAPHIC · NO ACCOUNT</span>
        <h1 className="mt-4 text-3xl sm:text-5xl font-bold tracking-tight">Keys for your next build.</h1>
        <p className="mt-4 text-muted leading-relaxed">Generate API keys and secret tokens for your own applications. Created in your browser using Web Crypto, never sent to a server or saved in name history.</p>
      </div>
      <section aria-labelledby="key-options" className="rounded-2xl border border-border bg-surface p-5 sm:p-7">
        <h2 id="key-options" className="flex items-center gap-2 text-xl font-semibold"><KeyRound size={22} className="text-primary" /> API key generator</h2>
        <div className="grid sm:grid-cols-2 gap-5 mt-6">
          <label className="flex flex-col gap-2 text-sm">Format<select className="input" value={format} onChange={e => setFormat(e.target.value as KeyFormat)}><option value="base64url">URL-safe (A–Z, a–z, 0–9, -, _)</option><option value="hex">Hexadecimal (0–9, a–f)</option><option value="alphanumeric">Alphanumeric (A–Z, a–z, 0–9)</option></select></label>
          <label className="flex flex-col gap-2 text-sm">Random length (32–128)<input className="input" type="number" min={32} max={128} value={length} onChange={e => setLength(Number(e.target.value))} /></label>
          <label className="flex flex-col gap-2 text-sm">Prefix (optional, max 24)<input className="input" maxLength={24} value={prefix} spellCheck={false} autoComplete="off" onChange={e => setPrefix(e.target.value)} /><span className="text-muted text-xs">A label only; adds no entropy.</span></label>
          <label className="flex flex-col gap-2 text-sm">Quantity (1–20)<input className="input" type="number" min={1} max={20} value={count} onChange={e => setCount(Number(e.target.value))} /></label>
        </div>
        <div className="flex flex-wrap items-center justify-between gap-4 mt-6"><span className="text-sm text-muted">{Number.isInteger(length) && length >= 32 && length <= 128 ? `${keyEntropy(format, length)} bits of entropy per key` : 'Choose a valid random length'}</span><Button variant="primary" onClick={generate}><KeyRound size={17} /> Generate keys</Button></div>
      </section>
      {error && <p role="alert" className="mt-4 text-danger">{error}</p>}
      <p role="status" className="mt-4 text-sm text-accent">{message}</p>
      {keys.length > 0 && <section aria-labelledby="generated-keys" className="mt-6 rounded-2xl border border-border bg-surface p-5 sm:p-7">
        <h2 id="generated-keys" className="text-xl font-semibold">Your generated keys</h2>
        <p className="mt-2 text-sm text-muted">Copy or download before leaving. Keys are not persisted. Clearing this view does not revoke keys in your application or erase your clipboard.</p>
        <div className="flex flex-wrap gap-2 my-4">
          <Button onClick={() => setRevealed(!revealed)}>{revealed ? <EyeOff size={16} /> : <Eye size={16} />}{revealed ? 'Hide' : 'Reveal'}</Button>
          <Button onClick={() => copy(keys.join('\n'))}><Copy size={16} />Copy all</Button>
          <Button onClick={() => { downloadText('delquro-secret-keys.txt', keys.join('\n') + '\n', 'text/plain'); setMessage('Download requested. The file contains plaintext secrets; store it securely.'); }}><Download size={16} />Download .txt</Button>
          <Button onClick={() => { setKeys([]); setRevealed(false); setError(''); setMessage('Keys removed from this view. Clipboard and downloaded files are unchanged.'); }}><Trash2 size={16} />Clear</Button>
        </div>
        <ol className="space-y-3">{keys.map((key, i) => <li key={i} className="flex items-center gap-3 rounded-xl border border-border bg-bg p-3"><code className="min-w-0 flex-1 break-all text-sm select-all" aria-label={revealed ? undefined : `Key ${i + 1} hidden`}>{revealed ? key : '••••••••••••••••••••••••'}</code><Button aria-label={`Copy key ${i + 1}`} onClick={() => copy(key)}><Copy size={16} /></Button></li>)}</ol>
      </section>}
      <aside className="mt-7 text-sm text-muted leading-relaxed border-l-2 border-primary pl-4">
        <strong className="text-fg">Key material, not third-party access.</strong> These keys do not unlock OpenAI, Stripe, or any other service. Your backend must provision and validate them, apply scopes and expiry, and support revocation. Store a hash server-side where appropriate. Never put secrets in client code, public repositories, screenshots, or chat. Copying may expose keys through clipboard history or sync; downloads are unencrypted.
      </aside>
    </main>
  );
}
