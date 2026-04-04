'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { createBrowserClient } from '@/lib/supabase';
import type { UserRole } from '@/lib/types';

export type Decision = 'yes' | 'no';

export function useSwipes(
  coupleId: string | undefined,
  userRole: UserRole | undefined,
  category: string
) {
  const supabase = useMemo(() => createBrowserClient(), []);
  const [decisions, setDecisions] = useState<Record<string, Decision>>({});
  const [loading, setLoading] = useState(true);

  const fetchDecisions = useCallback(async () => {
    if (!coupleId || !userRole) {
      setDecisions({});
      setLoading(false);
      return;
    }
    setLoading(true);
    const { data, error } = await supabase
      .from('swipes')
      .select('item_id, decision')
      .eq('couple_id', coupleId)
      .eq('user_role', userRole)
      .eq('category', category);
    if (error) {
      setDecisions({});
    } else {
      const map: Record<string, Decision> = {};
      for (const row of data ?? []) {
        map[row.item_id] = row.decision as Decision;
      }
      setDecisions(map);
    }
    setLoading(false);
  }, [coupleId, userRole, category, supabase]);

  useEffect(() => {
    fetchDecisions();
  }, [fetchDecisions]);

  const persistSwipe = useCallback(
    async (itemId: string, decision: Decision) => {
      if (!coupleId || !userRole) return;
      void supabase.from('swipes').upsert(
        {
          couple_id: coupleId,
          user_role: userRole,
          category,
          item_id: itemId,
          decision,
        },
        { onConflict: 'couple_id,user_role,category,item_id' }
      );
    },
    [coupleId, userRole, category, supabase]
  );

  const applyLocalSwipe = useCallback((itemId: string, decision: Decision) => {
    setDecisions((prev) => ({ ...prev, [itemId]: decision }));
  }, []);

  const saveSwipe = useCallback(
    async (itemId: string, decision: Decision) => {
      await persistSwipe(itemId, decision);
      applyLocalSwipe(itemId, decision);
    },
    [persistSwipe, applyLocalSwipe]
  );

  const undo = useCallback(async () => {
    if (!coupleId || !userRole) return;
    const { data } = await supabase
      .from('swipes')
      .select('id')
      .eq('couple_id', coupleId)
      .eq('user_role', userRole)
      .eq('category', category)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();
    if (!data?.id) return;
    await supabase.from('swipes').delete().eq('id', data.id);
    const { data: rows } = await supabase
      .from('swipes')
      .select('item_id, decision')
      .eq('couple_id', coupleId)
      .eq('user_role', userRole)
      .eq('category', category);
    const map: Record<string, Decision> = {};
    for (const row of rows ?? []) {
      map[row.item_id] = row.decision as Decision;
    }
    setDecisions(map);
  }, [coupleId, userRole, category, supabase]);

  const resetCategory = useCallback(async () => {
    if (!coupleId || !userRole) return;
    await supabase
      .from('swipes')
      .delete()
      .eq('couple_id', coupleId)
      .eq('user_role', userRole)
      .eq('category', category);
    setDecisions({});
  }, [coupleId, userRole, category, supabase]);

  return {
    decisions,
    loading,
    saveSwipe,
    persistSwipe,
    applyLocalSwipe,
    undo,
    resetCategory,
    refetch: fetchDecisions,
  };
}
