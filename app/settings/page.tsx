'use client';

import { Suspense, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ChevronDown, ChevronRight, ChevronUp, Copy } from 'lucide-react';
import { AppShell } from '@/components/AppShell';
import { OnboardingFlow } from '@/components/onboarding/OnboardingFlow';
import { useCouple } from '@/lib/hooks/useCouple';
import { isOnboardingComplete } from '@/lib/storage';

const COUPLE_CODE = 'ROSE42';

const ALL_STATES = [
  'Alabama',
  'Alaska',
  'Arizona',
  'Arkansas',
  'California',
  'Colorado',
  'Connecticut',
  'Delaware',
  'Florida',
  'Georgia',
  'Hawaii',
  'Idaho',
  'Illinois',
  'Indiana',
  'Iowa',
  'Kansas',
  'Kentucky',
  'Louisiana',
  'Maine',
  'Maryland',
  'Massachusetts',
  'Michigan',
  'Minnesota',
  'Mississippi',
  'Missouri',
  'Montana',
  'Nebraska',
  'Nevada',
  'New Hampshire',
  'New Jersey',
  'New Mexico',
  'New York',
  'North Carolina',
  'North Dakota',
  'Ohio',
  'Oklahoma',
  'Oregon',
  'Pennsylvania',
  'Rhode Island',
  'South Carolina',
  'South Dakota',
  'Tennessee',
  'Texas',
  'Utah',
  'Vermont',
  'Virginia',
  'Washington',
  'West Virginia',
  'Wisconsin',
  'Wyoming',
];

const SETTINGS_CARD_CLASS =
  'box-border flex w-full flex-col gap-3 rounded-[20px] border-0 bg-white p-[20px] shadow-[0_2px_8px_0_rgba(44,36,32,0.08)]';

function SettingsContent() {
  const [copied, setCopied] = useState(false);
  const [editingLocation, setEditingLocation] = useState(false);
  const [state, setState] = useState('California');
  const [city, setCity] = useState('San Francisco');
  const [stateDropdownOpen, setStateDropdownOpen] = useState(false);

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
              <div className="w-full">
                <button
                  type="button"
                  aria-expanded={stateDropdownOpen}
                  aria-haspopup="listbox"
                  className={`flex w-full items-center justify-between rounded-[12px] border py-[14px] pl-4 pr-4 text-base text-[#2C2420] ${
                    stateDropdownOpen ? 'border-[#C4A96B]' : 'border-[#D3D1C7]'
                  }`}
                  style={{ fontFamily: 'var(--font-dm-sans)' }}
                  onClick={() => setStateDropdownOpen((open) => !open)}
                >
                  <span>{state}</span>
                  {stateDropdownOpen ? (
                    <ChevronUp size={20} className="shrink-0 text-[#6B5F58]" aria-hidden />
                  ) : (
                    <ChevronDown size={20} className="shrink-0 text-[#6B5F58]" aria-hidden />
                  )}
                </button>
                {stateDropdownOpen ? (
                  <div
                    className="mt-1 max-h-[240px] overflow-y-auto rounded-[14px] border-[0.5px] border-solid border-[#D4CEC8] bg-white shadow-[0_8px_24px_0_rgba(44,36,32,0.12)]"
                    role="listbox"
                  >
                    {ALL_STATES.map((s) => (
                      <div
                        key={s}
                        role="option"
                        aria-selected={state === s}
                        onClick={() => {
                          setState(s);
                          setStateDropdownOpen(false);
                        }}
                        className={`w-full cursor-pointer px-4 py-[14px] text-left text-base text-[#2C2420] ${
                          s === state ? 'bg-[#FAF7F2]' : 'bg-white hover:bg-[#FAF7F2]'
                        }`}
                        style={{ fontFamily: 'var(--font-dm-sans)' }}
                      >
                        {s}
                      </div>
                    ))}
                  </div>
                ) : null}
              </div>
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
                onClick={() => {
                  setEditingLocation(false);
                  setStateDropdownOpen(false);
                }}
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
