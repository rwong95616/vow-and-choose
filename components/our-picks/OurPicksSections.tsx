'use client';

import { Loader2 } from 'lucide-react';
import { useMemo, useState } from 'react';
import ItemDetailModal, {
  type ItemDetailModalItem,
} from '@/components/our-picks/ItemDetailModal';
import { EmptyState } from '@/components/our-picks/EmptyState';
import { PickCard } from '@/components/our-picks/PickCard';
import { CATEGORY_LABELS, CATEGORY_ORDER, type CategoryId } from '@/data/options';
import { findStaticOption } from '@/lib/lookupOption';
import { useCouple } from '@/lib/hooks/useCouple';
import { usePicks, type SwipeRow } from '@/lib/hooks/usePicks';
import { useVenues } from '@/lib/hooks/useVenues';
import { resolveVenueImageUrl } from '@/lib/venueImage';
import type { WeddingOption } from '@/lib/types';

type AggregatedPick = {
  category: string;
  item_id: string;
  badge: 'both' | 'bride' | 'groom';
};

function aggregateYesSwipes(swipes: SwipeRow[]): AggregatedPick[] {
  const yes = swipes.filter((s) => s.decision === 'yes');
  const byKey = new Map<
    string,
    { category: string; item_id: string; bride: boolean; groom: boolean }
  >();

  for (const s of yes) {
    const key = `${s.category}::${s.item_id}`;
    const prev = byKey.get(key) ?? {
      category: s.category,
      item_id: s.item_id,
      bride: false,
      groom: false,
    };
    if (s.user_role === 'bride') prev.bride = true;
    if (s.user_role === 'groom') prev.groom = true;
    byKey.set(key, prev);
  }

  const out: AggregatedPick[] = [];
  for (const v of byKey.values()) {
    let badge: AggregatedPick['badge'];
    if (v.bride && v.groom) badge = 'both';
    else if (v.bride) badge = 'bride';
    else badge = 'groom';
    out.push({ category: v.category, item_id: v.item_id, badge });
  }
  return out;
}

function resolveDisplay(
  category: string,
  itemId: string,
  venues: WeddingOption[]
): {
  name: string;
  description?: string;
  imageUrl: string;
  location?: string;
} {
  if (category === 'venue') {
    const v = venues.find((o) => o.id === itemId);
    if (v) {
      return {
        name: v.title,
        description: v.description,
        imageUrl: resolveVenueImageUrl(v.imageUrl),
        location: v.address ?? undefined,
      };
    }
  } else {
    const o = findStaticOption(category, itemId);
    if (o) {
      return {
        name: o.title,
        description: o.description,
        imageUrl: o.imageUrl?.trim() ? o.imageUrl : resolveVenueImageUrl(undefined),
      };
    }
  }
  return {
    name: itemId,
    imageUrl: resolveVenueImageUrl(undefined),
  };
}

function categoryHeading(categoryId: string): string {
  const id = categoryId as CategoryId;
  if (id in CATEGORY_LABELS) {
    return CATEGORY_LABELS[id].label.toUpperCase();
  }
  return categoryId.toUpperCase();
}

function modalCategoryLabel(categoryId: string): string {
  const id = categoryId as CategoryId;
  if (id in CATEGORY_LABELS) return CATEGORY_LABELS[id].label.toUpperCase();
  return categoryId.toUpperCase();
}

export function OurPicksSections() {
  const { couple, ready } = useCouple();
  const coupleId = couple?.coupleId;
  const { swipes, loading: picksLoading } = usePicks(coupleId);
  const { venues, loading: venuesLoading } = useVenues(couple?.locationState, couple?.locationCity);

  const [selectedItem, setSelectedItem] = useState<ItemDetailModalItem | null>(null);

  const aggregated = useMemo(() => aggregateYesSwipes(swipes), [swipes]);

  const needsVenueResolution = useMemo(
    () => aggregated.some((p) => p.category === 'venue'),
    [aggregated]
  );

  const loading =
    !ready || picksLoading || (needsVenueResolution && venuesLoading);

  const byCategory = useMemo(() => {
    const map = new Map<string, AggregatedPick[]>();
    for (const p of aggregated) {
      const list = map.get(p.category) ?? [];
      list.push(p);
      map.set(p.category, list);
    }
    for (const [, list] of map) {
      list.sort((a, b) =>
        resolveDisplay(a.category, a.item_id, venues).name.localeCompare(
          resolveDisplay(b.category, b.item_id, venues).name
        )
      );
    }
    return map;
  }, [aggregated, venues]);

  const orderedCategories = useMemo(() => {
    const keys = new Set(byCategory.keys());
    const ordered: string[] = [];
    for (const id of CATEGORY_ORDER) {
      if (keys.has(id)) ordered.push(id);
    }
    for (const k of keys) {
      if (!ordered.includes(k)) ordered.push(k);
    }
    return ordered;
  }, [byCategory]);

  if (loading) {
    return (
      <div className="flex min-h-[200px] w-full flex-1 items-center justify-center py-16">
        <Loader2 className="size-9 animate-spin text-[#884E50]" aria-label="Loading" />
      </div>
    );
  }

  if (aggregated.length === 0) {
    return <EmptyState />;
  }

  return (
    <>
      <div className="flex w-full flex-col items-start">
        {orderedCategories.map((catId) => {
          const picks = byCategory.get(catId);
          if (!picks?.length) return null;
          return (
            <section key={catId} className="mb-[24px] w-full last:mb-0">
              <h2 className="mb-4 text-xs font-semibold tracking-widest text-[#C4A96B]">
                {categoryHeading(catId)}
              </h2>
              <div className="flex flex-col gap-3">
                {picks.map((p) => {
                  const meta = resolveDisplay(p.category, p.item_id, venues);

                  return (
                    <PickCard
                      key={`${p.category}-${p.item_id}`}
                      name={meta.name}
                      location={meta.location}
                      description={meta.description}
                      badge={p.badge}
                      imageUrl={meta.imageUrl}
                      onClick={() =>
                        setSelectedItem({
                          name: meta.name,
                          category: modalCategoryLabel(p.category),
                          location: meta.location,
                          description: meta.description,
                          badge: p.badge,
                          imageUrl: meta.imageUrl,
                        })
                      }
                    />
                  );
                })}
              </div>
            </section>
          );
        })}
      </div>

      <ItemDetailModal
        isOpen={selectedItem !== null}
        onClose={() => setSelectedItem(null)}
        item={selectedItem}
      />
    </>
  );
}
