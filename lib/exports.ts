import type { GenerateResult, GeneratedName } from './engine/contracts';
import { generateSafeCsv } from './safe-csv';

export function toJson(result: GenerateResult): string {
  return JSON.stringify(
    {
      generator: 'DelQuro Generator',
      seed: result.seed,
      generatedAt: result.generatedAt,
      criteria: result.criteria,
      count: result.names.length,
      names: result.names,
    },
    null,
    2,
  );
}

export function toCsv(result: GenerateResult): string {
  const headers = ['name', 'score', 'style', 'field', 'origin', 'syllables', 'phonetic', 'components', 'tags'];
  const rows = result.names.map((n: GeneratedName) => [
    n.name,
    n.score,
    n.style,
    n.field,
    n.origin,
    n.syllableCount,
    n.phonetic,
    n.components.map((c) => `${c.text}(${c.meaning})`).join(' | '),
    n.tags.join(' | '),
  ]);
  return generateSafeCsv(headers, rows);
}

export function toMarkdown(result: GenerateResult): string {
  const lines: string[] = [];
  lines.push('# DelQuro Generator — Names');
  lines.push('');
  lines.push(`- Seed: \`${result.seed}\``);
  lines.push(`- Generated: ${result.generatedAt}`);
  lines.push(`- Type: ${result.criteria.nameType} · Fields: ${result.criteria.fields.join(', ') || 'any'} · Origins: ${result.criteria.origins.join(', ') || 'any'}`);
  lines.push('');
  lines.push('| # | Name | Score | Style | Origin | Syll. | Phonetic |');
  lines.push('|---|------|-------|-------|--------|-------|----------|');
  result.names.forEach((n, i) => {
    lines.push(`| ${i + 1} | **${n.name}** | ${n.score} | ${n.style} | ${n.origin} | ${n.syllableCount} | /${n.phonetic}/ |`);
  });
  lines.push('');
  lines.push('## Breakdown');
  lines.push('');
  result.names.forEach((n) => {
    lines.push(`### ${n.name}  _(score ${n.score})_`);
    lines.push(`- Components: ${n.components.map((c) => `\`${c.text}\` — ${c.meaning}`).join('; ')}`);
    lines.push(`- ${n.rationale.join('; ')}`);
    lines.push('');
  });
  return lines.join('\n');
}

export function safeFilename(base: string, ext: string): string {
  const stamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
  const clean = base.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '') || 'delquro';
  return `${clean}-${stamp}.${ext}`;
}

export function downloadText(filename: string, text: string, mime: string): void {
  if (typeof document === 'undefined') return;
  const blob = new Blob([text], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
