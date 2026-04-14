import type { CoupleStorage } from '@/lib/types';

const KEY = 'vow-and-choose';

export function loadCouple(): CoupleStorage | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return null;
    const data = JSON.parse(raw) as Partial<CoupleStorage>;
    if (!data.coupleId || !data.coupleCode) return null;
    return data as CoupleStorage;
  } catch {
    return null;
  }
}

export function saveCouplePartial(patch: Partial<CoupleStorage> & Record<string, unknown>) {
  if (typeof window === 'undefined') return;
  const prev = loadCouple() ?? ({} as CoupleStorage);
  const next = { ...prev, ...patch };
  localStorage.setItem(KEY, JSON.stringify(next));
}

export function saveCouple(data: CoupleStorage) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(KEY, JSON.stringify(data));
}

export function clearCouple() {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(KEY);
}

/** True when this device already stored this couple as the creator — avoids overwriting with false after opening a share link or re-joining with the same code. */
export function isExistingCoupleCreator(coupleId: string): boolean {
  const c = loadCouple();
  const raw =
    typeof window !== 'undefined' ? window.localStorage.getItem(KEY) : null;
  console.log('[isExistingCoupleCreator]', {
    coupleIdArg: coupleId,
    rawLocalStorage: raw,
    loadedCoupleId: c?.coupleId,
    loadedIsCreator: c?.isCreator,
  });
  return c?.coupleId === coupleId && c.isCreator === true;
}

export function isOnboardingComplete(): boolean {
  const c = loadCouple();
  if (!c?.coupleId || !c.coupleCode || !c.userRole) return false;
  if (c.isCreator) {
    return !!c.locationState?.trim() || !!c.locationSkipped;
  }
  return true;
}
