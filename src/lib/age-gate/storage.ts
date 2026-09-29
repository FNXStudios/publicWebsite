/**
 * Age-gate persistence. Client-safe and dependency-free: it is shared by the client
 * dialog and serialised into the pre-paint <head> script.
 *
 * Stored payload (localStorage, first-party only, no personal data):
 *   { version, verifiedAt, expiresAt }
 */
export const AGE_GATE_STORAGE_KEY = 'fnx_age_verified';

export interface AgeVerification {
  version: number;
  verifiedAt: number;
  expiresAt: number;
}

const DAY_MS = 24 * 60 * 60 * 1000;

export function createVerification(version: number, rememberDays: number, now = Date.now()): AgeVerification {
  return { version, verifiedAt: now, expiresAt: now + rememberDays * DAY_MS };
}

/** True only for a well-formed, unexpired confirmation of the current policy version. */
export function isVerificationValid(raw: string | null | undefined, version: number, now = Date.now()): boolean {
  if (!raw) return false;
  try {
    const value: unknown = JSON.parse(raw);
    if (!value || typeof value !== 'object') return false;
    const { version: v, verifiedAt, expiresAt } = value as Partial<AgeVerification>;
    return (
      v === version &&
      typeof verifiedAt === 'number' &&
      typeof expiresAt === 'number' &&
      verifiedAt <= now + 60_000 && // tolerate small clock skew, reject nonsense
      expiresAt > now
    );
  } catch {
    return false;
  }
}

type Reader = Pick<Storage, 'getItem'>;
type Writer = Pick<Storage, 'setItem'>;

/** Checks localStorage, then sessionStorage (the fallback when localStorage is blocked). */
export function readVerification(version: number, storages: (Reader | undefined)[] = defaultStorages()): boolean {
  return storages.some((storage) => {
    try {
      return isVerificationValid(storage?.getItem(AGE_GATE_STORAGE_KEY), version);
    } catch {
      return false;
    }
  });
}

/**
 * Persists a confirmation to localStorage, falling back to sessionStorage (this visit
 * only). Returns where it was stored, or null when no storage is available — the
 * caller then simply keeps the site open for the current page view.
 */
export function writeVerification(
  version: number,
  rememberDays: number,
  storages: (Writer | undefined)[] = defaultStorages(),
): 'local' | 'session' | null {
  const payload = JSON.stringify(createVerification(version, rememberDays));
  for (const [index, storage] of storages.entries()) {
    try {
      if (!storage) continue;
      storage.setItem(AGE_GATE_STORAGE_KEY, payload);
      return index === 0 ? 'local' : 'session';
    } catch {
      /* try the next one */
    }
  }
  return null;
}

function defaultStorages(): (Storage | undefined)[] {
  if (typeof window === 'undefined') return [];
  const get = (name: 'localStorage' | 'sessionStorage') => {
    try {
      return window[name];
    } catch {
      return undefined;
    }
  };
  return [get('localStorage'), get('sessionStorage')];
}

/**
 * Inline <head> script: marks <html data-age-gate="pending"> before first paint when
 * no valid confirmation exists, so CSS can cover the page before React hydrates.
 * Session-only confirmations (storage unavailable) are honoured via sessionStorage.
 */
export function ageGateHeadScript(version: number): string {
  const key = JSON.stringify(AGE_GATE_STORAGE_KEY);
  return `(function(){try{var d=document.documentElement,k=${key},v=${Number(version)},n=Date.now();function ok(s){try{var r=s&&s.getItem(k);if(!r)return false;var p=JSON.parse(r);return p&&p.version===v&&typeof p.verifiedAt==='number'&&p.verifiedAt<=n+60000&&typeof p.expiresAt==='number'&&p.expiresAt>n}catch(e){return false}}var ls,ss;try{ls=window.localStorage}catch(e){}try{ss=window.sessionStorage}catch(e){}if(!ok(ls)&&!ok(ss))d.setAttribute('data-age-gate','pending')}catch(e){document.documentElement.setAttribute('data-age-gate','pending')}})();`;
}
