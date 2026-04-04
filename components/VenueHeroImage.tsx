'use client';

import { useEffect, useState } from 'react';
import { VENUE_IMAGE_PLACEHOLDER, resolveVenueImageUrl } from '@/lib/venueImage';
import { SWIPE_PHOTO_IMG_CLASS } from '@/lib/swipeCardLayout';
import type { WeddingOption } from '@/lib/types';

type Props = {
  option: WeddingOption;
  emojiSizeClass?: string;
};

export function isVenueHeroOption(option: WeddingOption): boolean {
  const c = String(option.category ?? '')
    .toLowerCase()
    .trim();
  if (c === 'venue') return true;
  if (!c && option.imageUrl && option.emoji === '🏛️') return true;
  return false;
}

export function VenueHeroImage({ option, emojiSizeClass = 'text-[80px]' }: Props) {
  const venue = isVenueHeroOption(option);

  const [src, setSrc] = useState(() => (venue ? resolveVenueImageUrl(option.imageUrl) : ''));

  useEffect(() => {
    if (venue) {
      setSrc(resolveVenueImageUrl(option.imageUrl));
    }
  }, [venue, option.id, option.imageUrl]);

  if (!venue) {
    return (
      <div
        className="flex h-full min-h-0 w-full items-center justify-center"
        style={{ background: option.gradient || '#FAF7F2' }}
      >
        <span className={`leading-none ${emojiSizeClass}`}>{option.emoji}</span>
      </div>
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src || VENUE_IMAGE_PLACEHOLDER}
      alt=""
      width={800}
      height={600}
      className={SWIPE_PHOTO_IMG_CLASS}
      draggable={false}
      onError={() => setSrc(VENUE_IMAGE_PLACEHOLDER)}
    />
  );
}
