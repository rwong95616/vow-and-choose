'use client';

import { useCallback, useEffect, useState } from 'react';
import type { CoupleStorage, UserRole } from '@/lib/types';
import { loadCouple, saveCouplePartial } from '@/lib/storage';
import { createBrowserClient } from '@/lib/supabase';

export function useCouple() {
  const [couple, setCouple] = useState<CoupleStorage | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const fromStorage = loadCouple();
    console.log(
      '[useCouple] initial hydrate from localStorage only (no Supabase fetch in this hook)',
      fromStorage
    );
    setCouple(fromStorage);
    setReady(true);
  }, []);

  const updateRole = useCallback((userRole: UserRole) => {
    const patch = { userRole };
    console.log('[useCouple] updateRole saveCouplePartial', patch);
    saveCouplePartial(patch);
    setCouple(loadCouple());
  }, []);

  const updateLocation = useCallback(async (locationState: string, locationCity?: string) => {
    const patchLocation = { locationState, locationCity };
    console.log('[useCouple] updateLocation saveCouplePartial (1)', patchLocation);
    saveCouplePartial({ locationState, locationCity });
    const { coupleId } = loadCouple() ?? {};
    if (coupleId) {
      const supabase = createBrowserClient();
      const supabaseRes = await supabase
        .from('couples')
        .update({
          location_state: locationState,
          location_city: locationCity,
        })
        .eq('id', coupleId);
      console.log('[useCouple] updateLocation Supabase couples update response', supabaseRes);
      if (supabaseRes.error) {
        setCouple(loadCouple());
        console.log('[useCouple] updateLocation after error, loadCouple()', loadCouple());
        return;
      }
    }
    const patchSkipped = { locationSkipped: false };
    console.log('[useCouple] updateLocation saveCouplePartial (2)', patchSkipped);
    saveCouplePartial({ locationSkipped: false });
    const after = loadCouple();
    console.log('[useCouple] updateLocation loadCouple() after save', after);
    setCouple(after);
  }, []);

  const refresh = useCallback(() => {
    setCouple(loadCouple());
  }, []);

  return {
    couple,
    ready,
    updateRole,
    updateLocation,
    refresh,
  };
}
