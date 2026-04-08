'use client';

import { Images, X } from 'lucide-react';
import { createPortal } from 'react-dom';
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

function VenuePhotoGalleryModal({
  urls,
  onClose,
}: {
  urls: string[];
  onClose: () => void;
}) {
  const [bad, setBad] = useState<Record<number, boolean>>({});

  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  return (
    <>
      <button
        type="button"
        aria-label="Close"
        className="fixed inset-0 z-50 bg-black/50"
        onClick={onClose}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Venue photos"
        className="fixed bottom-0 left-0 right-0 z-50 flex h-[70vh] flex-col overflow-hidden rounded-t-[28px] bg-white"
      >
        <div className="relative flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden">
          <button
            type="button"
            aria-label="Close"
            className="absolute right-4 top-4 z-20 flex h-10 w-10 items-center justify-center rounded-full bg-white text-[#2C2420]"
            onClick={(e) => {
              e.stopPropagation();
              onClose();
            }}
          >
            <X size={20} strokeWidth={1.5} aria-hidden />
          </button>
          <div className="min-h-0 w-full flex-1 overflow-y-auto overflow-x-hidden">
            <div className="flex flex-col gap-2 pb-[max(1.25rem,env(safe-area-inset-bottom,0px))]">
              {urls.map((url, i) => (
                <div key={i} className="w-full shrink-0">
                  <div
                    className={`w-full overflow-hidden ${i === 0 ? 'rounded-t-[28px]' : ''}`}
                    style={{ height: '320px', flexShrink: 0 }}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={bad[i] ? VENUE_IMAGE_PLACEHOLDER : url}
                      alt=""
                      style={{
                        width: '100%',
                        height: '320px',
                        objectFit: 'cover',
                        display: 'block',
                      }}
                      draggable={false}
                      onError={() =>
                        setBad((prev) => (prev[i] ? prev : { ...prev, [i]: true }))
                      }
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export function VenueHeroImage({ option, emojiSizeClass = 'text-[80px]' }: Props) {
  const venue = isVenueHeroOption(option);
  const directImageUrl = option.imageUrl?.trim() ?? '';

  const [src, setSrc] = useState(() =>
    venue ? resolveVenueImageUrl(option.imageUrl) : directImageUrl
  );
  const [galleryOpen, setGalleryOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (venue) {
      setSrc(resolveVenueImageUrl(option.imageUrl));
    } else if (directImageUrl) {
      setSrc(directImageUrl);
    }
  }, [venue, directImageUrl, option.id, option.imageUrl]);

  const galleryUrls =
    Array.isArray(option.imageUrls) && option.imageUrls.length > 0
      ? option.imageUrls.map((u) => resolveVenueImageUrl(u))
      : [resolveVenueImageUrl(option.imageUrl)];

  const showGalleryButton = venue && galleryUrls.length > 1;

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

  return (
    <>
      <div className="relative h-full min-h-0 w-full">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={src || VENUE_IMAGE_PLACEHOLDER}
          alt=""
          width={800}
          height={600}
          className={SWIPE_PHOTO_IMG_CLASS}
          draggable={false}
          onError={() => setSrc(VENUE_IMAGE_PLACEHOLDER)}
        />
        {showGalleryButton && (
          <button
            type="button"
            aria-label="View all photos"
            className="absolute right-2 top-2 z-[5] flex size-8 items-center justify-center rounded-full border-0 bg-white/55 text-[#2C2420] shadow-[0_1px_3px_rgba(44,36,32,0.12)] backdrop-blur-[1px] transition-opacity hover:bg-white/70"
            onPointerDown={(e) => e.stopPropagation()}
            onClick={(e) => {
              e.stopPropagation();
              setGalleryOpen(true);
            }}
          >
            <Images className="size-4 shrink-0" strokeWidth={2} aria-hidden />
          </button>
        )}
      </div>
      {mounted &&
        galleryOpen &&
        createPortal(
          <VenuePhotoGalleryModal urls={galleryUrls} onClose={() => setGalleryOpen(false)} />,
          document.body
        )}
    </>
  );
}
