'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { createBrowserClient } from '@/lib/supabase';

export type SwipeRow = {
  id: string;
  couple_id: string;
  user_role: 'bride' | 'groom';
  swipe_user_id: string | null;
  category: string;
  item_id: string;
  decision: 'yes' | 'no';
  created_at?: string | null;
};

export function usePicks(coupleId: string | undefined) {
  const supabase = useMemo(() => createBrowserClient(), []);
  const [swipes, setSwipes] = useState<SwipeRow[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchAll = useCallback(async () => {
    if (!coupleId) {
      setSwipes([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    const { data, error } = await supabase
      .from('swipes')
      .select('id, couple_id, user_role, swipe_user_id, category, item_id, decision, created_at')
      .eq('couple_id', coupleId);
    if (error) setSwipes([]);
    else setSwipes((data ?? []) as SwipeRow[]);
    setLoading(false);
  }, [coupleId, supabase]);

  useEffect(() => {
    void fetchAll();
  }, [fetchAll]);

  useEffect(() => {
    if (!coupleId) return;
    const channel = supabase
      .channel(`picks-${coupleId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'swipes',
          filter: `couple_id=eq.${coupleId}`,
        },
        () => {
          void fetchAll();
        }
      )
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, [coupleId, supabase, fetchAll]);

  return { swipes, loading, refetch: fetchAll };
}
