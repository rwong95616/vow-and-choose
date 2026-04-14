import type { CategoryId } from '@/data/options';
import { CATEGORY_ORDER } from '@/data/options';
import type { CoupleStorage } from '@/lib/types';

const KEY = 'vow-and-choose';
const SWIPE_CATEGORY_KEY = 'vow-swipe-category';

function isCategoryId(v: string): v is CategoryId {
  return (CATEGORY_ORDER as readonly string[]).includes(v);
}

/** Last selected Swipe tab category — survives navigation to Our Picks / Settings. */
export function loadSwipeCategory(): CategoryId | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(SWIPE_CATEGORY_KEY);
    if (!raw || !isCategoryId(raw)) return null;
    return raw;
  } catch {
    return null;
  }
}

export function saveSwipeCategory(category: CategoryId): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(SWIPE_CATEGORY_KEY, category);
  } catch {
    /* ignore quota / private mode */
  }
}

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
