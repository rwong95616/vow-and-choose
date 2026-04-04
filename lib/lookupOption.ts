import {
  CATEGORY_ORDER,
  staticOptionsByCategory,
  type CategoryId,
} from '@/data/options';
import type { WeddingOption } from '@/lib/types';

export function findStaticOption(category: string, itemId: string): WeddingOption | undefined {
  if (category === 'venue') return undefined;
  const list = staticOptionsByCategory[category as Exclude<CategoryId, 'venue'>];
  return list?.find((o) => o.id === itemId);
}

export { CATEGORY_ORDER };
