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
  /** Card surface: warm off-white for “our pick” rows, white for bride/groom. */
  bgColor?: 'warm' | 'white';
};

const BADGE_LABEL: Record<PickCardProps['badge'], string> = {
  'our-pick': 'Our Pick',
  bride: 'Bride',
  groom: 'Groom',
};

const BADGE_CLASS: Record<PickCardProps['badge'], string> = {
  'our-pick': 'bg-[#B5973A] text-white text-sm px-4 py-1.5 rounded-full',
  bride: 'bg-[#E8857A] text-white text-sm px-4 py-1.5 rounded-full',
  groom: 'bg-[#6B8F71] text-white text-sm px-4 py-1.5 rounded-full',
};

const CARD_SURFACE: Record<NonNullable<PickCardProps['bgColor']>, string> = {
  warm: 'bg-[#FBF6E8]',
  white: 'bg-white',
};

const CARD_CHROME =
  'rounded-[20px] shadow-[0_2px_8px_0_rgba(44,36,32,0.08)] border-0';

const dmSansFont = { fontFamily: 'var(--font-dm-sans)' } as const;

export function PickCard({
  name,
  location = '',
  description,
  badge,
  imageUrl,
  swatchColors,
  bgColor = 'warm',
}: PickCardProps) {
  return (
    <div
      className={`flex min-h-[100px] flex-row items-start gap-4 p-4 ${CARD_CHROME} ${CARD_SURFACE[bgColor]}`}
    >
      <img
        src={imageUrl}
        alt={name}
        className="h-16 w-16 shrink-0 rounded-[14px] object-cover"
      />
      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <div
          style={{
            fontFamily: 'var(--font-dm-sans)',
            fontSize: '16px',
            fontWeight: 600,
            lineHeight: '24px',
            color: '#2C2420',
          }}
        >
          {name}
        </div>
        {swatchColors && swatchColors.length > 0 ? (
          <div className="flex flex-row items-center gap-2">
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
            className="text-[#6B5F58]"
            style={{ ...dmSansFont, fontSize: '14px', lineHeight: '20px' }}
          >
            {description}
          </p>
        ) : (
          <div
            className="flex flex-row items-center gap-1 whitespace-nowrap text-sm text-[#6B5F58]"
            style={dmSansFont}
          >
            <MapPin size={14} className="shrink-0 text-[#6B5F58]" aria-hidden />
            <span>{location}</span>
          </div>
        )}
      </div>
      <span
        className={`ml-auto mt-1 shrink-0 self-start whitespace-nowrap ${BADGE_CLASS[badge]}`}
        style={dmSansFont}
      >
        {BADGE_LABEL[badge]}
      </span>
    </div>
  );
}
