'use client';

import { useCallback, useEffect, useState } from 'react';
import { getFallbackVenuesForLocation } from '@/data/fallbackVenues';
import type { WeddingOption } from '@/lib/types';

type VenuesResponse = {
  venues: WeddingOption[];
  fallback?: boolean;
  message?: string;
};

/** When no onboarding location is stored yet, still call `/api/venues` so sample/fallback data loads (no Places key). */
const DEFAULT_STATE_FOR_FETCH = 'California';

type UseVenuesOptions = {
  /** When false, skips fetch (e.g. before `useCouple` has hydrated). City is optional — do not gate on it. */
  enabled?: boolean;
};

export function useVenues(
  state: string | undefined,
  city?: string | null,
  options?: UseVenuesOptions
) {
  const enabled = options?.enabled ?? true;
  const [venues, setVenues] = useState<WeddingOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const fetchVenues = useCallback(async () => {
    if (!enabled) return;
    const effectiveState = state?.trim() || DEFAULT_STATE_FOR_FETCH;
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({ state: effectiveState });
      if (city?.trim()) params.set('city', city.trim());
      const res = await fetch(`/api/venues?${params.toString()}`);
      const data = (await res.json().catch(() => ({}))) as VenuesResponse & { error?: string };

      let list: WeddingOption[] = Array.isArray(data.venues) ? data.venues : [];
      if (list.length === 0) {
        list = getFallbackVenuesForLocation(effectiveState, city ?? null);
      }

      if (!res.ok) {
        setError(data.error ?? 'Could not load venues');
        setVenues(list);
        return;
      }
      setVenues(list);
    } catch {
      setError('Could not load venues');
      setVenues(getFallbackVenuesForLocation(effectiveState, city ?? null));
    } finally {
      setLoading(false);
    }
  }, [state, city, enabled]);

  useEffect(() => {
    if (!enabled) return;
    void fetchVenues();
  }, [fetchVenues, enabled]);

  return {
    venues,
    loading,
    error,
    refetch: fetchVenues,
  };
}
