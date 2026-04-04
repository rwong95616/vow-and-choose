'use client';

import { useMemo, useRef } from 'react';
import type { WeddingOption } from '@/lib/types';
import { SwipeCard, type SwipeCardHandle } from '@/components/SwipeCard';
import { VenueHeroImage } from '@/components/VenueHeroImage';
import {
  SWIPE_CAPTION_STRIP_CLASS,
  SWIPE_CARD_SHELL_CLASS,
  SWIPE_PHOTO_STRIP_CLASS,
} from '@/lib/swipeCardLayout';
import type { Decision } from '@/lib/hooks/useSwipes';

function IconX({ className }: { className?: string }) {
  return (
    <svg className={className} width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M18 6L6 18M6 6l12 12"
        stroke="currentColor"
        strokeWidth="2.25"
        strokeLinecap="round"
      />
    </svg>
  );
}

function IconHeartSolid({ className }: { className?: string }) {
  return (
    <svg className={className} width="24" height="24" viewBox="0 0 24 24" aria-hidden>
      <path
        fill="currentColor"
        d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.533 5.533 0 0112 5.292 5.533 5.533 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.18 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z"
      />
    </svg>
  );
}

type Props = {
  cards: WeddingOption[];
  decisions: Record<string, Decision>;
  onSwipeStart: (itemId: string, decision: Decision) => void;
  onSwipeComplete: (itemId: string, decision: Decision) => void;
  onResetCategory: () => void;
};

export function CardDeck({
  cards,
  decisions,
  onSwipeStart,
  onSwipeComplete,
  onResetCategory,
}: Props) {
  const cardRef = useRef<SwipeCardHandle>(null);

  const currentIndex = useMemo(() => {
    return cards.findIndex((c) => decisions[c.id] === undefined);
  }, [cards, decisions]);

  const current = currentIndex >= 0 ? cards[currentIndex] : undefined;
  const next = currentIndex >= 0 && currentIndex + 1 < cards.length ? cards[currentIndex + 1] : undefined;

  const total = cards.length;
  const swipedCount = useMemo(
    () => cards.filter((c) => decisions[c.id] !== undefined).length,
    [cards, decisions]
  );
  const lovedCount = useMemo(
    () => cards.filter((c) => decisions[c.id] === 'yes').length,
    [cards, decisions]
  );

  const handleSwipeStart = (dir: 'yes' | 'no') => {
    if (!current) return;
    onSwipeStart(current.id, dir === 'yes' ? 'yes' : 'no');
  };

  const handleSwipeComplete = (dir: 'yes' | 'no') => {
    if (!current) return;
    onSwipeComplete(current.id, dir === 'yes' ? 'yes' : 'no');
  };

  const allDone = total > 0 && swipedCount === total;

  if (total === 0) {
    return (
      <div className="flex min-h-0 flex-1 items-center justify-center overflow-hidden px-2">
        <div className="w-full max-w-[327px] rounded-[20px] bg-white p-8 text-center shadow-[0px_4px_16px_0px_rgba(44,36,32,0.12)]">
          <p className="font-display text-[22px] font-semibold leading-[28.6px] text-[#2c2420]">
            No cards in this category yet.
          </p>
        </div>
      </div>
    );
  }

  if (allDone) {
    return (
      <div className="flex min-h-0 flex-1 flex-col items-center justify-center gap-4 overflow-hidden px-2 text-center">
        <p className="font-display text-[22px] font-semibold leading-[28.6px] text-[#2c2420]">
          All done in this category! ✨
        </p>
        <p className="font-sans text-[13px] leading-[19.5px] text-[#6b5f58]" style={{ fontVariationSettings: "'opsz' 9" }}>
          You loved <span className="font-semibold text-[#2c2420]">{lovedCount}</span> of {total}.
        </p>
        <button
          type="button"
          onClick={onResetCategory}
          className="rounded-full bg-[#884e50] px-8 py-3.5 text-sm font-semibold text-white shadow-[0px_4px_16px_0px_rgba(44,36,32,0.12)]"
        >
          Swipe again
        </button>
      </div>
    );
  }

  return (
    <div className="flex min-h-0 w-full min-w-0 flex-1 flex-col gap-4 overflow-hidden">
      <div className="relative mx-auto flex min-h-0 w-full max-w-[327px] flex-1 flex-col overflow-hidden">
        {next && (
          <div
            className="pointer-events-none absolute inset-0 z-0 flex min-h-0 justify-center overflow-hidden opacity-[0.88]"
            aria-hidden
          >
            <div className="h-full min-h-0 w-full max-w-[327px] origin-bottom scale-[0.94] translate-y-2">
              <div className={`${SWIPE_CARD_SHELL_CLASS} h-full`}>
                <div className={SWIPE_PHOTO_STRIP_CLASS}>
                  <VenueHeroImage option={next} emojiSizeClass="text-[72px]" />
                </div>
                <div className={SWIPE_CAPTION_STRIP_CLASS} aria-hidden />
              </div>
            </div>
          </div>
        )}
        <div className="relative z-[2] flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden">
          {current && (
            <SwipeCard
              key={current.id}
              ref={cardRef}
              option={current}
              onSwipeStart={handleSwipeStart}
              onSwipeComplete={handleSwipeComplete}
            />
          )}
        </div>
      </div>

      <div className="flex min-w-0 shrink-0 flex-col gap-2">
        <div className="flex h-16 shrink-0 items-center justify-center gap-6 px-2">
          <button
            type="button"
            aria-label="Dismiss"
            onClick={() => cardRef.current?.swipe('no')}
            className="flex size-16 shrink-0 items-center justify-center rounded-full bg-white text-[#2c2420] shadow-[0px_4px_16px_0px_rgba(44,36,32,0.12)] transition-transform active:scale-95 disabled:opacity-50"
          >
            <IconX className="size-8" />
          </button>
          <button
            type="button"
            aria-label="Like"
            onClick={() => cardRef.current?.swipe('yes')}
            className="flex size-16 shrink-0 items-center justify-center rounded-full bg-[#e8a0a0] text-white shadow-[0px_4px_16px_0px_rgba(232,160,160,0.3)] transition-transform active:scale-95 disabled:opacity-50"
          >
            <IconHeartSolid className="size-7 text-white" />
          </button>
        </div>

        <div className="flex shrink-0 justify-center px-2 pb-1">
          <div className="flex flex-wrap items-start justify-center gap-1.5">
            {cards.map((c, i) => (
              <span
                key={c.id}
                className={`rounded-full transition-all duration-300 ${
                  i === currentIndex ? 'h-1.5 w-6 bg-[#884e50]' : 'size-1.5 bg-[#d4cec8]'
                }`}
                title={`Card ${i + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
