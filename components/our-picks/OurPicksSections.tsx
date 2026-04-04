import { PickCard } from '@/components/our-picks/PickCard';

/** Hardcoded Our Picks sections — no data fetch. */
export function OurPicksSections() {
  return (
    <div className="flex w-full flex-col items-start">
      <section className="mb-[24px] w-full">
        <h2 className="mb-4 text-xs font-semibold tracking-widest text-[#C4A96B]">VENUE</h2>
        <div className="flex flex-col gap-3">
          <PickCard
            name="San Francisco City Hall"
            location="San Francisco, CA"
            badge="our-pick"
            imageUrl="https://images.unsplash.com/photo-1522673606160-8d399438c4bc?w=800&q=80"
            bgColor="warm"
          />
          <PickCard
            name="The Palace Hotel"
            location="San Francisco, CA"
            badge="bride"
            imageUrl="https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=800&q=80"
            bgColor="white"
          />
          <PickCard
            name="The Fairmont"
            location="San Francisco, CA"
            badge="groom"
            imageUrl="https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?w=800&q=80"
            bgColor="white"
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
            imageUrl="https://images.unsplash.com/photo-1767050292710-8e5da59ec5d8?w=800&q=80"
            swatchColors={['#F2A7B0', '#C9A84C', '#FFFFFF']}
            bgColor="warm"
          />
          <PickCard
            name="Sage & Ivory"
            location=""
            badge="bride"
            imageUrl="https://images.unsplash.com/photo-1766043373136-f2566b286edc?w=800&q=80"
            swatchColors={['#6B8F71', '#C5C97A', '#6B7B5A']}
            bgColor="white"
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
            imageUrl="https://images.unsplash.com/photo-1749964705495-2099c9c09b9f?w=800&q=80"
            bgColor="warm"
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
            imageUrl="https://images.unsplash.com/photo-1677845100757-f4ff89b22df9?w=800&q=80"
            bgColor="white"
          />
        </div>
      </section>
    </div>
  );
}
