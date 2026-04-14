'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { OnboardingFlow } from '@/components/onboarding/OnboardingFlow';
import { isExistingCoupleCreator, saveCouplePartial } from '@/lib/storage';
import { createBrowserClient } from '@/lib/supabase';

export default function JoinPage({ params }: { params: { code: string } }) {
  const router = useRouter();
  const code = params.code?.toUpperCase() ?? '';
  const [status, setStatus] = useState<'loading' | 'ok' | 'error'>('loading');

  useEffect(() => {
    let cancelled = false;
    async function run() {
      const supabase = createBrowserClient();
      const { data, error } = await supabase
        .from('couples')
        .select('id, code, location_state, location_city')
        .ilike('code', code)
        .maybeSingle();
      if (cancelled) return;
      if (error || !data) {
        setStatus('error');
        return;
      }
      const joinSavePatch = {
        coupleId: data.id,
        coupleCode: data.code,
        isCreator: isExistingCoupleCreator(data.id),
        locationState: data.location_state ?? undefined,
        locationCity: data.location_city ?? undefined,
      };
      saveCouplePartial(joinSavePatch);
      setStatus('ok');
    }
    void run();
    return () => {
      cancelled = true;
    };
  }, [code]);

  if (status === 'loading') {
    return (
      <div className="flex min-h-screen items-center justify-center bg-page text-muted">
        Joining…
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className="mx-auto flex min-h-screen max-w-[480px] flex-col items-center justify-center gap-4 px-6 text-center">
        <p className="font-display text-2xl text-ink">Code not found</p>
        <p className="text-muted">Double check with your partner — or ask them to resend the link.</p>
        <button
          type="button"
          onClick={() => router.push('/')}
          className="rounded-full bg-ink px-6 py-3 text-sm font-semibold text-white"
        >
          Back home
        </button>
      </div>
    );
  }

  return (
    <OnboardingFlow
      initialStep={2}
      onComplete={() => {
        router.push('/');
        router.refresh();
      }}
    />
  );
}
