const LEGACY_KEY = 'vow-swipe-user-id';

/**
 * Per-device swipe identity, scoped by couple + creator vs joiner so two partners on the
 * same browser (e.g. both testing the couple code) don't share the same deck progress.
 * - Creator slot: migrates legacy global id once to preserve existing creators after upgrade.
 * - Joiner slot: always a new UUID (never inherits legacy or creator's id).
 */
export function getOrCreateSwipeUserId(
  coupleId?: string | null,
  isCreator?: boolean
): string {
  if (typeof window === 'undefined') return '';
  try {
    if (coupleId != null && coupleId !== '') {
      const joiner = isCreator === false;
      const slot = joiner ? 'j' : 'c';
      const scopedKey = `vow-swipe-uid:${coupleId}:${slot}`;
      const existing = localStorage.getItem(scopedKey)?.trim();
      if (existing) return existing;

      if (joiner) {
        const id = crypto.randomUUID();
        localStorage.setItem(scopedKey, id);
        return id;
      }

      const legacy = localStorage.getItem(LEGACY_KEY)?.trim();
      if (legacy) {
        localStorage.setItem(scopedKey, legacy);
        return legacy;
      }
      const id = crypto.randomUUID();
      localStorage.setItem(scopedKey, id);
      return id;
    }

    let id = localStorage.getItem(LEGACY_KEY)?.trim();
    if (!id) {
      id = crypto.randomUUID();
      localStorage.setItem(LEGACY_KEY, id);
    }
    return id;
  } catch {
    return '';
  }
}
