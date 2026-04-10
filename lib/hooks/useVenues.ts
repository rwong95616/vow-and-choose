'use client';

import { useCallback, useEffect, useState } from 'react';
import { getFallbackVenuesAllStatesRandomized, getFallbackVenuesForLocation } from '@/data/fallbackVenues';
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
  /** When true, fetches venues across all states (no `state` filter); use when location was skipped and no state is set. */
  skipStateFilter?: boolean;
};

export function useVenues(
  state: string | undefined,
  city?: string | null,
  options?: UseVenuesOptions
) {
  const enabled = options?.enabled ?? true;
  const skipStateFilter = options?.skipStateFilter ?? false;
  const [venues, setVenues] = useState<WeddingOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const fetchVenues = useCallback(async () => {
    if (!enabled) return;
    const effectiveState = state?.trim() || DEFAULT_STATE_FOR_FETCH;
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (skipStateFilter) {
        params.set('allStates', '1');
      } else {
        params.set('state', effectiveState);
        if (city?.trim()) params.set('city', city.trim());
      }
      const res = await fetch(`/api/venues?${params.toString()}`);
      const data = (await res.json().catch(() => ({}))) as VenuesResponse & { error?: string };

      let list: WeddingOption[] = Array.isArray(data.venues) ? data.venues : [];
      const keepEmpty = res.ok && data.fallback === false;
      if (list.length === 0 && !keepEmpty) {
        list = skipStateFilter
          ? getFallbackVenuesAllStatesRandomized()
          : getFallbackVenuesForLocation(effectiveState, city ?? null);
      }

      if (!res.ok) {
        setError(data.error ?? 'Could not load venues');
        setVenues(list);
        return;
      }
      setVenues(list);
    } catch {
      setError('Could not load venues');
      setVenues(
        skipStateFilter
          ? getFallbackVenuesAllStatesRandomized()
          : getFallbackVenuesForLocation(effectiveState, city ?? null)
      );
    } finally {
      setLoading(false);
    }
  }, [state, city, enabled, skipStateFilter]);

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
