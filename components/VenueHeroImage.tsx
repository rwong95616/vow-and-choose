'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';
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

function VenuePhotoCarousel({
  urls,
  photoKey,
}: {
  urls: string[];
  photoKey: string;
}) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);
  const [bad, setBad] = useState<Record<number, boolean>>({});

  useEffect(() => {
    setIndex(0);
    setBad({});
    const el = scrollRef.current;
    if (el) el.scrollTo({ left: 0 });
  }, [photoKey]);

  const n = urls.length;
  const scrollToIndex = useCallback(
    (i: number) => {
      const el = scrollRef.current;
      if (!el) return;
      const w = el.clientWidth;
      if (w <= 0) return;
      const next = Math.max(0, Math.min(n - 1, i));
      el.scrollTo({ left: next * w, behavior: 'smooth' });
    },
    [n]
  );

  const onScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    const w = el.clientWidth;
    if (w <= 0) return;
    const i = Math.min(n - 1, Math.round(el.scrollLeft / w));
    setIndex(i);
  }, [n]);

  return (
    <div className="relative h-full min-h-0 w-full">
      <div
        ref={scrollRef}
        role="region"
        aria-label="Venue photos"
        onScroll={onScroll}
        className="no-scrollbar flex h-full w-full snap-x snap-mandatory overflow-x-auto overflow-y-hidden"
        style={{
          touchAction: 'pan-x',
          WebkitOverflowScrolling: 'touch',
        }}
      >
        {urls.map((url, i) => (
          <div
            key={`${photoKey}-${i}`}
            className="relative h-full w-full shrink-0 snap-start snap-always"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={bad[i] ? VENUE_IMAGE_PLACEHOLDER : url}
              alt=""
              width={800}
              height={600}
              className={SWIPE_PHOTO_IMG_CLASS}
              draggable={false}
              onError={() =>
                setBad((prev) => (prev[i] ? prev : { ...prev, [i]: true }))
              }
            />
          </div>
        ))}
      </div>

      <button
        type="button"
        aria-label="Previous photo"
        disabled={index === 0}
        className={`absolute left-2 top-1/2 z-[3] flex size-8 -translate-y-1/2 items-center justify-center rounded-full border-0 bg-white/55 text-[#2C2420] shadow-[0_1px_3px_rgba(44,36,32,0.12)] backdrop-blur-[1px] transition-opacity ${
          index === 0 ? 'pointer-events-none opacity-0' : 'opacity-100'
        }`}
        onPointerDown={(e) => e.stopPropagation()}
        onClick={(e) => {
          e.stopPropagation();
          scrollToIndex(index - 1);
        }}
      >
        <ChevronLeft className="size-4 shrink-0" strokeWidth={2} aria-hidden />
      </button>
      <button
        type="button"
        aria-label="Next photo"
        disabled={index >= n - 1}
        className={`absolute right-2 top-1/2 z-[3] flex size-8 -translate-y-1/2 items-center justify-center rounded-full border-0 bg-white/55 text-[#2C2420] shadow-[0_1px_3px_rgba(44,36,32,0.12)] backdrop-blur-[1px] transition-opacity ${
          index >= n - 1 ? 'pointer-events-none opacity-0' : 'opacity-100'
        }`}
        onPointerDown={(e) => e.stopPropagation()}
        onClick={(e) => {
          e.stopPropagation();
          scrollToIndex(index + 1);
        }}
      >
        <ChevronRight className="size-4 shrink-0" strokeWidth={2} aria-hidden />
      </button>

      <div
        className="absolute bottom-3 left-0 right-0 z-[4] flex items-center justify-center"
        style={{ gap: '6px' }}
        role="tablist"
        aria-label="Photo position"
      >
        {urls.map((_, i) => (
          <button
            key={i}
            type="button"
            role="tab"
            aria-selected={i === index}
            aria-label={`Photo ${i + 1} of ${urls.length}`}
            className="inline-flex border-0 bg-transparent p-0"
            onClick={(e) => {
              e.stopPropagation();
              scrollToIndex(i);
            }}
          >
            <span
              className="block rounded-[100px]"
              style={{
                width: i === index ? '20px' : '6px',
                height: '6px',
                backgroundColor: i === index ? '#884e50' : '#D1C9C4',
                transition: 'all 0.3s',
              }}
            />
          </button>
        ))}
      </div>
    </div>
  );
}

export function VenueHeroImage({ option, emojiSizeClass = 'text-[80px]' }: Props) {
  const venue = isVenueHeroOption(option);
  const directImageUrl = option.imageUrl?.trim() ?? '';

  const [src, setSrc] = useState(() =>
    venue ? resolveVenueImageUrl(option.imageUrl) : directImageUrl
  );

  useEffect(() => {
    if (venue) {
      setSrc(resolveVenueImageUrl(option.imageUrl));
    } else if (directImageUrl) {
      setSrc(directImageUrl);
    }
  }, [venue, directImageUrl, option.id, option.imageUrl]);

  if (!venue && directImageUrl) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={src || directImageUrl}
        alt=""
        width={800}
        height={600}
        className={SWIPE_PHOTO_IMG_CLASS}
        draggable={false}
        onError={() => setSrc(VENUE_IMAGE_PLACEHOLDER)}
      />
    );
  }

  if (!venue) {
    return (
      <div
        className="flex h-full min-h-0 w-full items-center justify-center"
        style={{ background: option.gradient ?? '#FAF7F2' }}
      >
        {option.emoji ? <span className={`leading-none ${emojiSizeClass}`}>{option.emoji}</span> : null}
      </div>
    );
  }

  const carouselUrls =
    Array.isArray(option.imageUrls) && option.imageUrls.length > 0
      ? option.imageUrls.map((u) => resolveVenueImageUrl(u))
      : [resolveVenueImageUrl(option.imageUrl)];

  if (carouselUrls.length > 1) {
    return <VenuePhotoCarousel urls={carouselUrls} photoKey={option.id} />;
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
