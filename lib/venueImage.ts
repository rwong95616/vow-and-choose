/** Placeholder when venue photos fail or are missing (Figma / dev). */
export const VENUE_IMAGE_PLACEHOLDER =
  'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=800';

export function resolveVenueImageUrl(url?: string | null): string {
  const u = url?.trim();
  if (u) return u;
  return VENUE_IMAGE_PLACEHOLDER;
}
