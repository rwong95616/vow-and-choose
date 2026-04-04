'use client';

import { Suspense, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ChevronRight, Copy } from 'lucide-react';
import { AppShell } from '@/components/AppShell';
import { OnboardingFlow } from '@/components/onboarding/OnboardingFlow';
import { useCouple } from '@/lib/hooks/useCouple';
import { isOnboardingComplete } from '@/lib/storage';

const COUPLE_CODE = 'ROSE42';

/** Chevron-down for custom-styled `<select>` (native UI hidden via appearance-none). */
const SELECT_DROPDOWN_ARROW =
  'url("data:image/svg+xml,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 width=%2720%27 height=%2720%27 viewBox=%270 0 24 24%27 fill=%27none%27 stroke=%27%236B5F58%27 stroke-width=%272%27 stroke-linecap=%27round%27 stroke-linejoin=%27round%27%3E%3Cpath d=%27m6 9 6 6 6-6%27/%3E%3C/svg%3E")';

const US_STATE_OPTIONS = [
  'California',
  'New York',
  'Texas',
  'Florida',
  'Illinois',
  'Arizona',
  'Washington',
  'Colorado',
  'Pennsylvania',
  'Ohio',
  'Georgia',
  'North Carolina',
] as const;

const SETTINGS_CARD_CLASS =
  'box-border flex w-full flex-col gap-3 rounded-[20px] border-0 bg-white p-[20px] shadow-[0_2px_8px_0_rgba(44,36,32,0.08)]';

function SettingsContent() {
  const [copied, setCopied] = useState(false);
  const [editingLocation, setEditingLocation] = useState(false);
  const [state, setState] = useState('California');
  const [city, setCity] = useState('San Francisco');

  const locationFieldClass =
    'w-full rounded-[12px] border border-[#D3D1C7] py-[14px] px-[16px] text-[#2C2420] outline-none';

  return (
    <div className="w-full min-h-screen bg-[#FAF7F2] pt-[60px] px-[16px] pb-[8px]">
      <div className="flex flex-col w-full gap-[16px]">
        <h1
          className="font-[family-name:var(--font-playfair)] text-[40px] font-semibold text-[#2C2420]"
          style={{ lineHeight: 1.2 }}
        >
          Settings
        </h1>

        <div className={SETTINGS_CARD_CLASS}>
          <p className="text-xs font-semibold tracking-widest text-[#C4A96B]">YOUR COUPLE CODE</p>
          <div className="flex items-center justify-between gap-4">
            <span className="font-[family-name:var(--font-playfair)] text-[32px] font-bold text-[#2C2420]">
              {COUPLE_CODE}
            </span>
            <button
              type="button"
              className="flex items-center gap-2 rounded-full bg-[#884E50] px-4 py-2 text-white"
              style={{ fontFamily: 'var(--font-dm-sans)' }}
              onClick={() => {
                navigator.clipboard.writeText('ROSE42');
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
              }}
            >
              <Copy size={16} aria-hidden />
              <span className="text-sm font-medium">{copied ? 'Copied!' : 'Copy'}</span>
            </button>
          </div>
          <p className="text-sm text-[#6B5F58]" style={{ fontFamily: 'var(--font-dm-sans)' }}>
            Share this code with your partner so they can join and see your picks together.
          </p>
        </div>

        <div className={SETTINGS_CARD_CLASS}>
          {!editingLocation ? (
            <>
              <div className="flex items-center justify-between">
                <p className="text-xs font-semibold tracking-widest text-[#C4A96B]">WEDDING LOCATION</p>
                <button
                  type="button"
                  className="text-sm font-medium text-[#884E50]"
                  style={{ fontFamily: 'var(--font-dm-sans)' }}
                  onClick={() => setEditingLocation(true)}
                >
                  Change
                </button>
              </div>
              <div className="flex items-center justify-between gap-4">
                <div className="min-w-0">
                  <p className="text-lg font-bold text-[#2C2420]" style={{ fontFamily: 'var(--font-dm-sans)' }}>
                    {state}
                  </p>
                  <p className="text-sm text-[#6B5F58]" style={{ fontFamily: 'var(--font-dm-sans)' }}>
                    {city}
                  </p>
                </div>
                <ChevronRight size={20} className="shrink-0 text-[#6B5F58]" aria-hidden />
              </div>
            </>
          ) : (
            <>
              <p className="text-xs font-semibold tracking-widest text-[#C4A96B]">WEDDING LOCATION</p>
              <select
                value={state}
                onChange={(e) => setState(e.target.value)}
                aria-label="State"
                className={`${locationFieldClass} appearance-none bg-white pr-[44px]`}
                style={{
                  fontFamily: 'var(--font-dm-sans)',
                  backgroundImage: SELECT_DROPDOWN_ARROW,
                  backgroundRepeat: 'no-repeat',
                  backgroundPosition: 'right 16px center',
                  backgroundSize: '20px 20px',
                }}
              >
                {US_STATE_OPTIONS.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="City"
                className={locationFieldClass}
                style={{ fontFamily: 'var(--font-dm-sans)' }}
              />
              <button
                type="button"
                className="w-full rounded-full bg-[#884E50] py-4 font-medium text-white"
                style={{ fontFamily: 'var(--font-dm-sans)' }}
                onClick={() => setEditingLocation(false)}
              >
                Save location
              </button>
            </>
          )}
        </div>

        <div className={SETTINGS_CARD_CLASS}>
          <p className="text-xs font-semibold tracking-widest text-[#C4A96B]">ABOUT</p>
          <p className="text-base text-[#6B5F58]" style={{ fontFamily: 'var(--font-dm-sans)' }}>
            Vow & Choose helps couples plan their dream wedding together. Swipe through venues, vendors,
            and ideas to find what you both love.
          </p>
          <p className="text-sm text-[#C4A96B]" style={{ fontFamily: 'var(--font-dm-sans)' }}>
            Version 1.0.0
          </p>
        </div>
      </div>
    </div>
  );
}

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
      <SettingsContent />
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
