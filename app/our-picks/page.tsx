'use client';

import { useEffect } from 'react';
import { AppShell } from '@/components/AppShell';
import {
  OUR_PICKS_IMAGE_URLS,
  OurPicksSections,
} from '@/components/our-picks/OurPicksSections';

export default function OurPicksPage() {
  useEffect(() => {
    console.log('[Our Picks] imageUrl values:', OUR_PICKS_IMAGE_URLS);
  }, []);

  return (
    <AppShell>
      <div className="flex flex-col items-start gap-[24px] bg-[#F0EDE4] px-[24px] pb-[8px] pt-[60px]">
        <h1
          className="font-[family-name:var(--font-playfair)] text-[#2C2420]"
          style={{
            fontSize: '32px',
            fontWeight: 600,
            lineHeight: '48px',
          }}
        >
          Our Picks
        </h1>
        <OurPicksSections />
      </div>
    </AppShell>
  );
}
