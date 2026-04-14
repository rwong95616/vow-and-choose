'use client';

import { Loader2 } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
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
import { createBrowserClient } from '@/lib/supabase';
import { getColorThemeSwatches } from '@/lib/colorThemeSwatches';
import { buildVenueLocationKey } from '@/lib/venueLocationKey';
import { resolveVenueImageUrl } from '@/lib/venueImage';
import type { WeddingOption } from '@/lib/types';

type AggregatedPick = {
  category: string;
  item_id: string;
  badge: 'both' | 'bride' | 'groom';
  /** When same-role pair is confirmed and only one partner liked the item (e.g. "Bride 1"); otherwise plain "Bride"/"Groom". */
  badgeTextOverride?: string;
};

function likerKey(s: SwipeRow): string {
  return (s.swipe_user_id && s.swipe_user_id.trim()) || s.id;
}

/** Bride 1 / Groom 1 = creator swipe_user_id (is_creator true); Bride 2 / Groom 2 = joiner (false). */
function coupleRoleContext(swipes: SwipeRow[], coupleId: string | undefined) {
  const scoped =
    coupleId != null && coupleId !== ''
      ? swipes.filter((s) => s.couple_id === coupleId)
      : [];

  const brideUids = new Set<string>();
  const groomUids = new Set<string>();
  const uidIsCreator = new Map<string, boolean | null>();
  for (const s of scoped) {
    const uid = s.swipe_user_id?.trim();
    if (!uid) continue;
    if (s.user_role === 'bride') brideUids.add(uid);
    else groomUids.add(uid);
    if (s.is_creator != null) uidIsCreator.set(uid, s.is_creator);
    else if (!uidIsCreator.has(uid)) uidIsCreator.set(uid, null);
  }

  const orderRoleIds = (uids: Set<string>): string[] => {
    const creator = [...uids].find((u) => uidIsCreator.get(u) === true);
    const joiner = [...uids].find((u) => uidIsCreator.get(u) === false);
    const out: string[] = [];
    if (creator) out.push(creator);
    if (joiner) out.push(joiner);
    for (const u of [...uids].sort()) {
      if (!out.includes(u) && out.length < 2) out.push(u);
    }
    return out.slice(0, 2);
  };

  const brideIds = orderRoleIds(brideUids);
  const groomIds = orderRoleIds(groomUids);

  const mixed = brideIds.length > 0 && groomIds.length > 0;

  /** Both partners have swiped as brides (two distinct swipe ids) and nobody as groom — safe for Bride 1/2. */
  const sameRoleTwoBrides = brideUids.size >= 2 && groomUids.size === 0;
  /** Both partners have swiped as grooms and nobody as bride — safe for Groom 1/2. */
  const sameRoleTwoGrooms = groomUids.size >= 2 && brideUids.size === 0;

  return { mixed, brideIds, groomIds, sameRoleTwoBrides, sameRoleTwoGrooms };
}

type LikerInfo = { role: 'bride' | 'groom'; swipeUserId: string | null };

function aggregateYesSwipes(swipes: SwipeRow[], ctx: ReturnType<typeof coupleRoleContext>): AggregatedPick[] {
  console.log('[OurPicks aggregateYesSwipes] input swipes', swipes);
  const yes = swipes.filter((s) => s.decision === 'yes');
  const byKey = new Map<
    string,
    { category: string; item_id: string; byLiker: Map<string, LikerInfo> }
  >();

  for (const s of yes) {
    const key = `${s.category}::${s.item_id}`;
    const prev = byKey.get(key) ?? {
      category: s.category,
      item_id: s.item_id,
      byLiker: new Map<string, LikerInfo>(),
    };
    prev.byLiker.set(likerKey(s), {
      role: s.user_role,
      swipeUserId: s.swipe_user_id?.trim() ?? null,
    });
    byKey.set(key, prev);
  }

  const out: AggregatedPick[] = [];
  for (const v of byKey.values()) {
    const sortedLikers = [...v.byLiker.entries()].sort((a, b) => a[0].localeCompare(b[0]));
    const n = sortedLikers.length;
    if (n === 0) continue;

    if (n === 1) {
      const [, info] = sortedLikers[0];
      const { role, swipeUserId } = info;
      const base: AggregatedPick = {
        category: v.category,
        item_id: v.item_id,
        badge: role === 'bride' ? 'bride' : 'groom',
      };
      if (ctx.sameRoleTwoBrides && role === 'bride' && ctx.brideIds.length > 0) {
        const pos = swipeUserId != null ? ctx.brideIds.indexOf(swipeUserId) : -1;
        if (pos >= 0) base.badgeTextOverride = `Bride ${pos + 1}`;
      } else if (ctx.sameRoleTwoGrooms && role === 'groom' && ctx.groomIds.length > 0) {
        const pos = swipeUserId != null ? ctx.groomIds.indexOf(swipeUserId) : -1;
        if (pos >= 0) base.badgeTextOverride = `Groom ${pos + 1}`;
      }
      out.push(base);
      continue;
    }

    const roles = new Set(sortedLikers.map(([, inf]) => inf.role));
    const hasBride = roles.has('bride');
    const hasGroom = roles.has('groom');

    if (hasBride && hasGroom) {
      out.push({ category: v.category, item_id: v.item_id, badge: 'both' });
      continue;
    }

    // Two+ likers, same role → mutual "Our Pick"
    out.push({ category: v.category, item_id: v.item_id, badge: 'both' });
  }
  console.log('[OurPicks aggregateYesSwipes] aggregated result', out);
  return out;
}

/** Merge cache + live API list; later entries win (API over cache). */
function mergeVenueOptions(
  cacheRows: WeddingOption[],
  apiRows: WeddingOption[]
): Map<string, WeddingOption> {
  const m = new Map<string, WeddingOption>();
  for (const v of cacheRows) m.set(v.id, v);
  for (const v of apiRows) m.set(v.id, v);
  return m;
}

function resolveDisplay(
  category: string,
  itemId: string,
  venueById: Map<string, WeddingOption>
): {
  name: string;
  description?: string;
  imageUrl: string;
  location?: string;
} {
  if (category === 'venue') {
    const v = venueById.get(itemId);
    if (v) {
      return {
        name: v.title,
        description: v.description ?? undefined,
        imageUrl: resolveVenueImageUrl(v.imageUrl),
        location: v.address ?? undefined,
      };
    }
  } else {
    const o = findStaticOption(category, itemId);
    if (o) {
      return {
        name: o.title,
        description: o.description ?? undefined,
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
  const skipLocationCatalog =
    !!couple?.locationSkipped && !couple?.locationState?.trim();
  const skipVenueStateFilter = !couple?.locationState?.trim();
  const { venues, loading: venuesLoading } = useVenues(couple?.locationState, couple?.locationCity, {
    enabled: ready,
    skipStateFilter: skipVenueStateFilter,
    coupleId,
  });

  const [cacheVenues, setCacheVenues] = useState<WeddingOption[]>([]);
  const [cacheLoaded, setCacheLoaded] = useState(true);

  useEffect(() => {
    if (skipLocationCatalog) {
      setCacheLoaded(false);
      const supabase = createBrowserClient();
      void supabase
        .from('venue_cache')
        .select('results')
        .eq('location_key', 'all-states')
        .maybeSingle()
        .then(({ data, error }) => {
          if (error) {
            setCacheVenues([]);
          } else {
            const rows = Array.isArray(data?.results) ? (data.results as WeddingOption[]) : [];
            setCacheVenues(rows);
          }
          setCacheLoaded(true);
        });
      return;
    }
    if (!couple?.locationState?.trim() || couple.locationCity === undefined) {
      setCacheVenues([]);
      setCacheLoaded(true);
      return;
    }
    setCacheLoaded(false);
    const supabase = createBrowserClient();
    const key = buildVenueLocationKey(couple.locationState, couple.locationCity);
    void supabase
      .from('venue_cache')
      .select('results')
      .eq('location_key', key)
      .maybeSingle()
      .then(({ data, error }) => {
        if (error) {
          setCacheVenues([]);
        } else {
          const rows = Array.isArray(data?.results) ? (data.results as WeddingOption[]) : [];
          setCacheVenues(rows);
        }
        setCacheLoaded(true);
      });
  }, [couple?.locationState, couple?.locationCity, skipLocationCatalog]);

  const [selectedItem, setSelectedItem] = useState<ItemDetailModalItem | null>(null);

  const venueById = useMemo(
    () => mergeVenueOptions(cacheVenues, venues),
    [cacheVenues, venues]
  );

  const rawAggregated = useMemo(() => {
    const ctx = coupleRoleContext(swipes, coupleId);
    return aggregateYesSwipes(swipes, ctx);
  }, [swipes, coupleId]);

  const hasVenueYesSwipes = useMemo(
    () => rawAggregated.some((p) => p.category === 'venue'),
    [rawAggregated]
  );

  /** Only show venue picks whose place_id exists in this couple's location catalog (API + venue_cache), unless location was skipped with no state — then show all liked venues. */
  const aggregated = useMemo(() => {
    return rawAggregated.filter((p) => {
      if (p.category !== 'venue') return true;
      if (skipLocationCatalog) return true;
      return venueById.has(p.item_id);
    });
  }, [rawAggregated, venueById, skipLocationCatalog]);

  const needsVenueResolution = useMemo(
    () => aggregated.some((p) => p.category === 'venue'),
    [aggregated]
  );

  const loading =
    !ready ||
    picksLoading ||
    (hasVenueYesSwipes && (venuesLoading || !cacheLoaded));

  const byCategory = useMemo(() => {
    const map = new Map<string, AggregatedPick[]>();
    for (const p of aggregated) {
      const list = map.get(p.category) ?? [];
      list.push(p);
      map.set(p.category, list);
    }
    const badgeRank = (badge: AggregatedPick['badge']) =>
      badge === 'both' ? 0 : badge === 'bride' ? 1 : 2;

    for (const [, list] of map) {
      list.sort((a, b) => {
        const ra = badgeRank(a.badge);
        const rb = badgeRank(b.badge);
        if (ra !== rb) return ra - rb;
        return resolveDisplay(a.category, a.item_id, venueById).name.localeCompare(
          resolveDisplay(b.category, b.item_id, venueById).name
        );
      });
    }
    return map;
  }, [aggregated, venueById]);

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
                  const meta = resolveDisplay(p.category, p.item_id, venueById);

                  return (
                    <PickCard
                      key={`${p.category}-${p.item_id}`}
                      name={meta.name}
                      location={meta.location}
                      description={
                        p.category === 'venue' || p.category === 'color-theme'
                          ? undefined
                          : meta.description
                      }
                      swatchColors={
                        p.category === 'color-theme'
                          ? getColorThemeSwatches(p.item_id)
                          : undefined
                      }
                      badge={p.badge}
                      badgeTextOverride={p.badgeTextOverride}
                      imageUrl={meta.imageUrl}
                      onClick={() =>
                        setSelectedItem({
                          name: meta.name,
                          category: modalCategoryLabel(p.category),
                          location: meta.location,
                          description: meta.description,
                          swatchColors:
                            p.category === 'color-theme'
                              ? getColorThemeSwatches(p.item_id)
                              : undefined,
                          badge: p.badge,
                          badgeTextOverride: p.badgeTextOverride,
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
