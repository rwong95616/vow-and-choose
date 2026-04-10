'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';
import { StepConnect } from '@/components/onboarding/StepConnect';
import { StepLocation } from '@/components/onboarding/StepLocation';
import { StepRole } from '@/components/onboarding/StepRole';
import { isOnboardingComplete, loadCouple, saveCouplePartial } from '@/lib/storage';

type Props = {
  /** 1 = connect, 2 = role, 3 = location (creator) */
  initialStep?: 1 | 2 | 3;
  joinCodePrefill?: string;
  onComplete: () => void;
};

export function OnboardingFlow({ initialStep = 1, joinCodePrefill, onComplete }: Props) {
  const [step, setStep] = useState<1 | 2 | 3>(initialStep);
  const [coupleId, setCoupleId] = useState<string | null>(null);
  /** Hides Vow header for the “Your couple code” screen (design ref) */
  const [connectLayout, setConnectLayout] = useState<'connect' | 'couple-code'>('connect');

  useEffect(() => {
    const c = loadCouple();
    if (c?.coupleId) setCoupleId(c.coupleId);
  }, [step]);

  useEffect(() => {
    if (step !== 1) setConnectLayout('connect');
  }, [step]);

  const afterConnect = (payload: {
    coupleId: string;
    coupleCode: string;
    isCreator: boolean;
    locationState?: string | null;
    locationCity?: string | null;
  }) => {
    setCoupleId(payload.coupleId);
    if (payload.locationState) {
      saveCouplePartial({
        locationState: payload.locationState ?? undefined,
        locationCity: payload.locationCity ?? undefined,
      });
    }
    setStep(2);
  };

  const afterRole = () => {
    const c = loadCouple();
    if (c?.isCreator) {
      setStep(3);
    } else {
      onComplete();
    }
  };

  const afterLocation = () => {
    onComplete();
  };

  const c = loadCouple();
  const resolvedCoupleId = coupleId ?? c?.coupleId;
  const showLocation = step === 3 && c?.isCreator && !!resolvedCoupleId;

  const showCoupleCodeOnly = step === 1 && connectLayout === 'couple-code';
  const showRoleScreen = step === 2;

  return (
    <div
      className={`mx-auto flex min-h-[100dvh] max-w-[480px] flex-col px-6 pb-28 ${
        showCoupleCodeOnly || showRoleScreen || showLocation ? 'justify-center pt-8' : 'pt-6'
      } ${showLocation ? 'bg-location-canvas' : showRoleScreen ? 'bg-role-canvas' : 'bg-page'}`}
    >
      <div
        className={`flex flex-1 flex-col ${step === 1 || step === 2 || showLocation ? 'justify-center' : ''}`}
      >
        {!showCoupleCodeOnly && !showRoleScreen && !showLocation && (
          <header className="mb-8 text-center">
            <Image
              src="/images/Gold%20logo.png"
              alt=""
              width={83}
              height={65}
              className="mx-auto mb-4 h-[65px] w-[83px] object-contain"
              priority
            />
            <h1 className="font-display text-[32px] font-semibold leading-[1.15] tracking-[-0.02em] text-ink">
              Vow & Choose
            </h1>
            <p className="mx-auto mt-3 max-w-[20rem] font-display text-body-md italic leading-relaxed text-muted">
              Swipe on wedding dreams together
            </p>
          </header>
        )}

        {step === 1 && (
          <StepConnect
            joinCodePrefill={joinCodePrefill}
            onConnectLayoutChange={setConnectLayout}
            onCreatedOrJoined={afterConnect}
          />
        )}
        {step === 2 && <StepRole onPick={afterRole} />}
        {showLocation && resolvedCoupleId && (
          <StepLocation
            coupleId={resolvedCoupleId}
            onDone={afterLocation}
            onSkip={() => {
              console.log(
                '[Skip location] isOnboardingComplete() before saveCouplePartial({ locationSkipped: true }):',
                isOnboardingComplete()
              );
              saveCouplePartial({ locationSkipped: true });
              console.log(
                '[Skip location] isOnboardingComplete() after saveCouplePartial({ locationSkipped: true }):',
                isOnboardingComplete()
              );
              onComplete();
            }}
          />
        )}
      </div>
    </div>
  );
}
