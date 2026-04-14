'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useState } from 'react';
import { AppShell } from '@/components/AppShell';
import { OurPicksSections } from '@/components/our-picks/OurPicksSections';
import { OnboardingFlow } from '@/components/onboarding/OnboardingFlow';
import { useCouple } from '@/lib/hooks/useCouple';
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
      .then((res) => {
        console.log('[picks/page] Supabase couples select (location sync) full response', res);
        const { data } = res;
        if (data?.location_state) {
          const patch = {
            locationState: data.location_state,
            locationCity: data.location_city ?? undefined,
          };
          console.log('[picks/page] saveCouplePartial (location sync)', patch);
          saveCouplePartial(patch);
          refresh();
        }
      });
  }, [couple, refresh]);

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
      <div className="-mx-4 min-h-[100dvh] px-6 pb-32 pt-14">
        <h1
          className="mb-8 font-[family-name:var(--font-playfair)]"
          style={{
            fontSize: '32px',
            fontWeight: 600,
            lineHeight: '48px',
            color: '#2C2420',
          }}
        >
          Our Picks
        </h1>
        <OurPicksSections />
      </div>
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
