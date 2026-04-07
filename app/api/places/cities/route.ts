import { NextRequest, NextResponse } from 'next/server';

type GooglePrediction = {
  place_id?: string;
  description?: string;
  structured_formatting?: { main_text?: string };
};

export async function GET(req: NextRequest) {
  const input = req.nextUrl.searchParams.get('input')?.trim() ?? '';
  const state = req.nextUrl.searchParams.get('state')?.trim() ?? '';
  if (!input) {
    return NextResponse.json({ predictions: [] });
  }

  const apiKey = process.env.GOOGLE_PLACES_API_KEY?.trim() ?? '';
  if (!apiKey) {
    return NextResponse.json({ predictions: [] });
  }

  const url = new URL('https://maps.googleapis.com/maps/api/place/autocomplete/json');
  url.searchParams.set('input', state ? `${input}, ${state}` : input);
  url.searchParams.set('types', '(cities)');
  url.searchParams.set('language', 'en');
  url.searchParams.set('key', apiKey);

  try {
    const res = await fetch(url.toString());
    if (!res.ok) return NextResponse.json({ predictions: [] });
    const data = (await res.json()) as {
      predictions?: GooglePrediction[];
    };
    const rawDescriptions = (data.predictions ?? []).map((p) => p.description ?? '');
    console.log('[places/cities] google predictions', {
      state,
      predictions: rawDescriptions,
    });

    const predictions = (data.predictions ?? [])
      .slice(0, 5)
      .map((p) => ({
        placeId: p.place_id ?? '',
        description: p.structured_formatting?.main_text ?? p.description ?? '',
        city: p.structured_formatting?.main_text ?? '',
      }))
      .filter((p) => p.placeId && p.description);

    return NextResponse.json({ predictions });
  } catch {
    return NextResponse.json({ predictions: [] });
  }
}
