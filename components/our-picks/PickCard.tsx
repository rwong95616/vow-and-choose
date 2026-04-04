'use client';

import { MapPin } from 'lucide-react';

export type PickCardProps = {
  name: string;
  location: string;
  badge: 'our-pick' | 'bride' | 'groom';
  imageUrl: string;
  swatchColors?: string[];
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

export function PickCard({ name, location, badge, imageUrl, swatchColors }: PickCardProps) {
  return (
    <div className="flex flex-row items-center gap-4 bg-[#FAFAF5] p-4 rounded-2xl">
      <img
        src={imageUrl}
        alt={name}
        className="h-20 w-20 flex-shrink-0 rounded-xl object-cover"
      />
      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <div className="text-xl font-semibold text-[#1a1a1a]">{name}</div>
        {swatchColors && swatchColors.length > 0 ? (
          <div className="flex flex-row gap-2">
            {swatchColors.map((color, i) => (
              <span
                key={`${color}-${i}`}
                className="h-6 w-6 rounded-full border border-black/5"
                style={{ backgroundColor: color }}
              />
            ))}
          </div>
        ) : (
          <div className="flex items-center gap-1 text-sm text-[#888]">
            <MapPin size={14} className="shrink-0 text-[#888]" aria-hidden />
            <span>{location}</span>
          </div>
        )}
      </div>
      <span className={`ml-auto self-center flex-shrink-0 ${BADGE_CLASS[badge]}`}>
        {BADGE_LABEL[badge]}
      </span>
    </div>
  );
}
