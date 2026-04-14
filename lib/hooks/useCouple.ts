'use client';

import { useCallback, useEffect, useState } from 'react';
import type { CoupleStorage, UserRole } from '@/lib/types';
import { loadCouple, saveCouplePartial } from '@/lib/storage';
import { createBrowserClient } from '@/lib/supabase';

export function useCouple() {
  const [couple, setCouple] = useState<CoupleStorage | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setCouple(loadCouple());
    setReady(true);
  }, []);

  const updateRole = useCallback((userRole: UserRole) => {
    saveCouplePartial({ userRole });
    setCouple(loadCouple());
  }, []);

  const updateLocation = useCallback(async (locationState: string, locationCity?: string) => {
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
      if (supabaseRes.error) {
        setCouple(loadCouple());
        return;
      }
    }
    saveCouplePartial({ locationSkipped: false });
    setCouple(loadCouple());
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
