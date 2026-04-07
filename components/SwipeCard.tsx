'use client';

import { animate, motion, useMotionValue, useTransform } from 'framer-motion';
import { useEffect, useImperativeHandle, forwardRef } from 'react';
import { VenueHeroImage, isVenueHeroOption } from '@/components/VenueHeroImage';
import {
  SWIPE_CARD_SHELL_CLASS,
  SWIPE_CAPTION_STRIP_CLASS,
  SWIPE_PHOTO_STRIP_CLASS,
} from '@/lib/swipeCardLayout';
import { COLOR_THEME_SWATCHES } from '@/lib/colorThemeSwatches';
import type { WeddingOption } from '@/lib/types';

function IconPin({ className }: { className?: string }) {
  return (
    <svg className={className} width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M12 21s7-4.35 7-11a7 7 0 10-14 0c0 6.65 7 11 7 11z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="12" cy="10" r="2" fill="currentColor" />
    </svg>
  );
}

export type SwipeCardHandle = {
  swipe: (dir: 'yes' | 'no') => void;
};

type Props = {
  option: WeddingOption;
  onSwipeStart?: (dir: 'yes' | 'no') => void;
  onSwipeComplete: (dir: 'yes' | 'no') => void;
  dragEnabled?: boolean;
};

export const SwipeCard = forwardRef<SwipeCardHandle, Props>(function SwipeCard(
  { option, onSwipeStart, onSwipeComplete, dragEnabled = true },
  ref
) {
  const x = useMotionValue(0);
  const loveOpacity = useTransform(x, [0, 100], [0, 1], { clamp: true });
  const passOpacity = useTransform(x, [-100, 0], [1, 0], { clamp: true });
  const rotate = useTransform(x, [-400, 400], [-14, 14]);

  useEffect(() => {
    x.set(0);
  }, [option.id, x]);

  const commit = async (dir: 'yes' | 'no') => {
    onSwipeStart?.(dir);
    const sign = dir === 'yes' ? 1 : -1;
    await animate(x, sign * 600, { duration: 0.35, ease: [0.22, 1, 0.36, 1] });
    onSwipeComplete(dir);
  };

  useImperativeHandle(ref, () => ({
    swipe: (dir: 'yes' | 'no') => {
      void commit(dir);
    },
  }));

  const showVenueMeta = isVenueHeroOption(option);

  return (
    <motion.div
      className="relative flex h-full min-h-0 w-full min-w-0 max-w-full flex-1 cursor-grab select-none touch-pan-y active:cursor-grabbing"
      style={{ x, rotate }}
      drag={dragEnabled ? 'x' : false}
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.75}
      onDragEnd={(_, info) => {
        if (info.offset.x > 100 || info.velocity.x > 300) void commit('yes');
        else if (info.offset.x < -100 || info.velocity.x < -300) void commit('no');
        else void animate(x, 0, { type: 'spring', stiffness: 400, damping: 35 });
      }}
    >
      <motion.div
        className="pointer-events-none absolute left-3 top-[10%] z-10 max-w-[40%] rounded-md border-2 border-[#884E50] bg-white/95 px-2 py-0.5 font-sans text-[9px] font-bold uppercase tracking-wide text-[#884E50] shadow-sm"
        style={{ rotate: -12, opacity: loveOpacity }}
      >
        Love
      </motion.div>
      <motion.div
        className="pointer-events-none absolute right-3 top-[10%] z-10 max-w-[40%] rounded-md border-2 border-[#6B5F58] bg-white/95 px-2 py-0.5 font-sans text-[9px] font-bold uppercase tracking-wide text-[#6B5F58] shadow-sm"
        style={{ rotate: 12, opacity: passOpacity }}
      >
        Pass
      </motion.div>

      <div className={SWIPE_CARD_SHELL_CLASS}>
        <div className={SWIPE_PHOTO_STRIP_CLASS}>
          <VenueHeroImage option={option} />
        </div>
        <div className={SWIPE_CAPTION_STRIP_CLASS}>
          <h3 className="line-clamp-2 font-display text-[22px] font-semibold leading-[28.6px] text-[#2c2420]">
            {option.title}
          </h3>
          {option.description != null && option.description.trim() !== '' && (
            <p
              className="line-clamp-2 font-sans text-[13px] font-normal leading-[19.5px] text-[#6b5f58]"
              style={{ fontVariationSettings: "'opsz' 9" }}
            >
              {option.description}
            </p>
          )}
          {option.category === 'color-theme' && COLOR_THEME_SWATCHES[option.id] && (
            <div className="flex min-h-0 min-w-0 flex-row items-center gap-2 overflow-hidden">
              {COLOR_THEME_SWATCHES[option.id].map((color, i) => (
                <span
                  key={`${option.id}-swatch-${i}`}
                  className="h-6 w-6 shrink-0 rounded-full shadow-[0_1px_3px_0_rgba(44,36,32,0.08)]"
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          )}
          {showVenueMeta && (option.address || option.rating != null) && (
            <div className="flex min-h-0 items-center gap-1 text-[13px] leading-[19.5px] text-[#6b5f58]">
              <IconPin className="shrink-0 text-[#6B5F58]" />
              <span className="min-w-0 truncate">
                {option.address}
              </span>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
});

SwipeCard.displayName = 'SwipeCard';
