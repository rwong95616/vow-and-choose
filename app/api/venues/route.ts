import { NextRequest, NextResponse } from 'next/server';
import { getFallbackVenuesForLocation } from '@/data/fallbackVenues';
import type { WeddingOption } from '@/lib/types';
import { VENUE_IMAGE_PLACEHOLDER } from '@/lib/venueImage';
import { createServerClient } from '@/lib/supabase';

const CACHE_DAYS = 7;

function isGooglePlacesConfigured(): boolean {
  const k = process.env.GOOGLE_PLACES_API_KEY?.trim() ?? '';
  if (!k) return false;
  if (/^placeholder$/i.test(k)) return false;
  if (k.length < 20) return false;
  return true;
}

function buildLocationKey(state: string, city?: string | null): string {
  const s = state.trim().toLowerCase().replace(/\s+/g, '-');
  if (city?.trim()) {
    return `${s}-${city.trim().toLowerCase().replace(/\s+/g, '-')}`;
  }
  return s;
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
  const state = req.nextUrl.searchParams.get('state')?.trim() ?? '';
  const city = req.nextUrl.searchParams.get('city')?.trim() || null;
  const apiKey = process.env.GOOGLE_PLACES_API_KEY?.trim() ?? '';
  const sampleVenues = () => getFallbackVenuesForLocation(state, city);

  if (!state) {
    return NextResponse.json({ error: 'state is required' }, { status: 400 });
  }

  const locationKey = buildLocationKey(state, city);
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

  const query = city
    ? `wedding venues in ${city} ${state}`
    : `wedding venues in ${state}`;

  try {
    const places = await textSearchVenues(query, apiKey);
    const detailsList = await Promise.all(
      places.map((p) => fetchPlaceDetails(p.place_id, apiKey))
    );

    const venues: WeddingOption[] = [];
    for (let i = 0; i < places.length; i++) {
      const placeId = places[i]!.place_id;
      const d = detailsList[i];
      const name = d?.name ?? 'Venue';
      const desc =
        d?.editorial_summary?.overview ?? d?.formatted_address ?? 'Wedding venue';
      const photoRef = d?.photos?.[0]?.photo_reference;
      const imageUrl = photoRef ? photoUrl(photoRef, apiKey) : VENUE_IMAGE_PLACEHOLDER;

      venues.push({
        id: placeId,
        category: 'venue',
        title: name,
        description: desc,
        emoji: '🏛️',
        gradient: '',
        imageUrl,
        rating: d?.rating,
        address: d?.formatted_address,
        website: d?.website ?? null,
      });
    }

    if (venues.length === 0) {
      return NextResponse.json({
        venues: sampleVenues(),
        cached: false,
        fallback: true,
        message:
          'Showing sample venues for your area — check your Google Places API key or billing.',
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
