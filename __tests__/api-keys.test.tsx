import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { generateApiKeys, keyEntropy, type KeyOptions } from '@/lib/api-keys';
import ApiKeysPage from '@/app/api-keys/page';
const options: KeyOptions = { format: 'base64url', length: 48, prefix: 'dq_', count: 2 };
afterEach(() => { cleanup(); vi.restoreAllMocks(); vi.unstubAllGlobals(); });
describe('secure API keys', () => {
  it.each(['hex', 'base64url', 'alphanumeric'] as const)('generates %s keys of exact length and alphabet', format => {
    const keys = generateApiKeys({ ...options, format });
    expect(keys).toHaveLength(2);
    for (const key of keys) {
      expect(key).toHaveLength(51);
      expect(key.startsWith('dq_')).toBe(true);
      expect(key.slice(3)).toMatch(format === 'hex' ? /^[0-9a-f]+$/ : format === 'alphanumeric' ? /^[a-zA-Z0-9]+$/ : /^[a-zA-Z0-9_-]+$/);
    }
  });
  it('rejects invalid bounds, prefix and format', () => {
    for (const patch of [{ length: 31 }, { length: 129 }, { length: 32.5 }, { count: 0 }, { count: 21 }, { prefix: 'bad prefix' }, { prefix: 'x'.repeat(25) }, { format: 'toString' }]) {
      expect(() => generateApiKeys({ ...options, ...patch } as KeyOptions)).toThrow();
    }
  });
  it('fails closed without Web Crypto', () => {
    vi.stubGlobal('crypto', undefined);
    expect(() => generateApiKeys(options)).toThrow('Secure randomness is unavailable');
  });
  it('uses rejection sampling rather than biased modulo mapping', () => {
    vi.spyOn(crypto, 'getRandomValues').mockImplementation(((array: Uint8Array) => {
      array.fill(0); array[0] = 248; array[1] = 255; array[2] = 61; return array;
    }) as typeof crypto.getRandomValues);
    const [key] = generateApiKeys({ ...options, format: 'alphanumeric', prefix: '', count: 1, length: 32 });
    expect(key).toBe('9' + 'A'.repeat(31));
  });
  it('counts random entropy only', () => {
    expect(keyEntropy('hex', 32)).toBe(128);
    expect(keyEntropy('base64url', 48)).toBe(288);
  });
  it('generates masked keys, reveals and clears without persistence', () => {
    const save = vi.spyOn(Storage.prototype, 'setItem');
    render(<ApiKeysPage />);
    fireEvent.click(screen.getByRole('button', { name: 'Generate keys' }));
    expect(screen.getByLabelText('Key 1 hidden')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Reveal' }));
    expect(screen.getByText(/^dq_[A-Za-z0-9_-]{48}$/)).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Clear' }));
    expect(screen.queryByText('Your generated keys')).not.toBeInTheDocument();
    expect(save).not.toHaveBeenCalled();
  });
  it('reports clipboard failure honestly', async () => {
    render(<ApiKeysPage />);
    fireEvent.click(screen.getByRole('button', { name: 'Generate keys' }));
    fireEvent.click(screen.getByRole('button', { name: 'Copy key 1' }));
    expect(await screen.findByRole('alert')).toHaveTextContent('Clipboard unavailable');
  });
});
