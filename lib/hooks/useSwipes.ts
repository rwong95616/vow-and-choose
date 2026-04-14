'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { createBrowserClient } from '@/lib/supabase';
import { getOrCreateSwipeUserId } from '@/lib/swipeUserId';
import type { UserRole } from '@/lib/types';

export type Decision = 'yes' | 'no';

export function useSwipes(
  coupleId: string | undefined,
  userRole: UserRole | undefined,
  category: string,
  /** When false (joiner), swipe id is not shared with creator on the same device. */
  isCreator?: boolean
) {
  const supabase = useMemo(() => createBrowserClient(), []);
  const [decisions, setDecisions] = useState<Record<string, Decision>>({});
  const [loading, setLoading] = useState(true);

  const fetchDecisions = useCallback(async () => {
    const swipeUserId = getOrCreateSwipeUserId(coupleId, isCreator);
    if (!coupleId || !userRole || !swipeUserId) {
      setDecisions({});
      setLoading(false);
      return;
    }
    setLoading(true);
    const { data, error } = await supabase
      .from('swipes')
      .select('item_id, decision')
      .eq('couple_id', coupleId)
      .eq('swipe_user_id', swipeUserId)
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
  }, [coupleId, userRole, category, isCreator, supabase]);

  useEffect(() => {
    fetchDecisions();
  }, [fetchDecisions]);

  const persistSwipe = useCallback(
    async (itemId: string, decision: Decision) => {
      const swipeUserId = getOrCreateSwipeUserId(coupleId, isCreator);
      if (!coupleId || !userRole || !swipeUserId) return;
      console.log('[useSwipes] persistSwipe isCreator:', isCreator);
      const { error } = await supabase.from('swipes').upsert(
        {
          couple_id: coupleId,
          swipe_user_id: swipeUserId,
          user_role: userRole,
          category,
          item_id: itemId,
          decision,
          is_creator: isCreator === true,
        },
        { onConflict: 'couple_id,swipe_user_id,category,item_id' }
      );
      if (error) {
        console.error('persistSwipe error:', error);
        throw error;
      }
    },
    [coupleId, userRole, category, isCreator, supabase]
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
    const swipeUserId = getOrCreateSwipeUserId(coupleId, isCreator);
    if (!coupleId || !userRole || !swipeUserId) return;
    const { data } = await supabase
      .from('swipes')
      .select('id')
      .eq('couple_id', coupleId)
      .eq('swipe_user_id', swipeUserId)
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
      .eq('swipe_user_id', swipeUserId)
      .eq('category', category);
    const map: Record<string, Decision> = {};
    for (const row of rows ?? []) {
      map[row.item_id] = row.decision as Decision;
    }
    setDecisions(map);
  }, [coupleId, userRole, category, isCreator, supabase]);

  const resetCategory = useCallback(async () => {
    const swipeUserId = getOrCreateSwipeUserId(coupleId, isCreator);
    if (!coupleId || !userRole || !swipeUserId) return;
    await supabase
      .from('swipes')
      .delete()
      .eq('couple_id', coupleId)
      .eq('swipe_user_id', swipeUserId)
      .eq('category', category);
    setDecisions({});
  }, [coupleId, userRole, category, isCreator, supabase]);

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
