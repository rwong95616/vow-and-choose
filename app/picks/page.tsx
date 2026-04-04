'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useMemo, useState } from 'react';
import { AppShell } from '@/components/AppShell';
import { MatchesList } from '@/components/MatchesList';
import { OnboardingFlow } from '@/components/onboarding/OnboardingFlow';
import { useCouple } from '@/lib/hooks/useCouple';
import { usePicks } from '@/lib/hooks/usePicks';
import { useVenues } from '@/lib/hooks/useVenues';
import { isOnboardingComplete } from '@/lib/storage';
import { saveCouplePartial } from '@/lib/storage';
import { createBrowserClient } from '@/lib/supabase';

function PicksPageInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const forceOnboarding = searchParams.get('onboarding') === '1';

  const { couple, ready, refresh } = useCouple();
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

  const { swipes, loading } = usePicks(couple?.coupleId);
  const { venues } = useVenues(couple?.locationState, couple?.locationCity);

  const venueOptions = useMemo(() => venues, [venues]);

  if (!ready) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-page text-muted">
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
            router.replace('/picks');
          }
        }}
      />
    );
  }

  return (
    <AppShell>
      <h1 className="mb-2 font-display text-2xl text-ink">Our Picks</h1>
      <p className="mb-6 text-sm text-muted">Everything you both said yes to — updated live.</p>
      {loading ? (
        <p className="py-12 text-center text-muted">Loading picks…</p>
      ) : (
        <MatchesList swipes={swipes} venueOptions={venueOptions} />
      )}
    </AppShell>
  );
}

export default function PicksPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-page text-muted">
          Loading…
        </div>
      }
    >
      <PicksPageInner />
    </Suspense>
  );
}
