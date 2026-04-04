import { Suspense } from 'react';
import { HomeClient } from '@/components/HomeClient';

export default function Home() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-swipe-canvas font-sans text-[13px] text-[#6b5f58]">
          Loading…
        </div>
      }
    >
      <HomeClient />
    </Suspense>
  );
}
