'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

type Props = {
  children: React.ReactNode;
  variant?: 'default' | 'swipe';
};

/** Reserve space for floating pill nav + margin + safe area (swipe screen). */
const SWIPE_MAIN_BOTTOM_PAD =
  'pb-[calc(5rem+env(safe-area-inset-bottom,0px))]';

function IconHeartNav({ filled }: { filled: boolean }) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" className="shrink-0" aria-hidden>
      {filled ? (
        <path
          fill="currentColor"
          d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.533 5.533 0 0112 5.292 5.533 5.533 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.18 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z"
        />
      ) : (
        <path
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
        />
      )}
    </svg>
  );
}

function IconSparklesNav() {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      className="shrink-0"
      aria-hidden
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z"
      />
    </svg>
  );
}

function IconCogNav() {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      className="shrink-0"
      aria-hidden
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.723 6.723 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.37.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z"
      />
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  );
}

export function AppShell({ children, variant = 'default' }: Props) {
  const pathname = usePathname();
  const swipeOn = pathname === '/' || pathname === '';
  const picksOn = pathname === '/picks' || pathname === '/our-picks';
  const settingsOn = pathname === '/settings';

  const isSwipe = variant === 'swipe';
  const shellBg = isSwipe ? 'bg-swipe-canvas' : 'bg-page';

  /** Picks pages set their own top spacing (e.g. pt-[60px]); avoid stacking the default 0.75rem main padding. */
  const mainPaddingTop = isSwipe
    ? `pt-[env(safe-area-inset-top,0px)]`
    : picksOn
      ? 'pt-[env(safe-area-inset-top,0px)]'
      : 'pt-[max(0.75rem,env(safe-area-inset-top,0px))]';

  /** Floating nav overlays content; picks pages use Figma padding on the inner wrapper — no extra main bottom inset for nav. */
  const mainPaddingBottom = isSwipe
    ? SWIPE_MAIN_BOTTOM_PAD
    : picksOn
      ? 'pb-[env(safe-area-inset-bottom,0px)]'
      : 'pb-[calc(5rem+env(safe-area-inset-bottom,0px))]';

  const rose = 'text-[#7D3535]';
  const grey = 'text-[#6B5F58]';

  const pillTabClass = (active: boolean) =>
    `flex min-w-0 flex-1 flex-col items-center gap-1 px-1 py-1 text-[11px] font-semibold tracking-wide transition-colors ${
      active ? rose : grey
    }`;

  const mainHorizontal = settingsOn ? 'px-0' : 'px-4';

  return (
    <div
      className={`mx-auto flex max-w-[480px] min-h-0 flex-col overflow-hidden ${shellBg} ${
        isSwipe ? 'h-screen max-h-[100dvh] min-h-0' : 'min-h-[100dvh]'
      }`}
    >
      <main
        className={
          isSwipe
            ? `flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden px-4 ${mainPaddingTop} ${mainPaddingBottom}`
            : `flex-1 ${mainHorizontal} ${mainPaddingBottom} ${mainPaddingTop}`
        }
      >
        {children}
      </main>

      <div className="pointer-events-none fixed bottom-0 left-0 right-0 z-40 flex justify-center pb-[env(safe-area-inset-bottom,0px)]">
        <nav
          className="pointer-events-auto flex max-w-[480px] shrink-0 items-center justify-between gap-1 rounded-[100px] bg-white px-3 py-2.5 shadow-[0_4px_16px_rgba(44,36,32,0.12)]"
          style={{
            width: 'calc(100% - 32px)',
            margin: '0 16px 16px 16px',
          }}
          aria-label="Main navigation"
        >
          <Link href="/" className={pillTabClass(swipeOn)}>
            <IconHeartNav filled={swipeOn} />
            <span>Swipe</span>
            {swipeOn ? (
              <span className="h-0.5 w-8 shrink-0 rounded-full bg-[#7D3535]" aria-hidden />
            ) : (
              <span className="h-0.5 w-8 shrink-0" aria-hidden />
            )}
          </Link>
          <Link href="/picks" className={pillTabClass(picksOn)}>
            <IconSparklesNav />
            <span>Our Picks</span>
            {picksOn ? (
              <span className="h-0.5 w-8 shrink-0 rounded-full bg-[#7D3535]" aria-hidden />
            ) : (
              <span className="h-0.5 w-8 shrink-0" aria-hidden />
            )}
          </Link>
          <Link href="/settings" className={pillTabClass(settingsOn)}>
            <IconCogNav />
            <span>Settings</span>
            {settingsOn ? (
              <span className="h-0.5 w-8 shrink-0 rounded-full bg-[#7D3535]" aria-hidden />
            ) : (
              <span className="h-0.5 w-8 shrink-0" aria-hidden />
            )}
          </Link>
        </nav>
      </div>
    </div>
  );
}
