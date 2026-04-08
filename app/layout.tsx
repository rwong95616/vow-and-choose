import type { Metadata } from 'next';
import { DM_Sans, Playfair_Display } from 'next/font/google';
import './globals.css';

const dmSans = DM_Sans({
  subsets: ['latin'],
  weight: ['400', '600'],
  variable: '--font-dm-sans',
});

const playfairDisplay = Playfair_Display({
  subsets: ['latin'],
  weight: ['600'],
  variable: '--font-playfair',
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ??
      (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000')
  ),
  title: 'Vow & Choose',
  description:
    'Swipe, match, and build your dream wedding as a couple with Vow & Choose.',
  openGraph: {
    title: 'Vow and Choose',
    description:
      'Swipe, match, and build your dream wedding as a couple with Vow & Choose.',
    images: [
      {
        url: '/images/blush-champagne-color-theme.jpg',
        width: 1200,
        height: 800,
        alt: 'Blush & Champagne wedding color theme',
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${dmSans.variable} ${playfairDisplay.variable}`}>
      <body className="font-sans min-h-screen bg-[#FAF7F2]">{children}</body>
    </html>
  );
}
