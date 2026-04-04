'use client';

import { Suspense, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { AppShell } from '@/components/AppShell';
import { OnboardingFlow } from '@/components/onboarding/OnboardingFlow';
import { useCouple } from '@/lib/hooks/useCouple';
import { isOnboardingComplete } from '@/lib/storage';

function SettingsInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const forceOnboarding = searchParams.get('onboarding') === '1';

  const { couple, ready, refresh } = useCouple();
  const [onboardingDone, setOnboardingDone] = useState(false);

  useEffect(() => {
    if (ready) setOnboardingDone(isOnboardingComplete());
  }, [ready, couple]);

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
            router.replace('/settings');
          }
        }}
      />
    );
  }

  return (
    <AppShell>
      <h1 className="font-display text-2xl text-ink">Settings</h1>
      <p className="mt-2 text-sm text-[#6B5F58]">More options coming soon.</p>
    </AppShell>
  );
}

export default function SettingsPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-page text-muted">
          Loading…
        </div>
      }
    >
      <SettingsInner />
    </Suspense>
  );
}
