'use client';

import { MapPin } from 'lucide-react';

export type PickCardProps = {
  name: string;
  /** Shown with map pin when no swatches and no `description`. */
  location?: string;
  /** When set, shown below the name instead of the location row (no pin). */
  description?: string;
  badge: 'our-pick' | 'bride' | 'groom';
  imageUrl: string;
  swatchColors?: string[];
  bgColor?: 'warm' | 'white';
  onClick?: () => void;
};

const BADGE_LABEL: Record<PickCardProps['badge'], string> = {
  'our-pick': 'Our Pick',
  bride: 'Bride',
  groom: 'Groom',
};

const BADGE_SURFACE: Record<PickCardProps['badge'], string> = {
  'our-pick': 'bg-[#B5973A]',
  bride: 'bg-[#E8857A]',
  groom: 'bg-[#6B8F71]',
};

/** Card canvas: our-pick = cream, bride/groom = white. */
const CARD_CANVAS: Record<PickCardProps['badge'], string> = {
  'our-pick': 'bg-[#FBF6E8]',
  bride: 'bg-white',
  groom: 'bg-white',
};

const dmSansFont = { fontFamily: 'var(--font-dm-sans)' } as const;

export function PickCard({
  name,
  location = '',
  description,
  badge,
  imageUrl,
  swatchColors,
  onClick,
}: PickCardProps) {
  return (
    <div
      className={`flex h-24 w-full flex-row items-center gap-4 overflow-hidden rounded-[20px] p-4 shadow-[0_2px_8px_0_rgba(44,36,32,0.08)] ${CARD_CANVAS[badge]} ${onClick ? 'cursor-pointer' : ''}`}
      onClick={
        onClick
          ? () => {
              console.log('card clicked', name);
              onClick();
            }
          : undefined
      }
    >
      <div className="h-16 w-16 shrink-0 overflow-hidden rounded-[14px] bg-[#E8E4DC]">
        <img
          src={imageUrl}
          alt={name}
          className="h-full w-full object-cover"
          onError={(e) => {
            e.currentTarget.style.display = 'none';
          }}
        />
      </div>

      <div className="flex min-h-0 min-w-0 flex-1 flex-col gap-1 overflow-hidden">
        <div
          className="min-w-0 truncate text-[16px] font-semibold leading-6 text-[#2C2420]"
          style={dmSansFont}
        >
          {name}
        </div>
        {swatchColors && swatchColors.length > 0 ? (
          <div className="flex min-h-0 min-w-0 flex-row items-center gap-2 overflow-hidden">
            {swatchColors.map((color, i) => (
              <span
                key={`${color}-${i}`}
                className="h-6 w-6 shrink-0 rounded-full shadow-[0_1px_3px_0_rgba(44,36,32,0.08)]"
                style={{ backgroundColor: color }}
              />
            ))}
          </div>
        ) : description ? (
          <p
            className="min-w-0 truncate text-[14px] leading-5 text-[#6B5F58]"
            style={dmSansFont}
          >
            {description}
          </p>
        ) : (
          <div className="flex min-h-0 min-w-0 flex-row items-center gap-1 overflow-hidden">
            <MapPin size={14} className="shrink-0 text-[#6B5F58]" aria-hidden />
            <span
              className="min-w-0 truncate text-[14px] leading-5 text-[#6B5F58]"
              style={dmSansFont}
            >
              {location}
            </span>
          </div>
        )}
      </div>

      <div className="flex shrink-0 items-center">
        <span
          className={`whitespace-nowrap rounded-full px-4 py-2 text-sm text-white ${BADGE_SURFACE[badge]}`}
          style={dmSansFont}
        >
          {BADGE_LABEL[badge]}
        </span>
      </div>
    </div>
  );
}
