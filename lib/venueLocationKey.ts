/** Same key as `app/api/venues` / `venue_cache.location_key` — state + optional city slugs. */
export function buildVenueLocationKey(state: string, city?: string | null): string {
  const s = state.trim().toLowerCase().replace(/\s+/g, '-');
  if (city?.trim()) {
    return `${s}-${city.trim().toLowerCase().replace(/\s+/g, '-')}`;
  }
  return s;
}
