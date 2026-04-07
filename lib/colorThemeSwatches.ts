/** Two palette dots per color-theme option (matches PickCard / SwipeCard swatch styling). */
export const COLOR_THEME_SWATCHES: Record<string, readonly [string, string]> = {
  'ct-1': ['#C4A4A8', '#C5A572'],
  'ct-2': ['#8FA882', '#F5F0E8'],
  'ct-3': ['#1E3A5F', '#A8A9AD'],
  'ct-4': ['#B8A9C9', '#FAF8F3'],
  'ct-5': ['#C47244', '#8B4513'],
  'ct-6': ['#046A38', '#F5F5F5'],
  'ct-7': ['#E8B4B8', '#E8D4B8'],
  'ct-8': ['#1A1A1A', '#F5F5F5'],
  'ct-9': ['#FFCBA4', '#E87A6B'],
  'ct-10': ['#722F37', '#D4AF37'],
  'ct-11': ['#98D8C8', '#D4AF37'],
  'ct-12': ['#7B9EAE', '#F5F5F5'],
};

export function getColorThemeSwatches(itemId: string): string[] | undefined {
  const pair = COLOR_THEME_SWATCHES[itemId];
  return pair ? [...pair] : undefined;
}
