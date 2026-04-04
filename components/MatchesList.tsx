'use client';

import { useMemo } from 'react';
import { CATEGORY_LABELS, CATEGORY_ORDER, type CategoryId } from '@/data/options';
import { findStaticOption } from '@/lib/lookupOption';
import type { SwipeRow } from '@/lib/hooks/usePicks';
import type { WeddingOption } from '@/lib/types';
import { VENUE_IMAGE_PLACEHOLDER, resolveVenueImageUrl } from '@/lib/venueImage';

type ItemPick = {
  itemId: string;
  category: string;
  bride: boolean;
  groom: boolean;
  option?: WeddingOption;
};

function buildItems(swipes: SwipeRow[]): Map<string, Map<string, { bride: boolean; groom: boolean }>> {
  const map = new Map<string, Map<string, { bride: boolean; groom: boolean }>>();
  for (const s of swipes) {
    if (s.decision !== 'yes') continue;
    if (!map.has(s.category)) map.set(s.category, new Map());
    const m = map.get(s.category)!;
    const cur = m.get(s.item_id) ?? { bride: false, groom: false };
    if (s.user_role === 'bride') cur.bride = true;
    if (s.user_role === 'groom') cur.groom = true;
    m.set(s.item_id, cur);
  }
  return map;
}

type Props = {
  swipes: SwipeRow[];
  venueOptions: WeddingOption[];
};

export function MatchesList({ swipes, venueOptions }: Props) {
  const byCat = useMemo(() => buildItems(swipes), [swipes]);

  const rows = useMemo(() => {
    const out: { category: CategoryId; items: ItemPick[] }[] = [];
    for (const cat of CATEGORY_ORDER) {
      const m = byCat.get(cat);
      if (!m) continue;
      const items: ItemPick[] = [];
      for (const [itemId, v] of Array.from(m.entries())) {
        if (!v.bride && !v.groom) continue;
        let option: WeddingOption | undefined;
        if (cat === 'venue') {
          option = venueOptions.find((o) => o.id === itemId);
          if (!option) {
            option = {
              id: itemId,
              category: 'venue',
              title: 'Venue',
              description: '',
              emoji: '🏛️',
              gradient: '',
            };
          }
        } else {
          option = findStaticOption(cat, itemId);
        }
        items.push({
          itemId,
          category: cat,
          bride: v.bride,
          groom: v.groom,
          option,
        });
      }
      items.sort((a, b) => {
        const ma = a.bride && a.groom ? 0 : 1;
        const mb = b.bride && b.groom ? 0 : 1;
        if (ma !== mb) return ma - mb;
        return (a.option?.title ?? '').localeCompare(b.option?.title ?? '');
      });
      if (items.length) out.push({ category: cat, items });
    }
    return out;
  }, [byCat, venueOptions]);

  const empty = rows.length === 0;

  if (empty) {
    return (
      <p className="py-16 text-center text-muted">Start swiping to see your picks here 💫</p>
    );
  }

  return (
    <div className="flex flex-col gap-8 pb-24">
      {rows.map(({ category, items }) => {
        const label = CATEGORY_LABELS[category]?.label ?? category;
        const emoji = CATEGORY_LABELS[category]?.emoji ?? '✨';
        return (
          <section key={category}>
            <h2 className="mb-3 font-display text-lg text-ink">
              {emoji} {label}
            </h2>
            <ul className="flex flex-col gap-2">
              {items.map((it) => {
                const mutual = it.bride && it.groom;
                const opt = it.option;
                return (
                  <li
                    key={`${category}-${it.itemId}`}
                    className={`flex items-center gap-3 rounded-2xl px-3 py-3 shadow-sm ring-1 ring-ink/10 ${
                      mutual ? 'bg-mutual' : 'bg-white'
                    }`}
                  >
                    {category === 'venue' ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={resolveVenueImageUrl(opt?.imageUrl)}
                        alt=""
                        className="h-10 w-10 shrink-0 rounded-lg object-cover"
                        onError={(e) => {
                          e.currentTarget.src = VENUE_IMAGE_PLACEHOLDER;
                        }}
                      />
                    ) : (
                      <span className="flex h-10 w-10 shrink-0 items-center justify-center text-2xl">
                        {opt?.emoji ?? '✨'}
                      </span>
                    )}
                    <div className="min-w-0 flex-1">
                      <p className="font-display text-base text-ink">{opt?.title ?? it.itemId}</p>
                      <div className="mt-1 flex flex-wrap gap-1">
                        {mutual ? (
                          <span className="rounded-full bg-gold/30 px-2 py-0.5 text-[11px] font-semibold text-ink">
                            💛 Both love it
                          </span>
                        ) : (
                          <>
                            {it.bride && (
                              <span className="rounded-full bg-bride/25 px-2 py-0.5 text-[11px] font-semibold text-ink">
                                💐 Bride
                              </span>
                            )}
                            {it.groom && (
                              <span className="rounded-full bg-groom/25 px-2 py-0.5 text-[11px] font-semibold text-ink">
                                🤵 Groom
                              </span>
                            )}
                          </>
                        )}
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          </section>
        );
      })}
    </div>
  );
}
