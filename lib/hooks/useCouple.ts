'use client';

import { useCallback, useEffect, useState } from 'react';
import type { CoupleStorage, UserRole } from '@/lib/types';
import { loadCouple, saveCouplePartial } from '@/lib/storage';

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

  const updateLocation = useCallback((locationState: string, locationCity?: string) => {
    saveCouplePartial({ locationState, locationCity });
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
