import type { WeddingOption } from '@/lib/types';

/** Legacy mix (2 per US region) — used when no state-specific pack applies */
export const fallbackVenues: WeddingOption[] = [
  {
    id: 'fb-northeast-1',
    category: 'venue',
    title: 'Harborview Estate',
    description: 'Coastal elegance with sweeping ocean views.',
    emoji: '🏛️',
    gradient: '',
    imageUrl:
      'https://images.unsplash.com/photo-1519741497674-611481863552?w=800&q=80',
    rating: 4.8,
    address: 'Newport, RI',
    website: null,
  },
  {
    id: 'fb-northeast-2',
    category: 'venue',
    title: 'Garden Atrium Ballroom',
    description: 'Glass walls and lush indoor gardens.',
    emoji: '🏛️',
    gradient: '',
    imageUrl:
      'https://images.unsplash.com/photo-1464366400600-7161149a05d0?w=800&q=80',
    rating: 4.6,
    address: 'Hudson Valley, NY',
    website: null,
  },
  {
    id: 'fb-southeast-1',
    category: 'venue',
    title: 'Magnolia Plantation Hall',
    description: 'Spanish moss and Southern charm.',
    emoji: '🏛️',
    gradient: '',
    imageUrl:
      'https://images.unsplash.com/photo-1523438885200-e635ba2c076e?w=800&q=80',
    rating: 4.7,
    address: 'Charleston, SC',
    website: null,
  },
  {
    id: 'fb-southeast-2',
    category: 'venue',
    title: 'Bayfront Conservatory',
    description: 'Open-air pavilion on the water.',
    emoji: '🏛️',
    gradient: '',
    imageUrl:
      'https://images.unsplash.com/photo-1465495976277-438e216bb1e0?w=800&q=80',
    rating: 4.5,
    address: 'Key West, FL',
    website: null,
  },
  {
    id: 'fb-midwest-1',
    category: 'venue',
    title: 'Lakeside Lodge & Terrace',
    description: 'Rustic beams and sunset dock ceremonies.',
    emoji: '🏛️',
    gradient: '',
    imageUrl:
      'https://images.unsplash.com/photo-1606800052052-a08af7148866?w=800&q=80',
    rating: 4.6,
    address: 'Door County, WI',
    website: null,
  },
  {
    id: 'fb-midwest-2',
    category: 'venue',
    title: 'Industrial Loft Events',
    description: 'Exposed brick and skyline windows.',
    emoji: '🏛️',
    gradient: '',
    imageUrl:
      'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=800&q=80',
    rating: 4.4,
    address: 'Chicago, IL',
    website: null,
  },
  {
    id: 'fb-southwest-1',
    category: 'venue',
    title: 'Desert Bloom Resort',
    description: 'Saguaro silhouettes and golden hour vows.',
    emoji: '🏛️',
    gradient: '',
    imageUrl:
      'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800&q=80',
    rating: 4.7,
    address: 'Scottsdale, AZ',
    website: null,
  },
  {
    id: 'fb-southwest-2',
    category: 'venue',
    title: 'Hill Country Vineyard',
    description: 'Rows of vines and string-light courtyards.',
    emoji: '🏛️',
    gradient: '',
    imageUrl:
      'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80',
    rating: 4.8,
    address: 'Fredericksburg, TX',
    website: null,
  },
  {
    id: 'fb-west-1',
    category: 'venue',
    title: 'Redwood Grove Amphitheater',
    description: 'Towering trees and natural cathedral light.',
    emoji: '🏛️',
    gradient: '',
    imageUrl:
      'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&q=80',
    rating: 4.9,
    address: 'Big Sur, CA',
    website: null,
  },
  {
    id: 'fb-west-2',
    category: 'venue',
    title: 'Urban Rooftop Garden',
    description: 'City skyline meets rooftop greenery.',
    emoji: '🏛️',
    gradient: '',
    imageUrl:
      'https://images.unsplash.com/photo-1494522358652-f30e61a603d5?w=800&q=80',
    rating: 4.5,
    address: 'Los Angeles, CA',
    website: null,
  },
  {
    id: 'fb-pacific-1',
    category: 'venue',
    title: 'Cliffside Ocean Estate',
    description: 'Waves below, vows above.',
    emoji: '🏛️',
    gradient: '',
    imageUrl:
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80',
    rating: 4.9,
    address: 'Maui, HI',
    website: null,
  },
  {
    id: 'fb-pacific-2',
    category: 'venue',
    title: 'Tropical Garden Pavilion',
    description: 'Waterfalls and orchid-lined aisles.',
    emoji: '🏛️',
    gradient: '',
    imageUrl:
      'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&q=80',
    rating: 4.8,
    address: 'Kauai, HI',
    website: null,
  },
];

/** Each URL is chosen to match the venue vibe (architecture, region, landscape). */
const californiaFallbackVenues: WeddingOption[] = [
  {
    id: 'fb-ca-sf-1',
    category: 'venue',
    title: 'City Hall Rotunda & Garden',
    description: 'Beaux-arts grandeur with courtyard vows.',
    emoji: '🏛️',
    gradient: '',
    imageUrl:
      'https://images.unsplash.com/photo-1522673606160-8d399438c4bc?w=800&q=80',
    rating: 4.8,
    address: 'San Francisco, CA',
    website: null,
  },
  {
    id: 'fb-ca-sf-2',
    category: 'venue',
    title: 'Fort Mason Chapel & Lawn',
    description: 'Bay views and historic brick charm.',
    emoji: '🏛️',
    gradient: '',
    imageUrl:
      'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=800&q=80',
    rating: 4.7,
    address: 'San Francisco, CA',
    website: null,
  },
  {
    id: 'fb-ca-napa-1',
    category: 'venue',
    title: 'Valley Oak Estate',
    description: 'Vineyard rows and golden-hour toasts.',
    emoji: '🏛️',
    gradient: '',
    imageUrl:
      'https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?w=800&q=80',
    rating: 4.9,
    address: 'Napa, CA',
    website: null,
  },
  {
    id: 'fb-ca-napa-2',
    category: 'venue',
    title: 'Silverado Resort Lawn',
    description: 'Rolling hills and wine-country romance.',
    emoji: '🏛️',
    gradient: '',
    imageUrl:
      'https://images.unsplash.com/photo-1474722883778-792e7990302f?w=800&q=80',
    rating: 4.8,
    address: 'Napa, CA',
    website: null,
  },
  {
    id: 'fb-ca-sonoma',
    category: 'venue',
    title: 'Sonoma Plaza Gardens',
    description: 'Spanish mission charm and garden aisles.',
    emoji: '🏛️',
    gradient: '',
    imageUrl:
      'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&q=80',
    rating: 4.7,
    address: 'Sonoma, CA',
    website: null,
  },
  {
    id: 'fb-ca-bigsur',
    category: 'venue',
    title: 'Redwood Grove Amphitheater',
    description: 'Towering trees and natural cathedral light.',
    emoji: '🏛️',
    gradient: '',
    imageUrl:
      'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&q=80',
    rating: 4.9,
    address: 'Big Sur, CA',
    website: null,
  },
  {
    id: 'fb-ca-la',
    category: 'venue',
    title: 'Urban Rooftop Garden',
    description: 'City skyline meets rooftop greenery.',
    emoji: '🏛️',
    gradient: '',
    imageUrl:
      'https://images.unsplash.com/photo-1494522358652-f30e61a603d5?w=800&q=80',
    rating: 4.5,
    address: 'Los Angeles, CA',
    website: null,
  },
  {
    id: 'fb-ca-sd',
    category: 'venue',
    title: 'La Jolla Cove Terrace',
    description: 'Pacific breezes and sunset ceremonies.',
    emoji: '🏛️',
    gradient: '',
    imageUrl:
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80',
    rating: 4.8,
    address: 'San Diego, CA',
    website: null,
  },
  {
    id: 'fb-ca-sb',
    category: 'venue',
    title: 'Mission Ridge Estate',
    description: 'Spanish tile and ocean glimpses.',
    emoji: '🏛️',
    gradient: '',
    imageUrl:
      'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80',
    rating: 4.8,
    address: 'Santa Barbara, CA',
    website: null,
  },
  {
    id: 'fb-ca-carmel',
    category: 'venue',
    title: 'Carmel Valley Vineyard',
    description: 'Intimate barrel room and garden vows.',
    emoji: '🏛️',
    gradient: '',
    imageUrl:
      'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=800&q=80',
    rating: 4.9,
    address: 'Carmel-by-the-Sea, CA',
    website: null,
  },
  {
    id: 'fb-ca-palmsprings',
    category: 'venue',
    title: 'Desert Modern Estate',
    description: 'Clean lines, palms, and golden light.',
    emoji: '🏛️',
    gradient: '',
    imageUrl:
      'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800&q=80',
    rating: 4.6,
    address: 'Palm Springs, CA',
    website: null,
  },
  {
    id: 'fb-ca-sacramento',
    category: 'venue',
    title: 'Riverfront Loft & Terrace',
    description: 'Industrial chic with river sunset views.',
    emoji: '🏛️',
    gradient: '',
    imageUrl:
      'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=800&q=80',
    rating: 4.5,
    address: 'Sacramento, CA',
    website: null,
  },
];

function normalizeState(state: string): string {
  return state.trim().toLowerCase();
}

function cityHintsSfBay(city: string): boolean {
  const c = city.trim().toLowerCase();
  if (!c) return false;
  return (
    c.includes('san francisco') ||
    c === 'sf' ||
    c.includes('bay area') ||
    c.includes('oakland') ||
    c.includes('berkeley') ||
    c.includes('sausalito') ||
    c.includes('napa') ||
    c.includes('sonoma')
  );
}

/**
 * Sample venues matched to onboarding location when Places API is off or fails.
 * California gets an all-CA list; optional city boosts NorCal / SF-area cards to the top.
 */
export function getFallbackVenuesForLocation(state: string, city?: string | null): WeddingOption[] {
  const st = normalizeState(state);
  if (st === 'california') {
    const list = [...californiaFallbackVenues];
    if (cityHintsSfBay(city ?? '')) {
      list.sort((a, b) => {
        const sf = (addr: string) =>
          /san francisco|napa|sonoma|berkeley|oakland/i.test(addr) ? 0 : 1;
        return sf(a.address ?? '') - sf(b.address ?? '');
      });
    }
    return list;
  }
  return fallbackVenues;
}
