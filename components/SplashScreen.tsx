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
          className={`fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#884E50] transition-opacity ease-out ${
            fadeOut ? 'pointer-events-none opacity-0' : 'opacity-100'
          }`}
          style={{ transitionDuration: `${FADE_MS}ms` }}
          onTransitionEnd={(e) => {
            if (e.propertyName === 'opacity' && fadeOut) setShow(false);
          }}
        >
          <Image
            src="/images/White%20and%20gold%20logo.png"
            alt=""
            width={120}
            height={120}
            className="h-[120px] w-[120px] shrink-0 object-contain"
            priority
          />
          <h1 className="mt-6 text-center font-[family-name:var(--font-playfair)] text-[36px] font-semibold leading-tight text-white">
            Vow & Choose
          </h1>
          <p className="mt-3 text-center font-[family-name:var(--font-playfair)] text-[18px] font-normal italic leading-snug text-white">
            Swipe on wedding dreams together
          </p>
        </div>
      ) : null}
    </>
  );
}
