import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        /** Design system — core */
        /** Cream canvas — matches couple-code / onboarding ref */
        page: '#F9F7F2',
        /** Swipe deck screen background (warm cream — Figma) */
        'swipe-canvas': '#FAF7F2',
        /** Role picker screen (Who's swiping?) */
        'role-canvas': '#FDFBF7',
        /** Location step canvas */
        'location-canvas': '#FAF9F6',
        /** Bride card — selected */
        'role-bride-selected-bg': '#F9EEEE',
        'role-bride-selected-border': '#E8A0A0',
        /** Groom card — selected */
        'role-groom-selected-bg': '#F0F5F0',
        'role-groom-selected-border': '#96B09E',
        /** Couple code card border + share CTA (design ref) */
        'code-border': '#C5A059',
        /** Share link CTA — onboarding ref */
        'share-cta': '#7C524D',
        primary: '#884E50',
        ink: '#2C2420',
        muted: '#6B5F5B',
        bride: '#E6A0A0',
        groom: '#8FAF8F',
        gold: '#C4A86B',
        mutual: '#FBF6E8',
        /** Connect / onboarding (extends DS where needed) */
        landing: {
          ink: '#2C2420',
          tagline: '#6B5F5B',
          body: '#6B5F5B',
          icon: '#B79B6E',
          btn: '#D6CEC6',
          'btn-text': '#5C5854',
          'btn-disabled': '#D7D2CC',
          'btn-disabled-text': '#827B75',
          /** Alias: primary CTA — use bg-primary in components */
          'join-cta': '#884E50',
          ring: '#D4D0CA',
          'input-border': '#D9D4CF',
          placeholder: '#B5B0AA',
        },
      },
      fontFamily: {
        display: ['var(--font-playfair)', 'serif'],
        sans: ['var(--font-dm-sans)', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        /** DS: Playfair — Heading Large / Medium / Small */
        'heading-lg': ['32px', { lineHeight: '1.25' }],
        'heading-md': ['28px', { lineHeight: '1.25' }],
        'heading-sm': ['18px', { lineHeight: '1.3' }],
        /** DS: DM Sans */
        'body-lg': ['16px', { lineHeight: '1.5' }],
        'body-md': ['15px', { lineHeight: '1.5' }],
        'body-sm': ['13px', { lineHeight: '1.45' }],
        label: ['11px', { lineHeight: '1.3', letterSpacing: '0.06em' }],
      },
      borderRadius: {
        /** DS: 12px images, 20px cards */
        'ds-image': '12px',
        'ds-card': '20px',
      },
      boxShadow: {
        /** DS: rgba from primary text #2C2420 */
        'ds-soft': '0 2px 8px rgba(44, 36, 32, 0.06)',
        'ds-medium': '0 4px 16px rgba(44, 36, 32, 0.12)',
        /** Venue card on swipe — soft lift on cream */
        'swipe-card':
          '0 16px 48px rgba(44, 36, 32, 0.06), 0 6px 16px rgba(44, 36, 32, 0.04)',
      },
    },
  },
  plugins: [],
};
export default config;
