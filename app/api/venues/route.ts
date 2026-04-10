import { NextRequest, NextResponse } from 'next/server';
import { US_STATES } from '@/data/usStates';
import {
  getFallbackVenuesAllStatesRandomized,
  getFallbackVenuesForLocation,
} from '@/data/fallbackVenues';
import type { WeddingOption } from '@/lib/types';
import { VENUE_IMAGE_PLACEHOLDER } from '@/lib/venueImage';
import { buildVenueLocationKey } from '@/lib/venueLocationKey';
import { createServerClient } from '@/lib/supabase';

const CACHE_DAYS = 7;

const ALL_STATES_CACHE_KEY = 'all-states';

function shuffleInPlace<T>(items: T[]): void {
  for (let i = items.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [items[i], items[j]] = [items[j], items[i]];
  }
}

function isGooglePlacesConfigured(): boolean {
  const k = process.env.GOOGLE_PLACES_API_KEY?.trim() ?? '';
  if (!k) return false;
  if (/^placeholder$/i.test(k)) return false;
  if (k.length < 20) return false;
  return true;
}

function photoUrl(photoReference: string, apiKey: string): string {
  return `https://maps.googleapis.com/maps/api/place/photo?maxwidth=800&photo_reference=${encodeURIComponent(photoReference)}&key=${encodeURIComponent(apiKey)}`;
}

async function fetchPlaceDetails(placeId: string, apiKey: string) {
  const url = new URL('https://maps.googleapis.com/maps/api/place/details/json');
  url.searchParams.set('place_id', placeId);
  url.searchParams.set(
    'fields',
    'name,editorial_summary,formatted_address,rating,photos,website,address_components'
  );
  url.searchParams.set('key', apiKey);
  const res = await fetch(url.toString());
  if (!res.ok) return null;
  const data = await res.json();
  if (data.status !== 'OK' || !data.result) return null;
  return data.result as {
    name?: string;
    editorial_summary?: { overview?: string };
    formatted_address?: string;
    rating?: number;
    photos?: { photo_reference: string }[];
    website?: string;
  };
}

function venueDescriptionFromPlace(
  d:
    | {
        editorial_summary?: { overview?: string };
      }
    | null
    | undefined
): string | null {
  const overview = d?.editorial_summary?.overview?.trim();
  if (overview) return overview;
  return null;
}

async function textSearchVenues(
  query: string,
  apiKey: string
): Promise<{ place_id: string }[]> {
  const url = new URL('https://maps.googleapis.com/maps/api/place/textsearch/json');
  url.searchParams.set('query', query);
  url.searchParams.set('key', apiKey);
  const res = await fetch(url.toString());
  if (!res.ok) return [];
  const data = await res.json();
  if (data.status !== 'OK' || !Array.isArray(data.results)) return [];
  return data.results.slice(0, 12);
}

export async function GET(req: NextRequest) {
  const allStates = req.nextUrl.searchParams.get('allStates') === '1';
  const state = req.nextUrl.searchParams.get('state')?.trim() ?? '';
  const city = req.nextUrl.searchParams.get('city')?.trim() || null;
  const apiKey = process.env.GOOGLE_PLACES_API_KEY?.trim() ?? '';
  const sampleVenues = () =>
    allStates ? getFallbackVenuesAllStatesRandomized() : getFallbackVenuesForLocation(state, city);

  if (!allStates && !state) {
    return NextResponse.json({ error: 'state is required' }, { status: 400 });
  }

  const locationKey = allStates ? ALL_STATES_CACHE_KEY : buildVenueLocationKey(state, city);
  const supabase = createServerClient();

  const { data: cached } = await supabase
    .from('venue_cache')
    .select('results, cached_at')
    .eq('location_key', locationKey)
    .maybeSingle();

  if (cached?.cached_at) {
    const cachedAt = new Date(cached.cached_at);
    const ageMs = Date.now() - cachedAt.getTime();
    const rows = Array.isArray(cached.results) ? (cached.results as WeddingOption[]) : [];
    if (
      ageMs < CACHE_DAYS * 24 * 60 * 60 * 1000 &&
      rows.length > 0
    ) {
      return NextResponse.json({
        venues: rows,
        cached: true,
        fallback: false,
      });
    }
  }

  if (!isGooglePlacesConfigured()) {
    return NextResponse.json({
      venues: sampleVenues(),
      cached: false,
      fallback: true,
      message:
        'Showing sample venues for your area — add a real GOOGLE_PLACES_API_KEY for live Google results.',
    });
  }

  if (allStates) {
    try {
      const labels = US_STATES.map((s) => s.label);
      shuffleInPlace(labels);
      const pickStates = labels.slice(0, 4);
      const batches = await Promise.all(
        pickStates.map((label) => textSearchVenues(`wedding venues in ${label}`, apiKey))
      );
      const seen = new Set<string>();
      const merged: { place_id: string }[] = [];
      for (const batch of batches) {
        for (const p of batch) {
          if (!seen.has(p.place_id)) {
            seen.add(p.place_id);
            merged.push(p);
          }
        }
      }
      shuffleInPlace(merged);
      const places = merged.slice(0, 12);

      const detailsList = await Promise.all(
        places.map((p) => fetchPlaceDetails(p.place_id, apiKey))
      );

      const venues: WeddingOption[] = places.map((p, i) => {
        const d = detailsList[i];
        const name = d?.name ?? 'Venue';
        const desc = venueDescriptionFromPlace(d);
        const photoRefs = (d?.photos ?? []).slice(0, 5).map((ph) => ph.photo_reference);
        const imageUrls =
          photoRefs.length > 0
            ? photoRefs.map((ref) => photoUrl(ref, apiKey))
            : [VENUE_IMAGE_PLACEHOLDER];
        const imageUrl = imageUrls[0] ?? VENUE_IMAGE_PLACEHOLDER;

        return {
          id: p.place_id,
          category: 'venue',
          title: name,
          description: desc,
          emoji: '🏛️',
          gradient: '',
          imageUrl,
          imageUrls,
          rating: d?.rating,
          address: d?.formatted_address,
          website: d?.website ?? null,
        };
      });

      if (venues.length === 0) {
        return NextResponse.json({
          venues: [],
          cached: false,
          fallback: false,
        });
      }

      await supabase.from('venue_cache').upsert(
        {
          location_key: locationKey,
          results: venues,
          cached_at: new Date().toISOString(),
        },
        { onConflict: 'location_key' }
      );

      return NextResponse.json({ venues, cached: false, fallback: false });
    } catch {
      return NextResponse.json({
        venues: sampleVenues(),
        cached: false,
        fallback: true,
        message:
          'Showing sample venues for your area — Places request failed; check API key and billing.',
      });
    }
  }

  const query = city
    ? `wedding venues in ${city} ${state}`
    : `wedding venues in ${state}`;

  try {
    const places = await textSearchVenues(query, apiKey);
    const detailsList = await Promise.all(
      places.map((p) => fetchPlaceDetails(p.place_id, apiKey))
    );

    const venues: WeddingOption[] = places.map((p, i) => {
      const d = detailsList[i];
      const name = d?.name ?? 'Venue';
      const desc = venueDescriptionFromPlace(d);
      const photoRefs = (d?.photos ?? []).slice(0, 5).map((ph) => ph.photo_reference);
      const imageUrls =
        photoRefs.length > 0
          ? photoRefs.map((ref) => photoUrl(ref, apiKey))
          : [VENUE_IMAGE_PLACEHOLDER];
      const imageUrl = imageUrls[0] ?? VENUE_IMAGE_PLACEHOLDER;

      return {
        id: p.place_id,
        category: 'venue',
        title: name,
        description: desc,
        emoji: '🏛️',
        gradient: '',
        imageUrl,
        imageUrls,
        rating: d?.rating,
        address: d?.formatted_address,
        website: d?.website ?? null,
      };
    });

    if (venues.length === 0) {
      return NextResponse.json({
        venues: [],
        cached: false,
        fallback: false,
      });
    }

    await supabase.from('venue_cache').upsert(
      {
        location_key: locationKey,
        results: venues,
        cached_at: new Date().toISOString(),
      },
      { onConflict: 'location_key' }
    );

    return NextResponse.json({ venues, cached: false, fallback: false });
  } catch {
    return NextResponse.json({
      venues: sampleVenues(),
      cached: false,
      fallback: true,
      message:
        'Showing sample venues for your area — Places request failed; check API key and billing.',
    });
  }
}
