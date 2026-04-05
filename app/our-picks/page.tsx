'use client';

import { AppShell } from '@/components/AppShell';
import { OurPicksSections } from '@/components/our-picks/OurPicksSections';

export default function OurPicksPage() {
  return (
    <AppShell>
      <div className="flex flex-col items-start gap-[24px] px-[24px] pb-[8px] pt-[60px]">
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
