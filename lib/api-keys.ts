/** Cryptographic key material only; never use the seeded naming PRNG here. */
export const KEY_ALPHABETS = {
  hex: '0123456789abcdef',
  base64url: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_',
  alphanumeric: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789',
} as const;
export type KeyFormat = keyof typeof KEY_ALPHABETS;
export interface KeyOptions { format: KeyFormat; length: number; prefix: string; count: number }
export function keyEntropy(format: KeyFormat, length: number): number {
  return Math.floor(Math.log2(KEY_ALPHABETS[format].length) * length);
}
export function generateApiKeys({ format, length, prefix, count }: KeyOptions): string[] {
  if (!Object.hasOwn(KEY_ALPHABETS, format)) throw new Error('Choose a supported key format.');
  if (!Number.isInteger(length) || length < 32 || length > 128) throw new Error('Random length must be 32–128 characters.');
  if (!Number.isInteger(count) || count < 1 || count > 20) throw new Error('Generate 1–20 keys at a time.');
  if (!/^[a-zA-Z0-9_-]{0,24}$/.test(prefix)) throw new Error('Prefix must be at most 24 letters, numbers, underscores or hyphens.');
  if (!globalThis.crypto?.getRandomValues) throw new Error('Secure randomness is unavailable. Use a modern browser over HTTPS.');
  const alphabet = KEY_ALPHABETS[format];
  // Rejection sampling avoids modulo bias for the 62-character alphabet.
  const limit = 256 - (256 % alphabet.length);
  return Array.from({ length: count }, () => {
    let value = '';
    const bytes = new Uint8Array(128);
    while (value.length < length) {
      crypto.getRandomValues(bytes);
      for (const byte of bytes) {
        if (byte < limit) value += alphabet[byte % alphabet.length];
        if (value.length === length) break;
      }
    }
    bytes.fill(0);
    return prefix + value;
  });
}
