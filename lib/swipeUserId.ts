const KEY = 'vow-swipe-user-id';

/** Stable per-browser identifier so two partners who share the same role don't overwrite each other's swipes. */
export function getOrCreateSwipeUserId(): string {
  if (typeof window === 'undefined') return '';
  try {
    let id = localStorage.getItem(KEY);
    if (!id?.trim()) {
      id = crypto.randomUUID();
      localStorage.setItem(KEY, id);
    }
    return id;
  } catch {
    return '';
  }
}
