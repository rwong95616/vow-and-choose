'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';

const SPLASH_MS = 2000;
const FADE_MS = 500;

export function SplashScreen({ children }: { children: React.ReactNode }) {
  const [show, setShow] = useState(true);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    const t = window.setTimeout(() => setFadeOut(true), SPLASH_MS);
    return () => window.clearTimeout(t);
  }, []);

  return (
    <>
      {children}
      {show ? (
        <div
          role="presentation"
          className={`fixed inset-0 z-[100] bg-[#884E50] transition-opacity ease-out ${
            fadeOut ? 'pointer-events-none opacity-0' : 'opacity-100'
          }`}
          style={{ transitionDuration: `${FADE_MS}ms` }}
          onTransitionEnd={(e) => {
            if (e.propertyName === 'opacity' && fadeOut) setShow(false);
          }}
        >
          <div className="flex min-h-full w-full flex-col items-center justify-center">
            <Image
              src="/images/White%20and%20gold%20logo.png"
              alt=""
              width={83}
              height={65}
              className="h-[65px] w-[83px] shrink-0 object-contain"
              priority
            />
            <h1 className="mt-4 max-w-full py-0 pl-[54px] pr-[55px] text-center font-[family-name:var(--font-playfair)] text-[36px] font-semibold leading-tight text-white">
              Vow & Choose
            </h1>
            <p className="mt-[8px] max-w-full whitespace-nowrap py-0 text-center font-[family-name:var(--font-playfair)] text-[16px] font-normal italic leading-snug text-white">
              Swipe on wedding dreams together
            </p>
          </div>
        </div>
      ) : null}
    </>
  );
}
