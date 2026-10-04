/**
 * DDE / formula-injection-safe CSV generation.
 * Prefixes a neutralizing single quote to cells that start with characters
 * spreadsheet apps interpret as formulas.
 */
const DANGEROUS_PREFIXES = ['=', '+', '-', '@', '\t', '\r', '%', '|', "'", '"'];

export function sanitizeCsvCell(value: unknown): string {
  if (value === null || value === undefined) return '""';
  let str = String(value);
  if (DANGEROUS_PREFIXES.some((prefix) => str.startsWith(prefix))) {
    str = `'${str}`;
  }
  return `"${str.replace(/"/g, '""')}"`;
}

export function generateSafeCsv(
  headers: readonly string[],
  rows: readonly (string | number | boolean | null | undefined)[][],
): string {
  const headerLine = headers.map((h) => sanitizeCsvCell(h)).join(',');
  const rowLines = rows.map((row) => row.map((cell) => sanitizeCsvCell(cell)).join(','));
  return [headerLine, ...rowLines].join('\r\n');
}
