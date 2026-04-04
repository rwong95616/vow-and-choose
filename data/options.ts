import type { WeddingOption } from '@/lib/types';

export const CATEGORY_ORDER = [
  'venue',
  'color-theme',
  'florals-decor',
  'entertainment',
  'wedding-games',
  'honeymoon',
] as const;

export type CategoryId = (typeof CATEGORY_ORDER)[number];

export const CATEGORY_LABELS: Record<CategoryId, { emoji: string; label: string }> = {
  venue: { emoji: '🏛️', label: 'Venue' },
  'color-theme': { emoji: '🎨', label: 'Color Theme' },
  'florals-decor': { emoji: '🌸', label: 'Florals & Decor' },
  entertainment: { emoji: '🎉', label: 'Entertainment' },
  'wedding-games': { emoji: '🎲', label: 'Wedding Games' },
  honeymoon: { emoji: '🌍', label: 'Honeymoon' },
};

export const colorThemeOptions: WeddingOption[] = [
  { id: 'ct-1', category: 'color-theme', title: 'Blush & Sage', description: 'Soft romance with natural calm.', emoji: '🎨', gradient: 'linear-gradient(135deg, #f8e1e4 0%, #c8dcc8 100%)' },
  { id: 'ct-2', category: 'color-theme', title: 'Navy & Gold', description: 'Classic evening sophistication.', emoji: '🎨', gradient: 'linear-gradient(135deg, #1a2744 0%, #c4a96b 100%)' },
  { id: 'ct-3', category: 'color-theme', title: 'Ivory & Greenery', description: 'Timeless garden palette.', emoji: '🎨', gradient: 'linear-gradient(135deg, #faf6f0 0%, #6b8f6b 100%)' },
  { id: 'ct-4', category: 'color-theme', title: 'Terracotta & Cream', description: 'Warm desert sunset vibes.', emoji: '🎨', gradient: 'linear-gradient(135deg, #c67b5c 0%, #f5ebe0 100%)' },
  { id: 'ct-5', category: 'color-theme', title: 'Black Tie Monochrome', description: 'Dramatic contrast and polish.', emoji: '🎨', gradient: 'linear-gradient(135deg, #2c2c2c 0%, #e8e8e8 100%)' },
  { id: 'ct-6', category: 'color-theme', title: 'Lavender & Silver', description: 'Dreamy and softly glamorous.', emoji: '🎨', gradient: 'linear-gradient(135deg, #d4c4e8 0%, #c0c0c0 100%)' },
  { id: 'ct-7', category: 'color-theme', title: 'Champagne & Rose', description: 'Effervescent and romantic.', emoji: '🎨', gradient: 'linear-gradient(135deg, #f3e8d8 0%, #e8a0a0 100%)' },
  { id: 'ct-8', category: 'color-theme', title: 'Emerald & Ivory', description: 'Jewel-tone elegance.', emoji: '🎨', gradient: 'linear-gradient(135deg, #0d4d3d 0%, #fffaf0 100%)' },
  { id: 'ct-9', category: 'color-theme', title: 'Coral & Mint', description: 'Fresh, playful summer energy.', emoji: '🎨', gradient: 'linear-gradient(135deg, #ff8a80 0%, #a8e6cf 100%)' },
  { id: 'ct-10', category: 'color-theme', title: 'Dusty Blue & Mauve', description: 'Muted watercolor romance.', emoji: '🎨', gradient: 'linear-gradient(135deg, #9eb8d9 0%, #c4a8b8 100%)' },
  { id: 'ct-11', category: 'color-theme', title: 'Rust & Forest', description: 'Earthy autumn celebration.', emoji: '🎨', gradient: 'linear-gradient(135deg, #a0522d 0%, #2d4a3e 100%)' },
  { id: 'ct-12', category: 'color-theme', title: 'Sunset Ombre', description: 'Peach melting into lilac skies.', emoji: '🎨', gradient: 'linear-gradient(135deg, #ffb347 0%, #b19cd9 100%)' },
];

export const floralsDecorOptions: WeddingOption[] = [
  { id: 'fd-1', category: 'florals-decor', title: 'Garden Rose Cascade', description: 'Overflowing blooms down the aisle.', emoji: '🌸', gradient: 'linear-gradient(135deg, #fce4ec 0%, #f8bbd0 100%)' },
  { id: 'fd-2', category: 'florals-decor', title: 'Minimal Orchid Lines', description: 'Sculptural and modern.', emoji: '🌸', gradient: 'linear-gradient(135deg, #e8f5e9 0%, #c8e6c9 100%)' },
  { id: 'fd-3', category: 'florals-decor', title: 'Wildflower Meadow', description: 'Loose, colorful, and free.', emoji: '🌸', gradient: 'linear-gradient(135deg, #fff9c4 0%, #c5e1a5 100%)' },
  { id: 'fd-4', category: 'florals-decor', title: 'Hanging Greenery Install', description: 'Living chandeliers above guests.', emoji: '🌸', gradient: 'linear-gradient(135deg, #dcedc8 0%, #a5d6a7 100%)' },
  { id: 'fd-5', category: 'florals-decor', title: 'Pampas & Dried Florals', description: 'Boho texture and movement.', emoji: '🌸', gradient: 'linear-gradient(135deg, #efebe9 0%, #d7ccc8 100%)' },
  { id: 'fd-6', category: 'florals-decor', title: 'Monochrome White Cloud', description: 'All-white lush abundance.', emoji: '🌸', gradient: 'linear-gradient(135deg, #ffffff 0%, #eceff1 100%)' },
  { id: 'fd-7', category: 'florals-decor', title: 'Tropical Statement', description: 'Monstera, anthurium, bold leaves.', emoji: '🌸', gradient: 'linear-gradient(135deg, #b2dfdb 0%, #4db6ac 100%)' },
  { id: 'fd-8', category: 'florals-decor', title: 'Candlelit Aisle', description: 'Hundreds of taper candles.', emoji: '🌸', gradient: 'linear-gradient(135deg, #3e2723 0%, #ffcc80 100%)' },
  { id: 'fd-9', category: 'florals-decor', title: 'Fruit & Citrus Accents', description: 'Unexpected color and scent.', emoji: '🌸', gradient: 'linear-gradient(135deg, #fff59d 0%, #ffcc80 100%)' },
  { id: 'fd-10', category: 'florals-decor', title: 'Cherry Blossom Arch', description: 'Soft pink spring canopy.', emoji: '🌸', gradient: 'linear-gradient(135deg, #fce4ec 0%, #f48fb1 100%)' },
  { id: 'fd-11', category: 'florals-decor', title: 'Terracotta Vessel Centerpieces', description: 'Earthy pottery and stems.', emoji: '🌸', gradient: 'linear-gradient(135deg, #d7ccc8 0%, #bcaaa4 100%)' },
  { id: 'fd-12', category: 'florals-decor', title: 'Floating Florals', description: 'Bowls and pools of petals.', emoji: '🌸', gradient: 'linear-gradient(135deg, #e1f5fe 0%, #b3e5fc 100%)' },
];

export const entertainmentOptions: WeddingOption[] = [
  { id: 'ent-1', category: 'entertainment', title: 'Live Jazz Trio', description: 'Cocktail hour sophistication.', emoji: '🎉', gradient: 'linear-gradient(135deg, #1a237e 0%, #5c6bc0 100%)' },
  { id: 'ent-2', category: 'entertainment', title: 'DJ + Sax Player', description: 'Club energy with live flair.', emoji: '🎉', gradient: 'linear-gradient(135deg, #4a148c 0%, #ab47bc 100%)' },
  { id: 'ent-3', category: 'entertainment', title: 'String Quartet', description: 'Ceremony through dinner elegance.', emoji: '🎉', gradient: 'linear-gradient(135deg, #263238 0%, #78909c 100%)' },
  { id: 'ent-4', category: 'entertainment', title: 'Soul & Motown Band', description: 'Packed dance floor guaranteed.', emoji: '🎉', gradient: 'linear-gradient(135deg, #bf360c 0%, #ff8a65 100%)' },
  { id: 'ent-5', category: 'entertainment', title: 'Acoustic Singer-Songwriter', description: 'Intimate first dance moments.', emoji: '🎉', gradient: 'linear-gradient(135deg, #33691e 0%, #aed581 100%)' },
  { id: 'ent-6', category: 'entertainment', title: 'Mariachi Surprise Entrance', description: 'Joyful and unforgettable.', emoji: '🎉', gradient: 'linear-gradient(135deg, #b71c1c 0%, #ff8a80 100%)' },
  { id: 'ent-7', category: 'entertainment', title: 'Silent Disco After Party', description: 'Three channels, one dance floor.', emoji: '🎉', gradient: 'linear-gradient(135deg, #006064 0%, #4dd0e1 100%)' },
  { id: 'ent-8', category: 'entertainment', title: 'Drag Performance Toast', description: 'Big energy and big laughs.', emoji: '🎉', gradient: 'linear-gradient(135deg, #880e4f 0%, #f48fb1 100%)' },
  { id: 'ent-9', category: 'entertainment', title: 'Fire Dancers (Outdoor)', description: 'Golden hour spectacle.', emoji: '🎉', gradient: 'linear-gradient(135deg, #e65100 0%, #ffcc80 100%)' },
  { id: 'ent-10', category: 'entertainment', title: 'Karaoke Finale Hour', description: 'Guests become the stars.', emoji: '🎉', gradient: 'linear-gradient(135deg, #4527a0 0%, #b39ddb 100%)' },
];

export const weddingGamesOptions: WeddingOption[] = [
  { id: 'wg-1', category: 'wedding-games', title: 'Shoe Game', description: 'Classic “who’s more likely” laughs.', emoji: '🎲', gradient: 'linear-gradient(135deg, #5d4037 0%, #bcaaa4 100%)' },
  { id: 'wg-2', category: 'wedding-games', title: 'Wedding Bingo', description: 'Guests mark off speech clichés.', emoji: '🎲', gradient: 'linear-gradient(135deg, #37474f 0%, #90a4ae 100%)' },
  { id: 'wg-3', category: 'wedding-games', title: 'Mad Libs Vows', description: 'Hilarious fill-in-the-blank promises.', emoji: '🎲', gradient: 'linear-gradient(135deg, #ad1457 0%, #f8bbd0 100%)' },
  { id: 'wg-4', category: 'wedding-games', title: 'Trivia About the Couple', description: 'Tables compete for prizes.', emoji: '🎲', gradient: 'linear-gradient(135deg, #1565c0 0%, #90caf9 100%)' },
  { id: 'wg-5', category: 'wedding-games', title: 'Photo Scavenger Hunt', description: 'Disposable cameras or phone list.', emoji: '🎲', gradient: 'linear-gradient(135deg, #2e7d32 0%, #a5d6a7 100%)' },
  { id: 'wg-6', category: 'wedding-games', title: 'Musical Chairs (Grown-Up)', description: 'Chaotic joy with a twist.', emoji: '🎲', gradient: 'linear-gradient(135deg, #ef6c00 0%, #ffcc80 100%)' },
  { id: 'wg-7', category: 'wedding-games', title: 'Guess the Baby Photo', description: 'Guests match childhood pics.', emoji: '🎲', gradient: 'linear-gradient(135deg, #6a1b9a 0%, #ce93d8 100%)' },
  { id: 'wg-8', category: 'wedding-games', title: 'Lawn Games Hour', description: 'Cornhole, croquet, giant Jenga.', emoji: '🎲', gradient: 'linear-gradient(135deg, #558b2f 0%, #dce775 100%)' },
];

export const honeymoonOptions: WeddingOption[] = [
  { id: 'hm-1', category: 'honeymoon', title: 'Amalfi Coast Road Trip', description: 'Cliffside towns and limoncello.', emoji: '🌍', gradient: 'linear-gradient(135deg, #ffecb3 0%, #4fc3f7 100%)' },
  { id: 'hm-2', category: 'honeymoon', title: 'Safari + Beach Combo', description: 'Wildlife mornings, ocean afternoons.', emoji: '🌍', gradient: 'linear-gradient(135deg, #8d6e63 0%, #4dd0e1 100%)' },
  { id: 'hm-3', category: 'honeymoon', title: 'Kyoto Temples & Onsen', description: 'Tranquil culture and hot springs.', emoji: '🌍', gradient: 'linear-gradient(135deg, #c62828 0%, #ffccbc 100%)' },
  { id: 'hm-4', category: 'honeymoon', title: 'Iceland Northern Lights', description: 'Waterfalls and midnight skies.', emoji: '🌍', gradient: 'linear-gradient(135deg, #1a237e 0%, #80deea 100%)' },
  { id: 'hm-5', category: 'honeymoon', title: 'Maldives Overwater Villa', description: 'Turquoise stillness.', emoji: '🌍', gradient: 'linear-gradient(135deg, #006064 0%, #b2ebf2 100%)' },
  { id: 'hm-6', category: 'honeymoon', title: 'Paris + Loire Châteaux', description: 'City sparkle and wine country.', emoji: '🌍', gradient: 'linear-gradient(135deg, #5d4037 0%, #ffe082 100%)' },
  { id: 'hm-7', category: 'honeymoon', title: 'Costa Rica Adventure', description: 'Zip lines, surf, and sloths.', emoji: '🌍', gradient: 'linear-gradient(135deg, #2e7d32 0%, #fff59d 100%)' },
  { id: 'hm-8', category: 'honeymoon', title: 'Santorini Sunset Week', description: 'White villages and caldera views.', emoji: '🌍', gradient: 'linear-gradient(135deg, #eceff1 0%, #5c6bc0 100%)' },
  { id: 'hm-9', category: 'honeymoon', title: 'New Zealand South Island', description: 'Fjords, hikes, and vineyards.', emoji: '🌍', gradient: 'linear-gradient(135deg, #37474f 0%, #81c784 100%)' },
  { id: 'hm-10', category: 'honeymoon', title: 'Bali Villas & Rice Terraces', description: 'Spa days and jungle swings.', emoji: '🌍', gradient: 'linear-gradient(135deg, #33691e 0%, #aed581 100%)' },
  { id: 'hm-11', category: 'honeymoon', title: 'Scottish Highlands + Castles', description: 'Misty romance and whisky.', emoji: '🌍', gradient: 'linear-gradient(135deg, #455a64 0%, #cfd8dc 100%)' },
  { id: 'hm-12', category: 'honeymoon', title: 'Mexico City + Oaxaca', description: 'Markets, mezcal, and color.', emoji: '🌍', gradient: 'linear-gradient(135deg, #e65100 0%, #ffab91 100%)' },
];

export const staticOptionsByCategory: Record<Exclude<CategoryId, 'venue'>, WeddingOption[]> = {
  'color-theme': colorThemeOptions,
  'florals-decor': floralsDecorOptions,
  entertainment: entertainmentOptions,
  'wedding-games': weddingGamesOptions,
  honeymoon: honeymoonOptions,
};
