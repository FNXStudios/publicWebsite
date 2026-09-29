import { describe, expect, it } from 'vitest';
import { ageGateConfig } from '@/config/age-gate.config';
import { ageGateSchema } from '@/config/schema/age-gate.schema';
import {
  AGE_GATE_STORAGE_KEY,
  ageGateHeadScript,
  createVerification,
  isVerificationValid,
  readVerification,
  writeVerification,
} from '@/lib/age-gate/storage';

const DAY = 24 * 60 * 60 * 1000;

function memoryStorage(initial: Record<string, string> = {}) {
  const data = new Map(Object.entries(initial));
  return {
    getItem: (k: string) => data.get(k) ?? null,
    setItem: (k: string, v: string) => void data.set(k, v),
    data,
  };
}

describe('age gate configuration', () => {
  it('is config-owned and valid', () => {
    expect(ageGateConfig.enabled).toBe(true);
    expect(ageGateConfig.minimumAge).toBe(18);
    expect(ageGateConfig.rememberDays).toBeGreaterThan(0);
  });

  it('rejects non-https exit or responsible-gaming destinations', () => {
    expect(ageGateSchema.safeParse({ ...ageGateConfig, exitUrl: 'http://example.com' }).success).toBe(false);
    expect(ageGateSchema.safeParse({ ...ageGateConfig, responsibleGamingUrl: 'javascript:alert(1)' }).success).toBe(false);
  });
});

describe('age verification persistence', () => {
  const now = Date.UTC(2026, 0, 1);

  it('stores version and expiry only — no personal data', () => {
    const v = createVerification(1, 30, now);
    expect(Object.keys(v).sort()).toEqual(['expiresAt', 'verifiedAt', 'version']);
    expect(v.expiresAt - v.verifiedAt).toBe(30 * DAY);
  });

  it('accepts only an unexpired confirmation of the current version', () => {
    const valid = JSON.stringify(createVerification(1, 30, now));
    expect(isVerificationValid(valid, 1, now + DAY)).toBe(true);
    expect(isVerificationValid(valid, 1, now + 31 * DAY)).toBe(false); // expired
    expect(isVerificationValid(valid, 2, now + DAY)).toBe(false); // policy version bumped
    expect(isVerificationValid('{"version":1,"expiresAt":9e15}', 1, now)).toBe(false); // malformed
    expect(isVerificationValid('not json', 1, now)).toBe(false);
    expect(isVerificationValid(null, 1, now)).toBe(false);
  });

  it('writes to localStorage, falls back to sessionStorage, and reads either', () => {
    const local = memoryStorage();
    expect(writeVerification(1, 30, [local, undefined])).toBe('local');
    expect(local.data.has(AGE_GATE_STORAGE_KEY)).toBe(true);
    expect(readVerification(1, [local])).toBe(true);

    const blocked = { setItem: () => { throw new Error('QuotaExceeded'); } };
    const session = memoryStorage();
    expect(writeVerification(1, 30, [blocked, session])).toBe('session');
    expect(readVerification(1, [undefined, session])).toBe(true);
    expect(writeVerification(1, 30, [undefined, undefined])).toBeNull();
  });

  it('the pre-paint head script marks unverified visitors and trusts valid ones', () => {
    const run = (stored: string | null) => {
      const attrs = new Map<string, string>();
      const storage = { getItem: () => stored };
      const fn = new Function('document', 'window', ageGateHeadScript(1));
      fn({ documentElement: { setAttribute: (k: string, v: string) => attrs.set(k, v) } }, { localStorage: storage, sessionStorage: undefined });
      return attrs.get('data-age-gate');
    };
    expect(run(null)).toBe('pending');
    expect(run(JSON.stringify(createVerification(1, 30)))).toBeUndefined();
    expect(run(JSON.stringify(createVerification(2, 30)))).toBe('pending');
  });
});
