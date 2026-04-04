'use client';

import { useState } from 'react';
import ItemDetailModal, {
  type ItemDetailModalItem,
} from '@/components/our-picks/ItemDetailModal';
import { EmptyState } from '@/components/our-picks/EmptyState';
import { PickCard } from '@/components/our-picks/PickCard';

export type OurPicksSectionsProps = {
  /** Empty array → empty state; omit → hardcoded demo cards (until Supabase). */
  picks?: ItemDetailModalItem[];
};

const IMG = {
  SF_CITY_HALL:
    'https://images.unsplash.com/photo-1522673606160-8d399438c4bc?w=800&q=80',
  PALACE_HOTEL:
    'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=800&q=80',
  FAIRMONT:
    'https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?w=800&q=80',
  BLUSH_GOLD:
    'https://images.unsplash.com/photo-1767050292710-8e5da59ec5d8?w=800&q=80',
  SAGE_IVORY:
    'https://images.unsplash.com/photo-1766043373136-f2566b286edc?w=800&q=80',
  GARDEN_ROSES_PEONIES:
    'https://images.unsplash.com/photo-1749964705495-2099c9c09b9f?w=800&q=80',
  LIVE_JAZZ:
    'https://images.unsplash.com/photo-1677845100757-f4ff89b22df9?w=800&q=80',
} as const;

/** All `imageUrl` values used by Our Picks cards (display order). */
export const OUR_PICKS_IMAGE_URLS: string[] = [
  IMG.SF_CITY_HALL,
  IMG.PALACE_HOTEL,
  IMG.FAIRMONT,
  IMG.BLUSH_GOLD,
  IMG.SAGE_IVORY,
  IMG.GARDEN_ROSES_PEONIES,
  IMG.LIVE_JAZZ,
];

/** Hardcoded Our Picks sections — no data fetch. */
export function OurPicksSections({ picks }: OurPicksSectionsProps = {}) {
  const [selectedItem, setSelectedItem] = useState<ItemDetailModalItem | null>(null);

  if (picks !== undefined && picks.length === 0) {
    return <EmptyState />;
  }

  return (
    <>
      <div className="flex w-full flex-col items-start">
        <section className="mb-[24px] w-full">
          <h2 className="mb-4 text-xs font-semibold tracking-widest text-[#C4A96B]">VENUE</h2>
          <div className="flex flex-col gap-3">
            <PickCard
              name="San Francisco City Hall"
              location="San Francisco, CA"
              badge="our-pick"
              imageUrl={IMG.SF_CITY_HALL}
              bgColor="warm"
              onClick={() =>
                setSelectedItem({
                  name: 'San Francisco City Hall',
                  category: 'VENUE',
                  location: 'San Francisco, CA',
                  description:
                    'Iconic Beaux-Arts architecture with stunning grand staircase',
                  badge: 'our-pick',
                  imageUrl: IMG.SF_CITY_HALL,
                })
              }
            />
            <PickCard
              name="The Palace Hotel"
              location="San Francisco, CA"
              badge="bride"
              imageUrl={IMG.PALACE_HOTEL}
              bgColor="white"
              onClick={() =>
                setSelectedItem({
                  name: 'The Palace Hotel',
                  category: 'VENUE',
                  location: 'San Francisco, CA',
                  description: 'Grand historic hotel with opulent ballrooms',
                  badge: 'bride',
                  imageUrl: IMG.PALACE_HOTEL,
                })
              }
            />
            <PickCard
              name="The Fairmont"
              location="San Francisco, CA"
              badge="groom"
              imageUrl={IMG.FAIRMONT}
              bgColor="white"
              onClick={() =>
                setSelectedItem({
                  name: 'The Fairmont',
                  category: 'VENUE',
                  location: 'San Francisco, CA',
                  description: undefined,
                  badge: 'groom',
                  imageUrl: IMG.FAIRMONT,
                })
              }
            />
          </div>
        </section>

        <section className="mb-[24px] w-full">
          <h2 className="mb-4 text-xs font-semibold tracking-widest text-[#C4A96B]">COLOR THEME</h2>
          <div className="flex flex-col gap-3">
            <PickCard
              name="Blush & Gold"
              location=""
              badge="our-pick"
              imageUrl={IMG.BLUSH_GOLD}
              swatchColors={['#F2A7B0', '#C9A84C', '#FFFFFF']}
              bgColor="warm"
              onClick={() =>
                setSelectedItem({
                  name: 'Blush & Gold',
                  category: 'COLOR THEME',
                  location: undefined,
                  description:
                    'Soft romance with warm metallic highlights.',
                  badge: 'our-pick',
                  imageUrl: IMG.BLUSH_GOLD,
                })
              }
            />
            <PickCard
              name="Sage & Ivory"
              location=""
              badge="bride"
              imageUrl={IMG.SAGE_IVORY}
              swatchColors={['#6B8F71', '#C5C97A', '#6B7B5A']}
              bgColor="white"
              onClick={() =>
                setSelectedItem({
                  name: 'Sage & Ivory',
                  category: 'COLOR THEME',
                  location: undefined,
                  description: 'Natural calm with timeless garden elegance.',
                  badge: 'bride',
                  imageUrl: IMG.SAGE_IVORY,
                })
              }
            />
          </div>
        </section>

        <section className="mb-[24px] w-full">
          <h2 className="mb-4 text-xs font-semibold tracking-widest text-[#C4A96B]">
            FLORALS & DECOR
          </h2>
          <div className="flex flex-col gap-3">
            <PickCard
              name="Garden Roses & Peonies"
              description="Lush, romantic blooms"
              badge="our-pick"
              imageUrl={IMG.GARDEN_ROSES_PEONIES}
              bgColor="warm"
              onClick={() =>
                setSelectedItem({
                  name: 'Garden Roses & Peonies',
                  category: 'FLORALS & DECOR',
                  location: undefined,
                  description: 'Lush, romantic blooms',
                  badge: 'our-pick',
                  imageUrl: IMG.GARDEN_ROSES_PEONIES,
                })
              }
            />
          </div>
        </section>

        <section className="w-full">
          <h2 className="mb-4 text-xs font-semibold tracking-widest text-[#C4A96B]">ENTERTAINMENT</h2>
          <div className="flex flex-col gap-3">
            <PickCard
              name="Live Jazz Band"
              description="Sophisticated swing music"
              badge="groom"
              imageUrl={IMG.LIVE_JAZZ}
              bgColor="white"
              onClick={() =>
                setSelectedItem({
                  name: 'Live Jazz Band',
                  category: 'ENTERTAINMENT',
                  location: undefined,
                  description: 'Sophisticated swing music',
                  badge: 'groom',
                  imageUrl: IMG.LIVE_JAZZ,
                })
              }
            />
          </div>
        </section>
      </div>

      <ItemDetailModal
        isOpen={selectedItem !== null}
        onClose={() => setSelectedItem(null)}
        item={selectedItem}
      />
    </>
  );
}
