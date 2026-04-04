'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { AppShell } from '@/components/AppShell';
import { CardDeck } from '@/components/CardDeck';
import { CategoryTabs } from '@/components/CategoryTabs';
import { OnboardingFlow } from '@/components/onboarding/OnboardingFlow';
import { staticOptionsByCategory, type CategoryId } from '@/data/options';
import { useCouple } from '@/lib/hooks/useCouple';
import { useSwipes } from '@/lib/hooks/useSwipes';
import { useVenues } from '@/lib/hooks/useVenues';
import { isOnboardingComplete } from '@/lib/storage';
import { saveCouplePartial } from '@/lib/storage';
import { createBrowserClient } from '@/lib/supabase';

export function HomeClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const forceOnboarding = searchParams.get('onboarding') === '1';

  const { couple, ready, refresh } = useCouple();
  const [category, setCategory] = useState<CategoryId>('venue');
  const [onboardingDone, setOnboardingDone] = useState(false);

  useEffect(() => {
    if (ready) setOnboardingDone(isOnboardingComplete());
  }, [ready, couple]);

  useEffect(() => {
    if (!couple?.coupleId || couple.locationState || couple.isCreator !== false) return;
    const supabase = createBrowserClient();
    void supabase
      .from('couples')
      .select('location_state, location_city')
      .eq('id', couple.coupleId)
      .maybeSingle()
      .then(({ data }) => {
        if (data?.location_state) {
          saveCouplePartial({
            locationState: data.location_state,
            locationCity: data.location_city ?? undefined,
          });
          refresh();
        }
      });
  }, [couple, refresh]);

  const state = couple?.locationState;
  const city = couple?.locationCity;

  const { venues, loading: venuesLoading } = useVenues(state, city);

  const userRole = couple?.userRole ?? 'bride';
  const { decisions, persistSwipe, applyLocalSwipe, resetCategory } = useSwipes(
    couple?.coupleId,
    userRole,
    category
  );

  const cards = useMemo(() => {
    if (category === 'venue') return venues;
    return staticOptionsByCategory[category];
  }, [category, venues]);

  if (!ready) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-swipe-canvas font-sans text-[13px] text-[#6b5f58]">
        Loading…
      </div>
    );
  }

  const showOnboarding = !onboardingDone || forceOnboarding;

  if (showOnboarding) {
    return (
      <OnboardingFlow
        onComplete={() => {
          setOnboardingDone(true);
          refresh();
          if (forceOnboarding) {
            router.replace('/');
          }
        }}
      />
    );
  }

  const deckLoading = category === 'venue' ? venuesLoading : false;

  return (
    <AppShell variant="swipe">
      <div className="flex h-full min-h-0 flex-1 flex-col gap-5 pt-[60px]">
        <div className="shrink-0 overflow-visible">
          <CategoryTabs active={category} onChange={setCategory} />
        </div>

        <div className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden pt-1">
          {deckLoading ? (
            <div className="flex flex-1 items-center justify-center px-8 py-8 text-center font-sans text-[13px] leading-[19.5px] text-[#6b5f58]">
              Finding venues near you…
            </div>
          ) : (
            <CardDeck
              cards={cards}
              decisions={decisions}
              onSwipeStart={(itemId, decision) => {
                void persistSwipe(itemId, decision);
              }}
              onSwipeComplete={(itemId, decision) => {
                applyLocalSwipe(itemId, decision);
              }}
              onResetCategory={resetCategory}
            />
          )}
        </div>
      </div>
    </AppShell>
  );
}
